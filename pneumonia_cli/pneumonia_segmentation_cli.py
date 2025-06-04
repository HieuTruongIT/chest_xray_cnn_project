import streamlit as st
import numpy as np
import cv2
from tensorflow.keras.models import load_model
import tensorflow as tf
from PIL import Image
import io

# Custom metric
def dice_coef(y_true, y_pred, smooth=1):
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) + smooth)

# Load model
@st.cache_resource
def load_segmentation_model():
    model = load_model("model/pneumonia_segmentation/lung_segmentation_model.h5",
                       custom_objects={'dice_coef': dice_coef},
                       compile=False)  # ✅ Fix lỗi optimizer
    return model

# ✅ Load model trước khi xử lý ảnh
model = load_segmentation_model()

# Tiền xử lý ảnh
def preprocess_image(image, target_size=(512, 512)):
    image = np.array(image)  # PIL Image to numpy array (H, W, 3)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)  # Convert RGB to Grayscale (H, W)
    image = cv2.resize(image, target_size)  # Resize
    image = image / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=-1)  # Add channel dim => (H, W, 1)
    image = np.expand_dims(image, axis=0)   # Add batch dim => (1, H, W, 1)
    return image


# UI
st.title("🫁 Lung Segmentation from Chest X-ray")
st.write("Upload a chest X-ray image (.jpeg/.png) and view the lung mask predicted by the model.")

uploaded_file = st.file_uploader("Choose an X-ray image...", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert('RGB')
    st.image(image, caption='📷 Uploaded Image', use_column_width=True)

    with st.spinner("🔍 Segmenting lungs..."):
        preprocessed = preprocess_image(image)
        pred = model.predict(preprocessed)[0]
        mask = (pred > 0.5).astype(np.uint8) * 255
        mask_rgb = cv2.cvtColor(mask, cv2.COLOR_GRAY2RGB)

    st.image(mask_rgb, caption="🩻 Predicted Lung Mask", use_column_width=True)

    result_image = Image.fromarray(mask.squeeze().astype(np.uint8))
    buf = io.BytesIO()
    result_image.save(buf, format="PNG")
    byte_im = buf.getvalue()
    st.download_button("⬇️ Download Mask", data=byte_im, file_name="lung_mask.png", mime="image/png")

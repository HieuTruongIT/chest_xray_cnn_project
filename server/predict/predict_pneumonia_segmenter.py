import numpy as np
import cv2
import io
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image

model = None

def dice_coef(y_true, y_pred, smooth=1):
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) + smooth)

def load_segmentation_model():
    global model
    if model is None:
        model = load_model(
            r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_segmentation/pneumonia_segmentation_model.keras",
            custom_objects={'dice_coef': dice_coef},
            compile=False
        )
    return model

def preprocess_image(image: Image.Image, target_size=(512, 512)) -> np.ndarray:
    image = image.convert("L")  # Chuyển sang grayscale
    image = image.resize(target_size)
    image = np.array(image) / 255.0  # Normalize về [0, 1]
    image = np.expand_dims(image, axis=-1)  # (512, 512, 1)
    image = np.expand_dims(image, axis=0)   # (1, 512, 512, 1)
    return image.astype(np.float32)


def predict(image: Image.Image) -> dict:
    model = load_segmentation_model()
    input_tensor = preprocess_image(image)
    pred_mask = model.predict(input_tensor)[0]
    mask = (pred_mask > 0.5).astype(np.uint8) * 255

    # Convert to base64 for FastAPI response
    mask_img = Image.fromarray(mask.squeeze()).convert("L")
    buffered = io.BytesIO()
    mask_img.save(buffered, format="PNG")
    mask_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {"mask_base64": mask_base64}

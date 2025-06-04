import tensorflow as tf
import numpy as np
from PIL import Image

model = None
class_names = ["NORMAL", "PNEUMONIA"]

def load_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(
            r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_detection/pneumonia_detection_model.h5"
        )
    return model

def preprocess_image(image: Image.Image) -> np.ndarray:
    # Chuyển sang RGB (3 channels)
    img = image.convert("RGB").resize((224, 224))  # Resize to (224, 224)
    img_array = np.array(img, dtype=np.float32) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)   # (1, 224, 224, 3)
    return img_array

def predict(image: Image.Image) -> dict:
    model = load_model()
    img_array = preprocess_image(image)
    pred = model.predict(img_array)[0][0]
    label = "PNEUMONIA" if pred > 0.5 else "NORMAL"
    confidence = float(pred) if pred > 0.5 else float(1 - pred)
    return {"label": label, "confidence": round(confidence, 4)}

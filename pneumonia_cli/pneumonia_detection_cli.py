# import streamlit as st
# import tensorflow as tf
# import numpy as np
# from PIL import Image

# # Title
# st.set_page_config(page_title="Phân loại Viêm phổi", layout="centered")
# st.title("🩺 Phân loại Viêm phổi từ ảnh X-ray")
# st.write("Hệ thống sử dụng mô hình học sâu để phân loại ảnh X-ray thành **NORMAL** hoặc **PNEUMONIA**.")

# # Load model
# @st.cache_resource
# def load_model():
#     try:
#         model = tf.keras.models.load_model("model/model_Pneumonia_detection.keras")
#         return model
#     except Exception as e:
#         st.error(f"Không thể tải mô hình: {e}")
#         return None

# model = load_model()
# class_names = ["NORMAL", "PNEUMONIA"]

# # Upload image
# uploaded_file = st.file_uploader("📤 Tải ảnh X-ray lên", type=["jpg", "jpeg", "png"])

# if uploaded_file is not None:
#     try:
#         # Chuyển sang grayscale, resize đúng kích thước 256x256
#         img = Image.open(uploaded_file).convert("L").resize((256, 256))
#         st.image(img, caption="📸 Ảnh X-ray đã tải lên", use_container_width=True)

#         # Tiền xử lý ảnh
#         img_array = np.array(img) / 255.0  # (256, 256)
#         img_array = np.expand_dims(img_array, axis=-1)  # (256, 256, 1)
#         img_array = np.expand_dims(img_array, axis=0)   # (1, 256, 256, 1)

#         # Dự đoán
#         pred = model.predict(img_array)[0][0]  # lấy giá trị xác suất
#         label = "PNEUMONIA" if pred > 0.5 else "NORMAL"
#         confidence = pred if pred > 0.5 else 1 - pred

#         st.success(f"✅ Kết quả: **{label}**")
#         st.info(f"📊 Độ tin cậy: **{confidence:.2%}**")
#     except Exception as e:
#         st.error(f"Lỗi xử lý ảnh hoặc dự đoán: {e}")

# =================================================================================================================s

import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image

# Cấu hình trang
st.set_page_config(page_title="Phân loại Viêm phổi", layout="centered")
st.title("🩺 Phân loại Viêm phổi từ ảnh X-ray")
st.write("Hệ thống sử dụng mô hình học sâu để phân loại ảnh X-ray thành **NORMAL** hoặc **PNEUMONIA**.")

# Tải mô hình
@st.cache_resource
def load_model():
    try:
        model = tf.keras.models.load_model("model/pneumonia_detection/pneumonia_detection_model.h5")
        return model
    except Exception as e:
        st.error(f"Không thể tải mô hình: {e}")
        return None

model = load_model()
class_names = ["NORMAL", "PNEUMONIA"]

# Upload ảnh
uploaded_file = st.file_uploader("📤 Tải ảnh X-ray lên", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    try:
        # Đọc ảnh RGB và resize về đúng kích thước 224x224
        img = Image.open(uploaded_file).convert("RGB").resize((224, 224))
        st.image(img, caption="📸 Ảnh X-ray đã tải lên", use_container_width=True)

        # Tiền xử lý ảnh
        img_array = np.array(img) / 255.0  # (224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)  # (1, 224, 224, 3)

        # Dự đoán
        pred = model.predict(img_array)[0][0]  # Lấy giá trị xác suất
        label = "PNEUMONIA" if pred > 0.5 else "NORMAL"
        confidence = pred if pred > 0.5 else 1 - pred

        # Hiển thị kết quả
        st.success(f"✅ Kết quả: **{label}**")
        st.info(f"📊 Độ tin cậy: **{confidence:.2%}**")

    except Exception as e:
        st.error(f"Lỗi xử lý ảnh hoặc dự đoán: {e}")


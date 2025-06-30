# 🩺 Phát hiện Viêm phổi từ ảnh X-quang ngực bằng CNN

Dự án sử dụng mạng nơ-ron tích chập (CNN) để phân tích ảnh X-quang và phát hiện viêm phổi. Giao diện web cho phép người dùng tải ảnh lên, nhận kết quả chẩn đoán, bản đồ nhiệt, đánh giá mức độ, và gợi ý hướng điều trị.

---

## 🚀 Công nghệ sử dụng

- Python + Flask
- TensorFlow (CNN)
- OpenCV + Pillow (xử lý ảnh)
- Grad-CAM (hiển thị vùng ảnh liên quan)
- ReportLab (xuất báo cáo PDF)

---

## 📁 Cấu trúc thư mục

```bash
chest_xray_cnn_project/
│
├── 📁 client/                      # Dự án React cho Frontend
│   ├── 📁 public/                  # Tài nguyên tĩnh như ảnh, favicon, index.html
│   ├── 📁 src/                     # Mã nguồn React
│   │   ├── 📁 components/          # Các component React
│   │   ├── 📁 services/            # Các dịch vụ gọi API từ server
│   │   ├── 📄 App.js               # Entry point của ứng dụng React
│   │   └── 📄 index.js             # File khởi tạo React app
│   ├── 📄 package.json             # Quản lý các phụ thuộc của React
│   └── 📄 README.md                # Mô tả về phần Frontend
│
├── 📁 server/                      # Dự án FastAPI cho Backend
│   ├── 📁 app/                     # Ứng dụng FastAPI
│   │   ├── 📁 api/                 # Các API endpoint
│   │   │   └── 📄 predict.py       # API cho dự đoán viêm phổi
│   │   ├── 📁 models/              # Các mô hình và liên kết
│   │   ├── 📁 utils/               # Các hàm trợ giúp (image preprocessing, Grad-CAM)
│   │   ├── 📄 main.py              # Khởi tạo ứng dụng FastAPI
│   ├── 📄 requirements.txt         # Thư viện cần cài đặt cho FastAPI
│   ├── 📄 README.md                # Mô tả về phần Backend
│   ├── 📄 config.py                # Cấu hình cho FastAPI
│   └── 📄 gunicorn.conf.py         # Cấu hình cho Gunicorn (nếu triển khai trên server)
│
├── 📁 dataset/                     # Dữ liệu huấn luyện/test
│   ├── train/
│   ├── test/
│   └── val/
│
├── 📁 model/                       # Lưu trữ mô hình đã huấn luyện
│   └── pneumonia_cnn.h5
│
├── 📁 notebooks/                   # Các notebook dùng để thử nghiệm (EDA, huấn luyện model)
│   └── training_cnn.ipynb
│
├── 📁 reports/                     # Nơi sinh file báo cáo PDF
│   └── report_example.pdf
│
├── 📁 logs/                        # Log huấn luyện hoặc chạy API
│   └── train.log
│
├── 📄 .gitignore                   # Cấu hình gitignore cho dự án
├── 📄 README.md                    # Mô tả tổng quan về dự án
└── 📄 docker-compose.yml           # Cấu hình docker để chạy cả client và server (nếu dùng Docker)





## Pneumonia-Detection-DeepLearning-CNN  

**Detecting Pneumonia in Chest X-ray Images using Convolutional Neural Network**

---

### 🧠 Abstract

Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus (purulent material), causing cough with phlegm or pus, fever, chills, and difficulty breathing. A variety of organisms, including bacteria, viruses, and fungi can cause pneumonia.

---

### 📊 Dataset

- **Dataset Name:** Chest X-Ray Images (Pneumonia)
- **Dataset Link:**
  - [Chest X-Ray Images (Pneumonia) - Kaggle](https://www.kaggle.com/paultimothymooney/chest-xray-pneumonia)
  - [Original Dataset - Mendeley Data](https://data.mendeley.com/datasets/rscbjbr9sj/2)
- **Original Paper:**  
  [Identifying Medical Diagnoses and Treatable Diseases by Image-Based Deep Learning](https://www.cell.com/cell/fulltext/S0092-8674(18)30154-5)  
  (Daniel S. Kermany, Michael Goldbaum, Wenjia Cai, M. Anthony Lewis, Huimin Xia, Kang Zhang)

---

### 📁 Dataset Details

| Property               | Value                          |
|------------------------|--------------------------------|
| **Number of Classes**  | 2                              |
| **Total Images**       | 5856 (~1.15 GB)                |
| Training Set           | 5216 images (~1.07 GB)         |
| Validation Set         | 320 images (~42.8 MB)          |
| Testing Set            | 320 images (~35.4 MB)          |

---

### ⚙️ Model Parameters

- **Machine Learning Library:** Keras  
- **Base Model:** Custom Deep Convolutional Neural Network  
- **Optimizer:** Adam  
- **Loss Function:** Binary Crossentropy  

#### Training Parameters

- **Batch Size:** 64  
- **Epochs:** 30  
- **Training Time:** 2 Hours

---

### ✅ Evaluation Metrics (Testing)

| Metric     | Score     |
|------------|-----------|
| Precision  | 87.64%    |
| Recall     | 98.21%    |
| F1-Score   | 92.62%    |

---

### 🖼️ Sample Input

![Input](https://github.com/milsun/Pneumonia-Detection-DeepLearning-CNN/blob/master/images/input.png)

---

### 📉 Results (Loss Curve)

![Loss](https://github.com/milsun/Pneumonia-Detection-DeepLearning-CNN/blob/master/images/loss.png)

---

### 🔍 Sample Output

![Result](https://github.com/milsun/Pneumonia-Detection-DeepLearning-CNN/blob/master/images/result.png)

---

### 🧮 Confusion Matrix

<img src="https://github.com/milsun/Pneumonia-Detection-DeepLearning-CNN/blob/master/images/diagnosis.png" alt="Confusion Matrix" width="800" height="600"/>

---

### 🛠 Tools / Libraries

- **Language:** Python 3  
- **IDE / Environment:** Anaconda  
- **Libraries:** Keras, TensorFlow


📁 Project_Root/
│
├── 📁 COVID-19_Radiography_D/
│   ├── 📁 COVID/
│   │   ├── images/
│   │   └── masks/
│   ├── 📁 Lung_Opacity/
│   │   ├── images/
│   │   └── masks/
│   ├── 📁 Normal/
│   │   ├── images/
│   │   └── masks/
│   ├── 📁 Viral Pneumonia/
│   │   ├── images/
│   │   └── masks/
│   ├── README.md.txt
│   ├── COVID.metadata.xlsx
│   ├── Lung_Opacity.metadata.xlsx
│   ├── Normal.metadata.xlsx
│   └── Viral Pneumonia.metadata.xlsx
│
├── 📁 chest-xray-pneumonia/
│   └── 📁 chest-xray/
│       ├── 📁 train/
│       ├── 📁 test/
│       └── 📁 val/


Phân loại viêm phổi (COVID-19, Viral Pneumonia, Normal).

Đánh giá mức độ nghiêm trọng của viêm phổi.

Phát hiện và khoanh vùng tổn thương (bounding box hoặc segmentation mask).


# Load các mô hình đã huấn luyện
model_classification = tf.keras.models.load_model('pneumonia_detection_model.h5')   Mô hình phân loại bệnh - nghiệm thu ✅ final h5
model_severity = tf.keras.models.load_model('pneumonia_severity_model.h5')     Mô hình đánh giá mức độ nghiêm trọng    
model_segmentation = tf.keras.models.load_model('pneumonia_segmentation_model.h5')            Mô hình phát hiện tổn thương



Định nghĩa và tổng quan về viêm phổi,Triệu chứng viêm phổi,Chẩn đoán viêm phổi,Điều trị viêm phổi,Phòng ngừa viêm phổi,Biến chứng của viêm phổi,Các câu hỏi thường gặp (FAQ) về viêm phổi,Tư vấn và hướng dẫn chăm sóc tại nhà.

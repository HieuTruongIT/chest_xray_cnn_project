XRayLungAI/
├── public/
│   └── index.html
├── src/
│
│   ├── assets/                        # Hình ảnh, icon, fonts,...
│
│   ├── components/                   # Các thành phần tái sử dụng chung
│   │   ├── navigation/               # Tab bar hoặc navbar
│   │   └── auth/                     # Button Google/Facebook/SĐT,...
│
│   ├── views/                        # Mỗi view là 1 tab hoặc trang cụ thể
│   │   ├── intro/                    # Trang giới thiệu + login
│   │   │   └── IntroView.jsx
│   │   ├── login/                    # Trang login riêng (nếu tách)
│   │   │   └── LoginView.jsx
│   │   ├── upload/
│   │   │   └── UploadView.jsx
│   │   ├── detection/
│   │   │   └── DetectionView.jsx
│   │   ├── segmentation/
│   │   │   └── SegmentationView.jsx
│   │   ├── severity/
│   │   │   └── SeverityView.jsx
│   │   ├── treatment/
│   │   │   └── TreatmentView.jsx
│   │   └── report/
│   │       └── ReportView.jsx
│
│   ├── controllers/                 # Logic xử lý từng tab (gọi API, xử lý dữ liệu)
│   │   ├── upload/
│   │   │   └── useUploadController.js
│   │   ├── detection/
│   │   │   └── useDetectionController.js
│   │   ├── segmentation/
│   │   │   └── useSegmentationController.js
│   │   ├── severity/
│   │   │   └── useSeverityController.js
│   │   ├── treatment/
│   │   │   └── useTreatmentController.js
│   │   └── report/
│   │       └── useReportController.js
│
│   ├── layouts/
│   │   └── MainLayout.jsx           # Giao diện chính sau login (có tab điều hướng)
│
│   ├── contexts/
│   │   └── AuthContext.js           # Lưu trạng thái đăng nhập
│   │   └── PredictionContext.js     # Lưu kết quả phân tích ảnh
│
│   ├── pages/
│   │   └── Home.jsx                 # Trang Home chứa các tab chức năng
│
│   ├── routes/
│   │   └── AppRoutes.jsx            # Điều hướng giữa Intro → Login → Home,...
│   
│   ├── services/
│   │   └── authService.js           # Gọi API login Google, Facebook, OTP
│   │   └── analysisService.js       # Gọi backend phân tích ảnh
│
│   ├── utils/
│   │   ├── exportPDF.js             # Xuất báo cáo
│   │   └── formatDate.js
│
│   ├── styles/
│   │   └── global.css
│
├── App.js
├── Index.js
├── .gitignore
├── package.json
└── README.md


🔄 Luồng hoạt động tổng quát
User chọn ảnh 👉 tại UploadView.jsx

useUploadController.js gửi ảnh đến 3 API của FastAPI:

/predict_pneumonia_detection 

/predict_pneumonia_segmentation

/predict_pneumonia_severity

FastAPI xử lý ảnh bằng model → trả kết quả JSON.( {
    "results": [
        {
            "label": "PNEUMONIA",
            "confidence": 0.9742
        }
    ]
} 
{
    "results": [
        {
            "mask_base64": "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAAAAADRE4smAAAF00lEQVR/.....
        }
    ]
}
{
    "results": [
        {
            "geographic_extent": 4.33,
            "opacity": 3.71,
            "saliency_map_base64": "iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAIAAACVT/22AAAuqUlEQVR4nO19/.....
        }
    ]
}
)

useUploadController.js nhận kết quả và lưu vào PredictionContext.

Các controller còn lại (detection, segmentation, severity,...) chỉ đọc dữ liệu từ PredictionContext để:

Hiển thị kết quả (như bounding box, mask,...)

Đánh giá severity

Gợi ý điều trị

Xuất báo cáo
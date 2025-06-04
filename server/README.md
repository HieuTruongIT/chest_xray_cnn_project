pneumonia_server/
├── main/
│   └── app.py
│
├── api/
│   └── routes.py
│
├── predict/
│   ├── predict_pneumonia_detection.py     # Phân loại Pneumonia / Normal
│   ├── predict_pneumonia_severity.py      # Đánh giá mức độ nghiêm trọng
│   └── predict_pneumonia_segmenter.py     # Phát hiện và khoanh vùng tổn thương
│
├── config/
│   └── settings.py
│
├── output_images/                         # Thay cho static/
│   └── mask_output.png                    # Ảnh sau khi model xử lý
│
├── requirements.txt
└── README.md  đây là cấu trúc folder server của tui
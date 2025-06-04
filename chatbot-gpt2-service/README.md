chatbot-gpt2-service/ 
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app, điểm vào server
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints.py          # Định nghĩa route /generate, xử lý request
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py             # Cấu hình, biến môi trường (path model, max_length...)
│   ├── models/
│   │   ├── __init__.py
│   │   └── gpt2_model.py         # Load model + tokenizer, hàm generate
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── request.py            # Định nghĩa Pydantic model cho request/response
│   └── utils/
│       ├── __init__.py
│       └── helpers.py            # Các hàm tiện ích nếu cần
│
├── requirements.txt              # Thư viện cần thiết (fastapi, uvicorn, torch, transformers...)
├── README.md
└── .env                         # Biến môi trường (đường dẫn model, config khác
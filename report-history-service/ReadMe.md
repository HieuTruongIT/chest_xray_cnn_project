report-history-service/
│
├── config/               # Cấu hình app, DB, environment variables
│   └── config.go
│
├── model/                # Định nghĩa các struct mô hình dữ liệu
│   └── report.go
│
├── repository/           # Lớp truy cập DB, thao tác CRUD
│   └── report_repository.go
│
├── service/              # Business logic (nếu có)
│   └── report_service.go
│
├── handler/              # Các handler HTTP, nhận request và trả response
│   └── report_handler.go
│
├── middleware/           # Middleware (xác thực, logging, CORS...)
│   └── auth_middleware.go
│
├── router/               # Định nghĩa router, mapping route -> handler
│   └── router.go
│
├── util/                 # Các hàm tiện ích, helper functions
│   └── util.go
│
├── main.go               # Entry point của ứng dụng
│
├── go.mod
├── go.sum
├── .env
├── ReadMe.md
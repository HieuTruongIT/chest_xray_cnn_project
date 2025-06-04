XRayLungAI_mobile/
├── lib/
│   ├── core/                      # Các thành phần chung, tái sử dụng xuyên suốt app
│   │   ├── errors/                # Xử lý lỗi chung, custom exceptions
│   │   │   └── exceptions.dart
│   │   ├── usecases/              # Các business logic độc lập (nếu có dùng)
│   │   ├── utils/                 # Hàm tiện ích chung
│   │   │   ├── export_pdf.dart
│   │   │   └── format_date.dart
│   │   └── constants/             # Hằng số, config chung
│
│   ├── data/                      # Lớp data source: API, local DB, repository implementation
│   │   ├── models/                # Các model dữ liệu (DTOs)
│   │   ├── repositories/          # Repository implementation (giao tiếp API/backend)
│   │   └── services/              # Thực thi gọi API, DB...
│   │       ├── auth_service.dart
│   │       └── analysis_service.dart
│
│   ├── presentation/              # Giao diện, UI, xử lý tương tác
│   │   ├── components/            # Widget tái sử dụng (button, modal,...)
│   │   │   ├── navigation/        # BottomNavBar, Drawer,...
│   │   │   └── auth/              # Google/Facebook/Phone buttons,...
│   │   ├── views/                 # Mỗi màn hình cụ thể (screens/pages)
│   │   │   ├── intro/
│   │   │   │   └── intro_view.dart
│   │   │   ├── login/
│   │   │   │   └── login_view.dart
│   │   │   ├── upload/
│   │   │   │   └── upload_view.dart
│   │   │   ├── detection/
│   │   │   │   └── detection_view.dart
│   │   │   ├── segmentation/
│   │   │   │   └── segmentation_view.dart
│   │   │   ├── severity/
│   │   │   │   └── severity_view.dart
│   │   │   ├── treatment/
│   │   │   │   └── treatment_view.dart
│   │   │   └── report/
│   │   │       └── report_view.dart
│   │   ├── controllers/           # Logic UI, điều khiển view
│   │   │   ├── upload/
│   │   │   │   └── upload_controller.dart
│   │   │   ├── detection/
│   │   │   │   └── detection_controller.dart
│   │   │   ├── segmentation/
│   │   │   │   └── segmentation_controller.dart
│   │   │   ├── severity/
│   │   │   │   └── severity_controller.dart
│   │   │   ├── treatment/
│   │   │   │   └── treatment_controller.dart
│   │   │   └── report/
│   │   │       └── report_controller.dart
│   │   ├── layouts/
│   │   │   └── main_layout.dart
│   │   ├── providers/             # Riverpod/Provider cho state management
│   │   │   ├── auth_provider.dart
│   │   │   └── prediction_provider.dart
│   │   ├── pages/
│   │   │   └── home_page.dart
│   │   └── routes/
│   │       └── app_routes.dart
│
│   ├── theme/
│   │   └── app_theme.dart
│
│   ├── main.dart
│
├── pubspec.yaml
├── README.md
└── android/ios/web/

pneumonia-detection-app/
├── public/
│   └── index.html
├── src/
│
│   ├── assets/
│
│   ├── components/
│   │   ├── navigation/
│   │   │   └── TabNavigation.jsx
│   │   ├── upload/
│   │   │   └── UploadForm.jsx
│   │   └── ... (sẽ chia nhỏ các component khác như HeatmapDisplay, QRConsult,... theo module tương ứng)
│
│   ├── views/
│   │   ├── classification/
│   │   │   └── ClassificationView.jsx
│   │   ├── boundingBox/
│   │   │   └── BoundingBoxView.jsx
│   │   ├── severity/
│   │   │   └── SeverityView.jsx
│   │   ├── treatment/
│   │   │   └── TreatmentView.jsx
│   │   ├── report/
│   │   │   └── ReportView.jsx
│   │   └── upload/
│   │       └── UploadView.jsx (nếu muốn tách riêng Upload thành view)
│
│   ├── controllers/
│   │   ├── classification/
│   │   │   └── useClassificationController.js
│   │   ├── boundingBox/
│   │   │   └── useBoundingBoxController.js
│   │   ├── severity/
│   │   │   └── useSeverityController.js
│   │   ├── treatment/
│   │   │   └── useTreatmentController.js
│   │   ├── report/
│   │   │   └── useReportController.js
│   │   └── upload/
│   │       └── useUploadController.js
│
│   ├── layouts/
│   │   └── MainLayout.jsx
│
│   ├── contexts/
│   │   └── PredictionContext.js
│
│   ├── pages/
│   │   └── Home.jsx
│
│   ├── routes/
│   │   └── AppRoutes.jsx
│
│   ├── services/
│   │   └── analysisService.js
│
│   ├── utils/
│   │   ├── exportPDF.js
│   │   └── formatDate.js
│
│   ├── styles/
│   │   └── global.css
│
│   ├── App.jsx
│   └── index.js
│
├── .gitignore
├── package.json
└── README.md

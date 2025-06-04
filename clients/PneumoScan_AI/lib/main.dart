import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pneumoscan_ai/presentation/views/intro/intro_view.dart';
import 'package:pneumoscan_ai/presentation/views/upload/upload_view.dart';
import 'package:pneumoscan_ai/presentation/views/detection/detection_view.dart';
import 'package:pneumoscan_ai/data/repositories/prediction_provider.dart';
import 'package:pneumoscan_ai/presentation/controllers/detection/detection_controller.dart';
import 'package:pneumoscan_ai/presentation/controllers/upload/upload_controller.dart';
import 'package:pneumoscan_ai/presentation/views/segmentation/segmentation_view.dart';
import 'package:pneumoscan_ai/presentation/controllers/segmentation/segmentation_controller.dart';
import 'package:pneumoscan_ai/presentation/views/severity/severity_view.dart';
import 'package:pneumoscan_ai/presentation/controllers/severity/severity_controller.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PredictionProvider()),
        ChangeNotifierProvider(create: (_) => DetectionController()),
        ChangeNotifierProvider(create: (_) => SegmentationController()),
        ChangeNotifierProvider(create: (_) => SeverityController()),
        ChangeNotifierProvider(create: (_) => UploadController()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pneumonia AI',
      theme: ThemeData(primarySwatch: Colors.red),
      debugShowCheckedModeBanner: false,
      home: const IntroView(),
      routes: {
        '/uploadview': (context) => const UploadView(),
        '/detectionview': (context) => const DetectionView(),
        '/segmentationview': (context) => const SegmentationView(),
        '/severityview': (context) => const SeverityView(),
      },
    );
  }
}

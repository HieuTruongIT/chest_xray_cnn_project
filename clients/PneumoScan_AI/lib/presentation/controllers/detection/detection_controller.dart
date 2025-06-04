import 'package:flutter/material.dart';

class DetectionResult {
  final int id;
  final String label;
  final String confidence;

  DetectionResult({
    required this.id,
    required this.label,
    required this.confidence,
  });
}

class DetectionController extends ChangeNotifier {
  List<DetectionResult> _detections = [];

  List<DetectionResult> get detections => _detections;

  void updateDetectionsFromPrediction(Map<String, dynamic>? predictionResult) {
    if (predictionResult == null) {
      _detections = [];
      notifyListeners();
      return;
    }

    final List<dynamic> detectionsData = predictionResult['detection'] ?? [];

    _detections = detectionsData.asMap().entries.map((entry) {
      final index = entry.key;
      final item = entry.value as Map<String, dynamic>;

      final label = item['label']?.toString() ?? 'Chưa có dữ liệu';

      double confidenceValue = 0.0;
      try {
        if (item['confidence'] != null) {
          confidenceValue = double.parse(item['confidence'].toString());
        }
      } catch (e) {
        confidenceValue = 0.0;
      }

      return DetectionResult(
        id: index,
        label: label,
        confidence: confidenceValue.toStringAsFixed(2),
      );
    }).toList();

    notifyListeners();
  }
}

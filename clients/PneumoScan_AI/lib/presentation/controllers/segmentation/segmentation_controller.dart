import 'package:flutter/material.dart';

class SegmentationResult {
  final int id;
  final String? maskBase64;

  SegmentationResult({required this.id, required this.maskBase64});
}

class SegmentationController extends ChangeNotifier {
  List<SegmentationResult> _segmentations = [];

  List<SegmentationResult> get segmentations => _segmentations;

  void updateSegmentationsFromPrediction(
      Map<String, dynamic>? predictionResult) {
    if (predictionResult == null) {
      _segmentations = [];
      notifyListeners();
      return;
    }

    final List<dynamic> segmentationData =
        predictionResult['segmentation'] ?? [];

    _segmentations = segmentationData.asMap().entries.map((entry) {
      final index = entry.key;
      final item = entry.value as Map<String, dynamic>;

      return SegmentationResult(
        id: index,
        maskBase64: item['mask_base64'] as String?,
      );
    }).toList();

    notifyListeners();
  }
}

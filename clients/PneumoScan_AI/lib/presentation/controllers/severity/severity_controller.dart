import 'package:flutter/material.dart';
import 'package:pneumoscan_ai/presentation/controllers/upload/upload_controller.dart';
import 'package:provider/provider.dart';

class SeverityResult {
  final int id;
  final double geographicExtent;
  final double opacity;
  final String? saliencyMapBase64;

  SeverityResult({
    required this.id,
    required this.geographicExtent,
    required this.opacity,
    required this.saliencyMapBase64,
  });
}

// Controller for managing severity data
class SeverityController extends ChangeNotifier {
  List<SeverityResult> _results = [];

  List<SeverityResult> get results => _results;

  void updateFromPrediction(Map<String, dynamic>? predictionResult) {
    final List<dynamic> severities = predictionResult?['severity'] ?? [];
    _results = severities.asMap().entries.map((entry) {
      final index = entry.key;
      final item = entry.value as Map<String, dynamic>;
      return SeverityResult(
        id: index,
        geographicExtent: (item['geographic_extent'] ?? 0).toDouble(),
        opacity: (item['opacity'] ?? 0).toDouble(),
        saliencyMapBase64: item['saliency_map_base64'] as String?,
      );
    }).toList();
    notifyListeners();
  }
}

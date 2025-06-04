import 'package:flutter/material.dart';

class PredictionProvider extends ChangeNotifier {
  Map<String, dynamic>? _predictionResult;

  Map<String, dynamic>? get predictionResult => _predictionResult;

  void setPredictionResult(Map<String, dynamic>? result) {
    _predictionResult = result;
    notifyListeners();
  }
}

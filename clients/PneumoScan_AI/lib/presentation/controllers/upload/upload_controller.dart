import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:provider/provider.dart';
import 'package:pneumoscan_ai/data/repositories/prediction_provider.dart';
import 'package:flutter/material.dart';

class UploadController extends ChangeNotifier {
  final Dio _dio = Dio();
  static const String apiBase =
      "http://192.168.1.13:8000/api/v1/chest_xray_cnn_project";

  bool _loading = false;
  int _uploadProgress = 0;
  Map<String, dynamic>? _predictionResult;

  List<File> _previewImages = [];

  bool get loading => _loading;
  int get uploadProgress => _uploadProgress;
  Map<String, dynamic>? get predictionResult => _predictionResult;

  List<File> get previewImages => _previewImages;

  void setPreviewImages(List<File> files) {
    _previewImages = files;
    notifyListeners();
  }

  Future<FormData> _createFormData(List<File> files) async {
    FormData formData = FormData();
    for (var file in files) {
      formData.files.add(MapEntry(
        "files",
        await MultipartFile.fromFile(file.path,
            filename: file.path.split('/').last),
      ));
    }
    return formData;
  }

  Future<Map<String, dynamic>?> uploadImages(
      List<File> files, BuildContext context) async {
    if (files.isEmpty) return null;

    _loading = true;
    _uploadProgress = 0;
    notifyListeners();

    try {
      final formData1 = await _createFormData(files);
      final formData2 = await _createFormData(files);
      final formData3 = await _createFormData(files);

      final responses = await Future.wait([
        _dio.post("$apiBase/predict_pneumonia_detection", data: formData1,
            onSendProgress: (sent, total) {
          if (total != 0) {
            _uploadProgress = ((sent / total) * 100).round();
            notifyListeners();
          }
        }),
        _dio.post("$apiBase/predict_pneumonia_severity", data: formData2),
        _dio.post("$apiBase/predict_pneumonia_segmentation",
            data: formData3, options: Options(responseType: ResponseType.json)),
      ]);

      _predictionResult = {
        "detection": responses[0].data["results"],
        "severity": responses[1].data["results"],
        "segmentation": responses[2].data["results"],
      };

      // Cập nhật PredictionProvider
      Provider.of<PredictionProvider>(context, listen: false)
          .setPredictionResult(_predictionResult);

      setPreviewImages(files);

      return _predictionResult;
    } catch (e) {
      print("Lỗi khi upload hoặc gọi API: $e");
      return null;
    } finally {
      _loading = false;
      _uploadProgress = 100;
      notifyListeners();
    }
  }
}

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:provider/provider.dart';
import 'package:pneumoscan_ai/presentation/controllers/detection/detection_controller.dart';
import 'package:pneumoscan_ai/presentation/controllers/upload/upload_controller.dart';
import 'package:pneumoscan_ai/data/repositories/prediction_provider.dart';
import 'package:pneumoscan_ai/presentation/views/segmentation/segmentation_view.dart';

class DetectionView extends StatefulWidget {
  const DetectionView({super.key});

  @override
  State<DetectionView> createState() => _DetectionViewState();
}

class _DetectionViewState extends State<DetectionView> {
  String _filterLabel = "ALL";

  @override
  Widget build(BuildContext context) {
    // Lấy dữ liệu predictionResult mỗi lần build
    final predictionResult =
        context.watch<PredictionProvider>().predictionResult;

    // Cập nhật detections mỗi khi predictionResult thay đổi
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context
          .read<DetectionController>()
          .updateDetectionsFromPrediction(predictionResult);
    });

    final allDetections = context.watch<DetectionController>().detections;
    final previewImages = context.watch<UploadController>().previewImages;

    final detections = _filterLabel == 'ALL'
        ? allDetections
        : allDetections.where((d) => d.label == _filterLabel).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kết quả phân loại'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: TextButton(
              style: TextButton.styleFrom(
                foregroundColor: Colors.red, // màu chữ
                textStyle: const TextStyle(fontSize: 16),
              ),
              onPressed: () {
                Navigator.pushNamed(context, '/segmentationview');
              },
              child: const Text('Next'),
            ),
          ),
        ],
      ),
      body: detections.isEmpty
          ? const Center(child: Text('Không có dữ liệu để hiển thị'))
          : Column(
              children: [
                _buildFilterBar(),
                const Divider(),
                Expanded(
                  child: ListView.builder(
                    itemCount: detections.length,
                    itemBuilder: (context, index) {
                      final item = detections[index];
                      final imageFile = index < previewImages.length
                          ? previewImages[index]
                          : null;

                      final confidence =
                          (double.parse(item.confidence) * 100).round();

                      final pieData = [
                        PieChartSectionData(
                          value: item.label == "NORMAL"
                              ? confidence.toDouble()
                              : (100 - confidence).toDouble(),
                          color: Colors.green,
                          title: 'NORMAL',
                          titleStyle: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                        PieChartSectionData(
                          value: item.label == "PNEUMONIA"
                              ? confidence.toDouble()
                              : (100 - confidence).toDouble(),
                          color: Colors.red,
                          title: 'PNEUMONIA',
                          titleStyle: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ];

                      return Card(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Ảnh ${index + 1}',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 8),
                              if (imageFile != null)
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.file(
                                    imageFile,
                                    height: 200,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              const SizedBox(height: 16),
                              SizedBox(
                                height: 200,
                                child: PieChart(
                                  PieChartData(
                                    sections: pieData,
                                    centerSpaceRadius: 40,
                                    sectionsSpace: 4,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '${item.label.toUpperCase()} - Độ tin cậy: $confidence%',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: item.label == 'PNEUMONIA'
                                      ? Colors.red
                                      : Colors.green,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildFilterBar() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          const Icon(Icons.filter_alt, color: Colors.grey),
          const SizedBox(width: 8),
          const Text('Lọc theo kết quả:'),
          const SizedBox(width: 12),
          DropdownButton<String>(
            value: _filterLabel,
            onChanged: (val) => setState(() => _filterLabel = val ?? "ALL"),
            items: const [
              DropdownMenuItem(value: "ALL", child: Text("Tất cả")),
              DropdownMenuItem(value: "NORMAL", child: Text("Bình thường")),
              DropdownMenuItem(value: "PNEUMONIA", child: Text("Viêm phổi")),
            ],
          ),
        ],
      ),
    );
  }
}

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pneumoscan_ai/presentation/controllers/segmentation/segmentation_controller.dart';
import 'package:pneumoscan_ai/data/repositories/prediction_provider.dart';

class SegmentationView extends StatefulWidget {
  const SegmentationView({super.key});

  @override
  State<SegmentationView> createState() => _SegmentationViewState();
}

class _SegmentationViewState extends State<SegmentationView> {
  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    if (!_initialized) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final predictionProvider = context.read<PredictionProvider>();
        final segmentationController = context.read<SegmentationController>();

        segmentationController.updateSegmentationsFromPrediction(
          predictionProvider.predictionResult,
        );
      });

      _initialized = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    final segmentations = context.watch<SegmentationController>().segmentations;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kết quả phân đoạn'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: TextButton(
              style: TextButton.styleFrom(
                foregroundColor: Colors.red,
                textStyle: const TextStyle(fontSize: 16),
              ),
              onPressed: () {
                Navigator.pushNamed(context, '/severityview');
              },
              child: const Text('Next'),
            ),
          ),
        ],
      ),
      body: segmentations.isEmpty
          ? const Center(child: Text('Không có dữ liệu phân đoạn'))
          : ListView.builder(
              itemCount: segmentations.length,
              itemBuilder: (context, index) {
                final seg = segmentations[index];
                final maskBytes = seg.maskBase64 != null
                    ? base64Decode(seg.maskBase64!)
                    : null;

                return Card(
                  margin: const EdgeInsets.all(12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Ảnh phân đoạn #${seg.id + 1}',
                            style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 12),
                        if (maskBytes != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.memory(
                              maskBytes,
                              height: 250,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          )
                        else
                          const Text('Không có ảnh phân đoạn để hiển thị',
                              style: TextStyle(color: Colors.grey)),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

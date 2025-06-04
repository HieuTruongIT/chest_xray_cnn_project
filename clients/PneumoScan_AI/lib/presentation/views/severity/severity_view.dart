import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pneumoscan_ai/presentation/controllers/severity/severity_controller.dart';
import 'package:pneumoscan_ai/data/repositories/prediction_provider.dart';

class SeverityView extends StatefulWidget {
  const SeverityView({Key? key}) : super(key: key);

  @override
  _SeverityViewState createState() => _SeverityViewState();
}

class _SeverityViewState extends State<SeverityView> {
  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    if (!_initialized) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final predictionProvider = context.read<PredictionProvider>();
        final severityController = context.read<SeverityController>();

        severityController.updateFromPrediction(
          predictionProvider.predictionResult,
        );
      });

      _initialized = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    final results = context.watch<SeverityController>().results;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kết quả mức độ'),
      ),
      body: results.isEmpty
          ? const Center(child: Text('Không có dữ liệu mức độ'))
          : ListView.builder(
              itemCount: results.length,
              itemBuilder: (context, index) {
                final item = results[index];
                final saliencyBytes = item.saliencyMapBase64 != null
                    ? base64Decode(item.saliencyMapBase64!)
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
                        Text('Ảnh #${item.id + 1}',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Text(
                            'Geographic Extent: ${item.geographicExtent.toStringAsFixed(2)}'),
                        Text('Opacity: ${item.opacity.toStringAsFixed(2)}'),
                        const SizedBox(height: 12),
                        if (saliencyBytes != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.memory(
                              saliencyBytes,
                              height: 200,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          )
                        else
                          const Text('Không có saliency map để hiển thị',
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

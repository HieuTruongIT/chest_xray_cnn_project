import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:pneumoscan_ai/presentation/views/detection//detection_view.dart';
import 'package:pneumoscan_ai/presentation/controllers/upload/upload_controller.dart';

class UploadView extends StatefulWidget {
  const UploadView({super.key});

  @override
  State<UploadView> createState() => _UploadViewState();
}

class _UploadViewState extends State<UploadView> {
  final ImagePicker _picker = ImagePicker();
  List<XFile> _files = [];
  double _progress = 0;
  bool _isLoading = false;
  bool _showScanEffect = false;
  XFile? _selectedImage;

  @override
  void dispose() {
    _uploadController.dispose();
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _pickImages() async {
    try {
      final List<XFile>? picked = await _picker.pickMultiImage();
      if (picked != null && picked.isNotEmpty) {
        setState(() {
          _files.addAll(picked);
        });
      }
    } catch (e) {
      debugPrint("Image pick error: $e");
    }
  }

  CameraController? _cameraController;
  final UploadController _uploadController = UploadController();

  Future<void> _scanImage() async {
    final cameras = await availableCameras();
    final camera = cameras.first;

    _cameraController = CameraController(
      camera,
      ResolutionPreset.medium,
      enableAudio: false,
    );

    try {
      await _cameraController!.initialize();
      await _cameraController!.setFlashMode(FlashMode.off);

      setState(() {
        _showScanEffect = true;
      });

      // Đợi hiển thị camera preview
      await Future.delayed(const Duration(milliseconds: 500));

      // Chụp ảnh
      final directory = await getTemporaryDirectory();
      final imagePath = path.join(directory.path, '${DateTime.now()}.png');

      final XFile file = await _cameraController!.takePicture();
      await file.saveTo(imagePath);

      setState(() {
        _files.add(XFile(imagePath));
      });
    } catch (e) {
      debugPrint("Auto capture error: $e");
    } finally {
      await Future.delayed(const Duration(milliseconds: 1500));
      setState(() {
        _showScanEffect = false;
      });
      await _cameraController?.dispose();
      _cameraController = null;
    }
  }

  Widget _buildScanEffectOverlay() {
    final height = MediaQuery.of(context).size.height;
    final width = MediaQuery.of(context).size.width;

    return Container(
      width: width,
      height: height,
      color: Colors.black.withOpacity(0.3), // làm mờ nền thôi
      child: Stack(
        children: [
          // Nếu camera khởi tạo xong thì hiển thị preview, ngược lại hiển thị icon
          if (_cameraController != null &&
              _cameraController!.value.isInitialized)
            CameraPreview(_cameraController!)
          else
            const Center(
              child: Icon(Icons.camera_alt, color: Colors.white, size: 48),
            ),

          // Overlay scan line
          const AnimatedScanLine(),

          // Text thông báo trên cùng
          Positioned(
            top: 40,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                "Đang quét ảnh...",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    shadows: [
                      Shadow(
                          color: Colors.black.withOpacity(0.7),
                          offset: const Offset(0, 1),
                          blurRadius: 4),
                    ]),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _removeImage(int index) {
    setState(() {
      _files.removeAt(index);
    });
  }

  Future<void> _uploadImages() async {
    if (_files.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    // Chuyển List<XFile> -> List<File>
    List<File> fileList = _files.map((xfile) => File(xfile.path)).toList();

    // Lắng nghe tiến trình upload từ controller
    _uploadController.addListener(() {
      setState(() {
        _progress = _uploadController.uploadProgress.toDouble();
        _isLoading = _uploadController.loading;
      });
    });

    await _uploadController.uploadImages(fileList, context);

    // Tạm thời không xử lý kết quả predictionResult

    setState(() {
      _isLoading = false;
    });
  }

  void _resetAll() {
    setState(() {
      _files.clear();
      _progress = 0;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _showScanEffect
        ? Scaffold(
            backgroundColor: Colors.black,
            body: Stack(
              children: [
                if (_cameraController != null &&
                    _cameraController!.value.isInitialized)
                  CameraPreview(_cameraController!)
                else
                  const Center(
                    child:
                        Icon(Icons.camera_alt, color: Colors.white, size: 48),
                  ),
                _buildScanEffectOverlay(),
              ],
            ),
          )
        : Scaffold(
            backgroundColor: Colors.white,
            body: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Center(
                      child: Column(
                        children: [
                          Image.asset(
                            'assets/logo_penumonia.png',
                            width: 120,
                            height: 120,
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "PneumoScan AI",
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w800,
                              color: Colors.red,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildActionCard(Icons.image, "Chọn ảnh", _pickImages),
                        _buildActionCard(
                            Icons.camera_alt, "Quét ảnh", _scanImage),
                      ],
                    ),
                    const SizedBox(height: 24),
                    if (_files.isNotEmpty) _buildImagePreviewGrid(),
                    if (_files.isNotEmpty) _buildImageSummary(),
                    if (_isLoading) _buildProgressBar(),
                    const SizedBox(height: 20),
                    if (_files.isNotEmpty)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ElevatedButton(
                            onPressed: _files.isNotEmpty && !_isLoading
                                ? _uploadImages
                                : null,
                            style: _primaryButtonStyle(),
                            child: Text(
                                _isLoading ? "Đang phân tích..." : "Phân tích"),
                          ),
                          const SizedBox(width: 12),
                          OutlinedButton(
                            onPressed: _resetAll,
                            style: _secondaryButtonStyle(),
                            child: const Text("Xóa tất cả"),
                          ),
                        ],
                      ),
                    if (_files.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 20),
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const DetectionView()),
                            );
                          },
                          style: _primaryButtonStyle(),
                          child: const Text("Kết quả"),
                        ),
                      ),
                    if (_selectedImage != null) _buildLightboxModal(),
                  ],
                ),
              ),
            ),
          );
  }

  Widget _buildActionCard(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          color: Colors.red.shade50,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.red.shade300, width: 1.5),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.red.shade700, size: 32),
            const SizedBox(height: 8),
            Text(label,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.red.shade700,
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePreviewGrid() => GridView.builder(
        shrinkWrap: true,
        itemCount: _files.length,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3, crossAxisSpacing: 12, mainAxisSpacing: 12),
        itemBuilder: (context, index) {
          final file = _files[index];
          return GestureDetector(
            onTap: () => setState(() => _selectedImage = file),
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.file(File(file.path),
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity),
                ),
                Positioned(
                  top: 4,
                  right: 4,
                  child: GestureDetector(
                    onTap: () => _removeImage(index),
                    child: const CircleAvatar(
                      backgroundColor: Colors.red,
                      radius: 12,
                      child: Icon(Icons.close, size: 14, color: Colors.white),
                    ),
                  ),
                )
              ],
            ),
          );
        },
      );

  Widget _buildImageSummary() => LayoutBuilder(
        builder: (context, constraints) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),
            const Text("Tổng ảnh đã chọn:",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.red,
                )),
            const SizedBox(height: 15),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              primary: false,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 3,
              children: [
                _buildSummaryHeader("Tên ảnh"),
                _buildSummaryHeader("Kích thước"),
                _buildSummaryHeader("Định dạng"),
                _buildSummaryHeader("Nguồn"),
                for (var file in _files) ...[
                  _buildSummaryCell(file.name),
                  _buildSummaryCell(
                      "${(File(file.path).lengthSync() / 1024).toStringAsFixed(1)} KB"),
                  _buildSummaryCell(file.name.split(".").last),
                  _buildSummaryCell("Thiết bị"),
                ]
              ],
            )
          ],
        ),
      );

  Widget _buildProgressBar() => Column(
        children: [
          const SizedBox(height: 20),
          Container(
            height: 20,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              gradient: const LinearGradient(
                  colors: [Color(0xfff8d7da), Color(0xfff5c6cb)]),
            ),
            child: Stack(
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 500),
                  width: MediaQuery.of(context).size.width * (_progress / 100),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                        colors: [Color(0xffff4e50), Color(0xffe6180a)]),
                    borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(10),
                        bottomLeft: Radius.circular(10)),
                  ),
                ),
                Center(
                  child: Text(
                    "Đang xử lý: ${_progress.toInt()}%",
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, color: Colors.red),
                  ),
                )
              ],
            ),
          ),
        ],
      );

  Widget _buildLightboxModal() => Stack(
        children: [
          GestureDetector(
            onTap: () => setState(() => _selectedImage = null),
            child: Container(
              color: Colors.black.withOpacity(0.75),
              alignment: Alignment.center,
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8)),
                child: Stack(
                  children: [
                    Image.file(File(_selectedImage!.path), fit: BoxFit.contain),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedImage = null),
                        child: const CircleAvatar(
                          backgroundColor: Colors.red,
                          radius: 16,
                          child:
                              Icon(Icons.close, color: Colors.white, size: 18),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      );

  ButtonStyle _primaryButtonStyle() => ElevatedButton.styleFrom(
        backgroundColor: Colors.red[700],
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      );

  ButtonStyle _secondaryButtonStyle() => OutlinedButton.styleFrom(
        foregroundColor: Colors.red[700],
        side: BorderSide(color: Colors.red.shade700!, width: 2),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      );

  Widget _buildSummaryHeader(String text) => Container(
        padding: const EdgeInsets.all(6),
        color: const Color(0xfff5f5f5),
        child: Text(text,
            style: const TextStyle(
                fontWeight: FontWeight.bold, color: Colors.red)),
      );

  Widget _buildSummaryCell(String text) => Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: Text(text, textAlign: TextAlign.center),
      );
}

class AnimatedScanLine extends StatefulWidget {
  const AnimatedScanLine({super.key});

  @override
  State<AnimatedScanLine> createState() => _AnimatedScanLineState();
}

class _AnimatedScanLineState extends State<AnimatedScanLine>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late double screenHeight;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    screenHeight = MediaQuery.of(context).size.height;
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Positioned(
          top: _controller.value * screenHeight,
          left: 0,
          right: 0,
          child: Container(
            height: 2,
            color: Colors.red,
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

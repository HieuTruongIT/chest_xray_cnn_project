import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:pneumoscan_ai/presentation/views/login/login_view.dart';

class IntroView extends StatefulWidget {
  const IntroView({Key? key}) : super(key: key);

  @override
  State<IntroView> createState() => _IntroViewState();
}

class _IntroViewState extends State<IntroView> {
  bool darkMode = false;

  void toggleDarkMode() {
    setState(() {
      darkMode = !darkMode;
    });
  }

  void navigateToLogin() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const LoginView()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryRed = const Color(0xFFC02121);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: darkMode ? Brightness.dark : Brightness.light,
        primaryColor: primaryRed,
        scaffoldBackgroundColor:
            darkMode ? const Color(0xFF1A1A1A) : Colors.white,
        appBarTheme: AppBarTheme(
          backgroundColor: primaryRed,
          iconTheme: const IconThemeData(color: Colors.white),
          elevation: 4,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryRed,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(25),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            textStyle:
                const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        iconTheme: IconThemeData(color: primaryRed),
      ),
      home: Scaffold(
        appBar: AppBar(
          titleSpacing: 0,
          title: Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 12),
                child:
                    Image.asset('assets/intro_logo_pneumonia.png', height: 40),
              ),
              const Spacer(),
              IconButton(
                tooltip: 'Đăng nhập',
                icon: const Icon(Icons.person),
                onPressed: navigateToLogin, // gọi hàm chuyển trang
              ),
              IconButton(
                tooltip: 'Chuyển chế độ sáng/tối',
                icon: Icon(darkMode
                    ? FontAwesomeIcons.solidSun
                    : FontAwesomeIcons.moon),
                onPressed: toggleDarkMode,
              ),
            ],
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset('assets/logo_uth.png', height: 140),
                const SizedBox(height: 48),
                ElevatedButton(
                  onPressed: navigateToLogin, // gọi hàm chuyển trang
                  child: const Text('Get Started'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

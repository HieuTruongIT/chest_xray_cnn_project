// import 'package:flutter/material.dart';
// import '../../../data//services//auth_service.dart';

// class LoginView extends StatefulWidget {
//   const LoginView({Key? key}) : super(key: key);

//   @override
//   State<LoginView> createState() => _LoginViewState();
// }

// class _LoginViewState extends State<LoginView> {
//   final AuthService _authService = AuthService();

//   String? error;
//   bool showPhoneModal =
//       false; // Nếu bạn không dùng đăng nhập số điện thoại thì có thể bỏ luôn

//   Future<void> signIn(AuthProvider provider) async {
//     setState(() {
//       error = null;
//     });

//     try {
//       await _authService.signIn(provider);
//       Navigator.pushReplacementNamed(context, '/uploadview');
//     } catch (e) {
//       setState(() {
//         if (e.toString().contains('auth/popup-closed-by-user')) {
//           error = 'Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại.';
//         } else {
//           error = 'Đăng nhập thất bại! Vui lòng thử lại.';
//         }
//       });
//     }
//   }

//   void handleLogin(Future<void> Function() method) {
//     method();
//   }

//   Widget buildAccountCard({
//     required String iconPath,
//     required String label,
//     required String subtext,
//     required VoidCallback onTap,
//   }) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(8),
//       child: Container(
//         padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
//         margin: const EdgeInsets.symmetric(vertical: 8),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           border: Border.all(color: const Color(0xFFdadce0), width: 2),
//           borderRadius: BorderRadius.circular(8),
//         ),
//         child: Row(
//           children: [
//             Image.asset(
//               iconPath,
//               width: 40,
//               height: 40,
//             ),
//             const SizedBox(width: 16),
//             Expanded(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     label,
//                     style: const TextStyle(
//                       fontSize: 15,
//                       fontWeight: FontWeight.w500,
//                       color: Color(0xFF202124),
//                     ),
//                   ),
//                   Text(
//                     subtext,
//                     style: const TextStyle(
//                       fontSize: 13,
//                       color: Color(0xFF5F6368),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.grey[200],
//       body: Center(
//         child: Container(
//           constraints: const BoxConstraints(maxWidth: 400),
//           padding: const EdgeInsets.all(20),
//           decoration: BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.circular(16),
//             boxShadow: const [
//               BoxShadow(
//                 color: Color.fromRGBO(32, 33, 36, 0.28),
//                 blurRadius: 6,
//                 offset: Offset(0, 1),
//               )
//             ],
//           ),
//           child: SingleChildScrollView(
//             child: Column(
//               children: [
//                 Container(
//                   margin: const EdgeInsets.only(top: 40),
//                   width: 210,
//                   height: 90,
//                   alignment: Alignment.center,
//                   child: Image.asset(
//                     'assets/logo_penumonia.png',
//                     fit: BoxFit.contain,
//                   ),
//                 ),
//                 const SizedBox(height: 24),
//                 const Text(
//                   'Chọn phương thức',
//                   style: TextStyle(
//                     fontSize: 24,
//                     fontWeight: FontWeight.w500,
//                     color: Color(0xFF202124),
//                   ),
//                 ),
//                 const SizedBox(height: 10),
//                 RichText(
//                   text: const TextSpan(
//                     text: 'để tiếp tục tới ',
//                     style: TextStyle(
//                       fontSize: 14,
//                       color: Color(0xFF5F6368),
//                     ),
//                     children: [
//                       TextSpan(
//                         text: 'AI Pneumoria .',
//                         style: TextStyle(
//                           fontWeight: FontWeight.w500,
//                           color: Color(0xFFC02121),
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//                 const SizedBox(height: 32),
//                 buildAccountCard(
//                   iconPath: 'assets/logo_google.png',
//                   label: 'Google',
//                   subtext: 'Đăng nhập bằng Google',
//                   onTap: () => handleLogin(() => signIn(AuthProvider.google)),
//                 ),
//                 buildAccountCard(
//                   iconPath: 'assets/logo_facebook.png',
//                   label: 'Facebook',
//                   subtext: 'Đăng nhập bằng Facebook',
//                   onTap: () => handleLogin(() => signIn(AuthProvider.facebook)),
//                 ),
//                 buildAccountCard(
//                   iconPath: 'assets/logo_phone.png',
//                   label: 'Số điện thoại',
//                   subtext: 'Đăng nhập bằng số điện thoại',
//                   onTap: () {
//                     setState(() {
//                       error =
//                           'Chức năng đăng nhập bằng số điện thoại hiện chưa được hỗ trợ.';
//                     });
//                   },
//                 ),
//                 buildAccountCard(
//                   iconPath: 'assets/logo_add_accounts.png',
//                   label: 'Another account',
//                   subtext: 'Sử dụng một tài khoản khác',
//                   onTap: () {},
//                 ),
//                 const SizedBox(height: 40),
//                 Column(
//                   mainAxisSize: MainAxisSize.min,
//                   children: [
//                     const Text(
//                       'Trước khi sử dụng AI Pneumoria, bạn có thể xem ',
//                       style: TextStyle(
//                         fontSize: 12,
//                         color: Color(0xFF5F6368),
//                       ),
//                       textAlign: TextAlign.center,
//                     ),
//                     Wrap(
//                       alignment: WrapAlignment.center,
//                       crossAxisAlignment: WrapCrossAlignment.center,
//                       spacing: 4,
//                       children: [
//                         TextButton(
//                           onPressed: () {},
//                           style: TextButton.styleFrom(
//                             padding: EdgeInsets.zero,
//                             minimumSize: const Size(0, 0),
//                             tapTargetSize: MaterialTapTargetSize.shrinkWrap,
//                           ),
//                           child: const Text(
//                             'chính sách quyền riêng tư',
//                             style: TextStyle(
//                                 color: Color(0xFFC02121), fontSize: 12),
//                           ),
//                         ),
//                         const Text(
//                           ' và ',
//                           style:
//                               TextStyle(fontSize: 12, color: Color(0xFF5F6368)),
//                         ),
//                         TextButton(
//                           onPressed: () {},
//                           style: TextButton.styleFrom(
//                             padding: EdgeInsets.zero,
//                             minimumSize: const Size(0, 0),
//                             tapTargetSize: MaterialTapTargetSize.shrinkWrap,
//                           ),
//                           child: const Text(
//                             'điều khoản dịch vụ',
//                             style: TextStyle(
//                                 color: Color(0xFFC02121), fontSize: 12),
//                           ),
//                         ),
//                         const Text(
//                           ' của ứng dụng này.',
//                           style:
//                               TextStyle(fontSize: 12, color: Color(0xFF5F6368)),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 8),
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     Expanded(
//                       child: TextButton(
//                         onPressed: () {},
//                         style: TextButton.styleFrom(
//                           foregroundColor: const Color(0xFF1A73E8),
//                         ),
//                         child: const Text(
//                           'Ngôn ngữ',
//                           textAlign: TextAlign.center,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                       ),
//                     ),
//                     Expanded(
//                       child: TextButton(
//                         onPressed: () {},
//                         style: TextButton.styleFrom(
//                           foregroundColor: const Color(0xFF1A73E8),
//                         ),
//                         child: const Text(
//                           'Trợ giúp',
//                           textAlign: TextAlign.center,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                       ),
//                     ),
//                     Expanded(
//                       child: TextButton(
//                         onPressed: () {},
//                         style: TextButton.styleFrom(
//                           foregroundColor: const Color(0xFF1A73E8),
//                         ),
//                         child: const Text(
//                           'Bảo mật',
//                           textAlign: TextAlign.center,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                       ),
//                     ),
//                     Expanded(
//                       child: TextButton(
//                         onPressed: () {},
//                         style: TextButton.styleFrom(
//                           foregroundColor: const Color(0xFF1A73E8),
//                         ),
//                         child: const Text(
//                           'Liên hệ',
//                           textAlign: TextAlign.center,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                       ),
//                     ),
//                   ],
//                 )
//               ],
//             ),
//           ),
//         ),
//       ),
//       floatingActionButton: showPhoneModal
//           ? null
//           : FloatingActionButton(
//               onPressed: () {},
//               child: const Icon(Icons.add),
//             ),
//     );
//   }
// }

import 'package:flutter/material.dart';

class LoginView extends StatefulWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  String? error;
  bool showPhoneModal =
      false; // Nếu bạn không dùng đăng nhập số điện thoại thì có thể bỏ luôn

  Future<void> signIn(dynamic provider) async {
    // Tạm bỏ qua xử lý đăng nhập thực tế, chuyển thẳng vào trang uploadview
    Navigator.pushReplacementNamed(context, '/uploadview');
  }

  void handleLogin(Future<void> Function() method) {
    method();
  }

  Widget buildAccountCard({
    required String iconPath,
    required String label,
    required String subtext,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        margin: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: const Color(0xFFdadce0), width: 2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Image.asset(
              iconPath,
              width: 40,
              height: 40,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF202124),
                    ),
                  ),
                  Text(
                    subtext,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF5F6368),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: const [
              BoxShadow(
                color: Color.fromRGBO(32, 33, 36, 0.28),
                blurRadius: 6,
                offset: Offset(0, 1),
              )
            ],
          ),
          child: SingleChildScrollView(
            child: Column(
              children: [
                Container(
                  margin: const EdgeInsets.only(top: 40),
                  width: 210,
                  height: 90,
                  alignment: Alignment.center,
                  child: Image.asset(
                    'assets/logo_penumonia.png',
                    fit: BoxFit.contain,
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Chọn phương thức',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF202124),
                  ),
                ),
                const SizedBox(height: 10),
                RichText(
                  text: const TextSpan(
                    text: 'để tiếp tục tới ',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF5F6368),
                    ),
                    children: [
                      TextSpan(
                        text: 'AI Pneumoria .',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: Color(0xFFC02121),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                buildAccountCard(
                  iconPath: 'assets/logo_google.png',
                  label: 'Google',
                  subtext: 'Đăng nhập bằng Google',
                  onTap: () => handleLogin(() => signIn('google')),
                ),
                buildAccountCard(
                  iconPath: 'assets/logo_facebook.png',
                  label: 'Facebook',
                  subtext: 'Đăng nhập bằng Facebook',
                  onTap: () => handleLogin(() => signIn('facebook')),
                ),
                buildAccountCard(
                  iconPath: 'assets/logo_phone.png',
                  label: 'Số điện thoại',
                  subtext: 'Đăng nhập bằng số điện thoại',
                  onTap: () {
                    Navigator.pushReplacementNamed(context, '/uploadview');
                  },
                ),
                buildAccountCard(
                  iconPath: 'assets/logo_add_accounts.png',
                  label: 'Another account',
                  subtext: 'Sử dụng một tài khoản khác',
                  onTap: () {
                    Navigator.pushReplacementNamed(context, '/uploadview');
                  },
                ),
                const SizedBox(height: 40),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Trước khi sử dụng AI Pneumoria, bạn có thể xem ',
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF5F6368),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    Wrap(
                      alignment: WrapAlignment.center,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 4,
                      children: [
                        TextButton(
                          onPressed: () {},
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(0, 0),
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: const Text(
                            'chính sách quyền riêng tư',
                            style: TextStyle(
                                color: Color(0xFFC02121), fontSize: 12),
                          ),
                        ),
                        const Text(
                          ' và ',
                          style:
                              TextStyle(fontSize: 12, color: Color(0xFF5F6368)),
                        ),
                        TextButton(
                          onPressed: () {},
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(0, 0),
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: const Text(
                            'điều khoản dịch vụ',
                            style: TextStyle(
                                color: Color(0xFFC02121), fontSize: 12),
                          ),
                        ),
                        const Text(
                          ' của ứng dụng này.',
                          style:
                              TextStyle(fontSize: 12, color: Color(0xFF5F6368)),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF1A73E8),
                        ),
                        child: const Text(
                          'Ngôn ngữ',
                          textAlign: TextAlign.center,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                    Expanded(
                      child: TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF1A73E8),
                        ),
                        child: const Text(
                          'Trợ giúp',
                          textAlign: TextAlign.center,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                    Expanded(
                      child: TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF1A73E8),
                        ),
                        child: const Text(
                          'Bảo mật',
                          textAlign: TextAlign.center,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                    Expanded(
                      child: TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF1A73E8),
                        ),
                        child: const Text(
                          'Liên hệ',
                          textAlign: TextAlign.center,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}

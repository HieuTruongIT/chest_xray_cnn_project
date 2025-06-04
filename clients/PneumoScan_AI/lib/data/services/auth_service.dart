// import 'package:flutter/material.dart';
// import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
// import 'package:flutter/foundation.dart';
// import 'package:flutter/services.dart';
// import 'package:google_sign_in/google_sign_in.dart';

// enum AuthProvider { facebook, google }

// class AuthUser {
//   final String? name;
//   final String? email;
//   final String? photoUrl;

//   AuthUser({this.name, this.email, this.photoUrl});
// }

// class AuthService {
//   // --- Google Auth ---
//   final GoogleSignIn _googleSignIn = GoogleSignIn(
//     scopes: ['openid', 'email', 'profile'],
//     serverClientId:
//         '760175289893-3qi56cjjrp25k325546o4taaj26keinf.apps.googleusercontent.com',
//   );

//   GoogleSignInAccount? _googleCurrentUser;
//   bool _googleIsSigningIn = false;
//   bool _googleIsSignedIn = false;

//   // --- Facebook Auth ---
//   AccessToken? _facebookAccessToken;
//   bool _facebookIsLoggingIn = false;
//   bool _facebookIsLoggedIn = false;

//   AuthService() {
//     // Init Google
//     _googleSignIn.onCurrentUserChanged.listen((GoogleSignInAccount? account) {
//       _googleCurrentUser = account;
//       _setGoogleSigningIn(false);
//       _setGoogleSignedIn(account != null);
//       debugPrint('Google current user changed: ${account?.email}');
//     });
//     // Init Facebook
//     _checkFacebookCurrentUser();
//   }

//   // --- Google methods ---

//   Future<void> googleSignIn() async {
//     if (_googleCurrentUser != null) return;
//     try {
//       _setGoogleSigningIn(true);
//       final account = await _googleSignIn.signIn();
//       if (account != null) {
//         _googleCurrentUser = account;
//         _setGoogleSignedIn(true);
//         debugPrint('Google Sign-In successful: ${account.email}');
//       } else {
//         debugPrint('Google Sign-In cancelled');
//         _setGoogleSignedIn(false);
//       }
//     } catch (error) {
//       debugPrint('Google Sign-In error: $error');
//       if (error is PlatformException) {
//         debugPrint('Google Sign-In PlatformException: ${error.message}');
//       }
//       rethrow;
//     } finally {
//       _setGoogleSigningIn(false);
//     }
//   }

//   Future<void> googleSignOut() async {
//     try {
//       _googleCurrentUser = null;
//       await _googleSignIn.signOut();
//       _setGoogleSignedIn(false);
//     } catch (error) {
//       rethrow;
//     }
//   }

//   Future<String?> googleGetAccessToken() =>
//       _getGoogleAuthToken((auth) => auth.accessToken);

//   Future<String?> googleGetIdToken() =>
//       _getGoogleAuthToken((auth) => auth.idToken);

//   Future<String?> googleGetEmail() async => _googleCurrentUser?.email;

//   Future<String?> googleGetDisplayName() async =>
//       _googleCurrentUser?.displayName;

//   Future<String?> googleGetPhotoUrl() async => _googleCurrentUser?.photoUrl;

//   Future<String?> _getGoogleAuthToken(
//       String? Function(GoogleSignInAuthentication) extractor) async {
//     try {
//       final auth = await _googleCurrentUser?.authentication;
//       return auth != null ? extractor(auth) : null;
//     } catch (error) {
//       rethrow;
//     }
//   }

//   void _setGoogleSigningIn(bool val) => _googleIsSigningIn = val;

//   void _setGoogleSignedIn(bool val) => _googleIsSignedIn = val;

//   bool get googleIsSigningIn => _googleIsSigningIn;

//   bool get googleIsSignedIn => _googleIsSignedIn;

//   // --- Facebook methods ---

//   Future<void> _checkFacebookCurrentUser() async {
//     _facebookAccessToken = await FacebookAuth.instance.accessToken;
//     _facebookIsLoggedIn = _facebookAccessToken != null;
//   }

//   bool get facebookIsLoggingIn => _facebookIsLoggingIn;

//   bool get facebookIsLoggedIn => _facebookIsLoggedIn;

//   Future<String?> facebookGetAccessToken() async {
//     final accessToken = await FacebookAuth.instance.accessToken;
//     return accessToken?.token;
//   }

//   Future<String?> facebookGetUserName() =>
//       _getFacebookUserData().then((data) => data['name']);

//   Future<String?> facebookGetUserEmail() =>
//       _getFacebookUserData().then((data) => data['email']);

//   Future<String?> facebookGetPictureUrl() => _getFacebookUserData()
//       .then((data) => data['picture']['data']['url'] ?? '');

//   Future<void> facebookLogIn() async {
//     try {
//       _setFacebookLoggingIn(true);
//       final result = await FacebookAuth.instance.login(
//         permissions: ['public_profile', 'email'],
//       );
//       switch (result.status) {
//         case LoginStatus.success:
//           _facebookAccessToken = result.accessToken;
//           if (_facebookAccessToken == null) {
//             throw Exception('Failed to get Facebook access token');
//           }
//           _setFacebookLoggedIn(true);
//           debugPrint('Facebook Sign-In success');
//           break;
//         case LoginStatus.cancelled:
//           throw Exception('Facebook login cancelled by user');
//         case LoginStatus.failed:
//           throw Exception('Facebook login failed');
//         default:
//           throw Exception('Unknown Facebook login status');
//       }
//     } catch (e) {
//       debugPrint('Facebook Sign-In error: $e');
//       _setFacebookLoggedIn(false);
//       rethrow;
//     } finally {
//       _setFacebookLoggingIn(false);
//     }
//   }

//   Future<void> facebookLogOut() async {
//     try {
//       await FacebookAuth.instance.logOut();
//       _setFacebookLoggedIn(false);
//       debugPrint('Facebook Sign-Out success');
//     } catch (e) {
//       debugPrint('Facebook Sign-Out error: $e');
//       rethrow;
//     }
//   }

//   Future<Map<String, dynamic>> _getFacebookUserData() async {
//     return await FacebookAuth.instance.getUserData(
//       fields: "name,email,picture.width(200)",
//     );
//   }

//   void _setFacebookLoggingIn(bool val) => _facebookIsLoggingIn = val;

//   void _setFacebookLoggedIn(bool val) => _facebookIsLoggedIn = val;

//   // --- General AuthManager methods ---

//   Future<void> signIn(AuthProvider provider) async {
//     switch (provider) {
//       case AuthProvider.google:
//         await googleSignIn();
//         final token = await googleGetIdToken();
//         if (token == null) throw Exception('Failed to get Google ID token');
//         // You can save token here to your TokenManager if needed
//         break;
//       case AuthProvider.facebook:
//         await facebookLogIn();
//         String? token;
//         int retries = 0;
//         while (token == null && retries < 3) {
//           token = await facebookGetAccessToken();
//           if (token == null) {
//             await Future.delayed(const Duration(milliseconds: 500));
//             retries++;
//           }
//         }
//         if (token == null) {
//           throw Exception('Failed to get Facebook access token after retries');
//         }
//         // You can save token here to your TokenManager if needed
//         break;
//     }
//   }

//   Future<void> signOut() async {
//     await googleSignOut();
//     await facebookLogOut();
//     // Also clear tokens if you have a TokenManager
//   }

//   bool isLoggedIn() {
//     return googleIsSignedIn || facebookIsLoggedIn;
//   }

//   Future<AuthUser?> getAuthUser() async {
//     if (googleIsSignedIn) {
//       return AuthUser(
//         name: await googleGetDisplayName(),
//         email: await googleGetEmail(),
//         photoUrl: await googleGetPhotoUrl(),
//       );
//     } else if (facebookIsLoggedIn) {
//       return AuthUser(
//         name: await facebookGetUserName(),
//         email: await facebookGetUserEmail(),
//         photoUrl: await facebookGetPictureUrl(),
//       );
//     }
//     return null;
//   }
// }

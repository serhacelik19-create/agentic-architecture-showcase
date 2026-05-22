// File generated via flutterfire configure (MANUALLY CREATED)
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: '***REMOVED***',
    appId: '1:457051767073:web:ce1c2f546da69db6c17e60',
    messagingSenderId: '457051767073',
    projectId: 'tarif-487200',
    authDomain: 'tarif-487200.firebaseapp.com',
    storageBucket: 'tarif-487200.firebasestorage.app',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: '***REMOVED***',
    appId:
        '1:457051767073:android:PLACEHOLDER', // TODO: Update with actual Android App ID
    messagingSenderId: '457051767073',
    projectId: 'tarif-487200',
    storageBucket: 'tarif-487200.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: '***REMOVED***',
    appId:
        '1:457051767073:ios:f942fa867880eedcc17e60', // Updated with actual iOS App ID
    messagingSenderId: '457051767073',
    projectId: 'tarif-487200',
    storageBucket: 'tarif-487200.firebasestorage.app',
    iosBundleId: 'com.chefvision', // Updated Bundle ID
  );
}

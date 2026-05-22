import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_jailbreak_detection/flutter_jailbreak_detection.dart';
import 'package:http_certificate_pinning/http_certificate_pinning.dart';

class SecurityService {
  static final SecurityService _instance = SecurityService._internal();
  factory SecurityService() => _instance;
  SecurityService._internal();

  bool _isSecureDevice = true;
  bool get isSecureDevice => _isSecureDevice;

  /// Initialize security checks
  Future<bool> init() async {
    // 1. Check Root/Jailbreak
    try {
      final bool jailbroken = await _checkJailbreak();
      if (jailbroken) {
        _isSecureDevice = false;
        debugPrint("SECURITY ALERT: Device is Jailbroken/Rooted!");
        return false;
      }
    } catch (e) {
      debugPrint("Jailbreak check failed: $e");
      // Fail safe: assume secure if check fails (or insecure, depending on policy)
    }

    // 2. Setup SSL Pinning
    if (!kIsWeb) {
      // SSL Pinning is native only
      // await _setupSslPinning();
    }

    return true;
  }

  Future<bool> _checkJailbreak() async {
    try {
      // Check if the plugin is available
      bool jailbroken = await FlutterJailbreakDetection.jailbroken;
      bool developerMode = false;

      if (!kIsWeb && Platform.isAndroid) {
        developerMode = await FlutterJailbreakDetection.developerMode;
      }

      if (jailbroken) return true;

      if (kReleaseMode && developerMode && !kIsWeb && Platform.isAndroid) {
        // Strict mode: Block if developer options enabled in Release
        // return true;
      }

      return false;
    } on PlatformException {
      return false; // Assume secure if platform exception
    } catch (e) {
      return false;
    }
  }

  // ignore: unused_element
  Future<void> _setupSslPinning() async {
    const String serverUrl =
        'https://YOUR_API_BACKEND_URL_HERE';
    const List<String> allowedShas = [
      'YOUR_SERVER_CERTIFICATE_SHA_256',
    ];

    try {
      await HttpCertificatePinning.check(
        serverURL: serverUrl,
        headerHttp: {},
        sha: SHA.SHA256,
        allowedSHAFingerprints: allowedShas,
        timeout: 50,
      );
    } catch (e) {
      debugPrint("SECURITY ALERT: SSL Pinning Failed! $e");
    }
  }
}

final securityService = SecurityService();

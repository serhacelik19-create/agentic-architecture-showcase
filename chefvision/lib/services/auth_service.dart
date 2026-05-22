import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import '../config/api_config.dart';
import '../models/user.dart';
import '../main.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../utils/error_translator.dart';

class AuthService {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  );

  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  User? _currentUser;
  String? _token;

  AuthService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));
  }

  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isLoggedIn => _token != null && _currentUser != null;

  /// Initialize auth state from storage
  Future<bool> init() async {
    try {
      _token = await _storage.read(key: _tokenKey);
      final userData = await _storage.read(key: _userKey);

      if (_token != null && userData != null) {
        // Load cached user first (for fast start)
        _currentUser = User.fromJson(jsonDecode(userData));
        _updateDioToken();

        // Then fetch fresh data from server to sync subscription changes etc.
        try {
          await getProfile(); // This updates _currentUser and saves to storage
        } on DioException catch (e) {
          if (_isUnauthorizedError(e)) {
            await logout();
            return false;
          }
          // If server is unreachable, continue with cached data
          print('Auth init: Could not refresh profile, using cached data');
        } on AuthException catch (e) {
          if (e.code == 'errorAccessDenied' || e.code == 'errorLoginFailed') {
            await logout();
            return false;
          }
          print('Auth init: Could not refresh profile, using cached data');
        } catch (_) {
          // If server is unreachable, continue with cached data
          print('Auth init: Could not refresh profile, using cached data');
        }

        return true;
      }
      return false;
    } catch (e) {
      print('Auth init error: $e');
      return false;
    }
  }

  /// Register a new user
  Future<User> register({
    required String email,
    required String password,
    required String name,
    bool rememberMe = true,
  }) async {
    try {
      final deviceId = await getDeviceId();

      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/auth/register',
        data: {
          'email': email,
          'password': password,
          'name': name,
          'device_id': deviceId,
        },
      );

      if (response.statusCode == 200) {
        _token = response.data['access_token'];
        _currentUser = User.fromJson(response.data['user']);

        if (rememberMe) {
          await _saveAuthData();
        } else {
          await _clearAuthData(); // Ensure no old data persists
        }
        _updateDioToken();

        return _currentUser!;
      }

      throw Exception(response.data['detail'] ?? 'Registration failed');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Login with email and password
  Future<User> login({
    required String email,
    required String password,
    bool rememberMe = true,
  }) async {
    try {
      final deviceId = await getDeviceId();

      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/auth/login',
        data: {
          'email': email,
          'password': password,
          'device_id': deviceId,
        },
      );

      if (response.statusCode == 200) {
        _token = response.data['access_token'];
        _currentUser = User.fromJson(response.data['user']);

        if (rememberMe) {
          await _saveAuthData();
        } else {
          await _clearAuthData();
        }
        _updateDioToken();

        return _currentUser!;
      }

      throw Exception(response.data['detail'] ?? 'Login failed');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get current user profile
  Future<User> getProfile() async {
    try {
      final response = await _dio.get('${ApiConfig.apiPrefix}/auth/me');

      if (response.statusCode == 200) {
        _currentUser = User.fromJson(response.data);
        await _storage.write(key: _userKey, value: jsonEncode(response.data));
        return _currentUser!;
      }

      throw Exception('Profil alınamadı');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Update user profile
  Future<User> updateProfile({
    String? name,
    String? avatarUrl,
    String? dietPreferences,
    String? allergies,
  }) async {
    try {
      final response = await _dio.put(
        '${ApiConfig.apiPrefix}/auth/me',
        data: {
          if (name != null) 'name': name,
          if (avatarUrl != null) 'avatar_url': avatarUrl,
          if (dietPreferences != null) 'diet_preferences': dietPreferences,
          if (allergies != null) 'allergies': allergies,
        },
      );

      if (response.statusCode == 200) {
        _currentUser = User.fromJson(response.data);
        await _storage.write(key: _userKey, value: jsonEncode(response.data));
        return _currentUser!;
      }

      throw Exception('Profil güncellenemedi');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Change Password
  Future<bool> changePassword(String oldPassword, String newPassword) async {
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/auth/change-password',
        data: {
          'old_password': oldPassword,
          'new_password': newPassword,
        },
      );

      if (response.statusCode == 200) {
        return true;
      }
      return false;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Forgot Password - Send reset email
  Future<bool> forgotPassword(String email) async {
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/auth/forgot-password',
        data: {'email': email},
      );

      if (response.statusCode == 200) {
        return true;
      }
      return false;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Change Email
  Future<bool> changeEmail(String password, String newEmail) async {
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/auth/change-email',
        data: {
          'password': password,
          'new_email': newEmail,
        },
      );

      if (response.statusCode == 200) {
        _currentUser = User.fromJson(response.data);
        await _storage.write(key: _userKey, value: jsonEncode(response.data));
        return true;
      }
      return false;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Delete Account
  Future<bool> deleteAccount(String password) async {
    try {
      final response = await _dio.delete(
        '${ApiConfig.apiPrefix}/auth/me',
        data: {
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        // Automatically logout after deletion
        await logout();
        return true;
      }
      return false;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Logout
  Future<void> logout() async {
    _token = null;
    _currentUser = null;
    await _clearAuthData();
    _dio.options.headers.remove('Authorization');
  }

  Future<void> _clearAuthData() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
  }

  void _updateDioToken() {
    if (_token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $_token';
    } else {
      _dio.options.headers.remove('Authorization');
    }
  }

  bool _isUnauthorizedError(DioException e) {
    return e.response?.statusCode == 401 || e.response?.statusCode == 403;
  }

  Future<void> _saveAuthData() async {
    if (_token != null) {
      await _storage.write(key: _tokenKey, value: _token);
    }
    if (_currentUser != null) {
      await _storage.write(
          key: _userKey, value: jsonEncode(_currentUser!.toJson()));
    }
  }

  Exception _handleDioError(DioException e) {
    // Try to get AppLocalizations to translate the error gracefully
    AppLocalizations? l10n;
    try {
      final context = navigatorKey.currentState?.context;
      if (context != null) {
        l10n = AppLocalizations.of(context);
      }
    } catch (_) {}

    String translateIfPossible(String defaultVal) {
      if (l10n != null) {
        final translated = ErrorTranslator.translate(defaultVal, l10n);
        if (translated != defaultVal) return translated;
      }
      return defaultVal;
    }

    // 1. Check for specific backend error messages (JSON)
    if (e.response?.data != null) {
      final data = e.response?.data;

      // Case A: {'detail': 'Error message'} or {'detail': [{'msg': '...'}]}
      if (data is Map && data['detail'] != null) {
        final detail = data['detail'];
        if (detail is List) {
          final m = detail.map((item) => item['msg'] ?? item).join(', ');
          return Exception(translateIfPossible(m));
        }
        return Exception(translateIfPossible(detail.toString()));
      }

      // Case B: {'message': 'Error message'} (Common alternative)
      if (data is Map && data['message'] != null) {
        return Exception(translateIfPossible(data['message'].toString()));
      }

      // Case C: Response body is just a string (e.g. "Unauthorized")
      if (data is String && data.isNotEmpty) {
        // Limit length to avoid showing huge HTML error pages
        if (data.length < 200) return Exception(translateIfPossible(data));
      }
    }

    // 2. Check Status Codes
    if (e.response?.statusCode == 401) {
      return AuthException(
          'errorLoginFailed', 'Giriş yapılamadı: E-posta veya şifre hatalı.');
    }
    if (e.response?.statusCode == 403) {
      return AuthException('errorAccessDenied', 'Erişim reddedildi.');
    }
    if (e.response?.statusCode == 500) {
      return AuthException(
          'errorServer', 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }

    // 3. Check Connection Errors
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      return AuthException('errorTimeout',
          'Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.');
    }

    if (e.type == DioExceptionType.connectionError) {
      return AuthException('errorConnection',
          'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    }

    // 4. Unknown Error
    return AuthException(
        'errorUnknown', 'Beklenmedik bir hata oluştu: ${e.message}');
  }

  Future<String?> getDeviceId() async {
    final deviceInfo = DeviceInfoPlugin();
    if (!kIsWeb && Platform.isAndroid) {
      final androidInfo = await deviceInfo.androidInfo;
      return androidInfo.id; // Unique ID for Android
    } else if (!kIsWeb && Platform.isIOS) {
      final iosInfo = await deviceInfo.iosInfo;
      return iosInfo.identifierForVendor; // Unique ID for iOS
    }
    return null;
  }
}

class AuthException implements Exception {
  final String code;
  final String message;
  AuthException(this.code, this.message);

  @override
  String toString() => message;
}

// Singleton instance
final authService = AuthService();

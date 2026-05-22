import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/iap_service.dart';
import '../widgets/restricted_dialog.dart';

class AuthProvider extends ChangeNotifier {
  // ... (existing code matches until initiateSubscription)

  // ...
  User? _user;
  bool _isLoading = false;
  bool _isInitialized = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isInitialized => _isInitialized;
  bool get isLoggedIn => _user != null;
  String? get error => _error;

  /// Check if user is restricted due to excessive device changes
  bool get isRestricted => (_user?.deviceChangeCount ?? 0) > 3;

  /// Check restriction and show dialog if needed
  bool checkRestriction(BuildContext context) {
    if (isRestricted) {
      // Show restricted dialog
      showDialog(
        context: context,
        builder: (context) => const RestrictedDialog(),
      );
      return false;
    }
    return true;
  }

  /// Initialize auth state
  Future<bool> init() async {
    if (_isInitialized) return isLoggedIn;

    _isLoading = true;
    notifyListeners();

    try {
      // Restore auth state from storage
      bool success = await authService.init();

      if (success && authService.currentUser != null) {
        _user = authService.currentUser;
      }

      _isInitialized = true;
      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = null; // Clear error
      _isLoading = false;
      _isInitialized = true;
      notifyListeners();
      return false;
    }
  }

  /// Register a new user
  Future<bool> register({
    required String email,
    required String password,
    required String name,
    bool rememberMe = true,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await authService.register(
        email: email,
        password: password,
        name: name,
        rememberMe: rememberMe,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      if (e is AuthException) {
        _error = e.code;
      } else {
        _error = e.toString().replaceFirst('Exception: ', '');
      }
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Login
  Future<bool> login({
    required String email,
    required String password,
    bool rememberMe = true,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await authService.login(
        email: email,
        password: password,
        rememberMe: rememberMe,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      if (e is AuthException) {
        _error = e.code;
      } else {
        _error = e.toString().replaceFirst('Exception: ', '');
      }
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Update profile
  Future<bool> updateProfile({
    String? name,
    String? avatarUrl,
    List<String>? dietPreferences,
    List<String>? allergies,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await authService.updateProfile(
        name: name,
        avatarUrl: avatarUrl,
        dietPreferences: dietPreferences?.join(','),
        allergies: allergies?.join(','),
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Refresh user profile from server (syncs subscription changes etc.)
  Future<void> refreshProfile() async {
    try {
      _user = await authService.getProfile();
      notifyListeners();
    } catch (e) {
      print('Profile refresh failed: $e');
    }
  }

  /// Logout
  Future<void> logout() async {
    await authService.logout();
    _user = null;
    notifyListeners();
  }

  /// Start Real Subscription Flow via IAP Service
  Future<bool> initiateSubscription(String tier) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final token = authService.token;
      if (token == null) throw Exception('Oturum açmanız gerekiyor.');

      // Check IAP availability
      if (!iapService.isAvailable) {
        // Try to init if not already
        await iapService.init();
        if (!iapService.isAvailable) {
          throw Exception(
              'Mağaza bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
        }
      }

      // Find Product
      final productId = 'com.chefvision.$tier';

      // Check if products loaded
      if (iapService.products.isEmpty) {
        await iapService.init(); // Retry load
      }

      final product = iapService.products.firstWhere(
        (p) => p.id == productId,
        orElse: () => throw Exception('Product not found in store: $productId'),
      );

      // Trigger Purchase Flow
      // The actual result will come via the stream listener in IapService,
      // which updates the user profile upon success.
      await iapService.buyProduct(product);

      // The UI should show a pending state or listen to `iapService.purchasePending`.
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception:', '').trim();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Upgrade to PRO (Deprecated - keeping for compatibility if needed, redirects to new flow)
  Future<bool> upgradeToPro() async {
    return await initiateSubscription('pro');
  }

  /// Forgot Password
  Future<bool> forgotPassword(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await authService.forgotPassword(email);
      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Change Password
  Future<bool> changePassword(String oldPassword, String newPassword) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      if (oldPassword.isEmpty || newPassword.isEmpty) {
        throw Exception('Şifre alanları boş olamaz.');
      }

      final success =
          await authService.changePassword(oldPassword, newPassword);

      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Change Email
  Future<bool> changeEmail(String password, String newEmail) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      if (password.isEmpty || newEmail.isEmpty) {
        throw Exception('Tüm alanları doldurun.');
      }

      final success = await authService.changeEmail(password, newEmail);

      if (success) {
        _user = authService.currentUser;
      }

      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Delete Account
  Future<bool> deleteAccount(String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      if (password.isEmpty) {
        throw Exception('Şifre alanı boş olamaz.');
      }

      final success = await authService.deleteAccount(password);

      if (success) {
        _user = null; // Clear user state after deletion
      }

      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}

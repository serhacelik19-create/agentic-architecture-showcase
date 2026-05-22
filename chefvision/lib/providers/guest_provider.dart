import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

class GuestProvider extends ChangeNotifier {
  static const String _boxName = 'guestBox';
  static const String _scansKey = 'camera_scans_left';
  static const String _recipesKey = 'recipe_generations_left';
  static const String _isGuestKey = 'is_guest';

  // Limits
  static const int maxScans = 2;
  static const int maxRecipes = 3;

  late Box _box;
  bool _initialized = false;

  bool get isGuest => _box.get(_isGuestKey, defaultValue: false);
  int get scansLeft => _box.get(_scansKey, defaultValue: maxScans);
  int get recipesLeft => _box.get(_recipesKey, defaultValue: maxRecipes);

  bool get canScan => scansLeft > 0;
  bool get canGenerateRecipe => recipesLeft > 0;

  Future<void> init() async {
    if (!_initialized) {
      _box = await Hive.openBox(_boxName);
      _initialized = true;
    }
  }

  Future<void> activateGuestMode() async {
    await init();
    await _box.put(_isGuestKey, true);
    // Reset limits if they are starting fresh
    if (!_box.containsKey(_scansKey)) {
      await _box.put(_scansKey, maxScans);
    }
    if (!_box.containsKey(_recipesKey)) {
      await _box.put(_recipesKey, maxRecipes);
    }
    notifyListeners();
  }

  Future<void> clearGuestMode() async {
    await init();
    await _box.put(_isGuestKey, false);
    // You might want to keep the usage history even if they log out to prevent abuse,
    // or clear it if they successfully registered. Leaving it as is for strict enforcement.
    notifyListeners();
  }

  Future<bool> consumeScan() async {
    await init();
    if (!isGuest) return true; // Logged in users use standard backend limits

    int current = scansLeft;
    if (current > 0) {
      await _box.put(_scansKey, current - 1);
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<bool> consumeRecipe() async {
    await init();
    if (!isGuest) return true;

    int current = recipesLeft;
    if (current > 0) {
      await _box.put(_recipesKey, current - 1);
      notifyListeners();
      return true;
    }
    return false;
  }
}

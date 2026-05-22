import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/ingredient.dart';
import '../models/recipe.dart';
import '../services/api_service.dart';

class AppProvider extends ChangeNotifier {
  // State
  // Keeping lists non-final to allow easy assignment, or use clear/addAll
  // Reverting to non-final for simplicity in this pass, or strict final
  // Let's go with final and fix setters
  final List<Ingredient> _detectedIngredients = [];
  final List<Recipe> _suggestedRecipes = [];
  final List<Recipe> _favoriteRecipes = [];

  bool _isLoading = false;
  String? _error;

  // Preferences
  int _maxPrepTime = 60; // Default 60 mins
  final Set<String> _dietaryPreferences = {};
  final Set<String> _allergies = {};
  bool _prioritizeWaste = false;
  int _servings = 2; // Default 2 people
  ThemeMode _themeMode = ThemeMode.light;
  Locale? _locale; // null = not yet initialized
  bool _localeInitialized = false;
  int _pantryCount = 0;

  // Recipe Filters
  String? _selectedCuisine;
  String? _selectedMealType;
  int _variation = 1;

  static const String _localeKey = 'app_locale';
  static const List<String> supportedLanguages = [
    'en',
    'tr',
    'es',
    'fr',
    'de',
    'it'
  ];

  // Getters
  List<Ingredient> get detectedIngredients => _detectedIngredients;
  List<Ingredient> get selectedIngredients =>
      _detectedIngredients.where((i) => i.isSelected).toList();
  List<Recipe> get suggestedRecipes => _suggestedRecipes;
  List<Recipe> get favoriteRecipes => _favoriteRecipes;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int? get maxPrepTime => _maxPrepTime;
  List<String> get dietaryPreferences => _dietaryPreferences.toList();
  List<String> get allergies => _allergies.toList();
  bool get prioritizeWaste => _prioritizeWaste;
  ThemeMode get themeMode => _themeMode;
  Locale get locale => _locale ?? const Locale('en');
  bool get localeInitialized => _localeInitialized;
  int get pantryCount => _pantryCount;
  int get servings => _servings;
  String? get selectedCuisine => _selectedCuisine;
  String? get selectedMealType => _selectedMealType;
  int get variation => _variation;

  /// Initialize locale: load saved preference or detect from device
  Future<void> initLocale() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedLocale = prefs.getString(_localeKey);

      if (savedLocale != null && supportedLanguages.contains(savedLocale)) {
        // User previously selected a language
        _locale = Locale(savedLocale);
      } else {
        // First launch: detect device language
        final deviceLocale = ui.PlatformDispatcher.instance.locale;
        final deviceLang = deviceLocale.languageCode.toLowerCase();

        if (supportedLanguages.contains(deviceLang)) {
          _locale = Locale(deviceLang);
        } else {
          // Unsupported device language -> fallback to English
          _locale = const Locale('en');
        }
        // Save the auto-detected locale
        await prefs.setString(_localeKey, _locale!.languageCode);
      }
    } catch (e) {
      _locale = const Locale('en');
    }
    _localeInitialized = true;

    // Set initial locale for API
    if (_locale != null) {
      apiService.setLocale(_locale!.languageCode);
    }

    // Load other preferences
    await loadPreferences();

    notifyListeners();
  }

  // Ingredient Actions
  void setDetectedIngredients(List<Ingredient> ingredients) {
    _detectedIngredients.clear();
    _detectedIngredients.addAll(ingredients);
    notifyListeners();
  }

  void addIngredient(Ingredient ingredient) {
    _detectedIngredients.add(ingredient);
    notifyListeners();
  }

  void removeIngredient(Ingredient ingredient) {
    _detectedIngredients.remove(ingredient);
    notifyListeners();
  }

  void updateIngredient(int index, Ingredient updatedIngredient) {
    if (index >= 0 && index < _detectedIngredients.length) {
      _detectedIngredients[index] = updatedIngredient;
      notifyListeners();
    }
  }

  void toggleIngredientSelection(int index) {
    if (index >= 0 && index < _detectedIngredients.length) {
      _detectedIngredients[index].isSelected =
          !_detectedIngredients[index].isSelected;
      notifyListeners();
    }
  }

  void clearIngredients() {
    _detectedIngredients.clear();
    notifyListeners();
  }

  // Recipe Actions
  void setSuggestedRecipes(List<Recipe> recipes) {
    _suggestedRecipes.clear();
    _suggestedRecipes.addAll(recipes);
    notifyListeners();
  }

  void clearRecipes() {
    _suggestedRecipes.clear();
    notifyListeners();
  }

  // Favorites Actions
  void toggleFavorite(Recipe recipe) {
    final index = _favoriteRecipes.indexWhere((r) => r.title == recipe.title);
    if (index >= 0) {
      _favoriteRecipes.removeAt(index);
    } else {
      _favoriteRecipes.add(recipe);
    }
    notifyListeners();
  }

  bool isFavorite(Recipe recipe) {
    return _favoriteRecipes.any((r) => r.title == recipe.title);
  }

  void clearFavorites() {
    _favoriteRecipes.clear();
    notifyListeners();
  }

  // Settings

  void setMaxPrepTime(int? value) {
    _maxPrepTime = value ?? 60;
    notifyListeners();
  }

  Future<void> toggleDietaryPreference(String pref) async {
    final normalized = pref.toLowerCase().replaceAll(' ', '_');
    if (_dietaryPreferences.contains(normalized)) {
      _dietaryPreferences.remove(normalized);
    } else {
      _dietaryPreferences.add(normalized);
    }
    notifyListeners();

    // Persist
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('diet_prefs', _dietaryPreferences.toList());
  }

  void setPrioritizeWaste(bool value) {
    _prioritizeWaste = value;
    notifyListeners();
  }

  bool isDietaryPreferenceSelected(String pref) {
    return _dietaryPreferences
        .contains(pref.toLowerCase().replaceAll(' ', '_'));
  }

  // Allergy Actions
  Future<void> toggleAllergy(String allergy) async {
    final normalized = allergy.toLowerCase().replaceAll(' ', '_');
    if (_allergies.contains(normalized)) {
      _allergies.remove(normalized);
    } else {
      _allergies.add(normalized);
    }
    notifyListeners();

    // Persist
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('allergy_prefs', _allergies.toList());
  }

  bool isAllergySelected(String allergy) {
    return _allergies.contains(allergy.toLowerCase().replaceAll(' ', '_'));
  }

  // Theme Actions
  void toggleTheme(bool isDark) {
    _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }

  // Create a loadPreferences method
  Future<void> loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();

    // Diet
    final savedDiet = prefs.getStringList('diet_prefs');
    if (savedDiet != null) {
      _dietaryPreferences.clear();
      // Normalize to snake_case if coming from old versions
      for (var item in savedDiet) {
        _dietaryPreferences.add(item.toLowerCase().replaceAll(' ', '_'));
      }
    }

    // Allergies
    final savedAllergies = prefs.getStringList('allergy_prefs');
    if (savedAllergies != null) {
      _allergies.clear();
      // Normalize to snake_case
      for (var item in savedAllergies) {
        _allergies.add(item.toLowerCase().replaceAll(' ', '_'));
      }
    }
    notifyListeners();
  }

  // Batch set filters
  Future<void> setFilters(List<String> diets, List<String> allergies) async {
    _dietaryPreferences.clear();
    _dietaryPreferences.addAll(diets);

    _allergies.clear();
    _allergies.addAll(allergies);

    notifyListeners();

    // Persist
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('diet_prefs', _dietaryPreferences.toList());
    await prefs.setStringList('allergy_prefs', _allergies.toList());
  }

  // Locale Actions
  Future<void> setLocale(Locale locale) async {
    if (!supportedLanguages.contains(locale.languageCode)) return;
    _locale = locale;
    notifyListeners();
    // Persist user's language choice
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_localeKey, locale.languageCode);

      // Update API service locale
      apiService.setLocale(locale.languageCode);
    } catch (e) {
      // Silently fail if storage is unavailable
    }
  }

  // Pantry Stats
  void setPantryCount(int count) {
    _pantryCount = count;
    notifyListeners();
  }

  // Loading & Error
  void setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void setError(String? value) {
    _error = value;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Recipe Filters Actions
  void setCuisine(String? cuisine) {
    _selectedCuisine = cuisine;
    notifyListeners();
  }

  void setMealType(String? mealType) {
    _selectedMealType = mealType;
    notifyListeners();
  }

  void setServings(int value) {
    if (value < 1) return;
    _servings = value;
    notifyListeners();
  }

  // Recipe Fetching
  Future<bool> fetchRecipes({bool isNew = false}) async {
    // Prevent multiple simultaneous calls
    if (_isLoading) return false;

    try {
      setLoading(true);
      setError(null);

      if (!isNew) {
        _variation = 1;
      } else {
        _variation++;
      }

      // Prepare ingredients list
      final ingredientNames = selectedIngredients.map((i) => i.name).toList();

      if (ingredientNames.isEmpty) {
        setError('error_no_ingredients');
        setLoading(false);
        return false;
      }

      // Prepare dietary prefs (legacy + new)
      final prefs = dietaryPreferences;
      final allergiesList = allergies;

      final recipes = await apiService.suggestRecipes(
        ingredients: ingredientNames,
        maxPrepTime: _maxPrepTime,
        dietaryPreferences: prefs,
        excludeAllergies: allergiesList,
        prioritizeWaste: _prioritizeWaste,
        cuisine: _selectedCuisine,
        mealType: _selectedMealType,
        servings: _servings,
        variation: _variation,
      );

      // If isNew, we replace the list for a fresher experience (as requested)
      // Or we can append if we want pagination. The user asked for "different recipes",
      // implying a replacement or at least a clear visual change.
      // Let's replace the list if isNew is true, essentially treating it as a "Refresh".
      if (isNew) {
        _suggestedRecipes.clear();
        _suggestedRecipes.addAll(recipes);
      } else {
        // Initial load
        _suggestedRecipes.clear();
        _suggestedRecipes.addAll(recipes);
      }

      setLoading(false);
      return true;
    } catch (e) {
      String errorMsg = e.toString();

      // Use error key identifiers — resolved to localized strings in the UI
      if (errorMsg.contains('TimeoutException') ||
          errorMsg.contains('timeout') ||
          errorMsg.contains('süre aşıldı')) {
        errorMsg = 'error_timeout';
      } else if (errorMsg.contains('SocketException') ||
          errorMsg.contains('Connection refused')) {
        errorMsg = 'error_connection';
      } else if (errorMsg.contains('500') ||
          errorMsg.contains('Internal Server Error')) {
        errorMsg = 'error_server';
      } else if (errorMsg.contains('429')) {
        final detailMatch =
            RegExp(r'"detail"\s*:\s*"([^"]+)"').firstMatch(errorMsg);
        errorMsg = detailMatch?.group(1) ?? 'error_limit';
      } else if (errorMsg.contains('5/5') ||
          errorMsg.contains('deneme') ||
          errorMsg.contains('limit')) {
        errorMsg = 'err_usage_limit_reached';
      } else if (errorMsg.contains('403')) {
        final detailMatch =
            RegExp(r'"detail"\s*:\s*"([^"]+)"').firstMatch(errorMsg);
        errorMsg = detailMatch?.group(1) ?? 'error_access_denied';
      } else {
        errorMsg = 'error_unknown';
      }

      setError(errorMsg);
      setLoading(false);
      return false;
    }
  }
}

import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/recipe.dart';
import '../models/chat_message.dart';
import '../services/api_service.dart';

class RecipeProvider extends ChangeNotifier {
  Recipe? _currentRecipe;
  List<Recipe> _originalRecipes = []; // Store original full list
  List<Recipe> _filteredRecipes = []; // Store filtered list for display
  String _activeFilter = 'all'; // 'all', 'easy', 'fast', 'low_cal'

  bool _isLoading = false;
  DateTime? _lastViewed;
  List<Recipe> _lastSuggestions = [];
  List<Recipe> _dailyWorldRecipes = []; // Daily world cuisine recipes
  DateTime? _dailyWorldDate;
  DateTime? _lastDailyAttempt; // Last time we tried to fetch (even if failed)
  String? _cachedLanguage; // Language of the cached daily recipes
  int _cookingStepIndex = 0;
  // Per-recipe chat histories: key = recipe title
  final Map<String, List<ChatMessage>> _recipeChatMap = {};
  // Timestamps for each recipe chat (for 3h expiry)
  final Map<String, DateTime> _recipeChatTimestamps = {};
  static const _chatExpiryHours = 3;
  static const _chatCacheKey = 'recipe_chat_cache';

  Recipe? get currentRecipe => _currentRecipe;
  List<Recipe> get lastSuggestions => _filteredRecipes; // Return filtered list
  List<Recipe> get dailyWorldRecipes => _dailyWorldRecipes;
  String get activeFilter => _activeFilter;
  bool get isLoading => _isLoading;
  int get cookingStepIndex => _cookingStepIndex;

  /// Returns chat messages for the current recipe only
  List<ChatMessage> get cookingMessages {
    final key = _currentRecipe?.title;
    if (key == null) return [];
    return _recipeChatMap[key] ?? [];
  }

  RecipeProvider() {
    _isLoading = true; // Set initial state without notify
    _loadFromPrefs();
    _loadDailyWorldFromPrefs(); // Load daily world recipes
    _loadChatCache(); // Load persisted chat histories
  }

  // In-memory cache for detailed recipes (avoids API calls within session)
  final Map<String, Recipe> _detailedRecipeCache = {};

  // Set and save current recipe (the one being cooked)
  Future<void> setCurrentRecipe(Recipe recipe) async {
    // Check if we have a cached detailed version
    final cached = _detailedRecipeCache[recipe.title];

    // Check if we are resuming the same recipe
    bool isSameRecipe = _currentRecipe?.title == recipe.title;

    if (cached != null) {
      _currentRecipe = cached;
    } else {
      _currentRecipe = recipe;
    }

    // Only reset step if it's a new recipe session
    if (!isSameRecipe) {
      _cookingStepIndex = 0;
    }

    _lastViewed = DateTime.now();
    notifyListeners();
    await _saveToPrefs();
  }

  // Fetch full details if not already detailed
  Future<void> fetchRecipeDetail(String title,
      {String mode = 'detailed'}) async {
    // For detailed mode, check memory cache first
    if (mode == 'detailed' && _detailedRecipeCache.containsKey(title)) {
      _currentRecipe = _detailedRecipeCache[title];
      _isLoading = false;
      notifyListeners();
      debugPrint('✅ Memory cache hit for "$title"');
      return;
    }

    _isLoading = true;
    notifyListeners();
    try {
      final detailedRecipe = await apiService.getRecipeDetail(
        title,
        baseRecipe: _currentRecipe,
        mode: mode,
      );
      if (detailedRecipe != null) {
        if (mode == 'quick') {
          // For quick mode: set instructions as quickInstructions
          _currentRecipe = _currentRecipe?.copyWith(
                quickInstructions: detailedRecipe.instructions,
                instructions: detailedRecipe.instructions,
              ) ??
              detailedRecipe;
        } else {
          // For detailed mode: preserve quick instructions from current recipe
          final quickInstr =
              _currentRecipe?.quickInstructions ?? _currentRecipe?.instructions;

          _currentRecipe = detailedRecipe.copyWith(
            quickInstructions: quickInstr,
          );

          // Save to memory cache
          _detailedRecipeCache[title] = _currentRecipe!;
          debugPrint('💾 Cached "$title" in memory');
        }

        _lastViewed = DateTime.now();
        await _saveToPrefs();
      }
    } catch (e) {
      debugPrint('Error fetching recipe detail: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Set and save last batch of suggestions
  Future<void> setLastSuggestions(List<Recipe> recipes) async {
    _originalRecipes = recipes;
    // Apply current filter if any, or reset to all
    if (_activeFilter != 'all') {
      applyFilter(_activeFilter);
    } else {
      _filteredRecipes = List.from(recipes);
    }
    _lastSuggestions = recipes; // Keep for backward compatibility/serialization
    notifyListeners();
    await _saveToPrefs();
  }

  // Apply local filter
  void applyFilter(String filterType) {
    _activeFilter = filterType;

    if (filterType == 'all') {
      _filteredRecipes = List.from(_originalRecipes);
    } else if (filterType == 'easy') {
      _filteredRecipes =
          _originalRecipes.where((r) => r.difficulty == 'Kolay').toList();
    } else if (filterType == 'fast') {
      _filteredRecipes = _originalRecipes
          .where((r) => (r.prepTime + r.cookTime) < 30)
          .toList();
    } else if (filterType == 'low_cal') {
      _filteredRecipes =
          _originalRecipes.where((r) => (r.calories ?? 999) < 400).toList();
      // If no low cal recipes found, just show 3 lowest calorie ones
      if (_filteredRecipes.isEmpty && _originalRecipes.isNotEmpty) {
        var sorted = List<Recipe>.from(_originalRecipes);
        sorted.sort((a, b) => (a.calories ?? 999).compareTo(b.calories ?? 999));
        _filteredRecipes = sorted.take(3).toList();
      }
    }

    notifyListeners();
  }

  // Clear everything
  Future<void> clearAll() async {
    _currentRecipe = null;
    _lastSuggestions = [];
    _originalRecipes = [];
    _filteredRecipes = [];
    _activeFilter = 'all';
    _lastViewed = null;
    _cookingStepIndex = 0;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('saved_recipe_data');
  }

  // Clear current recipe only (chat persists per-recipe with 3h expiry)
  void clearCurrentRecipe() {
    _currentRecipe = null;
    _cookingStepIndex = 0;
    notifyListeners();
  }

  // Save to SharedPrefs
  Future<void> _saveToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = {
        'current_recipe': _currentRecipe?.toJson(),
        'last_suggestions': _lastSuggestions.map((r) => r.toJson()).toList(),
        'timestamp': _lastViewed?.toIso8601String(),
        'cooking_step': _cookingStepIndex,
      };
      await prefs.setString('saved_recipe_data', jsonEncode(data));
    } catch (e) {
      debugPrint('Error saving recipe data: $e');
    }
  }

  // Load from SharedPrefs
  Future<void> _loadFromPrefs() async {
    // Removed synchronous notifyListeners() here to avoid framework errors during build
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString('saved_recipe_data');

      if (jsonString != null) {
        final data = jsonDecode(jsonString);

        // Load Suggestions
        if (data['last_suggestions'] != null) {
          final List<dynamic> suggestionsJson = data['last_suggestions'];
          _lastSuggestions =
              suggestionsJson.map((json) => Recipe.fromJson(json)).toList();
        }

        // Load current recipe with 3h rule
        if (data['timestamp'] != null && data['current_recipe'] != null) {
          final timestamp = DateTime.parse(data['timestamp']);
          final now = DateTime.now();

          if (now.difference(timestamp).inHours < 3) {
            _currentRecipe = Recipe.fromJson(data['current_recipe']);
            _lastViewed = timestamp;
            _cookingStepIndex = data['cooking_step'] ?? 0;
          }
        }
      }
    } catch (e) {
      debugPrint('Error loading saved recipe data: $e');
    } finally {
      _isLoading = false;
      notifyListeners(); // This is safe as it's called after the first microtask/await
    }
  }

  /// Refresh daily recipes when language changes
  Future<void> refreshForLanguage(String newLanguage) async {
    if (_cachedLanguage == newLanguage && _dailyWorldRecipes.isNotEmpty) {
      debugPrint("🌐 Language unchanged ($newLanguage), skipping refresh");
      return;
    }
    debugPrint(
        "🌐 Language changed: $_cachedLanguage → $newLanguage. Refreshing daily recipes...");
    _cachedLanguage = newLanguage;
    _dailyWorldRecipes = [];
    _dailyWorldDate = null;
    _lastDailyAttempt = null;
    await _saveDailyWorldToPrefs();
    await loadDailyWorldCuisine();
  }

  // Load Daily World Cuisine Recipes
  Future<void> loadDailyWorldCuisine() async {
    final now = DateTime.now();

    // Check if we already have recipes for today (SUCCESS CASE)
    if (_dailyWorldDate != null &&
        _dailyWorldDate!.day == now.day &&
        _dailyWorldDate!.month == now.month &&
        _dailyWorldDate!.year == now.year &&
        _dailyWorldRecipes.length >= 3) {
      debugPrint("✅ Using cached daily world recipes (lang: $_cachedLanguage)");
      return;
    }

    // Check if we tried recently (FAILURE RETRY CASE)
    // If we failed, we wait 1 hour before trying again.
    if (_lastDailyAttempt != null) {
      final difference = now.difference(_lastDailyAttempt!);
      if (difference.inHours < 1 && _lastDailyAttempt!.day == now.day) {
        debugPrint(
            "⏳ Daily recipes update skipped. Waiting for 1 hour cooldown. Last attempt: ${difference.inMinutes} mins ago.");
        return;
      }
    }

    if (_isLoading) return;

    _isLoading = true;
    notifyListeners();

    try {
      debugPrint("🌍 Fetching fresh daily world recipes...");

      // Mark this attempt time immediately
      _lastDailyAttempt = now;
      await _saveDailyWorldToPrefs();

      // Use the dedicated backend endpoint for daily recipes
      // This endpoint handles caching and diversity on the server side
      // and does NOT consume user quotas.
      final recipesData = await apiService.getDailyRecipes();

      List<Recipe> newDailyRecipes = [];

      if (recipesData.isNotEmpty) {
        newDailyRecipes =
            recipesData.map((json) => Recipe.fromJson(json)).toList();
      }

      // If we successfully got recipes, update state and cache (SUCCESS)
      if (newDailyRecipes.isNotEmpty) {
        _dailyWorldRecipes = newDailyRecipes;
        _dailyWorldDate = now; // Mark as successful for today
        await _saveDailyWorldToPrefs();
      } else {
        // If failed completely, ONLY _lastDailyAttempt is updated (above),
        // so we will retry in 1 hour.
        debugPrint(
            "⚠️ Could not fetch any daily recipes. Will retry in 1 hour.");
      }
    } catch (e) {
      debugPrint('Error loading daily world recipes: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _saveDailyWorldToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = {
        'recipes': _dailyWorldRecipes.map((r) => r.toJson()).toList(),
        'date': _dailyWorldDate?.toIso8601String(),
        'last_attempt': _lastDailyAttempt?.toIso8601String(),
        'language': _cachedLanguage,
      };
      await prefs.setString('daily_world_recipes', jsonEncode(data));
    } catch (e) {
      debugPrint('Error saving daily world recipes: $e');
    }
  }

  Future<void> _loadDailyWorldFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString('daily_world_recipes');

      if (jsonString != null) {
        final data = jsonDecode(jsonString);
        if (data['date'] != null) {
          _dailyWorldDate = DateTime.parse(data['date']);
        }
        if (data['last_attempt'] != null) {
          _lastDailyAttempt = DateTime.parse(data['last_attempt']);
        }
        if (data['language'] != null) {
          _cachedLanguage = data['language'];
        }

        if (data['recipes'] != null) {
          final List<dynamic> recipesJson = data['recipes'];
          _dailyWorldRecipes =
              recipesJson.map((json) => Recipe.fromJson(json)).toList();
        }

        // Trigger check to see if we need to refresh (if date is old or retry needed)
        loadDailyWorldCuisine();
      } else {
        // No cache, load fresh
        loadDailyWorldCuisine();
      }
    } catch (e) {
      debugPrint('Error loading saved daily world data: $e');
      loadDailyWorldCuisine(); // Fallback to load fresh
    }
  }

  Future<void> setCookingStep(int step) async {
    _cookingStepIndex = step;
    notifyListeners();
    await _saveToPrefs();
  }

  /// Returns chat messages for a specific recipe
  List<ChatMessage> getChatForRecipe(String recipeTitle) {
    _cleanExpiredChats();
    return _recipeChatMap[recipeTitle] ?? [];
  }

  /// Add a chat message for the current recipe
  void addCookingMessage(ChatMessage message) {
    final key = _currentRecipe?.title;
    if (key == null) return;

    _recipeChatMap.putIfAbsent(key, () => []);
    _recipeChatMap[key]!.add(message);

    // Update timestamp on first message
    _recipeChatTimestamps.putIfAbsent(key, () => DateTime.now());

    _saveChatCache();
    notifyListeners();
  }

  /// Clean up expired chat histories (older than 3 hours)
  void _cleanExpiredChats() {
    final now = DateTime.now();
    final expiredKeys = <String>[];
    for (final entry in _recipeChatTimestamps.entries) {
      if (now.difference(entry.value).inHours >= _chatExpiryHours) {
        expiredKeys.add(entry.key);
      }
    }
    for (final key in expiredKeys) {
      _recipeChatMap.remove(key);
      _recipeChatTimestamps.remove(key);
    }
    if (expiredKeys.isNotEmpty) {
      _saveChatCache();
    }
  }

  /// Persist all chat histories to SharedPreferences
  Future<void> _saveChatCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final Map<String, dynamic> cacheData = {};
      for (final entry in _recipeChatMap.entries) {
        cacheData[entry.key] = {
          'messages': entry.value.map((m) => m.toJson()).toList(),
          'timestamp': _recipeChatTimestamps[entry.key]?.toIso8601String() ??
              DateTime.now().toIso8601String(),
        };
      }
      await prefs.setString(_chatCacheKey, jsonEncode(cacheData));
    } catch (e) {
      debugPrint('Error saving chat cache: $e');
    }
  }

  /// Load chat histories from SharedPreferences
  Future<void> _loadChatCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_chatCacheKey);
      if (raw == null) return;

      final Map<String, dynamic> cacheData = jsonDecode(raw);
      final now = DateTime.now();

      for (final entry in cacheData.entries) {
        final data = entry.value as Map<String, dynamic>;
        final timestamp = DateTime.parse(data['timestamp'] as String);

        // Skip expired chats
        if (now.difference(timestamp).inHours >= _chatExpiryHours) continue;

        final messages = (data['messages'] as List)
            .map((m) => ChatMessage.fromJson(m as Map<String, dynamic>))
            .toList();

        _recipeChatMap[entry.key] = messages;
        _recipeChatTimestamps[entry.key] = timestamp;
      }
    } catch (e) {
      debugPrint('Error loading chat cache: $e');
    }
  }
}

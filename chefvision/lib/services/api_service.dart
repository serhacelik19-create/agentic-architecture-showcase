import 'dart:convert';
import 'dart:ui' as ui;
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../config/api_config.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../models/ingredient.dart';
import '../models/recipe.dart';
import '../main.dart'; // Import navigatorKey
import '../screens/maintenance_screen.dart'; // Import MaintenanceScreen
import '../utils/error_translator.dart'; // Import ErrorTranslator
import 'auth_service.dart'; // Import auth service for token

class FeatureLockedException implements Exception {
  final String message;
  final String tierRequired;
  FeatureLockedException(this.message, {this.tierRequired = 'pro'});
  @override
  String toString() => message;
}

class LimitExceededException implements Exception {
  final String message;
  LimitExceededException(this.message);
  @override
  String toString() => message;
}

class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.connectionTimeout,
      receiveTimeout: ApiConfig.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': ui.PlatformDispatcher.instance.locale
            .languageCode, // Send current language code (en, tr, etc.)
      },
    ));

    // Add auth token interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = authService.token;
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));

    // Add interceptors for logging
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));

    // Interceptor to handle Maintenance Mode (503)
    _dio.interceptors.add(InterceptorsWrapper(
      onError: (DioException e, ErrorInterceptorHandler handler) {
        if (e.response?.statusCode == 503) {
          final context = navigatorKey.currentState?.context;
          if (context != null) {
            Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(
                    builder: (context) => const MaintenanceScreen()),
                (route) => false // Remove all previous routes
                );
          }
        }
        return handler.next(e);
      },
    ));
  }

  /// Update the Accept-Language header
  void setLocale(String languageCode) {
    _dio.options.headers['Accept-Language'] = languageCode;
  }

  // Helper to safely get l10n
  AppLocalizations get _l10n {
    final context = navigatorKey.currentState?.context;
    if (context != null && context.mounted) {
      return AppLocalizations.of(context)!;
    }
    // Fallback or throw? Ideally shouldn't happen during active app usage
    // Ensuring we return something to avoid crash, but localizations might fail if context is null
    // Assuming context is available for these error flows
    return AppLocalizations.of(navigatorKey.currentState!.context)!;
  }

  /// Analyze an image to detect food ingredients
  Future<List<Ingredient>> analyzeImage(XFile imageFile) async {
    try {
      // Read and encode image to base64
      final bytes = await imageFile.readAsBytes();
      final base64Image = base64Encode(bytes);

      // Include device_id for guest mode
      final data = <String, dynamic>{
        'image_base64': base64Image,
      };
      if (authService.token == null) {
        data['device_id'] = await authService.getDeviceId();
      }

      final response = await _dio.post(
        ApiConfig.ingredientsAnalyze,
        data: data,
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final ingredientsList = response.data['ingredients'] as List;
        return ingredientsList
            .map((json) => Ingredient.fromJson(json))
            .toList();
      }

      throw Exception(
          response.data['message'] ?? _l10n.errorImageAnalysisFailed);
    } on DioException catch (e) {
      final l10n = _l10n;
      if (e.response?.statusCode == 403) {
        final detail = e.response?.data['detail'] ?? '';
        String tier = 'pro';
        if (detail.contains('Premium')) tier = 'premium';
        if (detail.contains('Plus')) tier = 'plus';

        throw FeatureLockedException(
          detail.isEmpty ? l10n.errorFeatureLocked : detail,
          tierRequired: tier,
        );
      }
      if (e.response?.statusCode == 429) {
        throw LimitExceededException(
          e.response?.data['detail'] ?? l10n.errorLimitExceeded,
        );
      }
      if (e.type == DioExceptionType.connectionTimeout) {
        throw Exception(l10n.errorConnectionTimeout);
      }
      throw Exception(l10n.errorServerConnection(e.message ?? ''));
    } catch (e) {
      rethrow;
    }
  }

  /// Get recipe suggestions based on ingredients
  Future<List<Recipe>> suggestRecipes({
    required List<String> ingredients,
    int maxResults = 5,
    int? maxPrepTime,
    List<String>? dietaryPreferences,
    List<String>? excludeAllergies,
    bool prioritizeWaste = false,
    String? cuisine,
    String? mealType,
    int? servings,
    int variation = 1,
  }) async {
    try {
      final data = <String, dynamic>{
        'ingredients': ingredients,
        'max_results': maxResults,
        'max_prep_time': maxPrepTime,
        'dietary_preferences': dietaryPreferences,
        'exclude_allergies': excludeAllergies,
        'prioritize_waste': prioritizeWaste,
        'cuisine': cuisine,
        'meal_type': mealType,
        'servings': servings,
        'variation': variation,
      };

      // Include device_id for guest mode
      if (authService.token == null) {
        data['device_id'] = await authService.getDeviceId();
      }

      final response = await _dio.post(
        ApiConfig.recipesSuggest,
        data: data,
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final recipesList = response.data['recipes'] as List;
        return recipesList.map((json) => Recipe.fromJson(json)).toList();
      }

      throw Exception(
          response.data['message'] ?? _l10n.errorRecipeSuggestionFailed);
    } on DioException catch (e) {
      final l10n = _l10n;
      if (e.response?.statusCode == 403) {
        final detail = e.response?.data['detail'] ?? '';
        String tier = 'plus';
        if (detail.contains('Pro')) tier = 'pro';
        if (detail.contains('Premium')) tier = 'premium';

        throw FeatureLockedException(
          detail.isEmpty ? l10n.errorTrialExpired : detail,
          tierRequired: tier,
        );
      }
      if (e.response?.statusCode == 429) {
        throw LimitExceededException(
          e.response?.data['detail'] ?? l10n.errorRecipeLimitExceeded,
        );
      }
      if (e.type == DioExceptionType.connectionTimeout) {
        throw Exception(l10n.errorConnectionTimeout);
      }
      throw Exception(l10n.errorServerConnection(e.message ?? ''));
    } catch (e) {
      rethrow;
    }
  }

  /// Get daily recipe suggestions (diverse cuisines)
  Future<List<Map<String, dynamic>>> getDailyRecipes() async {
    try {
      final response = await _dio.get(ApiConfig.recipesDaily);

      if (response.statusCode == 200 && response.data['success'] == true) {
        final recipesList = response.data['recipes'] as List;
        return recipesList.cast<Map<String, dynamic>>();
      }

      return [];
    } catch (e) {
      print('Günlük tarifler alınamadı: $e');
      return [];
    }
  }

  /// Get detailed recipe information via expansion
  Future<Recipe?> getRecipeDetail(String recipeTitle,
      {Recipe? baseRecipe, String mode = 'detailed'}) async {
    try {
      final response = await _dio.post(
        ApiConfig.recipesDetail,
        data: {
          'recipe_title': recipeTitle,
          'base_recipe': baseRecipe?.toJson(),
          'mode': mode,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        return Recipe.fromJson(response.data['recipe']);
      }

      return null;
    } on DioException catch (e) {
      if (e.response?.statusCode == 403) {
        final detail = e.response?.data['detail'] ?? '';
        String tier = 'pro';
        if (detail.contains('Premium')) tier = 'premium';

        final l10n = _l10n;
        throw FeatureLockedException(
          detail.isEmpty ? l10n.errorDetailedRecipeLocked : detail,
          tierRequired: tier,
        );
      }
      throw Exception(_l10n.errorRecipeDetailFailed(e.message ?? ''));
    } catch (e) {
      rethrow;
    }
  }

  /// Get popular recipes
  Future<List<Map<String, dynamic>>> getPopularRecipes() async {
    try {
      final response = await _dio.get(ApiConfig.recipesPopular);

      if (response.statusCode == 200) {
        final recipesList = response.data['recipes'] as List;
        return recipesList.cast<Map<String, dynamic>>();
      }

      return [];
    } catch (e) {
      print('Popüler tarifler alınamadı: $e');
      return [];
    }
  }

  /// Get ingredient categories
  Future<List<Map<String, dynamic>>> getCategories() async {
    try {
      final response = await _dio.get(ApiConfig.ingredientsCategories);

      if (response.statusCode == 200) {
        final categoriesList = response.data['categories'] as List;
        return categoriesList.cast<Map<String, dynamic>>();
      }

      return [];
    } catch (e) {
      print('Kategoriler alınamadı: $e');
      return [];
    }
  }

  /// Verify In-App Purchase subscription
  Future<bool> verifySubscription({
    required String receiptData,
    required String platform,
    required String productId,
    double? price,
    String? currency,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.subscriptionVerify,
        data: {
          'receipt_data': receiptData,
          'platform': platform,
          'product_id': productId,
          'price': price,
          'currency': currency,
        },
      );

      final l10n = _l10n;
      if (response.statusCode == 200 &&
          response.data['subscription_tier'] != null &&
          response.data['subscription_tier'] != 'free') {
        return true;
      }

      throw Exception(l10n.errorVerifyFailed);
    } on DioException catch (e) {
      final l10n = _l10n;
      if (e.type == DioExceptionType.connectionTimeout) {
        throw Exception(l10n.errorConnectionTimeout);
      }
      final rawDetail = e.response?.data['detail']?.toString() ?? '';

      throw Exception(ErrorTranslator.translate(rawDetail, l10n) != rawDetail
          ? ErrorTranslator.translate(rawDetail, l10n)
          : (rawDetail.isEmpty
              ? l10n.errorSubscriptionVerifyFailed(e.message ?? '')
              : rawDetail));
    } catch (e) {
      rethrow;
    }
  }
}

// Singleton instance
final apiService = ApiService();

/// API configuration for ChefVision
class ApiConfig {
  // Base URL - Production Cloud Run URL
  static String get baseUrl {
    return 'https://YOUR_API_BACKEND_URL_HERE';
  }

  static const String apiPrefix = '/api/v1';

  // Full API URLs
  static String get authRegister => '$baseUrl$apiPrefix/auth/register';
  static String get authLogin => '$baseUrl$apiPrefix/auth/login';
  static String get authMe => '$baseUrl$apiPrefix/auth/me';
  static String get authChangePassword =>
      '$baseUrl$apiPrefix/auth/change-password';
  static String get authChangeEmail => '$baseUrl$apiPrefix/auth/change-email';
  static String get authUploadAvatar => '$baseUrl$apiPrefix/auth/upload-avatar';
  static String get authForgotPassword =>
      '$baseUrl$apiPrefix/auth/forgot-password';

  static String get subscriptionVerify =>
      '$baseUrl$apiPrefix/subscription/verify';

  static String get ingredientsAnalyze =>
      '$baseUrl$apiPrefix/ingredients/analyze-image';
  static String get ingredientsCategories =>
      '$baseUrl$apiPrefix/ingredients/categories';

  static String get recipesSuggest => '$baseUrl$apiPrefix/recipes/suggest';
  static String get recipesDaily => '$baseUrl$apiPrefix/recipes/daily';
  static String get recipesPopular => '$baseUrl$apiPrefix/recipes/popular';
  static String get recipesFavorites => '$baseUrl$apiPrefix/recipes/favorites';
  static String get recipesDetail => '$baseUrl$apiPrefix/recipes/detail';

  static String get pantry => '$baseUrl$apiPrefix/pantry';
  static String get pantryExpiring => '$baseUrl$apiPrefix/pantry/expiring-soon';
  static String get pantryShopping => '$baseUrl$apiPrefix/pantry/shopping';

  static String get voiceChat => '$baseUrl$apiPrefix/voice/chat';
  static String get voiceCookingTip => '$baseUrl$apiPrefix/voice/cooking-tip';
  static String get voiceTts => '$baseUrl$apiPrefix/voice/tts';

  // Timeouts
  static const Duration connectionTimeout = Duration(seconds: 60);
  static const Duration receiveTimeout = Duration(seconds: 180);
}

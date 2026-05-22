import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'auth_service.dart';

class VoiceService {
  late final Dio _dio;

  VoiceService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));
  }

  void _updateToken() {
    final token = authService.token;
    if (token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $token';
    }
  }

  /// Send voice input text and get AI response
  Future<VoiceResponse> chat(
    String text, {
    bool includePantry = true,
    Map<String, dynamic>? recipeContext,
  }) async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/voice/chat',
        data: {
          'text': text,
          'include_pantry': includePantry,
          'recipe_context': recipeContext,
        },
      );

      if (response.statusCode == 200) {
        return VoiceResponse.fromJson(response.data);
      }

      return VoiceResponse(
        response: 'Sorry, an error occurred.',
        emotion: 'helpful',
      );
    } on DioException catch (e) {
      final detail = e.response?.data is Map<String, dynamic>
          ? (e.response?.data['detail']?.toString() ?? '')
          : '';

      if (e.response?.statusCode == 403 &&
          detail.contains('AI Asistan sadece Premium pakette mevcuttur')) {
        return VoiceResponse(
          response:
              'Chef Asistan su anda sadece Premium uyelikte kullanilabiliyor. Premiuma gecersen tarif adimlariyla ilgili burada aninda yardim alabilirsin.',
          emotion: 'helpful',
        );
      }

      print('Voice chat error: $e');
      return VoiceResponse(
        response: 'Connection error. Please try again.',
        emotion: 'helpful',
      );
    } catch (e) {
      print('Voice chat error: $e');
      return VoiceResponse(
        response: 'Connection error. Please try again.',
        emotion: 'helpful',
      );
    }
  }

  /// Get cooking tip for a recipe step
  Future<String> getCookingTip(String recipeTitle, int stepNumber) async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/voice/cooking-tip',
        data: {
          'recipe_title': recipeTitle,
          'step_number': stepNumber,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['tip'];
      }

      return 'Be careful at this step! 👨‍🍳';
    } catch (e) {
      print('Cooking tip error: $e');
      return 'Be careful at this step! 👨‍🍳';
    }
  }

  /// Clear conversation history
  Future<bool> clearHistory() async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/voice/clear-history',
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Clear history error: $e');
      return false;
    }
  }
}

class VoiceResponse {
  final String response;
  final String? action;
  final Map<String, dynamic>? actionData;
  final String emotion;

  VoiceResponse({
    required this.response,
    this.action,
    this.actionData,
    this.emotion = 'helpful',
  });

  factory VoiceResponse.fromJson(Map<String, dynamic> json) {
    return VoiceResponse(
      response: json['response'] ?? '',
      action: json['action'],
      actionData: json['action_data'],
      emotion: json['emotion'] ?? 'helpful',
    );
  }
}

// Singleton instance
final voiceService = VoiceService();

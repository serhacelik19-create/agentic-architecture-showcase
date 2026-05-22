import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import '../models/pantry_item.dart';
import '../models/shopping_item.dart';
import '../models/receipt_analysis_response.dart';
import '../models/voice_command_response.dart';
import '../models/pantry_stats.dart';
import 'auth_service.dart';
import '../models/recipe.dart'; // Import Recipe model
import 'api_service.dart'; // Import for Exceptions

class PantryService {
  late final Dio _dio;

  PantryService() {
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

  /// Get all pantry items
  Future<List<PantryItem>> getPantryItems() async {
    _updateToken();
    try {
      final response = await _dio.get('${ApiConfig.apiPrefix}/pantry/list');

      if (response.statusCode == 200) {
        final items = response.data as List;
        return items.map((json) => PantryItem.fromJson(json)).toList();
      }
      return [];
    } on DioException catch (e) {
      _handleDioError(e);
      return [];
    } catch (e) {
      print('Error getting pantry items: $e');
      return [];
    }
  }

  void _handleDioError(DioException e) {
    if (e.response?.statusCode == 403) {
      final detail = e.response?.data['detail'] ?? '';
      String tier = 'pro';
      if (detail.contains('Premium')) tier = 'premium';
      if (detail.contains('Plus')) tier = 'plus';

      throw FeatureLockedException(
        detail.isEmpty ? 'Bu özellik paketinizde bulunmuyor.' : detail,
        tierRequired: tier,
      );
    }
    if (e.response?.statusCode == 429) {
      throw LimitExceededException(
        e.response?.data['detail'] ?? 'Günlük limitiniz doldu.',
      );
    }
  }

  /// Get items expiring soon
  Future<List<PantryItem>> getExpiringItems({int days = 3}) async {
    _updateToken();
    try {
      final response = await _dio.get(
        '${ApiConfig.apiPrefix}/pantry/expiring-soon',
        queryParameters: {'days': days},
      );

      if (response.statusCode == 200) {
        final items = response.data as List;
        return items.map((json) => PantryItem.fromJson(json)).toList();
      }
      return [];
    } on DioException catch (e) {
      _handleDioError(e);
      return [];
    } catch (e) {
      print('Error getting expiring items: $e');
      return [];
    }
  }

  /// Add item to pantry
  Future<PantryItem?> addPantryItem({
    required String ingredientName,
    double quantity = 1.0,
    String unit = 'adet',
    DateTime? expiresAt,
  }) async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/pantry/add',
        data: {
          'ingredient_name': ingredientName,
          'quantity': quantity,
          'unit': unit,
          if (expiresAt != null) 'expires_at': expiresAt.toIso8601String(),
        },
      );

      if (response.statusCode == 200) {
        return PantryItem.fromJson(response.data);
      }
      return null;
    } on DioException catch (e) {
      print('Error adding pantry item: $e');
      final statusCode = e.response?.statusCode;
      if (statusCode == 401 || statusCode == 403) {
        throw Exception('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
      }
      throw Exception('Malzeme eklenirken hata oluştu: $e');
    } catch (e) {
      print('Error adding pantry item: $e');
      throw Exception('Malzeme eklenirken hata oluştu: $e');
    }
  }

  /// Remove item from pantry
  Future<bool> removePantryItem(int itemId) async {
    _updateToken();
    try {
      final response =
          await _dio.delete('${ApiConfig.apiPrefix}/pantry/$itemId');
      return response.statusCode == 200;
    } catch (e) {
      print('Error removing pantry item: $e');
      return false;
    }
  }

  /// Update pantry item quantity, unit, or expiry
  Future<PantryItem?> updatePantryItem({
    required int itemId,
    double? quantity,
    String? unit,
    DateTime? expiresAt,
  }) async {
    _updateToken();
    try {
      final data = <String, dynamic>{};
      if (quantity != null) data['quantity'] = quantity;
      if (unit != null) data['unit'] = unit;
      if (expiresAt != null) data['expires_at'] = expiresAt.toIso8601String();

      final response = await _dio.put(
        '${ApiConfig.apiPrefix}/pantry/$itemId',
        data: data,
      );

      if (response.statusCode == 200) {
        return PantryItem.fromJson(response.data);
      }
      return null;
    } catch (e) {
      print('Error updating pantry item: $e');
      return null;
    }
  }

  /// Add multiple items to pantry at once
  Future<List<PantryItem>> addBulkPantryItems(
      List<String> ingredientNames) async {
    _updateToken();
    try {
      final items = ingredientNames
          .map((name) => {
                'ingredient_name': name,
                'quantity': 1.0,
                'unit': 'adet',
              })
          .toList();

      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/pantry/bulk',
        data: items,
      );

      if (response.statusCode == 200) {
        final list = response.data as List;
        return list.map((json) => PantryItem.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Error bulk adding pantry items: $e');
      throw Exception('Toplu ekleme sırasında hata oluştu: $e');
    }
  }

  // =====================
  // Shopping List
  // =====================

  /// Get shopping list
  Future<List<ShoppingItem>> getShoppingList() async {
    _updateToken();
    try {
      final response = await _dio.get('${ApiConfig.apiPrefix}/pantry/shopping');

      if (response.statusCode == 200) {
        final items = response.data as List;
        return items.map((json) {
          final item = ShoppingItem.fromJson(json);
          // Auto-categorize if "Diğer" or empty (since backend might not have it yet)
          // valid workaround until backend update
          if (item.category == 'Diğer') {
            return item.copyWith(category: _guessCategory(item.ingredientName));
          }
          return item;
        }).toList();
      }
      return [];
    } catch (e) {
      print('Error getting shopping list: $e');
      return [];
    }
  }

  /// Add item to shopping list
  Future<ShoppingItem?> addShoppingItem({
    required String ingredientName,
    String? quantity,
  }) async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/pantry/shopping',
        data: {
          'ingredient_name': ingredientName,
          if (quantity != null) 'quantity': quantity,
        },
      );

      if (response.statusCode == 200) {
        return ShoppingItem.fromJson(response.data);
      }
      return null;
    } catch (e) {
      print('Error adding shopping item: $e');
      return null;
    }
  }

  /// Update shopping item (quantity or toggle)
  Future<ShoppingItem?> updateShoppingItem({
    required int itemId,
    String? ingredientName,
    String? quantity,
    bool? isChecked,
  }) async {
    _updateToken();
    try {
      final data = <String, dynamic>{};
      if (ingredientName != null) data['ingredient_name'] = ingredientName;
      if (quantity != null) data['quantity'] = quantity;

      // If we only want to toggle, we use the specific toggle endpoint,
      // but generic update might be useful for name/quantity.
      // Assuming backend supports PUT /pantry/shopping/{id} for updates.
      // If not, we might need to rely on toggle endpoint for checks.
      // But for Name/Quantity edit, we need a PUT endpoint.
      // I will assume standard REST pattern: PUT /pantry/shopping/{id}

      final response = await _dio.put(
        '${ApiConfig.apiPrefix}/pantry/shopping/$itemId',
        data: data,
      );

      if (response.statusCode == 200) {
        return ShoppingItem.fromJson(response.data);
      }
      return null;
    } catch (e) {
      print('Error updating shopping item: $e');
      return null;
    }
  }

  /// Bulk remove shopping items
  Future<bool> removeShoppingItems(List<int> itemIds) async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/pantry/shopping/bulk-delete',
        data: {'item_ids': itemIds},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error removing shopping items: $e');
      // Fallback to individual deletes if bulk fails or not implemented
      bool allSuccess = true;
      for (var id in itemIds) {
        final success = await removeShoppingItem(id);
        if (!success) allSuccess = false;
      }
      return allSuccess;
    }
  }

  /// Toggle shopping item checked status
  Future<bool> toggleShoppingItem(int itemId) async {
    _updateToken();
    try {
      final response = await _dio.put(
        '${ApiConfig.apiPrefix}/pantry/shopping/$itemId/toggle',
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error toggling shopping item: $e');
      return false;
    }
  }

  /// Remove item from shopping list
  Future<bool> removeShoppingItem(int itemId) async {
    _updateToken();
    try {
      final response = await _dio.delete(
        '${ApiConfig.apiPrefix}/pantry/shopping/$itemId',
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error removing shopping item: $e');
      return false;
    }
  }

  /// Clear checked items
  Future<bool> clearCheckedItems() async {
    _updateToken();
    try {
      final response = await _dio.delete(
        '${ApiConfig.apiPrefix}/pantry/shopping/clear-checked',
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error clearing checked items: $e');
      return false;
    }
  }

  /// Analyze receipt image
  Future<ReceiptAnalysisResponse?> analyzeReceipt(XFile imageFile) async {
    _updateToken();
    try {
      final bytes = await imageFile.readAsBytes();
      String fileName = imageFile.name;

      FormData formData = FormData.fromMap({
        "file": MultipartFile.fromBytes(
          bytes,
          filename: fileName,
          contentType: MediaType('image', 'jpeg'),
        ),
      });

      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/pantry/analyze-receipt',
        data: formData,
      );

      if (response.statusCode == 200) {
        return ReceiptAnalysisResponse.fromJson(response.data);
      }
      return null;
    } on DioException catch (e) {
      _handleDioError(e);
      return null;
    } catch (e) {
      print('Error analyzing receipt: $e');
      return null;
    }
  }

  /// Process voice command for pantry management
  Future<VoiceCommandResponse?> processVoiceCommand(String commandText) async {
    _updateToken();
    try {
      final response = await _dio.post(
        '${ApiConfig.apiPrefix}/pantry/voice-command',
        data: {'command_text': commandText},
      );

      if (response.statusCode == 200) {
        return VoiceCommandResponse.fromJson(response.data);
      }
      return null;
    } on DioException catch (e) {
      if (e.response?.statusCode == 403) {
        throw FeatureLockedException(
          e.response?.data['detail'] ?? 'Sesli komut Premium paket gerektirir.',
          tierRequired: 'premium',
        );
      }
      _handleDioError(e);
      return null;
    } catch (e) {
      print('Error processing voice command: $e');
      return null;
    }
  }

  /// Get aggregate statistics for the user's pantry
  Future<PantryStats?> getPantryStats() async {
    _updateToken();
    try {
      final response = await _dio.get('${ApiConfig.apiPrefix}/pantry/stats');

      if (response.statusCode == 200) {
        return PantryStats.fromJson(response.data);
      }
      return null;
    } catch (e) {
      print('Error getting pantry stats: $e');
      return null;
    }
  }

  /// Add multiple items from a recipe
  Future<List<ShoppingItem>> addItemsFromRecipe(Recipe recipe) async {
    _updateToken();
    try {
      final futures = recipe.ingredients.map((ing) async {
        // Use default category guessing since backend might not support it yet
        // or we can just send it if backend supports.
        // For now, we add item and then we can update it or just let logic handle it.
        final item = await addShoppingItem(
          ingredientName: ing.name,
          quantity: ing.quantity,
        );
        if (item != null && item.category == 'Diğer') {
          // If backend returned default, we can try to update it locally or
          // just return it with guessed category for display
          return item.copyWith(category: _guessCategory(ing.name));
        }
        return item;
      });

      final results = await Future.wait(futures);
      return results.whereType<ShoppingItem>().toList();
    } catch (e) {
      print('Error adding recipe items: $e');
      return [];
    }
  }

  /// Helper to guess category based on name
  String _guessCategory(String name) {
    final lower = name.toLowerCase();
    if ([
      'domates',
      'biber',
      'patlıcan',
      'soğan',
      'sarımsak',
      'maydanoz',
      'marul',
      'havuç',
      'patates',
      'salatalık',
      'kabak',
      'ıspanak',
      'brokoli',
      'karnabahar',
      'lahana',
      'pırasa',
      'enginar',
      'semizotu',
      'roka',
      'dereotu',
      'nane',
      'fesleğen',
      'tere',
      'kuzu kulağı',
      'pazı',
      'mantar',
      'elma',
      'armut',
      'muz',
      'çilek',
      'kiraz',
      'vişne',
      'karpuz',
      'kavun',
      'üzüm',
      'incir',
      'şeftali',
      'kayısı',
      'erik',
      'mandalina',
      'portakal',
      'limon',
      'greyfurt',
      'nar',
      'kivi',
      'avakado',
      'ananas',
      'hurma',
      'dut',
      'böğürtlen',
      'ahududu'
    ].any((k) => lower.contains(k))) {
      return 'Manav';
    }
    if ([
      'süt',
      'peynir',
      'yoğurt',
      'tereyağı',
      'krema',
      'yumurta',
      'kaymak',
      'labne',
      'kefir',
      'ayran'
    ].any((k) => lower.contains(k))) {
      return 'Süt & Kahvaltılık';
    }
    if ([
      'et',
      'kıyma',
      'tavuk',
      'balık',
      'sucuk',
      'salam',
      'sosis',
      'pastırma',
      'jambon',
      'biftek',
      'pirzola',
      'kuşbaşı',
      'kanat',
      'but',
      'hamsi',
      'somon',
      'ton'
    ].any((k) => lower.contains(k))) {
      return 'Et & Şarküteri';
    }
    if ([
      'ekmek',
      'un',
      'makarna',
      'pirinç',
      'bulgur',
      'mercimek',
      'nohut',
      'fasulye',
      'yufka',
      'börek',
      'simit',
      'poğaça',
      'bazlama',
      'lavaş',
      'galeta',
      'irmik',
      'nişasta',
      'maya',
      'kabartma tozu',
      'vanilya',
      'kuskus',
      'erişte',
      'şehriye'
    ].any((k) => lower.contains(k))) {
      return 'Bakliyat & Fırın';
    }
    if ([
      'yağ',
      'zeytinyağı',
      'ayçiçek',
      'tuz',
      'karabiber',
      'baharat',
      'şeker',
      'salça',
      'pul biber',
      'kekik',
      'kimyon',
      'nane',
      'sumak',
      'tarçın',
      'sirke',
      'limon suyu',
      'mayonez',
      'ketçap',
      'hardal',
      'sos',
      'bulyon'
    ].any((k) => lower.contains(k))) {
      return 'Yağ & Baharat';
    }
    if ([
      'su',
      'kola',
      'gazoz',
      'soda',
      'meyve suyu',
      'çay',
      'kahve',
      'şalgam',
      'sahlep',
      'boza'
    ].any((k) => lower.contains(k))) {
      return 'İçecek';
    }
    if ([
      'deterjan',
      'sabun',
      'şampuan',
      'peçete',
      'kağıt',
      'bez',
      'sünger',
      'çamaşır suyu',
      'yumuşatıcı',
      'diş macunu'
    ].any((k) => lower.contains(k))) {
      return 'Temizlik & Hijyen';
    }
    if ([
      'cips',
      'bisküvi',
      'gofret',
      'çikolata',
      'kraker',
      'kek',
      'kuruyemiş',
      'fıstık',
      'ceviz',
      'fındık',
      'badem',
      'çekirdek'
    ].any((k) => lower.contains(k))) {
      return 'Atıştırmalık';
    }
    return 'Diğer';
  }

  /// Normalize name for duplicate checking
  String normalizeName(String name) {
    return name.trim().toLowerCase().replaceAll('İ', 'i').replaceAll('I', 'ı');
  }
}

// Singleton instance
final pantryService = PantryService();

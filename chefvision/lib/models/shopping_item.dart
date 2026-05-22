import 'package:chefvision_app/l10n/app_localizations.dart';
import 'pantry_item.dart';

/// Shopping list item model
class ShoppingItem {
  final int id;
  final String ingredientName;
  final String? quantity;
  final String category; // New category field
  final bool isChecked;
  final DateTime createdAt;
  final Map<String, dynamic>? translations;

  ShoppingItem({
    required this.id,
    required this.ingredientName,
    this.quantity,
    this.category = 'Diğer', // Default category
    this.isChecked = false,
    required this.createdAt,
    this.translations,
  });

  factory ShoppingItem.fromJson(Map<String, dynamic> json) {
    return ShoppingItem(
      id: json['id'],
      ingredientName: json['ingredient_name'],
      quantity: json['quantity'],
      category: json['category'] ?? 'Diğer',
      isChecked: json['is_checked'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
      translations: json['translations'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ingredient_name': ingredientName,
      'quantity': quantity,
      'category': category,
      'is_checked': isChecked,
      'created_at': createdAt.toIso8601String(),
      'translations': translations,
    };
  }

  ShoppingItem copyWith({
    int? id,
    String? ingredientName,
    String? quantity,
    String? category,
    bool? isChecked,
    DateTime? createdAt,
    Map<String, dynamic>? translations,
  }) {
    return ShoppingItem(
      id: id ?? this.id,
      ingredientName: ingredientName ?? this.ingredientName,
      quantity: quantity ?? this.quantity,
      category: category ?? this.category,
      isChecked: isChecked ?? this.isChecked,
      createdAt: createdAt ?? this.createdAt,
      translations: translations ?? this.translations,
    );
  }

  String getLocalizedIngredientName(String langCode) {
    if (translations != null && translations![langCode] != null) {
      return translations![langCode] as String;
    }
    return ingredientName;
  }

  String localizedCategoryName(AppLocalizations l10n) {
    return PantryItem.localizedCategoryNameStatic(category, l10n);
  }
}

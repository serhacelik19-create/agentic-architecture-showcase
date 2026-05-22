import 'dart:ui';
import 'package:chefvision_app/l10n/app_localizations.dart';

/// Pantry item model with expiry tracking and category
class PantryItem {
  final int id;
  final String ingredientName;
  final double quantity;
  final String unit;
  final DateTime addedAt;
  final DateTime? expiresAt;
  final int? daysUntilExpiry;
  final String category;
  final Map<String, dynamic>? translations;

  PantryItem({
    required this.id,
    required this.ingredientName,
    required this.quantity,
    required this.unit,
    required this.addedAt,
    this.expiresAt,
    this.daysUntilExpiry,
    this.category = 'other',
    this.translations,
  });

  factory PantryItem.fromJson(Map<String, dynamic> json) {
    return PantryItem(
      id: json['id'],
      ingredientName: json['ingredient_name'],
      quantity: (json['quantity'] as num).toDouble(),
      unit: json['unit'] ?? 'adet',
      addedAt: DateTime.parse(json['added_at']),
      expiresAt: json['expires_at'] != null
          ? DateTime.parse(json['expires_at'])
          : null,
      daysUntilExpiry: json['days_until_expiry'],
      category: json['category'] ?? 'other',
      translations: json['translations'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ingredient_name': ingredientName,
      'quantity': quantity,
      'unit': unit,
      'added_at': addedAt.toIso8601String(),
      'expires_at': expiresAt?.toIso8601String(),
      'days_until_expiry': daysUntilExpiry,
      'category': category,
      'translations': translations,
    };
  }

  String getLocalizedIngredientName(String langCode) {
    if (translations != null && translations![langCode] != null) {
      return translations![langCode] as String;
    }
    return ingredientName;
  }

  bool get isExpiringSoon => daysUntilExpiry != null && daysUntilExpiry! <= 3;
  bool get isExpired => daysUntilExpiry != null && daysUntilExpiry! < 0;

  String localizedExpiryStatus(AppLocalizations l10n) {
    if (daysUntilExpiry == null) return l10n.expiryUnknown;
    if (daysUntilExpiry! < 0) return l10n.expiryExpired;
    if (daysUntilExpiry == 0) return l10n.expiryToday;
    if (daysUntilExpiry == 1) return l10n.expiryTomorrow;
    return l10n.expiryDays(daysUntilExpiry!);
  }

  String localizedUnitName(AppLocalizations l10n) {
    return localizedUnitStatic(unit, l10n);
  }

  static String localizedUnitStatic(String unit, AppLocalizations l10n) {
    switch (unit.toLowerCase()) {
      case 'adet':
      case 'pcs':
        return l10n.unitAdet;
      case 'kg':
        return l10n.unitKg;
      case 'g':
      case 'gr':
        return l10n.unitG;
      case 'l':
      case 'litre':
        return l10n.unitL;
      case 'ml':
        return l10n.unitMl;
      case 'demet':
      case 'bunch':
        return l10n.unitDemet;
      case 'paket':
      case 'pack':
        return l10n.unitPaket;
      case 'kavanoz':
      case 'jar':
        return l10n.unitKavanoz;
      default:
        return unit;
    }
  }

  String get categoryEmoji {
    return categoryEmojiStatic(category);
  }

  static String categoryEmojiStatic(String category) {
    switch (category.toLowerCase()) {
      case 'vegetables':
        return '🥬';
      case 'fruits':
        return '🍎';
      case 'meat':
        return '🥩';
      case 'seafood':
        return '🐟';
      case 'dairy':
        return '🧀';
      case 'eggs':
        return '🥚';
      case 'grains':
        return '🌾';
      case 'legumes':
        return '🫘';
      case 'pasta':
        return '🍝';
      case 'bakery':
        return '🍞';
      case 'spices':
        return '🌶️';
      case 'sauces':
        return '🫙';
      case 'oils':
        return '🫒';
      case 'beverages':
        return '🥤';
      case 'snacks':
        return '🍫';
      case 'nuts':
        return '🥜';
      case 'frozen':
        return '🧃';
      case 'canned':
        return '🥫';
      case 'sweets':
        return '🍯';
      default:
        return '🥗';
    }
  }

  String localizedCategoryName(AppLocalizations l10n) {
    return localizedCategoryNameStatic(category, l10n);
  }

  static String localizedCategoryNameStatic(
      String category, AppLocalizations l10n) {
    switch (category.toLowerCase()) {
      case 'vegetables':
        return l10n.categoryVegetables;
      case 'fruits':
        return l10n.categoryFruits;
      case 'meat':
        return l10n.categoryMeat;
      case 'seafood':
        return l10n.categorySeafood;
      case 'dairy':
        return l10n.categoryDairy;
      case 'eggs':
        return l10n.categoryEggs;
      case 'grains':
        return l10n.categoryGrains;
      case 'legumes':
        return l10n.categoryLegumes;
      case 'pasta':
        return l10n.categoryPasta;
      case 'bakery':
        return l10n.categoryBakery;
      case 'spices':
        return l10n.categorySpices;
      case 'sauces':
        return l10n.categorySauces;
      case 'oils':
        return l10n.categoryOils;
      case 'beverages':
        return l10n.categoryBeverages;
      case 'snacks':
        return l10n.categorySnacks;
      case 'nuts':
        return l10n.categoryNuts;
      case 'frozen':
        return l10n.categoryFrozen;
      case 'canned':
        return l10n.categoryCanned;
      case 'sweets':
        return l10n.categorySweets;
      default:
        return l10n.categoryOther;
    }
  }

  /// Kategori bazlı renk paleti
  static Color categoryColor(String category) {
    switch (category) {
      case 'vegetables':
        return const Color(0xFF4CAF50);
      case 'fruits':
        return const Color(0xFFFF9800);
      case 'meat':
        return const Color(0xFFE53935);
      case 'seafood':
        return const Color(0xFF1E88E5);
      case 'dairy':
        return const Color(0xFFFDD835);
      case 'eggs':
        return const Color(0xFFFFB74D);
      case 'grains':
        return const Color(0xFF8D6E63);
      case 'legumes':
        return const Color(0xFF66BB6A);
      case 'pasta':
        return const Color(0xFFFFCA28);
      case 'bakery':
        return const Color(0xFFD7A86E);
      case 'spices':
        return const Color(0xFFEF5350);
      case 'sauces':
        return const Color(0xFFFF7043);
      case 'oils':
        return const Color(0xFFBCB44A);
      case 'beverages':
        return const Color(0xFF42A5F5);
      case 'snacks':
        return const Color(0xFFAB47BC);
      case 'nuts':
        return const Color(0xFF795548);
      case 'frozen':
        return const Color(0xFF4FC3F7);
      case 'canned':
        return const Color(0xFF90A4AE);
      case 'sweets':
        return const Color(0xFFEC407A);
      default:
        return const Color(0xFF78909C);
    }
  }
}

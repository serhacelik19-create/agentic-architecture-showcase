import 'package:chefvision_app/l10n/app_localizations.dart';
import 'pantry_item.dart';

class Ingredient {
  final String name;
  final String nameTr;
  final String nameEn;
  final String nameEs;
  final String nameFr;
  final String nameDe;
  final String nameIt;
  final double confidence;
  final String category;
  final String? quantityEstimate;
  final String? emoji;
  bool isSelected;

  Ingredient({
    required this.name,
    required this.nameTr,
    this.nameEn = '',
    this.nameEs = '',
    this.nameFr = '',
    this.nameDe = '',
    this.nameIt = '',
    required this.confidence,
    required this.category,
    this.emoji,
    this.quantityEstimate,
    this.isSelected = true,
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) {
    return Ingredient(
      name: json['name'] ?? '',
      nameTr: json['name_tr'] ?? json['name'] ?? '',
      nameEn: json['name_en'] ?? json['name'] ?? '',
      nameEs: json['name_es'] ?? json['name'] ?? '',
      nameFr: json['name_fr'] ?? json['name'] ?? '',
      nameDe: json['name_de'] ?? json['name'] ?? '',
      nameIt: json['name_it'] ?? json['name'] ?? '',
      confidence: (json['confidence'] ?? 0.5).toDouble(),
      category: json['category'] ?? 'other',
      emoji: json['emoji'],
      quantityEstimate: json['quantity_estimate'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'name_tr': nameTr,
      'name_en': nameEn,
      'name_es': nameEs,
      'name_fr': nameFr,
      'name_de': nameDe,
      'name_it': nameIt,
      'confidence': confidence,
      'category': category,
      'emoji': emoji,
      'quantity_estimate': quantityEstimate,
    };
  }

  String getLocalizedName(String langCode) {
    String candidate = name;
    switch (langCode) {
      case 'tr':
        candidate = nameTr;
        break;
      case 'en':
        candidate = nameEn;
        break;
      case 'es':
        candidate = nameEs;
        break;
      case 'fr':
        candidate = nameFr;
        break;
      case 'de':
        candidate = nameDe;
        break;
      case 'it':
        candidate = nameIt;
        break;
    }
    return (candidate.isNotEmpty && candidate != 'null')
        ? candidate
        : (nameTr.isNotEmpty ? nameTr : name);
  }

  String get displayEmoji {
    if (emoji != null && emoji!.isNotEmpty) return emoji!;

    // Smart lookup based on nameTr
    final lowercaseName = nameTr.toLowerCase();
    for (var entry in ingredientEmojiMap.entries) {
      if (lowercaseName.contains(entry.key)) {
        return entry.value;
      }
    }

    switch (category.toLowerCase()) {
      case 'vegetables':
        return '🥬';
      case 'fruits':
        return '🍎';
      case 'dairy':
        return '🧀';
      case 'meat':
        return '🥩';
      case 'grains':
        return '🌾';
      case 'spices':
        return '🌶️';
      default:
        return '🍽️';
    }
  }

  static final Map<String, String> ingredientEmojiMap = {
    'domates': '🍅',
    'patates': '🥔',
    'havuç': '🥕',
    'soğan': '🧅',
    'sarımsak': '🧄',
    'biber': '🫑',
    'patlıcan': '🍆',
    'salatalık': '🥒',
    'marul': '🥬',
    'brokoli': '🥦',
    'mantar': '🍄',
    'mısır': '🌽',
    'yumurta': '🥚',
    'süt': '🥛',
    'peynir': '🧀',
    'yoğurt': '🍦',
    'tereyağı': '🧈',
    'ekmek': '🍞',
    'un': '🌾',
    'şeker': '🍬',
    'tuz': '🧂',
    'yağ': '🫗',
    'zeytinyağı': '🫒',
    'et': '🥩',
    'tavuk': '🍗',
    'balık': '🐟',
    'kıyma': '🍖',
    'sucuk': '🌭',
    'makarna': '🍝',
    'pirinç': '🍚',
    'mercimek': '🥣',
    'fasulye': '🫘',
    'elma': '🍎',
    'muz': '🍌',
    'çilek': '🍓',
    'üzüm': '🍇',
    'portakal': '🍊',
    'limon': '🍋',
    'karpuz': '🍉',
    'kavun': '🍈',
    'armut': '🍐',
    'şeftali': '🍑',
    'kiraz': '🍒',
    'erik': '🫐',
    'kayısı': '🍑',
    'ceviz': '🥜',
    'fındık': '🌰',
    'bal': '🍯',
    'çay': '☕',
    'kahve': '☕',
    'su': '💧',
  };

  String get categoryIcon => displayEmoji;

  String localizedCategoryName(AppLocalizations l10n) {
    return PantryItem.localizedCategoryNameStatic(category, l10n);
  }
}

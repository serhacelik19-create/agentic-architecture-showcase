class Recipe {
  final int? id;
  final String title;
  final String? description;
  final List<String> instructions;
  final String? imageUrl;
  final int prepTime;
  final int cookTime;
  final int servings;
  final String difficulty;
  final String? cuisine;
  final int? calories;
  final List<RecipeIngredient> ingredients;
  final int? matchPercentage;
  final List<String>? tips;
  final List<String>? quickInstructions;
  final List<String>? missingRecommendations;
  final String? customEmoji;

  Recipe({
    this.id,
    required this.title,
    this.description,
    required this.instructions,
    this.imageUrl,
    this.prepTime = 0,
    this.cookTime = 0,
    this.servings = 4,
    this.difficulty = 'Kolay',
    this.cuisine,
    this.calories,
    this.ingredients = const [],
    this.matchPercentage,
    this.tips,
    this.quickInstructions,
    this.missingRecommendations,
    this.customEmoji,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    final instructions = json['instructions'] is List
        ? List<String>.from(json['instructions'])
        : (json['instructions'] != null
            ? [json['instructions'].toString()]
            : <String>[]);

    return Recipe(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'],
      instructions: instructions,
      // If quick_instructions comes from JSON use it, otherwise if instructions exist and this is summary data, use them
      quickInstructions: json['quick_instructions'] != null
          ? List<String>.from(json['quick_instructions'])
          : (instructions.isNotEmpty && json['is_detail'] != true
              ? instructions
              : null),
      imageUrl: json['image_url'],
      prepTime: json['prep_time'] ?? 0,
      cookTime: json['cook_time'] ?? 0,
      servings: json['servings'] ?? 4,
      difficulty: json['difficulty'] ?? 'Kolay',
      cuisine: json['cuisine'],
      calories: json['calories'],
      matchPercentage: json['match_percentage'],
      tips: json['tips'] != null ? List<String>.from(json['tips']) : null,
      missingRecommendations: json['missing_recommendations'] != null
          ? List<String>.from(json['missing_recommendations'])
          : null,
      ingredients: json['ingredients'] != null
          ? (json['ingredients'] as List)
              .map((i) => RecipeIngredient.fromJson(i))
              .toList()
          : [],
      customEmoji: json['emoji'] ?? json['custom_emoji'],
    );
  }

  Recipe copyWith({
    int? id,
    String? title,
    String? description,
    List<String>? instructions,
    String? imageUrl,
    int? prepTime,
    int? cookTime,
    int? servings,
    String? difficulty,
    String? cuisine,
    int? calories,
    List<RecipeIngredient>? ingredients,
    int? matchPercentage,
    List<String>? tips,
    List<String>? quickInstructions,
    List<String>? missingRecommendations,
  }) {
    return Recipe(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      instructions: instructions ?? this.instructions,
      imageUrl: imageUrl ?? this.imageUrl,
      prepTime: prepTime ?? this.prepTime,
      cookTime: cookTime ?? this.cookTime,
      servings: servings ?? this.servings,
      difficulty: difficulty ?? this.difficulty,
      cuisine: cuisine ?? this.cuisine,
      calories: calories ?? this.calories,
      ingredients: ingredients ?? this.ingredients,
      matchPercentage: matchPercentage ?? this.matchPercentage,
      tips: tips ?? this.tips,
      quickInstructions: quickInstructions ?? this.quickInstructions,
      missingRecommendations:
          missingRecommendations ?? this.missingRecommendations,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'instructions': instructions,
      'image_url': imageUrl,
      'prep_time': prepTime,
      'cook_time': cookTime,
      'servings': servings,
      'difficulty': difficulty,
      'cuisine': cuisine,
      'calories': calories,
      'match_percentage': matchPercentage,
      'tips': tips,
      'quick_instructions': quickInstructions,
      'missing_recommendations': missingRecommendations,
      'ingredients': ingredients.map((i) => i.toJson()).toList(),
      'custom_emoji': customEmoji,
      'emoji': customEmoji, // Ensure compatibility with HomeScreen map check
    };
  }

  int get totalTime => prepTime + cookTime;

  String get difficultyEmoji {
    switch (difficulty.toLowerCase()) {
      case 'kolay':
        return '🟢';
      case 'orta':
        return '🟡';
      case 'zor':
        return '🔴';
      default:
        return '⚪';
    }
  }

  String get cuisineEmoji {
    if (customEmoji != null) return customEmoji!;

    switch (cuisine?.toLowerCase()) {
      case 'türk':
        return '🇹🇷';
      case 'italian':
      case 'italyan':
        return '🇮🇹';
      case 'mexican':
      case 'meksika':
        return '🇲🇽';
      case 'chinese':
      case 'çin':
        return '🇨🇳';
      case 'japanese':
      case 'japon':
        return '🇯🇵';
      default:
        return '🍽️';
    }
  }
}

class RecipeIngredient {
  final String name;
  final String quantity;
  final bool isOptional;

  RecipeIngredient({
    required this.name,
    required this.quantity,
    this.isOptional = false,
  });

  factory RecipeIngredient.fromJson(Map<String, dynamic> json) {
    return RecipeIngredient(
      name: json['name'] ?? '',
      quantity: json['quantity'] ?? '',
      isOptional: json['is_optional'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'quantity': quantity,
      'is_optional': isOptional,
    };
  }
}

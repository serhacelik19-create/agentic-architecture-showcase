/// User model for authentication and preferences
class User {
  final int id;
  final String email;
  final String name;
  final String? avatarUrl;
  final String? dietPreferences; // comma-separated: vegan,vegetarian,glutenfree
  final String? allergies; // comma-separated: nuts,dairy,shellfish
  bool get isPro => subscriptionTier != 'free'; // computed from tier
  final String subscriptionTier; // free, plus, pro, premium
  final DateTime? subscriptionExpiresAt;
  final int recipeGenerationCount;
  final int totalFreeGenerations;
  final DateTime? lastGenerationDate;
  final DateTime createdAt;
  final int deviceChangeCount;

  /// True if user was previously subscribed but subscription has expired
  bool get isExpired =>
      subscriptionTier == 'free' &&
      subscriptionExpiresAt != null &&
      subscriptionExpiresAt!.isBefore(DateTime.now());

  User({
    required this.id,
    required this.email,
    required this.name,
    this.avatarUrl,
    this.dietPreferences,
    this.allergies,
    this.subscriptionTier = 'free',
    this.subscriptionExpiresAt,
    this.recipeGenerationCount = 0,
    this.totalFreeGenerations = 0,
    this.lastGenerationDate,
    this.deviceChangeCount = 0,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      avatarUrl: json['avatar_url'],
      dietPreferences: json['diet_preferences'],
      allergies: json['allergies'],
      subscriptionTier: json['subscription_tier'] ?? 'free',
      subscriptionExpiresAt: json['subscription_expires_at'] != null
          ? DateTime.parse(json['subscription_expires_at'])
          : null,
      recipeGenerationCount: json['recipe_generation_count'] ?? 0,
      totalFreeGenerations: json['total_free_generations'] ?? 0,
      deviceChangeCount: json['device_change_count'] ?? 0,
      lastGenerationDate: json['last_generation_date'] != null
          ? DateTime.parse(json['last_generation_date'])
          : null,
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'avatar_url': avatarUrl,
      'diet_preferences': dietPreferences,
      'allergies': allergies,
      'subscription_tier': subscriptionTier,
      'subscription_expires_at': subscriptionExpiresAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  List<String> get dietList =>
      dietPreferences?.split(',').where((s) => s.isNotEmpty).toList() ?? [];

  List<String> get allergyList =>
      allergies?.split(',').where((s) => s.isNotEmpty).toList() ?? [];

  bool get isVegan => dietList.contains('vegan');
  bool get isVegetarian => dietList.contains('vegetarian');
  bool get isGlutenFree => dietList.contains('glutenfree');
}

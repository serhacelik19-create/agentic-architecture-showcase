class PantryStats {
  final int totalItems;
  final int expiringSoon;
  final int expired;
  final Map<String, int> categoryDistribution;
  final double wastePreventionScore;

  PantryStats({
    required this.totalItems,
    required this.expiringSoon,
    required this.expired,
    required this.categoryDistribution,
    required this.wastePreventionScore,
  });

  factory PantryStats.fromJson(Map<String, dynamic> json) {
    return PantryStats(
      totalItems: json['total_items'] ?? 0,
      expiringSoon: json['expiring_soon'] ?? 0,
      expired: json['expired'] ?? 0,
      categoryDistribution:
          (json['category_distribution'] as Map?)?.cast<String, int>() ?? {},
      wastePreventionScore:
          (json['waste_prevention_score'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

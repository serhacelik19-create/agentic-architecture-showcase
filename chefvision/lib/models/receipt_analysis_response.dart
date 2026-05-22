class ReceiptItem {
  final String ingredientName;
  final double quantity;
  final String unit;
  final double? price;
  final String? category;

  ReceiptItem({
    required this.ingredientName,
    required this.quantity,
    required this.unit,
    this.price,
    this.category,
  });

  factory ReceiptItem.fromJson(Map<String, dynamic> json) {
    return ReceiptItem(
      ingredientName: json['ingredient_name'] ?? '',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      unit: json['unit'] ?? 'adet',
      price: (json['price'] as num?)?.toDouble(),
      category: json['category'],
    );
  }
}

class ReceiptAnalysisResponse {
  final bool success;
  final List<ReceiptItem> items;
  final double? totalAmount;
  final String? merchantName;
  final String? date;
  final String? message;

  ReceiptAnalysisResponse({
    required this.success,
    required this.items,
    this.totalAmount,
    this.merchantName,
    this.date,
    this.message,
  });

  factory ReceiptAnalysisResponse.fromJson(Map<String, dynamic> json) {
    return ReceiptAnalysisResponse(
      success: json['success'] ?? false,
      items: (json['items'] as List?)
              ?.map((e) => ReceiptItem.fromJson(e))
              .toList() ??
          [],
      totalAmount: (json['total_amount'] as num?)?.toDouble(),
      merchantName: json['merchant_name'],
      date: json['date'],
      message: json['message'],
    );
  }
}

class VoiceCommandResponse {
  final String action;
  final List<VoiceCommandItem> items;
  final String? feedbackMessage;

  VoiceCommandResponse({
    required this.action,
    required this.items,
    this.feedbackMessage,
  });

  factory VoiceCommandResponse.fromJson(Map<String, dynamic> json) {
    return VoiceCommandResponse(
      action: json['action'] as String? ?? 'unknown',
      items: (json['items'] as List<dynamic>?)
              ?.map((e) => VoiceCommandItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      feedbackMessage: json['feedback_message'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'action': action,
      'items': items.map((e) => e.toJson()).toList(),
      'feedback_message': feedbackMessage,
    };
  }
}

class VoiceCommandItem {
  final String ingredientName;
  final double quantity;
  final String unit;

  VoiceCommandItem({
    required this.ingredientName,
    this.quantity = 1.0,
    this.unit = 'adet',
  });

  factory VoiceCommandItem.fromJson(Map<String, dynamic> json) {
    return VoiceCommandItem(
      ingredientName: json['ingredient_name'] as String? ?? 'Bilinmiyor',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      unit: json['unit'] as String? ?? 'adet',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ingredient_name': ingredientName,
      'quantity': quantity,
      'unit': unit,
    };
  }
}

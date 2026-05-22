import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/theme.dart';
import '../screens/subscription_screen.dart';
import 'gradient_button.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../services/iap_service.dart';

class FeatureLockedModal extends StatelessWidget {
  final String title;
  final String message;
  final String icon;
  final String tierRequired;

  const FeatureLockedModal({
    super.key,
    required this.title,
    required this.message,
    required this.icon,
    this.tierRequired = 'pro',
  });

  static Future<void> show(
    BuildContext context, {
    required String title,
    required String message,
    required String icon,
    String tierRequired = 'pro',
  }) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => FeatureLockedModal(
        title: title,
        message: message,
        icon: icon,
        tierRequired: tierRequired,
      ),
    );
  }

  // All tiers in order
  static const List<String> _allTiers = ['plus', 'pro', 'premium'];

  static const Map<String, String> _tierLabels = {
    'plus': 'Plus',
    'pro': 'Pro',
    'premium': 'Premium',
  };

  static String getTierPrice(String tier, BuildContext context) {
    var locale = Localizations.localeOf(context);
    bool isTurkey = locale.countryCode == 'TR' || locale.languageCode == 'tr';
    String suffix = isTurkey ? '/ay' : '/mo';

    try {
      final productId = 'com.chefvision.$tier';
      final product = iapService.products.firstWhere((p) => p.id == productId);
      return '${product.price}$suffix';
    } catch (e) {
      if (!isTurkey) {
        if (tier == 'plus') return '\$2.00$suffix';
        if (tier == 'pro') return '\$4.00$suffix';
        if (tier == 'premium') return '\$6.00$suffix';
      }
      if (tier == 'plus') return '₺59,99$suffix';
      if (tier == 'pro') return '₺109,99$suffix';
      if (tier == 'premium') return '₺239,99$suffix';
      return '';
    }
  }

  static Color getTierColor(String tier) {
    switch (tier.toLowerCase()) {
      case 'plus':
        return const Color(0xFF4CAF50);
      case 'pro':
        return AppTheme.primaryColor;
      case 'premium':
        return const Color(0xFF9C27B0);
      default:
        return AppTheme.primaryColor;
    }
  }

  List<String> get _availableTiers {
    final startIndex = _allTiers.indexOf(tierRequired.toLowerCase());
    if (startIndex == -1) return _allTiers;
    return _allTiers.sublist(startIndex);
  }

  @override
  Widget build(BuildContext context) {
    final color = getTierColor(tierRequired);

    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor.withOpacity(0.8),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 32),

            // Icon Area
            Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                )
                    .animate(onPlay: (c) => c.repeat())
                    .scale(
                      begin: const Offset(1, 1),
                      end: const Offset(1.2, 1.2),
                      duration: 2.seconds,
                      curve: Curves.easeInOut,
                    )
                    .then()
                    .scale(
                        begin: const Offset(1.2, 1.2), end: const Offset(1, 1)),
                Text(
                  icon,
                  style: const TextStyle(fontSize: 48),
                ),
                Positioned(
                  right: 0,
                  bottom: 0,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const Icon(Icons.lock_rounded,
                        color: Colors.white, size: 16),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            Text(
              title,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),

            const SizedBox(height: 12),

            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.grey,
                  ),
            ),

            const SizedBox(height: 24),

            // All available tier badges
            Text(
              AppLocalizations.of(context)!.suitablePlans,
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: Colors.grey,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.2,
                  ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: _availableTiers.map((tier) {
                final tierColor = getTierColor(tier);
                return Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: tierColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: tierColor.withOpacity(0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.stars_rounded, color: tierColor, size: 16),
                      const SizedBox(width: 6),
                      Text(
                        _tierLabels[tier] ?? tier.toUpperCase(),
                        style: TextStyle(
                          color: tierColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        getTierPrice(tier, context),
                        style: TextStyle(
                          color: tierColor.withOpacity(0.7),
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 32),

            GradientButton(
              text: AppLocalizations.of(context)!.reviewPlans,
              onPressed: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SubscriptionScreen()),
                );
              },
            ),

            const SizedBox(height: 12),

            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                AppLocalizations.of(context)!.later,
                style: const TextStyle(color: Colors.grey),
              ),
            ),
          ],
        ),
      ),
    ).animate().slideY(
        begin: 1.0, end: 0.0, duration: 400.ms, curve: Curves.easeOutCubic);
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../providers/auth_provider.dart';
import '../services/iap_service.dart';
import '../widgets/glass_card.dart';
import 'subscription_management_screen.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen>
    with TickerProviderStateMixin {
  static final Uri _termsOfUseUrl = Uri.parse(
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  );
  String _selectedTier = 'pro';
  bool _isLoadingProducts = true;
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(viewportFraction: 0.85, initialPage: 0);
    _initStore();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getFallbackTiers(AppLocalizations l10n) => [
        {
          'id': 'plus',
          'title': 'PLUS',
          'price': '₺30',
          'period': l10n.subPerMonth,
          'color': const Color(0xFF4CAF50),
          'icon': Icons.flash_on_rounded,
          'features': [
            l10n.subRecipesPerDay(12),
            l10n.subManualAdd,
            l10n.subAdFree,
          ],
          'limitations': [
            l10n.subNoPhoto,
            l10n.subNoPantry,
            l10n.subNoAssistant,
          ],
          'isPopular': false,
        },
        {
          'id': 'pro',
          'title': 'PRO',
          'price': '₺60',
          'period': l10n.subPerMonth,
          'color': AppTheme.primaryColor,
          'icon': Icons.star_rounded,
          'isPopular': true,
          'features': [
            l10n.subRecipesPerDay(28),
            l10n.subPhotoAdd,
            l10n.subPantryTracking,
            l10n.subAdFree,
          ],
          'limitations': [
            l10n.subNoChat,
            l10n.subNoVoice,
          ]
        },
        {
          'id': 'premium',
          'title': 'PREMIUM',
          'price': '₺100',
          'period': l10n.subPerMonth,
          'color': const Color(0xFF9C27B0),
          'icon': Icons.workspace_premium_rounded,
          'features': [
            l10n.subRecipesPerDay(75),
            l10n.subChatAssistant,
            l10n.subPhotoAdd,
            l10n.subPantryTracking,
            l10n.subPrioritySupport,
          ],
          'limitations': [],
          'isPopular': false,
        },
      ];

  Future<void> _initStore() async {
    try {
      if (!iapService.isAvailable || iapService.products.isEmpty) {
        await iapService.init();
      }
    } catch (e) {
      debugPrint('Store init error: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingProducts = false;
        });
      }
    }
  }

  List<Map<String, dynamic>> _getDisplayTiers(AppLocalizations l10n) {
    final locale = Localizations.localeOf(context);
    final isTurkey = locale.countryCode == 'TR' || locale.languageCode == 'tr';
    final fallbackTiers = _getFallbackTiers(l10n);

    return fallbackTiers.map((tier) {
      final productId = 'com.chefvision.${tier['id']}';
      try {
        final product = iapService.products.firstWhere(
          (p) => p.id == productId,
        );
        String cleanTitle = product.title.split('(').first.trim();
        cleanTitle = cleanTitle
            .replaceAll('ChefVision Premium', 'Chef Premium')
            .replaceAll('ChefVision ', 'Chef ');
        return {
          ...tier,
          'price': product.price,
          'title': cleanTitle,
        };
      } catch (e) {
        if (!isTurkey) {
          String priceUsd = '\$4.00';
          if (tier['id'] == 'plus') priceUsd = '\$2.00';
          if (tier['id'] == 'premium') priceUsd = '\$6.00';
          return {...tier, 'price': priceUsd};
        }
        return tier;
      }
    }).toList();
  }

  Color _getSelectedColor(AppLocalizations l10n) {
    final tiers = _getDisplayTiers(l10n);
    final index = tiers.indexWhere((t) => t['id'] == _selectedTier);
    if (index == -1) return AppTheme.primaryColor;
    return tiers[index]['color'] as Color;
  }

  String _termsLabel(Locale locale) {
    switch (locale.languageCode) {
      case 'tr':
        return 'Kullanim Kosullari';
      case 'de':
        return 'Nutzungsbedingungen';
      case 'es':
        return 'Condiciones de uso';
      case 'fr':
        return "Conditions d'utilisation";
      case 'it':
        return 'Termini di utilizzo';
      default:
        return 'Terms of Use';
    }
  }

  Future<void> _openTermsOfUse() async {
    await launchUrl(_termsOfUseUrl, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final authProvider = Provider.of<AuthProvider>(context);
    final userTier = authProvider.user?.subscriptionTier ?? 'free';
    final isExpired = authProvider.user?.isExpired ?? false;
    final tierOrder = ['free', 'plus', 'pro', 'premium'];
    final currentTierIndex = tierOrder.indexOf(userTier);
    final isMaxTier = currentTierIndex >= tierOrder.length - 1;
    final hasPaidPlan = currentTierIndex > 0;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Stack(
        children: [
          // 1. Static Backdrop
          _buildBackgroundGradient(l10n),

          SafeArea(
            child: Column(
              children: [
                _buildAppBar(context, l10n),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      children: [
                        const SizedBox(height: 10),
                        _buildHeader(hasPaidPlan, isMaxTier, userTier, l10n, isExpired: isExpired),
                        const SizedBox(height: 30),
                        if (!isMaxTier) ...[
                          _buildCarouselCards(currentTierIndex, l10n),
                          const SizedBox(height: 10),
                        ] else
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: _buildActiveSubscriptionInfo(userTier, l10n),
                          ),
                      ],
                    ),
                  ),
                ),

                // Sabit Alt Bilgi (Sticky Footer)
                if (!isMaxTier) ...[
                  const SizedBox(height: 10),
                  _buildIndicator(l10n),
                  const SizedBox(height: 20),
                  _buildSubscribeButton(authProvider, l10n),
                  const SizedBox(height: 20),
                ],
              ],
            ),
          ),
          if (_isLoadingProducts)
            Container(
              color: Colors.black54,
              child: const Center(
                child: CircularProgressIndicator(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBackgroundGradient(AppLocalizations l10n) {
    final activeColor = _getSelectedColor(l10n);
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            activeColor.withOpacity(0.15),
            Theme.of(context).scaffoldBackgroundColor,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context, AppLocalizations l10n) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.close_rounded),
            style: IconButton.styleFrom(
              backgroundColor:
                  Theme.of(context).cardTheme.color?.withOpacity(0.5),
            ),
          ),
          Text(
            l10n.subPackages,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(width: 48),
        ],
      ),
    );
  }

  Widget _buildHeader(bool hasPaidPlan, bool isMaxTier, String currentTier,
      AppLocalizations l10n, {bool isExpired = false}) {
    final Color selectedColor = isExpired ? const Color(0xFFFF9800) : _getSelectedColor(l10n);

    // Explicit widget creation to avoid ambiguity with .animate()
    final Widget iconContainer = Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [
            selectedColor,
            selectedColor.withOpacity(0.6),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: selectedColor.withOpacity(0.3),
            blurRadius: 20,
          ),
        ],
      ),
      child: Icon(
        isExpired
            ? Icons.history_rounded
            : isMaxTier ? Icons.verified_rounded : Icons.auto_awesome_rounded,
        color: Colors.white,
        size: 38,
      ),
    );

    return Column(
      children: [
        iconContainer
            .animate()
            .scale(duration: 600.ms, curve: Curves.easeOutBack),
        const SizedBox(height: 20),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Text(
            isExpired
                ? l10n.subExpiredTitle
                : isMaxTier
                    ? l10n.subMaxTierActive(currentTier.toUpperCase())
                    : hasPaidPlan
                        ? l10n.subCurrentTier(currentTier.toUpperCase())
                        : l10n.subUnlockPotential,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          isExpired
              ? l10n.subExpiredSubtitle
              : isMaxTier
                  ? l10n.subMaxTierSubtitle
                  : hasPaidPlan
                      ? l10n.subUpgradeSubtitle
                      : l10n.subChoosePlan,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).hintColor,
              ),
        ),
      ],
    );
  }

  Widget _buildCarouselCards(int currentTierIndex, AppLocalizations l10n) {
    final displayTiers = _getDisplayTiers(l10n);
    final tierOrderList = ['plus', 'pro', 'premium'];
    final availableTiers = displayTiers.where((tier) {
      final tierIdx = tierOrderList.indexOf(tier['id'] as String);
      return (tierIdx + 1) > currentTierIndex;
    }).toList();

    if (availableTiers.isEmpty) return const SizedBox.shrink();

    return SizedBox(
      height: 420,
      child: PageView.builder(
        controller: _pageController,
        itemCount: availableTiers.length,
        onPageChanged: (index) {
          HapticFeedback.selectionClick();
          setState(() {
            _selectedTier = availableTiers[index]['id'] as String;
          });
        },
        itemBuilder: (context, index) {
          final tier = availableTiers[index];
          return AnimatedBuilder(
            animation: _pageController,
            builder: (context, child) {
              double scale = 1.0;
              if (_pageController.position.haveDimensions) {
                double page = _pageController.page ?? 0.0;
                double diff = (page - index).abs();
                scale = (1.0 - (diff * 0.1)).clamp(0.8, 1.0);
              }
              return Transform.scale(
                scale: scale,
                child: child,
              );
            },
            child: _buildTierCard(tier, l10n),
          );
        },
      ),
    );
  }

  Widget _buildTierCard(Map<String, dynamic> tier, AppLocalizations l10n) {
    final isSelected = _selectedTier == tier['id'];
    final color = tier['color'] as Color;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(
          color: isSelected ? color : Colors.transparent,
          width: 2.5,
        ),
        boxShadow: [
          BoxShadow(
            color: isSelected ? color.withOpacity(0.2) : Colors.black12,
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Stack(
          children: [
            if (isSelected)
              Positioned.fill(
                child: Container().animate(onPlay: (c) => c.repeat()).shimmer(
                    duration: 2.seconds, color: Colors.white.withOpacity(0.2)),
              ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Icon(tier['icon'] as IconData,
                            color: color, size: 24),
                      ),
                      if (tier['isPopular'] == true)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: color,
                            borderRadius: BorderRadius.circular(15),
                          ),
                          child: Text(
                            l10n.subMostPopular,
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(tier['title'],
                      style: const TextStyle(
                          fontWeight: FontWeight.w900, fontSize: 24)),
                  Row(
                    children: [
                      Text(tier['price'],
                          style: TextStyle(
                              color: color,
                              fontWeight: FontWeight.w900,
                              fontSize: 18)),
                      Text(tier['period'],
                          style: const TextStyle(
                              fontSize: 14, color: Colors.grey)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 10),
                  Expanded(
                    child: ListView(
                      physics: const NeverScrollableScrollPhysics(),
                      children: (tier['features'] as List<dynamic>)
                          .map((feat) => Padding(
                                padding: const EdgeInsets.only(bottom: 8.0),
                                child: Row(
                                  children: [
                                    Icon(Icons.check_circle_outline,
                                        color: color, size: 16),
                                    const SizedBox(width: 8),
                                    Expanded(
                                        child: Text(feat.toString(),
                                            style:
                                                const TextStyle(fontSize: 13))),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubscribeButton(
      AuthProvider authProvider, AppLocalizations l10n) {
    final displayTiers = _getDisplayTiers(l10n);
    final tier = displayTiers.firstWhere((t) => t['id'] == _selectedTier,
        orElse: () => displayTiers[1]);
    final color = tier['color'] as Color;

    final Widget button = SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        onPressed: (authProvider.isLoading || iapService.purchasePending)
            ? null
            : () async {
                HapticFeedback.lightImpact();
                final success =
                    await authProvider.initiateSubscription(_selectedTier);
                if (success && mounted) {
                  AppSnackBar.info(context, l10n.subPurchaseStarted);
                } else if (mounted) {
                  AppSnackBar.error(
                      context, authProvider.error ?? l10n.subPurchaseError);
                }
              },
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          elevation: 5,
        ),
        child: (authProvider.isLoading || iapService.purchasePending)
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                    color: Colors.white, strokeWidth: 2))
            : Text(
                (Provider.of<AuthProvider>(context, listen: false).user?.isExpired ?? false)
                    ? l10n.subRenew
                    : l10n.subSwitchTo(
                        tier['title'].toString().replaceAll('ChefVision ', '')),
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        children: [
          button
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .scaleXY(begin: 1.0, end: 1.03, duration: 1.seconds),
          const SizedBox(height: 12),
          Text(l10n.subAutoRenew,
              style: const TextStyle(fontSize: 11, color: Colors.grey)),
          const SizedBox(height: 10),
          TextButton(
            onPressed: _openTermsOfUse,
            child: Text(
              _termsLabel(Localizations.localeOf(context)),
              style: TextStyle(
                fontSize: 12,
                color: color,
                decoration: TextDecoration.underline,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIndicator(AppLocalizations l10n) {
    final availableTiers = _getDisplayTiers(l10n);
    final tierOrderList = ['plus', 'pro', 'premium'];
    final userTier = Provider.of<AuthProvider>(context, listen: false)
            .user
            ?.subscriptionTier ??
        'free';
    final currentTierIndex = tierOrderList.indexOf(userTier) + 1;
    final tiers = availableTiers.where((tier) {
      final tierIdx = tierOrderList.indexOf(tier['id'] as String);
      return (tierIdx + 1) > currentTierIndex;
    }).toList();

    if (tiers.length < 2) return const SizedBox.shrink();
    final selectedIdx = tiers.indexWhere((t) => t['id'] == _selectedTier);

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(tiers.length, (index) {
        final isSelected = index == selectedIdx;
        return AnimatedContainer(
          duration: 300.ms,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          height: 6,
          width: isSelected ? 18 : 6,
          decoration: BoxDecoration(
            color: isSelected
                ? _getSelectedColor(l10n)
                : Colors.grey.withOpacity(0.3),
            borderRadius: BorderRadius.circular(3),
          ),
        );
      }),
    );
  }

  Widget _buildActiveSubscriptionInfo(String tier, AppLocalizations l10n) {
    final fallbackTiers = _getFallbackTiers(l10n);
    final tierData = fallbackTiers.firstWhere((t) => t['id'] == tier,
        orElse: () => fallbackTiers[1]);
    final color = tierData['color'] as Color;

    final Widget checkIcon =
        Icon(Icons.check_circle_rounded, color: color, size: 64);

    return GlassCard(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          checkIcon
              .animate()
              .scale(duration: 500.ms, curve: Curves.easeOutBack),
          const SizedBox(height: 24),
          Text(l10n.subYourPlan(tierData['title']),
              style:
                  const TextStyle(fontWeight: FontWeight.w900, fontSize: 24)),
          const SizedBox(height: 12),
          Text(l10n.subEnjoyPerks,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16)),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            const SubscriptionManagementScreen()));
              },
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: color, width: 2),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: Text(l10n.subManage,
                  style: TextStyle(color: color, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}

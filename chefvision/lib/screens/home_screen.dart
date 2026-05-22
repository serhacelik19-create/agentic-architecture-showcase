import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/app_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../providers/recipe_provider.dart';
import '../services/api_service.dart';
import '../services/pantry_service.dart';
import '../services/iap_service.dart';
import '../providers/guest_provider.dart';
import '../models/pantry_item.dart';
import 'camera_screen.dart';
import 'ingredients_screen.dart';
import 'pantry_screen.dart';
import 'recipe_detail_screen.dart';
import 'cooking_mode_screen.dart';
import 'shopping_list_screen.dart';
import 'subscription_screen.dart';
import 'edit_profile_screen.dart';
import '../models/recipe.dart';
import 'recipe_list_screen.dart';
import 'notifications_screen.dart';
import '../providers/notification_provider.dart';
import '../models/notification.dart';
import 'login_screen.dart';
import 'register_screen.dart';
import '../widgets/feature_locked_modal.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import 'chat_screen.dart' as import_chat;
import 'admin_chat_list_screen.dart' as import_admin;

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with WidgetsBindingObserver {
  int _currentIndex = 0;
  List<Map<String, dynamic>>? _dailyRecipes;
  bool _dailyLoading = false;
  List<PantryItem> _expiringItems = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadExpiringItems();
    _loadDailyRecipes();
    // Refresh profile on screen load to catch dashboard changes
    _refreshProfile();
    // Listen for subscription changes so UI updates without app restart
    iapService.onSubscriptionVerified = () {
      _refreshProfile();
    };
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // App came back to foreground — refresh profile to sync subscription changes
      _refreshProfile();
    }
  }

  Future<void> _refreshProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.refreshProfile();
    } catch (e) {
      debugPrint('Auto profile refresh failed: $e');
    }
  }

  Future<void> _loadExpiringItems() async {
    try {
      final items = await pantryService.getExpiringItems(days: 3);
      final allItems = await pantryService.getPantryItems();
      if (mounted) {
        setState(() => _expiringItems = items);
        Provider.of<AppProvider>(context, listen: false)
            .setPantryCount(allItems.length);

        // Otomatik bildirim oluşturma
        if (items.isNotEmpty) {
          final l10n = AppLocalizations.of(context)!;
          final notificationProvider =
              Provider.of<NotificationProvider>(context, listen: false);
          for (var item in items) {
            final isExpired = item.isExpired;
            notificationProvider.addNotification(
              title: isExpired ? l10n.notifProductExpired : l10n.notifTimeLow,
              message: isExpired
                  ? l10n.notifProductExpiredMessage(
                      item.getLocalizedIngredientName(l10n.localeName))
                  : l10n.notifTimeLowMessage(
                      item.getLocalizedIngredientName(l10n.localeName)),
              type:
                  isExpired ? NotificationType.error : NotificationType.warning,
            );
          }
        }
      }
    } catch (_) {}
  }

  void _showUpgradeDialog(
      BuildContext context, String title, String message, String icon,
      {String tier = 'pro'}) {
    FeatureLockedModal.show(
      context,
      title: title,
      message: message,
      icon: icon,
      tierRequired: tier,
    );
  }

  /// Scale factor based on reference width of 392px (typical phone).
  /// Ensures UI scales proportionally on different screen sizes.
  double _s(BuildContext context) => MediaQuery.of(context).size.width / 392.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(context),
          _buildProfileTab(context),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildHomeTab(BuildContext context) {
    final s = _s(context);
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: EdgeInsets.all(20.0 * s),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              _buildHeader(context),
              const SizedBox(height: 16),

              // Resume Cooking Card
              _buildResumeCookingCard(context),

              // Recent Suggestions (NEW)
              _buildRecentSuggestions(context),

              // Main Action Card
              _buildMainActionCard(context),
              const SizedBox(height: 24),

              // Quick Actions
              _buildQuickActions(context),
              const SizedBox(height: 30),

              // Daily World Cuisine Section
              _buildSectionTitle(
                  context, AppLocalizations.of(context)!.worldCuisineSelection),
              const SizedBox(height: 16),
              _buildDailyWorldCuisine(context),
              const SizedBox(height: 30),

              // Expiry Warning
              _buildExpiryWarning(context),

              // Tips Section
              _buildTipsCard(context),
            ],
          ),
        ),
      ),
    );
  }

  String _getGreeting(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return l10n.greetingMorning;
    if (hour >= 12 && hour < 18) return l10n.greetingAfternoon;
    if (hour >= 18 && hour < 22) return l10n.greetingEvening;
    return l10n.greetingNight;
  }

  String _getGreetingEmoji() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 22) return '🌆';
    return '🌙';
  }

  Widget _buildHeader(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final l10n = AppLocalizations.of(context)!;
    final userName = authProvider.user?.name;
    final greeting = _getGreeting(context);
    final emoji = _getGreetingEmoji();

    final greetingText = userName != null && userName.isNotEmpty
        ? '$greeting, $userName! $emoji'
        : '$greeting! $emoji';

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                greetingText,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontSize: 15,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                l10n.whatToCook,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              if (authProvider.user?.subscriptionTier == 'free' &&
                  !(authProvider.user?.isExpired ?? false))
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.3)),
                    ),
                    child: Text(
                      l10n.trialRemaining(
                          authProvider.user?.totalFreeGenerations ?? 0, 5),
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              if (authProvider.user?.isExpired ?? false)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const SubscriptionScreen()),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFF9800), Color(0xFFF57C00)],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.warning_amber_rounded,
                              color: Colors.white, size: 14),
                          const SizedBox(width: 6),
                          Flexible(
                            child: Text(
                              l10n.subExpiredBanner,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
        Consumer<NotificationProvider>(
          builder: (context, notificationProvider, child) {
            final unreadCount = notificationProvider.unreadCount;
            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => const NotificationsScreen()),
                ).then((_) => _loadExpiringItems());
              },
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardTheme.color,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                          color:
                              Theme.of(context).dividerColor.withOpacity(0.1)),
                    ),
                    child: Icon(
                      Icons.notifications_outlined,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  if (unreadCount > 0)
                    Positioned(
                      top: -4,
                      right: -4,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: AppTheme.errorColor,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          unreadCount > 9 ? '9+' : unreadCount.toString(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ],
    ).animate().fadeIn(duration: 300.ms).slideX(begin: -0.1, end: 0);
  }

  Widget _buildMainActionCard(BuildContext context) {
    return GlassCard(
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(
                  Icons.camera_alt_rounded,
                  color: Colors.white,
                  size: 32,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      AppLocalizations.of(context)!.scanIngredients,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      AppLocalizations.of(context)!.scanIngredientsSubtitle,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: GradientButton(
                  text: AppLocalizations.of(context)!.takePhoto,
                  icon: Icons.camera_alt_rounded,
                  onPressed: () {
                    final auth =
                        Provider.of<AuthProvider>(context, listen: false);
                    final guestProvider =
                        Provider.of<GuestProvider>(context, listen: false);

                    if (guestProvider.isGuest) {
                      if (!guestProvider.canScan) {
                        _showUpgradeDialog(
                          context,
                          "Ücretsiz Tarama Hakkınız Doldu", // Fallback, normally localization
                          "Misafir olarak kullanabileceğiniz 2 ücretsiz kamera tarama hakkınızı kullandınız. Sınırsız tarama ve tarifler için ücretsiz hesabınızı oluşturun!",
                          '📸',
                          tier: 'free',
                        );
                        return;
                      }
                    }

                    if (!guestProvider.isGuest &&
                        !auth.checkRestriction(context)) return;

                    final user = auth.user;
                    if (user != null &&
                        ['free', 'plus'].contains(user.subscriptionTier)) {
                      _showUpgradeDialog(
                        context,
                        AppLocalizations.of(context)!.cameraLocked,
                        AppLocalizations.of(context)!.cameraLockedMessage,
                        '📸',
                        tier: 'pro',
                      );
                      return;
                    }
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const CameraScreen()),
                    ).then((_) => _loadExpiringItems());
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  height: 54,
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                        color: AppTheme.primaryColor.withOpacity(0.3)),
                  ),
                  child: InkWell(
                    onTap: () {
                      final auth =
                          Provider.of<AuthProvider>(context, listen: false);
                      final guestProvider =
                          Provider.of<GuestProvider>(context, listen: false);

                      if (guestProvider.isGuest) {
                        if (!guestProvider.canGenerateRecipe) {
                          _showUpgradeDialog(
                            context,
                            "Ücretsiz Tarif Hakkınız Doldu", // Fallback, normally localization
                            "Misafir olarak kullanabileceğiniz 3 ücretsiz tarif hakkınızı kullandınız. Sınırsız tarama ve tarifler için ücretsiz hesabınızı oluşturun!",
                            '🍽️',
                            tier: 'free',
                          );
                          return;
                        }
                      }

                      if (!guestProvider.isGuest &&
                          !auth.checkRestriction(context)) return;

                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const IngredientsScreen()),
                      ).then((_) => _loadExpiringItems());
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.edit_note_rounded,
                            color: AppTheme.primaryColor),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            AppLocalizations.of(context)!.typeYourself,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(delay: 100.ms, duration: 300.ms)
        .slideY(begin: 0.1, end: 0);
  }

  Widget _buildQuickActions(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: [
          _QuickActionCard(
            icon: Icons.kitchen_rounded,
            title: AppLocalizations.of(context)!.myPantry,
            subtitle: AppLocalizations.of(context)!.yourIngredients,
            color: AppTheme.successColor,
            onTap: () {
              final auth = Provider.of<AuthProvider>(context, listen: false);
              if (!auth.checkRestriction(context)) return;

              final user = auth.user;
              if (user != null &&
                  ['free', 'plus'].contains(user.subscriptionTier)) {
                _showUpgradeDialog(
                  context,
                  AppLocalizations.of(context)!.pantryTracking,
                  AppLocalizations.of(context)!.pantryTrackingMessage,
                  '🏠',
                  tier: 'pro',
                );
                return;
              }
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PantryScreen()),
              ).then((_) => _loadExpiringItems());
            },
          ),
          const SizedBox(width: 12),
          _QuickActionCard(
            icon: Icons.shopping_cart_rounded,
            title: AppLocalizations.of(context)!.shoppingList,
            subtitle: AppLocalizations.of(context)!.yourList,
            color: AppTheme.primaryColor,
            onTap: () {
              final auth = Provider.of<AuthProvider>(context, listen: false);
              if (!auth.checkRestriction(context)) return;

              final user = auth.user;
              if (user != null &&
                  ['free', 'plus'].contains(user.subscriptionTier)) {
                _showUpgradeDialog(
                  context,
                  AppLocalizations.of(context)!.shoppingListLocked,
                  AppLocalizations.of(context)!.shoppingListLockedMessage,
                  '🛒',
                  tier: 'pro',
                );
                return;
              }
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ShoppingListScreen()),
              );
            },
          ),
          const SizedBox(width: 12),
        ],
      ),
    ).animate().fadeIn(delay: 150.ms, duration: 300.ms);
  }

  Widget _buildSectionTitle(BuildContext context, String title,
      {VoidCallback? onAction, String? actionText}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
        ),
        if (onAction != null)
          TextButton(
            onPressed: onAction,
            child: Text(actionText ?? AppLocalizations.of(context)!.viewAll),
          ),
      ],
    );
  }

  void _loadDailyRecipes() async {
    if (_dailyLoading || _dailyRecipes != null) return;
    _dailyLoading = true;
    try {
      final recipes = await apiService.getDailyRecipes();
      if (mounted) {
        setState(() {
          _dailyRecipes = recipes;
          _dailyLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _dailyLoading = false);
      }
    }
  }

  Widget _buildDailyWorldCuisine(BuildContext context) {
    final cardColors = [
      const Color(0xFFFF6B6B),
      const Color(0xFFFFB347),
      const Color(0xFF9B59B6),
    ];

    return Consumer<RecipeProvider>(
      builder: (context, provider, _) {
        // Trigger load if empty and not loading (and not already loaded today)
        if (provider.dailyWorldRecipes.isEmpty && !provider.isLoading) {
          // We use a microtask to avoid setState during build
          Future.microtask(() => provider.loadDailyWorldCuisine());
        }

        if (provider.isLoading && provider.dailyWorldRecipes.isEmpty) {
          return SizedBox(
            height: 180,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              separatorBuilder: (_, __) => const SizedBox(width: 16),
              itemBuilder: (context, index) {
                return Container(
                  width: 300, // Fixed width for shimmer
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: Theme.of(context).dividerColor.withOpacity(0.1),
                    ),
                  ),
                  child: Center(
                    child: SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: cardColors[index],
                      ),
                    ),
                  ),
                ).animate(onPlay: (c) => c.repeat()).shimmer(
                      duration: 800.ms,
                      color: Theme.of(context).dividerColor.withOpacity(0.1),
                    );
              },
            ),
          );
        }

        final allRecipes = provider.dailyWorldRecipes;
        if (allRecipes.isEmpty) {
          return const SizedBox(height: 0, width: 0);
        }

        // Force exactly 3 items by cycling if needed
        List<dynamic> recipes = [];
        int count = 0;
        while (recipes.length < 3) {
          recipes.add(allRecipes[count % allRecipes.length]);
          count++;
        }

        return SizedBox(
          height: 210,
          child: Row(
            children: [
              for (int i = 0; i < 3; i++)
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(right: i < 2 ? 12.0 : 0),
                    child: _buildRecipeItem(
                        context, _recipeToMap(recipes[i]), i, cardColors),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  // Helper because _buildRecipeItem expects Map<String, dynamic>
  // (We should refactor _buildRecipeItem to take Recipe object later, but for now this is faster)
  Map<String, dynamic> _recipeToMap(dynamic recipe) {
    // If it's already a map, return it
    if (recipe is Map<String, dynamic>) return recipe;

    // If it's a Recipe object, convert to json/map
    // We need to access the provider or create a helper in the model
    // Since we don't have easy access to toJson here without casting,
    // we'll do a manual manual mapping or use the provider's helper if public (it's private).
    // Best is to use the model's toJson if available.
    try {
      return (recipe as dynamic).toJson();
    } catch (e) {
      return {};
    }
  }

  Widget _buildRecipeItem(BuildContext context, Map<String, dynamic> recipe,
      int index, List<Color> cardColors) {
    final color = cardColors[index % cardColors.length];
    final title =
        recipe['title'] as String? ?? AppLocalizations.of(context)!.recipe;
    final cuisine = recipe['cuisine'] as String? ?? '';
    // Use dynamic icon based on cuisine/title if not explicitly provided or if default
    String emoji =
        (recipe['emoji'] ?? recipe['custom_emoji']) as String? ?? '🍽️';
    if (emoji == '🍽️') {
      emoji = _getIconForCuisine(cuisine, title);
    }

    Widget card = _RecipeCard(
      key: ValueKey(title),
      title: title,
      time:
          '${recipe['total_time'] ?? '30'} ${AppLocalizations.of(context)!.minuteAbbr}',
      emoji: emoji,
      color: color,
      cuisine: cuisine,
      onTap: () {
        final detailRecipe = Recipe(
          id: 0,
          title: recipe['title'] as String? ??
              AppLocalizations.of(context)!.recipe,
          description: recipe['description'] as String?,
          instructions: [],
          prepTime: recipe['prep_time'] as int? ??
              ((recipe['total_time'] as int? ?? 30) / 3).round(),
          cookTime: recipe['cook_time'] as int? ??
              ((recipe['total_time'] as int? ?? 30) * 2 / 3).round(),
          servings: 2,
          difficulty: AppLocalizations.of(context)!.filterEasy,
          cuisine: recipe['cuisine'] as String?,
          customEmoji: recipe['emoji'] as String? ?? '🍽️',
          ingredients: [],
        );

        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (_) => RecipeDetailScreen(recipe: detailRecipe)),
        );
      },
    );

    return card
        .animate()
        .fadeIn(delay: (100 + index * 50).ms, duration: 300.ms);
  }

  List<String> _getTips(AppLocalizations l10n) => [
        l10n.tipWaste,
        l10n.tipSalt,
        l10n.tipOnion,
        l10n.tipPasta,
        l10n.tipBread,
        l10n.tipLemon,
        l10n.tipGreens,
        l10n.tipGarlic,
        l10n.tipEgg,
        l10n.tipRice,
        l10n.tipPan,
        l10n.tipMeat,
        l10n.tipYogurt,
        l10n.tipSteam,
        l10n.tipSpices,
        l10n.tipParmesan,
        l10n.tipAvocado,
        l10n.tipBroth,
        l10n.tipTomato,
        l10n.tipHerbs,
        l10n.tipDishes,
        l10n.tipCake,
        l10n.tipSalad,
        l10n.tipOliveOil,
        l10n.tipRosemary,
        l10n.tipBeans,
        l10n.tipBrothCubes,
        l10n.tipFries,
        l10n.tipFreshEgg,
        l10n.tipCoffee,
      ];

  Widget _buildExpiryWarning(BuildContext context) {
    if (_expiringItems.isEmpty) return const SizedBox.shrink();

    final count = _expiringItems.length;
    final expiredCount = _expiringItems.where((i) => i.isExpired).length;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: GestureDetector(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const PantryScreen()),
          );
        },
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: expiredCount > 0
                  ? [
                      AppTheme.errorColor.withOpacity(0.1),
                      AppTheme.warningColor.withOpacity(0.05)
                    ]
                  : [
                      AppTheme.warningColor.withOpacity(0.1),
                      AppTheme.warningColor.withOpacity(0.05)
                    ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: expiredCount > 0
                  ? AppTheme.errorColor.withOpacity(0.3)
                  : AppTheme.warningColor.withOpacity(0.3),
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: (expiredCount > 0
                          ? AppTheme.errorColor
                          : AppTheme.warningColor)
                      .withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  expiredCount > 0 ? '🚨' : '⚠️',
                  style: const TextStyle(fontSize: 24),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      expiredCount > 0
                          ? AppLocalizations.of(context)!
                              .itemsExpired(expiredCount)
                          : AppLocalizations.of(context)!.itemsExpiring(count),
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: expiredCount > 0
                                ? AppTheme.errorColor
                                : AppTheme.warningColor,
                          ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _expiringItems
                          .take(3)
                          .map((i) => i.getLocalizedIngredientName(
                              AppLocalizations.of(context)!.localeName))
                          .join(', '),
                      style: Theme.of(context).textTheme.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right,
                  color: expiredCount > 0
                      ? AppTheme.errorColor
                      : AppTheme.warningColor),
            ],
          ),
        ),
      ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0),
    );
  }

  String _getIconForCuisine(String cuisine, String title) {
    final lowerCuisine = cuisine.toLowerCase();
    final lowerTitle = title.toLowerCase();

    if (lowerCuisine.contains('kore') || lowerTitle.contains('kore')) {
      return '🥢';
    }
    if (lowerCuisine.contains('japon') ||
        lowerTitle.contains('sushi') ||
        lowerTitle.contains('ramen')) {
      return '🍣';
    }
    if (lowerCuisine.contains('çin') || lowerTitle.contains('noodle')) {
      return '🥡';
    }
    if (lowerCuisine.contains('i̇talyan') ||
        lowerTitle.contains('pizza') ||
        lowerTitle.contains('makarna')) {
      return '🍝';
    }
    if (lowerCuisine.contains('meksi') || lowerTitle.contains('taco')) {
      return '🌮';
    }
    if (lowerCuisine.contains('hint') || lowerTitle.contains('kör')) {
      return '🍛';
    }
    if (lowerCuisine.contains('türk') || lowerTitle.contains('kebap')) {
      return '🍖';
    }
    if (lowerCuisine.contains('fran') || lowerTitle.contains('kruvasan')) {
      return '🥐';
    }
    if (lowerCuisine.contains('amerikan') || lowerTitle.contains('burger')) {
      return '🍔';
    }
    if (lowerTitle.contains('salata') || lowerTitle.contains('ot')) {
      return '🥗';
    }
    if (lowerTitle.contains('çorba')) {
      return '🍲';
    }
    if (lowerTitle.contains('pilav')) {
      return '🍚';
    }
    if (lowerTitle.contains('yumurta') || lowerTitle.contains('kahvaltı')) {
      return '🍳';
    }
    if (lowerTitle.contains('balık') || lowerTitle.contains('deniz')) {
      return '🐟';
    }
    if (lowerTitle.contains('tavuk')) {
      return '🍗';
    }
    if (lowerTitle.contains('et') || lowerTitle.contains('biftek')) {
      return '🥩';
    }
    if (lowerTitle.contains('tatlı') ||
        lowerTitle.contains('pasta') ||
        lowerTitle.contains('kek')) {
      return '🍰';
    }
    if (lowerTitle.contains('kahve')) {
      return '☕';
    }

    return '🍽️';
  }

  String _getDailyTip(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final tips = _getTips(l10n);
    final dayOfYear =
        DateTime.now().difference(DateTime(DateTime.now().year, 1, 1)).inDays;
    return tips[dayOfYear % tips.length];
  }

  Widget _buildTipsCard(BuildContext context) {
    return GlassCard(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.accentColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Text('💡', style: TextStyle(fontSize: 28)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppLocalizations.of(context)!.dailyTip,
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: AppTheme.accentColor,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  _getDailyTip(context),
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 200.ms, duration: 300.ms);
  }

  Widget _buildProfileTab(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final appProvider = Provider.of<AppProvider>(context);
    final guestProvider = Provider.of<GuestProvider>(context);
    final user = authProvider.user;

    if (guestProvider.isGuest) {
      return _buildGuestProfileTab(context, guestProvider, appProvider);
    }

    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: EdgeInsets.all(20.0 * _s(context)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile Header
              _buildProfileHeader(context, user, appProvider),
              const SizedBox(height: 25),

              // Subscription Card
              _buildSubscriptionCard(context, authProvider),
              const SizedBox(height: 30),

              // Stats Row
              _buildProfileStats(context, appProvider),
              const SizedBox(height: 30),

              // Dietary Preferences Section (Collapsible)
              _buildDietaryPreferences(context, appProvider),
              const SizedBox(height: 24),

              // Allergy Section (Collapsible)
              _buildAllergyPreferences(context, appProvider),
              const SizedBox(height: 30),

              // Settings Section
              _buildSectionTitle(
                  context, AppLocalizations.of(context)!.appSettings),
              const SizedBox(height: 16),
              _buildProfileSettings(context, appProvider),
              const SizedBox(height: 40),

              // Logout Button
              _buildBottomActionButtons(context, authProvider, isGuest: false),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGuestProfileTab(BuildContext context,
      GuestProvider guestProvider, AppProvider appProvider) {
    final l10n = AppLocalizations.of(context)!;
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: EdgeInsets.all(20.0 * _s(context)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Guest Header
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey,
                    ),
                    child: CircleAvatar(
                      radius: 45 * _s(context),
                      backgroundColor:
                          Theme.of(context).scaffoldBackgroundColor,
                      child: CircleAvatar(
                        radius: 41 * _s(context),
                        backgroundColor: Colors.grey.withOpacity(0.1),
                        child: Icon(
                          Icons.person_outline,
                          size: 40 * _s(context),
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.guestChefName,
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.grey.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            l10n.unregisteredAccount,
                            style: const TextStyle(
                              color: Colors.black54,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 25),

              // CTA Card
              GlassCard(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: AppTheme.primaryGradient,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.star_rounded,
                          color: Colors.white, size: 32),
                    ).animate().scale(
                        duration: 600.ms,
                        curve: Curves.elasticOut,
                        begin: const Offset(0.5, 0.5)),
                    const SizedBox(height: 16),
                    Text(
                      l10n.premiumDiscover,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor,
                          ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      l10n.guestSignUpDesc,
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    GradientButton(
                      text: l10n.registerButton,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const RegisterScreen()),
                        );
                      },
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1, end: 0),
              const SizedBox(height: 30),

              // Usage Limits Card
              _buildSectionTitle(context, l10n.usageLimitsTitle),
              const SizedBox(height: 16),
              GlassCard(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    _buildUsageLimitRow(
                      context,
                      l10n.usageLimitCamera,
                      Icons.camera_alt_outlined,
                      guestProvider.scansLeft,
                      GuestProvider.maxScans,
                      AppTheme.primaryColor,
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12.0),
                      child: Divider(),
                    ),
                    _buildUsageLimitRow(
                      context,
                      l10n.usageLimitAiRecipe,
                      Icons.restaurant_menu,
                      guestProvider.recipesLeft,
                      GuestProvider.maxRecipes,
                      AppTheme.secondaryColor,
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 200.ms),
              const SizedBox(height: 30),

              // Settings Section
              _buildSectionTitle(context, l10n.appSettings),
              const SizedBox(height: 16),
              Column(
                children: [
                  _buildSettingToggle(
                    context,
                    l10n.darkMode,
                    l10n.darkModeSubtitle,
                    Icons.dark_mode_rounded,
                    AppTheme.primaryColor,
                    appProvider.themeMode == ThemeMode.dark,
                    (val) => appProvider.toggleTheme(val),
                  ),
                  const SizedBox(height: 16),
                  _buildLanguageSelector(context, appProvider),
                  const SizedBox(height: 16),
                  _buildSettingToggle(
                    context,
                    l10n.foodWaste,
                    l10n.foodWasteSubtitle,
                    Icons.eco_rounded,
                    AppTheme.successColor,
                    appProvider.prioritizeWaste,
                    (val) => appProvider.setPrioritizeWaste(val),
                  ),
                ],
              ).animate().fadeIn(delay: 250.ms),
              const SizedBox(height: 40),

              // Login/Logout Button
              _buildBottomActionButtons(context, authProvider, isGuest: true),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUsageLimitRow(BuildContext context, String title, IconData icon,
      int current, int max, Color color) {
    double progress = max > 0 ? current / max : 0.0;
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: progress,
                backgroundColor: color.withOpacity(0.1),
                color: color,
                borderRadius: BorderRadius.circular(4),
                minHeight: 8,
              ),
            ],
          ),
        ),
        const SizedBox(width: 16),
        Text(
          "$current / $max",
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: current == 0 ? AppTheme.errorColor : color,
              ),
        ),
      ],
    );
  }

  Widget _buildProfileHeader(
      BuildContext context, dynamic user, AppProvider appProvider) {
    return Row(
      children: [
        Stack(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppTheme.primaryGradient,
              ),
              child: CircleAvatar(
                radius: 45 * _s(context),
                backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                child: CircleAvatar(
                  radius: 41 * _s(context),
                  backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                  child: Text(
                    user?.name?.substring(0, 1).toUpperCase() ?? 'G',
                    style: TextStyle(
                      fontSize: 32 * _s(context),
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppTheme.successColor,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle,
                    color: Colors.white, size: 16),
              ),
            ),
          ],
        ),
        const SizedBox(width: 20),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    user?.name ?? AppLocalizations.of(context)!.gourmetUser,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  if (user != null && user.subscriptionTier != 'free') ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        gradient: AppTheme.accentGradient,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        user.subscriptionTier.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 4),
              _buildChefTitle(context, appProvider.favoriteRecipes.length),
              const SizedBox(height: 8),
              Text(
                user?.email ?? 'chefvision@email.com',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSubscriptionCard(
      BuildContext context, AuthProvider authProvider) {
    final userTier = authProvider.user?.subscriptionTier ?? 'free';
    final hasPlan = userTier != 'free';

    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.star_rounded,
                    color: Colors.white, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      hasPlan
                          ? AppLocalizations.of(context)!
                              .subscriptionActive(userTier.toUpperCase())
                          : AppLocalizations.of(context)!.premiumDiscover,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    Text(
                      hasPlan
                          ? AppLocalizations.of(context)!
                              .subscriptionActiveSubtitle
                          : AppLocalizations.of(context)!.premiumSubtitle,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          if (!hasPlan)
            GradientButton(
              text: AppLocalizations.of(context)!.subscriptionPlans,
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SubscriptionScreen()),
                );
              },
            )
          else
            OutlinedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SubscriptionScreen()),
                );
              },
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(AppLocalizations.of(context)!.manageSubscription),
            ),
        ],
      ),
    ).animate().fadeIn(delay: 50.ms).scale(begin: const Offset(0.9, 0.9));
  }

  Widget _buildChefTitle(BuildContext context, int favoritesCount) {
    String title;
    final l10n = AppLocalizations.of(context)!;
    if (favoritesCount >= 10) {
      title = l10n.chefTitleMaster;
    } else if (favoritesCount >= 4) {
      title = l10n.chefTitleIntermediate;
    } else {
      title = l10n.chefTitleBeginner;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.accentColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        title,
        style: const TextStyle(
          color: AppTheme.accentColor,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildProfileStats(BuildContext context, AppProvider provider) {
    final favoritesCount = provider.favoriteRecipes.length;
    // We need to fetch pantry count, for now let's assume we have access or use a dummy
    // Ideally we'd use a service, but let's stick to provider data if available

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            context,
            AppLocalizations.of(context)!.statFavorites,
            favoritesCount.toString(),
            Icons.favorite_rounded,
            AppTheme.errorColor,
          ),
        ),
        const SizedBox(width: 15),
        Expanded(
          child: _buildStatCard(
            context,
            AppLocalizations.of(context)!.statPantry,
            provider.pantryCount.toString(),
            Icons.shopping_basket_rounded,
            AppTheme.successColor,
          ),
        ),
        const SizedBox(width: 15),
        Expanded(
          child: _buildStatCard(
            context,
            AppLocalizations.of(context)!.statCooked,
            '5',
            Icons.local_fire_department_rounded,
            AppTheme.warningColor,
          ),
        ),
      ],
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2, end: 0);
  }

  Widget _buildStatCard(BuildContext context, String title, String value,
      IconData icon, Color color) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
          ),
          const SizedBox(height: 4),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              title,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDietaryPreferences(BuildContext context, AppProvider provider) {
    final l10n = AppLocalizations.of(context)!;
    final Map<String, String> preferencesMap = {
      'vegan': l10n.prefVegan,
      'vegetarian': l10n.prefVegetarian,
      'gluten_free': l10n.prefGlutenFree,
      'keto': l10n.prefKeto,
      'paleo': l10n.prefPaleo,
      'low_carb': l10n.prefLowCarb,
      'mediterranean': l10n.prefMediterranean,
      'intermittent_fasting': l10n.prefIntermittentFasting,
      'low_fat': l10n.prefLowFat,
      'pescatarian': l10n.prefPescatarian,
      'diabetic_friendly': l10n.prefDiabeticFriendly,
      'high_protein': l10n.prefHighProtein,
    };

    final selectedCount = provider.dietaryPreferences.length;
    final title = selectedCount > 0
        ? '${l10n.dietaryPreferences} ($selectedCount)'
        : l10n.dietaryPreferences;

    return GlassCard(
      padding: EdgeInsets.zero,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          leading: const Icon(Icons.restaurant_menu_rounded,
              color: AppTheme.primaryColor),
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          children: [
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: preferencesMap.entries.map((entry) {
                final key = entry.key;
                final label = entry.value;
                final isSelected = provider.isDietaryPreferenceSelected(key);

                return FilterChip(
                  label: Text(label),
                  selected: isSelected,
                  onSelected: (_) => provider.toggleDietaryPreference(key),
                  backgroundColor: Theme.of(context)
                      .scaffoldBackgroundColor
                      .withOpacity(0.5),
                  selectedColor: AppTheme.primaryColor.withOpacity(0.2),
                  checkmarkColor: AppTheme.primaryColor,
                  labelStyle: TextStyle(
                    color: isSelected
                        ? AppTheme.primaryColor
                        : Theme.of(context).textTheme.bodyMedium?.color,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : Theme.of(context).dividerColor.withOpacity(0.1),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: 150.ms);
  }

  Widget _buildAllergyPreferences(BuildContext context, AppProvider provider) {
    final l10n = AppLocalizations.of(context)!;
    final Map<String, String> allergiesMap = {
      'nuts': l10n.allergyNutsName,
      'milk': l10n.allergyMilk,
      'egg': l10n.allergyEgg,
      'seafood': l10n.allergySeafood,
      'gluten': l10n.allergyGluten,
      'soy': l10n.allergySoyName,
      'peanuts': l10n.allergyPeanuts,
      'mushroom': l10n.allergyMushroom,
      'mustard': l10n.allergyMustard,
      'sesame': l10n.allergySesame,
      'strawberry': l10n.allergyStrawberry,
      'kiwi': l10n.allergyKiwi,
      'celery': l10n.allergyCelery,
    };

    final selectedCount = provider.allergies.length;
    final title = selectedCount > 0
        ? '${l10n.allergies} ($selectedCount)'
        : l10n.allergies;

    return GlassCard(
      padding: EdgeInsets.zero,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          leading: const Icon(Icons.warning_amber_rounded,
              color: AppTheme.errorColor),
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          children: [
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: allergiesMap.entries.map((entry) {
                final key = entry.key;
                final label = entry.value;
                final isSelected = provider.isAllergySelected(key);

                return FilterChip(
                  label: Text(label),
                  selected: isSelected,
                  onSelected: (_) => provider.toggleAllergy(key),
                  backgroundColor: Theme.of(context)
                      .scaffoldBackgroundColor
                      .withOpacity(0.5),
                  selectedColor: AppTheme.errorColor.withOpacity(0.2),
                  checkmarkColor: AppTheme.errorColor,
                  labelStyle: TextStyle(
                    color: isSelected
                        ? AppTheme.errorColor
                        : Theme.of(context).textTheme.bodyMedium?.color,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: isSelected
                          ? AppTheme.errorColor
                          : Theme.of(context).dividerColor.withOpacity(0.1),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: 200.ms);
  }

  Widget _buildProfileSettings(BuildContext context, AppProvider provider) {
    return Column(
      children: [
        _buildSettingToggle(
          context,
          AppLocalizations.of(context)!.darkMode,
          AppLocalizations.of(context)!.darkModeSubtitle,
          Icons.dark_mode_rounded,
          AppTheme.primaryColor,
          provider.themeMode == ThemeMode.dark,
          (val) => provider.toggleTheme(val),
        ),
        const SizedBox(height: 16),
        _buildLanguageSelector(context, provider),
        const SizedBox(height: 16),
        _buildSettingToggle(
          context,
          AppLocalizations.of(context)!.foodWaste,
          AppLocalizations.of(context)!.foodWasteSubtitle,
          Icons.eco_rounded,
          AppTheme.successColor,
          provider.prioritizeWaste,
          (val) => provider.setPrioritizeWaste(val),
        ),
        const SizedBox(height: 16),
        _buildSettingSlider(
          context,
          AppLocalizations.of(context)!.maxPrepTime,
          AppLocalizations.of(context)!
              .minutesSuffix(provider.maxPrepTime ?? 60),
          Icons.timer_rounded,
          AppTheme.primaryColor,
          provider.maxPrepTime?.toDouble() ?? 60.0,
          (val) => provider.setMaxPrepTime(val.round()),
        ),
        const SizedBox(height: 16),
        _buildEditProfileButton(context),
        const SizedBox(height: 16),
        _buildSupportButton(context),
      ],
    ).animate().fadeIn(delay: 250.ms);
  }

  Widget _buildLanguageSelector(BuildContext context, AppProvider provider) {
    final currentLocale = provider.locale.languageCode;
    final languages = {
      'tr': {'name': 'Türkçe', 'flag': '🇹🇷'},
      'en': {'name': 'English', 'flag': '🇬🇧'},
      'es': {'name': 'Español', 'flag': '🇪🇸'},
      'fr': {'name': 'Français', 'flag': '🇫🇷'},
      'de': {'name': 'Deutsch', 'flag': '🇩🇪'},
      'it': {'name': 'Italiano', 'flag': '🇮🇹'},
    };

    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: InkWell(
        onTap: () {
          showModalBottomSheet(
            context: context,
            backgroundColor: Colors.transparent,
            builder: (context) => Container(
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 16),
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    AppLocalizations.of(context)!.selectLanguage,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 16),
                  ...languages.entries.map((entry) {
                    final code = entry.key;
                    final name = entry.value['name']!;
                    final flag = entry.value['flag']!;
                    final isSelected = currentLocale == code;

                    return ListTile(
                      leading: Text(flag, style: const TextStyle(fontSize: 24)),
                      title: Text(name),
                      trailing: isSelected
                          ? const Icon(Icons.check_circle,
                              color: AppTheme.primaryColor)
                          : null,
                      onTap: () {
                        provider.setLocale(Locale(code));
                        // Refresh daily recipes in the new language
                        Provider.of<RecipeProvider>(context, listen: false)
                            .refreshForLanguage(code);
                        Navigator.pop(context);
                      },
                    );
                  }),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          );
        },
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.language_rounded,
                  color: Colors.blue, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppLocalizations.of(context)!.language,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    languages[currentLocale]?['name'] ?? 'Türkçe',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  Widget _buildEditProfileButton(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: InkWell(
        onTap: () {
          final auth = Provider.of<AuthProvider>(context, listen: false);
          if (!auth.checkRestriction(context)) return;

          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const EditProfileScreen()),
          );
        },
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.manage_accounts_rounded,
                  color: AppTheme.primaryColor, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppLocalizations.of(context)!.editAccountInfo,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    AppLocalizations.of(context)!.editAccountInfoSubtitle,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  Widget _buildTopicItem(BuildContext context, String title, IconData icon,
      Color color, dynamic user) {
    return InkWell(
      onTap: () {
        Navigator.pop(context); // Sheet'i kapat
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => import_chat.ChatScreen(
              userId: user.id.toString(),
              isAdmin: false,
              topic: title,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const Spacer(),
            Icon(Icons.chevron_right_rounded, color: Colors.grey[400]),
          ],
        ),
      ),
    );
  }

  Widget _buildSupportButton(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;
    // Basit Admin kontrolü: E-posta adresi
    final isAdmin = user?.email == 'serhat@chefvision.com' ||
        user?.email == 'admin@chefvision.com';

    return Column(
      children: [
        GlassCard(
          padding: const EdgeInsets.all(16),
          child: InkWell(
            onTap: () {
              if (user == null) return;

              // Konu Seçimi Göster
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                builder: (context) => Container(
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(24)),
                  ),
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppLocalizations.of(context)!.helpQuestion,
                        style: const TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      _buildTopicItem(
                          context,
                          AppLocalizations.of(context)!.topicTechnical,
                          Icons.build_rounded,
                          Colors.blue,
                          user),
                      _buildTopicItem(
                          context,
                          AppLocalizations.of(context)!.topicPayment,
                          Icons.credit_card_rounded,
                          Colors.green,
                          user),
                      _buildTopicItem(
                          context,
                          AppLocalizations.of(context)!.topicSuggestion,
                          Icons.lightbulb_rounded,
                          Colors.orange,
                          user),
                      _buildTopicItem(
                          context,
                          AppLocalizations.of(context)!.topicOther,
                          Icons.help_outline_rounded,
                          Colors.purple,
                          user),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              );
            },
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.support_agent_rounded,
                      color: Colors.orange, size: 22),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppLocalizations.of(context)!.liveSupportTitle,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        AppLocalizations.of(context)!.liveSupportSubtitle,
                        style:
                            const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: Colors.grey),
              ],
            ),
          ),
        ),
        if (isAdmin) ...[
          const SizedBox(height: 16),
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => import_admin.AdminChatListScreen()),
                );
              },
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.admin_panel_settings_rounded,
                        color: Colors.red, size: 22),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          AppLocalizations.of(context)!.adminPanelTitle,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          AppLocalizations.of(context)!.adminPanelSubtitle,
                          style:
                              const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                ],
              ),
            ),
          ),
        ]
      ],
    );
  }

  Widget _buildBottomActionButtons(
      BuildContext context, AuthProvider authProvider,
      {bool isGuest = false}) {
    final l10n = AppLocalizations.of(context)!;
    return Column(
      children: [
        if (isGuest) ...[
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                final guestProvider =
                    Provider.of<GuestProvider>(context, listen: false);
                guestProvider.clearGuestMode();
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
              icon: const Icon(Icons.login_rounded),
              label: Text(l10n.loginOrRegister,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
            ),
          ),
        ] else ...[
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                authProvider.logout();
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
              icon: const Icon(Icons.logout_rounded),
              label: Text(l10n.logout,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.withOpacity(0.1),
                foregroundColor: Colors.red,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
            ),
          ),
        ],
      ],
    ).animate().fadeIn(delay: 300.ms);
  }

  void _showDeleteAccountDialog(
      BuildContext context, AuthProvider authProvider) {
    final l10n = AppLocalizations.of(context)!;
    final passwordController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(
          l10n.deleteAccount,
          style:
              const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              l10n.deleteAccountWarning,
              style: const TextStyle(fontSize: 14, color: Colors.black87),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: l10n.currentPassword,
                prefixIcon: const Icon(Icons.lock_outline),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              l10n.deleteAccountCancel,
              style: const TextStyle(color: Colors.grey),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              if (passwordController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Lütfen şifrenizi girin.")),
                );
                return;
              }

              Navigator.pop(ctx); // Close dialog

              final success =
                  await authProvider.deleteAccount(passwordController.text);

              if (mounted) {
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(l10n.deleteAccountSuccess)),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                        content: Text(authProvider.error ?? 'Hata oluştu')),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: Text(
              l10n.deleteAccountConfirm,
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingToggle(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    bool value,
    Function(bool) onChanged,
  ) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeColor: AppTheme.primaryColor,
          ),
        ],
      ),
    );
  }

  Widget _buildSettingSlider(
    BuildContext context,
    String title,
    String valueText,
    IconData icon,
    Color color,
    double value,
    Function(double) onChanged,
  ) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              Text(
                valueText,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          Slider(
            value: value,
            min: 15,
            max: 120,
            divisions: 7,
            label: value.round().toString(),
            activeColor: AppTheme.primaryColor,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
        border: Border(
          top: BorderSide(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppTheme.darkBorder
                : AppTheme.lightBorder,
            width: 1,
          ),
        ),
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home_rounded),
            activeIcon: const Icon(Icons.home_rounded),
            label: AppLocalizations.of(context)!.home,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_rounded),
            activeIcon: const Icon(Icons.person_rounded),
            label: AppLocalizations.of(context)!.profile,
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSuggestions(BuildContext context) {
    return Consumer<RecipeProvider>(
      builder: (context, provider, _) {
        final suggestions = provider.lastSuggestions;
        if (suggestions.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(
              context,
              AppLocalizations.of(context)!.recentSuggestions,
              actionText: AppLocalizations.of(context)!.clearAction,
              onAction: () => provider.clearAll(),
            ),
            const SizedBox(height: 12),

            // Filters
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: [
                  Container(
                    margin: const EdgeInsets.only(right: 8),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // Sync data to AppProvider so RecipeListScreen can display it
                        final appProvider =
                            Provider.of<AppProvider>(context, listen: false);
                        appProvider
                            .setSuggestedRecipes(provider.lastSuggestions);

                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const RecipeListScreen()),
                        );
                      },
                      icon: const Icon(Icons.arrow_back, size: 18),
                      label:
                          Text(AppLocalizations.of(context)!.returnToRecipes),
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            Theme.of(context).colorScheme.errorContainer,
                        foregroundColor:
                            Theme.of(context).colorScheme.onErrorContainer,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                    ),
                  ),
                  _FilterButton(
                    label: AppLocalizations.of(context)!.viewAll,
                    isActive: provider.activeFilter == 'all',
                    onTap: () => provider.applyFilter('all'),
                  ),
                  const SizedBox(width: 8),
                  _FilterButton(
                    label: AppLocalizations.of(context)!.filterEasy,
                    isActive: provider.activeFilter == 'easy',
                    onTap: () => provider.applyFilter('easy'),
                  ),
                  const SizedBox(width: 8),
                  _FilterButton(
                    label: AppLocalizations.of(context)!.filterFast,
                    isActive: provider.activeFilter == 'fast',
                    onTap: () => provider.applyFilter('fast'),
                  ),
                  const SizedBox(width: 8),
                  _FilterButton(
                    label: AppLocalizations.of(context)!.filterLowCal,
                    isActive: provider.activeFilter == 'low_cal',
                    onTap: () => provider.applyFilter('low_cal'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 140,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: suggestions.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final recipe = suggestions[index];
                  return GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => RecipeDetailScreen(recipe: recipe)),
                      );
                    },
                    child: Container(
                      width: 200,
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardTheme.color,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color:
                              Theme.of(context).dividerColor.withOpacity(0.05),
                        ),
                      ),
                      child: Row(
                        children: [
                          // Recipe Image/Emoji
                          Container(
                            width: 70,
                            height: double.infinity,
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor.withOpacity(0.1),
                              borderRadius: const BorderRadius.horizontal(
                                  left: Radius.circular(20)),
                              image: recipe.imageUrl != null
                                  ? DecorationImage(
                                      image: NetworkImage(recipe.imageUrl!),
                                      fit: BoxFit.cover,
                                    )
                                  : null,
                            ),
                            child: recipe.imageUrl == null
                                ? Center(
                                    child: Text(recipe.cuisineEmoji,
                                        style: const TextStyle(fontSize: 32)))
                                : null,
                          ),
                          // Recipe Info
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    recipe.title,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      const Icon(Icons.access_time,
                                          size: 12,
                                          color: AppTheme.primaryColor),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${recipe.prepTime + recipe.cookTime} ${AppLocalizations.of(context)!.minuteAbbr}',
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodySmall
                                            ?.copyWith(fontSize: 11),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                      .animate()
                      .fadeIn(delay: (index * 50).ms)
                      .slideX(begin: 0.2, end: 0);
                },
              ),
            ),
            const SizedBox(height: 30),
          ],
        );
      },
    );
  }

  Widget _buildResumeCookingCard(BuildContext context) {
    return Consumer<RecipeProvider>(
      builder: (context, provider, _) {
        final recipe = provider.currentRecipe;
        if (recipe == null) return const SizedBox.shrink();

        return Padding(
          padding: const EdgeInsets.only(bottom: 24),
          child: GlassCard(
            gradient: LinearGradient(
              colors: [
                AppTheme.primaryColor.withOpacity(0.15),
                AppTheme.accentColor.withOpacity(0.05),
              ],
            ),
            padding: EdgeInsets.zero,
            child: ListTile(
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor,
                  borderRadius: BorderRadius.circular(12),
                  image: recipe.imageUrl != null
                      ? DecorationImage(
                          image: NetworkImage(recipe.imageUrl!),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: recipe.imageUrl == null
                    ? Center(
                        child: Text(recipe.cuisineEmoji,
                            style: const TextStyle(fontSize: 24)))
                    : null,
              ),
              title: Text(
                AppLocalizations.of(context)!.resumeCooking,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: AppTheme.primaryColor,
                ),
              ),
              subtitle: Text(
                recipe.title,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              trailing: IconButton(
                icon: const Icon(Icons.close, size: 18),
                onPressed: () => provider.clearCurrentRecipe(),
              ),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => CookingModeScreen(recipe: recipe)),
                );
              },
            ),
          ).animate().fadeIn().slideY(begin: -0.2, end: 0),
        );
      },
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppTheme.darkBorder
                : AppTheme.lightBorder,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 14),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}

class _RecipeCard extends StatelessWidget {
  final String title;
  final String time;
  final String emoji;
  final Color color;
  final String cuisine;
  final VoidCallback onTap;

  const _RecipeCard({
    super.key,
    required this.title,
    required this.time,
    required this.emoji,
    required this.color,
    this.cuisine = '',
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.1)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon and Cuisine Tag Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(emoji, style: const TextStyle(fontSize: 32)),
              ],
            ),
            const SizedBox(height: 8),

            // Cuisine Tag
            if (cuisine.isNotEmpty)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  cuisine,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ),

            const Spacer(),

            // Title
            Text(
              title,
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                    fontSize: 12,
                    height: 1.2,
                  ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),

            const SizedBox(height: 8),

            // Time
            Row(
              children: [
                Icon(Icons.access_time_rounded, color: color, size: 14),
                const SizedBox(width: 4),
                Text(
                  time,
                  style: TextStyle(
                      color: color, fontSize: 11, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _FilterButton extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _FilterButton({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.primaryColor
              : Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive
                ? AppTheme.primaryColor
                : Theme.of(context).dividerColor.withOpacity(0.1),
          ),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: AppTheme.primaryColor.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  )
                ]
              : null,
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive
                ? Colors.white
                : Theme.of(context).textTheme.bodyMedium?.color,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}

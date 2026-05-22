import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../services/cloud_tts_service.dart';
import '../services/pantry_service.dart'; // Import pantry service
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../models/recipe.dart';
import '../providers/app_provider.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../providers/recipe_provider.dart';
import '../services/api_service.dart'; // Added for exceptions
import '../widgets/feature_locked_modal.dart'; // Added for UI

import 'package:chefvision_app/l10n/app_localizations.dart';
import 'cooking_mode_screen.dart';

class RecipeDetailScreen extends StatefulWidget {
  final Recipe recipe;

  const RecipeDetailScreen({
    super.key,
    required this.recipe,
  });

  @override
  State<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends State<RecipeDetailScreen> {
  late CloudTtsService _cloudTts;
  int? _playingStepIndex;
  int? _expandedStepIndex;
  bool _showDetailedInstructions = false;
  bool _hasLoadedInstructions = false;
  bool _isLoadingQuick = false;
  bool _isLoadingDetailed = false;

  @override
  void initState() {
    super.initState();
    _initTts();
    // Auto-fetch removed. User must request detailed recipe manually.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<RecipeProvider>(context, listen: false);
      provider.setCurrentRecipe(widget.recipe);
    });
  }

  void _initTts() {
    _cloudTts = CloudTtsService();
    _cloudTts.onComplete = () {
      if (mounted) setState(() => _playingStepIndex = null);
    };
    _cloudTts.onError = () {
      if (mounted) setState(() => _playingStepIndex = null);
    };
  }

  // ignore: unused_element
  Future<void> _speak(String text, int index) async {
    if (_playingStepIndex == index) {
      await _cloudTts.stop();
      setState(() {
        _playingStepIndex = null;
      });
    } else {
      await _cloudTts.stop();
      setState(() {
        _playingStepIndex = index;
      });
      await _cloudTts.speak(text);
    }
  }

  Future<void> _fetchQuickRecipe() async {
    if (_isLoadingQuick) return;
    setState(() => _isLoadingQuick = true);
    final provider = Provider.of<RecipeProvider>(context, listen: false);
    try {
      await provider.fetchRecipeDetail(widget.recipe.title, mode: 'quick');
      if (mounted) {
        setState(() {
          _showDetailedInstructions = false;
          _hasLoadedInstructions = true;
          _isLoadingQuick = false;
        });
      }
    } on FeatureLockedException catch (e) {
      if (mounted) {
        setState(() => _isLoadingQuick = false);
        FeatureLockedModal.show(
          context,
          title: AppLocalizations.of(context)!.quickLabel,
          message: e.message,
          icon: '⚡',
          tierRequired: e.tierRequired,
        );
      }
    } catch (e) {
      debugPrint('Error loading quick recipe: $e');
      if (mounted) {
        setState(() => _isLoadingQuick = false);
        AppSnackBar.error(
            context,
            AppLocalizations.of(context)!
                .detailedRecipeLoadFailed(e.toString()));
      }
    }
  }

  Future<void> _fetchDetailedRecipe() async {
    if (_isLoadingDetailed) return;
    setState(() => _isLoadingDetailed = true);
    final provider = Provider.of<RecipeProvider>(context, listen: false);
    try {
      await provider.fetchRecipeDetail(widget.recipe.title, mode: 'detailed');
      if (mounted) {
        setState(() {
          _showDetailedInstructions = true;
          _hasLoadedInstructions = true;
          _isLoadingDetailed = false;
        });
      }
    } on FeatureLockedException catch (e) {
      if (mounted) {
        setState(() => _isLoadingDetailed = false);
        FeatureLockedModal.show(
          context,
          title: AppLocalizations.of(context)!.detailedRecipe,
          message: e.message,
          icon: '📜',
          tierRequired: e.tierRequired,
        );
      }
    } catch (e) {
      debugPrint('Error loading detail: $e');
      if (mounted) {
        setState(() => _isLoadingDetailed = false);
        AppSnackBar.error(
            context,
            AppLocalizations.of(context)!
                .detailedRecipeLoadFailed(e.toString()));
      }
    }
  }

  @override
  void dispose() {
    _cloudTts.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<RecipeProvider>(builder: (context, provider, child) {
      final recipe = provider.currentRecipe ?? widget.recipe;

      return Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        body: Stack(
          children: [
            CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                // Custom App Bar
                SliverAppBar(
                  expandedHeight: 300,
                  backgroundColor:
                      Theme.of(context).appBarTheme.backgroundColor,
                  leading: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircleAvatar(
                      backgroundColor:
                          Theme.of(context).cardTheme.color?.withOpacity(0.8),
                      child: IconButton(
                        icon: Icon(Icons.arrow_back_ios_new,
                            size: 18,
                            color: Theme.of(context).colorScheme.onSurface),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ),
                  ),
                  actions: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: CircleAvatar(
                        backgroundColor:
                            Theme.of(context).cardTheme.color?.withOpacity(0.8),
                        child: Consumer<AppProvider>(
                          builder: (context, appProvider, _) {
                            final isFav = appProvider.isFavorite(recipe);
                            return IconButton(
                              icon: Icon(
                                isFav ? Icons.favorite : Icons.favorite_border,
                                size: 20,
                                color: isFav
                                    ? AppTheme.errorColor
                                    : Theme.of(context).colorScheme.onSurface,
                              ),
                              onPressed: () =>
                                  appProvider.toggleFavorite(recipe),
                            );
                          },
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: CircleAvatar(
                        backgroundColor:
                            Theme.of(context).cardTheme.color?.withOpacity(0.8),
                        child: IconButton(
                          icon: Icon(Icons.share,
                              size: 20,
                              color: Theme.of(context).colorScheme.onSurface),
                          onPressed: () {},
                        ),
                      ),
                    ),
                  ],
                  flexibleSpace: FlexibleSpaceBar(
                    background: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppTheme.primaryColor.withOpacity(0.85),
                            AppTheme.secondaryColor.withOpacity(0.6),
                            Theme.of(context).scaffoldBackgroundColor,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomCenter,
                          stops: const [0.0, 0.55, 1.0],
                        ),
                      ),
                      child: Stack(
                        children: [
                          // Decorative circles
                          Positioned(
                            top: -40,
                            right: -30,
                            child: Container(
                              width: 160,
                              height: 160,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.08),
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 40,
                            left: -50,
                            child: Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.06),
                              ),
                            ),
                          ),
                          Positioned(
                            top: 60,
                            left: 30,
                            child: Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.1),
                              ),
                            ),
                          ),
                          // Main cuisine emoji
                          Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const SizedBox(height: 30),
                                Container(
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Colors.white.withOpacity(0.15),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.2),
                                      width: 2,
                                    ),
                                  ),
                                  child: Text(
                                    recipe.cuisineEmoji,
                                    style: const TextStyle(fontSize: 64),
                                  ),
                                ).animate().scale(
                                      duration: 400.ms,
                                      curve: Curves.elasticOut,
                                    ),
                                const SizedBox(height: 12),
                                Text(
                                  '${recipe.prepTime + recipe.cookTime} dk',
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.9),
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ).animate().fadeIn(delay: 100.ms),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Content
                SliverToBoxAdapter(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).scaffoldBackgroundColor,
                      borderRadius:
                          const BorderRadius.vertical(top: Radius.circular(30)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Title & Rating
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      recipe.title,
                                      style: Theme.of(context)
                                          .textTheme
                                          .headlineMedium
                                          ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 10,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.primaryColor
                                                .withOpacity(0.15),
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            recipe.cuisine ??
                                                AppLocalizations.of(context)!
                                                    .turkishCuisine,
                                            style: const TextStyle(
                                              color: AppTheme.primaryColor,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 13,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 10),
                                        Text(
                                          '${recipe.difficultyEmoji} ${recipe.difficulty}',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              // Rating
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color:
                                      AppTheme.warningColor.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(
                                      Icons.star_rounded,
                                      color: AppTheme.warningColor,
                                      size: 20,
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      '4.8',
                                      style: TextStyle(
                                        color: AppTheme.warningColor,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ).animate().fadeIn(duration: 300.ms),
                          const SizedBox(height: 16),
                          _buildMissingIngredientsWarning(recipe),
                          const SizedBox(height: 24),

                          // Stats Cards
                          Row(
                            children: [
                              Expanded(
                                child: _StatCard(
                                  icon: Icons.access_time_rounded,
                                  value: '${recipe.prepTime}',
                                  label: AppLocalizations.of(context)!.prepTime,
                                  unit:
                                      AppLocalizations.of(context)!.minuteAbbr,
                                  color: AppTheme.accentColor,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _StatCard(
                                  icon: Icons.outdoor_grill_rounded,
                                  value: '${recipe.cookTime}',
                                  label: AppLocalizations.of(context)!.cookTime,
                                  unit:
                                      AppLocalizations.of(context)!.minuteAbbr,
                                  color: AppTheme.errorColor,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _StatCard(
                                  icon: Icons.people_rounded,
                                  value: '${recipe.servings}',
                                  label: AppLocalizations.of(context)!.servings,
                                  unit: AppLocalizations.of(context)!
                                      .personSuffix,
                                  color: AppTheme.secondaryColor,
                                ),
                              ),
                            ],
                          ).animate().fadeIn(delay: 50.ms, duration: 300.ms),

                          if (recipe.calories != null) ...[
                            const SizedBox(height: 12),
                            GlassCard(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: AppTheme.warningColor
                                          .withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(
                                      Icons.local_fire_department_rounded,
                                      color: AppTheme.warningColor,
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        AppLocalizations.of(context)!.calories,
                                        style: Theme.of(context)
                                            .textTheme
                                            .labelSmall,
                                      ),
                                      Text(
                                        AppLocalizations.of(context)!
                                            .caloriesPerServing(
                                                recipe.calories!),
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleMedium
                                            ?.copyWith(
                                              fontWeight: FontWeight.bold,
                                            ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],

                          const SizedBox(height: 24),

                          // Description
                          if (recipe.description != null) ...[
                            Text(
                              recipe.description!,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyMedium
                                  ?.copyWith(
                                    height: 1.6,
                                  ),
                            ).animate().fadeIn(delay: 75.ms, duration: 300.ms),
                            const SizedBox(height: 24),
                          ],

                          // Ingredients Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _buildSectionTitle(context,
                                  '🥗 ${AppLocalizations.of(context)!.ingredients}'),
                              Container(
                                decoration: BoxDecoration(
                                  color:
                                      AppTheme.secondaryColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: IconButton(
                                  icon: const Icon(
                                      Icons.add_shopping_cart_rounded,
                                      color: AppTheme.secondaryColor,
                                      size: 20),
                                  tooltip: AppLocalizations.of(context)!
                                      .addToShoppingList,
                                  onPressed: () async {
                                    // Show loading indicator
                                    AppSnackBar.info(
                                        context,
                                        AppLocalizations.of(context)!
                                            .addingToList);

                                    final items = await pantryService
                                        .addItemsFromRecipe(recipe);

                                    if (!mounted) return;
                                    if (items.isNotEmpty) {
                                      AppSnackBar.success(
                                          context,
                                          AppLocalizations.of(context)!
                                              .ingredientsAddedToList(
                                                  items.length));
                                    } else {
                                      AppSnackBar.error(
                                          context,
                                          AppLocalizations.of(context)!
                                              .errorOrEmptyList);
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          _buildIngredientsList(context, recipe),

                          const SizedBox(height: 24),

                          // Instructions Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _buildSectionTitle(context,
                                  '👨‍🍳 ${AppLocalizations.of(context)!.instructions}'),

                              // Show toggle or initial buttons based on state
                              if (_hasLoadedInstructions)
                                // Toggle between quick/detailed after instructions loaded
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color:
                                        AppTheme.primaryColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      _buildToggleOption(
                                        context: context,
                                        title: AppLocalizations.of(context)!
                                            .quickLabel,
                                        isSelected: !_showDetailedInstructions,
                                        isLoading: _isLoadingQuick,
                                        onTap: () {
                                          if (recipe.quickInstructions !=
                                                  null &&
                                              recipe.quickInstructions!
                                                  .isNotEmpty) {
                                            setState(() =>
                                                _showDetailedInstructions =
                                                    false);
                                          } else {
                                            _fetchQuickRecipe();
                                          }
                                        },
                                      ),
                                      _buildToggleOption(
                                        context: context,
                                        title: AppLocalizations.of(context)!
                                            .detailedLabel,
                                        isSelected: _showDetailedInstructions,
                                        isLoading: _isLoadingDetailed,
                                        onTap: () {
                                          if (recipe.instructions.isNotEmpty &&
                                              _showDetailedInstructions) {
                                            return; // Already showing detailed
                                          }
                                          // Check if detailed instructions are already loaded (different from quick)
                                          final hasDetailed = recipe
                                                  .instructions.isNotEmpty &&
                                              (recipe.quickInstructions ==
                                                      null ||
                                                  recipe.instructions.join() !=
                                                      recipe.quickInstructions!
                                                          .join());
                                          if (hasDetailed) {
                                            setState(() =>
                                                _showDetailedInstructions =
                                                    true);
                                          } else {
                                            _fetchDetailedRecipe();
                                          }
                                        },
                                      ),
                                    ],
                                  ),
                                )
                            ],
                          ),
                          if (!_hasLoadedInstructions) ...[
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(12),
                                    onTap:
                                        (_isLoadingQuick || _isLoadingDetailed)
                                            ? null
                                            : _fetchQuickRecipe,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 10),
                                      decoration: BoxDecoration(
                                        color: AppTheme.primaryColor
                                            .withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: AppTheme.primaryColor
                                              .withOpacity(0.3),
                                        ),
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          if (_isLoadingQuick)
                                            const SizedBox(
                                              width: 14,
                                              height: 14,
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                valueColor:
                                                    AlwaysStoppedAnimation<
                                                            Color>(
                                                        AppTheme.primaryColor),
                                              ),
                                            )
                                          else
                                            const Text('⚡',
                                                style: TextStyle(fontSize: 14)),
                                          const SizedBox(width: 6),
                                          Flexible(
                                            child: Text(
                                              AppLocalizations.of(context)!
                                                  .requestQuickRecipe,
                                              style: const TextStyle(
                                                color: AppTheme.primaryColor,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 11,
                                              ),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(12),
                                    onTap:
                                        (_isLoadingDetailed || _isLoadingQuick)
                                            ? null
                                            : _fetchDetailedRecipe,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 10),
                                      decoration: BoxDecoration(
                                        gradient: AppTheme.primaryGradient,
                                        borderRadius: BorderRadius.circular(12),
                                        boxShadow: [
                                          BoxShadow(
                                            color: AppTheme.primaryColor
                                                .withOpacity(0.3),
                                            blurRadius: 8,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          if (_isLoadingDetailed)
                                            const SizedBox(
                                              width: 14,
                                              height: 14,
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                valueColor:
                                                    AlwaysStoppedAnimation<
                                                        Color>(Colors.white),
                                              ),
                                            )
                                          else
                                            const Text('✨',
                                                style: TextStyle(fontSize: 14)),
                                          const SizedBox(width: 6),
                                          Flexible(
                                            child: Text(
                                              AppLocalizations.of(context)!
                                                  .requestDetailedRecipe,
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 11,
                                              ),
                                              overflow: TextOverflow.ellipsis,
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
                          const SizedBox(height: 16),
                          _buildInstructions(context, recipe),

                          // Tips Section
                          // Tips Section (Always show title, content or placeholder)
                          const SizedBox(height: 24),
                          _buildSectionTitle(context,
                              '💡 ${AppLocalizations.of(context)!.chefIngredientTip}'),
                          const SizedBox(height: 16),
                          if (recipe.tips != null && recipe.tips!.isNotEmpty)
                            _buildTips(context, recipe)
                          else
                            GlassCard(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.tips_and_updates_outlined,
                                    color: Theme.of(context)
                                        .textTheme
                                        .bodySmall
                                        ?.color
                                        ?.withOpacity(0.5),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      AppLocalizations.of(context)!
                                          .tipsPlaceholder,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            fontStyle: FontStyle.italic,
                                            color: Theme.of(context)
                                                .textTheme
                                                .bodySmall
                                                ?.color
                                                ?.withOpacity(0.7),
                                          ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                          const SizedBox(height: 100),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Loading overlay removed as per user request to prevent UI blocking
          ],
        ),
        bottomSheet: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
            border: Border(
              top: BorderSide(
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppTheme.darkBorder
                    : AppTheme.lightBorder,
              ),
            ),
          ),
          child: SafeArea(
            child: GradientButton(
              text: AppLocalizations.of(context)!.startCooking,
              icon: Icons.play_arrow_rounded,
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CookingModeScreen(
                      recipe: _showDetailedInstructions
                          ? recipe
                          : recipe.copyWith(
                              instructions: recipe.quickInstructions ??
                                  recipe.instructions),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      );
    });
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
    );
  }

  Widget _buildToggleOption({
    required BuildContext context,
    required String title,
    required bool isSelected,
    required VoidCallback onTap,
    bool isLoading = false,
  }) {
    return GestureDetector(
      onTap: isLoading ? null : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryColor : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isLoading) ...[
              SizedBox(
                width: 10,
                height: 10,
                child: CircularProgressIndicator(
                  strokeWidth: 1.5,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    isSelected ? Colors.white : AppTheme.primaryColor,
                  ),
                ),
              ),
              const SizedBox(width: 4),
            ],
            Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.white : AppTheme.primaryColor,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIngredientsList(BuildContext context, Recipe recipe) {
    if (recipe.ingredients.isEmpty) {
      return GlassCard(
        child: Text(
          AppLocalizations.of(context)!.ingredientsLoading,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      );
    }

    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: recipe.ingredients.asMap().entries.map((entry) {
          final index = entry.key;
          final ingredient = entry.value;
          return Column(
            children: [
              Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Center(
                      child: Text('🥄', style: TextStyle(fontSize: 16)),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      ingredient.name,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: ingredient.isOptional
                                ? Theme.of(context).textTheme.bodySmall?.color
                                : Theme.of(context).textTheme.bodyLarge?.color,
                            fontStyle: ingredient.isOptional
                                ? FontStyle.italic
                                : FontStyle.normal,
                          ),
                    ),
                  ),
                  Text(
                    ingredient.quantity,
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (ingredient.isOptional)
                    Container(
                      margin: const EdgeInsets.only(left: 8),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: (Theme.of(context).textTheme.bodySmall?.color ??
                                AppTheme.lightTextMuted)
                            .withOpacity(0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.optionalLabel,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                ],
              ),
              if (index < recipe.ingredients.length - 1)
                const Divider(
                  color: AppTheme.darkBorder,
                  height: 24,
                ),
            ],
          );
        }).toList(),
      ),
    ).animate().fadeIn(delay: 100.ms, duration: 300.ms);
  }

  Widget _buildInstructions(BuildContext context, Recipe recipe) {
    // Determine which instructions to show
    final List<String> steps;
    if (_showDetailedInstructions) {
      steps = recipe.instructions;
    } else {
      steps = recipe.quickInstructions ?? recipe.instructions;
    }

    if (steps.isEmpty) {
      return GlassCard(
        child: Text(
          AppLocalizations.of(context)!.instructionsNotFound,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      );
    }

    return Stack(
      children: [
        // Vertical Timeline Line
        Positioned(
          left: 18,
          top: 20,
          bottom: 20,
          child: Container(
            width: 2,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppTheme.primaryColor.withOpacity(0.5),
                  AppTheme.secondaryColor.withOpacity(0.1),
                ],
              ),
            ),
          ),
        ),

        Column(
          children: steps.asMap().entries.map((entry) {
            final index = entry.key;
            final isExpanded = _expandedStepIndex == index;

            // Clean step text
            String stepText =
                entry.value.replaceAll(RegExp(r'^\d+[\.\)]\s*'), '').trim();

            return Padding(
              padding: const EdgeInsets.only(bottom: 30),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Step Node with Pulse & Glow (Quick Action)
                  Column(
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: AppTheme.primaryGradient,
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primaryColor.withOpacity(0.4),
                              blurRadius: 14,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            '${index + 1}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(width: 20),

                  // Expandable Detailed Card
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _expandedStepIndex = isExpanded ? null : index;
                        });
                      },
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 400),
                            curve: Curves.fastOutSlowIn,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: (Theme.of(context).cardTheme.color ??
                                      Colors.white)
                                  .withOpacity(isExpanded ? 0.95 : 0.8),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: isExpanded
                                    ? AppTheme.primaryColor.withOpacity(0.6)
                                    : Theme.of(context)
                                        .dividerColor
                                        .withOpacity(0.1),
                                width: 1.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black
                                      .withOpacity(isExpanded ? 0.15 : 0.05),
                                  blurRadius: isExpanded ? 30 : 15,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Step Header
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: AppTheme.primaryColor
                                            .withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        'ADIM ${index + 1} / ${steps.length}',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme.primaryColor,
                                          letterSpacing: 1.5,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),

                                // Main Text
                                Text(
                                  stepText,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        height: 1.8,
                                        fontSize: isExpanded ? 19 : 16,
                                        color: isExpanded
                                            ? Theme.of(context)
                                                .colorScheme
                                                .onSurface
                                            : Theme.of(context)
                                                .textTheme
                                                .bodyMedium
                                                ?.color
                                                ?.withOpacity(0.95),
                                        fontWeight: isExpanded
                                            ? FontWeight.w600
                                            : FontWeight.normal,
                                        letterSpacing: 0.2,
                                      ),
                                  maxLines: isExpanded ? null : 4,
                                  overflow:
                                      isExpanded ? null : TextOverflow.ellipsis,
                                ),

                                // Footer Actions
                                AnimatedSize(
                                  duration: const Duration(milliseconds: 300),
                                  child: isExpanded
                                      ? const SizedBox.shrink()
                                      : (stepText.length > 120
                                          ? Padding(
                                              padding: EdgeInsets.only(top: 12),
                                              child: Row(
                                                children: [
                                                  Text(
                                                    AppLocalizations.of(
                                                            context)!
                                                        .viewDetails,
                                                    style: TextStyle(
                                                      color:
                                                          AppTheme.primaryColor,
                                                      fontSize: 14,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                  SizedBox(width: 4),
                                                  Icon(
                                                      Icons
                                                          .keyboard_arrow_down_rounded,
                                                      color:
                                                          AppTheme.primaryColor,
                                                      size: 20),
                                                ],
                                              ),
                                            )
                                          : const SizedBox.shrink()),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
                .animate()
                .fadeIn(delay: (50 * index).ms, duration: 300.ms)
                .slideY(begin: 0.1, end: 0);
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildMissingIngredientsWarning(Recipe recipe) {
    if (recipe.missingRecommendations == null ||
        recipe.missingRecommendations!.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.amber.withOpacity(0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.amber.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.amber.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.lightbulb_outline_rounded,
              color: Colors.amber,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppLocalizations.of(context)!.chefIngredientTip,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Color(0xFF856404),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  AppLocalizations.of(context)!.chefTipDescription(
                      recipe.missingRecommendations!.join(", ")),
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF856404),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTips(BuildContext context, Recipe recipe) {
    if (recipe.tips == null || recipe.tips!.isEmpty) {
      return const SizedBox.shrink();
    }

    return GlassCard(
      gradient: LinearGradient(
        colors: [
          AppTheme.accentColor.withOpacity(0.1),
          AppTheme.primaryColor.withOpacity(0.05),
        ],
      ),
      child: Column(
        children: recipe.tips!.asMap().entries.map((entry) {
          final index = entry.key;
          final tip = entry.value;

          return Padding(
            padding: EdgeInsets.only(
              bottom: index < recipe.tips!.length - 1 ? 12 : 0,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('💡', style: TextStyle(fontSize: 16)),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    tip,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurface,
                          height: 1.5,
                        ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    ).animate().fadeIn(delay: 100.ms, duration: 300.ms);
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final String unit;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.unit,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: value,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                TextSpan(
                  text: ' $unit',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: Theme.of(context).textTheme.bodySmall?.color,
                ),
          ),
        ],
      ),
    );
  }
}

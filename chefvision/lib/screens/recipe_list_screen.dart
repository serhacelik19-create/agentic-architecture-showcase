import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../utils/error_localizer.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../models/recipe.dart';
import '../providers/app_provider.dart';
import 'recipe_detail_screen.dart';
import '../widgets/feature_locked_modal.dart';
// import '../widgets/engaging_loading_view.dart';

class RecipeListScreen extends StatefulWidget {
  const RecipeListScreen({super.key});

  @override
  State<RecipeListScreen> createState() => _RecipeListScreenState();
}

class _RecipeListScreenState extends State<RecipeListScreen> {
  String _selectedFilter = 'all';

  List<Recipe> _getFilteredRecipes(List<Recipe> recipes) {
    if (_selectedFilter == 'all') return recipes;

    final filtered = recipes.where((recipe) {
      switch (_selectedFilter) {
        case 'easy':
          return recipe.difficulty.toLowerCase() == 'kolay' ||
              recipe.difficulty.toLowerCase() == 'easy';
        case 'fast':
          return recipe.totalTime <= 30;
        case 'low_calorie':
          return (recipe.calories ?? 9999) < 400;
        default:
          return true;
      }
    }).toList();

    // Sort the filtered list
    switch (_selectedFilter) {
      case 'fast':
        filtered.sort((a, b) => a.totalTime.compareTo(b.totalTime));
        break;
      case 'low_calorie':
        filtered.sort((a, b) => (a.calories ?? 0).compareTo(b.calories ?? 0));
        break;
      case 'easy':
        // Sort by difficulty (though they are all Easy) then by time
        filtered.sort((a, b) => a.totalTime.compareTo(b.totalTime));
        break;
      default:
        // Default sort by time
        filtered.sort((a, b) => a.totalTime.compareTo(b.totalTime));
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(AppLocalizations.of(context)!.recipeSuggestions),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<AppProvider>(
        builder: (context, provider, _) {
          final allRecipes = provider.suggestedRecipes;
          final recipes = _getFilteredRecipes(allRecipes);

          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (allRecipes.isEmpty) {
            return _buildEmptyState(context);
          }

          return Column(
            children: [
              // Filter chips
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterChip(
                        label: AppLocalizations.of(context)!.viewAll,
                        isSelected: _selectedFilter == 'all',
                        onTap: () => setState(() => _selectedFilter = 'all'),
                      ),
                      _FilterChip(
                        label: AppLocalizations.of(context)!.filterEasy,
                        isSelected: _selectedFilter == 'easy',
                        onTap: () => setState(() => _selectedFilter = 'easy'),
                      ),
                      _FilterChip(
                        label: AppLocalizations.of(context)!.filterFast,
                        isSelected: _selectedFilter == 'fast',
                        onTap: () => setState(() => _selectedFilter = 'fast'),
                      ),
                      _FilterChip(
                        label: AppLocalizations.of(context)!.filterLowCal,
                        isSelected: _selectedFilter == 'low_calorie',
                        onTap: () =>
                            setState(() => _selectedFilter = 'low_calorie'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Recipe list
              Expanded(
                child: recipes.isEmpty
                    ? Center(
                        child: Text(
                            AppLocalizations.of(context)!.noRecipesFoundMsg,
                            style: Theme.of(context).textTheme.bodyLarge))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        physics: const BouncingScrollPhysics(),
                        itemCount: recipes.length + 1,
                        itemBuilder: (context, index) {
                          if (index == recipes.length) {
                            return Padding(
                              padding:
                                  const EdgeInsets.only(bottom: 30, top: 10),
                              child: _buildNewRecipesButton(context, provider),
                            );
                          }
                          return _RecipeCard(
                            recipe: recipes[index],
                            index: index,
                          )
                              .animate()
                              .fadeIn(
                                delay: (index * 50).ms, // Faster animation
                                duration: 300.ms,
                              )
                              .slideX(begin: 0.05, end: 0);
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🍳', style: TextStyle(fontSize: 80)),
          const SizedBox(height: 24),
          Text(
            AppLocalizations.of(context)!.noRecipesFound,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            AppLocalizations.of(context)!.tryDifferentIngredients,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildNewRecipesButton(BuildContext context, AppProvider provider) {
    if (provider.isLoading) {
      return const Center(
          child: Padding(
        padding: EdgeInsets.all(16.0),
        child: CircularProgressIndicator(),
      ));
    }

    return Container(
      width: double.infinity,
      height: 56,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).dividerColor.withOpacity(0.1),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            final success = await provider.fetchRecipes(isNew: true);
            if (!success && mounted && provider.error != null) {
              if (provider.error == 'err_usage_limit_reached') {
                FeatureLockedModal.show(context,
                    title: AppLocalizations.of(context)!.usageLimitsTitle,
                    message: localizeError(context, provider.error!),
                    icon: '🚀',
                    tierRequired: 'pro');
              } else {
                AppSnackBar.error(
                    context, localizeError(context, provider.error!));
              }
            }
          },
          borderRadius: BorderRadius.circular(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.refresh_rounded,
                color: AppTheme.primaryColor,
              ),
              const SizedBox(width: 8),
              Text(
                AppLocalizations.of(context)!.suggestDifferent,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    this.isSelected = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor
              : Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : (isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected
                ? Colors.white
                : Theme.of(context).textTheme.bodyMedium?.color,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

class _RecipeCard extends StatelessWidget {
  final Recipe recipe;
  final int index;

  const _RecipeCard({
    required this.recipe,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => RecipeDetailScreen(recipe: recipe),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppTheme.darkBorder
                : AppTheme.lightBorder,
          ),
          boxShadow: [
            if (Theme.of(context).brightness == Brightness.light)
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with gradient
            Container(
              height: 120,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    _getRecipeColor(index).withOpacity(0.3),
                    _getRecipeColor(index).withOpacity(0.1),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Stack(
                children: [
                  // Recipe emoji
                  Positioned(
                    right: 20,
                    top: 20,
                    child: Text(
                      _getRecipeEmoji(recipe.cuisine ?? ''),
                      style: const TextStyle(fontSize: 60),
                    ),
                  ),
                  // Match percentage
                  if (recipe.matchPercentage != null)
                    Positioned(
                      left: 16,
                      top: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.successColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.check_circle,
                              color: AppTheme.successColor,
                              size: 16,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${recipe.matchPercentage}% ${AppLocalizations.of(context)!.match}',
                              style: const TextStyle(
                                color: AppTheme.successColor,
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  // Difficulty badge
                  Positioned(
                    left: 16,
                    bottom: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardTheme.color,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${recipe.difficultyEmoji} ${recipe.difficulty}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recipe.title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  if (recipe.description != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      recipe.description!,
                      style: Theme.of(context).textTheme.bodyMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 16),

                  // Stats row
                  Row(
                    children: [
                      if (recipe.cuisine != null &&
                          recipe.cuisine!.isNotEmpty) ...[
                        _StatBadge(
                          icon: Icons.public_rounded,
                          value: recipe.cuisine!,
                          color: AppTheme.primaryColor,
                        ),
                        const SizedBox(width: 8),
                      ],
                      _StatBadge(
                        icon: Icons.access_time_rounded,
                        value: '${recipe.totalTime} dk',
                        color: AppTheme.accentColor,
                      ),
                      const SizedBox(width: 12),
                      _StatBadge(
                        icon: Icons.people_rounded,
                        value: AppLocalizations.of(context)!
                            .servingsCount(recipe.servings),
                        color: AppTheme.secondaryColor,
                      ),
                      if (recipe.calories != null) ...[
                        const SizedBox(width: 12),
                        _StatBadge(
                          icon: Icons.local_fire_department_rounded,
                          value: '${recipe.calories} kcal',
                          color: AppTheme.warningColor,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getRecipeColor(int index) {
    final colors = [
      const Color(0xFFFF6B6B),
      const Color(0xFF4ECDC4),
      const Color(0xFFFFBE0B),
      const Color(0xFF9B59B6),
      const Color(0xFF3498DB),
    ];
    return colors[index % colors.length];
  }

  String _getRecipeEmoji(String cuisine) {
    switch (cuisine.toLowerCase()) {
      case 'türk':
        return '🥙';
      case 'italyan':
        return '🍝';
      case 'meksika':
        return '🌮';
      case 'çin':
        return '🥡';
      case 'japon':
        return '🍣';
      default:
        return '🍽️';
    }
  }
}

class _StatBadge extends StatelessWidget {
  final IconData icon;
  final String value;
  final Color color;

  const _StatBadge({
    required this.icon,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(width: 6),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

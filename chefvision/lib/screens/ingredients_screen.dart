import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../utils/error_localizer.dart';
import '../models/ingredient.dart';
import '../providers/app_provider.dart';
import '../providers/recipe_provider.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../providers/guest_provider.dart';
import '../widgets/feature_locked_modal.dart';
import 'recipe_list_screen.dart';

class IngredientsScreen extends StatefulWidget {
  const IngredientsScreen({super.key});

  @override
  State<IngredientsScreen> createState() => _IngredientsScreenState();
}

class _IngredientsScreenState extends State<IngredientsScreen> {
  final TextEditingController _searchController = TextEditingController();
  Timer? _loadingTimer;
  String? _loadingMessage;
  int _loadingMessageIndex = 0;

  // _loadingMessages removed, will fetch from l10n dynamically

  void _startLoadingTimer() {
    final l10n = AppLocalizations.of(context)!;
    final messages = [
      l10n.loadingMixing,
      l10n.loadingChef,
      l10n.loadingSelecting,
      l10n.loadingIngredients,
      l10n.loadingSecret,
    ];

    setState(() {
      _loadingMessageIndex = 0;
      _loadingMessage = messages[0];
    });

    _loadingTimer?.cancel();
    _loadingTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (!mounted) return;

      setState(() {
        _loadingMessageIndex = (_loadingMessageIndex + 1) % messages.length;
        _loadingMessage = messages[_loadingMessageIndex];
      });
    });
  }

  void _stopLoadingTimer() {
    _loadingTimer?.cancel();
    if (mounted) {
      setState(() {
        _loadingMessage = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(AppLocalizations.of(context)!.myPantry),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: _showAddIngredientDialog,
          ),
        ],
      ),
      body: Consumer<AppProvider>(
        builder: (context, provider, _) {
          final ingredients = provider.detectedIngredients;

          return Column(
            children: [
              // Manual Entry Field
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: AppLocalizations.of(context)!
                              .ingredientsSearchHint,
                          prefixIcon: const Icon(
                              Icons.add_circle_outline_rounded,
                              color: AppTheme.primaryColor),
                          filled: true,
                          fillColor: Theme.of(context).cardTheme.color,
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        textInputAction: TextInputAction.go,
                        onSubmitted: (value) {
                          if (value.trim().isNotEmpty) {
                            final provider = Provider.of<AppProvider>(context,
                                listen: false);
                            provider.addIngredient(Ingredient(
                              name: value.trim(),
                              nameTr: value.trim(),
                              confidence: 1.0,
                              category: 'other',
                            ));
                            _searchController.clear();
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: BoxDecoration(
                        gradient: AppTheme.primaryGradient,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.add, color: Colors.white),
                        onPressed: () {
                          if (_searchController.text.trim().isNotEmpty) {
                            final provider = Provider.of<AppProvider>(context,
                                listen: false);
                            provider.addIngredient(Ingredient(
                              name: _searchController.text.trim(),
                              nameTr: _searchController.text.trim(),
                              confidence: 1.0,
                              category: 'other',
                            ));
                            _searchController.clear();
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ),

              // Stats bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: _buildStatsBar(provider),
              ),

              const SizedBox(height: 16),

              // Filter Bar
              _buildFilterBar(provider),

              const SizedBox(height: 16),

              // Ingredients list
              Expanded(
                child: ingredients.isEmpty
                    ? _buildEmptyState()
                    : Column(
                        children: [
                          // Header with Delete All
                          Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 24, vertical: 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '${AppLocalizations.of(context)!.yourList} (${ingredients.length})',
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium
                                      ?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.primaryColor,
                                      ),
                                ),
                                TextButton.icon(
                                  onPressed: () =>
                                      _showClearAllDialog(context, provider),
                                  icon: const Icon(Icons.delete_outline_rounded,
                                      size: 18, color: AppTheme.errorColor),
                                  label: Text(
                                    AppLocalizations.of(context)!.clearList,
                                    style: const TextStyle(
                                      color: AppTheme.errorColor,
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  style: TextButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 12, vertical: 8),
                                    backgroundColor:
                                        AppTheme.errorColor.withOpacity(0.1),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Expanded(child: _buildIngredientsList(ingredients)),
                        ],
                      ),
              ),

              // Bottom action
              if (ingredients.isNotEmpty) _buildBottomAction(provider),
            ],
          );
        },
      ),
    );
  }

  void _showClearAllDialog(BuildContext context, AppProvider provider) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: GlassCard(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.errorColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.delete_forever_rounded,
                    size: 32, color: AppTheme.errorColor),
              ),
              const SizedBox(height: 20),
              Text(
                AppLocalizations.of(context)!.clearIngredientsTitle,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                AppLocalizations.of(context)!.clearIngredientsMsg,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.color
                          ?.withOpacity(0.7),
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: BorderSide(color: Theme.of(context).dividerColor),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.cancel,
                        style: TextStyle(
                            color:
                                Theme.of(context).textTheme.bodyLarge?.color),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        provider.clearIngredients();
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.errorColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.yesDelete,
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterBar(AppProvider provider) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          _CategoryFilterButton(
            title: AppLocalizations.of(context)!.kitchen,
            icon: '🌍',
            selectedValue: provider.selectedCuisine,
            onTap: () => _showCategoryFilterModal(
              context,
              AppLocalizations.of(context)!.kitchen,
              [
                {
                  'label': AppLocalizations.of(context)!.cuisineTurkish,
                  'value': AppLocalizations.of(context)!.cuisineTurkish,
                  'emoji': '🇹🇷'
                },
                {
                  'label': AppLocalizations.of(context)!.cuisineItalian,
                  'value': AppLocalizations.of(context)!.cuisineItalian,
                  'emoji': '🇮🇹'
                },
                {
                  'label': AppLocalizations.of(context)!.cuisineAsian,
                  'value': AppLocalizations.of(context)!.cuisineAsian,
                  'emoji': '🌏'
                },
                {
                  'label': AppLocalizations.of(context)!.cuisineMexican,
                  'value': AppLocalizations.of(context)!.cuisineMexican,
                  'emoji': '🇲🇽'
                },
              ],
              provider.selectedCuisine,
              (val) => provider.setCuisine(val),
            ),
          ),
          const SizedBox(width: 12),
          _CategoryFilterButton(
            title: AppLocalizations.of(context)!.meal,
            icon: '🍽️',
            selectedValue: provider.selectedMealType,
            onTap: () => _showCategoryFilterModal(
              context,
              AppLocalizations.of(context)!.meal,
              [
                {
                  'label': AppLocalizations.of(context)!.mealBreakfast,
                  'value': AppLocalizations.of(context)!.mealBreakfast,
                  'emoji': '🍳'
                },
                {
                  'label': AppLocalizations.of(context)!.mealDinner,
                  'value': AppLocalizations.of(context)!.mealDinner,
                  'emoji': '🍲'
                },
                {
                  'label': AppLocalizations.of(context)!.mealSnack,
                  'value': AppLocalizations.of(context)!.mealSnack,
                  'emoji': '🍪'
                },
              ],
              provider.selectedMealType,
              (val) => provider.setMealType(val),
            ),
          ),
          const SizedBox(width: 12),
          _CategoryFilterButton(
            title: AppLocalizations.of(context)!.diet,
            icon: '🥗',
            selectedValue: provider.dietaryPreferences.isNotEmpty
                ? '${provider.dietaryPreferences.length} ${AppLocalizations.of(context)!.selected}'
                : null,
            isActive: provider.dietaryPreferences.isNotEmpty,
            onTap: () => _showDietFilterModal(context, provider),
          ),
          const SizedBox(width: 12),
          _CategoryFilterButton(
            title: AppLocalizations.of(context)!.allergies,
            icon: '⚠️',
            selectedValue: provider.allergies.isNotEmpty
                ? '${provider.allergies.length} ${AppLocalizations.of(context)!.selected}'
                : null,
            isActive: provider.allergies.isNotEmpty,
            onTap: () => _showAllergyFilterModal(context, provider),
          ),
          const SizedBox(width: 12),
          _CategoryFilterButton(
            title: AppLocalizations.of(context)!.servings,
            icon: '👥',
            selectedValue:
                AppLocalizations.of(context)!.personServings(provider.servings),
            isActive: true,
            onTap: () => _showServingsModal(context, provider),
          ),
          const SizedBox(width: 12),
          // Prevent Waste Mode Toggle
          GestureDetector(
            onTap: () => provider.setPrioritizeWaste(!provider.prioritizeWaste),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: provider.prioritizeWaste
                    ? Colors.orange.withOpacity(0.1)
                    : Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: provider.prioritizeWaste
                      ? Colors.orange
                      : Theme.of(context).dividerColor.withOpacity(0.1),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.recycling_rounded,
                    size: 20,
                    color: provider.prioritizeWaste
                        ? Colors.orange
                        : Theme.of(context).iconTheme.color,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    AppLocalizations.of(context)!.preventWaste,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: provider.prioritizeWaste
                          ? Colors.orange
                          : Theme.of(context).textTheme.bodyMedium?.color,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showCategoryFilterModal(
    BuildContext context,
    String title,
    List<Map<String, String>> options,
    String? selectedValue,
    Function(String?) onSelect,
  ) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Theme.of(context).dividerColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              title,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 20),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: options.map((option) {
                final isSelected = selectedValue == option['value'];
                return GestureDetector(
                  onTap: () {
                    onSelect(option['value']);
                    Navigator.pop(context);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : Theme.of(context).cardTheme.color,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.primaryColor
                            : Theme.of(context).dividerColor.withOpacity(0.1),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          option['emoji']!,
                          style: const TextStyle(fontSize: 18),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          option['label']!,
                          style: TextStyle(
                            color: isSelected ? Colors.white : null,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            if (title == AppLocalizations.of(context)!.kitchen) ...[
              const SizedBox(height: 20),
              const Divider(),
              const SizedBox(height: 12),
              Text(
                AppLocalizations.of(context)!.kitchenCustomTitle,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).hintColor,
                    ),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(
                  hintText: AppLocalizations.of(context)!.kitchenCustomHint,
                  prefixIcon: const Icon(Icons.edit_location_alt_rounded),
                  filled: true,
                  fillColor: Theme.of(context).cardTheme.color,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                ),
                onSubmitted: (value) {
                  if (value.trim().isNotEmpty) {
                    onSelect(value.trim()); // Capitalize?
                    Navigator.pop(context);
                  }
                },
              ),
            ],
            if (selectedValue != null) ...[
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {
                    onSelect(null); // Clear selection
                    Navigator.pop(context);
                  },
                  child: Text(AppLocalizations.of(context)!.clearSelection),
                ),
              ),
            ],
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  void _showServingsModal(BuildContext context, AppProvider provider) {
    final l10n = AppLocalizations.of(context)!;
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Theme.of(context).dividerColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              l10n.howManyPeople,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 20),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [1, 2, 3, 4, 5, 6].map((count) {
                final isSelected = provider.servings == count;
                return GestureDetector(
                  onTap: () {
                    provider.setServings(count);
                    Navigator.pop(context);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : Theme.of(context).cardTheme.color,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.primaryColor
                            : Theme.of(context).dividerColor.withOpacity(0.1),
                      ),
                    ),
                    child: Text(
                      count == 6 ? l10n.sixPlus : '$count',
                      style: TextStyle(
                        color: isSelected
                            ? Colors.white
                            : Theme.of(context).textTheme.bodyMedium?.color,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  void _showDietFilterModal(BuildContext context, AppProvider provider) {
    final l10n = AppLocalizations.of(context)!;
    final options = [
      {'label': l10n.prefVegan, 'value': 'vegan', 'icon': Icons.eco_rounded},
      {
        'label': l10n.prefVegetarian,
        'value': 'vegetarian',
        'icon': Icons.grass_rounded
      },
      {
        'label': l10n.prefGlutenFree,
        'value': 'gluten_free',
        'icon': Icons.grain_rounded
      },
      {'label': l10n.prefKeto, 'value': 'keto', 'icon': Icons.bolt_rounded},
      {
        'label': l10n.prefLowCarb,
        'value': 'low_carb',
        'icon': Icons.fitness_center_rounded
      },
      {
        'label': l10n.prefHighProtein,
        'value': 'high_protein',
        'icon': Icons.sports_gymnastics_rounded
      },
      {
        'label': l10n.prefMediterranean,
        'value': 'mediterranean',
        'icon': Icons.set_meal_rounded
      },
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Theme.of(context).dividerColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  AppLocalizations.of(context)!.diet,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: options.map((option) {
                    final isSelected =
                        provider.dietaryPreferences.contains(option['value']);
                    return GestureDetector(
                      onTap: () {
                        provider
                            .toggleDietaryPreference(option['value'] as String);
                        setState(() {}); // Rebuild modal to show checkmark
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppTheme.primaryColor.withOpacity(0.1)
                              : Theme.of(context).cardTheme.color,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected
                                ? AppTheme.primaryColor
                                : Theme.of(context)
                                    .dividerColor
                                    .withOpacity(0.1),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              option['icon'] as IconData,
                              size: 18,
                              color: isSelected
                                  ? AppTheme.primaryColor
                                  : Theme.of(context).iconTheme.color,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              option['label'] as String,
                              style: TextStyle(
                                color: isSelected
                                    ? AppTheme.primaryColor
                                    : Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.color,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                              ),
                            ),
                            if (isSelected) ...[
                              const SizedBox(width: 8),
                              const Icon(Icons.check,
                                  size: 16, color: AppTheme.primaryColor),
                            ],
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showAllergyFilterModal(BuildContext context, AppProvider provider) {
    final l10n = AppLocalizations.of(context)!;
    final options = [
      {
        'label': l10n.allergyNutsName,
        'value': 'nuts',
        'icon': Icons.warning_amber_rounded
      },
      {
        'label': l10n.allergyMilk,
        'value': 'milk',
        'icon': Icons.warning_amber_rounded
      },
      {
        'label': l10n.allergyEgg,
        'value': 'egg',
        'icon': Icons.warning_amber_rounded
      },
      {
        'label': l10n.allergySeafood,
        'value': 'seafood',
        'icon': Icons.warning_amber_rounded
      },
      {
        'label': l10n.allergyGluten,
        'value': 'gluten',
        'icon': Icons.warning_amber_rounded
      },
      {
        'label': l10n.allergySoyName,
        'value': 'soy',
        'icon': Icons.warning_amber_rounded
      },
      {
        'label': l10n.allergyPeanuts,
        'value': 'peanuts',
        'icon': Icons.warning_amber_rounded
      },
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Theme.of(context).dividerColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  l10n.allergies,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: options.map((option) {
                    final isSelected =
                        provider.isAllergySelected(option['value'] as String);
                    return GestureDetector(
                      onTap: () {
                        provider.toggleAllergy(option['value'] as String);
                        setState(() {});
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? Colors.red.withOpacity(0.1)
                              : Theme.of(context).cardTheme.color,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected
                                ? Colors.red
                                : Theme.of(context)
                                    .dividerColor
                                    .withOpacity(0.1),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              option['icon'] as IconData,
                              size: 18,
                              color: isSelected
                                  ? Colors.red
                                  : Theme.of(context).iconTheme.color,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              option['label'] as String,
                              style: TextStyle(
                                color: isSelected
                                    ? Colors.red
                                    : Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.color,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                              ),
                            ),
                            if (isSelected) ...[
                              const SizedBox(width: 8),
                              const Icon(Icons.check,
                                  size: 16, color: Colors.red),
                            ],
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsBar(AppProvider provider) {
    final selected = provider.selectedIngredients.length;
    final total = provider.detectedIngredients.length;

    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          _StatItem(
            icon: Icons.inventory_2_rounded,
            value: '$total',
            label: AppLocalizations.of(context)!.statTotal,
            color: AppTheme.primaryColor,
          ),
          Container(
            width: 1,
            height: 40,
            color: AppTheme.darkBorder,
            margin: const EdgeInsets.symmetric(horizontal: 16),
          ),
          _StatItem(
            icon: Icons.check_circle_rounded,
            value: '$selected',
            label: AppLocalizations.of(context)!.selected,
            color: AppTheme.successColor,
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms);
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🥗', style: TextStyle(fontSize: 80)),
          const SizedBox(height: 24),
          Text(
            AppLocalizations.of(context)!.noIngredients,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            AppLocalizations.of(context)!.addIngredientsHint,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildIngredientsList(List<Ingredient> ingredients) {
    // Group by category
    final grouped = <String, List<Ingredient>>{};
    final l10n = AppLocalizations.of(context)!;

    for (var ingredient in ingredients) {
      final locName = ingredient.localizedCategoryName(l10n);
      grouped.putIfAbsent(locName, () => []);
      grouped[locName]!.add(ingredient);
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      physics: const BouncingScrollPhysics(),
      itemCount: grouped.length,
      itemBuilder: (context, index) {
        final category = grouped.keys.elementAt(index);
        final items = grouped[category]!;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Text(
                '${items.first.categoryIcon} $category',
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
            ...items.asMap().entries.map((entry) {
              final i = entry.key;
              final ingredient = entry.value;
              return _IngredientTile(
                ingredient: ingredient,
                index: ingredients.indexOf(ingredient),
                onEdit: _showEditIngredientDialog,
              ).animate().fadeIn(
                    delay: (index * 50 + i * 30).ms,
                    duration: 300.ms,
                  );
            }),
          ],
        );
      },
    );
  }

  Widget _buildBottomAction(AppProvider provider) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
        border: Border(
          top: BorderSide(
            color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
          ),
        ),
      ),
      child: SafeArea(
        child: GradientButton(
          text: AppLocalizations.of(context)!.suggestRecipes,
          icon: Icons.restaurant_menu_rounded,
          isLoading: provider.isLoading,
          loadingText: _loadingMessage,
          onPressed: () async {
            final guestProvider =
                Provider.of<GuestProvider>(context, listen: false);
            if (guestProvider.isGuest) {
              if (!guestProvider.canGenerateRecipe) {
                FeatureLockedModal.show(context,
                    title: "Ücretsiz Tarif Hakkınız Doldu",
                    message:
                        "Misafir olarak kullanabileceğiniz 3 ücretsiz tarif hakkınızı kullandınız. Sınırsız tarama ve tarifler için ücretsiz hesabınızı oluşturun!",
                    icon: '🍽️',
                    tierRequired: 'free');
                return;
              }
            }

            _startLoadingTimer();
            final success = await provider.fetchRecipes();
            _stopLoadingTimer();
            if (success && mounted) {
              // Persist suggestions via RecipeProvider if needed or just use AppProvider
              // The original code updated RecipeProvider.lastSuggestions.
              // Let's keep it consistent if RecipeProvider is used elsewhere.
              Provider.of<RecipeProvider>(context, listen: false)
                  .setLastSuggestions(provider.suggestedRecipes);

              // Consume guest token
              if (guestProvider.isGuest) {
                await guestProvider.consumeRecipe();
              }

              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const RecipeListScreen()),
              );
            } else if (provider.error != null && mounted) {
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
        ),
      ),
    );
  }

  void _showEditIngredientDialog(int index, Ingredient ingredient) {
    final l10nText = AppLocalizations.of(context)!;
    final controller = TextEditingController(
        text: ingredient.getLocalizedName(l10nText.localeName));
    String autoEmoji = ingredient.emoji ?? ingredient.displayEmoji;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.fromLTRB(
          20,
          20,
          20,
          MediaQuery.of(context).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.lightBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              AppLocalizations.of(context)!.editIngredientTitle,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: controller,
              onChanged: (val) {
                // Keep the emoji updated based on name
                final lowercaseVal = val.toLowerCase();
                for (var entry in Ingredient.ingredientEmojiMap.entries) {
                  if (lowercaseVal.contains(entry.key)) {
                    autoEmoji = entry.value;
                    break;
                  }
                }
              },
              decoration: InputDecoration(
                hintText: AppLocalizations.of(context)!.newIngredientHint,
                prefixIcon: const Icon(Icons.edit_rounded),
              ),
              autofocus: true,
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      final provider =
                          Provider.of<AppProvider>(context, listen: false);
                      provider.removeIngredient(ingredient);
                      Navigator.pop(context);
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.errorColor,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: const BorderSide(color: AppTheme.errorColor),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                    child: Text(AppLocalizations.of(context)!.delete),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GradientButton(
                    text: AppLocalizations.of(context)!.update,
                    onPressed: () {
                      if (controller.text.isNotEmpty) {
                        final provider =
                            Provider.of<AppProvider>(context, listen: false);
                        provider.updateIngredient(
                            index,
                            Ingredient(
                              name: controller.text,
                              nameTr: controller.text,
                              confidence: 1.0,
                              category: ingredient.category,
                              emoji: autoEmoji,
                              quantityEstimate: ingredient.quantityEstimate,
                              isSelected: ingredient.isSelected,
                            ));
                        Navigator.pop(context);
                      }
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAddIngredientDialog() {
    final controller = TextEditingController();
    String autoEmoji = '🍽️';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.fromLTRB(
          20,
          20,
          20,
          MediaQuery.of(context).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.lightBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              AppLocalizations.of(context)!.addIngredientTitle,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: controller,
              onChanged: (val) {
                // Try to auto-suggest emoji
                final lowercaseVal = val.toLowerCase();
                for (var entry in Ingredient.ingredientEmojiMap.entries) {
                  if (lowercaseVal.contains(entry.key)) {
                    autoEmoji = entry.value;
                    break;
                  }
                }
              },
              decoration: InputDecoration(
                hintText: AppLocalizations.of(context)!.newIngredientHint,
                prefixIcon: const Icon(Icons.add_circle_outline),
              ),
              autofocus: true,
            ),
            const SizedBox(height: 20),
            GradientButton(
              text: AppLocalizations.of(context)!.add,
              onPressed: () {
                if (controller.text.isNotEmpty) {
                  final provider =
                      Provider.of<AppProvider>(context, listen: false);
                  provider.addIngredient(Ingredient(
                    name: controller.text,
                    nameTr: controller.text,
                    confidence: 1.0,
                    category: 'other',
                    emoji: autoEmoji,
                  ));
                  Navigator.pop(context);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _loadingTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 18),
        ),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ],
    );
  }
}

class _IngredientTile extends StatelessWidget {
  final Ingredient ingredient;
  final int index;
  final Function(int, Ingredient) onEdit;

  const _IngredientTile({
    required this.ingredient,
    required this.index,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        final isDark = Theme.of(context).brightness == Brightness.dark;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(
            color: ingredient.isSelected
                ? AppTheme.primaryColor.withOpacity(0.05)
                : Theme.of(context).cardTheme.color,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: ingredient.isSelected
                  ? AppTheme.primaryColor.withOpacity(0.5)
                  : (isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
            ),
            boxShadow: [
              if (!isDark && !ingredient.isSelected)
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
            ],
          ),
          child: InkWell(
            onTap: () => onEdit(index, ingredient),
            borderRadius: BorderRadius.circular(16),
            child: ListTile(
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    ingredient.categoryIcon,
                    style: const TextStyle(fontSize: 24),
                  ),
                ),
              ),
              title: Text(
                ingredient
                    .getLocalizedName(AppLocalizations.of(context)!.localeName),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              subtitle: Row(
                children: [
                  if (ingredient.quantityEstimate != null)
                    Text(
                      ingredient.quantityEstimate!,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  if (ingredient.quantityEstimate != null)
                    const SizedBox(width: 8),
                  Icon(Icons.edit_rounded,
                      size: 12,
                      color: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.color
                          ?.withOpacity(0.5)),
                  const SizedBox(width: 4),
                  Text(
                    AppLocalizations.of(context)!.edit,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontSize: 10,
                        color: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.color
                            ?.withOpacity(0.5)),
                  ),
                ],
              ),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Confidence indicator
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getConfidenceColor(ingredient.confidence)
                          .withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${(ingredient.confidence * 100).toInt()}%',
                      style: TextStyle(
                        color: _getConfidenceColor(ingredient.confidence),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Checkbox
                  GestureDetector(
                    onTap: () => provider.toggleIngredientSelection(index),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: ingredient.isSelected
                            ? AppTheme.primaryColor
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: ingredient.isSelected
                              ? AppTheme.primaryColor
                              : Theme.of(context).textTheme.bodySmall?.color ??
                                  AppTheme.lightTextMuted,
                          width: 2,
                        ),
                      ),
                      child: ingredient.isSelected
                          ? const Icon(Icons.check,
                              color: Colors.white, size: 18)
                          : null,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Color _getConfidenceColor(double confidence) {
    if (confidence >= 0.8) return AppTheme.successColor;
    if (confidence >= 0.6) return AppTheme.warningColor;
    return AppTheme.errorColor;
  }
}

class _CategoryFilterButton extends StatelessWidget {
  final String title;
  final String icon;
  final String? selectedValue;
  final bool? isActive;
  final VoidCallback onTap;

  const _CategoryFilterButton({
    required this.title,
    required this.icon,
    this.selectedValue,
    this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = (selectedValue != null && selectedValue!.isNotEmpty) ||
        (isActive ?? false);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor
              : Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Theme.of(context).dividerColor.withOpacity(0.1),
          ),
          boxShadow: [
            if (isSelected)
              BoxShadow(
                color: AppTheme.primaryColor.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 8),
            Text(
              isSelected && selectedValue != null ? selectedValue! : title,
              style: TextStyle(
                color: isSelected
                    ? Colors.white
                    : Theme.of(context).textTheme.bodyMedium?.color,
                fontWeight: FontWeight.bold,
              ),
            ),
            if (!isSelected) ...[
              const SizedBox(width: 4),
              Icon(
                Icons.keyboard_arrow_down_rounded,
                size: 16,
                color: Theme.of(context).iconTheme.color?.withOpacity(0.5),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../models/pantry_item.dart';
import '../models/ingredient.dart';
import '../services/api_service.dart';
import '../services/pantry_service.dart';
import '../widgets/glass_card.dart';
import 'ingredients_screen.dart';
import 'receipt_scanning_screen.dart';
import 'stock_analysis_screen.dart';

import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';

class PantryScreen extends StatefulWidget {
  const PantryScreen({super.key});

  @override
  State<PantryScreen> createState() => _PantryScreenState();
}

class _PantryScreenState extends State<PantryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<PantryItem> _pantryItems = [];
  List<PantryItem> _expiringItems = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    final items = await pantryService.getPantryItems();
    final expiring = await pantryService.getExpiringItems();

    setState(() {
      _pantryItems = items;
      _expiringItems = expiring;
      _isLoading = false;
    });
  }

  Future<void> _addItem() async {
    final l10n = AppLocalizations.of(context)!;
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const _AddPantryItemSheet(),
    );

    if (result != null) {
      try {
        // Show loading indicator
        if (!mounted) return;
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => const Center(
            child: CircularProgressIndicator(color: AppTheme.primaryColor),
          ),
        );

        final item = await pantryService.addPantryItem(
          ingredientName: result['name'],
          quantity: result['quantity'] ?? 1.0,
          unit: result['unit'] ?? 'adet',
          expiresAt: result['expiresAt'],
        );

        if (!mounted) return;
        Navigator.pop(context); // Close loading

        if (item != null) {
          _loadData();
          AppSnackBar.success(context, l10n.ingredientAdded);
        }
      } catch (e) {
        if (!mounted) return;
        Navigator.pop(context); // Close loading
        AppSnackBar.error(context, l10n.errorGeneric(e.toString()));
      }
    }
  }

  Future<void> _addFromCamera() async {
    final l10n = AppLocalizations.of(context)!;
    final picker = ImagePicker();
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Text(l10n.photoIngredientAdd,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: _PhotoOptionCard(
                    icon: Icons.camera_alt_rounded,
                    title: l10n.cameraLabel,
                    color: AppTheme.primaryColor,
                    onTap: () => Navigator.pop(context, ImageSource.camera),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _PhotoOptionCard(
                    icon: Icons.photo_library_rounded,
                    title: l10n.galleryLabel,
                    color: AppTheme.accentColor,
                    onTap: () => Navigator.pop(context, ImageSource.gallery),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );

    if (source == null) return;

    try {
      final pickedFile = await picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );
      if (pickedFile == null) return;

      if (!mounted) return;

      // Show loading dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => Center(
          child: Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const CircularProgressIndicator(color: AppTheme.primaryColor),
                const SizedBox(height: 16),
                Text(l10n.aiAnalyzing,
                    style: Theme.of(context).textTheme.titleMedium),
              ],
            ),
          ),
        ),
      );

      final ingredients = await apiService.analyzeImage(pickedFile);
      if (!mounted) return;
      Navigator.pop(context); // Close loading

      if (ingredients.isEmpty) {
        AppSnackBar.warning(context, l10n.ingredientNotDetected);

        return;
      }

      // Show selection dialog
      final names =
          ingredients.map((i) => i.getLocalizedName(l10n.localeName)).toList();
      final selected = List<bool>.filled(names.length, true);

      final confirmed = await showDialog<bool>(
        context: context,
        builder: (ctx) => StatefulBuilder(
          builder: (ctx, setDialogState) => AlertDialog(
            title: Text(l10n.foundProducts(
                names.length)), // Using foundProducts as close match
            content: SizedBox(
              width: double.maxFinite,
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: names.length,
                itemBuilder: (_, i) => CheckboxListTile(
                  title: Text(names[i]),
                  value: selected[i],
                  activeColor: AppTheme.primaryColor,
                  onChanged: (v) =>
                      setDialogState(() => selected[i] = v ?? false),
                ),
              ),
            ),
            actions: [
              TextButton(
                  onPressed: () => Navigator.pop(ctx, false),
                  child: Text(l10n.cancel)),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor),
                child:
                    Text(l10n.add, style: const TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      );

      if (confirmed == true) {
        final toAdd = <String>[];
        for (int i = 0; i < names.length; i++) {
          if (selected[i]) toAdd.add(names[i]);
        }
        if (toAdd.isNotEmpty) {
          await pantryService.addBulkPantryItems(toAdd);
          _loadData();
          if (mounted) {
            AppSnackBar.success(
                context, l10n.ingredientsAddedCount(toAdd.length));
          }
        }
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context); // Close loading if still open
        AppSnackBar.error(
            context, AppLocalizations.of(context)!.errorGeneric(e.toString()));
      }
    }
  }

  void _showAddOptions() {
    final l10n = AppLocalizations.of(context)!;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Text(l10n.addIngredient,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.edit_note_rounded,
                    color: AppTheme.primaryColor),
              ),
              title: Text(l10n.manualAdd,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(l10n.manualAddSubtitle),
              onTap: () {
                Navigator.pop(context);
                _addItem();
              },
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.receipt_long, color: Colors.purple),
              ),
              title: Text(l10n.scanReceipt,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(l10n.scanReceiptSubtitle),
              onTap: () async {
                Navigator.pop(context);
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => const ReceiptScanningScreen()),
                );
                if (result == true) {
                  _loadData();
                }
              },
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.accentColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.camera_alt_rounded,
                    color: AppTheme.accentColor),
              ),
              title: Text(l10n.photoAdd,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(l10n.photoAddSubtitle),
              onTap: () {
                Navigator.pop(context);
                _addFromCamera();
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Future<void> _editItem(PantryItem item) async {
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _EditPantryItemSheet(item: item),
    );

    if (result != null) {
      await pantryService.updatePantryItem(
        itemId: item.id,
        quantity: result['quantity'],
        unit: result['unit'],
        expiresAt: result['expiresAt'],
      );
      _loadData();
    }
  }

  Future<void> _removeItem(int itemId) async {
    final success = await pantryService.removePantryItem(itemId);
    if (success) {
      _loadData();
    }
  }

  Future<void> _addToShoppingList(PantryItem item) async {
    final l10n = AppLocalizations.of(context)!;
    await pantryService.addShoppingItem(ingredientName: item.ingredientName);
    if (mounted) {
      AppSnackBar.show(
        context,
        message: l10n.addedToShoppingList(
            item.getLocalizedIngredientName(l10n.localeName)),
        type: SnackBarType.success,
        actionLabel: l10n.ok,
      );
    }
  }

  void _suggestRecipesFromPantry() {
    final l10n = AppLocalizations.of(context)!;
    if (_pantryItems.isEmpty) {
      AppSnackBar.warning(context, l10n.pantryEmptyAddFirst);
      return;
    }

    final ingredients = _pantryItems.map((item) {
      return Ingredient(
        name: item.ingredientName.toLowerCase(),
        nameTr: item.translations?['tr'] ?? item.ingredientName,
        nameEn: item.translations?['en'] ?? item.ingredientName,
        nameEs: item.translations?['es'] ?? item.ingredientName,
        nameFr: item.translations?['fr'] ?? item.ingredientName,
        nameDe: item.translations?['de'] ?? item.ingredientName,
        nameIt: item.translations?['it'] ?? item.ingredientName,
        confidence: 1.0,
        category: item.category,
      );
    }).toList();

    final provider = Provider.of<AppProvider>(context, listen: false);
    provider.setDetectedIngredients(ingredients);

    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const IngredientsScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final l10n = AppLocalizations.of(context)!;

    if (!authProvider.isLoggedIn) {
      return Scaffold(
        appBar: AppBar(title: Text(l10n.pantryTitle)),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock_outline, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                l10n.loginRequired,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  );
                },
                icon: const Icon(Icons.login),
                label: Text(l10n.loginButton),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(l10n.pantryTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart_rounded),
            tooltip: l10n.stockAnalysis,
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StockAnalysisScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadData,
          ),
          if (_pantryItems.isNotEmpty)
            TextButton.icon(
              onPressed: _suggestRecipesFromPantry,
              icon: const Icon(Icons.restaurant_menu, size: 18),
              label: Text(l10n.suggestRecipe),
              style:
                  TextButton.styleFrom(foregroundColor: AppTheme.primaryColor),
            ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.kitchen, size: 20),
                  const SizedBox(width: 8),
                  Text(l10n.allIngredients),
                ],
              ),
            ),
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.warning_amber_rounded, size: 20),
                  const SizedBox(width: 8),
                  Text(l10n.expiringSoonCount(_expiringItems.length)),
                ],
              ),
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildGroupedPantryList(_pantryItems),
                _buildPantryList(_expiringItems, isExpiring: true),
              ],
            ),
      floatingActionButton: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton.extended(
            onPressed: _showAddOptions,
            icon: const Icon(Icons.add),
            label: Text(l10n.addIngredient),
            backgroundColor: AppTheme.primaryColor,
          ),
        ],
      ),
    );
  }

  /// Group items by category
  Widget _buildGroupedPantryList(List<PantryItem> items) {
    final l10n = AppLocalizations.of(context)!;
    if (items.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🧊', style: TextStyle(fontSize: 64)),
            const SizedBox(height: 16),
            Text(l10n.pantryEmpty,
                style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(
              l10n.pantryEmptySubtitle,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      );
    }

    // Group by category
    final grouped = <String, List<PantryItem>>{};
    for (final item in items) {
      grouped.putIfAbsent(item.category, () => []).add(item);
    }

    // Sort categories
    final sortedKeys = grouped.keys.toList()
      ..sort((a, b) {
        const order = [
          'vegetables',
          'fruits',
          'meat',
          'seafood',
          'dairy',
          'eggs',
          'grains',
          'legumes',
          'pasta',
          'bakery',
          'spices',
          'sauces',
          'oils',
          'beverages',
          'snacks',
          'nuts',
          'frozen',
          'canned',
          'sweets',
          'other'
        ];
        final ia = order.indexOf(a);
        final ib = order.indexOf(b);
        return (ia == -1 ? 99 : ia).compareTo(ib == -1 ? 99 : ib);
      });

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        itemCount: sortedKeys.length,
        itemBuilder: (context, sectionIndex) {
          final category = sortedKeys[sectionIndex];
          final categoryItems = grouped[category]!;
          final sampleItem = categoryItems.first;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (sectionIndex > 0) const SizedBox(height: 8),
              // Category header
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Row(
                  children: [
                    Text(sampleItem.categoryEmoji,
                        style: const TextStyle(fontSize: 20)),
                    const SizedBox(width: 8),
                    Text(
                      sampleItem.localizedCategoryName(l10n),
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).textTheme.bodySmall?.color,
                          ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '${categoryItems.length}',
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor),
                      ),
                    ),
                  ],
                ),
              ),
              // Items in this category
              ...categoryItems.asMap().entries.map((entry) {
                return _buildPantryItemCard(entry.value, entry.key)
                    .animate()
                    .fadeIn(delay: Duration(milliseconds: entry.key * 50))
                    .slideX(
                        begin: 0.1,
                        end: 0,
                        delay: Duration(milliseconds: entry.key * 50));
              }),
            ],
          );
        },
      ),
    );
  }

  Widget _buildPantryList(List<PantryItem> items, {bool isExpiring = false}) {
    final l10n = AppLocalizations.of(context)!;
    if (items.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(isExpiring ? '🎉' : '🧊',
                style: const TextStyle(fontSize: 64)),
            const SizedBox(height: 16),
            Text(
              isExpiring ? l10n.noExpiringItems : l10n.pantryEmpty,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              isExpiring ? l10n.allItemsFresh : l10n.pantryEmptySubtitle,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final item = items[index];
          return _buildPantryItemCard(item, index)
              .animate()
              .fadeIn(delay: Duration(milliseconds: index * 50))
              .slideX(
                  begin: 0.2,
                  end: 0,
                  delay: Duration(milliseconds: index * 50));
        },
      ),
    );
  }

  Widget _buildPantryItemCard(PantryItem item, int index) {
    final l10n = AppLocalizations.of(context)!;
    final isExpired = item.isExpired;
    final isExpiringSoon = item.isExpiringSoon;
    final catColor = PantryItem.categoryColor(item.category);

    return Dismissible(
      key: Key('pantry_${item.id}'),
      // Swipe right to delete
      background: Container(
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.only(left: 20),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppTheme.errorColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            const Icon(Icons.delete, color: Colors.white),
            const SizedBox(width: 8),
            Text(l10n.delete,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      // Swipe left to add to shopping list
      secondaryBackground: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppTheme.primaryColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(l10n.addToList,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(width: 8),
            const Icon(Icons.shopping_cart, color: Colors.white),
          ],
        ),
      ),
      confirmDismiss: (direction) async {
        if (direction == DismissDirection.startToEnd) {
          // Delete
          return await showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: Text(l10n.deleteConfirmTitle),
              content: Text(l10n.deleteConfirmMessage(
                  item.getLocalizedIngredientName(l10n.localeName))),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    child: Text(l10n.cancel)),
                TextButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: Text(l10n.delete,
                      style: const TextStyle(color: AppTheme.errorColor)),
                ),
              ],
            ),
          );
        } else {
          // Add to shopping list
          await _addToShoppingList(item);
          return false; // Don't dismiss the card
        }
      },
      onDismissed: (_) => _removeItem(item.id),
      child: GestureDetector(
        onTap: () => _editItem(item),
        child: GlassCard(
          margin: const EdgeInsets.only(bottom: 12),
          child: Row(
            children: [
              // Category emoji icon
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: catColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(item.categoryEmoji,
                      style: const TextStyle(fontSize: 24)),
                ),
              ),

              const SizedBox(width: 16),

              // Item details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.getLocalizedIngredientName(l10n.localeName),
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '${item.quantity} ${item.localizedUnitName(l10n)}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(width: 8),
                        Icon(Icons.edit,
                            size: 12,
                            color:
                                Theme.of(context).textTheme.bodySmall?.color),
                        const SizedBox(width: 6),
                        GestureDetector(
                          onTap: () async {
                            final confirmed = await showDialog<bool>(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                title: Text(l10n.deleteConfirmTitle),
                                content: Text(l10n.deleteConfirmMessage(
                                    item.getLocalizedIngredientName(
                                        l10n.localeName))),
                                actions: [
                                  TextButton(
                                      onPressed: () =>
                                          Navigator.pop(ctx, false),
                                      child: Text(l10n.cancel)),
                                  TextButton(
                                    onPressed: () => Navigator.pop(ctx, true),
                                    child: Text(l10n.delete,
                                        style: const TextStyle(
                                            color: AppTheme.errorColor)),
                                  ),
                                ],
                              ),
                            );
                            if (confirmed == true) {
                              _removeItem(item.id);
                            }
                          },
                          child: Icon(Icons.delete_outline,
                              size: 14,
                              color: AppTheme.errorColor.withOpacity(0.7)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Expiry badge
              if (item.expiresAt != null)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isExpired
                        ? AppTheme.errorColor.withOpacity(0.1)
                        : isExpiringSoon
                            ? AppTheme.warningColor.withOpacity(0.1)
                            : AppTheme.successColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    item.localizedExpiryStatus(l10n),
                    style: TextStyle(
                      color: isExpired
                          ? AppTheme.errorColor
                          : isExpiringSoon
                              ? AppTheme.warningColor
                              : AppTheme.successColor,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// =====================
// Photo Option Card
// =====================
class _PhotoOptionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final VoidCallback onTap;

  const _PhotoOptionCard({
    required this.icon,
    required this.title,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(title,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

// =====================
// Add Pantry Item Sheet
// =====================
class _AddPantryItemSheet extends StatefulWidget {
  const _AddPantryItemSheet();

  @override
  State<_AddPantryItemSheet> createState() => _AddPantryItemSheetState();
}

class _AddPantryItemSheetState extends State<_AddPantryItemSheet> {
  final _nameController = TextEditingController();
  final _quantityController = TextEditingController(text: '1');
  String _unit = 'adet';
  DateTime? _expiresAt;

  final List<String> _units = ['adet', 'kg', 'g', 'L', 'ml', 'demet', 'paket'];

  @override
  void dispose() {
    _nameController.dispose();
    _quantityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(l10n.addIngredient,
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),

            // Name field
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: l10n.ingredientName,
                prefixIcon: const Icon(Icons.restaurant),
              ),
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 16),

            // Quantity and unit
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: TextField(
                    controller: _quantityController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: l10n.quantity,
                      prefixIcon: const Icon(Icons.numbers),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: DropdownButtonFormField<String>(
                    value: _unit,
                    decoration: InputDecoration(labelText: l10n.unitLabel),
                    items: _units.map((unit) {
                      return DropdownMenuItem(
                          value: unit,
                          child:
                              Text(PantryItem.localizedUnitStatic(unit, l10n)));
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) setState(() => _unit = value);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Expiry date
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.calendar_today),
              title: Text(
                _expiresAt == null
                    ? l10n.expiryDateOptional
                    : l10n.expiryDateLabel(
                        _expiresAt!.day, _expiresAt!.month, _expiresAt!.year),
              ),
              trailing: _expiresAt != null
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () => setState(() => _expiresAt = null),
                    )
                  : null,
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now().add(const Duration(days: 7)),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                );
                if (date != null) setState(() => _expiresAt = date);
              },
            ),
            const SizedBox(height: 24),

            // Add button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  if (_nameController.text.isEmpty) return;
                  Navigator.pop(context, {
                    'name': _nameController.text.trim(),
                    'quantity':
                        double.tryParse(_quantityController.text) ?? 1.0,
                    'unit': _unit,
                    'expiresAt': _expiresAt,
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
                child: Text(l10n.add,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =====================
// Edit Pantry Item Sheet
// =====================
class _EditPantryItemSheet extends StatefulWidget {
  final PantryItem item;
  const _EditPantryItemSheet({required this.item});

  @override
  State<_EditPantryItemSheet> createState() => _EditPantryItemSheetState();
}

class _EditPantryItemSheetState extends State<_EditPantryItemSheet> {
  late TextEditingController _quantityController;
  late String _unit;
  DateTime? _expiresAt;

  final List<String> _units = ['adet', 'kg', 'g', 'L', 'ml', 'demet', 'paket'];

  @override
  void initState() {
    super.initState();
    _quantityController =
        TextEditingController(text: widget.item.quantity.toString());
    _unit = widget.item.unit;
    _expiresAt = widget.item.expiresAt;
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Text(widget.item.categoryEmoji,
                    style: const TextStyle(fontSize: 32)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                      widget.item.getLocalizedIngredientName(
                          AppLocalizations.of(context)!.localeName),
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Quantity and unit
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: TextField(
                    controller: _quantityController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: l10n.quantity,
                      prefixIcon: const Icon(Icons.numbers),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: DropdownButtonFormField<String>(
                    value: _units.contains(_unit) ? _unit : 'adet',
                    decoration: InputDecoration(labelText: l10n.unitLabel),
                    items: _units.map((unit) {
                      return DropdownMenuItem(
                          value: unit,
                          child:
                              Text(PantryItem.localizedUnitStatic(unit, l10n)));
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) setState(() => _unit = value);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Expiry date
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.calendar_today),
              title: Text(
                _expiresAt == null
                    ? l10n.expiryDateOptional
                    : l10n.expiryDateLabel(
                        _expiresAt!.day, _expiresAt!.month, _expiresAt!.year),
              ),
              trailing: _expiresAt != null
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () => setState(() => _expiresAt = null),
                    )
                  : null,
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate:
                      _expiresAt ?? DateTime.now().add(const Duration(days: 7)),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                );
                if (date != null) setState(() => _expiresAt = date);
              },
            ),
            const SizedBox(height: 24),

            // Save button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context, {
                    'quantity': double.tryParse(_quantityController.text) ??
                        widget.item.quantity,
                    'unit': _unit,
                    'expiresAt': _expiresAt,
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
                child: Text(l10n.save,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

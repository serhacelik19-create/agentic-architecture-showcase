import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For Clipboard
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import 'package:share_plus/share_plus.dart';
import '../models/shopping_item.dart';
import '../widgets/glass_card.dart';

class ShoppingListScreen extends StatefulWidget {
  const ShoppingListScreen({super.key});

  @override
  State<ShoppingListScreen> createState() => _ShoppingListScreenState();
}

class _ShoppingListScreenState extends State<ShoppingListScreen> {
  List<ShoppingItem> _items = [];
  bool _isLoading = false;
  final _itemController = TextEditingController();
  int _nextId = 1; // Auto-incrementing local ID

  // Selection Mode State
  bool _isSelectionMode = false;
  final Set<int> _selectedItems = {};

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    final prefs = await SharedPreferences.getInstance();
    final String? itemsJson = prefs.getString('shopping_list_items');
    final int? nextId = prefs.getInt('shopping_list_next_id');

    if (itemsJson != null) {
      try {
        final List<dynamic> decoded = jsonDecode(itemsJson);
        setState(() {
          _items = decoded.map((e) => ShoppingItem.fromJson(e)).toList();
        });
      } catch (e) {
        debugPrint('Error loading shopping list: $e');
      }
    }

    if (nextId != null) {
      _nextId = nextId;
    }
  }

  Future<void> _saveItems() async {
    final prefs = await SharedPreferences.getInstance();
    final itemsJson = jsonEncode(_items.map((e) => e.toJson()).toList());
    await prefs.setString('shopping_list_items', itemsJson);
    await prefs.setInt('shopping_list_next_id', _nextId);
  }

  @override
  void dispose() {
    _itemController.dispose();
    super.dispose();
  }

  /// Normalize name for duplicate checking
  String _normalizeName(String name) {
    return name.trim().toLowerCase().replaceAll('İ', 'i').replaceAll('I', 'ı');
  }

  /// Helper to guess category based on ingredient name
  String _guessCategory(String name) {
    final lower = name.toLowerCase();
    if ([
      'domates',
      'biber',
      'patlıcan',
      'soğan',
      'sarımsak',
      'maydanoz',
      'marul',
      'havuç',
      'patates',
      'salatalık',
      'kabak',
      'ıspanak',
      'brokoli',
      'karnabahar',
      'lahana',
      'pırasa',
      'enginar',
      'semizotu',
      'roka',
      'dereotu',
      'nane',
      'fesleğen',
      'tere',
      'kuzu kulağı',
      'pazı',
      'mantar',
      'elma',
      'armut',
      'muz',
      'çilek',
      'kiraz',
      'vişne',
      'karpuz',
      'kavun',
      'üzüm',
      'incir',
      'şeftali',
      'kayısı',
      'erik',
      'mandalina',
      'portakal',
      'limon',
      'greyfurt',
      'nar',
      'kivi',
      'avakado',
      'ananas',
      'hurma',
      'dut',
      'böğürtlen',
      'ahududu'
    ].any((k) => lower.contains(k))) {
      return 'Manav';
    }
    if ([
      'süt',
      'peynir',
      'yoğurt',
      'tereyağı',
      'krema',
      'yumurta',
      'kaymak',
      'labne',
      'kefir',
      'ayran'
    ].any((k) => lower.contains(k))) {
      return 'Süt & Kahvaltılık';
    }
    if ([
      'et',
      'kıyma',
      'tavuk',
      'balık',
      'sucuk',
      'salam',
      'sosis',
      'pastırma',
      'jambon',
      'biftek',
      'pirzola',
      'kuşbaşı',
      'kanat',
      'but',
      'hamsi',
      'somon',
      'ton'
    ].any((k) => lower.contains(k))) {
      return 'Et & Şarküteri';
    }
    if ([
      'ekmek',
      'un',
      'makarna',
      'pirinç',
      'bulgur',
      'mercimek',
      'nohut',
      'fasulye',
      'yufka',
      'börek',
      'simit',
      'poğaça',
      'bazlama',
      'lavaş',
      'galeta',
      'irmik',
      'nişasta',
      'maya',
      'kabartma tozu',
      'vanilya',
      'kuskus',
      'erişte',
      'şehriye'
    ].any((k) => lower.contains(k))) {
      return 'Bakliyat & Fırın';
    }
    if ([
      'yağ',
      'zeytinyağı',
      'ayçiçek',
      'tuz',
      'karabiber',
      'baharat',
      'şeker',
      'salça',
      'pul biber',
      'kekik',
      'kimyon',
      'nane',
      'sumak',
      'tarçın',
      'sirke',
      'limon suyu',
      'mayonez',
      'ketçap',
      'hardal',
      'sos',
      'bulyon'
    ].any((k) => lower.contains(k))) {
      return 'Yağ & Baharat';
    }
    if ([
      'su',
      'kola',
      'gazoz',
      'soda',
      'meyve suyu',
      'çay',
      'kahve',
      'şalgam',
      'sahlep',
      'boza'
    ].any((k) => lower.contains(k))) {
      return 'İçecek';
    }
    if ([
      'deterjan',
      'sabun',
      'şampuan',
      'peçete',
      'kağıt',
      'bez',
      'sünger',
      'çamaşır suyu',
      'yumuşatıcı',
      'diş macunu'
    ].any((k) => lower.contains(k))) {
      return 'Temizlik & Hijyen';
    }
    if ([
      'cips',
      'bisküvi',
      'gofret',
      'çikolata',
      'kraker',
      'kek',
      'kuruyemiş',
      'fıstık',
      'ceviz',
      'fındık',
      'badem',
      'çekirdek'
    ].any((k) => lower.contains(k))) {
      return 'Atıştırmalık';
    }
    return 'Diğer';
  }

  void _addItem() {
    final text = _itemController.text.trim();
    if (text.isEmpty) return;

    // Parse Quantity Logic
    // formats: "2 kg Elma", "Elma 2kg", "5 Ekmek"

    String? quantity;
    String ingredientName = text;

    // 1. Try "Number Unit Name" (e.g. "2 kg Elma")
    final prefixRegex = RegExp(r'^([\d.,]+)\s*(\w+)?\s+(.+)$');
    final prefixMatch = prefixRegex.firstMatch(text);

    // 2. Try "Name Number Unit" (e.g. "Elma 2 kg")
    final suffixRegex = RegExp(r'^(.+)\s+([\d.,]+)\s*(\w+)?$');
    final suffixMatch = suffixRegex.firstMatch(text);

    // 3. Try just "Number Name" (e.g. "2 Ekmek")
    final simplePrefixRegex = RegExp(r'^([\d.,]+)\s+(.+)$');
    final simplePrefixMatch = simplePrefixRegex.firstMatch(text);

    if (prefixMatch != null) {
      final number = prefixMatch.group(1);
      final unit = prefixMatch.group(2);
      final rest = prefixMatch.group(3);
      if (number != null && rest != null) {
        quantity = unit != null ? '$number $unit' : number;
        ingredientName = rest.trim();
      }
    } else if (suffixMatch != null) {
      final namePart = suffixMatch.group(1);
      final number = suffixMatch.group(2);
      final unit = suffixMatch.group(3);
      if (namePart != null && number != null) {
        quantity = unit != null ? '$number $unit' : number;
        ingredientName = namePart.trim();
      }
    } else if (simplePrefixMatch != null) {
      final number = simplePrefixMatch.group(1);
      final namePart = simplePrefixMatch.group(2);
      if (number != null && namePart != null) {
        quantity = number;
        ingredientName = namePart.trim();
      }
    }

    // Duplicate Check using parsed name
    final normalized = _normalizeName(ingredientName);
    final isDuplicate =
        _items.any((item) => _normalizeName(item.ingredientName) == normalized);

    if (isDuplicate) {
      AppSnackBar.warning(
          context, AppLocalizations.of(context)!.itemAlreadyExists);
      return;
    }

    // Create item locally — instant, no API call
    final newItem = ShoppingItem(
      id: _nextId++,
      ingredientName: ingredientName,
      quantity: quantity,
      category: _guessCategory(ingredientName),
      isChecked: false,
      createdAt: DateTime.now(),
    );

    setState(() {
      _items.insert(0, newItem);
    });
    _saveItems();
    _itemController.clear();
  }

  void _toggleItem(int itemId) {
    setState(() {
      _items = _items.map((item) {
        if (item.id == itemId) {
          return item.copyWith(isChecked: !item.isChecked);
        }
        return item;
      }).toList();
    });
    _saveItems();
  }

  void _removeItem(int itemId) {
    setState(() {
      _items.removeWhere((item) => item.id == itemId);
    });
    _saveItems();
  }

  void _clearChecked() async {
    final checkedCount = _items.where((i) => i.isChecked).length;
    if (checkedCount == 0) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) {
        final l10n = AppLocalizations.of(context)!;
        return AlertDialog(
          title: Text(l10n.deleteCheckedTitle),
          content: Text(l10n.deleteCheckedMessage(checkedCount)),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(l10n.cancel),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(l10n.delete,
                  style: const TextStyle(color: AppTheme.errorColor)),
            ),
          ],
        );
      },
    );

    if (confirm == true) {
      setState(() {
        _items.removeWhere((item) => item.isChecked);
      });
      _saveItems();
    }
  }

  void _quickAdd(String name) {
    _itemController.text = name;
    _addItem();
  }

  // Pre-defined quick items
  List<String> get _quickItems {
    final l10n = AppLocalizations.of(context)!;
    return [
      l10n.quickItemBread,
      l10n.quickItemMilk,
      l10n.quickItemEgg,
      l10n.quickItemWater,
      l10n.quickItemTomato,
      l10n.quickItemCheese,
      l10n.quickItemYogurt,
      l10n.quickItemPasta
    ];
  }

  void _shareList() {
    if (_items.isEmpty) return;
    _shareListItems(_items.where((i) => !i.isChecked).toList());
  }

  void _shareListItems(List<ShoppingItem> itemsToShare) {
    if (itemsToShare.isEmpty) return;

    final l10n = AppLocalizations.of(context)!;
    final buffer = StringBuffer();
    buffer.writeln('🛒 *${l10n.shoppingListTitle}*');
    buffer.writeln('-------------------');

    // Group items by category for nicer sharing
    final grouped = <String, List<ShoppingItem>>{};
    for (var item in itemsToShare) {
      grouped.putIfAbsent(item.localizedCategoryName(l10n), () => []).add(item);
    }

    if (grouped.isNotEmpty) {
      if (_isSelectionMode) {
        buffer.writeln('\n*${l10n.selectedItems}*');
      } else {
        buffer.writeln('\n*${l10n.itemsToBuy}*');
      }

      for (var entry in grouped.entries) {
        buffer.writeln('\n📂 ${entry.key}:');
        for (var item in entry.value) {
          buffer.writeln(
              '- ${item.getLocalizedIngredientName(l10n.localeName)} ${item.quantity ?? ""}');
        }
      }
    }

    // Trigger native share bottom sheet
    Share.share(buffer.toString());
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final uncheckedItems = _items.where((i) => !i.isChecked).toList();
    final checkedItems = _items.where((i) => i.isChecked).toList();

    return Scaffold(
      backgroundColor: AppTheme.lightBg,
      appBar: _isSelectionMode
          ? AppBar(
              backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
              title: Text(l10n.selectedCount(_selectedItems.length)),
              leading: IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  setState(() {
                    _isSelectionMode = false;
                    _selectedItems.clear();
                  });
                },
              ),
              actions: [
                _buildAppBarAction(
                  icon: Icons.select_all,
                  tooltip: l10n.selectAll,
                  onPressed: _selectAll,
                ),
                const SizedBox(width: 8),
                if (_selectedItems.isNotEmpty) ...[
                  _buildAppBarAction(
                    icon: Icons.share,
                    tooltip: l10n.shareLabel,
                    onPressed: _shareSelected,
                  ),
                  const SizedBox(width: 8),
                ],
                _buildAppBarAction(
                  icon: Icons.delete,
                  tooltip: l10n.delete,
                  onPressed: _deleteSelected,
                  color: AppTheme.errorColor,
                  bgColor: AppTheme.errorColor.withOpacity(0.1),
                ),
                const SizedBox(width: 8),
              ],
            )
          : AppBar(
              title: Text(l10n.shoppingListTitle),
              actions: [
                IconButton(
                  icon: const Icon(Icons.share),
                  tooltip: l10n.shareList,
                  onPressed: _shareList,
                ),
                IconButton(
                  icon: const Icon(Icons.checklist),
                  tooltip: l10n.multiSelect,
                  onPressed: () {
                    setState(() {
                      _isSelectionMode = true;
                    });
                  },
                ),
                if (checkedItems.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.delete_sweep),
                    tooltip: l10n.deleteChecked,
                    onPressed: _clearChecked,
                  ),
              ],
            ),
      body: Column(
        children: [
          // Add item input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.lightCardBg,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _itemController,
                    decoration: InputDecoration(
                      hintText: l10n.addIngredientHint,
                      prefixIcon: const Icon(Icons.add_shopping_cart),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: AppTheme.lightBg,
                    ),
                    textInputAction: TextInputAction.done,
                    onSubmitted: (_) => _addItem(),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: IconButton(
                    onPressed: _addItem,
                    icon: const Icon(Icons.add, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),

          Container(
            height: 50,
            margin: const EdgeInsets.only(bottom: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _quickItems.length,
              itemBuilder: (context, index) {
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    label: Text(_quickItems[index]),
                    backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                    labelStyle: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    onPressed: () => _quickAdd(_quickItems[index]),
                    side: BorderSide.none,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                );
              },
            ),
          ),

          // List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _items.isEmpty
                    ? _buildEmptyState()
                    : _buildCategorizedList(uncheckedItems, checkedItems),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    final l10n = AppLocalizations.of(context)!;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🛒', style: TextStyle(fontSize: 64)),
          const SizedBox(height: 16),
          Text(
            l10n.shoppingListEmpty,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.shoppingListEmptySubtitle,
            style: const TextStyle(color: AppTheme.lightTextSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildShoppingItem(ShoppingItem item, int index,
      {bool isChecked = false}) {
    final l10n = AppLocalizations.of(context)!;
    final isSelected = _selectedItems.contains(item.id);

    return Dismissible(
      key: Key('shopping_${item.id}'),
      direction: _isSelectionMode
          ? DismissDirection.none
          : DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: AppTheme.errorColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (_) => _removeItem(item.id),
      child: GestureDetector(
        onLongPress: () {
          setState(() {
            _isSelectionMode = true;
            _selectedItems.add(item.id);
          });
        },
        onTap: _isSelectionMode
            ? () {
                setState(() {
                  if (isSelected) {
                    _selectedItems.remove(item.id);
                    if (_selectedItems.isEmpty) _isSelectionMode = false;
                  } else {
                    _selectedItems.add(item.id);
                  }
                });
              }
            : () => _showEditDialog(item),
        child: GlassCard(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          borderColor: isSelected ? AppTheme.primaryColor : null,
          child: Row(
            children: [
              // Checkbox or Selection Indicator
              if (_isSelectionMode)
                Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: Icon(
                    isSelected
                        ? Icons.check_box
                        : Icons.check_box_outline_blank,
                    color: isSelected ? AppTheme.primaryColor : Colors.grey,
                  ),
                )
              else
                GestureDetector(
                  onTap: () => _toggleItem(item.id),
                  child: Container(
                    margin: const EdgeInsets.only(right: 16),
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isChecked
                          ? AppTheme.successColor
                          : Colors.transparent,
                      border: Border.all(
                        color: isChecked
                            ? AppTheme.successColor
                            : AppTheme.lightTextSecondary,
                        width: 2,
                      ),
                    ),
                    child: isChecked
                        ? const Icon(Icons.check, color: Colors.white, size: 18)
                        : null,
                  ),
                ),

              // Item name
              Expanded(
                child: Text(
                  item.getLocalizedIngredientName(l10n.localeName),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    decoration: isChecked ? TextDecoration.lineThrough : null,
                    color: isChecked
                        ? AppTheme.lightTextSecondary
                        : AppTheme.lightTextPrimary,
                  ),
                ),
              ),

              if (item.quantity != null && item.quantity!.isNotEmpty)
                Container(
                  margin: const EdgeInsets.only(left: 8),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    item.quantity!,
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),

              // Edit Icon & Delete Icon (only in normal mode)
              if (!_isSelectionMode) ...[
                IconButton(
                  icon: const Icon(Icons.edit, size: 20, color: Colors.grey),
                  onPressed: () => _showEditDialog(item),
                  tooltip: l10n.editLabel,
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline,
                      size: 20, color: AppTheme.errorColor),
                  onPressed: () => _removeItem(item.id),
                  tooltip: l10n.delete,
                ),
              ],
            ],
          ),
        ),
      ),
    )
        .animate()
        .fadeIn(delay: Duration(milliseconds: index * 30))
        .slideX(begin: 0.1, end: 0, delay: Duration(milliseconds: index * 30));
  }

  void _selectAll() {
    setState(() {
      final allIds = _items.map((e) => e.id).toSet();
      if (_selectedItems.length == allIds.length) {
        _selectedItems.clear(); // Toggle off if all selected
      } else {
        _selectedItems.addAll(allIds);
      }
    });
  }

  void _shareSelected() {
    if (_selectedItems.isEmpty) return;

    final selectedList =
        _items.where((i) => _selectedItems.contains(i.id)).toList();
    _shareListItems(selectedList);
  }

  Future<void> _deleteSelected() async {
    final count = _selectedItems.length;
    if (count == 0) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) {
        final l10n = AppLocalizations.of(context)!;
        return AlertDialog(
          title: Text(l10n.deleteSelectedTitle),
          content: Text(l10n.deleteSelectedMessage(count)),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(l10n.cancel),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(l10n.delete,
                  style: const TextStyle(color: AppTheme.errorColor)),
            ),
          ],
        );
      },
    );

    if (confirm == true) {
      setState(() {
        _items.removeWhere((item) => _selectedItems.contains(item.id));
        _isSelectionMode = false;
        _selectedItems.clear();
      });
      _saveItems();
    }
  }

  Future<void> _showEditDialog(ShoppingItem item) async {
    final l10n = AppLocalizations.of(context)!;
    final nameCtrl = TextEditingController(
        text: item.getLocalizedIngredientName(l10n.localeName));

    // Parse existing quantity string to separate Amount and Unit
    // e.g. "2 kg" -> amount="2", unit="kg"
    // e.g. "5" -> amount="5", unit="adet" (default)
    String currentAmount = '';
    String currentUnit = l10n.unitAdet;

    if (item.quantity != null && item.quantity!.isNotEmpty) {
      final parts = item.quantity!.split(' ');
      if (parts.isNotEmpty) {
        currentAmount = parts[0]; // Assume first part is number
        if (parts.length > 1) {
          currentUnit = parts.sublist(1).join(' '); // Rest is unit
        }
      }
    }

    final qtyCtrl = TextEditingController(text: currentAmount);
    String selectedUnit = currentUnit;

    // Match standard units if possible, otherwise keep custom
    final List<String> units = [
      l10n.unitAdet,
      l10n.unitKg,
      l10n.unitG,
      l10n.unitL,
      l10n.unitMl,
      l10n.unitDemet,
      l10n.unitPaket,
      l10n.unitKavanoz
    ];
    if (!units.contains(selectedUnit) && selectedUnit.isNotEmpty) {
      units.add(selectedUnit);
    }

    await showDialog(
      context: context,
      builder: (context) => StatefulBuilder(builder: (context, setState) {
        return AlertDialog(
          title: Text(l10n.editItem),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: InputDecoration(
                  labelText: l10n.itemName,
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: TextField(
                      controller: qtyCtrl,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: l10n.quantity,
                        border: const OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      value: units.contains(selectedUnit) ? selectedUnit : null,
                      decoration: InputDecoration(
                          labelText: l10n.unitLabel,
                          border: const OutlineInputBorder(),
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 15)),
                      items: units
                          .map((u) => DropdownMenuItem(
                                value: u,
                                child: Text(u),
                              ))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() => selectedUnit = val);
                        }
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(l10n.cancel),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);

                String? finalQty;
                if (qtyCtrl.text.trim().isNotEmpty) {
                  finalQty = '${qtyCtrl.text.trim()} $selectedUnit';
                }

                final newName = nameCtrl.text.trim();
                setState(() {
                  _items = _items.map((i) {
                    if (i.id == item.id) {
                      return i.copyWith(
                        ingredientName: newName,
                        quantity: finalQty,
                        category: _guessCategory(newName),
                      );
                    }
                    return i;
                  }).toList();
                });
                _saveItems();
              },
              child: Text(l10n.save),
            ),
          ],
        );
      }),
    );
  }

  Widget _buildAppBarAction({
    required IconData icon,
    required VoidCallback onPressed,
    String? tooltip,
    Color color = AppTheme.primaryColor,
    Color? bgColor,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: bgColor ?? AppTheme.primaryColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: IconButton(
        icon: Icon(icon, color: color, size: 20),
        tooltip: tooltip,
        onPressed: onPressed,
        constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
        padding: EdgeInsets.zero,
      ),
    );
  }

  Widget _buildCategorizedList(
      List<ShoppingItem> uncheckedItems, List<ShoppingItem> checkedItems) {
    final l10n = AppLocalizations.of(context)!;
    // Group unchecked items by category
    final Map<String, List<ShoppingItem>> grouped = {};
    for (var item in uncheckedItems) {
      grouped.putIfAbsent(item.localizedCategoryName(l10n), () => []).add(item);
    }

    // Sort categories (Manav first, etc. or alphabetical)
    final sortedKeys = grouped.keys.toList()..sort();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Categories
        for (var category in sortedKeys) ...[
          _buildCategoryHeader(category),
          for (int i = 0; i < grouped[category]!.length; i++)
            _buildShoppingItem(grouped[category]![i], i),
          const SizedBox(height: 16),
        ],

        // Checked items section
        if (checkedItems.isNotEmpty) ...[
          const Divider(height: 32),
          Row(
            children: [
              const Icon(
                Icons.check_circle,
                color: AppTheme.successColor,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                l10n.purchasedCount(checkedItems.length),
                style: const TextStyle(
                  color: AppTheme.lightTextSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          for (int i = 0; i < checkedItems.length; i++)
            _buildShoppingItem(
              checkedItems[i],
              i,
              isChecked: true,
            ),
        ],

        // Bottom padding for FAB or aesthetics
        const SizedBox(height: 60),
      ],
    );
  }

  Widget _buildCategoryHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: AppTheme.primaryColor,
          fontWeight: FontWeight.bold,
          fontSize: 12,
          letterSpacing: 1.0,
        ),
      ),
    );
  }
}

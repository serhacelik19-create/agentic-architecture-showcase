import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../config/theme.dart';
import 'gradient_button.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';

class DietFilterModal extends StatefulWidget {
  const DietFilterModal({super.key});

  @override
  State<DietFilterModal> createState() => _DietFilterModalState();
}

class _DietFilterModalState extends State<DietFilterModal> {
  // Temporary state for the modal
  final List<String> _selectedDiets = [];
  final List<String> _selectedAllergies = [];
  final TextEditingController _allergyController = TextEditingController();

  // These will be generated dynamically
  Map<String, String> _getDietOptions(AppLocalizations l10n) => {
        'vegan': '${l10n.prefVegan} 🌱',
        'vegetarian': '${l10n.prefVegetarian} 🥗',
        'glutenfree': '${l10n.prefGlutenFree} 🌾',
        'dairyfree': '${l10n.dietDairyFree} 🥛',
        'ketogenic': '${l10n.prefKeto} 🥑',
      };

  // 'Süt Ürünsüz' likely 'prefDairyFree' or similar.
  // Checking existing keys: dietDairyFree (136) exists. prefDairyFree does not exist in snippet above but I see 'prefVegan', 'prefVegetarian', 'prefGlutenFree', 'prefKeto' in ARB list (193-196 and 201 'prefLowFat').
  // Ah, lines 193-205 in app_tr.arb:
  // 136: "dietDairyFree": "Laktozsuz",
  // Let's use 'dietDairyFree' for now.

  List<String> _getCommonAllergies(AppLocalizations l10n) => [
        l10n.allergyPeanuts,
        l10n.allergyMilk,
        l10n.allergyEgg,
        l10n.allergySoyName,
        l10n.allergyGluten, // Buğday -> Gluten as closest? Or create new key? 'gluten' is widely used.
        l10n.allergySeafood // Balık -> Seafood closest.
      ];

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<AppProvider>(context, listen: false);
    _selectedDiets.addAll(provider.dietaryPreferences);
    _selectedAllergies.addAll(provider.allergies);
  }

  @override
  void dispose() {
    _allergyController.dispose();
    super.dispose();
  }

  void _toggleDiet(String key) {
    setState(() {
      if (_selectedDiets.contains(key)) {
        _selectedDiets.remove(key);
      } else {
        _selectedDiets.add(key);
      }
    });
  }

  void _toggleAllergy(String allergy) {
    setState(() {
      if (_selectedAllergies.contains(allergy)) {
        _selectedAllergies.remove(allergy);
      } else {
        _selectedAllergies.add(allergy);
      }
    });
  }

  void _addAllergyFromText() {
    final text = _allergyController.text.trim();
    if (text.isNotEmpty && !_selectedAllergies.contains(text)) {
      setState(() {
        _selectedAllergies.add(text);
        _allergyController.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle bar
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          Text(
            AppLocalizations.of(context)!.dietaryPreferences,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 24),

          // Diet Types
          Text(
            AppLocalizations.of(context)!.dietType,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: _getDietOptions(AppLocalizations.of(context)!)
                .entries
                .map((entry) {
              final isSelected = _selectedDiets.contains(entry.key);
              return FilterChip(
                label: Text(entry.value),
                selected: isSelected,
                onSelected: (_) => _toggleDiet(entry.key),
                backgroundColor: Theme.of(context).cardTheme.color,
                selectedColor: AppTheme.primaryColor.withOpacity(0.2),
                labelStyle: TextStyle(
                  color: isSelected
                      ? AppTheme.primaryColor
                      : Theme.of(context).textTheme.bodyMedium?.color,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
                checkmarkColor: AppTheme.primaryColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color:
                        isSelected ? AppTheme.primaryColor : Colors.transparent,
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 24),

          // Allergies
          Text(
            AppLocalizations.of(context)!.allergies,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _getCommonAllergies(AppLocalizations.of(context)!)
                .map((allergy) {
              final isSelected = _selectedAllergies.contains(allergy);
              return FilterChip(
                label: Text(allergy),
                selected: isSelected,
                onSelected: (_) => _toggleAllergy(allergy),
                backgroundColor: Theme.of(context).cardTheme.color,
                selectedColor: AppTheme.errorColor.withOpacity(0.15),
                labelStyle: TextStyle(
                  color: isSelected
                      ? AppTheme.errorColor
                      : Theme.of(context).textTheme.bodyMedium?.color,
                ),
                checkmarkColor: AppTheme.errorColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color:
                        isSelected ? AppTheme.errorColor : Colors.transparent,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _allergyController,
                  decoration: InputDecoration(
                    hintText: AppLocalizations.of(context)!.otherAllergyHint,
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Theme.of(context).cardTheme.color,
                  ),
                  onSubmitted: (_) => _addAllergyFromText(),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: _addAllergyFromText,
                icon: const Icon(Icons.add_circle,
                    color: AppTheme.primaryColor, size: 32),
              ),
            ],
          ),

          const SizedBox(height: 30),

          // Actions
          Row(
            children: [
              Expanded(
                child: TextButton(
                  onPressed: () {
                    // Reset
                    setState(() {
                      _selectedDiets.clear();
                      _selectedAllergies.clear();
                    });
                  },
                  child: Text(AppLocalizations.of(context)!.clearAction),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: GradientButton(
                  text: AppLocalizations.of(context)!.apply,
                  onPressed: () {
                    // Update Provider
                    Provider.of<AppProvider>(context, listen: false)
                        .setFilters(_selectedDiets, _selectedAllergies);
                    Navigator.pop(context);
                  },
                ),
              ),
            ],
          ),
          SizedBox(height: MediaQuery.of(context).viewInsets.bottom),
        ],
      ),
    );
  }
}

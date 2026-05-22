import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/theme.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../models/pantry_stats.dart';
import '../models/pantry_item.dart';
import '../services/pantry_service.dart';
import '../widgets/glass_card.dart';

class StockAnalysisScreen extends StatefulWidget {
  const StockAnalysisScreen({super.key});

  @override
  State<StockAnalysisScreen> createState() => _StockAnalysisScreenState();
}

class _StockAnalysisScreenState extends State<StockAnalysisScreen> {
  PantryStats? _stats;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() => _isLoading = true);
    final stats = await pantryService.getPantryStats();
    if (mounted) {
      setState(() {
        _stats = stats;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.smartStockAnalysis),
        backgroundColor: Colors.transparent,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _stats == null
              ? _buildErrorState()
              : _buildContent(),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: AppTheme.errorColor),
          const SizedBox(height: 16),
          Text(AppLocalizations.of(context)!.statsLoadError),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: _loadStats,
            child: Text(AppLocalizations.of(context)!.tryAgain),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    final l10n = AppLocalizations.of(context)!;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Score Card
          _buildScoreCard(),
          const SizedBox(height: 24),

          // Summary Grid
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.5,
            children: [
              _buildSummaryItem(
                l10n.totalProducts,
                '${_stats!.totalItems}',
                Icons.inventory_2_rounded,
                Colors.blue,
              ),
              _buildSummaryItem(
                l10n.expiringSoonLabel,
                '${_stats!.expiringSoon}',
                Icons.timer_rounded,
                Colors.orange,
              ),
              _buildSummaryItem(
                l10n.expiredLabel,
                '${_stats!.expired}',
                Icons.warning_rounded,
                Colors.red,
              ),
              _buildSummaryItem(
                l10n.categoriesLabel,
                '${_stats!.categoryDistribution.length}',
                Icons.category_rounded,
                Colors.purple,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Category Distribution
          Text(
            l10n.categoryDistribution,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildCategoryList(),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms);
  }

  Widget _buildScoreCard() {
    final l10n = AppLocalizations.of(context)!;
    final score = _stats!.wastePreventionScore;
    Color scoreColor = Colors.green;
    String message = l10n.scoreGreat;

    if (score < 50) {
      scoreColor = Colors.red;
      message = l10n.scoreWarning;
    } else if (score < 80) {
      scoreColor = Colors.orange;
      message = l10n.scoreBetter;
    }

    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            l10n.wastePreventionScore,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 16),
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 120,
                height: 120,
                child: CircularProgressIndicator(
                  value: score / 100,
                  strokeWidth: 12,
                  backgroundColor: scoreColor.withOpacity(0.1),
                  color: scoreColor,
                ),
              ),
              Text(
                '${score.toInt()}',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: scoreColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: scoreColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            l10n.wastePreventionSubtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryItem(
      String label, String value, IconData icon, Color color) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryList() {
    final l10n = AppLocalizations.of(context)!;
    final dist = _stats!.categoryDistribution;
    if (dist.isEmpty) return Center(child: Text(l10n.noData));

    return Column(
      children: dist.entries.map((entry) {
        final percentage = entry.value / _stats!.totalItems;
        final categoryKey = entry.key;
        final localizedName =
            PantryItem.localizedCategoryNameStatic(categoryKey, l10n);
        final emoji = PantryItem.categoryEmojiStatic(categoryKey);

        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(emoji),
                      const SizedBox(width: 8),
                      Text(localizedName.toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.w500)),
                    ],
                  ),
                  Text(l10n.productsCount(entry.value)),
                ],
              ),
              const SizedBox(height: 4),
              LinearProgressIndicator(
                value: percentage,
                backgroundColor: Colors.grey[800],
                color: AppTheme.primaryColor,
                borderRadius: BorderRadius.circular(4),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

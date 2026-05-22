import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../services/iap_service.dart';
import '../widgets/app_snackbar.dart';
import '../widgets/glass_card.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';

class SubscriptionManagementScreen extends StatelessWidget {
  const SubscriptionManagementScreen({super.key});

  String _restoreLabel(Locale locale) {
    switch (locale.languageCode) {
      case 'tr':
        return 'Satın Alımları Geri Yükle';
      case 'de':
        return 'Käufe Wiederherstellen';
      case 'es':
        return 'Restaurar Compras';
      case 'fr':
        return 'Restaurer les achats';
      case 'it':
        return 'Ripristina acquisti';
      default:
        return 'Restore Purchases';
    }
  }

  String _restoreDescription(Locale locale) {
    switch (locale.languageCode) {
      case 'tr':
        return 'Bu cihazdaki App Store veya Google Play hesabınızda aktif bir abonelik varsa hesabınıza tekrar bağlanır.';
      case 'de':
        return 'Wenn auf diesem App Store- oder Google Play-Konto ein aktives Abo vorhanden ist, wird es erneut mit Ihrem Konto verknüpft.';
      case 'es':
        return 'Si hay una suscripción activa en esta cuenta de App Store o Google Play, se volverá a vincular con tu cuenta.';
      case 'fr':
        return 'Si un abonnement actif existe sur ce compte App Store ou Google Play, il sera reconnecté à votre compte.';
      case 'it':
        return 'Se su questo account App Store o Google Play esiste un abbonamento attivo, verrà nuovamente collegato al tuo account.';
      default:
        return 'If there is an active subscription on this App Store or Google Play account, it will be linked to your account again.';
    }
  }

  String _restoreStartedMessage(Locale locale) {
    switch (locale.languageCode) {
      case 'tr':
        return 'Geri yükleme başlatıldı. Aktif aboneliğiniz varsa kısa süre içinde hesabınıza yansır.';
      case 'de':
        return 'Wiederherstellung gestartet. Wenn Sie ein aktives Abo haben, wird es in Kürze mit Ihrem Konto synchronisiert.';
      case 'es':
        return 'La restauración se inició. Si tienes una suscripción activa, se sincronizará con tu cuenta en breve.';
      case 'fr':
        return 'La restauration a démarré. Si vous avez un abonnement actif, il sera synchronisé avec votre compte sous peu.';
      case 'it':
        return 'Ripristino avviato. Se hai un abbonamento attivo, verrà sincronizzato con il tuo account a breve.';
      default:
        return 'Restore started. If you have an active subscription, it will sync to your account shortly.';
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    final currentTier = user?.subscriptionTier ?? 'free';
    final locale = Localizations.localeOf(context);

    // Determine color based on tier
    Color tierColor = AppTheme.primaryColor;
    if (currentTier == 'plus') {
      tierColor = const Color(0xFF4CAF50);
    } else if (currentTier == 'premium') {
      tierColor = const Color(0xFF9C27B0);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.manageSubscriptionTitle,
            style: const TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Status Card
            GlassCard(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: tierColor.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.verified_rounded,
                        color: tierColor, size: 48),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    l10n.subYourPlan(currentTier.toUpperCase()),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.green.withOpacity(0.5)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.check_circle,
                            color: Colors.green, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          l10n.activeStatus,
                          style: const TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Divider(),
                  const SizedBox(height: 24),
                  _buildInfoRow(l10n.startDate, _formatDate(user?.createdAt)),
                  const SizedBox(height: 16),
                  _buildInfoRow(l10n.statusLabel, l10n.autoRenews),
                  const SizedBox(height: 16),
                  _buildInfoRow(l10n.platformLabel, 'Google Play / App Store'),
                ],
              ),
            ).animate().slideY(begin: 0.1, end: 0, duration: 500.ms).fadeIn(),

            const SizedBox(height: 32),

            // Actions
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: () {
                  iapService.openSubscriptionManagement();
                },
                icon: const Icon(Icons.edit, color: Colors.white),
                label: Text(
                  l10n.changePlan,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: tierColor,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                  shadowColor: tierColor.withOpacity(0.5),
                  elevation: 4,
                ),
              ),
            ).animate().fadeIn(delay: 200.ms),

            const SizedBox(height: 16),

            Text(
              l10n.changePlanDescription,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ).animate().fadeIn(delay: 400.ms),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await iapService.restorePurchases();
                  if (context.mounted) {
                    if (iapService.error != null) {
                      AppSnackBar.error(context, iapService.error!);
                    } else {
                      AppSnackBar.info(
                        context,
                        _restoreStartedMessage(locale),
                      );
                    }
                  }
                },
                icon: const Icon(Icons.restore_rounded),
                label: Text(
                  _restoreLabel(locale),
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: tierColor.withOpacity(0.45)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ).animate().fadeIn(delay: 500.ms),

            const SizedBox(height: 12),

            Text(
              _restoreDescription(locale),
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ).animate().fadeIn(delay: 550.ms),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.grey, fontSize: 15),
        ),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        ),
      ],
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '-';
    return "${date.day}/${date.month}/${date.year}";
  }
}

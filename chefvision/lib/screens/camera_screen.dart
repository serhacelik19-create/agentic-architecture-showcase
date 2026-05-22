import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../providers/app_provider.dart';
import '../services/api_service.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../providers/guest_provider.dart';
import '../widgets/feature_locked_modal.dart';
import 'ingredients_screen.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  XFile? _imageFile;
  bool _isAnalyzing = false;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          _imageFile = pickedFile;
        });
      }
      // Note: If pickedFile is null, the user likely just cancelled the picker.
      // We don't necessarily want to show an error for a basic cancellation,
      // but if the UI felt "frozen", it's usually because it took a second to close.
    } catch (e) {
      final errorStr = e.toString().toLowerCase();
      if (errorStr.contains('permission') ||
          errorStr.contains('denied') ||
          errorStr.contains('access')) {
        _showError(
            "Kamera veya Galeri iznine erişilemedi. Lütfen ayarlardan izin verin.");
      } else {
        _showError(AppLocalizations.of(context)!
            .imageCouldNotBeSelected(e.toString()));
      }
    }
  }

  Future<void> _analyzeImage() async {
    if (_imageFile == null) return;

    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    if (guestProvider.isGuest) {
      if (!guestProvider.canScan) {
        _showGuestUpgradeDialog();
        return;
      }
    }

    setState(() => _isAnalyzing = true);

    try {
      final ingredients = await apiService.analyzeImage(_imageFile!);

      if (mounted) {
        final provider = Provider.of<AppProvider>(context, listen: false);
        provider.setDetectedIngredients(ingredients);

        // Consume a scan for a guest only on success
        if (guestProvider.isGuest) {
          await guestProvider.consumeScan();
        }

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const IngredientsScreen()),
        );
      }
    } catch (e) {
      _showError(e.toString());
    } finally {
      if (mounted) {
        setState(() => _isAnalyzing = false);
      }
    }
  }

  void _showError(String message) {
    AppSnackBar.error(context, message);
  }

  void _showGuestUpgradeDialog() {
    FeatureLockedModal.show(
      context,
      title:
          "Ücretsiz Tarama Hakkınız Doldu", // Fallback, normally localization
      message:
          "Misafir olarak kullanabileceğiniz 2 ücretsiz kamera tarama hakkınızı kullandınız. Sınırsız tarama ve tarifler için ücretsiz hesabınızı oluşturun!",
      icon: '📸',
      tierRequired: 'free', // Requires an account, not explicitly 'pro'
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(AppLocalizations.of(context)!.scanIngredientTitle),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              Expanded(
                child: _imageFile == null
                    ? _buildImagePickerOptions()
                    : _buildImagePreview(),
              ),
              const SizedBox(height: 20),
              if (_imageFile != null) ...[
                GradientButton(
                  text: AppLocalizations.of(context)!.analyzeIngredients,
                  icon: Icons.auto_awesome,
                  isLoading: _isAnalyzing,
                  onPressed: _analyzeImage,
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => setState(() => _imageFile = null),
                  child: Text(
                    AppLocalizations.of(context)!.selectDifferentPhoto,
                    style: TextStyle(
                        color: Theme.of(context).textTheme.bodySmall?.color),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImagePickerOptions() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          '📸',
          style: TextStyle(fontSize: 80),
        ).animate().scale(duration: 400.ms, curve: Curves.elasticOut),
        const SizedBox(height: 24),
        Text(
          AppLocalizations.of(context)!.uploadIngredients,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          AppLocalizations.of(context)!.aiWillRecognize,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 40),
        Row(
          children: [
            Expanded(
              child: _OptionCard(
                icon: Icons.camera_alt_rounded,
                title: AppLocalizations.of(context)!.cameraLabel,
                subtitle: AppLocalizations.of(context)!.takePhotoAction,
                color: AppTheme.primaryColor,
                onTap: () => _pickImage(ImageSource.camera),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _OptionCard(
                icon: Icons.photo_library_rounded,
                title: AppLocalizations.of(context)!.galleryLabel,
                subtitle: AppLocalizations.of(context)!.selectPhoto,
                color: AppTheme.accentColor,
                onTap: () => _pickImage(ImageSource.gallery),
              ),
            ),
          ],
        ).animate().fadeIn(delay: 100.ms, duration: 300.ms),
        const SizedBox(height: 40),
        GlassCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.warningColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text('💡', style: TextStyle(fontSize: 24)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  AppLocalizations.of(context)!.ensureVisible,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ),
        ).animate().fadeIn(delay: 200.ms, duration: 300.ms),
      ],
    );
  }

  Widget _buildImagePreview() {
    return Column(
      children: [
        Expanded(
          child: GlassCard(
            padding: EdgeInsets.zero,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  kIsWeb
                      ? Image.network(
                          _imageFile!.path,
                          fit: BoxFit.cover,
                        )
                      : Image.file(
                          File(_imageFile!.path),
                          fit: BoxFit.cover,
                        ),
                  if (_isAnalyzing)
                    Container(
                      color: Colors.black54,
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Theme.of(context).cardTheme.color,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Column(
                                children: [
                                  const SizedBox(
                                    width: 50,
                                    height: 50,
                                    child: CircularProgressIndicator(
                                      color: AppTheme.primaryColor,
                                      strokeWidth: 3,
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                  Text(
                                    AppLocalizations.of(context)!.aiAnalyzing,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge
                                        ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                        ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    AppLocalizations.of(context)!
                                        .identifyingIngredients,
                                    style:
                                        Theme.of(context).textTheme.bodySmall,
                                  ),
                                ],
                              ),
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
              .fadeIn(duration: 300.ms)
              .scale(begin: const Offset(0.95, 0.95)),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle,
                color: AppTheme.successColor, size: 20),
            const SizedBox(width: 8),
            Text(
              AppLocalizations.of(context)!.photoReady,
              style: const TextStyle(
                color: AppTheme.successColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _OptionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _OptionCard({
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
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}

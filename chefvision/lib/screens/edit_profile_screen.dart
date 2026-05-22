import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import 'dart:io';
import '../providers/auth_provider.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _nameController = TextEditingController();
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  File? _imageFile;
  final _picker = ImagePicker();
  bool _isPasswordSectionExpanded = false;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
    }
  }

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.editProfileTitle),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            _buildPhotoSection(user?.avatarUrl),
            const SizedBox(height: 32),
            _buildInfoSection(authProvider, l10n),
            const SizedBox(height: 24),
            _buildEmailSection(authProvider, user?.email, l10n),
            const SizedBox(height: 24),
            _buildPasswordSection(authProvider, l10n),
            const SizedBox(height: 40),
            if (authProvider.isLoading)
              const CircularProgressIndicator()
            else ...[
              GradientButton(
                text: l10n.saveChanges,
                onPressed: () async {
                  final success = await authProvider.updateProfile(
                    name: _nameController.text,
                    avatarUrl: _imageFile?.path, // Simulated upload
                  );
                  if (success && mounted) {
                    AppSnackBar.success(this.context, l10n.profileUpdated);
                    Navigator.pop(this.context);
                  }
                },
              ),
              const SizedBox(height: 32),
              _buildDeleteAccountSection(authProvider, l10n),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDeleteAccountSection(
      AuthProvider authProvider, AppLocalizations l10n) {
    return Column(
      children: [
        const Divider(),
        const SizedBox(height: 16),
        TextButton.icon(
          onPressed: () =>
              _showDeleteAccountDialog(context, authProvider, l10n),
          icon: const Icon(Icons.delete_forever, color: Colors.red),
          label: Text(
            l10n.deleteAccount,
            style: const TextStyle(
              color: Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          style: TextButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: Colors.red, width: 1),
            ),
          ),
        ),
      ],
    );
  }

  void _showDeleteAccountDialog(
      BuildContext context, AuthProvider authProvider, AppLocalizations l10n) {
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
                AppSnackBar.error(context, "Lütfen şifrenizi girin.");
                return;
              }

              Navigator.pop(ctx); // Close dialog

              final success =
                  await authProvider.deleteAccount(passwordController.text);

              if (mounted) {
                if (success) {
                  AppSnackBar.success(context, l10n.deleteAccountSuccess);
                  // AuthProvider will automatically trigger UI update and land on auth screen
                } else {
                  AppSnackBar.error(
                      context, authProvider.error ?? 'Hata oluştu');
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

  Widget _buildPhotoSection(String? currentAvatar) {
    return Center(
      child: Stack(
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.primaryColor, width: 3),
              image: _imageFile != null
                  ? DecorationImage(
                      image: FileImage(_imageFile!), fit: BoxFit.cover)
                  : (currentAvatar != null
                      ? DecorationImage(
                          image: NetworkImage(currentAvatar), fit: BoxFit.cover)
                      : null),
            ),
            child: _imageFile == null && currentAvatar == null
                ? const Icon(Icons.person, size: 60, color: Colors.grey)
                : null,
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: GestureDetector(
              onTap: _pickImage,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppTheme.primaryColor,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.camera_alt_rounded,
                    color: Colors.white, size: 20),
              ),
            ),
          ),
        ],
      ).animate().scale(duration: 500.ms, curve: Curves.easeOutBack),
    );
  }

  Widget _buildInfoSection(AuthProvider authProvider, AppLocalizations l10n) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            l10n.personalInfo,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: _nameController,
            decoration: InputDecoration(
              labelText: l10n.fullName,
              prefixIcon: const Icon(Icons.person_outline),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordSection(
      AuthProvider authProvider, AppLocalizations l10n) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                l10n.changePassword,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              IconButton(
                onPressed: () => setState(() =>
                    _isPasswordSectionExpanded = !_isPasswordSectionExpanded),
                icon: Icon(_isPasswordSectionExpanded
                    ? Icons.keyboard_arrow_up
                    : Icons.keyboard_arrow_down),
              ),
            ],
          ),
          if (_isPasswordSectionExpanded) ...[
            const SizedBox(height: 20),
            TextField(
              controller: _oldPasswordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: l10n.currentPassword,
                prefixIcon: const Icon(Icons.lock_outline),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _newPasswordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: l10n.newPassword,
                prefixIcon: const Icon(Icons.vpn_key_outlined),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _confirmPasswordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: l10n.confirmNewPassword,
                prefixIcon: const Icon(Icons.vpn_key_outlined),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 20),
            OutlinedButton(
              onPressed: () async {
                if (_newPasswordController.text !=
                    _confirmPasswordController.text) {
                  AppSnackBar.error(context, l10n.passwordMismatch);
                  return;
                }
                final success = await authProvider.changePassword(
                  _oldPasswordController.text,
                  _newPasswordController.text,
                );
                if (success && mounted) {
                  AppSnackBar.success(context, l10n.passwordUpdated);
                  setState(() {
                    _oldPasswordController.clear();
                    _newPasswordController.clear();
                    _confirmPasswordController.clear();
                    _isPasswordSectionExpanded = false;
                  });
                }
              },
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(l10n.updatePassword),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEmailSection(
      AuthProvider authProvider, String? currentEmail, AppLocalizations l10n) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                l10n.emailAddress,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              IconButton(
                onPressed: () =>
                    _showChangeEmailDialog(context, authProvider, l10n),
                icon: const Icon(Icons.edit, color: AppTheme.primaryColor),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            currentEmail ?? '',
            style: const TextStyle(fontSize: 16, color: Colors.black87),
          ),
        ],
      ),
    );
  }

  void _showChangeEmailDialog(
      BuildContext context, AuthProvider authProvider, AppLocalizations l10n) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(l10n.changeEmail),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              l10n.changeEmailDescription,
              style: const TextStyle(fontSize: 13, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: l10n.currentPassword,
                prefixIcon: const Icon(Icons.lock_outline),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: emailController,
              decoration: InputDecoration(
                labelText: l10n.newEmail,
                prefixIcon: const Icon(Icons.email_outlined),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(l10n.cancel),
          ),
          ElevatedButton(
            onPressed: () async {
              if (passwordController.text.isEmpty ||
                  emailController.text.isEmpty) {
                return;
              }

              Navigator.pop(ctx); // Close dialog

              // Call provider
              final success = await authProvider.changeEmail(
                passwordController.text,
                emailController.text,
              );

              if (mounted) {
                if (success) {
                  AppSnackBar.success(this.context, l10n.emailUpdated);
                } else {
                  AppSnackBar.error(this.context,
                      authProvider.error ?? l10n.emailUpdateFailed);
                }
              }
            },
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor),
            child:
                Text(l10n.update, style: const TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}

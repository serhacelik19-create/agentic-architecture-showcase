import 'package:flutter/material.dart';
import '../config/theme.dart';

enum SnackBarType { success, error, warning, info }

/// Modern, premium SnackBar helper.
/// Usage:
///   AppSnackBar.show(context, message: '...', type: SnackBarType.success);
class AppSnackBar {
  static void show(
    BuildContext context, {
    required String message,
    SnackBarType type = SnackBarType.info,
    Duration duration = const Duration(seconds: 3),
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();

    final config = _getConfig(type);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(config.icon, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  height: 1.3,
                ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        backgroundColor: config.color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        elevation: 8,
        duration: duration,
        dismissDirection: DismissDirection.horizontal,
        action: actionLabel != null
            ? SnackBarAction(
                label: actionLabel,
                textColor: Colors.white.withOpacity(0.9),
                onPressed: onAction ?? () {},
              )
            : null,
      ),
    );
  }

  /// Success notification
  static void success(BuildContext context, String message) {
    show(context, message: message, type: SnackBarType.success);
  }

  /// Error notification
  static void error(BuildContext context, String message) {
    show(
      context,
      message: message,
      type: SnackBarType.error,
      duration: const Duration(seconds: 4),
    );
  }

  /// Warning notification
  static void warning(BuildContext context, String message) {
    show(context, message: message, type: SnackBarType.warning);
  }

  /// Info notification
  static void info(BuildContext context, String message) {
    show(context, message: message, type: SnackBarType.info);
  }

  static _SnackBarConfig _getConfig(SnackBarType type) {
    switch (type) {
      case SnackBarType.success:
        return _SnackBarConfig(
          color: const Color(0xFF059669), // Emerald-600
          icon: Icons.check_circle_rounded,
        );
      case SnackBarType.error:
        return _SnackBarConfig(
          color: const Color(0xFFDC2626), // Red-600
          icon: Icons.error_rounded,
        );
      case SnackBarType.warning:
        return _SnackBarConfig(
          color: const Color(0xFFD97706), // Amber-600
          icon: Icons.warning_rounded,
        );
      case SnackBarType.info:
        return _SnackBarConfig(
          color: AppTheme.primaryColor,
          icon: Icons.info_rounded,
        );
    }
  }
}

class _SnackBarConfig {
  final Color color;
  final IconData icon;

  const _SnackBarConfig({required this.color, required this.icon});
}

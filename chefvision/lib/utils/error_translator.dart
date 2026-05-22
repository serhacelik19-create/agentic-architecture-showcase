import 'package:chefvision_app/l10n/app_localizations.dart';

class ErrorTranslator {
  static String translate(String key, AppLocalizations l10n) {
    switch (key) {
      case 'err_user_not_found':
        return l10n.err_user_not_found;
      case 'err_session_expired_other_device':
        return l10n.err_session_expired_other_device;
      case 'err_receipt_missing':
        return l10n.err_receipt_missing;
      case 'err_receipt_used_by_another_user':
        return l10n.err_receipt_used_by_another_user;
      case 'err_already_pro_other_platform':
        return l10n.err_already_pro_other_platform;
      case 'err_subscription_expired':
        return l10n.err_subscription_expired;
      case 'err_google_credentials_missing':
        return l10n.err_google_credentials_missing;
      case 'err_google_receipt_invalid':
        return l10n.err_google_receipt_invalid;
      case 'err_google_verification_failed':
        return l10n.err_google_verification_failed;
      case 'err_apple_receipt_failed':
        return l10n.err_apple_receipt_failed;
      case 'err_platform_not_supported':
        return l10n.err_platform_not_supported;
      case 'err_verification_service':
        return l10n.err_verification_service;
      case 'err_verification_failed':
        return l10n.err_verification_failed;
      case 'err_database_update':
        return l10n.err_database_update;
      case 'warning_subscription_active_delete':
        return l10n.warning_subscription_active_delete;
      case 'success_account_deleted':
        return l10n.success_account_deleted;
      default:
        // Attempt to return the key as is if not found
        return key;
    }
  }
}

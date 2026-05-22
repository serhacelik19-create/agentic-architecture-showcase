import 'package:flutter/material.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';

/// Maps error key identifiers from AppProvider to localized strings.
/// If the error is not a known key, returns the raw message as-is (for backend-localized messages).
String localizeError(BuildContext context, String errorKey) {
  final l10n = AppLocalizations.of(context)!;

  switch (errorKey) {
    case 'error_timeout':
      return l10n.errorTimeout;
    case 'error_connection':
      return l10n.errorConnection;
    case 'error_server':
      return l10n.errorServer;
    case 'error_limit':
      return l10n.errorLimitExceeded;
    case 'error_access_denied':
      return l10n.errorAccessDenied;
    case 'error_unknown':
      return l10n.errorUnknown;
    case 'error_no_ingredients':
      return l10n.errorNoIngredients;
    case 'err_usage_limit_reached':
      return l10n.err_usage_limit_reached;
    default:
      // Not a key — could be a backend message (already localized) or raw text
      return errorKey;
  }
}

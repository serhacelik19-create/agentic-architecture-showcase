import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/chat_screen.dart';

import 'package:chefvision_app/l10n/app_localizations.dart';

class RestrictedDialog extends StatelessWidget {
  const RestrictedDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return AlertDialog(
      title: Row(
        children: [
          const Icon(Icons.lock_outline, color: Colors.orange, size: 28),
          const SizedBox(width: 10),
          Text(l10n.restrictedAccessTitle),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            l10n.restrictedAccessMessage,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          Text(
            l10n.restrictedAccessDescription,
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text(l10n.close),
        ),
        ElevatedButton(
          onPressed: () {
            final user = Provider.of<AuthProvider>(context, listen: false).user;
            Navigator.of(context).pop();

            if (user != null) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ChatScreen(
                    userId: user.id.toString(),
                    topic: l10n.accountRestrictionTopic,
                  ),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.orange,
            foregroundColor: Colors.white,
          ),
          child: Text(l10n.getSupport),
        ),
      ],
    );
  }
}

import os

def replace_import(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace(
        "import 'package:flutter_gen/gen_l10n/app_localizations.dart';",
        "import 'package:chefvision_app/l10n/app_localizations.dart';"
    )

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('lib'):
    for file in files:
        if file.endswith('.dart'):
            replace_import(os.path.join(root, file))

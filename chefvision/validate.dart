import 'dart:convert';
import 'dart:io';

void main() {
  var dir = Directory('./lib/l10n');
  for (var file in dir.listSync()) {
    if (file.path.endsWith('.arb')) {
      try {
        jsonDecode(File(file.path).readAsStringSync());
        print('${file.path} is ok');
      } catch (e) {
        print('${file.path} ERROR: $e');
      }
    }
  }
}

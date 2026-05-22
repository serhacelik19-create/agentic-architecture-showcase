import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:yks/screens/library_screen.dart';
import 'package:yks/services/storage_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await StorageService.init();
  });

  testWidgets('renders empty library tabs without crashing', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: LibraryScreen(),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Kütüphanem'), findsOneWidget);
    expect(find.text('Notlarım'), findsOneWidget);
    expect(find.text('Favori Sorular'), findsOneWidget);
    expect(
      find.text(
        'Henüz hiç notun yok. Konu anlatımından not alabilirsin.',
      ),
      findsOneWidget,
    );

    await tester.tap(find.text('Favori Sorular'));
    await tester.pumpAndSettle();

    expect(find.text('Henüz hiç favori sorunun yok.'), findsOneWidget);
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:yks/screens/onboarding_screen.dart';
import 'package:yks/services/storage_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await StorageService.init();
  });

  testWidgets('completes onboarding and persists core settings', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        initialRoute: '/onboarding',
        routes: {
          '/': (_) => const Scaffold(body: Text('home')),
          '/onboarding': (_) => const OnboardingScreen(),
        },
      ),
    );

    await tester.tap(find.text('Sayısal'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Devam →'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextField).first,
      'Bogazici Bilgisayar',
    );
    await tester.tap(find.text('Devam →'));
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).first, '480');
    await tester.tap(find.text('Başlayalım! 🚀'));
    await tester.pumpAndSettle();

    final settings = StorageService.getUserSettings();

    expect(settings?['branch'], 'Sayısal');
    expect(settings?['goalUniversity'], 'Bogazici Bilgisayar');
    expect(settings?['goalScore'], '480');
  });
}

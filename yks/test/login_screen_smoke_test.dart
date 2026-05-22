import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yks/screens/login_screen.dart';

void main() {
  testWidgets('shows validation errors when login form is submitted empty', (
    tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: LoginScreen(),
      ),
    );
    await tester.pump(const Duration(seconds: 1));

    await tester.tap(find.text('Giriş Yap'));
    await tester.pump();

    expect(find.text('Kullanıcı adı gerekli'), findsOneWidget);
    expect(find.text('Şifre gerekli'), findsOneWidget);

    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pump(const Duration(seconds: 1));
  });
}

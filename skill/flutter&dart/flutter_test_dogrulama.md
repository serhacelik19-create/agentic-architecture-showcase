<!-- 
BU SKİLL DOSYASI: Flutter ve Dart projelerinde birim (unit) testleri ve arayüz (widget) testleri 
standartlarını kurmak, mocktail/mockito kullanarak servis bağımlılıklarını güvenli şekilde taklit etmek 
ve UI etkileşimlerini (tapping, entering text) doğrulayan test yapılarını kurala bağlamak amacıyla hazırlanmıştır.
-->

# Flutter Testing and Validation Rules

This guide defines strict rules for writing unit tests (logic, repositories, state management) and widget tests (UI components) in Dart/Flutter, using mocktail and flutter_test.

## The Rule

> [!IMPORTANT]
> **NEVER** let a test call real APIs or databases. Always mock external dependencies using `mocktail` or `mockito`. Verify the "unhappy path" (API errors, empty states) in addition to successful flows.

---

## 1. Unit Testing Business Logic & State Management

### The Problem
AI-generated unit tests often execute functions without mocking network classes, causing tests to fail due to internet connectivity drops or missing database connections.

### Correct Pattern (Mocking Repositories with Mocktail)
Use `mocktail` to mock classes and define stub returns via `when`.
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail';

// Class to mock
class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late MockUserRepository mockUserRepository;
  late UserService userService;

  setUp(() {
    mockUserRepository = MockUserRepository();
    userService = UserService(mockUserRepository);
  });

  group('UserService Tests', () {
    test('returns user name when call is successful', () async {
      final mockUser = User(id: '1', name: 'Serhat');
      
      // Stub the behavior
      when(() => mockUserRepository.getUser('1'))
          .thenAnswer((_) async => mockUser);

      final result = await userService.getUserName('1');

      expect(result, 'Serhat');
      verify(() => mockUserRepository.getUser('1')).called(1);
    });

    test('returns fallback value when API throws exception (Unhappy Path)', () async {
      // Stub exception
      when(() => mockUserRepository.getUser('1'))
          .thenThrow(Exception('API Connection Lost'));

      final result = await userService.getUserName('1');

      expect(result, 'Guest User');
    });
  });
}
```

---

## 2. Widget Testing (UI Components in Isolation)

### The Problem
Widget tests fail to render if they contain providers, themes, or navigations that are missing from the testing widget tree.

### Correct Pattern
Always wrap the target widget under test in `MaterialApp` and provide mocked state containers (like `ProviderScope` for Riverpod).
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail';

class MockCounterNotifier extends Mock implements CounterNotifier {}

void main() {
  testWidgets('Counter button tap increments display count', (WidgetTester tester) async {
    // 1. Build the widget tree in simulated environment
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CounterScreen(),
        ),
      ),
    );

    // 2. Assert initial UI state
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // 3. Perform user interaction
    await tester.tap(find.byType(FloatingActionButton));
    
    // 4. Re-render UI (pump frames)
    await tester.pump();

    // 5. Assert updated UI state
    expect(find.text('1'), findsOneWidget);
    expect(find.text('0'), findsNothing);
  });
}
```

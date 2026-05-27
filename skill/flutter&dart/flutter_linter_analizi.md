<!-- 
BU SKİLL DOSYASI: Flutter ve Dart projelerinde "flutter analyze" statik analiz aracından 
sıfır hata/uyarı ile geçmek, const widget optimizasyonlarını yapmak, doğru widget key yapısını 
(super.key) kurmak, kullanılmayan kod/import'ları temizlemek, zoraki tip dönüşümü (force casting - as) 
kaynaklı çalışma zamanı (runtime) çökmelerini engellemek ve canlı kodda hassas veri sızdıran print() yerine 
güvenli debugPrint() kullanımını zorunlu kılmak amacıyla hazırlanmıştır.
-->

# Flutter Linter and Static Analysis Rules

This guide defines strict rules for writing clean, optimized Dart code that conforms to standard analysis guidelines and passes `flutter analyze` without warnings or errors.

## The Rule

> [!IMPORTANT]
> **NO** code may be pushed or accepted if it produces warnings during static analysis. Every widget constructor should support constant definition (`super.key`) where possible, and unnecessary dynamic typing must be avoided.

---

## 1. Safe Type Casting (is vs as)

### The Problem
AI agents and developers frequently write force-casts (`data as Map<String, dynamic>`). If the server returns a different type (like a List or String due to an error payload), this throws a `TypeError` and crashes the app instantly at runtime.

### Incorrect Pattern
```dart
void _onDataReceived(dynamic response) {
  // CRITICAL ERROR: Crashes the app if response is not a Map
  final data = response as Map<String, dynamic>; 
  _updateUI(data['status']);
}
```

### Correct Pattern
Always verify types using pattern matching or the `is` check before casting.
```dart
void _onDataReceived(dynamic response) {
  // Safe type checking prevents runtime casting failures
  if (response is Map<String, dynamic>) {
    _updateUI(response['status']);
  } else {
    debugPrint('Unexpected response structure: $response');
  }
}
```

---

## 2. Production-Safe Logging

### The Problem
Using raw `print()` statements outputs logs in production (release) builds. Attackers can view these logs via console logs, potentially exposing API tokens, user data, or sensitive internal state.

### Incorrect Pattern
```dart
void _onLoginSuccess(UserSession session) {
  // CRITICAL ERROR: Exposes sensitive access token in production device logs
  print('User logged in. Token: ${session.accessToken}'); 
}
```

### Correct Pattern
Use `debugPrint()` (which is optimized and respects system constraints) or `log()` from `dart:developer` (which can be omitted in release builds).
```dart
import 'dart:developer' as developer;

void _onLoginSuccess(UserSession session) {
  // Safe logging that doesn't leak sensitive data in release builds
  developer.log(
    'User login event triggered',
    name: 'auth.navigation',
  );
  
  // Or use debugPrint for non-sensitive system messages (stripped/ignored in some setups)
  debugPrint('Auth transition complete');
}
```

---

## 3. Const Optimization (Widget Instantiation)

### The Problem
Failing to use `const` on widgets and layout structures causes the framework to re-create those widget instances on every single rebuild, degrading rendering performance.

### Incorrect Pattern
```dart
Widget build(BuildContext context) {
  return Column(
    children: [
      // CRITICAL WARNING: Missing const for static widget structures
      Padding(
        padding: EdgeInsets.all(8.0), 
        child: Text('Settings'), 
      ),
      const UserCard(),
    ],
  );
}
```

### Correct Pattern
Group static layouts under a single compile-time `const` declaration where possible.
```dart
Widget build(BuildContext context) {
  return const Column(
    children: [
      Padding(
        padding: EdgeInsets.all(8.0),
        child: Text('Settings'),
      ),
      UserCard(), // Included in the parent const group
    ],
  );
}
```

---

## 4. Widget Key and Constructor Structuring

### The Problem
Failing to provide keys for widgets causes the framework to lose track of widget state when the widget tree rearranges (e.g., in lists or conditional renders).

### Incorrect Pattern
```dart
class ProfileIcon extends StatelessWidget {
  final String imageUrl;

  // CRITICAL WARNING: Missing Key parameter in constructor
  ProfileIcon(this.imageUrl); 

  @override
  Widget build(BuildContext context) {
    return Image.network(imageUrl);
  }
}
```

### Correct Pattern
Always pass the nullable `Key? key` parameter down to the parent class via `super.key`.
```dart
class ProfileIcon extends StatelessWidget {
  // Always use super.key and place required fields first
  const ProfileIcon({
    required this.imageUrl,
    super.key,
  });

  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Image.network(imageUrl);
  }
}
```

---

## 5. Handling Unused Imports, Variables, and Parameters

### The Problem
Dead code, left-over imports, and unused variables clutter the codebase and cause lint failures in clean CI/CD pipelines.

### Incorrect Pattern
```dart
import 'dart:math'; // CRITICAL WARNING: Unused import

Widget build(BuildContext context) {
  // CRITICAL WARNING: Unused parameter 'details' in gesture callback
  return GestureDetector(
    onPanUpdate: (details) { 
      _incrementCounter();
    },
    child: const Text('Tap Me'),
  );
}
```

### Correct Pattern
Clean up unused imports immediately, and prefix unused callback parameters with an underscore (`_` or `__`) to tell the compiler the parameter is intentionally ignored.
```dart
Widget build(BuildContext context) {
  // Unused parameter renamed to underscore to pass lint check
  return GestureDetector(
    onPanUpdate: (_) {
      _incrementCounter();
    },
    child: const Text('Tap Me'),
  );
}
```

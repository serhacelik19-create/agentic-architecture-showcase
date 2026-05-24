<!-- 
BU SKİLL DOSYASI: Flutter ve Dart projelerinde SharedPreferences ve yerel depolama okuma/yazma 
işlemlerinde senkronizasyon (await) hatalarını önlemek, JSON dönüşümlerinde hata toleransı (try-catch, null safety) 
sağlamak, Riverpod ile başlangıç verilerini asenkron yüklemek ve ağ isteklerinde (Dio/Http) "Mutlu Yol" (Happy Path) 
eğilimini kırarak SocketException, TimeoutException gibi ağ kesintisi ve sunucu hatalarını yönetmek amacıyla hazırlanmıştır.
-->

# Flutter Async Operations and SharedPreferences Rules

This guide defines strict rules for handling local storage writes/reads, JSON deserialization, and asynchronous flow control in Dart/Flutter.

## The Rule

> [!IMPORTANT]
> **ALL** local storage writes must be awaited to guarantee persistence before continuing application flow. Reading data from local storage or remote sources must include fallback defaults and try-catch blocks to handle potential corruption or type mismatches safely.

---

## 1. Anti-Happy-Path Network Error Handling

### The Problem
AI-generated code frequently ignores connection timeouts, offline scenarios, or non-200 server response status codes, leading to infinite load states or app crashes under real-world network conditions.

### Incorrect Pattern
```dart
Future<UserData> fetchUser(String id) async {
  // CRITICAL ERROR: If user is offline, get() throws SocketException which crashes the app
  final response = await dio.get('/users/$id'); 
  
  // CRITICAL ERROR: Assumes response is always 200 OK and data structure is correct
  return UserData.fromJson(response.data); 
}
```

### Correct Pattern
Wrap network requests in explicit `try-catch` blocks capturing connection/timeout exceptions, set request timeouts, and verify response statuses.
```dart
Future<UserData?> fetchUser(String id) async {
  try {
    final response = await dio.get(
      '/users/$id',
      options: Options(
        sendTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 5),
      ),
    );

    if (response.statusCode == 200 && response.data != null) {
      return UserData.fromJson(response.data as Map<String, dynamic>);
    } else {
      debugPrint('Server returned error: ${response.statusCode}');
      return null;
    }
  } on DioException catch (e) {
    if (e.type == DioExceptionType.connectionTimeout) {
      debugPrint('Connection timed out');
    } else if (e.type == DioExceptionType.unknown && e.error is SocketException) {
      debugPrint('No internet connection');
    } else {
      debugPrint('API Error: ${e.message}');
    }
    return null; // Return null instead of letting the exception crash the UI
  } catch (e) {
    debugPrint('Unexpected error: $e');
    return null;
  }
}
```

---

## 2. SharedPreferences and Local Storage Writes

### The Problem
Failing to await a save operation (`setBool`, `setString`, etc.) can cause the application UI to reload with stale state if the user navigates away before the write completes.

### Incorrect Pattern
```dart
void _toggleNotifications(bool value) {
  final prefs = await SharedPreferences.getInstance();
  // CRITICAL ERROR: Execution continues before preferences are actually saved on disk
  prefs.setBool('notifications_enabled', value); 
  _updateUI(value);
}
```

### Correct Pattern
Always `await` the write execution and handle potential system failures.
```dart
Future<void> _toggleNotifications(bool value) async {
  try {
    final prefs = await SharedPreferences.getInstance();
    // Guarantee persistence before moving forward
    final success = await prefs.setBool('notifications_enabled', value);
    if (success) {
      _updateUI(value);
    }
  } catch (e) {
    debugPrint('Failed to save notification settings: $e');
  }
}
```

---

## 3. Safe Deserialization and Fallbacks

### The Problem
When loading data structures from local storage (typically stored as JSON strings), a corrupted string or modified model schema can crash the application during parsing.

### Incorrect Pattern
```dart
Future<UserModel> loadUser() async {
  final prefs = await SharedPreferences.getInstance();
  final jsonString = prefs.getString('user_profile')!; // CRITICAL ERROR: Risk of null-pointer
  return UserModel.fromJson(json.decode(jsonString));  // CRITICAL ERROR: Risk of parsing failure
}
```

### Correct Pattern
Always provide default fallbacks for null values and wrap JSON decoding in dynamic try-catch logic.
```dart
Future<UserModel?> loadUser() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString('user_profile');
    
    // Safely check if string exists
    if (jsonString == null || jsonString.isEmpty) {
      return null;
    }
    
    final Map<String, dynamic> jsonMap = json.decode(jsonString) as Map<String, dynamic>;
    return UserModel.fromJson(jsonMap);
  } catch (e) {
    debugPrint('Failed to deserialize user profile: $e');
    return null; // Return null or a sensible fallback model instead of crashing
  }
}
```

---

## 4. Start-up Storage Loading with Riverpod

### The Problem
Loading SharedPreferences synchronously or blocking widget rendering while waiting for initialization.

### Correct Pattern (FutureProvider)
Use asynchronous providers to manage startup load states dynamically in the UI.
```dart
final settingsProvider = FutureProvider<AppSettings>((ref) async {
  final prefs = await SharedPreferences.getInstance();
  final isDarkMode = prefs.getBool('dark_mode') ?? false;
  return AppSettings(isDarkMode: isDarkMode);
});

// Consumption in UI
class SettingsView extends ConsumerWidget {
  const SettingsView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settingsAsyncValue = ref.watch(settingsProvider);

    return settingsAsyncValue.when(
      data: (settings) => Switch(
        value: settings.isDarkMode,
        onChanged: (val) { /* Update state */ },
      ),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => Text('Error: $err'),
    );
  }
}
```

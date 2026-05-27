<!-- 
BU SKİLL DOSYASI: Flutter ve Dart projelerinde bellek sızıntılarını (memory leak) önlemek, 
controller'lar (TextEditing, Scroll, Stream vb.) ve StreamSubscription'lar için doğru dispose yaşam döngüsünü kurmak, 
asenkron işlemler sonrasında güvenli context (mounted check) kontrolleri uygulamak ve büyük listelerde 
ListView.builder kullanarak bellek şişmesini (jank) önlemek amacıyla hazırlanmıştır.
-->

# Flutter Memory Management and Resource Cleanup Rules

This guide defines strict rules for handling controllers, streams, focus nodes, subscriptions, and asynchronous contexts in Flutter to prevent memory leaks and resource exhaustion.

## The Rule

> [!IMPORTANT]
> **EVERY** controller, stream, focus node, timer, or subscription created within a class **MUST** be explicitly disposed of or cancelled when that class is destroyed. Furthermore, widget `BuildContext` must never be referenced across asynchronous gaps without verifying widget mount status.

---

## 1. Controller and Stream Subscription Lifecycle Management

### The Problem
Controllers and `StreamSubscription` objects left undisposed continue to consume memory and listen to system resources (like keyboard events or network streams) even after the screen is popped.

### Incorrect Pattern
```dart
class _ChatScreenState extends State<ChatScreen> {
  late final TextEditingController _messageController;
  late final StreamSubscription _messageSubscription;

  @override
  void initState() {
    super.initState();
    _messageController = TextEditingController();
    _messageSubscription = chatStream.listen((msg) => _onNewMessage(msg));
  }

  // CRITICAL ERROR: Message controller and subscription are never cleared when pop happens
}
```

### Correct Pattern (StatefulWidget)
```dart
class _ChatScreenState extends State<ChatScreen> {
  late final TextEditingController _messageController;
  late final StreamSubscription _messageSubscription;

  @override
  void initState() {
    super.initState();
    _messageController = TextEditingController();
    _messageSubscription = chatStream.listen((msg) => _onNewMessage(msg));
  }

  @override
  void dispose() {
    // ALWAYS dispose controllers and cancel subscriptions
    _messageController.dispose();
    _messageSubscription.cancel();
    super.dispose(); // ALWAYS call super.dispose() last
  }
}
```

---

## 2. Dynamic List Performance (ListView.builder)

### The Problem
AI agents often use the default `ListView(...)` constructor with mapped lists of dynamic lengths. This renders all items at once, causing memory spikes and framerate drops (jank) for long lists.

### Incorrect Pattern
```dart
Widget build(BuildContext context) {
  // CRITICAL ERROR: Renders all 1000 items in memory at once
  return ListView(
    children: items.map((item) => ItemCard(item: item)).toList(),
  );
}
```

### Correct Pattern
Always use `ListView.builder` or `GridView.builder` for dynamic or long lists.
```dart
Widget build(BuildContext context) {
  // Efficiently renders only the items visible on the screen
  return ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) {
      return ItemCard(item: items[index]);
    },
  );
}
```

---

## 3. Asynchronous Context (Mounted Check)

### The Problem
Using `BuildContext` (e.g., calling `Navigator.pop(context)` or `Theme.of(context)`) after an `await` without checking `mounted` can cause crashes and retain memory of deleted widgets.

### Incorrect Pattern
```dart
void _onSubmit() async {
  setState(() => _isLoading = true);
  await _apiService.submitData();
  
  // CRITICAL ERROR: Widget might have been unmounted during the API call
  setState(() => _isLoading = false); 
  Navigator.of(context).pop(); 
}
```

### Correct Pattern
Always check `context.mounted` or `mounted` before executing UI changes after an asynchronous gap.
```dart
void _onSubmit() async {
  setState(() => _isLoading = true);
  await _apiService.submitData();
  
  // Guard clause to prevent operations on unmounted state
  if (!mounted) return;

  setState(() => _isLoading = false);
  Navigator.of(context).pop();
}
```

---

## 4. Riverpod Provider Cleanup

### The Problem
Streams or persistent connections opened in a Provider that are never closed when the provider stops being watched.

### Correct Pattern (ref.onDispose)
Use `ref.onDispose` to clean up timers, stream controllers, or socket connections inside a provider.
```dart
final chatMessagesProvider = StreamProvider.autoDispose<List<Message>>((ref) {
  final socket = WebSocketConnection('ws://chat.example.com');
  
  // Clean up socket when provider is destroyed
  ref.onDispose(() {
    socket.close();
  });

  return socket.stream;
});
```

<!-- 
BU SKİLL DOSYASI: Flutter ve Dart projelerinde durum yönetimi (state management) ve 
widget başlatma (initialization) süreçlerinde karşılaşılan "setState() during build" gibi 
kritik framework hatalarını önlemek, build metotları içindeki sonsuz döngüleri engellemek 
ve kaldırılan (deprecated) eski API'lerin uydurulmasını (hallucination) önlemek amacıyla hazırlanmıştır.
-->

# Flutter State Management and Initialization Rules

This guide defines strict rules for managing widget initialization and state updates to prevent framework assertions, specifically the `setState() or markNeedsBuild() called during build` error.

## The Rule

> [!IMPORTANT]
> **NEVER** trigger a state update (via `setState`, Provider's `notifyListeners()`, or Riverpod's state modifiers) synchronously inside the `build` method, `initState()`, or during route transitions. Any state modification during these phases **must** be deferred to the next frame or microtask.

---

## 1. Widget Initialization & initState()

### The Problem
Calling initialization methods that modify state or notify listeners synchronously inside `initState()` will crash the application during the build cycle.

### Incorrect Pattern
```dart
@override
void initState() {
  super.initState();
  // CRITICAL ERROR: If _loadData notifies listeners, it triggers setState during build
  context.read<UserProvider>().loadUserData(); 
}
```

### Correct Patterns

#### Option A: Post-Frame Callback (Recommended for UI-bound effects)
Defers the execution until the current frame rendering is complete.
```dart
@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addPostFrameCallback((_) {
    context.read<UserProvider>().loadUserData();
  });
}
```

#### Option B: Future.microtask (Recommended for state-only updates)
Schedules the execution on the next microtask loop.
```dart
@override
void initState() {
  super.initState();
  Future.microtask(() {
    context.read<UserProvider>().loadUserData();
  });
}
```

---

## 2. No Async / State Triggers inside Build Methods

### The Problem
AI agents sometimes place asynchronous operations or data fetching directly in the `build()` method, causing infinite network loops and UI rebuilds.

### Incorrect Pattern
```dart
@override
Widget build(BuildContext context) {
  // CRITICAL ERROR: Fetching data triggers state update -> rebuilds UI -> fetches data again
  ref.read(dataProvider.notifier).fetchData(); 
  
  return const CircularProgressIndicator();
}
```

### Correct Pattern
Always trigger initial fetches in `initState()` (or via Riverpod's `ref.read` during initialization) and watch the resulting state in the build method.
```dart
@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addPostFrameCallback((_) {
    context.read<DataProvider>().fetchData();
  });
}

@override
Widget build(BuildContext context) {
  final state = context.watch<DataProvider>().state;
  return Text(state.data);
}
```

---

## 3. Deprecated API and Color Scheme Hallucinations

### The Problem
AI models frequently write deprecated themes and widget properties (like `accentColor` or `buttonColor`) which fail to compile in modern Flutter versions.

### Incorrect Pattern
```dart
Widget build(BuildContext context) {
  return Container(
    // CRITICAL ERROR: accentColor is deprecated and removed in modern Flutter versions
    color: Theme.of(context).accentColor, 
  );
}
```

### Correct Pattern
Always reference modern parameters from the current `ThemeData.colorScheme`.
```dart
Widget build(BuildContext context) {
  return Container(
    // Correct usage conforming to modern Flutter standards
    color: Theme.of(context).colorScheme.secondary, 
  );
}
```

---

## 4. Riverpod State Mutations

### The Problem
Updating a Riverpod provider's state inside the `build` method of a `ConsumerWidget` or `ref.listen` callback synchronously.

### Incorrect Pattern
```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  final count = ref.watch(counterProvider);
  if (count > 10) {
    // CRITICAL ERROR: Mutating state during the build phase
    ref.read(counterProvider.notifier).reset(); 
  }
  return Text('$count');
}
```

### Correct Pattern
Use `ref.listen` for side-effects, or wrap mutations in a post-frame callback if it must happen during a render condition.
```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  // Listen for changes and react safely
  ref.listen<int>(counterProvider, (previous, next) {
    if (next > 10) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(counterProvider.notifier).reset();
      });
    }
  });

  final count = ref.watch(counterProvider);
  return Text('$count');
}
```

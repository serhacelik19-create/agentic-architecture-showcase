<!-- 
BU SKİLL DOSYASI: React projelerinde state yönetimi ve bileşen yaşam döngüsü (lifecycle) 
süreçlerindeki hataları önlemek, useEffect içindeki bellek sızıntılarını ve yarış durumlarını (race conditions) 
engellemek, ve gereksiz yeniden çizim (rebuild/re-render) optimizasyonlarını kurala bağlamak amacıyla hazırlanmıştır.
-->

# React State, Lifecycle, and Side-Effect Rules

This guide defines strict rules for managing React state updates, side-effects via `useEffect`, and component render optimizations to prevent race conditions and performance degradation.

## The Rule

> [!IMPORTANT]
> **ALWAYS** cleanup asynchronous listeners, timers, or subscriptions inside `useEffect` return functions. Never leave dependency arrays empty `[]` if they reference variables inside the component scope, and avoid redundant state declarations.

---

## 1. Safe useEffect Subscriptions & Cleanup

### The Problem
AI agents frequently write `useEffect` listeners or subscriptions without returning a cleanup function. When components mount/unmount quickly, this causes memory leaks and updates state on unmounted components (race conditions).

### Incorrect Pattern
```tsx
useEffect(() => {
  // CRITICAL ERROR: Subscription is never cancelled on unmount
  chatService.subscribeToMessages((message) => {
    setMessages((prev) => [...prev, message]);
  });
}, []);
```

### Correct Pattern
Always return a cleanup function to unsubscribe or cancel pending network requests.
```tsx
useEffect(() => {
  const unsubscribe = chatService.subscribeToMessages((message) => {
    setMessages((prev) => [...prev, message]);
  });

  // Correct cleanup
  return () => {
    unsubscribe();
  };
}, []);
```

---

## 2. Stale Closures (Dependency Array Warnings)

### The Problem
Leaving out state variables or props from the `useEffect` dependency array leads to stale closures, where the effect executes with outdated variable references.

### Incorrect Pattern
```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    // CRITICAL ERROR: count is captured at 0 and never updates beyond 1
    console.log(`Current count is: ${count}`); 
  }, 1000);

  return () => clearInterval(interval);
}, []); // Warning: Missing dependency 'count'
```

### Correct Pattern
Add referenced variables to the dependency array, or use functional state updates if applicable.
```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    console.log(`Current count is: ${count}`);
  }, 1000);

  return () => clearInterval(interval);
}, [count]); // Correct: effect re-runs when count changes
```

---

## 3. Avoid Redundant States (Derived State Pattern)

### The Problem
Creating unnecessary states for values that can be derived directly from existing props or states during render time, leading to bloated code and synchronization bugs.

### Incorrect Pattern
```tsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState(''); // CRITICAL ERROR: Redundant state

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

### Correct Pattern
Calculate derived state on the fly during rendering. Use `useMemo` if the derivation is computationally expensive.
```tsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

// Correct: Derived state computed during render
const fullName = `${firstName} ${lastName}`;
```

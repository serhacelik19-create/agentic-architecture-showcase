<!-- 
BU SKİLL DOSYASI: Projelerde kullanılmayan gereksiz kodların (dead code), kullanılmayan içe aktarmaların (unused imports),
aktif akışta çağrılmayan ölü fonksiyonların ve üretim ortamına gitmemesi gereken debug loglarının (console.log vb.)
temizlenmesi, kod tabanının sade, kararlı ve yüksek performanslı tutulması amacıyla hazırlanmıştır.
-->

# Clean Code and Dead Code Elimination Rules

This guide defines strict rules for identifying, pruning, and safely removing unused code, dead imports, obsolete functions, and development logs to keep the codebase clean, stable, and highly performant.

## The Rule

> [!IMPORTANT]
> **NEVER** leave unused imports, unread variables, or obsolete functions inside the codebase under the assumption that they "might be needed later." Delete commented-out code blocks immediately; use Git history as your archive and backup system.

---

## 1. Eliminate Unused Imports & Declared Variables

### The Problem
Importing libraries that are never referenced or declaring variables that are never read increases the final JavaScript bundle size, pollutes compiler warnings, and clutters the scope.

### Incorrect Pattern
```typescript
import { useState, useEffect, useRef, useMemo } from 'react'; // ERROR: useRef is never used
import { handleFetchError } from '../utils/helpers'; // ERROR: Unused import

export default function UserWidget() {
  const [user, setUser] = useState(null);
  const tempId = 42; // ERROR: Declared but never read

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}
```

### Correct Pattern
Ensure all unused imports, destructured properties, and local variables are completely stripped from the file.
```typescript
import { useState, useEffect } from 'react';

export default function UserWidget() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}
```

---

## 2. Prune Dead Functions & Commented-Out Code Blocks

### The Problem
Commented-out code blocks or unreferenced helper functions left behind during refactoring create cognitive load for other developers, making code maintenance and readability difficult.

### Incorrect Pattern
```typescript
// LEGACY API CALL PATTERN (Deprecated in favor of fetchWithTimeout)
// async function oldFetchData() {
//   const res = await fetch('/api/old');
//   return res.json();
// }

export function activeDataFetcher() {
  // Active production logic...
}
```

### Correct Pattern
Delete deprecated or commented-out blocks immediately. Rely fully on Git version control if you ever need to retrieve historical structures.
```typescript
export function activeDataFetcher() {
  // Active production logic...
}
```

---

## 3. Clear Debugging Logs & Temporary Comments

### The Problem
Temporary `console.log`, `print`, or debug commands left inside source files clutter the user's browser console in production environments and can potentially leak sensitive application states or API structures.

### Correct Pattern
Strip away all debugging logs and transient notes (`// TODO: test this`) once features are verified and prior to merging pull requests. Use official logging frameworks if logs are required in production.

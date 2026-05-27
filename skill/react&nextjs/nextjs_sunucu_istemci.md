<!-- 
BU SKİLL DOSYASI: Next.js App Router projelerinde sunucu (Server) ve istemci (Client) bileşen 
sınırlarını doğru yönetmek, sunucu-istemci uyumsuzluğundan kaynaklanan "Hydration Mismatch" 
hatalarını engellemek ve hassas sunucu taraflı environment key'lerinin güvenliğini sağlamak amacıyla hazırlanmıştır.
-->

# Next.js Server & Client Component and Hydration Rules

This guide defines strict rules for handling Next.js App Router boundaries, preventing Hydration Errors, and managing secure Environment Variables.

## The Rule

> [!IMPORTANT]
> **NEVER** use browser-only APIs (`window`, `localStorage`) or unstable values (`new Date()`, `Math.random()`) directly in the render body of a component. Explicitly separate Client and Server component responsibilities, and ensure private environment variables are never exposed.

---

## 1. Hydration Mismatch Prevention (SSR Safe Window & Dates)

### The Problem
Using client-only or non-deterministic properties during render causes the HTML generated on the server to mismatch the HTML rendered in the browser on initial load, leading to React Hydration errors.

### Incorrect Pattern
```tsx
export default function DateHeader() {
  // CRITICAL ERROR: Local storage and Date.now() render differently on server vs client
  const theme = localStorage.getItem('theme') || 'light';
  const renderTime = new Date().toLocaleTimeString();

  return (
    <div>
      Theme: {theme} | Rendered at: {renderTime}
    </div>
  );
}
```

### Correct Pattern
Execute client-dependent or dynamic values inside a `useEffect` after mount, or render them only after verification.
```tsx
'use client';

import { useEffect, useState } from 'react';

export default function DateHeader() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [renderTime, setRenderTime] = useState('');

  useEffect(() => {
    setMounted(true);
    setTheme(localStorage.getItem('theme') || 'light');
    setRenderTime(new Date().toLocaleTimeString());
  }, []);

  // Return a shell skeleton on SSR server side
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Theme: {theme} | Rendered at: {renderTime}
    </div>
  );
}
```

---

## 2. Server vs. Client Component Boundaries

### The Problem
Attempting to import Node-specific libraries (like `fs`, database clients, or backend services) into client files, or placing React hooks (`useState`, `useEffect`) directly into server components.

### Incorrect Pattern (Server Component)
```tsx
// This is a Server Component by default in App Router
import { useState } from 'react'; // CRITICAL ERROR: Hooks cannot be used in Server Components

export default function Counter() {
  const [count, setCount] = useState(0); 
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Correct Pattern
Wrap interactive parts in a Client Component (using `'use client'`), and keep Server Components pure and logic-driven.
```tsx
'use client'; // Correctly declare as Client Component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 3. Environment Variable Security

### The Problem
Accidentally exposing secret private backend keys (e.g., Stripe Secret Key, Database credentials) to the client bundle by misnaming variables.

### Incorrect Pattern
```tsx
// CRITICAL SECURITY RISK: Any variable prefixed with NEXT_PUBLIC_ is compiled into the client bundle
const stripeClientKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY; // LEAKED SECRETS
```

### Correct Pattern
Keep private keys strictly server-side by omitting the prefix, and only prefix variables intended for public client consumption.
```tsx
// Safe Server Side Variable (accessible only in API routes/Server components)
const stripeSecret = process.env.STRIPE_SECRET_KEY; 

// Safe Client Side Variable (can be exposed safely)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

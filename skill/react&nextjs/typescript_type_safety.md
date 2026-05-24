<!-- 
BU SKİLL DOSYASI: TypeScript kullanan React ve Next.js projelerinde "any" tipinin gevşek 
kullanımını engellemek, güvenli olmayan zoraki tip dönüşümlerinin (as casting) önüne geçmek 
ve API'lerden dönen verilerin runtime tip güvenliğini sağlamak (Zod doğrulama şemaları) amacıyla hazırlanmıştır.
-->

# TypeScript Type Safety and Strict Rules

This guide defines strict rules for enforcing type safety, preventing generic bypasses (`any`), and ensuring runtime verification of data structures.

## The Rule

> [!IMPORTANT]
> **NEVER** use the `any` type. If a type is unknown or dynamic, use `unknown` combined with type narrowing, generics, or runtime validation libraries (e.g., Zod) instead of force-casting (`as`).

---

## 1. Eliminate any (Use unknown & Type Narrowing)

### The Problem
Using `any` turns off TypeScript compile-time checks, leading to runtime failures like "Cannot read properties of undefined".

### Incorrect Pattern
```typescript
// CRITICAL ERROR: any prevents TS from checking properties on data
function processResponse(data: any) {
  console.log(data.user.profile.name); 
}
```

### Correct Pattern
Use `unknown` and narrow down types safely, or define exact interfaces.
```typescript
interface UserProfile {
  name: string;
}

interface UserData {
  user: {
    profile: UserProfile;
  };
}

function processResponse(data: unknown) {
  // Use custom guard check or check types safely
  if (data && typeof data === 'object' && 'user' in data) {
    const castedData = data as UserData;
    console.log(castedData.user.profile.name);
  }
}
```

---

## 2. Safe Casting vs. Force Casting (as Casting)

### The Problem
Using `as` force-casts a variable to a specific type, convincing the compiler everything is fine even if the value is null or has a different structure at runtime.

### Incorrect Pattern
```typescript
// CRITICAL ERROR: If response is null or an error map, this line still passes but crashes later
const user = fetchResult as User;
console.log(user.email);
```

### Correct Pattern
Use custom type guard checkers or check conditions before performing operations.
```typescript
function isUser(value: any): value is User {
  return (
    value !== null &&
    typeof value === 'object' &&
    'email' in value &&
    typeof value.email === 'string'
  );
}

// Verification logic
if (isUser(fetchResult)) {
  console.log(fetchResult.email); // TS knows fetchResult is User
} else {
  console.error('Invalid user data received');
}
```

---

## 3. Runtime API Schema Validation (Zod)

### The Problem
AI-generated fetch scripts often assume the API response format is perfectly matched with frontend models, leading to crashes when APIs change schemas.

### Correct Pattern (Zod Integration)
Define schemas using Zod to parse and validate API responses on the fly.
```typescript
import { z } from 'zod';

// Define Zod runtime validation schema
const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  profile: z.object({
    name: z.string(),
    age: z.number().optional(),
  }),
});

type UserResponse = z.infer<typeof UserResponseSchema>;

async function fetchUser(userId: string): Promise<UserResponse | null> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const rawData = await response.json();

    // Safely parse and validate schema at runtime
    const parsedData = UserResponseSchema.safeParse(rawData);
    if (!parsedData.success) {
      console.error('API Schema mismatch:', parsedData.error.format());
      return null;
    }

    return parsedData.data; // Type-safe parsed data
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
```

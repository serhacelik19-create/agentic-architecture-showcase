<!-- 
BU SKİLL DOSYASI: React ve Next.js projelerinde asenkron veri çekme (data fetching) ve 
caching işlemlerinde "Mutlu Yol" (Happy Path) eğilimini aşmak, sunucu hata kodlarını ve ağ kesintilerini 
yönetmek, boş catch bloklarından (placeholder) kaçınmak ve iç içe asenkron beklemelerden kaynaklanan 
"Waterfall" istek yığılmalarını engellemek amacıyla hazırlanmıştır.
-->

# React Data Fetching and Caching Rules

This guide defines strict rules for handling client/server data fetching, managing API error states, and optimizing network requests using TanStack Query (React Query) or native fetch.

## The Rule

> [!IMPORTANT]
> **NEVER** write a data fetching request without implementing loading, error, and timeout boundaries. Avoid waterfall fetches in nested UI components, and never leave empty catch blocks or placeholder error suppressions.

---

## 1. Anti-Happy-Path Network Error Handling

### The Problem
AI-generated fetch scripts often ignore non-200 responses or timeout exceptions, causing applications to hang in permanent loading screens or break silently when APIs fail.

### Incorrect Pattern
```typescript
async function fetchRecipes() {
  // CRITICAL ERROR: If network is down, fetch throws error which crashes if not caught.
  // CRITICAL ERROR: Assumes response is always successful.
  const response = await fetch('/api/recipes');
  const data = await response.json();
  return data.recipes;
}
```

### Correct Pattern
Always set timeouts, check `response.ok`, and catch network-level exceptions cleanly.
```typescript
async function fetchRecipes(timeoutMs = 5000): Promise<Recipe[] | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('/api/recipes', { signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.recipes || [];
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Network failure:', error.message);
    }
    return null;
  }
}
```

---

## 2. Eliminate Waterfall Network Requests

### The Problem
Triggering consecutive awaited fetches inside nested components slows down rendering, as each child component waits for the parent's API request to finish before starting its own.

### Incorrect Pattern
```tsx
// Inside ParentComponent:
const user = await fetchUser(); // Takes 500ms
return <ChildComponent userId={user.id} />;

// Inside ChildComponent:
const posts = await fetchPosts(userId); // Takes 500ms (Total page load: 1000ms)
```

### Correct Pattern
Initiate requests in parallel, fetch data at the server root, or use prefetching patterns.
```tsx
// Parallel fetching model
const userPromise = fetchUser();
const postsPromise = fetchPosts();

// Wait for both requests to execute in parallel
const [user, posts] = await Promise.all([userPromise, postsPromise]);
```

---

## 3. Safe Data Fetching and Caching (TanStack Query)

### The Problem
Using raw `useEffect` fetches for global or shared state leads to duplicate requests, missing loading/error UI states, and complex manual cache invalidation code.

### Correct Pattern (TanStack Query / React Query)
Use query hooks to manage cache lifecycles, states, and error retries systematically.
```tsx
import { useQuery } from '@tanstack/react-query';

interface Recipe {
  id: string;
  name: string;
}

export function RecipeList() {
  const { data: recipes, isLoading, isError, error } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
      const response = await fetch('/api/recipes');
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return response.json();
    },
    retry: 2, // Automatically retry twice before displaying error UI
  });

  if (isLoading) return <div>Loading recipes...</div>;
  if (isError) return <div>Failed to load: {(error as Error).message}</div>;

  return (
    <ul>
      {recipes?.map((recipe) => (
        <li key={recipe.id}>{recipe.name}</li>
      ))}
    </ul>
  );
}
```

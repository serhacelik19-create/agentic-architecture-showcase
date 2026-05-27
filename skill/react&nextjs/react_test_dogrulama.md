<!-- 
BU SKİLL DOSYASI: React, Next.js ve TypeScript projelerinde bileşen (component) ve etkileşim 
testleri standartlarını kurmak, Jest ve React Testing Library kullanarak kullanıcı tıklamalarını ve girdi 
aksiyonlarını doğrulamak ve ağ (API) çağrılarını spy'lar veya mock modüllerle taklit etmek amacıyla hazırlanmıştır.
-->

# React Testing and Validation Rules

This guide defines strict rules for writing unit and component tests in React/Next.js using Jest and React Testing Library (RTL).

## The Rule

> [!IMPORTANT]
> **ALWAYS** mock global `fetch` or Axios calls during component testing to prevent network-level dependencies. Assert component renders, user interactions, and error display boundaries cleanly.

---

## 1. Component Rendering and Props Validation

### The Problem
AI-generated Jest tests frequently render components without providing required mock context (like Router, Theme, or Query Clients), causing Jest to crash during initialization.

### Correct Pattern
Render components in isolation and assert specific DOM nodes are present using `screen.getByText` or `screen.getByRole`.
```tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserBadge } from './UserBadge';

describe('UserBadge Component', () => {
  it('renders user details correctly', () => {
    const mockUser = { name: 'Serhat', role: 'Admin' };

    render(<UserBadge name={mockUser.name} role={mockUser.role} />);

    // Assert elements exist in document
    expect(screen.getByText('Serhat')).toBeInTheDocument();
    expect(screen.getByText('Role: Admin')).toBeInTheDocument();
  });
});
```

---

## 2. Interactive Testing & Simulating Actions

### The Problem
Simulating state modifications incorrectly without giving React time to flush updates or re-render (missing `await` or async wait states).

### Correct Pattern
Use `userEvent` (recommended over `fireEvent`) to simulate realistic browser behaviors.
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Interactivity', () => {
  it('increments counter when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole('button', { name: /increment/i });
    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    // Trigger user click action
    await user.click(button);

    // Verify UI state updates correctly
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

---

## 3. Mocking Global Fetch and API Calls (Unhappy Path)

### The Problem
Component calls external fetch endpoints inside `useEffect`, causing test execution to fail when running without server backends.

### Correct Pattern
Spy on the global fetch handler and stub the success or failure response.
```tsx
describe('RecipeList Fetching', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error boundary on API failure (Unhappy Path)', async () => {
    // Mock global fetch returning a 500 server error
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    render(<RecipeList />);

    // Wait for the component to resolve the promise and show error message
    const errorMessage = await screen.findByText(/failed to load/i);
    expect(errorMessage).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
```

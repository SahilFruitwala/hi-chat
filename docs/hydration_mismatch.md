# Hydration Mismatch: TanStack Start & LocalStorage

This document explains the hydration mismatch error encountered after implementing model selection persistence and how it was resolved in the TanStack Start (SSR) environment.

## The Issue

### Symptom
The application crashed or logged a heavy React error in the browser console:
```
Uncaught Error: Hydration failed because the server rendered text didn't match the client. 
...
<img alt="anthropic logo" ...>  (+ client)
<img alt="openai logo" ...>     (- server)
...
<span>Claude 4 Opus</span>       (+ client)
<span>GPT-4o</span>              (- server)
```

### Root Cause
The `ModelProvider` was initializing its `model` state directly from `localStorage` in the `useState` initializer:

```tsx
// ❌ Problematic code
const [model, setModel] = useState<string>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || models[0].id
  }
  return models[0].id // Server always returns this
})
```

1. **Server Rendering (SSR)**: Since `window` is undefined on the server, it always rendered the default model (`GPT-4o`).
2. **Client Hydration**: The browser has access to `localStorage`. If a user had previously selected `Claude 4 Opus`, the client-side React tree would immediately render with that value.
3. **Mismatch**: React's hydration process requires the **initial server-rendered HTML** to match the **first client-side render**. Because they differed, React failed to hydrate the tree correctly.

## The Solution: Two-Pass Rendering

To fix this, we must ensure the first render on the client is identical to the server's render, then update the state only after the component has mounted.

### Implementation

We updated `ModelProvider.tsx` (and `ThemeProvider.tsx`) to follow this pattern:

```tsx
// ✅ Correct approach for SSR
export function ModelProvider({ children }: { children: React.ReactNode }) {
  // 1. Always start with the default (matching the server render)
  const [model, setModel] = useState<string>(models[0].id)

  // 2. Load from localStorage only after the component has MOUNTED on the client
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && models.some((m) => m.id === saved)) {
      setModel(saved)
    }
  }, [])
  
  // ...
}
```

### Alternatives Considered
- **Cookies**: Using cookies instead of `localStorage` would allow the server to read the preference during the request and render the correct HTML immediately. This would eliminate the "flicker" that occurs when the state updates after mounting.
- **ClientOnly Component**: Wrapping the model-dependent UI in a `<ClientOnly>` component to skip SSR for that specific part.

## Key Learnings
- In TanStack Start (or any SSR framework), **never** access browser-only APIs (`window`, `localStorage`, `document`) during the initial state initialization or the render phase.
- Always use `useEffect` (or `useLayoutEffect`) to synchronize client-side state with the browser environment after the initial hydration is complete.

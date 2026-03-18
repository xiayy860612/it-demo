# Quickstart Guide: Todo App Core Functionality

**Feature**: 001-todo-app-core
**Date**: 2026-01-13
**Purpose**: Developer onboarding guide for implementing the todo application

## Overview

This guide helps developers quickly understand and implement the todo application. It covers setup, architecture, development workflow, and validation.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18.x or later (LTS version recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge - last 2 versions)
- Code editor with TypeScript support (VS Code recommended)

---

## Initial Setup

### 1. Create Vite + React + TypeScript Project

```bash
npm create vite@latest . -- --template react-ts
```

### 2. Install Dependencies

```bash
npm install
npm install canvas-confetti
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

### 3. Configure Development Tools

**ESLint Configuration** (`.eslintrc.cjs`):

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

**Prettier Configuration** (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Vitest Configuration** (`vitest.config.ts`):

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

### 4. Verify Setup

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run test         # Run tests (after adding tests)
npm run lint         # Run ESLint
```

---

## Project Structure

After setup, create the following structure:

```text
src/
├── components/
│   ├── TodoApp.tsx
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── TodoInput.tsx
│   └── CelebrationAnimation.tsx
├── hooks/
│   ├── useTodos.ts
│   └── useDebounce.ts
├── types/
│   └── todo.ts
├── utils/
│   └── storage.ts
└── App.tsx

tests/
├── setup.ts
├── integration/
│   ├── todo-workflow.test.tsx
│   └── localStorage.test.ts
└── unit/
    └── useTodos.test.ts
```

---

## Implementation Order

Follow this order to build incrementally and test at each step:

### Step 1: Type Definitions (5 minutes)

Create `src/types/todo.ts`:

```typescript
export interface TodoItem {
  id: string;
  description: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export type TodoList = TodoItem[];

export type TodoAction =
  | { type: 'ADD_TODO'; description: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'LOAD_TODOS'; todos: TodoList };
```

### Step 2: Storage Utility (10 minutes)

Create `src/utils/storage.ts` with `get`, `set`, `remove` functions that handle errors gracefully. See `contracts/component-api.md` for error handling requirements.

**Test**: Write `localStorage.test.ts` to verify error handling.

### Step 3: useTodos Hook (30 minutes)

Create `src/hooks/useTodos.ts` with reducer for ADD_TODO, TOGGLE_TODO, DELETE_TODO actions. Auto-sync to localStorage.

**Test**: Write `useTodos.test.ts` to verify state transitions and localStorage sync.

### Step 4: useDebounce Hook (10 minutes)

Create `src/hooks/useDebounce.ts` for debouncing rapid clicks (FR-013).

**Test**: Verify delay behavior with timer mocks.

### Step 5: TodoInput Component (20 minutes)

Create `src/components/TodoInput.tsx` with validation and error display.

**Test**: Verify validation rejects empty/whitespace input.

### Step 6: TodoList Component (15 minutes)

Create `src/components/TodoList.tsx` that renders todo items or empty state.

**Test**: Verify empty state displays correctly.

### Step 7: TodoItem Component (20 minutes)

Create `src/components/TodoItem.tsx` with toggle and delete buttons, accessible ARIA labels.

**Test**: Verify accessibility and keyboard navigation.

### Step 8: CelebrationAnimation Component (15 minutes)

Create `src/components/CelebrationAnimation.tsx` using canvas-confetti, respecting `prefers-reduced-motion`.

**Test**: Verify animation triggers and respects motion preferences.

### Step 9: TodoApp Component (15 minutes)

Create `src/components/TodoApp.tsx` that orchestrates all components using `useTodos` hook.

**Test**: Verify full integration.

### Step 10: Root Integration (5 minutes)

Update `src/App.tsx` to render `TodoApp`.

**Test**: Run full application and verify all workflows.

---

## Development Workflow

### Running the Application

```bash
npm run dev          # Development server with HMR
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
```

### Running Tests

```bash
npm run test         # Run all tests once
npm run test:watch   # Watch mode for development
npm run test:ui      # Vitest UI for debugging
```

### Code Quality

```bash
npm run lint         # Check ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

---

## Key Implementation Details

### ID Generation

Use timestamp + random suffix for unique IDs:

```typescript
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
```

### Order Management

Increment `order` for each new todo:

```typescript
const newOrder = Math.max(...todos.map(t => t.order), -1) + 1;
```

### Debouncing

Prevent rapid duplicate clicks:

```typescript
const [isCompleting, setIsCompleting] = useState(false);
const debouncedIsCompleting = useDebounce(isCompleting, 300);

if (debouncedIsCompleting) {
  // Allow completion
}
```

### Accessibility Checklist

- [ ] All buttons have `aria-label` if icon-only
- [ ] Toggle button has `aria-pressed`
- [ ] Input has associated `<label>`
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Color contrast meets WCAG AA (4.5:1 for text)

---

## Validation Steps

After implementation, validate against success criteria:

### Performance Validation

- [ ] **SC-001**: Add todo in under 5 seconds (use browser DevTools Network throttling)
- [ ] **SC-003**: Animation completes in <2 seconds (verify with `Date.now()`)
- [ ] **SC-005**: Add 1000 todos and verify scroll performance (use script to generate)

### Usability Validation

- [ ] **SC-002**: Single click/tap to complete todo
- [ ] **SC-004**: Test with 5 users - can they add first todo without instructions?
- [ ] **SC-006**: Single click/tap to delete todo
- [ ] **SC-007**: User testing confirms celebration feels positive

### Functional Validation

- [ ] All user stories pass acceptance scenarios
- [ ] All edge cases handled (see `spec.md` edge cases section)
- [ ] localStorage persistence works across page reloads
- [ ] Application works offline after initial load
- [ ] Responsive on mobile devices

### Accessibility Validation

- [ ] Run Lighthouse audit (target: 90+ accessibility score)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Test keyboard-only navigation
- [ ] Verify color contrast with Chrome DevTools

---

## Troubleshooting

### Common Issues

**Issue**: localStorage not persisting
- **Cause**: Private browsing mode or cookies disabled
- **Solution**: Utility should fall back to in-memory storage

**Issue**: Animation not triggering
- **Cause**: `trigger` prop not changing from false→true
- **Solution**: Use `useEffect` with `trigger` dependency

**Issue**: Tests failing with "not wrapped in act()"
- **Cause**: State update not awaited in test
- **Solution**: Use `await waitFor()` or `act()` from React Testing Library

**Issue**: Type errors with canvas-confetti
- **Cause**: Missing @types package
- **Solution**: Install `@types/canvas-confetti` or use `// @ts-ignore`

---

## Resources

- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Vitest**: https://vitest.dev/
- **canvas-confetti**: https://github.com/catdad/canvas-confetti
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

---

## Next Steps

After completing implementation:

1. Run full test suite: `npm run test`
2. Build production bundle: `npm run build`
3. Check bundle size: `npm run build -- --report`
4. Run Lighthouse audit in Chrome DevTools
5. Deploy to hosting (Vercel, Netlify, or GitHub Pages)
6. Gather user feedback for iteration

For task breakdown, see `tasks.md` (generated by `/speckit.tasks` command).

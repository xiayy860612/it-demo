# Component API Contracts: Todo App Core Functionality

**Feature**: 001-todo-app-core
**Date**: 2026-01-13
**Purpose**: Define component interfaces and hooks API for the todo application

## Overview

This document defines the component interfaces and custom hooks API for the React todo application. Since this is a client-side only application with no backend, we define component contracts instead of REST/GraphQL API contracts.

---

## Custom Hooks API

### useTodos

Primary state management hook for todo operations.

#### Signature

```typescript
function useTodos(): {
  todos: TodoList;
  addTodo: (description: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  isLoaded: boolean;
  error: Error | null;
}
```

#### Contract

| Operation | Input | Output | Side Effects | Error Handling |
|-----------|-------|--------|--------------|----------------|
| `addTodo` | `description: string` (1-500 chars) | `void` | Creates new TodoItem, appends to list, saves to localStorage | Throws if validation fails, sets error state |
| `toggleTodo` | `id: string` | `void` | Flips `completed` boolean, updates localStorage | Throws if id not found, sets error state |
| `deleteTodo` | `id: string` | `void` | Removes item from list, updates localStorage | Throws if id not found, sets error state |

#### Validation Rules

- `description` must be 1-500 characters after trimming whitespace
- Empty or whitespace-only `description` throws `ValidationError`
- `id` must exist in todos list for `toggleTodo` and `deleteTodo`

#### Behavior

- Loads todos from localStorage on mount
- Auto-saves to localStorage on every state change
- Handles localStorage errors gracefully (falls back to memory)
- Debounces rapid calls to prevent race conditions (FR-013)

---

### useDebounce

Utility hook for debouncing rapid user interactions.

#### Signature

```typescript
function useDebounce<T>(value: T, delay: number): T
```

#### Contract

| Input | Output | Behavior |
|-------|--------|----------|
| `value: T` | Debounced value | Returns the value after `delay` ms of no changes |
| `delay: number` | (milliseconds) | Wait time before updating returned value |

#### Usage Example

```typescript
const debouncedIsCompleting = useDebounce(isCompleting, 300);
// Prevents rapid duplicate completion clicks
```

---

## Component APIs

### TodoApp

Root application component that orchestrates all todo functionality.

#### Props

```typescript
interface TodoAppProps {
  // No props - self-contained application
}
```

#### Contract

- Renders `TodoInput` and `TodoList` components
- Manages overall application state via `useTodos` hook
- Handles application-level errors
- Renders empty state message when no todos exist (FR-009)

---

### TodoInput

Input field and submit button for adding new todos.

#### Props

```typescript
interface TodoInputProps {
  onSubmit: (description: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

#### Contract

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(description: string) => void` | Yes | Called when user submits valid todo description |
| `disabled` | `boolean` | No | Disable input (e.g., during error state) |
| `placeholder` | `string` | No | Input placeholder text (default: "Add a new todo") |

#### Behavior

- Validates input on submit (1-500 chars, not whitespace-only)
- Calls `onSubmit` with trimmed description if valid
- Shows inline error if validation fails (FR-002)
- Clears input after successful submission
- Supports Enter key and button click to submit
- Accessible: associated `<label>`, keyboard navigable

#### Accessibility

- `<input>` has `id` and associated `<label via htmlFor`
- Submit button has `type="submit"`
- Form submission prevented on validation failure
- Error messages announced via `aria-live` or `role="alert"`

---

### TodoList

Container component that renders the list of todo items.

#### Props

```typescript
interface TodoListProps {
  todos: TodoList;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

#### Contract

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `todos` | `TodoList` | Yes | Array of todo items to display |
| `onToggle` | `(id: string) => void` | Yes | Called when user toggles completion status |
| `onDelete` | `(id: string) => void` | Yes | Called when user deletes a todo |

#### Behavior

- Renders empty state message if `todos.length === 0` (FR-009)
- Renders `<ul>` with `role="list"` containing `<TodoItem>` for each todo
- Maintains display order based on `todo.order` property
- Scrollable if list exceeds viewport height (FR-003)

#### Accessibility

- Uses semantic `<ul>` and `<li>` elements
- `role="list"` on `<ul>` for explicit semantics
- Empty state announced via `aria-live` region

---

### TodoItem

Individual todo item with completion toggle and delete button.

#### Props

```typescript
interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

#### Contract

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `todo` | `TodoItem` | Yes | Todo item data to display |
| `onToggle` | `(id: string) => void` | Yes | Called when toggle button clicked |
| `onDelete` | `(id: string) => void` | Yes | Called when delete button clicked |

#### Behavior

- Renders as `<li>` element
- Shows strikethrough or visual distinction when `todo.completed === true` (FR-005)
- Toggle button: checkbox or button with `aria-pressed` (FR-004)
- Delete button: icon button with `aria-label` (FR-007)
- Prevents duplicate clicks during animation (FR-013)

#### Accessibility

- `<li>` with semantic structure
- Toggle button has `aria-pressed={todo.completed}`
- Toggle button has `aria-label="Mark {description} as {in}complete"`
- Delete button has `aria-label="Delete todo: {todo.description}"`
- Visible focus indicators on all interactive elements

---

### CelebrationAnimation

Confetti animation component triggered on todo completion.

#### Props

```typescript
interface CelebrationAnimationProps {
  trigger: boolean;  // Trigger animation when true → false transition
  duration?: number; // Animation duration in ms (default: 2000 per SC-003)
}
```

#### Contract

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `trigger` | `boolean` | Yes | Fire animation on true→false transition |
| `duration` | `number` | No | Animation duration (default: 2000, max 2000 per SC-003) |

#### Behavior

- Triggers confetti animation when `trigger` changes from `false` to `true`
- Stops animation after `duration` milliseconds (max 2000 per SC-003)
- Does not block user interactions during animation
- Respects `prefers-reduced-motion` media query (accessibility)

#### Accessibility

- Checks `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Skips animation if user prefers reduced motion
- Animation is cosmetic, no critical information conveyed

---

## Data Transfer Contracts

### localStorage Schema

**Key**: `todo-app-todos`

**Format**: JSON string array of TodoItem

**Example**:

```json
[
  {
    "id": "1736759400000-abc123",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": 1736759400000,
    "order": 0
  }
]
```

**Error Handling**:

| Error | Handling |
|-------|----------|
| `SecurityError` | Private browsing mode - fall back to in-memory |
| `QuotaExceededError` | Storage full - show error to user, prevent adds |
| `SyntaxError` | Corrupted data - clear and start empty |

---

## TypeScript Type Exports

All types are exported from `src/types/todo.ts`:

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

export interface TodoState {
  todos: TodoList;
  isLoaded: boolean;
  error: Error | null;
}
```

---

## Integration Test Contracts

Integration tests should verify these end-to-end workflows:

1. **Add Todo Workflow**:
   - User types in `TodoInput`
   - User submits
   - `TodoList` updates with new item
   - localStorage persists new item
   - Empty state message disappears

2. **Complete Todo Workflow**:
   - User clicks toggle in `TodoItem`
   - Item visual state changes
   - `CelebrationAnimation` triggers
   - localStorage updates

3. **Delete Todo Workflow**:
   - User clicks delete in `TodoItem`
   - Item removed from `TodoList`
   - localStorage updates
   - Confirmation/feedback shown

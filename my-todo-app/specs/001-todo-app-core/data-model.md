# Data Model: Todo App Core Functionality

**Feature**: 001-todo-app-core
**Date**: 2026-01-13
**Purpose**: Define data structures and entities for the todo application

## Overview

This document defines the core data entities for the todo application. Since this is a client-side only application with localStorage persistence, the data model is intentionally simple and aligns with the "Simplicity & YAGNI" constitutional principle.

---

## Entity: TodoItem

Represents a single task in the todo list.

### Fields

| Field | Type | Description | Validation | Required |
|-------|------|-------------|------------|----------|
| `id` | `string` | Unique identifier for the todo item | UUID v4 or timestamp-based | Yes |
| `description` | `string` | The task description/text | 1-500 characters, not whitespace-only | Yes |
| `completed` | `boolean` | Completion status of the todo | `true` or `false` | Yes (default: `false`) |
| `createdAt` | `number` | Unix timestamp (milliseconds) when created | Positive integer | Yes |
| `order` | `number` | Display order in the list | Non-negative integer | Yes |

### TypeScript Interface

```typescript
interface TodoItem {
  id: string;
  description: string;
  completed: boolean;
  createdAt: number;
  order: number;
}
```

### Validation Rules

Per functional requirements:

- **FR-002**: `description` cannot be empty or whitespace-only
- **FR-010**: `description` maximum length is 500 characters
- **FR-011**: `description` supports special characters and emoji
- **FR-008**: `order` must be preserved to maintain todo sequence
- **FR-013**: Debounce rapid state changes to prevent race conditions

### State Transitions

```
[Active] ←→ [Completed]
  ↓           ↓
[Deleted]  [Deleted]
```

**Transitions**:
- **Active → Completed**: User marks todo as complete (FR-004)
- **Completed → Active**: User marks todo as incomplete (FR-004)
- **Active/Completed → Deleted**: User deletes todo (FR-007)

---

## Entity: TodoList

Represents the collection of all todo items.

### Structure

The `TodoList` is an array of `TodoItem` objects:

```typescript
type TodoList = TodoItem[];
```

### Invariants

1. **Unique IDs**: All `id` values in the list must be unique
2. **Unique Orders**: All `order` values must be unique (no duplicates)
3. **Sorted Order**: List should be sorted by `order` ascending for display
4. **Empty State**: List can be empty (display empty state message per FR-009)

### Storage Schema

**localStorage key**: `todo-app-todos`

**Stored format** (JSON string):

```json
[
  {
    "id": "1736759400000-abc123",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": 1736759400000,
    "order": 0
  },
  {
    "id": "1736759460000-def456",
    "description": "Write documentation",
    "completed": true,
    "createdAt": 1736759460000,
    "order": 1
  }
]
```

### Constraints

Per success criteria:

- **SC-005**: Application remains responsive with up to 1000 todo items
- localStorage has ~5MB limit, 1000 items ~100-200KB is well within limits
- No pagination or virtual scrolling needed for 1000 items

---

## Relationships

### Parent-Child

**None**: This is a single-user application with no nested entities per spec assumptions.

### Entity Relationships

```
TodoList (1) ─── contains ─── (0..1000) TodoItem
```

---

## State Management

### Reducer Actions

The `useTodos` hook manages state transitions via a reducer:

```typescript
type TodoAction =
  | { type: 'ADD_TODO'; description: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'LOAD_TODOS'; todos: TodoList }
  | { type: 'CLEAR_COMPLETED' };  // Optional future feature
```

### State Shape

```typescript
interface TodoState {
  todos: TodoList;
  isLoaded: boolean;
  error: Error | null;
}
```

---

## Derived Data

### Computed Properties

These are derived from `TodoList` but not stored:

- **Active count**: `todos.filter(t => !t.completed).length`
- **Completed count**: `todos.filter(t => t.completed).length`
- **Total count**: `todos.length`
- **Completion percentage**: `(completedCount / totalCount) * 100` (if totalCount > 0)

These computed properties can be used for UI display and statistics (optional future features).

---

## Edge Cases and Error Handling

### Edge Cases from Spec

Per the edge cases in the specification:

1. **Whitespace-only input**: Validation rejects before creating TodoItem (FR-002)
2. **Long descriptions (>500 chars)**: Validation rejects before creating TodoItem (FR-010)
3. **Rapid clicks**: Debouncing prevents duplicate state updates (FR-013)
4. **1000+ items**: List remains performant with virtual DOM (SC-005)
5. **Delete during animation**: Animation doesn't block deletion (SC-003)
6. **Special characters/emoji**: Stored as-is in UTF-8 JSON (FR-011)

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| localStorage unavailable | Fall back to in-memory storage, show warning |
| localStorage quota exceeded | Show error message, prevent adding new todos |
| JSON parse error | Clear corrupted data, start with empty list |
| Duplicate ID | Generate new ID automatically |

---

## Future Considerations

**Not implemented in MVP** (per YAGNI principle):

- Tags or categories
- Due dates or reminders
- Priority levels
- Nested subtasks
- Search/filtering
- Undo/redo history
- Multiple todo lists

These can be added later if user demand justifies the complexity.

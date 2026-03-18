# Tasks: Todo App Core Functionality

**Input**: Design documents from `/specs/001-todo-app-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL per the "Test When Valuable" constitutional principle. This task list includes test tasks but they can be skipped if you prefer to focus on implementation first.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow the project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Vite + React + TypeScript project per quickstart.md
- [X] T002 Install dependencies: React 18.x, React DOM, canvas-confetti, ESLint, Prettier
- [X] T003 [P] Install testing dependencies: Vitest, React Testing Library, @testing-library/user-event, @testing-library/jest-dom
- [X] T004 [P] Configure ESLint with React and TypeScript rules per constitution
- [X] T005 [P] Configure Prettier for consistent formatting per constitution
- [X] T006 [P] Configure Vitest with jsdom environment and setup file per quickstart.md
- [X] T007 Create project directory structure: src/components, src/hooks, src/types, src/utils, tests/integration, tests/unit
- [X] T008 [P] Create tests/setup.ts with React Testing Library configuration per quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Create TypeScript type definitions in src/types/todo.ts (TodoItem, TodoList, TodoAction, TodoState) per data-model.md
- [X] T010 Create localStorage wrapper utility in src/utils/storage.ts with get<T>, set<T>, remove functions and error handling per contracts/component-api.md
- [X] T011 Create useDebounce hook in src/hooks/useDebounce.ts for debouncing rapid interactions per contracts/component-api.md
- [X] T012 Create useTodos hook in src/hooks/useTodos.ts with reducer for ADD_TODO, TOGGLE_TODO, DELETE_TODO actions per contracts/component-api.md
- [X] T013 [P] Create src/App.tsx root component that renders TodoApp per plan.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Todo Items (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new todo items and view them in a list

**Independent Test**: Open application, add multiple todos, verify they appear in list. Empty state message shows when no todos exist.

### Tests for User Story 1 (OPTIONAL) ⚠️

> **NOTE: Tests are OPTIONAL per constitution. Write these FIRST if following TDD, or skip if focusing on implementation.**

- [ ] T014 [P] [US1] Integration test for add todo workflow in tests/integration/todo-workflow.test.tsx (user types, submits, list updates, empty state disappears)
- [ ] T015 [P] [US1] Unit test for useTodos hook addTodo function in tests/unit/useTodos.test.ts (validation, localStorage sync)

### Implementation for User Story 1

- [X] T016 [P] [US1] Create TodoInput component in src/components/TodoInput.tsx with input field, submit button, validation (1-500 chars, not whitespace) per contracts/component-api.md
- [X] T017 [P] [US1] Create TodoList component in src/components/TodoList.tsx with ul/li structure, empty state message, scrollable list per contracts/component-api.md
- [X] T018 [US1] Create TodoItem component in src/components/TodoItem.tsx with description display, visual distinction for completed state per contracts/component-api.md
- [X] T019 [US1] Create TodoApp component in src/components/TodoApp.tsx that uses useTodos hook, renders TodoInput and TodoList, handles errors per contracts/component-api.md

**Checkpoint**: At this point, users can add todos and view them in a list. Empty state shows when no todos exist. This is a functional MVP!

---

## Phase 4: User Story 2 - Mark Todos as Complete (Priority: P2)

**Goal**: Enable users to mark todos as complete with visual feedback and celebratory animation

**Independent Test**: Add a todo, click the toggle button, verify visual state change (strikethrough/color change) and confetti animation plays. Toggle back to incomplete, verify state returns.

### Tests for User Story 2 (OPTIONAL) ⚠️

- [ ] T020 [P] [US2] Integration test for complete todo workflow in tests/integration/todo-workflow.test.tsx (click toggle, state change, animation triggers)
- [ ] T021 [P] [US2] Unit test for toggleTodo function in tests/unit/useTodos.test.ts (flips completed boolean, localStorage updates)

### Implementation for User Story 2

- [X] T022 [P] [US2] Create CelebrationAnimation component in src/components/CelebrationAnimation.tsx using canvas-confetti, respects prefers-reduced-motion per contracts/component-api.md
- [X] T023 [US2] Update TodoItem component in src/components/TodoItem.tsx to add toggle button with aria-pressed, aria-label, calls onToggle prop, uses useDebounce per contracts/component-api.md
- [X] T024 [US2] Update TodoApp component in src/components/TodoApp.tsx to integrate CelebrationAnimation triggered on todo completion per contracts/component-api.md

**Checkpoint**: At this point, users can add todos, mark them complete with celebration animation, and toggle back to incomplete. User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Delete Todo Items (Priority: P3)

**Goal**: Enable users to delete todo items with visual confirmation

**Independent Test**: Add todos, click delete button on one, verify it's removed from list and localStorage updates. Verify deletion works for both completed and active todos.

### Tests for User Story 3 (OPTIONAL) ⚠️

- [ ] T025 [P] [US3] Integration test for delete todo workflow in tests/integration/todo-workflow.test.tsx (click delete, item removed, localStorage updates)
- [ ] T026 [P] [US3] Unit test for deleteTodo function in tests/unit/useTodos.test.ts (removes from list, localStorage updates)

### Implementation for User Story 3

- [X] T027 [P] [US3] Update TodoItem component in src/components/TodoItem.tsx to add delete button with aria-label, calls onDelete prop per contracts/component-api.md
- [X] T028 [US3] Update useTodos hook in src/hooks/useTodos.ts to handle DELETE_TODO action and update localStorage per contracts/component-api.md

**Checkpoint**: All user stories should now be independently functional. Users can add, complete with animation, and delete todos.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and quality validation

- [X] T029 [P] Add responsive CSS styles for mobile-friendly layout (max-width container, flexible button sizing, touch-friendly 44x44px targets) per quickstart.md
- [X] T030 [P] Verify accessibility: Add aria-label to all icon buttons, ensure keyboard navigation works (Tab, Enter, Space), visible focus indicators per quickstart.md checklist
- [ ] T031 [P] Verify accessibility: Run Lighthouse audit and achieve 90+ accessibility score per quickstart.md
- [ ] T032 [P] Verify performance: Check bundle size is under 200KB using `npm run build -- --report` per quickstart.md
- [ ] T033 Verify performance: Add 1000 todos and verify list remains scrollable and responsive per SC-005
- [ ] T034 Verify usability: Test all edge cases from spec.md (whitespace input, 500+ char input, rapid clicks, delete during animation, special characters/emoji)
- [X] T035 [P] Add meta viewport tag for proper mobile rendering in index.html
- [X] T036 [P] Update package.json scripts: dev, build, test, preview, lint, format per quickstart.md
- [ ] T037 Run full test suite (if tests implemented): `npm run test`
- [X] T038 Run ESLint: `npm run lint` and resolve all warnings per constitution quality gates
- [X] T039 Run TypeScript type check and resolve all errors per constitution quality gates
- [ ] T040 Manual smoke test: Complete full user journey (add todo, complete with animation, delete) in actual browser per quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories ✅ **MVP**
  - User Story 2 (P2): Can start after Foundational - Integrates with US1 components but independently testable
  - User Story 3 (P3): Can start after Foundational - Integrates with US1/US2 components but independently testable
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - MVP**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends TodoItem with toggle, adds CelebrationAnimation component
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends TodoItem with delete, extends useTodos hook

### Within Each User Story

- Tests (if included) MUST be written before implementation for TDD approach
- Components can be created in parallel if marked [P]
- TodoItem updates in US2/US3 depend on US1 TodoItem existing
- Integration flows: Input → App → List → Item

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T003, T004, T005, T006, T008 can all run in parallel

**Foundational Phase (Phase 2)**:
- T013 can run in parallel with T009-T012

**User Story 1**:
- T014, T015 (tests) can run in parallel
- T016, T017 (components) can run in parallel

**User Story 2**:
- T020, T021 (tests) can run in parallel
- T022 (CelebrationAnimation) can run in parallel

**User Story 3**:
- T025, T026 (tests) can run in parallel
- T027 (TodoItem update) is independent

**Polish Phase (Phase 6)**:
- T029, T030, T031, T032, T035, T036 can all run in parallel

---

## Parallel Example: User Story 1 Implementation

```bash
# If using TDD, launch both tests first:
Task: "Integration test for add todo workflow in tests/integration/todo-workflow.test.tsx"
Task: "Unit test for useTodos hook addTodo function in tests/unit/useTodos.test.ts"

# Then launch both components in parallel:
Task: "Create TodoInput component in src/components/TodoInput.tsx"
Task: "Create TodoList component in src/components/TodoList.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) 🎯

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T013) - CRITICAL
3. Complete Phase 3: User Story 1 (T014-T019)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**At this point you have a functional todo app where users can add and view todos!**

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (adds celebration!)
4. Add User Story 3 → Test independently → Deploy/Demo (adds deletion)
5. Add Polish (Phase 6) → Final production-ready app

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T014-T019)
   - Developer B: User Story 2 (T020-T024)
   - Developer C: User Story 3 (T025-T028)
3. Stories integrate into shared components (TodoItem, useTodos, TodoApp)
4. Finalize with Polish phase together

---

## Summary

**Total Tasks**: 40 tasks
**Tasks per User Story**:
- Setup (Phase 1): 8 tasks
- Foundational (Phase 2): 5 tasks (BLOCKING)
- User Story 1: 6 tasks (5 implementation + 1 test)
- User Story 2: 5 tasks (3 implementation + 2 tests)
- User Story 3: 4 tasks (2 implementation + 2 tests)
- Polish: 12 tasks

**Parallel Opportunities**: 15 tasks can run in parallel with others

**Independent Test Criteria**:
- **US1**: Add multiple todos, verify they appear in list, empty state shows
- **US2**: Toggle todo, verify visual change + animation plays, toggle back
- **US3**: Delete todo, verify removed from list + localStorage

**Suggested MVP Scope**: Phases 1-3 (Setup + Foundational + User Story 1) = 19 tasks

**Format Validation**: ✅ All tasks follow the checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`

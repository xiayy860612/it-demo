# Research: Todo App Core Functionality

**Feature**: 001-todo-app-core
**Date**: 2026-01-13
**Purpose**: Research and resolve technical decisions for implementation

## Overview

This document consolidates research findings for technical decisions required to implement the todo application. All decisions align with the project constitution's principles: User Experience First, Simplicity & YAGNI, React Best Practices, Test When Valuable, and Performance & Accessibility.

---

## Decision 1: Celebration Animation Library

### Context

The feature spec requires a "fun celebratory animation" when todos are marked complete (FR-006, User Story 2). We need a lightweight, performant solution that doesn't block user interactions (SC-003: animation completes within 2 seconds).

### Decision

**Use canvas-confetti library**

### Rationale

- **Lightweight**: ~10KB gzipped, well within our <200KB bundle budget
- **Performance**: Uses Canvas API for smooth 60fps animations, doesn't block main thread
- **Customizable**: Configurable duration, colors, particle count, physics
- **Accessibility**: Can respect `prefers-reduced-motion` media query
- **Proven**: Used by many production applications, actively maintained
- **Easy integration**: Simple function call API, no complex setup

### Alternatives Considered

1. **Custom CSS/JS animation**: Rejected because would require building particle physics from scratch, more code to maintain
2. **react-confetti**: Rejected because heavier bundle size, canvas-confetti is framework-agnostic and smaller
3. **Framer Motion**: Rejected because overkill for simple confetti, much larger bundle (~40KB), violates YAGNI principle

### Implementation Notes

- Wrap in React component: `CelebrationAnimation.tsx`
- Respect `prefers-reduced-motion` for accessibility
- Auto-stop after 2 seconds per SC-003
- Trigger on todo completion event

---

## Decision 2: Build Tool and Development Environment

### Context

Need a modern build setup for React + TypeScript with ESLint, Prettier, and testing support. Must support fast development and optimized production builds.

### Decision

**Use Vite as build tool**

### Rationale

- **Instant HMR**: Fast development experience, aligns with constitution's "respond instantly" principle
- **Native ESM**: Modern module system, faster than webpack-based alternatives
- **TypeScript support**: Built-in, no additional configuration needed
- **Optimized builds**: Automatic code-splitting, tree-shaking, minification
- **Lightweight**: Much faster dev server startup compared to Create React App
- **Standard**: Becoming the de facto standard for new React projects

### Alternatives Considered

1. **Create React App (CRA)**: Rejected because being deprecated, slower, harder to customize, ejecting no longer recommended
2. **Next.js**: Rejected because overkill for single-page app, adds server-side complexity we don't need (violates YAGNI)
3. **Webpack (custom)**: Rejected because complex configuration, slower than Vite, more maintenance burden

### Implementation Notes

- `npm create vite@latest` with React + TypeScript template
- Configure ESLint and Prettier per constitution
- Set up Vitest (Vite-native testing) for unit/integration tests

---

## Decision 3: localStorage Wrapper and Data Persistence

### Context

The app must persist todo data in browser localStorage (spec assumption #3). Need a robust solution that handles edge cases like quota exceeded, JSON parsing errors, and concurrent tabs.

### Decision

**Build a lightweight localStorage wrapper utility**

### Rationale

- **Error handling**: Graceful fallback if localStorage is unavailable (private browsing, quota exceeded)
- **Type safety**: TypeScript generics for type-safe storage operations
- **Serialization**: Automatic JSON stringify/parse with error handling
- **Simple**: Custom wrapper is simpler than importing a library (YAGNI principle)
- **Testable**: Can mock for testing

### Alternatives Considered

1. **Direct localStorage calls**: Rejected because no error handling, manual JSON serialization, less testable
2. **localForage library**: Rejected because adds dependency for IndexedDB/WebSQL which we don't need, localStorage is sufficient
3. **Zustand persist middleware**: Rejected because we're starting with React built-in state per constitution, no external state management yet

### Implementation Notes

- Create `src/utils/storage.ts` with `get<T>`, `set<T>`, `remove` functions
- Handle `SecurityError` (private browsing), `QuotaExceededError`
- Provide fallback to in-memory storage if localStorage unavailable
- Add tests for error scenarios

---

## Decision 4: State Management Approach

### Context

Need to manage todo list state (add, toggle, delete operations) and sync with localStorage. Constitution requires starting with React built-in state.

### Decision

**Custom React hook (useTodos) with useState + useReducer**

### Rationale

- **Constitution compliant**: Uses React built-in state as required
- **Local state**: Keeps state as local as possible per constitution
- **Testable**: Hook logic can be tested independently
- **Type-safe**: TypeScript for todo entities
- **Simple**: No external dependencies, easiest to understand
- **Scalable**: useReducer handles multiple action types (add, toggle, delete) cleanly

### Alternatives Considered

1. **Zustand**: Rejected because constitution says start with React built-in, only introduce when "clearly needed" - not needed for simple todo list
2. **Redux**: Rejected because massive overkill, violates Simplicity & YAGNI, adds boilerplate
3. **React Context**: Rejected because adds complexity without benefit - no prop drilling in this simple app structure

### Implementation Notes

- Create `src/hooks/useTodos.ts` hook
- Use reducer for actions: `ADD_TODO`, `TOGGLE_TODO`, `DELETE_TODO`
- Auto-sync to localStorage on state changes
- Return todos array and action functions
- Handle localStorage sync errors gracefully

---

## Decision 5: Testing Strategy

### Context

Constitution's "Test When Valuable" principle says to test complex logic, user workflows, and critical paths while skipping simple presentational components.

### Decision

**Vitest + React Testing Library for user workflow tests**

### Rationale

- **User-focused**: React Testing Library encourages testing user behavior, not implementation details
- **Integration tests**: Focus on user workflows (add todo, complete todo, delete todo) as constitution requires
- **Fast**: Vitest is faster than Jest, better DX
- **Standard**: Widely adopted, well-documented
- **Aligned**: Matches "Test When Valuable" - test workflows, skip simple components

### Test Coverage Plan

**Test (user workflows)**:
- Add todo workflow (input validation, list update, persistence)
- Complete todo workflow (toggle state, celebration animation)
- Delete todo workflow (confirmation, removal)
- Edge cases (empty input, long text, rapid clicks, 1000+ items)

**Don't test (simple presentational)**:
- `TodoItem.tsx` rendering (simple props-based component)
- `CelebrationAnimation.tsx` rendering (library handles it)
- Static UI elements

### Alternatives Considered

1. **Full Jest setup**: Rejected because Vitest is faster, better integrated with Vite
2. **Cypress/E2E tests**: Rejected because overkill for simple app, slower, constitution says focus on high-value areas
3. **High coverage metrics**: Rejected because constitution explicitly rejects "arbitrary coverage metrics"

### Implementation Notes

- Create integration tests in `tests/integration/`
- Test with React Testing Library's `fireEvent` and `userEvent`
- Mock localStorage for tests
- Test persistence, error handling, edge cases

---

## Decision 6: Accessibility Implementation

### Context

Constitution requires full accessibility (keyboard navigation, screen reader support, ARIA labels). Must ensure the celebratory animation respects motion preferences.

### Decision

**Implement WCAG 2.1 AA compliance with semantic HTML and ARIA**

### Rationale

- **Semantic HTML**: Use proper elements (`<ul>`, `<li>`, `<button>`, `<input>`) for built-in accessibility
- **Keyboard navigation**: Ensure all actions work with Tab, Enter, Space keys
- **ARIA labels**: Add labels for icon-only buttons (delete, complete)
- **Motion preferences**: Respect `prefers-reduced-motion` for celebration animation
- **Focus management**: Maintain visible focus indicators
- **Screen reader**: Announce state changes (todo added, completed, deleted)

### Implementation Checklist

- [ ] Todo list uses `<ul>` with `role="list"`
- [ ] Todo items use `<li>` with proper semantics
- [ ] Complete toggle is `<button>` with `aria-pressed` and `aria-label`
- [ ] Delete button has `aria-label="Delete todo: {description}"`
- [ ] Input field has `<label>` or `aria-label`
- [ ] Celebration respects `@media (prefers-reduced-motion: reduce)`
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)

### Alternatives Considered

1. **Skip accessibility initially**: Rejected because constitution explicitly says "accessibility violations are blocking issues"
2. **Use a11y library**: Rejected because semantic HTML + ARIA is simpler, libraries add complexity we don't need

---

## Decision 7: Responsive Design and Mobile Support

### Context

Spec assumption #7 requires mobile-friendly. Need responsive layout that works on both desktop and mobile devices.

### Decision

**CSS Flexbox with mobile-first responsive breakpoints**

### Rationale

- **Simple**: Flexbox is sufficient for this layout, no need for Grid
- **Mobile-first**: Start with mobile layout, enhance for desktop
- **Touch-friendly**: Minimum 44x44px tap targets per WCAG
- **Standard**: Uses CSS standard, no additional dependencies
- **Performant**: No JavaScript-based layout calculations

### Implementation Approach

- Single-column layout on mobile (full-width input, vertical list)
- Max-width container on desktop for readability (600-800px)
- Flexible button sizing for touch targets
- Viewport meta tag for proper mobile rendering
- Test on actual devices/emulators

### Alternatives Considered

1. **CSS Grid**: Rejected because overkill for single-column list layout
2. **Responsive library (e.g., Tailwind)**: Rejected because adds dependency, custom CSS is simpler for this scope
3. **Separate mobile app**: Rejected because violates YAGNI, responsive web is sufficient

---

## Summary

All technical decisions align with the project constitution:

✅ **User Experience First**: Fast animations, instant feedback, responsive design
✅ **Simplicity & YAGNI**: Lightweight tools, no over-engineering, simplest viable solutions
✅ **React Best Practices**: Functional components, custom hooks, TypeScript
✅ **Test When Valuable**: Focus on user workflows, not implementation details
✅ **Performance & Accessibility**: Fast builds, small bundle, WCAG 2.1 AA compliance

**Next Steps**: Proceed to Phase 1 - Create data-model.md, contracts/, and quickstart.md

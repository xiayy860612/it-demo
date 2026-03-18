# Implementation Plan: Chrome DevTools MCP Testing

**Branch**: `002-chrome-devtools-mcp-testing` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-chrome-devtools-mcp-testing/spec.md`

## Summary

Enable automated testing of the existing todo application using Chrome DevTools MCP (Model Context Protocol). The test suite will verify core functionality (add, complete, delete todos), capture screenshots for visual regression testing, and monitor console/network activity. Tests will be executable via a single command and provide clear pass/fail reporting with screenshots for debugging.

## Technical Context

**Language/Version**: TypeScript 5.x (existing project standard)
**Primary Dependencies**: Chrome DevTools MCP (available in environment), Node.js for test execution
**Storage**: N/A (testing infrastructure only - app uses localStorage)
**Testing**: Chrome DevTools MCP tools (mcp__chrome-devtools__*)
**Target Platform**: Local development environment (macOS/Linux/Windows) with Chrome browser
**Project Type**: Single project (tests/ directory)
**Performance Goals**: Full test suite execution under 2 minutes per SC-002
**Constraints**: Requires local dev server running (http://localhost:5173 for Vite)
**Scale/Scope**: ~15 test scenarios covering P1-P3 user stories, edge cases

### Existing Codebase Context

The todo app is a React 18.x + TypeScript application with:
- Components: `TodoApp`, `TodoInput`, `TodoList`, `TodoItem`, `CelebrationAnimation`
- State: Managed via `useTodos` hook with localStorage persistence
- Build tool: Vite dev server (default port 5173)
- Testing target: All core functionality at src/components/TodoApp.tsx

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. User Experience First | ✅ PASS | Testing infrastructure directly supports UX quality through automated verification |
| II. Simplicity & YAGNI | ✅ PASS | Only implementing what's specified: P1 (core tests), P2 (screenshots), P3 (monitoring). No CI/CD, no complex test frameworks |
| III. React Best Practices | ⚪ N/A | This is test infrastructure, not React components. Tests will interact with existing React app without modification |
| IV. Test When Valuable | ✅ PASS | Aligned with principle - testing complex user workflows and critical paths (add/complete/delete todos) |
| V. Performance & Accessibility | ✅ PASS | Tests verify app responsiveness (SC-002: <2min execution) and will catch accessibility regressions via MCP snapshot inspection |

**Gate Status**: ✅ **APPROVED** - No violations. All constitution principles satisfied or N/A.

## Project Structure

### Documentation (this feature)

```text
specs/002-chrome-devtools-mcp-testing/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
tests/
├── chrome-devtools/
│   ├── helpers/           # Test utilities (element finders, assertions)
│   │   ├── selectors.ts   # DOM selectors for todo app elements
│   │   ├── assertions.ts  # Helper functions for verifying state
│   │   └── wait.ts        # Wait utilities for async operations
│   ├── scenarios/         # Individual test scenarios by priority
│   │   ├── p1-add-todo.ts         # P1: Add todo functionality
│   │   ├── p1-complete-todo.ts    # P1: Complete todo functionality
│   │   ├── p1-delete-todo.ts      # P1: Delete todo functionality
│   │   ├── p2-screenshots.ts      # P2: Screenshot capture tests
│   │   └── p3-monitoring.ts       # P3: Console/network monitoring
│   ├── edge-cases/        # Edge case tests
│   │   ├── empty-input.ts
│   │   ├── special-chars.ts
│   │   ├── long-text.ts
│   │   └── rapid-actions.ts
│   └── runner.ts          # Main test runner (single entry point)
└── screenshots/           # Baseline and test screenshots
    ├── baseline/
    │   ├── empty-state.png
    │   ├── populated-list.png
    │   └── completed-state.png
    └── test-runs/         # Timestamped per-run screenshots
        └── .gitkeep
```

**Structure Decision**: Single project structure chosen because:
1. This is a testing addition to an existing single-page application
2. Tests reside in the existing `tests/` directory following project conventions
3. No new application code, only test infrastructure
4. Consistent with "Test When Valuable" principle - focused test directory

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this section intentionally left blank.

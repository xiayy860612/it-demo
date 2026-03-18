# Chrome DevTools MCP Testing - Quickstart Guide

**Feature**: Chrome DevTools MCP Testing
**Branch**: `002-chrome-devtools-mcp-testing`
**Last Updated**: 2026-01-13

## Overview

This guide helps you set up and run the Chrome DevTools MCP test suite for the todo application. The test suite verifies core functionality (add, complete, delete todos), captures screenshots for visual regression testing, and monitors console/network activity.

## Prerequisites

### Required

1. **Node.js 18+** - For running the test infrastructure
2. **Chrome Browser** - For automated testing
3. **Chrome DevTools MCP Server** - Must be configured and accessible
4. **Vite Dev Server** - The todo app must be running on `http://localhost:5173`

### Verify MCP Server Availability

Before running tests, ensure Chrome DevTools MCP is available:

```bash
# If using npx for MCP server
npx @modelcontextprotocol/server-chrome-devtools --help

# Or if installed globally
chrome-devtools-mcp-server --help
```

## Quick Start

### 1. Start the Todo Application

In one terminal, start the Vite dev server:

```bash
npm run dev
```

Wait for the message: `➜  Local:   http://localhost:5173/`

### 2. Run the Test Suite

In another terminal, run the tests:

```bash
# Run all tests (P1, P2, P3)
npm run test:chrome-devtools

# Run only P1 (core functionality)
npm run test:chrome-devtools -- --priority P1

# Run a specific test scenario
npm run test:chrome-devtools -- --scenario p1-add-todo

# Run with verbose output
npm run test:chrome-devtools -- --verbose
```

### 3. View Results

Test results will be printed to console:

```
🧪 Chrome DevTools MCP Test Suite
================================

✅ P1: Add Todo (1.2s)
   - Screenshot: tests/screenshots/test-runs/20260113_143022_add-todo_success.png

✅ P1: Complete Todo (2.5s)
   - Screenshot: tests/screenshots/test-runs/20260113_143025_complete-todo_success.png
   - Animation captured

❌ P1: Delete Todo (0.8s)
   - Expected: Todo removed from list
   - Actual: Todo still present
   - Screenshot: tests/screenshots/test-runs/20260113_143028_delete-todo_FAILURE.png

Results: 2/3 passed (66.7%)
Duration: 4.5s
Screenshots: tests/screenshots/test-runs/20260113_143022/
```

## Project Structure

```
tests/
├── chrome-devtools/
│   ├── helpers/           # Test utilities
│   │   ├── selectors.ts   # DOM element selectors
│   │   ├── assertions.ts  # Assertion helpers
│   │   └── wait.ts        # Async wait utilities
│   ├── scenarios/         # Test scenarios by priority
│   │   ├── p1-add-todo.ts
│   │   ├── p1-complete-todo.ts
│   │   ├── p1-delete-todo.ts
│   │   ├── p2-screenshots.ts
│   │   └── p3-monitoring.ts
│   ├── edge-cases/        # Edge case tests
│   │   ├── empty-input.ts
│   │   ├── special-chars.ts
│   │   ├── long-text.ts
│   │   └── rapid-actions.ts
│   └── runner.ts          # Main test entry point
└── screenshots/           # Captured screenshots
    ├── baseline/          # Baseline images for comparison
    └── test-runs/         # Timestamped test run screenshots
```

## Test Scenarios

### P1: Core Functionality

| Scenario | Description | Duration |
|----------|-------------|----------|
| p1-add-todo | Verify todos can be added to the list | ~1s |
| p1-complete-todo | Verify todos can be marked complete with animation | ~2.5s |
| p1-delete-todo | Verify todos can be removed | ~1s |

### P2: Visual Regression

| Scenario | Description | Duration |
|----------|-------------|----------|
| p2-screenshots | Capture screenshots at all key states | ~2s |

### P3: Quality Assurance

| Scenario | Description | Duration |
|----------|-------------|----------|
| p3-monitoring | Monitor console errors and network activity | ~3s |

## Common Commands

```bash
# Run all tests
npm run test:chrome-devtools

# Run specific priority level
npm run test:chrome-devtools -- --priority P1
npm run test:chrome-devtools -- --priority P2
npm run test:chrome-devtools -- --priority P3

# Run specific scenario
npm run test:chrome-devtools -- --scenario p1-add-todo
npm run test:chrome-devtools -- --scenario empty-input

# Verbose output (shows MCP tool calls)
npm run test:chrome-devtools -- --verbose

# Capture all screenshots (not just failures)
npm run test:chrome-devtools -- --capture-all

# Custom timeout (default 5000ms)
npm run test:chrome-devtools -- --timeout 10000
```

## Troubleshooting

### "Dev server not running"

**Error**: `Cannot connect to http://localhost:5173`

**Solution**: Start the Vite dev server in another terminal:
```bash
npm run dev
```

### "Chrome DevTools MCP not available"

**Error**: `MCP server connection failed`

**Solution**:
1. Verify MCP server is running
2. Check MCP server configuration
3. Ensure port is not blocked by firewall

### "Test timeout"

**Error**: `Test scenario exceeded timeout`

**Solution**:
1. Increase timeout: `--timeout 10000`
2. Check if app is responsive (open in browser manually)
3. Check for console errors in the app

### "Screenshot capture failed"

**Error**: `Failed to save screenshot`

**Solution**:
1. Ensure `tests/screenshots/` directory exists
2. Check write permissions
3. Verify sufficient disk space

## Writing New Tests

### 1. Create a new scenario file

```typescript
// tests/chrome-devtools/scenarios/p1-my-test.ts
import type { TestContext, TestResult } from '../../contracts/types';
import { assertTrue } from '../../helpers/assertions';

export async function run(context: TestContext): Promise<TestResult> {
  const startTime = Date.now();

  try {
    // Your test code here
    // Use MCP tools to interact with the browser

    return {
      scenarioId: 'p1-my-test',
      scenarioName: 'My Custom Test',
      passed: true,
      duration: Date.now() - startTime,
      screenshots: [],
      errors: [],
      consoleMessages: [],
      networkRequests: [],
      metadata: { priority: 'P1' },
    };
  } catch (error) {
    return {
      scenarioId: 'p1-my-test',
      scenarioName: 'My Custom Test',
      passed: false,
      duration: Date.now() - startTime,
      screenshots: [],
      errors: [error.message],
      consoleMessages: [],
      networkRequests: [],
      metadata: { priority: 'P1' },
    };
  }
}
```

### 2. Register in the runner

Add to `tests/chrome-devtools/runner.ts`:

```typescript
import { run as myTest } from './scenarios/p1-my-test';

runner.register({
  id: 'p1-my-test',
  name: 'My Custom Test',
  priority: 'P1',
  description: 'Description of what it tests',
  run: myTest,
  enabled: true,
});
```

## Screenshot Management

### Baseline Screenshots

Baseline screenshots are stored in `tests/screenshots/baseline/`:

```
baseline/
├── empty-state.png       # No todos
├── populated-list.png    # Todos added
└── completed-state.png   # Todo completed
```

### Updating Baselines

When intentional UI changes occur, update baselines:

1. Run tests and capture new screenshots
2. Review new screenshots in `test-runs/`
3. Copy approved images to `baseline/`
4. Commit updated baselines

### Visual Regression

To compare against baselines (manual process currently):

1. Open baseline screenshot in image viewer
2. Open test run screenshot side by side
3. Look for unintended differences
4. Investigate regressions or update baseline if change was intentional

## Next Steps

- Review the full specification: `specs/002-chrome-devtools-mcp-testing/spec.md`
- Check the implementation plan: `specs/002-chrome-devtools-mcp-testing/plan.md`
- Read the research decisions: `specs/002-chrome-devtools-mcp-testing/research.md`

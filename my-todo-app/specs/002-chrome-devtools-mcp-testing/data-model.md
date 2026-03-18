# Data Model: Chrome DevTools MCP Testing

**Feature**: Chrome DevTools MCP Testing
**Date**: 2026-01-13
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the data structures and entities used in the Chrome DevTools MCP test suite. These models are TypeScript interfaces used throughout the test infrastructure.

## Core Entities

### TestScenario

Represents a single test scenario that can be executed independently.

```typescript
interface TestScenario {
  /** Unique identifier for the scenario */
  id: string;

  /** Human-readable name */
  name: string;

  /** Priority level (determines execution order) */
  priority: 'P1' | 'P2' | 'P3';

  /** Description of what is being tested */
  description: string;

  /** The test function to execute */
  run: (context: TestContext) => Promise<TestResult>;

  /** Whether this scenario is enabled (can be disabled for debugging) */
  enabled: boolean;
}
```

**State Transitions**: N/A (immutable configuration)

**Validation Rules**:
- `id` must be unique across all scenarios
- `priority` must be one of: 'P1', 'P2', 'P3'
- `enabled` defaults to `true`

---

### TestContext

Provides the runtime context for test execution.

```typescript
interface TestContext {
  /** Chrome DevTools MCP page index */
  pageIdx: number;

  /** Base URL of the application under test */
  baseUrl: string;

  /** Directory for saving screenshots */
  screenshotDir: string;

  /** Timestamp for this test run (for file naming) */
  timestamp: string;

  /** Whether to capture screenshots on success (not just failure) */
  captureAllScreenshots: boolean;
}
```

**State Transitions**: Created at start of test run, passed to all scenarios

**Validation Rules**:
- `pageIdx` must be a valid page index from Chrome DevTools MCP
- `baseUrl` must be a valid HTTP(S) URL

---

### TestResult

Represents the outcome of a single test scenario execution.

```typescript
interface TestResult {
  /** The scenario that was run */
  scenarioId: string;

  /** Whether the test passed */
  passed: boolean;

  /** Execution time in milliseconds */
  duration: number;

  /** Screenshots captured during this test */
  screenshots: string[];

  /** Error messages (if any) */
  errors: string[];

  /** Console messages collected */
  consoleMessages: ConsoleMessage[];

  /** Network requests collected */
  networkRequests: NetworkRequest[];

  /** Additional metadata */
  metadata: TestMetadata;
}
```

**State Transitions**: Pending → Running → Passed/Failed

**Validation Rules**:
- `duration` must be non-negative
- If `passed` is false, `errors` must contain at least one entry

---

### ConsoleMessage

Represents a console message from the browser.

```typescript
interface ConsoleMessage {
  /** Message type */
  type: 'log' | 'debug' | 'info' | 'error' | 'warn' | 'dir' | 'table';

  /** The message content */
  message: string;

  /** Timestamp */
  timestamp: number;

  /** Source URL (if available) */
  source?: string;

  /** Line number (if available) */
  line?: number;
}
```

**State Transitions**: N/A (immutable snapshot)

---

### NetworkRequest

Represents a network request made by the application.

```typescript
interface NetworkRequest {
  /** Request URL */
  url: string;

  /** HTTP method */
  method: string;

  /** Response status code */
  status: number;

  /** Request duration in milliseconds */
  duration: number;

  /** Resource type */
  resourceType: 'document' | 'stylesheet' | 'script' | 'xhr' | 'fetch' | 'image' | 'font' | 'other';

  /** Whether this is an external (non-localhost) request */
  isExternal: boolean;
}
```

**State Transitions**: N/A (immutable snapshot)

---

### DiagnosticInfo

Aggregated diagnostic information from a test run.

```typescript
interface DiagnosticInfo {
  /** Console errors */
  errors: ConsoleMessage[];

  /** Console warnings */
  warnings: ConsoleMessage[];

  /** External network requests (unexpected) */
  externalRequests: NetworkRequest[];

  /** Whether diagnostics are clean (no errors/warnings/external requests) */
  isClean: boolean;
}
```

**State Transitions**: N/A (computed from console and network data)

---

### ScreenshotConfig

Configuration for screenshot capture.

```typescript
interface ScreenshotConfig {
  /** File path for the screenshot */
  filePath: string;

  /** Whether to capture the full page */
  fullPage: boolean;

  /** Image format */
  format: 'png' | 'jpeg' | 'webp';

  /** Quality (for jpeg/webp) */
  quality?: number;
}
```

**State Transitions**: N/A (configuration object)

---

### TestReport

Aggregated report for the entire test suite run.

```typescript
interface TestReport {
  /** Timestamp when the test run started */
  startTime: string;

  /** Timestamp when the test run ended */
  endTime: string;

  /** Total duration in milliseconds */
  totalDuration: number;

  /** All test results */
  results: TestResult[];

  /** Summary statistics */
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number; // percentage
  };

  /** All screenshots captured */
  screenshots: string[];

  /** Base directory for screenshots */
  screenshotDir: string;
}
```

**State Transitions**: Initialized → Results Added → Finalized

**Validation Rules**:
- `passRate` = (passed / total) * 100
- `totalDuration` = endTime - startTime

---

### ElementSelector

Represents a strategy for finding DOM elements.

```typescript
type ElementSelector =
  | { type: 'aria'; label: string }
  | { type: 'id'; value: string }
  | { type: 'css'; selector: string }
  | { type: 'text'; text: string };
```

**State Transitions**: N/A (immutable selector definition)

---

### AssertionError

Represents a test assertion failure.

```typescript
class AssertionError extends Error {
  constructor(
    public expected: string,
    public actual: string,
    message?: string
  ) {
    super(message || `Expected "${expected}" but got "${actual}"`);
    this.name = 'AssertionError';
  }
}
```

---

## Relationships

```
TestScenario
    │
    ├─ runs with → TestContext
    │
    └─ produces → TestResult
                      │
                      ├─ contains → ConsoleMessage[]
                      ├─ contains → NetworkRequest[]
                      └─ contains → ScreenshotConfig[]

TestSuite
    │
    ├─ manages → TestScenario[]
    │
    └─ produces → TestReport
                    │
                    └─ aggregates → TestResult[]
```

---

## Entity Lifecycle

### Test Execution Flow

1. **Setup**: Create `TestContext` with page index and configuration
2. **Execution**: For each `TestScenario` (in priority order):
   - Call `scenario.run(context)`
   - Scenario interacts with browser via MCP tools
   - Collect `ConsoleMessage` and `NetworkRequest` data
   - Capture screenshots via `ScreenshotConfig`
   - Return `TestResult`
3. **Aggregation**: Combine all `TestResult`s into `TestReport`
4. **Reporting**: Output formatted report to console

### State Cleanup

Between P1 scenarios, execute:
```typescript
localStorage.clear();
location.reload();
```

Wait for empty state confirmation before proceeding.

---

## Validation Summary

| Entity | Key Validations |
|--------|----------------|
| TestScenario | Unique ID, valid priority |
| TestContext | Valid page index, valid URL |
| TestResult | Non-negative duration, errors if failed |
| TestReport | Accurate summary calculations |
| ElementSelector | Valid selector type and value |

# Research: Chrome DevTools MCP Testing

**Feature**: Chrome DevTools MCP Testing
**Date**: 2026-01-13
**Phase**: Phase 0 - Outline & Research

## Overview

This document consolidates research findings for implementing automated testing of the todo application using Chrome DevTools MCP (Model Context Protocol). All technical decisions are documented here with rationale and alternatives considered.

## Research Topics

### 1. Chrome DevTools MCP Tool Capabilities

**Question**: What tools are available in Chrome DevTools MCP for browser automation and testing?

**Decision**: Chrome DevTools MCP provides comprehensive browser automation tools including:
- `mcp__chrome-devtools__new_page` - Create new browser page/tab
- `mcp__chrome-devtools__navigate_page` - Navigate to URLs
- `mcp__chrome-devtools__take_snapshot` - Get accessibility tree snapshot (for element inspection)
- `mcp__chrome-devtools__take_screenshot` - Capture screenshots
- `mcp__chrome-devtools__fill` - Fill form inputs
- `mcp__chrome-devtools__click` - Click elements
- `mcp__chrome-devtools__wait_for` - Wait for text to appear
- `mcp__chrome-devtools__list_console_messages` - Monitor console output
- `mcp__chrome-devtools__list_network_requests` - Monitor network activity
- `mcp__chrome-devtools__evaluate_script` - Execute JavaScript in browser context

**Rationale**: The MCP tools provide all necessary capabilities for the three user stories:
- P1 (functional testing): navigate, snapshot, fill, click, wait_for
- P2 (screenshots): take_screenshot with various options
- P3 (monitoring): list_console_messages, list_network_requests

**Alternatives Considered**:
- **Playwright**: More mature, but requires separate installation and doesn't leverage the available MCP infrastructure
- **Puppeteer**: Similar to Playwright, but adds dependency overhead
- **Cypress**: Full E2E framework, but overkill for this use case and violates YAGNI principle

**References**: Chrome DevTools MCP tool definitions in available tools list

---

### 2. Element Selection Strategy

**Question**: How to reliably select DOM elements in the todo app for test interactions?

**Decision**: Use a hybrid approach combining ARIA attributes (preferred) with fallback to semantic HTML selectors.

**Rationale**:
- The existing todo app already includes ARIA attributes (`aria-label`, `aria-pressed`, `role`)
- ARIA selectors are resilient to styling changes and more aligned with accessibility
- Accessibility tree snapshots from MCP include these attributes
- Fallback to semantic selectors (input[type="text"], button[type="submit"]) for elements lacking ARIA

**Selector Strategy**:
1. **Primary**: ARIA labels (e.g., `aria-label="New todo description"`)
2. **Secondary**: Test IDs if needed (would require adding `data-testid` attributes - defer to future if ARIA insufficient)
3. **Fallback**: CSS selectors based on semantic HTML (input#todo-input, button[type="submit"])

**Alternatives Considered**:
- **data-testid attributes**: Most robust but requires modifying app code. Not needed initially since app has good ARIA
- **CSS selectors only**: Brittle - breaks with styling changes
- **XPath**: Too complex and fragile

**Implementation Notes**:
- Existing app has: `id="todo-input"`, `aria-label` attributes on interactive elements
- Empty state has `role="status"` which can be used for verification

---

### 3. Test Execution Model

**Question**: How should tests be structured and executed?

**Decision**: Sequential scenario-based tests with a single TypeScript entry point using async/await patterns.

**Rationale**:
- Sequential execution avoids browser state complexity (single page, single tab)
- Async/await is natural for MCP tool calls which return promises
- TypeScript provides type safety for test code
- Single entry point (runner.ts) satisfies FR-014

**Test Structure**:
```typescript
interface TestScenario {
  name: string;
  priority: 'P1' | 'P2' | 'P3';
  run: () => Promise<TestResult>;
}

interface TestResult {
  passed: boolean;
  duration: number;
  screenshots: string[];
  errors: string[];
}
```

**Execution Flow**:
1. Verify dev server is running
2. Create new page and navigate to localhost:5173
3. Run scenarios in priority order (P1 → P2 → P3)
4. Collect results and screenshots
5. Generate report (console output with pass/fail summary)

**Alternatives Considered**:
- **Parallel execution**: Faster but adds complexity with shared browser state. Violates simplicity principle for marginal gain
- **Test framework (Jest/Vitest)**: Adds dependency. MCP tools don't integrate naturally with test runners. YAGNI
- **Separate browser per test**: Overkill for single-page app

---

### 4. State Management Between Tests

**Question**: How to ensure test isolation when tests modify application state?

**Decision**: Use MCP `evaluate_script` to clear localStorage before each P1 scenario and capture clean state snapshots.

**Rationale**:
- The todo app persists to localStorage via `useTodos` hook
- Clearing localStorage ensures each test starts fresh
- In-browser script execution is faster than page reloads
- Aligns with assumption #8: "Test data isolation: Each test run starts with a clean state"

**Implementation**:
```typescript
async function clearState(pageIdx: number): Promise<void> {
  await mcp__chrome-devtools__evaluate_script({
    function: "() => { localStorage.clear(); location.reload(); }"
  });
  await mcp__chrome-devtools__wait_for({ text: "No todos yet!" });
}
```

**Alternatives Considered**:
- **Page reload between tests**: Slower (~2-3 seconds per reload)
- **Incognito mode**: Complex to set up with MCP
- **Test data cleanup (delete all todos)**: Requires working delete functionality, creating circular dependency

---

### 5. Screenshot Strategy

**Question**: When and how should screenshots be captured for visual regression testing?

**Decision**: Capture screenshots at critical state transitions, saved with descriptive names and timestamps.

**Capture Points**:
1. **Before tests**: Empty state (baseline verification)
2. **After adding todo**: Populated list
3. **After completing todo**: Completed state with strikethrough
4. **After failure**: Any state when test fails
5. **During animation**: Screenshot during celebration (timing challenge)

**File Naming**: `{timestamp}_{scenario}_{state}.png`

**Rationale**:
- Critical states cover the main visual states of the app
- Timestamps enable historical comparison
- Descriptive names make debugging easier
- Screenshots on failure are essential for SC-007

**Animation Challenge**: The celebration animation lasts 2 seconds. We'll need to:
1. Trigger completion
2. Wait 500ms (animation start)
3. Capture screenshot
4. Wait remaining time for next test

**Alternatives Considered**:
- **Video recording**: Overkill, harder to store and review
- **Pixel diff comparison**: Complex tooling needed. Manual review sufficient for initial implementation
- **Screenshot only on failure**: Would miss P2 requirements for baseline screenshots

---

### 6. Console and Network Monitoring

**Question**: How to effectively monitor and report console messages and network activity?

**Decision**: Collect console messages and network requests after each test scenario, filtering for errors and unexpected external calls.

**Implementation**:
```typescript
async function checkDiagnostics(pageIdx: number): Promise<DiagnosticInfo> {
  const messages = await mcp__chrome-devtools__list_console_messages({
    types: ['error', 'warn']
  });
  const requests = await mcp__chrome-devtools__list_network_requests();

  return {
    errors: messages.filter(m => m.type === 'error'),
    warnings: messages.filter(m => m.type === 'warn'),
    externalRequests: requests.filter(r => !r.url.includes('localhost'))
  };
}
```

**Rationale**:
- Filtering to errors/warnings reduces noise (info logs are expected)
- External request detection catches unexpected analytics/telemetry
- Post-test collection is simpler than real-time monitoring
- Aligns with P3 user story: "no errors or warnings are logged"

**Alternatives Considered**:
- **Real-time monitoring**: More complex and adds no value for post-fact analysis
- **All console messages**: Too verbose, would hide actual issues
- **Performance metrics**: Mentioned in spec but not critical for P3, defer to future

---

### 7. Edge Case Testing Strategy

**Question**: How to test edge cases defined in the spec?

**Decision**: Dedicated edge case test files with specific input data and expected behaviors.

**Edge Cases to Test**:
1. **Empty/whitespace input**: Submit form with spaces → expect error message
2. **Long text (500+ chars)**: Test validation → expect truncation or error
3. **Special characters/emoji**: Test with "Test 🎉 todo & <script>" → expect correct display
4. **Rapid clicking**: Click complete button 5x rapidly → expect debounced single toggle
5. **Delete while animating**: Delete todo during celebration → expect clean removal
6. **Non-existent element interaction**: Try to delete when empty → expect graceful handling

**Rationale**:
- Each edge case has specific preconditions and assertions
- Dedicated files keep edge cases organized and discoverable
- Tests validate the app's defensive programming

**Implementation Approach**:
```typescript
// edge-cases/empty-input.ts
export async function testEmptyInput(): Promise<TestResult> {
  // 1. Fill with spaces
  // 2. Submit form
  // 3. Verify error message appears
  // 4. Verify no todo added
}
```

---

### 8. Test Reporting Format

**Question**: How should test results be reported to developers?

**Decision**: Console-based output with color-coded pass/fail, timing information, and screenshot references.

**Report Format**:
```
🧪 Chrome DevTools MCP Test Suite
================================

✅ P1: Add Todo (1.2s)
   - Screenshot: test-runs/20260113_143022_add-todo_success.png

✅ P1: Complete Todo (2.5s)
   - Screenshot: test-runs/20260113_143025_complete-todo_success.png
   - Animation captured

❌ P1: Delete Todo (0.8s)
   - Expected: Todo removed from list
   - Actual: Todo still present
   - Screenshot: test-runs/20260113_143028_delete-todo_FAILURE.png
   - Console errors: 1

Results: 2/3 passed (66.7%)
Duration: 4.5s
Screenshots: tests/screenshots/test-runs/20260113_143022/
```

**Rationale**:
- Color and emoji provide immediate visual feedback
- Timing data helps identify slow tests
- Screenshot paths enable quick debugging
- Summary line for overall status

**Alternatives Considered**:
- **HTML report**: Overkill for local development
- **JSON output**: Not human-readable, would require viewer
- **JUnit XML**: Only useful for CI/CD integration (future consideration)

---

## Summary of Decisions

| Topic | Decision | Key Consideration |
|-------|----------|-------------------|
| Tool Capabilities | Use Chrome DevTools MCP tools | Already available, covers all requirements |
| Element Selection | ARIA attributes + semantic HTML fallback | App has good ARIA, no code changes needed |
| Test Execution | Sequential scenarios with async/await | Simple, reliable, single entry point |
| State Management | Clear localStorage between P1 tests | Fast isolation without page reload |
| Screenshots | Critical states + failure captures | Covers P2 requirements, enables debugging |
| Monitoring | Collect errors/warnings post-test | Sufficient for P3, simpler than real-time |
| Edge Cases | Dedicated test files with specific data | Organized, covers all spec scenarios |
| Reporting | Console output with emojis and timing | Human-readable, actionable |

## Unresolved Questions

None - all technical clarifications have been resolved.

## Next Steps

Proceed to **Phase 1: Design & Contracts** to create:
1. `data-model.md` - Test entity definitions
2. `contracts/` - Test scenario contracts
3. `quickstart.md` - Developer setup guide

# Tasks: Chrome DevTools MCP Testing

**Input**: Design documents from `/specs/002-chrome-devtools-mcp-testing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature IS a test infrastructure - no separate test tasks needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths below follow the single project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create test directory structure: tests/chrome-devtools/{helpers,scenarios,edge-cases}, tests/screenshots/{baseline,test-runs}
- [x] T002 [P] Create contracts/types.ts with TestContext, TestResult, ElementSelector, ConsoleMessage, NetworkRequest interfaces
- [x] T003 [P] Create contracts/test-scenarios.ts with ITestScenario, ITestRunner, IAssertions, IScreenshotCapture interfaces
- [x] T004 [P] Create contracts/dom-selectors.ts with TodoAppSelectors mapping to src/components elements
- [x] T005 [P] Copy type definitions from specs/002-chrome-devtools-mcp-testing/contracts/types.ts to tests/chrome-devtools/types.ts
- [x] T006 [P] Create package.json test script: "test:chrome-devtools": "tsx tests/chrome-devtools/runner.ts"

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create tests/chrome-devtools/helpers/selectors.ts implementing TodoAppSelectors from contracts with findElementInSnapshot helper
- [x] T008 [P] Create tests/chrome-devtools/helpers/assertions.ts with assertTrue, assertFalse, assertEquals, assertContains, assertElementExists, assertTextPresent functions
- [x] T009 [P] Create tests/chrome-devtools/helpers/wait.ts with wait, waitForText, waitForElement, waitForCelebration functions
- [x] T010 Create tests/chrome-devtools/runner.ts main test orchestrator with register(), run(), runPriority(), runSingle() methods
- [x] T011 Implement TestContext creation in runner.ts with page index, baseUrl, screenshotDir, timestamp configuration
- [x] T012 Implement state cleanup function in runner.ts that clears localStorage and reloads page between P1 scenarios

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Automated UI Testing (Priority: P1) 🎯 MVP

**Goal**: Enable automated testing of core todo functionality (add, complete, delete) using Chrome DevTools MCP

**Independent Test**: Run test suite that uses MCP to verify add, complete, delete operations. Each test passes when the todo list updates correctly.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create tests/chrome-devtools/scenarios/p1-add-todo.ts with navigate, snapshot, fill input, click submit, verify todo appears
- [x] T014 [P] [US1] Create tests/chrome-devtools/scenarios/p1-complete-todo.ts with add todo, click complete, verify strikethrough, wait for celebration animation
- [x] T015 [P] [US1] Create tests/chrome-devtools/scenarios/p1-delete-todo.ts with add todo, click delete, verify todo removed from list
- [x] T016 [US1] Register all P1 scenarios in runner.ts with priority 'P1', add state cleanup between each scenario
- [x] T017 [US1] Implement screenshot capture on failure in runner.ts for P1 scenarios, save to test-runs directory with timestamp
- [x] T018 [US1] Add console error collection in runner.ts for P1 scenarios using mcp__chrome-devtools__list_console_messages
- [x] T019 [US1] Implement console-based test report output in runner.ts with pass/fail emoji, duration, screenshot paths
- [x] T020 [US1] Add edge case test in tests/chrome-devtools/edge-cases/empty-input.ts for whitespace-only input validation
- [x] T021 [US1] Add edge case test in tests/chrome-devtools/edge-cases/special-chars.ts for emoji and special characters in todo descriptions
- [x] T022 [US1] Add edge case test in tests/chrome-devtools/edge-cases/long-text.ts for 500+ character validation
- [x] T023 [US1] Add edge case test in tests/chrome-devtools/edge-cases/rapid-actions.ts for debouncing verification with multiple rapid clicks

**Checkpoint**: At this point, User Story 1 should be fully functional. Run `npm run test:chrome-devtools` to verify core todo operations are tested automatically.

---

## Phase 4: User Story 2 - Visual Regression Testing (Priority: P2)

**Goal**: Capture screenshots at key application states for visual regression detection

**Independent Test**: Run screenshot capture scenario, verify baseline images exist in tests/screenshots/baseline/, compare with new screenshots manually

### Implementation for User Story 2

- [x] T024 [P] [US2] Create tests/chrome-devtools/scenarios/p2-screenshots.ts with captureBaseline() for empty-state, populated-list, completed-state
- [x] T025 [P] [US2] Implement screenshot capture with animation timing in p2-screenshots.ts: trigger completion, wait 500ms, capture during celebration
- [x] T026 [US2] Add screenshot file naming in p2-screenshots.ts using format: {timestamp}_{scenario}_{state}.png
- [x] T027 [US2] Create baseline screenshots in tests/screenshots/baseline/ by running p2-screenshots.ts and reviewing outputs
- [x] T028 [US2] Register P2 scenario in runner.ts with priority 'P2', no state cleanup needed between P2 tests
- [x] T029 [US2] Add ScreenshotCapture helper in tests/chrome-devtools/helpers/screenshot.ts with capture(), captureFailure(), captureBaseline() methods

**Checkpoint**: At this point, User Story 2 should be fully functional. Run P2 tests to generate and compare baseline screenshots.

---

## Phase 5: User Story 3 - Network and Console Monitoring (Priority: P3)

**Goal**: Monitor console messages and network requests to surface errors and unexpected activity

**Independent Test**: Run monitoring scenario while performing todo operations, verify no errors/warnings in output, verify no external requests logged

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create tests/chrome-devtools/scenarios/p3-monitoring.ts with collectDiagnostics() for console and network data
- [ ] T031 [P] [US3] Implement error filtering in p3-monitoring.ts: filter list_console_messages for type='error' and type='warn'
- [ ] T032 [P] [US3] Implement external request detection in p3-monitoring.ts: filter list_network_requests for non-localhost URLs
- [ ] T033 [US3] Add DiagnosticInfo aggregation in p3-monitoring.ts with errors, warnings, externalRequests, isClean fields
- [ ] T034 [US3] Implement performance timing in p3-monitoring.ts: measure duration from action start to completion, verify under 5 seconds per success criteria
- [ ] T035 [US3] Register P3 scenario in runner.ts with priority 'P3', integrate diagnostic collection into all P1/P2 scenarios
- [ ] T036 [US3] Add diagnostic summary to console report in runner.ts showing error count, warning count, external request count

**Checkpoint**: All user stories should now be independently functional. Run full test suite with `npm run test:chrome-devtools` and verify console/network monitoring output.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T037 [P] Add CLI argument parsing in runner.ts for --priority, --scenario, --verbose, --capture-all, --timeout flags
- [ ] T038 [P] Create tests/screenshots/test-runs/.gitkeep to ensure directory is tracked
- [ ] T039 Add validation in runner.ts to verify dev server is running at http://localhost:5173 before starting tests
- [ ] T040 [P] Update quickstart.md with actual command examples and troubleshooting based on implementation
- [ ] T041 Implement test timeout handling in runner.ts with configurable default (5000ms) and per-scenario override capability
- [ ] T042 Add color-coded console output in runner.ts: green for pass, red for fail, yellow for warning, blue for info
- [ ] T043 Create npm script for running individual scenarios: "test:chrome-devtools:scenario": "ts-node tests/chrome-devtools/runner.ts --scenario"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Foundational (Phase 2) - No dependencies on other stories
  - US2 (P2): Can start after Foundational (Phase 2) - No dependencies on US1, but screenshots build on US1 scenarios
  - US3 (P3): Can start after Foundational (Phase 2) - Integrates with US1/US2 but independently testable
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses US1 scenarios to populate lists but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Monitors all stories but independently testable

### Within Each User Story

- Scenario files marked [P] can be created in parallel
- Registration depends on scenario files existing
- Helper modules can be created in parallel
- Runner integration depends on helpers and scenarios

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, US1, US2, US3 scenarios can be worked on in parallel
- Within US1: T013, T014, T015 (scenario files) can run in parallel
- Within US2: T024, T025 (scenario implementations) can run in parallel
- Within US3: T030, T031, T032 (monitoring implementations) can run in parallel
- In Polish phase: T037, T038, T040, T043 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all P1 scenario files together:
Task: "Create tests/chrome-devtools/scenarios/p1-add-todo.ts..."
Task: "Create tests/chrome-devtools/scenarios/p1-complete-todo.ts..."
Task: "Create tests/chrome-devtools/scenarios/p1-delete-todo.ts..."

# Launch all US1 edge case files together:
Task: "Add edge case test in tests/chrome-devtools/edge-cases/empty-input.ts..."
Task: "Add edge case test in tests/chrome-devtools/edge-cases/special-chars.ts..."
Task: "Add edge case test in tests/chrome-devtools/edge-cases/long-text.ts..."
Task: "Add edge case test in tests/chrome-devtools/edge-cases/rapid-actions.ts..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T012) - CRITICAL
3. Complete Phase 3: User Story 1 (T013-T023)
4. **STOP and VALIDATE**: Run `npm run test:chrome-devtools`, verify all P1 tests pass
5. This gives you automated testing for core todo functionality - valuable immediately

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP: automated UI testing)
3. Add User Story 2 → Test independently → Deploy (adds visual regression)
4. Add User Story 3 → Test independently → Deploy (adds monitoring)
5. Add Polish → Final deployment
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T013-T023)
   - Developer B: User Story 2 (T024-T029)
   - Developer C: User Story 3 (T030-T036)
3. Stories complete and integrate independently
4. Team completes Polish together

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 43 |
| **Setup (Phase 1)** | 6 |
| **Foundational (Phase 2)** | 6 |
| **User Story 1 (Phase 3)** | 11 |
| **User Story 2 (Phase 4)** | 6 |
| **User Story 3 (Phase 5)** | 7 |
| **Polish (Phase 6)** | 7 |
| **Parallelizable [P]** | 23 |
| **Sequential** | 20 |

### MVP Scope (User Story 1)

**Tasks T001-T023** deliver automated UI testing for core todo functionality:
- Add todo verification
- Complete todo verification with animation
- Delete todo verification
- Edge case coverage (empty input, special chars, long text, rapid actions)
- Screenshot capture on failures
- Console error reporting
- Clear pass/fail reporting

**Estimated effort**: ~23 tasks, foundation + core testing infrastructure

### Format Validation

✅ All tasks follow checkbox format: `- [ ]`
✅ All tasks have sequential IDs: T001-T043
✅ All user story tasks have [US1], [US2], or [US3] labels
✅ Parallel tasks marked with [P]
✅ All descriptions include file paths
✅ No vague tasks - each is specific and actionable

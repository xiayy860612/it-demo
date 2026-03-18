/**
 * Test Scenario Contracts
 *
 * Defines the interface contracts for all test scenarios in the Chrome DevTools MCP test suite.
 * Each scenario implements this contract to ensure consistency and enable proper reporting.
 */

import type { TestContext, TestResult, ElementSelector } from './types';

/**
 * Base interface for all test scenarios
 *
 * Every test scenario must implement this contract to be executable by the test runner.
 */
export interface ITestScenario {
  /**
   * Unique identifier for this scenario
   * Format: {priority}-{action-name} (e.g., "p1-add-todo")
   */
  readonly id: string;

  /**
   * Human-readable name for display in reports
   */
  readonly name: string;

  /**
   * Priority level determining execution order
   * P1: Core functionality (add, complete, delete)
   * P2: Visual testing (screenshots)
   * P3: Quality assurance (console/network monitoring)
   */
  readonly priority: 'P1' | 'P2' | 'P3';

  /**
   * Brief description of what this test validates
   */
  readonly description: string;

  /**
   * Execute the test scenario
   *
   * @param context - Test execution context (page, URL, screenshot config)
   * @returns Promise resolving to test result with pass/fail status
   *
   * @throws AssertionError - When an assertion fails
   * @throws MCPError - When Chrome DevTools MCP tool calls fail
   */
  run(context: TestContext): Promise<TestResult>;
}

/**
 * Contract for element selectors used in tests
 *
 * Provides a consistent way to reference DOM elements across tests.
 */
export interface IElementSelectors {
  /**
   * Selector for the todo input field
   * Used for: Adding new todos, testing validation
   */
  readonly todoInput: ElementSelector;

  /**
   * Selector for the submit button
   * Used for: Submitting new todos
   */
  readonly submitButton: ElementSelector;

  /**
   * Selector for the todo list container
   * Used for: Verifying list contents
   */
  readonly todoList: ElementSelector;

  /**
   * Selector for empty state message
   * Used for: Verifying no todos exist
   */
  readonly emptyState: ElementSelector;

  /**
   * Creates a selector for a specific todo item by description
   *
   * @param description - The todo description text
   * @returns Element selector for the specific todo
   */
  todoItemByDescription(description: string): ElementSelector;

  /**
   * Creates a selector for the complete checkbox of a todo
   *
   * @param description - The todo description text
   * @returns Element selector for the todo's complete button
   */
  completeButtonByDescription(description: string): ElementSelector;

  /**
   * Creates a selector for the delete button of a todo
   *
   * @param description - The todo description text
   * @returns Element selector for the todo's delete button
   */
  deleteButtonByDescription(description: string): ElementSelector;
}

/**
 * Contract for test assertions
 *
 * Provides consistent assertion methods across all test scenarios.
 */
export interface IAssertions {
  /**
   * Assert that a condition is true
   *
   * @param condition - The condition to check
   * @param message - Error message if assertion fails
   * @throws AssertionError with descriptive message
   */
  assertTrue(condition: boolean, message: string): void;

  /**
   * Assert that a condition is false
   *
   * @param condition - The condition to check
   * @param message - Error message if assertion fails
   * @throws AssertionError with descriptive message
   */
  assertFalse(condition: boolean, message: string): void;

  /**
   * Assert that two values are equal
   *
   * @param actual - The actual value
   * @param expected - The expected value
   * @param message - Optional context for the assertion
   * @throws AssertionError with expected vs actual values
   */
  assertEquals<T>(actual: T, expected: T, message?: string): void;

  /**
   * Assert that a text value is contained within another
   *
   * @param haystack - The text to search within
   * @param needle - The text to search for
   * @throws AssertionError if needle not found in haystack
   */
  assertContains(haystack: string, needle: string): void;

  /**
   * Assert that an element exists in the page
   *
   * @param selector - The element selector
   * @throws AssertionError if element not found
   */
  assertElementExists(selector: ElementSelector): Promise<void>;

  /**
   * Assert that an element is visible to the user
   *
   * @param selector - The element selector
   * @throws AssertionError if element not visible
   */
  assertElementVisible(selector: ElementSelector): Promise<void>;

  /**
   * Assert that text is present on the page
   *
   * @param text - The text to search for
   * @throws AssertionError if text not found
   */
  assertTextPresent(text: string): Promise<void>;

  /**
   * Assert that no console errors were logged
   *
   * @throws AssertionError if any errors found
   */
  assertNoConsoleErrors(): Promise<void>;

  /**
   * Assert that no external network requests were made
   *
   * @throws AssertionError if external requests found
   */
  assertNoExternalRequests(): Promise<void>;
}

/**
 * Contract for wait utilities
 *
 * Handles timing and waiting for asynchronous operations.
 */
export interface IWaitUtils {
  /**
   * Wait for a specified duration
   *
   * @param ms - Milliseconds to wait
   */
  wait(ms: number): Promise<void>;

  /**
   * Wait for text to appear on the page
   *
   * @param text - The text to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 5000)
   * @throws Error if text doesn't appear within timeout
   */
  waitForText(text: string, timeout?: number): Promise<void>;

  /**
   * Wait for an element to appear
   *
   * @param selector - The element selector
   * @param timeout - Maximum time to wait in milliseconds (default: 5000)
   * @throws Error if element doesn't appear within timeout
   */
  waitForElement(selector: ElementSelector, timeout?: number): Promise<void>;

  /**
   * Wait for the celebration animation to complete
   *
   * The celebration animation lasts 2 seconds per the spec.
   * This wait ensures the animation finishes before proceeding.
   */
  waitForCelebration(): Promise<void>;
}

/**
 * Contract for screenshot capture
 *
 * Provides consistent screenshot handling across tests.
 */
export interface IScreenshotCapture {
  /**
   * Capture a screenshot with optional configuration
   *
   * @param name - Descriptive name for the screenshot (used in filename)
   * @param options - Optional capture settings
   * @returns Path to the saved screenshot file
   */
  capture(name: string, options?: Partial<ScreenshotOptions>): Promise<string>;

  /**
   * Capture a screenshot specifically for failure documentation
   *
   * @param testName - Name of the failing test
   * @returns Path to the saved screenshot file
   */
  captureFailure(testName: string): Promise<string>;

  /**
   * Capture a screenshot for baseline comparison
   *
   * @param stateName - Name of the application state (e.g., "empty", "populated")
   * @returns Path to the saved screenshot file
   */
  captureBaseline(stateName: string): Promise<string>;
}

/**
 * Screenshot capture options
 */
export interface ScreenshotOptions {
  /** Capture the full scrollable page */
  fullPage: boolean;
  /** Image format */
  format: 'png' | 'jpeg' | 'webp';
  /** Quality for lossy formats (0-100) */
  quality: number;
  /** Custom file path (overrides default naming) */
  filePath: string;
}

/**
 * Contract for the main test runner
 *
 * Orchestrates execution of all test scenarios.
 */
export interface ITestRunner {
  /**
   * Register a test scenario
   *
   * @param scenario - The scenario to register
   */
  register(scenario: ITestScenario): void;

  /**
   * Run all registered scenarios
   *
   * Scenarios are executed in priority order (P1 → P2 → P3).
   * P1 scenarios clean state between tests; P2/P3 do not.
   *
   * @returns Promise resolving to the complete test report
   */
  run(): Promise<TestReport>;

  /**
   * Run only scenarios matching the specified priority
   *
   * @param priority - Priority level to filter by
   * @returns Promise resolving to the filtered test report
   */
  runPriority(priority: 'P1' | 'P2' | 'P3'): Promise<TestReport>;

  /**
   * Run a specific scenario by ID
   *
   * @param scenarioId - ID of the scenario to run
   * @returns Promise resolving to the single test result
   */
  runSingle(scenarioId: string): Promise<TestResult>;
}

/**
 * Complete test report
 *
 * Aggregated results from running one or more scenarios.
 */
export interface TestReport {
  /** Timestamp when test run started (ISO 8601) */
  readonly startTime: string;

  /** Timestamp when test run ended (ISO 8601) */
  readonly endTime: string;

  /** Total duration in milliseconds */
  readonly totalDuration: number;

  /** Individual test results */
  readonly results: TestResult[];

  /** Summary statistics */
  readonly summary: {
    readonly total: number;
    readonly passed: number;
    readonly failed: number;
    readonly passRate: number; // 0-100
  };

  /** All screenshot paths captured during run */
  readonly screenshots: string[];

  /** Base directory where screenshots were saved */
  readonly screenshotDir: string;
}

/**
 * Type definitions used across contracts
 */
export type { TestContext, TestResult, ElementSelector } from './types';

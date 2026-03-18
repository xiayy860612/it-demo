/**
 * Type Definitions for Chrome DevTools MCP Test Suite
 *
 * Core TypeScript types used throughout the test infrastructure.
 */

/**
 * Strategy for selecting DOM elements in the browser
 */
export type ElementSelector =
  | { type: 'aria'; label: string }
  | { type: 'id'; value: string }
  | { type: 'css'; selector: string }
  | { type: 'text'; text: string };

/**
 * Test execution context provided to each scenario
 */
export interface TestContext {
  /** Chrome DevTools MCP page index */
  pageIdx: number;

  /** Base URL of the application under test */
  baseUrl: string;

  /** Directory path for saving screenshots */
  screenshotDir: string;

  /** Timestamp for this test run (ISO 8601 format) */
  timestamp: string;

  /** Whether to capture screenshots for passing tests */
  captureAllScreenshots: boolean;

  /** Maximum timeout for wait operations (milliseconds) */
  defaultTimeout: number;
}

/**
 * Result of executing a single test scenario
 */
export interface TestResult {
  /** ID of the scenario that was run */
  scenarioId: string;

  /** Name of the scenario */
  scenarioName: string;

  /** Whether the test passed all assertions */
  passed: boolean;

  /** Execution duration in milliseconds */
  duration: number;

  /** Paths to screenshots captured during this test */
  screenshots: string[];

  /** Error messages (empty if passed) */
  errors: string[];

  /** Console messages collected during test */
  consoleMessages: ConsoleMessage[];

  /** Network requests collected during test */
  networkRequests: NetworkRequest[];

  /** Additional test metadata */
  metadata: TestMetadata;
}

/**
 * A console message from the browser
 */
export interface ConsoleMessage {
  /** Message type */
  type: 'log' | 'debug' | 'info' | 'error' | 'warn' | 'dir' | 'table';

  /** Message content */
  message: string;

  /** Unix timestamp */
  timestamp: number;

  /** Source URL if available */
  source?: string;

  /** Line number if available */
  line?: number;
}

/**
 * A network request made by the application
 */
export interface NetworkRequest {
  /** Request URL */
  url: string;

  /** HTTP method */
  method: string;

  /** Response status */
  status: number;

  /** Duration in milliseconds */
  duration: number;

  /** Resource type classification */
  resourceType:
    | 'document'
    | 'stylesheet'
    | 'script'
    | 'xhr'
    | 'fetch'
    | 'image'
    | 'font'
    | 'other';

  /** Whether this is an external (non-localhost) request */
  isExternal: boolean;
}

/**
 * Metadata attached to test results
 */
export interface TestMetadata {
  /** Priority level of the scenario */
  priority: 'P1' | 'P2' | 'P3';

  /** Browser viewport width */
  viewportWidth?: number;

  /** Browser viewport height */
  viewportHeight?: number;

  /** User agent string */
  userAgent?: string;

  /** Custom key-value pairs */
  custom?: Record<string, string | number | boolean>;
}

/**
 * Screenshot capture configuration
 */
export interface ScreenshotConfig {
  /** Full file path for saving */
  filePath: string;

  /** Capture full scrollable page */
  fullPage: boolean;

  /** Image format */
  format: 'png' | 'jpeg' | 'webp';

  /** Quality for lossy formats (0-100) */
  quality?: number;

  /** Descriptive name for the screenshot */
  name: string;
}

/**
 * Diagnostic information collected during test execution
 */
export interface DiagnosticInfo {
  /** Console error messages */
  errors: ConsoleMessage[];

  /** Console warning messages */
  warnings: ConsoleMessage[];

  /** External network requests */
  externalRequests: NetworkRequest[];

  /** Whether all diagnostics are clean */
  isClean: boolean;
}

/**
 * Test assertion error
 */
export class AssertionError extends Error {
  /** Expected value */
  public readonly expected: string;

  /** Actual value */
  public readonly actual: string;

  constructor(expected: string, actual: string, message?: string) {
    super(message || `Expected "${expected}" but got "${actual}"`);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

/**
 * Priority ordering for test execution
 */
export const PRIORITY_ORDER = ['P1', 'P2', 'P3'] as const;

/**
 * Type guard for priority values
 */
export function isPriority(value: string): value is 'P1' | 'P2' | 'P3' {
  return PRIORITY_ORDER.includes(value as any);
}

/**
 * Type guard for element selector types
 */
export function isAriaSelector(selector: ElementSelector): selector is { type: 'aria'; label: string } {
  return selector.type === 'aria';
}

export function isIdSelector(selector: ElementSelector): selector is { type: 'id'; value: string } {
  return selector.type === 'id';
}

export function isCssSelector(selector: ElementSelector): selector is { type: 'css'; selector: string } {
  return selector.type === 'css';
}

export function isTextSelector(selector: ElementSelector): selector is { type: 'text'; text: string } {
  return selector.type === 'text';
}

/**
 * Resource types that indicate external requests
 */
export const EXTERNAL_RESOURCE_TYPES: Set<NetworkRequest['resourceType']> = new Set([
  'xhr',
  'fetch',
]);

/**
 * Check if a URL is external (non-localhost)
 */
export function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1';
  } catch {
    return false;
  }
}

/**
 * Format duration as human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Generate timestamp string for file naming
 */
export function generateTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '').slice(0, -5); // e.g., "20260113T143022"
}

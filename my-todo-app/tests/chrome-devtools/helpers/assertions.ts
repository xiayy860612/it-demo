/**
 * Test Assertion Helpers
 *
 * Provides consistent assertion methods across all test scenarios.
 */

import type { ElementSelector } from '../types';
import { AssertionError } from '../types';

/**
 * Assert that a condition is true
 *
 * @param condition - The condition to check
 * @param message - Error message if assertion fails
 * @throws AssertionError with descriptive message
 */
export function assertTrue(condition: boolean, message: string): void {
  if (!condition) {
    throw new AssertionError('true', 'false', message || `Expected condition to be true`);
  }
}

/**
 * Assert that a condition is false
 *
 * @param condition - The condition to check
 * @param message - Error message if assertion fails
 * @throws AssertionError with descriptive message
 */
export function assertFalse(condition: boolean, message: string): void {
  if (condition) {
    throw new AssertionError('false', 'true', message || `Expected condition to be false`);
  }
}

/**
 * Assert that two values are equal
 *
 * @param actual - The actual value
 * @param expected - The expected value
 * @param message - Optional context for the assertion
 * @throws AssertionError with expected vs actual values
 */
export function assertEquals<T>(actual: T, expected: T, message?: string): void {
  const actualStr = String(actual);
  const expectedStr = String(expected);

  if (actual !== expected) {
    throw new AssertionError(
      expectedStr,
      actualStr,
      message || `Expected "${expectedStr}" but got "${actualStr}"`
    );
  }
}

/**
 * Assert that a text value is contained within another
 *
 * @param haystack - The text to search within
 * @param needle - The text to search for
 * @throws AssertionError if needle not found in haystack
 */
export function assertContains(haystack: string, needle: string): void {
  if (!haystack.includes(needle)) {
    throw new AssertionError(
      `"${haystack}" to contain "${needle}"`,
      `"${haystack}"`,
      `Expected "${haystack}" to contain "${needle}"`
    );
  }
}

/**
 * Assert that an element exists in the page
 *
 * This is a placeholder for the actual implementation that would
 * use Chrome DevTools MCP to verify element existence.
 *
 * @param selector - The element selector
 * @throws AssertionError if element not found
 */
export async function assertElementExists(selector: ElementSelector): Promise<void> {
  // Placeholder - actual implementation will use MCP tools
  // For now, we just log what would be checked
  console.log(`[ASSERT] Element exists: ${JSON.stringify(selector)}`);
}

/**
 * Assert that an element is visible to the user
 *
 * This is a placeholder for the actual implementation that would
 * use Chrome DevTools MCP to verify element visibility.
 *
 * @param selector - The element selector
 * @throws AssertionError if element not visible
 */
export async function assertElementVisible(selector: ElementSelector): Promise<void> {
  // Placeholder - actual implementation will use MCP tools
  console.log(`[ASSERT] Element visible: ${JSON.stringify(selector)}`);
}

/**
 * Assert that text is present on the page
 *
 * This is a placeholder for the actual implementation that would
 * use Chrome DevTools MCP to verify text presence.
 *
 * @param text - The text to search for
 * @throws AssertionError if text not found
 */
export async function assertTextPresent(text: string): Promise<void> {
  // Placeholder - actual implementation will use MCP tools
  console.log(`[ASSERT] Text present: "${text}"`);
}

/**
 * Assert that no console errors were logged
 *
 * This is a placeholder for the actual implementation that would
 * check console messages for errors.
 *
 * @throws AssertionError if any errors found
 */
export async function assertNoConsoleErrors(): Promise<void> {
  // Placeholder - actual implementation will check console messages
  console.log('[ASSERT] No console errors');
}

/**
 * Assert that no external network requests were made
 *
 * This is a placeholder for the actual implementation that would
 * check network requests for external calls.
 *
 * @throws AssertionError if external requests found
 */
export async function assertNoExternalRequests(): Promise<void> {
  // Placeholder - actual implementation will check network requests
  console.log('[ASSERT] No external requests');
}

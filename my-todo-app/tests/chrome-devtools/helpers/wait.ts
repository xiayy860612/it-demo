/**
 * Wait Utilities
 *
 * Handles timing and waiting for asynchronous operations.
 */

import type { ElementSelector } from '../types';

/**
 * Wait for a specified duration
 *
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for text to appear on the page
 *
 * This is a placeholder for the actual implementation that would
 * use Chrome DevTools MCP wait_for tool.
 *
 * @param text - The text to wait for
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * @throws Error if text doesn't appear within timeout
 */
export async function waitForText(text: string, timeout: number = 5000): Promise<void> {
  // Placeholder - actual implementation will use mcp__chrome-devtools__wait_for
  console.log(`[WAIT] Waiting for text: "${text}" (timeout: ${timeout}ms)`);
  await wait(100); // Small delay to simulate async check
}

/**
 * Wait for an element to appear
 *
 * This is a placeholder for the actual implementation that would
 * poll for element existence using Chrome DevTools MCP snapshots.
 *
 * @param selector - The element selector
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * @throws Error if element doesn't appear within timeout
 */
export async function waitForElement(
  selector: ElementSelector,
  timeout: number = 5000
): Promise<void> {
  // Placeholder - actual implementation will use snapshots and polling
  console.log(`[WAIT] Waiting for element: ${JSON.stringify(selector)} (timeout: ${timeout}ms)`);
  await wait(100); // Small delay to simulate async check
}

/**
 * Wait for the celebration animation to complete
 *
 * The celebration animation lasts 2 seconds per the spec.
 * This wait ensures the animation finishes before proceeding.
 */
export async function waitForCelebration(): Promise<void> {
  console.log('[WAIT] Waiting for celebration animation (2000ms)');
  // Wait for animation to complete (2 seconds per spec)
  await wait(2000);
}

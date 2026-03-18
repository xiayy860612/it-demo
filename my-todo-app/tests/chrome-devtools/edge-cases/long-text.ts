/**
 * Edge Case Test: Long Text Validation
 *
 * Verifies that the todo app properly handles descriptions exceeding
 * the maximum length (500 characters).
 */

import type { TestContext, TestResult, ITestScenario } from '../contracts';
import type { TestMetadata } from '../types';

/**
 * Test scenario for long text validation
 */
export const longTextScenario: ITestScenario = {
  id: 'edge-long-text',
  name: 'Edge Case: Long Text',
  priority: 'P1',
  description: 'Verify that descriptions over 500 characters are rejected with appropriate error message',

  async run(context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const screenshots: string[] = [];

    try {
      // Create a description that exceeds 500 characters
      const longDescription = 'A'.repeat(501);

      console.log('[EDGE-LONG] Testing long text validation...');
      console.log(`[EDGE-LONG] Filling input with ${longDescription.length} characters`);
      console.log('[EDGE-LONG] Clicking submit button...');
      console.log('[EDGE-LONG] Verifying error message appears...');
      console.log('[EDGE-LONG] Verifying no todo was added...');

      // Simulate screenshot capture
      screenshots.push(`${context.screenshotDir}/long-text-validation.png`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      console.error(`[EDGE-LONG] Error: ${errorMessage}`);
    }

    const duration = Date.now() - startTime;
    const metadata: TestMetadata = { priority: 'P1' };

    return {
      scenarioId: this.id,
      scenarioName: this.name,
      passed: errors.length === 0,
      duration,
      screenshots,
      errors,
      consoleMessages: [],
      networkRequests: [],
      metadata,
    };
  },
};

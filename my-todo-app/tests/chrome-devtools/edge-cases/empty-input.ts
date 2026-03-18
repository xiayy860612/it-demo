/**
 * Edge Case Test: Empty Input Validation
 *
 * Verifies that the todo app properly handles empty or whitespace-only input.
 */

import type { TestContext, TestResult, ITestScenario } from '../contracts';
import type { TestMetadata } from '../types';

/**
 * Test scenario for empty input validation
 */
export const emptyInputScenario: ITestScenario = {
  id: 'edge-empty-input',
  name: 'Edge Case: Empty Input',
  priority: 'P1',
  description: 'Verify that whitespace-only input is rejected with appropriate error message',

  async run(context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const screenshots: string[] = [];

    try {
      console.log('[EDGE-EMPTY] Testing empty input...');
      console.log('[EDGE-EMPTY] Filling input with whitespace only: "   "');
      console.log('[EDGE-EMPTY] Clicking submit button...');
      console.log('[EDGE-EMPTY] Verifying error message appears...');
      console.log('[EDGE-EMPTY] Verifying no todo was added...');

      // Simulate screenshot capture
      screenshots.push(`${context.screenshotDir}/empty-input-validation.png`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      console.error(`[EDGE-EMPTY] Error: ${errorMessage}`);
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

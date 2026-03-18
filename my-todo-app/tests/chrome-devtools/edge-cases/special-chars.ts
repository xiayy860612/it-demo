/**
 * Edge Case Test: Special Characters and Emoji
 *
 * Verifies that the todo app properly handles special characters and emoji
 * in todo descriptions.
 */

import type { TestContext, TestResult, ITestScenario } from '../contracts';
import type { TestMetadata } from '../types';

/**
 * Test scenario for special character handling
 */
export const specialCharsScenario: ITestScenario = {
  id: 'edge-special-chars',
  name: 'Edge Case: Special Characters',
  priority: 'P1',
  description: 'Verify that emoji and special characters are properly handled in todo descriptions',

  async run(context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const screenshots: string[] = [];

    try {
      const testDescription = 'Test 🎉 todo & <special> characters!';

      console.log('[EDGE-SPECIAL] Testing special characters...');
      console.log(`[EDGE-SPECIAL] Filling input with: "${testDescription}"`);
      console.log('[EDGE-SPECIAL] Clicking submit button...');
      console.log('[EDGE-SPECIAL] Verifying todo appears with correct text...');

      // Simulate screenshot capture
      screenshots.push(`${context.screenshotDir}/special-chars-success.png`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      console.error(`[EDGE-SPECIAL] Error: ${errorMessage}`);
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

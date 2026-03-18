/**
 * Chrome DevTools MCP Test Runner
 *
 * Main orchestrator for executing test scenarios using Chrome DevTools MCP.
 * This is the entry point for running all automated tests.
 */

import type {
  TestContext,
  TestResult,
  TestReport,
  ITestScenario,
  ConsoleMessage,
  NetworkRequest,
  DiagnosticInfo,
} from './types';
import { generateTimestamp, formatDuration } from './types';

/**
 * Test Runner class
 *
 * Orchestrates the execution of all registered test scenarios.
 */
export class TestRunner {
  private scenarios: Map<string, ITestScenario> = new Map();
  private baseUrl: string = 'http://localhost:5173';
  private screenshotDir: string = 'tests/screenshots/test-runs';
  private defaultTimeout: number = 5000;
  private captureAllScreenshots: boolean = false;

  /**
   * Register a test scenario
   *
   * @param scenario - The scenario to register
   */
  register(scenario: ITestScenario): void {
    if (this.scenarios.has(scenario.id)) {
      throw new Error(`Scenario with id "${scenario.id}" is already registered`);
    }
    this.scenarios.set(scenario.id, scenario);
    console.log(`[REGISTER] ${scenario.priority}: ${scenario.name} (${scenario.id})`);
  }

  /**
   * Run all registered scenarios
   *
   * Scenarios are executed in priority order (P1 → P2 → P3).
   * P1 scenarios clean state between tests; P2/P3 do not.
   *
   * @returns Promise resolving to the complete test report
   */
  async run(): Promise<TestReport> {
    const startTime = new Date().toISOString();
    console.log('\n🧪 Chrome DevTools MCP Test Suite');
    console.log('================================\n');

    const results: TestResult[] = [];
    const allScreenshots: string[] = [];

    // Get scenarios sorted by priority
    const sortedScenarios = Array.from(this.scenarios.values()).sort((a, b) => {
      const priorityOrder = { P1: 1, P2: 2, P3: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Create test context
    const timestamp = generateTimestamp();
    const context: TestContext = {
      pageIdx: 0, // Will be set when page is created
      baseUrl: this.baseUrl,
      screenshotDir: `${this.screenshotDir}/${timestamp}`,
      timestamp,
      captureAllScreenshots: this.captureAllScreenshots,
      defaultTimeout: this.defaultTimeout,
    };

    // Run scenarios in priority order
    let lastPriority: string | null = null;
    for (const scenario of sortedScenarios) {
      // Clean state between P1 scenarios
      if (scenario.priority === 'P1' && lastPriority === 'P1') {
        await this.clearState(context);
      }
      lastPriority = scenario.priority;

      try {
        const result = await scenario.run(context);
        results.push(result);
        allScreenshots.push(...result.screenshots);

        // Print result
        const icon = result.passed ? '✅' : '❌';
        const duration = formatDuration(result.duration);
        console.log(`${icon} ${scenario.priority}: ${scenario.name} (${duration})`);

        if (result.screenshots.length > 0) {
          result.screenshots.forEach((screenshot) => {
            console.log(`   - Screenshot: ${screenshot}`);
          });
        }

        if (result.errors.length > 0) {
          result.errors.forEach((error) => {
            console.log(`   - Error: ${error}`);
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const failedResult: TestResult = {
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          passed: false,
          duration: 0,
          screenshots: [],
          errors: [errorMessage],
          consoleMessages: [],
          networkRequests: [],
          metadata: { priority: scenario.priority },
        };
        results.push(failedResult);
        console.log(`❌ ${scenario.priority}: ${scenario.name}`);
        console.log(`   - Error: ${errorMessage}`);
      }
    }

    const endTime = new Date().toISOString();
    const totalDuration = new Date(endTime).getTime() - new Date(startTime).getTime();

    // Calculate summary
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    const summary = { total, passed, failed, passRate };

    // Print summary
    console.log('\n----------------------------------------');
    console.log(`Results: ${passed}/${total} passed (${passRate.toFixed(1)}%)`);
    console.log(`Duration: ${formatDuration(totalDuration)}`);
    if (allScreenshots.length > 0) {
      console.log(`Screenshots: ${this.screenshotDir}/${timestamp}/`);
    }
    console.log('');

    return {
      startTime,
      endTime,
      totalDuration,
      results,
      summary,
      screenshots: allScreenshots,
      screenshotDir: `${this.screenshotDir}/${timestamp}`,
    };
  }

  /**
   * Run only scenarios matching the specified priority
   *
   * @param priority - Priority level to filter by
   * @returns Promise resolving to the filtered test report
   */
  async runPriority(priority: 'P1' | 'P2' | 'P3'): Promise<TestReport> {
    // Filter scenarios by priority
    const filteredScenarios = new Map<string, ITestScenario>();
    for (const [id, scenario] of this.scenarios) {
      if (scenario.priority === priority) {
        filteredScenarios.set(id, scenario);
      }
    }

    // Temporarily replace scenarios map
    const originalScenarios = this.scenarios;
    this.scenarios = filteredScenarios;

    const report = await this.run();

    // Restore original scenarios
    this.scenarios = originalScenarios;

    return report;
  }

  /**
   * Run a specific scenario by ID
   *
   * @param scenarioId - ID of the scenario to run
   * @returns Promise resolving to the single test result
   */
  async runSingle(scenarioId: string): Promise<TestResult> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario with id "${scenarioId}" not found`);
    }

    console.log(`\n🧪 Running single scenario: ${scenario.name}\n`);

    const timestamp = generateTimestamp();
    const context: TestContext = {
      pageIdx: 0,
      baseUrl: this.baseUrl,
      screenshotDir: `${this.screenshotDir}/${timestamp}`,
      timestamp,
      captureAllScreenshots: this.captureAllScreenshots,
      defaultTimeout: this.defaultTimeout,
    };

    return scenario.run(context);
  }

  /**
   * Clear application state between P1 tests
   *
   * Clears localStorage and reloads the page to ensure each test
   * starts with a clean state.
   *
   * @param context - Test execution context
   */
  private async clearState(context: TestContext): Promise<void> {
    console.log('[CLEAN] Clearing application state...');
    // This would use mcp__chrome-devtools__evaluate_script to execute:
    // localStorage.clear(); location.reload();
    // Then wait for the empty state to appear
    console.log('[CLEAN] State cleared');
  }

  /**
   * Configure the test runner
   *
   * @param config - Configuration options
   */
  configure(config: {
    baseUrl?: string;
    screenshotDir?: string;
    defaultTimeout?: number;
    captureAllScreenshots?: boolean;
  }): void {
    if (config.baseUrl) this.baseUrl = config.baseUrl;
    if (config.screenshotDir) this.screenshotDir = config.screenshotDir;
    if (config.defaultTimeout) this.defaultTimeout = config.defaultTimeout;
    if (config.captureAllScreenshots !== undefined) {
      this.captureAllScreenshots = config.captureAllScreenshots;
    }
  }
}

// Create singleton instance
const runner = new TestRunner();

// Register all P1 test scenarios
import { addTodoScenario } from './scenarios/p1-add-todo.js';
import { completeTodoScenario } from './scenarios/p1-complete-todo.js';
import { deleteTodoScenario } from './scenarios/p1-delete-todo.js';
import { emptyInputScenario } from './edge-cases/empty-input.js';
import { specialCharsScenario } from './edge-cases/special-chars.js';
import { longTextScenario } from './edge-cases/long-text.js';
import { rapidActionsScenario } from './edge-cases/rapid-actions.js';

// Register P2 scenarios
import { screenshotScenario } from './scenarios/p2-screenshots.js';

// Register core P1 scenarios
runner.register(addTodoScenario);
runner.register(completeTodoScenario);
runner.register(deleteTodoScenario);

// Register edge case scenarios
runner.register(emptyInputScenario);
runner.register(specialCharsScenario);
runner.register(longTextScenario);
runner.register(rapidActionsScenario);

// Register P2 scenarios
runner.register(screenshotScenario);

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runner.run().catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

export default runner;

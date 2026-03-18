/**
 * Screenshot Capture Helper
 *
 * Provides consistent screenshot handling across tests.
 */

import type { ScreenshotConfig } from '../types';
import type { IScreenshotCapture } from '../contracts';

/**
 * Screenshot capture helper implementation
 */
export class ScreenshotCapture implements IScreenshotCapture {
  private screenshotDir: string;
  private timestamp: string;

  constructor(screenshotDir: string, timestamp: string) {
    this.screenshotDir = screenshotDir;
    this.timestamp = timestamp;
  }

  /**
   * Capture a screenshot with optional configuration
   *
   * @param name - Descriptive name for the screenshot (used in filename)
   * @param options - Optional capture settings
   * @returns Path to the saved screenshot file
   */
  async capture(
    name: string,
    options: Partial<{
      fullPage: boolean;
      format: 'png' | 'jpeg' | 'webp';
      quality: number;
      filePath: string;
    }> = {}
  ): Promise<string> {
    // Default configuration
    const config: ScreenshotConfig = {
      filePath:
        options.filePath ||
        `${this.screenshotDir}/${this.timestamp}_${this.sanitizeName(name)}.png`,
      fullPage: options.fullPage ?? false,
      format: options.format || 'png',
      name,
      quality: options.quality,
    };

    // This is a placeholder implementation
    // The actual implementation would use:
    // await mcp__chrome-devtools__take_screenshot({
    //   filePath: config.filePath,
    //   fullPage: config.fullPage,
    //   format: config.format,
    //   ...(config.quality && { quality: config.quality })
    // });

    console.log(`[SCREENSHOT] Capturing: ${config.filePath}`);
    return config.filePath;
  }

  /**
   * Capture a screenshot specifically for failure documentation
   *
   * @param testName - Name of the failing test
   * @returns Path to the saved screenshot file
   */
  async captureFailure(testName: string): Promise<string> {
    const filePath = `${this.screenshotDir}/${this.timestamp}_${this.sanitizeName(testName)}_FAILURE.png`;

    // This is a placeholder implementation
    // await mcp__chrome-devtools__take_screenshot({
    //   filePath: filePath,
    //   fullPage: true  // Capture full page on failure for more context
    // });

    console.log(`[SCREENSHOT] Capturing failure: ${filePath}`);
    return filePath;
  }

  /**
   * Capture a screenshot for baseline comparison
   *
   * @param stateName - Name of the application state (e.g., "empty", "populated")
   * @returns Path to the saved screenshot file
   */
  async captureBaseline(stateName: string): Promise<string> {
    const filePath = `tests/screenshots/baseline/${stateName}.png`;

    // This is a placeholder implementation
    // await mcp__chrome-devtools__take_screenshot({
    //   filePath: filePath,
    //   fullPage: false
    // });

    console.log(`[SCREENSHOT] Capturing baseline: ${filePath}`);
    return filePath;
  }

  /**
   * Sanitize a name for use in file paths
   *
   * @param name - The name to sanitize
   * @returns Sanitized name safe for file paths
   */
  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

/**
 * Factory function to create a ScreenshotCapture instance
 *
 * @param screenshotDir - Directory for saving screenshots
 * @param timestamp - Timestamp for this test run
 * @returns Configured ScreenshotCapture instance
 */
export function createScreenshotCapture(
  screenshotDir: string,
  timestamp: string
): ScreenshotCapture {
  return new ScreenshotCapture(screenshotDir, timestamp);
}

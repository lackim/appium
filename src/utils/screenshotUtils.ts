import { Browser } from 'webdriverio';
import path from 'path';
import fs from 'fs';
import logger from './logger';

/**
 * Directory where screenshots are saved
 */
const SCREENSHOT_DIR = path.resolve('./reports/screenshots');

/**
 * Ensure screenshot directory exists
 */
export function ensureScreenshotDir(): void {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    logger.info(`Created screenshot directory: ${SCREENSHOT_DIR}`);
  }
}

/**
 * Take a screenshot and save it with a unique filename
 * @param driver WebdriverIO browser instance
 * @param name Base name for the screenshot
 * @returns Path to the saved screenshot
 */
export async function takeScreenshot(driver: Browser, name: string): Promise<string> {
  try {
    ensureScreenshotDir();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filePath = path.join(SCREENSHOT_DIR, filename);
    
    await driver.saveScreenshot(filePath);
    logger.info(`Screenshot saved to: ${filePath}`);
    
    return filePath;
  } catch (error) {
    logger.error('Failed to take screenshot', error);
    return '';
  }
}

/**
 * Take a screenshot when a test fails
 * @param driver WebdriverIO browser instance
 * @param testName Name of the failing test
 * @returns Path to the saved screenshot
 */
export async function takeFailureScreenshot(driver: Browser, testName: string): Promise<string> {
  return takeScreenshot(driver, `FAIL_${testName}`);
}

/**
 * Helper to attach screenshots to test reports
 * This can be extended to support different test reporters
 */
export function attachScreenshotToReport(screenshotPath: string): void {
  // If using Jest with a custom reporter, this can be extended to attach the screenshot
  // For now, we just log the path for reference
  logger.info(`Screenshot captured: ${screenshotPath}`);
  
  // This comment could be replaced with actual reporter-specific code
  // For example, if using a Jest custom reporter:
  // global.testReporter?.addAttachment(screenshotPath, 'Screenshot');
} 
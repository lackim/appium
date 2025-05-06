import { Browser } from 'webdriverio';
import { retry, RetryConfig } from '../utils/retryUtils';
import path from 'path';
import fs from 'fs';

/**
 * Base Page Object that provides common functionality for all pages
 */
export class BasePage {
  constructor(protected driver: Browser) {}

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout = 10000): Promise<any> {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  /**
   * Wait for element to be displayed
   */
  async waitForElementToBeDisplayed(selector: string, timeout = 10000): Promise<void> {
    await this.waitForElement(selector, timeout);
  }

  /**
   * Click on an element with wait and retry
   */
  async click(selector: string, retryConfig?: RetryConfig): Promise<void> {
    await retry(async () => {
      const element = await this.waitForElement(selector);
      await element.click();
    }, retryConfig);
  }

  /**
   * Enter text into an input field with retry
   */
  async setText(selector: string, text: string, retryConfig?: RetryConfig): Promise<void> {
    await retry(async () => {
      const element = await this.waitForElement(selector);
      await element.clearValue();
      await element.setValue(text);
    }, retryConfig);
  }

  /**
   * Get text from an element with retry
   */
  async getText(selector: string, retryConfig?: RetryConfig): Promise<string> {
    return retry(async () => {
      const element = await this.waitForElement(selector);
      return element.getText();
    }, retryConfig);
  }

  /**
   * Check if element exists
   */
  async isElementDisplayed(selector: string): Promise<boolean> {
    try {
      const element = await this.driver.$(selector);
      return element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for an element with custom polling
   */
  async waitForElementWithPolling(
    selector: string, 
    timeout = 10000, 
    interval = 500
  ): Promise<any> {
    const startTime = Date.now();
    let lastError: Error | unknown;

    while (Date.now() - startTime < timeout) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          return element;
        }
      } catch (error) {
        lastError = error;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Element ${selector} not found after ${timeout}ms: ${lastError}`);
  }

  /**
   * Take screenshot and save to reports directory
   */
  async takeScreenshot(name: string): Promise<string> {
    const screenshotDir = path.resolve('reports/screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filePath = path.join(screenshotDir, filename);
    
    await this.driver.saveScreenshot(filePath);
    return filePath;
  }

  /**
   * Swipe on the screen (vertical)
   */
  async swipeVertical(startPercentage: number, endPercentage: number, durationMs = 800): Promise<void> {
    const { width, height } = await this.driver.getWindowSize();
    const startY = height * startPercentage;
    const endY = height * endPercentage;
    const centerX = width / 2;

    await this.driver.touchAction([
      { action: 'press', x: centerX, y: startY },
      { action: 'wait', ms: durationMs },
      { action: 'moveTo', x: centerX, y: endY },
      { action: 'release' }
    ]);
  }

  /**
   * Swipe up on the screen
   */
  async swipeUp(distance = 0.7, durationMs = 800): Promise<void> {
    await this.swipeVertical(0.7, 0.3, durationMs);
  }

  /**
   * Swipe down on the screen
   */
  async swipeDown(distance = 0.7, durationMs = 800): Promise<void> {
    await this.swipeVertical(0.3, 0.7, durationMs);
  }
} 
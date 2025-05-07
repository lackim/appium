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
  async waitForElement(selector: string, timeout = 30000): Promise<any> {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  /**
   * Wait for element to be displayed with timeout
   */
  async waitForElementToBeDisplayed(selector: string, timeout = 30000): Promise<void> {
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
   * Check if element exists and is displayed, with a built-in wait.
   */
  async isElementDisplayed(selector: string, timeout = 5000): Promise<boolean> {
    try {
      const element = await this.driver.$(selector);
      await element.waitForDisplayed({ timeout });
      return true;
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

  /**
   * Take a screenshot for debugging purposes
   */
  async takeDebugScreenshot(name: string): Promise<string> {
    try {
      // Ensure screenshots directory exists
      const screenshotDir = './screenshots';
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      // Create a timestamp-based filename with sanitized name
      const timestamp = Date.now();
      const sanitizedName = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const filename = `${screenshotDir}/debug-${sanitizedName}-${timestamp}.png`;
      
      // Save the screenshot
      await this.driver.saveScreenshot(filename);
      console.log(`✓ Debug screenshot saved: ${name}`);
      return filename;
    } catch (error) {
      console.error(`Failed to take debug screenshot: ${error}`);
      throw error;
    }
  }

  /**
   * Check if element exists (without waiting for it to be displayed)
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      const element = await this.driver.$(selector);
      return await element.isExisting();
    } catch (error) {
      return false;
    }
  }

  /**
   * Retry an action with exponential backoff
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    baseDelayMs = 500
  ): Promise<T> {
    let lastError: Error | unknown;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Wait for a condition to be true
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs = 10000,
    intervalMs = 500,
    message = 'Condition not met within timeout'
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    
    throw new Error(message);
  }

  /**
   * Pause execution for a specified time
   * This can be used to stabilize UI state between operations
   */
  async pause(milliseconds: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  
  /**
   * Standardized method to navigate to cart that can be used from any page
   * This provides consistent cart navigation across the entire test suite
   */
  async navigateToCart(maxRetries = 3): Promise<void> {
    const cartSelectors = [
      '~test-Cart',                                // Standard cart icon
      '//XCUIElementTypeOther[contains(@name, "Cart")]',  // XPath for cart
      '//XCUIElementTypeOther[contains(@name, "test-Cart")]'  // Another variant
    ];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Take screenshot before attempting to navigate to cart
        await this.takeDebugScreenshot(`navigate-to-cart-attempt-${attempt + 1}`);
        
        // Try each selector
        for (const selector of cartSelectors) {
          try {
            const isXPath = selector.startsWith('//') || selector.startsWith('(//');
            
            // Check if element is displayed
            const element = await this.driver.$(selector);
            if (await element.isDisplayed()) {
              // Click the element
              await element.click();
              await this.pause(2000);
              return;
            }
          } catch (error) {
            // Continue to the next selector
            console.log(`Cart selector ${selector} not found or not clickable`);
          }
        }
        
        // If we reach here, we couldn't find a suitable cart element
        await this.pause(1000);
      } catch (error) {
        await this.takeDebugScreenshot(`navigate-to-cart-error-${attempt + 1}`);
        if (attempt === maxRetries - 1) {
          throw new Error(`Failed to navigate to cart after ${maxRetries} attempts: ${error}`);
        }
        // Wait before next attempt
        await this.pause(1000);
      }
    }
    
    throw new Error('Failed to navigate to cart: no cart element found');
  }
} 
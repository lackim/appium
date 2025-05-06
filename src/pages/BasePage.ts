import { Browser, Element } from 'webdriverio';

/**
 * Base Page Object that provides common functionality for all pages
 */
export class BasePage {
  constructor(protected driver: Browser) {}

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout = 10000): Promise<Element> {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  /**
   * Click on an element with wait
   */
  async click(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  /**
   * Enter text into an input field
   */
  async setText(selector: string, text: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.clearValue();
    await element.setValue(text);
  }

  /**
   * Get text from an element
   */
  async getText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return element.getText();
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
} 
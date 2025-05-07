import { BasePage } from './BasePage';
import logger from '../utils/logger';
import { CREDENTIALS } from '../test-data/credentials'; // Corrected import path

/**
 * Page object representing the Login page in the SauceLabs Mobile App
 */
export class LoginPage extends BasePage {
  // Element selectors - using accessibility IDs (preferred)
  private usernameField = '~test-Username';
  private passwordField = '~test-Password';
  private loginButton = '~test-LOGIN';
  private errorMessage = '~test-Error message';
  
  // Alternative selectors if accessibility IDs don't work
  private usernameFieldXPath = '//XCUIElementTypeTextField[@name="Username"]';
  private passwordFieldXPath = '//XCUIElementTypeSecureTextField[@name="Password"]';
  private loginButtonXPath = '//XCUIElementTypeOther[@name="LOGIN"]';

  /**
   * Wait for element and send keys
   */
  private async waitAndSendKeys(selector: string, text: string): Promise<void> {
    await this.setText(selector, text);
  }

  /**
   * Wait for element and click
   */
  private async waitAndClick(selector: string): Promise<void> {
    await this.click(selector);
  }

  /**
   * Get text from element
   */
  private async getElementText(selector: string): Promise<string> {
    return await this.getText(selector);
  }

  /**
   * Login with provided credentials
   */
  async login(username: string, password: string, maxRetries = 3): Promise<void> {
    try {
      logger.info(`Logging in with username: ${username}`);
      
      // Wait for login form
      await this.waitForPageToLoad();
      await this.pause(1000);
      
      // Enter username
      const usernameField = await this.waitForElement(this.usernameField);
      await usernameField.clearValue();
      await usernameField.clearValue(); // Double clear for reliability
      await usernameField.setValue(username);
      await this.pause(500);
      
      // Enter password
      const passwordField = await this.waitForElement(this.passwordField);
      await passwordField.clearValue();
      await passwordField.clearValue(); // Double clear for reliability
      await passwordField.setValue(password);
      await this.pause(500);
      
      // Click login button
      await this.click(this.loginButton);
      
      // Allow time for login to process
      await this.pause(1000);
    } catch (error) {
      // Take a debug screenshot if login fails
      await this.takeDebugScreenshot('login-failure');
      throw new Error(`Login failed: ${error}`);
    }
  }

  /**
   * Check if the login error message is displayed
   * @returns True if error message is displayed, false otherwise
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementDisplayed(this.errorMessage);
  }

  /**
   * Get the text of the error message
   * @returns Text of the error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Login with standard user credentials
   */
  async loginAsStandardUser(): Promise<void> {
    await this.login(CREDENTIALS.STANDARD_USER.USERNAME, CREDENTIALS.STANDARD_USER.PASSWORD);
  }

  /**
   * Login with locked out user credentials
   */
  async loginAsLockedOutUser(): Promise<void> {
    await this.login(CREDENTIALS.LOCKED_OUT_USER.USERNAME, CREDENTIALS.LOCKED_OUT_USER.PASSWORD);
  }

  /**
   * Login with problem user credentials
   */
  async loginAsProblemUser(): Promise<void> {
    await this.login(CREDENTIALS.PROBLEM_USER.USERNAME, CREDENTIALS.PROBLEM_USER.PASSWORD);
  }

  /**
   * Check if the login page is displayed
   * @returns True if login page is displayed, false otherwise
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.isElementDisplayed(this.usernameField);
  }

  /**
   * Wait for the login page to load
   * This will wait until the username field is displayed
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.usernameField);
  }
} 
import { BasePage } from './BasePage';
import logger from '../utils/logger';

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
   * Login with the provided credentials
   * @param username - Username to enter
   * @param password - Password to enter
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in with username: ${username}`);
    await this.waitAndSendKeys(this.usernameField, username);
    await this.waitAndSendKeys(this.passwordField, password);
    await this.waitAndClick(this.loginButton);
    await this.driver.pause(1000); // Wait for animation/transition
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
    await this.login('standard_user', 'secret_sauce');
  }

  /**
   * Login with locked out user credentials
   */
  async loginAsLockedOutUser(): Promise<void> {
    await this.login('locked_out_user', 'secret_sauce');
  }

  /**
   * Login with problem user credentials
   */
  async loginAsProblemUser(): Promise<void> {
    await this.login('problem_user', 'secret_sauce');
  }

  /**
   * Check if the login page is displayed
   * @returns True if login page is displayed, false otherwise
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.isElementDisplayed(this.usernameField);
  }
} 
import { BasePage } from './BasePage';
import { CustomerInfo } from '../types';

/**
 * Checkout Information Page Object - represents the user information form screen
 */
export class CheckoutInfoPage extends BasePage {
  private selectors = {
    firstNameInput: '~test-First Name',
    lastNameInput: '~test-Last Name',
    postalCodeInput: '~test-Zip/Postal Code',
    continueButton: '~test-CONTINUE',
    cancelButton: '~test-CANCEL',
    errorMessage: '~test-Error message',
    checkoutScreen: '~test-Checkout: Your Info'
  };

  /**
   * Wait for checkout info page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.selectors.checkoutScreen);
  }

  /**
   * Fill the checkout information form with minimum required fields
   * (only first name, last name, and postal code are required)
   */
  async fillCheckoutInfo(checkoutInfo: CustomerInfo): Promise<void> {
    await this.setText(this.selectors.firstNameInput, checkoutInfo.firstName);
    await this.setText(this.selectors.lastNameInput, checkoutInfo.lastName);
    await this.setText(this.selectors.postalCodeInput, checkoutInfo.zipCode);
  }

  /**
   * Continue to the next checkout step
   */
  async continue(): Promise<void> {
    await this.click(this.selectors.continueButton);
  }

  /**
   * Cancel checkout process
   */
  async cancel(): Promise<void> {
    await this.click(this.selectors.cancelButton);
  }

  /**
   * Fill form and continue
   */
  async fillAndContinue(checkoutInfo: CustomerInfo): Promise<void> {
    await this.fillCheckoutInfo(checkoutInfo);
    await this.continue();
  }

  /**
   * Get error message text (if any)
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementDisplayed(this.selectors.errorMessage)) {
      return this.getText(this.selectors.errorMessage);
    }
    return '';
  }
} 
import { BasePage } from './BasePage';
import { CustomerInfo } from '../types';

/**
 * Checkout Information Page Object - represents the user information form screen
 */
export class CheckoutInfoPage extends BasePage {
  private selectors = {
    firstNameInput: '~first-name-input',
    lastNameInput: '~last-name-input',
    addressInput: '~address-input',
    cityInput: '~city-input',
    stateInput: '~state-input',
    zipCodeInput: '~zip-code-input',
    phoneInput: '~phone-input',
    emailInput: '~email-input',
    continueButton: '~continue-button',
    cancelButton: '~cancel-button',
    errorMessage: '~error-message'
  };

  /**
   * Fill the checkout information form
   */
  async fillCheckoutInfo(checkoutInfo: CustomerInfo): Promise<void> {
    await this.setText(this.selectors.firstNameInput, checkoutInfo.firstName);
    await this.setText(this.selectors.lastNameInput, checkoutInfo.lastName);
    await this.setText(this.selectors.addressInput, checkoutInfo.address);
    await this.setText(this.selectors.cityInput, checkoutInfo.city);
    await this.setText(this.selectors.stateInput, checkoutInfo.state);
    await this.setText(this.selectors.zipCodeInput, checkoutInfo.zipCode);
    await this.setText(this.selectors.phoneInput, checkoutInfo.phone);
    await this.setText(this.selectors.emailInput, checkoutInfo.email);
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
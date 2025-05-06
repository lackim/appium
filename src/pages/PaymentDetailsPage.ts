import { BasePage } from './BasePage';
import { PaymentInfo } from '../types';

/**
 * Payment Details Page Object - represents the payment information form screen
 */
export class PaymentDetailsPage extends BasePage {
  private selectors = {
    cardNumberInput: '~card-number-input',
    expirationDateInput: '~expiration-date-input',
    cvvInput: '~cvv-input',
    cardHolderNameInput: '~card-holder-name-input',
    billingAddressCheckbox: '~billing-address-same-checkbox',
    billingAddressInput: '~billing-address-input',
    billingCityInput: '~billing-city-input',
    billingStateInput: '~billing-state-input',
    billingZipCodeInput: '~billing-zip-code-input',
    reviewOrderButton: '~review-order-button',
    backButton: '~back-button',
    errorMessage: '~payment-error-message'
  };

  /**
   * Fill the payment information form
   */
  async fillPaymentInfo(paymentInfo: PaymentInfo): Promise<void> {
    await this.setText(this.selectors.cardNumberInput, paymentInfo.cardNumber);
    await this.setText(this.selectors.expirationDateInput, paymentInfo.expirationDate);
    await this.setText(this.selectors.cvvInput, paymentInfo.cvv);
    await this.setText(this.selectors.cardHolderNameInput, paymentInfo.cardHolderName);

    if (paymentInfo.useSameAddress === false) {
      await this.click(this.selectors.billingAddressCheckbox);
      
      if (paymentInfo.billingAddress) {
        await this.setText(this.selectors.billingAddressInput, paymentInfo.billingAddress);
      }
      
      if (paymentInfo.billingCity) {
        await this.setText(this.selectors.billingCityInput, paymentInfo.billingCity);
      }
      
      if (paymentInfo.billingState) {
        await this.setText(this.selectors.billingStateInput, paymentInfo.billingState);
      }
      
      if (paymentInfo.billingZipCode) {
        await this.setText(this.selectors.billingZipCodeInput, paymentInfo.billingZipCode);
      }
    }
  }

  /**
   * Navigate to order review
   */
  async reviewOrder(): Promise<void> {
    await this.click(this.selectors.reviewOrderButton);
  }

  /**
   * Go back to checkout information page
   */
  async goBack(): Promise<void> {
    await this.click(this.selectors.backButton);
  }

  /**
   * Fill payment details and proceed to review
   */
  async fillAndReview(paymentInfo: PaymentInfo): Promise<void> {
    await this.fillPaymentInfo(paymentInfo);
    await this.reviewOrder();
  }

  /**
   * Get error message if present
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementDisplayed(this.selectors.errorMessage)) {
      return this.getText(this.selectors.errorMessage);
    }
    return '';
  }
} 
import { BasePage } from './BasePage';
import { PaymentInfo } from '../types';

/**
 * Payment Details Page Object - represents the checkout overview screen
 * Note: The sample app doesn't have a separate payment form, 
 * it jumps directly to the checkout overview after entering customer info
 */
export class PaymentDetailsPage extends BasePage {
  private selectors = {
    finishButton: '~test-FINISH',
    cancelButton: '~test-CANCEL',
    checkoutOverviewScreen: '~test-CHECKOUT: OVERVIEW',
    paymentInfoLabel: '~test-Payment Information:',
    shippingInfoLabel: '~test-Shipping Information:',
    itemTotal: '~test-Item total:',
    tax: '~test-Tax:',
    total: '~test-Total:',
    cartItems: '~test-Item'
  };

  /**
   * Wait for payment/checkout overview page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.selectors.checkoutOverviewScreen);
  }

  /**
   * Proceed to finish the order
   */
  async finishOrder(): Promise<void> {
    await this.click(this.selectors.finishButton);
  }

  /**
   * Cancel the order
   */
  async cancel(): Promise<void> {
    await this.click(this.selectors.cancelButton);
  }

  /**
   * Get payment information text
   */
  async getPaymentInfo(): Promise<string> {
    return this.getText(this.selectors.paymentInfoLabel);
  }

  /**
   * Get shipping information text
   */
  async getShippingInfo(): Promise<string> {
    return this.getText(this.selectors.shippingInfoLabel);
  }

  /**
   * Get item total amount
   */
  async getItemTotal(): Promise<string> {
    return this.getText(this.selectors.itemTotal);
  }

  /**
   * Get tax amount
   */
  async getTax(): Promise<string> {
    return this.getText(this.selectors.tax);
  }

  /**
   * Get total amount
   */
  async getTotal(): Promise<string> {
    return this.getText(this.selectors.total);
  }

  /**
   * Get number of items in the checkout overview
   */
  async getItemCount(): Promise<number> {
    try {
      const items = await this.driver.$$(this.selectors.cartItems);
      return items.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Fill payment details and proceed to review
   * This is a utility method for the sample app that might not have actual payment fields
   * but just review the information before finalizing the order
   */
  async fillAndReview(paymentInfo: PaymentInfo): Promise<void> {
    // In the sample app, we might not have actual payment form fields
    // This is just a helper method to wait for the page to load and proceed
    await this.waitForPageToLoad();
    
    // Log payment info being used (for debugging)
    console.log(`Using payment info: ${JSON.stringify(paymentInfo)}`);
    
    // In a real app, we would fill in credit card details, etc.
    // For the sample app, we just proceed to finish
    await this.finishOrder();
  }
} 
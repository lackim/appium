import { BasePage } from './BasePage';
import { OrderSummary } from '../types';

/**
 * Order Summary Page Object - Note: In the sample app, this is the same as PaymentDetailsPage
 * This class is maintained for compatibility with the existing test structure
 */
export class OrderSummaryPage extends BasePage {
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
   * Wait for page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.selectors.checkoutOverviewScreen);
  }

  /**
   * Get subtotal amount (item total in the app)
   */
  async getSubtotalAmount(): Promise<string> {
    return this.getText(this.selectors.itemTotal);
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<string> {
    return this.getText(this.selectors.tax);
  }

  /**
   * Get total order amount
   */
  async getTotalAmount(): Promise<string> {
    return this.getText(this.selectors.total);
  }

  /**
   * Get shipping information
   */
  async getShippingInfo(): Promise<string> {
    return this.getText(this.selectors.shippingInfoLabel);
  }

  /**
   * Get payment information
   */
  async getPaymentInfo(): Promise<string> {
    return this.getText(this.selectors.paymentInfoLabel);
  }

  /**
   * Extract complete order summary data
   */
  async extractOrderSummary(): Promise<OrderSummary> {
    return {
      subtotal: await this.getSubtotalAmount(),
      tax: await this.getTaxAmount(),
      shipping: 'FREE PONY EXPRESS DELIVERY!', // Hardcoded as in the app
      total: await this.getTotalAmount()
    };
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    await this.click(this.selectors.finishButton);
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.click(this.selectors.cancelButton);
  }

  /**
   * Verify if order information is correct
   */
  async verifyOrderInfo(expectedInfo: Partial<OrderSummary>): Promise<boolean> {
    let isValid = true;
    
    if (expectedInfo.subtotal) {
      isValid = isValid && (await this.getSubtotalAmount()).includes(expectedInfo.subtotal);
    }
    
    if (expectedInfo.tax) {
      isValid = isValid && (await this.getTaxAmount()).includes(expectedInfo.tax);
    }
    
    if (expectedInfo.total) {
      isValid = isValid && (await this.getTotalAmount()).includes(expectedInfo.total);
    }
    
    return isValid;
  }
} 
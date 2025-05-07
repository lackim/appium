import { BasePage } from './BasePage';
import { OrderConfirmation } from '../types';

/**
 * Order Confirmation Page Object - represents the final order confirmation screen
 */
export class OrderConfirmationPage extends BasePage {
  private selectors = {
    completeHeader: '~test-THANK YOU FOR YOU ORDER',
    completeText: '~test-Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    backHomeButton: '~test-BACK HOME',
    checkoutCompletePage: '~test-CHECKOUT: COMPLETE!'
  };

  /**
   * Wait for confirmation page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.selectors.checkoutCompletePage);
  }

  /**
   * Get order confirmation message (header)
   */
  async getConfirmationHeader(): Promise<string> {
    return this.getText(this.selectors.completeHeader);
  }

  /**
   * Get order confirmation text
   */
  async getConfirmationText(): Promise<string> {
    return this.getText(this.selectors.completeText);
  }

  /**
   * Get complete order confirmation data
   * Note: In the sample app, there is no order number, date or other details
   */
  async getOrderConfirmation(): Promise<OrderConfirmation> {
    return {
      orderNumber: 'N/A',
      orderDate: new Date().toISOString(),
      orderTotal: 'N/A',
      deliveryDate: 'N/A'
    };
  }

  /**
   * Return to home page
   */
  async backToHome(): Promise<void> {
    await this.click(this.selectors.backHomeButton);
  }

  /**
   * Verify order was placed successfully
   */
  async isOrderSuccessful(): Promise<boolean> {
    const header = await this.getConfirmationHeader();
    return header.includes('THANK YOU');
  }
  
  /**
   * Check if confirmation screen is displayed
   */
  async isConfirmationDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.selectors.completeHeader);
  }
} 
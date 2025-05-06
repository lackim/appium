import { BasePage } from './BasePage';

/**
 * Order Confirmation Page Object - represents the final order confirmation screen
 */
export class OrderConfirmationPage extends BasePage {
  private selectors = {
    confirmationMessage: '~confirmation-message',
    orderNumber: '~order-number',
    orderDate: '~order-date',
    orderTotal: '~order-total',
    shippingAddress: '~shipping-address',
    paymentMethod: '~payment-method',
    deliveryDate: '~delivery-date',
    continueShoppingButton: '~continue-shopping-button',
    viewOrderDetailsButton: '~view-order-details-button'
  };

  /**
   * Get order confirmation message
   */
  async getConfirmationMessage(): Promise<string> {
    return this.getText(this.selectors.confirmationMessage);
  }

  /**
   * Get order number
   */
  async getOrderNumber(): Promise<string> {
    return this.getText(this.selectors.orderNumber);
  }

  /**
   * Get order date
   */
  async getOrderDate(): Promise<string> {
    return this.getText(this.selectors.orderDate);
  }

  /**
   * Get order total
   */
  async getOrderTotal(): Promise<string> {
    return this.getText(this.selectors.orderTotal);
  }

  /**
   * Get shipping address
   */
  async getShippingAddress(): Promise<string> {
    return this.getText(this.selectors.shippingAddress);
  }

  /**
   * Get payment method
   */
  async getPaymentMethod(): Promise<string> {
    return this.getText(this.selectors.paymentMethod);
  }

  /**
   * Get estimated delivery date
   */
  async getDeliveryDate(): Promise<string> {
    return this.getText(this.selectors.deliveryDate);
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.click(this.selectors.continueShoppingButton);
  }

  /**
   * View order details
   */
  async viewOrderDetails(): Promise<void> {
    await this.click(this.selectors.viewOrderDetailsButton);
  }

  /**
   * Verify order was placed successfully
   */
  async isOrderSuccessful(): Promise<boolean> {
    const confirmationMsg = await this.getConfirmationMessage();
    return confirmationMsg.toLowerCase().includes('success') ||
           confirmationMsg.toLowerCase().includes('thank you');
  }
} 
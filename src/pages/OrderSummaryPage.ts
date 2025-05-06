import { BasePage } from './BasePage';
import { OrderSummary } from '../types';

/**
 * Order Summary Page Object - represents the order summary review screen
 */
export class OrderSummaryPage extends BasePage {
  private selectors = {
    orderItems: '~order-item',
    itemTitle: '~item-title',
    itemPrice: '~item-price',
    itemQuantity: '~item-quantity',
    subtotalAmount: '~subtotal-amount',
    taxAmount: '~tax-amount',
    shippingAmount: '~shipping-amount',
    totalAmount: '~total-amount',
    shippingInfo: '~shipping-info',
    paymentInfo: '~payment-info',
    placeOrderButton: '~place-order-button',
    backButton: '~back-button'
  };

  /**
   * Get subtotal amount
   */
  async getSubtotalAmount(): Promise<string> {
    return this.getText(this.selectors.subtotalAmount);
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<string> {
    return this.getText(this.selectors.taxAmount);
  }

  /**
   * Get shipping amount
   */
  async getShippingAmount(): Promise<string> {
    return this.getText(this.selectors.shippingAmount);
  }

  /**
   * Get total order amount
   */
  async getTotalAmount(): Promise<string> {
    return this.getText(this.selectors.totalAmount);
  }

  /**
   * Get shipping information
   */
  async getShippingInfo(): Promise<string> {
    return this.getText(this.selectors.shippingInfo);
  }

  /**
   * Get payment information
   */
  async getPaymentInfo(): Promise<string> {
    return this.getText(this.selectors.paymentInfo);
  }

  /**
   * Extract complete order summary data
   */
  async extractOrderSummary(): Promise<OrderSummary> {
    return {
      subtotal: await this.getSubtotalAmount(),
      tax: await this.getTaxAmount(),
      shipping: await this.getShippingAmount(),
      total: await this.getTotalAmount()
    };
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    await this.click(this.selectors.placeOrderButton);
  }

  /**
   * Go back to payment details
   */
  async goBack(): Promise<void> {
    await this.click(this.selectors.backButton);
  }

  /**
   * Verify if order information is correct
   */
  async verifyOrderInfo(expectedInfo: Partial<OrderSummary>): Promise<boolean> {
    let isValid = true;
    
    if (expectedInfo.subtotal) {
      isValid = isValid && (await this.getSubtotalAmount() === expectedInfo.subtotal);
    }
    
    if (expectedInfo.tax) {
      isValid = isValid && (await this.getTaxAmount() === expectedInfo.tax);
    }
    
    if (expectedInfo.shipping) {
      isValid = isValid && (await this.getShippingAmount() === expectedInfo.shipping);
    }
    
    if (expectedInfo.total) {
      isValid = isValid && (await this.getTotalAmount() === expectedInfo.total);
    }
    
    return isValid;
  }
} 
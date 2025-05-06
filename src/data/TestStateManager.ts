import { CustomerInfo, PaymentInfo, OrderSummary, OrderConfirmation } from '../types';
import { Product } from './generators/productDataGenerator';

/**
 * Manages the state across test steps
 * This allows tests to maintain and share data between steps
 */
export class TestStateManager {
  private static instance: TestStateManager;
  
  // Current test's state
  private currentProduct: Product | null = null;
  private currentCustomer: CustomerInfo | null = null;
  private currentPayment: PaymentInfo | null = null;
  private orderSummary: OrderSummary | null = null;
  private orderConfirmation: OrderConfirmation | null = null;
  
  // Test metadata
  private testId: string = '';
  private testStartTime: Date | null = null;
  private customData: Record<string, any> = {};

  /**
   * Get the singleton instance
   */
  static getInstance(): TestStateManager {
    if (!TestStateManager.instance) {
      TestStateManager.instance = new TestStateManager();
    }
    return TestStateManager.instance;
  }

  /**
   * Initialize a new test, clearing previous state
   * @param testId Identifier for the test
   */
  initTest(testId: string): void {
    this.resetState();
    this.testId = testId;
    this.testStartTime = new Date();
  }

  /**
   * Reset all state data
   */
  resetState(): void {
    this.currentProduct = null;
    this.currentCustomer = null;
    this.currentPayment = null;
    this.orderSummary = null;
    this.orderConfirmation = null;
    this.testId = '';
    this.testStartTime = null;
    this.customData = {};
  }

  /**
   * Set the current product being tested
   */
  setCurrentProduct(product: Product): void {
    this.currentProduct = product;
  }

  /**
   * Get the current product
   */
  getCurrentProduct(): Product | null {
    return this.currentProduct;
  }

  /**
   * Set the customer information
   */
  setCustomerInfo(customer: CustomerInfo): void {
    this.currentCustomer = customer;
  }

  /**
   * Get the current customer information
   */
  getCustomerInfo(): CustomerInfo | null {
    return this.currentCustomer;
  }

  /**
   * Set the payment information
   */
  setPaymentInfo(payment: PaymentInfo): void {
    this.currentPayment = payment;
  }

  /**
   * Get the current payment information
   */
  getPaymentInfo(): PaymentInfo | null {
    return this.currentPayment;
  }

  /**
   * Set the order summary
   */
  setOrderSummary(summary: OrderSummary): void {
    this.orderSummary = summary;
  }

  /**
   * Get the current order summary
   */
  getOrderSummary(): OrderSummary | null {
    return this.orderSummary;
  }

  /**
   * Set the order confirmation
   */
  setOrderConfirmation(confirmation: OrderConfirmation): void {
    this.orderConfirmation = confirmation;
  }

  /**
   * Get the order confirmation
   */
  getOrderConfirmation(): OrderConfirmation | null {
    return this.orderConfirmation;
  }

  /**
   * Store custom data with a key
   */
  setCustomData(key: string, value: any): void {
    this.customData[key] = value;
  }

  /**
   * Retrieve custom data by key
   */
  getCustomData(key: string): any {
    return this.customData[key];
  }

  /**
   * Get test metadata
   */
  getTestMetadata(): { testId: string; startTime: Date | null; duration: number | null } {
    return {
      testId: this.testId,
      startTime: this.testStartTime,
      duration: this.testStartTime ? (new Date().getTime() - this.testStartTime.getTime()) : null
    };
  }
} 
import { CustomerInfo, PaymentInfo } from '../../types';
import { CustomerDataGenerator, PaymentDataGenerator, Product, ProductDataGenerator } from '../generators';

/**
 * Interface for complete checkout data
 */
export interface CheckoutTestData {
  product: Product;
  customer: CustomerInfo;
  payment: PaymentInfo;
  description: string;
}

/**
 * Interface for checkout data with multiple products
 */
export interface MultipleItemsCheckoutTestData {
  products: Product[];
  customer: CustomerInfo;
  payment: PaymentInfo;
  description: string;
}

/**
 * Provides data sets for checkout tests
 */
export class CheckoutDataProvider {
  /**
   * Get data for a happy path checkout test
   */
  static getHappyPathData(): CheckoutTestData {
    return {
      product: ProductDataGenerator.getRandomProduct(),
      customer: CustomerDataGenerator.generateValidCustomer(),
      payment: PaymentDataGenerator.generateValidPayment(),
      description: 'Valid checkout with standard shipping and same billing address'
    };
  }

  /**
   * Get data for a checkout test with multiple products
   */
  static getMultipleItemsData(): MultipleItemsCheckoutTestData {
    // Get 2-3 random products to add to cart
    const allProducts = ProductDataGenerator.getAllProducts();
    const selectedProducts = allProducts.slice(0, 3); // Take first 3 products
    
    return {
      products: selectedProducts,
      customer: CustomerDataGenerator.generateValidCustomer(),
      payment: PaymentDataGenerator.generateValidPayment(),
      description: 'Checkout with multiple items in cart'
    };
  }

  /**
   * Get data for multiple checkout test scenarios
   */
  static getCheckoutTestCases(): CheckoutTestData[] {
    return [
      // Happy path with same billing address
      {
        product: ProductDataGenerator.getProduct('1') as Product,
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generateValidPayment('visa'),
        description: 'Valid checkout with Visa card and same billing address'
      },
      // Different billing address
      {
        product: ProductDataGenerator.getProduct('2') as Product,
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generatePaymentWithDifferentBillingAddress(),
        description: 'Valid checkout with different billing address'
      },
      // Different card types
      {
        product: ProductDataGenerator.getProduct('3') as Product,
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generateValidPayment('mastercard'),
        description: 'Valid checkout with MasterCard'
      },
      {
        product: ProductDataGenerator.getProduct('4') as Product,
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generateValidPayment('amex'),
        description: 'Valid checkout with American Express'
      },
      {
        product: ProductDataGenerator.getProduct('5') as Product,
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generateValidPayment('discover'),
        description: 'Valid checkout with Discover card'
      }
    ];
  }

  /**
   * Get data for invalid checkout tests (form validation)
   */
  static getInvalidCheckoutTestCases(): CheckoutTestData[] {
    return [
      // Missing customer fields
      {
        product: ProductDataGenerator.getRandomProduct(),
        customer: CustomerDataGenerator.generateInvalidCustomer(['firstName']),
        payment: PaymentDataGenerator.generateValidPayment(),
        description: 'Checkout with missing first name'
      },
      {
        product: ProductDataGenerator.getRandomProduct(),
        customer: CustomerDataGenerator.generateInvalidCustomer(['email']),
        payment: PaymentDataGenerator.generateValidPayment(),
        description: 'Checkout with missing email'
      },
      // Missing payment fields
      {
        product: ProductDataGenerator.getRandomProduct(),
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generateInvalidPayment(['cardNumber']),
        description: 'Checkout with missing card number'
      },
      {
        product: ProductDataGenerator.getRandomProduct(),
        customer: CustomerDataGenerator.generateValidCustomer(),
        payment: PaymentDataGenerator.generateInvalidPayment(['cvv']),
        description: 'Checkout with missing CVV'
      }
    ];
  }
} 
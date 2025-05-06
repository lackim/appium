import { ElementArray } from '@wdio/protocols';

declare namespace WebdriverIO {
  interface Browser {
    // Add any custom browser methods here
  }

  interface Element {
    // Add any custom element methods here
  }
}

// Custom type definitions for the application
interface ProductDetails {
  name: string;
  description?: string;
  price: string;
  quantity?: number;
}

interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
} 
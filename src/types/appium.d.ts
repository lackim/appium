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

// Removing conflicting global interface declarations.
// These types are now imported from './checkout.types.ts' via './index.ts'.
// interface CheckoutInfo {
//   firstName: string;
//   lastName: string;
//   postalCode: string;
// }
// 
// interface PaymentInfo {
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
// } 
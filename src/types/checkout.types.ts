/**
 * Customer information for checkout
 */
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

/**
 * Payment information for checkout
 */
export interface PaymentInfo {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardHolderName: string;
  useSameAddress?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
}

/**
 * Order summary information
 */
export interface OrderSummary {
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
}

/**
 * Order confirmation details
 */
export interface OrderConfirmation {
  orderNumber: string;
  orderDate: string;
  orderTotal: string;
  deliveryDate: string;
} 
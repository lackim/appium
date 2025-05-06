import { PaymentInfo } from '../../types';

/**
 * Generates random payment data for testing
 */
export class PaymentDataGenerator {
  // Valid test card numbers by card type
  private static readonly CARD_TYPES = {
    visa: '4111111111111111',
    mastercard: '5555555555554444',
    amex: '378282246310005',
    discover: '6011111111111117'
  };

  /**
   * Generate valid payment information
   * @param cardType The type of card to generate (visa, mastercard, amex, discover)
   */
  static generateValidPayment(cardType: keyof typeof PaymentDataGenerator.CARD_TYPES = 'visa'): PaymentInfo {
    const currentYear = new Date().getFullYear();
    const expirationYear = currentYear + Math.floor(Math.random() * 5) + 1;
    const expirationMonth = Math.floor(Math.random() * 12) + 1;
    
    return {
      cardNumber: this.CARD_TYPES[cardType],
      expirationDate: `${expirationMonth.toString().padStart(2, '0')}/${expirationYear.toString().slice(-2)}`,
      cvv: cardType === 'amex' ? this.generateRandomDigits(4) : this.generateRandomDigits(3),
      cardHolderName: `Test ${cardType.toUpperCase()} User`,
      useSameAddress: true
    };
  }
  
  /**
   * Generate payment information with separate billing address
   */
  static generatePaymentWithDifferentBillingAddress(): PaymentInfo {
    const payment = this.generateValidPayment();
    const id = Math.floor(Math.random() * 10000);
    
    return {
      ...payment,
      useSameAddress: false,
      billingAddress: `${200 + id} Second Street`,
      billingCity: 'New York',
      billingState: 'NY',
      billingZipCode: `10${this.generateRandomDigits(3)}`
    };
  }
  
  /**
   * Generate invalid payment information with specified fields omitted
   * @param fieldsToOmit Fields to leave empty
   */
  static generateInvalidPayment(fieldsToOmit: (keyof PaymentInfo)[]): PaymentInfo {
    const validPayment = this.generateValidPayment();
    
    fieldsToOmit.forEach(field => {
      if (field === 'useSameAddress') {
        validPayment[field] = false;
      } else {
        (validPayment as any)[field] = '';
      }
    });
    
    return validPayment;
  }
  
  /**
   * Generate random digits string of specified length
   */
  private static generateRandomDigits(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }
} 
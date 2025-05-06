import { CustomerInfo } from '../../types';

/**
 * Generates random customer data for testing
 */
export class CustomerDataGenerator {
  /**
   * Generate a random customer profile with valid information
   */
  static generateValidCustomer(): CustomerInfo {
    const id = Math.floor(Math.random() * 10000);
    
    return {
      firstName: `Test${id}`,
      lastName: `User${id}`,
      address: `${100 + id} Main Street`,
      city: 'San Francisco',
      state: 'CA',
      zipCode: `9${this.generateRandomDigits(4)}`,
      phone: `415${this.generateRandomDigits(7)}`,
      email: `test.user${id}@example.com`
    };
  }
  
  /**
   * Generate an invalid customer profile with missing required fields
   * @param fieldsToOmit Fields to leave empty
   */
  static generateInvalidCustomer(fieldsToOmit: (keyof CustomerInfo)[]): CustomerInfo {
    const validCustomer = this.generateValidCustomer();
    
    fieldsToOmit.forEach(field => {
      validCustomer[field] = '';
    });
    
    return validCustomer;
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
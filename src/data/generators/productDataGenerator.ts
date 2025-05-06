/**
 * Interface for product data
 */
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image?: string;
}

/**
 * Generates product data for testing
 */
export class ProductDataGenerator {
  /**
   * Sample test products based on SauceLabs mobile app
   */
  private static readonly SAMPLE_PRODUCTS: Product[] = [
    {
      id: '1',
      name: 'Sauce Labs Backpack',
      price: '$29.99',
      description: 'A stylish backpack with convenient side pocket.'
    },
    {
      id: '2',
      name: 'Sauce Labs Bike Light',
      price: '$9.99',
      description: 'Water-resistant with 3 lighting modes.'
    },
    {
      id: '3',
      name: 'Sauce Labs Bolt T-Shirt',
      price: '$15.99',
      description: 'Get your testing superhero on in this organic cotton bolt shirt.'
    },
    {
      id: '4',
      name: 'Sauce Labs Fleece Jacket',
      price: '$49.99',
      description: 'Midweight quarter-zip fleece jacket in multiple colors.'
    },
    {
      id: '5',
      name: 'Sauce Labs Onesie',
      price: '$7.99',
      description: 'Rib snap infant onesie for the junior automation engineer.'
    },
    {
      id: '6',
      name: 'Test.allTheThings() T-Shirt',
      price: '$15.99',
      description: 'Super-soft ringspun combed cotton shirt with logo.'
    }
  ];

  /**
   * Get a specific product by ID
   * @param productId The ID of the product to retrieve
   */
  static getProduct(productId: string): Product | undefined {
    return this.SAMPLE_PRODUCTS.find(product => product.id === productId);
  }

  /**
   * Get a random product from the sample product list
   */
  static getRandomProduct(): Product {
    const randomIndex = Math.floor(Math.random() * this.SAMPLE_PRODUCTS.length);
    return this.SAMPLE_PRODUCTS[randomIndex];
  }

  /**
   * Get all sample products
   */
  static getAllProducts(): Product[] {
    return [...this.SAMPLE_PRODUCTS];
  }
} 
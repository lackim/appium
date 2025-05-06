import { ElementArray } from '@wdio/protocols';
import { BasePage } from './BasePage';

/**
 * Products Page Object - represents the main product listing screen
 */
export class ProductsPage extends BasePage {
  // Selectors would be updated based on actual app inspection
  private selectors = {
    productItem: '~product-item', // Example accessibilityId
    productTitle: '~product-title',
    productPrice: '~product-price',
    addToCartButton: '~add-to-cart-button',
    cartBadge: '~cart-badge',
    cartIcon: '~cart-icon',
    filterButton: '~filter-button',
  };

  /**
   * Get list of all products
   */
  async getProducts(): Promise<ElementArray> {
    return this.driver.$$(this.selectors.productItem);
  }

  /**
   * Add a product to cart by index
   */
  async addProductToCart(index = 0): Promise<void> {
    const products = await this.getProducts();
    if (index >= products.length) {
      throw new Error(`Product index ${index} out of bounds (max: ${products.length - 1})`);
    }
    
    const addButton = await products[index].$(this.selectors.addToCartButton);
    await addButton.click();
  }

  /**
   * Get cart badge count
   */
  async getCartCount(): Promise<number> {
    const badgeText = await this.getText(this.selectors.cartBadge);
    return parseInt(badgeText, 10) || 0;
  }

  /**
   * Open cart
   */
  async openCart(): Promise<void> {
    await this.click(this.selectors.cartIcon);
  }

  /**
   * Get product name by index
   */
  async getProductName(index = 0): Promise<string> {
    const products = await this.getProducts();
    if (index >= products.length) {
      throw new Error(`Product index ${index} out of bounds (max: ${products.length - 1})`);
    }
    
    const titleElement = await products[index].$(this.selectors.productTitle);
    return titleElement.getText();
  }
} 
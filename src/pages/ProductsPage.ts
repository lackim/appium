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
    mainContent: '~products-screen'
  };

  /**
   * Wait for products page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.selectors.mainContent);
  }

  /**
   * Get list of all products
   */
  async getProducts(): Promise<any> {
    return this.driver.$$(this.selectors.productItem);
  }

  /**
   * Select a product by name
   */
  async selectProductByName(productName: string): Promise<void> {
    const products = await this.getProducts();
    for (const product of products) {
      const titleElement = await product.$(this.selectors.productTitle);
      const title = await titleElement.getText();
      if (title === productName) {
        await titleElement.click();
        return;
      }
    }
    throw new Error(`Product with name "${productName}" not found`);
  }

  /**
   * Click add to cart button
   */
  async clickAddToCartButton(): Promise<void> {
    await this.click(this.selectors.addToCartButton);
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
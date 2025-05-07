import { BasePage } from './BasePage';

/**
 * Product Details Page Object - represents the product details screen
 */
export class ProductDetailsPage extends BasePage {
  private selectors = {
    productImage: '~test-Image Container',
    productTitle: '~test-Item title',
    productDescription: '~test-Description',
    productPrice: '~test-Price',
    addToCartButton: '~test-ADD TO CART',
    removeButton: '~test-REMOVE',
    backButton: '~test-BACK TO PRODUCTS',
    cartIcon: '~test-Cart',
    inventoryItemPage: '~test-Inventory item page'
  };

  /**
   * Wait for product details page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeDisplayed(this.selectors.inventoryItemPage);
  }

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    return this.getText(this.selectors.productTitle);
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    return this.getText(this.selectors.productDescription);
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return this.getText(this.selectors.productPrice);
  }

  /**
   * Add current product to cart
   */
  async addToCart(): Promise<void> {
    await this.click(this.selectors.addToCartButton);
  }

  /**
   * Remove current product from cart
   */
  async removeFromCart(): Promise<void> {
    await this.click(this.selectors.removeButton);
  }

  /**
   * Navigate back to products page
   */
  async navigateBack(): Promise<void> {
    await this.click(this.selectors.backButton);
  }

  /**
   * Get cart badge count
   */
  async getCartCount(): Promise<number> {
    try {
      const badgeText = await this.getText(this.selectors.cartIcon);
      // Extract only the number from the badge if it contains additional text
      const match = badgeText.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Open cart with improved reliability
   */
  async openCart(maxRetries = 3): Promise<void> {
    // Use the standardized cart navigation from BasePage
    await this.navigateToCart(maxRetries);
  }
} 
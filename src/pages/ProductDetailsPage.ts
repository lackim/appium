import { BasePage } from './BasePage';

/**
 * Product Details Page Object - represents the product details screen
 */
export class ProductDetailsPage extends BasePage {
  private selectors = {
    productImage: '~product-image',
    productTitle: '~product-title',
    productDescription: '~product-description',
    productPrice: '~product-price',
    addToCartButton: '~add-to-cart-button',
    backButton: '~back-button',
    cartIcon: '~cart-icon',
    cartBadge: '~cart-badge'
  };

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
   * Navigate back to products page
   */
  async navigateBack(): Promise<void> {
    await this.click(this.selectors.backButton);
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
} 
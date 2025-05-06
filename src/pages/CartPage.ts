import { BasePage } from './BasePage';

/**
 * Cart Page Object - represents the shopping cart screen
 */
export class CartPage extends BasePage {
  private selectors = {
    cartItems: '~cart-item',
    itemTitle: '~item-title',
    itemPrice: '~item-price',
    itemQuantity: '~item-quantity',
    removeButton: '~remove-button',
    checkoutButton: '~checkout-button',
    continueShoppingButton: '~continue-shopping-button',
    totalAmount: '~total-amount',
    emptyCartMessage: '~empty-cart-message'
  };

  /**
   * Get list of all cart items
   */
  async getCartItems() {
    return this.driver.$$(this.selectors.cartItems);
  }

  /**
   * Get item name by index
   */
  async getItemName(index = 0): Promise<string> {
    const items = await this.getCartItems();
    const itemCount = await items.length;
    
    if (index < 0 || index >= itemCount) {
      throw new Error(`Item index ${index} out of bounds (max: ${itemCount - 1})`);
    }
    
    const titleElement = await items[index].$(this.selectors.itemTitle);
    return titleElement.getText();
  }

  /**
   * Get item price by index
   */
  async getItemPrice(index = 0): Promise<string> {
    const items = await this.getCartItems();
    const itemCount = await items.length;
    
    if (index < 0 || index >= itemCount) {
      throw new Error(`Item index ${index} out of bounds (max: ${itemCount - 1})`);
    }
    
    const priceElement = await items[index].$(this.selectors.itemPrice);
    return priceElement.getText();
  }

  /**
   * Remove item from cart by index
   */
  async removeItem(index = 0): Promise<void> {
    const items = await this.getCartItems();
    const itemCount = await items.length;
    
    if (index < 0 || index >= itemCount) {
      throw new Error(`Item index ${index} out of bounds (max: ${itemCount - 1})`);
    }
    
    const removeButton = await items[index].$(this.selectors.removeButton);
    await removeButton.click();
  }

  /**
   * Get cart total amount
   */
  async getTotalAmount(): Promise<string> {
    return this.getText(this.selectors.totalAmount);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.selectors.checkoutButton);
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.click(this.selectors.continueShoppingButton);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return this.isElementDisplayed(this.selectors.emptyCartMessage);
  }

  /**
   * Get number of items in cart
   */
  async getItemCount(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return await items.length;
    } catch (error) {
      return 0;
    }
  }
} 
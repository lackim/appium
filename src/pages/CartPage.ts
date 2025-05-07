import { BasePage } from './BasePage';

/**
 * Cart Page Object - represents the shopping cart screen
 */
export class CartPage extends BasePage {
  private selectors = {
    cartItems: '~test-Item',
    itemTitle: '~test-Item title',
    itemPrice: '~test-Price',
    itemDescription: '~test-Description',
    removeButton: '~test-REMOVE',
    checkoutButton: '~test-CHECKOUT',
    continueShoppingButton: '~test-CONTINUE SHOPPING',
    cartScreen: '~test-Cart Content',
    // Alternative selectors for increased reliability
    altCartScreen: '~test-CHECKOUT',  // If checkout button exists, we're on cart screen
    headerTitle: '~test-CART',        // Cart header text
    shoppingCartIcon: '~test-Cart',   // Shopping cart icon
    // XPath selectors - more reliable for iOS
    xpathCartScreenSelector: '(//XCUIElementTypeOther[@name="1"])[4]', // XPath selector from Appium Inspector
    xpathCartContainer: '//XCUIElementTypeOther[contains(@name, "Cart")]',
    xpathCheckoutBtn: '//XCUIElementTypeOther[@name="test-CHECKOUT"]'
  };

  /**
   * Wait for cart page to load with improved reliability
   */
  async waitForPageToLoad(timeoutMs = 30000): Promise<void> {
    try {
      // Try multiple selectors to find the cart screen, starting with XPath selectors
      // which are more reliable for iOS
      const selectors = [
        this.selectors.xpathCartScreenSelector, // Try the XPath selector first
        this.selectors.xpathCheckoutBtn,        // Then try the checkout button by XPath
        this.selectors.xpathCartContainer,      // Then try cart container by XPath
        this.selectors.cartScreen,              // Then try accessibility ID selectors
        this.selectors.altCartScreen,
        this.selectors.headerTitle
      ];
      
      // Try each selector with a short timeout
      let found = false;
      for (let selector of selectors) {
        try {
          // Log which selector we're trying
          console.log(`Trying to find cart with selector: ${selector}`);
          
          // For XPath selectors, use findElement directly
          if (selector.startsWith('//') || selector.startsWith('(//')) {
            const element = await this.driver.$(selector);
            await element.waitForExist({ timeout: 5000 });
            console.log(`Found cart with XPath selector: ${selector}`);
            found = true;
            break;
          } else {
            // For accessibility ID selectors, use our existing method
            await this.waitForElementWithPolling(selector, 5000, 500);
            console.log(`Found cart with accessibility ID selector: ${selector}`);
            found = true;
            break;
          }
        } catch (error) {
          // Continue to next selector
          console.log(`Selector ${selector} not found, trying next`);
          await this.pause(500);
        }
      }
      
      if (!found) {
        // If none of the quick checks work, try one more time with the XPath selector and full timeout
        try {
          console.log(`Trying XPath selector with full timeout: ${this.selectors.xpathCartScreenSelector}`);
          const element = await this.driver.$(this.selectors.xpathCartScreenSelector);
          await element.waitForExist({ timeout: timeoutMs });
          found = true;
        } catch (error) {
          console.log(`Final attempt with XPath selector failed: ${error}`);
          // If that fails, try the original selector
          await this.waitForElementWithPolling(this.selectors.cartScreen, timeoutMs);
        }
      }
      
      // If we get here, we've found the cart page
      await this.pause(1000); // Give the page time to fully render
      await this.takeDebugScreenshot('cart-page-loaded-successfully');
    } catch (error) {
      await this.takeDebugScreenshot('cart-page-load-failure');
      throw new Error(`Cart page did not load within ${timeoutMs}ms: ${error}`);
    }
  }

  /**
   * Get list of all cart items with retry and improved error handling
   */
  async getCartItems(): Promise<any> {
    return await this.retryOperation(async () => {
      // Take a screenshot for debugging
      await this.takeDebugScreenshot('get-cart-items');
      
      // Make sure we're on the cart page
      if (!await this.isElementDisplayed(this.selectors.checkoutButton) && 
          !await this.isElementDisplayed(this.selectors.cartScreen)) {
        throw new Error('Not on cart page when trying to get cart items');
      }
      
      return await this.driver.$$(this.selectors.cartItems);
    }, 5, 1000); // 5 attempts, 1 second delay between attempts
  }

  /**
   * Get item name by index
   */
  async getItemName(index = 0): Promise<string> {
    return await this.retryOperation(async () => {
      const items = await this.getCartItems();
      if (index < 0 || index >= items.length) {
        await this.takeDebugScreenshot('cart-item-index-error');
        throw new Error(`Item index ${index} out of bounds (max: ${items.length - 1})`);
      }
      
      const titleElement = await items[index].$(this.selectors.itemTitle);
      return await titleElement.getText();
    });
  }

  /**
   * Get item price by index
   */
  async getItemPrice(index = 0): Promise<string> {
    return await this.retryOperation(async () => {
      const items = await this.getCartItems();
      if (index < 0 || index >= items.length) {
        await this.takeDebugScreenshot('cart-item-price-error');
        throw new Error(`Item index ${index} out of bounds (max: ${items.length - 1})`);
      }
      
      const priceElement = await items[index].$(this.selectors.itemPrice);
      return await priceElement.getText();
    });
  }

  /**
   * Remove item from cart by index
   */
  async removeItem(index = 0): Promise<void> {
    await this.retryOperation(async () => {
      const items = await this.getCartItems();
      if (index < 0 || index >= items.length) {
        await this.takeDebugScreenshot('cart-remove-item-error');
        throw new Error(`Item index ${index} out of bounds (max: ${items.length - 1})`);
      }
      
      const removeButton = await items[index].$(this.selectors.removeButton);
      await removeButton.click();
    });
  }

  /**
   * Proceed to checkout with reliability improvements
   */
  async proceedToCheckout(): Promise<void> {
    try {
      if (!await this.isElementDisplayed(this.selectors.checkoutButton)) {
        await this.takeDebugScreenshot('checkout-button-not-visible');
      }
      await this.click(this.selectors.checkoutButton);
    } catch (error) {
      await this.takeDebugScreenshot('checkout-failure');
      throw new Error(`Failed to proceed to checkout: ${error}`);
    }
  }

  /**
   * Continue shopping with reliability improvements
   */
  async continueShopping(): Promise<void> {
    try {
      await this.click(this.selectors.continueShoppingButton);
    } catch (error) {
      await this.takeDebugScreenshot('continue-shopping-failure');
      throw new Error(`Failed to continue shopping: ${error}`);
    }
  }

  /**
   * Check if cart is empty with improved reliability
   */
  async isCartEmpty(): Promise<boolean> {
    try {
      await this.waitForCondition(
        async () => await this.isElementDisplayed(this.selectors.cartScreen),
        5000,
        500,
        'Cart screen not visible'
      );
      
      const items = await this.getCartItems();
      return items.length === 0;
    } catch (error) {
      await this.takeDebugScreenshot('cart-empty-check');
      // If we can't find cart items, consider the cart empty
      return true;
    }
  }

  /**
   * Get number of items in cart with improved reliability
   */
  async getItemCount(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return items.length;
    } catch (error) {
      await this.takeDebugScreenshot('get-item-count-error');
      return 0;
    }
  }

  /**
   * Standardized method to verify cart contents
   * @param expectedProducts Array of expected product names
   * @returns Boolean indicating if verification passed
   */
  async verifyCartContents(expectedProducts: string[]): Promise<boolean> {
    try {
      // Make sure we're on the cart page
      await this.waitForPageToLoad();
      
      // Take a debug screenshot
      await this.takeDebugScreenshot('verify-cart-contents');
      
      // Get the actual number of items in the cart
      const itemCount = await this.getItemCount();
      
      // Verify item count matches expected
      if (itemCount !== expectedProducts.length) {
        console.log(`Item count mismatch: found ${itemCount}, expected ${expectedProducts.length}`);
        return false;
      }
      
      // Get all item names from the cart
      const cartItems: string[] = [];
      for (let i = 0; i < itemCount; i++) {
        try {
          const itemName = await this.getItemName(i);
          cartItems.push(itemName);
        } catch (error) {
          console.log(`Failed to get name for item at index ${i}: ${error}`);
          return false;
        }
      }
      
      // Check if all expected products are in the cart
      const allProductsFound = expectedProducts.every(product => 
        cartItems.some(item => item.includes(product))
      );
      
      return allProductsFound;
    } catch (error) {
      console.error(`Failed to verify cart contents: ${error}`);
      await this.takeDebugScreenshot('verify-cart-contents-error');
      return false;
    }
  }

  /**
   * Open cart page
   */
  async open(): Promise<void> {
    // Use the existing method to navigate to cart
    await this.navigateToCart();
    
    // Wait for the cart page to load
    await this.waitForPageToLoad();
  }

  /**
   * Proceed to checkout (alias for proceedToCheckout for compatibility)
   */
  async checkoutFromCart(): Promise<void> {
    await this.proceedToCheckout();
  }

  /**
   * Check if a product is in the cart by name
   */
  async isProductInCart(productName: string): Promise<boolean> {
    try {
      await this.waitForPageToLoad();
      
      // Get all cart items
      const items = await this.getCartItems();
      
      // Check each item to see if it matches the product name
      for (const item of items) {
        const itemTitleElement = await item.$(this.selectors.itemTitle);
        const itemTitle = await itemTitleElement.getText();
        if (itemTitle === productName) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Error checking if product is in cart: ${error}`);
      return false;
    }
  }

  /**
   * Remove a product from the cart by name
   */
  async removeProduct(productName: string): Promise<void> {
    try {
      // Make sure we're on the cart page
      await this.waitForPageToLoad();
      
      // Get all cart items
      const items = await this.getCartItems();
      
      // Find the item with the matching name and remove it
      for (const item of items) {
        const itemTitleElement = await item.$(this.selectors.itemTitle);
        const itemTitle = await itemTitleElement.getText();
        
        if (itemTitle === productName) {
          const removeButton = await item.$(this.selectors.removeButton);
          await removeButton.click();
          
          // Wait a moment for the cart to update
          await this.pause(1000);
          return;
        }
      }
      
      // If we get here, the product wasn't found
      throw new Error(`Product "${productName}" not found in cart`);
    } catch (error) {
      console.error(`Error removing product from cart: ${error}`);
      throw error;
    }
  }
} 
import { BasePage } from './BasePage';

/**
 * Products Page Object - represents the main product listing screen
 */
export class ProductsPage extends BasePage {
  // Selectors updated based on actual app implementation
  private readonly selectors = {
    // Main screens
    productsScreen: '~test-PRODUCTS',
    loginScreen: '~test-Login',
    
    // Login page selectors
    usernameInput: '~test-Username',
    passwordInput: '~test-Password',
    loginButton: '~test-LOGIN',
    
    // Products page selectors
    productItem: '~test-Item',
    productTitle: '~test-Item title',
    productPrice: '~test-Price',
    productDescription: '~test-Item description',
    addToCartButton: '~test-ADD TO CART',
    removeButton: '~test-REMOVE',
    cartBadge: '~test-Cart',
    cartIcon: '~test-Cart',
    filterButton: '~test-Modal Selector Button',
    dragHandle: '~test-Drag Handle',
    toggle: '~test-Toggle'
  };

  /**
   * Handle login if needed
   */
  async handleLogin(): Promise<void> {
    try {
      const usernameField = await this.driver.$(this.selectors.usernameInput);
      if (await usernameField.isDisplayed()) {
        console.log('Login screen detected, logging in...');
        await usernameField.setValue('standard_user');
        
        const passwordField = await this.driver.$(this.selectors.passwordInput);
        await passwordField.setValue('secret_sauce');
        
        const loginButton = await this.driver.$(this.selectors.loginButton);
        await loginButton.click();
        
        // Wait a moment for login to complete
        await this.driver.pause(2000);
        console.log('Login completed');
      }
    } catch (error) {
      console.log('No login screen found or error handling login:', error);
    }
  }

  /**
   * Check if product items are loaded
   */
  async areProductItemsLoaded(): Promise<boolean> {
    try {
      // Use $ to check if at least one product item exists
      const productExists = await this.driver.$(this.selectors.productItem).isExisting();
      return productExists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for products page to load
   */
  async waitForPageToLoad(): Promise<void> {
    // First check if we need to login
    await this.handleLogin();
    
    // Check if we can find any product items directly
    const productsLoaded = await this.areProductItemsLoaded();
    if (productsLoaded) {
      console.log('Product items found directly');
      return;
    }
    
    // Try to wait for the products screen to be displayed
    try {
      console.log('Waiting for products screen...');
      await this.waitForElementToBeDisplayed(this.selectors.productsScreen);
      console.log('Products screen found');
    } catch (error) {
      console.log('Products screen not found, trying to find any element');
      // If all specific selectors fail, try a general approach to find any visible element
      await this.driver.$('*').waitForDisplayed({ timeout: 5000 });
      console.log('At least one element is displayed on the screen');
      
      // Take a screenshot to debug
      await this.takeScreenshot('products-page-debug');
    }
  }

  /**
   * Get text of all product titles
   */
  async getAllProductTitles(): Promise<string[]> {
    const titles: string[] = [];
    
    try {
      // Find all elements with product title selector
      const selector = this.selectors.productTitle;
      
      // Use executeScript to get text from all elements matching the selector
      // This bypasses the ElementArray typing issues
      const elementTexts = await this.driver.execute(function(selector) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent || '');
      }, selector);
      
      return Array.isArray(elementTexts) ? elementTexts : [];
    } catch (error) {
      console.log('Error getting product titles:', error);
      return titles;
    }
  }

  /**
   * Select product by name
   */
  async selectProductByName(name: string): Promise<void> {
    try {
      // Ensure we're on the products page
      await this.waitForPageToLoad();
      
      // Try a few times to find and select the product
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        console.log(`Attempt ${retries + 1} to find product: ${name}`);
        
        // Try direct selection
        try {
          // For simplicity, build a selector that directly targets the title with the exact text
          const titleSelector = `~${name}`;
          const exactSelector = `//*[@name="test-Item title" and @label="${name}"]`;
          const xpathSelector = `//XCUIElementTypeStaticText[@label="${name}"]`;
          
          // Try different selectors
          for (const selector of [titleSelector, exactSelector, xpathSelector]) {
            try {
              console.log(`Trying selector: ${selector}`);
              const element = await this.driver.$(selector);
              if (await element.isExisting()) {
                console.log(`Found product with selector: ${selector}`);
                await element.click();
                return;
              }
            } catch (e) {
              // Ignore errors and try next selector
            }
          }
        } catch (error) {
          console.log('Error with direct selection:', error);
        }
        
        // Wait and retry
        await this.driver.pause(1000);
        retries++;
      }
      
      // Take a screenshot to debug
      await this.takeScreenshot('product-not-found');
      throw new Error(`Product with name "${name}" not found`);
    } catch (error) {
      console.error('Error selecting product by name:', error);
      throw error;
    }
  }

  /**
   * Open cart with improved reliability
   */
  async openCart(maxRetries = 3): Promise<void> {
    // Use the standardized cart navigation from BasePage
    await this.navigateToCart(maxRetries);
  }

  /**
   * Get number of items in cart from the badge
   */
  async getCartCount(): Promise<number> {
    try {
      const cartBadge = await this.driver.$(this.selectors.cartBadge);
      const badgeText = await cartBadge.getText();
      return parseInt(badgeText.replace(/\D/g, ''), 10) || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Click the Add to Cart button for the first product
   */
  async clickAddToCartButton(): Promise<void> {
    await this.click(this.selectors.addToCartButton);
  }
} 
import { remote } from 'webdriverio';
import { ProductsPage, CartPage, ProductDetailsPage } from '../../../pages';
import logger from '../../../utils/logger';
import path from 'path';

// Increase timeout for each test to 3 minutes
jest.setTimeout(180000);

describe('SauceLabs Mobile App - Cart Management Tests', () => {
  let driver: WebdriverIO.Browser;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let productDetailsPage: ProductDetailsPage;
  
  // Get absolute path to app
  const APP_PATH = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');

  beforeAll(async () => {
    // Set up the driver with the iOS capabilities
    driver = await remote({
      protocol: 'http',
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      capabilities: {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': 'iPhone 16 Plus',
        'appium:platformVersion': '18.4',
        'appium:app': APP_PATH,
        'appium:udid': 'F869526D-4689-491E-A80C-F6502CABC081',
        'appium:noReset': false,
        'appium:fullReset': true
      },
      logLevel: 'info',
      connectionRetryTimeout: 180000,
      connectionRetryCount: 5
    });

    // Initialize the page objects
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    productDetailsPage = new ProductDetailsPage(driver);
  }, 180000); // Explicitly set beforeAll timeout

  afterAll(async () => {
    // Clean up by closing the driver session
    if (driver) {
      await driver.deleteSession();
    }
  });

  beforeEach(async () => {
    // Reset app state before each test
    await productsPage.open();
    await productsPage.waitForPageToLoad();
  });

  it('should add a product to cart from product list page', async () => {
    // Add a random product to cart
    const productName = await productsPage.addRandomProductToCart();
    
    // Verify cart badge shows item count
    const cartBadgeCount = await productsPage.getCartBadgeCount();
    expect(cartBadgeCount).toBe(1);
    
    // Navigate to cart and verify product is in cart
    await cartPage.open();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(1);
    
    // Verify product name matches the one added
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    
    logger.info(`Added product "${productName}" to cart successfully`);
  });

  it('should add a product to cart from product details page', async () => {
    // Navigate to a random product details page
    const productName = await productsPage.navigateToRandomProductDetails();
    
    // Add product to cart from details page
    await productDetailsPage.addToCart();
    
    // Verify cart badge shows item count
    const cartBadgeCount = await productDetailsPage.getCartBadgeCount();
    expect(cartBadgeCount).toBe(1);
    
    // Navigate to cart and verify product is in cart
    await cartPage.open();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    
    logger.info(`Added product "${productName}" from details page successfully`);
  });

  it('should remove a product from cart', async () => {
    // Add a random product to cart
    const productName = await productsPage.addRandomProductToCart();
    
    // Navigate to cart
    await cartPage.open();
    
    // Verify product is in cart
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    
    // Remove the product from cart
    await cartPage.removeProduct(productName);
    
    // Verify product is no longer in cart and cart is empty
    expect(await cartPage.isProductInCart(productName)).toBeFalsy();
    
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(0);
    
    logger.info(`Removed product "${productName}" from cart successfully`);
  });

  it('should update cart badge count when adding multiple products', async () => {
    // Add first product
    const product1Name = await productsPage.addRandomProductToCart();
    
    // Verify cart badge shows count of 1
    let cartBadgeCount = await productsPage.getCartBadgeCount();
    expect(cartBadgeCount).toBe(1);
    
    // Add second product (ensure it's different from the first one)
    await productsPage.scrollToProduct(2); // Scroll to another product
    const product2Name = await productsPage.addProductToCartByIndex(2);
    
    // Verify product names are different
    expect(product1Name).not.toEqual(product2Name);
    
    // Verify cart badge shows count of 2
    cartBadgeCount = await productsPage.getCartBadgeCount();
    expect(cartBadgeCount).toBe(2);
    
    // Navigate to cart and verify both products are in cart
    await cartPage.open();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(2);
    
    expect(await cartPage.isProductInCart(product1Name)).toBeTruthy();
    expect(await cartPage.isProductInCart(product2Name)).toBeTruthy();
    
    logger.info(`Added multiple products "${product1Name}" and "${product2Name}" to cart successfully`);
  });

  it('should prevent adding duplicate products to cart', async () => {
    // Get the name of the first product
    const productName = await productsPage.getProductNameByIndex(0);
    
    // Add the product to cart
    await productsPage.addProductToCartByIndex(0);
    
    // Verify cart badge shows count of 1
    let cartBadgeCount = await productsPage.getCartBadgeCount();
    expect(cartBadgeCount).toBe(1);
    
    // Try to add the same product again
    await productsPage.addProductToCartByIndex(0);
    
    // Verify cart badge still shows count of 1
    cartBadgeCount = await productsPage.getCartBadgeCount();
    expect(cartBadgeCount).toBe(1);
    
    // Navigate to cart and verify product appears only once
    await cartPage.open();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(1);
    
    logger.info(`Verified product "${productName}" can only be added once to cart`);
  });
}); 
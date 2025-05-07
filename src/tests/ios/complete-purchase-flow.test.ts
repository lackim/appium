import { remote } from 'webdriverio';
import { CheckoutDataProvider, TestStateManager } from '../../data';
import { 
  ProductsPage, 
  ProductDetailsPage, 
  CartPage, 
  CheckoutInfoPage, 
  PaymentDetailsPage, 
  OrderSummaryPage, 
  OrderConfirmationPage,
  LoginPage
} from '../../pages';
import { CREDENTIALS } from '../../test-data/credentials';
import path from 'path';

// Increase timeout for each test to 3 minutes
jest.setTimeout(180000);

/**
 * Test suite for complete purchase flow
 * Implements step 5 of the implementation plan:
 * - Adding product to cart
 * - Navigating through checkout process
 * - Completing user information forms
 * - Verifying order summary
 * - Completing purchase
 * - Validating order confirmation
 */
describe('Complete Purchase Flow', () => {
  // WebDriver instance
  let driver: WebdriverIO.Browser;
  
  // Page objects
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let productDetailsPage: ProductDetailsPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let paymentDetailsPage: PaymentDetailsPage;
  let orderSummaryPage: OrderSummaryPage;
  let orderConfirmationPage: OrderConfirmationPage;
  
  // State manager
  let stateManager: TestStateManager;

  // Get absolute path to app
  const APP_PATH = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');

  beforeAll(async () => {
    // Initialize the driver with iOS capabilities
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
  }, 180000); // Explicitly set beforeAll timeout

  afterAll(async () => {
    // Clean up by closing the driver session
    if (driver) {
      await driver.deleteSession();
    }
  });

  beforeEach(async () => {
    // Initialize page objects with the driver instance
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    productDetailsPage = new ProductDetailsPage(driver);
    cartPage = new CartPage(driver);
    checkoutInfoPage = new CheckoutInfoPage(driver);
    paymentDetailsPage = new PaymentDetailsPage(driver);
    orderSummaryPage = new OrderSummaryPage(driver);
    orderConfirmationPage = new OrderConfirmationPage(driver);
    
    // Initialize state manager with unique test ID
    stateManager = TestStateManager.getInstance();
    stateManager.initTest(`complete-purchase-flow-${Date.now()}`);
    
    // Login first using standard user credentials
    await loginPage.waitForPageToLoad();
    await loginPage.loginAsStandardUser();
  });

  afterEach(async () => {
    try {
      // Take screenshot on completion if driver is available
      if (productsPage) {
        await productsPage.takeScreenshot('test-completion');
      }
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
    
    // Reset app state for next test
    await driver.deleteSession();
    
    // Create a new session for the next test
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
        'appium:noReset': true,
        'appium:fullReset': true
      },
      logLevel: 'info'
    });
    
    // Reset any state in the test state manager
    if (stateManager) {
      stateManager.resetState();
    }
  });

  /**
   * Main test case: Complete purchase flow from product selection to order confirmation
   */
  test('should complete full purchase flow successfully', async () => {
    // 1. Get test data from provider
    const testData = CheckoutDataProvider.getHappyPathData();
    
    // 2. Store data in state manager for later validation
    stateManager.setCurrentProduct(testData.product);
    stateManager.setCustomerInfo(testData.customer);
    stateManager.setPaymentInfo(testData.payment);
    
    // 3. Adding product to cart
    // Navigate to products page and wait for it to load
    await productsPage.waitForPageToLoad();
    
    // Select a product and navigate to its details
    await productsPage.selectProductByName(testData.product.name);
    await productDetailsPage.waitForPageToLoad();
    
    // Verify product details match expected values
    const productName = await productDetailsPage.getProductTitle();
    const productPrice = await productDetailsPage.getProductPrice();
    expect(productName).toBe(testData.product.name);
    expect(productPrice).toContain(testData.product.price.toString().replace('$', ''));
    
    // Add product to cart from details page
    await productDetailsPage.addToCart();
    
    // 4. Navigate to cart and verify product was added correctly
    await productDetailsPage.openCart();
    await cartPage.waitForPageToLoad();
    
    // Verify cart contains the correct product using the standardized method
    const cartVerified = await cartPage.verifyCartContents([testData.product.name]);
    expect(cartVerified).toBe(true);
    
    // Additional verification
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getItemName(0)).toBe(testData.product.name);
    
    // 5. Navigating through checkout process
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForPageToLoad();
    
    // 6. Completing user information forms
    // Fill in customer information and proceed
    await checkoutInfoPage.fillCheckoutInfo(testData.customer);
    await checkoutInfoPage.continue();
    
    // 7. Skip to checkout overview (payment details) since the app doesn't have a separate payment form
    await paymentDetailsPage.waitForPageToLoad();
    
    // 8. Verifying order summary (using orderSummaryPage, which uses the same UI as paymentDetailsPage)
    await orderSummaryPage.waitForPageToLoad();
    const orderSummary = await orderSummaryPage.extractOrderSummary();
    stateManager.setOrderSummary(orderSummary);
    
    // Verify payment information is displayed
    const paymentInfo = await paymentDetailsPage.getPaymentInfo();
    expect(paymentInfo).toContain('Payment Information');
    
    // Verify shipping information is displayed
    const shippingInfo = await paymentDetailsPage.getShippingInfo(); 
    expect(shippingInfo).toContain('Shipping Information');
    
    // 9. Completing purchase
    await orderSummaryPage.placeOrder();
    
    // 10. Validating order confirmation
    await orderConfirmationPage.waitForPageToLoad();
    
    // Verify confirmation is displayed
    expect(await orderConfirmationPage.isConfirmationDisplayed()).toBe(true);
    
    // Get and store order confirmation details
    const confirmation = await orderConfirmationPage.getOrderConfirmation();
    stateManager.setOrderConfirmation(confirmation);
    
    // Verify thank you message
    const confirmHeader = await orderConfirmationPage.getConfirmationHeader();
    expect(confirmHeader).toContain('THANK YOU');
    
    // Take a screenshot of the confirmation page
    await orderConfirmationPage.takeScreenshot('purchase-confirmation');
    
    // Return to home by clicking Back Home button
    await orderConfirmationPage.backToHome();
  });

  /**
   * Test case for purchasing multiple items
   */
  test('should complete purchase with multiple items in cart', async () => {
    // Get test data for multiple products
    const testData = CheckoutDataProvider.getMultipleItemsData();
    
    // Store customer and payment data
    stateManager.setCustomerInfo(testData.customer);
    stateManager.setPaymentInfo(testData.payment);
    
    // Add each product to the cart
    await productsPage.waitForPageToLoad();
    
    for (const product of testData.products) {
      // Select and add each product
      await productsPage.selectProductByName(product.name);
      await productDetailsPage.waitForPageToLoad();
      await productDetailsPage.addToCart();
      
      // Store the product in state manager
      stateManager.addProductToList(product);
      
      // Navigate back to products page for next item
      await productDetailsPage.navigateBack();
      await productsPage.waitForPageToLoad();
    }
    
    // Navigate to cart
    await productsPage.openCart();
    await cartPage.waitForPageToLoad();
    
    // Verify cart has the correct items using the standardized method
    const productNames = testData.products.map(product => product.name);
    const cartVerified = await cartPage.verifyCartContents(productNames);
    expect(cartVerified).toBe(true);
    
    // Additional verification
    const cartItemCount = await cartPage.getItemCount();
    expect(cartItemCount).toBe(testData.products.length);
    
    // Proceed with checkout
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForPageToLoad();
    
    // Complete checkout information
    await checkoutInfoPage.fillCheckoutInfo(testData.customer);
    await checkoutInfoPage.continue();
    
    // Verify payment details page (checkout overview)
    await paymentDetailsPage.waitForPageToLoad();
    
    // Verify order summary for multiple items
    await orderSummaryPage.waitForPageToLoad();
    const orderSummary = await orderSummaryPage.extractOrderSummary();
    stateManager.setOrderSummary(orderSummary);
    
    // Verify item count matches expected
    const itemCount = await paymentDetailsPage.getItemCount();
    expect(itemCount).toBe(testData.products.length);
    
    // Complete purchase
    await orderSummaryPage.placeOrder();
    
    // Verify order confirmation
    await orderConfirmationPage.waitForPageToLoad();
    expect(await orderConfirmationPage.isConfirmationDisplayed()).toBe(true);
    
    // Take a screenshot of the confirmation
    await orderConfirmationPage.takeScreenshot('multiple-items-confirmation');
    
    // Return to home
    await orderConfirmationPage.backToHome();
  });
}); 
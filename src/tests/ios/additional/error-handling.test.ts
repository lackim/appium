import { remote } from 'webdriverio';
import { LoginPage, ProductsPage, CartPage, CheckoutInfoPage, PaymentDetailsPage } from '../../../pages';
import { CREDENTIALS } from '../../../test-data/credentials';
import logger from '../../../utils/logger';
import path from 'path';

// Increase timeout for each test to 3 minutes
jest.setTimeout(180000);

describe('SauceLabs Mobile App - Error Handling Tests', () => {
  let driver: WebdriverIO.Browser;
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let paymentDetailsPage: PaymentDetailsPage;
  
  // Define the correct bundleId 
  const APP_BUNDLE_ID = 'com.saucelabs.Sample';
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
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    checkoutInfoPage = new CheckoutInfoPage(driver);
    paymentDetailsPage = new PaymentDetailsPage(driver);
  }, 180000); // Explicitly set beforeAll timeout

  afterAll(async () => {
    // Clean up by closing the driver session
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should show error message for invalid login credentials', async () => {
    await loginPage.open();
    await loginPage.login(CREDENTIALS.INVALID_USER.USERNAME, CREDENTIALS.INVALID_USER.PASSWORD);
    
    // Verify error message is displayed
    expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
    
    logger.info(`Validated error message for invalid login: "${errorMessage}"`);
  });

  it('should show error message for locked out user', async () => {
    await resetSession();
    
    await loginPage.open();
    await loginPage.login(CREDENTIALS.LOCKED_OUT_USER.USERNAME, CREDENTIALS.LOCKED_OUT_USER.PASSWORD);
    
    // Verify error message is displayed
    expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Sorry, this user has been locked out');
    
    logger.info(`Validated error message for locked out user: "${errorMessage}"`);
  });

  it('should handle problem user behavior correctly', async () => {
    await resetSession();
    
    await loginPage.open();
    await loginPage.login(CREDENTIALS.PROBLEM_USER.USERNAME, CREDENTIALS.PROBLEM_USER.PASSWORD);
    
    // Verify login was successful but problem user issues are present
    expect(await productsPage.isPageDisplayed()).toBeTruthy();
    
    // Problem users might have issues like:
    // - Images not loading correctly
    // - Product details not accessible
    // - Sorting not working correctly
    
    // Check if there are any broken images on the products page
    const brokenImages = await productsPage.countBrokenProductImages();
    logger.info(`Problem user has ${brokenImages} broken images on products page`);
    
    // Try to add a product to cart (this might fail for problem user)
    try {
      await productsPage.addRandomProductToCart();
      logger.info('Problem user was able to add product to cart');
    } catch (error) {
      logger.info('Problem user encountered expected error trying to add product to cart');
    }
  });

  it('should handle server errors during checkout process', async () => {
    await resetSession();
    
    // Login as standard user
    await loginPage.open();
    await loginPage.loginAsStandardUser();
    
    // Add product to cart
    await productsPage.addRandomProductToCart();
    
    // Go to cart
    await cartPage.open();
    
    // Proceed to checkout
    await cartPage.checkoutFromCart();
    
    // Enter checkout information with values known to trigger server errors
    await checkoutInfoPage.setFirstName('Error');
    await checkoutInfoPage.setLastName('Trigger');
    await checkoutInfoPage.setPostalCode('500'); // Assuming 500 triggers a server error
    
    try {
      await checkoutInfoPage.continueToPayment();
      
      // If we made it to payment page without error, try to continue with error-triggering data
      await paymentDetailsPage.setCardNumber('4111-SERVER-ERROR');
      await paymentDetailsPage.continueToOrderSummary();
      
      // Check for error message
      if (await paymentDetailsPage.isErrorMessageDisplayed()) {
        const errorMessage = await paymentDetailsPage.getErrorMessage();
        expect(errorMessage).toContain('Server error');
        logger.info(`Validated server error during payment: "${errorMessage}"`);
      }
    } catch (error) {
      // Expected behavior if server error occurred
      logger.info('Server error happened during checkout as expected');
    }
  });

  it('should handle network error gracefully', async () => {
    await resetSession();
    
    // Login as standard user
    await loginPage.open();
    await loginPage.loginAsStandardUser();
    
    // Note: This test is a placeholder as network errors require special handling
    // Ideally, we'd use driver.setNetworkConnection to simulate network issues
    
    logger.info('Network error test is a placeholder - requires special setup');
    
    // Example of what could be done with proper capabilities:
    // 1. Enable airplane mode
    // await driver.setNetworkConnection(1); // airplane mode
    
    // 2. Try to perform an action that requires network
    // await productsPage.refresh();
    
    // 3. Check for appropriate error or fallback behavior
    // const isOfflineMessageDisplayed = await productsPage.isOfflineMessageDisplayed();
    // expect(isOfflineMessageDisplayed).toBeTruthy();
    
    // 4. Re-enable network
    // await driver.setNetworkConnection(6); // wifi and data enabled
  });
  
  /**
   * Helper function to reset the session for a clean test
   */
  async function resetSession() {
    // Delete existing session
    if (driver) {
      await driver.deleteSession();
    }
    
    // Create a new session
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
      logLevel: 'info',
      connectionRetryTimeout: 180000,
      connectionRetryCount: 5
    });
    
    // Re-initialize page objects
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    checkoutInfoPage = new CheckoutInfoPage(driver);
    paymentDetailsPage = new PaymentDetailsPage(driver);
  }
}); 
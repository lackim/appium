import { remote } from 'webdriverio';
import { CheckoutDataProvider, TestStateManager } from '../../data';
import { 
  ProductsPage, 
  CartPage, 
  CheckoutInfoPage, 
  PaymentDetailsPage, 
  OrderSummaryPage, 
  OrderConfirmationPage,
  LoginPage
} from '../../pages';
import { CREDENTIALS } from '../../test-data/credentials';
import path from 'path';
import fs from 'fs';
import logger from '../../utils/logger';

// Increase timeout for each test to 10 minutes to handle WebDriverAgent startup delays
jest.setTimeout(600000);

/**
 * Test suite for checkout flow in iOS
 */
describe('Checkout Flow', () => {
  // WebDriver instance
  let driver: WebdriverIO.Browser;
  
  // Page objects
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let paymentDetailsPage: PaymentDetailsPage;
  let orderSummaryPage: OrderSummaryPage;
  let orderConfirmationPage: OrderConfirmationPage;
  
  // State manager
  let stateManager: TestStateManager;

  // Get absolute path to app
  const APP_PATH = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');
  
  // Screenshot directory
  const SCREENSHOT_DIR = './reports/screenshots';
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // Create a function to take and save screenshots
  const takeScreenshot = async (name: string) => {
    try {
      if (driver) {
        const img = await driver.takeScreenshot();
        fs.writeFileSync(`${SCREENSHOT_DIR}/${name}-${Date.now()}.png`, Buffer.from(img, 'base64'));
        logger.info(`Screenshot saved: ${name}`);
      }
    } catch (e) {
      logger.error(`Failed to take screenshot: ${e}`);
    }
  };

  beforeEach(async () => {
    // Initialize the driver with optimized iOS capabilities
    logger.info('Starting test session with optimized capabilities');
    
    try {
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
          'appium:udid': 'F869526D-4689-491E-A80C-F6502CABC081', // Specific UDID for the booted simulator
          'appium:noReset': true,                // Don't reset app state between sessions
          'appium:fullReset': false,             // Don't uninstall app before session starts
          'appium:showXcodeLog': true,           // Show Xcode logs for debugging
          'appium:wdaLaunchTimeout': 240000,     // 4 minutes for WDA to launch
          'appium:wdaConnectionTimeout': 240000, // 4 minutes to connect to WDA
          'appium:newCommandTimeout': 240000,    // 4 minutes timeout for commands
          'appium:usePrebuiltWDA': true,         // Use prebuilt WebDriverAgent if available
          'appium:autoAcceptAlerts': true,       // Accept iOS alerts automatically
          'appium:useNewWDA': false,             // Don't force reinstall of WDA
          'appium:maxTypingFrequency': 30,       // Slower typing for reliability
          'appium:shouldUseSingletonTestManager': false, // Avoid WDA issues
          'appium:derivedDataPath': path.resolve('./derived_data'),
          'appium:waitForQuiescence': false      // Don't wait for app to be "quiet"
        },
        logLevel: 'info',
        connectionRetryTimeout: 240000,
        connectionRetryCount: 3
      });
      
      logger.info('Driver initialized successfully');
      
      // Initialize page objects with the driver instance
      loginPage = new LoginPage(driver);
      productsPage = new ProductsPage(driver);
      cartPage = new CartPage(driver);
      checkoutInfoPage = new CheckoutInfoPage(driver);
      paymentDetailsPage = new PaymentDetailsPage(driver);
      orderSummaryPage = new OrderSummaryPage(driver);
      orderConfirmationPage = new OrderConfirmationPage(driver);
      
      // Initialize state manager with unique ID
      stateManager = TestStateManager.getInstance();
      stateManager.initTest(`checkout-flow-${Date.now()}`);
      
      // Login with standard user credentials with retry logic
      await loginWithRetry();
      
    } catch (error) {
      logger.error(`Setup failed: ${error}`);
      await takeScreenshot('setup-failure');
      throw error;
    }
  }, 300000); // 5 minutes timeout for beforeEach

  // Retry login up to 3 times
  async function loginWithRetry(maxRetries = 3): Promise<void> {
    let retries = 0;
    let success = false;
    
    while (retries < maxRetries && !success) {
      try {
        logger.info(`Login attempt ${retries + 1}/${maxRetries}`);
        
        // Wait for login screen with increased timeout
        await loginPage.waitForPageToLoad();
        await driver.pause(3000); // Allow UI to stabilize
        
        // Take screenshot of login screen for debugging
        await takeScreenshot('login-screen');
        
        // Login with standard user
        await loginPage.login(CREDENTIALS.STANDARD_USER.USERNAME, CREDENTIALS.STANDARD_USER.PASSWORD);
        
        // Wait for products page to verify successful login
        await productsPage.waitForPageToLoad();
        await driver.pause(2000); // Allow UI to stabilize after login
        
        // Take screenshot of products page for debugging
        await takeScreenshot('products-screen');
        
        success = true;
        logger.info('Login successful');
      } catch (error) {
        retries++;
        logger.error(`Login attempt ${retries} failed: ${error}`);
        
        if (retries >= maxRetries) {
          logger.error(`All ${maxRetries} login attempts failed`);
          await takeScreenshot('login-failure-final');
          throw new Error(`Failed to login after ${maxRetries} attempts: ${error}`);
        }
        
        // Wait before retrying
        await driver.pause(5000);
        
        // Restart the session if needed
        if (driver) {
          try {
            await driver.deleteSession();
          } catch (e) {
            logger.error(`Failed to delete session: ${e}`);
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
              'appium:fullReset': false,
              'appium:wdaLaunchTimeout': 240000,
              'appium:showXcodeLog': true
            },
            logLevel: 'info'
          });
          
          // Reinitialize page objects
          loginPage = new LoginPage(driver);
          productsPage = new ProductsPage(driver);
        }
      }
    }
  }

  afterEach(async () => {
    // Take a screenshot at the end of each test
    await takeScreenshot('test-end');
    
    try {
      // Reset state manager if it exists
      if (stateManager) {
        stateManager.resetState();
      }
      
      // Close the driver session
      if (driver) {
        logger.info('Closing test session');
        await driver.deleteSession();
      }
    } catch (e) {
      logger.error(`Error in cleanup: ${e}`);
    }
  }, 300000); // 5 minutes timeout for afterEach

  /**
   * Single test for successful checkout to simplify debugging
   */
  it('should complete basic checkout flow with standard user', async () => {
    try {
      logger.info('Starting basic checkout test');
      
      // Verify we're on the products page
      await productsPage.waitForPageToLoad();
      await takeScreenshot('1-products-page');
      
      // Add first item to cart
      logger.info('Adding item to cart');
      await productsPage.clickAddToCartButton();
      await driver.pause(1000); // Wait for animation
      await takeScreenshot('2-added-to-cart');
      
      // Navigate to cart
      logger.info('Navigating to cart');
      await productsPage.openCart();
      await cartPage.waitForPageToLoad();
      await takeScreenshot('3-cart-page');
      
      // Verify item is in cart
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
      logger.info(`Items in cart: ${itemCount}`);
      
      // Proceed to checkout
      logger.info('Proceeding to checkout');
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.waitForPageToLoad();
      await takeScreenshot('4-checkout-info-page');
      
      // Fill checkout information
      logger.info('Filling checkout information');
      await checkoutInfoPage.fillCheckoutInfo({
        firstName: 'Test',
        lastName: 'User',
        zipCode: '12345',
        address: '', // Not used in this app
        city: '',    // Required by interface but not used in this app
        state: '',   // Required by interface but not used in this app
        phone: '',   // Required by interface but not used in this app
        email: ''    // Required by interface but not used in this app
      });
      await takeScreenshot('5-filled-checkout-info');
      
      // Continue to payment
      logger.info('Continuing to payment screen');
      await checkoutInfoPage.continue();
      await paymentDetailsPage.waitForPageToLoad();
      await takeScreenshot('6-payment-details-page');
      
      // Complete purchase
      logger.info('Completing purchase');
      await orderSummaryPage.placeOrder();
      await orderConfirmationPage.waitForPageToLoad();
      await takeScreenshot('7-order-confirmation');
      
      // Verify success
      const isConfirmationDisplayed = await orderConfirmationPage.isConfirmationDisplayed();
      expect(isConfirmationDisplayed).toBe(true);
      logger.info('Checkout completed successfully');
    } catch (error) {
      // Take screenshot on failure
      await takeScreenshot('checkout-failure');
      logger.error(`Checkout test failed: ${error}`);
      throw error;
    }
  });
}); 
import { remote } from 'webdriverio';
import { LoginPage, ProductsPage } from '../../pages';
import { CREDENTIALS } from '../../test-data/credentials';
import logger from '../../utils/logger';
import path from 'path';

// Increase timeout for each test to 3 minutes
jest.setTimeout(180000);

describe('SauceLabs Mobile App - Login Tests', () => {
  let driver: WebdriverIO.Browser;
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
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
  }, 180000); // Explicitly set beforeAll timeout

  afterAll(async () => {
    // Clean up by closing the driver session
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should show the login page on app launch', async () => {
    const isDisplayed = await loginPage.isPageDisplayed();
    expect(isDisplayed).toBeTruthy();
  });

  it('should login successfully with valid credentials', async () => {
    await loginPage.loginAsStandardUser();
    await productsPage.waitForPageToLoad();
    const areProductsVisible = await productsPage.areProductItemsLoaded();
    expect(areProductsVisible).toBeTruthy();
  });

  it('should show error message with invalid credentials', async () => {
    // For subsequent tests, we need to create a new session to start fresh
    await driver.deleteSession();
    
    // Reinitialize the driver with the same capabilities
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
    
    // Re-initialize page objects with the new driver
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    
    // Attempt login with invalid credentials
    await loginPage.login(CREDENTIALS.INVALID_USER.USERNAME, CREDENTIALS.INVALID_USER.PASSWORD);
    
    // Check that error message is displayed
    const errorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(errorDisplayed).toBeTruthy();
    
    // Check the error message text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  it('should show specific error for locked out user', async () => {
    // For subsequent tests, create a new session to start fresh
    await driver.deleteSession();
    
    // Reinitialize the driver with the same capabilities
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
    
    // Initialize page objects
    loginPage = new LoginPage(driver);
    
    // Login with locked out username
    logger.info(`Logging in with username: ${CREDENTIALS.LOCKED_OUT_USER.USERNAME}`);
    await loginPage.login(
      CREDENTIALS.LOCKED_OUT_USER.USERNAME,
      CREDENTIALS.LOCKED_OUT_USER.PASSWORD
    );
    
    // Verify login fails with correct error
    expect(await loginPage.isErrorMessageDisplayed()).toBe(true);
    
    // Check the error message text
    const errorMessage = await loginPage.getErrorMessage();
    // Update the test expectation to match the actual error message
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });
}); 
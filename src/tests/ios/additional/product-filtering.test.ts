import { remote } from 'webdriverio';
import { ProductsPage } from '../../../pages';
import logger from '../../../utils/logger';
import path from 'path';

// Increase timeout for each test to 3 minutes
jest.setTimeout(180000);

describe('SauceLabs Mobile App - Product Filtering Tests', () => {
  let driver: WebdriverIO.Browser;
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
    productsPage = new ProductsPage(driver);
  }, 180000); // Explicitly set beforeAll timeout

  afterAll(async () => {
    // Clean up by closing the driver session
    if (driver) {
      await driver.deleteSession();
    }
  });

  beforeEach(async () => {
    // Navigate to products page for each test
    await productsPage.open();
    await productsPage.waitForPageToLoad();
  });

  it('should sort products by name A-Z', async () => {
    await productsPage.sortProducts('az');
    const productNames = await productsPage.getProductNames();
    
    // Check that names are in alphabetical order
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  it('should sort products by name Z-A', async () => {
    await productsPage.sortProducts('za');
    const productNames = await productsPage.getProductNames();
    
    // Check that names are in reverse alphabetical order
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  });

  it('should sort products by price low to high', async () => {
    await productsPage.sortProducts('lohi');
    const productPrices = await productsPage.getProductPrices();
    
    // Convert string prices to numbers for comparison
    const prices = productPrices.map(price => 
      parseFloat(price.replace('$', ''))
    );
    
    // Check that prices are in ascending order
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
    
    // Log the prices for debugging
    logger.info(`Prices: ${prices.join(', ')}`);
    logger.info(`Sorted prices: ${sortedPrices.join(', ')}`);
  });

  it('should sort products by price high to low', async () => {
    await productsPage.sortProducts('hilo');
    const productPrices = await productsPage.getProductPrices();
    
    // Convert string prices to numbers for comparison
    const prices = productPrices.map(price => 
      parseFloat(price.replace('$', ''))
    );
    
    // Check that prices are in descending order
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  it('should toggle between grid and list view', async () => {
    // Check initial view (grid)
    expect(await productsPage.isGridViewActive()).toBeTruthy();
    
    // Toggle to list view
    await productsPage.toggleView();
    expect(await productsPage.isGridViewActive()).toBeFalsy();
    
    // Toggle back to grid view
    await productsPage.toggleView();
    expect(await productsPage.isGridViewActive()).toBeTruthy();
  });
}); 
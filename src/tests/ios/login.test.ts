import { remote } from 'webdriverio';
import { LoginPage } from '../../pages/LoginPage';

describe('SauceLabs Mobile App - Login Tests', () => {
  let driver: WebdriverIO.Browser;
  let loginPage: LoginPage;

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
        'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 16 Plus',
        'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '18.4',
        'appium:app': process.env.IOS_APP_PATH || './apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app',
        'appium:webDriverAgentUrl': 'http://192.168.18.180:8100',
        'appium:useNewWDA': false,
        'appium:noReset': false
      },
      logLevel: 'info'
    });

    // Initialize the login page
    loginPage = new LoginPage(driver);
  });

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
    // You would typically check for successful login by verifying products page is displayed
    // This requires a ProductsPage class that we haven't created yet
  });

  it('should show error message with invalid credentials', async () => {
    // Reset the app state before this test
    await (driver as any).execute('mobile: terminateApp', { bundleId: 'com.saucelabs.demo.ios' });
    await (driver as any).execute('mobile: launchApp', { bundleId: 'com.saucelabs.demo.ios' });
    
    // Attempt login with invalid credentials
    await loginPage.login('invalid_user', 'invalid_password');
    
    // Check that error message is displayed
    const errorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(errorDisplayed).toBeTruthy();
    
    // Check the error message text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  it('should show specific error for locked out user', async () => {
    // Reset the app state before this test
    await (driver as any).execute('mobile: terminateApp', { bundleId: 'com.saucelabs.demo.ios' });
    await (driver as any).execute('mobile: launchApp', { bundleId: 'com.saucelabs.demo.ios' });
    
    // Login as locked out user
    await loginPage.loginAsLockedOutUser();
    
    // Check that error message is displayed
    const errorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(errorDisplayed).toBeTruthy();
    
    // Check the error message text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Sorry, this user has been locked out');
  });
}); 
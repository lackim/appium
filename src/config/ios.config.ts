/**
 * iOS-specific configuration for Appium
 */
// TypeScript knows about process.env in Node environment
export const iosConfig = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone Simulator',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '15.0',
  'appium:app': process.env.IOS_APP_PATH || './apps/iOS-Simulator-SauceLabs-Mobile-Sample-App.app',
  'appium:autoAcceptAlerts': true,
  'appium:newCommandTimeout': 240,
}; 
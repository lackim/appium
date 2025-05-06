/**
 * iOS configuration for Appium
 */
import * as path from 'path';
import { removeCapabilityKeys } from '../utils/capabilityUtils';

// Create derived data path
const derivedDataPath = path.resolve('./derived_data');

// Get the app path from environment or use default
const appPath = process.env.IOS_APP_PATH 
  ? path.resolve(process.env.IOS_APP_PATH) 
  : path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');

/**
 * Main iOS configuration with direct WebDriverAgent approach
 */
export const iosConfig = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 16 Plus',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '18.4',
  'appium:app': appPath,
  'appium:webDriverAgentUrl': 'http://192.168.18.180:8100',
  'appium:useNewWDA': false,
  'appium:derivedDataPath': derivedDataPath,
  'appium:noReset': false,
  'appium:wdaStartupRetries': 4,
  'appium:wdaStartupRetryInterval': 20000
};

/**
 * Config that lets Appium manage WDA itself
 */
export const iosConfigAutoWDA = {
  ...removeCapabilityKeys<typeof iosConfig>(iosConfig, ['appium:webDriverAgentUrl']),
  'appium:useNewWDA': true,
  'appium:usePrebuiltWDA': false
}; 
// This runs once before all tests start
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';
import { ensureScreenshotDir } from './screenshotUtils';
import { configManager } from '../config/ConfigManager';
import { cleanCapabilities } from './capabilityUtils';
import { remote } from 'webdriverio';

/**
 * Global setup function to be executed before all tests.
 * It initializes the appropriate driver based on the platform.
 */
export default async function globalSetup(): Promise<void> {
  logger.info('Global setup - starting test suite');
  
  // Create directories for reports if they don't exist
  const dirs = ['./reports', './reports/logs'];
  
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
  
  // Ensure screenshot directory exists
  ensureScreenshotDir();
  
  try {
    // Get capabilities from configuration
    const platform = configManager.getPlatform();
    const rawCapabilities = configManager.getConfig();
    
    // Remove webDriverAgentUrl if it exists using type assertion
    if (rawCapabilities && 'appium:webDriverAgentUrl' in rawCapabilities) {
      delete (rawCapabilities as any)['appium:webDriverAgentUrl'];
    }
    
    // Add optimized WebDriverAgent settings
    if (rawCapabilities) {
      // Add updated capabilities for iOS - use any assertion to avoid TypeScript errors
      if (platform === 'ios') {
        (rawCapabilities as any)['appium:useNewWDA'] = false;
        (rawCapabilities as any)['appium:derivedDataPath'] = path.resolve('./derived_data');
        (rawCapabilities as any)['appium:wdaStartupRetries'] = 4;
        (rawCapabilities as any)['appium:wdaStartupRetryInterval'] = 20000;
        (rawCapabilities as any)['appium:showXcodeLog'] = true;
        (rawCapabilities as any)['appium:usePrebuiltWDA'] = true;
        (rawCapabilities as any)['appium:wdaLaunchTimeout'] = 240000;
        (rawCapabilities as any)['appium:wdaConnectionTimeout'] = 240000;
        (rawCapabilities as any)['appium:newCommandTimeout'] = 180000;
        (rawCapabilities as any)['appium:shouldUseSingletonTestManager'] = false;
        (rawCapabilities as any)['appium:waitForQuiescence'] = false;
        (rawCapabilities as any)['appium:maxTypingFrequency'] = 30;
      }
    }
    
    // Clean capabilities to ensure no undefined values
    const capabilities = cleanCapabilities<WebdriverIO.Capabilities>(rawCapabilities);
    
    // Log platform info
    logger.info('Test configuration:', {
      platform: configManager.getPlatform(),
      deviceName: configManager.getDeviceName(),
      platformVersion: configManager.getPlatformVersion(),
      appPath: configManager.getAppPath()
    });
    
    try {
      // Initialize WebDriver for use in tests
      logger.info('Initializing WebDriver');
      
      const driver = await remote({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 4723,
        path: '/',
        capabilities,
        logLevel: 'info',
        connectionRetryTimeout: 240000,
        connectionRetryCount: 3
      });
      
      // Store driver in global for access in tests
      (global as any).driver = driver;
      
      logger.info('WebDriver initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize WebDriver', error);
      // Don't throw, let tests handle this situation
    }
  } catch (error) {
    logger.error('Failed during setup', error);
    // Don't throw, let tests handle this situation
  }
} 
import { iosConfig } from './ios.config';
import { logger } from '../utils/logger';

/**
 * Platform types supported by the test framework
 */
export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
}

/**
 * iOS Configuration interface that matches the existing structure
 */
export interface IOSConfig {
  platformName: string;
  'appium:automationName': string;
  'appium:deviceName': string;
  'appium:platformVersion': string;
  'appium:app': string;
  'appium:autoAcceptAlerts': boolean;
  'appium:newCommandTimeout': number;
  [key: string]: any;
}

/**
 * ConfigManager handles platform-specific configurations
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private currentPlatform: Platform;
  private configs: Map<Platform, IOSConfig> = new Map();

  private constructor() {
    // Set platform from environment variable or default to iOS
    const platformEnv = process.env.PLATFORM?.toLowerCase() || 'ios';
    this.currentPlatform = platformEnv === 'ios' ? Platform.IOS : Platform.ANDROID;

    // Initialize platform configurations
    this.configs.set(Platform.IOS, iosConfig);
    
    // Log the loaded configuration
    logger.info(`Initialized ConfigManager with platform: ${this.currentPlatform}`);
  }

  /**
   * Get singleton instance of ConfigManager
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Get the current platform type
   */
  public getPlatform(): Platform {
    return this.currentPlatform;
  }

  /**
   * Get the configuration for the current platform
   */
  public getConfig(): IOSConfig {
    const config = this.configs.get(this.currentPlatform);
    if (!config) {
      throw new Error(`No configuration found for platform: ${this.currentPlatform}`);
    }
    return config;
  }

  /**
   * Get a specific configuration setting
   */
  public getSetting<T>(key: string): T {
    const config = this.getConfig();
    return config[key] as unknown as T;
  }

  /**
   * Override a specific configuration setting for the current test run
   */
  public overrideSetting<T>(key: string, value: T): void {
    const config = this.getConfig();
    config[key] = value as any;
    logger.info(`Configuration override: ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Check if the current platform is iOS
   */
  public isIOS(): boolean {
    return this.currentPlatform === Platform.IOS;
  }

  /**
   * Check if the current platform is Android
   */
  public isAndroid(): boolean {
    return this.currentPlatform === Platform.ANDROID;
  }

  /**
   * Get app path
   */
  public getAppPath(): string {
    return this.getSetting<string>('appium:app');
  }

  /**
   * Get device name
   */
  public getDeviceName(): string {
    return this.getSetting<string>('appium:deviceName');
  }

  /**
   * Get platform version
   */
  public getPlatformVersion(): string {
    return this.getSetting<string>('appium:platformVersion');
  }

  /**
   * Get automation name
   */
  public getAutomationName(): string {
    return this.getSetting<string>('appium:automationName');
  }
}

// Export a default instance for easier imports
export const configManager = ConfigManager.getInstance(); 
import { iosConfig } from './ios.config';
import logger from '../utils/logger';

/**
 * Enum for platform types
 */
export enum Platform {
  IOS = 'ios',
  ANDROID = 'android'
}

/**
 * Type for iOS configuration
 */
export type IOSConfig = typeof iosConfig;

/**
 * Configuration Manager for handling test environment settings
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
   * Get configuration for the current platform
   */
  public getConfig(): IOSConfig {
    const config = this.configs.get(this.currentPlatform);
    if (!config) {
      throw new Error(`No configuration found for platform: ${this.currentPlatform}`);
    }
    return config;
  }

  /**
   * Generic method to get a setting from config
   */
  private getSetting<T>(key: string): T {
    const config = this.getConfig();
    return config[key as keyof IOSConfig] as unknown as T;
  }

  /**
   * Check if current platform is iOS
   */
  public isIOS(): boolean {
    return this.currentPlatform === Platform.IOS;
  }

  /**
   * Check if current platform is Android
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
}

// Export a singleton instance
export const configManager = ConfigManager.getInstance(); 
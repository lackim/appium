// This runs once before all tests start
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';
import { ensureScreenshotDir } from './screenshotUtils';
import { configManager } from '../config/ConfigManager';

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
  
  // Log platform info
  logger.info('Test configuration:', {
    platform: configManager.getPlatform(),
    deviceName: configManager.getDeviceName(),
    platformVersion: configManager.getPlatformVersion(),
    appPath: configManager.getAppPath()
  });
  
  // Additional setup as needed
} 
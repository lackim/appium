import fs from 'fs';
import path from 'path';

/**
 * Simple logging utility for the application
 */

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// Current log level (can be set via environment variable)
const currentLogLevel = process.env.LOG_LEVEL 
  ? parseInt(process.env.LOG_LEVEL, 10) 
  : LogLevel.INFO;

/**
 * Format the current timestamp for logs
 */
const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Logger class with standard logging methods
 */
class Logger {
  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.log(`[${getTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.INFO) {
      console.log(`[${getTimestamp()}] [INFO] ${message}`, ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`[${getTimestamp()}] [ERROR] ${message}`, ...args);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Export the logger instance
export default logger; 
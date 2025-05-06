import fs from 'fs';
import path from 'path';

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  logDir: string;
  fileName: string;
  consoleOutput: boolean;
  fileOutput: boolean;
  level: LogLevel;
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  logDir: 'reports/logs',
  fileName: `test-${new Date().toISOString().split('T')[0]}.log`,
  consoleOutput: true,
  fileOutput: true,
  level: LogLevel.INFO
};

/**
 * Logger utility for consistent logging across the framework
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logFilePath: string = '';
  
  private constructor(config: LoggerConfig = DEFAULT_CONFIG) {
    this.config = config;
    
    if (this.config.fileOutput) {
      // Create log directory if it doesn't exist
      if (!fs.existsSync(this.config.logDir)) {
        fs.mkdirSync(this.config.logDir, { recursive: true });
      }
      
      this.logFilePath = path.join(this.config.logDir, this.config.fileName);
    }
  }
  
  /**
   * Get the singleton logger instance
   */
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    
    return Logger.instance;
  }
  
  /**
   * Log a message with timestamp and level
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
      
      if (this.config.consoleOutput) {
        this.logToConsole(level, logEntry);
      }
      
      if (this.config.fileOutput) {
        this.logToFile(logEntry);
      }
    }
  }
  
  /**
   * Check if the message should be logged based on the configured level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const configLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= configLevelIndex;
  }
  
  /**
   * Log to console with color based on level
   */
  private logToConsole(level: LogLevel, message: string): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        break;
    }
  }
  
  /**
   * Log to file
   */
  private logToFile(message: string): void {
    if (this.logFilePath) {
      fs.appendFileSync(this.logFilePath, message + '\n');
    }
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, error?: Error | unknown): void {
    if (error instanceof Error) {
      this.log(LogLevel.ERROR, message, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      this.log(LogLevel.ERROR, message, error);
    }
  }
  
  /**
   * Log a fatal message
   */
  public fatal(message: string, error?: Error | unknown): void {
    if (error instanceof Error) {
      this.log(LogLevel.FATAL, message, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      this.log(LogLevel.FATAL, message, error);
    }
  }
}

// Export a default instance for easier imports
export const logger = Logger.getInstance();
export { LogLevel }; 
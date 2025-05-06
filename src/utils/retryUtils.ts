/**
 * Utility for retrying operations that might be flaky
 */

/**
 * Configuration for retry mechanism
 */
export interface RetryConfig {
  maxAttempts: number;
  intervalMs: number;
  exponentialBackoff?: boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  intervalMs: 1000,
  exponentialBackoff: true,
};

/**
 * Retry an asynchronous operation with configurable attempts and intervals
 * @param operation Function to retry
 * @param config Retry configuration
 * @returns The result of the operation
 * @throws Last error encountered if all attempts fail
 */
export async function retry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < config.maxAttempts) {
        const delay = config.exponentialBackoff 
          ? config.intervalMs * Math.pow(2, attempt - 1) 
          : config.intervalMs;
          
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Retry a condition until it returns true or max attempts are reached
 * @param condition Function that returns a boolean promise
 * @param config Retry configuration
 * @returns True if condition was met, false if max attempts reached
 */
export async function retryUntil(
  condition: () => Promise<boolean>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<boolean> {
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    if (await condition()) {
      return true;
    }
    
    if (attempt < config.maxAttempts) {
      const delay = config.exponentialBackoff 
        ? config.intervalMs * Math.pow(2, attempt - 1) 
        : config.intervalMs;
        
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
} 
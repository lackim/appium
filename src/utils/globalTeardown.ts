// This runs once after all tests are complete
import { logger } from './logger';

export default async function globalTeardown(): Promise<void> {
  logger.info('Global teardown - test suite complete');
  
  // Any cleanup code needed after all tests finish running
  
  // Close any open connections, etc.
} 
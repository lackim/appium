// This runs once after all tests are complete
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

export default async function globalTeardown(): Promise<void> {
  logger.info('Global teardown - cleaning up after tests');
  
  // Add any cleanup logic here
  
  logger.info('Test suite completed');
} 
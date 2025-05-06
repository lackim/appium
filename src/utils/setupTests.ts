// Jest setup file
import { jest, beforeEach, afterEach } from '@jest/globals';
import { remote } from 'webdriverio';
import { getConfig } from '../config';

// Global timeout for tests
jest.setTimeout(60000);

// Global setup before each test
beforeEach(async () => {
  // Setup code that will run before each test
  console.log('Starting iOS test with configuration:', getConfig());
});

// Global teardown after each test
afterEach(async () => {
  // Cleanup code that will run after each test
  console.log('Test completed');
}); 
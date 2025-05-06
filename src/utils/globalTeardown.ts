// This runs once after all tests are complete
export default async function globalTeardown(): Promise<void> {
  console.log('Global teardown - test suite complete');
  
  // Any cleanup operations needed after all tests finish
  
  // Example: Log test completion time
  console.log(`Tests completed at: ${new Date().toISOString()}`);
} 
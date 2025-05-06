// This runs once before all tests start
import * as fs from 'fs';
import * as path from 'path';

export default async function globalSetup(): Promise<void> {
  console.log('Global setup - starting test suite');
  
  // Create directories for reports if they don't exist
  const dirs = ['./reports', './reports/screenshots'];
  
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
  
  // Additional setup as needed
} 
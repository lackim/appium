/**
 * Appium Inspector Configuration Generator
 * 
 * Generates clean capabilities for use with Appium Inspector with iOS 18.4
 */
import * as path from 'path';
import * as fs from 'fs';

/**
 * Checks if a value is effectively undefined
 */
function isEffectivelyUndefined(value: unknown): boolean {
  return value === undefined || value === "undefined";
}

/**
 * Removes undefined values from objects recursively
 */
function removeUndefined<T>(obj: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => !isEffectivelyUndefined(v))
      .map(([k, v]) => [
        k,
        v && typeof v === 'object' && !Array.isArray(v)
          ? removeUndefined(v as Record<string, unknown>)
          : v
      ])
  ) as T;
}

// Create derived data directory
const derivedDataPath = path.resolve('./derived_data');
if (!fs.existsSync(derivedDataPath)) {
  fs.mkdirSync(derivedDataPath, { recursive: true });
}

// Get app path
const appPath = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');

// Define capabilities interface
interface AppiumCapabilities {
  platformName: string;
  'appium:automationName': string;
  'appium:deviceName': string;
  'appium:platformVersion': string;
  'appium:app': string;
  'appium:webDriverAgentUrl': string;
  'appium:useNewWDA': boolean;
  'appium:noReset': boolean;
  'appium:derivedDataPath'?: string;
  [key: string]: unknown;  // Index for any additional properties
}

// Create capabilities for iOS testing
const capabilities = removeUndefined<AppiumCapabilities>({
  platformName: "iOS",
  "appium:automationName": "XCUITest",
  "appium:deviceName": "iPhone 16 Plus",
  "appium:platformVersion": "18.4",
  "appium:app": appPath,
  "appium:webDriverAgentUrl": "http://192.168.18.180:8100",
  "appium:useNewWDA": false,
  "appium:noReset": false,
  "appium:derivedDataPath": derivedDataPath
});

// Print the capabilities for copying
console.log("\nCapabilities for Appium Inspector:\n");
console.log(JSON.stringify(capabilities, null, 2));

// Instructions
console.log("\nInstructions:");
console.log("1. Start Appium server: npx appium --relaxed-security");
console.log(`2. Make sure WebDriverAgent is running at ${capabilities["appium:webDriverAgentUrl"]}`);
console.log("3. Copy the above capabilities to Appium Inspector");
console.log("4. Remote Host: localhost, Port: 4723, Path: /");
console.log("5. Click Start Session\n");

/**
 * To run this script:
 * npx ts-node src/scripts/inspector-config.ts
 */ 
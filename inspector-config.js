/**
 * This file contains the capabilities configuration for Appium Inspector
 * 
 * How to use:
 * 1. Start Appium server in one terminal: `npx appium --relaxed-security`
 * 2. Start WebDriverAgent in another terminal: `npx appium driver run xcuitest open-wda -p 8100`
 * 3. Open Appium Inspector
 * 4. Copy these capabilities into the "Desired Capabilities" section
 * 5. Set the Remote Host to: localhost
 * 6. Set the Remote Port to: 4723
 * 7. Set the Remote Path to: /
 * 8. Click "Start Session"
 */

const path = require('path');

/**
 * Checks if a value is effectively undefined
 */
function isEffectivelyUndefined(value) {
  return value === undefined || value === "undefined";
}

/**
 * Removes undefined values from objects
 */
function removeUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => !isEffectivelyUndefined(v))
      .map(([k, v]) => [
        k,
        v && typeof v === 'object' && !Array.isArray(v)
          ? removeUndefined(v)
          : v
      ])
  );
}

// Create derived data directory
const fs = require('fs');
const derivedDataPath = path.resolve('./derived_data');
if (!fs.existsSync(derivedDataPath)) {
  fs.mkdirSync(derivedDataPath, { recursive: true });
}

// Get app path
const appPath = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');

// Create capabilities for iOS testing
const capabilities = removeUndefined({
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
 * Troubleshooting WebDriverAgent Issues:
 * 
 * The most common issue with WebDriverAgent on iOS 18.4 is that it fails to build or connect.
 * Here's a step-by-step guide to fix it:
 * 
 * 1. Run these commands in separate terminals:
 *    Terminal 1: npx appium --relaxed-security --log-level debug
 *    Terminal 2: npx appium driver run xcuitest open-wda -p 8100
 * 
 * 2. If WebDriverAgent still fails to connect:
 *    - Make sure your iPhone simulator is already booted
 *    - Try with a different simulator version if available
 *    - Check if your Mac has the right permissions for Appium
 * 
 * 3. If you see permission issues in logs:
 *    - Run Appium with sudo: sudo npx appium --relaxed-security
 * 
 * 4. You can manually verify WebDriverAgent connection:
 *    - After starting WDA, try accessing http://192.168.18.180:8100/status in a browser
 *    - If it returns JSON with a status, WDA is running correctly
 * 
 * 5. For iOS 18.4, sometimes the latest Appium XCUITest driver has compatibility issues
 *    Consider temporarily using an iOS 17.x simulator if available
 */ 
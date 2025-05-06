/**
 * WebDriverAgent Troubleshooting Script
 * This script helps diagnose and fix common WebDriverAgent issues
 */
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runCommand(command) {
  console.log(`\n>> Running: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log("STDERR:", stderr);
    return stdout;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return null;
  }
}

async function main() {
  console.log("=== WebDriverAgent Troubleshooting Tool ===");
  
  // Check Appium installation
  await runCommand("appium --version");
  
  // Check XCUITest driver
  console.log("\n=== Checking XCUITest driver ===");
  await runCommand("appium driver list --installed");
  
  // List available simulators
  console.log("\n=== Available iOS Simulators ===");
  await runCommand("xcrun simctl list devices available");
  
  // Check if WebDriverAgent is already running
  console.log("\n=== Checking for running WebDriverAgent instances ===");
  await runCommand("lsof -i :8100");
  
  // Clean Derived Data (this can help with WDA issues)
  console.log("\n=== Cleaning Xcode Derived Data ===");
  await runCommand("rm -rf ~/Library/Developer/Xcode/DerivedData");
  
  // Rebuild WebDriverAgent with Appium
  console.log("\n=== Rebuilding WebDriverAgent ===");
  await runCommand("npx appium driver run xcuitest build-wda");
  
  // Get booted simulator UDID
  console.log("\n=== Getting booted simulator UDID ===");
  const simulatorOutput = await runCommand("xcrun simctl list devices | grep 'Booted'");
  let udid = null;
  if (simulatorOutput) {
    const match = simulatorOutput.match(/\((.*?)\)/);
    if (match && match[1]) {
      udid = match[1];
      console.log(`Found booted simulator with UDID: ${udid}`);
    }
  }
  
  // Alternative: manually start WebDriverAgent session for debugging
  console.log("\n=== Manual WDA Start Commands ===");
  console.log("To manually start WDA on simulator, run this command in a new terminal:");
  if (udid) {
    console.log(`npx appium driver run xcuitest open-wda -p 8100 --udid=${udid}`);
  } else {
    console.log("npx appium driver run xcuitest open-wda -p 8100");
  }
  
  console.log("\n=== Troubleshooting Complete ===");
  console.log("Next steps:");
  console.log("1. Start Appium server in a new terminal: npx appium --relaxed-security");
  console.log("2. In another terminal, start WDA with: npx appium driver run xcuitest open-wda -p 8100");
  console.log("3. Try running test-appium.js: node test-appium.js");
  console.log("4. If still failing, check Appium logs for specific errors");
}

main().catch(console.error); 
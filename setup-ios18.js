/**
 * iOS 18.4 Setup and Testing Script
 * 
 * This script helps handle WebDriverAgent issues with iOS 18.4:
 * 1. Creates proper directory for derived data
 * 2. Starts WebDriverAgent manually with the correct parameters
 * 3. Verifies WDA is running
 * 4. Tests a simple session with Appium
 */
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const util = require('util');
const execPromise = util.promisify(exec);
const { remote } = require('webdriverio');

// Configuration
const WDA_PORT = 8100;
const DERIVED_DATA_PATH = path.resolve('./derived_data');
const APP_PATH = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');
const UDID = 'F869526D-4689-491E-A80C-F6502CABC081'; // Your booted simulator UDID

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m"
};

// Ensure derived data directory exists
if (!fs.existsSync(DERIVED_DATA_PATH)) {
  fs.mkdirSync(DERIVED_DATA_PATH, { recursive: true });
  console.log(`${colors.green}✓ Created derived data directory at:${colors.reset} ${DERIVED_DATA_PATH}`);
}

// Helper function to check if a port is in use
async function isPortInUse(port) {
  try {
    const { stdout } = await execPromise(`lsof -i:${port}`);
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// Helper function to check if WDA is responding
function checkWDAStatus() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${WDA_PORT}/status`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.value && parsed.value.ready === true);
        } catch (e) {
          resolve(false);
        }
      });
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

// Helper function to run a command and log output
async function runCommand(command, description) {
  console.log(`\n${colors.blue}⟐ ${description}${colors.reset}`);
  console.log(`${colors.yellow}$ ${command}${colors.reset}`);
  
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log(`${colors.red}stderr:${colors.reset} ${stderr}`);
    return { success: true, stdout, stderr };
  } catch (error) {
    console.error(`${colors.red}✗ Command failed:${colors.reset} ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== iOS 18.4 Appium Setup ====${colors.reset}`);
  
  // Step 1: Check and kill existing processes
  console.log(`\n${colors.blue}⟐ Checking for existing processes${colors.reset}`);
  
  if (await isPortInUse(WDA_PORT)) {
    console.log(`${colors.yellow}➜ Port ${WDA_PORT} is in use. Attempting to free it...${colors.reset}`);
    await runCommand(`lsof -ti:${WDA_PORT} | xargs kill -9`, "Killing processes on port 8100");
  } else {
    console.log(`${colors.green}✓ Port ${WDA_PORT} is free${colors.reset}`);
  }
  
  // Step 2: Open Simulator if not already running
  const simulatorCheck = await runCommand("xcrun simctl list devices | grep 'Booted'", "Checking for booted simulators");
  if (!simulatorCheck.stdout || !simulatorCheck.stdout.includes('Booted')) {
    console.log(`${colors.yellow}➜ No booted simulator found. Opening iPhone 16 Plus...${colors.reset}`);
    await runCommand("open -a Simulator --args -CurrentDeviceUDID F869526D-4689-491E-A80C-F6502CABC081", "Starting simulator");
    console.log(`${colors.yellow}➜ Waiting for simulator to boot (30 seconds)...${colors.reset}`);
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
  
  // Step 3: Start WebDriverAgent manually
  console.log(`\n${colors.blue}⟐ Starting WebDriverAgent${colors.reset}`);
  console.log(`${colors.yellow}$ npx appium driver run xcuitest open-wda -p ${WDA_PORT} --udid=${UDID}${colors.reset}`);
  
  // Use spawn to start a detached process
  const wdaProcess = spawn('npx', [
    'appium', 'driver', 'run', 'xcuitest', 'open-wda',
    '-p', WDA_PORT.toString(),
    '--udid', UDID
  ], {
    detached: true,
    stdio: 'ignore'
  });
  
  // Unref the child process so it runs independently
  wdaProcess.unref();
  
  console.log(`${colors.yellow}➜ Waiting for WebDriverAgent to start (30 seconds)...${colors.reset}`);
  
  // Wait for WDA to start
  let wdaRunning = false;
  for (let i = 0; i < 15; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    process.stdout.write('.');
    
    const status = await checkWDAStatus();
    if (status) {
      wdaRunning = true;
      console.log(`\n${colors.green}✓ WebDriverAgent is running at http://localhost:${WDA_PORT}${colors.reset}`);
      break;
    }
  }
  
  if (!wdaRunning) {
    console.log(`\n${colors.red}✗ Failed to start WebDriverAgent.${colors.reset}`);
    console.log(`${colors.yellow}➜ Try checking logs with: npx appium driver run xcuitest open-wda -p ${WDA_PORT} --udid=${UDID} --debug${colors.reset}`);
    return;
  }
  
  // Step 4: Start Appium (if not already running)
  await runCommand("npx appium --relaxed-security", "Starting Appium");
  
  // Step 5: Run a test session
  console.log(`\n${colors.blue}⟐ Testing WebDriver connection${colors.reset}`);
  
  try {
    // Wait 5 seconds to ensure Appium has started
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const caps = {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 16 Plus',
      'appium:platformVersion': '18.4',
      'appium:app': APP_PATH,
      'appium:webDriverAgentUrl': `http://localhost:${WDA_PORT}`,
      'appium:useNewWDA': false,
      'appium:usePrebuiltWDA': true,
      'appium:preventWDAAttachments': true
    };
    
    console.log(`${colors.yellow}➜ Creating WebDriver session with capabilities:${colors.reset}`);
    console.log(JSON.stringify(caps, null, 2));
    
    const driver = await remote({
      protocol: 'http',
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      capabilities: caps,
      logLevel: 'info'
    });
    
    console.log(`${colors.green}✓ Session started successfully!${colors.reset}`);
    
    // Take a screenshot as proof
    const screenshotPath = path.join(__dirname, 'test-screenshot.png');
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot, 'base64'));
    console.log(`${colors.green}✓ Screenshot saved to:${colors.reset} ${screenshotPath}`);
    
    await driver.deleteSession();
    console.log(`${colors.green}✓ Test completed successfully${colors.reset}`);
    
    // Provide instructions for Appium Inspector
    console.log(`\n${colors.magenta}=== Next Steps ====${colors.reset}`);
    console.log(`\n${colors.blue}For Appium Inspector:${colors.reset}`);
    console.log(`1. Open Appium Inspector`);
    console.log(`2. Enter these capabilities:`);
    console.log(JSON.stringify(caps, null, 2));
    console.log(`3. Remote Host: localhost`);
    console.log(`4. Remote Port: 4723`);
    console.log(`5. Remote Path: /`);
    console.log(`6. Click "Start Session"`);
    
  } catch (error) {
    console.error(`${colors.red}✗ Error during WebDriver session:${colors.reset} ${error.message}`);
  }
}

main().catch(console.error); 
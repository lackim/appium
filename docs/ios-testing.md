# iOS Testing Guide

This document provides guidance on setting up and running automated tests on iOS devices using Appium and WebDriverAgent.

## Prerequisites

- macOS with Xcode installed (preferably the latest version)
- Node.js and npm installed
- Appium and Appium drivers installed
- iOS Simulator installed via Xcode
- App under test (e.g. SauceLabs Mobile Sample App)

## Understanding the Key Components

### WebDriverAgent (WDA)

WebDriverAgent is an iOS testing framework developed by Facebook (now Meta) that implements the WebDriver protocol. It's essential for Appium to communicate with iOS devices. Appium uses WDA behind the scenes, but sometimes direct interaction with WDA is necessary for troubleshooting or advanced usage.

When you see errors related to WDA, it typically means there's an issue with:
1. Building WebDriverAgent
2. Installing WebDriverAgent to the iOS device/simulator
3. Starting the WebDriverAgent server
4. Connecting to the WebDriverAgent server

## Setup and Troubleshooting

### Quick Start Guide

The fastest way to get up and running with iOS testing is to:

```bash
# Start the complete iOS testing environment in one command
npm run ios:start
```

This script will:
1. Kill any existing Appium or WebDriverAgent processes
2. Start WebDriverAgent in a new terminal window
3. Wait for WebDriverAgent to start listening on port 8100
4. Start Appium server with relaxed security settings
5. Display the Appium Inspector configuration to use

Once the environment is ready, you can:

1. Use Appium Inspector to explore the app's UI elements
2. Run the test script to verify everything is working:
   ```bash
   npm run appium:test
   ```
3. Run your actual test suite:
   ```bash
   npm run test:ios
   ```

### Manual Setup

If the quick start doesn't work or you need to understand each step:

1. **Build and Start WebDriverAgent**

```bash
# Navigate to the project root
cd /path/to/your/project

# Build and run WebDriverAgent
xcodebuild -project node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'platform=iOS Simulator,name=iPhone 16 Plus,OS=18.4' test
```

2. **Verify WebDriverAgent is running**

```bash
# Check if WebDriverAgent is responding
curl http://192.168.18.180:8100/status
```

If successful, you'll see a JSON response with status information.

3. **Start Appium Server**

```bash
# Start Appium server with relaxed security to allow all plugins and extensions
npx appium --relaxed-security
```

4. **Run a Test**

```bash
# Run a simple test to verify the setup
node test-appium.js
```

## Troubleshooting Common Issues

### 1. WebDriverAgent Build Failures

If WDA fails to build:

- Check Xcode version compatibility
- Run `sudo chmod -R 777 node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/` to fix permission issues
- Clear derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/WebDriverAgent-*`
- Make sure your Apple Developer account is set up correctly (for real devices)

### 2. Connection Issues

If you can't connect to WebDriverAgent:

- Verify WebDriverAgent is running with `curl http://192.168.18.180:8100/status`
- Check the IP address of your simulator/device (it may not be `192.168.18.180`)
- For real devices, make sure the device is trusted and USB debugging is enabled
- Try using `appium:webDriverAgentUrl` capability to connect to an existing WDA session

### 3. App Launch Issues

If the app doesn't launch:

- Verify the app path is correct
- Make sure the app is compatible with the iOS version
- Check app signing (for real devices)

## Important Configuration Options

These are the key Appium capabilities for iOS testing:

```typescript
const caps = {
  platformName: 'iOS',                                           // Required
  'appium:automationName': 'XCUITest',                          // Required for iOS
  'appium:deviceName': 'iPhone 16 Plus',                        // Simulator or device name
  'appium:platformVersion': '18.4',                             // iOS version
  'appium:app': '/path/to/your/app.app',                       // Path to the app
  
  // WebDriverAgent-specific
  'appium:webDriverAgentUrl': 'http://192.168.18.180:8100',    // Connect to existing WDA
  'appium:useNewWDA': false,                                   // Don't restart WDA
  'appium:wdaLaunchTimeout': 120000,                           // Increase timeout for WDA launch
  'appium:wdaConnectionTimeout': 120000,                       // Increase connection timeout
  
  // Other useful options
  'appium:noReset': false,                                     // Don't reset app state between sessions
  'appium:fullReset': false,                                   // Uninstall app before new session
  'appium:newCommandTimeout': 240,                             // Increase timeout for commands
  'appium:includeSafariInWebviews': true,                      // Enable webview support
};
```

## Using Appium Inspector

Appium Inspector is a GUI tool that helps inspect the app's UI hierarchy and interact with elements.

1. Install [Appium Inspector](https://github.com/appium/appium-inspector/releases)
2. Configure it with:
   - Remote Host: `localhost`
   - Remote Port: `4723`
   - Remote Path: `/`
   - Capabilities:
     ```json
     {
       "platformName": "iOS",
       "appium:automationName": "XCUITest",
       "appium:deviceName": "iPhone 16 Plus",
       "appium:platformVersion": "18.4",
       "appium:app": "/absolute/path/to/your/app.app",
       "appium:webDriverAgentUrl": "http://192.168.18.180:8100",
       "appium:useNewWDA": false
     }
     ```

3. Click "Start Session"

## Moving Forward with Page Objects

Once your environment is correctly set up, you can create Page Objects that represent screens in your application:

```typescript
// Example LoginPage class
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Elements
  private usernameField = '~test-Username';  // Accessibility ID selector
  private passwordField = '~test-Password';
  private loginButton = '~test-LOGIN';

  // Actions
  async login(username: string, password: string): Promise<void> {
    await this.waitAndSendKeys(this.usernameField, username);
    await this.waitAndSendKeys(this.passwordField, password);
    await this.waitAndClick(this.loginButton);
  }
}
```

## References

- [Appium Capabilities Documentation](https://appium.io/docs/en/latest/guides/caps/)
- [WebDriverAgent GitHub Repository](https://github.com/appium/WebDriverAgent)
- [Appium XCUITest Driver Documentation](https://appium.io/docs/en/drivers/ios-xcuitest/)

## WebDriverAgent IP Configuration

When WebDriverAgent starts, it will output its URL in the terminal like this:
```
ServerURLHere->http://192.168.18.180:8100<-ServerURLHere
```

If you see a different IP address in your logs, make sure to update it in:
1. `test-appium.js`
2. `src/config/ios.config.ts`
3. `start-ios-test.sh`
4. Your Appium Inspector capabilities

This is the IP address of your iOS simulator on your network, and it's required for the WebDriverAgent connection to work properly. 
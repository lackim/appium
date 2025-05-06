# Native Mobile App UI Test Automation for iOS

This project implements automated UI tests for an iOS mobile application using Appium, following the Page Object Model (POM) design pattern.

## Technology Stack

- **Appium** as the mobile automation framework
- **TypeScript** as the programming language
- **WebdriverIO** for Appium integration
- **Jest** as the test runner
- Tests can run on real iOS devices or simulators

## Project Structure

```
.
├── config/                   # iOS-specific configurations
├── src/
│   ├── pages/                # Page Object Models
│   ├── scripts/              # Utility scripts for setup and debugging
│   ├── tests/                # Test cases
│   ├── utils/                # Helper utilities
│   └── types/                # TypeScript type definitions
├── scripts/                  # Shell scripts for environment setup
├── reports/                  # Test reports (generated)
└── README.md                 # Project documentation
```

## Implemented Tests

The automation suite covers the following test scenarios:

### Core Flow
1. Adding products to the shopping cart
2. Verifying the added product is displayed in the cart
3. Proceeding to checkout and filling in all required information
4. Entering payment information and reviewing the order
5. Verifying order details on the checkout screen
6. Completing the purchase process

### Additional Tests
- Validation of error messages for empty required fields
- Product filtering functionality
- Cart management (adding/removing items)

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables for your test environment
4. Download the sample app from [GitHub](https://github.com/saucelabs/sample-app-mobile/releases/) or use a similar app

## Launching iOS Tests

To run iOS automated tests with this framework, follow these steps:

### 1. Start the iOS Testing Environment

```bash
npm run ios:start
```

This will automatically:
- Start WebDriverAgent on port 8100
- Launch Appium server with relaxed security
- Configure everything for testing

### 2. Use Appium Inspector

Once the environment is running, you can use Appium Inspector with the configuration shown in the terminal:

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

### 3. Run Tests

To run a simple test script that validates the setup:

```bash
npm run appium:test
```

For running the test suite:

```bash
npm run test:ios
```

## Troubleshooting

If you encounter issues with WebDriverAgent, refer to the [iOS Testing Guide](docs/ios-testing.md) for detailed troubleshooting steps.

## Development Notes

This project implements:
- Page Object Model (POM) for better test structure and maintainability
- Configuration files for iOS-specific settings
- Environment variables for dynamic parameter management
- Helper methods and framework-level action wrappers
- Dynamic waits and optimized test execution 

## Troubleshooting Appium Inspector for iOS 18.4

If you encounter the error "The file 'project.xcworkspace' could not be unlocked", follow these steps:

1. Stop all Appium processes:
```bash
pkill -f appium
```

2. Fix permissions for the WebDriverAgent directory:
```bash
sudo chmod -R 777 node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/
```

3. Clear Xcode data:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/WebDriverAgent-*
```

4. Rebuild WebDriverAgent:
```bash
npx appium driver run xcuitest build-wda
```

5. Run Appium with relaxed-security flag:
```bash
npx appium --relaxed-security
```

6. In a separate terminal, start WebDriverAgent:
```bash
npx appium driver run xcuitest open-wda -p 8100 --debug
```

7. Modify settings in the ios.config.ts file:
```typescript
export const iosConfig = {
  // ... existing settings
  'appium:webDriverAgentUrl': 'http://localhost:8100',
  'appium:useNewWDA': false, // Don't restart WDA
  'appium:usePrebuiltWDA': true // Use existing WDA
};
```

8. Check if WebDriverAgent is running:
```bash
curl http://localhost:8100/status
```

If problems persist, consider using an older iOS version (e.g., 17.x) or a physical iOS device.

## Implementing Page Objects without a working Appium Inspector

If you can't run Appium Inspector for iOS 18.4, you can still implement abstract Page Objects as follows:

1. Create base Page Object classes with approximate selectors based on iOS conventions:

```typescript
// src/pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Use predictable iOS selectors
  private usernameField = '~username'; // Accessibility ID
  private passwordField = '~password'; // Accessibility ID 
  private loginButton = '~login-button'; // Accessibility ID

  async login(username: string, password: string): Promise<void> {
    await this.waitAndSendKeys(this.usernameField, username);
    await this.waitAndSendKeys(this.passwordField, password);
    await this.waitAndClick(this.loginButton);
  }
}
```

2. Use universal selectors that work across platforms:
   - Accessibility ID (prefix `~`) - best choice
   - XPath - use only when necessary
   - Predicate strings - for complex iOS conditions

3. Implement abstract Page Objects with future refactoring in mind:

```typescript
// src/pages/ProductsPage.ts
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  // Placeholder selectors - to be updated later when Inspector access is available
  private productsList = '~products-list';
  private productItem = (name: string) => `~${name}`;
  
  async selectProduct(name: string): Promise<void> {
    await this.waitForElement(this.productsList);
    await this.waitAndClick(this.productItem(name));
  }
}
```

4. Add TODO comments in places that require verification of actual selectors:

```typescript
// TODO: Verify selectors after running Appium Inspector
private checkoutButton = '~checkout';
```

This strategy allows you to implement a Page Object structure that you can easily update once you get Appium Inspector working or when you have access to a device with iOS 17.x. 
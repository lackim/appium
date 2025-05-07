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
│   ├── data/                 # Test data management
│   │   ├── generators/       # Data generators
│   │   ├── providers/        # Test data providers
│   │   └── TestStateManager.ts # State management between test steps
│   ├── pages/                # Page Object Models
│   ├── scripts/              # Utility scripts for setup and debugging
│   ├── tests/                # Test cases
│   │   └── ios/              # iOS-specific tests
│   ├── utils/                # Helper utilities
│   └── types/                # TypeScript type definitions
├── scripts/                  # Shell scripts for environment setup
├── reports/                  # Test reports (generated)
└── README.md                 # Project documentation
```

## Test Implementation

### Core Test Flow
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

### Test Organization
- Test files: `feature-name.test.ts`
- Test suites: Descriptive of feature being tested
- Test cases: Should start with "should" and describe expected behavior

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables for your test environment
4. Download the sample app from [GitHub](https://github.com/saucelabs/sample-app-mobile/releases/) or use a similar app

## Running Tests

```bash
# Run all tests
npm test

# Run iOS tests only
npm run test:ios

# Run specific test files
npm run test:checkout
npm run test:login

# Run tests matching specific pattern
npm test -- -t "should login successfully"
```

## iOS Testing Environment Setup

### 1. Start the iOS Testing Environment

```bash
npm run ios:start
```

This will automatically:
- Start WebDriverAgent on port 8100
- Launch Appium server with relaxed security
- Configure everything for testing

### 2. Appium Inspector Configuration

Once the environment is running, use Appium Inspector with:
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

## Troubleshooting

### WebDriverAgent Issues

If you encounter the error "The file 'project.xcworkspace' could not be unlocked":

1. Stop all Appium processes:
```bash
pkill -f appium
```

2. Fix permissions:
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

5. Run Appium with relaxed-security:
```bash
npx appium --relaxed-security
```

6. Start WebDriverAgent:
```bash
npx appium driver run xcuitest open-wda -p 8100 --debug
```

7. Update ios.config.ts:
```typescript
export const iosConfig = {
  'appium:webDriverAgentUrl': 'http://localhost:8100',
  'appium:useNewWDA': false,
  'appium:usePrebuiltWDA': true
};
```

8. Verify WebDriverAgent:
```bash
curl http://localhost:8100/status
```

## Development Notes

### Page Object Implementation
When Appium Inspector is unavailable, implement Page Objects using:

1. Base Page Object classes with approximate selectors:
```typescript
// src/pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
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

2. Universal selector strategies:
   - Accessibility ID (prefix `~`) - preferred
   - XPath - use sparingly
   - Predicate strings - for complex iOS conditions

### Design Decisions
- Page Object Model (POM) for better test structure and maintainability
- Configuration files for iOS-specific settings
- Environment variables for dynamic parameter management
- Helper methods and framework-level action wrappers
- Dynamic waits and optimized test execution

## Contributing

1. Create feature branches from `main`
2. Use conventional commits
3. Submit PRs for review
4. Merge to `main` after validation
5. Tag significant milestones 
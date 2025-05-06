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
│   ├── tests/                # Test cases
│   ├── utils/                # Helper utilities
│   └── types/                # TypeScript type definitions
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

## Running Tests

```
npm run test
```

or

```
npm run test:ios
```

## Development Notes

This project implements:
- Page Object Model (POM) for better test structure and maintainability
- Configuration files for iOS-specific settings
- Environment variables for dynamic parameter management
- Helper methods and framework-level action wrappers
- Dynamic waits and optimized test execution 
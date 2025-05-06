# Test Data Management Layer

This directory contains components for managing test data within the iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1 automation framework.

## Structure

```
data/
├── generators/         # Data generators for creating test data
│   ├── customerDataGenerator.ts  # Generates customer information
│   ├── paymentDataGenerator.ts   # Generates payment information
│   └── productDataGenerator.ts   # Manages product data
├── providers/          # Test data providers for test parameterization
│   └── checkoutDataProvider.ts   # Provides data for checkout tests
├── TestStateManager.ts  # Manages state across test steps
└── index.ts             # Main exports
```

## Key Components

### Data Generators

Data generators provide methods to create randomized test data for different test scenarios. They follow these principles:

- Each generator focuses on a specific domain entity (customer, payment, product)
- Generator methods create data with predictable patterns but unique values
- Generators support both valid and invalid data generation
- Types are strictly defined for all generated data

### Data Providers

Data providers compose data from generators to create complete test datasets. They:

- Combine multiple data entities into usable test scenarios
- Provide parameterized data for data-driven testing
- Include variants for positive and negative test cases
- Include descriptive metadata for test reporting

### Test State Manager

The `TestStateManager` is a singleton that maintains state across test steps:

- Stores and retrieves test data during test execution
- Manages test metadata like test ID and timing information
- Provides a clean API for test data sharing
- Resets state between tests to prevent cross-test contamination

## Usage Example

```typescript
// Import components
import { CheckoutDataProvider, TestStateManager } from '../data';

// Get the state manager
const stateManager = TestStateManager.getInstance();
stateManager.initTest('my-test-123');

// Get test data
const testData = CheckoutDataProvider.getHappyPathData();

// Store in state manager
stateManager.setCurrentProduct(testData.product);
stateManager.setCustomerInfo(testData.customer);
stateManager.setPaymentInfo(testData.payment);

// Use in tests
await checkoutInfoPage.fillAndContinue(testData.customer);
await paymentDetailsPage.fillAndReview(testData.payment);

// Get test metadata
const metadata = stateManager.getTestMetadata();
console.log(`Test duration: ${metadata.duration}ms`);
```

## Best Practices

1. Always initialize the state manager at the beginning of each test
2. Reset state between tests to prevent cross-test contamination
3. Use the appropriate generators/providers based on test requirements
4. Store important test data in the state manager for easy access
5. Use static methods for accessing data, keeping the API clean and simple 
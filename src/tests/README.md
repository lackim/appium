# Test Structure

This directory contains all the automated tests for the iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1 project.

## Organization

```
tests/
└── ios/                      # iOS-specific tests
    ├── login.test.ts         # Authentication tests
    └── checkout-flow.test.ts # E2E checkout flow tests
```

## Running Tests

To run the tests:

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

## Test Data

Test data for these tests is managed through the data management layer in `src/data/`.

## Naming Conventions

- Test files: `feature-name.test.ts`
- Test suites: Descriptive of feature being tested
- Test cases: Should start with "should" and describe expected behavior

## Directory Migration

Note: We are in the process of migrating tests from the root-level `tests/` directory to the `src/tests/` directory.
All new tests should be created in the `src/tests/` directory. 
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

## Rozwiązywanie problemów z Appium Inspector dla iOS 18.4

Jeśli napotkasz błąd "The file 'project.xcworkspace' could not be unlocked", wykonaj poniższe kroki:

1. Zatrzymaj wszystkie procesy Appium:
```bash
pkill -f appium
```

2. Napraw uprawnienia do katalogu WebDriverAgent:
```bash
sudo chmod -R 777 node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/
```

3. Wyczyść dane Xcode:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/WebDriverAgent-*
```

4. Zbuduj WebDriverAgent ponownie:
```bash
npx appium driver run xcuitest build-wda
```

5. Uruchom Appium z flagą relaxed-security:
```bash
npx appium --relaxed-security
```

6. W osobnym terminalu uruchom WebDriverAgent:
```bash
npx appium driver run xcuitest open-wda -p 8100 --debug
```

7. Zmodyfikuj ustawienia w pliku ios.config.ts:
```typescript
export const iosConfig = {
  // ... existing settings
  'appium:webDriverAgentUrl': 'http://localhost:8100',
  'appium:useNewWDA': false, // Nie restartuj WDA
  'appium:usePrebuiltWDA': true // Użyj istniejącego WDA
};
```

8. Sprawdź czy WebDriverAgent działa:
```bash
curl http://localhost:8100/status
```

Jeśli nadal występują problemy, rozważ użycie starszej wersji iOS (np. 17.x) lub użyj rzeczywistego urządzenia iOS. 

## Implementacja Page Objects bez działającego Appium Inspector

Jeśli nie możesz uruchomić Appium Inspector dla iOS 18.4, nadal możesz zaimplementować abstrakcyjne Page Objects w następujący sposób:

1. Utwórz bazowe klasy Page Objects z przybliżonymi selektorami na podstawie konwencji iOS:

```typescript
// src/pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Używaj przewidywalnych selektorów iOS
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

2. Używaj uniwersalnych selektorów, które działają na różnych platformach:
   - Accessibility ID (prefiks `~`) - najlepszy wybór
   - XPath - używaj tylko gdy konieczne
   - Predicate strings - dla złożonych warunków iOS

3. Implementuj abstraktyczne Page Objects z myślą o przyszłej refaktoryzacji:

```typescript
// src/pages/ProductsPage.ts
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  // Zastępcze selektory - do późniejszej aktualizacji po dostępie do Inspectora
  private productsList = '~products-list';
  private productItem = (name: string) => `~${name}`;
  
  async selectProduct(name: string): Promise<void> {
    await this.waitForElement(this.productsList);
    await this.waitAndClick(this.productItem(name));
  }
}
```

4. Dodaj komentarze TODO w miejscach, które wymagają sprawdzenia rzeczywistych selektorów:

```typescript
// TODO: Zweryfikować selektory po uruchomieniu Appium Inspector
private checkoutButton = '~checkout';
```

Ta strategia pozwoli Ci zaimplementować strukturę Page Objects, którą łatwo zaktualizujesz, gdy uda Ci się uruchomić Appium Inspector lub gdy będziesz miał dostęp do urządzenia z iOS 17.x. 
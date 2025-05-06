import { CheckoutDataProvider, TestStateManager } from '../../data';
import { ProductsPage, CartPage, CheckoutInfoPage, PaymentDetailsPage, OrderSummaryPage, OrderConfirmationPage } from '../../pages';

// Declare a global driver variable to represent WebdriverIO's browser object
declare const browser: WebdriverIO.Browser;

/**
 * Test suite for complete checkout flow
 */
describe('Checkout Flow', () => {
  // Page objects
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let paymentDetailsPage: PaymentDetailsPage;
  let orderSummaryPage: OrderSummaryPage;
  let orderConfirmationPage: OrderConfirmationPage;
  
  // State manager
  let stateManager: TestStateManager;

  beforeEach(() => {
    // Initialize page objects - passing driver instance
    // In a real test, we'd use a driver from our test context
    const driver = browser;
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    checkoutInfoPage = new CheckoutInfoPage(driver);
    paymentDetailsPage = new PaymentDetailsPage(driver);
    orderSummaryPage = new OrderSummaryPage(driver);
    orderConfirmationPage = new OrderConfirmationPage(driver);
    
    // Initialize state manager
    stateManager = TestStateManager.getInstance();
    stateManager.initTest(`checkout-flow-${Date.now()}`);
  });

  afterEach(async () => {
    // Reset state
    stateManager.resetState();
  });

  /**
   * Complete checkout happy path
   */
  test('should successfully complete checkout with valid data', async () => {
    // Get test data from provider
    const testData = CheckoutDataProvider.getHappyPathData();
    
    // Store data in state manager
    stateManager.setCurrentProduct(testData.product);
    stateManager.setCustomerInfo(testData.customer);
    stateManager.setPaymentInfo(testData.payment);
    
    // Select and add product to cart
    await productsPage.waitForPageToLoad();
    await productsPage.selectProductByName(testData.product.name);
    await productsPage.clickAddToCartButton();
    
    // Navigate to checkout
    await cartPage.proceedToCheckout();
    
    // Fill customer information
    await checkoutInfoPage.fillAndContinue(testData.customer);
    
    // Fill payment details
    await paymentDetailsPage.fillAndReview(testData.payment);
    
    // Get order summary data and store in state manager
    const orderSummary = await orderSummaryPage.extractOrderSummary();
    stateManager.setOrderSummary(orderSummary);
    
    // Complete purchase
    await orderSummaryPage.placeOrder();
    
    // Get order confirmation data and store in state manager
    const confirmation = await orderConfirmationPage.getOrderConfirmation();
    stateManager.setOrderConfirmation(confirmation);
    
    // Verify order confirmation
    expect(confirmation.orderNumber).toBeTruthy();
    expect(confirmation.orderTotal).toContain(testData.product.price.replace('$', ''));
  });

  /**
   * Test with parameterized data for different checkout scenarios
   */
  const testCases = CheckoutDataProvider.getCheckoutTestCases();
  
  test.each(testCases)('should complete checkout: $description', async (testData) => {
    // Store data in state manager
    stateManager.setCurrentProduct(testData.product);
    stateManager.setCustomerInfo(testData.customer);
    stateManager.setPaymentInfo(testData.payment);
    
    // Complete checkout flow
    await productsPage.waitForPageToLoad();
    await productsPage.selectProductByName(testData.product.name);
    await productsPage.clickAddToCartButton();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillAndContinue(testData.customer);
    await paymentDetailsPage.fillAndReview(testData.payment);
    
    // Store order summary data
    const orderSummary = await orderSummaryPage.extractOrderSummary();
    stateManager.setOrderSummary(orderSummary);
    
    await orderSummaryPage.placeOrder();
    
    // Store confirmation data
    const confirmation = await orderConfirmationPage.getOrderConfirmation();
    stateManager.setOrderConfirmation(confirmation);
    
    // Verify order was placed successfully
    expect(await orderConfirmationPage.isConfirmationDisplayed()).toBe(true);
  });

  /**
   * Negative test cases with invalid data
   */
  test('should show validation error with missing customer information', async () => {
    // Get test data with missing customer field
    const testData = CheckoutDataProvider.getInvalidCheckoutTestCases()[0];
    
    // Complete checkout flow until error
    await productsPage.waitForPageToLoad();
    await productsPage.selectProductByName(testData.product.name);
    await productsPage.clickAddToCartButton();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillAndContinue(testData.customer);
    
    // Verify error message is displayed
    const errorMessage = await checkoutInfoPage.getErrorMessage();
    expect(errorMessage).not.toBe('');
    expect(errorMessage).toContain('required');
  });
}); 
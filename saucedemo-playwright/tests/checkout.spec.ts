import { test, expect } from '../fixtures';
import checkoutInfo from '../test-data/checkout-info.json';

test.describe('Checkout flow', () => {
  test('completes a full purchase end-to-end @smoke', async ({
    authenticatedPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    // Add an item and go to cart
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    await authenticatedPage.click(authenticatedPage.shoppingCartLink);

    // Proceed to checkout
    await cartPage.checkout();

    // Fill customer info
    const { firstName, lastName, postalCode } = checkoutInfo.validCustomer;
    await checkoutStepOnePage.fillCustomerInfo(firstName, lastName, postalCode);
    await checkoutStepOnePage.continueToOverview();

    // Verify overview totals are shown, then finish
    await expect(checkoutStepTwoPage.subtotalLabel).toBeVisible();
    await expect(checkoutStepTwoPage.totalLabel).toBeVisible();
    await checkoutStepTwoPage.finish();

    // Confirm order completion
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');

    // Back to products
    await checkoutCompletePage.backToProducts();
    await checkoutCompletePage.expectUrl(/inventory\.html/);
  });

  test('shows an error when first name is missing', async ({
    authenticatedPage,
    cartPage,
    checkoutStepOnePage,
  }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    await authenticatedPage.click(authenticatedPage.shoppingCartLink);
    await cartPage.checkout();

    await checkoutStepOnePage.fillCustomerInfo('', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();

    await expect(checkoutStepOnePage.errorMessage).toContainText('First Name is required');
  });

  test('cancelling from checkout step one returns to the cart', async ({
    authenticatedPage,
    cartPage,
    checkoutStepOnePage,
  }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    await authenticatedPage.click(authenticatedPage.shoppingCartLink);
    await cartPage.checkout();

    await checkoutStepOnePage.click(checkoutStepOnePage.cancelButton);
    await checkoutStepOnePage.expectUrl(/cart\.html/);
  });
});

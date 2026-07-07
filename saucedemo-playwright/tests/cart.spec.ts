import { test, expect } from '../fixtures';

test.describe('Cart page', () => {
  test('shows added items and allows navigating to checkout', async ({
    authenticatedPage,
    cartPage,
  }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    await authenticatedPage.click(authenticatedPage.shoppingCartLink);

    await cartPage.expectVisible(cartPage.pageTitle);
    expect(await cartPage.getCartItemCount()).toBe(1);

    await cartPage.checkout();
    await cartPage.expectUrl(/checkout-step-one\.html/);
  });

  test('removing an item from the cart page updates the count', async ({
    authenticatedPage,
    cartPage,
  }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Bike Light'));
    await authenticatedPage.click(authenticatedPage.shoppingCartLink);

    expect(await cartPage.getCartItemCount()).toBe(2);

    await cartPage.click(cartPage.removeButton('Sauce Labs Backpack'));
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('continue shopping returns to the products page', async ({
    authenticatedPage,
    cartPage,
  }) => {
    await authenticatedPage.click(authenticatedPage.shoppingCartLink);
    await cartPage.click(cartPage.continueShoppingButton);
    await cartPage.expectUrl(/inventory\.html/);
  });
});

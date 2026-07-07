import { test, expect } from '../fixtures';
import { parsePrice } from '../utils/helpers';

test.describe('Inventory / Products page', () => {
  // Uses the `authenticatedPage` fixture, which logs in as standard_user
  // and lands on the inventory page before the test body runs.

  test('displays the products page after login @smoke', async ({ authenticatedPage }) => {
    await authenticatedPage.expectText(authenticatedPage.pageTitle, 'Products');
    expect(await authenticatedPage.inventoryItems.count()).toBeGreaterThan(0);
  });

  test('adding a product to the cart updates the cart badge', async ({ authenticatedPage }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    expect(await authenticatedPage.getCartBadgeCount()).toBe(1);
    await expect(authenticatedPage.removeFromCartButton('Sauce Labs Backpack')).toBeVisible();
  });

  test('removing a product from the cart clears the badge', async ({ authenticatedPage }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    expect(await authenticatedPage.getCartBadgeCount()).toBe(1);

    await authenticatedPage.click(authenticatedPage.removeFromCartButton('Sauce Labs Backpack'));
    expect(await authenticatedPage.getCartBadgeCount()).toBe(0);
  });

  test('adding multiple products increases the cart badge count', async ({ authenticatedPage }) => {
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Bike Light'));
    await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Bolt T-Shirt'));

    expect(await authenticatedPage.getCartBadgeCount()).toBe(3);
  });

  test('sorting products from low to high price sorts them correctly', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.sortBy('lohi');

    const count = await authenticatedPage.inventoryItems.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      prices.push(parsePrice((await authenticatedPage.itemPrice(i).textContent()) ?? '$0'));
    }

    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorting products from Z to A sorts names in reverse alphabetical order', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.sortBy('za');

    const count = await authenticatedPage.inventoryItems.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push((await authenticatedPage.itemName(i).textContent()) ?? '');
    }

    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('logging out returns to the login page', async ({ authenticatedPage }) => {
    await authenticatedPage.logout();
    await authenticatedPage.expectUrl(/saucedemo\.com\/?$/);
  });
});

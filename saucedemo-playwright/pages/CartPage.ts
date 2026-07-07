import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart page: https://www.saucedemo.com/cart.html
 */
export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  removeButton(productName: string): Locator {
    const testId = `remove-${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    return this.page.locator(`[data-test="${testId}"]`);
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async checkout(): Promise<void> {
    await this.click(this.checkoutButton);
  }
}

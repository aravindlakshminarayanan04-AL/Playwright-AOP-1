import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Complete (order confirmation): https://www.saucedemo.com/checkout-complete.html
 */
export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async backToProducts(): Promise<void> {
    await this.click(this.backHomeButton);
  }
}

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Step Two (order overview): https://www.saucedemo.com/checkout-step-two.html
 */
export class CheckoutStepTwoPage extends BasePage {
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getTotalText(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async finish(): Promise<void> {
    await this.click(this.finishButton);
  }
}

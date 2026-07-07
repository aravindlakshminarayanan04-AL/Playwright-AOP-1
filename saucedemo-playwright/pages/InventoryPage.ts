import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Products / Inventory page: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  /** Locate an "Add to cart" button for a given product name, e.g. "Sauce Labs Backpack" */
  addToCartButton(productName: string): Locator {
    const testId = `add-to-cart-${this.slugify(productName)}`;
    return this.page.locator(`[data-test="${testId}"]`);
  }

  /** Locate a "Remove" button for a given product name, once it's in the cart */
  removeFromCartButton(productName: string): Locator {
    const testId = `remove-${this.slugify(productName)}`;
    return this.page.locator(`[data-test="${testId}"]`);
  }

  itemName(index: number): Locator {
    return this.inventoryItems.nth(index).locator('[data-test="inventory-item-name"]');
  }

  itemPrice(index: number): Locator {
    return this.inventoryItems.nth(index).locator('[data-test="inventory-item-price"]');
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.shoppingCartBadge.count()) {
      const text = await this.shoppingCartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  async openMenu(): Promise<void> {
    await this.click(this.menuButton);
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.click(this.logoutLink);
  }

  private slugify(productName: string): string {
    return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
}

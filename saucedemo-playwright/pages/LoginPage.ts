import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login page: https://www.saucedemo.com/
 * Locators use saucedemo's stable data-test attributes.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('.error-button');
  }

  async goto(): Promise<void> {
    await super.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  async dismissError(): Promise<void> {
    await this.click(this.errorButton);
  }
}

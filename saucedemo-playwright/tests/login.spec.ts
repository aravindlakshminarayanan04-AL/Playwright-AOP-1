import { test, expect } from '../fixtures';
import users from '../test-data/users.json';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('logs in successfully with a standard user @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await inventoryPage.expectVisible(inventoryPage.pageTitle);
    await inventoryPage.expectText(inventoryPage.pageTitle, 'Products');
  });

  test('shows an error for a locked out user', async ({ loginPage }) => {
    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('shows an error when username is missing', async ({ loginPage }) => {
    await loginPage.login('', users.standardUser.password);
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('shows an error when password is missing', async ({ loginPage }) => {
    await loginPage.login(users.standardUser.username, '');
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('error banner can be dismissed', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.errorMessage).toBeHidden();
  });
});

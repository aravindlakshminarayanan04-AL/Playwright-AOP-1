# SauceDemo Playwright TypeScript Automation Framework

A complete, ready-to-run test automation framework for [saucedemo.com](https://www.saucedemo.com) — Sauce Labs' official demo e-commerce app — built with [Playwright](https://playwright.dev/) and TypeScript, using the Page Object Model (POM).

All locators use saucedemo's stable `data-test="..."` attributes, which are officially documented and have been unchanged for years, so this framework works out of the box.

## Project Structure

```
saucedemo-playwright/
├── tests/
│   ├── login.spec.ts            # Valid/invalid/locked-out login scenarios
│   ├── inventory.spec.ts        # Sorting, add/remove from cart, logout
│   ├── cart.spec.ts             # Cart page behavior
│   └── checkout.spec.ts         # Full end-to-end purchase flow
├── pages/                       # Page Object classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStepOnePage.ts
│   ├── CheckoutStepTwoPage.ts
│   └── CheckoutCompletePage.ts
├── fixtures/
│   └── index.ts                 # Injects page objects + an `authenticatedPage` fixture
├── utils/
│   └── helpers.ts                # Price parsing, slugify, retry, sleep
├── test-data/
│   ├── users.json                # All 6 official saucedemo accounts
│   └── checkout-info.json        # Sample customer info for checkout tests
├── .github/workflows/playwright.yml   # CI pipeline
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── .eslintrc.json
└── .prettierrc
```

## Setup

```bash
npm install
npm run install:browsers
cp .env.example .env
```

## Running Tests

```bash
npm test                 # Run all tests, all browsers
npm run test:headed      # Run with visible browser
npm run test:ui          # Playwright's interactive UI mode
npm run test:debug       # Step through in debug mode
npm run test:chromium    # Only on Chromium
npm run test:smoke       # Only tests tagged @smoke
npm run report           # Open the last HTML report
npm run codegen          # Launch Playwright's recorder against saucedemo.com
```

## Test Accounts

All defined in `test-data/users.json` (password for every user is `secret_sauce`):

| Username                 | Behavior                                      |
|--------------------------|------------------------------------------------|
| `standard_user`          | Normal, fully-working account                  |
| `locked_out_user`        | Login blocked with an error message            |
| `problem_user`           | Logs in but has broken product images/UI       |
| `performance_glitch_user`| Logs in but with an artificial delay           |
| `error_user`             | Logs in but triggers errors on some actions    |
| `visual_user`            | Logs in but has visual/layout glitches         |

## The `authenticatedPage` Fixture

Most tests don't need to repeat login boilerplate. `fixtures/index.ts` exposes an `authenticatedPage` fixture that logs in as `standard_user` and lands on the inventory page before your test body runs:

```ts
import { test, expect } from '../fixtures';

test('adds an item to the cart', async ({ authenticatedPage }) => {
  await authenticatedPage.click(authenticatedPage.addToCartButton('Sauce Labs Backpack'));
  expect(await authenticatedPage.getCartBadgeCount()).toBe(1);
});
```

For tests that need to exercise the login form itself (e.g. invalid credentials), use the plain `loginPage` fixture instead.

## Writing New Tests

1. Add a new **Page Object** in `pages/` for any new screen, extending `BasePage`.
2. Register it as a fixture in `fixtures/index.ts`.
3. Import `test`/`expect` from `../fixtures` (not `@playwright/test` directly) in your spec file.

## Tagging Tests

```bash
npx playwright test --grep @smoke
```

## CI

`.github/workflows/playwright.yml` runs the full suite on every push/PR to `main` and uploads the HTML report as an artifact.

## Notes on Locators

Every locator uses saucedemo's `data-test` attributes (e.g. `[data-test="username"]`, `[data-test="add-to-cart-sauce-labs-backpack"]`), which Sauce Labs publishes and keeps stable specifically so this site can be used for automation practice. If Sauce Labs ever renames a product (changing its slug), re-run:
```bash
npm run codegen
```
to confirm the exact `data-test` value and update the relevant Page Object.

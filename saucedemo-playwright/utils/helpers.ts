/**
 * Parse a saucedemo price string like "$29.99" into a number.
 */
export function parsePrice(priceText: string): number {
  return parseFloat(priceText.replace('$', ''));
}

/**
 * Slugify a product name the same way saucedemo builds its data-test ids,
 * e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack"
 */
export function slugify(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Simple sleep helper. Prefer Playwright's built-in waits/assertions
 * over this in real tests; useful mainly for debugging.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation up to `retries` times with a delay between attempts.
 */
export async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) await sleep(delayMs);
    }
  }
  throw lastError;
}

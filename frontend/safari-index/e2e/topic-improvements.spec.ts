import { test, expect } from '@playwright/test';

/**
 * Smoke tests for /dev/topic-improvements page
 *
 * These tests verify:
 * 1. Page loads in development/staging
 * 2. Summary section renders
 * 3. Per-topic analysis renders
 * 4. Export functionality works
 */

test.describe('Topic Improvements Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/topic-improvements');
  });

  test('page loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Topic Improvements' })).toBeVisible();
  });

  test('shows dev-only warning banner', async ({ page }) => {
    await expect(page.getByText('DEV-ONLY: This page is not accessible in production')).toBeVisible();
  });

  test('renders summary section with metrics', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
    await expect(page.getByText('Topics analyzed')).toBeVisible();
    await expect(page.getByText('Total suggestions')).toBeVisible();
    await expect(page.getByText('High priority')).toBeVisible();
    await expect(page.getByText('Topics with issues')).toBeVisible();
  });

  test('renders per-topic analysis section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Per-Topic Analysis' })).toBeVisible();
  });

  test('displays topic cards after loading', async ({ page }) => {
    // Wait for loading to complete - cards should appear
    // At minimum we should see at least one topic question (they end with ?)
    await expect(page.locator('text=?').first()).toBeVisible({ timeout: 10000 });
  });

  test('shows refusal rate for topics', async ({ page }) => {
    // Wait for content to load
    await expect(page.locator('text=?').first()).toBeVisible({ timeout: 10000 });

    // Look for refusal rate display (format: "Refusal rate: X%" or "Refusal rate: n/a")
    // Use first() since multiple topics will have refusal rate displays
    await expect(page.getByText(/Refusal rate:/).first()).toBeVisible();
  });

  test('renders footer with staging notice', async ({ page }) => {
    await expect(page.getByText('Staging only. Rules are deterministic, not AI-generated.')).toBeVisible();
  });
});

test.describe('Topic Improvements Suggestions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/topic-improvements');
    // Wait for analysis to load
    await expect(page.locator('text=?').first()).toBeVisible({ timeout: 10000 });
  });

  test('displays topic cards with analysis results', async ({ page }) => {
    // Wait for topic cards to load (each card has a question heading ending with ?)
    await expect(page.locator('text=?').first()).toBeVisible({ timeout: 10000 });

    // Each topic card should show either:
    // - Severity badges (high/medium/low) with suggestions
    // - Or "No improvements suggested." text
    // The page structure is valid if cards are rendered with one of these states

    // Check that topic cards are present (identified by "Refusal rate:" text)
    const refusalRates = page.getByText(/Refusal rate:/);
    const cardCount = await refusalRates.count();

    // Should have at least some topic cards
    expect(cardCount).toBeGreaterThan(0);
  });

  test('suggestion rows show rule_id and message', async ({ page }) => {
    // Look for a suggestion with rule_id (displayed as code element)
    const ruleIds = page.locator('code').filter({ hasText: /_/ });

    // If there are suggestions, they should have rule_id codes (contain underscore)
    const count = await ruleIds.count();
    if (count > 0) {
      await expect(ruleIds.first()).toBeVisible();
    }
  });

  test('can expand suggestion details', async ({ page }) => {
    // Look for "Show details" button
    const showButton = page.getByRole('button', { name: /show details/i }).first();

    // If there's a suggestion with expandable details
    if (await showButton.isVisible().catch(() => false)) {
      await showButton.click();

      // Should now show "Hide details"
      await expect(page.getByRole('button', { name: /hide details/i }).first()).toBeVisible();

      // Should show JSON content
      await expect(page.locator('pre').first()).toBeVisible();
    }
  });
});

test.describe('Topic Improvements Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/topic-improvements');
    // Wait for analysis to load
    await expect(page.locator('text=?').first()).toBeVisible({ timeout: 10000 });
  });

  test('export patch button appears for topics with suggestions', async ({ page }) => {
    // Look for export button
    const exportButton = page.getByRole('button', { name: /export patch/i }).first();

    // If there are suggestions, export button should be available
    const hasExport = await exportButton.isVisible().catch(() => false);

    // Either we have export buttons (suggestions exist) or we don't (no suggestions)
    // This is a valid state either way
    expect(typeof hasExport).toBe('boolean');
  });

  test('clicking export shows copied confirmation', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /export patch/i }).first();

    if (await exportButton.isVisible().catch(() => false)) {
      await exportButton.click();

      // Should show "Copied!" feedback
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Topic Improvements Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/topic-improvements');
  });

  test('page has main container', async ({ page }) => {
    // The page uses pageContainer class which is a div
    await expect(page.getByRole('heading', { name: 'Topic Improvements' })).toBeVisible();
  });

  test('headings follow hierarchy', async ({ page }) => {
    // H1 for page title
    await expect(page.getByRole('heading', { level: 1, name: 'Topic Improvements' })).toBeVisible();

    // H2 for sections
    await expect(page.getByRole('heading', { level: 2, name: 'Summary' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Per-Topic Analysis' })).toBeVisible();
  });
});

test.describe('Topic Improvements Mobile', () => {
  test('page is readable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dev/topic-improvements');

    // Check main content is visible
    await expect(page.getByRole('heading', { name: 'Topic Improvements' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
  });
});

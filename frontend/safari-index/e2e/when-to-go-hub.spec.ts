/**
 * When to Go Hub Page E2E Tests
 *
 * Tests the /when-to-go static hub page:
 * - Page loads and renders key sections
 * - Month grid is present
 * - Country tiles link correctly
 * - Decision links are capped at 6
 * - No Bedrock calls (static content)
 */

import { test, expect } from '@playwright/test';

test.describe('/when-to-go hub page', () => {
  test('page loads with correct title and structure', async ({ page }) => {
    await page.goto('/when-to-go');

    // Check page title
    await expect(page).toHaveTitle(/When to Go/i);

    // Check main heading
    await expect(page.getByTestId('when-to-go-h1')).toHaveText('When to Go');

    // Check key sections exist
    await expect(page.getByTestId('month-grid')).toBeVisible();
    await expect(page.getByTestId('country-grid')).toBeVisible();
    await expect(page.getByTestId('timing-decisions')).toBeVisible();
  });

  test('month grid shows all 12 months', async ({ page }) => {
    await page.goto('/when-to-go');

    const monthTiles = page.getByTestId('month-tile');
    await expect(monthTiles).toHaveCount(12);

    // Verify some months are present
    await expect(page.getByText('January')).toBeVisible();
    await expect(page.getByText('July')).toBeVisible();
    await expect(page.getByText('December')).toBeVisible();
  });

  test('country tiles are clickable and link to destinations', async ({ page }) => {
    await page.goto('/when-to-go');

    const countryTiles = page.getByTestId('country-tile');
    await expect(countryTiles).toHaveCount(7);

    // First country tile should link to destinations
    const firstTile = countryTiles.first();
    await expect(firstTile).toHaveAttribute('href', /\/destinations/);
  });

  test('timing decisions are capped at 6', async ({ page }) => {
    await page.goto('/when-to-go');

    const decisionLinks = page.getByTestId('timing-decisions').getByTestId('decision-link');
    const count = await decisionLinks.count();

    // Should have at most 6 decision links
    expect(count).toBeLessThanOrEqual(6);
    expect(count).toBeGreaterThan(0);
  });

  test('decision links point to /decisions/', async ({ page }) => {
    await page.goto('/when-to-go');

    const decisionLinks = page.getByTestId('timing-decisions').getByTestId('decision-link');
    const firstLink = decisionLinks.first();

    await expect(firstLink).toHaveAttribute('href', /\/decisions\//);
  });

  test('page is static (no API errors)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/when-to-go');
    await page.waitForLoadState('networkidle');

    // Filter out unrelated errors
    const apiErrors = consoleErrors.filter(
      (err) => err.includes('API') || err.includes('Bedrock') || err.includes('fetch failed')
    );
    expect(apiErrors).toHaveLength(0);
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/when-to-go');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /safari timing/i);

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/when-to-go/);
  });
});

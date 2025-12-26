/**
 * Activity Detail Page E2E Tests
 *
 * Tests individual /activities/[activity] pages:
 * - Page loads with correct content
 * - All sections render properly
 * - Internal links work
 * - No Bedrock calls (static content)
 */

import { test, expect } from '@playwright/test';

test.describe('/activities/[activity] detail pages', () => {
  test('game-drive page loads with correct title', async ({ page }) => {
    await page.goto('/activities/game-drive');

    // Check page title
    await expect(page).toHaveTitle(/Game Drive/i);

    // Check main heading
    await expect(page.getByTestId('activity-h1')).toHaveText('Game Drive');
  });

  test('gorilla-trekking page loads with correct content', async ({ page }) => {
    await page.goto('/activities/gorilla-trekking');

    // Check main heading
    await expect(page.getByTestId('activity-h1')).toHaveText('Gorilla Trekking');

    // Check physical effort badge is shown (use first() since badge may appear in multiple places)
    await expect(page.getByText('Strenuous').first()).toBeVisible();
  });

  test('activity page has all required sections', async ({ page }) => {
    await page.goto('/activities/walking-safari');

    // Check key sections exist
    await expect(page.getByText('What It Is')).toBeVisible();
    await expect(page.getByText('Best For')).toBeVisible();
    await expect(page.getByText('Consider Skipping If')).toBeVisible();
    await expect(page.getByText('Physical Demands')).toBeVisible();
    await expect(page.getByText('Best Season')).toBeVisible();
    await expect(page.getByText('Trade-Offs')).toBeVisible();
  });

  test('activity page shows trade-offs', async ({ page }) => {
    await page.goto('/activities/mokoro');

    // Check trade-offs section
    await expect(page.getByText('What You Gain')).toBeVisible();
    await expect(page.getByText('What You Trade Away')).toBeVisible();
  });

  test('activity page shows destination links', async ({ page }) => {
    await page.goto('/activities/game-drive');

    // Check destinations section
    await expect(page.getByText('Where Available')).toBeVisible();

    // Should have destination links
    const destinationLinks = page.getByTestId('destination-link');
    const count = await destinationLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('activity page has visual reference', async ({ page }) => {
    await page.goto('/activities/hot-air-balloon');

    // Check visual reference section exists
    await expect(page.getByText('Visual Reference')).toBeVisible();
  });

  test('activity page CTA includes activity param', async ({ page }) => {
    await page.goto('/activities/boat-safari');

    // Find the CTA link
    const ctaLink = page.getByRole('link', { name: 'Start planning' });
    await expect(ctaLink).toHaveAttribute('href', /activity=boat-safari/);
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/activities/night-drive');

    // Check breadcrumb exists (in the image band, not footer)
    const activitiesLink = page.getByTestId('image-band').getByRole('link', { name: 'Activities' });
    await expect(activitiesLink).toBeVisible();
    await expect(activitiesLink).toHaveAttribute('href', '/activities');
  });

  test('page is static (no API errors)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/activities/cultural-visit');
    await page.waitForLoadState('networkidle');

    // Filter out unrelated errors
    const apiErrors = consoleErrors.filter(
      (err) => err.includes('API') || err.includes('Bedrock') || err.includes('fetch failed')
    );
    expect(apiErrors).toHaveLength(0);
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/activities/fly-camping');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/activities\/fly-camping/);
  });

  test('returns 404 for non-existent activity', async ({ page }) => {
    const response = await page.goto('/activities/non-existent-activity');
    expect(response?.status()).toBe(404);
  });
});

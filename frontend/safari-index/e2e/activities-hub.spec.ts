/**
 * Activities Hub Page E2E Tests
 *
 * Tests the /activities static hub page:
 * - Page loads and renders key sections
 * - Activity cards are grouped by category
 * - Links work correctly
 * - No Bedrock calls (static content)
 */

import { test, expect } from '@playwright/test';

test.describe('/activities hub page', () => {
  test('page loads with correct title and structure', async ({ page }) => {
    await page.goto('/activities');

    // Check page title
    await expect(page).toHaveTitle(/Activities/i);

    // Check main heading
    await expect(page.getByTestId('activities-h1')).toHaveText('Safari Activities');
  });

  test('shows activity cards grouped by category', async ({ page }) => {
    await page.goto('/activities');

    // Check that category sections exist
    await expect(page.locator('#vehicle')).toBeVisible();
    await expect(page.locator('#foot')).toBeVisible();
    await expect(page.locator('#water')).toBeVisible();

    // Check that activity cards exist
    const activityCards = page.getByTestId('activity-card');
    const count = await activityCards.count();
    expect(count).toBeGreaterThan(10); // We have 15 activities
  });

  test('activity cards have required elements', async ({ page }) => {
    await page.goto('/activities');

    // Get first activity card
    const firstCard = page.getByTestId('activity-card').first();

    // Should have a heading (activity name)
    await expect(firstCard.locator('h3')).toBeVisible();

    // Should have effort badge
    await expect(firstCard.locator('span').first()).toBeVisible();
  });

  test('activity cards link to detail pages', async ({ page }) => {
    await page.goto('/activities');

    // Get first activity card and check it links correctly
    const firstCard = page.getByTestId('activity-card').first();
    await expect(firstCard).toHaveAttribute('href', /\/activities\//);
  });

  test('category quick nav links work', async ({ page }) => {
    await page.goto('/activities');

    // Click on Water-Based quick nav link
    await page.getByRole('link', { name: 'Water-Based' }).click();

    // Should scroll to water section
    await expect(page.locator('#water')).toBeVisible();
  });

  test('page is static (no API errors)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/activities');
    await page.waitForLoadState('networkidle');

    // Filter out unrelated errors
    const apiErrors = consoleErrors.filter(
      (err) => err.includes('API') || err.includes('Bedrock') || err.includes('fetch failed')
    );
    expect(apiErrors).toHaveLength(0);
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/activities');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /safari activities/i);

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/activities/);
  });

  test('CTA links to inquiry page', async ({ page }) => {
    await page.goto('/activities');

    // Find the CTA link
    const ctaLink = page.getByRole('link', { name: 'Start planning' });
    await expect(ctaLink).toHaveAttribute('href', '/inquire');
  });
});

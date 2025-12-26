/**
 * Destinations Hub Page E2E Tests
 *
 * Tests the /destinations static hub page:
 * - Page loads and renders key sections
 * - Destination cards are present
 * - Decision links are capped at 6
 * - Trip links are capped at 3
 * - No Bedrock calls (static content)
 */

import { test, expect } from '@playwright/test';

test.describe('/destinations hub page', () => {
  test('page loads with correct title and structure', async ({ page }) => {
    await page.goto('/destinations');

    // Check page title
    await expect(page).toHaveTitle(/Destinations/i);

    // Check main heading
    await expect(page.getByTestId('destinations-h1')).toHaveText('Destinations');

    // Check destination list exists
    await expect(page.getByTestId('destination-list')).toBeVisible();
  });

  test('shows all 8 destination cards', async ({ page }) => {
    await page.goto('/destinations');

    const destinationCards = page.getByTestId('destination-card');
    await expect(destinationCards).toHaveCount(8);

    // Check some destination names
    await expect(page.getByRole('heading', { name: 'Tanzania' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kenya' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Botswana' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'South Africa' })).toBeVisible();
  });

  test('destination cards have decision links capped at 4', async ({ page }) => {
    await page.goto('/destinations');

    // Get first destination card
    const firstCard = page.getByTestId('destination-card').first();
    const decisionLinks = firstCard.getByTestId('decision-link');
    const count = await decisionLinks.count();

    // Should have at most 4 decision links per card (sliced in component)
    expect(count).toBeLessThanOrEqual(4);
  });

  test('destination cards have trip links capped at 3', async ({ page }) => {
    await page.goto('/destinations');

    // Get first destination card with trips
    const firstCard = page.getByTestId('destination-card').first();
    const tripLinks = firstCard.getByTestId('trip-link');
    const count = await tripLinks.count();

    // Should have at most 3 trip links per card
    expect(count).toBeLessThanOrEqual(3);
  });

  test('p0 decisions section is capped at 6', async ({ page }) => {
    await page.goto('/destinations');

    const p0Links = page.getByTestId('p0-decisions').getByTestId('p0-decision-link');
    const count = await p0Links.count();

    // Should have at most 6 P0 decision links
    expect(count).toBeLessThanOrEqual(6);
    expect(count).toBeGreaterThan(0);
  });

  test('decision links point to /decisions/', async ({ page }) => {
    await page.goto('/destinations');

    const decisionLinks = page.getByTestId('decision-link').first();
    await expect(decisionLinks).toHaveAttribute('href', /\/decisions\//);
  });

  test('trip links point to /trips/', async ({ page }) => {
    await page.goto('/destinations');

    const tripLinks = page.getByTestId('trip-link').first();
    await expect(tripLinks).toHaveAttribute('href', /\/trips\//);
  });

  test('anchor links for quick nav work', async ({ page }) => {
    await page.goto('/destinations');

    // Click on Botswana quick nav link
    await page.getByRole('link', { name: 'Botswana' }).first().click();

    // Should scroll to Botswana section
    await expect(page.locator('#botswana')).toBeVisible();
  });

  test('page is static (no API errors)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/destinations');
    await page.waitForLoadState('networkidle');

    // Filter out unrelated errors
    const apiErrors = consoleErrors.filter(
      (err) => err.includes('API') || err.includes('Bedrock') || err.includes('fetch failed')
    );
    expect(apiErrors).toHaveLength(0);
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/destinations');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /safari destinations/i);

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/destinations/);
  });
});

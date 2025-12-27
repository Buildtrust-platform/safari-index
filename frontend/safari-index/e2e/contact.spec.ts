/**
 * Contact Page E2E Tests
 *
 * Tests the /contact informational page:
 * - Page loads with correct status and H1
 * - Shows operator trust block
 * - CTA links to /inquire
 * - No contact form fields (informational only)
 * - Sitemap includes /contact
 */

import { test, expect } from '@playwright/test';

test.describe('/contact page', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);
  });

  test('has correct H1: Contact Safari Index', async ({ page }) => {
    await page.goto('/contact');
    // Wait for page to fully hydrate including image band client component
    await page.waitForLoadState('domcontentloaded');
    // The h1 is inside a client component, so we need to wait for it
    const h1 = page.getByTestId('contact-h1');
    await expect(h1).toBeVisible({ timeout: 15000 });
    await expect(h1).toHaveText('Contact Safari Index');
  });

  test('has correct page title', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/i);
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/contact');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /safari planning|inquir/i);

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/contact/);

    // Check robots
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'index, follow');
  });

  test('shows operator trust block', async ({ page }) => {
    await page.goto('/contact');

    // Trust block should be visible
    const trustBlock = page.getByTestId('operator-trust-block');
    await expect(trustBlock).toBeVisible();

    // Should contain operator credentials content
    await expect(trustBlock).toContainText(/Safari Index/i);
  });

  test('Plan a Safari CTA links to /inquire', async ({ page }) => {
    await page.goto('/contact');

    const ctaLink = page.getByTestId('plan-safari-cta');
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute('href', '/inquire');
    await expect(ctaLink).toHaveText(/Plan a Safari/i);
  });

  test('has no contact form fields (informational only)', async ({ page }) => {
    await page.goto('/contact');

    // Should NOT have form elements like textarea or text inputs for contact
    const textareas = page.locator('textarea');

    // No textarea for messages
    expect(await textareas.count()).toBe(0);

    // The page should have no form element at all
    const forms = page.locator('form');
    expect(await forms.count()).toBe(0);
  });

  test('shows contact methods (email)', async ({ page }) => {
    await page.goto('/contact');

    // Should have email contact method visible
    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(emailLink.first()).toBeVisible();
  });

  test('has quick links to /trips, /decisions, /guides', async ({ page }) => {
    await page.goto('/contact');

    // Quick links section - look specifically in the quick links area, not navbar
    // On mobile, navbar links are hidden but quick links should still show
    const quickLinksSection = page.locator('section').filter({ hasText: 'Explore' });

    const tripsLink = quickLinksSection.locator('a[href="/trips"]');
    const decisionsLink = quickLinksSection.locator('a[href="/decisions"]');
    const guidesLink = quickLinksSection.locator('a[href="/guides"]');

    await expect(tripsLink).toBeVisible();
    await expect(decisionsLink).toBeVisible();
    await expect(guidesLink).toBeVisible();
  });

  test('link to how-it-works exists', async ({ page }) => {
    await page.goto('/contact');

    // Look in the trust block area, not navbar (hidden on mobile)
    const trustBlock = page.getByTestId('operator-trust-block');
    const howItWorksLink = trustBlock.locator('a[href="/how-it-works"]');
    await expect(howItWorksLink).toBeVisible();
  });
});

test.describe('sitemap includes contact', () => {
  test('sitemap.xml includes /contact', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('/contact</loc>');
  });
});

test.describe('footer includes contact link', () => {
  test('footer has Contact link', async ({ page }) => {
    await page.goto('/contact');

    const footerContactLink = page.locator('footer a[href="/contact"]');
    await expect(footerContactLink).toBeVisible();
    await expect(footerContactLink).toHaveText('Contact');
  });
});

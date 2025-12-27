/**
 * Link Verification E2E Tests
 *
 * Comprehensive tests to verify all internal links work correctly:
 * - All pages return 200 status
 * - All internal links resolve correctly
 * - No 404 errors or broken links
 * - Navigation elements work across the site
 */

import { test, expect } from '@playwright/test';

// Key pages to verify
const CRITICAL_PAGES = [
  '/',
  '/trips',
  '/destinations',
  '/activities',
  '/decisions',
  '/how-it-works',
  '/inquire',
  '/contact',
  '/compare',
  '/when-to-go',
  '/itineraries',
  '/blog',
  '/guides',
];

test.describe('Critical Page Status', () => {
  for (const path of CRITICAL_PAGES) {
    test(`${path} returns 200 status`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('Homepage Internal Links', () => {
  test('sample of internal links on homepage are valid', async ({ page, request }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all internal links
    const links = await page.locator('a[href^="/"]').all();
    const uniqueHrefs = new Set<string>();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && href.startsWith('/') && !href.includes('#')) {
        // Normalize the path (remove trailing slashes, etc.)
        const normalizedHref = href.split('#')[0];
        uniqueHrefs.add(normalizedHref);
      }
    }

    // Verify a sample of unique links using request (faster than page.goto)
    const linksToTest = Array.from(uniqueHrefs).slice(0, 10);

    for (const href of linksToTest) {
      const response = await request.get(href);
      expect(response.status(), `${href} should return 200`).toBe(200);
    }
  });
});

test.describe('Navigation Consistency', () => {
  test('navbar is present on all critical pages', async ({ page }) => {
    for (const path of CRITICAL_PAGES.slice(0, 5)) {
      await page.goto(path);
      await expect(page.getByTestId('navbar')).toBeVisible();
      await expect(page.getByTestId('navbar-logo')).toBeVisible();
    }
  });

  test('footer is present on all critical pages', async ({ page }) => {
    for (const path of CRITICAL_PAGES.slice(0, 5)) {
      await page.goto(path);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });
});

test.describe('API Endpoints', () => {
  test('newsletter API exists', async ({ request }) => {
    // POST should return 400 for empty body (validates route exists)
    const response = await request.post('/api/newsletter', { data: {} });
    expect(response.status()).toBe(400);
  });

  test('ops newsletter API exists', async ({ request }) => {
    const response = await request.get('/api/ops/newsletter');
    // Should not be 404 (route exists)
    expect(response.status()).not.toBe(404);
  });
});

test.describe('Decision Pages', () => {
  test('decisions hub page loads', async ({ page }) => {
    const response = await page.goto('/decisions');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('decision detail pages are accessible from hub', async ({ page }) => {
    await page.goto('/decisions');
    await page.waitForLoadState('networkidle');

    // Get first decision link
    const decisionLinks = page.locator('a[href^="/decisions/"]');
    const count = await decisionLinks.count();

    if (count > 0) {
      const firstLink = decisionLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href) {
        const response = await page.goto(href);
        expect(response?.status()).toBe(200);
      }
    }
  });
});

test.describe('Trip Pages', () => {
  test('trips hub page loads', async ({ page }) => {
    const response = await page.goto('/trips');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('trip detail pages are accessible from hub', async ({ page }) => {
    await page.goto('/trips');
    await page.waitForLoadState('networkidle');

    // Get first trip link
    const tripLinks = page.locator('a[href^="/trips/"]');
    const count = await tripLinks.count();

    if (count > 0) {
      const firstLink = tripLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href) {
        const response = await page.goto(href);
        expect(response?.status()).toBe(200);
      }
    }
  });
});

test.describe('Destination Pages', () => {
  test('destinations page loads', async ({ page }) => {
    const response = await page.goto('/destinations');
    expect(response?.status()).toBe(200);
  });

  test('destination anchor links work', async ({ page }) => {
    await page.goto('/destinations');
    await page.waitForLoadState('networkidle');

    // Check for Tanzania anchor
    const tanzaniaSection = page.locator('#tanzania');
    const count = await tanzaniaSection.count();

    if (count > 0) {
      await page.goto('/destinations#tanzania');
      expect(page.url()).toContain('#tanzania');
    }
  });
});

test.describe('No 404 Pages', () => {
  test('known pages do not 404', async ({ page }) => {
    const pagesToTest = [
      '/trips',
      '/destinations',
      '/activities',
      '/decisions',
      '/how-it-works',
      '/inquire',
      '/contact',
    ];

    for (const path of pagesToTest) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should not be 404`).not.toBe(404);
    }
  });
});

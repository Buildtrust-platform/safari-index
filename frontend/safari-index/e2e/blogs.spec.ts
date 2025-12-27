/**
 * Blog Pages E2E Tests
 *
 * Tests blog index and individual blog pages:
 * - /blog returns 200
 * - Blog index lists P0 blogs
 * - Each blog page returns 200
 * - Blog page contains decision link, trip link, Plan a Safari CTA
 * - Sitemap includes blog URLs
 */

import { test, expect } from '@playwright/test';

test.describe('/blog index page', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
  });

  test('has correct H1: Safari Planning Insights', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByTestId('blog-h1')).toHaveText('Safari Planning Insights');
  });

  test('has correct page title', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Safari Planning Insights/i);
  });

  test('has proper SEO metadata', async ({ page }) => {
    await page.goto('/blog');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /safari planning decisions/i);

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/blog/);

    // Check robots
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'index, follow');
  });

  test('lists blog articles grouped by bucket', async ({ page }) => {
    await page.goto('/blog');

    // Should have at least one blog article link
    const blogLinks = page.locator('a[href^="/blog/decisions/"]');
    const count = await blogLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('blog cards have title and summary', async ({ page }) => {
    await page.goto('/blog');

    // Check first blog card has required elements
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();

    // Should have a heading (blog title)
    const heading = firstBlogLink.locator('h3');
    await expect(heading).toBeVisible();
    const titleText = await heading.textContent();
    expect(titleText?.length).toBeGreaterThan(10);

    // Should have a summary (p element with subtitle)
    const summary = firstBlogLink.locator('p');
    await expect(summary.first()).toBeVisible();
  });

  test('blog cards link to /blog/decisions/[slug]', async ({ page }) => {
    await page.goto('/blog');

    // Check first blog link format
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');
    expect(href).toMatch(/^\/blog\/decisions\/[a-z0-9-]+$/);
  });

  test('page is static (no API errors)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Filter out unrelated errors
    const apiErrors = consoleErrors.filter(
      (err) => err.includes('API') || err.includes('Bedrock') || err.includes('fetch failed')
    );
    expect(apiErrors).toHaveLength(0);
  });
});

test.describe('/blog/decisions/[slug] individual blog pages', () => {
  // Test first available blog page
  test('blog page loads with 200 status', async ({ page }) => {
    // First get a valid blog slug from the index
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    const response = await page.goto(href);
    expect(response?.status()).toBe(200);
  });

  test('blog page has article structure', async ({ page }) => {
    // Get a valid blog slug from the index
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Should have article element
    await expect(page.getByTestId('blog-article')).toBeVisible();
  });

  test('blog page contains decision link', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Should have link back to decision page
    const decisionLink = page.locator('a[href^="/decisions/"]');
    await expect(decisionLink.first()).toBeVisible();
  });

  test('blog page contains Plan a Safari CTA linking to /inquire', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Should have Plan a Safari CTA in article footer (with arrow)
    const ctaLink = page.getByRole('link', { name: 'Plan a Safari →' });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute('href', '/inquire');
  });

  test('blog page contains trip links when relatedTrips exist', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Check for related trips section (may not exist on all blogs)
    const tripsSection = page.getByTestId('related-trips');
    if (await tripsSection.isVisible()) {
      // If trips section exists, check links go to /trips/
      const tripLinks = tripsSection.locator('a[href^="/trips/"]');
      const count = await tripLinks.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('blog page has Article JSON-LD schema', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Check for JSON-LD script (scripts are hidden elements, so check count instead)
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);

    const schemaText = await jsonLd.first().textContent();
    const schema = JSON.parse(schemaText || '{}');

    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBeTruthy();
    expect(schema.author).toBeTruthy();
  });

  test('blog page has proper SEO metadata', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Check title includes Safari Index
    await expect(page).toHaveTitle(/Safari Index/i);

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/blog\/decisions\//);

    // Check robots
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'index, follow');
  });
});

test.describe('sitemap includes blog URLs', () => {
  test('sitemap.xml includes /blog', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('/blog</loc>');
  });

  test('sitemap.xml includes /blog/decisions/ pages', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('/blog/decisions/');
  });
});

test.describe('blog discoverability', () => {
  test('blog is accessible from navbar (desktop)', async ({ page, isMobile }) => {
    // Skip on mobile - navbar links are in hamburger menu
    if (isMobile) {
      test.skip();
      return;
    }

    await page.goto('/');

    // Navbar should have a link to the blog (labeled "Insights")
    const navBlogLink = page.locator('nav a[href="/blog"]');
    await expect(navBlogLink).toBeVisible();
    await expect(navBlogLink).toHaveText('Insights');
  });

  test('blog is accessible from mobile menu', async ({ page, isMobile }) => {
    // Only run on mobile
    if (!isMobile) {
      test.skip();
      return;
    }

    await page.goto('/');

    // Open mobile menu
    await page.getByTestId('navbar-mobile-toggle').click();

    // Mobile menu should have a link to the blog
    const mobileBlogLink = page.locator('[data-testid="navbar-mobile-menu"] a[href="/blog"]');
    await expect(mobileBlogLink).toBeVisible();
    await expect(mobileBlogLink).toHaveText('Insights');
  });

  test('blog is accessible from footer on pages with footer', async ({ page }) => {
    // Use a page that includes the footer (blog page has footer, homepage does not)
    await page.goto('/blog');

    // Footer should have a link to the blog (labeled "Insights")
    const footerBlogLink = page.locator('footer a[href="/blog"]');
    await expect(footerBlogLink).toBeVisible();
    await expect(footerBlogLink).toHaveText('Insights');
  });
});

test.describe('blog internal linking', () => {
  test('related decisions link to /decisions/', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // All decision links should go to /decisions/
    const decisionLinks = page.locator('a[href^="/decisions/"]');
    const count = await decisionLinks.count();
    expect(count).toBeGreaterThan(0);

    // Check format of first decision link
    const firstDecisionLink = decisionLinks.first();
    const decisionHref = await firstDecisionLink.getAttribute('href');
    expect(decisionHref).toMatch(/^\/decisions\/[a-z0-9-]+$/);
  });

  test('related trips link to /trips/', async ({ page }) => {
    await page.goto('/blog');
    const firstBlogLink = page.locator('a[href^="/blog/decisions/"]').first();
    const href = await firstBlogLink.getAttribute('href');

    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href);

    // Check if related trips section exists
    const tripsSection = page.getByTestId('related-trips');
    if (await tripsSection.isVisible()) {
      const tripLinks = tripsSection.locator('a');
      const count = await tripLinks.count();

      for (let i = 0; i < count; i++) {
        const tripHref = await tripLinks.nth(i).getAttribute('href');
        expect(tripHref).toMatch(/^\/trips\/[a-z0-9-]+$/);
      }
    }
  });
});

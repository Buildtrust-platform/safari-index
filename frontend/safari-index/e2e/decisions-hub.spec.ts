import { test, expect } from '@playwright/test';

/**
 * Decisions Hub Page Tests
 *
 * Tests verify:
 * 1. /decisions returns 200 and shows H1
 * 2. Renders 8 bucket sections (all with P0 topics)
 * 3. Each bucket section has at least 1 topic link
 * 4. Topic links navigate to decision pages
 * 5. Navbar "Decisions" link navigates to /decisions
 * 6. Bucket anchor navigation works
 */

test.describe('Decisions Hub Page', () => {
  test('returns 200 and shows H1', async ({ page }) => {
    const response = await page.goto('/decisions');
    expect(response?.status()).toBe(200);

    // Page should have the H1 headline
    await expect(page.getByTestId('decisions-h1')).toBeVisible();
    await expect(page.getByTestId('decisions-h1')).toHaveText('Safari Decisions');
  });

  test('renders 8 bucket sections', async ({ page }) => {
    await page.goto('/decisions');

    // Check for the 8 bucket sections by their anchor IDs
    const bucketAnchors = [
      'personal-fit',
      'destination-choice',
      'timing',
      'experience-type',
      'accommodation',
      'logistics',
      'risk-ethics',
      'value-cost',
    ];

    for (const anchor of bucketAnchors) {
      const section = page.getByTestId(`bucket-${anchor}`);
      await expect(section).toBeVisible();
    }
  });

  test('each bucket section has at least 1 topic link', async ({ page }) => {
    await page.goto('/decisions');

    // Get all bucket sections
    const buckets = page.getByTestId('bucket-sections').locator('section');
    const bucketCount = await buckets.count();

    // Should have 8 buckets (all P0-populated)
    expect(bucketCount).toBe(8);

    // Each bucket should have at least one topic link
    for (let i = 0; i < bucketCount; i++) {
      const topicLinks = buckets.nth(i).getByTestId('topic-link');
      const linkCount = await topicLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('topic links resolve to decision pages', async ({ page }) => {
    await page.goto('/decisions');

    // Get the first topic link
    const firstTopicLink = page.getByTestId('topic-link').first();
    const href = await firstTopicLink.getAttribute('href');

    // Should be a /decisions/[slug] URL
    expect(href).toMatch(/^\/decisions\/.+/);

    // Click and verify navigation
    await firstTopicLink.click();
    await expect(page).toHaveURL(new RegExp(`^.*${href}$`));

    // Decision page should load
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('bucket navigation nav is visible', async ({ page }) => {
    await page.goto('/decisions');

    const bucketNav = page.getByTestId('bucket-nav');
    await expect(bucketNav).toBeVisible();

    // Should have 8 navigation chips
    const navChips = bucketNav.locator('a');
    const chipCount = await navChips.count();
    expect(chipCount).toBe(8);
  });
});

test.describe('Decisions Hub Anchor Navigation', () => {
  test('anchor links scroll to correct section', async ({ page }) => {
    await page.goto('/decisions');

    // Click on a bucket nav chip
    const timingChip = page.getByTestId('bucket-nav').getByText('Timing');
    await timingChip.click();

    // URL should update with anchor
    await expect(page).toHaveURL(/.*#timing$/);

    // Section should be visible
    const timingSection = page.getByTestId('bucket-timing');
    await expect(timingSection).toBeVisible();
  });

  test('direct anchor URL loads correctly', async ({ page }) => {
    await page.goto('/decisions#destination-choice');

    // Section should be in viewport (scroll-mt-24 handles fixed header)
    const section = page.getByTestId('bucket-destination-choice');
    await expect(section).toBeVisible();
  });
});

test.describe('Decisions Hub Navbar Integration', () => {
  test('Navbar contains Decisions link on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only test');

    await page.goto('/');

    // Look for the Decisions link
    const decisionsLink = page.getByTestId('navbar-link-decisions');
    await expect(decisionsLink).toBeVisible();
    await expect(decisionsLink).toHaveAttribute('href', '/decisions');
  });

  test('Decisions link navigates to /decisions from homepage', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      await page.getByTestId('navbar-mobile-toggle').click();
      await page.getByTestId('navbar-mobile-menu').getByText('Decisions').click();
    } else {
      await page.getByTestId('navbar-link-decisions').click();
    }

    await expect(page).toHaveURL('/decisions');
  });

  test('Navbar Decisions link visible on decisions hub page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only test');

    await page.goto('/decisions');

    const decisionsLink = page.getByTestId('navbar-link-decisions');
    await expect(decisionsLink).toBeVisible();
  });
});

test.describe('Decisions Hub SEO and Structure', () => {
  test('page has proper H1 and only one H1', async ({ page }) => {
    await page.goto('/decisions');

    const h1Elements = page.getByRole('heading', { level: 1 });
    const h1Count = await h1Elements.count();

    expect(h1Count).toBe(1);
    await expect(h1Elements.first()).toHaveText('Safari Decisions');
  });

  test('bucket sections have H2 headings', async ({ page }) => {
    await page.goto('/decisions');

    // Each bucket section should have an H2
    const expectedH2s = [
      'Personal Fit',
      'Destination Choice',
      'Timing',
      'Experience Type',
      'Accommodation',
      'Logistics',
      'Risk and Ethics',
      'Value and Cost',
    ];

    for (const title of expectedH2s) {
      const h2 = page.getByRole('heading', { level: 2, name: title });
      await expect(h2).toBeVisible();
    }
  });

  test('page has orientation paragraph', async ({ page }) => {
    await page.goto('/decisions');

    // Check for orientation content
    await expect(
      page.getByText('Safari planning involves interconnected decisions')
    ).toBeVisible();
  });

  test('page has close framing with Explore and Compare links', async ({ page }) => {
    await page.goto('/decisions');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check for close framing links
    await expect(page.getByRole('link', { name: 'Explore all decisions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'compare two decisions' })).toBeVisible();
  });
});

test.describe('Decisions Hub Mobile', () => {
  test('page is readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/decisions');

    // Main content should be visible
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByTestId('decisions-h1')).toBeVisible();
  });

  test('bucket sections are visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/decisions');

    // First bucket section should be visible
    const firstBucket = page.getByTestId('bucket-personal-fit');
    await expect(firstBucket).toBeVisible();
  });
});

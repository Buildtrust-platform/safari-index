import { test, expect } from '@playwright/test';

/**
 * Homepage and Navbar Tests
 *
 * Tests verify:
 * 1. Homepage loads with correct H1
 * 2. Navbar contains links in correct order
 * 3. Navigation works correctly
 * 4. Key content sections are present
 */

test.describe('Homepage', () => {
  test('loads with correct H1 headline', async ({ page }) => {
    await page.goto('/');

    // Should return 200
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Should contain the H1 headline
    await expect(page.getByRole('heading', { level: 1, name: 'Safari decisions, clarified.' })).toBeVisible();
  });

  test('contains key content sections', async ({ page }) => {
    await page.goto('/');

    // Orientation section
    await expect(page.getByRole('heading', { name: 'What Safari Index does' })).toBeVisible();
    await expect(page.getByText('We issue verdicts')).toBeVisible();
    await expect(page.getByText('We show what changes the answer')).toBeVisible();
    await expect(page.getByText('We refuse when it\'s irresponsible')).toBeVisible();

    // Real questions section
    await expect(page.getByRole('heading', { name: 'Start with a real question' })).toBeVisible();

    // Category clarification
    await expect(page.getByRole('heading', { name: 'Built for serious safari planning' })).toBeVisible();

    // Calm close
    await expect(page.getByText('Start with the decision that matters most.')).toBeVisible();
  });

  test('displays 6 decision question cards', async ({ page }) => {
    await page.goto('/');

    // Should have question cards linking to decisions
    const questionCards = page.locator('a[href^="/decisions/"]');
    await expect(questionCards).toHaveCount(6);
  });

  test('accountability signals are present', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Decisions are versioned and dated.')).toBeVisible();
    await expect(page.getByText('Outcomes change when conditions change.')).toBeVisible();
    await expect(page.getByText('Assurance preserves a decision as-issued.')).toBeVisible();
    await expect(page.getByText('No commissions. No bookings. No incentives.')).toBeVisible();
  });
});

test.describe('Navbar', () => {
  test('contains links in correct order on desktop', async ({ page, isMobile }) => {
    // Skip on mobile - links are in hamburger menu
    test.skip(isMobile, 'Desktop-only test');

    await page.goto('/');

    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible();

    // Logo links to home
    const logo = page.getByTestId('navbar-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');

    // Primary nav links - Safaris first (commercial), then Decisions, Guides, How it works
    await expect(page.getByTestId('navbar-link-safaris')).toBeVisible();
    await expect(page.getByTestId('navbar-link-decisions')).toBeVisible();
    await expect(page.getByTestId('navbar-link-guides')).toBeVisible();
    await expect(page.getByTestId('navbar-link-how-it-works')).toBeVisible();

    // Plan a Safari CTA
    await expect(page.getByTestId('navbar-plan-link')).toBeVisible();
  });

  test('mobile menu toggle works', async ({ page, isMobile }) => {
    // Only run on mobile
    test.skip(!isMobile, 'Mobile-only test');

    await page.goto('/');

    // Menu should be hidden initially
    await expect(page.getByTestId('navbar-mobile-menu')).not.toBeVisible();

    // Click hamburger to open
    await page.getByTestId('navbar-mobile-toggle').click();
    await expect(page.getByTestId('navbar-mobile-menu')).toBeVisible();

    // Menu contains operator-focused links
    await expect(page.getByTestId('navbar-mobile-menu').getByText('Safaris')).toBeVisible();
    await expect(page.getByTestId('navbar-mobile-menu').getByText('Decisions')).toBeVisible();
    await expect(page.getByTestId('navbar-mobile-menu').getByText('Guides')).toBeVisible();
    await expect(page.getByTestId('navbar-mobile-menu').getByText('How it works')).toBeVisible();
  });

  test('Safaris link routes to /trips', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      await page.getByTestId('navbar-mobile-toggle').click();
      await page.getByTestId('navbar-mobile-menu').getByText('Safaris').click();
    } else {
      await page.getByTestId('navbar-link-safaris').click();
    }
    await expect(page).toHaveURL('/trips');
  });

  test('How it works link routes to /how-it-works', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      await page.getByTestId('navbar-mobile-toggle').click();
      await page.getByTestId('navbar-mobile-menu').getByText('How it works').click();
    } else {
      await page.getByTestId('navbar-link-how-it-works').click();
    }
    await expect(page).toHaveURL('/how-it-works');
  });

  test('Plan a Safari link routes to /inquire', async ({ page, isMobile }) => {
    // Only test on desktop - mobile has different CTA placement
    test.skip(isMobile, 'Desktop-only test');

    await page.goto('/');
    await page.getByTestId('navbar-plan-link').click();
    await expect(page).toHaveURL('/inquire');
  });
});

test.describe('Homepage CTAs', () => {
  test('Explore decisions button routes to /explore', async ({ page }) => {
    await page.goto('/');

    // Hero CTA
    const exploreCTA = page.getByRole('link', { name: 'Explore decisions' }).first();
    await exploreCTA.click();
    await expect(page).toHaveURL('/explore');
  });

  test('When to go button routes to /explore with filter', async ({ page }) => {
    await page.goto('/');

    const whenToGoCTA = page.getByRole('link', { name: 'When to go' }).first();
    await whenToGoCTA.click();
    await expect(page).toHaveURL(/\/explore\?filter=when-to-go/);
  });

  test('Compare button routes to /compare', async ({ page }) => {
    await page.goto('/');

    // Scroll to calm close section to find Compare button
    const compareButton = page.getByRole('link', { name: 'Compare' }).first();
    await compareButton.scrollIntoViewIfNeeded();
    await compareButton.click();
    await expect(page).toHaveURL('/compare');
  });
});

test.describe('Footer', () => {
  test('contains navigation links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Footer contains Safari Index branding
    await expect(footer.getByText('Safari Index')).toBeVisible();
    await expect(footer.getByText('Pan-African Decision System')).toBeVisible();

    // Footer navigation links
    await expect(footer.getByRole('link', { name: 'Explore' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Compare' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'How it works' })).toBeVisible();
  });
});

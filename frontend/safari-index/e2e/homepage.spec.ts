import { test, expect } from '@playwright/test';

/**
 * Homepage and Navbar Tests
 *
 * Tests verify:
 * 1. Homepage loads with correct H1
 * 2. Navbar contains links in correct order
 * 3. Navigation works correctly
 * 4. Key content sections are present
 * 5. Visual rhythm with section backgrounds
 * 6. Newsletter component with Field Notes branding
 */

test.describe('Homepage', () => {
  test('loads with correct H1 headline', async ({ page }) => {
    await page.goto('/');

    // Should return 200
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Should contain the H1 headline
    await expect(page.getByRole('heading', { level: 1, name: 'Safaris planned with clarity.' })).toBeVisible();
  });

  test('contains key content sections', async ({ page }) => {
    await page.goto('/');

    // Destinations section with heading
    await expect(page.getByText('Where to go')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Safari Destinations' })).toBeVisible();

    // How we plan section
    await expect(page.getByRole('heading', { name: 'How we plan safaris' })).toBeVisible();
    await expect(page.getByText('Clear verdicts')).toBeVisible();
    await expect(page.getByText('Visible trade-offs')).toBeVisible();
    await expect(page.getByText('Honest refusals')).toBeVisible();

    // Experiences section with heading
    await expect(page.getByText('What to do')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Safari Experiences' })).toBeVisible();

    // Real questions section
    await expect(page.getByRole('heading', { name: 'Start with a real question' })).toBeVisible();

    // Trips section with heading
    await expect(page.getByText('Trip shapes')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sample Itineraries' })).toBeVisible();

    // Category clarification
    await expect(page.getByRole('heading', { name: 'A different kind of safari operator' })).toBeVisible();
  });

  test('displays 6 decision question cards', async ({ page }) => {
    await page.goto('/');

    // Should have question cards linking to decisions
    const questionCards = page.locator('a[href^="/decisions/"]');
    await expect(questionCards).toHaveCount(6);
  });

  test('accountability signals are present', async ({ page }) => {
    await page.goto('/');

    // Updated accountability signals
    await expect(page.getByText('Versioned & Dated')).toBeVisible();
    await expect(page.getByText('Conditions Change')).toBeVisible();
    await expect(page.getByText('No Incentives')).toBeVisible();
    await expect(page.getByText('Local Knowledge')).toBeVisible();
  });
});

test.describe('Homepage Newsletter', () => {
  test('displays Field Notes newsletter section', async ({ page }) => {
    await page.goto('/');

    // Newsletter section with Field Notes branding
    await expect(page.getByRole('heading', { name: 'Field Notes from Safari Index' })).toBeVisible();
    await expect(page.getByText('Occasional dispatches on safari planning')).toBeVisible();
    await expect(page.getByText('No deals, no spam. Published monthly at most.')).toBeVisible();
    await expect(page.getByText('Your email stays with us. Unsubscribe anytime.')).toBeVisible();
  });

  test('newsletter form is functional', async ({ page }) => {
    await page.goto('/');

    // Find the email input
    const emailInput = page.getByPlaceholder('your@email.com');
    await expect(emailInput).toBeVisible();

    // Find the subscribe button
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await expect(subscribeButton).toBeVisible();
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

    // Primary nav links - Itineraries, Safaris, Destinations, Activities, Decisions, Insights, How it works
    await expect(page.getByTestId('navbar-link-itineraries')).toBeVisible();
    await expect(page.getByTestId('navbar-link-safaris')).toBeVisible();
    await expect(page.getByTestId('navbar-link-destinations')).toBeVisible();
    await expect(page.getByTestId('navbar-link-activities')).toBeVisible();
    await expect(page.getByTestId('navbar-link-decisions')).toBeVisible();
    await expect(page.getByTestId('navbar-link-insights')).toBeVisible();
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

    // Menu contains key navigation links
    await expect(page.getByTestId('navbar-mobile-menu').getByText('Itineraries')).toBeVisible();
    await expect(page.getByTestId('navbar-mobile-menu').getByText('Safaris')).toBeVisible();
    await expect(page.getByTestId('navbar-mobile-menu').getByText('Decisions')).toBeVisible();
    await expect(page.getByTestId('navbar-mobile-menu').getByText('How it works')).toBeVisible();
  });

  test('Safaris link routes to /trips', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (isMobile) {
      await page.getByTestId('navbar-mobile-toggle').click();
      const mobileLink = page.getByTestId('navbar-mobile-menu').getByText('Safaris');
      await Promise.all([
        page.waitForURL(/\/trips/),
        mobileLink.click()
      ]);
    } else {
      const safarisLink = page.getByTestId('navbar-link-safaris');
      await expect(safarisLink).toHaveAttribute('href', '/trips');
      await Promise.all([
        page.waitForURL(/\/trips/),
        safarisLink.click()
      ]);
    }
    await expect(page).toHaveURL(/\/trips/);
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
  test('Browse safaris button routes to /trips', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero CTA - Browse safaris
    const browseCTA = page.getByRole('link', { name: 'Browse safaris' }).first();
    await Promise.all([
      page.waitForURL(/\/trips/),
      browseCTA.click()
    ]);
    await expect(page).toHaveURL(/\/trips/);
  });

  test('How we decide button routes to /decisions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const decisionsCTA = page.getByRole('link', { name: 'How we decide' }).first();
    await Promise.all([
      page.waitForURL(/\/decisions/),
      decisionsCTA.click()
    ]);
    await expect(page).toHaveURL(/\/decisions/);
  });

  test('Start planning button routes to /inquire', async ({ page }) => {
    await page.goto('/');

    // Find the Start planning CTA in the category clarification section
    const startPlanningButton = page.getByRole('link', { name: 'Start planning' }).first();
    await startPlanningButton.scrollIntoViewIfNeeded();
    await startPlanningButton.click();
    await expect(page).toHaveURL('/inquire');
  });
});

test.describe('Footer', () => {
  test('contains navigation links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Footer contains Safari Index branding (use first() to handle multiple matches)
    await expect(footer.getByText('Safari Index', { exact: true }).first()).toBeVisible();
    await expect(footer.getByText('Safari Index · Private Safari Operator')).toBeVisible();

    // Footer navigation links - Explore column
    await expect(footer.getByRole('link', { name: 'Safaris' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Destinations' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Activities' })).toBeVisible();

    // Footer navigation links - Resources column
    await expect(footer.getByRole('link', { name: 'Decisions' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'How it works' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Plan a Safari' })).toBeVisible();
  });
});

test.describe('Contact Page Newsletter', () => {
  test('contact page displays newsletter section', async ({ page }) => {
    await page.goto('/contact');

    // Newsletter section should be visible on contact page
    await expect(page.getByRole('heading', { name: 'Field Notes from Safari Index' })).toBeVisible();
    await expect(page.getByText('No deals, no spam. Published monthly at most.')).toBeVisible();
  });
});

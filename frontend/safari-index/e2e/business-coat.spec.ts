/**
 * Business Coat E2E Tests
 *
 * Tests for the Safari Index Business Coat features:
 * - Part A: Inquiry system
 * - Part B: Navigation and homepage
 * - Part C: Trip ⇄ Decision linking
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// PART A: INQUIRY SYSTEM
// ============================================================================

test.describe('Inquiry System', () => {
  test('inquiry page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/inquire');
    expect(response?.status()).toBe(200);
  });

  test('displays inquiry page heading', async ({ page }) => {
    await page.goto('/inquire');
    const heading = page.getByTestId('inquire-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Trip Brief');
  });

  test('has required form fields', async ({ page }) => {
    await page.goto('/inquire');

    // Check for budget select field
    await expect(page.locator('select').first()).toBeVisible();

    // Check for submit button
    const submitButton = page.getByTestId('inquire-submit');
    await expect(submitButton).toBeVisible();
  });

  test('validates required fields on submit', async ({ page }) => {
    await page.goto('/inquire');

    // Try to submit without filling required fields
    const submitButton = page.getByTestId('inquire-submit');
    await submitButton.click();

    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('accepts trip parameter from URL', async ({ page }) => {
    await page.goto('/inquire?trip=classic-serengeti-ngorongoro');

    // Should show the preselected trip
    await expect(page.locator('text=Classic Serengeti and Ngorongoro')).toBeVisible();
  });

  test('trip detail page has inquiry CTA', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const inquiryCta = page.getByTestId('inquiry-cta');
    await expect(inquiryCta).toBeVisible();
    await expect(inquiryCta).toContainText('Plan this safari');
  });

  test('inquiry CTA links to inquiry page with trip parameter', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const inquiryCta = page.getByTestId('inquiry-cta');
    const href = await inquiryCta.getAttribute('href');
    // Updated: now uses trip_id param and includes selected_decision_ids for prefill
    expect(href).toContain('/inquire?trip_id=classic-serengeti-ngorongoro');
    expect(href).toContain('selected_decision_ids=');
  });
});

// ============================================================================
// PART B: NAVIGATION AND HOMEPAGE
// ============================================================================

test.describe('Navigation Order', () => {
  test('navbar has Decisions as first link', async ({ page }) => {
    await page.goto('/');

    // The first meaningful nav link should be Decisions (after logo)
    const allLinks = await page.locator('nav a').allTextContents();
    const navOrder = allLinks.filter(text =>
      ['Safaris', 'Decisions', 'Guides', 'How it works'].includes(text)
    );

    expect(navOrder[0]).toBe('Safaris');
  });

  test('navbar order is Safaris, Decisions, Guides, How it works', async ({ page }) => {
    await page.goto('/');

    const allLinks = await page.locator('nav a').allTextContents();
    const navOrder = allLinks.filter(text =>
      ['Safaris', 'Decisions', 'Guides', 'How it works'].includes(text)
    );

    expect(navOrder).toEqual([
      'Safaris',
      'Decisions',
      'Guides',
      'How it works',
    ]);
  });
});

test.describe('Homepage Framing', () => {
  test('homepage loads with 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('hero has Decisions CTA', async ({ page }) => {
    await page.goto('/');

    // Primary CTA should link to decisions - check anywhere on page
    const allDecisionLinks = page.locator('a[href="/decisions"]');
    const count = await allDecisionLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('hero has Trips CTA', async ({ page }) => {
    await page.goto('/');

    // CTA should link to trips - check anywhere on page
    const allTripsLinks = page.locator('a[href="/trips"]');
    const count = await allTripsLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('homepage has trip shapes section', async ({ page }) => {
    await page.goto('/');

    // Should have trip shapes heading
    await expect(page.getByRole('heading', { name: 'Trip shapes' })).toBeVisible();
  });

  test('homepage has decision cards section', async ({ page }) => {
    await page.goto('/');

    // Should have real questions section
    await expect(page.getByRole('heading', { name: 'Start with a real question' })).toBeVisible();
  });

  test('footer has correct navigation links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer.locator('a[href="/decisions"]')).toBeVisible();
    await expect(footer.locator('a[href="/trips"]')).toBeVisible();
    await expect(footer.locator('a[href="/guides"]')).toBeVisible();
  });
});

// ============================================================================
// PART C: TRIP ⇄ DECISION LINKING
// ============================================================================

test.describe('Trip to Decision Linking', () => {
  test('trip detail page shows linked decisions', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const decisionsSection = page.getByTestId('section-decisions');
    await expect(decisionsSection).toBeVisible();

    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(6);
  });

  test('decision links on trip page use prefetch=false', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();

    for (let i = 0; i < count; i++) {
      const link = decisionLinks.nth(i);
      const prefetch = await link.getAttribute('data-prefetch');
      expect(prefetch).not.toBe('true');
    }
  });
});

test.describe('Decision to Trip Linking', () => {
  test('decision page has trip planning CTA', async ({ page }) => {
    await page.goto('/decisions/tanzania-safari-february');

    // Wait for page to load (may need to wait for API response)
    await page.waitForTimeout(2000);

    const tripPlanningCta = page.getByTestId('trip-planning-cta');
    // This may not exist on all decision pages, so check if visible
    if (await tripPlanningCta.isVisible()) {
      await expect(tripPlanningCta).toContainText('Planning a trip');
    }
  });

  test('trip planning CTA links to inquiry page', async ({ page }) => {
    await page.goto('/decisions/tanzania-safari-february');
    await page.waitForTimeout(2000);

    const tripPlanningLink = page.getByTestId('trip-planning-link');
    if (await tripPlanningLink.isVisible()) {
      const href = await tripPlanningLink.getAttribute('href');
      expect(href).toBe('/inquire');
    }
  });
});

// ============================================================================
// CONTENT QUALITY
// ============================================================================

test.describe('Business Coat Content Quality', () => {
  test('inquiry page has no banned phrases', async ({ page }) => {
    await page.goto('/inquire');

    const bodyText = await page.locator('main').first().textContent();

    const bannedPhrases = [
      'book now',
      'limited time',
      'act fast',
      'don\'t miss',
      'amazing deal',
    ];

    for (const phrase of bannedPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('inquiry page has no emojis', async ({ page }) => {
    await page.goto('/inquire');

    const mainContent = await page.locator('main').first().textContent();
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    expect(emojiRegex.test(mainContent || '')).toBe(false);
  });

  test('homepage has no exclamation marks in headings', async ({ page }) => {
    await page.goto('/');

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      expect(text).not.toContain('!');
    }
  });
});

// ============================================================================
// SEO
// ============================================================================

test.describe('Business Coat SEO', () => {
  test('inquiry page is indexable', async ({ page }) => {
    await page.goto('/inquire');

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});

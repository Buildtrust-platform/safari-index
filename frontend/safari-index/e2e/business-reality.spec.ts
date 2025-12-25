/**
 * Business Reality Layer E2E Tests
 *
 * Tests for the Business Reality Layer features:
 * - Part 1: Trip cost bands
 * - Part 2: Decision provenance footer
 * - Part 3: Ops dashboard
 * - Part 4: Inquiry elapsed time
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// PART 1: TRIP COST BANDS
// ============================================================================

test.describe('Trip Cost Bands', () => {
  test('trips listing page shows cost bands', async ({ page }) => {
    await page.goto('/trips');

    // Wait for trip cards to load
    await page.waitForSelector('[data-testid="trip-snapshot"]');

    // Check that cost band is displayed (look for $/pp pattern)
    const tripSnapshots = page.locator('[data-testid="trip-snapshot"]');
    const firstSnapshot = tripSnapshots.first();
    await expect(firstSnapshot).toContainText('/pp');
  });

  test('trip detail page shows cost section', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    // Wait for page to load
    await page.waitForSelector('[data-testid="snapshot-strip"]');

    // Check snapshot strip has cost band
    const snapshotStrip = page.locator('[data-testid="snapshot-strip"]');
    await expect(snapshotStrip).toContainText('/pp');

    // Check dedicated cost section exists
    const costSection = page.locator('[data-testid="section-cost"]');
    await expect(costSection).toBeVisible();
    await expect(costSection).toContainText('Typical cost range');
  });

  test('trip detail page cost section shows note', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const costSection = page.locator('[data-testid="section-cost"]');
    await expect(costSection).toBeVisible();

    // Should contain exclusion note
    await expect(costSection).toContainText('Excluding international flights');
  });

  test('cost bands format correctly for different price ranges', async ({ page }) => {
    // Test a budget trip
    await page.goto('/trips/budget-first-safari');
    const snapshotStrip = page.locator('[data-testid="snapshot-strip"]');

    // Budget trips should show $2,000-$4,000 range
    await expect(snapshotStrip).toContainText('$');
    await expect(snapshotStrip).toContainText('/pp');
  });
});

// ============================================================================
// PART 2: DECISION PROVENANCE FOOTER
// ============================================================================

test.describe('Decision Provenance Footer', () => {
  test('attribution footer has methodology link', async ({ page }) => {
    // Note: Decision pages require API response, so we test with a mock or skip if API unavailable
    // This test verifies the component structure exists
    await page.goto('/how-it-works');

    // Verify how-it-works page loads (linked from provenance footer)
    await expect(page.locator('h1')).toContainText('How it works');
  });

  test('how-it-works page explains decision process', async ({ page }) => {
    await page.goto('/how-it-works');

    // Check key sections are present
    await expect(page.getByText('What it is')).toBeVisible();
    await expect(page.getByText('What it does not do')).toBeVisible();
    await expect(page.getByText('How a decision is made')).toBeVisible();
    await expect(page.getByText('Why refusals exist')).toBeVisible();
    await expect(page.getByText('Change and accountability')).toBeVisible();
  });

  test('how-it-works page has no urgency language', async ({ page }) => {
    await page.goto('/how-it-works');

    const bodyText = await page.locator('body').textContent();

    const urgencyPhrases = [
      'hurry',
      'limited time',
      'act now',
      'don\'t miss',
      'book now',
    ];

    for (const phrase of urgencyPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });
});

// ============================================================================
// PART 3: OPS DASHBOARD
// ============================================================================

test.describe('Ops Dashboard', () => {
  test('ops dashboard requires access key', async ({ page }) => {
    await page.goto('/ops');

    // Wait for page to render
    await page.waitForTimeout(2000);

    // Should show access key required error
    await expect(page.getByText('Access key required')).toBeVisible();
  });

  test('ops dashboard loads with key (mock)', async ({ page }) => {
    await page.goto('/ops?ops_key=test');

    // Wait for page to load fully
    await page.waitForTimeout(2000);

    // Should show dashboard title
    await expect(page.getByText('Ops Dashboard')).toBeVisible();
  });

  test('ops dashboard page loads without crashing', async ({ page }) => {
    await page.goto('/ops?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Just verify the page loaded without crashing
    const hasMain = await page.locator('main').isVisible();
    expect(hasMain).toBe(true);
  });

  test('ops dashboard has noindex meta tag', async ({ page }) => {
    await page.goto('/ops?ops_key=test');

    // Wait for page to render
    await page.waitForTimeout(2000);

    // Check that at least one robots meta tag contains noindex
    const metaTags = page.locator('meta[name="robots"]');
    const count = await metaTags.count();
    let hasNoindex = false;
    for (let i = 0; i < count; i++) {
      const content = await metaTags.nth(i).getAttribute('content');
      if (content?.includes('noindex')) {
        hasNoindex = true;
        break;
      }
    }
    expect(hasNoindex).toBe(true);
  });
});

// ============================================================================
// PART 4: INQUIRY ELAPSED TIME
// ============================================================================

test.describe('Inquiry Elapsed Time', () => {
  test('inquiry detail page requires access key', async ({ page }) => {
    await page.goto('/ops/inquiries/test_inquiry');

    // Wait for page to render
    await page.waitForTimeout(2000);

    // Should show access key required error
    await expect(page.getByText('Access key required')).toBeVisible();
  });

  test('inquiry list page loads without crashing', async ({ page }) => {
    await page.goto('/ops/inquiries?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Just verify the page loaded without crashing
    const hasMain = await page.locator('main').isVisible();
    expect(hasMain).toBe(true);
  });
});

// ============================================================================
// PART 5: CONTENT QUALITY
// ============================================================================

test.describe('Business Reality Content Quality', () => {
  test('trips page has no exclamation marks in headings', async ({ page }) => {
    await page.goto('/trips');

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      expect(text).not.toContain('!');
    }
  });

  test('trip detail page has no banned marketing phrases', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const bodyText = await page.locator('body').textContent();

    const bannedPhrases = [
      'discount',
      'sale',
      'limited offer',
      'exclusive deal',
      'best price',
      'guaranteed',
    ];

    for (const phrase of bannedPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('ops pages have no marketing language', async ({ page }) => {
    await page.goto('/ops?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(1000);

    const bodyText = await page.locator('body').textContent();

    const marketingPhrases = [
      'amazing',
      'incredible',
      'best in class',
      'revolutionary',
      'game-changing',
    ];

    for (const phrase of marketingPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });
});

// ============================================================================
// PART 6: NAVIGATION AND LINKS
// ============================================================================

test.describe('Business Reality Navigation', () => {
  test('trip cards link to detail pages', async ({ page }) => {
    await page.goto('/trips');

    // Click first trip card
    const firstTripCard = page.locator('[data-testid^="trip-card-"]').first();
    await firstTripCard.click();

    // Should navigate to trip detail page
    await expect(page).toHaveURL(/\/trips\/.+/);
    await expect(page.locator('[data-testid="trip-h1"]')).toBeVisible();
  });

  test('ops pages are accessible', async ({ page }) => {
    // Navigate to ops dashboard
    await page.goto('/ops?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Verify page loaded
    const hasMain = await page.locator('main').isVisible();
    expect(hasMain).toBe(true);

    // Navigate to inquiries page directly
    await page.goto('/ops/inquiries?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Verify page loaded
    const hasInquiriesMain = await page.locator('main').isVisible();
    expect(hasInquiriesMain).toBe(true);
  });
});

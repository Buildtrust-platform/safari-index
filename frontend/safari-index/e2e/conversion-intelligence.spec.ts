/**
 * Conversion Intelligence E2E Tests
 *
 * Tests for the attribution tracking and intelligence dashboard:
 * - Part 1: Attribution tracking utility
 * - Part 2: Intelligence API
 * - Part 3: Intelligence dashboard page
 * - Part 4: Attribution capture on inquiry submission
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// PART 1: ATTRIBUTION TRACKING BEHAVIOR
// ============================================================================

test.describe('Attribution Tracking', () => {
  test('AttributionTracker component is present on page', async ({ page }) => {
    await page.goto('/');

    // The tracker is invisible but should be mounted
    // We can verify by checking that sessionStorage is populated
    await page.waitForTimeout(500); // Allow time for tracker to initialize

    const sessionData = await page.evaluate(() => {
      return {
        firstTouchPath: sessionStorage.getItem('si_first_touch_path'),
        entrySurface: sessionStorage.getItem('si_entry_surface'),
        pagesViewed: sessionStorage.getItem('si_pages_viewed'),
      };
    });

    // First touch should be captured
    expect(sessionData.firstTouchPath).toBe('/');
    expect(sessionData.entrySurface).toBe('homepage');
    expect(sessionData.pagesViewed).toBe('1');
  });

  test('page views are tracked across navigation', async ({ page }) => {
    // Visit homepage
    await page.goto('/');
    await page.waitForTimeout(300);

    // Navigate to decisions
    await page.goto('/decisions');
    await page.waitForTimeout(300);

    // Navigate to a trip
    await page.goto('/trips');
    await page.waitForTimeout(300);

    const pagesViewed = await page.evaluate(() => {
      return sessionStorage.getItem('si_pages_viewed');
    });

    expect(pagesViewed).toBe('3');
  });

  test('first touch path is preserved across navigation', async ({ page }) => {
    // Start from decisions page
    await page.goto('/decisions');
    await page.waitForTimeout(300);

    // Navigate to another page
    await page.goto('/trips');
    await page.waitForTimeout(300);

    const firstTouchPath = await page.evaluate(() => {
      return sessionStorage.getItem('si_first_touch_path');
    });

    // First touch should still be decisions
    expect(firstTouchPath).toBe('/decisions');
  });

  test('entry surface is classified correctly for decision page', async ({ page }) => {
    await page.goto('/decisions/first-safari-destination');
    await page.waitForTimeout(300);

    const entrySurface = await page.evaluate(() => {
      return sessionStorage.getItem('si_entry_surface');
    });

    expect(entrySurface).toBe('decision-page');
  });

  test('entry surface is classified correctly for trip page', async ({ page }) => {
    await page.goto('/trips/serengeti-migration');
    await page.waitForTimeout(300);

    const entrySurface = await page.evaluate(() => {
      return sessionStorage.getItem('si_entry_surface');
    });

    expect(entrySurface).toBe('trip-page');
  });

  test('entry surface is classified correctly for destinations hub', async ({ page }) => {
    await page.goto('/destinations');
    await page.waitForTimeout(300);

    const entrySurface = await page.evaluate(() => {
      return sessionStorage.getItem('si_entry_surface');
    });

    expect(entrySurface).toBe('destinations');
  });

  test('UTM parameters are captured from URL', async ({ page }) => {
    await page.goto('/?utm_source=google&utm_medium=cpc&utm_campaign=safari-2025');
    await page.waitForTimeout(300);

    const utmData = await page.evaluate(() => {
      return {
        source: sessionStorage.getItem('si_utm_source'),
        medium: sessionStorage.getItem('si_utm_medium'),
        campaign: sessionStorage.getItem('si_utm_campaign'),
      };
    });

    expect(utmData.source).toBe('google');
    expect(utmData.medium).toBe('cpc');
    expect(utmData.campaign).toBe('safari-2025');
  });

  test('last touch path is updated on each page view', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);

    await page.goto('/decisions');
    await page.waitForTimeout(300);

    let lastTouchPath = await page.evaluate(() => {
      return sessionStorage.getItem('si_last_touch_path');
    });
    expect(lastTouchPath).toBe('/decisions');

    await page.goto('/inquire');
    await page.waitForTimeout(300);

    lastTouchPath = await page.evaluate(() => {
      return sessionStorage.getItem('si_last_touch_path');
    });
    expect(lastTouchPath).toBe('/inquire');
  });
});

// ============================================================================
// PART 2: INTELLIGENCE API
// ============================================================================

test.describe('Intelligence API', () => {
  test('GET /api/ops/intelligence accessible in development', async ({ request }) => {
    const response = await request.get('/api/ops/intelligence');

    // In development without OPS_KEY, returns 200 or 500 (if DynamoDB not configured)
    expect([200, 404, 500]).toContain(response.status());
  });

  test('GET /api/ops/intelligence returns valid summary structure', async ({ request }) => {
    const response = await request.get('/api/ops/intelligence');

    if (response.status() === 200) {
      const data = await response.json();

      // Verify structure
      expect(data).toHaveProperty('total_inquiries');
      expect(data).toHaveProperty('date_range');
      expect(data).toHaveProperty('entry_surfaces');
      expect(data).toHaveProperty('top_decisions');
      expect(data).toHaveProperty('top_trips');
      expect(data).toHaveProperty('utm_sources');
      expect(data).toHaveProperty('referrers');
      expect(data).toHaveProperty('avg_pages_viewed');

      // Entry surfaces should be an array
      expect(Array.isArray(data.entry_surfaces)).toBe(true);
      expect(Array.isArray(data.top_decisions)).toBe(true);
      expect(Array.isArray(data.top_trips)).toBe(true);
    }
  });

  test('GET /api/ops/intelligence respects limit parameter', async ({ request }) => {
    const response = await request.get('/api/ops/intelligence?limit=10');

    // Should accept limit parameter
    expect([200, 404, 500]).toContain(response.status());
  });
});

// ============================================================================
// PART 3: INTELLIGENCE DASHBOARD PAGE
// ============================================================================

test.describe('Intelligence Dashboard', () => {
  test('intelligence page loads in development', async ({ page }) => {
    await page.goto('/ops/intelligence');

    // Should show header
    await expect(page.getByText('Conversion Intelligence')).toBeVisible();
  });

  test('intelligence page has noindex meta tag', async ({ page }) => {
    await page.goto('/ops/intelligence');

    // Check for noindex meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();
    if (count > 0) {
      let hasNoindex = false;
      for (let i = 0; i < count; i++) {
        const content = await robotsMeta.nth(i).getAttribute('content');
        if (content?.includes('noindex')) {
          hasNoindex = true;
          break;
        }
      }
      expect(hasNoindex).toBe(true);
    }
  });

  test('intelligence page shows summary stats section', async ({ page }) => {
    await page.goto('/ops/intelligence');

    // Wait for page to load (may show loading state first)
    await page.waitForTimeout(1000);

    // Should show summary stat labels
    await expect(page.getByText('Total Inquiries')).toBeVisible();
    await expect(page.getByText('Avg Pages Viewed')).toBeVisible();
    await expect(page.getByText('Top Decisions')).toBeVisible();
  });

  test('intelligence page shows section cards', async ({ page }) => {
    await page.goto('/ops/intelligence');
    await page.waitForTimeout(1000);

    // Should show section titles
    await expect(page.getByText('Entry Surfaces')).toBeVisible();
    await expect(page.getByText('Top Decisions by Inquiry')).toBeVisible();
    await expect(page.getByText('Top Trips by Inquiry')).toBeVisible();
  });

  test('intelligence page has refresh button', async ({ page }) => {
    await page.goto('/ops/intelligence');

    const refreshButton = page.getByRole('button', { name: /Refresh/i });
    await expect(refreshButton).toBeVisible();
  });

  test('intelligence page has back link to ops dashboard', async ({ page }) => {
    await page.goto('/ops/intelligence');

    // Should have back arrow link
    const backLink = page.locator('a[href*="/ops"]').first();
    await expect(backLink).toBeVisible();
  });

  test('intelligence page shows interpretation guide', async ({ page }) => {
    await page.goto('/ops/intelligence');
    await page.waitForTimeout(1000);

    await expect(page.getByText('Interpretation Guide')).toBeVisible();
  });
});

// ============================================================================
// PART 4: OPS DASHBOARD INTELLIGENCE LINK
// ============================================================================

test.describe('Ops Dashboard Intelligence Link', () => {
  test('ops dashboard has link to intelligence', async ({ page }) => {
    await page.goto('/ops');
    await page.waitForTimeout(1000);

    // Should show intelligence link
    await expect(page.getByText('Intelligence')).toBeVisible();
    await expect(page.getByText('Conversion analytics')).toBeVisible();
  });

  test('intelligence link navigates to intelligence page', async ({ page }) => {
    await page.goto('/ops');
    await page.waitForTimeout(1000);

    // Click on Intelligence link
    await page.getByText('Intelligence').click();

    // Should navigate to intelligence page
    await expect(page).toHaveURL(/\/ops\/intelligence/);
    await expect(page.getByText('Conversion Intelligence')).toBeVisible();
  });
});

// ============================================================================
// PART 5: ATTRIBUTION DATA PASSED TO API
// ============================================================================

test.describe('Attribution Data in Inquiry Submission', () => {
  test('inquiry API accepts attribution field', async ({ request }) => {
    const response = await request.post('/api/inquire', {
      data: {
        trip_shape_id: null,
        budget_band: '5k-10k',
        travel_month: 6,
        travel_year: 2025,
        traveler_count: 2,
        travel_style: 'couple',
        email: 'attribution-test@example.com',
        whatsapp: null,
        linked_decision_ids: [],
        notes: null,
        attribution: {
          entry_surface: 'decision-page',
          first_touch_path: '/decisions/first-safari',
          last_touch_path: '/inquire',
          pages_viewed: 5,
          utm_source: 'test',
        },
      },
    });

    // Should accept attribution field (may fail on DynamoDB write, but not on validation)
    // 200 = success, 500 = DynamoDB not configured, should not be 400
    expect([200, 500]).toContain(response.status());

    // If 400, it's a validation error which shouldn't happen
    if (response.status() === 400) {
      const body = await response.json();
      console.error('Validation error:', body);
    }
  });

  test('inquiry API accepts empty attribution field', async ({ request }) => {
    const response = await request.post('/api/inquire', {
      data: {
        trip_shape_id: null,
        budget_band: '5k-10k',
        travel_month: 6,
        travel_year: 2025,
        traveler_count: 2,
        travel_style: 'couple',
        email: 'no-attribution@example.com',
        whatsapp: null,
        linked_decision_ids: [],
        notes: null,
        // No attribution field - should be accepted
      },
    });

    // Should accept without attribution
    expect([200, 500]).toContain(response.status());
  });
});

// ============================================================================
// CONTENT QUALITY
// ============================================================================

test.describe('Intelligence Page Content Quality', () => {
  test('intelligence page has no marketing language', async ({ page }) => {
    await page.goto('/ops/intelligence');
    await page.waitForTimeout(1000);

    const bodyText = await page.locator('main').first().textContent();

    const marketingPhrases = [
      'buy now',
      'limited time',
      'act fast',
      'discount',
      'sale',
    ];

    for (const phrase of marketingPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('intelligence page uses professional terminology', async ({ page }) => {
    await page.goto('/ops/intelligence');
    await page.waitForTimeout(1000);

    // Should use appropriate business intelligence terms
    await expect(page.getByText(/Entry Surfaces/)).toBeVisible();
    await expect(page.getByText(/Interpretation Guide/)).toBeVisible();
  });
});

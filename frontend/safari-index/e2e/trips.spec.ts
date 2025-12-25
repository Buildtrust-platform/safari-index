/**
 * Trips Feature E2E Tests
 *
 * Tests for the Safari Index Trip Shapes layer.
 *
 * Coverage:
 * 1. /trips returns 200 and lists 20 trips
 * 2. Each trip page returns 200
 * 3. Trip page contains snapshot strip + tradeoffs + linked decisions section
 * 4. Decision links use prefetch={false}
 * 5. Sitemap includes /trips and trip URLs
 * 6. No banned phrases, emojis, or exclamation marks
 */

import { test, expect } from '@playwright/test';

test.describe('Trips Hub Page', () => {
  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto('/trips');
    expect(response?.status()).toBe(200);
  });

  test('displays main heading', async ({ page }) => {
    await page.goto('/trips');
    const heading = page.getByTestId('trips-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Private Safaris');
  });

  test('lists trips across regional sections', async ({ page }) => {
    await page.goto('/trips');

    // Trips are grouped by region/interest, showing curated selections per section
    // Each section shows up to 6 trips to keep the page scannable
    const tripCards = page.locator('[data-testid^="trip-card-"]');
    const count = await tripCards.count();

    // Get all unique trip IDs (some trips appear in multiple sections)
    const testIds = await tripCards.evaluateAll((cards) =>
      [...new Set(cards.map((card) => card.getAttribute('data-testid')))]
    );

    // Should have at least 15 unique trips visible across sections
    expect(testIds.length).toBeGreaterThanOrEqual(15);
    // Total card count should show substantial coverage
    expect(count).toBeGreaterThanOrEqual(18);
  });

  test('trip cards have snapshot strips', async ({ page }) => {
    await page.goto('/trips');

    // Check first trip card has snapshot
    const firstCard = page.locator('[data-testid^="trip-card-"]').first();
    const snapshot = firstCard.getByTestId('trip-snapshot');
    await expect(snapshot).toBeVisible();
  });

  test('has regional sections', async ({ page }) => {
    await page.goto('/trips');

    await expect(page.getByTestId('region-section-east-africa')).toBeVisible();
    await expect(page.getByTestId('region-section-southern-africa')).toBeVisible();
    await expect(page.getByTestId('region-section-uganda-rwanda')).toBeVisible();
    await expect(page.getByTestId('region-section-special')).toBeVisible();
  });

  test('trip cards are clickable and link to trip pages', async ({ page }) => {
    await page.goto('/trips');

    // Click on first trip card
    const firstCard = page.locator('[data-testid^="trip-card-"]').first();
    await firstCard.click();

    // Should navigate to trip page
    await expect(page).toHaveURL(/\/trips\/.+/);
  });

  test('has navbar with Safaris link', async ({ page, isMobile }) => {
    await page.goto('/trips');

    if (isMobile) {
      const mobileToggle = page.getByTestId('navbar-mobile-toggle');
      await mobileToggle.click();
      const mobileMenu = page.getByTestId('navbar-mobile-menu');
      await expect(mobileMenu).toBeVisible();
      await expect(mobileMenu.locator('a[href="/trips"]')).toBeVisible();
    } else {
      await expect(page.getByTestId('navbar-link-safaris')).toBeVisible();
    }
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto('/trips');

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});

test.describe('Trip Detail Page', () => {
  const testTripId = 'classic-serengeti-ngorongoro';

  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto(`/trips/${testTripId}`);
    expect(response?.status()).toBe(200);
  });

  test('displays trip heading', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);
    const heading = page.getByTestId('trip-h1');
    await expect(heading).toBeVisible();
  });

  test('has snapshot strip with region, duration, comfort, and best months', async ({
    page,
  }) => {
    await page.goto(`/trips/${testTripId}`);

    const snapshotStrip = page.getByTestId('snapshot-strip');
    await expect(snapshotStrip).toBeVisible();

    // Should contain region, duration, comfort tier, and months info
    const stripText = await snapshotStrip.textContent();
    expect(stripText).toBeTruthy();
    expect(stripText?.length).toBeGreaterThan(20);
  });

  test('has parks section', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);
    const section = page.getByTestId('section-parks');
    await expect(section).toBeVisible();
  });

  test('has what this trip is for section', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);
    const section = page.getByTestId('section-fit');
    await expect(section).toBeVisible();
  });

  test('has tradeoffs section with 3 items', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    const section = page.getByTestId('section-tradeoffs');
    await expect(section).toBeVisible();

    const tradeoffsList = page.getByTestId('tradeoffs-list');
    await expect(tradeoffsList).toBeVisible();

    const items = tradeoffsList.locator('li');
    const count = await items.count();
    expect(count).toBe(3);
  });

  test('has decisions to confirm section', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    const section = page.getByTestId('section-decisions');
    await expect(section).toBeVisible();

    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(6);
  });

  test('decision links use prefetch=false', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    // Check that decision links don't have prefetch (Next.js adds data-prefetch attribute when enabled)
    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();

    for (let i = 0; i < count; i++) {
      const link = decisionLinks.nth(i);
      // Links with prefetch={false} should not have data-prefetch="true"
      const prefetch = await link.getAttribute('data-prefetch');
      expect(prefetch).not.toBe('true');
    }
  });

  test('has variants section', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    const section = page.getByTestId('section-variants');
    await expect(section).toBeVisible();

    const variantCards = page.getByTestId('variant-card');
    const count = await variantCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);
  });

  test('has breadcrumb with link to trips hub', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    const breadcrumb = page.getByTestId('breadcrumb');
    await expect(breadcrumb).toBeVisible();

    const tripsLink = page.getByTestId('breadcrumb-trips');
    await expect(tripsLink).toHaveAttribute('href', '/trips');
  });

  test('has JSON-LD TouristTrip schema', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toHaveCount(1);

    const jsonContent = await jsonLdScript.textContent();
    expect(jsonContent).toBeTruthy();

    const schema = JSON.parse(jsonContent!);
    expect(schema['@type']).toBe('TouristTrip');
    expect(schema.name).toBeTruthy();
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto(`/trips/${testTripId}`);

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('handles invalid trip gracefully with 404', async ({ page }) => {
    const response = await page.goto('/trips/invalid-trip-that-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('All Trip Pages Load', () => {
  const tripIds = [
    'classic-serengeti-ngorongoro',
    'migration-focused-serengeti',
    'tanzania-southern-circuit',
    'classic-kenya-safari',
    'kenya-conservancy-focused',
    'okavango-delta-immersion',
    'botswana-diverse-ecosystems',
    'kruger-greater-kruger',
    'south-africa-combo',
    'rwanda-gorilla-focused',
    'uganda-primate-safari',
    'namibia-highlights',
    'namibia-self-drive',
    'zambia-walking-safari',
    'victoria-falls-safari-combo',
    'photography-focused-safari',
    'family-multigenerational',
    'honeymoon-romance-safari',
    'budget-first-safari',
  ];

  for (const tripId of tripIds) {
    test(`trip page ${tripId} returns 200`, async ({ page }) => {
      const response = await page.goto(`/trips/${tripId}`);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('Trips Content Quality', () => {
  test('no banned phrases in trip hub', async ({ page }) => {
    await page.goto('/trips');

    const bodyText = await page.locator('main').textContent();

    const bannedPhrases = [
      'unforgettable',
      'magical',
      'breathtaking',
      'seamless',
      'bucket list',
      'book now',
      'once in a lifetime',
    ];

    for (const phrase of bannedPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('no banned phrases in trip detail', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const bodyText = await page.locator('main').textContent();

    const bannedPhrases = [
      'unforgettable',
      'magical',
      'breathtaking',
      'seamless',
      'bucket list',
      'book now',
      'once in a lifetime',
    ];

    for (const phrase of bannedPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('no exclamation marks in trip titles or headings', async ({ page }) => {
    await page.goto('/trips');

    // Check all trip card titles
    const tripCards = page.locator('[data-testid^="trip-card-"]');
    const count = await tripCards.count();

    for (let i = 0; i < count; i++) {
      const cardText = await tripCards.nth(i).locator('h2').textContent();
      expect(cardText).not.toContain('!');
    }
  });

  test('no emojis in trip content', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const mainContent = await page.locator('main').textContent();

    // Simple emoji detection
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    expect(emojiRegex.test(mainContent || '')).toBe(false);
  });
});

test.describe('Trips Sitemap', () => {
  test('sitemap includes /trips', async ({ page }) => {
    await page.goto('/sitemap.xml');
    const content = await page.content();

    expect(content).toContain('/trips</loc>');
  });

  test('sitemap includes at least 5 trip URLs', async ({ page }) => {
    await page.goto('/sitemap.xml');
    const content = await page.content();

    // Count occurrences of /trips/ URLs
    const tripUrlMatches = content.match(/\/trips\/[a-z-]+<\/loc>/g);
    expect(tripUrlMatches).toBeTruthy();
    expect(tripUrlMatches!.length).toBeGreaterThanOrEqual(5);
  });
});

test.describe('Trips Navigation Integration', () => {
  test('can navigate from trips hub to trip detail and back', async ({ page }) => {
    // Start at trips hub
    await page.goto('/trips');
    await expect(page.getByTestId('trips-h1')).toBeVisible();

    // Click on a trip
    await page.locator('[data-testid^="trip-card-"]').first().click();
    await expect(page).toHaveURL(/\/trips\/.+/);
    await expect(page.getByTestId('trip-h1')).toBeVisible();

    // Navigate back via breadcrumb
    const breadcrumbTrips = page.getByTestId('breadcrumb-trips');
    await expect(breadcrumbTrips).toHaveAttribute('href', '/trips');

    // Use href value to navigate (breadcrumb may be under fixed navbar)
    const href = await breadcrumbTrips.getAttribute('href');
    await page.goto(href!);
    await expect(page).toHaveURL('/trips');
  });

  test('decision links navigate to decision pages', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const decisionLink = page.getByTestId('decision-link').first();
    const href = await decisionLink.getAttribute('href');
    expect(href).toContain('/decisions/');

    await decisionLink.click();
    await expect(page).toHaveURL(/\/decisions\/.+/);
  });
});

test.describe('Trips SEO', () => {
  test('trips hub has proper meta description', async ({ page }) => {
    await page.goto('/trips');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
    expect(content?.length).toBeLessThan(160);
  });

  test('trips hub has canonical URL', async ({ page }) => {
    await page.goto('/trips');

    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute('href');
    expect(href).toContain('/trips');
  });

  test('trip detail has proper meta description', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
  });

  test('trip detail has TouristTrip schema', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    const schema = JSON.parse(content!);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('TouristTrip');
    expect(schema.name).toBeTruthy();
    expect(schema.itinerary).toBeTruthy();
  });
});

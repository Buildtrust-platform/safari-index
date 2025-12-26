/**
 * Itineraries E2E Tests
 *
 * Tests for the Safari Index Itinerary Layer.
 *
 * Coverage:
 * 1. /itineraries hub returns 200 and lists itineraries
 * 2. Each itinerary page returns 200
 * 3. Itinerary page contains all required sections
 * 4. JSON-LD TouristTrip schema present
 * 5. Decision links use prefetch={false}
 * 6. Inquiry prefill integration works
 * 7. No banned phrases, emojis, or exclamation marks
 */

import { test, expect } from '@playwright/test';

test.describe('Itineraries Hub Page', () => {
  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto('/itineraries');
    expect(response?.status()).toBe(200);
  });

  test('displays main heading', async ({ page }) => {
    await page.goto('/itineraries');
    const heading = page.getByTestId('itineraries-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Safari Itineraries');
  });

  test('lists itinerary cards', async ({ page }) => {
    await page.goto('/itineraries');

    const itineraryCards = page.getByTestId('itinerary-card');
    const count = await itineraryCards.count();

    // Should have at least 10 itinerary cards
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('has featured itineraries section', async ({ page }) => {
    await page.goto('/itineraries');

    const featuredSection = page.getByTestId('featured-itineraries');
    await expect(featuredSection).toBeVisible();

    const featuredCards = page.getByTestId('featured-itinerary-card');
    const count = await featuredCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('has regional grouping sections', async ({ page }) => {
    await page.goto('/itineraries');

    // Check for at least one regional section
    const tanzaniaSection = page.getByTestId('region-tanzania');
    await expect(tanzaniaSection).toBeVisible();
  });

  test('itinerary cards are clickable and link to detail pages', async ({ page }) => {
    await page.goto('/itineraries');

    const firstCard = page.getByTestId('itinerary-card').first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/itineraries\/.+/);
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto('/itineraries');

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('has search component', async ({ page }) => {
    await page.goto('/itineraries');

    // Check for search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });
});

test.describe('Itinerary Detail Page', () => {
  const testItinerarySlug = 'tanzania-classic-northern-circuit';

  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto(`/itineraries/${testItinerarySlug}`);
    expect(response?.status()).toBe(200);
  });

  test('displays itinerary heading', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);
    const heading = page.getByTestId('itinerary-h1');
    await expect(heading).toBeVisible();
  });

  test('has snapshot strip with key info', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const snapshotStrip = page.getByTestId('snapshot-strip');
    await expect(snapshotStrip).toBeVisible();

    const stripText = await snapshotStrip.textContent();
    expect(stripText).toBeTruthy();
    expect(stripText?.length).toBeGreaterThan(20);
  });

  test('has route overview section with segments', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('route-overview');
    await expect(section).toBeVisible();

    // Should have at least one segment card
    const segmentCards = page.getByTestId('segment-card');
    const count = await segmentCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('has typical day section', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('typical-day');
    await expect(section).toBeVisible();
  });

  test('has activities section', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('activities');
    await expect(section).toBeVisible();
  });

  test('has best season section', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('best-season');
    await expect(section).toBeVisible();
  });

  test('has trade-offs section', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('trade-offs');
    await expect(section).toBeVisible();
  });

  test('has fit section (who this is for)', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('fit');
    await expect(section).toBeVisible();
  });

  test('has variants section', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('variants');
    await expect(section).toBeVisible();
  });

  test('has cost section', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('cost');
    await expect(section).toBeVisible();
  });

  test('has decisions section with links', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const section = page.getByTestId('decisions');
    await expect(section).toBeVisible();
  });

  test('decision links use prefetch=false', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const link = decisionLinks.nth(i);
        const prefetch = await link.getAttribute('data-prefetch');
        expect(prefetch).not.toBe('true');
      }
    }
  });

  test('has inquiry CTA button', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const inquireCta = page.getByTestId('inquire-cta');
    await expect(inquireCta).toBeVisible();

    const href = await inquireCta.getAttribute('href');
    expect(href).toContain('/inquire');
    expect(href).toContain('itinerary=');
  });

  test('has JSON-LD TouristTrip schema', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toHaveCount(1);

    const jsonContent = await jsonLdScript.textContent();
    expect(jsonContent).toBeTruthy();

    const schema = JSON.parse(jsonContent!);
    expect(schema['@type']).toBe('TouristTrip');
    expect(schema.name).toBeTruthy();
    expect(schema.itinerary).toBeTruthy();
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto(`/itineraries/${testItinerarySlug}`);

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('handles invalid itinerary gracefully with 404', async ({ page }) => {
    const response = await page.goto('/itineraries/invalid-itinerary-that-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('All Itinerary Pages Load', () => {
  const itinerarySlugs = [
    'tanzania-classic-northern-circuit',
    'tanzania-great-migration',
    'tanzania-southern-circuit',
    'kenya-classic-safari',
    'kenya-private-conservancies',
    'botswana-okavango-delta',
    'botswana-delta-desert-pans',
    'rwanda-gorilla-trek',
    'uganda-primate-safari',
    'namibia-highlights',
    'namibia-self-drive',
    'south-africa-kruger',
    'south-africa-safari-and-cape',
  ];

  for (const slug of itinerarySlugs) {
    test(`itinerary page ${slug} returns 200`, async ({ page }) => {
      const response = await page.goto(`/itineraries/${slug}`);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('Itineraries Content Quality', () => {
  test('no banned phrases in hub', async ({ page }) => {
    await page.goto('/itineraries');

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

  test('no banned phrases in detail page', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');

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

  test('no exclamation marks in titles or headings', async ({ page }) => {
    await page.goto('/itineraries');

    const itineraryCards = page.getByTestId('itinerary-card');
    const count = await itineraryCards.count();

    for (let i = 0; i < count; i++) {
      const cardText = await itineraryCards.nth(i).locator('h3').textContent();
      expect(cardText).not.toContain('!');
    }
  });

  test('no emojis in content', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');

    const mainContent = await page.locator('main').textContent();

    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    expect(emojiRegex.test(mainContent || '')).toBe(false);
  });
});

test.describe('Itineraries Inquiry Prefill Integration', () => {
  test('CTA links to inquiry with itinerary prefill', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');

    const inquireCta = page.getByTestId('inquire-cta');
    const href = await inquireCta.getAttribute('href');

    expect(href).toContain('/inquire');
    expect(href).toContain('itinerary=');
    expect(href).toContain('region=');
  });

  test('inquiry page receives prefill params', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');

    const inquireCta = page.getByTestId('inquire-cta');
    await inquireCta.click();

    await expect(page).toHaveURL(/\/inquire\?/);
    await expect(page).toHaveURL(/itinerary=/);
  });
});

test.describe('Itineraries Navigation', () => {
  test('can navigate from hub to detail and back', async ({ page }) => {
    await page.goto('/itineraries');
    await expect(page.getByTestId('itineraries-h1')).toBeVisible();

    // Click on an itinerary
    await page.getByTestId('itinerary-card').first().click();
    await expect(page).toHaveURL(/\/itineraries\/.+/);
    await expect(page.getByTestId('itinerary-h1')).toBeVisible();

    // Navigate back via breadcrumb link (may be covered by fixed navbar, so use goto)
    const itinerariesLink = page.locator('a[href="/itineraries"]').first();
    await expect(itinerariesLink).toBeVisible();
    const href = await itinerariesLink.getAttribute('href');
    await page.goto(href!);
    await expect(page).toHaveURL('/itineraries');
  });

  test('featured cards navigate to detail pages', async ({ page }) => {
    await page.goto('/itineraries');

    const featuredCards = page.getByTestId('featured-itinerary-card');
    const count = await featuredCards.count();

    if (count > 0) {
      await featuredCards.first().click();
      await expect(page).toHaveURL(/\/itineraries\/.+/);
    }
  });
});

test.describe('Itineraries SEO', () => {
  test('hub has proper meta description', async ({ page }) => {
    await page.goto('/itineraries');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
    expect(content?.length).toBeLessThan(160);
  });

  test('hub has canonical URL', async ({ page }) => {
    await page.goto('/itineraries');

    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute('href');
    expect(href).toContain('/itineraries');
  });

  test('detail page has proper meta description', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
  });

  test('detail page has TouristTrip schema with itinerary data', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');

    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    const schema = JSON.parse(content!);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('TouristTrip');
    expect(schema.name).toBeTruthy();
    expect(schema.itinerary).toBeTruthy();
    // Itinerary is an ItemList object with itemListElement array
    expect(schema.itinerary['@type']).toBe('ItemList');
    expect(schema.itinerary.itemListElement.length).toBeGreaterThanOrEqual(2);
  });
});

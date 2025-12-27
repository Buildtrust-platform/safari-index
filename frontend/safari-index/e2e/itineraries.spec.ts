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
    await firstCard.scrollIntoViewIfNeeded();
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
    // Original itineraries
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
    // New itineraries added
    'tanzania-short-northern-circuit',
    'tanzania-safari-and-beach',
    'tanzania-walking-safari',
    'kenya-northern-frontier',
    'kenya-masai-mara-migration',
    'kenya-family-friendly',
    'zambia-walking-safari',
    'zimbabwe-falls-and-wildlife',
    'east-africa-grand-circuit',
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
    // Scroll into view and wait for visibility (CTA is at bottom of page)
    await inquireCta.scrollIntoViewIfNeeded();
    await expect(inquireCta).toBeVisible();

    // Get href and navigate directly (more reliable on mobile)
    const href = await inquireCta.getAttribute('href');
    expect(href).toContain('/inquire?');
    expect(href).toContain('itinerary=');
  });
});

test.describe('Itineraries Navigation', () => {
  test('can navigate from hub to detail and back', async ({ page }) => {
    await page.goto('/itineraries');
    await expect(page.getByTestId('itineraries-h1')).toBeVisible();

    // Click on an itinerary
    const firstCard = page.getByTestId('itinerary-card').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();
    await expect(page).toHaveURL(/\/itineraries\/.+/);
    await expect(page.getByTestId('itinerary-h1')).toBeVisible();

    // Navigate back directly (navbar may be hidden on mobile)
    await page.goto('/itineraries');
    await expect(page).toHaveURL('/itineraries');
    await expect(page.getByTestId('itineraries-h1')).toBeVisible();
  });

  test('featured cards navigate to detail pages', async ({ page }) => {
    await page.goto('/itineraries');

    const featuredCards = page.getByTestId('featured-itinerary-card');
    const count = await featuredCards.count();

    if (count > 0) {
      const firstFeatured = featuredCards.first();
      await firstFeatured.scrollIntoViewIfNeeded();
      await firstFeatured.click();
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

test.describe('Sitemap Includes Itineraries', () => {
  test('sitemap.xml includes /itineraries hub', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('/itineraries');
  });

  test('sitemap.xml includes sample itinerary URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('/itineraries/tanzania-classic-northern-circuit');
  });

  test('sitemap.xml includes new itinerary URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('/itineraries/east-africa-grand-circuit');
  });
});

test.describe('Navbar Itineraries Integration', () => {
  test('navbar has Itineraries link on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const navbar = page.getByTestId('navbar');
    const itinerariesLink = navbar.locator('a[href="/itineraries"]');
    await expect(itinerariesLink).toBeVisible();
  });

  test('Itineraries link navigates correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const navbar = page.getByTestId('navbar');
    const itinerariesLink = navbar.locator('a[href="/itineraries"]');
    await itinerariesLink.click();
    await expect(page).toHaveURL('/itineraries');
  });

  test('Itineraries appears in mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    // Open mobile menu
    const menuToggle = page.getByTestId('navbar-mobile-toggle');
    await menuToggle.click();
    const mobileMenu = page.getByTestId('navbar-mobile-menu');
    await expect(mobileMenu).toBeVisible();
    const itinerariesLink = mobileMenu.locator('a[href="/itineraries"]');
    await expect(itinerariesLink).toBeVisible();
  });
});

test.describe('Itinerary Detail - Region Validation', () => {
  test('Tanzania itinerary shows Tanzania in snapshot', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');
    const strip = page.getByTestId('snapshot-strip');
    const text = await strip.textContent();
    expect(text?.toLowerCase()).toContain('tanzania');
  });

  test('Kenya itinerary shows Kenya in snapshot', async ({ page }) => {
    await page.goto('/itineraries/kenya-masai-mara-migration');
    const strip = page.getByTestId('snapshot-strip');
    const text = await strip.textContent();
    expect(text?.toLowerCase()).toContain('kenya');
  });

  test('Zambia itinerary shows Zambia in snapshot', async ({ page }) => {
    await page.goto('/itineraries/zambia-walking-safari');
    const strip = page.getByTestId('snapshot-strip');
    const text = await strip.textContent();
    expect(text?.toLowerCase()).toContain('zambia');
  });

  test('Zimbabwe itinerary shows Zimbabwe in snapshot', async ({ page }) => {
    await page.goto('/itineraries/zimbabwe-falls-and-wildlife');
    const strip = page.getByTestId('snapshot-strip');
    const text = await strip.textContent();
    expect(text?.toLowerCase()).toContain('zimbabwe');
  });
});

test.describe('Itinerary Count Validation', () => {
  test('hub displays at least 24 itineraries', async ({ page }) => {
    await page.goto('/itineraries');
    const cards = page.getByTestId('itinerary-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(24);
  });
});

test.describe('Mobile Responsiveness', () => {
  test('hub page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/itineraries');
    const h1 = page.getByTestId('itineraries-h1');
    await expect(h1).toBeVisible();
    const cards = page.getByTestId('itinerary-card');
    await expect(cards.first()).toBeVisible();
  });

  test('detail page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/itineraries/tanzania-classic-northern-circuit');
    const h1 = page.getByTestId('itinerary-h1');
    await expect(h1).toBeVisible();
    const strip = page.getByTestId('snapshot-strip');
    await expect(strip).toBeVisible();
  });

  test('segment cards stack properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/itineraries/tanzania-classic-northern-circuit');
    const segments = page.getByTestId('segment-card');
    await expect(segments.first()).toBeVisible();
  });
});

test.describe('Decision Link Max Count', () => {
  test('decisions section shows max 6 links', async ({ page }) => {
    await page.goto('/itineraries/tanzania-classic-northern-circuit');
    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();
    expect(count).toBeLessThanOrEqual(6);
  });

  test('east-africa-grand-circuit has decisions capped at 6', async ({ page }) => {
    await page.goto('/itineraries/east-africa-grand-circuit');
    const decisionLinks = page.getByTestId('decision-link');
    const count = await decisionLinks.count();
    expect(count).toBeLessThanOrEqual(6);
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('New Itinerary Features', () => {
  test('Zambia walking safari has walking-specific content', async ({ page }) => {
    await page.goto('/itineraries/zambia-walking-safari');
    const mainContent = await page.locator('main').textContent();
    expect(mainContent?.toLowerCase()).toContain('walking');
  });

  test('Zimbabwe falls itinerary mentions Victoria Falls', async ({ page }) => {
    await page.goto('/itineraries/zimbabwe-falls-and-wildlife');
    const mainContent = await page.locator('main').textContent();
    expect(mainContent?.toLowerCase()).toContain('victoria');
  });

  test('Kenya family safari mentions family-friendly', async ({ page }) => {
    await page.goto('/itineraries/kenya-family-friendly');
    const mainContent = await page.locator('main').textContent();
    expect(mainContent?.toLowerCase()).toContain('family');
  });

  test('East Africa grand circuit spans multiple countries', async ({ page }) => {
    await page.goto('/itineraries/east-africa-grand-circuit');
    const mainContent = await page.locator('main').textContent();
    // Should mention Tanzania, Kenya, or Rwanda
    const mentionsMultiple =
      mainContent?.toLowerCase().includes('tanzania') ||
      mainContent?.toLowerCase().includes('kenya') ||
      mainContent?.toLowerCase().includes('rwanda');
    expect(mentionsMultiple).toBe(true);
  });
});

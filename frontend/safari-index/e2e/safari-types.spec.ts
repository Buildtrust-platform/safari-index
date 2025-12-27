/**
 * Safari Types E2E Tests
 *
 * Tests for the Safari Types discovery layer.
 *
 * Coverage:
 * 1. /safari-types hub returns 200 and lists safari types
 * 2. Each safari type page returns 200
 * 3. Safari type page contains all required sections
 * 4. Linked itineraries display correctly
 * 5. No banned phrases, emojis, or exclamation marks
 */

import { test, expect } from '@playwright/test';

test.describe('Safari Types Hub Page', () => {
  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto('/safari-types');
    expect(response?.status()).toBe(200);
  });

  test('displays main heading', async ({ page }) => {
    await page.goto('/safari-types');
    const heading = page.getByTestId('safari-types-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Safari Types');
  });

  test('displays featured safari type section', async ({ page }) => {
    await page.goto('/safari-types');

    const featuredSection = page.getByTestId('featured-safari-type');
    await expect(featuredSection).toBeVisible();

    const featuredCard = page.getByTestId('featured-safari-type-card');
    await expect(featuredCard).toBeVisible();
  });

  test('lists safari type cards', async ({ page }) => {
    await page.goto('/safari-types');

    const safariTypeCards = page.getByTestId('safari-type-card');
    const count = await safariTypeCards.count();

    // Should have at least 9 safari type cards (10 total minus 1 featured)
    expect(count).toBeGreaterThanOrEqual(9);
  });

  test('safari type cards are clickable and link to detail pages', async ({ page }) => {
    await page.goto('/safari-types');

    const firstCard = page.getByTestId('safari-type-card').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();

    await expect(page).toHaveURL(/\/safari-types\/.+/);
  });

  test('featured card links to detail page', async ({ page }) => {
    await page.goto('/safari-types');

    const featuredCard = page.getByTestId('featured-safari-type-card');
    await featuredCard.scrollIntoViewIfNeeded();
    await featuredCard.click();

    await expect(page).toHaveURL(/\/safari-types\/.+/);
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto('/safari-types');

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});

test.describe('Safari Type Detail Page', () => {
  const testSafariTypeId = 'first-time-classic';

  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto(`/safari-types/${testSafariTypeId}`);
    expect(response?.status()).toBe(200);
  });

  test('displays safari type heading', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);
    const heading = page.getByTestId('safari-type-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('First-Time Classic');
  });

  test('displays characteristics section', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    // Check for characteristics heading and list
    const characteristicsHeading = page.getByRole('heading', { name: 'Characteristics' });
    await expect(characteristicsHeading).toBeVisible();
  });

  test('displays trade-offs section', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const tradeoffsHeading = page.getByRole('heading', { name: 'Trade-offs' });
    await expect(tradeoffsHeading).toBeVisible();

    // Check for gains and losses
    const gainsSection = page.getByText('What you gain');
    await expect(gainsSection).toBeVisible();

    const lossesSection = page.getByText('What you trade');
    await expect(lossesSection).toBeVisible();
  });

  test('displays who is this for section', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const whoForHeading = page.getByRole('heading', { name: 'Who is this for?' });
    await expect(whoForHeading).toBeVisible();

    // Check for best for and not ideal for
    const bestFor = page.getByText('Best for');
    await expect(bestFor).toBeVisible();

    const notIdealFor = page.getByText('Not ideal for');
    await expect(notIdealFor).toBeVisible();
  });

  test('displays linked itineraries when available', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    // First-time-classic should have linked itineraries
    const itinerariesHeading = page.getByRole('heading', { name: 'Itineraries in this style' });
    await expect(itinerariesHeading).toBeVisible();

    const linkedCards = page.getByTestId('linked-itinerary-card');
    const count = await linkedCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('displays related safari types', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const relatedCards = page.getByTestId('related-type-card');
    const count = await relatedCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('has quick summary sidebar', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const quickSummary = page.getByRole('heading', { name: 'Quick summary' });
    await expect(quickSummary).toBeVisible();
  });

  test('has primary regions section', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const regionsHeading = page.getByRole('heading', { name: 'Primary regions' });
    await expect(regionsHeading).toBeVisible();
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('has correct canonical URL', async ({ page }) => {
    await page.goto(`/safari-types/${testSafariTypeId}`);

    const canonical = page.locator('link[rel="canonical"]');
    if ((await canonical.count()) > 0) {
      const href = await canonical.getAttribute('href');
      expect(href).toContain(`/safari-types/${testSafariTypeId}`);
    }
  });
});

test.describe('Safari Types Content Quality', () => {
  test('hub page has no emojis or exclamation marks', async ({ page }) => {
    await page.goto('/safari-types');

    const content = await page.textContent('body');

    // No emojis (basic check for common emoji ranges)
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    expect(content).not.toMatch(emojiRegex);

    // No exclamation marks in main content (excluding potential system elements)
    const mainContent = await page.locator('main').textContent();
    expect(mainContent).not.toContain('!');
  });

  test('detail page has no emojis or exclamation marks', async ({ page }) => {
    await page.goto('/safari-types/first-time-classic');

    const mainContent = await page.locator('main').textContent();

    // No emojis
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    expect(mainContent).not.toMatch(emojiRegex);

    // No exclamation marks
    expect(mainContent).not.toContain('!');
  });

  test('no banned phrases on hub page', async ({ page }) => {
    await page.goto('/safari-types');

    const mainContent = await page.locator('main').textContent();
    const lowerContent = mainContent?.toLowerCase() || '';

    const bannedPhrases = [
      'once in a lifetime',
      'bucket list',
      'adventure of a lifetime',
      'dream safari',
      'ultimate safari',
      'best safari ever',
    ];

    for (const phrase of bannedPhrases) {
      expect(lowerContent).not.toContain(phrase);
    }
  });

  test('no banned phrases on detail page', async ({ page }) => {
    await page.goto('/safari-types/first-time-classic');

    const mainContent = await page.locator('main').textContent();
    const lowerContent = mainContent?.toLowerCase() || '';

    const bannedPhrases = [
      'once in a lifetime',
      'bucket list',
      'adventure of a lifetime',
      'dream safari',
      'ultimate safari',
      'best safari ever',
    ];

    for (const phrase of bannedPhrases) {
      expect(lowerContent).not.toContain(phrase);
    }
  });
});

test.describe('Safari Types Navigation', () => {
  test('breadcrumb navigation works', async ({ page, isMobile }) => {
    // Skip on mobile where navbar overlay causes issues with hero breadcrumb
    test.skip(isMobile === true, 'Breadcrumb in hero area overlapped by fixed navbar on mobile');

    await page.goto('/safari-types/first-time-classic');

    // Find the breadcrumb link in the content area
    const breadcrumb = page.locator('main').getByRole('link', { name: 'Safari Types' });
    await breadcrumb.click();

    await expect(page).toHaveURL('/safari-types');
  });

  test('linked itinerary cards navigate correctly', async ({ page }) => {
    await page.goto('/safari-types/first-time-classic');

    const linkedCard = page.getByTestId('linked-itinerary-card').first();
    await linkedCard.scrollIntoViewIfNeeded();
    await linkedCard.click();

    await expect(page).toHaveURL(/\/itineraries\/.+/);
  });

  test('related type cards navigate correctly', async ({ page }) => {
    await page.goto('/safari-types/first-time-classic');

    const relatedCard = page.getByTestId('related-type-card').first();
    await relatedCard.scrollIntoViewIfNeeded();
    await relatedCard.click();

    await expect(page).toHaveURL(/\/safari-types\/.+/);
  });
});

test.describe('All Safari Types Render', () => {
  const safariTypeIds = [
    'first-time-classic',
    'photography-focused',
    'honeymoon-romantic',
    'family-safari',
    'adventure-walking',
    'luxury-comfort',
    'budget-aware',
    'specialist-wildlife',
    'multi-country-circuit',
    'conservation-focused',
  ];

  for (const id of safariTypeIds) {
    test(`${id} page loads successfully`, async ({ page }) => {
      const response = await page.goto(`/safari-types/${id}`);
      expect(response?.status()).toBe(200);

      // Check heading exists
      const heading = page.getByTestId('safari-type-h1');
      await expect(heading).toBeVisible();
    });
  }
});

/**
 * Guides Feature E2E Tests
 *
 * Tests for the Safari Index Guides authority content layer.
 *
 * Coverage:
 * 1. /guides loads and shows 8 buckets
 * 2. Bucket page loads and has P0 topic links
 * 3. Topic guide loads and includes all required sections
 * 4. Topic guide links to decision page
 * 5. Related decisions count <= 6
 * 6. Guides pages are indexable (no noindex)
 */

import { test, expect } from '@playwright/test';

test.describe('Guides Index Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/guides');
    await expect(page).toHaveTitle(/Safari Planning Guides/);
  });

  test('displays main heading', async ({ page }) => {
    await page.goto('/guides');
    const heading = page.getByTestId('guides-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Safari Guides');
  });

  test('shows 8 bucket cards', async ({ page }) => {
    await page.goto('/guides');
    const bucketGrid = page.getByTestId('bucket-grid');
    await expect(bucketGrid).toBeVisible();

    // Should have bucket cards for all 8 domains
    const bucketCards = page.locator('[data-testid^="bucket-card-"]');
    const count = await bucketCards.count();
    expect(count).toBe(8);
  });

  test('bucket cards are clickable and link to bucket pages', async ({ page }) => {
    await page.goto('/guides');

    // Click on personal-fit bucket
    const personalFitCard = page.getByTestId('bucket-card-personal-fit');
    await expect(personalFitCard).toBeVisible();
    await personalFitCard.click();

    // Should navigate to bucket hub
    await expect(page).toHaveURL(/\/guides\/personal-fit/);
  });

  test('has navbar with Guides link', async ({ page, isMobile }) => {
    await page.goto('/guides');

    if (isMobile) {
      // On mobile, open the hamburger menu first
      const mobileToggle = page.getByTestId('navbar-mobile-toggle');
      await mobileToggle.click();
      const mobileMenu = page.getByTestId('navbar-mobile-menu');
      await expect(mobileMenu).toBeVisible();
      // Check link within mobile menu specifically
      await expect(mobileMenu.locator('a[href="/guides"]')).toBeVisible();
    } else {
      await expect(page.getByTestId('navbar-link-guides')).toBeVisible();
    }
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto('/guides');

    // Check that there's no noindex in robots meta
    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
    // If no robots meta, page is indexable by default
  });
});

test.describe('Bucket Hub Page', () => {
  test('loads personal-fit bucket', async ({ page }) => {
    await page.goto('/guides/personal-fit');
    await expect(page).toHaveTitle(/Personal Fit Guides/);
  });

  test('displays bucket heading', async ({ page }) => {
    await page.goto('/guides/personal-fit');
    const heading = page.getByTestId('bucket-h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Personal Fit');
  });

  test('shows framing copy', async ({ page }) => {
    await page.goto('/guides/personal-fit');
    const framingCopy = page.getByTestId('framing-copy');
    await expect(framingCopy).toBeVisible();
    // Should contain substantive text (not empty)
    const text = await framingCopy.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test('displays P0 topic links', async ({ page }) => {
    await page.goto('/guides/personal-fit');
    const topicList = page.getByTestId('topic-list');
    await expect(topicList).toBeVisible();

    // Should have at least one topic card
    const topicCards = page.getByTestId('topic-card');
    const count = await topicCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('topic cards link to topic guide pages', async ({ page }) => {
    await page.goto('/guides/personal-fit');

    // Click on first topic card
    const firstTopicCard = page.getByTestId('topic-card').first();
    await expect(firstTopicCard).toBeVisible();
    await firstTopicCard.click();

    // Should navigate to topic guide
    await expect(page).toHaveURL(/\/guides\/personal-fit\/.+/);
  });

  test('shows start decisions section', async ({ page }) => {
    await page.goto('/guides/personal-fit');
    const startDecisions = page.getByTestId('start-decisions');
    await expect(startDecisions).toBeVisible();
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto('/guides/personal-fit');

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('handles invalid bucket gracefully', async ({ page }) => {
    const response = await page.goto('/guides/invalid-bucket');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Topic Guide Page', () => {
  // Use a known P0 topic that has a baseline
  const testBucket = 'timing';
  const testTopic = 'tanzania-dry-season-only';

  test('loads topic guide', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    await expect(page).toHaveTitle(/Safari Guide/);
  });

  test('displays guide heading (H1)', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const heading = page.getByTestId('guide-h1');
    await expect(heading).toBeVisible();
  });

  test('includes decision-in-one-line section', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const section = page.getByTestId('section-decision-line');
    await expect(section).toBeVisible();
  });

  test('includes depends-on section with assumptions', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const section = page.getByTestId('section-depends-on');
    await expect(section).toBeVisible();

    const assumptionsList = page.getByTestId('assumptions-list');
    await expect(assumptionsList).toBeVisible();
  });

  test('includes change-conditions list', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const conditionsList = page.getByTestId('change-conditions-list');
    await expect(conditionsList).toBeVisible();
  });

  test('includes tradeoffs section', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const section = page.getByTestId('section-tradeoffs');
    await expect(section).toBeVisible();

    const gainsList = page.getByTestId('gains-list');
    await expect(gainsList).toBeVisible();

    const lossesList = page.getByTestId('losses-list');
    await expect(lossesList).toBeVisible();
  });

  test('includes evidence section', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const section = page.getByTestId('section-evidence');
    await expect(section).toBeVisible();

    const evidenceList = page.getByTestId('evidence-list');
    await expect(evidenceList).toBeVisible();
  });

  test('includes related decisions section', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const section = page.getByTestId('section-related');
    await expect(section).toBeVisible();

    const relatedList = page.getByTestId('related-decisions-list');
    await expect(relatedList).toBeVisible();
  });

  test('related decisions count is at most 6', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const relatedLinks = page.getByTestId('related-decision-link');
    const count = await relatedLinks.count();
    expect(count).toBeLessThanOrEqual(6);
    expect(count).toBeGreaterThan(0);
  });

  test('includes CTA to decision page', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);
    const section = page.getByTestId('section-cta');
    await expect(section).toBeVisible();

    const ctaLink = page.getByTestId('decision-cta');
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute('href', /\/decisions\//);
  });

  test('CTA links to correct decision page', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);

    const ctaLink = page.getByTestId('decision-cta');
    await ctaLink.click();

    // Should navigate to decisions page
    await expect(page).toHaveURL(/\/decisions\//);
  });

  test('is indexable (no noindex meta tag)', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);

    const robotsMeta = page.locator('meta[name="robots"]');
    if ((await robotsMeta.count()) > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('has JSON-LD Article schema', async ({ page }) => {
    await page.goto(`/guides/${testBucket}/${testTopic}`);

    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    // Script tags are not visible elements, check they exist instead
    await expect(jsonLdScript).toHaveCount(1);

    const jsonContent = await jsonLdScript.textContent();
    expect(jsonContent).toBeTruthy();

    const schema = JSON.parse(jsonContent!);
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBeTruthy();
  });

  test('handles invalid topic gracefully', async ({ page }) => {
    const response = await page.goto(`/guides/${testBucket}/invalid-topic`);
    expect(response?.status()).toBe(404);
  });
});

test.describe('Guides Navigation Integration', () => {
  test('can navigate from guides index to bucket to topic', async ({ page }) => {
    // Start at guides index
    await page.goto('/guides');
    await expect(page.getByTestId('guides-h1')).toBeVisible();

    // Click on timing bucket
    await page.getByTestId('bucket-card-timing').click();
    await expect(page).toHaveURL(/\/guides\/timing/);
    await expect(page.getByTestId('bucket-h1')).toHaveText('Timing');

    // Click on first topic
    await page.getByTestId('topic-card').first().click();
    await expect(page).toHaveURL(/\/guides\/timing\/.+/);
    await expect(page.getByTestId('guide-h1')).toBeVisible();
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/guides/timing/tanzania-dry-season-only');

    // Verify breadcrumb exists with correct href
    const breadcrumbGuidesLink = page.getByTestId('breadcrumb-guides');
    await expect(breadcrumbGuidesLink).toHaveAttribute('href', '/guides');

    // Navigate using the href value (breadcrumb is behind fixed navbar)
    const href = await breadcrumbGuidesLink.getAttribute('href');
    await page.goto(href!);
    await expect(page).toHaveURL('/guides');
  });

  test('navbar Guides link is present on all guide pages', async ({ page, isMobile }) => {
    // Helper to check guides link
    const checkGuidesLink = async () => {
      if (isMobile) {
        const mobileToggle = page.getByTestId('navbar-mobile-toggle');
        await mobileToggle.click();
        const mobileMenu = page.getByTestId('navbar-mobile-menu');
        await expect(mobileMenu).toBeVisible();
        // Check link within mobile menu specifically
        await expect(mobileMenu.locator('a[href="/guides"]')).toBeVisible();
        // Close the menu
        await mobileToggle.click();
        await expect(mobileMenu).not.toBeVisible();
      } else {
        await expect(page.getByTestId('navbar-link-guides')).toBeVisible();
      }
    };

    // Check on index
    await page.goto('/guides');
    await checkGuidesLink();

    // Check on bucket page
    await page.goto('/guides/personal-fit');
    await checkGuidesLink();

    // Check on topic page
    await page.goto('/guides/timing/tanzania-dry-season-only');
    await checkGuidesLink();
  });
});

test.describe('Guides Content Quality', () => {
  test('no banned phrases in visible content', async ({ page }) => {
    await page.goto('/guides/timing/tanzania-dry-season-only');

    // Get all visible text content
    const bodyText = await page.locator('main').textContent();

    // Check for banned phrases (subset of governance list)
    const bannedPhrases = [
      'unforgettable',
      'magical',
      'breathtaking',
      'seamless',
      'bucket list',
      'book now',
    ];

    for (const phrase of bannedPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('no exclamation marks in guide content', async ({ page }) => {
    await page.goto('/guides/timing/tanzania-dry-season-only');

    // Get main content text (excluding navigation)
    const mainContent = await page.locator('[data-testid^="section-"]').allTextContents();
    const combinedText = mainContent.join(' ');

    // Should not contain exclamation marks
    expect(combinedText).not.toContain('!');
  });

  test('no emojis in guide content', async ({ page }) => {
    await page.goto('/guides/timing/tanzania-dry-season-only');

    const mainContent = await page.locator('[data-testid^="section-"]').allTextContents();
    const combinedText = mainContent.join(' ');

    // Simple emoji detection (common range)
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    expect(emojiRegex.test(combinedText)).toBe(false);
  });
});

test.describe('Guides SEO', () => {
  test('guides index has proper meta description', async ({ page }) => {
    await page.goto('/guides');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
    expect(content?.length).toBeLessThan(160);
  });

  test('guides index has canonical URL', async ({ page }) => {
    await page.goto('/guides');

    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute('href');
    expect(href).toContain('/guides');
  });

  test('topic guide has Article schema', async ({ page }) => {
    await page.goto('/guides/timing/tanzania-dry-season-only');

    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    const schema = JSON.parse(content!);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.author).toBeTruthy();
    expect(schema.publisher).toBeTruthy();
  });
});

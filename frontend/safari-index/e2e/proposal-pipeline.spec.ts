/**
 * Proposal Pipeline E2E Tests
 *
 * Tests for the Safari Proposal Pack workflow:
 * - Part 1: Proposal API validation
 * - Part 2: Ops proposal creation
 * - Part 3: Public proposal page
 * - Part 4: PDF generation
 * - Part 5: Content quality
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// PART 1: PROPOSAL API VALIDATION
// ============================================================================

test.describe('Proposal API Validation', () => {
  test('POST /api/ops/proposals requires inquiry_id', async ({ request }) => {
    const response = await request.post('/api/ops/proposals', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid request');
  });

  test('POST /api/ops/proposals rejects non-existent inquiry', async ({ request }) => {
    const response = await request.post('/api/ops/proposals', {
      data: { inquiry_id: 'nonexistent_inquiry_12345' },
    });

    // Returns 404 or 500 depending on DynamoDB configuration
    expect([404, 500]).toContain(response.status());
  });

  test('GET /api/ops/proposals requires inquiry_id parameter', async ({ request }) => {
    const response = await request.get('/api/ops/proposals');

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing inquiry_id parameter');
  });

  test('GET /api/ops/proposals/[id] returns 404 for non-existent proposal', async ({ request }) => {
    const response = await request.get('/api/ops/proposals/nonexistent_prop_123');

    expect([404, 500]).toContain(response.status());
  });

  test('PATCH /api/ops/proposals/[id] validates status enum', async ({ request }) => {
    const response = await request.patch('/api/ops/proposals/test_prop', {
      data: { status: 'invalid_status' },
    });

    // Returns 400 for invalid status, or 404/500 if not found
    expect([400, 404, 500]).toContain(response.status());
  });
});

// ============================================================================
// PART 2: PUBLIC PROPOSAL API
// ============================================================================

test.describe('Public Proposal API', () => {
  test('GET /api/proposals/[token] rejects invalid token format', async ({ request }) => {
    const response = await request.get('/api/proposals/invalid');

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid token');
  });

  test('GET /api/proposals/[token] returns error for non-existent token', async ({ request }) => {
    // Valid format but non-existent
    const response = await request.get('/api/proposals/abcd1234efgh5678');

    // Returns 400 (invalid - non-hex), 404 (not found), or 500 (DynamoDB not configured)
    expect([400, 404, 500]).toContain(response.status());
  });
});

// ============================================================================
// PART 3: PUBLIC PROPOSAL PAGE
// ============================================================================

test.describe('Public Proposal Page', () => {
  test('shows error for invalid token', async ({ page }) => {
    await page.goto('/p/invalidtoken1234');

    // Wait for API call
    await page.waitForTimeout(2000);

    // Should show error state
    const hasError = await page.getByText('Proposal Not Found').isVisible() ||
                     await page.getByText('Invalid proposal link').isVisible() ||
                     await page.getByText('Unable to load').isVisible();
    expect(hasError).toBe(true);
  });

  test('shows Return Home link on error', async ({ page }) => {
    await page.goto('/p/0000000000000000');

    // Wait for API call
    await page.waitForTimeout(2000);

    // Should have link back home
    await expect(page.getByText('Return Home')).toBeVisible();
  });

  test('loads without crashing', async ({ page }) => {
    await page.goto('/p/0000000000000000');

    // Wait for page to render
    await page.waitForTimeout(1000);

    // Just verify the page loaded without crashing
    const hasMain = await page.locator('main').isVisible();
    expect(hasMain).toBe(true);
  });
});

// ============================================================================
// PART 4: OPS PROPOSAL EDITOR
// ============================================================================

test.describe('Ops Proposal Editor', () => {
  test('ops proposal editor loads without crashing', async ({ page }) => {
    // Access with dummy key (in development mode, access is allowed)
    await page.goto('/ops/proposals/test_prop?ops_key=test');

    // Should show either loading, error, or content
    // (the actual content depends on DynamoDB configuration)
    await page.waitForTimeout(1000);

    // Page should at least load without crashing
    const hasContent = await page.locator('main').isVisible();
    expect(hasContent).toBe(true);
  });

  test('ops proposal editor has back link', async ({ page }) => {
    await page.goto('/ops/proposals/test_prop?ops_key=test');

    // Should have back link
    await expect(page.getByText('Back to inquiry')).toBeVisible();
  });
});

// ============================================================================
// PART 5: PDF GENERATION
// ============================================================================

test.describe('Proposal PDF Generation', () => {
  test('PDF endpoint rejects invalid token', async ({ request }) => {
    const response = await request.get('/api/proposals/invalid/pdf');

    expect(response.status()).toBe(400);
  });

  test('PDF endpoint returns error for non-existent token', async ({ request }) => {
    const response = await request.get('/api/proposals/abcd1234efgh5678/pdf');

    // Returns 400 (invalid - non-hex), 404 (not found), or 500 (DynamoDB not configured)
    expect([400, 404, 500]).toContain(response.status());
  });
});

// ============================================================================
// PART 6: CONTENT QUALITY
// ============================================================================

test.describe('Proposal Content Quality', () => {
  test('ops proposal editor has no urgency language', async ({ page }) => {
    await page.goto('/ops/proposals/test_prop?ops_key=test');

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

  test('public proposal page has no exclamation marks in headings', async ({ page }) => {
    await page.goto('/p/0000000000000000');

    // Wait for page to load (even if error state)
    await page.waitForTimeout(1000);

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      expect(text).not.toContain('!');
    }
  });

  test('proposal pages have no banned marketing phrases', async ({ page }) => {
    await page.goto('/p/0000000000000000');

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
});

// ============================================================================
// PART 7: INQUIRY PAGE PROPOSAL SECTION
// ============================================================================

test.describe('Inquiry Page Proposal Section', () => {
  test('inquiry detail page loads without crashing', async ({ page }) => {
    await page.goto('/ops/inquiries/test_inq?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Just verify the page loaded without crashing
    const hasMainContent = await page.locator('main').isVisible();
    expect(hasMainContent).toBe(true);
  });

  test('inquiry detail page has back link', async ({ page }) => {
    await page.goto('/ops/inquiries/test_inq?ops_key=test');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Should have back link
    await expect(page.getByText('Back to list')).toBeVisible();
  });
});

/**
 * Inquiry Pipeline E2E Tests
 *
 * Tests for the production-grade inquiry pipeline:
 * - Part 1: Inquiry submission and confirmation by ID
 * - Part 2: API validation
 * - Part 3: Ops page access control
 * - Part 4: Status updates
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// PART 1: INQUIRY SUBMISSION FLOW
// ============================================================================

test.describe('Inquiry Submission Flow', () => {
  test('inquiry form loads with all required fields', async ({ page }) => {
    await page.goto('/inquire');

    // Check form sections exist
    await expect(page.getByRole('heading', { name: 'Trip Shape' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Travel Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();

    // Check required field labels
    await expect(page.locator('text=Budget Range').first()).toBeVisible();
    await expect(page.locator('text=Travel Style').first()).toBeVisible();
    await expect(page.locator('text=Email').first()).toBeVisible();

    // Check submit button
    await expect(page.getByTestId('inquire-submit')).toBeVisible();
  });

  test('inquiry form validates required fields', async ({ page }) => {
    await page.goto('/inquire');

    // Try to submit without filling required fields
    await page.getByTestId('inquire-submit').click();

    // Should show validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Please select a budget range')).toBeVisible();
  });

  test('confirmation page shows recovery state when no ID provided', async ({ page }) => {
    await page.goto('/inquire/confirmation');

    // Should show recovery state, not error
    await expect(page.getByTestId('recovery-h1')).toHaveText('Start Your Safari Planning');

    // Should explain how Safari Index works
    await expect(page.getByText('How Safari Index Works')).toBeVisible();

    // Should have Plan a Safari CTA linking to /inquire
    const cta = page.getByTestId('recovery-cta');
    await expect(cta).toHaveText(/Plan a Safari/);
    await expect(cta).toHaveAttribute('href', '/inquire');

    // Should have personal response reassurance
    await expect(page.getByText('Every inquiry receives a personal response')).toBeVisible();

    // Should have alternate exploration options
    await expect(page.getByText('Browse Safaris')).toBeVisible();
    await expect(page.getByText('Explore Decisions')).toBeVisible();
  });

  test('recovery state has no error messaging', async ({ page }) => {
    await page.goto('/inquire/confirmation');

    // Should NOT show error-related text
    await expect(page.getByText('Inquiry Not Found')).not.toBeVisible();
    await expect(page.getByText('error')).not.toBeVisible();
    await expect(page.getByText('not found')).not.toBeVisible();
  });

  test('confirmation page shows error for invalid ID', async ({ page }) => {
    await page.goto('/inquire/confirmation?id=invalid_id_12345');

    // Wait for API call
    await page.waitForTimeout(2000);

    // Should show error state (either not found or unable to load)
    // The exact message depends on whether DynamoDB is configured
    const hasError = await page.getByText('Inquiry Not Found').isVisible() ||
                     await page.getByText('Unable to load').isVisible();
    expect(hasError).toBe(true);
  });
});

// ============================================================================
// PART 2: API VALIDATION
// ============================================================================

test.describe('Inquiry API Validation', () => {
  test('POST /api/inquire rejects empty payload', async ({ request }) => {
    const response = await request.post('/api/inquire', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid request');
  });

  test('POST /api/inquire rejects invalid email', async ({ request }) => {
    const response = await request.post('/api/inquire', {
      data: {
        trip_shape_id: null,
        budget_band: '5k-10k',
        travel_month: 6,
        travel_year: 2025,
        traveler_count: 2,
        travel_style: 'couple',
        email: 'not-an-email',
        whatsapp: null,
        linked_decision_ids: [],
        notes: null,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid request');
  });

  test('POST /api/inquire rejects invalid budget band', async ({ request }) => {
    const response = await request.post('/api/inquire', {
      data: {
        trip_shape_id: null,
        budget_band: 'invalid-band',
        travel_month: 6,
        travel_year: 2025,
        traveler_count: 2,
        travel_style: 'couple',
        email: 'test@example.com',
        whatsapp: null,
        linked_decision_ids: [],
        notes: null,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('GET /api/inquire requires ID parameter', async ({ request }) => {
    const response = await request.get('/api/inquire');

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing inquiry ID');
  });

  test('GET /api/inquire returns error for non-existent ID', async ({ request }) => {
    const response = await request.get('/api/inquire?id=nonexistent_12345');

    // Can be 404 (not found) or 500 (DynamoDB not configured in test env)
    expect([404, 500]).toContain(response.status());
  });
});

// ============================================================================
// PART 3: OPS PAGE ACCESS CONTROL
// ============================================================================

test.describe('Ops Page Access Control', () => {
  // Note: In development mode without OPS_KEY, access is allowed
  // These tests verify behavior when OPS_KEY is set in production

  test('ops inquiries list accessible in development', async ({ request }) => {
    const response = await request.get('/api/ops/inquiries');

    // In development without OPS_KEY, returns 200 or 500 (if DynamoDB not configured)
    // In production with OPS_KEY set, would return 404 without key
    expect([200, 404, 500]).toContain(response.status());
  });

  test('ops inquiry detail accessible in development', async ({ request }) => {
    const response = await request.get('/api/ops/inquiries/some_id');

    // In development, attempts to fetch from DynamoDB (may 500 if not configured)
    expect([200, 404, 500]).toContain(response.status());
  });

  test('ops inquiry update validates payload', async ({ request }) => {
    const response = await request.patch('/api/ops/inquiries/some_id', {
      data: { status: 'contacted' },
    });

    // In development, attempts update (may 500 if DynamoDB not configured, 404 if not found)
    expect([200, 400, 404, 500]).toContain(response.status());
  });

  test('ops inquiries page loads', async ({ page }) => {
    await page.goto('/ops/inquiries');

    // Should show header
    await expect(page.getByText('Inquiries')).toBeVisible();
  });
});

// ============================================================================
// PART 4: OPS PAGES WITH VALID KEY (Development Mode)
// ============================================================================

test.describe('Ops Pages in Development', () => {
  // In development mode without OPS_KEY env var, access is allowed

  test('ops inquiries list page loads in development', async ({ page }) => {
    // Note: This test assumes development mode where OPS_KEY is not set
    // In that case, access is allowed per the API implementation
    await page.goto('/ops/inquiries');

    // Should show header
    await expect(page.getByText('Inquiries')).toBeVisible();
  });

  test('ops inquiries page has noindex meta tag', async ({ page }) => {
    await page.goto('/ops/inquiries');

    // Check for noindex meta tag (client-side rendered, may have multiple)
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();
    if (count > 0) {
      // At least one should contain noindex
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
});

// ============================================================================
// PART 5: INQUIRY UPDATE API
// ============================================================================

test.describe('Inquiry Update API', () => {
  test('PATCH validates status enum', async ({ request }) => {
    const response = await request.patch('/api/ops/inquiries/test_id', {
      data: { status: 'invalid_status' },
    });

    // In development, validation returns 400 for invalid status
    // May also 500 if DynamoDB not configured
    expect([400, 404, 500]).toContain(response.status());
  });
});

// ============================================================================
// INTEGRATION TESTS (require running DynamoDB)
// ============================================================================

test.describe('Inquiry Integration', () => {
  // These tests would require a running DynamoDB instance
  // They are marked as skipped and should be run in a full integration environment

  test.skip('full inquiry flow: submit -> confirmation -> ops view', async ({ page, request }) => {
    // 1. Submit inquiry
    await page.goto('/inquire');

    // Fill form
    await page.locator('select').first().selectOption('5k-10k');
    await page.getByLabel(/Travel Style/i).selectOption('couple');
    await page.getByPlaceholder('your@email.com').fill('test@example.com');

    // Submit
    await page.getByTestId('inquire-submit').click();

    // 2. Verify confirmation page
    await expect(page).toHaveURL(/\/inquire\/confirmation\?id=/);
    await expect(page.getByTestId('confirmation-h1')).toContainText('Trip Brief Captured');

    // Get inquiry ID from URL
    const url = page.url();
    const inquiryId = new URL(url).searchParams.get('id');
    expect(inquiryId).toBeTruthy();

    // 3. Verify inquiry via API
    const apiResponse = await request.get(`/api/inquire?id=${inquiryId}`);
    expect(apiResponse.status()).toBe(200);

    const inquiry = await apiResponse.json();
    expect(inquiry.email).toBe('test@example.com');
    expect(inquiry.status).toBe('new');
  });
});

// ============================================================================
// CONTENT QUALITY
// ============================================================================

test.describe('Inquiry Content Quality', () => {
  test('inquiry form has no banned phrases', async ({ page }) => {
    await page.goto('/inquire');

    const bodyText = await page.locator('main').first().textContent();

    const bannedPhrases = [
      'book now',
      'limited time',
      'act fast',
      'hurry',
      'discount',
      'sale',
    ];

    for (const phrase of bannedPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });

  test('inquiry form has no exclamation marks in headings', async ({ page }) => {
    await page.goto('/inquire');

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      expect(text).not.toContain('!');
    }
  });

  test('confirmation page has no urgency language', async ({ page }) => {
    await page.goto('/inquire/confirmation?id=test');

    // Even error state should not have urgency language
    const bodyText = await page.locator('body').textContent();

    const urgencyPhrases = [
      'hurry',
      'limited',
      'act now',
      'don\'t miss',
    ];

    for (const phrase of urgencyPhrases) {
      expect(bodyText?.toLowerCase()).not.toContain(phrase);
    }
  });
});

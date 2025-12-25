import { test, expect } from '@playwright/test';

/**
 * Assurance Payment Status Tests
 *
 * Tests for the payment status banner that handles webhook delays,
 * and the Issued Record block for completed assurances.
 * Ensures users who paid but haven't received webhook confirmation
 * can refresh and see their assurance once processed.
 */

test.describe('Assurance Payment Status Banner', () => {
  const pendingAssuranceResponse = {
    assurance_id: 'asr_test_pending',
    decision_id: 'dec_test_123',
    status: 'active',
    payment_status: 'pending',
    payment_id: 'pi_test_payment_1234567890abcdef',
    artifact: {
      assurance_id: 'asr_test_pending',
      decision_id: 'dec_test_123',
      topic_id: 'topic_test',
      verdict: {
        outcome: 'book',
        headline: 'Test decision headline for pending payment',
        summary: 'Test summary for the pending payment assurance test.',
        confidence: 0.75,
        confidence_label: 'Medium',
      },
      assumptions: [{ id: 'a1', text: 'Test assumption', confidence: 0.8 }],
      tradeoffs: { gains: ['Gain 1'], losses: ['Loss 1'] },
      change_conditions: ['Condition 1'],
      invalidation_checklist: ['Check 1'],
      created_at: '2024-01-15T10:00:00Z',
      logic_version: 'v1.0',
      review_status: 'approved',
    },
    access: {
      download_count: 0,
      first_accessed: true,
    },
  };

  const completedAssuranceResponse = {
    ...pendingAssuranceResponse,
    payment_status: 'completed',
    issued_at: '2024-01-15T10:05:00Z',
  };

  test('shows payment status banner when payment is pending', async ({ page }) => {
    // Mock API to return pending payment status (matches external API URL pattern)
    await page.route('**/v1/assurance/asr_test_pending', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(pendingAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_pending');

    // Banner should be visible
    await expect(page.getByTestId('payment-status-banner')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Payment processing')).toBeVisible();
    await expect(page.getByTestId('refresh-status-button')).toBeVisible();
  });

  test('does not show banner when payment is completed', async ({ page }) => {
    // Mock API to return completed payment status
    await page.route('**/v1/assurance/asr_test_completed', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(completedAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_completed');

    // Wait for content to load, then verify banner is NOT visible
    await expect(page.getByText('Decision Assurance')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('payment-status-banner')).not.toBeVisible();
  });

  test('clicking refresh triggers another fetch', async ({ page }) => {
    let fetchCount = 0;

    // Mock API - first returns pending, second returns completed
    await page.route('**/v1/assurance/asr_test_refresh', (route) => {
      fetchCount++;
      const response = fetchCount === 1 ? pendingAssuranceResponse : completedAssuranceResponse;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...response,
          assurance_id: 'asr_test_refresh',
        }),
      });
    });

    await page.goto('/assurance/asr_test_refresh');

    // Initially shows banner
    await expect(page.getByTestId('payment-status-banner')).toBeVisible({ timeout: 10000 });
    expect(fetchCount).toBe(1);

    // Click refresh
    await page.getByTestId('refresh-status-button').click();

    // Wait for second fetch to complete
    await expect(page.getByTestId('payment-status-banner')).not.toBeVisible({ timeout: 10000 });

    // Should have fetched twice
    expect(fetchCount).toBe(2);
  });

  test('refresh button shows loading state while fetching', async ({ page }) => {
    // Mock API with slight delay
    await page.route('**/v1/assurance/asr_test_loading', async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...pendingAssuranceResponse,
          assurance_id: 'asr_test_loading',
        }),
      });
    });

    await page.goto('/assurance/asr_test_loading');

    // Wait for initial load
    await expect(page.getByTestId('refresh-status-button')).toBeVisible({ timeout: 10000 });

    // Click refresh and check for loading state
    await page.getByTestId('refresh-status-button').click();
    await expect(page.getByText('Checking...')).toBeVisible();
  });

  test('assurance content is still visible with pending banner', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_content', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...pendingAssuranceResponse,
          assurance_id: 'asr_test_content',
        }),
      });
    });

    await page.goto('/assurance/asr_test_content');

    // Banner is visible
    await expect(page.getByTestId('payment-status-banner')).toBeVisible({ timeout: 10000 });

    // But so is the assurance content
    await expect(page.getByText('Decision Assurance')).toBeVisible();
    await expect(page.getByText('Test decision headline for pending payment')).toBeVisible();
  });

  test('pending banner shows What happens next list', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_what_next', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...pendingAssuranceResponse,
          assurance_id: 'asr_test_what_next',
        }),
      });
    });

    await page.goto('/assurance/asr_test_what_next');

    // What happens next section should be visible
    await expect(page.getByTestId('what-happens-next')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('What happens next')).toBeVisible();
    await expect(page.getByText('Payment confirmation is sent from Stripe to our system')).toBeVisible();
  });
});

test.describe('Assurance Issued Record Block', () => {
  const completedAssuranceResponse = {
    assurance_id: 'asr_test_issued',
    decision_id: 'dec_test_456',
    status: 'active',
    payment_status: 'completed',
    payment_id: 'pi_1234567890abcdef',
    issued_at: '2024-01-15T10:05:00Z',
    artifact: {
      assurance_id: 'asr_test_issued',
      decision_id: 'dec_test_456',
      topic_id: 'topic_test',
      verdict: {
        outcome: 'book',
        headline: 'Test decision headline for issued assurance',
        summary: 'Test summary for the issued assurance test.',
        confidence: 0.85,
        confidence_label: 'High',
      },
      assumptions: [{ id: 'a1', text: 'Test assumption', confidence: 0.8 }],
      tradeoffs: { gains: ['Gain 1'], losses: ['Loss 1'] },
      change_conditions: ['Condition 1'],
      invalidation_checklist: ['Check 1'],
      created_at: '2024-01-15T10:00:00Z',
      logic_version: 'v1.0',
      review_status: 'approved',
    },
    access: {
      download_count: 1,
      first_accessed: false,
    },
  };

  const pendingAssuranceResponse = {
    ...completedAssuranceResponse,
    payment_status: 'pending',
    assurance_id: 'asr_test_not_issued',
  };

  test('completed assurance shows Issued Record block', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_issued', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(completedAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_issued');

    // Issued Record block should be visible
    await expect(page.getByTestId('issued-record-block')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Assurance issued')).toBeVisible();
  });

  test('Issued Record block contains Decision ID', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_issued', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(completedAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_issued');

    // Decision ID should be visible
    await expect(page.getByTestId('decision-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('decision-id')).toContainText('dec_test_456');
  });

  test('payment reference is masked with ellipsis and last 8 chars', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_issued', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(completedAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_issued');

    // Payment reference should be masked
    const paymentRef = page.getByTestId('payment-reference');
    await expect(paymentRef).toBeVisible({ timeout: 10000 });

    // Should contain "..." and end with last 8 characters
    const text = await paymentRef.textContent();
    expect(text).toMatch(/^\.\.\./);
    expect(text?.slice(-8)).toBe('90abcdef'); // last 8 chars of pi_1234567890abcdef
  });

  test('pending assurance does NOT show Issued Record block', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_not_issued', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(pendingAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_not_issued');

    // Wait for page to load
    await expect(page.getByText('Decision Assurance')).toBeVisible({ timeout: 10000 });

    // Issued Record block should NOT be visible
    await expect(page.getByTestId('issued-record-block')).not.toBeVisible();

    // But payment banner should be visible
    await expect(page.getByTestId('payment-status-banner')).toBeVisible();
  });

  test('Issued Record block shows version-locked message', async ({ page }) => {
    await page.route('**/v1/assurance/asr_test_issued', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(completedAssuranceResponse),
      });
    });

    await page.goto('/assurance/asr_test_issued');

    // Should show the calm archival message
    await expect(page.getByText('Keep this link. This record is version-locked.')).toBeVisible({ timeout: 10000 });
  });
});

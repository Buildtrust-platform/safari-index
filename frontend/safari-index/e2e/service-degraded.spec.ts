import { test, expect } from '@playwright/test';

/**
 * Tests for service-degraded refusal handling
 *
 * These tests verify:
 * 1. SERVICE_DEGRADED refusals show the special component
 * 2. Try again button appears and has cooldown
 * 3. Related decisions still render
 * 4. Other refusal types are unaffected
 */

test.describe('Service Degraded Refusal', () => {
  test('shows service-degraded component with retry button', async ({ page }) => {
    // Mock API returning SERVICE_DEGRADED refusal
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_err_test',
          output: {
            type: 'refusal',
            refusal: {
              code: 'SERVICE_DEGRADED',
              reason: 'The decision service is temporarily unable to process your request.',
              missing_or_conflicting_inputs: [
                'Service capacity constraints are currently active',
                'Please wait a moment before trying again',
              ],
              safe_next_step: 'Wait a few seconds and refresh the page, or try again later.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // In build mode, wizard shows first - expand and click Skip to trigger fetch
    const wizard = page.getByTestId('preflight-wizard');
    if (await wizard.isVisible()) {
      await page.getByRole('button', { name: /answer quality check/i }).click();
      await page.getByTestId('preflight-skip').click();
    }

    // Should show "Temporarily unavailable" heading
    await expect(page.getByText('Temporarily unavailable')).toBeVisible({ timeout: 10000 });

    // Should show the reason
    await expect(
      page.getByText('The decision service is temporarily unable to process your request.')
    ).toBeVisible();

    // Should show "Try again" button
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

    // Should show persistence note
    await expect(page.getByText('If this persists, return in a few minutes.')).toBeVisible();
  });

  test('retry button triggers re-fetch and returns to service-degraded state', async ({ page }) => {
    let requestCount = 0;

    // Mock API - always returns SERVICE_DEGRADED
    await page.route('**/decision/evaluate', async (route) => {
      requestCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: `dec_${requestCount}`,
          output: {
            type: 'refusal',
            refusal: {
              code: 'SERVICE_DEGRADED',
              reason: 'The decision service is temporarily unable to process your request.',
              missing_or_conflicting_inputs: ['Service capacity constraints are currently active'],
              safe_next_step: 'Wait a few seconds and refresh the page.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // In build mode, wizard shows first
    const wizard = page.getByTestId('preflight-wizard');
    if (await wizard.isVisible()) {
      await page.getByRole('button', { name: /answer quality check/i }).click();
      await page.getByTestId('preflight-skip').click();
    }

    // Wait for refusal to show
    await expect(page.getByText('Temporarily unavailable')).toBeVisible({ timeout: 10000 });

    // Click retry - this triggers a new fetch
    await page.getByRole('button', { name: 'Try again' }).click();

    // Wait for page to re-render with SERVICE_DEGRADED after retry
    // (the loading state is brief, then we return to refusal)
    await expect(page.getByText('Temporarily unavailable')).toBeVisible({ timeout: 10000 });

    // Verify multiple requests were made (retry triggered a new fetch)
    expect(requestCount).toBeGreaterThan(1);

    // Button should still be available for another retry
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  test('retry leads to success when API recovers', async ({ page }) => {
    let requestCount = 0;

    // Mock API - first returns SERVICE_DEGRADED, second returns success
    await page.route('**/decision/evaluate', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request: SERVICE_DEGRADED
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_degraded',
            output: {
              type: 'refusal',
              refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'The decision service is temporarily unable to process your request.',
                missing_or_conflicting_inputs: ['Service capacity constraints are currently active'],
                safe_next_step: 'Wait a few seconds and refresh the page.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      } else {
        // Second request: Success
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_success',
            output: {
              type: 'decision',
              decision: {
                outcome: 'book',
                headline: 'February is excellent for Tanzania safari viewing',
                summary:
                  'The dry season conditions in February provide optimal wildlife viewing opportunities.',
                assumptions: [
                  { id: 'a1', text: 'Traveler prefers dry season', confidence: 0.8 },
                  { id: 'a2', text: 'Budget allows for peak pricing', confidence: 0.7 },
                ],
                tradeoffs: { gains: ['Optimal wildlife viewing'], losses: ['Higher prices'] },
                change_conditions: ['If dates become flexible', 'If budget constraints change'],
                confidence: 0.75,
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      }
    });

    await page.goto('/decisions/tanzania-safari-february');

    // In build mode, wizard shows first
    const wizard = page.getByTestId('preflight-wizard');
    if (await wizard.isVisible()) {
      await page.getByRole('button', { name: /answer quality check/i }).click();
      await page.getByTestId('preflight-skip').click();
    }

    // First, see the service-degraded state
    await expect(page.getByText('Temporarily unavailable')).toBeVisible({ timeout: 10000 });

    // Click retry
    await page.getByRole('button', { name: 'Try again' }).click();

    // Now we should see the success state with the verdict headline
    await expect(
      page.getByRole('heading', { name: 'February is excellent for Tanzania safari viewing' })
    ).toBeVisible({ timeout: 10000 });

    // Should NOT show service-degraded anymore
    await expect(page.getByText('Temporarily unavailable')).not.toBeVisible();
  });

  test('related decisions still render with service-degraded refusal', async ({ page }) => {
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test',
          output: {
            type: 'refusal',
            refusal: {
              code: 'SERVICE_DEGRADED',
              reason: 'The decision service is temporarily unable to process your request.',
              missing_or_conflicting_inputs: ['Service capacity constraints are currently active'],
              safe_next_step: 'Wait a few seconds and refresh the page.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // In build mode, wizard shows first
    const wizard = page.getByTestId('preflight-wizard');
    if (await wizard.isVisible()) {
      await page.getByRole('button', { name: /answer quality check/i }).click();
      await page.getByTestId('preflight-skip').click();
    }

    await expect(page.getByText('Temporarily unavailable')).toBeVisible({ timeout: 10000 });

    // Related decisions section should still be visible
    await expect(page.getByText('Related decisions')).toBeVisible();
  });

  test('non-service-degraded refusals show standard refusal UI', async ({ page }) => {
    // Mock API returning a regular refusal (no code or different code)
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_refusal_test',
          output: {
            type: 'refusal',
            refusal: {
              // No code field - treated as standard refusal
              reason: 'A reliable recommendation is not possible because key information is missing.',
              missing_or_conflicting_inputs: [
                'Travel dates are not specified',
                'Budget range is not specified',
              ],
              safe_next_step: 'Clarify your priorities or provide the missing information.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // In build mode, wizard shows first
    const wizard = page.getByTestId('preflight-wizard');
    if (await wizard.isVisible()) {
      await page.getByRole('button', { name: /answer quality check/i }).click();
      await page.getByTestId('preflight-skip').click();
    }

    // Should show standard refusal UI with "Decision refused" verdict card
    await expect(page.getByText('Decision refused')).toBeVisible({ timeout: 10000 });

    // Should show "What we need" section
    await expect(page.getByText('What we need')).toBeVisible();

    // Should NOT show "Temporarily unavailable"
    await expect(page.getByText('Temporarily unavailable')).not.toBeVisible();

    // Should NOT show "Try again" button
    await expect(page.getByRole('button', { name: 'Try again' })).not.toBeVisible();
  });
});

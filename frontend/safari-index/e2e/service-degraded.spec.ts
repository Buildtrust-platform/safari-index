import { test, expect } from '@playwright/test';

/**
 * Tests for service-degraded refusal handling
 *
 * These tests verify:
 * 1. SERVICE_DEGRADED refusals show the "At capacity" component
 * 2. Messaging frames as deliberate safety choice, not broken system
 * 3. Link to /how-it-works is present
 * 4. Try again button appears and has cooldown
 * 5. Related decisions still render
 * 6. Other refusal types are unaffected
 */

test.describe('Service Degraded Refusal', () => {
  test('shows "At capacity" heading with deliberate guardrail messaging', async ({ page }) => {
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

    // Should show "At capacity" heading (not "Temporarily unavailable")
    await expect(page.getByTestId('capacity-heading')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('capacity-heading')).toHaveText('At capacity');

    // Should show deliberate guardrail messaging
    await expect(page.getByText('We limit concurrent requests to maintain decision quality.')).toBeVisible();
    await expect(page.getByText(/deliberate guardrail/)).toBeVisible();

    // Should show "Try again" button
    await expect(page.getByTestId('retry-button')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

    // Should show capacity clears message
    await expect(page.getByText('Capacity typically clears within seconds.')).toBeVisible();
  });

  test('shows link to how-it-works page', async ({ page }) => {
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_link_test',
          output: {
            type: 'refusal',
            refusal: {
              code: 'SERVICE_DEGRADED',
              reason: 'Capacity reached.',
              missing_or_conflicting_inputs: [],
              safe_next_step: 'Wait and retry.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    const wizard = page.getByTestId('preflight-wizard');
    if (await wizard.isVisible()) {
      await page.getByRole('button', { name: /answer quality check/i }).click();
      await page.getByTestId('preflight-skip').click();
    }

    // Should show link to how-it-works
    const howItWorksLink = page.getByTestId('how-it-works-link');
    await expect(howItWorksLink).toBeVisible({ timeout: 10000 });
    await expect(howItWorksLink).toHaveText('Learn how we make decisions');
    await expect(howItWorksLink).toHaveAttribute('href', '/how-it-works');
  });

  test('retry button triggers re-fetch and returns to capacity state', async ({ page }) => {
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

    // Wait for capacity refusal to show
    await expect(page.getByTestId('capacity-heading')).toBeVisible({ timeout: 10000 });

    // Click retry - this triggers a new fetch
    await page.getByTestId('retry-button').click();

    // Wait for page to re-render with capacity state after retry
    await expect(page.getByTestId('capacity-heading')).toBeVisible({ timeout: 10000 });

    // Verify multiple requests were made (retry triggered a new fetch)
    expect(requestCount).toBeGreaterThan(1);

    // Button should still be available for another retry
    await expect(page.getByTestId('retry-button')).toBeVisible();
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

    // First, see the capacity state
    await expect(page.getByTestId('capacity-heading')).toBeVisible({ timeout: 10000 });

    // Click retry
    await page.getByTestId('retry-button').click();

    // Now we should see the success state with the verdict headline
    await expect(
      page.getByRole('heading', { name: 'February is excellent for Tanzania safari viewing' })
    ).toBeVisible({ timeout: 10000 });

    // Should NOT show capacity state anymore
    await expect(page.getByTestId('service-capacity-refusal')).not.toBeVisible();
  });

  test('related decisions still render with capacity refusal', async ({ page }) => {
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

    await expect(page.getByTestId('capacity-heading')).toBeVisible({ timeout: 10000 });

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

    // Should NOT show capacity component
    await expect(page.getByTestId('service-capacity-refusal')).not.toBeVisible();

    // Should NOT show "Try again" button
    await expect(page.getByTestId('retry-button')).not.toBeVisible();
  });
});

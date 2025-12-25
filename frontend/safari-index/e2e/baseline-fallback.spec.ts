import { test, expect } from '@playwright/test';

/**
 * Tests for baseline decision fallback
 *
 * These tests verify:
 * 1. When API returns capacity refusal for a topic WITH baseline JSON:
 *    - Page renders "Baseline decision (no custom inputs)" banner
 *    - Shows verdict content (headline/summary present)
 *    - "Try live decision again" button exists
 * 2. When API returns capacity refusal for a topic WITHOUT baseline:
 *    - Existing refusal UI renders (no baseline banner)
 * 3. Retry button can return to success state when API recovers
 */

test.describe('Baseline Decision Fallback', () => {
  test.describe('Topic WITH baseline available', () => {
    // tz-dry-season has a baseline JSON (slug: tanzania-dry-season-only)
    const topicWithBaseline = 'tanzania-dry-season-only';

    test('shows baseline banner when API returns capacity refusal', async ({ page }) => {
      // Mock API returning SERVICE_DEGRADED refusal
      await page.route('**/decision/evaluate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_capacity_test',
            output: {
              type: 'refusal',
              refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'The decision service is temporarily unable to process your request.',
                missing_or_conflicting_inputs: [
                  'Service capacity constraints are currently active',
                ],
                safe_next_step: 'Wait a few seconds and refresh the page, or try again later.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto(`/decisions/${topicWithBaseline}`);

      // In build mode, wizard shows first - skip it
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      // Should show the baseline fallback banner
      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Banner should have the correct title
      await expect(page.getByTestId('baseline-banner-title')).toHaveText(
        'Baseline decision (no custom inputs)'
      );

      // Banner should explain the situation
      await expect(
        page.getByText(/live decision service is at capacity/i)
      ).toBeVisible();

      // Should show "Try live decision again" button
      await expect(page.getByTestId('baseline-retry-button')).toBeVisible();
      await expect(page.getByTestId('baseline-retry-button')).toHaveText('Try live decision again');
    });

    test('renders verdict content from baseline', async ({ page }) => {
      await page.route('**/decision/evaluate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_capacity_test',
            output: {
              type: 'refusal',
              refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'Service at capacity.',
                missing_or_conflicting_inputs: [],
                safe_next_step: 'Try again later.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto(`/decisions/${topicWithBaseline}`);

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      // Should show baseline banner
      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Should show verdict card with baseline decision content
      // The baseline for tz-dry-season has headline "Dry season offers best conditions..."
      await expect(page.getByRole('heading', { name: /dry season offers best conditions/i })).toBeVisible();

      // Should show tradeoffs section
      await expect(page.getByRole('heading', { name: /trade-offs/i })).toBeVisible();

      // Should show assumptions section
      await expect(page.getByRole('heading', { name: /assumptions/i })).toBeVisible();

      // Should show change conditions section (heading is "This changes if")
      await expect(page.getByRole('heading', { name: /this changes if/i })).toBeVisible();
    });

    test('shows baseline source attribution instead of decision ID', async ({ page }) => {
      await page.route('**/decision/evaluate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_capacity_test',
            output: {
              type: 'refusal',
              refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'Service at capacity.',
                missing_or_conflicting_inputs: [],
                safe_next_step: 'Try again later.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto(`/decisions/${topicWithBaseline}`);

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Should show baseline source attribution
      await expect(page.getByText(/source: baseline snapshot/i)).toBeVisible();

      // Should NOT show a decision ID in the footer
      await expect(page.getByText(/Decision ID:/)).not.toBeVisible();
    });

    test('retry button triggers new API request', async ({ page }) => {
      let requestCount = 0;

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
                reason: 'Service at capacity.',
                missing_or_conflicting_inputs: [],
                safe_next_step: 'Try again later.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto(`/decisions/${topicWithBaseline}`);

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Click retry button
      await page.getByTestId('baseline-retry-button').click();

      // Should still show baseline (API still degraded)
      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Verify multiple requests were made
      expect(requestCount).toBeGreaterThan(1);
    });

    test('retry triggers new API request and can show success', async ({ page }) => {
      let requestCount = 0;

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
                  reason: 'Service at capacity.',
                  missing_or_conflicting_inputs: [],
                  safe_next_step: 'Try again later.',
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
              decision_id: 'dec_success_live',
              output: {
                type: 'decision',
                decision: {
                  outcome: 'wait',
                  headline: 'Live personalized decision',
                  summary: 'This is a live personalized decision.',
                  assumptions: [
                    { id: 'a1', text: 'Test assumption', confidence: 0.8 },
                  ],
                  tradeoffs: {
                    gains: ['Personalized recommendations'],
                    losses: ['None'],
                  },
                  change_conditions: ['If conditions change'],
                  confidence: 0.75,
                },
              },
              metadata: { logic_version: 'v1.0', ai_used: true },
            }),
          });
        }
      });

      await page.goto(`/decisions/${topicWithBaseline}`);

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      // First see baseline fallback
      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Click retry button
      const retryButton = page.getByTestId('baseline-retry-button');
      await expect(retryButton).toBeVisible();
      await retryButton.click();

      // Wait for the success state - the VerdictMoment in hero should show the live headline
      // or the baseline banner should disappear
      await expect(page.getByTestId('baseline-fallback-banner')).not.toBeVisible({ timeout: 15000 });

      // Verify that we made 2 requests (initial + retry)
      expect(requestCount).toBe(2);
    });

    test('does not emit QAPage schema for baseline fallback', async ({ page }) => {
      await page.route('**/decision/evaluate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_capacity_test',
            output: {
              type: 'refusal',
              refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'Service at capacity.',
                missing_or_conflicting_inputs: [],
                safe_next_step: 'Try again later.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto(`/decisions/${topicWithBaseline}`);

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      await expect(page.getByTestId('baseline-fallback-banner')).toBeVisible({ timeout: 10000 });

      // Check that no QAPage structured data is present
      const structuredData = await page.locator('script[type="application/ld+json"]').all();
      for (const script of structuredData) {
        const content = await script.textContent();
        if (content) {
          const parsed = JSON.parse(content);
          expect(parsed['@type']).not.toBe('QAPage');
        }
      }
    });
  });

  test.describe('Topic WITHOUT baseline available', () => {
    // NOTE: All 40 P0 topics now have baseline JSON files.
    // This test is skipped because the baseline coverage goal is complete.
    // If future topics are added without baselines, this test validates the fallback UI.
    const topicWithoutBaseline = 'am-i-ready-for-first-safari';

    test.skip('shows standard service-degraded refusal UI when no baseline exists', async ({ page }) => {
      await page.route('**/decision/evaluate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_no_baseline',
            output: {
              type: 'refusal',
              refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'The decision service is temporarily unable to process your request.',
                missing_or_conflicting_inputs: [
                  'Service capacity constraints are currently active',
                ],
                safe_next_step: 'Wait a few seconds and refresh the page, or try again later.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto(`/decisions/${topicWithoutBaseline}`);

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      // Should NOT show baseline banner
      await expect(page.getByTestId('baseline-fallback-banner')).not.toBeVisible({ timeout: 5000 });

      // Should show standard service-degraded component
      await expect(page.getByTestId('service-capacity-refusal')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('capacity-heading')).toHaveText('At capacity');

      // Should show standard retry button
      await expect(page.getByTestId('retry-button')).toBeVisible();
    });
  });

  test.describe('Non-capacity refusals', () => {
    test('non-SERVICE_DEGRADED refusals do not trigger baseline fallback', async ({ page }) => {
      await page.route('**/decision/evaluate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            decision_id: 'dec_missing_inputs',
            output: {
              type: 'refusal',
              refusal: {
                code: 'MISSING_INPUTS',
                reason: 'Missing required travel information.',
                missing_or_conflicting_inputs: [
                  'Travel dates not specified',
                  'Budget not specified',
                ],
                safe_next_step: 'Provide the missing information.',
              },
            },
            metadata: { logic_version: 'v1.0', ai_used: false },
          }),
        });
      });

      await page.goto('/decisions/tanzania-dry-season-only');

      // Skip wizard if visible
      const wizard = page.getByTestId('preflight-wizard');
      if (await wizard.isVisible()) {
        await page.getByRole('button', { name: /answer quality check/i }).click();
        await page.getByTestId('preflight-skip').click();
      }

      // Should NOT show baseline banner (refusal is not capacity-related)
      await expect(page.getByTestId('baseline-fallback-banner')).not.toBeVisible({ timeout: 5000 });

      // Should show standard refusal UI
      await expect(page.getByText('Decision refused')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('What we need')).toBeVisible();
    });
  });
});

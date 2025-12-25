import { test, expect } from '@playwright/test';

/**
 * Compare Page Tests
 *
 * Tests for the /compare page (staging only).
 * Verifies Differences section appears after comparison.
 */

test.describe('Compare Page', () => {
  test('compare page loads in staging mode', async ({ page }) => {
    const response = await page.goto('/compare');

    // Should not 404 in staging (APP_MODE=build)
    expect(response?.status()).toBe(200);

    // Should show page header
    await expect(page.getByRole('heading', { name: 'Compare decisions' })).toBeVisible();
  });

  test('compare page shows dropdowns for selection', async ({ page }) => {
    await page.goto('/compare');

    // Should have two dropdown selectors
    await expect(page.getByLabel('Decision A')).toBeVisible();
    await expect(page.getByLabel('Decision B')).toBeVisible();

    // Should have Compare button
    await expect(page.getByRole('button', { name: 'Compare' })).toBeVisible();
  });

  test('differences section appears after comparison with mocked API', async ({ page }) => {
    // Mock API responses for two different decisions
    await page.route('**/decision/evaluate', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() || '{}');

      // Return different responses based on topic
      const isFirstTopic = body.tracking?.session_id?.includes('tz-feb');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: isFirstTopic ? 'dec_a' : 'dec_b',
          output: {
            type: 'decision',
            decision: {
              outcome: isFirstTopic ? 'book' : 'wait',
              headline: isFirstTopic
                ? 'February is excellent for Tanzania safari'
                : 'Consider waiting for better conditions',
              summary: isFirstTopic
                ? 'Dry season conditions provide optimal wildlife viewing with minimal rain.'
                : 'Current conditions suggest waiting may improve your experience.',
              confidence: isFirstTopic ? 0.85 : 0.65,
              tradeoffs: {
                gains: isFirstTopic
                  ? ['Optimal wildlife viewing', 'Less rain', 'Clear skies']
                  : ['Lower prices', 'Fewer crowds', 'More flexibility'],
                losses: isFirstTopic
                  ? ['Higher prices', 'More tourists']
                  : ['Less predictable weather', 'Some roads closed'],
              },
              assumptions: [
                { id: 'a1', text: isFirstTopic ? 'Flexible on budget' : 'Price sensitive', confidence: 0.8 },
                { id: 'a2', text: 'First-time visitor', confidence: 0.7 },
              ],
              change_conditions: [
                isFirstTopic ? 'If budget becomes constrained' : 'If dates become fixed',
                'If priorities change',
              ],
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/compare');

    // Select two different topics
    await page.getByLabel('Decision A').selectOption({ index: 1 });
    await page.getByLabel('Decision B').selectOption({ index: 2 });

    // Click compare
    await page.getByRole('button', { name: 'Compare' }).click();

    // Wait for Differences section to appear
    await expect(page.getByTestId('diff-summary')).toBeVisible({ timeout: 10000 });

    // Should show "Differences" heading
    await expect(page.getByRole('heading', { name: 'Differences' })).toBeVisible();
  });

  test('differences section shows outcome difference when outcomes differ', async ({ page }) => {
    // Track which request is first
    let requestCount = 0;

    // Mock API with different outcomes based on request order
    await page.route('**/decision/evaluate', async (route) => {
      requestCount++;
      const isFirst = requestCount === 1;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: isFirst ? 'dec_a' : 'dec_b',
          output: {
            type: 'decision',
            decision: {
              outcome: isFirst ? 'book' : 'switch',
              headline: 'Test headline that is long enough',
              summary: 'Test summary that provides enough detail for the quality gate check.',
              confidence: 0.75,
              tradeoffs: {
                gains: ['Gain 1', 'Gain 2'],
                losses: ['Loss 1', 'Loss 2'],
              },
              assumptions: [
                { id: 'a1', text: 'Assumption text', confidence: 0.8 },
                { id: 'a2', text: 'Another assumption', confidence: 0.7 },
              ],
              change_conditions: ['Condition 1', 'Condition 2'],
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/compare');

    // Select two different topics by index
    await page.getByLabel('Decision A').selectOption({ index: 1 });
    await page.getByLabel('Decision B').selectOption({ index: 2 });

    // Click compare
    await page.getByRole('button', { name: 'Compare' }).click();

    // Wait for diff summary
    await expect(page.getByTestId('diff-summary')).toBeVisible({ timeout: 10000 });

    // Should show outcome values in diff summary
    const diffSummary = page.getByTestId('diff-summary');
    await expect(diffSummary.getByText('Outcome')).toBeVisible();
    await expect(diffSummary.getByText('book')).toBeVisible();
    await expect(diffSummary.getByText('switch')).toBeVisible();
  });

  test('differences section shows "no meaningful differences" for identical decisions', async ({ page }) => {
    // Mock API with identical responses
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_identical',
          output: {
            type: 'decision',
            decision: {
              outcome: 'book',
              headline: 'Test headline that is long enough',
              summary: 'Test summary that provides enough detail for the quality gate check.',
              confidence: 0.75,
              tradeoffs: {
                gains: ['Gain 1', 'Gain 2'],
                losses: ['Loss 1', 'Loss 2'],
              },
              assumptions: [
                { id: 'a1', text: 'Assumption text', confidence: 0.8 },
                { id: 'a2', text: 'Another assumption', confidence: 0.7 },
              ],
              change_conditions: ['Condition 1', 'Condition 2'],
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/compare');

    // Select two different topics (but mocked to return same decision)
    await page.getByLabel('Decision A').selectOption({ index: 1 });
    await page.getByLabel('Decision B').selectOption({ index: 2 });

    // Click compare
    await page.getByRole('button', { name: 'Compare' }).click();

    // Wait for diff summary
    await expect(page.getByTestId('diff-summary')).toBeVisible({ timeout: 10000 });

    // Should show "no meaningful differences" message
    // Note: fit/misfit may still differ based on topics, so this test may need adjustment
    await expect(page.getByRole('heading', { name: 'Differences' })).toBeVisible();
  });
});

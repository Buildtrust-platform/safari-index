import { test, expect } from '@playwright/test';

/**
 * Refusal Recovery Panel Tests
 *
 * Tests that the RefusalRecoveryPanel:
 * 1. Renders in staging mode when API returns refusal
 * 2. Does not render in observation mode (production)
 * 3. Shows correct missing inputs
 * 4. Copy button works
 *
 * Note: In staging mode (NEXT_PUBLIC_APP_MODE=build), the decision page shows
 * a PreflightWizard before fetching from the API. Tests must click "Skip" to
 * trigger the API call.
 */

/**
 * Helper to skip the preflight wizard in staging mode.
 * The wizard starts collapsed, so we expand it then click Skip.
 */
async function skipPreflightWizard(page: import('@playwright/test').Page) {
  // Wait for wizard to appear
  const wizard = page.getByTestId('preflight-wizard');
  await expect(wizard).toBeVisible({ timeout: 10000 });

  // Expand the wizard by clicking the header button
  await wizard.getByRole('button', { name: /answer quality check/i }).click();

  // Click Skip to trigger API call with defaults
  await page.getByTestId('preflight-skip').click();
}

test.describe('Refusal Recovery Panel', () => {
  test('panel renders when API returns refusal in staging mode', async ({ page }) => {
    // Mock API to return refusal
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_refusal',
          output: {
            type: 'refusal',
            refusal: {
              reason: 'missing_material_inputs',
              missing_or_conflicting_inputs: ['Travel dates', 'Budget information'],
              safe_next_step: 'Provide your travel dates and budget to get a recommendation.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // Skip the preflight wizard to trigger API call
    await skipPreflightWizard(page);

    // Should show refusal verdict
    await expect(page.getByText('Decision refused')).toBeVisible({ timeout: 10000 });

    // Should show recovery panel in staging (APP_MODE=build)
    await expect(page.getByTestId('refusal-recovery-panel')).toBeVisible();

    // Should show heading
    await expect(page.getByRole('heading', { name: "To answer this, we're missing" })).toBeVisible();

    // Should show copy button
    await expect(page.getByRole('button', { name: /copy example inputs/i })).toBeVisible();
  });

  test('panel shows missing inputs from reason mapping', async ({ page }) => {
    // Mock API with specific refusal reason
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_refusal',
          output: {
            type: 'refusal',
            refusal: {
              reason: 'missing_material_inputs',
              missing_or_conflicting_inputs: ['Material inputs missing'],
              safe_next_step: 'Provide required inputs.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // Skip the preflight wizard to trigger API call
    await skipPreflightWizard(page);

    // Wait for panel
    await expect(page.getByTestId('refusal-recovery-panel')).toBeVisible({ timeout: 10000 });

    // Should show mapped fields for missing_material_inputs
    await expect(page.getByText('Travel month')).toBeVisible();
    await expect(page.getByText('Traveler type')).toBeVisible();
    await expect(page.getByText('Budget tier')).toBeVisible();
  });

  test('panel falls back to topic required_inputs for unknown reason', async ({ page }) => {
    // Mock API with unknown refusal reason
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_refusal',
          output: {
            type: 'refusal',
            refusal: {
              reason: 'some_unknown_reason_xyz',
              missing_or_conflicting_inputs: ['Unknown requirement'],
              safe_next_step: 'Contact support.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // Skip the preflight wizard to trigger API call
    await skipPreflightWizard(page);

    // Wait for panel
    await expect(page.getByTestId('refusal-recovery-panel')).toBeVisible({ timeout: 10000 });

    // Should fall back to topic required_inputs (tz-feb has these)
    await expect(page.getByText('Travel month')).toBeVisible();
    await expect(page.getByText('Budget tier')).toBeVisible();
  });

  test('copy button copies JSON to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Mock API to return refusal
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_refusal',
          output: {
            type: 'refusal',
            refusal: {
              reason: 'missing_material_inputs',
              missing_or_conflicting_inputs: ['Missing inputs'],
              safe_next_step: 'Provide inputs.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // Skip the preflight wizard to trigger API call
    await skipPreflightWizard(page);

    // Wait for panel
    await expect(page.getByTestId('refusal-recovery-panel')).toBeVisible({ timeout: 10000 });

    // Click copy button
    const copyButton = page.getByRole('button', { name: /copy example inputs/i });
    await copyButton.click();

    // Button text should change to "Copied" (aria-label stays the same)
    await expect(copyButton).toHaveText('Copied');

    // Verify clipboard contains valid JSON
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const parsed = JSON.parse(clipboardText);
    expect(parsed).toHaveProperty('user_context');
  });

  test('panel does not render for successful decisions', async ({ page }) => {
    // Mock API to return success
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_success',
          output: {
            type: 'decision',
            decision: {
              outcome: 'book',
              headline: 'February is excellent for Tanzania safari viewing',
              summary: 'The dry season conditions in February provide optimal wildlife viewing.',
              assumptions: [
                { id: 'a1', text: 'Flexible on dates', confidence: 0.8 },
                { id: 'a2', text: 'Budget allows peak', confidence: 0.7 },
              ],
              tradeoffs: { gains: ['Great viewing', 'Dry weather'], losses: ['Higher prices'] },
              change_conditions: ['If dates change', 'If budget changes'],
              confidence: 0.75,
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // Skip the preflight wizard to trigger API call
    await skipPreflightWizard(page);

    // Wait for verdict to load - use heading role to be specific
    await expect(
      page.getByRole('heading', { name: /February is excellent/i })
    ).toBeVisible({ timeout: 10000 });

    // Recovery panel should not be present
    await expect(page.getByTestId('refusal-recovery-panel')).not.toBeVisible();
  });

  test('panel shows DEV indicator text', async ({ page }) => {
    // Mock API to return refusal
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_refusal',
          output: {
            type: 'refusal',
            refusal: {
              reason: 'missing_material_inputs',
              missing_or_conflicting_inputs: ['Missing'],
              safe_next_step: 'Provide inputs.',
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false },
        }),
      });
    });

    await page.goto('/decisions/tanzania-safari-february');

    // Skip the preflight wizard to trigger API call
    await skipPreflightWizard(page);

    // Wait for panel
    await expect(page.getByTestId('refusal-recovery-panel')).toBeVisible({ timeout: 10000 });

    // Should show staging indicator
    await expect(page.getByText('DEV: Panel visible in staging only.')).toBeVisible();
  });
});

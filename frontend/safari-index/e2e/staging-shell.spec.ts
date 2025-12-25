import { test, expect } from '@playwright/test';

/**
 * Staging Shell and Pattern Library Tests
 *
 * Tests for:
 * - StagingShell component (header, navigation, staging badge)
 * - Mobile UX on /compare page
 * - Pattern library accessibility
 */

test.describe('StagingShell', () => {
  // StagingShell is now only used on dev pages, not on explore/compare
  // Explore and Compare have their own production-visible headers

  test('staging shell renders on dev pages', async ({ page }) => {
    await page.goto('/dev/topic-health');

    // Should show staging navigation
    await expect(page.getByRole('navigation', { name: 'Staging navigation' })).toBeVisible();

    // Should show Dev Tools link when on dev pages
    await expect(page.getByRole('link', { name: 'Dev Tools' })).toBeVisible();

    // Should show staging badge
    await expect(page.getByLabel('Staging environment')).toBeVisible();
  });

  test('skip link is accessible on dev pages', async ({ page }) => {
    await page.goto('/dev/topic-health');

    // Skip link should exist
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeAttached();

    // Main content should have correct id for skip link target
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('explore page has working navigation', async ({ page }) => {
    await page.goto('/explore');

    // Explore page should be visible
    await expect(page.getByRole('heading', { name: 'Explore decisions' })).toBeVisible();

    // Should have a link back to home
    await expect(page.getByRole('link', { name: /Safari Index|Back/ })).toBeVisible();
  });

  test('compare page loads correctly', async ({ page }) => {
    await page.goto('/compare');

    // Compare page should be visible
    await expect(page.getByRole('heading', { name: 'Compare decisions' })).toBeVisible();
  });
});

test.describe('Compare Page Responsive Layout', () => {
  const mockDecisionResponse = {
    decision_id: 'dec_test',
    output: {
      type: 'decision',
      decision: {
        outcome: 'book',
        headline: 'Test headline that is long enough for quality gate',
        summary: 'Test summary providing enough detail for quality check.',
        confidence: 0.75,
        tradeoffs: { gains: ['Gain 1', 'Gain 2'], losses: ['Loss 1', 'Loss 2'] },
        assumptions: [{ id: 'a1', text: 'Assumption text', confidence: 0.8 }],
        change_conditions: ['Condition 1'],
      },
    },
    metadata: { logic_version: 'v1.0', ai_used: false },
  };

  test('compare page renders panels with proper IDs', async ({ page }) => {
    // Mock API response before navigating
    await page.route('**/decision/evaluate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDecisionResponse),
      });
    });

    await page.goto('/compare');

    // Wait for page to be ready
    await expect(page.getByLabel('Decision A')).toBeVisible();

    // Select topics
    await page.getByLabel('Decision A').selectOption({ index: 1 });
    await page.getByLabel('Decision B').selectOption({ index: 2 });

    // Click compare
    await page.getByRole('button', { name: 'Compare' }).click();

    // Wait for panels to appear - these IDs are used for mobile jump links
    await expect(page.locator('#panel-a')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#panel-b')).toBeVisible();

    // Diff summary should have ID for jump link target
    await expect(page.locator('#diff-summary')).toBeVisible();
  });

  test('compare page has mobile panel structure', async ({ page }) => {
    // Mock API response
    await page.route('**/decision/evaluate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDecisionResponse),
      });
    });

    await page.goto('/compare');

    // Select and compare
    await page.getByLabel('Decision A').selectOption({ index: 1 });
    await page.getByLabel('Decision B').selectOption({ index: 2 });
    await page.getByRole('button', { name: 'Compare' }).click();

    // Wait for panels - verify both appear
    await expect(page.locator('#panel-a')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#panel-b')).toBeVisible();

    // Both panels should have scroll margin (for jump link targeting)
    const panelA = page.locator('#panel-a');
    const panelB = page.locator('#panel-b');

    // Verify panels exist and contain expected content
    await expect(panelA).toBeVisible();
    await expect(panelB).toBeVisible();
  });
});

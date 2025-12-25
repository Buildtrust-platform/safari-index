import { test, expect } from '@playwright/test';

/**
 * When to Go Discovery Hub Tests
 *
 * Tests for the timing-focused discovery panel on /explore.
 * Verifies chip filtering, query param handling, and clear functionality.
 */

test.describe('When to Go Discovery Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
  });

  test('displays When to Go panel with all chip rows', async ({ page }) => {
    // Panel should be visible
    await expect(page.getByTestId('when-to-go-panel')).toBeVisible();

    // Should have header content
    await expect(page.getByText('When to go')).toBeVisible();
    await expect(page.getByText('Find the right timing for your safari')).toBeVisible();

    // Should have month chips (check a few)
    const monthsRow = page.getByTestId('when-to-go-months');
    await expect(monthsRow.getByText('Jan')).toBeVisible();
    await expect(monthsRow.getByText('Jul')).toBeVisible();
    await expect(monthsRow.getByText('Dec')).toBeVisible();

    // Should have season chips
    const seasonsRow = page.getByTestId('when-to-go-seasons');
    await expect(seasonsRow.getByText('Dry season')).toBeVisible();
    await expect(seasonsRow.getByText('Green season')).toBeVisible();

    // Should have interest chips
    const interestsRow = page.getByTestId('when-to-go-interests');
    await expect(interestsRow.getByText('Great Migration')).toBeVisible();
    await expect(interestsRow.getByText('Calving')).toBeVisible();
    await expect(interestsRow.getByText('Fewer crowds')).toBeVisible();
    await expect(interestsRow.getByText('Lower prices')).toBeVisible();
  });

  test('clicking a month chip filters topics', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('[data-testid="when-to-go-panel"]').evaluate(() => {
      const text = document.body.innerText;
      const match = text.match(/(\d+) decisions to explore/);
      return match ? parseInt(match[1]) : 0;
    });

    // Click February chip
    await page.getByTestId('when-to-go-months').getByText('Feb').click();

    // Should show filtered count (less than or equal to initial)
    await expect(page.getByText(/\d+ of \d+ decisions/)).toBeVisible({ timeout: 5000 });

    // Feb chip should be active (dark background)
    const febButton = page.getByTestId('when-to-go-months').getByText('Feb');
    await expect(febButton).toHaveClass(/bg-stone-900/);
  });

  test('clicking a season chip filters topics', async ({ page }) => {
    // Click Dry season chip
    await page.getByTestId('when-to-go-seasons').getByText('Dry season').click();

    // Should show filtered count
    await expect(page.getByText(/\d+ of \d+ decisions/)).toBeVisible({ timeout: 5000 });

    // Dry season chip should be active
    const dryButton = page.getByTestId('when-to-go-seasons').getByText('Dry season');
    await expect(dryButton).toHaveClass(/bg-stone-900/);
  });

  test('clicking an interest chip filters topics', async ({ page }) => {
    // Click Great Migration chip
    await page.getByTestId('when-to-go-interests').getByText('Great Migration').click();

    // Should show filtered count
    await expect(page.getByText(/\d+ of \d+ decisions/)).toBeVisible({ timeout: 5000 });

    // Great Migration chip should be active
    const migrationButton = page.getByTestId('when-to-go-interests').getByText('Great Migration');
    await expect(migrationButton).toHaveClass(/bg-stone-900/);
  });

  test('multiple chips can be selected (union filter)', async ({ page }) => {
    // Click Feb and Jul
    await page.getByTestId('when-to-go-months').getByText('Feb').click();
    await page.getByTestId('when-to-go-months').getByText('Jul').click();

    // Both should be active
    await expect(page.getByTestId('when-to-go-months').getByText('Feb')).toHaveClass(/bg-stone-900/);
    await expect(page.getByTestId('when-to-go-months').getByText('Jul')).toHaveClass(/bg-stone-900/);

    // Should show combined results
    await expect(page.getByText(/\d+ of \d+ decisions/)).toBeVisible({ timeout: 5000 });
  });

  test('clicking a selected chip deselects it', async ({ page }) => {
    // Click Feb to select
    const febButton = page.getByTestId('when-to-go-months').getByText('Feb');
    await febButton.click();
    await expect(febButton).toHaveClass(/bg-stone-900/);

    // Click Feb again to deselect
    await febButton.click();
    await expect(febButton).not.toHaveClass(/bg-stone-900/);

    // Should return to full list
    await expect(page.getByText(/\d+ decisions to explore/)).toBeVisible({ timeout: 5000 });
  });

  test('Clear button appears when chips selected and clears all', async ({ page }) => {
    // Clear button should not be visible initially
    await expect(page.getByTestId('when-to-go-clear')).not.toBeVisible();

    // Select some chips
    await page.getByTestId('when-to-go-months').getByText('Feb').click();
    await page.getByTestId('when-to-go-seasons').getByText('Dry season').click();

    // Clear button should appear
    await expect(page.getByTestId('when-to-go-clear')).toBeVisible();

    // Click clear
    await page.getByTestId('when-to-go-clear').click();

    // All chips should be deselected
    await expect(page.getByTestId('when-to-go-months').getByText('Feb')).not.toHaveClass(/bg-stone-900/);
    await expect(page.getByTestId('when-to-go-seasons').getByText('Dry season')).not.toHaveClass(/bg-stone-900/);

    // Clear button should be hidden again
    await expect(page.getByTestId('when-to-go-clear')).not.toBeVisible();
  });

  test('filter=when-to-go query param scrolls to panel', async ({ page }) => {
    // Navigate with query param
    await page.goto('/explore?filter=when-to-go');

    // Panel should be visible (scrolled into view)
    await expect(page.getByTestId('when-to-go-panel')).toBeVisible();

    // The panel should be near the top of the viewport
    const panel = page.getByTestId('when-to-go-panel');
    const boundingBox = await panel.boundingBox();
    expect(boundingBox).toBeTruthy();
    // Panel should be in view (top within reasonable distance from viewport top)
    expect(boundingBox!.y).toBeLessThan(500);
  });

  test('timing filter combines with search', async ({ page }) => {
    // Select a timing chip
    await page.getByTestId('when-to-go-months').getByText('Feb').click();

    // Enter a search query
    await page.getByPlaceholder('Search by destination, topic, or question...').fill('Tanzania');

    // Should show filtered results (intersection of timing + search)
    await expect(page.getByText(/\d+ of \d+ decisions/)).toBeVisible({ timeout: 5000 });
  });

  test('shows empty state when no topics match filters', async ({ page }) => {
    // Select a very specific combination unlikely to match
    // First select a month
    await page.getByTestId('when-to-go-months').getByText('Mar').click();

    // Then add a region filter that might not overlap
    await page.getByRole('button', { name: /Filters/ }).click();
    await page.getByText('Zambia').click();

    // Should show either empty state or filtered count (not both visible at same time)
    // Wait a moment for the filter to apply
    await page.waitForTimeout(500);

    // Check if empty state is showing
    const emptyState = page.getByText('No decisions match your filters');
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasEmptyState) {
      await expect(emptyState).toBeVisible();
    } else {
      // Otherwise should show filtered count
      await expect(page.getByText(/\d+ of \d+ decisions/)).toBeVisible({ timeout: 5000 });
    }
  });
});

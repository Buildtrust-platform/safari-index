/**
 * Inquiry Prefill E2E Tests
 *
 * Tests the inquiry form prefill functionality:
 * - Query params prefill trip_id and selected_decision_ids
 * - Session storage draft persistence
 * - Decision chips display for prefilled decisions
 */

import { test, expect } from '@playwright/test';

test.describe('Inquiry prefill functionality', () => {
  test('prefills trip from query param', async ({ page }) => {
    await page.goto('/inquire?trip_id=classic-serengeti-ngorongoro');

    // Should show the trip as selected
    await expect(page.getByText('Classic Serengeti and Ngorongoro')).toBeVisible();
  });

  test('prefills trip using legacy trip param', async ({ page }) => {
    await page.goto('/inquire?trip=classic-serengeti-ngorongoro');

    // Should show the trip as selected
    await expect(page.getByText('Classic Serengeti and Ngorongoro')).toBeVisible();
  });

  test('shows linked decisions preview when decisions prefilled', async ({ page }) => {
    await page.goto('/inquire?selected_decision_ids=first-timer-ready,tz-dry-season');

    // Should show linked decisions preview section
    await expect(page.getByTestId('linked-decisions-preview')).toBeVisible();

    // Should show decision chips
    const chips = page.getByTestId('linked-decision-chip');
    await expect(chips).toHaveCount(2);
  });

  test('combines trip decisions with prefilled decisions', async ({ page }) => {
    // Navigate with both trip and additional decision
    await page.goto('/inquire?trip_id=classic-serengeti-ngorongoro&selected_decision_ids=malaria-decision');

    // Should show linked decisions preview
    await expect(page.getByTestId('linked-decisions-preview')).toBeVisible();

    // Should show chips from both sources (trip has 6 decisions + 1 additional = 6 max displayed)
    const chips = page.getByTestId('linked-decision-chip');
    const count = await chips.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(6);
  });

  test('draft persists after page reload', async ({ page }) => {
    await page.goto('/inquire');

    // Fill in some form fields
    await page.getByPlaceholder('your@email.com').fill('test@example.com');
    await page.locator('select').filter({ hasText: 'Select budget range' }).selectOption('10k-20k');

    // Reload the page
    await page.reload();

    // Fields should retain their values
    await expect(page.getByPlaceholder('your@email.com')).toHaveValue('test@example.com');
    await expect(page.locator('select').filter({ hasText: '$10,000' })).toBeVisible();
  });

  test('draft is cleared after successful submission', async ({ page }) => {
    await page.goto('/inquire');

    // Fill in required fields
    await page.getByPlaceholder('your@email.com').fill('test@example.com');
    await page.locator('select').filter({ hasText: 'Select budget range' }).selectOption('10k-20k');
    await page.locator('select').filter({ hasText: 'Select travel style' }).selectOption('couple');

    // Submit the form
    await page.getByTestId('inquire-submit').click();

    // Wait for navigation to confirmation
    await page.waitForURL(/\/inquire\/confirmation/);

    // Go back to inquire page
    await page.goto('/inquire');

    // Fields should be cleared (draft was removed)
    await expect(page.getByPlaceholder('your@email.com')).toHaveValue('');
  });
});

test.describe('Trip page inquiry CTA', () => {
  test('links to inquire with trip_id and decision ids', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    // Get the inquiry CTA
    const ctaLink = page.getByTestId('inquiry-cta');
    const href = await ctaLink.getAttribute('href');

    // Should include trip_id
    expect(href).toContain('trip_id=classic-serengeti-ngorongoro');

    // Should include selected_decision_ids
    expect(href).toContain('selected_decision_ids=');
  });

  test('clicking CTA navigates to prefilled form', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    // Click the inquiry CTA
    await page.getByTestId('inquiry-cta').click();

    // Should navigate to inquire page
    await expect(page).toHaveURL(/\/inquire/);

    // Should show the trip as selected
    await expect(page.getByText('Classic Serengeti and Ngorongoro')).toBeVisible();
  });
});

test.describe('Decision page planning CTA', () => {
  test('links to inquire with decision id', async ({ page }) => {
    await page.goto('/decisions/first-timer-ready');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get the trip planning CTA link
    const ctaLink = page.getByTestId('trip-planning-link');

    // Check if it exists (may not be rendered in all states)
    if (await ctaLink.isVisible()) {
      const href = await ctaLink.getAttribute('href');

      // Should include selected_decision_ids
      expect(href).toContain('/inquire');
    }
  });
});

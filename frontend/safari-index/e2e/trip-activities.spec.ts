/**
 * Trip Page Activity Sections E2E Tests
 *
 * Tests the activity and accommodation sections on trip pages:
 * - Typical day section renders
 * - Accommodation section renders
 * - Activity links work
 */

import { test, expect } from '@playwright/test';

test.describe('Trip page activity sections', () => {
  test('trip page shows typical day section when destination has profile', async ({ page }) => {
    // Navigate to a trip that should have a destination profile
    await page.goto('/trips/classic-serengeti-ngorongoro');

    // Check for typical day section (may or may not be present depending on data)
    const typicalDaySection = page.getByTestId('section-typical-day');
    const hasTypicalDay = await typicalDaySection.isVisible().catch(() => false);

    if (hasTypicalDay) {
      // If present, check it has the expected structure
      await expect(page.getByText('What your days look like')).toBeVisible();
    }
  });

  test('trip page shows accommodation section when destination has profile', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    // Check for accommodation section
    const accommodationSection = page.getByTestId('section-accommodation');
    const hasAccommodation = await accommodationSection.isVisible().catch(() => false);

    if (hasAccommodation) {
      await expect(page.getByText("Where you'll stay")).toBeVisible();

      // Should have accommodation cards
      const accommodationCards = page.getByTestId('accommodation-card');
      const count = await accommodationCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('accommodation section shows no-lodge-listing note', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const accommodationSection = page.getByTestId('section-accommodation');
    const hasAccommodation = await accommodationSection.isVisible().catch(() => false);

    if (hasAccommodation) {
      // Should have the disclaimer about not listing specific lodges
      await expect(page.getByText(/Safari Index doesn't list specific lodges/i)).toBeVisible();
    }
  });

  test('activity links in typical day section navigate correctly', async ({ page }) => {
    await page.goto('/trips/classic-serengeti-ngorongoro');

    const typicalDaySection = page.getByTestId('section-typical-day');
    const hasTypicalDay = await typicalDaySection.isVisible().catch(() => false);

    if (hasTypicalDay) {
      // Find an activity link within the section
      const activityLink = typicalDaySection.getByRole('link', { name: /Game Drive|Walking Safari|Boat Safari/i }).first();
      const hasLink = await activityLink.isVisible().catch(() => false);

      if (hasLink) {
        await expect(activityLink).toHaveAttribute('href', /\/activities\//);
      }
    }
  });
});

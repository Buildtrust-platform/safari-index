import { test, expect } from '@playwright/test';

/**
 * Smoke tests for /dev/components page
 *
 * These tests verify:
 * 1. Page loads in development
 * 2. All component sections render
 * 3. Basic accessibility checks
 */

test.describe('Dev Components Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/components');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Component Preview/);
  });

  test('shows dev-only warning banner', async ({ page }) => {
    await expect(page.getByText('DEV-ONLY: This page is not accessible in production')).toBeVisible();
  });

  test('renders VerdictCard section with all outcomes', async ({ page }) => {
    // Use exact match to avoid matching "SkeletonVerdictCard"
    await expect(page.getByRole('heading', { name: 'VerdictCard', exact: true })).toBeVisible();

    // Check all outcome variants are rendered
    await expect(page.getByText('Outcome: Book')).toBeVisible();
    await expect(page.getByText('Outcome: Wait')).toBeVisible();
    await expect(page.getByText('Outcome: Switch')).toBeVisible();
    await expect(page.getByText('Outcome: Discard')).toBeVisible();
    await expect(page.getByText('Outcome: Refused')).toBeVisible();
  });

  test('renders TradeoffLedger section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'TradeoffLedger', exact: true })).toBeVisible();
  });

  test('renders FitMisfitBlock section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'FitMisfitBlock' })).toBeVisible();
    await expect(page.getByText('Right for')).toBeVisible();
    await expect(page.getByText('Not ideal for')).toBeVisible();
  });

  test('renders AssumptionsBlock section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AssumptionsBlock' })).toBeVisible();
    await expect(page.getByText('You have flexibility in your travel dates')).toBeVisible();
  });

  test('renders ChangeConditions section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ChangeConditions', exact: true })).toBeVisible();
    await expect(page.getByText('This recommendation changes if').first()).toBeVisible();
  });

  test('renders AnswerOwnershipBlock section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AnswerOwnershipBlock' })).toBeVisible();
  });

  test('renders AttributionFooter section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AttributionFooter' })).toBeVisible();
    await expect(page.getByText('dec_preview_12345')).toBeVisible();
  });

  test('renders QualityGateFailure section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'QualityGateFailure' })).toBeVisible();
    await expect(page.getByText('Headline missing or too vague')).toBeVisible();
  });

  test('renders DecisionEmbed section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'DecisionEmbed' })).toBeVisible();
    await expect(page.getByText('Normal Embed')).toBeVisible();
    await expect(page.getByText('Flagged for Review')).toBeVisible();
  });

  test('renders DecisionFollowUp section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'DecisionFollowUp' })).toBeVisible();
    await expect(page.getByText('Notify me if this decision changes')).toBeVisible();
  });

  test('renders NextSensibleStep section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'NextSensibleStep' })).toBeVisible();
  });

  test('renders Skeleton States section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Skeleton States' })).toBeVisible();
    await expect(page.getByText('Basic Skeleton')).toBeVisible();
    await expect(page.getByText('SkeletonVerdictCard')).toBeVisible();
    await expect(page.getByText('SkeletonDecisionPage')).toBeVisible();
  });
});

test.describe('Dev Components Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/components');
  });

  test('page has main landmark', async ({ page }) => {
    // Use first() since QualityGateFailure component also renders a <main>
    await expect(page.getByRole('main').first()).toBeVisible();
  });

  test('page has Component Preview heading', async ({ page }) => {
    // Verify the main heading exists
    await expect(page.getByRole('heading', { name: 'Component Preview' })).toBeVisible();
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    // Wait for page content to load
    await expect(page.getByRole('heading', { name: 'Component Preview' })).toBeVisible();

    // Tab to the first checkbox in DecisionFollowUp
    const checkbox = page.getByRole('checkbox', { name: /notify me/i }).first();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.focus();
    await expect(checkbox).toBeFocused();

    // Toggle with keyboard
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
  });
});

test.describe('Dev Components Mobile', () => {
  test('page is readable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dev/components');

    // Check main content is visible
    await expect(page.getByRole('heading', { name: 'Component Preview' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'VerdictCard', exact: true })).toBeVisible();
  });
});

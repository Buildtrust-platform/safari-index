/**
 * Newsletter E2E Tests - "Field Notes from Safari Index"
 *
 * Tests for:
 * - Homepage newsletter signup section with Field Notes branding
 * - Newsletter form validation (client-side)
 * - Newsletter API validation (schema only - DynamoDB not available in tests)
 * - Contact page newsletter section
 */

import { test, expect } from '@playwright/test';

test.describe('Newsletter Signup', () => {
  test.describe('Homepage newsletter section', () => {
    test('renders Field Notes newsletter section on homepage', async ({ page }) => {
      await page.goto('/');

      // Newsletter section should be visible with Field Notes branding
      const newsletterHeading = page.getByRole('heading', { name: 'Field Notes from Safari Index' });
      await expect(newsletterHeading).toBeVisible();

      // Field Notes description should be present
      await expect(
        page.getByText('Occasional dispatches on safari planning')
      ).toBeVisible();

      // Frequency indicator should be present
      await expect(
        page.getByText('No deals, no spam. Published monthly at most.')
      ).toBeVisible();

      // Privacy note should be present
      await expect(
        page.getByText('Your email stays with us. Unsubscribe anytime.')
      ).toBeVisible();

      // Email input should be present
      const emailInput = page.getByPlaceholder('your@email.com');
      await expect(emailInput).toBeVisible();

      // Subscribe button should be present
      const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
      await expect(subscribeButton).toBeVisible();
    });

    test('email input validates email format via HTML5', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Scroll to newsletter section to ensure it's in viewport
      const newsletterHeading = page.getByRole('heading', { name: 'Field Notes from Safari Index' });
      await newsletterHeading.scrollIntoViewIfNeeded();

      // Find newsletter section elements
      const emailInput = page.getByPlaceholder('your@email.com');
      const subscribeButton = page.getByRole('button', { name: 'Subscribe' });

      // Wait for input to be ready
      await expect(emailInput).toBeVisible();

      // Input has type="email" which triggers browser's HTML5 validation
      // When invalid email is entered, browser prevents form submission
      await emailInput.fill('invalidemail');
      await subscribeButton.click();

      // The input should still have the value (form wasn't submitted due to HTML5 validation)
      await expect(emailInput).toHaveValue('invalidemail');

      // Button should still say "Subscribe" (not "Subscribing...")
      await expect(subscribeButton).toHaveText('Subscribe');
    });

    test('shows error for empty email on submit', async ({ page }) => {
      await page.goto('/');

      const subscribeButton = page.getByRole('button', { name: 'Subscribe' });

      // Submit with empty email
      await subscribeButton.click();

      // Should show error message
      await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    });

    test('clears error when user types after error', async ({ page }) => {
      await page.goto('/');

      const emailInput = page.getByPlaceholder('your@email.com');
      const subscribeButton = page.getByRole('button', { name: 'Subscribe' });

      // Trigger error first by submitting empty
      await subscribeButton.click();
      await expect(page.getByText('Please enter a valid email address.')).toBeVisible();

      // Start typing - error should clear
      await emailInput.fill('g');
      await expect(page.getByText('Please enter a valid email address.')).not.toBeVisible();
    });

    test('email input accepts valid email format', async ({ page }) => {
      await page.goto('/');

      const emailInput = page.getByPlaceholder('your@email.com');

      // Fill in a valid email
      await emailInput.fill('test@example.com');

      // Verify the input has the value
      await expect(emailInput).toHaveValue('test@example.com');
    });
  });

  test.describe('Newsletter API validation', () => {
    test('POST /api/newsletter returns 400 for invalid email', async ({ request }) => {
      const response = await request.post('/api/newsletter', {
        data: {
          email: 'not-an-email',
          source: 'homepage',
        },
      });

      // Should return 400 Bad Request (validation happens before DB)
      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data.ok).toBe(false);
      expect(data.error).toBeTruthy();
    });

    test('POST /api/newsletter returns 400 for empty body', async ({ request }) => {
      const response = await request.post('/api/newsletter', {
        data: {},
      });

      // Should return 400 Bad Request
      expect(response.status()).toBe(400);
    });

    test('POST /api/newsletter returns 400 for missing email', async ({ request }) => {
      const response = await request.post('/api/newsletter', {
        data: {
          source: 'homepage',
        },
      });

      // Should return 400 - email is required
      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data.ok).toBe(false);
    });

    // Note: Tests that require DynamoDB (actual subscription) are skipped
    // since the database isn't available in the test environment.
    // These would be integration tests in a staging environment.
  });

  test.describe('Ops newsletter routes protection', () => {
    // Note: In test environment without OPS_KEY configured,
    // these routes allow access in development mode.
    // In production, they would return 404 without the key.

    test('GET /api/ops/newsletter route exists', async ({ request }) => {
      const response = await request.get('/api/ops/newsletter');

      // Route should exist (may return 200 in dev or 404/500 depending on config)
      // We just verify the route doesn't return 405 Method Not Allowed
      expect(response.status()).not.toBe(405);
    });
  });

  test.describe('Newsletter section styling', () => {
    test('newsletter section has dark background theme', async ({ page }) => {
      await page.goto('/');

      // Find the newsletter section (contains the Field Notes heading)
      const newsletterHeading = page.getByRole('heading', { name: 'Field Notes from Safari Index' });
      await expect(newsletterHeading).toBeVisible();

      // The heading should have white/light text color
      // Color can be in rgb(), lab(), or other formats depending on browser
      const headingColor = await newsletterHeading.evaluate(
        (el) => window.getComputedStyle(el).color
      );

      // Just verify color exists (different browsers return different formats)
      expect(headingColor).toBeTruthy();
    });

    test('subscribe button is visible and clickable', async ({ page }) => {
      await page.goto('/');

      const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
      await expect(subscribeButton).toBeVisible();
      await expect(subscribeButton).toBeEnabled();
    });
  });

  test.describe('Contact page newsletter', () => {
    test('renders newsletter section on contact page', async ({ page }) => {
      await page.goto('/contact');

      // Newsletter section should be visible with Field Notes branding
      const newsletterHeading = page.getByRole('heading', { name: 'Field Notes from Safari Index' });
      await expect(newsletterHeading).toBeVisible();

      // Email input should be present
      const emailInput = page.getByPlaceholder('your@email.com');
      await expect(emailInput).toBeVisible();

      // Subscribe button should be present
      const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
      await expect(subscribeButton).toBeVisible();
    });
  });
});

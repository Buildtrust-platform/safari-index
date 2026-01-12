/**
 * reCAPTCHA v3 Server-Side Verification
 *
 * Verifies reCAPTCHA tokens on the server side.
 * This file must be server-side only (no 'use client').
 *
 * Setup:
 * - Set RECAPTCHA_SECRET_KEY in environment
 */

/**
 * Verify reCAPTCHA v3 token on server side
 *
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - The expected action name (e.g., 'inquiry_submit')
 * @returns Object with success status, optional score, and error message
 */
export async function verifyReCaptchaToken(
  token: string,
  expectedAction: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    // reCAPTCHA not configured, allow request
    console.warn('reCAPTCHA secret key not configured, skipping verification');
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  try {
    // Standard reCAPTCHA v3 verification endpoint
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        error: `Verification failed: ${(data['error-codes'] || []).join(', ')}`
      };
    }

    // Check action matches (reCAPTCHA v3 includes action in response)
    if (data.action && data.action !== expectedAction) {
      console.warn(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`);
      // Don't fail on action mismatch, just log it
    }

    // Score threshold (0.0 - 1.0, higher is more likely human)
    // 0.5 is Google's recommended threshold
    const score = data.score ?? 0;
    if (score < 0.5) {
      return { success: false, score, error: 'Low reCAPTCHA score' };
    }

    return { success: true, score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // Fail open - allow request if verification service is down
    return { success: true };
  }
}

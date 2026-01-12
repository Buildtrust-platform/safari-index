'use client';

/**
 * ReCAPTCHA v3 Integration
 *
 * Invisible reCAPTCHA that runs in the background.
 * Provides spam protection without user interaction.
 *
 * Setup:
 * 1. Get site key from Google reCAPTCHA admin console
 * 2. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in environment
 * 3. Set RECAPTCHA_SECRET_KEY in environment (for server-side verification)
 */

import { useCallback } from 'react';
import Script from 'next/script';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Extend window for reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Hook to get reCAPTCHA v3 token
 */
export function useReCaptcha() {
  const getToken = useCallback(async (action: string): Promise<string | null> => {
    if (!SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return null;
    }

    if (!window.grecaptcha) {
      console.warn('reCAPTCHA not loaded');
      return null;
    }

    return new Promise((resolve) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(SITE_KEY, { action });
          resolve(token);
        } catch (error) {
          console.error('reCAPTCHA error:', error);
          resolve(null);
        }
      });
    });
  }, []);

  return { getToken, isEnabled: !!SITE_KEY };
}

/**
 * ReCAPTCHA v3 script loader component
 * Add this to your layout or the page with forms
 */
export function ReCaptchaProvider({ children }: { children: React.ReactNode }) {
  if (!SITE_KEY) {
    // reCAPTCHA not configured, render children without it
    return <>{children}</>;
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
        strategy="lazyOnload"
      />
      {children}
    </>
  );
}

/**
 * Verify reCAPTCHA v3 token on server side
 * Use this in your API routes
 *
 * Requires:
 * - RECAPTCHA_SECRET_KEY: Your reCAPTCHA secret key
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

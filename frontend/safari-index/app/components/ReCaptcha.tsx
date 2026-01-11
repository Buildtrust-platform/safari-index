'use client';

/**
 * ReCAPTCHA v3 Integration
 *
 * Invisible reCAPTCHA that runs in the background.
 * Provides spam protection without user interaction.
 *
 * Setup:
 * 1. Get site key from Google reCAPTCHA admin console
 * 2. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local
 * 3. Set RECAPTCHA_SECRET_KEY in .env.local (for server-side verification)
 */

import { useEffect, useCallback } from 'react';
import Script from 'next/script';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Extend window for reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Hook to get reCAPTCHA token
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
 * ReCAPTCHA script loader component
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
 * Verify reCAPTCHA token on server side
 * Use this in your API routes
 */
export async function verifyReCaptchaToken(
  token: string,
  expectedAction: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    // reCAPTCHA not configured, allow request
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return { success: false, error: 'reCAPTCHA verification failed' };
    }

    // Check action matches
    if (data.action !== expectedAction) {
      return { success: false, error: 'reCAPTCHA action mismatch' };
    }

    // Score threshold (0.0 - 1.0, higher is more likely human)
    // 0.5 is Google's recommended threshold
    if (data.score < 0.5) {
      return { success: false, score: data.score, error: 'Low reCAPTCHA score' };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // Fail open - allow request if verification service is down
    return { success: true };
  }
}

'use client';

/**
 * ReCAPTCHA Enterprise Integration
 *
 * Invisible reCAPTCHA that runs in the background.
 * Provides spam protection without user interaction.
 *
 * Setup:
 * 1. Get site key from Google Cloud reCAPTCHA Enterprise console
 * 2. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local
 * 3. Set RECAPTCHA_SECRET_KEY (API key) in .env.local (for server-side verification)
 * 4. Set GCP_PROJECT_ID in .env.local (for Enterprise API)
 */

import { useCallback } from 'react';
import Script from 'next/script';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Extend window for reCAPTCHA Enterprise
declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

/**
 * Hook to get reCAPTCHA Enterprise token
 */
export function useReCaptcha() {
  const getToken = useCallback(async (action: string): Promise<string | null> => {
    if (!SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return null;
    }

    if (!window.grecaptcha?.enterprise) {
      console.warn('reCAPTCHA Enterprise not loaded');
      return null;
    }

    return new Promise((resolve) => {
      window.grecaptcha!.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha!.enterprise.execute(SITE_KEY, { action });
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
 * ReCAPTCHA Enterprise script loader component
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
        src={`https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`}
        strategy="lazyOnload"
      />
      {children}
    </>
  );
}

/**
 * Verify reCAPTCHA Enterprise token on server side
 * Use this in your API routes
 *
 * Requires:
 * - RECAPTCHA_SECRET_KEY: Google Cloud API key with reCAPTCHA Enterprise API enabled
 * - GCP_PROJECT_ID: Your Google Cloud project ID
 * - NEXT_PUBLIC_RECAPTCHA_SITE_KEY: The reCAPTCHA site key
 */
export async function verifyReCaptchaToken(
  token: string,
  expectedAction: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const apiKey = process.env.RECAPTCHA_SECRET_KEY;
  const projectId = process.env.GCP_PROJECT_ID;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!apiKey || !projectId || !siteKey) {
    // reCAPTCHA not fully configured, allow request
    console.warn('reCAPTCHA Enterprise not fully configured, skipping verification');
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  try {
    // Enterprise API endpoint
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('reCAPTCHA Enterprise API error:', data.error);
      return { success: false, error: data.error.message || 'API error' };
    }

    // Check token validity
    if (!data.tokenProperties?.valid) {
      return {
        success: false,
        error: `Invalid token: ${data.tokenProperties?.invalidReason || 'unknown'}`
      };
    }

    // Check action matches
    if (data.tokenProperties?.action !== expectedAction) {
      return { success: false, error: 'reCAPTCHA action mismatch' };
    }

    // Score threshold (0.0 - 1.0, higher is more likely human)
    // 0.5 is Google's recommended threshold
    const score = data.riskAnalysis?.score ?? 0;
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

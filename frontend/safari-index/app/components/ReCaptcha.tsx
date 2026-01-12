'use client';

/**
 * ReCAPTCHA v3 Client-Side Integration
 *
 * Invisible reCAPTCHA that runs in the background.
 * Provides spam protection without user interaction.
 *
 * Setup:
 * 1. Get site key from Google reCAPTCHA admin console
 * 2. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in environment
 *
 * For server-side verification, see lib/recaptcha.ts
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

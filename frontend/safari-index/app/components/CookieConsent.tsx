'use client';

/**
 * Cookie Consent Banner
 *
 * GDPR-compliant cookie consent with localStorage persistence.
 * Appears at bottom of screen until user accepts or declines.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';
import { cn } from '../ui/utils';

const CONSENT_KEY = 'vurara-cookie-consent';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage for existing consent
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      setStatus(stored as ConsentStatus);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setStatus('accepted');
    setIsVisible(false);
    // Enable analytics if they were waiting for consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setStatus('declined');
    setIsVisible(false);
    // Disable analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  };

  // Don't render if consent already given
  if (status !== 'pending' || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6',
        'transform transition-transform duration-500',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Icon and text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-1">
                  We use cookies
                </h3>
                <p className="text-sm text-stone-600">
                  We use cookies and similar technologies to improve your experience,
                  analyze site traffic, and understand where our visitors come from.{' '}
                  <Link
                    href="/privacy"
                    className="text-amber-700 hover:text-amber-800 underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 md:flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-sm font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add gtag type to window
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

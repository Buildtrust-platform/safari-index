'use client';

/**
 * Service Capacity Refusal Component
 *
 * Displays a calm, deliberate refusal when the decision service
 * is at capacity (rate limiting, timeouts, etc.)
 *
 * Per UX requirements:
 * - Frame as a safety choice, not a broken system
 * - "At capacity" messaging conveys intentional guardrail
 * - Includes retry with cooldown (15 seconds)
 * - Link to /how-it-works for context
 * - Maintains documentary tone
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '../ui/utils';
import { section } from '../ui/styles';

interface ServiceDegradedRefusalProps {
  reason: string;
  safeNextStep: string;
  onRetry: () => Promise<void>;
}

const COOLDOWN_SECONDS = 15;

export function ServiceDegradedRefusal({
  reason,
  safeNextStep,
  onRetry,
}: ServiceDegradedRefusalProps) {
  const [cooldown, setCooldown] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRetry = useCallback(async () => {
    if (cooldown > 0 || isRetrying) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
      setCooldown(COOLDOWN_SECONDS);
    }
  }, [cooldown, isRetrying, onRetry]);

  const isDisabled = cooldown > 0 || isRetrying;

  return (
    <article
      className={cn(
        'bg-stone-50 border border-stone-200 rounded-xl p-6',
        section
      )}
      role="status"
      aria-live="polite"
      data-testid="service-capacity-refusal"
    >
      {/* Header - calm capacity message */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-5 h-5 text-stone-500"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M6 10h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h2
            className="font-editorial text-lg font-semibold text-stone-800"
            data-testid="capacity-heading"
          >
            At capacity
          </h2>
          <p className="text-stone-600 mt-1">
            We limit concurrent requests to maintain decision quality.
          </p>
        </div>
      </div>

      {/* Explanation block - why this is intentional */}
      <div
        className="bg-white border border-stone-100 rounded-lg p-4 mb-4"
        data-testid="capacity-explanation"
      >
        <p className="text-sm text-stone-600 mb-3">
          This is a deliberate guardrail. When demand exceeds our capacity to produce reliable decisions, we pause rather than risk giving you a weak answer.
        </p>
        <Link
          href="/how-it-works"
          className="text-sm font-medium text-stone-700 hover:text-stone-900 underline underline-offset-2"
          data-testid="how-it-works-link"
        >
          Learn how we make decisions
        </Link>
      </div>

      {/* Retry section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={handleRetry}
          disabled={isDisabled}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            isDisabled
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-stone-900 text-white hover:bg-stone-800'
          )}
          aria-disabled={isDisabled}
          data-testid="retry-button"
        >
          {isRetrying ? 'Checking...' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Try again'}
        </button>

        <p className="text-sm text-stone-500">
          Capacity typically clears within seconds.
        </p>
      </div>
    </article>
  );
}

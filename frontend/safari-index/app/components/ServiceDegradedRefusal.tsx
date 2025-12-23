'use client';

/**
 * Service Degraded Refusal Component
 *
 * Displays a calm, authoritative refusal when the decision service
 * is temporarily unavailable (rate limiting, timeouts, etc.)
 *
 * Per UX requirements:
 * - Not a panic state (no red alerts)
 * - Includes retry with cooldown (15 seconds)
 * - Shows safe_next_step from refusal
 * - Maintains documentary tone
 */

import { useState, useEffect, useCallback } from 'react';
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
        'bg-amber-50/50 border border-amber-200/60 rounded-xl p-6',
        section
      )}
      role="status"
      aria-live="polite"
    >
      {/* Header with icon */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-5 h-5 text-amber-600"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M10 6v4M10 13v1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-editorial text-lg font-semibold text-amber-900">
            Temporarily unavailable
          </h2>
          <p className="text-amber-800 mt-1">{reason}</p>
        </div>
      </div>

      {/* Safe next step */}
      <div className="bg-white/60 border border-amber-100 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-amber-900 mb-1">Next step</p>
        <p className="text-amber-700">{safeNextStep}</p>
      </div>

      {/* Retry button */}
      <div className="flex items-center gap-4">
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
        >
          {isRetrying ? 'Checking...' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Try again'}
        </button>

        {/* Persistence note */}
        <p className="text-sm text-stone-500">
          If this persists, return in a few minutes.
        </p>
      </div>
    </article>
  );
}

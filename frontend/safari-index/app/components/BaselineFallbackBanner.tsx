'use client';

/**
 * Baseline Fallback Banner
 *
 * Displays a calm, informative banner when rendering a baseline decision
 * due to live service being at capacity.
 *
 * Per requirements:
 * - Title: "Baseline decision (no custom inputs)"
 * - Explains live service is at capacity
 * - Notes this is a stable reference
 * - Includes "Try live decision again" button with cooldown
 * - Visually calm (Surface/Inset), not alarming
 * - Documentary tone, no hype
 */

import { useState, useEffect, useCallback } from 'react';
import { cn } from '../ui/utils';

interface BaselineFallbackBannerProps {
  topicId: string;
  onRetry: () => Promise<void>;
}

const COOLDOWN_SECONDS = 15;

export function BaselineFallbackBanner({
  topicId,
  onRetry,
}: BaselineFallbackBannerProps) {
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
    <div
      className="bg-amber-50/80 border border-amber-200/60 rounded-lg px-4 py-3 mb-6"
      role="status"
      aria-live="polite"
      data-testid="baseline-fallback-banner"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <h2
            className="font-ui text-sm font-medium text-amber-900"
            data-testid="baseline-banner-title"
          >
            Baseline decision (no custom inputs)
          </h2>
          <p className="text-sm text-amber-800/80 mt-1">
            The live decision service is at capacity. This baseline provides a stable reference using default assumptions. Try again later for a decision tailored to your inputs.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={isDisabled}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors',
            isDisabled
              ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
              : 'bg-amber-800 text-white hover:bg-amber-900'
          )}
          aria-disabled={isDisabled}
          data-testid="baseline-retry-button"
        >
          {isRetrying
            ? 'Checking...'
            : cooldown > 0
              ? `Try again in ${cooldown}s`
              : 'Try live decision again'}
        </button>
      </div>
    </div>
  );
}

/**
 * Skeleton Components
 *
 * Loading states that match the layout structure.
 * Per 03_ux_flow.md: Calm loading, no spinners or urgency.
 */

'use client';

import { cn } from './utils';

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton block with pulse animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Text line skeleton
 */
export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
            className
          )}
        />
      ))}
    </div>
  );
}

/**
 * Heading skeleton
 */
export function SkeletonHeading({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-8 w-3/4', className)} />;
}

/**
 * Verdict card skeleton - matches VerdictCard layout
 */
export function SkeletonVerdictCard() {
  return (
    <div
      className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg"
      aria-label="Loading decision"
      role="status"
    >
      <Skeleton className="h-6 w-20 mb-3" />
      <Skeleton className="h-7 w-2/3 mb-4" />
      <SkeletonText lines={3} />
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * Section skeleton - generic section with heading and content
 */
export function SkeletonSection({ lines = 3 }: { lines?: number }) {
  return (
    <div className="mb-8" aria-hidden="true">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-4 w-4 mt-0.5 shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full decision page skeleton
 */
export function SkeletonDecisionPage() {
  return (
    <div role="status" aria-label="Loading decision page">
      <span className="sr-only">Loading decision...</span>

      {/* Title and context */}
      <SkeletonHeading className="mb-2" />
      <Skeleton className="h-5 w-1/2 mb-8" />

      {/* Verdict card */}
      <SkeletonVerdictCard />

      {/* Trade-offs */}
      <SkeletonSection lines={4} />

      {/* Fit/Misfit */}
      <SkeletonSection lines={4} />

      {/* Assumptions */}
      <SkeletonSection lines={3} />

      {/* Change conditions */}
      <SkeletonSection lines={3} />
    </div>
  );
}

/**
 * Embed skeleton - compact version for iframe
 */
export function SkeletonEmbed() {
  return (
    <div
      className="p-4 bg-white"
      role="status"
      aria-label="Loading embed"
    >
      <span className="sr-only">Loading...</span>
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-6 w-1/2 mb-3" />
      <SkeletonText lines={2} />
    </div>
  );
}

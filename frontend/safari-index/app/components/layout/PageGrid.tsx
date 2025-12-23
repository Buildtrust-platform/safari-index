/**
 * PageGrid Layout Component
 *
 * Staging-only responsive grid layout with:
 * - Main column (max reading measure)
 * - Optional right "meta rail" (narrow column)
 *
 * Responsive:
 * - Desktop (md+): 2 columns side by side
 * - Mobile: single column with meta rail collapsing below header
 *
 * Does NOT change production pages - gated by isBuildMode() in parent components.
 */

import { type ReactNode } from 'react';
import { cn } from '../../ui/utils';

interface PageGridProps {
  /** Main content column */
  children: ReactNode;
  /** Optional meta rail content (narrow right column) */
  metaRail?: ReactNode;
  /** Additional className for the grid container */
  className?: string;
  /** Max width variant */
  maxWidth?: 'narrow' | 'default' | 'wide';
  /** Whether to center the grid */
  centered?: boolean;
}

const maxWidthClasses = {
  narrow: 'max-w-2xl',
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
};

/**
 * PageGrid - Responsive two-column layout
 *
 * When metaRail is provided:
 * - Desktop: main content left (2/3), meta rail right (1/3)
 * - Mobile: meta rail appears below header, main content below
 *
 * When metaRail is not provided:
 * - Single column centered layout (main column only)
 */
export function PageGrid({
  children,
  metaRail,
  className,
  maxWidth = 'default',
  centered = true,
}: PageGridProps) {
  const containerClasses = cn(
    maxWidthClasses[maxWidth],
    centered && 'mx-auto',
    'px-4 py-12',
    className
  );

  // Single column mode (no meta rail)
  if (!metaRail) {
    return (
      <div className={containerClasses} data-testid="page-grid">
        {children}
      </div>
    );
  }

  // Two column mode with meta rail
  return (
    <div className={containerClasses} data-testid="page-grid">
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        {/* Meta rail - appears first in DOM for mobile, positioned right on desktop */}
        <aside
          className="lg:order-2 mb-8 lg:mb-0"
          data-testid="meta-rail-container"
          aria-label="Page metadata"
        >
          {metaRail}
        </aside>
        {/* Main content */}
        <main className="lg:order-1 min-w-0" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * PageGridMain - Wrapper for main content area
 * Use when you need semantic separation within PageGrid
 */
export function PageGridMain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-8', className)} data-testid="page-grid-main">
      {children}
    </div>
  );
}

/**
 * PageGridSection - Section within main content
 */
export function PageGridSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn('', className)}>{children}</section>;
}

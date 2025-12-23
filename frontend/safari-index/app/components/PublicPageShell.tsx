/**
 * PublicPageShell
 *
 * Shared layout wrapper for public-facing pages:
 * - /decisions/[slug]
 * - /embed/decision/[id]
 * - /assurance/[id]
 *
 * Provides:
 * - Consistent max-width, padding, spacing
 * - Skip link for accessibility
 * - Semantic landmarks (header slot, main, footer slot)
 *
 * Does NOT change:
 * - Any copy or content
 * - Any CTAs or flows
 * - Footer text (accepts footer as slot)
 */

import React from 'react';

interface PublicPageShellProps {
  children: React.ReactNode;
  /** Optional header content (renders in <header> landmark) */
  header?: React.ReactNode;
  /** Optional footer content (renders in <footer> landmark) */
  footer?: React.ReactNode;
  /** Additional className for main element */
  mainClassName?: string;
  /** Variant for different page types */
  variant?: 'default' | 'embed' | 'assurance';
}

export function PublicPageShell({
  children,
  header,
  footer,
  mainClassName = '',
  variant = 'default',
}: PublicPageShellProps) {
  // Consistent max-width based on variant
  const maxWidthClass = variant === 'embed' ? 'max-w-[600px]' : 'max-w-2xl';

  return (
    <>
      {/* Skip link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900 focus:underline"
      >
        Skip to main content
      </a>

      {/* Optional header landmark */}
      {header && (
        <header className={`${maxWidthClass} mx-auto px-4`}>
          {header}
        </header>
      )}

      {/* Main content landmark */}
      <main
        id="main-content"
        className={`${maxWidthClass} mx-auto px-4 py-12 ${mainClassName}`.trim()}
      >
        {children}
      </main>

      {/* Optional footer landmark */}
      {footer && (
        <footer className={`${maxWidthClass} mx-auto px-4 pb-8`}>
          {footer}
        </footer>
      )}
    </>
  );
}

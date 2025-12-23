/**
 * StagingShell
 *
 * Staging-only layout wrapper for build-mode pages:
 * - /explore
 * - /compare
 * - /dev/*
 *
 * Provides:
 * - Minimal header with navigation links
 * - Staging indicator badge
 * - Consistent container with semantic landmarks
 * - Skip link for accessibility
 *
 * Per governance:
 * - 01_brand_voice.md: Calm, non-marketing tone
 * - 03_ux_flow.md: Single primary column
 * - 04_metrics_truth.md: No tracking/cookies
 * - 13_frontend_templates.md: Semantic HTML/ARIA
 * - MVP_FREEZE.md: Staging-only, production unchanged
 *
 * Does NOT appear in production (observation mode).
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isBuildMode } from '../../lib/app-mode';
import { focusRing } from '../ui/styles';

interface StagingShellProps {
  children: React.ReactNode;
}

/**
 * Navigation link with active state
 */
function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${focusRing} ${
        isActive
          ? 'bg-amber-100 text-amber-800 font-medium'
          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

/**
 * Staging indicator badge
 */
function StagingBadge() {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full"
      aria-label="Staging environment"
    >
      Staging
    </span>
  );
}

export function StagingShell({ children }: StagingShellProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // In observation mode or during SSR, render nothing
  if (!mounted || !isBuildMode()) {
    return null;
  }

  // Determine active nav item
  const isExploreActive = pathname === '/explore';
  const isCompareActive = pathname === '/compare';
  const isDevActive = pathname?.startsWith('/dev');

  return (
    <>
      {/* Skip link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-stone-900 focus:underline focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header with navigation */}
      <header
        className="border-b border-stone-200 bg-white"
        role="banner"
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Navigation links */}
            <nav
              className="flex items-center gap-1"
              role="navigation"
              aria-label="Staging navigation"
            >
              <NavLink href="/explore" isActive={isExploreActive}>
                Explore
              </NavLink>
              <NavLink href="/compare" isActive={isCompareActive}>
                Compare
              </NavLink>
              {isDevActive && (
                <NavLink href="/dev/topic-health" isActive={true}>
                  Dev Tools
                </NavLink>
              )}
            </nav>

            {/* Right: Staging indicator */}
            <StagingBadge />
          </div>
        </div>
      </header>

      {/* Main content - pages provide their own container and footer */}
      <main id="main-content" role="main">
        {children}
      </main>
    </>
  );
}

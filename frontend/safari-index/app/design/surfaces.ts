/**
 * Surface System v1 - Editorial Safari Authority
 *
 * Per 01_brand_voice.md:
 * - Calm, spacious layout
 * - No busy sections
 * - Whitespace is intentional
 *
 * Per 03_ux_flow.md:
 * - Reduce cognitive load
 * - If a screen feels "busy", it is violating the law
 *
 * Per task: Reduce "card spam" - use Surface + Divider instead of nested cards.
 *
 * STAGING-ONLY: Gated by isBuildMode() in consuming components.
 */

import { colors, shadow, radius, spacing } from './tokens';

// =============================================================================
// SURFACE VARIANTS
// =============================================================================
// Different visual treatments for content containers.

export type SurfaceVariant =
  | 'page'      // Top-level page background
  | 'elevated'  // Slightly lifted content area
  | 'inset'     // Recessed/grouped content
  | 'outline'   // Bordered without fill
  | 'ghost'     // No visible container
  | 'outcome'   // Decision verdict surfaces
  | 'warning'   // Caution/dev notices
  | 'info';     // Informational notices

export const surfaceStyles = {
  /**
   * page - Main page background
   * Paper-toned, no visible borders.
   */
  page: {
    background: colors.paper.base,
    border: 'none',
    shadow: shadow.none,
    radius: radius.none,
  },

  /**
   * elevated - Primary content cards
   * Subtle lift for important content sections.
   */
  elevated: {
    background: colors.neutral[0],
    border: `1px solid ${colors.paper.border}`,
    shadow: shadow.sm,
    radius: radius.lg,
  },

  /**
   * inset - Secondary/nested content
   * Recessed appearance for grouped items.
   */
  inset: {
    background: colors.paper.surface,
    border: `1px solid ${colors.paper.border}`,
    shadow: shadow.none,
    radius: radius.md,
  },

  /**
   * outline - Bordered without fill
   * For lists, options, selections.
   */
  outline: {
    background: 'transparent',
    border: `1px solid ${colors.paper.border}`,
    shadow: shadow.none,
    radius: radius.md,
  },

  /**
   * ghost - No visible container
   * Content groups without visual boundaries.
   */
  ghost: {
    background: 'transparent',
    border: 'none',
    shadow: shadow.none,
    radius: radius.none,
  },

  /**
   * outcome - Decision verdict surfaces
   * Colored based on outcome type.
   */
  outcome: {
    background: 'var(--outcome-bg)',
    border: '1px solid var(--outcome-border)',
    shadow: shadow.none,
    radius: radius.lg,
  },

  /**
   * warning - Caution notices
   * Dev-only banners, staging indicators.
   */
  warning: {
    background: colors.status.watch.bg,
    border: `1px solid ${colors.status.watch.border}`,
    shadow: shadow.none,
    radius: radius.md,
  },

  /**
   * info - Informational notices
   * Neutral information blocks.
   */
  info: {
    background: colors.paper.surface,
    border: `1px solid ${colors.paper.border}`,
    shadow: shadow.none,
    radius: radius.md,
  },
} as const;

// =============================================================================
// TAILWIND CLASS COMPOSITIONS
// =============================================================================
// Ready-to-use Tailwind class strings with semantic colors.
// Note: Using neutral-* classes that map to paper colors via CSS custom properties

export const surfaceClasses = {
  /** Page-level container - paper background */
  page: 'bg-neutral-50',

  /** Elevated card with subtle shadow */
  elevated: 'bg-white border border-neutral-300 shadow-sm rounded-lg',

  /** Inset/recessed content */
  inset: 'bg-neutral-100 border border-neutral-300 rounded-md',

  /** Outline only, no fill */
  outline: 'border border-neutral-300 rounded-md',

  /** No visible container */
  ghost: '',

  /** Warning/caution surface - amber tones for dev notices */
  warning: 'bg-amber-50 border border-amber-200 rounded-md',

  /** Info surface */
  info: 'bg-neutral-100 border border-neutral-300 rounded-md',
} as const;

// =============================================================================
// SURFACE PADDING PRESETS
// =============================================================================
// Consistent internal spacing for surfaces.

export const surfacePadding = {
  /** Compact - badges, inline elements */
  compact: spacing.sm,
  /** Default - cards, sections */
  default: spacing.lg,
  /** Spacious - major content blocks */
  spacious: spacing.xl,
  /** Hero - page-level sections */
  hero: spacing['2xl'],
} as const;

export const paddingClasses = {
  compact: 'p-2',
  default: 'p-6',
  spacious: 'p-8',
  hero: 'p-12',
} as const;

// =============================================================================
// OUTCOME SURFACE CLASSES
// =============================================================================
// Pre-composed classes for each decision outcome with safari-industry colors.
// Uses custom CSS properties defined in globals.css

export const outcomeSurfaceClasses = {
  book: 'bg-outcome-book-bg border border-outcome-book-border rounded-lg',
  wait: 'bg-outcome-wait-bg border border-outcome-wait-border rounded-lg',
  switch: 'bg-outcome-switch-bg border border-outcome-switch-border rounded-lg',
  discard: 'bg-outcome-discard-bg border border-outcome-discard-border rounded-lg',
  refused: 'bg-neutral-50 border border-neutral-300 rounded-lg',
} as const;

// =============================================================================
// STATUS SURFACE CLASSES
// =============================================================================
// For health dashboards and dev tools.

export const statusSurfaceClasses = {
  healthy: 'bg-outcome-book-bg border border-outcome-book-border',
  watch: 'bg-outcome-wait-bg border border-outcome-wait-border',
  critical: 'bg-outcome-discard-bg border border-outcome-discard-border',
  unknown: 'bg-neutral-50 border border-neutral-300',
} as const;

// =============================================================================
// DIVIDER STYLES
// =============================================================================
// Subtle section separators using paper border color.

export const dividerClasses = {
  /** Full-width horizontal divider */
  horizontal: 'border-t border-neutral-300',
  /** Horizontal with margin */
  horizontalSpaced: 'border-t border-neutral-300 my-6',
  /** Vertical divider */
  vertical: 'border-l border-neutral-300',
  /** Dashed divider for visual grouping */
  dashed: 'border-t border-dashed border-neutral-300',
} as const;

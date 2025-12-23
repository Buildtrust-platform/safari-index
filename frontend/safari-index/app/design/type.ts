/**
 * Typography System v1 - Editorial Safari Authority
 *
 * Per 01_brand_voice.md:
 * - Typography carries authority, not decoration
 * - No "hero marketing" type ramps
 * - Calm, factual presentation
 *
 * Per 13_frontend_templates.md:
 * - Use 3 levels only: Page Title, Section Heading, Body text
 * - Avoid decorative typography
 *
 * Typography Rule:
 * - If content is READ → use Source Serif 4 (editorial)
 * - If content is OPERATED → use Inter (UI)
 *
 * Visual Direction:
 * - Headlines feel like field notes or expert judgments
 * - Strong presence without decoration
 * - Generous spacing for documentary feel
 *
 * STAGING-ONLY: Gated by isBuildMode() in consuming components.
 */

// =============================================================================
// FONT FAMILY
// =============================================================================
// Editorial + UI typeface pairing for safari authority.

export const fontFamily = {
  /** Editorial - headings, long-form, explanations (Source Serif 4) */
  editorial: 'var(--font-editorial), Georgia, "Times New Roman", serif',
  /** UI - buttons, labels, meta, controls (Inter) */
  ui: 'var(--font-ui), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  /** Monospace for code/data */
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
} as const;

// =============================================================================
// FONT SIZE SCALE
// =============================================================================
// Restrained scale. No dramatic jumps. Clarity over impact.

export const fontSize = {
  /** 11px - Fine print, attribution */
  xs: '0.6875rem',
  /** 13px - Metadata, labels, secondary */
  sm: '0.8125rem',
  /** 15px - Body text base */
  base: '0.9375rem',
  /** 17px - Emphasized body, lead paragraphs */
  lg: '1.0625rem',
  /** 20px - Section headings (h3) */
  xl: '1.25rem',
  /** 24px - Major headings (h2) */
  '2xl': '1.5rem',
  /** 30px - Page titles (h1) */
  '3xl': '1.875rem',
  /** 36px - Display/hero (rare) */
  display: '2.25rem',
} as const;

// =============================================================================
// LINE HEIGHT
// =============================================================================
// Generous line heights for readability. Editorial standard: 1.6-1.7.

export const lineHeight = {
  /** 1.0 - Display text only */
  none: '1',
  /** 1.25 - Headings */
  tight: '1.25',
  /** 1.4 - Compact text */
  snug: '1.4',
  /** 1.5 - Default body */
  normal: '1.5',
  /** 1.65 - Editorial reading */
  relaxed: '1.65',
  /** 1.75 - Maximum readability */
  loose: '1.75',
} as const;

// =============================================================================
// FONT WEIGHT
// =============================================================================
// Minimal weight variation. Authority through restraint.

export const fontWeight = {
  /** 400 - Body text, most content */
  normal: '400',
  /** 500 - Subtle emphasis, labels */
  medium: '500',
  /** 600 - Headings, strong emphasis */
  semibold: '600',
  /** 700 - Rare, only for critical verdicts */
  bold: '700',
} as const;

// =============================================================================
// LETTER SPACING
// =============================================================================
// Minimal tracking adjustments.

export const letterSpacing = {
  /** -0.025em - Large display text */
  tight: '-0.025em',
  /** 0 - Default */
  normal: '0',
  /** 0.025em - Small text legibility */
  wide: '0.025em',
  /** 0.05em - Uppercase labels */
  wider: '0.05em',
} as const;

// =============================================================================
// MEASURE (LINE LENGTH)
// =============================================================================
// Optimal character counts per line.

export const measure = {
  /** ~45 characters - Narrow/captions */
  narrow: '20rem',
  /** ~65 characters - Optimal reading */
  normal: '42rem',
  /** ~80 characters - Wide content */
  wide: '56rem',
} as const;

// =============================================================================
// TEXT COLOR CLASSES
// =============================================================================
// Semantic text colors tied to editorial ink palette.

export const textColor = {
  /** Primary text - highest contrast (#1F1F1D) */
  primary: 'text-ink-primary',
  /** Secondary text - body text (#2E2E2A) */
  secondary: 'text-ink-body',
  /** Muted text - meta/secondary (#6B6A63) */
  muted: 'text-ink-meta',
  /** Disabled text (#9A978F) */
  disabled: 'text-ink-muted',
  /** Inverse text on dark backgrounds */
  inverse: 'text-white',
} as const;

// =============================================================================
// TYPOGRAPHY STYLES (Composite)
// =============================================================================
// Ready-to-use style compositions for common text elements.

export const textStyles = {
  /**
   * Display - Hero text, landing pages only
   * Rarely used. Reserved for absolute top-level messaging.
   * Uses editorial font (Source Serif 4).
   */
  display: {
    fontFamily: fontFamily.editorial,
    fontSize: fontSize.display,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },

  /**
   * h1 - Page titles
   * One per page. Clear, direct question or statement.
   * Uses editorial font (Source Serif 4).
   */
  h1: {
    fontFamily: fontFamily.editorial,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },

  /**
   * h2 - Section headings
   * Primary content divisions. "Verdict", "Trade-offs", etc.
   * Uses editorial font (Source Serif 4).
   */
  h2: {
    fontFamily: fontFamily.editorial,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },

  /**
   * h3 - Subsection headings
   * Within sections. "Gains", "Losses", "Assumptions".
   * Uses editorial font (Source Serif 4).
   */
  h3: {
    fontFamily: fontFamily.editorial,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },

  /**
   * h4 - Minor headings
   * Card titles, list group labels.
   * Uses UI font (Inter).
   */
  h4: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },

  /**
   * body - Default body text
   * Most prose content. Editorial long-form.
   * Uses editorial font (Source Serif 4).
   */
  body: {
    fontFamily: fontFamily.editorial,
    fontSize: fontSize.base,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  /**
   * lead - Emphasized opening paragraph
   * First paragraph of sections, summaries.
   * Uses editorial font (Source Serif 4).
   */
  lead: {
    fontFamily: fontFamily.editorial,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  /**
   * meta - Metadata, timestamps, IDs
   * Attribution, version info, dates.
   * Uses UI font (Inter).
   */
  meta: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  /**
   * label - Form labels, category tags
   * Uppercase optional for category labels.
   * Uses UI font (Inter).
   */
  label: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },

  /**
   * caption - Fine print, legal, footnotes
   * Smallest text. Still legible.
   * Uses UI font (Inter).
   */
  caption: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  /**
   * mono - Code, IDs, technical data
   * Monospace for alignment and distinction.
   */
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

// =============================================================================
// TAILWIND CLASS HELPERS
// =============================================================================
// Pre-composed Tailwind classes for each text style.
// font-editorial = Source Serif 4, font-ui = Inter

export const textClasses = {
  /** Display - cinematic authority, documentary title feel */
  display: 'font-editorial text-4xl font-bold leading-tight tracking-tight',
  /** H1 - field note headline, expert judgment presence */
  h1: 'font-editorial text-3xl font-semibold leading-snug tracking-tight',
  /** H2 - section authority, clear division */
  h2: 'font-editorial text-2xl font-semibold leading-snug',
  /** H3 - subsection, still authoritative */
  h3: 'font-editorial text-xl font-semibold leading-snug',
  /** H4 - card titles, minor headings */
  h4: 'font-ui text-lg font-medium leading-snug',
  /** Body - generous reading rhythm */
  body: 'font-editorial text-base leading-relaxed',
  /** Lead - emphasized opening, documentary narration feel */
  lead: 'font-editorial text-lg leading-loose',
  /** Meta - timestamps, IDs, attribution */
  meta: 'font-ui text-sm leading-normal tracking-wide',
  /** Label - form labels, category tags */
  label: 'font-ui text-sm font-medium leading-normal tracking-wide',
  /** Caption - fine print */
  caption: 'font-ui text-xs leading-normal tracking-wide',
  /** Mono - code, technical data */
  mono: 'font-mono text-sm leading-normal',
} as const;

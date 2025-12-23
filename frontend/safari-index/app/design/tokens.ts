/**
 * Design Tokens v1 - Editorial Safari Authority
 *
 * Per 01_brand_voice.md:
 * - Calm, observational, measured, precise
 * - Typography carries authority, not decoration
 * - Spacious layout matches calm text
 *
 * Per 03_ux_flow.md:
 * - Clarity over decoration
 * - Whitespace is functional, not decorative
 * - Reduce cognitive load
 *
 * Color Rule:
 * - Color must explain state, not decorate UI
 * - If a color does not convey meaning, it must be neutral
 *
 * These tokens define the visual vocabulary of Safari Index.
 * STAGING-ONLY: Gated by isBuildMode() in consuming components.
 */

// =============================================================================
// SPACING SCALE
// =============================================================================
// Consistent spacing creates rhythm and reduces visual noise.
// Based on 4px base unit for predictable relationships.

export const spacing = {
  /** 4px - Micro spacing for tight elements */
  xs: '0.25rem',
  /** 8px - Compact spacing for related items */
  sm: '0.5rem',
  /** 16px - Default spacing for most contexts */
  md: '1rem',
  /** 24px - Comfortable spacing between groups */
  lg: '1.5rem',
  /** 32px - Section separation */
  xl: '2rem',
  /** 48px - Major section breaks */
  '2xl': '3rem',
  /** 64px - Page-level spacing */
  '3xl': '4rem',
  /** 96px - Hero-level whitespace */
  '4xl': '6rem',
} as const;

// =============================================================================
// RADIUS SCALE
// =============================================================================
// Subtle, refined corners. Not rounded-full pills everywhere.

export const radius = {
  /** No rounding */
  none: '0',
  /** 2px - Subtle softening for inline elements */
  xs: '0.125rem',
  /** 4px - Default for badges, small elements */
  sm: '0.25rem',
  /** 6px - Cards, inputs, buttons */
  md: '0.375rem',
  /** 8px - Larger surfaces */
  lg: '0.5rem',
  /** Full rounding for pills/avatars */
  full: '9999px',
} as const;

// =============================================================================
// BORDER TOKENS
// =============================================================================
// Understated borders that define without shouting.

export const border = {
  /** No border */
  none: 'none',
  /** Subtle divider */
  thin: '1px solid',
  /** Standard border */
  default: '1px solid',
  /** Emphasis border */
  medium: '2px solid',
} as const;

// =============================================================================
// SHADOW TOKENS
// =============================================================================
// Minimal shadows. Flat design with subtle depth cues.

export const shadow = {
  /** No shadow */
  none: 'none',
  /** Barely perceptible lift */
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  /** Subtle elevation for cards */
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  /** Medium elevation for modals/dropdowns */
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
  /** Focus ring shadow */
  focus: '0 0 0 2px rgb(31 31 29 / 0.15)',
} as const;

// =============================================================================
// COLOR TOKENS - EDITORIAL SAFARI PALETTE
// =============================================================================
// Paper-toned backgrounds. Editorial ink text. Safari-industry signal colors.

export const colors = {
  // ---------------------------------------------------------------------------
  // Paper backgrounds - Warm earth-toned safari palette
  // Evokes: aged field journals, sun-bleached savannah grass, dusty trails
  // ---------------------------------------------------------------------------
  paper: {
    /** Page background - warm parchment, sunlit paper */
    base: '#F5F1E8',
    /** Surface (cards/sections) - aged journal page */
    surface: '#EDE8DC',
    /** Inset / secondary surface - dusty trail tone */
    inset: '#E3DBCC',
    /** Dividers / borders - dried grass edge */
    border: '#CFC4B0',
  },

  // ---------------------------------------------------------------------------
  // Sun/Gold accent - African sun, not luxury
  // Reserved for atmospheric highlights, not decoration
  // ---------------------------------------------------------------------------
  sun: {
    /** Golden hour light */
    base: '#C4973B',
    /** Softer sun highlight */
    soft: '#D4A94A',
    /** Warmest paper, touched by sun */
    bg: '#FAF6EB',
    /** Sun-kissed edge */
    border: '#E8D5A8',
  },

  // ---------------------------------------------------------------------------
  // Ink colors - editorial text hierarchy
  // ---------------------------------------------------------------------------
  ink: {
    /** Primary text - headings, emphasis */
    primary: '#1F1F1D',
    /** Body text - standard reading */
    body: '#2E2E2A',
    /** Meta / secondary text - timestamps, labels */
    meta: '#6B6A63',
    /** Muted / disabled */
    muted: '#9A978F',
  },

  // ---------------------------------------------------------------------------
  // Neutral base - for UI elements that need white
  // ---------------------------------------------------------------------------
  neutral: {
    0: '#ffffff',
    50: '#F5F1E8',    // Alias: paper.base (warm parchment)
    100: '#EDE8DC',   // Alias: paper.surface (aged journal)
    200: '#E3DBCC',   // Alias: paper.inset (dusty trail)
    300: '#CFC4B0',   // Alias: paper.border (dried grass)
    400: '#9A978F',   // Alias: ink.muted
    500: '#6B6A63',   // Alias: ink.meta
    600: '#2E2E2A',   // Alias: ink.body
    700: '#1F1F1D',   // Alias: ink.primary
    800: '#1A1A18',
    900: '#0F0F0E',
    950: '#050504',
  },

  // ---------------------------------------------------------------------------
  // Outcome colors - decision verdicts (Safari-industry standard)
  // Per 02_decision_doctrine: book|wait|switch|discard|refused
  // Signal colors - USED ONLY WHEN MEANINGFUL
  // ---------------------------------------------------------------------------
  outcome: {
    book: {
      base: '#2F5D50',      // Safari green: affirmative but not celebratory
      bg: '#EDF5F2',        // Very subtle tint
      border: '#C5DDD5',
      text: '#1F4038',
    },
    wait: {
      base: '#8C6D2E',      // Savannah amber: caution without alarm
      bg: '#F7F3E8',
      border: '#E5D9B8',
      text: '#5C4720',
    },
    switch: {
      base: '#3E5C76',      // Safari blue-slate: alternative, not wrong
      bg: '#EEF2F6',
      border: '#C5D3DE',
      text: '#2A3F52',
    },
    discard: {
      base: '#8A3F3B',      // Muted terracotta: clear no, but not aggressive
      bg: '#F6EDEC',
      border: '#E0C5C3',
      text: '#5E2A28',
    },
    refused: {
      base: '#6B6A63',      // Ink meta: no judgment, just incomplete
      bg: '#F6F4EF',        // Paper base
      border: '#D2CCC1',    // Paper border
      text: '#2E2E2A',
    },
  },

  // ---------------------------------------------------------------------------
  // Refusal colors - when decision cannot be issued
  // ---------------------------------------------------------------------------
  refusal: {
    /** Background - very subtle */
    bg: '#F4ECEB',
    /** Text/Icon */
    text: '#7A2E2A',
    /** Border */
    border: '#E0C5C3',
  },

  // ---------------------------------------------------------------------------
  // Status colors - for health dashboards, dev tools
  // Uses outcome colors for semantic consistency
  // ---------------------------------------------------------------------------
  status: {
    healthy: {
      base: '#2F5D50',      // Same as outcome.book
      bg: '#EDF5F2',
      border: '#C5DDD5',
    },
    watch: {
      base: '#8C6D2E',      // Same as outcome.wait
      bg: '#F7F3E8',
      border: '#E5D9B8',
    },
    critical: {
      base: '#8A3F3B',      // Same as outcome.discard
      bg: '#F6EDEC',
      border: '#E0C5C3',
    },
    unknown: {
      base: '#6B6A63',      // Same as ink.meta
      bg: '#F6F4EF',
      border: '#D2CCC1',
    },
  },

  // ---------------------------------------------------------------------------
  // Severity colors - for improvement suggestions
  // ---------------------------------------------------------------------------
  severity: {
    high: {
      base: '#8A3F3B',
      bg: '#F6EDEC',
    },
    medium: {
      base: '#8C6D2E',
      bg: '#F7F3E8',
    },
    low: {
      base: '#6B6A63',
      bg: '#F6F4EF',
    },
  },

  // ---------------------------------------------------------------------------
  // Interactive colors - for focus, hover states
  // ---------------------------------------------------------------------------
  interactive: {
    primary: '#1F1F1D',       // Ink primary: primary actions
    primaryHover: '#0F0F0E',  // Darker ink
    secondary: '#2E2E2A',     // Ink body: secondary text/actions
    link: '#2E2E2A',          // Ink body: understated links
    linkHover: '#1F1F1D',     // Ink primary
    focus: '#1F1F1D',         // Ink primary: focus rings
  },
} as const;

// =============================================================================
// LAYOUT TOKENS
// =============================================================================
// Consistent content widths and container behavior.

export const layout = {
  /** Max width for reading content - optimal measure */
  maxMeasure: '42rem',      // 672px - ~65 characters
  /** Wider max for tables/comparisons */
  maxWide: '56rem',         // 896px
  /** Container horizontal padding */
  containerPx: '1rem',
  /** Container vertical padding */
  containerPy: '3rem',
  /** Section spacing */
  sectionGap: '2rem',
} as const;

// =============================================================================
// TRANSITION TOKENS
// =============================================================================
// Subtle, fast transitions. No flashy animations.

export const transition = {
  /** Fast - hover states, focus */
  fast: '100ms ease-out',
  /** Normal - most interactions */
  normal: '150ms ease-out',
  /** Slow - expanding content */
  slow: '200ms ease-out',
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================
// Predictable stacking.

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  tooltip: 40,
} as const;

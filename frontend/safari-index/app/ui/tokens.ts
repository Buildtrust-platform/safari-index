/**
 * Design Tokens
 *
 * Per 01_brand_voice.md: Calm, factual, no urgency
 * Per 03_ux_flow.md: Clarity over decoration
 *
 * These tokens define visual consistency without affecting content.
 */

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

export const typography = {
  // Font sizes
  size: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
  },
  // Line heights
  leading: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
  // Font weights
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
  },
} as const;

export const colors = {
  // Neutral palette - calm, professional
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Semantic colors - minimal, purposeful
  outcome: {
    book: '#166534',      // green-800
    wait: '#a16207',      // yellow-700
    switch: '#1e40af',    // blue-800
    discard: '#991b1b',   // red-800
    refused: '#6b7280',   // gray-500
  },
  // Status colors
  status: {
    healthy: '#166534',
    warning: '#a16207',
    critical: '#991b1b',
  },
  // Background tints for outcome cards
  outcomeBg: {
    book: '#f0fdf4',      // green-50
    wait: '#fefce8',      // yellow-50
    switch: '#eff6ff',    // blue-50
    discard: '#fef2f2',   // red-50
    refused: '#f9fafb',   // gray-50
  },
  // Border colors for outcome cards
  outcomeBorder: {
    book: '#bbf7d0',      // green-200
    wait: '#fef08a',      // yellow-200
    switch: '#bfdbfe',    // blue-200
    discard: '#fecaca',   // red-200
    refused: '#e5e7eb',   // gray-200
  },
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  full: '9999px',
} as const;

export const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
} as const;

export const layout = {
  maxWidth: '42rem',      // 672px - max content width
  containerPadding: '1rem',
  sectionSpacing: '2rem', // space between major sections
} as const;

export const transition = {
  fast: '150ms ease',
  normal: '200ms ease',
} as const;

// Focus ring for accessibility
export const focus = {
  ring: '2px solid #1f2937',
  ringOffset: '2px',
} as const;

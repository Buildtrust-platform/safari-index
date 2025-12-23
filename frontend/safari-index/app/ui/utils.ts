/**
 * UI Utilities
 *
 * Helper functions for consistent styling.
 * No behavior changes, only className composition.
 */

/**
 * Compose class names, filtering out falsy values
 * Simpler alternative to clsx/classnames
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get outcome-specific colors
 */
export function getOutcomeColors(outcome: string): {
  text: string;
  bg: string;
  border: string;
} {
  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    book: {
      text: 'text-green-800',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    wait: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
    switch: {
      text: 'text-blue-800',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    discard: {
      text: 'text-red-800',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    refused: {
      text: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    },
  };

  return colorMap[outcome] || colorMap.refused;
}

/**
 * Get status-specific colors for health signals
 */
export function getStatusColors(status: string): {
  text: string;
  bg: string;
  border: string;
} {
  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    healthy: {
      text: 'text-green-800',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    warning: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
    critical: {
      text: 'text-red-800',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
  };

  return colorMap[status] || colorMap.healthy;
}

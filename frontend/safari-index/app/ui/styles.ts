/**
 * Shared Style Classes
 *
 * Reusable Tailwind class compositions for consistency.
 * Uses warm stone/amber safari palette.
 */

/**
 * Page layout
 */
export const pageContainer = 'max-w-2xl mx-auto px-4 py-12';

/**
 * Section spacing
 */
export const section = 'mb-8';

/**
 * Section headings - consistent typography
 */
export const sectionHeading = 'text-lg font-semibold text-stone-900 mb-4';

/**
 * Card styles - warm safari aesthetic
 */
export const card = 'p-6 bg-white border border-stone-200 rounded-xl shadow-sm';
export const cardCompact = 'p-4 bg-white border border-stone-200 rounded-lg';

/**
 * List styles
 */
export const listContainer = 'space-y-2';
export const listItem = 'flex items-start';
export const listBullet = 'text-amber-500 mr-2 shrink-0';
export const listText = 'text-stone-700';

/**
 * Interactive elements - amber accent
 */
export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2';
export const buttonBase = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors';
export const buttonPrimary = `${buttonBase} bg-amber-600 text-white hover:bg-amber-700 disabled:bg-stone-400 ${focusRing}`;
export const buttonSecondary = `${buttonBase} bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 hover:border-stone-400 ${focusRing}`;

/**
 * Input styles
 */
export const input = `px-3 py-2 text-sm border border-stone-300 rounded-lg ${focusRing}`;

/**
 * Text styles
 */
export const textMuted = 'text-sm text-stone-500';
export const textBody = 'text-stone-700 leading-relaxed';
export const textSmall = 'text-sm text-stone-600';

/**
 * Link styles
 */
export const link = 'text-stone-600 underline hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500';

/**
 * Status indicators
 */
export const statusBadge = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';

/**
 * Footer/attribution
 */
export const footer = 'mt-16 pt-4 border-t border-stone-200 text-sm text-stone-500';

/**
 * Error container
 */
export const errorContainer = 'p-6 bg-stone-50 border border-stone-300 rounded-xl';
export const errorHeading = 'text-stone-700 mb-2';
export const errorText = 'text-stone-500 text-sm';

/**
 * Success container
 */
export const successContainer = 'p-4 bg-green-50 border border-green-200 rounded-xl';
export const successText = 'text-sm text-green-800';

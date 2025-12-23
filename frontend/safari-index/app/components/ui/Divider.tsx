/**
 * Divider Primitive Component
 *
 * Subtle section separators for visual grouping.
 * STAGING-ONLY: Gated by isBuildMode() in parent components.
 *
 * Per 01_brand_voice.md:
 * - Silence (white space) is intentional
 * - Restrained design
 *
 * Per task:
 * - Use Surface + Divider rather than nested cards everywhere
 */

import { cn } from '../../ui/utils';
import { dividerClasses } from '../../design/surfaces';

// =============================================================================
// TYPES
// =============================================================================

export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface DividerProps {
  /** Visual style */
  variant?: DividerVariant;
  /** Direction */
  orientation?: DividerOrientation;
  /** Margin around divider */
  spacing?: DividerSpacing;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for screen readers */
  'aria-label'?: string;
}

// =============================================================================
// SPACING MAP
// =============================================================================

const spacingClasses: Record<DividerSpacing, Record<DividerOrientation, string>> = {
  none: { horizontal: '', vertical: '' },
  sm: { horizontal: 'my-2', vertical: 'mx-2' },
  md: { horizontal: 'my-4', vertical: 'mx-4' },
  lg: { horizontal: 'my-6', vertical: 'mx-6' },
  xl: { horizontal: 'my-8', vertical: 'mx-8' },
};

// =============================================================================
// VARIANT MAP
// =============================================================================

const variantClasses: Record<DividerVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function Divider({
  variant = 'solid',
  orientation = 'horizontal',
  spacing = 'md',
  className,
  'aria-label': ariaLabel,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  const baseClass = isHorizontal
    ? 'w-full border-t border-neutral-200'
    : 'h-full border-l border-neutral-200';

  const spacingClass = spacingClasses[spacing][orientation];
  const variantClass = variantClasses[variant];

  return (
    <hr
      aria-label={ariaLabel}
      aria-orientation={orientation}
      role="separator"
      className={cn(baseClass, variantClass, spacingClass, className)}
    />
  );
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Section divider - standard horizontal separator with comfortable spacing
 */
export function SectionDivider({ className }: { className?: string }) {
  return <Divider spacing="lg" className={className} />;
}

/**
 * Inline divider - minimal spacing for tight layouts
 */
export function InlineDivider({ className }: { className?: string }) {
  return <Divider spacing="sm" className={className} />;
}

/**
 * Content divider - dashed style for grouping related items
 */
export function ContentDivider({ className }: { className?: string }) {
  return <Divider variant="dashed" spacing="md" className={className} />;
}

/**
 * Vertical divider - for side-by-side layouts
 */
export function VerticalDivider({ className }: { className?: string }) {
  return <Divider orientation="vertical" spacing="md" className={cn('inline-block h-4', className)} />;
}

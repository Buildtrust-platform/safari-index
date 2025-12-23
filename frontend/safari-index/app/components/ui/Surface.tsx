/**
 * Surface Primitive Component
 *
 * Maps surface variants to the design system.
 * STAGING-ONLY: Gated by isBuildMode() in parent components.
 *
 * Per 01_brand_voice.md:
 * - Calm, spacious layout
 * - No busy sections
 *
 * Per task:
 * - Reduce "card spam" - use Surface + Divider instead of nested cards
 */

import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../ui/utils';
import {
  surfaceClasses,
  paddingClasses,
  outcomeSurfaceClasses,
  statusSurfaceClasses,
  type SurfaceVariant,
} from '../../design/surfaces';

// =============================================================================
// TYPES
// =============================================================================

export type SurfacePadding = 'none' | 'compact' | 'default' | 'spacious' | 'hero';

export type OutcomeType = 'book' | 'wait' | 'switch' | 'discard' | 'refused';

export type StatusType = 'healthy' | 'watch' | 'critical' | 'unknown';

interface SurfaceBaseProps {
  /** Surface visual variant */
  variant?: SurfaceVariant;
  /** Internal padding */
  padding?: SurfacePadding;
  /** Additional CSS classes */
  className?: string;
  /** Content */
  children: ReactNode;
  /** HTML element to render */
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer';
  /** ARIA role */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** ARIA labelledby */
  'aria-labelledby'?: string;
  /** Data test ID */
  'data-testid'?: string;
  /** ID attribute */
  id?: string;
}

interface OutcomeSurfaceProps extends Omit<SurfaceBaseProps, 'variant'> {
  /** Decision outcome type */
  outcome: OutcomeType;
}

interface StatusSurfaceProps extends Omit<SurfaceBaseProps, 'variant'> {
  /** Status type */
  status: StatusType;
}

// =============================================================================
// PADDING MAP
// =============================================================================

const paddingMap: Record<SurfacePadding, string> = {
  none: '',
  compact: paddingClasses.compact,
  default: paddingClasses.default,
  spacious: paddingClasses.spacious,
  hero: paddingClasses.hero,
};

// =============================================================================
// SURFACE COMPONENT
// =============================================================================

export function Surface({
  variant = 'ghost',
  padding = 'default',
  className,
  children,
  as: Element = 'div',
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': testId,
  id,
}: SurfaceBaseProps) {
  const variantClass = surfaceClasses[variant as keyof typeof surfaceClasses] || '';
  const paddingClass = paddingMap[padding];

  return (
    <Element
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-testid={testId}
      className={cn(variantClass, paddingClass, className)}
    >
      {children}
    </Element>
  );
}

// =============================================================================
// OUTCOME SURFACE
// =============================================================================
// Specialized surface for decision verdicts.

export function OutcomeSurface({
  outcome,
  padding = 'default',
  className,
  children,
  as: Element = 'article',
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': testId,
  id,
}: OutcomeSurfaceProps) {
  const outcomeClass = outcomeSurfaceClasses[outcome];
  const paddingClass = paddingMap[padding];

  return (
    <Element
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-testid={testId}
      className={cn(outcomeClass, paddingClass, className)}
    >
      {children}
    </Element>
  );
}

// =============================================================================
// STATUS SURFACE
// =============================================================================
// Specialized surface for health/status displays.

export function StatusSurface({
  status,
  padding = 'default',
  className,
  children,
  as: Element = 'div',
  role,
  'aria-label': ariaLabel,
  'data-testid': testId,
  id,
}: StatusSurfaceProps) {
  const statusClass = statusSurfaceClasses[status];
  const paddingClass = paddingMap[padding];

  return (
    <Element
      id={id}
      role={role}
      aria-label={ariaLabel}
      data-testid={testId}
      className={cn(statusClass, 'rounded-md', paddingClass, className)}
    >
      {children}
    </Element>
  );
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================
// Pre-configured surfaces for common use cases.

/**
 * Card - elevated container for primary content
 */
export function Card({
  children,
  className,
  padding = 'default',
  as = 'div',
  ...props
}: SurfaceBaseProps) {
  return (
    <Surface
      variant="elevated"
      padding={padding}
      as={as}
      className={className}
      {...props}
    >
      {children}
    </Surface>
  );
}

/**
 * Inset - recessed container for secondary content
 */
export function Inset({
  children,
  className,
  padding = 'default',
  as = 'div',
  ...props
}: SurfaceBaseProps) {
  return (
    <Surface
      variant="inset"
      padding={padding}
      as={as}
      className={className}
      {...props}
    >
      {children}
    </Surface>
  );
}

/**
 * Warning - caution/dev notice container
 */
export function Warning({
  children,
  className,
  padding = 'compact',
  as = 'div',
  ...props
}: SurfaceBaseProps) {
  return (
    <Surface
      variant="warning"
      padding={padding}
      as={as}
      role="alert"
      className={className}
      {...props}
    >
      {children}
    </Surface>
  );
}

/**
 * Section - page content section
 */
export function Section({
  children,
  className,
  as = 'section',
  ...props
}: Omit<SurfaceBaseProps, 'variant' | 'padding'>) {
  return (
    <Surface
      variant="ghost"
      padding="none"
      as={as}
      className={cn('mb-8', className)}
      {...props}
    >
      {children}
    </Surface>
  );
}

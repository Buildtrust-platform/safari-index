/**
 * Text Primitive Component
 *
 * Maps typography variants to the design system.
 * STAGING-ONLY: Gated by isBuildMode() in parent components.
 *
 * Per 01_brand_voice.md:
 * - Typography carries authority, not decoration
 * - Calm, factual presentation
 *
 * Per 13_frontend_templates.md:
 * - 3 levels: Page Title, Section Heading, Body
 * - No decorative typography
 */

import { type ReactNode } from 'react';
import { cn } from '../../ui/utils';
import { textClasses } from '../../design/type';

// =============================================================================
// TYPES
// =============================================================================

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'lead'
  | 'meta'
  | 'label'
  | 'caption'
  | 'mono';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'disabled'
  | 'inverse'
  | 'inherit';

export type TextElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'strong'
  | 'em'
  | 'code'
  | 'pre';

interface TextProps {
  /** Typography variant from design system */
  variant?: TextVariant;
  /** HTML element to render */
  as?: TextElement;
  /** Text color semantic */
  color?: TextColor;
  /** Additional CSS classes */
  className?: string;
  /** Content */
  children: ReactNode;
  /** HTML id attribute */
  id?: string;
  /** ARIA role */
  role?: string;
  /** For label elements */
  htmlFor?: string;
}

// =============================================================================
// COLOR MAP
// =============================================================================

const colorClasses: Record<TextColor, string> = {
  primary: 'text-neutral-700',     // ink-primary via neutral mapping
  secondary: 'text-neutral-600',   // ink-body via neutral mapping
  muted: 'text-neutral-500',       // ink-meta via neutral mapping
  disabled: 'text-neutral-400',    // ink-muted via neutral mapping
  inverse: 'text-white',
  inherit: '',
};

// =============================================================================
// DEFAULT ELEMENT MAP
// =============================================================================
// Sensible defaults for semantic HTML.

const defaultElements: Record<TextVariant, TextElement> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  lead: 'p',
  meta: 'span',
  label: 'label',
  caption: 'span',
  mono: 'code',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function Text({
  variant = 'body',
  as,
  color = 'primary',
  className,
  children,
  id,
  role,
  htmlFor,
}: TextProps) {
  const Element = as || defaultElements[variant];
  const variantClasses = textClasses[variant];
  const colorClass = colorClasses[color];

  // Special handling for mono variant
  const monoClasses = variant === 'mono' ? 'font-mono' : '';

  return (
    <Element
      id={id}
      role={role}
      className={cn(variantClasses, colorClass, monoClasses, className)}
      {...(Element === 'label' && htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Element>
  );
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================
// Pre-configured text components for common use cases.

export function Heading1({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return <Text variant="h1" id={id} className={className}>{children}</Text>;
}

export function Heading2({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return <Text variant="h2" id={id} className={className}>{children}</Text>;
}

export function Heading3({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return <Text variant="h3" id={id} className={className}>{children}</Text>;
}

export function Body({ children, className, color = 'primary' }: { children: ReactNode; className?: string; color?: TextColor }) {
  return <Text variant="body" color={color} className={className}>{children}</Text>;
}

export function Lead({ children, className, color = 'secondary' }: { children: ReactNode; className?: string; color?: TextColor }) {
  return <Text variant="lead" color={color} className={className}>{children}</Text>;
}

export function Meta({ children, className }: { children: ReactNode; className?: string }) {
  return <Text variant="meta" color="muted" className={className}>{children}</Text>;
}

export function Label({ children, className, htmlFor }: { children: ReactNode; className?: string; htmlFor?: string }) {
  return <Text variant="label" color="secondary" htmlFor={htmlFor} className={className}>{children}</Text>;
}

export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <Text variant="caption" color="muted" className={className}>{children}</Text>;
}

export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Text
      variant="mono"
      as="code"
      color="secondary"
      className={cn('px-1 py-0.5 bg-neutral-200 rounded', className)}
    >
      {children}
    </Text>
  );
}

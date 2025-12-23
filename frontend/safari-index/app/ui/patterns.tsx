/**
 * UX Pattern Library
 *
 * Reusable UI components for staging pages.
 * Follows governance requirements:
 * - 13_frontend_templates.md: Semantic HTML, ARIA required
 * - 01_brand_voice.md: Calm, non-marketing tone
 * - 03_ux_flow.md: Single primary column
 *
 * Components:
 * - SectionCard: Bordered card with optional heading
 * - Disclosure: Expandable/collapsible section with ARIA
 * - Badge: Status/label badge with variants
 */

'use client';

import React, { useState, useId } from 'react';
import { focusRing } from './styles';

// ============================================================================
// SectionCard
// ============================================================================

export interface SectionCardProps {
  /** Card heading (optional) */
  heading?: string;
  /** Heading level for semantic structure */
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Visual variant */
  variant?: 'default' | 'subtle' | 'info' | 'warning';
  /** Card content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Test ID for automation */
  testId?: string;
}

const CARD_VARIANTS = {
  default: 'bg-gray-50 border-gray-200',
  subtle: 'bg-white border-gray-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-amber-50 border-amber-200',
};

const HEADING_VARIANTS = {
  default: 'text-gray-900',
  subtle: 'text-gray-900',
  info: 'text-blue-900',
  warning: 'text-amber-900',
};

/**
 * SectionCard - Bordered card with optional heading
 *
 * @example
 * <SectionCard heading="Summary">
 *   <p>Content here</p>
 * </SectionCard>
 */
export function SectionCard({
  heading,
  headingLevel = 'h3',
  variant = 'default',
  children,
  className = '',
  testId,
}: SectionCardProps) {
  const HeadingTag = headingLevel;
  const cardClasses = `p-4 border rounded-lg ${CARD_VARIANTS[variant]} ${className}`.trim();
  const headingClasses = `text-lg font-semibold mb-4 ${HEADING_VARIANTS[variant]}`;

  return (
    <div className={cardClasses} data-testid={testId}>
      {heading && <HeadingTag className={headingClasses}>{heading}</HeadingTag>}
      {children}
    </div>
  );
}

// ============================================================================
// Disclosure
// ============================================================================

export interface DisclosureProps {
  /** Summary text shown when collapsed */
  summary: string;
  /** Content shown when expanded */
  children: React.ReactNode;
  /** Start expanded */
  defaultOpen?: boolean;
  /** Visual variant */
  variant?: 'default' | 'subtle';
  /** Additional className for container */
  className?: string;
  /** Test ID for automation */
  testId?: string;
}

const DISCLOSURE_VARIANTS = {
  default: {
    container: 'border border-gray-200 rounded-lg',
    button: 'bg-gray-50 hover:bg-gray-100',
    content: 'bg-white',
  },
  subtle: {
    container: 'border-b border-gray-200',
    button: 'hover:bg-gray-50',
    content: '',
  },
};

/**
 * Disclosure - Expandable/collapsible section with ARIA support
 *
 * @example
 * <Disclosure summary="Show details">
 *   <p>Hidden content here</p>
 * </Disclosure>
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  variant = 'default',
  className = '',
  testId,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const styles = DISCLOSURE_VARIANTS[variant];

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-testid={testId}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 ${styles.button} ${focusRing} rounded-t-lg`}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{summary}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        id={contentId}
        className={`${styles.content} ${isOpen ? 'block' : 'hidden'}`}
        role="region"
        aria-labelledby={contentId}
      >
        <div className="px-4 py-3">{children}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Badge
// ============================================================================

export interface BadgeProps {
  /** Badge text */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Size */
  size?: 'sm' | 'md';
  /** Additional className */
  className?: string;
  /** Accessible label (if different from visible text) */
  ariaLabel?: string;
}

const BADGE_VARIANTS = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const BADGE_SIZES = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-sm',
};

/**
 * Badge - Status/label indicator with variants
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="sm">Pending</Badge>
 */
export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ariaLabel,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded ${BADGE_VARIANTS[variant]} ${BADGE_SIZES[size]} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
}

// ============================================================================
// StatusBadge (specialized Badge for health status)
// ============================================================================

export type HealthStatus = 'healthy' | 'watch' | 'critical' | 'unknown';

const HEALTH_STATUS_VARIANTS: Record<HealthStatus, BadgeProps['variant']> = {
  healthy: 'success',
  watch: 'warning',
  critical: 'error',
  unknown: 'default',
};

export interface StatusBadgeProps {
  status: HealthStatus;
  className?: string;
}

/**
 * StatusBadge - Health status indicator
 *
 * @example
 * <StatusBadge status="healthy" />
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={HEALTH_STATUS_VARIANTS[status]}
      className={className}
      ariaLabel={`Status: ${status}`}
    >
      {status}
    </Badge>
  );
}

// ============================================================================
// SeverityBadge (specialized Badge for improvement severity)
// ============================================================================

export type Severity = 'high' | 'medium' | 'low';

const SEVERITY_VARIANTS: Record<Severity, BadgeProps['variant']> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

export interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

/**
 * SeverityBadge - Improvement severity indicator
 *
 * @example
 * <SeverityBadge severity="high" />
 */
export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge
      variant={SEVERITY_VARIANTS[severity]}
      className={className}
      ariaLabel={`Severity: ${severity}`}
    >
      {severity}
    </Badge>
  );
}

// ============================================================================
// EmptyState
// ============================================================================

export interface EmptyStateProps {
  /** Message to display */
  message: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional className */
  className?: string;
}

/**
 * EmptyState - Placeholder for empty lists/sections
 *
 * @example
 * <EmptyState
 *   message="No items found"
 *   action={{ label: "Clear filters", onClick: handleClear }}
 * />
 */
export function EmptyState({ message, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-8 ${className}`.trim()}>
      <p className="text-gray-500">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 ${focusRing}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Metric
// ============================================================================

export interface MetricProps {
  /** Metric label */
  label: string;
  /** Metric value */
  value: string | number;
  /** Additional className */
  className?: string;
}

/**
 * Metric - Label/value pair for dashboards
 *
 * @example
 * <Metric label="Total count" value={42} />
 */
export function Metric({ label, value, className = '' }: MetricProps) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
}

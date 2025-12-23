/**
 * Disclosure Component
 *
 * Consistent collapsible disclosure primitive for staging panels.
 * Used by: PreflightWizard, InputReadinessPanel, RefusalRecoveryPanel
 *
 * Features:
 * - Same icon (chevron), spacing, and keyboard behavior
 * - Accessible with aria-expanded and aria-controls
 * - Consistent visual treatment across variants
 */

'use client';

import { useState, useCallback, type ReactNode, useId } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../ui/utils';

type DisclosureVariant = 'default' | 'info' | 'warning' | 'subtle';

interface DisclosureProps {
  /** The trigger label/title */
  title: string;
  /** Content to show when expanded */
  children: ReactNode;
  /** Visual variant */
  variant?: DisclosureVariant;
  /** Whether to start expanded */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Additional className for the container */
  className?: string;
  /** Test ID for the disclosure */
  testId?: string;
}

const variantStyles: Record<DisclosureVariant, { trigger: string; content: string }> = {
  default: {
    trigger: 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800',
    content: 'bg-white border-neutral-200',
  },
  info: {
    trigger: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800',
    content: 'bg-white border-blue-200',
  },
  warning: {
    trigger: 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800',
    content: 'bg-white border-amber-200',
  },
  subtle: {
    trigger: 'bg-transparent border-neutral-200 hover:bg-neutral-50 text-neutral-700',
    content: 'bg-neutral-50 border-neutral-200',
  },
};

/**
 * Disclosure - Accessible collapsible panel
 */
export function Disclosure({
  title,
  children,
  variant = 'default',
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
  className,
  testId,
}: DisclosureProps) {
  const id = useId();
  const contentId = `disclosure-content-${id}`;

  // Support both controlled and uncontrolled modes
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = useCallback(() => {
    const newExpanded = !isExpanded;
    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }
    onExpandedChange?.(newExpanded);
  }, [isExpanded, isControlled, onExpandedChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  const styles = variantStyles[variant];
  const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div className={cn('', className)} data-testid={testId}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full flex items-center justify-between p-3 border rounded-lg text-left transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1',
          styles.trigger
        )}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronIcon className="w-4 h-4 flex-shrink-0" aria-hidden />
      </button>

      {/* Content panel */}
      {isExpanded && (
        <div
          id={contentId}
          className={cn(
            'mt-2 p-4 border rounded-lg',
            styles.content
          )}
          role="region"
          aria-labelledby={`disclosure-trigger-${id}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * DisclosureGroup - Container for multiple related disclosures
 */
export function DisclosureGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)} role="group">
      {children}
    </div>
  );
}

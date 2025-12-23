/**
 * MetaRail Component
 *
 * Staging-only sidebar component showing small factual meta blocks:
 * - logic_version
 * - confidence (if available)
 * - status (healthy/degraded/critical for dev pages)
 *
 * Uses Text.Meta + Surface.Inset, no new copy.
 * Does NOT render in production.
 */

'use client';

import { type ReactNode } from 'react';
import { isBuildMode } from '../../../lib/app-mode';
import {
  Meta,
  Text,
  Inset,
  Icon,
  HealthyIcon,
  WatchIcon,
  CriticalIcon,
  UnknownIcon,
  ActivityIcon,
  InfoIcon,
} from '../ui';
import { cn } from '../../ui/utils';

type HealthStatus = 'healthy' | 'watch' | 'critical' | 'unknown';

interface MetaRailProps {
  /** Logic version string */
  logicVersion?: string;
  /** Confidence score (0-1) */
  confidence?: number | null;
  /** Health status for dev pages */
  status?: HealthStatus;
  /** Decision ID */
  decisionId?: string;
  /** Additional meta items */
  children?: ReactNode;
  /** Additional className */
  className?: string;
}

const statusConfig: Record<HealthStatus, { icon: typeof HealthyIcon; color: string; label: string }> = {
  healthy: { icon: HealthyIcon, color: 'text-green-700', label: 'Healthy' },
  watch: { icon: WatchIcon, color: 'text-amber-600', label: 'Watch' },
  critical: { icon: CriticalIcon, color: 'text-red-700', label: 'Critical' },
  unknown: { icon: UnknownIcon, color: 'text-neutral-500', label: 'Unknown' },
};

/**
 * MetaRailItem - Single meta item in the rail
 */
function MetaRailItem({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string;
  value: string | ReactNode;
  icon?: typeof ActivityIcon;
  valueClassName?: string;
}) {
  return (
    <div className="py-3 border-b border-neutral-100 last:border-b-0">
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <Icon icon={icon} size="xs" color="muted" aria-hidden />}
        <Meta>{label}</Meta>
      </div>
      <Text variant="body" className={cn('text-sm', valueClassName)}>
        {value}
      </Text>
    </div>
  );
}

/**
 * MetaRail - Sidebar meta information display
 */
export function MetaRail({
  logicVersion,
  confidence,
  status,
  decisionId,
  children,
  className,
}: MetaRailProps) {
  // Gate: do not render in production
  if (!isBuildMode()) {
    return null;
  }

  const hasContent = logicVersion || confidence !== undefined || status || decisionId || children;

  if (!hasContent) {
    return null;
  }

  const confidencePercent = confidence !== null && confidence !== undefined
    ? `${Math.round(confidence * 100)}%`
    : null;

  const statusInfo = status ? statusConfig[status] : null;

  return (
    <div className={cn('space-y-4', className)} data-testid="meta-rail">
      <Inset className="bg-neutral-50">
        {/* Status */}
        {statusInfo && (
          <MetaRailItem
            label="Status"
            icon={statusInfo.icon}
            value={
              <span className={cn('font-medium', statusInfo.color)}>
                {statusInfo.label}
              </span>
            }
          />
        )}

        {/* Confidence */}
        {confidencePercent && (
          <MetaRailItem
            label="Confidence"
            icon={ActivityIcon}
            value={confidencePercent}
            valueClassName="font-mono"
          />
        )}

        {/* Logic Version */}
        {logicVersion && (
          <MetaRailItem
            label="Logic version"
            icon={InfoIcon}
            value={logicVersion}
            valueClassName="font-mono text-neutral-600"
          />
        )}

        {/* Decision ID */}
        {decisionId && (
          <MetaRailItem
            label="Decision ID"
            value={
              <span className="font-mono text-xs text-neutral-500 break-all">
                {decisionId}
              </span>
            }
          />
        )}
      </Inset>

      {/* Additional content */}
      {children}

      {/* Staging indicator */}
      <div className="pt-2">
        <Meta className="text-neutral-400">Staging only</Meta>
      </div>
    </div>
  );
}

/**
 * MetaRailBlock - Custom block for additional meta content
 */
export function MetaRailBlock({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Inset className={cn('bg-neutral-50', className)}>
      {title && (
        <div className="mb-2">
          <Meta>{title}</Meta>
        </div>
      )}
      {children}
    </Inset>
  );
}

/**
 * Icon Primitive Component
 *
 * Standardized icon wrapper using lucide-react.
 * STAGING-ONLY: Gated by isBuildMode() in parent components.
 *
 * Per 13_frontend_templates.md:
 * - Icons are functional labels only
 * - No animal iconography for decoration
 *
 * Per task:
 * - Use a single icon set (lucide-react)
 * - Standardize size + stroke
 * - Add icons only where they improve scanning
 */

import { type LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

// =============================================================================
// TYPES
// =============================================================================

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'current' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger' | 'inverse';

interface IconProps {
  /** The Lucide icon component */
  icon: LucideIcon;
  /** Icon size preset */
  size?: IconSize;
  /** Icon color preset */
  color?: IconColor;
  /** Stroke width (default 1.5 for refined look) */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Hide from screen readers (decorative icon) */
  'aria-hidden'?: boolean;
}

// =============================================================================
// SIZE MAP
// =============================================================================
// Standardized sizes for consistency.

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

// =============================================================================
// COLOR MAP
// =============================================================================

const colorClasses: Record<IconColor, string> = {
  current: 'text-current',
  primary: 'text-neutral-900',
  secondary: 'text-neutral-600',
  muted: 'text-neutral-400',
  success: 'text-green-700',
  warning: 'text-amber-600',
  danger: 'text-red-700',
  inverse: 'text-white',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'current',
  strokeWidth = 1.5,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const sizeValue = sizeMap[size];
  const colorClass = colorClasses[color];

  // If no aria-label, mark as decorative
  const isDecorative = !ariaLabel || ariaHidden;

  return (
    <IconComponent
      size={sizeValue}
      strokeWidth={strokeWidth}
      className={cn(colorClass, 'shrink-0', className)}
      aria-label={ariaLabel}
      aria-hidden={isDecorative}
      role={isDecorative ? 'presentation' : 'img'}
    />
  );
}

// =============================================================================
// ICON EXPORTS
// =============================================================================
// Curated icons for Safari Index use cases.

// Outcomes
export {
  Check as CheckIcon,
  Clock as ClockIcon,
  ArrowRight as SwitchIcon,
  X as DiscardIcon,
  HelpCircle as RefusedIcon,
} from 'lucide-react';

// Status/Health
export {
  CheckCircle as HealthyIcon,
  AlertTriangle as WatchIcon,
  AlertCircle as CriticalIcon,
  Circle as UnknownIcon,
} from 'lucide-react';

// Trade-offs
export {
  Plus as GainIcon,
  Minus as LossIcon,
  TrendingUp as GainsIcon,
  TrendingDown as LossesIcon,
} from 'lucide-react';

// Navigation/Actions
export {
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ArrowLeft as BackIcon,
  ExternalLink as ExternalLinkIcon,
  Copy as CopyIcon,
  Download as DownloadIcon,
} from 'lucide-react';

// Inputs/Forms
export {
  Calendar as CalendarIcon,
  Users as GroupIcon,
  DollarSign as BudgetIcon,
  Compass as StyleIcon,
  CheckSquare as ChecklistIcon,
  Square as UncheckedIcon,
} from 'lucide-react';

// Compare/Diff
export {
  GitCompare as CompareIcon,
  Equal as EqualIcon,
  ChevronsLeftRight as DifferenceIcon,
  ArrowLeftRight as SwapIcon,
} from 'lucide-react';

// Dev/System
export {
  Activity as ActivityIcon,
  AlertOctagon as AlertIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  RefreshCw as RefreshIcon,
} from 'lucide-react';

// Content
export {
  FileText as DocumentIcon,
  List as ListIcon,
  Tag as TagIcon,
  MapPin as LocationIcon,
} from 'lucide-react';

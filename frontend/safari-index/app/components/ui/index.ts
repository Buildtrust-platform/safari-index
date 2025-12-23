/**
 * UI Primitives Index
 *
 * Export all design system primitives from a single location.
 * STAGING-ONLY: Components are gated by isBuildMode() in parent components.
 */

// Text primitives
export {
  Text,
  Heading1,
  Heading2,
  Heading3,
  Body,
  Lead,
  Meta,
  Label,
  Caption,
  Code,
  type TextVariant,
  type TextColor,
} from './Text';

// Surface primitives
export {
  Surface,
  OutcomeSurface,
  StatusSurface,
  Card,
  Inset,
  Warning,
  Section,
  type SurfacePadding,
  type OutcomeType,
  type StatusType,
} from './Surface';

// Divider primitives
export {
  Divider,
  SectionDivider,
  InlineDivider,
  ContentDivider,
  VerticalDivider,
  type DividerVariant,
  type DividerOrientation,
  type DividerSpacing,
} from './Divider';

// Disclosure primitives
export { Disclosure, DisclosureGroup } from './Disclosure';

// Icon primitives
export {
  Icon,
  type IconSize,
  type IconColor,
  // Outcome icons
  CheckIcon,
  ClockIcon,
  SwitchIcon,
  DiscardIcon,
  RefusedIcon,
  // Status icons
  HealthyIcon,
  WatchIcon,
  CriticalIcon,
  UnknownIcon,
  // Trade-off icons
  GainIcon,
  LossIcon,
  GainsIcon,
  LossesIcon,
  // Navigation icons
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BackIcon,
  ExternalLinkIcon,
  CopyIcon,
  DownloadIcon,
  // Input icons
  CalendarIcon,
  GroupIcon,
  BudgetIcon,
  StyleIcon,
  ChecklistIcon,
  UncheckedIcon,
  // Compare icons
  CompareIcon,
  EqualIcon,
  DifferenceIcon,
  SwapIcon,
  // Dev icons
  ActivityIcon,
  AlertIcon,
  InfoIcon,
  SettingsIcon,
  RefreshIcon,
  // Content icons
  DocumentIcon,
  ListIcon,
  TagIcon,
  LocationIcon,
} from './Icon';

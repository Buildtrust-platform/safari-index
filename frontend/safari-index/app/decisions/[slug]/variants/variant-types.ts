/**
 * Variant Types
 *
 * Types for the /decisions/[slug]/variants route (staging only).
 * Allows testing how different assumptions change the decision outcome.
 */

import type { DecisionResponse } from '../../../../lib/contracts';

/**
 * Budget tier options
 */
export type BudgetTier = 'budget' | 'fair_value' | 'luxury';

/**
 * Travel style options
 */
export type TravelStyle =
  | 'first_time'
  | 'repeat'
  | 'family'
  | 'honeymoon'
  | 'photography'
  | 'adventure';

/**
 * Tolerance levels (generic)
 */
export type ToleranceLevel = 'low' | 'medium' | 'high';

/**
 * Group composition options
 */
export type GroupComposition = 'solo' | 'couple' | 'family' | 'friends';

/**
 * Date flexibility options
 */
export type DateFlexibility = 'fixed' | 'flexible' | 'very_flexible';

/**
 * Time available (days)
 */
export type TimeAvailable = '3-5' | '6-8' | '9-12' | '13+';

/**
 * Variant form state - maps to StandardInputEnvelope fields
 */
export interface VariantFormState {
  budgetTier: BudgetTier;
  travelStyle: TravelStyle;
  crowdTolerance: ToleranceLevel;
  comfortTolerance: ToleranceLevel;
  dateFlexibility: DateFlexibility;
  riskTolerance: ToleranceLevel;
  groupComposition: GroupComposition;
  timeAvailable: TimeAvailable;
}

/**
 * Default form state (matches base decision defaults)
 */
export const DEFAULT_VARIANT_FORM: VariantFormState = {
  budgetTier: 'fair_value',
  travelStyle: 'first_time',
  crowdTolerance: 'medium',
  comfortTolerance: 'medium',
  dateFlexibility: 'flexible',
  riskTolerance: 'medium',
  groupComposition: 'couple',
  timeAvailable: '6-8',
};

/**
 * Form option with label
 */
export interface FormOption<T> {
  value: T;
  label: string;
}

/**
 * Form field options
 */
export const BUDGET_OPTIONS: FormOption<BudgetTier>[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'fair_value', label: 'Mid-range' },
  { value: 'luxury', label: 'Luxury' },
];

export const TRAVEL_STYLE_OPTIONS: FormOption<TravelStyle>[] = [
  { value: 'first_time', label: 'First Safari' },
  { value: 'repeat', label: 'Repeat Visitor' },
  { value: 'family', label: 'Family' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'photography', label: 'Photography' },
  { value: 'adventure', label: 'Adventure' },
];

export const TOLERANCE_OPTIONS: FormOption<ToleranceLevel>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const GROUP_OPTIONS: FormOption<GroupComposition>[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
];

export const FLEXIBILITY_OPTIONS: FormOption<DateFlexibility>[] = [
  { value: 'fixed', label: 'Fixed dates' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'very_flexible', label: 'Very flexible' },
];

export const TIME_OPTIONS: FormOption<TimeAvailable>[] = [
  { value: '3-5', label: '3-5 days' },
  { value: '6-8', label: '6-8 days' },
  { value: '9-12', label: '9-12 days' },
  { value: '13+', label: '13+ days' },
];

/**
 * Variant result state
 */
export type VariantState = 'idle' | 'loading' | 'success' | 'refusal' | 'error';

/**
 * A single variant result
 */
export interface VariantResult {
  id: string;
  label: string; // Human-readable description of what changed
  formState: VariantFormState;
  state: VariantState;
  response: DecisionResponse | null;
  error: string | null;
  // Derived: what changed vs base
  outcomeChanged: boolean;
  changeReason: string | null;
}

/**
 * Generate variant label from form state differences
 */
export function generateVariantLabel(
  form: VariantFormState,
  base: VariantFormState
): string {
  const changes: string[] = [];

  if (form.budgetTier !== base.budgetTier) {
    const opt = BUDGET_OPTIONS.find((o) => o.value === form.budgetTier);
    changes.push(`Budget: ${opt?.label}`);
  }
  if (form.travelStyle !== base.travelStyle) {
    const opt = TRAVEL_STYLE_OPTIONS.find((o) => o.value === form.travelStyle);
    changes.push(`Style: ${opt?.label}`);
  }
  if (form.crowdTolerance !== base.crowdTolerance) {
    changes.push(`Crowd tolerance: ${form.crowdTolerance}`);
  }
  if (form.comfortTolerance !== base.comfortTolerance) {
    changes.push(`Comfort tolerance: ${form.comfortTolerance}`);
  }
  if (form.dateFlexibility !== base.dateFlexibility) {
    const opt = FLEXIBILITY_OPTIONS.find((o) => o.value === form.dateFlexibility);
    changes.push(`Dates: ${opt?.label}`);
  }
  if (form.riskTolerance !== base.riskTolerance) {
    changes.push(`Risk tolerance: ${form.riskTolerance}`);
  }
  if (form.groupComposition !== base.groupComposition) {
    const opt = GROUP_OPTIONS.find((o) => o.value === form.groupComposition);
    changes.push(`Group: ${opt?.label}`);
  }
  if (form.timeAvailable !== base.timeAvailable) {
    const opt = TIME_OPTIONS.find((o) => o.value === form.timeAvailable);
    changes.push(`Time: ${opt?.label}`);
  }

  return changes.length > 0 ? changes.join(', ') : 'No changes';
}

/**
 * Convert time available to group size estimate
 */
export function timeToGroupSize(time: TimeAvailable): number {
  switch (time) {
    case '3-5':
      return 2;
    case '6-8':
      return 2;
    case '9-12':
      return 3;
    case '13+':
      return 4;
  }
}

/**
 * Convert group composition to traveler type
 */
export function groupToTravelerType(
  group: GroupComposition,
  style: TravelStyle
): string {
  if (style === 'family' || group === 'family') return 'families';
  if (style === 'honeymoon' || group === 'couple') return 'couples';
  if (style === 'photography') return 'photographers';
  if (style === 'adventure') return 'adventure';
  if (style === 'repeat') return 'repeat';
  return 'first_time';
}

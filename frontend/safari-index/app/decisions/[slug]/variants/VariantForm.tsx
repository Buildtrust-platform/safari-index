/**
 * Variant Form Component
 *
 * Form with toggles/selects to modify assumption inputs.
 * Maps to StandardInputEnvelope fields.
 */

import {
  type VariantFormState,
  BUDGET_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
  TOLERANCE_OPTIONS,
  GROUP_OPTIONS,
  FLEXIBILITY_OPTIONS,
  TIME_OPTIONS,
  type FormOption,
} from './variant-types';
import { input, buttonPrimary, buttonSecondary } from '../../../ui/styles';

interface VariantFormProps {
  form: VariantFormState;
  onChange: (form: VariantFormState) => void;
  onRun: () => void;
  onReset: () => void;
  isLoading: boolean;
  hasChanges: boolean;
}

/**
 * Generic select field
 */
function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: FormOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        className={`${input} w-full disabled:bg-gray-100 disabled:cursor-not-allowed`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function VariantForm({
  form,
  onChange,
  onRun,
  onReset,
  isLoading,
  hasChanges,
}: VariantFormProps) {
  const updateField = <K extends keyof VariantFormState>(
    field: K,
    value: VariantFormState[K]
  ) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        Change assumptions
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SelectField
          label="Budget tier"
          value={form.budgetTier}
          options={BUDGET_OPTIONS}
          onChange={(v) => updateField('budgetTier', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Travel style"
          value={form.travelStyle}
          options={TRAVEL_STYLE_OPTIONS}
          onChange={(v) => updateField('travelStyle', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Crowd tolerance"
          value={form.crowdTolerance}
          options={TOLERANCE_OPTIONS}
          onChange={(v) => updateField('crowdTolerance', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Comfort tolerance"
          value={form.comfortTolerance}
          options={TOLERANCE_OPTIONS}
          onChange={(v) => updateField('comfortTolerance', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Date flexibility"
          value={form.dateFlexibility}
          options={FLEXIBILITY_OPTIONS}
          onChange={(v) => updateField('dateFlexibility', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Risk tolerance"
          value={form.riskTolerance}
          options={TOLERANCE_OPTIONS}
          onChange={(v) => updateField('riskTolerance', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Group"
          value={form.groupComposition}
          options={GROUP_OPTIONS}
          onChange={(v) => updateField('groupComposition', v)}
          disabled={isLoading}
        />

        <SelectField
          label="Time available"
          value={form.timeAvailable}
          options={TIME_OPTIONS}
          onChange={(v) => updateField('timeAvailable', v)}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRun}
          disabled={isLoading}
          className={buttonPrimary}
        >
          {isLoading ? 'Running...' : 'Run variant'}
        </button>
        {hasChanges && (
          <button
            onClick={onReset}
            disabled={isLoading}
            className={buttonSecondary}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

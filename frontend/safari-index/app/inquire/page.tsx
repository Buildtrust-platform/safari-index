/**
 * Safari Planning Brief - Decision-Led Inquiry Form
 *
 * A 5-step guided flow that captures traveler intent through
 * a calm, expert conversation. Feels like a brief, not a form.
 *
 * Per governance:
 * - Documentary, calm tone
 * - No hype or urgency
 * - No promises of availability
 * - Refusal possible if constraints conflict
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  Compass,
  Users,
  Camera,
  Heart,
  Mountain,
  Bird,
  Check,
  Pencil,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import {
  PlanningBriefState,
  SafariIntent,
  BudgetBand,
  TravelerPriority,
  SAFARI_INTENTS,
  TIMING_FLEXIBILITY,
  BUDGET_BAND_OPTIONS,
  PRIORITY_OPTIONS,
  MONTH_OPTIONS,
  COUNTRY_OPTIONS,
  DESTINATION_OPTIONS,
  DURATION_OPTIONS,
  getDefaultPlanningBriefState,
  getYearOptions,
  planningBriefToPayload,
  isValidEmail,
  formatSafariIntent,
  formatFlexibility,
  formatBudgetBandLabel,
  formatPriorities,
} from '../../lib/inquiry';
import { getAttributionData } from '../../lib/attribution';

// Session storage key for draft persistence
const DRAFT_STORAGE_KEY = 'safari-planning-brief-draft';

/**
 * Progress indicator - 5 segments
 */
function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div
          key={step}
          className={`h-1 flex-1 rounded-full transition-colors ${
            step < currentStep
              ? 'bg-stone-400'
              : step === currentStep
                ? 'bg-amber-600'
                : 'bg-stone-200'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Intent card for Step 1
 */
function IntentCard({
  intent,
  selected,
  onSelect,
}: {
  intent: { value: SafariIntent; label: string; description: string };
  selected: boolean;
  onSelect: () => void;
}) {
  const icons: Record<SafariIntent, React.ReactNode> = {
    'first-safari': <Compass className="w-5 h-5" />,
    'return-visit': <Mountain className="w-5 h-5" />,
    'special-occasion': <Heart className="w-5 h-5" />,
    'photography': <Camera className="w-5 h-5" />,
    'family': <Users className="w-5 h-5" />,
    'specific': <Bird className="w-5 h-5" />,
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-amber-500 bg-amber-50'
          : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            selected ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400'
          }`}
        >
          {icons[intent.value]}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${selected ? 'text-amber-900' : 'text-stone-900'}`}>
            {intent.label}
          </p>
          <p className={`text-sm ${selected ? 'text-amber-700' : 'text-stone-500'}`}>
            {intent.description}
          </p>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * Budget card for Step 3
 */
function BudgetCard({
  option,
  selected,
  onSelect,
}: {
  option: { value: BudgetBand; label: string; description: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-amber-500 bg-amber-50'
          : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-medium ${selected ? 'text-amber-900' : 'text-stone-900'}`}>
            {option.label}
          </p>
          <p className={`text-sm mt-1 ${selected ? 'text-amber-700' : 'text-stone-500'}`}>
            {option.description}
          </p>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * Priority checkbox for Step 4
 */
function PriorityCheckbox({
  option,
  selected,
  onToggle,
  disabled,
}: {
  option: { value: TravelerPriority; label: string };
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
        selected
          ? 'border-amber-500 bg-amber-50 text-amber-800'
          : disabled
            ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
      }`}
    >
      {option.label}
    </button>
  );
}

/**
 * Number stepper component
 */
function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 12,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="w-8 text-center font-medium text-stone-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Brief summary for Step 5
 */
function BriefSummary({
  state,
  onEdit,
}: {
  state: PlanningBriefState;
  onEdit: (step: number) => void;
}) {
  const monthLabel = MONTH_OPTIONS.find((m) => m.value === state.travelMonth)?.label || '';
  const destLabel = DESTINATION_OPTIONS.find((d) => d.value === state.destination)?.label || '';
  const durationLabel = DURATION_OPTIONS.find((d) => d.value === state.duration)?.label || '';

  // Format timing based on flexibility
  let timingValue = '';
  if (state.flexibility === 'fixed' && state.fixedStartDate) {
    const startDate = new Date(state.fixedStartDate);
    const endDate = state.fixedEndDate ? new Date(state.fixedEndDate) : null;
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    timingValue = endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)} (fixed dates)`
      : `${formatDate(startDate)} (fixed start)`;
  } else if (monthLabel && state.travelYear) {
    timingValue = `${monthLabel} ${state.travelYear}${state.flexibility ? ` (${formatFlexibility(state.flexibility).toLowerCase()})` : ''}`;
  } else {
    timingValue = 'Not specified';
  }

  return (
    <div className="bg-stone-100 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
        Your Planning Brief Summary
      </h3>
      <div className="space-y-3">
        <SummaryRow
          label="Safari type"
          value={state.safariIntent ? formatSafariIntent(state.safariIntent) : 'Not selected'}
          onEdit={() => onEdit(1)}
        />
        <SummaryRow
          label="Destination"
          value={destLabel || 'Not selected'}
          onEdit={() => onEdit(2)}
        />
        <SummaryRow
          label="Timing"
          value={timingValue}
          onEdit={() => onEdit(2)}
        />
        <SummaryRow
          label="Duration"
          value={durationLabel || 'Not selected'}
          onEdit={() => onEdit(2)}
        />
        <SummaryRow
          label="Budget band"
          value={state.budgetBand ? formatBudgetBandLabel(state.budgetBand) : 'Not selected'}
          onEdit={() => onEdit(3)}
        />
        <SummaryRow
          label="Travelers"
          value={`${state.travelerCount} adult${state.travelerCount !== 1 ? 's' : ''}${state.childrenCount > 0 ? `, ${state.childrenCount} child${state.childrenCount !== 1 ? 'ren' : ''}` : ''}`}
          onEdit={() => onEdit(4)}
        />
        {state.priorities.length > 0 && (
          <SummaryRow
            label="Top priorities"
            value={formatPriorities(state.priorities)}
            onEdit={() => onEdit(4)}
          />
        )}
        {state.specificRequests && (
          <SummaryRow label="Notes" value={state.specificRequests} onEdit={() => onEdit(4)} />
        )}
      </div>
      <p className="text-xs text-stone-500 mt-4 pt-4 border-t border-stone-200">
        Review your brief before submitting. We use this to build your initial planning direction.
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <span className="text-xs text-stone-500 uppercase tracking-wide">{label}</span>
        <p className="text-stone-900 text-sm truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-stone-400 hover:text-stone-600 p-1"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * What happens next section
 */
function WhatHappensNext() {
  return (
    <div className="mt-8 pt-6 border-t border-stone-200">
      <h3 className="font-medium text-stone-900 mb-4">What Happens After You Submit</h3>
      <div className="space-y-4 text-sm text-stone-600">
        <div>
          <p className="font-medium text-stone-900">We review your brief manually.</p>
          <p>
            Every submission is read by a safari planner, not processed by automation. We look at
            your timing, budget, priorities, and any constraints to determine whether we can help.
          </p>
        </div>
        <div>
          <p className="font-medium text-stone-900">We may ask clarifying questions.</p>
          <p>
            If something is unclear or if your priorities conflict, we will ask before assuming.
            This is normal and helps us avoid proposing the wrong thing.
          </p>
        </div>
        <div>
          <p className="font-medium text-stone-900">We may decline.</p>
          <p>
            If your constraints cannot produce a trip that meets your expectations — timing
            impossible, budget insufficient for goals, or ethical conflicts — we will say so
            directly. We do not propose trips we would not book ourselves.
          </p>
        </div>
        <div>
          <p className="font-medium text-stone-900">You will receive a planning direction.</p>
          <p>
            If we can help, you will receive an initial proposal with destination logic, trade-offs
            explained, rough cost context, and next steps. This is not a quote — it is a planning
            framework to react to.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main form content
 */
function PlanningBriefForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<PlanningBriefState>(getDefaultPlanningBriefState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const yearOptions = getYearOptions();

  // Load draft from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(DRAFT_STORAGE_KEY);
        if (stored) {
          const draft = JSON.parse(stored);
          setState((prev) => ({ ...prev, ...draft }));
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save draft on state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state]);

  const updateField = <K extends keyof PlanningBriefState>(
    field: K,
    value: PlanningBriefState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const togglePriority = (priority: TravelerPriority) => {
    setState((prev) => {
      if (prev.priorities.includes(priority)) {
        return { ...prev, priorities: prev.priorities.filter((p) => p !== priority) };
      }
      if (prev.priorities.length >= 3) {
        return prev; // Max 3 priorities
      }
      return { ...prev, priorities: [...prev.priorities, priority] };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1 && !state.safariIntent) {
      newErrors.safariIntent = 'Please select a safari type';
    }

    if (step === 3 && !state.budgetBand) {
      newErrors.budgetBand = 'Please select a budget range';
    }

    if (step === 5) {
      if (!state.name.trim()) {
        newErrors.name = 'Please enter your name';
      }
      if (!state.email.trim()) {
        newErrors.email = 'Please enter your email';
      } else if (!isValidEmail(state.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!state.country) {
        newErrors.country = 'Please select your country';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      const attribution = getAttributionData();
      const payload = {
        ...planningBriefToPayload(state),
        attribution: Object.keys(attribution).length > 0 ? attribution : undefined,
      };

      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit planning brief');
      }

      const { inquiry_id } = await response.json();

      // Clear draft after successful submission
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }

      router.push(`/inquire/confirmation?id=${inquiry_id}`);
    } catch (error) {
      console.error('Failed to submit planning brief:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-8">
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Safari Index
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-300">Planning Brief</span>
          </div>
          <h1 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-3">
            Start Your Safari Planning Brief
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            This brief helps us understand what you are looking for before we build anything. We
            will ask about timing, budget, and priorities — then respond with a planning approach
            tailored to your constraints. If something does not make sense, we will say so.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm">
          <ProgressBar currentStep={currentStep} />

          {/* Step 1: Safari Intent */}
          {currentStep === 1 && (
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                What kind of safari are you planning?
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                This helps us understand which decisions matter most for your trip. You can refine
                this later.
              </p>

              <div className="space-y-3">
                {SAFARI_INTENTS.map((intent) => (
                  <IntentCard
                    key={intent.value}
                    intent={intent}
                    selected={state.safariIntent === intent.value}
                    onSelect={() => updateField('safariIntent', intent.value)}
                  />
                ))}
              </div>

              {errors.safariIntent && (
                <p className="mt-4 text-sm text-red-600">{errors.safariIntent}</p>
              )}
            </div>
          )}

          {/* Step 2: Timing, Destination & Duration */}
          {currentStep === 2 && (
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                When, where, and how long?
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                Safari timing affects wildlife, weather, crowds, and cost. Destination and duration
                shape what is realistic.
              </p>

              <div className="space-y-6">
                {/* Flexibility - moved up */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Date flexibility
                  </label>
                  <div className="space-y-2">
                    {TIMING_FLEXIBILITY.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          state.flexibility === opt.value
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="flexibility"
                          value={opt.value}
                          checked={state.flexibility === opt.value}
                          onChange={() => updateField('flexibility', opt.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            state.flexibility === opt.value
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-stone-300'
                          }`}
                        >
                          {state.flexibility === opt.value && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-stone-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fixed dates - calendar picker */}
                {state.flexibility === 'fixed' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <label className="block text-sm font-medium text-amber-800 mb-3">
                      Your fixed travel dates
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-amber-700 mb-1">Start date</label>
                        <input
                          type="date"
                          value={state.fixedStartDate || ''}
                          onChange={(e) => updateField('fixedStartDate', e.target.value || null)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-amber-700 mb-1">End date</label>
                        <input
                          type="date"
                          value={state.fixedEndDate || ''}
                          onChange={(e) => updateField('fixedEndDate', e.target.value || null)}
                          min={state.fixedStartDate || new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Month/Year selectors - for non-fixed dates */}
                {state.flexibility !== 'fixed' && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Preferred travel window
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={state.travelMonth || ''}
                        onChange={(e) =>
                          updateField('travelMonth', e.target.value ? parseInt(e.target.value) : null)
                        }
                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="">Select month</option>
                        {MONTH_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={state.travelYear || ''}
                        onChange={(e) =>
                          updateField('travelYear', e.target.value ? parseInt(e.target.value) : null)
                        }
                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="">Select year</option>
                        {yearOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Destination preference
                  </label>
                  <select
                    value={state.destination || ''}
                    onChange={(e) => updateField('destination', e.target.value || null)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Select destination</option>
                    <optgroup label="East Africa">
                      {DESTINATION_OPTIONS.filter((d) => d.region === 'east').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Southern Africa">
                      {DESTINATION_OPTIONS.filter((d) => d.region === 'south').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Trip duration
                  </label>
                  <div className="space-y-2">
                    {DURATION_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          state.duration === opt.value
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="duration"
                            value={opt.value}
                            checked={state.duration === opt.value}
                            onChange={() => updateField('duration', opt.value)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              state.duration === opt.value
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-stone-300'
                            }`}
                          >
                            {state.duration === opt.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-stone-700 font-medium">{opt.label}</span>
                        </div>
                        <span className="text-sm text-stone-500">{opt.description}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Budget Reality */}
          {currentStep === 3 && (
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                What budget range feels realistic for this trip?
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                These are per-person land costs, excluding international flights. Safari pricing
                varies significantly by season, destination, and accommodation tier. We will provide
                specific context in your proposal.
              </p>

              <div className="space-y-3">
                {BUDGET_BAND_OPTIONS.map((option) => (
                  <BudgetCard
                    key={option.value}
                    option={option}
                    selected={state.budgetBand === option.value}
                    onSelect={() => updateField('budgetBand', option.value)}
                  />
                ))}
              </div>

              {errors.budgetBand && (
                <p className="mt-4 text-sm text-red-600">{errors.budgetBand}</p>
              )}
            </div>
          )}

          {/* Step 4: Travelers & Priorities */}
          {currentStep === 4 && (
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                Who is traveling, and what matters most?
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                Every safari involves trade-offs. Knowing your priorities helps us recommend the
                right shape, not just the popular one.
              </p>

              <div className="space-y-6">
                {/* Traveler counts */}
                <div className="space-y-4 p-4 bg-stone-50 rounded-xl">
                  <NumberStepper
                    label="Number of travelers"
                    value={state.travelerCount}
                    onChange={(v) => updateField('travelerCount', v)}
                    min={1}
                    max={12}
                  />
                  <NumberStepper
                    label="Children under 12"
                    value={state.childrenCount}
                    onChange={(v) => updateField('childrenCount', v)}
                    min={0}
                    max={6}
                  />
                </div>

                {/* Priorities */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Top priorities (select up to 3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITY_OPTIONS.map((option) => (
                      <PriorityCheckbox
                        key={option.value}
                        option={option}
                        selected={state.priorities.includes(option.value)}
                        onToggle={() => togglePriority(option.value)}
                        disabled={state.priorities.length >= 3}
                      />
                    ))}
                  </div>
                </div>

                {/* Specific requests */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Anything specific you want to see or do?{' '}
                    <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={state.specificRequests}
                    onChange={(e) => updateField('specificRequests', e.target.value)}
                    placeholder="Gorilla trekking, Great Migration, specific parks..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Contact & Confirmation */}
          {currentStep === 5 && (
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                Where should we send your planning brief?
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                We respond within two business days. If your request involves constraints we cannot
                resolve, we will tell you directly rather than propose something that does not fit.
              </p>

              {/* Summary */}
              <BriefSummary state={state} onEdit={setCurrentStep} />

              {/* Contact fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Your name <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Full name"
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.name ? 'border-red-300' : 'border-stone-200'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email address <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={state.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.email ? 'border-red-300' : 'border-stone-200'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Country <span className="text-amber-600">*</span>
                  </label>
                  <select
                    value={state.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      errors.country ? 'border-red-300' : 'border-stone-200'
                    }`}
                  >
                    <option value="">Select country</option>
                    {COUNTRY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Phone <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Anything else we should know?{' '}
                    <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={state.additionalNotes}
                    onChange={(e) => updateField('additionalNotes', e.target.value)}
                    placeholder="Previous safari experience, concerns, constraints, questions..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* What happens next */}
              <WhatHappensNext />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Planning Brief'}
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-stone-400 mt-6">
          No booking or payment. Your information is used only to build your planning brief.
        </p>
      </div>

      <Footer />
    </main>
  );
}

/**
 * Inquiry Page with Suspense boundary
 */
export default function InquirePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50">
          <Navbar variant="solid" />
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-stone-500">Loading...</div>
          </div>
        </main>
      }
    >
      <PlanningBriefForm />
    </Suspense>
  );
}

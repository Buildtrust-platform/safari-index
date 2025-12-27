/**
 * Safari Inquiry Page
 *
 * Professional inquiry flow that captures traveler intent and links
 * to the decision system. No booking, pricing, or availability.
 *
 * Per governance:
 * - Documentary, calm tone
 * - No hype or urgency
 * - Links to decisions and guides
 * - Respects existing design system
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Send,
  Calendar,
  Users,
  Wallet,
  Mail,
  Phone,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import {
  getAllTrips,
  getTripById,
  TripArchetype,
} from '../content/trip-shapes/trips';
import { getItineraryById } from '../content/itineraries';
import {
  InquiryFormState,
  BUDGET_BANDS,
  TRAVEL_STYLES,
  MONTH_OPTIONS,
  TRAVELER_COUNTS,
  inferTravelStyleFromTrip,
  getYearOptions,
  isValidEmail,
  isValidWhatsApp,
} from '../../lib/inquiry';
import { getAttributionData } from '../../lib/attribution';

/**
 * Form field wrapper with label
 */
function FormField({
  label,
  required,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
        {Icon && <Icon className="w-4 h-4 text-stone-400" />}
        {label}
        {required && <span className="text-amber-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Select input component
 */
function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string | number | null;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Text input component
 */
function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors ${className}`}
    />
  );
}

/**
 * Textarea component
 */
function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors resize-none"
    />
  );
}

/**
 * Trip selection card
 */
function TripSelector({
  trips,
  selectedId,
  onSelect,
}: {
  trips: TripArchetype[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(!selectedId);

  return (
    <div className="space-y-3">
      {selectedId ? (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div>
            <p className="font-medium text-stone-900">
              {trips.find((t) => t.id === selectedId)?.title}
            </p>
            <p className="text-sm text-stone-500">
              {trips.find((t) => t.id === selectedId)?.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setIsExpanded(true);
            }}
            className="text-sm text-amber-700 hover:text-amber-800"
          >
            Change
          </button>
        </div>
      ) : isExpanded ? (
        <div className="space-y-2 max-h-64 overflow-y-auto border border-stone-200 rounded-lg p-2">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setIsExpanded(false);
            }}
            className="w-full p-3 text-left bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <p className="font-medium text-stone-700">No specific trip in mind</p>
            <p className="text-sm text-stone-500">I want to explore options</p>
          </button>
          {trips.map((trip) => (
            <button
              key={trip.id}
              type="button"
              onClick={() => {
                onSelect(trip.id);
                setIsExpanded(false);
              }}
              className="w-full p-3 text-left hover:bg-stone-50 rounded-lg transition-colors"
            >
              <p className="font-medium text-stone-900">{trip.title}</p>
              <p className="text-sm text-stone-500">{trip.subtitle}</p>
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 text-left border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <p className="font-medium text-stone-700">Select a trip shape</p>
          <p className="text-sm text-stone-500">Or continue without one</p>
        </button>
      )}
    </div>
  );
}

// Session storage key for draft persistence
const DRAFT_STORAGE_KEY = 'safari-inquiry-draft';

/**
 * Load draft from sessionStorage
 */
function loadDraft(): Partial<InquiryFormState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/**
 * Save draft to sessionStorage
 */
function saveDraft(state: InquiryFormState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear draft from sessionStorage
 */
function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Main inquiry form content (uses useSearchParams)
 */
function InquiryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query param prefill support
  const tripParam = searchParams.get('trip') || searchParams.get('trip_id');
  const itineraryParam = searchParams.get('itinerary');
  const decisionIdsParam = searchParams.get('selected_decision_ids');

  const allTrips = getAllTrips();

  // Support both trip shapes and itineraries - itineraries link to their trip shape
  const itinerary = itineraryParam ? getItineraryById(itineraryParam) : null;
  const preselectedTrip = tripParam
    ? getTripById(tripParam)
    : itinerary?.linked_trip_shape_id
      ? getTripById(itinerary.linked_trip_shape_id)
      : null;

  // Get decision IDs from itinerary if present
  const itineraryDecisionIds = itinerary?.linked_decisions || [];

  // Parse prefilled decision IDs from query param
  const prefilledDecisionIds = decisionIdsParam
    ? decisionIdsParam.split(',').map(id => id.trim()).filter(Boolean)
    : [];

  // Initialize form state with prefill + draft recovery
  const [formState, setFormState] = useState<InquiryFormState>(() => {
    // Start with defaults
    const defaults: InquiryFormState = {
      tripShapeId: preselectedTrip?.id || null,
      budgetBand: null,
      travelMonth: null,
      travelYear: null,
      travelerCount: 2,
      travelStyle: preselectedTrip ? inferTravelStyleFromTrip(preselectedTrip) : null,
      email: '',
      whatsapp: '',
      notes: '',
    };

    // Try to load draft from sessionStorage (client-side only)
    if (typeof window !== 'undefined') {
      const draft = loadDraft();
      if (draft) {
        // Merge draft with defaults, but prefer URL params for trip
        return {
          ...defaults,
          ...draft,
          // URL params take precedence for trip selection
          tripShapeId: preselectedTrip?.id || draft.tripShapeId || null,
          travelStyle: preselectedTrip
            ? inferTravelStyleFromTrip(preselectedTrip)
            : draft.travelStyle || null,
        };
      }
    }

    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track prefilled decision IDs separately (merged with trip-linked decisions on submit)
  // Combine query param decisions with itinerary-linked decisions
  const [additionalDecisionIds] = useState<string[]>([
    ...prefilledDecisionIds,
    ...itineraryDecisionIds,
  ]);

  // Persist draft on form state changes
  useEffect(() => {
    saveDraft(formState);
  }, [formState]);

  // Update travel style when trip changes
  useEffect(() => {
    if (formState.tripShapeId) {
      const trip = getTripById(formState.tripShapeId);
      if (trip && !formState.travelStyle) {
        const inferred = inferTravelStyleFromTrip(trip);
        if (inferred) {
          setFormState((prev) => ({ ...prev, travelStyle: inferred }));
        }
      }
    }
  }, [formState.tripShapeId, formState.travelStyle]);

  const updateField = <K extends keyof InquiryFormState>(
    field: K,
    value: InquiryFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formState.whatsapp && !isValidWhatsApp(formState.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid phone number';
    }

    if (!formState.budgetBand) {
      newErrors.budgetBand = 'Please select a budget range';
    }

    if (!formState.travelStyle) {
      newErrors.travelStyle = 'Please select a travel style';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const trip = formState.tripShapeId ? getTripById(formState.tripShapeId) : null;

      // Merge trip-linked decisions with prefilled decision IDs (deduplicated)
      const tripDecisions = trip?.linked_decisions || [];
      const allDecisionIds = [...new Set([...tripDecisions, ...additionalDecisionIds])];

      // Capture attribution data (never fails)
      const attribution = getAttributionData();

      // Build API request payload
      const payload = {
        trip_shape_id: formState.tripShapeId,
        budget_band: formState.budgetBand,
        travel_month: formState.travelMonth,
        travel_year: formState.travelYear,
        traveler_count: formState.travelerCount,
        travel_style: formState.travelStyle,
        email: formState.email,
        whatsapp: formState.whatsapp || null,
        linked_decision_ids: allDecisionIds,
        notes: formState.notes || null,
        source_path: window.location.pathname + window.location.search,
        // Attribution data for conversion intelligence (all optional)
        attribution: Object.keys(attribution).length > 0 ? attribution : undefined,
      };

      // Submit to API
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit inquiry');
      }

      const { inquiry_id } = await response.json();

      // Clear draft after successful submission
      clearDraft();

      // Navigate to confirmation with inquiry ID
      router.push(`/inquire/confirmation?id=${inquiry_id}`);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTrip = formState.tripShapeId ? getTripById(formState.tripShapeId) : null;
  const yearOptions = getYearOptions();

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages[3]} // floodplain-evening
        height="explore"
        overlay="strong"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="default" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Trip Brief</span>
            </div>

            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-3"
              data-testid="inquire-h1"
            >
              Request a Trip Brief
            </h1>

            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Tell us about your safari plans. We will capture your intent and connect you
              with the decisions that matter for your trip.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Form */}
      <div className="max-w-xl mx-auto px-4 md:px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Shape - optional starting point */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Trip Shape <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <TripSelector
              trips={allTrips}
              selectedId={formState.tripShapeId}
              onSelect={(id) => updateField('tripShapeId', id)}
            />
          </div>

          {/* When are you traveling? - Month + Year side by side */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              When are you traveling?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <SelectInput
                value={formState.travelMonth}
                onChange={(v) => updateField('travelMonth', v ? parseInt(v, 10) : null)}
                options={MONTH_OPTIONS}
                placeholder="Month"
              />
              <SelectInput
                value={formState.travelYear}
                onChange={(v) => updateField('travelYear', v ? parseInt(v, 10) : null)}
                options={yearOptions}
                placeholder="Year"
              />
            </div>
          </div>

          {/* Travelers + Budget side by side */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Travelers" icon={Users}>
              <SelectInput
                value={formState.travelerCount}
                onChange={(v) => updateField('travelerCount', parseInt(v, 10))}
                options={TRAVELER_COUNTS}
              />
            </FormField>

            <FormField label="Budget" required icon={Wallet} error={errors.budgetBand}>
              <SelectInput
                value={formState.budgetBand}
                onChange={(v) => updateField('budgetBand', v as InquiryFormState['budgetBand'])}
                options={BUDGET_BANDS}
                placeholder="Select"
              />
            </FormField>
          </div>

          {/* Travel Style - full width */}
          <FormField label="Travel Style" required error={errors.travelStyle}>
            <SelectInput
              value={formState.travelStyle}
              onChange={(v) => updateField('travelStyle', v as InquiryFormState['travelStyle'])}
              options={TRAVEL_STYLES}
              placeholder="How do you like to travel?"
            />
          </FormField>

          {/* Contact - Email required, WhatsApp optional */}
          <div className="space-y-4 pt-2">
            <FormField label="Email" required icon={Mail} error={errors.email}>
              <TextInput
                type="email"
                value={formState.email}
                onChange={(v) => updateField('email', v)}
                placeholder="your@email.com"
              />
            </FormField>

            <FormField label="WhatsApp" icon={Phone} error={errors.whatsapp}>
              <TextInput
                type="tel"
                value={formState.whatsapp}
                onChange={(v) => updateField('whatsapp', v)}
                placeholder="+1 234 567 8900 (optional)"
              />
            </FormField>
          </div>

          {/* Notes - optional */}
          <FormField label="Anything else?" icon={FileText}>
            <TextArea
              value={formState.notes}
              onChange={(v) => updateField('notes', v)}
              placeholder="Special requests, questions, or context..."
              rows={3}
            />
          </FormField>

          {/* Linked Decisions Preview - compact */}
          {((selectedTrip?.linked_decisions?.length ?? 0) > 0 || additionalDecisionIds.length > 0) && (
            <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100" data-testid="linked-decisions-preview">
              <p className="text-sm text-stone-600 mb-2">
                This inquiry links to relevant decisions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set([...(selectedTrip?.linked_decisions || []), ...additionalDecisionIds])]
                  .slice(0, 6)
                  .map((decisionId) => (
                    <span
                      key={decisionId}
                      className="px-2 py-0.5 bg-white text-stone-600 text-xs rounded border border-amber-200"
                      data-testid="linked-decision-chip"
                    >
                      {decisionId.replace(/-/g, ' ')}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="inquire-submit"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Trip Brief
              </>
            )}
          </button>

          {/* Footer Note */}
          <p className="text-center text-xs text-stone-400 pt-2">
            No booking or payment. Just a conversation starter.{' '}
            <Link
              href="/how-it-works"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              How it works
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </main>
  );
}

/**
 * Inquiry Page with Suspense boundary for useSearchParams
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
      <InquiryFormContent />
    </Suspense>
  );
}

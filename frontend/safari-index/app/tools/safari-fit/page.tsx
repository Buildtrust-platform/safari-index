'use client';

/**
 * Safari Fit Tool Page
 *
 * Per 13_frontend_templates.md Template 2: Tool Page Template
 * - Converts uncertainty into a stored decision object
 * - 5-7 inputs maximum
 * - Calm button labels, no pressure
 *
 * Governance:
 * - 02_decision_doctrine.md: Verdict-or-refusal logic
 * - 08_ai_behavior.md: No guarantees
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '../../../lib/api-client';

type BudgetBand = 'budget' | 'fair_value' | 'premium';
type DateType = 'fixed_dates' | 'month_year' | 'flexible';
type TravelerType = 'first_time' | 'repeat';

interface FormInputs {
  dateType: DateType;
  month: string;
  year: number;
  groupSize: number;
  budgetBand: BudgetBand;
  driveToleranceHours: number;
  travelerType: TravelerType;
  destination: string;
}

interface DecisionResult {
  decision_id: string;
  output: {
    type: 'decision' | 'refusal';
    decision?: {
      outcome: 'book' | 'wait' | 'switch' | 'discard';
      headline: string;
      summary: string;
      confidence: number;
    };
    refusal?: {
      reason: string;
      missing_or_conflicting_inputs: string[];
      safe_next_step: string;
    };
  };
}

type PageState = 'input' | 'loading' | 'result' | 'error';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DESTINATIONS = [
  'Tanzania',
  'Kenya',
  'Botswana',
  'South Africa',
  'Zambia',
  'Zimbabwe',
  'Namibia',
  'Rwanda',
  'Uganda',
];

function SafariFitContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');

  const [state, setState] = useState<PageState>('input');
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const [inputs, setInputs] = useState<FormInputs>({
    dateType: 'month_year',
    month: MONTHS[new Date().getMonth()],
    year: currentYear + 1,
    groupSize: 2,
    budgetBand: 'fair_value',
    driveToleranceHours: 4,
    travelerType: 'first_time',
    destination: 'Tanzania',
  });

  // Pre-fill from topic if provided
  useEffect(() => {
    if (topicParam) {
      // Extract destination from topic ID if possible
      if (topicParam.includes('tz') || topicParam.includes('tanzania')) {
        setInputs(prev => ({ ...prev, destination: 'Tanzania' }));
      } else if (topicParam.includes('ke') || topicParam.includes('kenya')) {
        setInputs(prev => ({ ...prev, destination: 'Kenya' }));
      }
      // Extract month if in topic
      const monthMatch = topicParam.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
      if (monthMatch) {
        const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
          .indexOf(monthMatch[1].toLowerCase());
        if (monthIndex >= 0) {
          setInputs(prev => ({ ...prev, month: MONTHS[monthIndex] }));
        }
      }
    }
  }, [topicParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError(null);

    try {
      const request = {
        task: 'DECISION',
        tracking: {
          session_id: `sess_fit_${Date.now()}`,
          traveler_id: null,
          lead_id: null,
        },
        user_context: {
          traveler_type: inputs.travelerType,
          budget_band: inputs.budgetBand,
          pace_preference: 'balanced',
          drive_tolerance_hours: inputs.driveToleranceHours,
          risk_tolerance: 'medium',
          dates: inputs.dateType === 'month_year'
            ? { type: 'month_year', month: inputs.month, year: inputs.year }
            : { type: inputs.dateType },
          group_size: inputs.groupSize,
          prior_decisions: [],
        },
        request: {
          question: `Is ${inputs.month} ${inputs.year} a good time for a ${inputs.destination} safari?`,
          scope: 'thin_edge_scope_only=true',
          destinations_considered: [inputs.destination],
          constraints: {},
        },
        facts: {
          known_constraints: [],
          known_tradeoffs: [],
          destination_notes: [],
        },
        policy: {
          must_refuse_if: ['guarantee_requested', 'inputs_conflict_unbounded'],
          forbidden_phrases: ['unforgettable', 'magical', 'once-in-a-lifetime'],
        },
      };

      const response = await fetch(`${API_BASE}/decision/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Service responded with ${response.status}`);
      }

      const data: DecisionResult = await response.json();
      setResult(data);
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('input');
    setResult(null);
    setError(null);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2">Safari Fit</h1>
      <p className="text-gray-600 mb-8">
        Checks timing, pace, and constraints to produce a clear recommendation.
      </p>

      {/* What it does / does not do */}
      {state === 'input' && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h2 className="font-medium text-gray-900 mb-2">Does</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Clarifies fit for your dates</li>
              <li>Names trade-offs honestly</li>
              <li>Recommends an action</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h2 className="font-medium text-gray-900 mb-2">Does not</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Guarantee sightings</li>
              <li>Replace local conditions</li>
              <li>Force booking</li>
            </ul>
          </div>
        </div>
      )}

      {/* Input Form */}
      {state === 'input' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <p className="text-xs text-gray-500 mb-2">Where are you considering?</p>
            <select
              value={inputs.destination}
              onChange={(e) => setInputs({ ...inputs, destination: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <p className="text-xs text-gray-500 mb-2">When are you planning to travel?</p>
              <select
                value={inputs.month}
                onChange={(e) => setInputs({ ...inputs, month: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <p className="text-xs text-gray-500 mb-2">&nbsp;</p>
              <select
                value={inputs.year}
                onChange={(e) => setInputs({ ...inputs, year: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group size
            </label>
            <p className="text-xs text-gray-500 mb-2">Affects vehicle and camp options</p>
            <select
              value={inputs.groupSize}
              onChange={(e) => setInputs({ ...inputs, groupSize: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          {/* Budget Band */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget tier
            </label>
            <p className="text-xs text-gray-500 mb-2">Determines accommodation options</p>
            <div className="flex gap-2">
              {[
                { value: 'budget', label: 'Budget' },
                { value: 'fair_value', label: 'Fair Value' },
                { value: 'premium', label: 'Premium' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInputs({ ...inputs, budgetBand: option.value as BudgetBand })}
                  className={`flex-1 py-2 px-3 rounded border text-sm font-medium transition-colors ${
                    inputs.budgetBand === option.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drive Tolerance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drive tolerance
            </label>
            <p className="text-xs text-gray-500 mb-2">Maximum driving hours per day</p>
            <select
              value={inputs.driveToleranceHours}
              onChange={(e) => setInputs({ ...inputs, driveToleranceHours: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {[2, 3, 4, 5, 6, 7, 8].map((h) => (
                <option key={h} value={h}>{h} hours</option>
              ))}
            </select>
          </div>

          {/* Traveler Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safari experience
            </label>
            <p className="text-xs text-gray-500 mb-2">Affects recommendation framing</p>
            <div className="flex gap-2">
              {[
                { value: 'first_time', label: 'First safari' },
                { value: 'repeat', label: 'Been before' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInputs({ ...inputs, travelerType: option.value as TravelerType })}
                  className={`flex-1 py-2 px-3 rounded border text-sm font-medium transition-colors ${
                    inputs.travelerType === option.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-colors"
          >
            Get a recommendation
          </button>
        </form>
      )}

      {/* Loading State */}
      {state === 'loading' && (
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-600">Evaluating your inputs...</p>
        </div>
      )}

      {/* Result State */}
      {state === 'result' && result && (
        <div className="space-y-6">
          {result.output.type === 'decision' && result.output.decision && (
            <>
              {/* Verdict Card */}
              <div className={`rounded-lg p-6 ${
                result.output.decision.outcome === 'book' ? 'bg-green-50 border border-green-200' :
                result.output.decision.outcome === 'wait' ? 'bg-amber-50 border border-amber-200' :
                result.output.decision.outcome === 'switch' ? 'bg-blue-50 border border-blue-200' :
                'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium uppercase ${
                    result.output.decision.outcome === 'book' ? 'text-green-700' :
                    result.output.decision.outcome === 'wait' ? 'text-amber-700' :
                    result.output.decision.outcome === 'switch' ? 'text-blue-700' :
                    'text-gray-700'
                  }`}>
                    {result.output.decision.outcome}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(result.output.decision.confidence * 100)}% confidence
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {result.output.decision.headline}
                </h2>
                <p className="text-gray-700">
                  {result.output.decision.summary}
                </p>
              </div>

              {/* View Full Decision Link */}
              <div className="text-center">
                <Link
                  href={`/decisions/tanzania-safari-${inputs.month.toLowerCase()}`}
                  prefetch={false}
                  className="text-gray-600 hover:text-gray-900 text-sm underline"
                >
                  View full decision with assumptions and trade-offs
                </Link>
              </div>
            </>
          )}

          {result.output.type === 'refusal' && result.output.refusal && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-amber-900 mb-2">
                Cannot make a recommendation
              </h2>
              <p className="text-amber-800 mb-4">
                {result.output.refusal.reason}
              </p>
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">What we need:</p>
                <ul className="list-disc list-inside space-y-1">
                  {result.output.refusal.missing_or_conflicting_inputs.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-sm text-amber-800">
                <strong>Next step:</strong> {result.output.refusal.safe_next_step}
              </p>
            </div>
          )}

          {/* Try Again */}
          <button
            onClick={handleReset}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded font-medium hover:bg-gray-50 transition-colors"
          >
            Try different inputs
          </button>
        </div>
      )}

      {/* Error State */}
      {state === 'error' && (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded font-medium hover:bg-gray-50 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link href="/explore" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to explore
        </Link>
      </div>
    </main>
  );
}

export default function SafariFitPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      }
    >
      <SafariFitContent />
    </Suspense>
  );
}

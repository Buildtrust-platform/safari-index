/**
 * Inquiry Confirmation Page
 *
 * Displays a read-only summary of the submitted trip brief
 * with quiet links to relevant decisions and guides.
 *
 * Loads inquiry data from API by inquiry ID.
 *
 * Per governance:
 * - No promises, timelines, or sales language
 * - Documentary, calm tone
 * - Links to decision system
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Mail,
  Phone,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '../../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../../components/visual';
import { BUDGET_BANDS, TRAVEL_STYLES, MONTH_OPTIONS } from '../../../lib/inquiry';
import { getTripById } from '../../content/trip-shapes/trips';
import { getPublishedTopics } from '../../content/decision-topics';
import type { InquiryRecord } from '../../../lib/contracts';

/**
 * Summary row component
 */
function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0">
      <Icon className="w-5 h-5 text-stone-400 mt-0.5" />
      <div>
        <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
        <p className="text-stone-900">{value}</p>
      </div>
    </div>
  );
}

/**
 * Format budget band for display
 */
function formatBudgetBand(band: string): string {
  const found = BUDGET_BANDS.find((b) => b.value === band);
  return found?.label || band;
}

/**
 * Format travel style for display
 */
function formatTravelStyle(style: string): string {
  const found = TRAVEL_STYLES.find((s) => s.value === style);
  return found?.label || style;
}

/**
 * Format month for display
 */
function formatMonth(month: number | null): string | null {
  if (!month) return null;
  const found = MONTH_OPTIONS.find((m) => m.value === month);
  return found?.label || null;
}

/**
 * Error state component
 */
function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-stone-400" />
          </div>
          <h1 className="font-editorial text-2xl font-semibold text-stone-900 mb-3">
            Inquiry Not Found
          </h1>
          <p className="text-stone-600 mb-6">{message}</p>
          <Link
            href="/inquire"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            Start a New Inquiry
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Main confirmation content (uses useSearchParams)
 */
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get('id');

  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchInquiry() {
      if (!inquiryId) {
        setError('No inquiry ID provided. Please submit an inquiry first.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/inquire?id=${encodeURIComponent(inquiryId)}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('This inquiry could not be found. It may have expired or the ID is incorrect.');
          } else {
            setError('Unable to load inquiry details. Please try again.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setInquiry(data);
      } catch (err) {
        console.error('Failed to fetch inquiry:', err);
        setError('Unable to load inquiry details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchInquiry();
  }, [inquiryId]);

  const handleCopyId = () => {
    if (inquiry?.inquiry_id) {
      navigator.clipboard.writeText(inquiry.inquiry_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <Navbar variant="solid" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-stone-500">Loading inquiry details...</div>
        </div>
      </main>
    );
  }

  if (error || !inquiry) {
    return <ErrorState message={error || 'Inquiry not found'} />;
  }

  const trip = inquiry.trip_shape_id ? getTripById(inquiry.trip_shape_id) : null;
  const allTopics = getPublishedTopics();

  // Get linked decisions with full metadata
  const linkedDecisions = inquiry.linked_decision_ids
    .map((id) => allTopics.find((t) => t.topic_id === id || t.slug === id))
    .filter(Boolean)
    .slice(0, 6);

  const travelWindow = [
    formatMonth(inquiry.travel_month),
    inquiry.travel_year?.toString(),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages[0]} // savannah-morning
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
              <Link href="/inquire" className="hover:text-white transition-colors">
                Trip Brief
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Confirmed</span>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-3"
              data-testid="confirmation-h1"
            >
              Trip Brief Captured
            </h1>

            <p className="text-white/80 text-lg max-w-xl mx-auto">
              We have recorded your safari planning intent. Review the summary below
              and explore the decisions that matter for your trip.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        {/* Inquiry ID */}
        <div className="mb-8 p-4 bg-stone-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                Inquiry Reference
              </p>
              <p className="font-mono text-stone-900" data-testid="inquiry-id">
                {inquiry.inquiry_id}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
              title="Copy ID"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 mb-8">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Your Trip Brief
          </h2>

          {/* Trip Shape */}
          {trip && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs text-amber-700 uppercase tracking-wide mb-1">
                    Trip Shape
                  </p>
                  <p className="font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
                    {trip.title}
                  </p>
                  <p className="text-sm text-stone-600">{trip.subtitle}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Summary Details */}
          <div className="space-y-0">
            <SummaryRow
              icon={Wallet}
              label="Budget Range"
              value={formatBudgetBand(inquiry.budget_band)}
            />
            <SummaryRow
              icon={Users}
              label="Travelers"
              value={`${inquiry.traveler_count} ${inquiry.traveler_count === 1 ? 'person' : 'people'}`}
            />
            <SummaryRow
              icon={Users}
              label="Travel Style"
              value={formatTravelStyle(inquiry.travel_style)}
            />
            <SummaryRow
              icon={Calendar}
              label="Travel Window"
              value={travelWindow || 'Not specified'}
            />
            <SummaryRow icon={Mail} label="Email" value={inquiry.email} />
            <SummaryRow icon={Phone} label="WhatsApp" value={inquiry.whatsapp} />
          </div>

          {/* Notes */}
          {inquiry.notes && (
            <div className="mt-6 pt-6 border-t border-stone-100">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                Additional Notes
              </p>
              <p className="text-stone-700">{inquiry.notes}</p>
            </div>
          )}
        </section>

        {/* Linked Decisions */}
        {linkedDecisions.length > 0 && (
          <section className="mb-8" data-testid="linked-decisions">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Decisions to Confirm
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              These decisions are relevant to your trip shape. Review them to understand
              the trade-offs before booking.
            </p>
            <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
              {linkedDecisions.map((topic) => (
                <Link
                  key={topic!.topic_id}
                  href={`/decisions/${topic!.slug}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors group"
                  data-testid="decision-link"
                >
                  <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                    {topic!.question}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Next Steps */}
        <section className="bg-stone-100 rounded-xl p-6">
          <h3 className="font-medium text-stone-900 mb-3">What happens next</h3>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-stone-400 mt-1">1.</span>
              <span>
                Review the linked decisions to understand trade-offs for your trip.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 mt-1">2.</span>
              <span>
                Use your inquiry reference to track your planning progress.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 mt-1">3.</span>
              <span>
                Explore{' '}
                <Link
                  href="/guides"
                  className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  our guides
                </Link>{' '}
                for deeper context on safari planning.
              </span>
            </li>
          </ul>
        </section>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/trips"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Browse Trip Shapes
          </Link>
          <Link
            href="/decisions"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            Explore All Decisions
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Confirmation Page with Suspense boundary for useSearchParams
 */
export default function InquiryConfirmationPage() {
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
      <ConfirmationContent />
    </Suspense>
  );
}

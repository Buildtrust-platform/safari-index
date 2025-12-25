/**
 * Public Proposal Page
 *
 * Shareable, read-only view of a Safari Proposal Pack.
 * No authentication required - token serves as authorization.
 *
 * Per governance:
 * - noindex, nofollow (private share link)
 * - Calm, documentary tone
 * - No urgency language or sales pressure
 * - Professional safari operator appearance
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Wallet,
  Calendar,
  ArrowRight,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import { Navbar } from '../../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../../components/visual';
import { getTripById } from '../../content/trip-shapes/trips';
import { getPublishedTopics } from '../../content/decision-topics';
import { BUDGET_BANDS, TRAVEL_STYLES, MONTH_OPTIONS } from '../../../lib/inquiry';
import type { ProposalRecord } from '../../../lib/contracts';

interface ProposalData {
  proposal: ProposalRecord;
  inquiry: {
    budget_band: string;
    travel_month: number | null;
    travel_year: number | null;
    traveler_count: number;
    travel_style: string;
  };
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
            Proposal Not Found
          </h1>
          <p className="text-stone-600 mb-6">{message}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            Return Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Missing content placeholder
 */
function MissingPlaceholder({ label }: { label: string }) {
  return (
    <div className="p-4 bg-stone-50 border border-dashed border-stone-300 rounded-lg">
      <p className="text-sm text-stone-500 italic">
        {label} - needs operator input
      </p>
    </div>
  );
}

export default function PublicProposalPage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const response = await fetch(`/api/proposals/${token}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('This proposal could not be found or may have expired.');
          } else if (response.status === 400) {
            setError('Invalid proposal link.');
          } else {
            setError('Unable to load proposal. Please try again.');
          }
          setLoading(false);
          return;
        }

        const proposalData = await response.json();
        setData(proposalData);
      } catch (err) {
        console.error('Failed to fetch proposal:', err);
        setError('Unable to load proposal. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchProposal();
    }
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <Navbar variant="solid" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-stone-500">Loading proposal...</div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return <ErrorState message={error || 'Proposal not found'} />;
  }

  const { proposal, inquiry } = data;
  const allTopics = getPublishedTopics();

  // Get recommended trips with full metadata
  const recommendedTrips = proposal.recommended_trip_ids
    .map((id) => getTripById(id))
    .filter(Boolean);

  // Get recommended decisions with full metadata
  const recommendedDecisions = proposal.recommended_decision_ids
    .map((id) => allTopics.find((t) => t.slug === id || t.topic_id === id))
    .filter(Boolean);

  const travelWindow = [
    formatMonth(inquiry.travel_month),
    inquiry.travel_year?.toString(),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* noindex meta tag - private share link */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-50">
        <Navbar variant="transparent" />

        {/* Hero */}
        <ImageBand
          image={ecosystemImages[0]}
          height="explore"
          overlay="strong"
          align="center"
          priority
          alwaysRender
        >
          <ImageBandContent maxWidth="default" className="pt-24 pb-8">
            <div className="text-center">
              {/* Title */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Operator badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full mb-4">
                Safari Index Proposal
              </span>

              <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-3">
                Your Safari Proposal
              </h1>

              {proposal.traveler_name && (
                <p className="text-white/80 text-lg">
                  Prepared for {proposal.traveler_name}
                </p>
              )}

              <p className="text-white/60 text-sm mt-2">
                Operated by Safari Index
              </p>
            </div>
          </ImageBandContent>
        </ImageBand>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
          {/* Introduction Note */}
          {proposal.intro_note ? (
            <section className="mb-8 bg-white border border-stone-200 rounded-xl p-6">
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {proposal.intro_note}
              </p>
            </section>
          ) : (
            <section className="mb-8">
              <MissingPlaceholder label="Introduction note" />
            </section>
          )}

          {/* Trip Summary */}
          <section className="mb-8 bg-white border border-stone-200 rounded-xl p-6">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Trip Overview
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Budget Range</p>
                  <p className="text-stone-900">{formatBudgetBand(inquiry.budget_band)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Travelers</p>
                  <p className="text-stone-900">
                    {inquiry.traveler_count} {inquiry.traveler_count === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Travel Style</p>
                  <p className="text-stone-900">{formatTravelStyle(inquiry.travel_style)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Travel Window</p>
                  <p className="text-stone-900">{travelWindow || 'Flexible'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recommended Safaris */}
          {recommendedTrips.length > 0 ? (
            <section className="mb-8">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Recommended Safaris
              </h2>

              <div className="space-y-3">
                {recommendedTrips.map((trip) => (
                  <Link
                    key={trip!.id}
                    href={`/trips/${trip!.id}`}
                    className="block bg-white border border-stone-200 rounded-xl p-4 hover:border-amber-300 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                            {trip!.title}
                          </p>
                          <p className="text-sm text-stone-600">{trip!.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-8">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Recommended Safaris
              </h2>
              <MissingPlaceholder label="Safari recommendations" />
            </section>
          )}

          {/* Decisions to Review */}
          {recommendedDecisions.length > 0 ? (
            <section className="mb-8">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Decisions to Consider
              </h2>
              <p className="text-sm text-stone-500 mb-4">
                Review these decisions to understand key trade-offs for your trip.
              </p>

              <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
                {recommendedDecisions.map((topic) => (
                  <Link
                    key={topic!.topic_id}
                    href={`/decisions/${topic!.slug}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors group"
                  >
                    <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                      {topic!.question}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-8">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Decisions to Consider
              </h2>
              <MissingPlaceholder label="Decision recommendations" />
            </section>
          )}

          {/* Pricing Notes */}
          <section className="mb-8">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Pricing Context
            </h2>
            {proposal.pricing_notes ? (
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {proposal.pricing_notes}
                </p>
              </div>
            ) : (
              <MissingPlaceholder label="Pricing notes" />
            )}
          </section>

          {/* Next Steps */}
          <section className="mb-8">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Next Steps
            </h2>
            {proposal.next_steps ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {proposal.next_steps}
                </p>
              </div>
            ) : (
              <MissingPlaceholder label="Next steps" />
            )}
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-200">
            <Link
              href="/trips"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              Browse All Safaris
            </Link>
            <Link
              href="/decisions"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
            >
              Explore Decisions
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* PDF Download */}
          <div className="mt-8 text-center">
            <Link
              href={`/api/proposals/${token}/pdf`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Print / Save as PDF
            </Link>
          </div>

          {/* Footer attribution */}
          <div className="mt-12 text-center text-xs text-stone-400">
            <p>Proposal prepared by Safari Index</p>
            <p className="text-stone-500 mt-1">Private Safari Operator · East & Southern Africa</p>
            <p className="mt-2 font-mono">
              Ref: {proposal.proposal_id}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

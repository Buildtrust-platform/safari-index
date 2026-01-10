/**
 * Refusal Example: Timing Impossibility
 *
 * Demonstrates how Vurara Safaris refuses plans that request
 * river crossings during periods with negligible probability.
 *
 * Static educational content. No backend logic.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../../components/layout';
import { ChevronRight, Calendar, XCircle, Clock, AlertTriangle, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Refusal Example: River Crossing Timing | Vurara Safaris',
  description: 'Why Vurara Safaris refused a safari plan requesting Mara River crossings in April, when crossing probability is below 5%.',
};

export default function TimingRefusalPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Vurara Safaris
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              How it works
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-300">Refusal example</span>
          </div>

          {/* Refusal badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border border-red-700/50 rounded-full text-red-300 text-sm mb-4">
            <XCircle className="w-4 h-4" />
            <span>Plan Refused</span>
          </div>

          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4">
            Why this safari plan was refused
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Vurara Safaris refuses plans when the requested experience has a negligible
            probability of occurring. This protects travelers from building expectations
            around events that are unlikely to happen.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

        {/* Refusal Summary */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Refusal Summary
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="border-b border-stone-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">Refusal Type</p>
                <p className="font-medium text-stone-900">Timing Impossibility</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">What was requested</p>
                <p className="text-stone-900">
                  A 7-day Kenya safari in April with Mara River crossings as the primary objective.
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">Why it fails under real conditions</p>
                <p className="text-stone-900">
                  The Great Migration herds are in the southern Serengeti during April,
                  approximately 300km from the Mara River. River crossings at the Mara
                  occur between July and October. The probability of witnessing a crossing
                  in April is below 5%. Building a trip around this expectation would
                  result in certain disappointment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Constraints Breakdown */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Constraints Violated
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Timing constraint</p>
                  <p className="text-sm text-stone-500">
                    Migration herds not present in northern Mara during April
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Probability threshold</p>
                  <p className="text-sm text-stone-500">
                    Less than 5% chance of witnessing target experience
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Geographic distance</p>
                  <p className="text-sm text-stone-500">
                    Herds located 300+ km from requested crossing points
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* What would make this viable */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            What would make this viable
          </h2>
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Change travel dates to July–October</p>
                  <p className="text-sm text-stone-500 mt-1">
                    River crossings occur when herds move north. Peak crossing probability
                    is August–September. A July–October window would align with actual
                    migration patterns.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Follow the herds to southern Serengeti</p>
                  <p className="text-sm text-stone-500 mt-1">
                    In April, the migration is in the southern Serengeti and Ndutu area.
                    A Tanzania-focused itinerary would allow witnessing calving season
                    and herd concentrations.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Remove river crossing as primary objective</p>
                  <p className="text-sm text-stone-500 mt-1">
                    A Kenya safari in April offers excellent wildlife viewing in the Mara
                    (resident game, big cats, fewer crowds) without the migration spectacle.
                    Adjusting expectations enables a viable trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Vurara Safaris refuses */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Why Vurara Safaris refuses instead of guessing
          </h2>
          <div className="bg-stone-100 rounded-xl border border-stone-200 p-6">
            <p className="text-stone-700 leading-relaxed">
              A weak recommendation is worse than no recommendation. If Vurara Safaris
              issued a verdict for this plan, the traveler would spend significant money
              and time pursuing an experience that cannot occur. Refusal protects the
              traveler from regret and preserves the integrity of Vurara Safaris verdicts.
              When we say a plan works, it works. When it cannot work, we say so clearly.
            </p>
          </div>
        </section>

        {/* Related links */}
        <section className="border-t border-stone-200 pt-8">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
            Related
          </h3>
          <div className="space-y-2">
            <Link
              href="/decisions/kenya-safari-august"
              className="block text-amber-700 hover:text-amber-800"
            >
              When to visit Kenya for the migration
            </Link>
            <Link
              href="/decisions/tanzania-vs-kenya-first-safari"
              className="block text-amber-700 hover:text-amber-800"
            >
              Tanzania vs Kenya for a first safari
            </Link>
            <Link
              href="/how-it-works"
              className="block text-amber-700 hover:text-amber-800"
            >
              How Vurara Safaris makes decisions
            </Link>
          </div>
        </section>

      </div>

      <Footer variant="decision-system" />
    </main>
  );
}

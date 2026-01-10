/**
 * Refusal Example: Logistics Overload
 *
 * Demonstrates how Vurara Safaris refuses plans that attempt
 * to cover too many parks in too few days by road.
 *
 * Static educational content. No backend logic.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../../components/layout';
import { ChevronRight, Route, XCircle, Clock, Car, Zap, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Refusal Example: Too Many Parks | Vurara Safaris',
  description: 'Why Vurara Safaris refused a safari plan attempting 5 parks in 6 days by road, resulting in unsustainable driving and minimal game time.',
};

export default function LogisticsRefusalPage() {
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
            Vurara Safaris refuses plans when logistical constraints make the
            experience unsustainable. Excessive driving leaves insufficient
            time for wildlife viewing and causes traveler fatigue.
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
                <Route className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">Refusal Type</p>
                <p className="font-medium text-stone-900">Logistics Overload</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">What was requested</p>
                <p className="text-stone-900">
                  A 6-day Tanzania safari covering Tarangire, Lake Manyara, Ngorongoro Crater,
                  Serengeti, and Lake Natron, traveling entirely by road.
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">Why it fails under real conditions</p>
                <p className="text-stone-900">
                  This route requires approximately 1,200 km of driving on unpaved roads.
                  At realistic safari speeds (40-50 km/h average), transfer days would
                  consume 6-8 hours of driving each, leaving only early morning or late
                  afternoon for game viewing. The traveler would spend more time in a
                  vehicle than observing wildlife, defeating the purpose of a safari.
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
                  <p className="font-medium text-stone-900">Daily driving limit exceeded</p>
                  <p className="text-sm text-stone-500">
                    Multiple days require 6+ hours of road transfer, exceeding sustainable limits
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Minimum park time not met</p>
                  <p className="text-sm text-stone-500">
                    Less than 4 hours of game viewing possible on transfer days
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Cumulative fatigue threshold</p>
                  <p className="text-sm text-stone-500">
                    Back-to-back long driving days cause physical exhaustion
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Total distance unrealistic</p>
                  <p className="text-sm text-stone-500">
                    1,200+ km on unpaved roads in 6 days is not sustainable
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
                  <MapPin className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Reduce to 3 parks</p>
                  <p className="text-sm text-stone-500 mt-1">
                    A focused itinerary covering Tarangire, Ngorongoro, and Serengeti
                    allows adequate time in each location. Lake Manyara can be a half-day
                    stop. Lake Natron requires a separate trip.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Add internal flights</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Flying between Arusha, Serengeti, and Lake Natron eliminates
                    multi-hour road transfers. This converts driving days into
                    full game-viewing days and makes the 5-park itinerary feasible.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Extend to 10-12 days</p>
                  <p className="text-sm text-stone-500 mt-1">
                    With additional days, the road-based itinerary becomes viable.
                    Each park receives 2 nights minimum, and driving days include
                    rest periods. This pacing matches realistic safari conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logistics breakdown */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Route Analysis
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left p-3 font-medium text-stone-700">Segment</th>
                  <th className="text-right p-3 font-medium text-stone-700">Distance</th>
                  <th className="text-right p-3 font-medium text-stone-700">Drive Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-3 text-stone-900">Arusha to Tarangire</td>
                  <td className="p-3 text-right text-stone-600">120 km</td>
                  <td className="p-3 text-right text-stone-600">2.5 hrs</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Tarangire to Lake Manyara</td>
                  <td className="p-3 text-right text-stone-600">70 km</td>
                  <td className="p-3 text-right text-stone-600">1.5 hrs</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Manyara to Ngorongoro</td>
                  <td className="p-3 text-right text-stone-600">50 km</td>
                  <td className="p-3 text-right text-stone-600">1.5 hrs</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Ngorongoro to Serengeti</td>
                  <td className="p-3 text-right text-stone-600">145 km</td>
                  <td className="p-3 text-right text-stone-600">4 hrs</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Serengeti to Lake Natron</td>
                  <td className="p-3 text-right text-stone-600">250 km</td>
                  <td className="p-3 text-right text-stone-600">6 hrs</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Lake Natron to Arusha</td>
                  <td className="p-3 text-right text-stone-600">230 km</td>
                  <td className="p-3 text-right text-stone-600">5.5 hrs</td>
                </tr>
                <tr className="bg-stone-50 font-medium">
                  <td className="p-3 text-stone-900">Total</td>
                  <td className="p-3 text-right text-stone-900">865 km</td>
                  <td className="p-3 text-right text-stone-900">21 hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-stone-500 mt-3">
            Note: Times assume dry season conditions and no delays. Wet season adds 20-40% to estimates.
          </p>
        </section>

        {/* Why Vurara Safaris refuses */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Why Vurara Safaris refuses instead of guessing
          </h2>
          <div className="bg-stone-100 rounded-xl border border-stone-200 p-6">
            <p className="text-stone-700 leading-relaxed">
              Many safari operators will book this itinerary because it generates revenue.
              The traveler discovers the problem only when they are exhausted on day 3,
              having spent more time on dusty roads than watching wildlife. Vurara Safaris
              refuses this plan upfront because the outcome is predictable: dissatisfaction.
              A shorter, focused itinerary delivers a better experience than an ambitious
              one that cannot be executed well.
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
              href="/decisions/is-5-days-enough-for-safari"
              className="block text-amber-700 hover:text-amber-800"
            >
              Is 5 days enough for a Tanzania safari?
            </Link>
            <Link
              href="/trips"
              className="block text-amber-700 hover:text-amber-800"
            >
              Sample Tanzania itineraries
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

/**
 * Refusal Example: Budget-Expectation Mismatch
 *
 * Demonstrates how Vurara Safaris refuses plans where stated
 * expectations cannot be met within stated budget constraints.
 *
 * Static educational content. No backend logic.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../../components/layout';
import { ChevronRight, DollarSign, XCircle, TrendingDown, Home, Plane, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Refusal Example: Budget Mismatch | Vurara Safaris',
  description: 'Why Vurara Safaris refused a safari plan requesting luxury lodges and fly-in access on a mid-range budget.',
};

export default function BudgetRefusalPage() {
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
            Vurara Safaris refuses plans when stated expectations fundamentally
            conflict with stated budget constraints. Recommending a plan that
            cannot deliver what the traveler expects causes disappointment.
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
                <DollarSign className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">Refusal Type</p>
                <p className="font-medium text-stone-900">Budget-Expectation Mismatch</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">What was requested</p>
                <p className="text-stone-900">
                  A 10-day Botswana safari with fly-in access to the Okavango Delta,
                  luxury tented camps, private guiding, and a maximum budget of
                  $6,000 per person including international flights.
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">Why it fails under real conditions</p>
                <p className="text-stone-900">
                  Luxury fly-in Botswana safaris start at approximately $800-1,200 per
                  person per night. A 10-day itinerary at this level costs $8,000-12,000
                  before flights. The stated budget of $6,000 total cannot accommodate
                  even the minimum accommodation costs for the requested experience tier,
                  let alone flights, park fees, and transfers.
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
                  <p className="font-medium text-stone-900">Accommodation cost floor</p>
                  <p className="text-sm text-stone-500">
                    Requested tier (luxury tented) minimum: $800/night vs. available budget: ~$350/night
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Transfer mode requirement</p>
                  <p className="text-sm text-stone-500">
                    Fly-in access adds $300-500 per segment; road access incompatible with Delta camps
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">International flight allocation</p>
                  <p className="text-sm text-stone-500">
                    Flights to Botswana typically cost $1,500-2,500; leaves insufficient funds for safari
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Mathematical impossibility</p>
                  <p className="text-sm text-stone-500">
                    Total minimum cost for requested experience: ~$12,000. Budget: $6,000. Gap: 100%
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Cost breakdown */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Cost Reality
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left p-3 font-medium text-stone-700">Component</th>
                  <th className="text-right p-3 font-medium text-stone-700">Requested Tier</th>
                  <th className="text-right p-3 font-medium text-stone-700">Budget Allows</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-3 text-stone-900">International flights</td>
                  <td className="p-3 text-right text-stone-600">$2,000</td>
                  <td className="p-3 text-right text-stone-600">$2,000</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Accommodation (9 nights)</td>
                  <td className="p-3 text-right text-stone-600">$8,100</td>
                  <td className="p-3 text-right text-red-600">$3,150</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Internal flights (3 segments)</td>
                  <td className="p-3 text-right text-stone-600">$1,200</td>
                  <td className="p-3 text-right text-red-600">$0</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Park fees & extras</td>
                  <td className="p-3 text-right text-stone-600">$500</td>
                  <td className="p-3 text-right text-stone-600">$500</td>
                </tr>
                <tr className="bg-stone-50 font-medium">
                  <td className="p-3 text-stone-900">Total</td>
                  <td className="p-3 text-right text-stone-900">$11,800</td>
                  <td className="p-3 text-right text-stone-900">$5,650</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-stone-500 mt-3">
            Figures represent per-person costs during shoulder season. Peak season adds 20-40%.
          </p>
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
                  <TrendingDown className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Adjust expectations to mid-range</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Quality mid-range camps in Botswana run $400-600/night. A self-drive
                    Chobe itinerary combined with a mobile safari can deliver excellent
                    wildlife at this price point, though without the exclusivity of
                    private Delta concessions.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Increase budget to $12,000-15,000</p>
                  <p className="text-sm text-stone-500 mt-1">
                    At this level, the requested experience becomes achievable. Luxury
                    fly-in camps, private guiding, and quality game areas are all possible.
                    This is the true cost of a premium Botswana safari.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Switch destination to Tanzania or Kenya</p>
                  <p className="text-sm text-stone-500 mt-1">
                    For $6,000 total including flights, a quality Tanzania or Kenya safari
                    is achievable. Mid-range lodges in the Serengeti or Masai Mara offer
                    excellent wildlife at lower price points than Botswana.
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
              Some operators would book this client into budget camps and call it
              &ldquo;luxury&rdquo; because the word appears in the marketing. The traveler
              arrives expecting private plunge pools and finds shared facilities.
              Vurara Safaris refuses to participate in this mismatch. When expectations
              and budget are incompatible, we state that clearly rather than deliver
              a compromised experience dressed up with misleading language.
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
              href="/decisions/tanzania-safari-on-budget"
              className="block text-amber-700 hover:text-amber-800"
            >
              How to do Tanzania on a budget
            </Link>
            <Link
              href="/destinations/botswana"
              className="block text-amber-700 hover:text-amber-800"
            >
              Botswana destination guide
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

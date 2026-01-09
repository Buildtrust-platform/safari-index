/**
 * Birding Safari Hub Page
 *
 * Dedicated landing page for birding-focused travelers.
 * Showcases Safari Index expertise in this high-value niche.
 *
 * Per governance: documentary tone, expertise signaling,
 * no fluff or generic content. Birders detect shallow
 * content immediately.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../components/layout';
import {
  ChevronRight,
  ArrowRight,
  Bird,
  Calendar,
  MapPin,
  Camera,
  Users,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Birding Safaris | Safari Index',
  description: 'Expert-backed birding safari planning for East and Southern Africa. Seasonal timing, endemic hotspots, guide selection, and honest trade-offs.',
};

// Key birding decisions
const birdingDecisions = [
  {
    id: 'birding-green-vs-dry-season',
    title: 'Green vs. dry season for birding',
    description: 'Migratory diversity peaks in green season, but visibility suffers. Which matters more for your goals?',
  },
  {
    id: 'birding-combined-big-five',
    title: 'Combining birding with Big Five',
    description: 'Can serious birding coexist with mammal-focused safaris? The answer depends on vehicle, guide, and expectations.',
  },
  {
    id: 'uganda-vs-tanzania-endemic-birding',
    title: 'Uganda vs. Tanzania endemics',
    description: 'Albertine Rift concentration vs. Eastern Arc diversity. Where you go depends on which endemics you seek.',
  },
  {
    id: 'migratory-bird-peak-timing',
    title: 'Migratory bird peak timing',
    description: 'Palearctic migrants follow patterns, not calendars. Timing your trip to migration windows.',
  },
  {
    id: 'birding-photography-compatibility',
    title: 'Photography vs. listing goals',
    description: 'Portfolio shots and comprehensive lists rarely optimize to the same conditions.',
  },
  {
    id: 'birding-short-itinerary',
    title: 'Birding in short trips',
    description: 'Quality birding in 4-5 days is possible. Comprehensive coverage is not.',
  },
];

// Birding-relevant destinations
const birdingDestinations = [
  {
    name: 'Uganda',
    highlight: 'Albertine Rift endemics, Shoebill',
    species: '1,090+',
    bestFor: 'Forest specialists, primate combination',
  },
  {
    name: 'Tanzania',
    highlight: 'Eastern Arc endemics, savannah diversity',
    species: '1,100+',
    bestFor: 'Big Five + birds, migration timing',
  },
  {
    name: 'Kenya',
    highlight: 'Rift Valley lakes, raptor migration',
    species: '1,100+',
    bestFor: 'Waterbirds, accessible birding circuits',
  },
  {
    name: 'Botswana',
    highlight: 'Okavango waterbirds, Kalahari specials',
    species: '590+',
    bestFor: 'Water-based birding, quality over quantity',
  },
  {
    name: 'South Africa',
    highlight: 'Cape endemics, pelagic diversity',
    species: '850+',
    bestFor: 'Endemic hunting, pelagic trips',
  },
  {
    name: 'Zambia',
    highlight: 'Miombo woodland specialists',
    species: '760+',
    bestFor: 'Walking safaris with birding, Shoebill (Bangweulu)',
  },
];

export default function BirdingHubPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Hero */}
      <div className="bg-stone-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Safari Index
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-300">Birding Safaris</span>
          </div>

          {/* Expertise badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-900/30 border border-amber-700/50 rounded-full text-amber-300 text-sm mb-4">
            <Bird className="w-4 h-4" />
            <span>Specialist Vertical</span>
          </div>

          <h1 className="font-editorial text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
            Birding Safaris
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl mb-8">
            Safari Index builds birding itineraries backed by seasonal data,
            habitat constraints, and honest trade-offs. We refuse requests
            that cannot deliver what birders actually want.
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-semibold text-white">12</p>
              <p className="text-sm text-stone-400">Birding-specific decisions</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-semibold text-white">6</p>
              <p className="text-sm text-stone-400">Core destinations</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-semibold text-white">P0</p>
              <p className="text-sm text-stone-400">Launch priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">

        {/* Why Safari Index for birding */}
        <section className="mb-12">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Why Safari Index for Birding
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-stone-700 leading-relaxed mb-4">
              Birding is a high-expertise niche where shallow content destroys
              credibility instantly. Generic safari operators claim &ldquo;great
              birding&rdquo; without understanding seasonal timing, habitat
              requirements, or the fundamental conflict between birding pace and
              standard game drive pace.
            </p>
            <p className="text-stone-700 leading-relaxed">
              Safari Index approaches birding with the same constraint-based
              framework we apply to all safari planning: explicit trade-offs,
              refusal triggers for impossible requests, and honest assessment of
              what your specific trip can and cannot deliver.
            </p>
          </div>
        </section>

        {/* What we refuse */}
        <section className="mb-12">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            What We Refuse
          </h2>
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">
                  200+ species lists promised on 5-day shared vehicle itineraries
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">
                  Shoebill guarantees (60-80% success rate with dedicated effort, never 100%)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">
                  Forest endemic trips combined with Big Five safaris in under 10 days
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">
                  Peak migration diversity with magazine-quality photography conditions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">
                  Serious birding itineraries without private vehicle and specialist guide budget
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Birding decisions */}
        <section className="mb-12">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Birding Decisions
          </h2>
          <p className="text-stone-600 mb-6">
            These decisions shape birding-focused itineraries. Each includes
            explicit trade-offs, change conditions, and refusal triggers.
          </p>
          <div className="space-y-3">
            {birdingDecisions.map((decision) => (
              <Link
                key={decision.id}
                href={`/decisions/${decision.id}`}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                    {decision.title}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    {decision.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors flex-shrink-0 mt-2" />
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/decisions?category=birding"
              className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium text-sm"
            >
              View all birding decisions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Destinations */}
        <section className="mb-12">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Birding Destinations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {birdingDestinations.map((dest) => (
              <div
                key={dest.name}
                className="bg-white rounded-xl border border-stone-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-stone-900">{dest.name}</h3>
                  <span className="text-sm text-amber-700 font-medium">
                    {dest.species} species
                  </span>
                </div>
                <p className="text-sm text-stone-600 mb-2">{dest.highlight}</p>
                <p className="text-xs text-stone-500">
                  <span className="font-medium">Best for:</span> {dest.bestFor}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seasonal timing */}
        <section className="mb-12">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Seasonal Timing
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left p-4 font-medium text-stone-700">Period</th>
                  <th className="text-left p-4 font-medium text-stone-700">What happens</th>
                  <th className="text-left p-4 font-medium text-stone-700">Trade-off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-4 text-stone-900 font-medium">Nov-Dec</td>
                  <td className="p-4 text-stone-600">Palearctic migrants arrive, peak diversity</td>
                  <td className="p-4 text-stone-500">Short rains, unpredictable access</td>
                </tr>
                <tr>
                  <td className="p-4 text-stone-900 font-medium">Jan-Feb</td>
                  <td className="p-4 text-stone-600">Migrants settled, breeding plumage</td>
                  <td className="p-4 text-stone-500">Peak tourism, higher costs</td>
                </tr>
                <tr>
                  <td className="p-4 text-stone-900 font-medium">Mar-Apr</td>
                  <td className="p-4 text-stone-600">Northbound passage, some departures</td>
                  <td className="p-4 text-stone-500">Long rains begin, road closures</td>
                </tr>
                <tr>
                  <td className="p-4 text-stone-900 font-medium">Jun-Oct</td>
                  <td className="p-4 text-stone-600">Residents only, optimal visibility</td>
                  <td className="p-4 text-stone-500">Missing 150+ migratory species</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-stone-500 mt-3">
            East Africa timing. Southern Africa patterns differ by 6 months.
          </p>
        </section>

        {/* What serious birders need */}
        <section className="mb-12">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            What Serious Birders Need
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl border border-green-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Essential</span>
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li>Private vehicle (non-negotiable for pace control)</li>
                <li>Specialist birding guide or willing generalist</li>
                <li>Dawn start flexibility (5:00-5:30am)</li>
                <li>Minimum 7 days for multi-habitat coverage</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">For photography</span>
              </div>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>Hide/blind access (advance booking required)</li>
                <li>Dry season timing for consistent light</li>
                <li>Vehicle positioning flexibility</li>
                <li>Extended single-site time, not park-hopping</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-stone-900 rounded-2xl p-8 text-center">
          <Bird className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="font-editorial text-2xl font-semibold text-white mb-3">
            Plan a Birding Safari
          </h2>
          <p className="text-stone-300 mb-6 max-w-lg mx-auto">
            Tell us your target species, timing constraints, and photography goals.
            We will build an itinerary that delivers or tell you why it cannot.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
          >
            Start planning
          </Link>
        </section>
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}

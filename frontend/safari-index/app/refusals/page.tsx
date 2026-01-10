/**
 * Refusals Index Page
 *
 * Lists all refusal example pages demonstrating Vurara Safaris's
 * commitment to honest recommendations over sales volume.
 *
 * Static content. No backend logic.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../components/layout';
import { ChevronRight, XCircle, DollarSign, Calendar, Map, Clock, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const metadata = {
  title: 'Refusal Examples | Vurara Safaris',
  description: 'Real examples of safari plans Vurara Safaris has refused. We decline requests that cannot deliver what travelers expect.',
};

interface RefusalExample {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const refusalExamples: RefusalExample[] = [
  {
    slug: 'luxury-expectations-budget-mismatch',
    title: 'Budget-Expectation Mismatch',
    shortTitle: 'Budget Mismatch',
    description: 'Luxury Botswana fly-in safari requested on a mid-range budget. The math does not work.',
    icon: DollarSign,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
  },
  {
    slug: 'wrong-season-expectations',
    title: 'Seasonal Timing Mismatch',
    shortTitle: 'Wrong Season',
    description: 'Dry season wildlife drama requested during green season. Conditions make this impossible.',
    icon: Calendar,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    slug: 'too-many-parks-too-few-days',
    title: 'Overloaded Itinerary',
    shortTitle: 'Too Many Parks',
    description: 'Five parks in seven days. More time driving than watching wildlife.',
    icon: Map,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    slug: 'river-crossing-timing-impossible',
    title: 'River Crossing Timing',
    shortTitle: 'Migration Timing',
    description: 'Guaranteed river crossing on specific dates. Migration timing cannot be scheduled.',
    icon: Clock,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
  },
  {
    slug: 'ethical-constraints',
    title: 'Ethical Constraint Violation',
    shortTitle: 'Ethical Issues',
    description: 'Activities involving wildlife harm or community exploitation. Non-negotiable refusal.',
    icon: Shield,
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-700',
  },
];

export default function RefusalsIndexPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Vurara Safaris
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-300">Refusals</span>
          </div>

          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4">
            Plans We Have Refused
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Vurara Safaris declines requests that cannot deliver what travelers
            expect. These are real examples of plans we refused rather than
            sell a compromised experience.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-stone-100 rounded-xl border border-stone-200 p-6 mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            Why we publish refusals
          </h2>
          <p className="text-stone-700 leading-relaxed">
            Most operators will book any trip that generates commission. Safari
            Index operates differently. When expectations cannot be met under
            real conditions, we decline the booking and explain why. These pages
            document specific refusals to help travelers understand the constraints
            that govern safari planning. If your request falls into one of these
            patterns, you will receive honest feedback rather than false hope.
          </p>
        </div>

        {/* Refusal examples grid */}
        <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-6">
          Refusal Examples
        </h2>
        <div className="space-y-4">
          {refusalExamples.map((example) => {
            const Icon = example.icon;
            return (
              <Link
                key={example.slug}
                href={`/refusals/${example.slug}`}
                className="block bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${example.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${example.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-100 rounded text-red-700 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Refused
                      </div>
                    </div>
                    <h3 className="font-medium text-stone-900 mb-1">
                      {example.title}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {example.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0 mt-3" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Understanding section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Refusal categories
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Physical impossibilities</h3>
              <p className="text-sm text-stone-500">
                Requests that violate the laws of physics, geography, or animal
                behavior. No amount of planning can make these work.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Budget mismatches</h3>
              <p className="text-sm text-stone-500">
                When the requested experience tier costs more than the stated
                budget. We explain the gap rather than deliver less.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Seasonal conflicts</h3>
              <p className="text-sm text-stone-500">
                Wildlife behavior and conditions vary by season. Some requests
                are only possible at certain times of year.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Ethical boundaries</h3>
              <p className="text-sm text-stone-500">
                Activities that harm wildlife or exploit communities. These are
                refused regardless of client preference or budget.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-stone-900 rounded-2xl p-8 text-center">
          <h2 className="font-editorial text-2xl font-semibold text-white mb-3">
            Planning a safari?
          </h2>
          <p className="text-stone-300 mb-6 max-w-lg mx-auto">
            Start with honest expectations. Vurara Safaris will tell you what is
            and is not possible given your constraints.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
          >
            Start planning
          </Link>
        </div>
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}

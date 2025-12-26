/**
 * When to Go Hub Page
 *
 * Static, indexable hub for timing-related safari planning.
 * No Bedrock calls - purely deterministic content from inventory.
 *
 * Per governance:
 * - Documentary, calm tone
 * - No hype or urgency
 * - Internal links with question titles
 * - Max 6 decision links, 3 guide links, 3 trip links per section
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  ChevronRight,
  ArrowRight,
  Sun,
  Cloud,
  MapPin,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import { SearchAndFilters } from '../components/SearchAndFilters';
import {
  getDecisionsByTiming,
  getTripsByMonth,
  getGuidesByBucket,
  LINK_LIMITS,
} from '../../lib/internal-links';

export const metadata: Metadata = {
  title: 'When to Go on Safari | Safari Index',
  description:
    'Plan your safari timing with Safari Index. Understand dry seasons, migration patterns, and regional weather to choose the right months for your trip.',
  robots: 'index, follow',
  alternates: {
    canonical: '/when-to-go',
  },
  openGraph: {
    title: 'When to Go on Safari | Safari Index',
    description:
      'Safari timing decisions: dry season vs green season, migration months, and regional weather patterns across East and Southern Africa.',
    type: 'website',
    url: '/when-to-go',
  },
};

/**
 * Month data with season info
 */
const MONTHS = [
  { value: 1, name: 'January', season: 'green', region: 'east-calving' },
  { value: 2, name: 'February', season: 'green', region: 'east-calving' },
  { value: 3, name: 'March', season: 'rain', region: 'shoulder' },
  { value: 4, name: 'April', season: 'rain', region: 'low' },
  { value: 5, name: 'May', season: 'rain', region: 'low' },
  { value: 6, name: 'June', season: 'dry', region: 'peak' },
  { value: 7, name: 'July', season: 'dry', region: 'peak' },
  { value: 8, name: 'August', season: 'dry', region: 'peak-migration' },
  { value: 9, name: 'September', season: 'dry', region: 'peak' },
  { value: 10, name: 'October', season: 'dry', region: 'late-dry' },
  { value: 11, name: 'November', season: 'rain', region: 'shoulder' },
  { value: 12, name: 'December', season: 'green', region: 'holiday' },
];

/**
 * Country/region data for quick tiles
 */
const COUNTRIES = [
  { id: 'tanzania', name: 'Tanzania', region: 'East Africa', bestMonths: [6, 7, 8, 9, 10, 1, 2] },
  { id: 'kenya', name: 'Kenya', region: 'East Africa', bestMonths: [7, 8, 9, 10, 1, 2] },
  { id: 'uganda', name: 'Uganda & Rwanda', region: 'Gorilla Trekking', bestMonths: [1, 2, 6, 7, 8, 9, 12] },
  { id: 'botswana', name: 'Botswana', region: 'Southern Africa', bestMonths: [5, 6, 7, 8, 9, 10] },
  { id: 'south-africa', name: 'South Africa', region: 'Southern Africa', bestMonths: [5, 6, 7, 8, 9, 10] },
  { id: 'namibia', name: 'Namibia', region: 'Southern Africa', bestMonths: [5, 6, 7, 8, 9, 10] },
  { id: 'zambia', name: 'Zambia & Zimbabwe', region: 'Victoria Falls', bestMonths: [6, 7, 8, 9, 10] },
];

/**
 * Season badge component
 */
function SeasonBadge({ season }: { season: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    dry: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Dry Season' },
    green: { bg: 'bg-green-100', text: 'text-green-700', label: 'Green Season' },
    rain: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Rainy Season' },
  };

  const style = styles[season] || styles.dry;

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export default function WhenToGoPage() {
  const timingDecisions = getDecisionsByTiming(LINK_LIMITS.decisions);
  const timingGuides = getGuidesByBucket('timing', LINK_LIMITS.guides);

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find(img => img.id === 'savannah-morning') || ecosystemImages[0]}
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
              <span className="text-white">When to Go</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="when-to-go-h1"
              >
                When to Go
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Safari timing depends on what you want to see and where.
              <br className="hidden md:block" />
              Dry season offers reliable wildlife; green season offers value and drama.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="default"
            placeholder="Search timing... e.g., 'Tanzania in July' or 'dry season'"
            showActivityFilter={false}
            compact
          />
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Month Grid */}
        <section className="mb-12" data-testid="month-grid">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            By Month
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {MONTHS.map((month) => {
              const trips = getTripsByMonth(month.value, 3);
              return (
                <div
                  key={month.value}
                  className="bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 transition-colors"
                  data-testid="month-tile"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-stone-900">{month.name}</span>
                    {month.season === 'dry' ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Cloud className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <SeasonBadge season={month.season} />
                  {trips.length > 0 && (
                    <p className="text-xs text-stone-500 mt-2">
                      {trips.length} safari{trips.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Country Quick Links */}
        <section className="mb-12" data-testid="country-grid">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            By Destination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTRIES.map((country) => (
              <Link
                key={country.id}
                href={`/destinations#${country.id}`}
                className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all group"
                prefetch={false}
                data-testid="country-tile"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                      {country.name}
                    </p>
                    <p className="text-sm text-stone-500">{country.region}</p>
                  </div>
                  <MapPin className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {country.bestMonths.slice(0, 4).map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 text-xs bg-stone-100 text-stone-600 rounded"
                    >
                      {MONTHS[m - 1].name.slice(0, 3)}
                    </span>
                  ))}
                  {country.bestMonths.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-stone-400">
                      +{country.bestMonths.length - 4}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Timing Decisions */}
        <section className="mb-12" data-testid="timing-decisions">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Timing Decisions
          </h2>
          <p className="text-stone-600 mb-4">
            Questions that shape when you should travel.
          </p>
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {timingDecisions.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors group"
                title={link.title}
                prefetch={false}
                data-testid="decision-link"
              >
                <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                  {link.anchorText}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Guides */}
        {timingGuides.length > 0 && (
          <section className="mb-12" data-testid="timing-guides">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
              Timing Guides
            </h2>
            <p className="text-stone-600 mb-4">
              In-depth reading on seasonal patterns.
            </p>
            <div className="grid gap-3">
              {timingGuides.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 px-6 py-4 hover:bg-stone-50 hover:border-stone-300 transition-all group"
                  title={link.title}
                  prefetch={false}
                  data-testid="guide-link"
                >
                  <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                    {link.anchorText}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors ml-auto" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-xl p-6 text-center">
            <h3 className="font-editorial text-xl text-white mb-2">Not sure when to go?</h3>
            <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
              Share your constraints and we'll suggest the best timing for your trip.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
              prefetch={false}
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}

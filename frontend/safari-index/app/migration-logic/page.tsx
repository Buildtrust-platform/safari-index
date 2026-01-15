/**
 * Wildebeest Migration Logic Hub
 *
 * Decision-led authority page for understanding the migration
 * as a probability system, not a spectacle.
 *
 * Content structure:
 * - What the migration actually is
 * - Common misconceptions
 * - Three phases (calving, movement, crossing)
 * - Who it's for / not for
 * - Refusal conditions
 * - Cross-border framing
 * - Month-by-month verdicts
 * - Linked decisions and itineraries
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  Calendar,
  AlertTriangle,
  Check,
  X,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import {
  MIGRATION_MONTH_VERDICTS,
  getCurrentMigrationVerdict,
  type MigrationMonthVerdict,
} from '../content/migration-verdicts';
import { generateSlugFromId } from '../content/p0-topics-bridge';

export const metadata: Metadata = {
  title: 'Wildebeest Migration Logic | Vurara Safaris',
  description:
    'Understand the Great Migration as a decision problem, not an attraction. Month-by-month positioning, probability factors, and when we refuse to recommend migration safaris.',
  robots: 'index, follow',
  alternates: {
    canonical: '/migration-logic',
  },
  openGraph: {
    title: 'Wildebeest Migration Logic | Vurara Safaris',
    description:
      'The migration is not an event. It is a continuous movement. Understanding positioning, probability, and trade-offs.',
    type: 'website',
    url: '/migration-logic',
  },
};

/**
 * Phase badge component
 */
function PhaseBadge({ phase }: { phase: MigrationMonthVerdict['phase'] }) {
  const styles = {
    calving: 'bg-green-100 text-green-700 border-green-200',
    movement: 'bg-blue-100 text-blue-700 border-blue-200',
    crossing: 'bg-amber-100 text-amber-700 border-amber-200',
    return: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const labels = {
    calving: 'Calving Season',
    movement: 'Movement Phase',
    crossing: 'Crossing Season',
    return: 'Return Migration',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[phase]}`}>
      {labels[phase]}
    </span>
  );
}

/**
 * Crowd level indicator
 */
function CrowdIndicator({ level }: { level: MigrationMonthVerdict['crowdLevel'] }) {
  const colors = {
    low: 'bg-green-500',
    moderate: 'bg-amber-500',
    high: 'bg-orange-500',
    peak: 'bg-red-500',
  };

  const labels = {
    low: 'Low crowds',
    moderate: 'Moderate crowds',
    high: 'High crowds',
    peak: 'Peak crowds',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[level]}`} />
      <span className="text-xs text-stone-600">{labels[level]}</span>
    </div>
  );
}

/**
 * Map verdict itinerary IDs to actual slugs
 */
const ITINERARY_SLUG_MAP: Record<string, { slug: string; title: string }> = {
  'serengeti-calving-season': { slug: 'serengeti-calving-safari', title: 'Serengeti Calving Safari' },
  'calving-crater-classic': { slug: 'tanzania-calving-and-crater', title: 'Calving & Crater Classic' },
  'northern-serengeti-crossings': { slug: 'serengeti-river-crossings', title: 'Northern Serengeti Crossings' },
  'mara-migration-conservancy': { slug: 'masai-mara-migration-safari', title: 'Masai Mara Migration Safari' },
  'migration-transition': { slug: 'serengeti-migration-transition', title: 'Migration Transition Safari' },
};

/**
 * Month verdict card
 */
function MonthVerdictCard({ verdict }: { verdict: MigrationMonthVerdict }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-300 transition-colors">
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-editorial text-lg font-semibold text-stone-900">
            {verdict.name}
          </h3>
          <PhaseBadge phase={verdict.phase} />
        </div>
        <p className="text-sm text-stone-600">{verdict.herdPosition}</p>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-stone-700">{verdict.verdict}</p>
        <div className="flex items-center gap-4">
          <CrowdIndicator level={verdict.crowdLevel} />
          {verdict.crossingProbability !== 'none' && (
            <span className="text-xs text-stone-500">
              Crossing: {verdict.crossingProbability}
            </span>
          )}
          {verdict.calvingActive && (
            <span className="text-xs text-green-600">Calving active</span>
          )}
        </div>
        {/* Linked itineraries */}
        {verdict.linkedItineraries.length > 0 && (
          <div className="pt-3 border-t border-stone-100">
            <p className="text-xs text-stone-500 mb-2">Recommended trips:</p>
            <div className="flex flex-wrap gap-1">
              {verdict.linkedItineraries.slice(0, 2).map((id) => {
                const mapping = ITINERARY_SLUG_MAP[id];
                if (!mapping) return null;
                return (
                  <Link
                    key={id}
                    href={`/trips/${mapping.slug}`}
                    className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    {mapping.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        {/* Linked decisions */}
        {verdict.linkedDecisions.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-1">
              {verdict.linkedDecisions.slice(0, 2).map((id) => (
                <Link
                  key={id}
                  href={`/decisions/${generateSlugFromId(id)}`}
                  className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition-colors"
                >
                  {id.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Misconception card
 */
function MisconceptionCard({
  myth,
  reality,
}: {
  myth: string;
  reality: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <X className="w-3.5 h-3.5 text-red-600" />
        </div>
        <p className="text-stone-700 font-medium">{myth}</p>
      </div>
      <div className="flex items-start gap-3 pl-9">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 -ml-9">
          <Check className="w-3.5 h-3.5 text-green-600" />
        </div>
        <p className="text-stone-600 text-sm">{reality}</p>
      </div>
    </div>
  );
}

/**
 * Refusal condition card
 */
function RefusalCard({
  condition,
  alternative,
}: {
  condition: string;
  alternative: string;
}) {
  return (
    <div className="bg-red-50 rounded-xl border border-red-200 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-stone-900 font-medium mb-2">{condition}</p>
          <p className="text-stone-600 text-sm">
            <span className="font-medium">Alternative:</span> {alternative}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MigrationLogicPage() {
  const currentVerdict = getCurrentMigrationVerdict();

  // Group months by phase for display
  const calvingMonths = MIGRATION_MONTH_VERDICTS.filter(
    (v) => v.phase === 'calving'
  );
  const movementMonths = MIGRATION_MONTH_VERDICTS.filter(
    (v) => v.phase === 'movement'
  );
  const crossingMonths = MIGRATION_MONTH_VERDICTS.filter(
    (v) => v.phase === 'crossing'
  );
  const returnMonths = MIGRATION_MONTH_VERDICTS.filter(
    (v) => v.phase === 'return'
  );

  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find((img) => img.id === 'migration-crossing') || ecosystemImages[0]}
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
                Vurara Safaris
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Migration Logic</span>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white mb-4">
              Wildebeest Migration Logic
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              The migration is not an event. It is a continuous movement of 1.5 million animals
              following rainfall and grass. Understanding this changes how you plan.
            </p>

            {/* Current month callout */}
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm">
                {currentVerdict.name}: {currentVerdict.herdPosition}
              </span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* What the migration is */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            What the Migration Actually Is
          </h2>
          <div className="prose prose-stone max-w-none">
            <p className="text-stone-700 leading-relaxed mb-4">
              The wildebeest migration is a continuous, circular movement of approximately
              1.5 million wildebeest, 500,000 zebra, and 200,000 gazelle across the
              Serengeti-Mara ecosystem. The animals follow rainfall and grass growth in
              a clockwise pattern that takes roughly one year to complete.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4">
              The migration is not a spectacle with a start and end date. It is a permanent
              state of movement driven by grazing pressure and water availability. The herds
              are always somewhere. The question is whether your trip positions you in the
              right place at the right time.
            </p>
            <p className="text-stone-600 text-sm">
              Film crews budget weeks of waiting time for crossing footage. Travelers with
              fixed five-day itineraries should calibrate expectations accordingly.
            </p>
          </div>
        </section>

        {/* Misconceptions */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            Why Most Travelers Misunderstand It
          </h2>
          <div className="grid gap-4">
            <MisconceptionCard
              myth="The migration happens once a year."
              reality="The migration is continuous. What changes is location, not occurrence."
            />
            <MisconceptionCard
              myth="River crossings can be scheduled."
              reality="Crossings depend on herd psychology, water levels, and predator presence. Guides estimate probability windows, not timing."
            />
            <MisconceptionCard
              myth="August is the only time to see the migration."
              reality="The migration is visible year-round in the Serengeti. August is when the herds are in the Mara and crossing rivers. Calving season (January-March) delivers more consistent daily action."
            />
            <MisconceptionCard
              myth="Calving is a minor event."
              reality="Calving involves 8,000+ births per day at peak. Predator success rates are highest during this period. It is more reliable than crossings."
            />
            <MisconceptionCard
              myth="Any Serengeti safari sees the migration."
              reality="The Serengeti is 14,750 square kilometers. A trip to the wrong region sees resident wildlife, not migration herds."
            />
          </div>
        </section>

        {/* Three phases */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            The Three Migration Phases
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl border border-green-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-700" />
                </div>
                <h3 className="font-medium text-stone-900">Calving</h3>
              </div>
              <p className="text-sm text-stone-600 mb-2">December–March</p>
              <p className="text-sm text-stone-700">
                Southern Serengeti plains near Ndutu. Concentrated herds. High birth rates.
                Peak predator hunting. Reliable daily sightings.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                </div>
                <h3 className="font-medium text-stone-900">Movement</h3>
              </div>
              <p className="text-sm text-stone-600 mb-2">April–June</p>
              <p className="text-sm text-stone-700">
                Herds disperse and move northwest through central and western Serengeti.
                Grumeti River crossings possible in June. Timing unpredictable. Lower concentration.
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-700" />
                </div>
                <h3 className="font-medium text-stone-900">Crossing</h3>
              </div>
              <p className="text-sm text-stone-600 mb-2">July–October</p>
              <p className="text-sm text-stone-700">
                Northern Serengeti and Masai Mara. Mara River crossings possible but not
                guaranteed. Highest vehicle density. Premium pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Who this is for / not for */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            Who This Is For
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Suitable For
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>Travelers who accept uncertainty as part of the experience</li>
                <li>Those with 8+ days to position properly and wait</li>
                <li>Budgets of $600–1,500/person/day depending on season</li>
                <li>Those who tolerate potential crowds at hotspots</li>
                <li>Understanding that "seeing the migration" may mean herds grazing, not crossing</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                Not Suitable For
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>Travelers requiring guaranteed sightings of specific events</li>
                <li>Those with fewer than 7 days total</li>
                <li>Those who cannot accept the crowd trade-off during peak crossing season</li>
                <li>Travelers prioritizing solitude over migration probability</li>
                <li>Expecting crossing footage from a 3-night stay</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Refusal conditions */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            When We Refuse to Recommend Migration Safaris
          </h2>
          <div className="grid gap-4">
            <RefusalCard
              condition="Timeline mismatch: Trip dates fall outside the likely herd position window for the requested region."
              alternative="Adjust timing to match actual herd position, or visit non-migration destinations with reliable wildlife."
            />
            <RefusalCard
              condition="Duration insufficient: Fewer than 4 nights in the migration zone for crossing-focused trips."
              alternative="Focus on calving season which delivers daily, or accept migration as bonus rather than goal."
            />
            <RefusalCard
              condition="Budget misalignment: Budget cannot support camps positioned in active migration zones."
              alternative="Consider green season or shoulder months for lower pricing with different trade-offs."
            />
            <RefusalCard
              condition="Expectation rigidity: Traveler requires guaranteed crossings or will consider the trip a failure without them."
              alternative="Calving season offers reliable daily drama. Non-migration destinations (Ngorongoro, Okavango) guarantee wildlife."
            />
            <RefusalCard
              condition="Contradictory requirements: Demands solitude AND August Mara River positioning."
              alternative="Private concessions at 2-3x cost, or alternative timing. Cannot have both at standard pricing."
            />
          </div>
        </section>

        {/* Cross-border framing */}
        <section className="mb-16 bg-stone-100 rounded-2xl p-6 md:p-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            One Ecosystem, Two Countries
          </h2>
          <p className="text-stone-700 mb-4">
            The Serengeti and Masai Mara are not competing destinations. They are one continuous
            ecosystem divided by a political border. The migration moves between them based on
            rainfall and grass, indifferent to customs posts.
          </p>
          <p className="text-stone-700 mb-4">
            The herds spend approximately 9 months in Tanzania and 3 months in Kenya. Asking
            "Kenya or Tanzania?" before understanding timing is asking the wrong question.
          </p>
          <div className="bg-white rounded-xl border border-stone-200 p-4 mt-6">
            <h3 className="font-medium text-stone-900 mb-3">The Correct Sequence</h3>
            <ol className="space-y-2 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
                <span>When are you traveling?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
                <span>Where will the herds likely be?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
                <span>Which country provides access to that zone?</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Month verdicts */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Month-by-Month Verdicts
          </h2>
          <p className="text-stone-600 mb-6">
            Each month has a verdict based on herd position, probability, and trade-offs.
          </p>

          {/* Calving months */}
          <div className="mb-8">
            <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Calving Season (Dec–Mar)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {calvingMonths.map((verdict) => (
                <MonthVerdictCard key={verdict.month} verdict={verdict} />
              ))}
            </div>
          </div>

          {/* Movement months */}
          <div className="mb-8">
            <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Movement Phase (Apr–Jun)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {movementMonths.map((verdict) => (
                <MonthVerdictCard key={verdict.month} verdict={verdict} />
              ))}
            </div>
          </div>

          {/* Crossing months */}
          <div className="mb-8">
            <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              Crossing Season (Jul–Oct)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {crossingMonths.map((verdict) => (
                <MonthVerdictCard key={verdict.month} verdict={verdict} />
              ))}
            </div>
          </div>

          {/* Return months */}
          <div className="mb-8">
            <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stone-500" />
              Return Migration (Nov)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {returnMonths.map((verdict) => (
                <MonthVerdictCard key={verdict.month} verdict={verdict} />
              ))}
            </div>
          </div>
        </section>

        {/* Related decisions */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            Migration Decisions
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {[
              { id: 'migration-month-position', title: 'Where should I position myself to see the migration?' },
              { id: 'crossing-vs-calving', title: 'River crossings or calving: which matters more?' },
              { id: 'migration-crowds', title: 'How do I avoid crowds during migration season?' },
              { id: 'migration-cost', title: 'Why do migration safaris cost more?' },
              { id: 'migration-trip-length', title: 'How long should a migration safari be?' },
              { id: 'migration-serengeti-vs-mara', title: 'Serengeti or Masai Mara for migration?' },
              { id: 'migration-first-timer', title: 'Should my first safari focus on the migration?' },
            ].map((decision) => (
              <Link
                key={decision.id}
                href={`/decisions/${generateSlugFromId(decision.id)}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors group"
              >
                <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                  {decision.title}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Related itineraries */}
        <section className="mb-16">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            Migration Itineraries
          </h2>
          <p className="text-stone-600 mb-6">
            Each itinerary is designed for a specific migration phase and traveler profile.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                slug: 'serengeti-calving-safari',
                title: 'Serengeti Calving Season Safari',
                months: 'Jan–Mar',
                focus: 'Calving, predator action',
                bestFor: 'Reliable daily drama',
              },
              {
                slug: 'serengeti-river-crossings',
                title: 'Northern Serengeti Crossing Safari',
                months: 'Jul–Oct',
                focus: 'Mara River crossings',
                bestFor: 'Iconic crossing footage',
              },
              {
                slug: 'masai-mara-migration-safari',
                title: 'Masai Mara Migration Safari',
                months: 'Aug–Oct',
                focus: 'Crossings from Kenya side',
                bestFor: 'Compact, concentrated access',
              },
              {
                slug: 'serengeti-migration-transition',
                title: 'Migration Transition Safari',
                months: 'Jun, Oct–Nov',
                focus: 'Shoulder season value',
                bestFor: 'Crowd-averse, flexible travelers',
              },
              {
                slug: 'tanzania-calving-and-crater',
                title: 'Calving & Crater Classic',
                months: 'Jan–Mar',
                focus: 'First-timer balance',
                bestFor: 'Migration + Ngorongoro',
              },
              {
                slug: 'tanzania-great-migration',
                title: 'Tanzania Great Migration',
                months: 'Jul–Sep',
                focus: 'Classic migration circuit',
                bestFor: 'First migration safari',
              },
            ].map((trip) => (
              <Link
                key={trip.slug}
                href={`/trips/${trip.slug}`}
                className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <h3 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors mb-2">
                  {trip.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {trip.months}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span>{trip.focus}</span>
                </div>
                <p className="text-xs text-amber-600">{trip.bestFor}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Inline Inquiry Form */}
        <section className="mb-16 bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl border border-amber-200 p-6 md:p-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
              Get Migration Timing Advice
            </h2>
            <p className="text-stone-600 mb-6">
              Tell us your dates and we'll recommend the right positioning—or explain why we'd suggest an alternative.
            </p>
            <form action="/inquire" method="get" className="space-y-4">
              <input type="hidden" name="context" value="migration" />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="travel-month" className="block text-sm font-medium text-stone-700 mb-1 text-left">
                    When are you thinking of traveling?
                  </label>
                  <select
                    id="travel-month"
                    name="month"
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select month...</option>
                    <option value="jan">January (Calving)</option>
                    <option value="feb">February (Peak calving)</option>
                    <option value="mar">March (Late calving)</option>
                    <option value="apr">April (Movement)</option>
                    <option value="may">May (Movement)</option>
                    <option value="jun">June (Early crossings)</option>
                    <option value="jul">July (Crossing season)</option>
                    <option value="aug">August (Peak crossings)</option>
                    <option value="sep">September (Crossing season)</option>
                    <option value="oct">October (Late crossings)</option>
                    <option value="nov">November (Return)</option>
                    <option value="dec">December (Pre-calving)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="migration-priority" className="block text-sm font-medium text-stone-700 mb-1 text-left">
                    What matters most?
                  </label>
                  <select
                    id="migration-priority"
                    name="priority"
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select priority...</option>
                    <option value="crossings">River crossings</option>
                    <option value="calving">Calving / predator action</option>
                    <option value="fewer-crowds">Avoiding crowds</option>
                    <option value="value">Best value</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
              >
                Get recommendations
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-stone-900 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="font-editorial text-xl text-white mb-2">
            Need help with migration timing?
          </h3>
          <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
            Tell us your dates and expectations. We'll recommend the right positioning
            or explain why we'd suggest an alternative.
          </p>
          <Link
            href="/inquire"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
          >
            Start planning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}

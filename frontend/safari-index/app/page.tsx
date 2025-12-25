'use client';

/**
 * Safari Index Homepage
 *
 * Pure arrival page - industry-standard safari aesthetic with Safari Index's
 * decision authority framing. Premium, restrained, documentary tone.
 *
 * Structure:
 * 1. ARRIVAL HERO - Full viewport with African landscape
 * 2. ORIENTATION - What Safari Index does (3 pillars)
 * 3. REAL QUESTIONS - 6 decision cards from topic registry
 * 4. CATEGORY CLARIFICATION - What Safari Index is not
 * 5. ACCOUNTABILITY - Trust signals
 * 6. CALM CLOSE - Final CTA
 */

import Link from 'next/link';
import { ChevronDown, ArrowRight, MapPin, Calendar, Scale, ShieldOff, FileText, RefreshCw, Map } from 'lucide-react';
import { ImageBand, ImageBandContent, pageImages } from './components/visual';
import { Navbar, PageGrid } from './components/layout';
import { getPublishedTopics, type DecisionTopic } from './content/decision-topics';
import { getAllTrips } from './content/trip-shapes/trips';

/**
 * Scroll Indicator
 */
function ScrollIndicator() {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-white/60" />
      <ChevronDown
        className="w-5 h-5 text-white/60 animate-bounce-subtle"
        strokeWidth={1.5}
      />
    </div>
  );
}

/**
 * Primary Button - Solid white on dark backgrounds
 */
function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-white text-stone-900 hover:bg-stone-100"
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * Secondary Button - Outline on dark backgrounds
 */
function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/60"
    >
      {children}
    </Link>
  );
}

/**
 * Question Card - Links to decision pages
 */
function QuestionCard({ topic }: { topic: DecisionTopic }) {
  return (
    <Link
      href={`/decisions/${topic.slug}`}
      prefetch={false}
      className="group block"
    >
      <div className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 h-full">
        <div className="flex flex-col h-full">
          <h3 className="font-editorial text-base font-medium text-stone-900 group-hover:text-amber-700 transition-colors mb-2">
            {topic.question}
          </h3>
          <p className="text-sm text-stone-500 mb-3 flex-1">
            {topic.context_line}
          </p>
          <div className="flex items-center justify-between">
            {topic.destinations.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{topic.destinations.slice(0, 2).join(' · ')}</span>
              </div>
            )}
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Pillar Card - Three pillars of what Safari Index does
 */
function PillarCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-amber-700" />
      </div>
      <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-2">
        {title}
      </h3>
      <p className="font-editorial text-sm text-stone-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/**
 * Get 6 featured topics for the homepage
 * Priority order based on spec examples
 */
function getFeaturedTopics(): DecisionTopic[] {
  const allTopics = getPublishedTopics();

  // Priority slugs from spec (in order of preference)
  const prioritySlugs = [
    'tanzania-safari-february',
    'tanzania-vs-kenya-first-safari',
    'green-season-safari-worth-it',
    'tanzania-safari-july',
    'tanzania-safari-november',
    'is-5-days-enough-for-safari',
    'safari-with-young-children',
    'kenya-safari-august',
    'botswana-safari-june',
    'tanzania-safari-on-budget',
  ];

  const featured: DecisionTopic[] = [];

  for (const slug of prioritySlugs) {
    if (featured.length >= 6) break;
    const topic = allTopics.find(t => t.slug === slug);
    if (topic) featured.push(topic);
  }

  // Fill remaining slots if needed
  for (const topic of allTopics) {
    if (featured.length >= 6) break;
    if (!featured.includes(topic)) featured.push(topic);
  }

  return featured.slice(0, 6);
}

/**
 * Trip Card for homepage - compact version
 */
function TripCard({ trip }: { trip: { id: string; title: string; subtitle: string } }) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      prefetch={false}
      className="group block"
    >
      <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-editorial text-base font-medium text-stone-900 group-hover:text-amber-700 transition-colors truncate">
              {trip.title}
            </h3>
            <p className="text-sm text-stone-500 truncate">
              {trip.subtitle}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors flex-shrink-0 ml-3" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Homepage
 */
export default function Home() {
  const featuredTopics = getFeaturedTopics();
  const allTrips = getAllTrips();
  const featuredTrips = allTrips.slice(0, 6);

  return (
    <>
      {/* Navbar - transparent over hero */}
      <Navbar variant="transparent" />

      {/* ================================================================
          SECTION 1 — ARRIVAL HERO
          Full viewport, African landscape, decision authority framing.
          ================================================================ */}
      <ImageBand
        image={pageImages.home}
        height="arrival"
        overlay="cinematic"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="wide" className="flex flex-col justify-end min-h-screen pb-28 md:pb-36 pt-20">
          {/* H1 Headline */}
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-5 max-w-3xl animate-fade-in-up animation-delay-100">
            Safari decisions, clarified.
          </h1>

          {/* Subhead */}
          <p className="font-editorial text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl animate-fade-in-up animation-delay-200">
            Clear judgments when timing, cost, and expectations matter.
          </p>

          {/* CTAs - Decisions first, then Trips */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-300">
            <PrimaryButton href="/decisions">
              Explore decisions
            </PrimaryButton>
            <SecondaryButton href="/trips">
              Browse trip shapes
            </SecondaryButton>
          </div>
        </ImageBandContent>

        <ScrollIndicator />
      </ImageBand>

      {/* ================================================================
          SECTION 2 — ORIENTATION (What Safari Index does)
          Three pillars.
          ================================================================ */}
      <section className="bg-gradient-to-b from-stone-50 to-white py-20 md:py-28">
        <PageGrid maxWidth="narrow">
          <div className="text-center mb-14">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              What Safari Index does
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <PillarCard
              icon={Scale}
              title="We issue verdicts"
              description="Not recommendations. Clear outcomes based on trade-offs and constraints."
            />
            <PillarCard
              icon={RefreshCw}
              title="We show what changes the answer"
              description="Timing, flexibility, expectations, and risk made explicit."
            />
            <PillarCard
              icon={ShieldOff}
              title="We refuse when it's irresponsible"
              description="If a decision can't be made honestly, we say so."
            />
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 3 — REAL QUESTIONS
          6 decision cards from topic registry.
          ================================================================ */}
      <section className="bg-white py-20 md:py-28">
        <PageGrid maxWidth="default">
          <div className="text-center mb-12">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              Start with a real question
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTopics.map((topic) => (
              <QuestionCard key={topic.topic_id} topic={topic} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/decisions"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
            >
              View all decisions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 3.5 — TRIP SHAPES
          6 trip shapes for application context.
          ================================================================ */}
      <section className="bg-stone-50 py-20 md:py-28">
        <PageGrid maxWidth="default">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Map className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900">
                Trip shapes
              </h2>
            </div>
            <p className="text-stone-600 max-w-xl mx-auto">
              Common safari itinerary patterns. Each links to the decisions that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
            >
              View all trip shapes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 4 — CATEGORY CLARIFICATION
          What Safari Index is not.
          ================================================================ */}
      <section className="bg-white py-16 md:py-20">
        <PageGrid maxWidth="narrow">
          <div className="text-center">
            <h2 className="font-editorial text-xl md:text-2xl font-semibold text-stone-900 mb-4">
              Built for serious safari planning
            </h2>
            <p className="font-editorial text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Safari Index is not a booking platform or a travel guide. It exists to help travelers avoid costly mistakes before committing to a safari.
            </p>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 5 — ACCOUNTABILITY SIGNALS
          Trust signals.
          ================================================================ */}
      <section className="bg-white py-16 md:py-20">
        <PageGrid maxWidth="narrow">
          <div className="space-y-4">
            {[
              { icon: FileText, text: 'Decisions are versioned and dated.' },
              { icon: RefreshCw, text: 'Outcomes change when conditions change.' },
              { icon: Calendar, text: 'Assurance preserves a decision as-issued.' },
              { icon: ShieldOff, text: 'No commissions. No bookings. No incentives.' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-stone-500" />
                </div>
                <p className="font-editorial text-stone-700">{item.text}</p>
              </div>
            ))}
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 6 — CALM CLOSE
          Final CTA.
          ================================================================ */}
      <section className="bg-stone-900 text-white py-20 md:py-28">
        <PageGrid maxWidth="narrow">
          <div className="text-center">
            <p className="font-editorial text-xl md:text-2xl text-stone-300 mb-8">
              Start with the decision that matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/decisions"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-white text-stone-900 hover:bg-stone-100"
              >
                Explore decisions
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/trips"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/60"
              >
                Browse trips
              </Link>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          FOOTER
          Simple, quiet.
          ================================================================ */}
      <footer className="bg-stone-950 text-white py-10">
        <PageGrid maxWidth="default">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="font-editorial text-base font-semibold">Safari Index</span>
              <span className="text-stone-500 text-sm ml-2">Pan-African Decision System</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/decisions" className="text-sm text-stone-400 hover:text-white transition-colors">
                Decisions
              </Link>
              <Link href="/trips" className="text-sm text-stone-400 hover:text-white transition-colors">
                Trips
              </Link>
              <Link href="/guides" className="text-sm text-stone-400 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/how-it-works" className="text-sm text-stone-400 hover:text-white transition-colors">
                How it works
              </Link>
            </div>
          </div>
        </PageGrid>
      </footer>
    </>
  );
}

'use client';

/**
 * Safari Index Homepage
 *
 * Professional safari operator arrival page with decision authority framing.
 * Positions Safari Index as a serious safari company that uses logic-backed
 * decision support to plan better trips.
 *
 * Structure:
 * 1. ARRIVAL HERO - Operator positioning with African landscape
 * 2. OPERATOR CREDENTIALS - Factual trust signals
 * 3. HOW WE WORK - Decision-backed planning (3 pillars)
 * 4. REAL QUESTIONS - 6 decision cards from topic registry
 * 5. TRIP SHAPES - Commercial safari offerings
 * 6. ACCOUNTABILITY - Trust signals
 * 7. CALM CLOSE - Start planning CTA
 */

import Link from 'next/link';
import { ChevronDown, ArrowRight, MapPin, Calendar, Scale, ShieldOff, FileText, RefreshCw, Map } from 'lucide-react';
import { ImageBand, ImageBandContent, pageImages } from './components/visual';
import { Navbar, PageGrid } from './components/layout';
import { OperatorCredentials } from './components/OperatorCredentials';
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
          Operator positioning with African landscape.
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
          {/* Eyebrow - Operator positioning */}
          <p className="font-ui text-xs md:text-sm font-medium text-white/60 uppercase tracking-wider mb-4 animate-fade-in-up">
            Private Safari Planning · East & Southern Africa
          </p>

          {/* H1 Headline - Operator-first, decision-backed */}
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-5 max-w-3xl animate-fade-in-up animation-delay-100">
            Safaris planned with clarity.
          </h1>

          {/* Subhead - Operator identity */}
          <p className="font-editorial text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl animate-fade-in-up animation-delay-200">
            Safari Index plans and operates private safaris across Africa.
            Every decision is logic-backed. Every trip is custom-built.
          </p>

          {/* CTAs - Trips first (commercial), then Decisions (how we work) */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-300">
            <PrimaryButton href="/trips">
              Browse safaris
            </PrimaryButton>
            <SecondaryButton href="/decisions">
              How we decide
            </SecondaryButton>
          </div>
        </ImageBandContent>

        <ScrollIndicator />
      </ImageBand>

      {/* ================================================================
          SECTION 1.5 — OPERATOR CREDENTIALS
          Factual trust signals. No slogans.
          ================================================================ */}
      <section className="bg-white border-b border-stone-100 py-6">
        <PageGrid maxWidth="default">
          <OperatorCredentials variant="full" />
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 2 — HOW WE PLAN SAFARIS
          Decision-backed planning approach.
          ================================================================ */}
      <section className="bg-gradient-to-b from-stone-50 to-white py-20 md:py-28">
        <PageGrid maxWidth="narrow">
          <div className="text-center mb-14">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              How we plan safaris
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              Every safari we operate starts with clear decisions about timing, expectations, and trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <PillarCard
              icon={Scale}
              title="Clear verdicts"
              description="We give you direct answers, not vague suggestions. Go or don't go. This month or that one."
            />
            <PillarCard
              icon={RefreshCw}
              title="Visible trade-offs"
              description="Every choice has costs. We show you what you gain and what you give up."
            />
            <PillarCard
              icon={ShieldOff}
              title="Honest refusals"
              description="If we can't recommend something responsibly, we'll tell you why."
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
          SECTION 3.5 — SAFARIS WE OPERATE
          Trip shapes as commercial anchors.
          ================================================================ */}
      <section className="bg-stone-50 py-20 md:py-28">
        <PageGrid maxWidth="default">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Map className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900">
                Safaris we operate
              </h2>
            </div>
            <p className="text-stone-600 max-w-xl mx-auto">
              Private itineraries across East and Southern Africa.
              Each is custom-built around the decisions that matter for your trip.
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
              View all safari itineraries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 4 — CATEGORY CLARIFICATION
          What kind of operator Safari Index is.
          ================================================================ */}
      <section className="bg-white py-16 md:py-20">
        <PageGrid maxWidth="narrow">
          <div className="text-center">
            <h2 className="font-editorial text-xl md:text-2xl font-semibold text-stone-900 mb-4">
              A different kind of safari operator
            </h2>
            <p className="font-editorial text-stone-600 leading-relaxed max-w-2xl mx-auto">
              We plan and operate private safaris. We also publish the decision logic behind our recommendations.
              You see exactly why we suggest what we suggest—and what would change our answer.
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
          SECTION 6 — START PLANNING
          Final CTA - operator focused.
          ================================================================ */}
      <section className="bg-stone-900 text-white py-20 md:py-28">
        <PageGrid maxWidth="narrow">
          <div className="text-center">
            <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">
              Ready to plan your safari?
            </h2>
            <p className="font-editorial text-stone-400 mb-8 max-w-lg mx-auto">
              Browse our itineraries or start with the decisions that shape your trip.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/trips"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-white text-stone-900 hover:bg-stone-100"
              >
                Browse safaris
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/inquire"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/60"
              >
                Start planning
              </Link>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          FOOTER
          Safari operator identity.
          ================================================================ */}
      <footer className="bg-stone-950 text-white py-10">
        <PageGrid maxWidth="default">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="font-editorial text-base font-semibold">Safari Index</span>
              <span className="text-stone-500 text-sm ml-2">Private Safari Operator</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/trips" className="text-sm text-stone-400 hover:text-white transition-colors">
                Safaris
              </Link>
              <Link href="/decisions" className="text-sm text-stone-400 hover:text-white transition-colors">
                Decisions
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

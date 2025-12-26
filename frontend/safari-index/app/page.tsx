'use client';

/**
 * Safari Index Homepage
 *
 * Professional safari operator arrival page with rich visual presence.
 * Positions Safari Index as a serious safari company that uses logic-backed
 * decision support to plan better trips.
 *
 * Structure:
 * 1. ARRIVAL HERO - Operator positioning with African landscape
 * 2. OPERATOR CREDENTIALS - Factual trust signals
 * 3. DESTINATION SHOWCASE - Visual grid of key destinations
 * 4. HOW WE WORK - Decision-backed planning (3 pillars)
 * 5. EXPERIENCE GALLERY - Safari experiences mosaic
 * 6. REAL QUESTIONS - 6 decision cards from topic registry
 * 7. TRIP SHAPES - Commercial safari offerings with images
 * 8. CALM CLOSE - Start planning CTA
 */

import Link from 'next/link';
import { ChevronDown, ArrowRight, MapPin, Calendar, Scale, ShieldOff, RefreshCw, Map, Compass } from 'lucide-react';
import { ImageBand, ImageBandContent, pageImages, destinationImages, activityImageRefs, ecosystemImages } from './components/visual';
import { Navbar, PageGrid } from './components/layout';
import { OperatorCredentials } from './components/OperatorCredentials';
import { SearchAndFilters } from './components/SearchAndFilters';
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
 * Destination Card - Visual card for destination showcase
 */
function DestinationCard({
  id,
  name,
  tagline,
  featured,
}: {
  id: string;
  name: string;
  tagline: string;
  featured?: boolean;
}) {
  const image = destinationImages[id];

  return (
    <Link
      href={`/destinations#${id}`}
      className={`group relative block overflow-hidden rounded-xl ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <div className={`relative ${featured ? 'h-80 md:h-full' : 'h-48 md:h-56'}`}>
        <img
          src={image?.src || '/images/ecosystems/savannah-morning.jpg'}
          alt={image?.alt || `${name} safari landscape`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className={`font-editorial font-semibold text-white mb-1 ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}>
            {name}
          </h3>
          <p className={`text-white/70 ${featured ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
            {tagline}
          </p>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Experience Card - For the experience gallery
 */
function ExperienceCard({
  activityId,
  title,
  description,
}: {
  activityId: string;
  title: string;
  description: string;
}) {
  const imageRef = activityImageRefs[activityId];
  const imageSrc = imageRef?.hasImage ? imageRef.src : '/images/ecosystems/savannah-morning.jpg';

  return (
    <Link
      href={`/activities/${activityId}`}
      className="group relative block overflow-hidden rounded-xl h-64"
    >
      <img
        src={imageSrc || '/images/ecosystems/savannah-morning.jpg'}
        alt={imageRef?.alt || title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-editorial text-lg font-semibold text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-white/70 line-clamp-2">
          {description}
        </p>
      </div>
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
 */
function getFeaturedTopics(): DecisionTopic[] {
  const allTopics = getPublishedTopics();

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

  for (const topic of allTopics) {
    if (featured.length >= 6) break;
    if (!featured.includes(topic)) featured.push(topic);
  }

  return featured.slice(0, 6);
}

/**
 * Trip Card with image - for homepage showcase
 */
function TripCardWithImage({ trip, index }: { trip: { id: string; title: string; subtitle: string }; index: number }) {
  // Use different ecosystem images for variety
  const ecosystemIndex = index % ecosystemImages.length;
  const image = ecosystemImages[ecosystemIndex];

  return (
    <Link
      href={`/trips/${trip.id}`}
      prefetch={false}
      className="group block"
    >
      <div className="rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          <img
            src={image?.src || '/images/ecosystems/savannah-morning.jpg'}
            alt={image?.alt || 'Safari landscape'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-editorial text-base font-medium text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
            {trip.title}
          </h3>
          <p className="text-sm text-stone-500 line-clamp-1">
            {trip.subtitle}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-amber-700">
            <Compass className="w-3.5 h-3.5" />
            <span className="font-medium">View itinerary</span>
            <ArrowRight className="w-3 h-3 ml-auto text-stone-400 group-hover:text-amber-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Featured destinations data
 */
const FEATURED_DESTINATIONS = [
  { id: 'tanzania', name: 'Tanzania', tagline: 'Serengeti, Ngorongoro, and the birthplace of safari', featured: true },
  { id: 'kenya', name: 'Kenya', tagline: 'Masai Mara conservancies and Laikipia' },
  { id: 'botswana', name: 'Botswana', tagline: 'Okavango Delta and exclusive wilderness' },
  { id: 'namibia', name: 'Namibia', tagline: 'Desert landscapes and Sossusvlei dunes' },
  { id: 'rwanda', name: 'Rwanda', tagline: 'Mountain gorillas in the Virungas' },
];

/**
 * Featured experiences data
 */
const FEATURED_EXPERIENCES = [
  { activityId: 'game-drive', title: 'Game Drives', description: 'Classic safari exploration at dawn and dusk' },
  { activityId: 'walking-safari', title: 'Walking Safaris', description: 'On foot with expert guides through the bush' },
  { activityId: 'gorilla-trekking', title: 'Gorilla Trekking', description: 'Mountain gorilla encounters in volcanic forests' },
  { activityId: 'hot-air-balloon', title: 'Balloon Safaris', description: 'Sunrise flights over the Serengeti plains' },
];

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

          {/* CTAs */}
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
          SECTION 1.5 — SEARCH & EXPLORE
          Search bar and filters immediately below hero.
          ================================================================ */}
      <section className="bg-white py-8 md:py-10 border-b border-stone-200">
        <PageGrid maxWidth="default">
          <div className="max-w-3xl mx-auto">
            <SearchAndFilters />
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 1.75 — OPERATOR CREDENTIALS
          Factual trust signals. No slogans.
          ================================================================ */}
      <section className="bg-stone-50 border-b border-stone-100 py-6">
        <PageGrid maxWidth="default">
          <OperatorCredentials variant="full" />
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 2 — DESTINATION SHOWCASE
          Visual grid of key destinations.
          ================================================================ */}
      <section className="bg-stone-50 py-16 md:py-24">
        <PageGrid maxWidth="default">
          <div className="text-center mb-10">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-3">
              Where we operate
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              Private safaris across East and Southern Africa's most rewarding destinations.
            </p>
          </div>

          {/* Destination Grid - Asymmetric layout for visual interest */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {FEATURED_DESTINATIONS.map((dest) => (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                tagline={dest.tagline}
                featured={dest.featured}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
            >
              View all destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 3 — HOW WE PLAN SAFARIS
          Decision-backed planning approach.
          ================================================================ */}
      <section className="bg-white py-20 md:py-28">
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
          SECTION 3.5 — EXPERIENCE GALLERY
          Safari experiences mosaic.
          ================================================================ */}
      <section className="bg-stone-900 py-16 md:py-24">
        <PageGrid maxWidth="default">
          <div className="text-center mb-10">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-3">
              Safari experiences
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto">
              From classic game drives to walking safaris and gorilla treks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_EXPERIENCES.map((exp) => (
              <ExperienceCard
                key={exp.activityId}
                activityId={exp.activityId}
                title={exp.title}
                description={exp.description}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Explore all activities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 4 — REAL QUESTIONS
          6 decision cards from topic registry.
          ================================================================ */}
      <section className="bg-stone-50 py-20 md:py-28">
        <PageGrid maxWidth="default">
          <div className="text-center mb-12">
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              Start with a real question
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              We publish our decision logic. Ask a question and get a clear, reasoned answer.
            </p>
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
          SECTION 5 — SAFARIS WE OPERATE
          Trip shapes with images.
          ================================================================ */}
      <section className="bg-white py-20 md:py-28">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrips.map((trip, index) => (
              <TripCardWithImage key={trip.id} trip={trip} index={index} />
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
          SECTION 6 — CATEGORY CLARIFICATION WITH IMAGE
          Visual statement about Safari Index.
          ================================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ecosystemImages.find(img => img.id === 'kopje-landscape')?.src || '/images/ecosystems/savannah-morning.jpg'}
            alt="African landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/80" />
        </div>
        <div className="relative py-20 md:py-32">
          <PageGrid maxWidth="narrow">
            <div className="text-center">
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-5">
                A different kind of safari operator
              </h2>
              <p className="font-editorial text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto mb-8">
                We plan and operate private safaris. We also publish the decision logic behind our recommendations.
                You see exactly why we suggest what we suggest—and what would change our answer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-white text-stone-900 hover:bg-stone-100"
                >
                  How it works
                  <ArrowRight className="w-4 h-4" />
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
        </div>
      </section>

      {/* ================================================================
          SECTION 7 — ACCOUNTABILITY SIGNALS
          Trust signals with visual treatment.
          ================================================================ */}
      <section className="bg-stone-50 py-16 md:py-20">
        <PageGrid maxWidth="default">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: 'Versioned & Dated', text: 'Every decision is timestamped and versioned.' },
              { icon: RefreshCw, title: 'Conditions Change', text: 'Outcomes update when the facts change.' },
              { icon: ShieldOff, title: 'No Incentives', text: 'No commissions, no bookings, no hidden agendas.' },
              { icon: MapPin, title: 'Local Knowledge', text: 'Grounded in years of African safari experience.' },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white border border-stone-200">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-stone-600" />
                </div>
                <h3 className="font-medium text-stone-900 mb-1">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.text}</p>
              </div>
            ))}
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 8 — START PLANNING
          Final CTA with image background.
          ================================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ecosystemImages.find(img => img.id === 'floodplain-evening')?.src || '/images/ecosystems/savannah-morning.jpg'}
            alt="African sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        </div>
        <div className="relative py-24 md:py-32">
          <PageGrid maxWidth="default">
            <div className="max-w-lg">
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-4">
                Ready to plan your safari?
              </h2>
              <p className="font-editorial text-stone-300 mb-8">
                Browse our itineraries, explore the decisions that shape your trip, or start a conversation with our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/trips"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-white text-stone-900 hover:bg-stone-100"
                >
                  Browse safaris
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-amber-600 text-white hover:bg-amber-700"
                >
                  Start planning
                </Link>
              </div>
            </div>
          </PageGrid>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          Safari operator identity.
          ================================================================ */}
      <footer className="bg-stone-950 text-white py-12">
        <PageGrid maxWidth="default">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <span className="font-editorial text-xl font-semibold">Safari Index</span>
              <p className="text-stone-400 text-sm mt-2 max-w-sm">
                Private safari operator specializing in East and Southern Africa.
                Logic-backed decisions. Custom-built itineraries.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-stone-300 mb-3">Explore</h4>
              <div className="space-y-2">
                <Link href="/trips" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Safaris
                </Link>
                <Link href="/destinations" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Destinations
                </Link>
                <Link href="/activities" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Activities
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-stone-300 mb-3">Resources</h4>
              <div className="space-y-2">
                <Link href="/decisions" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Decisions
                </Link>
                <Link href="/how-it-works" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  How it works
                </Link>
                <Link href="/inquire" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Plan a Safari
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-stone-500 text-sm">
              Safari Index · Private Safari Operator
            </p>
            <div className="flex items-center gap-6">
              <Link href="/guides" className="text-sm text-stone-400 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/when-to-go" className="text-sm text-stone-400 hover:text-white transition-colors">
                When to Go
              </Link>
              <Link href="/compare" className="text-sm text-stone-400 hover:text-white transition-colors">
                Compare
              </Link>
            </div>
          </div>
        </PageGrid>
      </footer>
    </>
  );
}

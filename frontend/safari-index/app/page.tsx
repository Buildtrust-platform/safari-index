/**
 * Vurara Safaris Homepage
 *
 * Professional safari operator arrival page with rich visual presence.
 * Positions Vurara Safaris as a serious safari company that uses logic-backed
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
 *
 * NOTE: This is a SERVER COMPONENT for SEO (faster indexing).
 * Interactive parts (SearchAndFilters, NewsletterSignup) are client components.
 */

import Link from 'next/link';
import { ChevronDown, ArrowRight, MapPin, Calendar, Scale, ShieldOff, RefreshCw, Users, Compass } from 'lucide-react';
import { ImageBand, ImageBandContent, pageImages, destinationImages, activityImageRefs, ecosystemImages, AfricaMapBackground } from './components/visual';
import { Navbar, PageGrid } from './components/layout';
import { SearchAndFilters } from './components/SearchAndFilters';
import { NewsletterSignup } from './components/NewsletterSignup';
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
 * Pillar Card - Three pillars of what Vurara Safaris does
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
 * Map trip IDs to specific unique images
 * Each of the first 6 trips (shown on homepage) gets a distinct image
 */
const tripImageMap: Record<string, { src: string; alt: string }> = {
  // First 6 trips shown on homepage - each unique
  'classic-serengeti-ngorongoro': { src: '/images/library/destinations/zebras-wildebeest-ngorongoro.jpg', alt: 'Zebras and wildebeest in Ngorongoro' },
  'migration-focused-serengeti': { src: '/images/activities/migration.jpg', alt: 'Great Migration river crossing' },
  'tanzania-southern-circuit': { src: '/images/library/wildlife/lion-couple-savanna.jpg', alt: 'Lions in Ruaha' },
  'classic-kenya-safari': { src: '/images/library/wildlife/lion-portrait.jpg', alt: 'Lion in Masai Mara' },
  'kenya-conservancy-focused': { src: '/images/library/wildlife/lioness-tree-shade.jpg', alt: 'Lioness in conservancy' },
  'okavango-delta-immersion': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta aerial' },
  // Additional trips with unique images
  'botswana-diverse-ecosystems': { src: '/images/ecosystems/desert-dunes.jpg', alt: 'Makgadikgadi salt pans' },
  'kruger-greater-kruger': { src: '/images/destinations/south-africa-kruger.jpg', alt: 'Kruger National Park' },
  'south-africa-combo': { src: '/images/destinations/south-africa-lodge.jpg', alt: 'Cape Town and safari' },
  'rwanda-gorilla-focused': { src: '/images/destinations/rwanda-volcanoes.jpg', alt: 'Volcanoes National Park' },
  'uganda-primate-safari': { src: '/images/activities/chimp-tracking.jpg', alt: 'Chimpanzee tracking' },
  'namibia-highlights': { src: '/images/destinations/namibia-sossusvlei.jpg', alt: 'Sossusvlei dunes' },
  'namibia-self-drive': { src: '/images/library/destinations/ruacana-waterfall-namibia.jpg', alt: 'Namibia waterfall' },
  'zambia-walking-safari': { src: '/images/destinations/zambia-luangwa.jpg', alt: 'South Luangwa' },
  'victoria-falls-safari-combo': { src: '/images/library/destinations/african-waterfall-aerial.jpg', alt: 'Victoria Falls' },
  'photography-focused-safari': { src: '/images/library/wildlife/leopard-with-cubs.jpg', alt: 'Leopard family' },
  'family-multigenerational': { src: '/images/library/birding/family-camping-safari.jpg', alt: 'Family safari' },
  'honeymoon-romance-safari': { src: '/images/library/destinations/tanzania-wildlife-sunset-1.jpg', alt: 'Romantic sunset' },
  'budget-first-safari': { src: '/images/library/wildlife/elephants-kilimanjaro-amboseli.jpg', alt: 'Elephants with Kilimanjaro' },
};

/**
 * Format cost band for display
 */
function formatCostBand(costBand: { low: number; high: number }): string {
  const formatK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  return `${formatK(costBand.low)}–${formatK(costBand.high)}`;
}

/**
 * Format duration for display
 */
function formatDuration(days: number | [number, number]): string {
  if (Array.isArray(days)) {
    return `${days[0]}–${days[1]} days`;
  }
  return `${days} days`;
}

/**
 * Trip Card with image - for homepage showcase
 */
function TripCardWithImage({
  trip,
  index
}: {
  trip: {
    id: string;
    title: string;
    subtitle: string;
    cost_band?: { low: number; high: number };
    duration_days?: number | [number, number];
  };
  index: number
}) {
  // Use unique image from map, fallback to ecosystem images
  const tripImage = tripImageMap[trip.id];

  // Fallback to ecosystem images if no specific image mapped
  const ecosystemIndex = index % ecosystemImages.length;
  const fallbackImage = ecosystemImages[ecosystemIndex];

  const imageSrc = tripImage?.src || fallbackImage?.src || '/images/ecosystems/savannah-morning.jpg';
  const imageAlt = tripImage?.alt || fallbackImage?.alt || 'Safari landscape';

  return (
    <Link
      href={`/trips/${trip.id}`}
      prefetch={false}
      className="group block"
    >
      <div className="rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Duration badge */}
          {trip.duration_days && (
            <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-md text-stone-700">
              {formatDuration(trip.duration_days)}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-editorial text-base font-medium text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
            {trip.title}
          </h3>
          <p className="text-sm text-stone-500 line-clamp-1">
            {trip.subtitle}
          </p>
          <div className="flex items-center justify-between mt-3">
            {/* Cost band */}
            {trip.cost_band && (
              <div className="text-xs text-stone-600">
                <span className="font-medium text-stone-800">{formatCostBand(trip.cost_band)}</span>
                <span className="text-stone-400"> /person</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-amber-700">
              <span className="font-medium">Explore</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
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
    <main id="main-content">
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
            We plan private safaris across Africa. Every decision is logic-backed. Every trip is built around what actually matters to you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-300">
            <PrimaryButton href="/trips">
              Find your safari
            </PrimaryButton>
            <SecondaryButton href="/decisions">
              See our thinking
            </SecondaryButton>
          </div>
        </ImageBandContent>

        <ScrollIndicator />
      </ImageBand>

      {/* ================================================================
          SECTION 1.5 — SEARCH & CREDENTIALS
          Search bar with quick links and operator credentials integrated.
          ================================================================ */}
      <section className="bg-gradient-to-b from-stone-100 to-stone-50 py-8 md:py-10 border-b border-stone-200">
        <PageGrid maxWidth="default">
          {/* Search area */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-center text-sm text-stone-500 mb-4">
              Search destinations, activities, or questions
            </p>
            <SearchAndFilters hero />

            {/* Quick links below search */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-stone-400">Popular:</span>
              <Link href="/decisions/tanzania-vs-kenya-first-safari" className="px-3 py-1.5 rounded-full bg-white text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors border border-stone-200">
                Tanzania vs Kenya
              </Link>
              <Link href="/decisions/is-5-days-enough-for-safari" className="px-3 py-1.5 rounded-full bg-white text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors border border-stone-200">
                How many days?
              </Link>
              <Link href="/when-to-go" className="px-3 py-1.5 rounded-full bg-white text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors border border-stone-200">
                Best time to go
              </Link>
              <Link href="/decisions/safari-with-young-children" className="px-3 py-1.5 rounded-full bg-white text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors border border-stone-200">
                Family safaris
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-200 max-w-2xl mx-auto mb-6" />

          {/* Operator credentials - integrated */}
          <p className="text-center text-xs font-medium text-stone-400 uppercase tracking-widest mb-4">
            Who we are
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide">Coverage</p>
                <p className="text-xs text-stone-700 font-medium">East & Southern Africa</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide">Trip style</p>
                <p className="text-xs text-stone-700 font-medium">Private, custom-built</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Compass className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide">Operations</p>
                <p className="text-xs text-stone-700 font-medium">Direct ground teams</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Scale className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide">Approach</p>
                <p className="text-xs text-stone-700 font-medium">Logic-backed decisions</p>
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 1.8 — TESTIMONIALS
          Social proof from real travelers.
          ================================================================ */}
      <section className="bg-white py-8 md:py-10 border-b border-stone-100">
        <PageGrid maxWidth="default">
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
              What travelers say
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "The decision logic helped us understand exactly why August was better than July for our Masai Mara trip. No vague promises, just clear reasoning.",
                author: "Sarah & Mark",
                trip: "Kenya, August 2024"
              },
              {
                quote: "They told us our budget wouldn't work for what we wanted and suggested a realistic alternative. That honesty saved us from disappointment.",
                author: "The Rodriguez Family",
                trip: "Tanzania, October 2024"
              },
              {
                quote: "First safari company that showed us the trade-offs upfront. We knew exactly what we were choosing and why.",
                author: "David L.",
                trip: "Botswana, June 2024"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-5 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-sm text-stone-700 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="text-xs text-stone-500">
                  <span className="font-medium text-stone-700">{testimonial.author}</span>
                  <span className="mx-2">·</span>
                  <span>{testimonial.trip}</span>
                </div>
              </div>
            ))}
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 2 — DESTINATION SHOWCASE
          Visual grid of key destinations.
          Soft sand background for visual rhythm.
          ================================================================ */}
      <section className="relative py-8 md:py-12">
        {/* Soft sand background */}
        <div className="absolute inset-0 bg-[#F5F1E8]" />
        <div className="relative">
          <PageGrid maxWidth="wide">
            <div className="text-center mb-8">
              {/* Eyebrow label */}
              <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
                Where to go
              </p>
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-2">
                Safari Destinations
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto text-sm">
                Private safaris across East and Southern Africa.
              </p>
            </div>

            {/* Destination Grid - Wider cards with more spacing */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
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

            <div className="text-center mt-6">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
              >
                View all destinations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PageGrid>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      {/* ================================================================
          SECTION 3 — HOW WE PLAN SAFARIS
          Decision-backed planning approach.
          ================================================================ */}
      <section className="relative bg-white py-8 md:py-12 overflow-hidden">
        {/* Africa Map Background - subtle visual context */}
        <AfricaMapBackground className="opacity-60" />
        <PageGrid maxWidth="default" className="relative z-10">
          <div className="text-center mb-8">
            {/* Eyebrow label */}
            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
              Our Approach
            </p>
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-2">
              How we plan safaris
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm">
              Every safari we operate starts with clear decisions about timing, expectations, and trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
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
          Light neutral background for visual rhythm.
          ================================================================ */}
      <section className="relative py-8 md:py-12">
        {/* Light neutral gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 to-stone-100" />
        <div className="relative">
        <PageGrid maxWidth="wide">
          <div className="text-center mb-8">
            {/* Eyebrow label */}
            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
              What to do
            </p>
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-2">
              Safari Experiences
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm">
              From classic game drives to walking safaris and gorilla treks.
            </p>
          </div>

          {/* Wider card grid with increased spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_EXPERIENCES.map((exp) => (
              <ExperienceCard
                key={exp.activityId}
                activityId={exp.activityId}
                title={exp.title}
                description={exp.description}
              />
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
            >
              Explore all activities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 — REAL QUESTIONS
          6 decision cards from topic registry.
          Full-width background band.
          ================================================================ */}
      <section className="relative py-8 md:py-12">
        {/* Full-width warm background band */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-stone-50 to-white" />
        <div className="relative">
          <PageGrid maxWidth="wide">
            <div className="text-center mb-8">
              {/* Eyebrow label */}
              <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-2">
                Decision Support
              </p>
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-2">
                Start with a real question
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto text-sm">
                We publish our decision logic. Ask a question and get a clear, reasoned answer.
              </p>
            </div>

            {/* Wider card grid with increased spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {featuredTopics.map((topic) => (
                <QuestionCard key={topic.topic_id} topic={topic} />
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/decisions"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
              >
                View all decisions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PageGrid>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 — SAFARIS WE OPERATE
          Trip shapes with images.
          Charcoal background for visual contrast.
          ================================================================ */}
      <section className="bg-stone-800 py-8 md:py-12">
        <PageGrid maxWidth="wide">
          <div className="text-center mb-8">
            {/* Eyebrow label */}
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
              Trip shapes
            </p>
            <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-2">
              Sample Itineraries
            </h2>
            <p className="text-stone-300 max-w-xl mx-auto text-sm">
              Private itineraries across East and Southern Africa.
              Each is custom-built around the decisions that matter for your trip.
            </p>
          </div>

          {/* Wider card grid with increased spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featuredTrips.map((trip, index) => (
              <TripCardWithImage key={trip.id} trip={trip} index={index} />
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Explore all itineraries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 6 — CATEGORY CLARIFICATION WITH IMAGE
          Visual statement about Vurara Safaris.
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
        <div className="relative py-14 md:py-20">
          <PageGrid maxWidth="narrow">
            <div className="text-center">
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-3">
                A different kind of safari operator
              </h2>
              <p className="font-editorial text-base text-stone-300 leading-relaxed max-w-2xl mx-auto mb-6">
                We plan and operate private safaris. We also publish the decision logic behind our recommendations.
                You see exactly why we suggest what we suggest, and what would change our answer.
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
          SECTION 6.5 — WHO WE ARE
          Brief founder/team element for human connection.
          ================================================================ */}
      <section className="bg-white py-10 md:py-12 border-b border-stone-100">
        <PageGrid maxWidth="default">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-stone-600" />
            </div>
            <h2 className="font-editorial text-xl md:text-2xl font-semibold text-stone-900 mb-3">
              Built by safari operators
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              Vurara Safaris was founded by operators who spent years planning trips across East and Southern Africa.
              We built the decision system we wished existed. One that shows you exactly why we recommend what we recommend, and what would change our answer.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
            >
              Learn how we work
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 7 — ACCOUNTABILITY SIGNALS
          Trust signals with visual treatment.
          ================================================================ */}
      <section className="bg-stone-50 py-10 md:py-12">
        <PageGrid maxWidth="default">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Calendar, title: 'Published reasoning', text: 'Every decision is timestamped and open to review.' },
              { icon: RefreshCw, title: 'Always updated', text: 'Our advice changes when conditions change.' },
              { icon: ShieldOff, title: 'Independent advice', text: 'No commissions or hidden incentives.' },
              { icon: MapPin, title: 'Ground-level knowledge', text: 'Built on years of African safari experience.' },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-white border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-4 h-4 text-stone-600" />
                </div>
                <h3 className="font-medium text-stone-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-stone-500">{item.text}</p>
              </div>
            ))}
          </div>
        </PageGrid>
      </section>

      {/* ================================================================
          SECTION 7.5 — NEWSLETTER
          Newsletter signup near footer, calm tone.
          ================================================================ */}
      <section className="bg-stone-900 py-10 md:py-12 border-t border-stone-800">
        <PageGrid maxWidth="narrow">
          <NewsletterSignup />
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
        <div className="relative py-14 md:py-20">
          <PageGrid maxWidth="default">
            <div className="max-w-lg">
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-white mb-3">
                Ready to plan your safari?
              </h2>
              <p className="font-editorial text-stone-300 text-sm mb-6">
                Browse our itineraries, explore the decisions that shape your trip, or start a conversation with our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/trips"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-white text-stone-900 hover:bg-stone-100"
                >
                  Find your safari
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 bg-amber-600 text-white hover:bg-amber-700"
                >
                  Talk to our team
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
      <footer className="bg-stone-950 text-white py-8">
        <PageGrid maxWidth="default">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            {/* Company info and contact */}
            <div className="md:col-span-2">
              <span className="font-editorial text-xl font-semibold">Vurara Safaris</span>
              <p className="text-stone-400 text-sm mt-2 max-w-sm">
                Private safari operator specializing in East and Southern Africa.
                Logic-backed decisions. Custom-built itineraries.
              </p>
              {/* Contact info */}
              <div className="mt-4 space-y-1 text-sm text-stone-400">
                <p>
                  <a href="mailto:hello@vurarasafaris.com" className="hover:text-white transition-colors">
                    hello@vurarasafaris.com
                  </a>
                </p>
                <p>
                  <a href="tel:+255123456789" className="hover:text-white transition-colors">
                    +255 123 456 789
                  </a>
                </p>
              </div>
              {/* Physical address */}
              <div className="mt-3 text-xs text-stone-500">
                <p>Vurara Safaris Ltd.</p>
                <p>Arusha, Tanzania</p>
              </div>
              {/* Social media */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://instagram.com/safariindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/safariindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/safariindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@safariindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            {/* Explore */}
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
            {/* Resources */}
            <div>
              <h4 className="font-medium text-stone-300 mb-3">Resources</h4>
              <div className="space-y-2">
                <Link href="/decisions" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Decisions
                </Link>
                <Link href="/blog" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Journal
                </Link>
                <Link href="/how-it-works" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  How it works
                </Link>
                <Link href="/guides" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Guides
                </Link>
              </div>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-medium text-stone-300 mb-3">Contact</h4>
              <div className="space-y-2">
                <Link href="/inquire" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Plan a Safari
                </Link>
                <Link href="/contact" className="block text-sm text-stone-400 hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
          {/* Bottom bar with legal links */}
          <div className="border-t border-stone-800 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-stone-500 text-xs">
              © {new Date().getFullYear()} Vurara Safaris Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacy" className="text-stone-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-stone-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/when-to-go" className="text-stone-500 hover:text-white transition-colors">
                When to Go
              </Link>
              <Link href="/compare" className="text-stone-500 hover:text-white transition-colors">
                Compare
              </Link>
            </div>
          </div>
        </PageGrid>
      </footer>
    </main>
  );
}

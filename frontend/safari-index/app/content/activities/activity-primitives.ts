/**
 * Safari Activity Primitives
 *
 * Canonical definitions of safari activities used across all destinations.
 * These are operator-grade descriptions, not marketing copy.
 *
 * Per governance:
 * - Documentary, factual tone
 * - No hype or promotional language
 * - Honest about trade-offs and limitations
 */

export type PhysicalEffort = 'low' | 'medium' | 'medium-high' | 'high';

export type ActivityCategory = 'vehicle' | 'water' | 'foot' | 'aerial' | 'specialty';

export interface ActivityPrimitive {
  id: string;
  name: string;
  category: ActivityCategory;
  what_it_is: string;
  where_possible: string[];
  best_season: string;
  who_it_is_for: string;
  who_should_avoid: string;
  physical_effort: PhysicalEffort;
  risk_notes: string;
  trade_offs: {
    gains: string;
    losses: string;
  };
  /** Stock photo reference for visual inspiration */
  image_hint: string;
}

export const activityPrimitives: ActivityPrimitive[] = [
  {
    id: 'game-drive',
    name: 'Game Drive',
    category: 'vehicle',
    what_it_is:
      'Vehicle-based wildlife viewing, typically in open 4x4s with elevated seating. Morning and afternoon sessions lasting 3-4 hours each.',
    where_possible: [
      'tanzania',
      'kenya',
      'botswana',
      'south-africa',
      'namibia',
      'zambia',
      'zimbabwe',
      'uganda',
      'rwanda',
    ],
    best_season: 'Dry season for density; green season for birthing',
    who_it_is_for: 'All travelers; foundational safari activity',
    who_should_avoid: 'Those who cannot sit for extended periods',
    physical_effort: 'low',
    risk_notes: 'Dust exposure; occasional rough roads',
    trade_offs: {
      gains: 'Maximum wildlife coverage and comfort',
      losses: 'Limited intimacy with landscape; vehicle barrier between you and environment',
    },
    image_hint: 'Safari vehicle with tourists viewing elephants at sunrise on African savanna',
  },
  {
    id: 'walking-safari',
    name: 'Walking Safari',
    category: 'foot',
    what_it_is:
      'Guided foot patrol with armed ranger, focusing on tracking, ecology, and sensory immersion rather than Big Five sightings.',
    where_possible: [
      'zambia',
      'zimbabwe',
      'tanzania-selous',
      'tanzania-ruaha',
      'kenya-conservancies',
      'south-africa',
      'botswana',
    ],
    best_season: 'Dry season (safer visibility, less dense vegetation)',
    who_it_is_for: 'Travelers seeking depth over volume; repeat safari-goers',
    who_should_avoid: 'Those with mobility limitations; those prioritizing Big Five checklist',
    physical_effort: 'medium-high',
    risk_notes: 'Armed guide mandatory; wildlife encounter protocols strictly followed',
    trade_offs: {
      gains: 'Deep immersion, tracking skills, understanding of ecosystem details',
      losses: 'Fewer large animal sightings; covers less ground than vehicles',
    },
    image_hint: 'Small group walking single file through African bush with armed guide leading',
  },
  {
    id: 'night-drive',
    name: 'Night Drive',
    category: 'vehicle',
    what_it_is:
      'After-dark game drive using spotlights to observe nocturnal species: leopard, aardvark, bush babies, civet, owls.',
    where_possible: [
      'south-africa',
      'zambia',
      'zimbabwe',
      'botswana',
      'kenya-conservancies',
      'tanzania-conservancies',
    ],
    best_season: 'Year-round; slightly better in dry season',
    who_it_is_for: 'Those interested in predator behavior, nocturnal ecology',
    who_should_avoid: 'Light sleepers who need early rest; young children',
    physical_effort: 'low',
    risk_notes: 'Cold temperatures; limited visibility for photography',
    trade_offs: {
      gains: 'Access to nocturnal wildlife rarely seen during day',
      losses: 'Challenging photography conditions; disrupts sleep schedule',
    },
    image_hint: 'Spotlight illuminating leopard eyes at night from safari vehicle',
  },
  {
    id: 'boat-safari',
    name: 'Boat Safari',
    category: 'water',
    what_it_is:
      'Wildlife viewing from motorboat or mokoro (dugout canoe), observing hippos, crocodiles, elephants, and waterbirds.',
    where_possible: [
      'botswana-okavango',
      'botswana-chobe',
      'zambia-lower-zambezi',
      'zambia-kafue',
      'zimbabwe-mana-pools',
      'zimbabwe-zambezi',
      'uganda-murchison',
      'tanzania-selous',
    ],
    best_season: 'High water: Jan-Jun (Okavango); varies by system',
    who_it_is_for: 'Photographers; those wanting variety from vehicles; birders',
    who_should_avoid: 'Those uncomfortable on water; non-swimmers in mokoro',
    physical_effort: 'low',
    risk_notes: 'Hippo proximity requires experienced guides; life jackets provided',
    trade_offs: {
      gains: 'Unique angles, calm experience, exceptional bird photography',
      losses: 'Limited terrestrial range; weather dependent',
    },
    image_hint: 'Elephants drinking at river edge viewed from boat at water level',
  },
  {
    id: 'mokoro',
    name: 'Mokoro (Dugout Canoe)',
    category: 'water',
    what_it_is:
      'Traditional dugout canoe poled through shallow Delta channels, offering silent, intimate water-level wildlife viewing.',
    where_possible: ['botswana-okavango'],
    best_season: 'May-August when flood waters are high',
    who_it_is_for: 'Those seeking tranquility; photographers wanting water-level perspectives',
    who_should_avoid: 'Those uncomfortable in small watercraft; those expecting fast-paced activity',
    physical_effort: 'low',
    risk_notes: 'Hippo awareness essential; guides trained in safe navigation',
    trade_offs: {
      gains: 'Unmatched tranquility; silent approach to wildlife; Delta-specific experience',
      losses: 'Limited to shallow channels; slow pace; weather exposure',
    },
    image_hint: 'Traditional mokoro canoe gliding through lily-covered Okavango Delta channels',
  },
  {
    id: 'gorilla-trekking',
    name: 'Gorilla Trekking',
    category: 'foot',
    what_it_is:
      'Guided forest hike to habituated mountain gorilla family, with one hour of observation time. Permit required.',
    where_possible: ['rwanda-volcanoes', 'uganda-bwindi', 'uganda-mgahinga', 'drc-virunga'],
    best_season: 'Year-round; Jun-Sep and Dec-Feb slightly drier',
    who_it_is_for: 'Travelers seeking singular wildlife encounters; those with moderate fitness',
    who_should_avoid:
      'Those with significant mobility issues; altitude sensitivity; respiratory conditions',
    physical_effort: 'high',
    risk_notes: 'Altitude 2,400-3,000m; steep terrain; 2-6 hour hikes typical',
    trade_offs: {
      gains: 'Transformative, once-in-a-lifetime encounter with great apes',
      losses: 'Physical demand significant; permit cost high ($700-1,500)',
    },
    image_hint: 'Mountain gorilla silverback in misty forest with trekkers observing from distance',
  },
  {
    id: 'chimp-tracking',
    name: 'Chimpanzee Tracking',
    category: 'foot',
    what_it_is:
      'Forest trek to locate habituated chimpanzee communities, observing social behavior at closer range than gorillas.',
    where_possible: [
      'uganda-kibale',
      'uganda-budongo',
      'tanzania-mahale',
      'tanzania-gombe',
      'rwanda-nyungwe',
    ],
    best_season: 'Year-round; dry seasons easier underfoot',
    who_it_is_for: 'Primate enthusiasts; those interested in behavioral observation',
    who_should_avoid: 'Those with mobility issues; those expecting passive viewing',
    physical_effort: 'medium-high',
    risk_notes: 'Forest terrain uneven; chimps move fast; 2-5 hour treks',
    trade_offs: {
      gains: 'Behavioral richness; closer encounters than gorillas; vocal displays',
      losses: 'Unpredictable sighting duration; chimps can move away quickly',
    },
    image_hint: 'Chimpanzee in forest canopy with dappled sunlight',
  },
  {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon Safari',
    category: 'aerial',
    what_it_is:
      'Dawn flight over savanna, typically 1 hour duration, followed by bush breakfast. Observes landscape and wildlife from altitude.',
    where_possible: ['tanzania-serengeti', 'kenya-masai-mara', 'south-africa-pilanesberg'],
    best_season: 'Year-round; best visibility in dry season',
    who_it_is_for: 'Those celebrating occasions; photographers wanting aerial perspective',
    who_should_avoid: 'Those with fear of heights; budget-conscious travelers',
    physical_effort: 'low',
    risk_notes: 'Weather-dependent cancellations; early wake-up (4-5am)',
    trade_offs: {
      gains: 'Unique perspective; memorable experience; landscape photography',
      losses: 'High cost ($400-600); no guarantees due to weather; brief duration',
    },
    image_hint: 'Hot air balloon floating over Serengeti plains at sunrise with wildebeest below',
  },
  {
    id: 'canoe-safari',
    name: 'Canoe Safari',
    category: 'water',
    what_it_is:
      'Multi-day paddle expedition, camping on riverbanks, with wildlife encountered at water level.',
    where_possible: ['zimbabwe-mana-pools', 'zambia-lower-zambezi'],
    best_season: 'Apr-Nov (water levels permitting)',
    who_it_is_for: 'Adventure-oriented travelers; experienced safari-goers',
    who_should_avoid: 'First-time safari visitors; those wanting comfort',
    physical_effort: 'medium-high',
    risk_notes: 'Hippo and crocodile presence requires strict protocols',
    trade_offs: {
      gains: 'Deep wilderness immersion; unique Zambezi experience; self-reliance',
      losses: 'Basic camping conditions; physically demanding; limited comfort',
    },
    image_hint: 'Canoes on Zambezi River with elephants on riverbank at sunset',
  },
  {
    id: 'fly-camping',
    name: 'Fly Camping',
    category: 'specialty',
    what_it_is:
      'Single night sleeping under stars or minimal canvas, away from main camp, with basic provisions.',
    where_possible: [
      'tanzania-ruaha',
      'tanzania-selous',
      'botswana',
      'zambia',
      'kenya-conservancies',
    ],
    best_season: 'Dry season only',
    who_it_is_for:
      'Travelers wanting authentic bush experience; those comfortable with minimal amenities',
    who_should_avoid: 'Those requiring consistent comfort; light sleepers',
    physical_effort: 'low',
    risk_notes: 'Armed guard present; basic toilet facilities; exposure to elements',
    trade_offs: {
      gains: 'Unfiltered wilderness night; stars overhead; memorable experience',
      losses: 'Comfort sacrifice; limited sleep for some; weather exposure',
    },
    image_hint: 'Simple bedroll under mosquito net with African night sky and campfire',
  },
  {
    id: 'horseback-safari',
    name: 'Horseback Safari',
    category: 'specialty',
    what_it_is:
      'Wildlife viewing and landscape traversal on horseback, ranging from 2-hour rides to multi-day expeditions.',
    where_possible: [
      'botswana-okavango',
      'kenya-masai-mara',
      'kenya-laikipia',
      'south-africa',
      'zimbabwe',
    ],
    best_season: 'Dry season for most; year-round in some areas',
    who_it_is_for: 'Experienced riders (intermediate+); those seeking alternative to vehicles',
    who_should_avoid: 'Non-riders; beginners; those with back issues',
    physical_effort: 'medium-high',
    risk_notes: 'Requires demonstrated riding ability; wildlife encounter protocols differ from vehicle',
    trade_offs: {
      gains: 'Intimate landscape connection; silent approach; unique perspective',
      losses: 'Riding skill required; physically demanding; limited to certain areas',
    },
    image_hint: 'Horseback riders crossing Okavango Delta water with zebras in background',
  },
  {
    id: 'photographic-hide',
    name: 'Photographic Hide',
    category: 'specialty',
    what_it_is:
      'Ground-level or underwater blind positioned at waterholes, offering eye-level wildlife photography opportunities.',
    where_possible: [
      'botswana',
      'zimbabwe-hwange',
      'kenya-select-properties',
      'south-africa',
      'namibia-etosha',
    ],
    best_season: 'Dry season (animals concentrate at water)',
    who_it_is_for: 'Serious photographers; patient observers',
    who_should_avoid: 'Those expecting constant action; impatient travelers',
    physical_effort: 'low',
    risk_notes: 'Extended stationary periods; sometimes cramped quarters',
    trade_offs: {
      gains: 'Exceptional photography angles; predictable wildlife visits',
      losses: 'Waiting time required; limited movement; single location',
    },
    image_hint: 'Elephant herd at waterhole shot from ground-level hide perspective',
  },
  {
    id: 'cultural-visit',
    name: 'Cultural Visit',
    category: 'specialty',
    what_it_is:
      'Structured community interaction: village visits, market tours, school visits, or homestead experiences with local families.',
    where_possible: [
      'tanzania',
      'kenya',
      'botswana',
      'zimbabwe',
      'zambia',
      'namibia',
      'uganda',
      'rwanda',
    ],
    best_season: 'Year-round',
    who_it_is_for: 'Travelers wanting human context; families with children',
    who_should_avoid: 'Those seeking only wildlife; those uncomfortable with economic disparity',
    physical_effort: 'low',
    risk_notes: 'Ensure operator has genuine community partnership, not staged tourism',
    trade_offs: {
      gains: 'Local understanding; human connection; context for landscape',
      losses: 'Risk of performative encounters if not properly managed',
    },
    image_hint: 'Maasai elder in traditional dress sharing knowledge with safari guests',
  },
  {
    id: 'scenic-helicopter',
    name: 'Scenic Helicopter Flight',
    category: 'aerial',
    what_it_is:
      'Aerial wildlife and landscape viewing, typically 15-45 minutes, over specific features (delta, falls, craters).',
    where_possible: [
      'botswana-okavango',
      'zimbabwe-victoria-falls',
      'zambia-victoria-falls',
      'tanzania-ngorongoro',
      'namibia-skeleton-coast',
    ],
    best_season: 'Year-round; visibility best in dry season',
    who_it_is_for: 'Photographers; those marking occasions; landscape enthusiasts',
    who_should_avoid: 'Budget-conscious travelers; those with motion sensitivity',
    physical_effort: 'low',
    risk_notes: 'Weather-dependent; noise impact considerations',
    trade_offs: {
      gains: 'Dramatic perspective; landscape comprehension; photography opportunities',
      losses: 'Significant cost; brief duration; weather dependent',
    },
    image_hint: 'Aerial view of Okavango Delta waterways from helicopter',
  },
  {
    id: 'fishing',
    name: 'Catch-and-Release Fishing',
    category: 'water',
    what_it_is:
      'Tiger fish or other species angling, typically from boat, catch-and-release policy standard.',
    where_possible: [
      'zambia-lower-zambezi',
      'zambia-kafue',
      'zimbabwe-zambezi',
      'zimbabwe-kariba',
      'tanzania-selous',
      'botswana-okavango',
    ],
    best_season: 'Varies by species; typically Sep-Nov for tiger fish',
    who_it_is_for: 'Anglers; those wanting non-game-drive activity',
    who_should_avoid: 'Those expecting to keep catch; pure wildlife-focused travelers',
    physical_effort: 'low',
    risk_notes: 'Sun exposure; requires patience',
    trade_offs: {
      gains: 'Activity variety; river time; relaxation',
      losses: 'Time away from wildlife viewing; success not guaranteed',
    },
    image_hint: 'Angler holding tiger fish on Zambezi River with spray from rapids behind',
  },
  {
    id: 'white-water-rafting',
    name: 'White Water Rafting',
    category: 'water',
    what_it_is:
      'Grade 3-5 rapids on the Nile River at Jinja or below Victoria Falls. Full-day or half-day expeditions with trained guides and safety kayakers.',
    where_possible: [
      'uganda-jinja',
      'zambia-victoria-falls',
      'zimbabwe-victoria-falls',
    ],
    best_season: 'Year-round at Jinja; best water levels Nov-Jan and Apr-Jun at Victoria Falls',
    who_it_is_for: 'Adventure seekers; those wanting adrenaline alongside safari; physically active travelers',
    who_should_avoid: 'Non-swimmers; those with back/neck issues; pregnant women; those seeking relaxation',
    physical_effort: 'high',
    risk_notes: 'Grade 5 rapids are serious; swims happen; reputable operators mandatory; age limits apply',
    trade_offs: {
      gains: 'World-class rapids; exhilarating experience; memorable adventure add-on',
      losses: 'Full day commitment; physically exhausting; some risk of injury; time away from wildlife',
    },
    image_hint: 'Rafting team navigating massive white water rapid on the Nile at Jinja Uganda',
  },
  {
    id: 'bungee-jumping',
    name: 'Bungee Jumping',
    category: 'specialty',
    what_it_is:
      'Freefall jump from bridge or platform, typically from Victoria Falls Bridge (111m) or Nile High Bungee at Jinja.',
    where_possible: [
      'uganda-jinja',
      'zambia-victoria-falls',
      'zimbabwe-victoria-falls',
      'south-africa-bloukrans',
    ],
    best_season: 'Year-round',
    who_it_is_for: 'Thrill-seekers; those marking milestones; adrenaline enthusiasts',
    who_should_avoid: 'Those with heart conditions; back/neck problems; fear of heights; pregnant women',
    physical_effort: 'low',
    risk_notes: 'Medical screening required; weight limits apply; reputable operators only',
    trade_offs: {
      gains: 'Unforgettable adrenaline rush; bragging rights; iconic African adventure',
      losses: 'Brief experience for high cost; genuine fear factor; not for everyone',
    },
    image_hint: 'Person mid-bungee jump from Victoria Falls Bridge with gorge and spray below',
  },
  {
    id: 'quad-biking',
    name: 'Quad Biking Safari',
    category: 'vehicle',
    what_it_is:
      'Self-driven ATV/quad bike excursions through bush, desert, or community lands. Ranges from 2-hour rides to full-day adventures.',
    where_possible: [
      'uganda-jinja',
      'namibia-sossusvlei',
      'namibia-swakopmund',
      'botswana-makgadikgadi',
      'south-africa',
      'zambia-victoria-falls',
    ],
    best_season: 'Year-round; dustier in dry season',
    who_it_is_for: 'Adventure travelers; those wanting hands-on experience; families with teens',
    who_should_avoid: 'Those with back problems; non-drivers; those seeking pure wildlife experience',
    physical_effort: 'medium',
    risk_notes: 'Dust and terrain hazards; helmets mandatory; brief training provided',
    trade_offs: {
      gains: 'Active exploration; access to remote areas; fun alternative to game drives',
      losses: 'Noise disturbs wildlife; dusty; less wildlife focus',
    },
    image_hint: 'Quad bikes crossing Makgadikgadi salt pans with dust trail at sunset',
  },
  {
    id: 'kayaking',
    name: 'Kayaking Safari',
    category: 'water',
    what_it_is:
      'Paddling sit-on-top or traditional kayaks on rivers, lakes, or calm waterways. Ranges from gentle paddles to multi-day expeditions.',
    where_possible: [
      'uganda-jinja',
      'zambia-lower-zambezi',
      'zimbabwe-zambezi',
      'botswana-okavango',
      'malawi-lake-malawi',
    ],
    best_season: 'Dry season for most; year-round at Jinja',
    who_it_is_for: 'Active travelers; those comfortable on water; birders seeking quiet approach',
    who_should_avoid: 'Non-swimmers; those uncomfortable in small craft; those with shoulder issues',
    physical_effort: 'medium-high',
    risk_notes: 'Hippo awareness critical on rivers; sun exposure; capsize possible',
    trade_offs: {
      gains: 'Silent approach to wildlife; active experience; unique perspective',
      losses: 'Physically demanding; limited gear capacity; weather exposure',
    },
    image_hint: 'Kayaker paddling past hippos on calm stretch of Zambezi River at dawn',
  },
  {
    id: 'zip-lining',
    name: 'Zip-lining / Canopy Tour',
    category: 'aerial',
    what_it_is:
      'Series of cable slides through forest canopy or across gorges, offering bird\'s-eye views and adrenaline.',
    where_possible: [
      'uganda-jinja',
      'zambia-victoria-falls',
      'zimbabwe-victoria-falls',
      'south-africa-tsitsikamma',
      'kenya-kereita',
    ],
    best_season: 'Year-round',
    who_it_is_for: 'Families with older children; adventure seekers; forest enthusiasts',
    who_should_avoid: 'Those with fear of heights; mobility limitations; weight restrictions apply',
    physical_effort: 'low',
    risk_notes: 'Safety equipment provided; weight limits enforced; brief training required',
    trade_offs: {
      gains: 'Unique canopy perspective; family-friendly adventure; safe thrills',
      losses: 'Brief experience; not wildlife-focused; can feel commercial',
    },
    image_hint: 'Person on zip-line gliding over Victoria Falls gorge with mist rising',
  },
  {
    id: 'mountain-biking',
    name: 'Mountain Biking',
    category: 'specialty',
    what_it_is:
      'Guided cycling through reserves, community lands, or scenic routes. Ranges from gentle rides to technical single-track.',
    where_possible: [
      'uganda-jinja',
      'kenya-hells-gate',
      'tanzania-ngorongoro-rim',
      'south-africa-cape',
      'rwanda-congo-nile-trail',
    ],
    best_season: 'Dry season preferred; some routes year-round',
    who_it_is_for: 'Cyclists; active travelers; those wanting exercise with scenery',
    who_should_avoid: 'Non-cyclists; those with balance issues; extreme heat sensitivity',
    physical_effort: 'high',
    risk_notes: 'Wildlife encounters possible in some areas; terrain varies; guides recommended',
    trade_offs: {
      gains: 'Active exploration; carbon-free transport; access to areas vehicles cannot reach',
      losses: 'Physically demanding; less wildlife observation time; weather dependent',
    },
    image_hint: 'Mountain bikers riding through Hell\'s Gate National Park with zebras in background',
  },
  {
    id: 'golden-monkey-tracking',
    name: 'Golden Monkey Tracking',
    category: 'foot',
    what_it_is:
      'Forest trek to locate habituated golden monkey troops in bamboo forests. Endemic to Virunga volcanic region.',
    where_possible: [
      'rwanda-volcanoes',
      'uganda-mgahinga',
    ],
    best_season: 'Year-round; drier months easier underfoot (Jun-Sep, Dec-Feb)',
    who_it_is_for: 'Primate enthusiasts; photographers; those doing gorilla trek wanting additional experience',
    who_should_avoid: 'Those with significant mobility issues; those only interested in great apes',
    physical_effort: 'medium',
    risk_notes: 'Altitude 2,500-3,000m; bamboo terrain can be slippery; 2-4 hour treks typical',
    trade_offs: {
      gains: 'Unique endemic species; playful subjects for photography; less strenuous than gorilla trek',
      losses: 'Less iconic than gorillas; monkeys move quickly through bamboo',
    },
    image_hint: 'Golden monkey with distinctive orange fur leaping through bamboo forest',
  },
  {
    id: 'bird-watching',
    name: 'Dedicated Birding Safari',
    category: 'specialty',
    what_it_is:
      'Specialized bird-focused excursions with expert ornithologist guides. Early starts, hides, and specific habitats targeted.',
    where_possible: [
      'uganda',
      'kenya',
      'tanzania',
      'botswana',
      'south-africa',
      'zambia',
      'zimbabwe',
      'namibia',
      'rwanda',
    ],
    best_season: 'Nov-Apr for migrants; year-round for residents',
    who_it_is_for: 'Birders; listers; photographers wanting avian subjects; nature enthusiasts',
    who_should_avoid: 'Those impatient with extended waits; pure Big Five focus',
    physical_effort: 'low',
    risk_notes: 'Early starts; patience required; specialist guides cost more',
    trade_offs: {
      gains: 'Expert identification; access to specialties; builds impressive species list',
      losses: 'Less mammal focus; requires patience; niche interest',
    },
    image_hint: 'Shoebill stork in papyrus swamp with birder photographing from distance',
  },
  {
    id: 'stand-up-paddleboarding',
    name: 'Stand-Up Paddleboarding',
    category: 'water',
    what_it_is:
      'SUP on calm rivers, lakes, or lagoons. Offers unique water-level perspective with more control than kayaking.',
    where_possible: [
      'uganda-jinja',
      'zambia-victoria-falls',
      'botswana-okavango',
      'malawi-lake-malawi',
      'kenya-coast',
    ],
    best_season: 'Year-round in calm water locations',
    who_it_is_for: 'Water sports enthusiasts; yoga practitioners; those wanting gentle activity',
    who_should_avoid: 'Non-swimmers; those with poor balance; areas with hippos/crocs',
    physical_effort: 'medium',
    risk_notes: 'Wildlife awareness essential; sun exposure; falling in is common for beginners',
    trade_offs: {
      gains: 'Core workout; peaceful experience; unique perspective',
      losses: 'Limited to safe waterways; capsizes common; not suited for wildlife-heavy waters',
    },
    image_hint: 'SUP paddler on calm Nile backwater at Jinja with lush green banks',
  },
  {
    id: 'source-of-nile',
    name: 'Source of the Nile Visit',
    category: 'specialty',
    what_it_is:
      'Visit to the point where the White Nile exits Lake Victoria at Jinja. Includes boat trip, historical context, and optional Nile cruise.',
    where_possible: ['uganda-jinja'],
    best_season: 'Year-round',
    who_it_is_for: 'History buffs; those interested in geography; travelers wanting context beyond wildlife',
    who_should_avoid: 'Those only interested in wildlife; very limited time travelers',
    physical_effort: 'low',
    risk_notes: 'Minimal; standard boat safety',
    trade_offs: {
      gains: 'Historical significance; pleasant boat ride; understanding of Nile system',
      losses: 'Brief activity; no wildlife focus; somewhat commercialized',
    },
    image_hint: 'Boat at Source of the Nile marker with Lake Victoria in background at Jinja',
  },
];

/**
 * Get activity by ID
 */
export function getActivityById(id: string): ActivityPrimitive | undefined {
  return activityPrimitives.find(a => a.id === id);
}

/**
 * Get activities by category
 */
export function getActivitiesByCategory(category: ActivityCategory): ActivityPrimitive[] {
  return activityPrimitives.filter(a => a.category === category);
}

/**
 * Get activities available in a specific region
 */
export function getActivitiesForRegion(region: string): ActivityPrimitive[] {
  const regionLower = region.toLowerCase();
  return activityPrimitives.filter(a =>
    a.where_possible.some(
      w => w.toLowerCase().includes(regionLower) || regionLower.includes(w.toLowerCase())
    )
  );
}

/**
 * Get all activity IDs
 */
export function getAllActivityIds(): string[] {
  return activityPrimitives.map(a => a.id);
}

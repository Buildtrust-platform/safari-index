/**
 * Safari Itineraries - Production-Ready Itinerary Definitions
 *
 * 15 core itineraries covering major safari destinations.
 * Each itinerary:
 * - Maps to existing trip shapes where applicable
 * - Uses existing destination and activity primitives
 * - Is reusable across variants
 * - Maintains documentary, operator-grade tone
 *
 * Per governance:
 * - No hype words, emojis, or exclamation marks
 * - No hardcoded lodges or hotel names
 * - No booking or payment logic
 * - No pricing (cost bands only)
 */

import type { Itinerary, ItinerarySummary, ItineraryInquiryPrefill } from './types';

/**
 * Core Itinerary Definitions
 */
export const itineraries: Itinerary[] = [
  // ============================================================
  // TANZANIA (3 itineraries)
  // ============================================================
  {
    id: 'tanzania-classic-northern',
    slug: 'tanzania-classic-northern-circuit',
    title: 'Tanzania Classic Northern Circuit',
    subtitle: 'The quintessential East African safari through Serengeti and Ngorongoro',
    region: 'tanzania',
    secondary_regions: ['east-africa'],
    route_summary: 'Arusha → Tarangire → Serengeti → Ngorongoro → Arusha',
    duration_band: { min_days: 7, max_days: 10, typical_days: 8 },
    style_tags: ['first-safari', 'family'],
    traveler_fit: ['first-safari', 'family', 'wildlife-focused'],
    comfort_tier: 'mid',
    core_segments: [
      {
        id: 'tarangire-segment',
        order: 1,
        title: 'Tarangire National Park',
        location: 'Tarangire',
        region: 'tanzania',
        nights: 2,
        description: 'Ancient baobab trees and large elephant herds set the tone for your safari.',
        highlights: [
          'Iconic baobab-studded landscape',
          'One of Africa\'s highest elephant concentrations',
          'Tree-climbing lions occasionally spotted',
        ],
        activities_available: ['game-drive', 'walking-safari', 'bird-watching'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Wake-up call and light breakfast',
          morning: 'Extended game drive through the park',
          midday: 'Lunch at camp, rest during peak heat',
          afternoon: 'Afternoon game drive or walking safari',
          evening: 'Sundowners and dinner under the stars',
        },
        transfers: {
          arrival: '3-hour drive from Arusha or 45-minute charter flight',
          departure: '4-hour drive to Serengeti or 1-hour charter flight',
        },
      },
      {
        id: 'serengeti-segment',
        order: 2,
        title: 'Serengeti National Park',
        location: 'Central/South Serengeti',
        region: 'tanzania',
        nights: [3, 4],
        description: 'Endless plains teeming with predators and prey in Africa\'s most celebrated park.',
        highlights: [
          'Big cat encounters on the open plains',
          'Wildebeest and zebra herds',
          'Kopje rock formations with resident wildlife',
        ],
        activities_available: ['game-drive', 'hot-air-balloon', 'walking-safari', 'night-drive'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Optional hot air balloon (seasonal)',
          morning: 'Full morning game drive',
          midday: 'Bush lunch or return to camp',
          afternoon: 'Afternoon game drive towards kopjes',
          evening: 'Sundowner on the plains, starlit dinner',
        },
        transfers: {
          arrival: '4-hour drive from Tarangire or 1-hour charter flight',
          departure: '3-hour drive to Ngorongoro rim',
        },
      },
      {
        id: 'ngorongoro-segment',
        order: 3,
        title: 'Ngorongoro Crater',
        location: 'Ngorongoro Conservation Area',
        region: 'tanzania',
        nights: 2,
        description: 'A full day exploring the world\'s largest intact volcanic caldera.',
        highlights: [
          'Dense concentration of wildlife in the crater floor',
          'Good chance of seeing black rhino',
          'Dramatic crater rim views',
        ],
        activities_available: ['game-drive', 'cultural-visit', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          morning: 'Early descent into crater, game drive on floor',
          midday: 'Picnic lunch by hippo pools',
          afternoon: 'Continue crater exploration, ascend before dusk',
          evening: 'Dinner with crater rim views',
        },
        transfers: {
          arrival: '3-hour drive from Serengeti',
          departure: '3-hour drive to Arusha, or connect to Zanzibar',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['mid-range', 'premium', 'ultra-premium'],
      travel_modes: ['drive', 'fly', 'mixed'],
      extensions: [
        {
          id: 'zanzibar-beach',
          name: 'Zanzibar Beach Extension',
          description: 'Add 3-5 nights on Zanzibar\'s pristine beaches',
          adds_days: 4,
          adds_cost_estimate: { low: 1500, high: 3500 },
          type: 'beach',
        },
        {
          id: 'lake-manyara',
          name: 'Lake Manyara Addition',
          description: 'One night at Lake Manyara for tree-climbing lions',
          adds_days: 1,
          adds_cost_estimate: { low: 400, high: 800 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari', 'bird-watching'],
    optional_activities: ['hot-air-balloon', 'night-drive', 'cultural-visit'],
    linked_decisions: [
      'first-timer-ready',
      'tz-dry-season',
      'serengeti-vs-mara',
      'ngorongoro-worth',
      'lodge-vs-tented',
      'ideal-length',
    ],
    cost_band: { low: 6000, high: 10000, note: 'Excluding international flights' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [6, 7, 8, 9, 10],
        description: 'Peak wildlife viewing, easier game drives, cooler temperatures',
        is_peak: true,
      },
      {
        name: 'Green Season',
        months: [1, 2, 3, 11, 12],
        description: 'Calving season (Jan-Feb), fewer visitors, lush landscapes',
        is_peak: false,
      },
    ],
    trade_offs: [
      { gain: 'Iconic destinations with reliable Big Five viewing', cost: 'Higher visitor density at popular sites' },
      { gain: 'Well-established infrastructure and logistics', cost: 'Less sense of wilderness remoteness' },
      { gain: 'Suitable for first-time safari travelers', cost: 'Premium pricing during peak season' },
      { gain: 'Diverse landscapes from plains to crater', cost: 'Significant driving between parks if not flying' },
    ],
    who_this_is_for: 'First-time safari travelers seeking the quintessential East African experience, families wanting reliable wildlife encounters, and anyone drawn to the Serengeti name.',
    who_this_is_not_for: 'Repeat visitors seeking off-grid experiences, travelers prioritizing solitude over iconic destinations, or those with very limited budgets.',
    hero_image_hint: 'Serengeti plains with wildebeest and acacia trees',
    meta_description: 'Classic Tanzania safari through Tarangire, Serengeti, and Ngorongoro Crater. 7-10 days of iconic East African wildlife in the world\'s most celebrated parks.',
    linked_trip_shape_id: 'classic-serengeti-ngorongoro',
    is_featured: true,
    is_published: true,
  },

  {
    id: 'tanzania-migration-focused',
    slug: 'tanzania-great-migration',
    title: 'Tanzania Great Migration Safari',
    subtitle: 'Following the wildebeest across the Serengeti',
    region: 'tanzania',
    secondary_regions: ['east-africa'],
    route_summary: 'Arusha → Southern/Central Serengeti → Northern Serengeti → Arusha',
    duration_band: { min_days: 8, max_days: 12, typical_days: 10 },
    style_tags: ['migration', 'photography', 'luxury'],
    traveler_fit: ['wildlife-focused', 'photography', 'repeat-visitor'],
    comfort_tier: 'luxury',
    core_segments: [
      {
        id: 'southern-serengeti',
        order: 1,
        title: 'Southern Serengeti Plains',
        location: 'Ndutu / Southern Serengeti',
        region: 'tanzania',
        nights: [3, 4],
        description: 'Witness calving season on the short-grass plains where life begins.',
        highlights: [
          'Calving season drama (December-March)',
          'Predator-prey interactions at their peak',
          'Mobile camps following the herds',
        ],
        activities_available: ['game-drive', 'walking-safari', 'hot-air-balloon'],
        accommodation_archetype: 'mobile-tented-camp',
        typical_day: {
          dawn: 'Pre-dawn departure to witness births and predator activity',
          morning: 'Extended game drive among the herds',
          midday: 'Bush lunch near the action',
          afternoon: 'Continue following the migration',
          evening: 'Sundowners overlooking the plains',
        },
        transfers: {
          arrival: '6-hour drive from Arusha or 1.5-hour charter flight',
          departure: '4-hour drive or 45-minute flight to Northern Serengeti',
        },
      },
      {
        id: 'northern-serengeti',
        order: 2,
        title: 'Northern Serengeti',
        location: 'Kogatende / Mara River',
        region: 'tanzania',
        nights: [4, 5],
        description: 'The famous Mara River crossings draw spectators from around the world.',
        highlights: [
          'Dramatic river crossings (July-October)',
          'Crocodile ambush zones',
          'Lower visitor density than Masai Mara side',
        ],
        activities_available: ['game-drive', 'walking-safari', 'hot-air-balloon'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Early departure to positioning near crossing points',
          morning: 'Wait and watch for crossing activity',
          midday: 'Bush lunch, continue watching',
          afternoon: 'Explore beyond the river for big cats',
          evening: 'Return to camp for dinner',
        },
        transfers: {
          arrival: '4-hour drive or 45-minute flight from Southern Serengeti',
          departure: '2-hour flight to Arusha',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['premium', 'ultra-premium'],
      travel_modes: ['fly', 'mixed'],
      extensions: [
        {
          id: 'ngorongoro-add',
          name: 'Ngorongoro Crater Day',
          description: 'Add a crater descent on your way back',
          adds_days: 2,
          adds_cost_estimate: { low: 1200, high: 2500 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari'],
    optional_activities: ['hot-air-balloon'],
    linked_decisions: [
      'migration-timing',
      'river-crossings',
      'calving-season',
      'booking-lead-time',
      'luxury-worth',
    ],
    cost_band: { low: 12000, high: 20000, note: 'Excluding international flights' },
    best_season_windows: [
      {
        name: 'Calving Season',
        months: [1, 2],
        description: 'Southern Serengeti calving, high predator activity',
        is_peak: true,
      },
      {
        name: 'River Crossings',
        months: [7, 8, 9],
        description: 'Northern Serengeti crossings at Mara River',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Witnessing one of nature\'s greatest spectacles', cost: 'Requires flexibility as migration timing shifts' },
      { gain: 'Mobile camps position you with the herds', cost: 'Higher cost for remote logistics' },
      { gain: 'Photography opportunities unmatched elsewhere', cost: 'May involve internal flights and long drives' },
    ],
    who_this_is_for: 'Travelers specifically seeking the migration experience, serious wildlife photographers, and repeat visitors ready to invest in positioning.',
    who_this_is_not_for: 'First-timers wanting guaranteed Big Five variety, budget-conscious travelers, or those uncomfortable with remote camps.',
    hero_image_hint: 'Wildebeest crossing Mara River',
    meta_description: 'Follow the Great Migration across Tanzania\'s Serengeti. 8-12 days witnessing calving season and dramatic river crossings.',
    linked_trip_shape_id: 'migration-focused-serengeti',
    is_featured: true,
    is_published: true,
  },

  {
    id: 'tanzania-southern-wilderness',
    slug: 'tanzania-southern-circuit',
    title: 'Tanzania Southern Wilderness',
    subtitle: 'Remote parks beyond the crowds',
    region: 'tanzania',
    secondary_regions: ['east-africa'],
    route_summary: 'Dar es Salaam → Selous/Nyerere → Ruaha → Dar es Salaam',
    duration_band: { min_days: 9, max_days: 14, typical_days: 11 },
    style_tags: ['adventure', 'walking', 'luxury'],
    traveler_fit: ['repeat-visitor', 'adventure', 'photography'],
    comfort_tier: 'luxury',
    core_segments: [
      {
        id: 'nyerere-segment',
        order: 1,
        title: 'Nyerere National Park (Selous)',
        location: 'Northern Selous',
        region: 'tanzania',
        nights: [4, 5],
        description: 'Africa\'s largest protected area offers boat safaris and walking among wildlife.',
        highlights: [
          'Boat safaris on the Rufiji River',
          'Walking safaris with armed rangers',
          'Wild dog populations',
        ],
        activities_available: ['game-drive', 'boat-safari', 'walking-safari', 'fly-camping'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Walking safari departure',
          morning: 'Boat safari on the Rufiji',
          midday: 'Lunch and rest at camp',
          afternoon: 'Game drive through diverse habitats',
          evening: 'Dinner overlooking the river',
        },
        transfers: {
          arrival: '45-minute charter flight from Dar es Salaam',
          departure: '1-hour charter flight to Ruaha',
        },
      },
      {
        id: 'ruaha-segment',
        order: 2,
        title: 'Ruaha National Park',
        location: 'Ruaha',
        region: 'tanzania',
        nights: [4, 5],
        description: 'Tanzania\'s largest national park with exceptional lion and elephant populations.',
        highlights: [
          'Large lion prides adapted to baobab-studded terrain',
          'Elephant herds in the Great Ruaha River',
          'Genuine sense of wilderness remoteness',
        ],
        activities_available: ['game-drive', 'walking-safari', 'fly-camping', 'night-drive'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Early game drive to river areas',
          morning: 'Continue exploring, look for predators',
          midday: 'Rest at camp during heat',
          afternoon: 'Walking safari or extended game drive',
          evening: 'Night drive for nocturnal species',
        },
        transfers: {
          arrival: '1-hour charter flight from Selous',
          departure: '2-hour charter flight to Dar es Salaam',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['premium', 'ultra-premium'],
      travel_modes: ['fly'],
      extensions: [
        {
          id: 'katavi-add',
          name: 'Katavi National Park',
          description: 'Add Tanzania\'s most remote park',
          adds_days: 3,
          adds_cost_estimate: { low: 3000, high: 5000 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari', 'boat-safari'],
    optional_activities: ['fly-camping', 'night-drive'],
    linked_decisions: ['walking-safari', 'off-beaten-path', 'fly-vs-drive', 'ideal-length'],
    cost_band: { low: 10000, high: 18000, note: 'Excluding international flights, includes charter flights' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [6, 7, 8, 9, 10],
        description: 'Wildlife concentrates around water, best game viewing',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Genuine wilderness without tourist crowds', cost: 'Limited infrastructure and accommodation options' },
      { gain: 'Walking safaris and boat safaris standard', cost: 'Requires charter flights, increasing cost' },
      { gain: 'Exceptional predator sightings in Ruaha', cost: 'Less predictable than northern circuit' },
    ],
    who_this_is_for: 'Experienced safari travelers seeking authentic wilderness, walking safari enthusiasts, and those who value solitude over famous names.',
    who_this_is_not_for: 'First-time visitors wanting guaranteed icons, budget travelers, or those uncomfortable with small aircraft.',
    hero_image_hint: 'Ruaha baobab landscape with elephants',
    meta_description: 'Explore Tanzania\'s remote southern wilderness. 9-14 days in Selous and Ruaha with walking safaris, boat excursions, and genuine solitude.',
    linked_trip_shape_id: 'tanzania-southern-circuit',
    is_featured: false,
    is_published: true,
  },

  // ============================================================
  // KENYA (2 itineraries)
  // ============================================================
  {
    id: 'kenya-classic-circuit',
    slug: 'kenya-classic-safari',
    title: 'Kenya Classic Safari',
    subtitle: 'Masai Mara and the Rift Valley highlights',
    region: 'kenya',
    secondary_regions: ['east-africa'],
    route_summary: 'Nairobi → Amboseli → Lake Nakuru → Masai Mara → Nairobi',
    duration_band: { min_days: 7, max_days: 10, typical_days: 8 },
    style_tags: ['first-safari', 'family'],
    traveler_fit: ['first-safari', 'family', 'wildlife-focused'],
    comfort_tier: 'mid',
    core_segments: [
      {
        id: 'amboseli-segment',
        order: 1,
        title: 'Amboseli National Park',
        location: 'Amboseli',
        region: 'kenya',
        nights: 2,
        description: 'Elephant herds against the backdrop of Mount Kilimanjaro.',
        highlights: [
          'Kilimanjaro views on clear mornings',
          'Large elephant families',
          'Wetland habitats with birdlife',
        ],
        activities_available: ['game-drive', 'bird-watching', 'cultural-visit'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Early game drive for Kilimanjaro views',
          morning: 'Continue exploring elephant territory',
          midday: 'Lunch at lodge, rest',
          afternoon: 'Sunset game drive to the swamps',
          evening: 'Dinner with mountain views',
        },
        transfers: {
          arrival: '4-hour drive from Nairobi',
          departure: '5-hour drive to Lake Nakuru',
        },
      },
      {
        id: 'nakuru-segment',
        order: 2,
        title: 'Lake Nakuru National Park',
        location: 'Lake Nakuru',
        region: 'kenya',
        nights: 1,
        description: 'Rhino sanctuary and flamingo-covered alkaline lake.',
        highlights: [
          'Reliable rhino sightings',
          'Flamingo spectacle (seasonal)',
          'Compact park with easy game viewing',
        ],
        activities_available: ['game-drive', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          morning: 'Game drive around the lake shore',
          midday: 'Lunch overlooking the lake',
          afternoon: 'Search for rhinos in the woodlands',
          evening: 'Transfer or overnight',
        },
        transfers: {
          arrival: '5-hour drive from Amboseli',
          departure: '5-hour drive to Masai Mara or 45-minute flight',
        },
      },
      {
        id: 'mara-segment',
        order: 3,
        title: 'Masai Mara National Reserve',
        location: 'Masai Mara',
        region: 'kenya',
        nights: [3, 4],
        description: 'Kenya\'s premier wildlife destination with year-round game viewing.',
        highlights: [
          'Big cat territory of the Mara',
          'Great Migration crossings (July-October)',
          'Maasai cultural interactions',
        ],
        activities_available: ['game-drive', 'hot-air-balloon', 'walking-safari', 'night-drive', 'cultural-visit'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Optional balloon safari',
          morning: 'Extended game drive',
          midday: 'Bush lunch or return to camp',
          afternoon: 'Afternoon game drive',
          evening: 'Sundowners and dinner',
        },
        transfers: {
          arrival: '5-hour drive from Nakuru or 45-minute flight',
          departure: '1-hour flight to Nairobi or 6-hour drive',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['mid-range', 'premium', 'ultra-premium'],
      travel_modes: ['drive', 'fly', 'mixed'],
      extensions: [
        {
          id: 'diani-beach',
          name: 'Diani Beach Extension',
          description: 'Add 3-5 nights on Kenya\'s coast',
          adds_days: 4,
          adds_cost_estimate: { low: 1200, high: 3000 },
          type: 'beach',
        },
        {
          id: 'samburu-add',
          name: 'Samburu National Reserve',
          description: 'Add unique northern species',
          adds_days: 2,
          adds_cost_estimate: { low: 1000, high: 2000 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'bird-watching'],
    optional_activities: ['hot-air-balloon', 'walking-safari', 'night-drive', 'cultural-visit'],
    linked_decisions: [
      'first-timer-ready',
      'ke-aug',
      'serengeti-vs-mara',
      'tz-vs-ke',
      'ideal-length',
    ],
    cost_band: { low: 5000, high: 9000, note: 'Excluding international flights' },
    best_season_windows: [
      {
        name: 'Migration Season',
        months: [7, 8, 9, 10],
        description: 'Wildebeest crossings in the Mara',
        is_peak: true,
      },
      {
        name: 'Dry Season',
        months: [1, 2],
        description: 'Good game viewing, fewer visitors than July-October',
        is_peak: false,
      },
    ],
    trade_offs: [
      { gain: 'Varied Kenyan landscapes from savannah to lakes', cost: 'Multiple parks mean more driving' },
      { gain: 'Well-established tourism infrastructure', cost: 'Masai Mara can feel crowded at peak times' },
      { gain: 'Good value compared to Tanzania equivalent', cost: 'Less exclusive than conservancy-only options' },
    ],
    who_this_is_for: 'First-time visitors wanting Kenya\'s greatest hits, families seeking variety, and travelers choosing Kenya over Tanzania for value or preference.',
    who_this_is_not_for: 'Those seeking solitude, repeat visitors wanting off-grid experiences, or migration-focused travelers who should consider conservancies.',
    hero_image_hint: 'Elephants with Kilimanjaro backdrop in Amboseli',
    meta_description: 'Classic Kenya safari covering Amboseli, Lake Nakuru, and Masai Mara. 7-10 days of iconic Kenyan wildlife and landscapes.',
    linked_trip_shape_id: 'classic-kenya-safari',
    is_featured: true,
    is_published: true,
  },

  {
    id: 'kenya-conservancy-experience',
    slug: 'kenya-private-conservancies',
    title: 'Kenya Private Conservancies',
    subtitle: 'Exclusive reserves and community partnerships',
    region: 'kenya',
    secondary_regions: ['east-africa'],
    route_summary: 'Nairobi → Laikipia Plateau → Mara Conservancies → Nairobi',
    duration_band: { min_days: 6, max_days: 9, typical_days: 7 },
    style_tags: ['luxury', 'honeymoon', 'photography'],
    traveler_fit: ['honeymoon', 'photography', 'repeat-visitor'],
    comfort_tier: 'luxury',
    core_segments: [
      {
        id: 'laikipia-segment',
        order: 1,
        title: 'Laikipia Plateau',
        location: 'Lewa / Ol Pejeta / Borana',
        region: 'kenya',
        nights: [3, 4],
        description: 'Private conservancies with endangered species and walking safaris.',
        highlights: [
          'Black and white rhino tracking',
          'Walking safaris standard',
          'Chimpanzee sanctuary at Ol Pejeta',
        ],
        activities_available: ['game-drive', 'walking-safari', 'night-drive', 'horseback-safari', 'bird-watching'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Walking safari departure',
          morning: 'Rhino tracking on foot',
          midday: 'Lunch at camp',
          afternoon: 'Game drive or horseback safari',
          evening: 'Night drive for nocturnal species',
        },
        transfers: {
          arrival: '45-minute charter flight from Nairobi or 5-hour drive',
          departure: '1-hour charter flight to Mara',
        },
      },
      {
        id: 'mara-conservancy-segment',
        order: 2,
        title: 'Mara Conservancies',
        location: 'Olare Motorogi / Naboisho / Mara North',
        region: 'kenya',
        nights: [3, 4],
        description: 'Private reserves bordering the Mara with exclusive access and activities.',
        highlights: [
          'Off-road driving permitted',
          'Night drives and walking safaris',
          'Low vehicle density',
        ],
        activities_available: ['game-drive', 'walking-safari', 'night-drive', 'hot-air-balloon', 'cultural-visit'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Optional balloon safari',
          morning: 'Extended off-road game drive',
          midday: 'Bush lunch',
          afternoon: 'Walking safari with Maasai guides',
          evening: 'Sundowner and night drive',
        },
        transfers: {
          arrival: '1-hour charter flight from Laikipia',
          departure: '1-hour flight to Nairobi',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['premium', 'ultra-premium'],
      travel_modes: ['fly'],
      extensions: [
        {
          id: 'mombasa-beach',
          name: 'Coastal Beach Extension',
          description: 'Add 3-4 nights on Kenya\'s coast',
          adds_days: 4,
          adds_cost_estimate: { low: 1500, high: 4000 },
          type: 'beach',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari', 'night-drive'],
    optional_activities: ['hot-air-balloon', 'horseback-safari', 'cultural-visit'],
    linked_decisions: [
      'luxury-worth',
      'private-vs-shared',
      'night-drives',
      'walking-safari',
      'inside-vs-outside',
    ],
    cost_band: { low: 8000, high: 15000, note: 'Excluding international flights' },
    best_season_windows: [
      {
        name: 'Migration Season',
        months: [7, 8, 9, 10],
        description: 'Migration in conservancies with fewer crowds than reserve',
        is_peak: true,
      },
      {
        name: 'Dry Season',
        months: [1, 2],
        description: 'Excellent game viewing, lower rates',
        is_peak: false,
      },
    ],
    trade_offs: [
      { gain: 'Exclusive access with off-road driving and night drives', cost: 'Higher nightly rates than national reserve' },
      { gain: 'Walking safaris and genuine bush experience', cost: 'May miss reserve\'s signature viewpoints' },
      { gain: 'Supports community conservation partnerships', cost: 'Fewer total parks visited' },
    ],
    who_this_is_for: 'Travelers prioritizing exclusivity and activities, honeymooners, photographers, and those returning to Kenya for a deeper experience.',
    who_this_is_not_for: 'Budget-conscious travelers, first-timers wanting maximum park variety, or those specifically wanting to visit the national reserve.',
    hero_image_hint: 'Lion in golden Mara grass at sunset',
    meta_description: 'Kenya private conservancy safari through Laikipia and Mara. 6-9 days of exclusive access, walking safaris, and night drives.',
    linked_trip_shape_id: 'kenya-conservancy-focused',
    is_featured: false,
    is_published: true,
  },

  // ============================================================
  // BOTSWANA (2 itineraries)
  // ============================================================
  {
    id: 'botswana-okavango-immersion',
    slug: 'botswana-okavango-delta',
    title: 'Okavango Delta Immersion',
    subtitle: 'Water-based safari in the inland delta',
    region: 'botswana',
    secondary_regions: ['southern-africa'],
    route_summary: 'Maun → Okavango Delta (2-3 camps) → Maun',
    duration_band: { min_days: 5, max_days: 8, typical_days: 6 },
    style_tags: ['luxury', 'honeymoon', 'adventure'],
    traveler_fit: ['honeymoon', 'photography', 'repeat-visitor', 'adventure'],
    comfort_tier: 'luxury',
    core_segments: [
      {
        id: 'delta-water-segment',
        order: 1,
        title: 'Okavango Delta Water Camps',
        location: 'Chief\'s Island / Jao Concession',
        region: 'botswana',
        nights: [3, 4],
        description: 'Water-focused camps offering mokoro, boat safaris, and island game drives.',
        highlights: [
          'Mokoro (dugout canoe) excursions',
          'Boat safaris through papyrus channels',
          'Island game drives for big cats',
        ],
        activities_available: ['mokoro', 'boat-safari', 'game-drive', 'walking-safari', 'bird-watching'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Early mokoro excursion',
          morning: 'Walking safari on islands',
          midday: 'Lunch and siesta',
          afternoon: 'Boat safari or game drive',
          evening: 'Sundowner on the water',
        },
        transfers: {
          arrival: '30-minute charter flight from Maun',
          departure: '30-minute flight to land-based camp or Maun',
        },
      },
      {
        id: 'delta-land-segment',
        order: 2,
        title: 'Moremi Game Reserve',
        location: 'Moremi / Khwai',
        region: 'botswana',
        nights: [2, 3],
        description: 'Land-based game viewing in the delta\'s premier wildlife area.',
        highlights: [
          'Excellent predator sightings',
          'Mixed habitats from floodplain to mopane',
          'Wild dog territory',
        ],
        activities_available: ['game-drive', 'walking-safari', 'mokoro', 'night-drive'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Game drive departure',
          morning: 'Extended game drive',
          midday: 'Lunch at camp',
          afternoon: 'Walking safari or game drive',
          evening: 'Night drive',
        },
        transfers: {
          arrival: '30-minute charter flight from water camp',
          departure: '40-minute flight to Maun',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['premium', 'ultra-premium'],
      travel_modes: ['fly'],
      extensions: [
        {
          id: 'chobe-add',
          name: 'Chobe National Park',
          description: 'Add elephant herds along the Chobe River',
          adds_days: 2,
          adds_cost_estimate: { low: 2000, high: 4000 },
          type: 'side-trip',
        },
        {
          id: 'victoria-falls-add',
          name: 'Victoria Falls',
          description: 'Add the iconic falls as a bookend',
          adds_days: 2,
          adds_cost_estimate: { low: 800, high: 1500 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['mokoro', 'boat-safari', 'game-drive', 'walking-safari'],
    optional_activities: ['night-drive', 'bird-watching'],
    linked_decisions: ['okavango-worth', 'bw-jun', 'bw-peak-flood', 'mokoro-canoe', 'luxury-worth'],
    cost_band: { low: 10000, high: 18000, note: 'Excluding international flights, includes charter flights' },
    best_season_windows: [
      {
        name: 'Peak Flood Season',
        months: [6, 7, 8, 9],
        description: 'Highest water levels, best for water activities',
        is_peak: true,
      },
      {
        name: 'Dry Season',
        months: [9, 10],
        description: 'Wildlife concentrates, water receding',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Unique water-based safari experience', cost: 'Very high cost for fly-in camps' },
      { gain: 'Pristine wilderness with low-impact tourism', cost: 'Water levels vary seasonally' },
      { gain: 'Mokoro and boat safaris unavailable elsewhere', cost: 'Less game density than dry-land parks' },
    ],
    who_this_is_for: 'Travelers seeking unique water-based experiences, honeymooners wanting romance, photographers drawn to delta light, and those with budget for Botswana\'s premium positioning.',
    who_this_is_not_for: 'Budget travelers, those prioritizing maximum game density, or first-timers who should consider East Africa first.',
    hero_image_hint: 'Mokoro gliding through Okavango Delta papyrus',
    meta_description: 'Okavango Delta immersion safari. 5-8 days of mokoro excursions, boat safaris, and island game drives in Botswana\'s pristine wilderness.',
    linked_trip_shape_id: 'okavango-delta-immersion',
    is_featured: true,
    is_published: true,
  },

  {
    id: 'botswana-diverse-ecosystems',
    slug: 'botswana-delta-desert-pans',
    title: 'Botswana Delta, Desert, and Pans',
    subtitle: 'From flooded delta to salt pan moonscapes',
    region: 'botswana',
    secondary_regions: ['southern-africa'],
    route_summary: 'Maun → Okavango → Makgadikgadi Pans → Central Kalahari → Maun',
    duration_band: { min_days: 10, max_days: 14, typical_days: 12 },
    style_tags: ['adventure', 'photography', 'luxury'],
    traveler_fit: ['adventure', 'photography', 'repeat-visitor'],
    comfort_tier: 'luxury',
    core_segments: [
      {
        id: 'okavango-brief',
        order: 1,
        title: 'Okavango Delta',
        location: 'Okavango Delta',
        region: 'botswana',
        nights: [3, 4],
        description: 'Water and land experiences in the delta before heading to arid landscapes.',
        highlights: [
          'Mokoro and boat safaris',
          'Island game drives',
          'Delta birdlife',
        ],
        activities_available: ['mokoro', 'boat-safari', 'game-drive', 'walking-safari'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Mokoro excursion',
          morning: 'Walking or game drive',
          midday: 'Rest',
          afternoon: 'Boat safari',
          evening: 'Sundowner',
        },
        transfers: {
          arrival: '30-minute flight from Maun',
          departure: '1-hour flight to Makgadikgadi',
        },
      },
      {
        id: 'makgadikgadi-segment',
        order: 2,
        title: 'Makgadikgadi Pans',
        location: 'Makgadikgadi',
        region: 'botswana',
        nights: [2, 3],
        description: 'Ancient salt pans with meerkat colonies and stark lunar landscapes.',
        highlights: [
          'Meerkat habituation experiences',
          'Quad biking on the pans',
          'Flamingo gatherings (seasonal)',
        ],
        activities_available: ['game-drive', 'walking-safari', 'quad-biking', 'bird-watching'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Meerkat viewing',
          morning: 'Quad biking on pans',
          midday: 'Lunch at camp',
          afternoon: 'Game drive for zebra migration (seasonal)',
          evening: 'Sleep-out on the pans (optional)',
        },
        transfers: {
          arrival: '1-hour flight from Okavango',
          departure: '1.5-hour flight to Central Kalahari',
        },
      },
      {
        id: 'kalahari-segment',
        order: 3,
        title: 'Central Kalahari Game Reserve',
        location: 'Central Kalahari',
        region: 'botswana',
        nights: [3, 4],
        description: 'Vast desert reserve with black-maned lions and San Bushman heritage.',
        highlights: [
          'Black-maned Kalahari lions',
          'Cheetah and brown hyena',
          'San cultural interactions',
        ],
        activities_available: ['game-drive', 'walking-safari', 'cultural-visit', 'night-drive'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          dawn: 'Game drive for lions',
          morning: 'Extended desert exploration',
          midday: 'Lunch, rest during heat',
          afternoon: 'San walking with trackers',
          evening: 'Night drive for nocturnal species',
        },
        transfers: {
          arrival: '1.5-hour flight from Makgadikgadi',
          departure: '1.5-hour flight to Maun',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['premium', 'ultra-premium'],
      travel_modes: ['fly'],
      extensions: [
        {
          id: 'chobe-extension',
          name: 'Chobe River Addition',
          description: 'Add elephant herds and river safaris',
          adds_days: 2,
          adds_cost_estimate: { low: 2000, high: 4000 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['mokoro', 'boat-safari', 'game-drive', 'walking-safari', 'quad-biking'],
    optional_activities: ['night-drive', 'cultural-visit'],
    linked_decisions: [
      'okavango-worth',
      'tz-vs-bw',
      'ideal-length',
      'fly-vs-drive',
      'splurge-allocation',
    ],
    cost_band: { low: 15000, high: 25000, note: 'Excluding international flights, includes charter flights' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [5, 6, 7, 8, 9, 10],
        description: 'Best for all ecosystems, delta flooded early, pans dry',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Extraordinary landscape diversity in one country', cost: 'Multiple charter flights significantly increase cost' },
      { gain: 'Experiences unavailable in any single park', cost: 'Less depth at each location' },
      { gain: 'Photography opportunities across varied terrain', cost: 'Long itinerary needed to do it justice' },
    ],
    who_this_is_for: 'Experienced travelers wanting Botswana\'s full range, photographers seeking variety, and those with time and budget for a comprehensive journey.',
    who_this_is_not_for: 'First-timers, budget travelers, or those with limited time who should focus on delta only.',
    hero_image_hint: 'Salt pan expanse at sunset',
    meta_description: 'Botswana safari spanning Okavango Delta, Makgadikgadi Pans, and Central Kalahari. 10-14 days across water, salt, and desert.',
    linked_trip_shape_id: 'botswana-diverse-ecosystems',
    is_featured: false,
    is_published: true,
  },

  // ============================================================
  // UGANDA/RWANDA (2 itineraries)
  // ============================================================
  {
    id: 'rwanda-gorilla-focused',
    slug: 'rwanda-gorilla-trek',
    title: 'Rwanda Gorilla Trek',
    subtitle: 'Mountain gorillas in the Virunga Volcanoes',
    region: 'uganda-rwanda',
    secondary_regions: [],
    route_summary: 'Kigali → Volcanoes National Park → Kigali',
    duration_band: { min_days: 4, max_days: 6, typical_days: 5 },
    style_tags: ['primate', 'adventure', 'luxury'],
    traveler_fit: ['adventure', 'wildlife-focused', 'photography'],
    comfort_tier: 'luxury',
    core_segments: [
      {
        id: 'kigali-segment',
        order: 1,
        title: 'Kigali',
        location: 'Kigali',
        region: 'uganda-rwanda',
        nights: 1,
        description: 'Rwanda\'s capital offers cultural context before the trek.',
        highlights: [
          'Genocide Memorial visit',
          'Local markets and restaurants',
          'Clean, efficient city experience',
        ],
        activities_available: ['cultural-visit'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          morning: 'Arrival and rest',
          midday: 'Lunch in Kigali',
          afternoon: 'Genocide Memorial visit',
          evening: 'Dinner in Kigali',
        },
        transfers: {
          arrival: 'International flight to Kigali',
          departure: '2.5-hour drive to Volcanoes NP',
        },
      },
      {
        id: 'volcanoes-segment',
        order: 2,
        title: 'Volcanoes National Park',
        location: 'Musanze / Volcanoes NP',
        region: 'uganda-rwanda',
        nights: [2, 3],
        description: 'Home to mountain gorillas on the slopes of the Virunga Volcanoes.',
        highlights: [
          'Mountain gorilla trekking (1 hour with family)',
          'Possible second trek or golden monkey tracking',
          'Dian Fossey\'s grave hike',
        ],
        activities_available: ['gorilla-trekking', 'chimp-tracking', 'walking-safari', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Early breakfast',
          morning: 'Gorilla trek (2-6 hours depending on group location)',
          midday: '1 hour with gorilla family',
          afternoon: 'Return trek, rest at lodge',
          evening: 'Celebratory dinner',
        },
        transfers: {
          arrival: '2.5-hour drive from Kigali',
          departure: '2.5-hour drive to Kigali',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['premium', 'ultra-premium'],
      travel_modes: ['drive'],
      extensions: [
        {
          id: 'second-trek',
          name: 'Second Gorilla Trek',
          description: 'Additional trek for different family experience',
          adds_days: 1,
          adds_cost_estimate: { low: 1700, high: 2000 },
          type: 'activity-add-on',
        },
        {
          id: 'lake-kivu',
          name: 'Lake Kivu Relaxation',
          description: 'Lakeside rest after trekking',
          adds_days: 2,
          adds_cost_estimate: { low: 500, high: 1200 },
          type: 'beach',
        },
      ],
    },
    included_activities: ['gorilla-trekking'],
    optional_activities: ['chimp-tracking', 'walking-safari', 'cultural-visit'],
    linked_decisions: ['rwanda-gorillas-worth', 'uganda-vs-rwanda', 'booking-lead-time'],
    cost_band: { low: 5000, high: 8000, note: 'Excluding international flights, includes $1,500 permit' },
    best_season_windows: [
      {
        name: 'Dry Seasons',
        months: [1, 2, 6, 7, 8, 9, 12],
        description: 'Easier trekking conditions, though gorillas are seen year-round',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Efficient logistics with gorillas accessible from Kigali', cost: 'Very high permit cost ($1,500)' },
      { gain: 'Well-maintained trails and organized operations', cost: 'Limited to 1 hour with gorillas' },
      { gain: 'Can be done in long weekend from East Africa', cost: 'Less wildlife diversity than Uganda combination' },
    ],
    who_this_is_for: 'Travelers prioritizing the gorilla encounter above all else, those with limited time, and anyone combining with East African safari.',
    who_this_is_not_for: 'Budget travelers, those wanting extended primate experiences, or travelers seeking savannah safari elements.',
    hero_image_hint: 'Silverback gorilla in bamboo forest',
    meta_description: 'Rwanda gorilla trekking safari. 4-6 days in Volcanoes National Park for mountain gorilla encounters.',
    linked_trip_shape_id: 'rwanda-gorilla-focused',
    is_featured: true,
    is_published: true,
  },

  {
    id: 'uganda-primate-comprehensive',
    slug: 'uganda-primate-safari',
    title: 'Uganda Primate Safari',
    subtitle: 'Gorillas, chimps, and savannah wildlife',
    region: 'uganda-rwanda',
    secondary_regions: [],
    route_summary: 'Entebbe → Kibale → Queen Elizabeth → Bwindi → Entebbe',
    duration_band: { min_days: 8, max_days: 12, typical_days: 10 },
    style_tags: ['primate', 'adventure', 'walking'],
    traveler_fit: ['adventure', 'wildlife-focused', 'photography', 'repeat-visitor'],
    comfort_tier: 'mid',
    core_segments: [
      {
        id: 'kibale-segment',
        order: 1,
        title: 'Kibale Forest National Park',
        location: 'Kibale',
        region: 'uganda-rwanda',
        nights: 2,
        description: 'Africa\'s highest primate diversity with habituated chimpanzees.',
        highlights: [
          'Chimpanzee tracking',
          '13 primate species including red colobus',
          'Forest birding',
        ],
        activities_available: ['chimp-tracking', 'walking-safari', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Early departure for chimp tracking',
          morning: '3-4 hours tracking in forest',
          midday: 'Time with chimps, return',
          afternoon: 'Bigodi Wetland walk for monkeys',
          evening: 'Dinner at lodge',
        },
        transfers: {
          arrival: '5-hour drive from Entebbe or 1-hour charter flight',
          departure: '2-hour drive to Queen Elizabeth NP',
        },
      },
      {
        id: 'queen-elizabeth-segment',
        order: 2,
        title: 'Queen Elizabeth National Park',
        location: 'Queen Elizabeth NP',
        region: 'uganda-rwanda',
        nights: 2,
        description: 'Classic savannah safari with tree-climbing lions and Kazinga Channel.',
        highlights: [
          'Tree-climbing lions of Ishasha',
          'Kazinga Channel boat safari',
          'Diverse habitats from crater lakes to savannah',
        ],
        activities_available: ['game-drive', 'boat-safari', 'chimp-tracking', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          morning: 'Game drive on crater circuit',
          midday: 'Lunch',
          afternoon: 'Kazinga Channel boat safari',
          evening: 'Drive to Ishasha sector (optional)',
        },
        transfers: {
          arrival: '2-hour drive from Kibale',
          departure: '4-hour drive to Bwindi',
        },
      },
      {
        id: 'bwindi-segment',
        order: 3,
        title: 'Bwindi Impenetrable Forest',
        location: 'Bwindi',
        region: 'uganda-rwanda',
        nights: [3, 4],
        description: 'Half of the world\'s mountain gorillas live in this ancient forest.',
        highlights: [
          'Mountain gorilla trekking',
          'Batwa cultural experience',
          'Dense forest atmosphere',
        ],
        activities_available: ['gorilla-trekking', 'walking-safari', 'bird-watching', 'cultural-visit'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Breakfast and briefing',
          morning: 'Gorilla trek (2-8 hours)',
          midday: '1 hour with gorilla family',
          afternoon: 'Return trek, rest',
          evening: 'Batwa experience or rest day',
        },
        transfers: {
          arrival: '4-hour drive from Queen Elizabeth',
          departure: '8-hour drive to Entebbe or 1.5-hour charter flight',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['mid-range', 'premium'],
      travel_modes: ['drive', 'mixed'],
      extensions: [
        {
          id: 'murchison-add',
          name: 'Murchison Falls',
          description: 'Add Uganda\'s largest park and iconic falls',
          adds_days: 3,
          adds_cost_estimate: { low: 1200, high: 2500 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['gorilla-trekking', 'chimp-tracking', 'game-drive', 'boat-safari'],
    optional_activities: ['walking-safari', 'cultural-visit', 'bird-watching'],
    linked_decisions: [
      'uganda-vs-rwanda',
      'rwanda-gorillas-worth',
      'walking-safari',
      'ideal-length',
    ],
    cost_band: { low: 5000, high: 9000, note: 'Excluding international flights, includes $800 gorilla permit' },
    best_season_windows: [
      {
        name: 'Dry Seasons',
        months: [1, 2, 6, 7, 8, 9, 12],
        description: 'Easier trekking and driving conditions',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Both gorillas and chimpanzees in one trip', cost: 'Significant driving on variable roads' },
      { gain: 'Lower gorilla permit cost than Rwanda', cost: 'Less polished infrastructure' },
      { gain: 'Savannah safari elements included', cost: 'Longer itinerary required' },
    ],
    who_this_is_for: 'Travelers wanting comprehensive primate experience, those valuing value over polish, and adventurous types comfortable with longer drives.',
    who_this_is_not_for: 'Time-pressed travelers, those seeking luxury throughout, or anyone uncomfortable with 4-6 hour drives.',
    hero_image_hint: 'Chimpanzee in Kibale forest',
    meta_description: 'Uganda primate safari with gorillas, chimps, and savannah wildlife. 8-12 days through Kibale, Queen Elizabeth, and Bwindi.',
    linked_trip_shape_id: 'uganda-primate-safari',
    is_featured: false,
    is_published: true,
  },

  // ============================================================
  // NAMIBIA (2 itineraries)
  // ============================================================
  {
    id: 'namibia-highlights-guided',
    slug: 'namibia-highlights',
    title: 'Namibia Highlights',
    subtitle: 'Dunes, desert-adapted wildlife, and stark landscapes',
    region: 'namibia',
    secondary_regions: ['southern-africa'],
    route_summary: 'Windhoek → Sossusvlei → Damaraland → Etosha → Windhoek',
    duration_band: { min_days: 10, max_days: 14, typical_days: 12 },
    style_tags: ['photography', 'adventure', 'self-drive'],
    traveler_fit: ['photography', 'adventure', 'repeat-visitor', 'solo'],
    comfort_tier: 'mid',
    core_segments: [
      {
        id: 'sossusvlei-segment',
        order: 1,
        title: 'Sossusvlei and NamibRand',
        location: 'Namib Desert',
        region: 'namibia',
        nights: 3,
        description: 'The world\'s oldest desert with towering red dunes and surreal landscapes.',
        highlights: [
          'Dune 45 and Big Daddy sunrise climbs',
          'Deadvlei\'s skeletal camelthorn trees',
          'Stargazing in dark sky reserve',
        ],
        activities_available: ['walking-safari', 'hot-air-balloon', 'scenic-helicopter', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Dune climb for sunrise',
          morning: 'Explore Deadvlei and Sossusvlei',
          midday: 'Rest during peak heat',
          afternoon: 'Sundowner drive in NamibRand',
          evening: 'Stargazing',
          night: 'Night sky photography',
        },
        transfers: {
          arrival: '5-hour drive from Windhoek or 1-hour charter flight',
          departure: '6-hour drive to Damaraland',
        },
      },
      {
        id: 'damaraland-segment',
        order: 2,
        title: 'Damaraland',
        location: 'Damaraland',
        region: 'namibia',
        nights: 2,
        description: 'Rocky terrain home to desert-adapted elephants and ancient rock art.',
        highlights: [
          'Desert-adapted elephant tracking',
          'Twyfelfontein rock engravings',
          'Petrified forest',
        ],
        activities_available: ['game-drive', 'walking-safari', 'cultural-visit'],
        accommodation_archetype: 'permanent-tented-camp',
        typical_day: {
          morning: 'Elephant tracking in riverbeds',
          midday: 'Rock art site visit',
          afternoon: 'Scenic exploration',
          evening: 'Dinner under desert stars',
        },
        transfers: {
          arrival: '6-hour drive from Sossusvlei',
          departure: '4-hour drive to Etosha',
        },
      },
      {
        id: 'etosha-segment',
        order: 3,
        title: 'Etosha National Park',
        location: 'Etosha',
        region: 'namibia',
        nights: [3, 4],
        description: 'White salt pan attracting wildlife to its waterholes.',
        highlights: [
          'Waterhole game viewing',
          'Black rhino sightings',
          'Unique salt pan landscape',
        ],
        activities_available: ['game-drive', 'bird-watching', 'night-drive'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Early game drive',
          morning: 'Waterhole circuit',
          midday: 'Lunch, rest',
          afternoon: 'Game drive to different waterholes',
          evening: 'Floodlit waterhole viewing',
        },
        transfers: {
          arrival: '4-hour drive from Damaraland',
          departure: '4-hour drive to Windhoek',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['mid-range', 'premium', 'ultra-premium'],
      travel_modes: ['drive'],
      extensions: [
        {
          id: 'skeleton-coast',
          name: 'Skeleton Coast',
          description: 'Add the haunting shipwreck coast',
          adds_days: 2,
          adds_cost_estimate: { low: 2000, high: 4000 },
          type: 'side-trip',
        },
        {
          id: 'fish-river',
          name: 'Fish River Canyon',
          description: 'Add the world\'s second-largest canyon',
          adds_days: 2,
          adds_cost_estimate: { low: 600, high: 1200 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari'],
    optional_activities: ['hot-air-balloon', 'scenic-helicopter', 'cultural-visit', 'night-drive'],
    linked_decisions: ['namibia-different', 'self-drive-safari', 'ideal-length', 'solo-safari-fit'],
    cost_band: { low: 5000, high: 10000, note: 'Excluding international flights' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [5, 6, 7, 8, 9, 10],
        description: 'Best wildlife viewing, cool nights, no rain',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Unmatched landscape photography opportunities', cost: 'Lower wildlife density than East Africa' },
      { gain: 'Self-drive friendly with excellent roads', cost: 'Long distances between destinations' },
      { gain: 'Unique desert-adapted species', cost: 'Less traditional Big Five safari' },
    ],
    who_this_is_for: 'Photographers, landscape lovers, self-drive enthusiasts, and travelers seeking something different from savannah safari.',
    who_this_is_not_for: 'First-timers expecting dense wildlife, those uncomfortable with long drives, or travelers seeking classic Big Five focus.',
    hero_image_hint: 'Sossusvlei red dunes at sunrise',
    meta_description: 'Namibia highlights safari through Sossusvlei, Damaraland, and Etosha. 10-14 days of dramatic landscapes and desert-adapted wildlife.',
    linked_trip_shape_id: 'namibia-highlights',
    is_featured: false,
    is_published: true,
  },

  {
    id: 'namibia-self-drive-adventure',
    slug: 'namibia-self-drive',
    title: 'Namibia Self-Drive Adventure',
    subtitle: 'Independent exploration on open roads',
    region: 'namibia',
    secondary_regions: ['southern-africa'],
    route_summary: 'Windhoek → Sossusvlei → Swakopmund → Damaraland → Etosha → Windhoek',
    duration_band: { min_days: 12, max_days: 18, typical_days: 14 },
    style_tags: ['self-drive', 'adventure', 'value'],
    traveler_fit: ['adventure', 'solo', 'photography'],
    comfort_tier: 'budget',
    core_segments: [
      {
        id: 'sossusvlei-self',
        order: 1,
        title: 'Sossusvlei Dunes',
        location: 'Sesriem / Sossusvlei',
        region: 'namibia',
        nights: [2, 3],
        description: 'Iconic dunes accessible with your own 4x4 vehicle.',
        highlights: [
          'Sunrise dune access from inside the park',
          'Flexibility to explore at your pace',
          'Camping under desert stars',
        ],
        activities_available: ['walking-safari', 'bird-watching'],
        accommodation_archetype: 'budget-tented-camp',
        typical_day: {
          dawn: 'Drive to dunes for sunrise',
          morning: 'Climb Big Daddy, explore Deadvlei',
          midday: 'Sesriem Canyon exploration',
          afternoon: 'Rest or second dune visit',
          evening: 'Camp cooking, stargazing',
        },
        transfers: {
          arrival: '5-hour drive from Windhoek',
          departure: '4-hour drive to Swakopmund',
        },
      },
      {
        id: 'swakopmund-segment',
        order: 2,
        title: 'Swakopmund',
        location: 'Swakopmund',
        region: 'namibia',
        nights: 2,
        description: 'German colonial town on the Atlantic coast.',
        highlights: [
          'Adventure activities (quad biking, sandboarding)',
          'Cape Cross seal colony nearby',
          'Rest day with restaurants and shops',
        ],
        activities_available: ['quad-biking', 'kayaking', 'bird-watching'],
        accommodation_archetype: 'budget-tented-camp',
        typical_day: {
          morning: 'Cape Cross seal colony visit',
          midday: 'Lunch in town',
          afternoon: 'Sandboarding or kayaking',
          evening: 'German restaurant dinner',
        },
        transfers: {
          arrival: '4-hour drive from Sossusvlei',
          departure: '3-hour drive to Damaraland',
        },
      },
      {
        id: 'damaraland-self',
        order: 3,
        title: 'Damaraland Exploration',
        location: 'Damaraland',
        region: 'namibia',
        nights: 2,
        description: 'Self-guided exploration of rocky terrain and ancient sites.',
        highlights: [
          'Twyfelfontein rock art',
          'Organ Pipes geological formation',
          'Possible desert elephant sightings',
        ],
        activities_available: ['game-drive', 'walking-safari', 'cultural-visit'],
        accommodation_archetype: 'budget-tented-camp',
        typical_day: {
          morning: 'Explore rock art sites',
          midday: 'Picnic lunch',
          afternoon: 'Search for elephants in riverbeds',
          evening: 'Camp setup, cooking',
        },
        transfers: {
          arrival: '3-hour drive from Swakopmund',
          departure: '4-hour drive to Etosha',
        },
      },
      {
        id: 'etosha-self',
        order: 4,
        title: 'Etosha Self-Drive',
        location: 'Etosha National Park',
        region: 'namibia',
        nights: [3, 4],
        description: 'Self-drive game viewing at your own pace within the park.',
        highlights: [
          'Waterhole circuits',
          'Rest camp accommodation inside park',
          'Night waterhole viewing',
        ],
        activities_available: ['game-drive', 'bird-watching'],
        accommodation_archetype: 'budget-tented-camp',
        typical_day: {
          dawn: 'Early gate opening for game drive',
          morning: 'Circuit driving between waterholes',
          midday: 'Lunch at rest camp',
          afternoon: 'Continue game drive',
          evening: 'Floodlit waterhole at camp',
        },
        transfers: {
          arrival: '4-hour drive from Damaraland',
          departure: '4-hour drive to Windhoek',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['budget', 'mid-range'],
      travel_modes: ['drive'],
      extensions: [
        {
          id: 'skeleton-coast-self',
          name: 'Skeleton Coast Loop',
          description: 'Add the dramatic northern coast',
          adds_days: 2,
          adds_cost_estimate: { low: 400, high: 800 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive'],
    optional_activities: ['quad-biking', 'kayaking', 'walking-safari'],
    linked_decisions: ['self-drive-safari', 'solo-safari-fit', 'budget-accommodation', 'total-budget'],
    cost_band: { low: 2500, high: 5000, note: 'Excluding international flights, includes 4x4 rental' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [4, 5, 6, 7, 8, 9, 10],
        description: 'Best road conditions and wildlife viewing',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Complete flexibility and independence', cost: 'No guide expertise for wildlife spotting' },
      { gain: 'Significant cost savings', cost: 'Responsibility for vehicle, navigation, safety' },
      { gain: 'Authentic adventure experience', cost: 'Remote breakdowns can be problematic' },
    ],
    who_this_is_for: 'Independent travelers comfortable with 4x4 driving, budget-conscious adventurers, photographers wanting unlimited time, and those seeking flexibility.',
    who_this_is_not_for: 'Those wanting expert guiding, travelers uncomfortable with remote driving, or first-timers wanting structure.',
    hero_image_hint: '4x4 on Namibian gravel road',
    meta_description: 'Namibia self-drive adventure covering dunes, coast, and Etosha. 12-18 days of independent exploration.',
    linked_trip_shape_id: 'namibia-self-drive',
    is_featured: false,
    is_published: true,
  },

  // ============================================================
  // SOUTH AFRICA (2 itineraries)
  // ============================================================
  {
    id: 'south-africa-greater-kruger',
    slug: 'south-africa-kruger',
    title: 'Greater Kruger Experience',
    subtitle: 'Big Five in private reserves',
    region: 'south-africa',
    secondary_regions: ['southern-africa'],
    route_summary: 'Johannesburg → Sabi Sands / Greater Kruger → Johannesburg',
    duration_band: { min_days: 4, max_days: 7, typical_days: 5 },
    style_tags: ['first-safari', 'family', 'honeymoon'],
    traveler_fit: ['first-safari', 'family', 'honeymoon', 'wildlife-focused'],
    comfort_tier: 'mid',
    core_segments: [
      {
        id: 'greater-kruger-segment',
        order: 1,
        title: 'Private Game Reserve',
        location: 'Sabi Sands / Timbavati / Klaserie',
        region: 'south-africa',
        nights: [3, 5],
        description: 'Private reserves bordering Kruger offer traversing rights and exclusive experiences.',
        highlights: [
          'Reliable Big Five viewing',
          'Off-road driving in private reserves',
          'Walking safaris and night drives',
        ],
        activities_available: ['game-drive', 'walking-safari', 'night-drive', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Early game drive with coffee',
          morning: 'Extended drive, brunch in bush',
          midday: 'Rest at lodge, pool',
          afternoon: 'Afternoon game drive',
          evening: 'Night drive, spotlight for nocturnal species',
        },
        transfers: {
          arrival: '5-hour drive from Johannesburg or 1-hour charter flight',
          departure: '5-hour drive to Johannesburg or 1-hour flight',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['mid-range', 'premium', 'ultra-premium'],
      travel_modes: ['drive', 'fly'],
      extensions: [
        {
          id: 'cape-town',
          name: 'Cape Town Extension',
          description: 'Add Cape Town, Winelands, and coast',
          adds_days: 4,
          adds_cost_estimate: { low: 1500, high: 3500 },
          type: 'side-trip',
        },
        {
          id: 'panorama-route',
          name: 'Panorama Route',
          description: 'Add Blyde River Canyon and scenic drives',
          adds_days: 2,
          adds_cost_estimate: { low: 400, high: 800 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari', 'night-drive'],
    optional_activities: ['bird-watching'],
    linked_decisions: [
      'sa-vs-ea',
      'kruger-vs-private',
      'malaria-decision',
      'ideal-length',
      'first-timer-ready',
    ],
    cost_band: { low: 3000, high: 6000, note: 'Excluding international flights' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [5, 6, 7, 8, 9, 10],
        description: 'Best game viewing, winter weather (cool nights)',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Accessible Big Five safari from Johannesburg', cost: 'More commercialized than East Africa' },
      { gain: 'No-malaria options in some areas', cost: 'Smaller fenced reserves feel less wild' },
      { gain: 'Good value for safari entry point', cost: 'Less landscape diversity than multi-park trips' },
    ],
    who_this_is_for: 'First-time safari travelers wanting accessible Big Five, families and honeymooners combining with Cape Town, and those prioritizing value and logistics.',
    who_this_is_not_for: 'Travelers seeking wilderness remoteness, repeat visitors wanting off-grid, or those specifically drawn to East African landscapes.',
    hero_image_hint: 'Leopard in tree at Sabi Sands',
    meta_description: 'Greater Kruger safari in South Africa\'s private reserves. 4-7 days of Big Five viewing with walking safaris and night drives.',
    linked_trip_shape_id: 'kruger-greater-kruger',
    is_featured: false,
    is_published: true,
  },

  {
    id: 'south-africa-safari-cape-combo',
    slug: 'south-africa-safari-and-cape',
    title: 'South Africa Safari and Cape',
    subtitle: 'Big Five, wine, and Cape Town in one journey',
    region: 'south-africa',
    secondary_regions: ['southern-africa'],
    route_summary: 'Johannesburg → Greater Kruger → Cape Town → Winelands → Cape Town',
    duration_band: { min_days: 10, max_days: 14, typical_days: 12 },
    style_tags: ['first-safari', 'honeymoon', 'family'],
    traveler_fit: ['first-safari', 'honeymoon', 'family', 'cultural'],
    comfort_tier: 'mid',
    core_segments: [
      {
        id: 'kruger-combo-segment',
        order: 1,
        title: 'Greater Kruger',
        location: 'Sabi Sands / Timbavati',
        region: 'south-africa',
        nights: [3, 4],
        description: 'Big Five safari before heading to the Cape.',
        highlights: [
          'Big Five encounters',
          'Night drives and walking safaris',
          'Private reserve exclusivity',
        ],
        activities_available: ['game-drive', 'walking-safari', 'night-drive'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          dawn: 'Morning game drive',
          morning: 'Extended drive',
          midday: 'Rest',
          afternoon: 'Afternoon drive',
          evening: 'Night drive',
        },
        transfers: {
          arrival: '1-hour flight from Johannesburg',
          departure: '1-hour flight to Johannesburg, connect to Cape Town (2 hours)',
        },
      },
      {
        id: 'cape-town-segment',
        order: 2,
        title: 'Cape Town',
        location: 'Cape Town',
        region: 'south-africa',
        nights: [3, 4],
        description: 'One of the world\'s most beautiful cities.',
        highlights: [
          'Table Mountain cable car',
          'Cape of Good Hope',
          'V&A Waterfront',
        ],
        activities_available: ['walking-safari', 'kayaking', 'bird-watching', 'cultural-visit'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          morning: 'Table Mountain or Cape Point',
          midday: 'Lunch in the city',
          afternoon: 'Explore neighborhoods or penguin colony',
          evening: 'Waterfront dining',
        },
        transfers: {
          arrival: '2-hour flight from Johannesburg',
          departure: '1-hour drive to Winelands',
        },
      },
      {
        id: 'winelands-segment',
        order: 3,
        title: 'Cape Winelands',
        location: 'Stellenbosch / Franschhoek',
        region: 'south-africa',
        nights: [2, 3],
        description: 'World-class wines in a stunning mountain setting.',
        highlights: [
          'Wine estate tastings',
          'Gourmet dining',
          'Historic Cape Dutch architecture',
        ],
        activities_available: ['cultural-visit', 'bird-watching'],
        accommodation_archetype: 'classic-safari-lodge',
        typical_day: {
          morning: 'Wine estate visits',
          midday: 'Long lunch at a farm',
          afternoon: 'More tastings or relaxation',
          evening: 'Fine dining',
        },
        transfers: {
          arrival: '1-hour drive from Cape Town',
          departure: '1-hour drive to Cape Town airport',
        },
      },
    ],
    variant_options: {
      accommodation_tiers: ['mid-range', 'premium', 'ultra-premium'],
      travel_modes: ['fly', 'mixed'],
      extensions: [
        {
          id: 'garden-route',
          name: 'Garden Route',
          description: 'Add coastal drive to Port Elizabeth',
          adds_days: 3,
          adds_cost_estimate: { low: 1000, high: 2000 },
          type: 'side-trip',
        },
      ],
    },
    included_activities: ['game-drive', 'walking-safari', 'night-drive'],
    optional_activities: ['cultural-visit', 'kayaking', 'bird-watching'],
    linked_decisions: ['sa-vs-ea', 'beach-extension', 'ideal-length', 'single-country-multi'],
    cost_band: { low: 5000, high: 9000, note: 'Excluding international flights, includes internal flights' },
    best_season_windows: [
      {
        name: 'Dry Season',
        months: [4, 5, 6, 7, 8, 9, 10],
        description: 'Best safari viewing and Cape weather varies',
        is_peak: true,
      },
    ],
    trade_offs: [
      { gain: 'Safari plus city and wine in one country', cost: 'Safari portion is shorter' },
      { gain: 'Easy internal logistics', cost: 'Internal flights add cost' },
      { gain: 'Variety of experiences', cost: 'Less depth in any one area' },
    ],
    who_this_is_for: 'First-timers wanting a multi-faceted South Africa trip, honeymooners seeking variety, and families wanting safari plus beach/city.',
    who_this_is_not_for: 'Safari purists wanting maximum bush time, budget travelers, or those with very limited time.',
    hero_image_hint: 'Table Mountain with vineyards in foreground',
    meta_description: 'South Africa safari and Cape combo. 10-14 days from Kruger to Cape Town and the Winelands.',
    linked_trip_shape_id: 'south-africa-combo',
    is_featured: false,
    is_published: true,
  },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get all published itineraries
 */
export function getAllItineraries(): Itinerary[] {
  return itineraries.filter((i) => i.is_published);
}

/**
 * Get featured itineraries for hub page
 */
export function getFeaturedItineraries(): Itinerary[] {
  return itineraries.filter((i) => i.is_featured && i.is_published);
}

/**
 * Get itinerary by ID
 */
export function getItineraryById(id: string): Itinerary | null {
  return itineraries.find((i) => i.id === id && i.is_published) || null;
}

/**
 * Get itinerary by slug
 */
export function getItineraryBySlug(slug: string): Itinerary | null {
  return itineraries.find((i) => i.slug === slug && i.is_published) || null;
}

/**
 * Get itineraries by region
 */
export function getItinerariesByRegion(region: string): Itinerary[] {
  return itineraries.filter(
    (i) => (i.region === region || i.secondary_regions.includes(region as any)) && i.is_published
  );
}

/**
 * Get itineraries by style tag
 */
export function getItinerariesByStyle(style: string): Itinerary[] {
  return itineraries.filter(
    (i) => i.style_tags.includes(style as any) && i.is_published
  );
}

/**
 * Get itinerary summaries for hub page
 */
export function getItinerarySummaries(): ItinerarySummary[] {
  return getAllItineraries().map((i) => ({
    id: i.id,
    slug: i.slug,
    title: i.title,
    subtitle: i.subtitle,
    region: i.region,
    duration_band: i.duration_band,
    style_tags: i.style_tags,
    comfort_tier: i.comfort_tier,
    cost_band: i.cost_band,
    hero_image_hint: i.hero_image_hint,
    is_featured: i.is_featured,
  }));
}

/**
 * Build inquiry prefill data from itinerary
 */
export function buildInquiryPrefill(itinerary: Itinerary): ItineraryInquiryPrefill {
  // Map cost band to budget band
  const avgCost = (itinerary.cost_band.low + itinerary.cost_band.high) / 2;
  let suggestedBudget = 'flexible';
  if (avgCost < 5000) suggestedBudget = 'under-5k';
  else if (avgCost < 10000) suggestedBudget = '5k-10k';
  else if (avgCost < 20000) suggestedBudget = '10k-20k';
  else if (avgCost < 35000) suggestedBudget = '20k-35k';
  else suggestedBudget = 'above-35k';

  return {
    itinerary_id: itinerary.id,
    itinerary_title: itinerary.title,
    linked_decision_ids: itinerary.linked_decisions.slice(0, 6),
    suggested_duration: itinerary.duration_band.typical_days,
    suggested_budget_band: suggestedBudget,
    region: itinerary.region,
  };
}

/**
 * Format duration band for display
 */
export function formatDurationBand(band: { min_days: number; max_days: number }): string {
  if (band.min_days === band.max_days) {
    return `${band.min_days} days`;
  }
  return `${band.min_days}–${band.max_days} days`;
}

/**
 * Get all unique style tags from itineraries
 */
export function getAllStyleTags(): string[] {
  const tags = new Set<string>();
  itineraries.forEach((i) => i.style_tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

/**
 * Get all unique regions from itineraries
 */
export function getAllItineraryRegions(): string[] {
  const regions = new Set<string>();
  itineraries.forEach((i) => {
    regions.add(i.region);
    i.secondary_regions.forEach((r) => regions.add(r));
  });
  return Array.from(regions).sort();
}

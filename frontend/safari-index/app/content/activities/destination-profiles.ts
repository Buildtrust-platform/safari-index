/**
 * Destination × Activity Profiles
 *
 * Maps destinations to their available activities, accommodations, and signature experiences.
 * Used for:
 * - Trip shape pages ("What your days look like")
 * - Internal linking (Activity → Destination)
 * - SEO content generation
 *
 * Per governance:
 * - P0 destinations only for launch
 * - Documentary tone
 * - No individual lodge names
 */

// Types imported for documentation reference only
// ActivityCategory from './activity-primitives'
// PriceRange from './accommodation-archetypes'

export interface DestinationActivityProfile {
  destinationId: string;
  destinationName: string;
  /** Activities available, with seasonal notes */
  activities: Array<{
    activityId: string;
    availability: 'year-round' | 'seasonal' | 'limited';
    bestMonths?: string[];
    notes?: string;
  }>;
  /** Accommodation types available */
  accommodations: Array<{
    archetypeId: string;
    prevalence: 'common' | 'available' | 'rare';
    notes?: string;
  }>;
  /** Signature experience unique to this destination */
  signature_experience: {
    title: string;
    description: string;
    image_hint: string;
  };
  /** Typical daily rhythm */
  typical_day: {
    dawn: string;
    morning: string;
    midday: string;
    afternoon: string;
    evening: string;
    night: string;
  };
}

export const destinationProfiles: DestinationActivityProfile[] = [
  {
    destinationId: 'tanzania',
    destinationName: 'Tanzania',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'Serengeti NP, Ngorongoro Crater, Tarangire NP, Lake Manyara NP, Ruaha NP, Nyerere NP (Selous), Katavi NP, Mikumi NP' },
      { activityId: 'walking-safari', availability: 'seasonal', bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'Nyerere/Selous, Ruaha, select Serengeti concessions, Tarangire walking camps' },
      { activityId: 'night-drive', availability: 'limited', notes: 'Only in private concessions (Serengeti Mara, Grumeti), not national parks' },
      { activityId: 'boat-safari', availability: 'seasonal', bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], notes: 'Nyerere/Selous (Rufiji River), Lake Manyara' },
      { activityId: 'hot-air-balloon', availability: 'year-round', notes: 'Serengeti (Seronera), Tarangire; weather dependent' },
      { activityId: 'chimp-tracking', availability: 'year-round', notes: 'Mahale Mountains NP, Gombe Stream NP (remote western Tanzania)' },
      { activityId: 'fly-camping', availability: 'seasonal', bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'Ruaha, Nyerere/Selous, remote Serengeti' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Maasai villages (Ngorongoro), Hadzabe hunter-gatherers (Lake Eyasi), Datoga blacksmiths' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 1,100 species—Lake Manyara flamingos, Tarangire, Ngorongoro Crater' },
      { activityId: 'mountain-biking', availability: 'seasonal', notes: 'Ngorongoro Crater rim, Arusha NP' },
    ],
    accommodations: [
      { archetypeId: 'classic-safari-lodge', prevalence: 'common' },
      { archetypeId: 'tented-camp', prevalence: 'common' },
      { archetypeId: 'mobile-camp', prevalence: 'available', notes: 'Migration-following camps in Serengeti' },
      { archetypeId: 'fly-camp', prevalence: 'available', notes: 'Southern circuit' },
      { archetypeId: 'budget-camp', prevalence: 'common', notes: 'Arusha area, park boundaries' },
    ],
    signature_experience: {
      title: 'Great Migration River Crossings',
      description: 'Witnessing hundreds of thousands of wildebeest plunge into the Mara River, facing crocodiles and currents. Tanzania\'s northern Serengeti offers the most dramatic crossings from July through October.',
      image_hint: 'Massive wildebeest herd crossing crocodile-infested Mara River with spray and drama',
    },
    typical_day: {
      dawn: '5:30am wake-up call, coffee on the veranda as the sky lightens',
      morning: '6:00am game drive departing camp, searching for predators on the hunt',
      midday: 'Return to camp for brunch, siesta during heat of day, optional pool or spa',
      afternoon: '4:00pm afternoon drive, sundowner drinks as the light turns golden',
      evening: 'Return for dinner under the stars, sharing stories of the day\'s sightings',
      night: 'Fall asleep to hyena calls and lion roars echoing across the plains',
    },
  },
  {
    destinationId: 'kenya',
    destinationName: 'Kenya',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'Masai Mara NR, Amboseli NP, Samburu NR, Laikipia conservancies, Tsavo East/West NP, Lake Nakuru NP, Ol Pejeta Conservancy, Meru NP' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Laikipia conservancies, Mara conservancies (Naboisho, Mara North, Olare Motorogi)—not Mara Reserve' },
      { activityId: 'night-drive', availability: 'year-round', notes: 'Conservancies only—not permitted in national parks or reserves' },
      { activityId: 'hot-air-balloon', availability: 'year-round', notes: 'Masai Mara (most popular), Amboseli; weather dependent' },
      { activityId: 'horseback-safari', availability: 'year-round', notes: 'Laikipia (Borana, Lewa), select Mara conservancies' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Maasai communities (Mara), Samburu villages, Swahili coast' },
      { activityId: 'fly-camping', availability: 'seasonal', bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'Laikipia, Mara conservancies' },
      { activityId: 'photographic-hide', availability: 'year-round', notes: 'Laikipia properties (Lewa, Ol Pejeta), select Mara camps' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Lake Nakuru flamingos, Lake Naivasha, Lake Baringo, Kakamega Forest' },
      { activityId: 'mountain-biking', availability: 'year-round', notes: 'Hell\'s Gate NP (unique ride-through park), Laikipia' },
      { activityId: 'zip-lining', availability: 'year-round', notes: 'Kereita Forest near Nairobi' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'Lake Naivasha, Kenya coast' },
    ],
    accommodations: [
      { archetypeId: 'classic-safari-lodge', prevalence: 'common' },
      { archetypeId: 'tented-camp', prevalence: 'common' },
      { archetypeId: 'exclusive-villa', prevalence: 'available', notes: 'Laikipia conservancies' },
      { archetypeId: 'treehouse', prevalence: 'available', notes: 'Laikipia specialty' },
      { archetypeId: 'mobile-camp', prevalence: 'rare', notes: 'Migration following' },
    ],
    signature_experience: {
      title: 'Conservancy Walking with Warriors',
      description: 'Kenya\'s private conservancies offer walking safaris led by Maasai warriors and trained guides. This intimate experience connects you to the land through tracking, ecology, and cultural interpretation.',
      image_hint: 'Maasai warrior leading small group through golden savanna grass with Mt Kenya backdrop',
    },
    typical_day: {
      dawn: '6:00am early morning tea delivered to your tent',
      morning: '6:30am game drive through conservancy, exclusive access, no vehicle limits',
      midday: 'Bush breakfast, return to camp, relax by the pool or enjoy spa',
      afternoon: '4:00pm afternoon activity - game drive, walking, or cultural visit',
      evening: 'Sundowners on the escarpment, dinner in the boma',
      night: 'Optional night drive searching for leopard and nocturnal species',
    },
  },
  {
    destinationId: 'botswana',
    destinationName: 'Botswana',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'Okavango Delta, Chobe NP, Moremi GR, Savuti, Linyanti, Central Kalahari GR, Makgadikgadi Pans NP, Nxai Pan NP' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Delta islands, Linyanti, mobile safaris' },
      { activityId: 'night-drive', availability: 'year-round', notes: 'Concession areas throughout Delta and Linyanti' },
      { activityId: 'boat-safari', availability: 'seasonal', bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'Chobe River, Okavango Delta channels, Linyanti' },
      { activityId: 'mokoro', availability: 'seasonal', bestMonths: ['May', 'Jun', 'Jul', 'Aug'], notes: 'Okavango Delta—unique traditional dugout canoe experience' },
      { activityId: 'horseback-safari', availability: 'year-round', notes: 'Okavango Delta specialists—ride alongside zebra, giraffe, elephant' },
      { activityId: 'fly-camping', availability: 'seasonal', bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'Delta islands, Makgadikgadi' },
      { activityId: 'scenic-helicopter', availability: 'year-round', notes: 'Delta aerial views, best flood photography' },
      { activityId: 'fishing', availability: 'seasonal', bestMonths: ['Sep', 'Oct', 'Nov'], notes: 'Okavango Panhandle, Chobe River—tiger fish, bream' },
      { activityId: 'photographic-hide', availability: 'year-round', notes: 'Chobe (elephants), Savuti, multiple Delta camps' },
      { activityId: 'hot-air-balloon', availability: 'year-round', notes: 'Okavango Delta, weather permitting' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'San Bushmen communities in Makgadikgadi and Kalahari' },
      { activityId: 'quad-biking', availability: 'seasonal', bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'Makgadikgadi salt pans' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 500 species—Delta, Chobe, Makgadikgadi flamingos in summer' },
    ],
    accommodations: [
      { archetypeId: 'tented-camp', prevalence: 'common' },
      { archetypeId: 'classic-safari-lodge', prevalence: 'available' },
      { archetypeId: 'mobile-camp', prevalence: 'available', notes: 'Makgadikgadi, Kalahari' },
      { archetypeId: 'fly-camp', prevalence: 'common' },
      { archetypeId: 'exclusive-villa', prevalence: 'available' },
      { archetypeId: 'houseboat', prevalence: 'available', notes: 'Chobe River' },
      { archetypeId: 'treehouse', prevalence: 'available' },
    ],
    signature_experience: {
      title: 'Mokoro Through the Delta',
      description: 'Gliding silently through papyrus-lined channels in a traditional dugout canoe, eye-level with hippos and lilies. The Okavango Delta\'s mokoro experience is utterly unique—silent, meditative, and deeply connected to water.',
      image_hint: 'Traditional mokoro canoe gliding through lily-covered Okavango Delta channel at golden hour',
    },
    typical_day: {
      dawn: '5:30am coffee on the deck, watching the Delta wake',
      morning: 'Game drive or mokoro excursion, depending on water levels and camp location',
      midday: 'Brunch with Delta views, siesta in the shade, perhaps a dip in the pool',
      afternoon: 'Boat safari, walking safari, or game drive as the light softens',
      evening: 'Sundowners on an island, dinner by lantern light',
      night: 'Fall asleep to the sounds of hippos grunting in the nearby channel',
    },
  },
  {
    destinationId: 'south-africa',
    destinationName: 'South Africa',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'Kruger NP, Sabi Sands GR, Timbavati GR, Thornybush GR, Madikwe GR, Pilanesberg NP, Hluhluwe-iMfolozi, Addo Elephant NP, Phinda, Shamwari, Kwandwe, Kariega' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Greater Kruger reserves, Eastern Cape reserves, Kwazulu-Natal' },
      { activityId: 'night-drive', availability: 'year-round', notes: 'Private reserves only—not Kruger National Park' },
      { activityId: 'hot-air-balloon', availability: 'year-round', notes: 'Pilanesberg, Magaliesberg' },
      { activityId: 'horseback-safari', availability: 'year-round', notes: 'Waterberg, Tuli Block border, select Eastern Cape reserves' },
      { activityId: 'photographic-hide', availability: 'year-round', notes: 'Widely available—Zimanga, Madikwe, Pilanesberg' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Zulu communities, Ndebele villages, Soweto township tours' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 850 species—Kruger, iSimangaliso Wetland, Drakensberg' },
      { activityId: 'bungee-jumping', availability: 'year-round', notes: 'Bloukrans Bridge (world\'s highest commercial bungee at 216m), Soweto Towers' },
      { activityId: 'scenic-helicopter', availability: 'year-round', notes: 'Cape Town, Drakensberg, Greater Kruger' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'iSimangaliso Wetland Park, Garden Route' },
      { activityId: 'zip-lining', availability: 'year-round', notes: 'Sun City, Cape Town, Mpumalanga' },
      { activityId: 'quad-biking', availability: 'year-round', notes: 'Cape Town sand dunes, Drakensberg' },
      { activityId: 'mountain-biking', availability: 'year-round', notes: 'Cape Town, Drakensberg, Pilanesberg' },
      { activityId: 'fishing', availability: 'year-round', notes: 'Tiger fish in Limpopo region, fly fishing in Drakensberg' },
    ],
    accommodations: [
      { archetypeId: 'classic-safari-lodge', prevalence: 'common' },
      { archetypeId: 'tented-camp', prevalence: 'common' },
      { archetypeId: 'exclusive-villa', prevalence: 'common', notes: 'Family-focused market' },
      { archetypeId: 'treehouse', prevalence: 'available' },
      { archetypeId: 'budget-camp', prevalence: 'common' },
    ],
    signature_experience: {
      title: 'Big Five in Malaria-Free Reserves',
      description: 'South Africa uniquely offers malaria-free safari options with excellent Big Five sighting rates. Reserves like Madikwe and the Eastern Cape provide family-friendly wildlife experiences without prophylaxis concerns.',
      image_hint: 'Leopard in tree with safari vehicle below in classic South African bushveld setting',
    },
    typical_day: {
      dawn: '5:00am wake-up knock, rusks and coffee before departure',
      morning: '5:30am game drive, typically 4 hours, tracking Big Five',
      midday: 'Full brunch, leisure time, spa, or game-viewing from the deck',
      afternoon: '3:30pm high tea, then afternoon game drive',
      evening: 'Sundowner in the bush, night drive return, boma dinner',
      night: 'Star-gazing from your private deck, sounds of the bush',
    },
  },
  {
    destinationId: 'zimbabwe',
    destinationName: 'Zimbabwe',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'Hwange NP, Mana Pools NP, Matobo NP, Gonarezhou NP, Matusadona NP, Zambezi NP, Chizarira NP' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Zimbabwe invented the walking safari—Mana Pools, Hwange, Matobo' },
      { activityId: 'night-drive', availability: 'year-round', notes: 'Hwange concessions, private reserves' },
      { activityId: 'canoe-safari', availability: 'seasonal', bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], notes: 'Mana Pools—multi-day Zambezi canoe trails' },
      { activityId: 'boat-safari', availability: 'year-round', notes: 'Zambezi River, Lake Kariba, Chobe confluence' },
      { activityId: 'fishing', availability: 'seasonal', bestMonths: ['Sep', 'Oct', 'Nov'], notes: 'Tiger fish on Zambezi, Lake Kariba' },
      { activityId: 'scenic-helicopter', availability: 'year-round', notes: 'Victoria Falls, Zambezi Gorge' },
      { activityId: 'photographic-hide', availability: 'year-round', notes: 'Hwange waterholes (world-famous elephant hides), Mana Pools' },
      { activityId: 'white-water-rafting', availability: 'year-round', notes: 'Victoria Falls—Grade 5 Batoka Gorge, one of world\'s best' },
      { activityId: 'bungee-jumping', availability: 'year-round', notes: 'Victoria Falls Bridge, 111m between Zimbabwe and Zambia' },
      { activityId: 'zip-lining', availability: 'year-round', notes: 'Victoria Falls Canopy Tour, gorge swing' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'Upper Zambezi above falls, Lake Kariba' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Great Zimbabwe ruins, Matobo rock art, village visits' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 670 species—Mana Pools, Matobo (raptors), Eastern Highlands' },
      { activityId: 'horseback-safari', availability: 'year-round', notes: 'Hwange, Zambezi' },
    ],
    accommodations: [
      { archetypeId: 'tented-camp', prevalence: 'common' },
      { archetypeId: 'classic-safari-lodge', prevalence: 'available' },
      { archetypeId: 'mobile-camp', prevalence: 'available', notes: 'Mana Pools canoe trips' },
      { archetypeId: 'fly-camp', prevalence: 'common' },
      { archetypeId: 'houseboat', prevalence: 'available', notes: 'Lake Kariba' },
    ],
    signature_experience: {
      title: 'Walking with Elephants in Mana Pools',
      description: 'Mana Pools is legendary for close elephant encounters on foot. Walking between bull elephants feeding in the albida forest is a privilege found nowhere else—raw, intimate, and humbling.',
      image_hint: 'Walking guide and guests on foot with elephant bull feeding in ana tree forest Mana Pools',
    },
    typical_day: {
      dawn: '5:00am coffee around the campfire as the stars fade',
      morning: 'Long walking safari, learning tracking, reading spoor, understanding the bush',
      midday: 'Return to camp, lunch, siesta in the shade of riverine forest',
      afternoon: 'Canoe paddle on the Zambezi or afternoon game drive',
      evening: 'Sundowners on the riverbank watching elephants cross',
      night: 'Dinner under the stars, conversations with legendary guides',
    },
  },
  {
    destinationId: 'zambia',
    destinationName: 'Zambia',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'South Luangwa NP, Lower Zambezi NP, Kafue NP, North Luangwa NP, Liuwa Plain NP, Mosi-oa-Tunya NP' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'South Luangwa—birthplace of the walking safari, North Luangwa, Lower Zambezi' },
      { activityId: 'night-drive', availability: 'year-round', notes: 'South Luangwa, Lower Zambezi, Kafue' },
      { activityId: 'boat-safari', availability: 'year-round', notes: 'Lower Zambezi (canoeing with hippos), Kafue River' },
      { activityId: 'canoe-safari', availability: 'seasonal', bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], notes: 'Lower Zambezi multi-day canoe trails' },
      { activityId: 'fishing', availability: 'seasonal', bestMonths: ['Sep', 'Oct', 'Nov'], notes: 'Tiger fish on Zambezi, Lake Kariba, Kafue' },
      { activityId: 'fly-camping', availability: 'seasonal', bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'], notes: 'South Luangwa walking trails' },
      { activityId: 'scenic-helicopter', availability: 'year-round', notes: 'Victoria Falls (Flight of Angels)' },
      { activityId: 'white-water-rafting', availability: 'year-round', notes: 'Victoria Falls—Grade 5 Batoka Gorge rapids' },
      { activityId: 'bungee-jumping', availability: 'year-round', notes: 'Victoria Falls Bridge, 111m' },
      { activityId: 'zip-lining', availability: 'year-round', notes: 'Victoria Falls gorge' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'Upper Zambezi, Lower Zambezi' },
      { activityId: 'photographic-hide', availability: 'year-round', notes: 'South Luangwa, Lower Zambezi' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Victoria Falls village, Kuomboka ceremony (seasonal)' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 750 species—South Luangwa (carmine bee-eaters), Liuwa Plain, Bangweulu Wetlands (shoebill)' },
      { activityId: 'horseback-safari', availability: 'year-round', notes: 'Kafue, Livingstone area' },
    ],
    accommodations: [
      { archetypeId: 'tented-camp', prevalence: 'common' },
      { archetypeId: 'classic-safari-lodge', prevalence: 'available' },
      { archetypeId: 'fly-camp', prevalence: 'common', notes: 'Walking safari specialty' },
      { archetypeId: 'mobile-camp', prevalence: 'available' },
    ],
    signature_experience: {
      title: 'Walking the Luangwa Valley',
      description: 'South Luangwa Valley is where the walking safari was born. Multi-night walking trails, sleeping in fly camps, moving through the bush with legendary guides. This is safari at its most authentic.',
      image_hint: 'Single-file walking safari through Luangwa Valley with African ebony trees and hippo pools',
    },
    typical_day: {
      dawn: 'Wake before light, quick coffee, set out on foot',
      morning: '4-5 hour walk through the valley, stopping to observe and learn',
      midday: 'Arrive at new fly camp, lunch, rest during heat',
      afternoon: 'Short afternoon walk or quiet game viewing from camp',
      evening: 'Dinner around the campfire, stories from the trail',
      night: 'Sleep under mosquito net, listening to lion and hyena',
    },
  },
  {
    destinationId: 'rwanda',
    destinationName: 'Rwanda',
    activities: [
      { activityId: 'gorilla-trekking', availability: 'year-round', notes: 'Volcanoes NP—permit required, book 6+ months ahead' },
      { activityId: 'golden-monkey-tracking', availability: 'year-round', notes: 'Volcanoes NP—endemic to Virunga Mountains' },
      { activityId: 'chimp-tracking', availability: 'year-round', notes: 'Nyungwe Forest NP—one of Africa\'s oldest rainforests' },
      { activityId: 'game-drive', availability: 'year-round', notes: 'Akagera NP—Big Five reintroduced (lion, rhino, elephant, leopard, buffalo)' },
      { activityId: 'boat-safari', availability: 'year-round', notes: 'Akagera lakes (Lake Ihema), hippo and crocodile viewing' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Nyungwe Forest canopy walk (60m high), Akagera' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Kigali Genocide Memorial, Iby\'Iwacu cultural village, traditional dance' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 700 species—Nyungwe (Albertine Rift endemics), Akagera' },
      { activityId: 'mountain-biking', availability: 'year-round', notes: 'Congo Nile Trail, Kigali, Musanze' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'Lake Kivu' },
      { activityId: 'zip-lining', availability: 'year-round', notes: 'Nyungwe Forest canopy' },
      { activityId: 'night-drive', availability: 'year-round', notes: 'Akagera NP' },
    ],
    accommodations: [
      { archetypeId: 'classic-safari-lodge', prevalence: 'common' },
      { archetypeId: 'tented-camp', prevalence: 'available' },
      { archetypeId: 'exclusive-villa', prevalence: 'available', notes: 'Gorilla lodges' },
    ],
    signature_experience: {
      title: 'Face to Face with Mountain Gorillas',
      description: 'Sitting with a habituated gorilla family in the Virunga bamboo forest is transformative. The silverback\'s gaze, the infants playing, the profound sense of kinship. Nothing prepares you for this encounter.',
      image_hint: 'Mountain gorilla silverback in misty bamboo forest with trekkers observing respectfully',
    },
    typical_day: {
      dawn: '4:30am early breakfast at your lodge before gorilla briefing',
      morning: 'Trek through bamboo forest (30 minutes to 6 hours) to find gorilla family',
      midday: 'One hour with the gorillas, descend to lunch, rest and reflect',
      afternoon: 'Community walk, golden monkey tracking, or leisure',
      evening: 'Dinner overlooking the volcanoes, discussing the day\'s encounter',
      night: 'Early rest—trekking is physically demanding',
    },
  },
  {
    destinationId: 'uganda',
    destinationName: 'Uganda',
    activities: [
      { activityId: 'gorilla-trekking', availability: 'year-round', notes: 'Bwindi Impenetrable Forest, Mgahinga Gorilla National Park' },
      { activityId: 'chimp-tracking', availability: 'year-round', notes: 'Kibale Forest (best in Africa), Budongo Forest, Kyambura Gorge' },
      { activityId: 'golden-monkey-tracking', availability: 'year-round', notes: 'Mgahinga Gorilla National Park' },
      { activityId: 'game-drive', availability: 'year-round', notes: 'Queen Elizabeth NP, Murchison Falls NP, Kidepo Valley NP, Lake Mburo NP, Semuliki NP' },
      { activityId: 'boat-safari', availability: 'year-round', notes: 'Kazinga Channel (Queen Elizabeth), Murchison Falls (Nile), Lake Mburo' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Lake Mburo, Ziwa Rhino Sanctuary, Kidepo Valley' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Batwa communities, Karamojong culture in Kidepo' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Over 1,000 species—Bwindi, Queen Elizabeth, Mabamba Swamp for shoebill' },
      { activityId: 'white-water-rafting', availability: 'year-round', notes: 'Jinja—Adventure Capital of East Africa, Grade 3-5 Nile rapids' },
      { activityId: 'bungee-jumping', availability: 'year-round', notes: 'Nile High Bungee at Jinja, 44m drop' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'Jinja Nile waters, beginner to advanced options' },
      { activityId: 'stand-up-paddleboarding', availability: 'year-round', notes: 'Calm Nile backwaters at Jinja' },
      { activityId: 'quad-biking', availability: 'year-round', notes: 'Jinja area, community trails' },
      { activityId: 'zip-lining', availability: 'year-round', notes: 'Nile River zip-lines at Jinja' },
      { activityId: 'mountain-biking', availability: 'year-round', notes: 'Jinja trails, Lake Mburo' },
      { activityId: 'source-of-nile', availability: 'year-round', notes: 'Jinja—where Nile exits Lake Victoria' },
      { activityId: 'fishing', availability: 'year-round', notes: 'Nile perch at Jinja, Lake Victoria' },
    ],
    accommodations: [
      { archetypeId: 'classic-safari-lodge', prevalence: 'common' },
      { archetypeId: 'tented-camp', prevalence: 'available' },
      { archetypeId: 'budget-camp', prevalence: 'common' },
      { archetypeId: 'exclusive-villa', prevalence: 'available', notes: 'Bwindi luxury options' },
    ],
    signature_experience: {
      title: 'Adventure Capital: Jinja on the Nile',
      description: 'Jinja is East Africa\'s adventure capital—where the White Nile begins its 6,650km journey to the Mediterranean. World-class white water rafting, bungee jumping, kayaking, and zip-lining combine with cultural heritage. The perfect counterpoint to gorilla trekking.',
      image_hint: 'Rafting team navigating massive Nile rapids at Jinja with spray and excitement',
    },
    typical_day: {
      dawn: '5:30am breakfast, prepare for forest trek or early game drive',
      morning: 'Chimp tracking through dense forest, or game drive in Kidepo or Queen Elizabeth',
      midday: 'Return to lodge for lunch and rest (forest trekking is humid)',
      afternoon: 'Boat safari on Kazinga Channel, forest birding walk, or Jinja adventure activity',
      evening: 'Dinner with views of crater lakes, forest edge, or Nile sunset',
      night: 'Listen to forest sounds—tree hyrax screams are unforgettable, or Jinja riverside sounds',
    },
  },
  {
    destinationId: 'namibia',
    destinationName: 'Namibia',
    activities: [
      { activityId: 'game-drive', availability: 'year-round', notes: 'Etosha NP (floodlit waterholes), Damaraland, private reserves' },
      { activityId: 'walking-safari', availability: 'year-round', notes: 'Desert-adapted wildlife tracking with local guides' },
      { activityId: 'quad-biking', availability: 'year-round', notes: 'Sossusvlei dunes, Swakopmund coastal desert' },
      { activityId: 'scenic-helicopter', availability: 'year-round', notes: 'Skeleton Coast, Sossusvlei, Deadvlei' },
      { activityId: 'hot-air-balloon', availability: 'year-round', notes: 'Sossusvlei over dunes at dawn' },
      { activityId: 'cultural-visit', availability: 'year-round', notes: 'Himba communities, Herero culture' },
      { activityId: 'photographic-hide', availability: 'year-round', notes: 'Etosha waterholes' },
      { activityId: 'bird-watching', availability: 'year-round', notes: 'Coastal flamingos, Etosha, Caprivi Strip' },
      { activityId: 'kayaking', availability: 'year-round', notes: 'Cape Cross seal colonies, Walvis Bay' },
      { activityId: 'fishing', availability: 'year-round', notes: 'Skeleton Coast surf fishing' },
    ],
    accommodations: [
      { archetypeId: 'classic-safari-lodge', prevalence: 'common' },
      { archetypeId: 'tented-camp', prevalence: 'common', notes: 'Desert camps, Damaraland' },
      { archetypeId: 'budget-camp', prevalence: 'common', notes: 'Self-drive circuit' },
      { archetypeId: 'exclusive-villa', prevalence: 'available', notes: 'Skeleton Coast luxury' },
    ],
    signature_experience: {
      title: 'Sunrise Over Sossusvlei Dunes',
      description: 'Climbing Dune 45 before dawn to watch first light paint the world\'s oldest desert in shades of red, orange, and gold. The scale is humbling—dunes reaching 300 meters, stark white pans, and thousand-year-old trees.',
      image_hint: 'Silhouette of person climbing red Sossusvlei dune at sunrise with long shadows',
    },
    typical_day: {
      dawn: '4:30am departure to catch first light on dunes or drive to Etosha waterhole',
      morning: 'Explore Deadvlei, photograph dunes, or game drive in Etosha',
      midday: 'Retreat from heat, lunch at lodge, siesta',
      afternoon: 'Desert walk tracking desert-adapted elephants, or sundowner on dune',
      evening: 'Dinner under vast starscape—some of Earth\'s darkest skies',
      night: 'Star photography, jackals calling in the desert silence',
    },
  },
];

/**
 * Get profile by destination ID
 */
export function getProfileByDestination(
  destinationId: string
): DestinationActivityProfile | undefined {
  return destinationProfiles.find(
    (p) => p.destinationId.toLowerCase() === destinationId.toLowerCase()
  );
}

/**
 * Get all destinations offering a specific activity
 */
export function getDestinationsForActivity(activityId: string): string[] {
  return destinationProfiles
    .filter((p) => p.activities.some((a) => a.activityId === activityId))
    .map((p) => p.destinationName);
}

/**
 * Get activities available at a destination
 */
export function getActivitiesForDestination(
  destinationId: string
): DestinationActivityProfile['activities'] {
  const profile = getProfileByDestination(destinationId);
  return profile?.activities ?? [];
}

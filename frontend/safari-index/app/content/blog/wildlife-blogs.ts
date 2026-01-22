/**
 * Wildlife-Specific Decision Blogs
 *
 * Blogs for wildlife-related safari decisions.
 * Topics: seeing specific animals, wildlife behavior, species guides
 */

import { registerBlog, type BlogContent } from '../../../lib/blog-content';

// ============================================================
// best-time-see-lions: When is the best time to see lions?
// ============================================================
const bestTimeLionsBlog: BlogContent = {
  decisionSlug: 'best-time-see-lions',
  title: 'When is the best time to see lions?',
  subtitle: 'Understanding lion behavior and seasonal viewing patterns',
  updatedAt: '2025-01',
  wordCount: 1260,
  published: true,
  heroImage: {
    src: '/images/activities/big-cats.jpg',
    alt: 'Male lion resting in golden savannah grass',
  },

  verdictBox: {
    verdict: 'Lions are visible year-round in good destinations. Dry season (June-October) concentrates prey and improves predictability. Dawn drives maximize active lion encounters.',
    recommendation: 'Choose high-density destinations like Serengeti, Masai Mara, or Ngorongoro for best odds.',
    outcome: 'yes',
  },

  comparisonTable: {
    leftHeader: 'Dry Season (Jun-Oct)',
    rightHeader: 'Wet Season (Nov-May)',
    rows: [
      { left: 'Lions predictable around water', right: 'Lions dispersed across landscape' },
      { left: 'Higher prices, more tourists', right: 'Lower prices, fewer crowds' },
      { left: 'Easier photography in sparse bush', right: 'Lush scenery, harder visibility' },
      { left: 'Best for guaranteed sightings', right: 'Best for value and green landscapes' },
    ],
  },

  author: {
    name: 'Juma Mkwawa',
    role: 'Head Guide',
    credentials: '18 years guiding in Serengeti and Ngorongoro',
  },

  whyNotSimple: `Lions are present year-round in most safari destinations. You do not need specific timing to see lions. They are resident animals, not migratory.

But lion visibility varies by season and time of day. Dry season concentrates prey around water, and lions follow prey. Wet season disperses animals across the landscape. Time of day matters because lions are primarily crepuscular and nocturnal.

Understanding these patterns helps optimize your chances without chasing imaginary windows.`,

  variables: `**Season affects prey concentration** and therefore lion positioning. Dry season brings herbivores to predictable water sources. Lions stake out these areas. Wet season spreads prey across abundant water and grazing, dispersing lions as well.

**Time of day matters most.** Lions are most active at dawn and dusk. Mid-day typically finds them sleeping in shade. Early morning game drives maximize sighting probability of active lions.

**Destination affects lion density.** The Serengeti and Masai Mara have Africa's highest lion densities. The Okavango has excellent lion populations. Some parks have very few lions.

**Guide quality affects finding lions.** Experienced guides know pride territories, read landscape for movement patterns, and communicate with other guides. Good guiding substantially increases lion sighting probability.`,

  tradeoffs: `Dry season offers more predictable lion positioning around water. The trade is higher prices, more tourists, and dustier conditions.

Wet season disperses lions but offers fewer crowds, lower prices, and lush landscapes. Finding specific lions takes more effort.

Dawn and dusk game drives are cold and require early wake-ups. Mid-day comfort comes with lower lion activity.`,

  misconceptions: `Lions are not rare on safari. In good lion destinations, sightings are probable, often daily. Multiple encounters per trip are common.

You do not need special timing to see lions. Year-round sightings are normal in lion-rich destinations.

Male lions do hunt, despite the narrative that females do all work. Males specialize in different prey.`,

  breaksDown: `If lions are essential, choose high-density destinations. Serengeti, Masai Mara, Ngorongoro, and Okavango deliver most reliably.

If you want active lions rather than sleeping lions, prioritize dawn drives and accept early mornings.

If lion photography with good light is the goal, golden hour timing plus patient positioning provides best results.`,

  ourApproach: `We position itineraries for lion probability based on destination selection and timing optimization. We set realistic expectations without overselling guaranteed sightings.`,

  relatedDecisions: [
    { slug: 'big-five-expectations', title: 'Will I see the Big Five?', type: 'decision' },
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth it?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/lion-guide', title: 'Lion Safari Guide', type: 'guide' },
    { slug: 'wildlife/predator-viewing', title: 'Predator Viewing Guide', type: 'guide' },
  ],
};

// ============================================================
// leopard-sighting-tips: How do I maximize leopard sighting chances?
// ============================================================
const leopardSightingBlog: BlogContent = {
  decisionSlug: 'leopard-sighting-tips',
  title: 'How do I maximize leopard sighting chances?',
  subtitle: 'Understanding why leopards are difficult and where to find them',
  updatedAt: '2025-01',
  wordCount: 1300,
  published: true,
  heroImage: {
    src: '/images/destinations/south-africa-leopard.jpg',
    alt: 'Leopard resting on tree branch in dappled sunlight',
  },

  verdictBox: {
    verdict: 'Sabi Sands in South Africa offers Africa\'s highest leopard sighting rates. Elsewhere, leopards are elusive and sightings are bonuses, not expectations.',
    recommendation: 'If leopards are essential, choose Sabi Sands. If secondary, accept them as fortunate bonuses.',
    outcome: 'depends',
  },

  comparisonTable: {
    leftHeader: 'Sabi Sands (SA)',
    rightHeader: 'Other Destinations',
    rows: [
      { left: 'Daily sightings common', right: 'Sightings unpredictable' },
      { left: 'Habituated leopards', right: 'Leopards avoid vehicles' },
      { left: 'Premium pricing', right: 'Various price points' },
      { left: 'Best for leopard priority', right: 'Better for general safari' },
    ],
  },

  author: {
    name: 'David Mabunda',
    role: 'Senior Tracker',
    credentials: '22 years tracking in Greater Kruger reserves',
  },

  whyNotSimple: `Leopards are solitary, nocturnal, and exceptionally well-camouflaged. Unlike lions, they do not live in visible prides. Unlike elephants, they actively avoid detection. Seeing a leopard requires finding an animal that does not want to be found.

Some destinations have habituated leopards that tolerate vehicles and are therefore more visible. These destinations offer dramatically higher sighting probability. Elsewhere, leopards exist but sightings are lucky bonuses rather than expectations.

The question is whether you should specifically pursue leopard or accept it as a fortunate possibility.`,

  variables: `**Destination matters enormously.** South Africa's Sabi Sands has Africa's best leopard sighting rates due to decades of habituation. Some Sabi Sands properties see leopards daily. The Masai Mara's Mara Triangle has habituated individuals. Most other destinations have leopards but at lower visibility.

**Guide expertise makes the difference** in non-habituated areas. Finding leopards requires tracking skills, knowledge of territorial movements, and awareness of alarm calls from other animals.

**Trip length increases probability.** More days means more chances. Even in good leopard areas, individuals move unpredictably.

**Time of day affects activity.** Leopards are primarily nocturnal. Dawn and dusk provide best chances of activity. Night drives, where permitted, significantly increase sighting probability.`,

  tradeoffs: `Prioritizing leopard destinations means Sabi Sands or similar specialized areas. The trade is cost—these are premium destinations—and missing migration and other East African spectacles.

Accepting leopard as bonus rather than goal reduces pressure. Expectations align with probability. Sightings feel like gifts rather than requirements.

Night drives increase leopard probability but are not permitted in national parks, only private reserves and conservancies.`,

  misconceptions: `Leopard sightings are not common at most destinations. Marketing shows leopards everywhere. Reality is more limited.

Habituated does not mean tame. Sabi Sands leopards are wild animals that have learned vehicles are not threatening. They behave naturally while tolerating observation.

Trees are not the only place to look. Leopards climb trees but spend significant time on the ground, in thickets, and moving through cover.`,

  breaksDown: `If leopard is essential, choose Sabi Sands or similarly specialized destinations. Accept the cost and East Africa trade-off.

If you want East Africa and leopard, the Mara Triangle and certain Serengeti areas offer better-than-average odds.

If leopard is nice-to-have, position for other priorities and enjoy any leopard sightings as bonuses.`,

  ourApproach: `We evaluate leopard priority against other goals. If leopard is essential, we recommend destinations that deliver. If leopard is secondary, we set expectations appropriately for chosen destinations.`,

  relatedDecisions: [
    { slug: 'sabi-sands-vs-timbavati', title: 'Sabi Sands or Timbavati?', type: 'decision' },
    { slug: 'south-africa-vs-east-africa-safari', title: 'South Africa or East Africa?', type: 'decision' },
    { slug: 'big-five-expectations', title: 'Will I see the Big Five?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'south-africa-kruger', title: 'South Africa Kruger Safari', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/leopard-guide', title: 'Leopard Safari Guide', type: 'guide' },
    { slug: 'destination/sabi-sands-guide', title: 'Sabi Sands Guide', type: 'guide' },
  ],
};

// ============================================================
// wild-dogs-where-to-see: Where can I see African wild dogs?
// ============================================================
const wildDogsBlog: BlogContent = {
  decisionSlug: 'wild-dogs-where-to-see',
  title: 'Where can I see African wild dogs?',
  subtitle: 'Finding Africa\'s most endangered large predator',
  updatedAt: '2025-01',
  wordCount: 1280,
  published: true,
  heroImage: {
    src: '/images/wildlife/wild-dogs.jpg',
    alt: 'Pack of African wild dogs on the hunt',
  },

  verdictBox: {
    verdict: 'Botswana (Moremi/Khwai), Zambia (South Luangwa), and Zimbabwe (Mana Pools) offer best wild dog odds. Denning season (May-August) concentrates dogs for easier sighting.',
    recommendation: 'If wild dogs are priority, choose these destinations during denning season.',
    outcome: 'depends',
  },

  comparisonTable: {
    leftHeader: 'Best Wild Dog Areas',
    rightHeader: 'Limited Wild Dog Areas',
    rows: [
      { left: 'Botswana Moremi/Khwai', right: 'Serengeti (rare)' },
      { left: 'Zambia South Luangwa', right: 'Masai Mara (very rare)' },
      { left: 'Zimbabwe Mana Pools', right: 'Kruger (unpredictable)' },
      { left: 'Denning: May-Aug best', right: 'Year-round: luck dependent' },
    ],
  },

  author: {
    name: 'Kelvin Tembo',
    role: 'Wildlife Guide',
    credentials: '15 years guiding in South Luangwa, wild dog specialist',
  },

  whyNotSimple: `African wild dogs are endangered, with fewer than 6,000 remaining in the wild. They need vast territories and roam unpredictably. Unlike lions that hold stable territories, wild dog packs cover enormous areas.

This makes sightings genuinely difficult. You cannot stake out a known location. You must be in the right place when dogs move through. Some destinations have better odds because of pack territories overlapping with safari areas, but even there, sightings are not guaranteed.

If wild dogs are a priority, destination selection and trip length matter significantly.`,

  variables: `**Destination affects probability dramatically.** Botswana's Moremi and Khwai have regular wild dog sightings. Zambia's South Luangwa is known for dogs. Zimbabwe's Mana Pools has excellent populations. East Africa has dogs but sightings are rare.

**Pack denning season** concentrates dogs. When packs den to raise pups, they remain in defined areas for several weeks. This typically happens May through August. Denning season offers the best sighting probability.

**Trip length matters** because dogs move unpredictably. More days means more chances of being in the right place.

**Guide communication networks** help track dog movements. In good wild dog areas, guides share sightings. Finding dogs often means following recent reports.`,

  tradeoffs: `Prioritizing wild dog destinations means Botswana or Zambia rather than East Africa. The trade is cost (Botswana is expensive) and missing migration (not available in these regions).

Denning season visits maximize probability but may not align with your travel schedule.

Extended stays increase probability but cost more. Short trips in good areas might see dogs; they might not.`,

  misconceptions: `Wild dogs are not related to domestic dogs. They are a distinct species with unique social structure.

Wild dogs are not less impressive than cats. Many experienced safari-goers consider them Africa's most exciting predator to watch. Pack hunts are extraordinary.

Dogs can appear anywhere they roam, not just at water. Unlike cats resting by water, dogs are constantly moving.`,

  breaksDown: `If wild dogs are essential, choose Botswana's northern parks, Zambia's South Luangwa, or Zimbabwe's Mana Pools. Accept the destination trade-offs.

If visiting during denning season, your odds improve significantly. Research specific pack territories.

If wild dogs are nice-to-have from East Africa trips, enjoy the rare occasions when they appear but do not expect them.`,

  ourApproach: `We evaluate wild dog priority against other goals and recommend destinations accordingly. We set realistic expectations based on actual sighting probability at chosen destinations.`,

  relatedDecisions: [
    { slug: 'big-five-expectations', title: 'Will I see the Big Five?', type: 'decision' },
    { slug: 'tanzania-vs-botswana-safari', title: 'Tanzania or Botswana?', type: 'decision' },
    { slug: 'walking-safari-worth-it', title: 'Is walking safari worth it?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'botswana-okavango-delta', title: 'Botswana Okavango Delta Safari', type: 'trip' },
    { slug: 'zambia-south-luangwa', title: 'Zambia South Luangwa Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/wild-dogs-guide', title: 'African Wild Dogs Guide', type: 'guide' },
    { slug: 'wildlife/endangered-species', title: 'Endangered Species Viewing', type: 'guide' },
  ],
};

// ============================================================
// rhino-conservation-viewing: Where can I see rhinos?
// ============================================================
const rhinoViewingBlog: BlogContent = {
  decisionSlug: 'rhino-conservation-viewing',
  title: 'Where can I see rhinos?',
  subtitle: 'Rhino conservation and the best viewing destinations',
  updatedAt: '2025-01',
  wordCount: 1300,
  published: true,
  heroImage: {
    src: '/images/wildlife/rhino.jpg',
    alt: 'White rhinoceros in African grassland',
  },

  verdictBox: {
    verdict: 'Ngorongoro Crater offers best black rhino odds in East Africa. South African reserves offer both species most reliably. Many destinations have few or no rhinos.',
    recommendation: 'If rhinos are essential, choose Ngorongoro (black) or Greater Kruger reserves (both species).',
    outcome: 'depends',
  },

  comparisonTable: {
    leftHeader: 'White Rhino',
    rightHeader: 'Black Rhino',
    rows: [
      { left: 'More common (wider mouth)', right: 'Critically endangered' },
      { left: 'Best in South Africa, Zimbabwe', right: 'Best in Ngorongoro, Kenya conservancies' },
      { left: 'Grazers, open grassland', right: 'Browsers, thicker bush' },
      { left: 'Often seen in groups', right: 'Solitary, more elusive' },
    ],
  },

  author: {
    name: 'Sarah Ngugi',
    role: 'Conservation Specialist',
    credentials: '12 years in rhino conservation and guiding',
  },

  whyNotSimple: `Rhinos have been devastated by poaching. Black rhino populations collapsed to under 5,000 animals. White rhinos, while more numerous, face ongoing threats. Many former rhino areas now have none.

This makes rhino sightings location-dependent. Some destinations have concentrated, protected populations where sightings are likely. Others that historically had rhinos no longer do. If rhinos are important to you, destination selection is critical.

Two species exist with different distributions. White rhinos are grazers more common in southern Africa. Black rhinos are browsers more common in East Africa but rarer overall.`,

  variables: `**Species determines destination.** White rhinos are easier to see in South Africa, Zimbabwe, and Botswana. Black rhinos are possible in Ngorongoro Crater, Kenya's conservancies, and some South African reserves.

**Security level correlates with viewing.** The most heavily protected rhino areas have the best populations. Ngorongoro's crater walls create natural protection. South African private reserves invest heavily in anti-poaching.

**Destination affects both species.** Some destinations like South Africa's Kruger and associated reserves have both species. Others have one or neither.

**Time of day matters.** Rhinos graze and browse at dawn and dusk. Mid-day often finds them resting in shade or water.`,

  tradeoffs: `Prioritizing rhino means South Africa or Ngorongoro for best odds. The trade is potentially missing other experiences these destinations do not offer.

Black rhinos are rarer and more elusive than white rhinos. Expecting both species requires specific destinations.

Rhino viewing contributes to conservation economics. Your visit supports the financial case for protection.`,

  misconceptions: `Rhinos are not common across Africa. Most safari destinations have few or none.

White and black rhinos are not distinguished by color. Both are grey. Names refer to mouth shape (white = wide, from Dutch "wijd").

Rhino encounters can be dangerous. These are large, sometimes aggressive animals. Guides maintain safe distances.`,

  breaksDown: `If rhino is essential, choose Ngorongoro for black rhino or South African reserves for white (and possibly black).

If visiting destinations without rhinos, accept that this animal will not be part of your trip.

If supporting conservation matters, rhino-focused destinations put tourism revenue directly toward protection.`,

  ourApproach: `We evaluate rhino priority and recommend destinations with viable populations. We set clear expectations for destinations without rhinos.`,

  relatedDecisions: [
    { slug: 'big-five-expectations', title: 'Will I see the Big Five?', type: 'decision' },
    { slug: 'ngorongoro-vs-serengeti', title: 'Ngorongoro or Serengeti?', type: 'decision' },
    { slug: 'south-africa-vs-east-africa-safari', title: 'South Africa or East Africa?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'south-africa-kruger', title: 'South Africa Kruger Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/rhino-guide', title: 'Rhino Safari Guide', type: 'guide' },
    { slug: 'wildlife/conservation-tourism', title: 'Conservation Tourism Guide', type: 'guide' },
  ],
};

// ============================================================
// cheetah-vs-leopard-sighting: Cheetah or leopard sighting priority?
// ============================================================
const cheetahVsLeopardBlog: BlogContent = {
  decisionSlug: 'cheetah-vs-leopard-priority',
  title: 'Should I prioritize cheetah or leopard?',
  subtitle: 'Understanding the different viewing challenges of Africa\'s spotted cats',
  updatedAt: '2025-01',
  wordCount: 1260,
  published: true,
  heroImage: {
    src: '/images/wildlife/cheetah.jpg',
    alt: 'Cheetah scanning savannah from termite mound',
  },

  verdictBox: {
    verdict: 'Cheetahs: East Africa (Serengeti, Mara). Leopards: Sabi Sands. Both cats require different destinations to maximize sighting odds.',
    recommendation: 'Prioritize based on your destination—cheetah hunts in East Africa or leopard reliability in Sabi Sands.',
    outcome: 'depends',
  },

  comparisonTable: {
    leftHeader: 'Cheetah',
    rightHeader: 'Leopard',
    rows: [
      { left: 'Diurnal (daytime hunter)', right: 'Nocturnal/crepuscular' },
      { left: 'Open grassland habitat', right: 'Woodland and thickets' },
      { left: 'Best in Serengeti/Mara', right: 'Best in Sabi Sands' },
      { left: 'Tolerates vehicles', right: 'Secretive (except habituated)' },
    ],
  },

  author: {
    name: 'Juma Mkwawa',
    role: 'Head Guide',
    credentials: '18 years guiding in Serengeti and Ngorongoro',
  },

  whyNotSimple: `Cheetahs and leopards are both spotted cats but have completely different behaviors and therefore different viewing patterns. Optimizing for one does not optimize for the other.

Cheetahs are diurnal, hunt in open savannah, and tolerate observation. They are visible when present. Leopards are nocturnal, secretive, and use cover. They actively avoid detection.

If both cats matter to you, understanding these differences helps set expectations and possibly influences destination choice.`,

  variables: `**Habitat preferences differ.** Cheetahs need open grassland for their hunting strategy. Leopards thrive in varied terrain with cover. Some destinations favor one or the other.

**Time of day matters differently.** Cheetahs are active during daylight, making standard game drives effective. Leopards are most active at night, making night drives valuable where permitted.

**Habituation affects visibility.** Sabi Sands leopards are habituated and relatively easy to see. Most leopards elsewhere are not. Cheetahs are generally more tolerant of vehicles but less predictable in location.

**Destination affects probability.** East Africa has excellent cheetah populations. Southern Africa has better habituated leopard viewing. Botswana has both at moderate probability.`,

  tradeoffs: `Prioritizing cheetah favors East Africa's open grasslands. The Serengeti and Mara have excellent cheetah populations.

Prioritizing leopard favors Sabi Sands specifically for reliability. Other destinations have leopards but at lower sighting rates.

Seeking both suggests destinations with moderate probability of each rather than high probability of one.`,

  misconceptions: `Cheetahs are not small leopards. They are a distinct species with different body structure, hunting behavior, and social patterns.

Cheetah sightings are not easy everywhere. While more visible than leopards, they are still wild predators with large territories.

You do not need to choose one or the other. Many destinations have both. The question is which to prioritize if forcing trade-offs.`,

  breaksDown: `If cheetah hunting is the goal, East Africa provides the best photography opportunities during daylight hunts.

If leopard reliability matters, Sabi Sands delivers better than anywhere else.

If both are equal priority, Botswana or the Mara offer reasonable probability of each.`,

  ourApproach: `We evaluate spotted cat priorities and recommend destinations accordingly. We set realistic expectations for each species based on chosen destination.`,

  relatedDecisions: [
    { slug: 'leopard-sighting-tips', title: 'How do I see leopards?', type: 'decision' },
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
    { slug: 'south-africa-vs-east-africa-safari', title: 'South Africa or East Africa?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'south-africa-kruger', title: 'South Africa Kruger Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/big-cats-guide', title: 'Big Cats Safari Guide', type: 'guide' },
    { slug: 'wildlife/predator-viewing', title: 'Predator Viewing Guide', type: 'guide' },
  ],
};

// ============================================================
// elephant-herds-best-locations: Where to see large elephant herds?
// ============================================================
const elephantHerdsBlog: BlogContent = {
  decisionSlug: 'elephant-herds-best-locations',
  title: 'Where can I see large elephant herds?',
  subtitle: 'Finding Africa\'s most impressive elephant concentrations',
  updatedAt: '2025-01',
  wordCount: 1240,
  published: true,
  heroImage: {
    src: '/images/destinations/amboseli-elephants.jpg',
    alt: 'Large elephant herd walking across savannah',
  },

  verdictBox: {
    verdict: 'Chobe (Botswana) and Hwange (Zimbabwe) offer largest herds during dry season. Amboseli offers iconic Kilimanjaro backdrop photography.',
    recommendation: 'For elephant spectacle, visit Chobe or Hwange July-October. For Kilimanjaro shots, choose Amboseli.',
    outcome: 'yes',
  },

  comparisonTable: {
    leftHeader: 'Best Elephant Destinations',
    rightHeader: 'Characteristics',
    rows: [
      { left: 'Chobe, Botswana', right: '130,000+ elephants, dry season river gatherings' },
      { left: 'Hwange, Zimbabwe', right: 'Large herds at pumped waterholes' },
      { left: 'Amboseli, Kenya', right: 'Kilimanjaro backdrop, research herds' },
      { left: 'Tarangire, Tanzania', right: 'Dry season migrations, baobab scenery' },
    ],
  },

  author: {
    name: 'Thabo Mokoena',
    role: 'Elephant Researcher',
    credentials: '14 years studying elephant behavior in Chobe',
  },

  whyNotSimple: `Elephants exist across safari Africa, but herd sizes vary dramatically. Some destinations have solitary bulls and small family groups. Others have concentrations of hundreds.

If large herds and elephant spectacle matter to you, destination selection is critical. The difference between destinations is not subtle—it is the difference between seeing ten elephants and seeing two hundred.`,

  variables: `**Water concentration in dry season** creates elephant gatherings. Botswana's Chobe during dry season has Africa's densest elephant populations. Zimbabwe's Hwange waterholes concentrate large numbers.

**Destination population size** varies. Botswana has over 130,000 elephants. Tanzania has significant populations. Some countries have lost most of theirs.

**Season affects concentration.** Dry season concentrates elephants at water. Wet season disperses them across available water sources.

**Terrain affects viewing.** Amboseli's flat plains make elephant herds visible at distance with Kilimanjaro backdrop. Forested areas obscure herd size.`,

  tradeoffs: `Prioritizing elephant herds favors Botswana's Chobe or Zimbabwe's Hwange during dry season. These deliver spectacle other destinations cannot match.

Amboseli offers iconic photography of elephants with Kilimanjaro but smaller herds than Botswana.

Migration destinations have elephants but they are not the focus. You see elephants but not the massive concentrations.`,

  misconceptions: `Elephants are not equally distributed across Africa. Some areas have exceptional populations. Others have very few.

Herd size varies by season. Dry season concentrations disperse when rains begin.

Elephant viewing is not just about numbers. Behavior, family interactions, and individual encounters can be as compelling as large herds.`,

  breaksDown: `If elephant spectacle is the priority, Chobe or Hwange in dry season delivers the most impressive concentrations.

If elephants are one of many priorities, most safari destinations provide adequate sightings without the massive herds.

If Kilimanjaro backdrop matters for photography, Amboseli is the only option regardless of herd size.`,

  ourApproach: `We evaluate elephant priority and recommend destinations with appropriate populations for your expectations. We clarify when elephant spectacle requires specific destinations versus being available generally.`,

  relatedDecisions: [
    { slug: 'chobe-vs-okavango', title: 'Chobe or Okavango?', type: 'decision' },
    { slug: 'amboseli-vs-masai-mara', title: 'Amboseli or Masai Mara?', type: 'decision' },
    { slug: 'big-five-expectations', title: 'Will I see the Big Five?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'botswana-chobe-delta', title: 'Botswana Chobe and Delta', type: 'trip' },
    { slug: 'kenya-amboseli-mara', title: 'Kenya Amboseli and Mara', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/elephant-guide', title: 'Elephant Safari Guide', type: 'guide' },
    { slug: 'destination/chobe-guide', title: 'Chobe National Park Guide', type: 'guide' },
  ],
};

// ============================================================
// hippo-croc-viewing: Where to see hippos and crocodiles?
// ============================================================
const hippoCrocBlog: BlogContent = {
  decisionSlug: 'hippo-crocodile-viewing',
  title: 'Where can I see hippos and crocodiles?',
  subtitle: 'Water-based wildlife viewing in African rivers and lakes',
  updatedAt: '2025-01',
  wordCount: 1200,
  published: true,
  heroImage: {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippos in river at sunset',
  },

  verdictBox: {
    verdict: 'Destinations with significant rivers or lakes offer best hippo and crocodile viewing. Mara River, Chobe River, and Luangwa River are top choices.',
    recommendation: 'Choose water-based destinations like Chobe, South Luangwa, or areas along the Mara River.',
    outcome: 'yes',
  },

  comparisonTable: {
    leftHeader: 'Best Water Safari Destinations',
    rightHeader: 'Features',
    rows: [
      { left: 'Chobe River, Botswana', right: 'Boat safaris, large hippo pods' },
      { left: 'Mara River, Kenya/Tanzania', right: 'Famous crossing point, crocodiles' },
      { left: 'South Luangwa, Zambia', right: 'Walking safaris along river' },
      { left: 'Okavango Delta, Botswana', right: 'Mokoro channels, water-based' },
    ],
  },

  author: {
    name: 'Gift Ngwenya',
    role: 'River Guide',
    credentials: '16 years conducting boat safaris on Chobe River',
  },

  whyNotSimple: `Hippos and crocodiles require water. Not all safari destinations have significant water features. If these species matter to you, destination selection must account for rivers, lakes, or deltas.

Beyond presence, viewing quality varies. A hippo pool with fifty animals differs from occasional hippo sightings in a stream. Crocodile size and visibility vary by location.`,

  variables: `**Water feature type** affects viewing. Rivers allow boat safaris alongside hippos. Lakes have different dynamics. Deltas spread animals across channels.

**Destination determines access.** The Mara River has famous hippo pools. Chobe River offers boat-based viewing. South Luangwa centers on the Luangwa River. Some destinations lack significant water.

**Season affects water levels.** High water disperses animals. Low water concentrates them in remaining pools and channels.

**Boat safari availability** enables different perspectives. Viewing hippos from water level differs from viewing from land.`,

  tradeoffs: `Prioritizing water wildlife requires water-based destinations. Botswana's waterways, Zambia's rivers, and specific Kenya and Tanzania locations deliver.

Dry savannah destinations have minimal hippo and crocodile presence. These animals simply are not there.

Boat safaris provide unique perspectives but exist only at certain destinations.`,

  misconceptions: `Hippos are Africa's most dangerous large animal. They kill more people than any predator. Respect distances.

Crocodiles are patient ambush predators. Most observations are basking animals. Active hunting is rare to witness.

Water features add dimension to safari. Hippo and croc are bonuses of water-based ecosystems, not the only attraction.`,

  breaksDown: `If hippo spectacle matters, rivers with large hippo populations deliver. The Mara River, Chobe River, and Luangwa are excellent.

If boat safari is a priority, destinations with this option are required.

If hippos and crocs are nice-to-have, most destinations with any water feature provide some sightings.`,

  ourApproach: `We evaluate water wildlife priority and include appropriate destinations with river or lake features. We identify when boat safari options add value.`,

  relatedDecisions: [
    { slug: 'chobe-vs-okavango', title: 'Chobe or Okavango?', type: 'decision' },
    { slug: 'walking-safari-worth-it', title: 'Is walking safari worth it?', type: 'decision' },
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'botswana-okavango-delta', title: 'Botswana Okavango Delta Safari', type: 'trip' },
    { slug: 'zambia-south-luangwa', title: 'Zambia South Luangwa Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/water-safari-guide', title: 'Water Safari Guide', type: 'guide' },
    { slug: 'activity/boat-safari', title: 'Boat Safari Guide', type: 'guide' },
  ],
};

// ============================================================
// giraffe-viewing-tips: Understanding giraffe viewing
// ============================================================
const giraffeViewingBlog: BlogContent = {
  decisionSlug: 'giraffe-viewing-tips',
  title: 'Where are the best giraffe sightings?',
  subtitle: 'Giraffe species, distributions, and viewing experiences',
  updatedAt: '2025-01',
  wordCount: 1180,
  published: true,
  heroImage: {
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Giraffe browsing acacia trees in African woodland',
  },

  verdictBox: {
    verdict: 'Giraffes are common across most safari destinations—you will see them. Different regions have different species with distinct patterns.',
    recommendation: 'No special planning needed. Enjoy the species you encounter at your destination.',
    outcome: 'yes',
  },

  comparisonTable: {
    leftHeader: 'Giraffe Species',
    rightHeader: 'Location',
    rows: [
      { left: 'Masai Giraffe (jagged patches)', right: 'Tanzania, Kenya' },
      { left: 'Reticulated Giraffe (geometric)', right: 'Northern Kenya' },
      { left: 'Southern Giraffe (rounded patches)', right: 'South Africa, Botswana, Zimbabwe' },
      { left: 'Rothschild Giraffe (rare)', right: 'Uganda, Kenya sanctuaries' },
    ],
  },

  author: {
    name: 'Anne Wambui',
    role: 'Safari Guide',
    credentials: '10 years guiding in Kenya diverse giraffe regions',
  },

  whyNotSimple: `Giraffes are common across safari destinations. You will almost certainly see giraffes. But different regions have different giraffe species with distinct patterns, and some areas have notably better viewing than others.

Understanding species distribution adds depth to sightings. The Masai giraffe in East Africa differs from the Southern giraffe in Botswana and South Africa.`,

  variables: `**Species varies by region.** Masai giraffes (jagged patches) in Tanzania and Kenya. Reticulated giraffes (geometric patterns) in northern Kenya. Southern giraffes (rounded patches) in southern Africa. Nubian and other species elsewhere.

**Habitat affects visibility.** Open woodland with scattered acacias provides best viewing. Dense forest obscures these tall animals.

**Giraffe density varies.** Some destinations have abundant populations. Others have fewer giraffes despite suitable habitat.`,

  tradeoffs: `Seeing multiple species requires visiting multiple regions. A single trip typically encounters one or two species.

Open savannah destinations provide better viewing than forested areas where giraffes are present but obscured.

Giraffes are rarely the main attraction but consistently delight visitors.`,

  misconceptions: `All giraffes are not the same species. Recent research identified four distinct species with subspecies.

Giraffes are not rare. Most safari destinations have healthy populations.

Giraffe behavior can be fascinating. Drinking positions, sparring males, and feeding on thorny acacias provide interesting observation.`,

  breaksDown: `If specific species matter, research which species inhabit your destination.

If quality giraffe viewing is a priority, open woodland habitats deliver best.

For most travelers, giraffes are reliably seen without specific planning.`,

  ourApproach: `We note giraffe species at destinations and include locations with quality viewing opportunities. We help travelers appreciate species differences.`,

  relatedDecisions: [
    { slug: 'big-five-expectations', title: 'Will I see the Big Five?', type: 'decision' },
    { slug: 'tanzania-vs-kenya-first-safari', title: 'Tanzania or Kenya?', type: 'decision' },
    { slug: 'south-africa-vs-east-africa-safari', title: 'South Africa or East Africa?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'wildlife/giraffe-guide', title: 'Giraffe Species Guide', type: 'guide' },
    { slug: 'wildlife/browser-guide', title: 'African Browsers Guide', type: 'guide' },
  ],
};

// ============================================================
// Register all wildlife blogs
// ============================================================
export function registerWildlifeBlogs(): void {
  registerBlog(bestTimeLionsBlog);
  registerBlog(leopardSightingBlog);
  registerBlog(wildDogsBlog);
  registerBlog(rhinoViewingBlog);
  registerBlog(cheetahVsLeopardBlog);
  registerBlog(elephantHerdsBlog);
  registerBlog(hippoCrocBlog);
  registerBlog(giraffeViewingBlog);
}

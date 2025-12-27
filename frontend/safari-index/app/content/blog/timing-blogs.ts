/**
 * Timing Decision Blogs
 *
 * Blogs for timing-related safari decisions.
 * great-migration-timing is in main index.ts
 */

import { registerBlog, type BlogContent } from '../../../lib/blog-content';

// ============================================================
// mara-river-crossings-timing: When is the best time to see river crossings?
// ============================================================
const maraRiverCrossingsBlog: BlogContent = {
  decisionSlug: 'mara-river-crossings-timing',
  title: 'When is the best time to see river crossings?',
  subtitle: 'Understanding the unpredictability of migration crossings',
  updatedAt: '2025-01',
  wordCount: 1380,
  published: true,

  whyNotSimple: `River crossings are the most requested, most photographed, and most misunderstood element of the Great Migration. That footage you have seen of wildebeest plunging into crocodile-filled water while dust swirls and chaos erupts took professional film crews months of waiting to capture.

The crossings happen when they happen. Not when the camps say. Not when the guides predict. Not when your itinerary assumes. A lead wildebeest makes a decision, and then hundreds of thousands follow. That decision might happen at 5:30 AM before you leave camp, or at 2 PM during lunch, or not at all for three days.

This is not a scheduled event you can book tickets to. It is wild animal behavior that you position yourself to witness if the timing aligns.`,

  variables: `**The month** determines where crossings are likely. The Grumeti River in the western Serengeti sees crossings first, typically June through early July. The Mara River crossings, the famous ones, happen from late July through October. The herds cross multiple times in both directions throughout this window. See [the full migration timing](/decisions/great-migration-timing) for context.

**How long you stay** directly affects your odds. A three-day visit to the crossing zone might miss every crossing. A seven-day stay dramatically improves your chances. The herds might cross every day for a week, then go quiet for four days. There is no pattern predictable enough to plan around.

**Your crossing point choice** matters. The Mara River has multiple crossing points. Some are more accessible. Some have better viewing angles. Camps position themselves near different points. Where you stay affects which crossings you can reach quickly when herds start gathering.

**Time of day flexibility** is essential. Crossings can happen any time. If you commit to being back at the lodge for lunch at 12:30 PM, you might miss the crossing that starts at 12:45 PM. The best crossing experiences often go to people who bring lunch into the field and stay out all day.

**Your tolerance for waiting** gets tested. Watching a herd gather at the river's edge for three hours, thinking the crossing is imminent, only to see them turn back and walk away is standard. This happens multiple times. It is frustrating. Some travelers enjoy the tension. Others find it maddening.`,

  tradeoffs: `Peak crossing season from August through September offers the highest probability but the highest prices and largest crowds. You will not be the only vehicle at the river. Popular crossing points might have thirty or forty vehicles jockeying for position. Exclusivity and crossing probability pull in opposite directions.

The Mara side of the river is in Kenya. The Serengeti side is in Tanzania. Both offer crossings. Kenya's [Masai Mara](/decisions/serengeti-vs-masai-mara) is smaller and more accessible, meaning more vehicles at each crossing. Tanzania's northern Serengeti is vast, offering more solitude but requiring longer drives between crossing points.

Private concessions and conservancies offer vehicle limits but may not be positioned at the best crossing points. You trade crowd control for proximity. The [Kenya Classic Safari](/itineraries/kenya-classic-safari) balances these factors.

Booking far in advance locks you into dates that might not align with where herds actually are. The migration varies year to year based on rainfall. Booking flexibility, while logistically harder and often more expensive, lets you adjust to current conditions.`,

  misconceptions: `The herds do not cross once. They cross and re-cross the Mara River multiple times over months, moving back and forth between grazing areas. A crossing is not a single migration moment but one of many movements.

Guides cannot predict exactly when crossings happen. They know where herds are massing and which crossing points look active. But the decision to cross is made by animals, not guides. Claims of guaranteed crossings are marketing fiction.

Crossings do not require crocodiles attacking. Some crossings are orderly. Herds cross steadily, crocodiles are present but not actively hunting, and animals reach the other side without incident. The dramatic death footage represents a fraction of total crossings.

Missing a crossing does not mean the trip failed. The migration is not just crossings. Millions of animals moving across the landscape, predator-prey interactions, the scale of the herds themselves are all part of the migration experience.`,

  breaksDown: `If you have exactly three days in the crossing zone during peak season, your odds are maybe 50 percent. That might be acceptable or unacceptable depending on your expectations. Extending to five or six days pushes odds significantly higher.

If you specifically need the dramatic, chaotic, crocodile-attack footage you have seen in documentaries, you need a dedicated photography trip with flexible dates, a willingness to wait at the river for full days, and some luck. Standard safari itineraries optimize for overall experience, not single-image obsession.

If crossing crowds genuinely ruin the experience, consider [calving season](/decisions/calving-season-safari) instead. Predator action is reliable, crowds are lower, and you are not competing with documentary crews for position. The trade is spectacle type, not spectacle intensity.`,

  ourApproach: `We evaluate crossing probability using your travel dates, trip length, and flexibility. We can position you in high-probability zones during high-probability windows.

What we cannot do is guarantee anything. The honest answer is always conditional. Your odds are good, or your odds are moderate, or your dates miss the crossing window entirely. We name what we can influence and what we cannot.`,

  relatedDecisions: [
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
    { slug: 'calving-season-safari', title: 'Is calving season worth planning around?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-great-migration', title: 'Tanzania Great Migration Safari', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/migration-calendar', title: 'Migration Calendar', type: 'guide' },
    { slug: 'timing/crossing-points', title: 'Crossing Point Guide', type: 'guide' },
  ],
};

// ============================================================
// calving-season-safari: Is calving season worth planning around?
// ============================================================
const calvingSeasonBlog: BlogContent = {
  decisionSlug: 'calving-season-safari',
  title: 'Is calving season worth planning around?',
  subtitle: 'Understanding the predator action and wildlife intensity of February',
  updatedAt: '2025-01',
  wordCount: 1340,
  published: true,

  whyNotSimple: `River crossings get all the attention. Calving season gets overlooked. This is a marketing failure, not a wildlife reality.

From late January through February, approximately 400,000 wildebeest calves are born over a roughly three-week window in the southern Serengeti. The birthing synchronization evolved as a survival strategy. Predators cannot possibly eat all the calves if they all arrive at once.

But predators try. Lions, cheetahs, hyenas, and wild dogs concentrate in the calving zone. The hunting is relentless. Every morning, every evening, predators are actively hunting vulnerable newborns. This is not waiting for a crossing to maybe happen. This is guaranteed predator action, day after day.`,

  variables: `**Your interest in predator behavior** determines whether calving season delivers. If you came for the wildlife drama of hunting and survival, calving season offers some of the most intense sustained action anywhere in Africa. If you came specifically for the river crossing image, calving season cannot provide that.

**Your photography goals** might favor calving. Open plains in the Ndutu area provide unobstructed sightlines. Cheetahs hunting newborn wildebeest in open grassland is more photographable than river crossings surrounded by thirty vehicles. The light is good. The backgrounds are clean.

**Your travel flexibility** affects whether February works. Calving season is short. It peaks for maybe three weeks. Some years it is earlier, some years later, depending on rainfall patterns. If your dates are fixed to mid-February, you might hit the peak or you might arrive after most births have occurred.

**Your tolerance for dust and heat** matters. Late January through February in the southern Serengeti is dry and warm. Roads are dusty. Days are hot. This is dry season conditions at their most intense.

**Budget sensitivity** plays a role. Calving season is high season but generally less expensive than the August through September crossing peak. Demand is high but not quite at the same level as river crossing season.`,

  tradeoffs: `Calving offers reliability that crossings cannot. Predators hunt every day. You will see kills. You will see chases. The action is distributed across the day and across the landscape rather than concentrated at a single crossing point that may or may not activate.

The trade is fame. Calving season footage does not have the same cultural penetration as crossing footage. If you want the image everyone recognizes, calving cannot provide it. If you want intense wildlife experiences, calving outperforms crossings for most visitors.

The southern Serengeti during calving has fewer lodge options than the central and northern regions during peak season. Accommodation around Ndutu fills months in advance. If you book late, you may end up based further from the action.

Calving season coincides with lower crowd levels in the specific calving zone. The herds are concentrated in a relatively compact area. Vehicles are present but the ratio of animals to vehicles is more favorable than popular crossing points. The [Tanzania Great Migration Safari](/itineraries/tanzania-great-migration) can be timed for calving.`,

  misconceptions: `Calving is not baby animal photos. It is life and death on an industrial scale. Hundreds of thousands of births means thousands of deaths. The circle of life rhetoric is accurate but sanitized. What you witness is brutal.

The calves are not helpless for long. Within minutes of birth, a wildebeest calf can stand and run. Within days, they can keep up with the herd. The vulnerability window is brief, which is why predator pressure is so intense during peak calving.

You do not need to see a birth to see calving season. The newborns, the hunting, the predator-prey dynamics are happening constantly. Actual births are quick and often missed. The aftermath is everywhere.

Calving is migration. The herds in the southern Serengeti in February are the migration. They have migrated from the north. They will migrate north again. This is not a separate event.`,

  breaksDown: `If river crossing footage is specifically what you came for, calving season cannot deliver. The rivers are in the north. The calving is in the south. These are different parts of the same ecosystem at different times of year.

If you cannot travel between late January and late February, calving season is not accessible to you. It is a narrow window that does not flex.

If predator hunting intensity makes you uncomfortable, calving season will be difficult. The hunting is constant and successful. You will see animals die. If that experience is not what you want, other seasons offer gentler wildlife viewing.`,

  ourApproach: `We evaluate calving season fit using your dates, predator interest level, and what aspects of the migration appeal to you. If you are flexible to late January through February and want sustained wildlife action, calving often provides better experiences than crossing season.

The verdict reflects wildlife behavior probabilities. Calving season delivers more consistent intensity with less waiting and gambling. We name that clearly.`,

  relatedDecisions: [
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'mara-river-crossings-timing', title: 'When is the best time to see river crossings?', type: 'decision' },
    { slug: 'tanzania-safari-february', title: 'Is February a good time for Tanzania safari?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-great-migration', title: 'Tanzania Great Migration Safari', type: 'trip' },
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/calving-explained', title: 'Calving Season Explained', type: 'guide' },
    { slug: 'wildlife/predator-behavior', title: 'Predator Behavior Guide', type: 'guide' },
  ],
};

// ============================================================
// green-season-safari-worth-it: Is green season safari worth it?
// ============================================================
const greenSeasonBlog: BlogContent = {
  decisionSlug: 'green-season-safari-worth-it',
  title: 'Is green season safari worth it?',
  subtitle: 'Understanding the trade-offs of wet season travel',
  updatedAt: '2025-01',
  wordCount: 1420,
  published: true,

  whyNotSimple: `Green season is the industry's rebrand of what used to be called low season or rainy season. The renaming was marketing, but the underlying value proposition is real.

From roughly March through May in East Africa and November through March in southern Africa, rainfall transforms the landscape. Dry savannas turn green. Waterholes that were wildlife magnets become irrelevant as water is everywhere. Animals disperse. Vegetation thickens. Roads get muddy.

The trade is access. Green season rates drop 20 to 40 percent. Crowds thin dramatically. Lodges that were fully booked in peak season have availability. If you can accept the constraints, green season offers genuine value.`,

  variables: `**Your destination** determines what green season actually means. In Tanzania and Kenya, the long rains from March through May are the wettest, with some camps closing entirely. Short rains in November are lighter and rarely disrupt travel. In Botswana, the wet season runs November through March, with January and February being the wettest months. Each destination has different patterns.

**Your wildlife priorities** might work with or against green season. Bird populations explode. Migratory species arrive. Newborn animals appear. But predator sightings often decrease as prey disperses and vegetation provides more cover. If big cats are your priority, green season is not optimal.

**Photography conditions** change dramatically. Green landscapes photograph beautifully. The dust of dry season disappears. Dramatic storm skies create theatrical lighting. The trade is that animals are harder to find and vegetation can obscure clear views.

**Your flexibility with weather** matters more than in dry season. Rain can cancel a game drive or cut it short. Muddy roads might make certain areas inaccessible. Some days are glorious, others are washouts. You need to accept that.

**Budget pressure** might make green season the right call regardless of other factors. If traveling in peak season means choosing between a four-day safari and a six-day green season safari, more days in the bush often wins. See [peak vs value season](/decisions/peak-season-vs-value-season) for the full comparison.`,

  tradeoffs: `Price and exclusivity favor green season. Lodge rates drop significantly. Vehicle counts at sightings go from fifteen to two. Famous parks feel genuinely wild when you are one of few vehicles. The [Tanzania Classic Northern Circuit](/itineraries/tanzania-classic-northern-circuit) can be done more affordably in green season.

Wildlife density and predictability favor dry season. Animals concentrate around water. Vegetation is sparse, making spotting easier. Predators hunt in open areas. The sighting quality per drive is typically higher.

Road conditions are a real factor. In heavy rain years, some camps become inaccessible. Itineraries may need to change. What was a three-hour drive becomes impassable. This adds logistics complexity that dry season avoids.

Some camps close entirely during peak wet months. Availability is not always better in green season because supply decreases along with demand. The camps that remain open are often the more expensive properties.`,

  misconceptions: `It does not rain all day every day. Green season rain typically comes in afternoon thunderstorms. Mornings are often clear. Game drives proceed normally most days. The rain patterns are more predictable than people fear.

Green season is not dangerous. Roads are muddier but camps remain operational. Guides know which routes are passable. Safety is not the concern, convenience is.

Animals do not disappear. They disperse. Finding them takes more effort, but the animals are there. A good guide in green season can still deliver excellent sightings. An average guide struggles more than they would in dry season.

Green season is not second-rate safari. It is different safari. Some experienced travelers prefer it. The empty parks, the lush landscapes, the bird activity create experiences impossible in dry season.`,

  breaksDown: `If your dates are fixed to March through May and you cannot accept rain disrupting plans, green season will frustrate you. The weather cannot be controlled.

If specific sightings are essential, leopard in a tree, crossing footage, lion on a kill, dry season offers higher probability per day. Green season requires more patience and flexibility.

If certain camps or locations are non-negotiable, they may be closed. Green season narrows your options in exchange for lower prices on what remains open.

If you are traveling with someone who will be unhappy if weather affects plans, dry season is safer. Green season rewards flexibility and punishes rigidity.`,

  ourApproach: `We evaluate green season fit using your dates, budget, flexibility, and what you prioritize in a safari. If savings matter and you can accept the trade-offs, green season is often the right call.

We also flag when green season is inadvisable. If your dates fall in the wettest weeks and your destination is known for road closures, we name that risk clearly.`,

  relatedDecisions: [
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth the premium?', type: 'decision' },
    { slug: 'safari-total-budget', title: 'What should I budget for safari?', type: 'decision' },
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'botswana-okavango-delta', title: 'Botswana Okavango Delta Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/seasonal-guide', title: 'Safari Seasons Explained', type: 'guide' },
    { slug: 'budget/value-season-tips', title: 'Value Season Planning', type: 'guide' },
  ],
};

// ============================================================
// christmas-safari-timing: Is Christmas a good time for safari?
// ============================================================
const christmasSafariBlog: BlogContent = {
  decisionSlug: 'christmas-safari-timing',
  title: 'Is Christmas a good time for safari?',
  subtitle: 'Understanding holiday travel in African safari destinations',
  updatedAt: '2025-01',
  wordCount: 1320,
  published: true,

  whyNotSimple: `Christmas falls during different seasons depending on where you go. In East Africa, December is the short dry season between rains. In Southern Africa, December is summer and the start of the wet season. These are meaningfully different conditions.

The question is also about demand, not just weather. Christmas is peak family travel time. Lodges fill months in advance. Prices surge to their highest levels. Availability becomes the primary constraint, often more limiting than weather or wildlife patterns.

Whether Christmas works depends on where you want to go, when you book, and how much the calendar constraints matter.`,

  variables: `**Your destination** determines conditions. Kenya and Tanzania in December have good weather, though not peak wildlife. The short rains have ended. The migration is heading toward the southern Serengeti for calving. Resident wildlife is reliable. South Africa and Botswana in December are hot and increasingly wet as summer progresses. [Green season trade-offs](/decisions/green-season-safari-worth-it) apply.

**How far in advance you book** matters more at Christmas than any other time. Popular family-friendly lodges book six to twelve months ahead for the holiday period. Last-minute Christmas availability is rare at quality properties. If you are reading this in October hoping to travel in December, options are already limited.

**Your travel party composition** affects fit. Christmas is dominated by families with children. Lodges are fuller and often noisier. Adult-only camps see increased demand from travelers escaping family crowds elsewhere. If traveling as a couple seeking quiet, Christmas is not optimal regardless of destination.

**Your budget tolerance** gets tested. Christmas and New Year command peak season premiums, often 25 to 50 percent above already-high dry season rates. The minimum stay requirements also extend, sometimes to five or seven nights over the holiday period.

**How fixed your dates are** determines flexibility. If December 24-26 specifically matters, your options narrow to what is available on those exact dates. If "around Christmas" allows December 20-30, you have more room to work with.`,

  tradeoffs: `East Africa at Christmas offers reliable weather but not peak wildlife. The migration is in the southern Serengeti, which is excellent if that is where you base. Northern Tanzania and Kenya have resident wildlife but not the migration spectacle. The [Tanzania Classic Northern Circuit](/itineraries/tanzania-classic-northern-circuit) works well for December.

Southern Africa at Christmas means summer heat, afternoon storms, and peak birding season. Wildlife disperses as water is available everywhere. The trade is lush landscapes and baby animals against harder predator sightings. Prices are high despite conditions being objectively worse for classic game viewing.

Booking early guarantees availability but commits you to dates that might not align with life changes. Booking late means accepting whatever remains, which might not match your preferences.

Family camps during Christmas are full of families. This is either wonderful (children have playmates) or challenging (adult-focused couples find the atmosphere changed). Same camp, same dates, very different experiences depending on what you want.`,

  misconceptions: `December is not universally bad for safari. In East Africa, it is often quite good. The assumption that African summer equals bad safari is too simple.

You cannot book Christmas safari in October and expect premium options. The booking timeline is different from regular travel. Six months advance is standard for holiday periods.

Christmas does not mean special programs at most camps. Some lodges do festive dinners or decorations, but safari schedules remain wildlife-driven. Game drives happen at dawn regardless of what day it is.

Children do not need Christmas at home. Many families find safari provides more memorable Christmas experiences than traditional celebrations. But this is a values question, not a safari question.`,

  breaksDown: `If you cannot book at least six months ahead, Christmas safari at quality lodges becomes very difficult. The supply constraint dominates everything else.

If budget is a primary concern, Christmas is the wrong time. You are paying peak premiums for conditions that are not peak wildlife. [Value season](/decisions/peak-season-vs-value-season) offers dramatically better value.

If you specifically want the Great Migration, Christmas catches it in a transitional phase. Calving has not started. The herds are moving south but not yet concentrated. January or February would be better for that goal.

If your party includes someone who values traditional Christmas at home, safari may create conflict regardless of how good the wildlife is.`,

  ourApproach: `We evaluate Christmas safari using your destination preferences, booking timeline, budget, and party composition. We can identify what is realistically available given constraints.

If you are booking far ahead, we help optimize destination and property choice. If you are booking late, we name what is still possible honestly.`,

  relatedDecisions: [
    { slug: 'safari-with-young-children', title: 'Is safari right for young children?', type: 'decision' },
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth the premium?', type: 'decision' },
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'south-africa-kruger', title: 'South Africa Kruger Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/holiday-travel', title: 'Holiday Safari Planning', type: 'guide' },
    { slug: 'family/traveling-with-kids', title: 'Safari with Children', type: 'guide' },
  ],
};

// ============================================================
// tanzania-safari-february: Is February a good time for Tanzania safari?
// ============================================================
const tanzaniaFebruaryBlog: BlogContent = {
  decisionSlug: 'tanzania-safari-february',
  title: 'Is February a good time for Tanzania safari?',
  subtitle: 'Understanding calving season and February conditions',
  updatedAt: '2025-01',
  wordCount: 1280,
  published: true,

  whyNotSimple: `February in Tanzania is calving season in the Serengeti. This is arguably the best wildlife spectacle anywhere in Africa, yet most travelers have never heard of it. The marketing around river crossings has overshadowed the equally dramatic predator-prey theater of the southern plains.

But February also sits between the short and long rains. Weather can be unpredictable. Some years February is dry and perfect. Other years, early long rains arrive and complicate things. The question is whether the calving season reward justifies the weather uncertainty.

For most wildlife-focused travelers, the answer is yes.`,

  variables: `**Where in Tanzania you want to go** determines conditions. The southern Serengeti and Ndutu area are optimal in February, with the migration concentrated there for calving. Ngorongoro Crater is reliable year-round. The northern Serengeti is quiet since the herds are in the south. Tarangire is solid but not at peak levels until dry season. The [Tanzania Great Migration Safari](/itineraries/tanzania-great-migration) can be timed for February.

**Your focus on the migration** matters. If you came for the wildebeest, February positions you for [calving season](/decisions/calving-season-safari), which delivers more consistent predator action than the crossing season. If migration is not your priority, February is simply a good month for general wildlife viewing.

**Your weather flexibility** affects risk tolerance. February can be hot and dry or can see early rains. Afternoon showers are possible. If weather disrupting a game drive would ruin your trip, the weather unpredictability of February adds risk.

**How you feel about other travelers** factors in. February is high season in the southern Serengeti due to calving. The rest of Tanzania is less crowded. You will have company in the calving zone but find relatively empty parks elsewhere.

**Your budget** encounters high season pricing for calving areas and moderate pricing elsewhere. The southern Serengeti in February commands premium rates.`,

  tradeoffs: `February offers the calving spectacle but requires positioning in the south. Itineraries that focus on the northern circuit miss it. The geography matters.

The weather gamble is real but usually pays off. Most February days are dry and sunny. Occasional rain does not ruin game drives. But the uncertainty exists.

Crowds in the calving zone are manageable compared to river crossing crowds. The herds are spread across large areas. Vehicles disperse. But you are not alone.

February competes with June through September as Tanzania's best wildlife month. Each offers different spectacles. Crossings are more famous. Calving is arguably more intense. The trade is marketing recognition versus wildlife reality.`,

  misconceptions: `February is not rainy season. It sits between the short rains (November-December) and long rains (March-May). Some years it is fully dry. Other years it gets early long rain arrivals. But it is not the wet season.

You do not need to see actual births to experience calving. The thousands of vulnerable newborns attract predators constantly. The hunting is the spectacle, not the birthing.

February Tanzania is not cheap. Calving season commands premium rates. The southern Serengeti in February costs what the Mara costs in August.

The rest of Tanzania is not bad in February. Ngorongoro, Tarangire, and even the northern Serengeti offer solid wildlife viewing, just without the migration spectacle.`,

  breaksDown: `If you cannot reach the southern Serengeti or Ndutu area, February loses its primary advantage. The calving happens in a specific geographic zone.

If your dates are fixed and early long rains arrive that year, weather might impact some game drives. This is a risk you accept, not a reason to avoid February.

If crowds bother you even at moderate levels, February calving areas will have noticeable vehicle presence. Green season or remote destinations would suit better.

If budget is tight, February's high season pricing may push Tanzania out of reach. [Kenya in February](/itineraries/kenya-classic-safari) offers lower costs without calving season access.`,

  ourApproach: `We evaluate February Tanzania using your itinerary focus, flexibility, and priorities. If calving interests you and dates work, February is often the recommendation.

We also identify when February is not the right call. If your heart is set on the northern circuit or crossings, February cannot deliver those.`,

  relatedDecisions: [
    { slug: 'calving-season-safari', title: 'Is calving season worth planning around?', type: 'decision' },
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'tanzania-vs-kenya-first-safari', title: 'Tanzania or Kenya for first safari?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-great-migration', title: 'Tanzania Great Migration Safari', type: 'trip' },
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/tanzania-calendar', title: 'Tanzania Month by Month', type: 'guide' },
    { slug: 'timing/calving-explained', title: 'Calving Season Explained', type: 'guide' },
  ],
};

// ============================================================
// tanzania-safari-july: Is July a good time for Tanzania safari?
// ============================================================
const tanzaniaJulyBlog: BlogContent = {
  decisionSlug: 'tanzania-safari-july',
  title: 'Is July a good time for Tanzania safari?',
  subtitle: 'Understanding peak dry season conditions and migration positioning',
  updatedAt: '2025-01',
  wordCount: 1300,
  published: true,

  whyNotSimple: `July is dry season in Tanzania. Weather is predictable. Wildlife concentrates around water. Roads are good. On paper, July is straightforward.

What complicates July is location. The migration is on the move, heading toward the Mara River. Some years it reaches the northern Serengeti in July. Other years, it is still in the central Serengeti. The herds do not follow a calendar. They follow the grass and water.

July is excellent for Tanzania, but where you go within Tanzania requires more thought than simply "Tanzania in July is good."`,

  variables: `**Where the migration is** varies by year. In an average year, July finds the herds somewhere between the western Serengeti and the northern Serengeti. They are approaching river crossing territory but may not have started crossing yet. Guides track current herd positions and can advise, but predictions made months ahead are estimates.

**Your focus on migration versus diversity** shapes the itinerary. July is when the Serengeti dominates, but Ngorongoro Crater, Tarangire, and Lake Manyara offer excellent dry season viewing too. A balanced itinerary sees the migration area plus other parks. A migration-focused itinerary stays in the Serengeti longer.

**Your tolerance for crowds** encounters July pressure. This is peak season. Popular camps book months ahead. Vehicle density at prime sightings is higher than shoulder months. You will share experiences with other travelers.

**Your budget** faces peak pricing. July rates are typically the highest of the year alongside August and September. There are no discounts. Popular camps often require minimum stays.

**How you feel about early mornings** matters more in July. Game drives leave before dawn because animals are active early, before heat sets in. By mid-morning, cats are sleeping. If you struggle with 5:30 AM departures, you miss the best action.`,

  tradeoffs: `July offers reliable weather but uncertain migration position. You might catch early crossings, or you might find herds still moving toward the river. Flexibility in itinerary helps.

The Serengeti in July is busy. Popular viewpoints have vehicles. Sightings draw crowds. The trade for excellent wildlife is sharing that wildlife with others.

July costs more than shoulder months like June or October. You pay premium for peak conditions. If budget allows, July delivers. If budget is constrained, [value season](/decisions/peak-season-vs-value-season) offers alternatives.

Northern Serengeti camps position you for crossings but may be quiet if herds have not arrived yet. Central Serengeti camps have reliable resident wildlife but may miss herds that have moved north. Camp choice involves prediction and probability.`,

  misconceptions: `July is not guaranteed crossing time. The famous Mara River crossings happen when herds decide to cross, which might be July or might be August or September. Positioning yourself for crossings is probability management, not scheduling.

Not all of Tanzania is crowded in July. The Serengeti is busy. Tarangire is busy. But remote areas like Katavi or Ruaha see far fewer visitors even in peak season.

July weather is not cold. Nights and early mornings can be cool, especially in the highlands around Ngorongoro. Days are warm to hot. Pack layers.

The entire Serengeti is not equally good in July. Herd positions matter. Camp positioning matters. Generic "July is great for Tanzania" misses the geographic nuance.`,

  breaksDown: `If you specifically need river crossings, July is risky. Crossings might happen or the herds might not have reached the rivers yet. August and September are higher probability for crossings.

If crowds genuinely ruin the experience, July's peak season density will be challenging. Consider [green season](/decisions/green-season-safari-worth-it) or less visited parks.

If budget constraints are significant, July premium pricing may push Tanzania out of reach. [Tanzania on a budget](/decisions/tanzania-safari-on-budget) is harder in peak season.

If you cannot commit to early morning game drives, July's wildlife patterns mean you miss the best hours. Safari is not well suited to late risers in dry season.`,

  ourApproach: `We evaluate July Tanzania using your specific interests, budget, and tolerance for crowds. We track migration patterns and recommend camp positioning based on current information.

July is objectively excellent for Tanzania. The question is whether July's constraints fit your preferences and budget.`,

  relatedDecisions: [
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'mara-river-crossings-timing', title: 'When is the best time to see river crossings?', type: 'decision' },
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth the premium?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-great-migration', title: 'Tanzania Great Migration Safari', type: 'trip' },
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/tanzania-calendar', title: 'Tanzania Month by Month', type: 'guide' },
    { slug: 'timing/migration-calendar', title: 'Migration Calendar', type: 'guide' },
  ],
};

// ============================================================
// kenya-safari-august: Is August a good time for Kenya safari?
// ============================================================
const kenyaAugustBlog: BlogContent = {
  decisionSlug: 'kenya-safari-august',
  title: 'Is August a good time for Kenya safari?',
  subtitle: 'Understanding peak season conditions in the Masai Mara',
  updatedAt: '2025-01',
  wordCount: 1340,
  published: true,

  whyNotSimple: `August is the heart of Kenya's peak season. The Great Migration is in the Masai Mara. The weather is dry. The wildlife viewing is arguably the best it gets all year.

The complexity is not whether August is good. It is whether August's crowds and prices align with what you want from safari. This is the most popular time to visit the Mara. Every other visitor who has done the same research reached the same conclusion you did.

August delivers on wildlife. Whether it delivers on experience depends on how you feel about sharing that wildlife with many other vehicles.`,

  variables: `**Your tolerance for vehicle density** is the primary variable. August in the Mara means multiple vehicles at sightings. A leopard in a tree might draw fifteen Land Cruisers. Lions on a kill attract crowds. River crossings, when they happen, can have thirty or more vehicles jockeying for position. This is reality, not outlier experience.

**Where you stay** affects crowd exposure. Camps inside the Masai Mara National Reserve share space with all other visitors. Private conservancies surrounding the reserve limit vehicle numbers and offer off-road driving. The conservancy trade is exclusivity for higher prices and sometimes less access to prime crossing points.

**Your photography priorities** might favor or disfavor August crowds. Vehicle density means competition for angles. But August light is excellent, vegetation is low, and animal density is high. You get more opportunities even if each opportunity is more contested.

**How far ahead you book** determines options. August availability at quality camps disappears months in advance. Last-minute August travel means accepting whatever remains, which may not match preferences.

**Your budget** faces maximum pressure. August rates are peak year. Minimum stay requirements extend. Premium is paid for average accommodation.`,

  tradeoffs: `August offers migration presence with crowd presence. The herds are there. So is everyone who wants to see the herds. The trade is guaranteed wildlife against shared experience.

Conservancies offer relief from crowds but at premium cost and with different positioning. The best crossing points are in the reserve, not always the conservancies. You choose between exclusivity and optimal migration access.

August weather is reliable, which is valuable. Rain does not disrupt. Roads are good. Game drives proceed on schedule. This predictability has value even if crowds are the cost.

The [Kenya Classic Safari](/itineraries/kenya-classic-safari) positions you for August but requires early booking. Alternative months like September or October offer similar wildlife with slightly fewer crowds, but the migration might have moved south by late October.`,

  misconceptions: `August crowds are not universal across Kenya. The Mara is crowded. Amboseli is busy. But the Laikipia plateau, Samburu, and coastal areas see fewer visitors even in peak season.

Not every sighting is mobbed. Crowds concentrate on the rare and famous, lions, leopards, crossings. Elephants, giraffes, zebras, and other common species often have lighter vehicle presence.

August is not the only crossing time. Crossings happen July through October. August might be peak probability but is not the exclusive window.

Vehicle density does not mean bad guides. Excellent guides position you well, arrive early, manage sightlines, and find less-visited areas. The guide matters more in August than in quiet months.`,

  breaksDown: `If vehicle crowds genuinely ruin wildlife experiences for you, August in the Mara will be frustrating. The crowds are structural to this time and place. Consider [Tanzania's Serengeti](/decisions/serengeti-vs-masai-mara) for more space during the same period.

If budget is constrained, August Kenya is expensive everywhere. Quality drops quickly at lower price points because demand absorbs all decent inventory at market rates. [Value season](/decisions/peak-season-vs-value-season) offers dramatically better budget fit.

If you have not booked by April or May for August travel, expect compromised options. The timeline is different from regular travel.

If specific crossing footage is essential and you have limited days, the unpredictability of crossings plus the certainty of crowds may not deliver what you imagine.`,

  ourApproach: `We evaluate August Kenya using your crowd tolerance, budget, booking timeline, and priorities. August is excellent if those factors align.

We also identify when August is wrong despite being "peak season." If crowds will undermine your experience, we name that clearly rather than defaulting to calendar logic.`,

  relatedDecisions: [
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
    { slug: 'mara-river-crossings-timing', title: 'When is the best time to see river crossings?', type: 'decision' },
    { slug: 'private-vs-shared-vehicle', title: 'Private vehicle or shared game drives?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
    { slug: 'kenya-conservancy-safari', title: 'Kenya Conservancy Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/kenya-calendar', title: 'Kenya Month by Month', type: 'guide' },
    { slug: 'destination/mara-guide', title: 'Masai Mara Guide', type: 'guide' },
  ],
};

// ============================================================
// botswana-safari-june: Is June a good time for Botswana safari?
// ============================================================
const botswanaJuneBlog: BlogContent = {
  decisionSlug: 'botswana-safari-june',
  title: 'Is June a good time for Botswana safari?',
  subtitle: 'Understanding early dry season conditions in the Okavango Delta',
  updatedAt: '2025-01',
  wordCount: 1300,
  published: true,

  whyNotSimple: `June in Botswana is the beginning of dry season, but in the Okavango Delta, it is also peak flood season. These seem contradictory but are not. The Okavango's floods come from Angolan rains months earlier, arriving in the delta as Botswana's dry season begins.

This timing creates unusual conditions. Waterways are full and expanding. Mokoro trips are optimal. Water activities are at their best. Meanwhile, wildlife starts concentrating as other water sources dry up. June sits at an intersection that offers both water experiences and good game viewing.

The question is not whether June is good. It is whether June's specific combination matches what you want.`,

  variables: `**Your interest in water-based activities** matters most for June. The Okavango floods are expanding. Mokoro (traditional canoe) trips reach areas inaccessible in other months. Boat cruises open new territories. If water is central to your Okavango vision, June delivers it.

**Wildlife concentration** is building but not peaked. Animals are beginning to move toward permanent water as seasonal pans dry. The concentration process is starting. By August and September, it is intense. June is earlier in that curve.

**Your weather tolerance** encounters cool conditions. June nights in Botswana can drop to near freezing. Days are pleasant but mornings are cold. Early game drives require serious layers. If you run cold, this matters.

**The Okavango specifically** performs differently than other Botswana destinations in June. Chobe is good. Savuti is good. But the Okavango's unique June conditions are what distinguish this month.

**Pricing and availability** are high season but not peak peak. June is expensive but often slightly less than July through September. Availability is better than August.`,

  tradeoffs: `June floods mean expanded water access but can mean some land areas are harder to reach. Water levels vary year to year. High flood years change the landscape dramatically.

Wildlife is good but not at maximum concentration. If your priority is predator density around shrinking water, August through October delivers more consistently. June requires more searching.

Cold mornings are real. Open vehicle game drives at 6 AM in June require warm clothing. Some travelers find this uncomfortable. Others find crisp clear mornings invigorating.

The [Botswana Okavango Delta Safari](/itineraries/botswana-okavango-delta) works well in June but delivers different character than the same itinerary in September. Same places, different experiences.`,

  misconceptions: `June is not the "green season" in Botswana. Rains ended in March or April. Vegetation is drying. Days are dry and sunny. This is dry season, just early dry season.

The Okavango is not flooded in the sense of being washed out. The floods expand the water channels gradually. Safari continues. The water is an asset, not an obstacle.

Cold does not mean all day cold. By 10 AM, temperatures are comfortable. By midday, you might be warm. The cold is concentrated in early morning and evening.

June is not off-season pricing. Botswana has stopped having true off-season in popular areas. June is slightly less expensive than August but still firmly high season rates.`,

  breaksDown: `If you specifically want the dramatic predator-prey concentration around the last water sources, June is too early. Wait for August through October.

If cold mornings are genuinely problematic for you, June will be uncomfortable. The early morning hours that offer the best wildlife viewing are also the coldest.

If water activities are not interesting, June's primary distinction (peak floods) becomes irrelevant. Other months might serve equally well.

If you are comparing June Botswana to June East Africa, the migration is in East Africa. June Botswana has excellent wildlife but not the migration spectacle.`,

  ourApproach: `We evaluate June Botswana using your interest in water activities, wildlife priorities, and cold tolerance. June offers a specific combination that is excellent for the right traveler.

If your priorities align with what June delivers, we recommend it. If they align better with different months, we name that.`,

  relatedDecisions: [
    { slug: 'okavango-delta-worth-premium', title: 'Is the Okavango Delta worth the premium?', type: 'decision' },
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth the premium?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'botswana-okavango-delta', title: 'Botswana Okavango Delta Safari', type: 'trip' },
    { slug: 'botswana-classic-safari', title: 'Botswana Classic Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/botswana-calendar', title: 'Botswana Month by Month', type: 'guide' },
    { slug: 'destination/okavango-guide', title: 'Okavango Delta Guide', type: 'guide' },
  ],
};

// ============================================================
// tanzania-dry-season-only: Should I only consider Tanzania in dry season?
// ============================================================
const tanzaniaDrySeasonBlog: BlogContent = {
  decisionSlug: 'tanzania-dry-season-only',
  title: 'Should I only consider Tanzania in dry season?',
  subtitle: 'Understanding year-round safari possibilities',
  updatedAt: '2025-01',
  wordCount: 1320,
  published: true,

  whyNotSimple: `The advice to "only visit in dry season" is outdated but persistent. It originated when safari infrastructure was more limited and wet season travel was genuinely difficult. Modern camps are better equipped, roads are better maintained, and the value proposition of shoulder and green seasons is better understood.

Tanzania has wildlife twelve months a year. The migration cycles through different areas. Resident populations remain constant. The question is not whether Tanzania works outside dry season, but what different seasons offer.

Dry season is the easiest recommendation. It is not always the best recommendation.`,

  variables: `**Your primary interest** shapes season choice. The Great Migration has a twelve-month cycle. [Calving in February](/decisions/calving-season-safari) is arguably more dramatic than dry season viewing. The northern Serengeti crossings from July through October are dry season, but the migration itself is happening year-round.

**Your tolerance for weather uncertainty** affects wet season fit. [Green season](/decisions/green-season-safari-worth-it) means possible afternoon showers, occasional muddy roads, and some itinerary flexibility requirements. Most days are fine. But the unpredictability exists.

**Your budget** encounters very different pricing by season. Green season rates can be 30-40 percent lower. For the same budget, you can do a longer trip or stay at better properties in shoulder months.

**Specific parks** have different seasonal characters. Tarangire peaks in dry season as animals concentrate around the river. The Serengeti offers migration somewhere year-round. Ngorongoro is consistent in all seasons. Ruaha is best July through October.

**Photography goals** might favor or disfavor different seasons. Dry season offers dusty golden light, sparse vegetation, and concentrated animals. Wet season offers green landscapes, dramatic skies, and newborn animals.`,

  tradeoffs: `Dry season delivers predictability at premium prices. Weather is reliable. Animals are concentrated. Roads are good. You pay more for that certainty.

Green season offers value and solitude at the cost of predictability. Fewer tourists. Lower prices. Beautiful landscapes. But some days rain disrupts plans. Some roads close. The trade is real.

Shoulder months like June or October split the difference. Decent weather, moderate prices, reasonable crowds. Neither peak condition nor peak discount.

Year-round planning opens migration possibilities that dry-season-only misses. [February calving](/decisions/tanzania-safari-february) is green season adjacent but offers spectacular wildlife. The advice to avoid wet season would have you miss it.`,

  misconceptions: `"Wet season" does not mean constant rain. Most rainfall comes in afternoon thunderstorms. Mornings are typically clear. Game drives proceed normally on most days.

Animals do not disappear in wet season. They disperse as water is available everywhere. Finding them requires more effort. A good guide matters more. But the animals are present.

Dry season is not universally superior for photography. Wet season offers lush backgrounds, dramatic storm skies, and baby animals. Professional photographers visit in both seasons for different images.

All of Tanzania does not have the same seasons. Northern Tanzania's rainy periods are different from southern Tanzania. Generalizations oversimplify.`,

  breaksDown: `If you have very limited days and need maximum wildlife efficiency, dry season concentrates animals and improves sighting density per game drive. The efficiency argument favors dry season.

If weather disrupting plans causes real stress, dry season's reliability is valuable. Green season requires flexibility that not everyone has.

If specific parks are essential and they are dramatically better in dry season (like Tarangire), the calendar matters. Park-specific patterns override general season advice.

If your dates are fixed to wet season peak (March through May), you accept the trade-offs rather than choosing them. Some years this period is fine. Some years it is challenging.`,

  ourApproach: `We evaluate season choice using your dates, budget, flexibility, and what aspects of safari matter most. Dry season is excellent but not exclusively excellent.

We recommend against reflexive dry-season-only thinking. The best month for your trip depends on your specific priorities, not generic season labels.`,

  relatedDecisions: [
    { slug: 'green-season-safari-worth-it', title: 'Is green season safari worth it?', type: 'decision' },
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth the premium?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'tanzania-great-migration', title: 'Tanzania Great Migration Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'timing/tanzania-calendar', title: 'Tanzania Month by Month', type: 'guide' },
    { slug: 'timing/seasonal-guide', title: 'Safari Seasons Explained', type: 'guide' },
  ],
};

// ============================================================
// safari-booking-lead-time: How far in advance should I book safari?
// ============================================================
const bookingLeadTimeBlog: BlogContent = {
  decisionSlug: 'safari-booking-lead-time',
  title: 'How far in advance should I book safari?',
  subtitle: 'Understanding booking timelines and availability patterns',
  updatedAt: '2025-01',
  wordCount: 1380,
  published: true,

  whyNotSimple: `The generic advice is "book early." But early varies dramatically by season, destination, and what you want. A green season safari in Zambia has different booking dynamics than August in the Masai Mara.

Safari is not like booking hotels in major cities where inventory is essentially unlimited. Safari camps are small, often fewer than twenty guests. Popular camps fill months ahead. Once full, they are full. There is no expanding capacity.

The question is not just how early, but how your timeline interacts with your flexibility, destination, and standards.`,

  variables: `**When you want to travel** determines the urgency. Peak season (July through October in East Africa, June through October in Southern Africa) and holiday periods (Christmas, Easter) require the longest lead times. Green season and shoulder months have more availability closer to departure.

**Where you want to go** matters. Botswana's expensive, low-capacity camps fill early. Kenya's larger camp inventory absorbs demand better. Specific camps with strong reputations fill faster than interchangeable alternatives.

**How flexible you are** on dates and properties changes everything. If you must stay at a specific camp on specific dates, book as early as possible. If you can shift dates by a week or consider equivalent alternatives, you have more room to work with.

**Your quality threshold** affects options. The best camps fill first. Mid-range camps fill next. Basic options often have availability even close to departure. How much quality matters to you determines how much booking pressure you face.

**Group size** complicates logistics. Larger groups need multiple rooms at the same camp on the same dates. This is harder to secure than solo or couple travel. Family groups and friend groups should book earlier.`,

  tradeoffs: `Booking very early (9-12 months ahead) guarantees availability but commits you to dates that might not work as life changes. Deposits are often non-refundable or partially refundable. The certainty of booking comes with the cost of commitment.

Booking moderately early (4-6 months) balances availability and flexibility for most trips outside peak season. Popular camps may have limited options. You work with what remains but usually find acceptable alternatives.

Booking late (under 3 months) works for green season, less popular destinations, or travelers with high flexibility. You accept whatever is available. Sometimes that includes excellent last-minute deals. Sometimes options are truly limited.

Peak season booking is different. For August in the Mara or July-September in Botswana, even 6 months ahead may find limited availability at quality camps. The booking window is different from standard travel.`,

  misconceptions: `Early booking does not guarantee the best price. Safari pricing is more often fixed than hotel pricing. Early bookers pay the same rates as later bookers at most camps. The advantage is availability, not price.

Travel agents do not have secret inventory. They have relationships that help access difficult camps, but they cannot create availability that does not exist. If a camp is full, it is full.

Last-minute deals exist but are not reliable strategy. Some operators discount unsold inventory close to departure. But this is inconsistent and unpredictable. Building a trip around hoped-for discounts is risky.

Booking directly is not always better than using an agent. Good agents earn commission from camps, not from you. They provide expertise without additional cost. The value is guidance, not savings.`,

  breaksDown: `If you have fixed dates in peak season and specific camps in mind, book 9-12 months ahead. The market structure gives you no choice.

If flexibility is genuinely high, you can book late and accept whatever is available. This works for experienced travelers who trust the process. First-timers often find the uncertainty uncomfortable.

If budget is primary, the booking timeline matters less than the season. [Green season](/decisions/green-season-safari-worth-it) costs less whenever you book. Peak season costs more even if you book early.

If travel partners require certainty to commit, book early regardless of optimal timing. Getting everyone aligned often matters more than optimal booking strategy.`,

  ourApproach: `We evaluate booking timeline using your travel dates, destination, flexibility, and preferences. We tell you what availability typically looks like for your parameters and when urgency is real versus manufactured.

Safari operators have incentives to encourage early booking. We do not. We tell you when early booking genuinely matters and when it is optional.`,

  relatedDecisions: [
    { slug: 'book-safari-agent-vs-direct', title: 'Should I book through an agent or direct?', type: 'decision' },
    { slug: 'peak-season-vs-value-season', title: 'Is peak season worth the premium?', type: 'decision' },
    { slug: 'safari-total-budget', title: 'What should I budget for safari?', type: 'decision' },
  ],

  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  relatedGuides: [
    { slug: 'logistics/booking-guide', title: 'Safari Booking Guide', type: 'guide' },
    { slug: 'logistics/planning-timeline', title: 'Planning Timeline', type: 'guide' },
  ],
};

// ============================================================
// Register all timing blogs
// ============================================================
export function registerTimingBlogs(): void {
  registerBlog(maraRiverCrossingsBlog);
  registerBlog(calvingSeasonBlog);
  registerBlog(greenSeasonBlog);
  registerBlog(christmasSafariBlog);
  registerBlog(tanzaniaFebruaryBlog);
  registerBlog(tanzaniaJulyBlog);
  registerBlog(kenyaAugustBlog);
  registerBlog(botswanaJuneBlog);
  registerBlog(tanzaniaDrySeasonBlog);
  registerBlog(bookingLeadTimeBlog);
}

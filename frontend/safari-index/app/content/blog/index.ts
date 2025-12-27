/**
 * Blog Content Registry
 *
 * Decision-anchored blog articles for Safari Index.
 * Every blog extends a decision with deeper context.
 *
 * Structure per editorial spec:
 * - Decision spine (exactly 1 decision)
 * - Supporting decisions (max 3, same bucket)
 * - Trip embedding (max 2)
 * - Deep reading (max 2)
 *
 * Internal links use markdown syntax: [text](/path)
 */

import { registerBlog, type BlogContent } from '../../../lib/blog-content';

// Import blog registration functions from category files
import { registerPersonalFitBlogs } from './personal-fit-blogs';
import { registerDestinationBlogs } from './destination-blogs';
import { registerTimingBlogs } from './timing-blogs';
import { registerExperienceBlogs } from './experience-blogs';
import { registerAccommodationBlogs } from './accommodation-blogs';
import { registerLogisticsBlogs } from './logistics-blogs';
import { registerRiskBlogs } from './risk-blogs';
import { registerValueBlogs } from './value-blogs';

// ============================================================
// tanzania-vs-kenya-first-safari: Tanzania or Kenya for first safari?
// ============================================================
const tzVsKeBlog: BlogContent = {
  decisionSlug: 'tanzania-vs-kenya-first-safari',
  title: 'Tanzania or Kenya for first safari?',
  subtitle: 'Understanding the real differences between these two destinations',
  updatedAt: '2025-01',
  wordCount: 1580,
  published: true,

  whyNotSimple: `You see this question everywhere. Safari forums, travel blogs, Reddit threads. People frame it like there is a winner and a loser. Tanzania fans say Kenya is overcrowded. Kenya fans say Tanzania is overpriced. Both miss the point.

These countries share the same ecosystem. The Great Migration does not stop at the border. The lions hunting in the Masai Mara are genetically the same as the lions hunting in the Serengeti. There is no "better wildlife" on either side. If you are weighing these parks specifically, see [Serengeti or Masai Mara](/decisions/serengeti-vs-masai-mara).

What actually differs is structure. Kenya is smaller, more accessible, and generally cheaper. Tanzania is vast, less crowded in most areas, and positions you differently relative to the migration throughout the year. The right answer depends on when you are going, what you are spending, and what kind of experience you want.`,

  variables: `**When you travel** matters most. The herds are in Kenya's Masai Mara from roughly July through October. The rest of the year, they are somewhere in Tanzania's Serengeti. Southern plains for calving in January and February. Central Serengeti from March through May. Northern Serengeti for river crossings from June into September. If your dates are locked, this alone might make the decision for you. See [when to see the Great Migration](/decisions/great-migration-timing) for the full breakdown.

**Your budget** plays out differently in each country. Kenya tends to cost 10 to 20 percent less for similar quality at the mid-range level. Tanzania has fewer reliable budget options and quality varies a lot at the lower end. At the luxury tier, prices are comparable. If you are watching costs carefully, Kenya gives you more room to work with. For Tanzania specifically, see [can I do Tanzania on a budget](/decisions/tanzania-safari-on-budget).

**How you feel about crowds** connects to geography. The Mara is about 1,500 square kilometers. The Serengeti is almost 15,000. That is roughly ten times the space. During peak season, vehicle density in the Mara is simply higher per square kilometer. If seeing other vehicles bothers you, the Serengeti's scale offers more escape routes.

**Photography requirements** can tip the balance. Kenya allows off-road driving to approach animals and get specific angles. Tanzanian national parks keep you on marked tracks. Private concessions in Tanzania often allow off-road access, but those come at premium prices.

**Trip length** affects which destination performs better. The Serengeti rewards longer stays because its size means moving between zones. The Mara's compactness makes it efficient for shorter trips. See [is five days enough for safari](/decisions/is-5-days-enough-for-safari).`,

  tradeoffs: `The Mara is smaller, which means you see more animals per hour of driving. If you are optimizing for sighting density, that is an advantage. But smaller also means more vehicles converging on the same lions. You might find a leopard with fifteen Land Cruisers already parked around it.

The Serengeti offers the opposite. You can drive for two hours without seeing another vehicle. When you find something, you might have it to yourself. The trade is efficiency. Some drives are quiet. The [Tanzania Classic Northern Circuit](/itineraries/tanzania-classic-northern-circuit) balances time in the Serengeti with Ngorongoro and Tarangire to reduce this risk.

People fixate on river crossings, but [crossings are unpredictable](/decisions/mara-river-crossings-timing). You can spend three days waiting at the Mara River and see nothing. Meanwhile, [calving season](/decisions/calving-season-safari) in the southern Serengeti runs from January through February with consistent predator action as cheetahs and lions hunt newborn wildebeest. It is less famous but arguably more reliable.

Cost and exclusivity pull in opposite directions. Kenya's lower prices come with higher density. Tanzania's higher costs, especially in private concessions, buy genuine solitude. Some travelers choose Kenya to save money and then find the crowd levels undermine the experience they wanted.`,

  misconceptions: `People say Kenya is for the migration and Tanzania is for everything else. That is backwards. The migration spends about eight months of the year in Tanzania. The Mara gets it for roughly four months. This myth probably comes from decades of marketing focused on the July through October crossing window.

The Serengeti is not too big to see anything. Camps position themselves in wildlife-rich zones. Guides communicate constantly about where animals are. The risk of driving through empty plains is overstated.

Tanzania's higher prices do not mean better wildlife. The extra cost covers park fees, internal flights, and a thinner mid-range sector. Both countries offer comparable animal encounters.

You do not need to see a river crossing to see the migration. Crossings are dramatic but brief. The migration is happening every day as millions of animals move, graze, give birth, and die. Calving season is the migration. The herds massing in the central Serengeti is the migration.`,

  breaksDown: `If your dates fall between July and October and you specifically want to see a river crossing, the Mara's geography makes that more accessible. You are not choosing between countries so much as accepting what the calendar offers. The [Kenya Classic Safari](/itineraries/kenya-classic-safari) positions you for this window.

If your budget is under $300 per person per day, Kenya has more reliable options. Tanzania's budget sector is thin and inconsistent.

If crowds genuinely ruin the experience for you and your dates are flexible, Tanzania's scale and concession system offer more consistent solitude.

If you need off-road access for photography, Kenya's regulations are more permissive.

If you only have three or four days, the Mara's compactness delivers more sightings in less time.`,

  ourApproach: `We evaluate this decision using your travel month, budget, crowd tolerance, trip length, and experience level. The system weighs these against the structural differences between destinations and produces a recommendation with explicit assumptions.

The verdict is not permanent. It reflects your inputs at the time you ask. Change your travel month from August to February and the answer might flip.

Neither country is universally better. The question is which one fits your specific constraints and priorities.`,

  // Max 3 related decisions, same bucket (destination_choice)
  relatedDecisions: [
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
    { slug: 'great-migration-timing', title: 'When is the best time to see the Great Migration?', type: 'decision' },
    { slug: 'single-vs-multi-country-safari', title: 'Should I focus on one country or visit multiple?', type: 'decision' },
  ],

  // Max 2 trips with fit descriptions
  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  // Max 2 guides
  relatedGuides: [
    { slug: 'timing/migration-explained', title: 'Understanding the Great Migration', type: 'guide' },
    { slug: 'destination/east-africa-overview', title: 'East Africa Safari Planning', type: 'guide' },
  ],
};

// ============================================================
// am-i-ready-for-first-safari: Am I ready for my first safari?
// ============================================================
const firstTimerReadyBlog: BlogContent = {
  decisionSlug: 'am-i-ready-for-first-safari',
  title: 'Am I ready for my first safari?',
  subtitle: 'Understanding what safari actually requires',
  updatedAt: '2025-01',
  wordCount: 1420,
  published: true,

  whyNotSimple: `This question usually is not really about readiness. When people ask it, they are often asking something else. Will I enjoy this? Can I handle it? What if I hate it?

Readiness for safari is not about fitness or packing the right clothes. It is about expectations. The gap between what people think safari is and what safari actually is creates most of the disappointment.

Documentary footage has warped perception. Those river crossing shots took a film crew weeks to capture. That leopard draped over a branch was one of maybe three leopard sightings in a month of shooting. Real safari involves a lot of driving, a lot of looking, and encounters that happen on wildlife schedules, not yours. See [what should I realistically expect to see](/decisions/big-five-expectations) for calibrated expectations.`,

  variables: `**Your relationship with uncertainty** matters most. Wildlife does what it wants. Your guide might hear about lions five kilometers away and spend an hour getting there only to find they have moved. Plans change constantly. Game drives run long or get cut short depending on what is happening. If you need to know exactly what is happening and when, safari will frustrate you.

**What "comfortable" means to you** varies a lot. Safari lodges range from basic tents with shared bathrooms to suites with private pools. Even the expensive ones are in the bush. There are insects. Power goes out. The shower might be lukewarm. Understanding what you are signing up for prevents surprises. See [is luxury safari worth it](/decisions/luxury-safari-worth-it) for the comfort-cost tradeoff.

**Early mornings are not optional.** Animals are most active around dawn. Game drives leave at 5:30 or 6:00 AM. This is when lions hunt, when leopards move, when everything is happening. If you physically cannot function before 8 AM, you will miss the best part of every day.

**Heat and dust are standard.** Most safari destinations are warm. Open vehicles expose you to sun, wind, and dust. Some lodges have air-conditioned vehicles but most do not. If you cannot tolerate heat, your destination options narrow significantly.

**Malaria is a real consideration.** Most safari areas have malaria-carrying mosquitoes. Prophylaxis is effective but some people cannot or will not take it. If that is you, destination options shrink to places like South Africa's Eastern Cape. See [should I avoid malaria zones](/decisions/avoid-malaria-zones-safari).`,

  tradeoffs: `Safari rewards flexibility but punishes rigidity. Staying an extra hour at a leopard sighting means lunch gets pushed back. Following a wild dog pack means skipping the scenic route you had planned. People who thrive on structure often find this irritating rather than exciting.

The most immersive experiences tend to have fewer amenities. Walking safaris put you on foot with wildlife but mean basic fly camps. Mobile tented camps follow the migration but offer simpler facilities than fixed lodges. You trade comfort for intensity.

Safari is guide-led travel. You do not decide where to go or how long to stay. Your guide does. Some people find this freeing. Others find it frustrating. If you prefer self-directed exploration, [self-drive safari in Kruger](/decisions/self-drive-safari) might suit you better.`,

  misconceptions: `Safari is not an adventure sport. It is mostly sitting in a vehicle looking at animals. Physical bravery is not required. Patience and genuine interest in wildlife are.

You do not need to be fit. Standard game drives involve sitting for three or four hours, climbing in and out of a raised vehicle, and walking short distances in camp. Walking safaris require more, but those are optional.

Safari areas are not dangerous in the way people imagine. Guides are professionals. Camps have protocols. Statistically, you are safer on safari than driving to work. Fear of wildlife rarely justifies avoiding the trip.

Short trips are not failures. Four days in a good location with a good guide can deliver remarkable encounters. Longer trips add variety and increase your chances of rare sightings, but plenty of three-day safaris produce life-changing experiences. See [is five days enough](/decisions/is-5-days-enough-for-safari).`,

  breaksDown: `If you need consistent air conditioning, Western-standard plumbing, and zero insects, safari becomes very difficult. Even luxury properties operate in bush conditions. Certain comfort requirements simply cannot be met.

If morning game drives are physically impossible for you, you will miss the most active wildlife period. Afternoon drives are valuable but not equivalent.

If plans changing, sightings being missed, or schedules shifting causes real distress, safari's built-in unpredictability will work against you.

If health conditions make malaria prophylaxis inadvisable, your destination options narrow to malaria-free areas, which limits choices significantly. The [South Africa Kruger Safari](/itineraries/south-africa-kruger) includes malaria-free options.`,

  ourApproach: `We assess fit using your experience level, comfort expectations, flexibility tolerance, and any specific concerns or constraints. The system evaluates these against what safari actually requires, not what marketing materials promise.

A verdict of "conditional yes" is not criticism. It means we have identified factors that would improve your experience if addressed. Maybe booking a lodge with air conditioning. Maybe choosing a malaria-free destination.

We assume you want honest assessment rather than encouragement. If real constraints exist, we name them. If concerns are unfounded, we explain why.`,

  // Max 3 related decisions, same bucket (personal_fit)
  relatedDecisions: [
    { slug: 'big-five-expectations', title: 'Will I be disappointed if I do not see the Big Five?', type: 'decision' },
    { slug: 'solo-safari-travel', title: 'Is solo safari travel right for me?', type: 'decision' },
    { slug: 'safari-honeymoon', title: 'Is safari right for a honeymoon?', type: 'decision' },
  ],

  // Max 2 trips
  relatedTrips: [
    { slug: 'tanzania-classic-northern-circuit', title: 'Tanzania Classic Northern Circuit', type: 'trip' },
    { slug: 'south-africa-kruger', title: 'South Africa Kruger Safari', type: 'trip' },
  ],

  // Max 2 guides
  relatedGuides: [
    { slug: 'personal-fit/first-safari-preparation', title: 'First Safari Preparation', type: 'guide' },
    { slug: 'logistics/what-to-pack', title: 'Safari Packing Guide', type: 'guide' },
  ],
};

// ============================================================
// great-migration-timing: When is the best time to see the Great Migration?
// ============================================================
const migrationTimingBlog: BlogContent = {
  decisionSlug: 'great-migration-timing',
  title: 'When is the best time to see the Great Migration?',
  subtitle: 'Understanding the migration cycle and what each month offers',
  updatedAt: '2025-01',
  wordCount: 1350,
  published: true,

  whyNotSimple: `The migration is not an event. There is no opening ceremony. It does not start in one place and end in another. About 1.5 million wildebeest, along with hundreds of thousands of zebras and gazelles, move in a continuous loop across the Serengeti-Mara ecosystem. They follow the grass. The grass follows the rain. This has been happening for thousands of years.

When people ask about the "best time," they usually mean river crossings. Those dramatic shots of wildebeest plunging into crocodile-filled water. That is one expression of the migration. But the herds are migrating in January when they are calving. They are migrating in April when they are moving north. They are migrating in November when they are heading back south.

The question is not when the migration happens. It is what aspect of it interests you. If crossings are the priority, see [when to see river crossings](/decisions/mara-river-crossings-timing).`,

  variables: `**Your travel month** determines what you will see. December through March, the herds are in the southern Serengeti around Ndutu. [Calving season](/decisions/calving-season-safari) peaks in February with hundreds of thousands of births over a few weeks. Predators concentrate in the area, hunting vulnerable newborns.

April through May, the herds move northwest toward the central Serengeti. Rain is common. Some camps close. But the herds are on the move and vulnerable young animals still attract predators.

June sees herds gathering in the central and western Serengeti. The Grumeti River gets crossings first.

July through October, herds cross into the northern Serengeti and Masai Mara. This is the famous river crossing window. The Mara River is the star. The [Tanzania Great Migration Safari](/itineraries/tanzania-great-migration) positions you for this phase.

November, the herds return south following early rains.

**How flexible you are** affects what is realistic. Crossings are unpredictable. The herds might cross at 7 AM before you arrive, or at 3 PM when you have left for lunch. Flexible dates and longer stays improve your odds. Fixed short trips during crossing season might miss every crossing.

**Your weather tolerance** affects which months work. [Green season](/decisions/green-season-safari-worth-it) from March through May offers lower prices and fewer crowds but includes rain and muddy roads. Dry season is more predictable but pricier and busier.`,

  tradeoffs: `River crossings are dramatic but brief and unpredictable. You can position yourself at a crossing point for three days and see nothing happen. Calving season offers more consistent action. Predators are active all day, every day, hunting newborns. The trade is spectacle versus reliability.

Peak season from July through September commands premium prices, often 30 to 50 percent higher than shoulder months. Crowds concentrate at famous crossing points. Shoulder months in June, October, and November cost less but offer less certainty about where the herds will be. See [peak vs value season](/decisions/peak-season-vs-value-season).

Booking the "best" camp for crossings does not guarantee herds. If the migration moves early or late relative to historical patterns, you might be in the right place at the wrong time. Flexible itineraries that can shift between camps cost more and require more logistics but track the herds more effectively.`,

  misconceptions: `The migration does not happen in August. August is when the most dramatic crossing footage gets shot. But the herds are somewhere in the ecosystem every month of the year.

You do not need to see a crossing to see the migration. Millions of animals moving across the landscape is the migration. Crossings are one moment in a year-long cycle.

Guides cannot predict exactly when crossings happen. They know where herds are gathering and which crossing points look likely. But no one knows when a lead wildebeest will decide to jump into the river. That animal makes the decision, and it might wait three days.

Missing the migration does not mean missing wildlife. The Serengeti and Mara have resident populations of lions, elephants, leopards, cheetahs, giraffes, and hundreds of other species year-round.`,

  breaksDown: `If you specifically want the river crossing shots you have seen in documentaries, July through October in the northern Serengeti or Masai Mara is the only window. The decision becomes positioning, not timing. See [Serengeti vs Masai Mara](/decisions/serengeti-vs-masai-mara) for that choice.

If your dates are fixed to a specific month, you are seeing whatever that month offers. Traveling in April means the central Serengeti and the post-calving movement. The decision becomes which camps position you best for that phase.

If budget constraints push you into green season from March through May, you accept wetter conditions and less predictable herd positions. That is the trade. The [Kenya Classic Safari](/itineraries/kenya-classic-safari) offers a more compact and affordable alternative for crossing season.`,

  ourApproach: `We evaluate this using your travel month, date flexibility, budget, and what aspect of the migration you prioritize. The system matches your dates to the migration's typical position and recommends where to be.

Uncertainty is built in. We can optimize your chances but not guarantee outcomes. Whether you see a crossing depends on the herds, not on us.`,

  // Max 3 related decisions, same bucket (timing)
  relatedDecisions: [
    { slug: 'mara-river-crossings-timing', title: 'When is the best time to see river crossings?', type: 'decision' },
    { slug: 'calving-season-safari', title: 'Is calving season worth planning around?', type: 'decision' },
    { slug: 'serengeti-vs-masai-mara', title: 'Serengeti or Masai Mara?', type: 'decision' },
  ],

  // Max 2 trips
  relatedTrips: [
    { slug: 'tanzania-great-migration', title: 'Tanzania Great Migration Safari', type: 'trip' },
    { slug: 'kenya-classic-safari', title: 'Kenya Classic Safari', type: 'trip' },
  ],

  // Max 2 guides
  relatedGuides: [
    { slug: 'timing/migration-calendar', title: 'Migration Calendar', type: 'guide' },
    { slug: 'timing/best-months', title: 'Best Months by Destination', type: 'guide' },
  ],
};

// ============================================================
// Register all blogs
// ============================================================
registerBlog(tzVsKeBlog);
registerBlog(firstTimerReadyBlog);
registerBlog(migrationTimingBlog);

/**
 * Initialize blogs - call this to ensure registration
 */
export function initializeBlogs(): void {
  // Register core blogs from this file
  registerBlog(tzVsKeBlog);
  registerBlog(firstTimerReadyBlog);
  registerBlog(migrationTimingBlog);

  // Register blogs from category files
  registerPersonalFitBlogs();
  registerDestinationBlogs();
  registerTimingBlogs();
  registerExperienceBlogs();
  registerAccommodationBlogs();
  registerLogisticsBlogs();
  registerRiskBlogs();
  registerValueBlogs();
}

/**
 * Birding Decision Operational Definitions
 *
 * Production-ready definitions for birding-specific decision topics.
 * These plug directly into the decision engine without schema changes.
 *
 * Birding is a high-expertise niche where shallow content destroys credibility.
 * These definitions prove expertise through constraint framing, refusal logic,
 * and seasonality accuracy.
 *
 * Each definition includes:
 * - Required/optional inputs for decision computation
 * - Core assumptions based on ornithological evidence
 * - Symmetric trade-offs (real gains, real losses)
 * - Change conditions that would flip the decision
 * - Explicit refusal triggers
 */

import {
  INPUT_CATALOG,
  toInputDefinition,
  type InputDefinition,
} from '../../lib/input-catalog';

/**
 * Helper to convert catalog input to definition with optional overrides
 */
function inp(
  catalogKey: keyof typeof INPUT_CATALOG,
  overrides?: Partial<InputDefinition>
): InputDefinition {
  const base = toInputDefinition(INPUT_CATALOG[catalogKey]);
  return overrides ? { ...base, ...overrides } : base;
}

/**
 * Helper for topic-specific inputs not in the catalog
 */
function customInput(def: InputDefinition): InputDefinition {
  return def;
}

export interface TradeoffPair {
  gain: string;
  loss: string;
}

export interface BirdingDecisionDefinition {
  id: string;
  question: string;
  bucket: 'experience' | 'timing' | 'destination' | 'ethics';
  required_inputs: InputDefinition[];
  optional_inputs: InputDefinition[];
  assumptions: string[];
  tradeoffs: TradeoffPair[];
  change_conditions: string[];
  refusal_triggers: string[];
  assurance_eligible: boolean;
  complexity: 'medium' | 'high';
  launch_priority: 'P0' | 'P1';
}

export const birdingDecisionDefinitions: BirdingDecisionDefinition[] = [
  // ============================================================
  // P0 BIRDING DECISIONS (6 topics)
  // ============================================================
  {
    id: 'birding-green-vs-dry-season',
    question: 'Is green season better for bird diversity than dry season?',
    bucket: 'timing',
    required_inputs: [
      customInput({
        key: 'birding_context.primary_interest',
        label: 'Primary birding interest',
        description: 'What matters most: migratory species, endemics, photography, or species count',
        example: 'migratory diversity',
      }),
      inp('travel_month', {
        description: 'Your planned travel period',
      }),
      inp('destinations_considered', {
        description: 'Countries or regions being considered',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'birding_context.experience_level',
        label: 'Birding experience',
        description: 'Your birding skill level (beginner, intermediate, advanced)',
        example: 'intermediate',
      }),
      customInput({
        key: 'birding_context.target_species',
        label: 'Target species',
        description: 'Specific species you are hoping to see',
        example: 'Shoebill, African Skimmer',
      }),
    ],
    assumptions: [
      'Green season (Nov-Apr in East Africa) brings Palearctic migrants, increasing species count by 150-200 species',
      'Breeding plumage peaks during wet season for many resident species',
      'Visibility decreases with dense vegetation; harder to spot skulking species',
      'Access roads may become impassable in heavy rain, limiting territory coverage',
      'Bird activity peaks in early morning regardless of season',
      'Endemic species are present year-round but some are more vocal during breeding (wet) season',
    ],
    tradeoffs: [
      { gain: 'Higher species diversity with Palearctic migrants present', loss: 'Difficult field conditions, muddy trails, limited access' },
      { gain: 'Breeding plumage and courtship displays', loss: 'Dense vegetation obscuring views' },
      { gain: 'Lower tourism pressure, quieter birding', loss: 'Some camps close, fewer specialized guides available' },
      { gain: 'Dramatic skies for photography', loss: 'Inconsistent light, rain interruptions' },
    ],
    change_conditions: [
      'If photography is primary goal, dry season visibility may outweigh diversity',
      'If seeking specific endemics only, seasonality matters less',
      'If combining with Big Five safari, dry season alignment improves both experiences',
      'If target species are migrants, travel timing must match migration windows',
    ],
    refusal_triggers: [
      'No indication of birding priority vs. general safari provided',
      'Travel dates fall during shoulder periods with unpredictable conditions',
      'Expectation of both peak migration and optimal photography conditions simultaneously',
    ],
    assurance_eligible: true,
    complexity: 'high',
    launch_priority: 'P0',
  },
  {
    id: 'birding-combined-big-five',
    question: 'Can I combine serious birding with a Big Five safari?',
    bucket: 'experience',
    required_inputs: [
      customInput({
        key: 'birding_context.birding_intensity',
        label: 'Birding intensity',
        description: 'How seriously you take birding (casual, dedicated, obsessive)',
        example: 'dedicated',
      }),
      customInput({
        key: 'safari_context.mammal_priority',
        label: 'Mammal priority',
        description: 'How important are Big Five sightings relative to birds',
        example: 'secondary to birds',
      }),
      inp('group_composition', {
        description: 'Who you are traveling with and their interests',
      }),
    ],
    optional_inputs: [
      inp('trip_length', {
        description: 'Total safari duration in days',
      }),
      inp('destinations_considered'),
      customInput({
        key: 'birding_context.guide_requirement',
        label: 'Guide specialization',
        description: 'Whether you need a specialized birding guide',
        example: 'essential',
      }),
    ],
    assumptions: [
      'Standard game drive pace conflicts with birding pace (birders stop frequently, mammal watchers move on)',
      'Most safari guides are competent with common birds but lack expertise on LBJs, raptors, or calls',
      'Specialized birding guides cost 20-40% more and must be requested in advance',
      'Private vehicle is essential for serious birding; shared vehicles create constant compromise',
      'Early morning peak birding (5-7am) overlaps with prime predator activity',
      'Forest birding and savannah mammal watching are geographically separated activities',
    ],
    tradeoffs: [
      { gain: 'Efficient use of limited travel time for both interests', loss: 'Suboptimal experience for both activities' },
      { gain: 'Chance encounters with interesting birds during mammal drives', loss: 'Missed opportunities when guide prioritizes mammals' },
      { gain: 'Single trip covers multiple interests', loss: 'Higher per-day cost for private guide/vehicle' },
      { gain: 'Non-birding companions satisfied', loss: 'Birding depth sacrificed for group harmony' },
    ],
    change_conditions: [
      'If traveling solo with private guide, combination works better',
      'If 10+ days available, can split time effectively between both',
      'If destination supports both (e.g., Selous/Ruaha), integration improves',
      'If companions genuinely interested in birds, pace conflicts reduce',
    ],
    refusal_triggers: [
      'Expectation of 300+ species list on a standard Big Five itinerary',
      'Group includes non-birders with zero tolerance for birding stops',
      'Trip duration under 7 days attempting both goals',
      'Budget excludes private vehicle while expecting dedicated birding time',
    ],
    assurance_eligible: true,
    complexity: 'high',
    launch_priority: 'P0',
  },
  {
    id: 'uganda-vs-tanzania-endemic-birding',
    question: 'Is Uganda or Tanzania better for endemic birding?',
    bucket: 'destination',
    required_inputs: [
      customInput({
        key: 'birding_context.habitat_preference',
        label: 'Habitat preference',
        description: 'Preferred birding habitats (forest, savannah, wetland, montane)',
        example: 'forest and wetland',
      }),
      customInput({
        key: 'birding_context.target_families',
        label: 'Target bird families',
        description: 'Specific families or groups you want to focus on',
        example: 'Albertine Rift endemics, turacos',
      }),
      inp('trip_length'),
    ],
    optional_inputs: [
      inp('budget_band'),
      customInput({
        key: 'birding_context.combine_with_primates',
        label: 'Primate interest',
        description: 'Whether you want to combine with gorilla/chimp trekking',
        example: 'yes, gorillas essential',
      }),
      inp('physical_fitness', {
        description: 'Fitness level for forest trekking',
      }),
    ],
    assumptions: [
      'Uganda has ~1,090 species; Tanzania has ~1,100+ species (higher count but lower endemic concentration)',
      'Albertine Rift endemics are concentrated in Uganda (Bwindi, Rwenzori, Kibale)',
      'Tanzania Eastern Arc endemics require separate montane forest trips (Udzungwa, Usambara)',
      'Uganda birding infrastructure is more developed; specialist guides more available',
      'Tanzania offers savannah birding + endemics in single trip; Uganda requires dedicated forest days',
      'Shoebill is realistically findable only in Uganda (Mabamba Swamp)',
    ],
    tradeoffs: [
      { gain: 'Uganda: Concentrated Albertine Rift endemics, Shoebill, developed birding circuits', loss: 'Limited savannah birding, more expensive per-species ratio' },
      { gain: 'Tanzania: Higher total species count, savannah + forest combination', loss: 'Endemic sites scattered, requires more travel days' },
      { gain: 'Uganda: Combine with gorillas/chimps efficiently', loss: 'Wet forests can be challenging, limited dry season window' },
      { gain: 'Tanzania: Better general safari combination', loss: 'Serious endemic birding requires separate dedicated trip' },
    ],
    change_conditions: [
      'If Shoebill is priority, Uganda is the only practical choice',
      'If combining with Serengeti migration, Tanzania despite endemic trade-offs',
      'If Eastern Arc endemics specifically sought, Tanzania required',
      'If single country preferred, Uganda delivers more endemic density per day',
    ],
    refusal_triggers: [
      'Expectation of seeing both Shoebill AND Serengeti migration in one trip',
      'Budget insufficient for Uganda forest lodges which command premium pricing',
      'Trip duration under 10 days while expecting comprehensive endemic coverage',
    ],
    assurance_eligible: true,
    complexity: 'high',
    launch_priority: 'P0',
  },
  {
    id: 'migratory-bird-peak-timing',
    question: 'When does migratory bird density peak in East Africa?',
    bucket: 'timing',
    required_inputs: [
      customInput({
        key: 'birding_context.migrant_interest',
        label: 'Migrant focus',
        description: 'Which migrants matter most (waders, raptors, passerines, waterbirds)',
        example: 'waders and waterbirds',
      }),
      inp('destinations_considered'),
      inp('travel_month', {
        description: 'Planned or flexible travel period',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'birding_context.specific_migrants',
        label: 'Target migrants',
        description: 'Specific migratory species you want to see',
        example: 'Lesser Flamingo, European Roller',
      }),
      inp('flexibility', {
        label: 'Date flexibility',
        description: 'How flexible your travel dates are',
      }),
    ],
    assumptions: [
      'Palearctic migrants arrive Oct-Nov, peak Dec-Feb, depart Mar-Apr',
      'Intra-African migrants follow different patterns (e.g., Abdim Stork arrives with rains)',
      'Wader concentrations peak at alkaline lakes Nov-Mar (Nakuru, Natron, Manyara)',
      'Raptor migration through Rift Valley peaks Sep-Nov southbound, Mar-Apr northbound',
      'Breeding activity of residents peaks during rains, creating identification challenges with worn migrants',
      'Exact timing varies 2-4 weeks year-to-year based on rainfall patterns',
    ],
    tradeoffs: [
      { gain: 'Nov-Dec: Fresh migrants in breeding plumage, peak diversity', loss: 'Short rains may affect access, unpredictable weather' },
      { gain: 'Jan-Feb: Stable dry weather, migrants settled, high density', loss: 'Peak tourism period, higher costs, more crowded' },
      { gain: 'Mar-Apr: Northbound migrants in pre-breeding plumage', loss: 'Long rains begin, some migrants already departed' },
      { gain: 'Shoulder months for value pricing', loss: 'Migrant numbers lower, less predictable' },
    ],
    change_conditions: [
      'If specific migrant species is priority, timing must match that species window',
      'If combining with mammal migration, Jan-Feb aligns both peaks',
      'If raptors are focus, Sep-Nov or Mar-Apr passage periods',
      'If wetland birds priority, water levels matter more than calendar dates',
    ],
    refusal_triggers: [
      'Expectation of peak migrants outside Oct-Apr window',
      'Inflexible dates falling during heavy rains with flooded roads',
      'Single-species obsession with low probability even in optimal timing',
    ],
    assurance_eligible: true,
    complexity: 'high',
    launch_priority: 'P0',
  },
  {
    id: 'birding-photography-compatibility',
    question: 'Is photography-focused birding compatible with migration timing?',
    bucket: 'experience',
    required_inputs: [
      customInput({
        key: 'photography_context.priority',
        label: 'Photography priority',
        description: 'Whether photography is primary or secondary to listing',
        example: 'primary',
      }),
      customInput({
        key: 'photography_context.equipment',
        label: 'Equipment level',
        description: 'Camera and lens setup (compact, mirrorless + 100-400, full frame + 600mm)',
        example: 'mirrorless + 100-400mm',
      }),
      inp('travel_month'),
    ],
    optional_inputs: [
      customInput({
        key: 'photography_context.target_shots',
        label: 'Target shots',
        description: 'Types of images sought (portraits, flight, behavior, habitat)',
        example: 'portraits and behavior',
      }),
      inp('destinations_considered'),
      inp('trip_length'),
    ],
    assumptions: [
      'Peak migration timing (Nov-Feb) coincides with variable weather and harsh midday light',
      'Dry season (Jul-Oct) offers better light consistency but fewer migrant species',
      'Forest birding photography is challenging regardless of season (low light, dense cover)',
      'Waterhole photography depends on water levels, which peak in dry season',
      'Bird behavior (feeding, displaying) often peaks in breeding season regardless of light quality',
      'Hide/blind photography requires advance booking and adds cost',
    ],
    tradeoffs: [
      { gain: 'Migration timing: Maximum species diversity for portfolio breadth', loss: 'Inconsistent light, rain delays, stressed subjects' },
      { gain: 'Dry season: Predictable golden-hour light, waterhole concentration', loss: 'Missing 150+ migratory species, limited diversity' },
      { gain: 'Wet season: Breeding plumage, nesting behavior', loss: 'Technical challenges, soggy conditions' },
      { gain: 'Shoulder seasons: Balance of species and conditions', loss: 'Neither optimal, compromise on both' },
    ],
    change_conditions: [
      'If single-species portfolio shot is goal, timing matches that species',
      'If commercial stock photography, dry season reliability may outweigh diversity',
      'If personal listing photography, migration timing despite conditions',
      'If hide photography specifically, must align with lodge/camp availability',
    ],
    refusal_triggers: [
      'Expectation of magazine-quality images AND comprehensive species list in single trip',
      'Photography equipment inadequate for African light/distance challenges',
      'Zero tolerance for photographic conditions inherent to wet season birding',
    ],
    assurance_eligible: false,
    complexity: 'high',
    launch_priority: 'P0',
  },
  {
    id: 'birding-short-itinerary',
    question: 'Can birding work in short itineraries?',
    bucket: 'experience',
    required_inputs: [
      inp('trip_length', {
        label: 'Available days',
        description: 'Total days available for birding (not including travel days)',
      }),
      customInput({
        key: 'birding_context.goal_type',
        label: 'Birding goal',
        description: 'What you want to achieve (specific targets, regional flavor, quality sightings)',
        example: 'quality sightings of East African specials',
      }),
      inp('destinations_considered'),
    ],
    optional_inputs: [
      customInput({
        key: 'birding_context.must_see_species',
        label: 'Must-see species',
        description: 'Non-negotiable target species',
        example: 'Lilac-breasted Roller, Secretary Bird',
      }),
      inp('budget_band'),
      inp('physical_fitness'),
    ],
    assumptions: [
      'Effective birding requires minimum 2-3 days in any single habitat',
      'Short trips (4-5 days) can deliver quality in focused geography',
      'Multi-habitat trips under 7 days create rushed, superficial coverage',
      'Transfer days reduce effective birding time significantly',
      'Specialist guide is essential for efficient short-trip birding',
      'Dawn-to-dusk birding is exhausting beyond 3-4 consecutive days',
    ],
    tradeoffs: [
      { gain: 'Short focused trip: Deep exploration of single site', loss: 'Limited habitat diversity, narrow species list' },
      { gain: 'Quality over quantity approach feasible', loss: 'May miss regional specialties requiring site-hopping' },
      { gain: 'Intensive birding possible for fit travelers', loss: 'Fatigue degrades observation quality after day 3-4' },
      { gain: 'Lower total cost', loss: 'Higher per-species cost ratio' },
    ],
    change_conditions: [
      'If single target species (e.g., Shoebill), 2-3 days can work',
      'If 7+ days available, multi-habitat itinerary becomes viable',
      'If repeating visitor, focused trip fills gaps efficiently',
      'If combining with business travel, location-specific birding adds value',
    ],
    refusal_triggers: [
      'Expectation of 200+ species in under 5 days',
      'Multiple habitat types demanded in under 7 days',
      'Short trip with added non-birding activities consuming prime birding hours',
    ],
    assurance_eligible: false,
    complexity: 'medium',
    launch_priority: 'P0',
  },

  // ============================================================
  // P1 BIRDING DECISIONS (6 topics)
  // ============================================================
  {
    id: 'forest-birding-mammal-tradeoffs',
    question: 'Are forest birding safaris realistic without sacrificing mammals?',
    bucket: 'experience',
    required_inputs: [
      customInput({
        key: 'birding_context.forest_priority',
        label: 'Forest bird priority',
        description: 'How important are forest specialists vs. savannah birds',
        example: 'essential for Albertine Rift endemics',
      }),
      customInput({
        key: 'safari_context.mammal_expectations',
        label: 'Mammal expectations',
        description: 'Which mammals you expect to see',
        example: 'primates acceptable, Big Five not required',
      }),
    ],
    optional_inputs: [
      inp('trip_length'),
      inp('destinations_considered'),
      inp('physical_fitness'),
    ],
    assumptions: [
      'True forest birding and savannah mammal watching occur in different habitats',
      'Forest specialists (turacos, greenbuls, akalats) require patient understory observation',
      'Primate tracking and forest birding are complementary activities',
      'Big Five viewing requires open savannah, fundamentally different from forest',
      'Uganda/Rwanda forests offer primate + bird integration; Tanzania less so',
      'Forest birding is physically demanding (trails, elevation, humidity)',
    ],
    tradeoffs: [
      { gain: 'Forest endemics unavailable elsewhere', loss: 'Big Five savannah experience sacrificed' },
      { gain: 'Primate encounters integrated naturally', loss: 'Limited open-country birding' },
      { gain: 'Unique habitat experience', loss: 'Challenging conditions, limited photography' },
      { gain: 'Lower tourist density', loss: 'Higher physical demands' },
    ],
    change_conditions: [
      'If primates satisfy mammal interest, forest-focused trip works well',
      'If Big Five essential, must accept forest birding as separate add-on trip',
      'If 14+ days available, can include both forest and savannah segments',
    ],
    refusal_triggers: [
      'Expectation of forest endemics AND classic Big Five in short trip',
      'Physical limitations precluding forest trail walking',
      'Budget insufficient for both forest lodges AND savannah camps',
    ],
    assurance_eligible: false,
    complexity: 'high',
    launch_priority: 'P1',
  },
  {
    id: 'private-concessions-birding',
    question: 'Are private concessions better for birding than national parks?',
    bucket: 'destination',
    required_inputs: [
      customInput({
        key: 'birding_context.birding_style',
        label: 'Birding style',
        description: 'How you prefer to bird (vehicle-based, walking, mixed)',
        example: 'walking essential',
      }),
      inp('budget_band', {
        description: 'Budget determines concession access',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered'),
      customInput({
        key: 'birding_context.flexibility_needs',
        label: 'Flexibility needs',
        description: 'How important are off-road, night drives, walking',
        example: 'off-road access essential',
      }),
    ],
    assumptions: [
      'Private concessions allow off-road driving, closer approaches, night drives',
      'National parks restrict to roads, limiting access to certain habitats',
      'Concession birding guides may be less specialized than park-based specialists',
      'Concession exclusivity reduces vehicle competition at sightings',
      'Walking safaris in concessions provide unique ground-level birding',
      'Concession costs are 50-100% higher than equivalent national park lodges',
    ],
    tradeoffs: [
      { gain: 'Off-road access to bird-rich areas', loss: 'Significantly higher daily cost' },
      { gain: 'Walking safari birding options', loss: 'May lack specialist birding guide' },
      { gain: 'Fewer vehicles, quieter observation', loss: 'Smaller territory than large parks' },
      { gain: 'Flexible activity timing', loss: 'Less diverse habitat within concession' },
    ],
    change_conditions: [
      'If walking birding is priority, concessions essential',
      'If budget-constrained, national parks with specialist guide may outperform',
      'If photography-focused, concession flexibility valuable',
      'If seeking rare species at known stakeouts, park access may be required',
    ],
    refusal_triggers: [
      'Concession expectations on national park budget',
      'Specialist birding demands without booking dedicated guide',
    ],
    assurance_eligible: false,
    complexity: 'medium',
    launch_priority: 'P1',
  },
  {
    id: 'rainfall-birding-expectations',
    question: 'Does rainfall variability break birding expectations?',
    bucket: 'timing',
    required_inputs: [
      customInput({
        key: 'birding_context.rainfall_tolerance',
        label: 'Rainfall tolerance',
        description: 'Your tolerance for rain during birding',
        example: 'moderate, expect some rain',
      }),
      inp('travel_month'),
      inp('destinations_considered'),
    ],
    optional_inputs: [
      inp('flexibility'),
      customInput({
        key: 'birding_context.equipment_protection',
        label: 'Equipment protection',
        description: 'Gear for wet conditions (rain covers, waterproof bags)',
        example: 'basic rain protection',
      }),
    ],
    assumptions: [
      'Climate change has made traditional wet/dry patterns less predictable',
      'Birds respond to actual rainfall, not calendar dates',
      'Unseasonal dry spells can collapse expected waterbird concentrations',
      'Extended rains can make forest trails impassable for weeks',
      'Localized rainfall creates micro-habitats with concentrated bird activity',
      'Flexible itineraries can adapt to conditions; fixed ones cannot',
    ],
    tradeoffs: [
      { gain: 'Flexible booking allows chasing optimal conditions', loss: 'Premium pricing, last-minute logistics' },
      { gain: 'Fixed dates reduce planning stress', loss: 'Weather mismatch possible' },
      { gain: 'Wet conditions bring breeding activity', loss: 'Access limitations, soggy field work' },
      { gain: 'Dry conditions ensure mobility', loss: 'May miss rain-triggered species' },
    ],
    change_conditions: [
      'If dates are immovable, expectation calibration required',
      'If flexible by 2-4 weeks, can optimize to conditions',
      'If targeting rain-dependent species, must accept access risks',
    ],
    refusal_triggers: [
      'Zero tolerance for itinerary disruption due to weather',
      'Rigid expectations about species tied to rainfall patterns',
      'Equipment/clothing inadequate for wet conditions',
    ],
    assurance_eligible: false,
    complexity: 'high',
    launch_priority: 'P1',
  },
  {
    id: 'fly-in-safaris-birding',
    question: 'Are fly-in safaris bad for birders?',
    bucket: 'experience',
    required_inputs: [
      customInput({
        key: 'birding_context.roadside_birding_value',
        label: 'Roadside birding value',
        description: 'How much you value birding during road transfers',
        example: 'high, transfers are productive time',
      }),
      customInput({
        key: 'logistics_context.transfer_tolerance',
        label: 'Transfer tolerance',
        description: 'Your tolerance for long road transfers',
        example: 'low, prefer efficient transfers',
      }),
    ],
    optional_inputs: [
      inp('trip_length'),
      inp('budget_band'),
      inp('physical_fitness'),
    ],
    assumptions: [
      'Road transfers often produce 20-30% of trip species list',
      'Fly-in eliminates roadside birding but maximizes time at destination',
      'Light aircraft have strict baggage limits affecting optics/camera gear',
      'Airstrip locations may not coincide with best birding areas',
      'Bush planes offer aerial perspective but minimal stopping for birds',
      'Cost savings from shorter trip may offset fly-in premium',
    ],
    tradeoffs: [
      { gain: 'Maximum time at birding destination', loss: 'Miss roadside diversity, transitional habitats' },
      { gain: 'Reduced fatigue from long transfers', loss: 'Baggage constraints on birding gear' },
      { gain: 'Access to remote areas', loss: 'Less flexibility for spontaneous stops' },
      { gain: 'Efficient use of limited time', loss: 'Higher cost, more complex logistics' },
    ],
    change_conditions: [
      'If time-constrained, fly-in efficiency may outweigh roadside loss',
      'If destinations are remote (e.g., Selous), flying is only practical option',
      'If birding gear is extensive, driving preserves gear flexibility',
      'If road habitats are unique to transfer route, driving essential',
    ],
    refusal_triggers: [
      'Expectation of comprehensive species list with fly-in itinerary',
      'Birding gear incompatible with light aircraft weight limits',
    ],
    assurance_eligible: false,
    complexity: 'medium',
    launch_priority: 'P1',
  },
  {
    id: 'ethical-playback-birding',
    question: 'Is ethical playback compatible with conservation?',
    bucket: 'ethics',
    required_inputs: [
      customInput({
        key: 'birding_context.playback_stance',
        label: 'Playback stance',
        description: 'Your personal position on playback use',
        example: 'reluctant but willing for skulkers',
      }),
      customInput({
        key: 'birding_context.target_species_type',
        label: 'Target species type',
        description: 'Types of species you are targeting (skulkers, rarities, common)',
        example: 'forest skulkers',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'birding_context.conservation_concern',
        label: 'Conservation concern',
        description: 'Species of conservation concern being targeted',
        example: 'none specifically',
      }),
      inp('destinations_considered'),
    ],
    assumptions: [
      'Playback affects bird behavior; degree depends on species, season, and frequency',
      'Breeding birds respond more strongly and may abandon territories with repeated disturbance',
      'Threatened species are more vulnerable to playback stress',
      'Professional guides use playback sparingly; irresponsible use damages local populations',
      'Some reserves have banned or restricted playback entirely',
      'Silent approach often equally effective for patient birders',
    ],
    tradeoffs: [
      { gain: 'Higher success rate on skulking species', loss: 'Contributes to cumulative disturbance' },
      { gain: 'Time-efficient detection', loss: 'May stress breeding birds' },
      { gain: 'Confirmation of presence for listing', loss: 'Unnaturally manipulated encounter' },
      { gain: 'Photographic opportunities', loss: 'Ethical compromise' },
    ],
    change_conditions: [
      'If species is common and non-breeding, limited playback is low-impact',
      'If threatened species, playback should be avoided entirely',
      'If reserve prohibits playback, decision is made',
      'If guide ethics are unknown, discuss before booking',
    ],
    refusal_triggers: [
      'Insistence on playback for threatened species',
      'Expectation of guaranteed sightings through unlimited playback',
      'Disregard for reserve playback policies',
    ],
    assurance_eligible: false,
    complexity: 'medium',
    launch_priority: 'P1',
  },
  {
    id: 'birding-predator-tracking-conflict',
    question: 'When does birding meaningfully conflict with predator tracking?',
    bucket: 'experience',
    required_inputs: [
      customInput({
        key: 'birding_context.predator_interest',
        label: 'Predator interest',
        description: 'Your interest in predator sightings',
        example: 'secondary to birds',
      }),
      customInput({
        key: 'safari_context.guide_control',
        label: 'Guide control',
        description: 'Who controls the drive agenda',
        example: 'shared decision-making',
      }),
    ],
    optional_inputs: [
      inp('group_composition'),
      customInput({
        key: 'birding_context.private_vehicle',
        label: 'Vehicle arrangement',
        description: 'Private or shared game drive vehicle',
        example: 'private',
      }),
    ],
    assumptions: [
      'Early morning is peak for both bird activity and predator movement',
      'Following predator action requires rapid movement; birding requires patience',
      'Radio calls for predator sightings interrupt systematic birding',
      'Prime birding spots (wetlands, forest edges) differ from predator territories',
      'Leopard and lion are often inactive when bird activity peaks',
      'Shared vehicles default to mammal priority unless negotiated',
    ],
    tradeoffs: [
      { gain: 'Predator sightings are dramatic and memorable', loss: 'Birding momentum interrupted' },
      { gain: 'Radio network accesses rare sightings', loss: 'Creates rushed, unfocused birding' },
      { gain: 'Balanced itinerary satisfies multiple interests', loss: 'Neither fully optimized' },
      { gain: 'Private vehicle allows negotiation', loss: 'Still only one location at a time' },
    ],
    change_conditions: [
      'If private vehicle with sympathetic guide, conflicts manageable',
      'If specific predator encounter is a priority, accept birding sacrifice',
      'If serious birding is goal, request no radio interruptions',
      'If companions are mammal-focused, separate vehicles may be necessary',
    ],
    refusal_triggers: [
      'Expectation of both comprehensive birding AND following every predator sighting',
      'Shared vehicle with mammal-obsessed companions',
      'Guide unwilling to skip radio calls for birding time',
    ],
    assurance_eligible: false,
    complexity: 'medium',
    launch_priority: 'P1',
  },
];

/**
 * Get all birding decision IDs
 */
export function getBirdingDecisionIds(): string[] {
  return birdingDecisionDefinitions.map((d) => d.id);
}

/**
 * Get birding decisions by bucket
 */
export function getBirdingDecisionsByBucket(
  bucket: BirdingDecisionDefinition['bucket']
): BirdingDecisionDefinition[] {
  return birdingDecisionDefinitions.filter((d) => d.bucket === bucket);
}

/**
 * Get P0 birding decisions
 */
export function getP0BirdingDecisions(): BirdingDecisionDefinition[] {
  return birdingDecisionDefinitions.filter((d) => d.launch_priority === 'P0');
}

/**
 * Get birding decision by ID
 */
export function getBirdingDecisionById(id: string): BirdingDecisionDefinition | undefined {
  return birdingDecisionDefinitions.find((d) => d.id === id);
}

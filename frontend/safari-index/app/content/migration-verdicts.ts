/**
 * Migration Month Verdicts
 *
 * Decision-led verdicts for each month of the wildebeest migration.
 * Each month includes:
 * - Herd position (where they likely are)
 * - Why (ecological reasoning)
 * - Verdict (clear recommendation)
 * - Suitability (who it's for/not for)
 * - Linked decisions and itineraries
 * - Refusal notes (when to decline)
 */

export interface MigrationMonthVerdict {
  month: number;
  name: string;
  herdPosition: string;
  why: string;
  verdict: string;
  suitableFor: string[];
  unsuitableFor: string[];
  refusalNote?: string;
  linkedDecisions: string[];
  linkedItineraries: string[];
  crowdLevel: 'low' | 'moderate' | 'high' | 'peak';
  crossingProbability: 'none' | 'low' | 'moderate' | 'high';
  calvingActive: boolean;
  phase: 'calving' | 'movement' | 'crossing' | 'return';
}

export const MIGRATION_MONTH_VERDICTS: MigrationMonthVerdict[] = [
  {
    month: 1,
    name: 'January',
    herdPosition: 'Southern Serengeti plains near Ndutu',
    why: 'Short grass plains provide mineral-rich grazing essential for late-pregnancy and nursing wildebeest. Open terrain offers predators visibility; prey accepts this trade-off for nutrition.',
    verdict: 'Excellent for calving buildup. Herds concentrating. Predator activity increasing. No crossing possibility. Crowds moderate.',
    suitableFor: [
      'First-timers seeking reliable wildlife',
      'Families with children',
      'Photographers seeking predator action',
      'Budget-conscious travelers (lower than August)',
    ],
    unsuitableFor: [
      'Crossing-focused travelers',
      'Those seeking river drama',
    ],
    linkedDecisions: ['crossing-vs-calving', 'migration-first-timer', 'migration-cost'],
    linkedItineraries: ['serengeti-calving-season', 'calving-crater-classic'],
    crowdLevel: 'moderate',
    crossingProbability: 'none',
    calvingActive: true,
    phase: 'calving',
  },
  {
    month: 2,
    name: 'February',
    herdPosition: 'Southern Serengeti (Ndutu/Ngorongoro Conservation Area border)',
    why: 'Peak calving window. 8,000+ births daily. Predators (lions, cheetahs, hyenas) capitalize on vulnerable newborns.',
    verdict: 'Peak calving. Highest predator action probability of the year. Reliable daily drama. No crossings. Moderate crowds. This is the most underrated migration month.',
    suitableFor: [
      'Predator enthusiasts',
      'Photographers',
      'First-timers',
      'Those prioritizing consistent action over spectacle',
    ],
    unsuitableFor: [
      'Crossing seekers',
      'Travelers wanting river drama',
    ],
    refusalNote: 'If traveler insists on crossings, February is wrong month. Redirect or refuse.',
    linkedDecisions: ['crossing-vs-calving', 'migration-month-position'],
    linkedItineraries: ['serengeti-calving-season', 'calving-crater-classic'],
    crowdLevel: 'moderate',
    crossingProbability: 'none',
    calvingActive: true,
    phase: 'calving',
  },
  {
    month: 3,
    name: 'March',
    herdPosition: 'Southern Serengeti, beginning dispersal',
    why: 'Calving concludes. Rains begin. Herds start fragmenting for northwest movement.',
    verdict: 'Late calving, early movement. Action declining from February peak. Increasing uncertainty about exact herd position. Green season beginning.',
    suitableFor: [
      'Flexible travelers',
      'Budget-conscious visitors',
      'Those accepting transition uncertainty',
    ],
    unsuitableFor: [
      'Travelers needing guaranteed concentrations',
      'Crossing seekers',
    ],
    linkedDecisions: ['migration-month-position', 'green-season-value'],
    linkedItineraries: ['calving-crater-classic'],
    crowdLevel: 'low',
    crossingProbability: 'none',
    calvingActive: false,
    phase: 'movement',
  },
  {
    month: 4,
    name: 'April',
    herdPosition: 'Central Serengeti (Seronera area), dispersed',
    why: 'Long rains. Herds scattered across central plains moving toward western corridor.',
    verdict: 'Low season. Herds present but dispersed. Difficult to predict exact locations. Lower prices, fewer tourists, higher rainfall. Migration viewing unreliable.',
    suitableFor: [
      'Budget travelers accepting uncertainty',
      'Birders (migratory species present)',
      'Those seeking solitude',
    ],
    unsuitableFor: [
      'Migration-focused travelers',
      'First-timers wanting reliable sightings',
    ],
    refusalNote: 'If migration is primary goal, April is high-risk. Recommend alternative timing.',
    linkedDecisions: ['green-season-value', 'migration-month-position'],
    linkedItineraries: [],
    crowdLevel: 'low',
    crossingProbability: 'none',
    calvingActive: false,
    phase: 'movement',
  },
  {
    month: 5,
    name: 'May',
    herdPosition: 'Western Serengeti corridor, movement in progress',
    why: 'Herds moving toward Grumeti River. Position unpredictable week to week.',
    verdict: 'Transition month. Movement underway but exact position uncertain. Rains continuing. Lower prices. For flexible travelers only.',
    suitableFor: [
      'Repeat visitors',
      'Flexible photographers',
      'Budget-conscious travelers',
    ],
    unsuitableFor: [
      'First-timers',
      'Travelers with rigid expectations',
    ],
    linkedDecisions: ['migration-month-position'],
    linkedItineraries: ['migration-transition'],
    crowdLevel: 'low',
    crossingProbability: 'low',
    calvingActive: false,
    phase: 'movement',
  },
  {
    month: 6,
    name: 'June',
    herdPosition: 'Western Serengeti / Grumeti River area',
    why: 'Herds reaching Grumeti. Early crossings possible. Rains ending.',
    verdict: 'Underrated month. Migration present with significantly fewer crowds than August. Grumeti crossings possible (smaller river, less dramatic than Mara). Excellent value-to-experience ratio.',
    suitableFor: [
      'Crowd-averse travelers',
      'Photographers',
      'Value-seekers',
      'Those with flexible crossing expectations',
    ],
    unsuitableFor: [
      'Travelers requiring Mara River specifically',
    ],
    linkedDecisions: ['migration-crowds', 'migration-month-position'],
    linkedItineraries: ['migration-transition', 'northern-serengeti-crossings'],
    crowdLevel: 'moderate',
    crossingProbability: 'moderate',
    calvingActive: false,
    phase: 'crossing',
  },
  {
    month: 7,
    name: 'July',
    herdPosition: 'Northern Serengeti / approaching Mara River',
    why: 'Herds consolidating in north. Early Mara River crossings possible. Dry season established.',
    verdict: 'Crossing season beginning. Probability building but not peak. Crowds increasing. Excellent balance of probability and vehicle density.',
    suitableFor: [
      'Crossing-focused travelers accepting some uncertainty',
      'Photographers',
      'Those avoiding August peak',
    ],
    unsuitableFor: [
      'Budget travelers (prices rising)',
      'Solitude seekers (crowds building)',
    ],
    linkedDecisions: ['migration-crowds', 'migration-cost', 'crossing-vs-calving'],
    linkedItineraries: ['northern-serengeti-crossings'],
    crowdLevel: 'high',
    crossingProbability: 'moderate',
    calvingActive: false,
    phase: 'crossing',
  },
  {
    month: 8,
    name: 'August',
    herdPosition: 'Northern Serengeti and Masai Mara (split)',
    why: 'Peak crossing probability. Herds moving between Tanzania and Kenya. Mara River crossings most likely.',
    verdict: 'Peak migration month. Highest crossing probability. Highest crowds. Highest prices. 15-40 vehicles at popular crossing points. The trade-off month: maximum drama potential, maximum company.',
    suitableFor: [
      'Travelers prioritizing crossing probability above all else',
      'Those accepting crowd trade-off',
      'Photographers with long lenses',
    ],
    unsuitableFor: [
      'Crowd-averse travelers',
      'Budget-conscious travelers',
      'Solitude seekers',
    ],
    refusalNote: 'If traveler wants August migration AND solitude, recommend private concessions at 2-3x cost or alternative timing. Cannot have both at standard pricing.',
    linkedDecisions: ['migration-crowds', 'migration-cost', 'migration-serengeti-vs-mara'],
    linkedItineraries: ['northern-serengeti-crossings', 'mara-migration-conservancy'],
    crowdLevel: 'peak',
    crossingProbability: 'high',
    calvingActive: false,
    phase: 'crossing',
  },
  {
    month: 9,
    name: 'September',
    herdPosition: 'Masai Mara primarily, some Northern Serengeti',
    why: 'Herds in Mara. Crossings continuing. Position shifting based on grass and rain patterns.',
    verdict: 'Excellent crossing month. Slightly lower crowds than August. Herds still active. Good balance month for crossing-focused travelers.',
    suitableFor: [
      'Crossing seekers',
      'Photographers',
      'Those avoiding peak August',
    ],
    unsuitableFor: [
      'Budget travelers (still peak pricing)',
      'Those wanting Serengeti specifically',
    ],
    linkedDecisions: ['migration-serengeti-vs-mara', 'migration-month-position'],
    linkedItineraries: ['mara-migration-conservancy', 'northern-serengeti-crossings'],
    crowdLevel: 'high',
    crossingProbability: 'high',
    calvingActive: false,
    phase: 'crossing',
  },
  {
    month: 10,
    name: 'October',
    herdPosition: 'Masai Mara (early), returning to Serengeti (late)',
    why: 'Herds beginning return south. Short rains approaching. Transition period.',
    verdict: 'Late crossing season. Crossings still possible early October. Crowds declining. Herds fragmenting. Uncertainty increasing by late month.',
    suitableFor: [
      'Flexible travelers',
      'Crowd-averse crossing seekers',
      'Photographers',
    ],
    unsuitableFor: [
      'Travelers with rigid expectations',
      'First-timers wanting guaranteed herds',
    ],
    linkedDecisions: ['migration-month-position', 'migration-crowds'],
    linkedItineraries: ['migration-transition', 'mara-migration-conservancy'],
    crowdLevel: 'moderate',
    crossingProbability: 'moderate',
    calvingActive: false,
    phase: 'return',
  },
  {
    month: 11,
    name: 'November',
    herdPosition: 'Eastern Serengeti, returning south',
    why: 'Short rains trigger return. Herds moving through Lobo and eastern corridor toward southern plains.',
    verdict: 'Return migration. Herds present but moving quickly. Position unpredictable. Lower crowds, lower prices. For flexible travelers.',
    suitableFor: [
      'Repeat visitors',
      'Flexible photographers',
      'Budget-conscious travelers',
    ],
    unsuitableFor: [
      'First-timers',
      'Crossing-focused travelers',
      'Those with rigid expectations',
    ],
    linkedDecisions: ['migration-month-position', 'green-season-value'],
    linkedItineraries: ['migration-transition'],
    crowdLevel: 'low',
    crossingProbability: 'none',
    calvingActive: false,
    phase: 'return',
  },
  {
    month: 12,
    name: 'December',
    herdPosition: 'Southern Serengeti, arriving for calving',
    why: 'Herds settling on short grass plains. Calving season preparation.',
    verdict: 'Pre-calving buildup. Herds concentrating. Wildlife action increasing. Good family travel month (school holidays). Not peak but building toward January-February.',
    suitableFor: [
      'Families',
      'First-timers',
      'Budget-conscious travelers',
      'Those seeking building action',
    ],
    unsuitableFor: [
      'Crossing seekers',
      'Peak calving demanders (wait for Feb)',
    ],
    linkedDecisions: ['migration-month-position', 'christmas-safari'],
    linkedItineraries: ['serengeti-calving-season'],
    crowdLevel: 'moderate',
    crossingProbability: 'none',
    calvingActive: false,
    phase: 'calving',
  },
];

/**
 * Get verdict for a specific month
 */
export function getMigrationVerdict(month: number): MigrationMonthVerdict | undefined {
  return MIGRATION_MONTH_VERDICTS.find((v) => v.month === month);
}

/**
 * Get current month's verdict
 */
export function getCurrentMigrationVerdict(): MigrationMonthVerdict {
  const currentMonth = new Date().getMonth() + 1;
  return getMigrationVerdict(currentMonth) || MIGRATION_MONTH_VERDICTS[0];
}

/**
 * Get verdicts by phase
 */
export function getVerdictsByPhase(phase: MigrationMonthVerdict['phase']): MigrationMonthVerdict[] {
  return MIGRATION_MONTH_VERDICTS.filter((v) => v.phase === phase);
}

/**
 * Get months with high crossing probability
 */
export function getCrossingMonths(): MigrationMonthVerdict[] {
  return MIGRATION_MONTH_VERDICTS.filter(
    (v) => v.crossingProbability === 'high' || v.crossingProbability === 'moderate'
  );
}

/**
 * Get calving months
 */
export function getCalvingMonths(): MigrationMonthVerdict[] {
  return MIGRATION_MONTH_VERDICTS.filter((v) => v.calvingActive || v.phase === 'calving');
}

/**
 * FAQ Data
 *
 * Structured FAQ content for SEO and traveler guidance.
 * Documentary tone - factual answers, no marketing hype.
 *
 * Categories:
 * - planning: Trip planning questions
 * - booking: How to book, what to expect
 * - destinations: Country and region questions
 * - timing: When to go, seasons, weather
 * - costs: Pricing, budgets, what's included
 * - logistics: Visas, flights, health
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  /** Pages where this FAQ should appear contextually */
  showOn?: ('contact' | 'inquire' | 'trips' | 'destinations' | 'home')[];
}

export type FAQCategory =
  | 'planning'
  | 'booking'
  | 'destinations'
  | 'timing'
  | 'costs'
  | 'logistics';

export const FAQ_CATEGORIES: Record<FAQCategory, { label: string; description: string }> = {
  planning: {
    label: 'Planning Your Safari',
    description: 'How the planning process works',
  },
  booking: {
    label: 'Booking & Process',
    description: 'What to expect when you book',
  },
  destinations: {
    label: 'Destinations',
    description: 'Country and region guidance',
  },
  timing: {
    label: 'When to Go',
    description: 'Seasons, weather, and timing',
  },
  costs: {
    label: 'Costs & Pricing',
    description: 'Budget guidance and what is included',
  },
  logistics: {
    label: 'Travel Logistics',
    description: 'Visas, flights, health requirements',
  },
};

export const FAQS: FAQ[] = [
  // ============================================
  // PLANNING
  // ============================================
  {
    id: 'how-planning-works',
    category: 'planning',
    question: 'How does the planning process work?',
    answer:
      'We start with a conversation to understand your priorities: when you want to travel, what matters most to you, and your budget range. We then build a custom itinerary with clear reasoning for each recommendation. You review it, we refine it together, and once confirmed, we handle all logistics.',
    showOn: ['contact', 'inquire'],
  },
  {
    id: 'how-long-to-plan',
    category: 'planning',
    question: 'How far in advance should I start planning?',
    answer:
      'Peak season requires 9-12 months for specific camps and 6 months if flexible on lodges. Green season needs 3-4 months. The difference: popular camps like Angama Mara or Singita book out a year ahead for July-September, while mid-range options remain available at 4-6 months.',
    showOn: ['contact'],
  },
  {
    id: 'custom-vs-set-itineraries',
    category: 'planning',
    question: 'Do you offer set itineraries or only custom trips?',
    answer:
      'Every trip is custom-built. Our sample itineraries show common trip shapes, but we adapt them based on your timing, budget, interests, and fitness level. Two travelers asking for a "Tanzania safari" will get different recommendations if their priorities differ.',
    showOn: ['trips'],
  },
  {
    id: 'group-size',
    category: 'planning',
    question: 'What group sizes do you work with?',
    answer:
      'We plan private safaris for couples, families, and small groups (typically 2-10 people). Each vehicle seats 4-7 guests comfortably. Larger groups can be accommodated with multiple vehicles. We do not operate join-in group tours.',
  },
  {
    id: 'first-time-safari',
    category: 'planning',
    question: 'Is this suitable for first-time safari travelers?',
    answer:
      'Yes. Most of our clients are first-time travelers. We teach behavior reading—when a lion\'s ears are forward vs. pinned back, why leopards move slowly vs. quickly—which turns random sightings into legible narratives. First-timers typically do better with proven parks (Serengeti, Masai Mara) rather than remote specialist destinations.',
    showOn: ['inquire'],
  },

  // ============================================
  // BOOKING
  // ============================================
  {
    id: 'how-to-book',
    category: 'booking',
    question: 'How do I book a safari?',
    answer:
      'Start with our inquiry form or schedule a call. After our initial conversation, we send a detailed proposal with itinerary, pricing, and reasoning. Once you approve, we secure your bookings with a deposit (typically 20-30%). Final payment is due 60-90 days before travel.',
    showOn: ['contact', 'inquire'],
  },
  {
    id: 'deposit-policy',
    category: 'booking',
    question: 'What is your deposit and payment policy?',
    answer:
      'A deposit of 20-30% secures your booking. The balance is due 60-90 days before departure, depending on the lodges and camps involved. We accept bank transfer and credit card. Specific terms are included in each proposal.',
  },
  {
    id: 'cancellation-policy',
    category: 'booking',
    question: 'What is your cancellation policy?',
    answer:
      'Cancellation terms vary by lodge and timing. Generally: full refund (minus admin fee) if cancelled 90+ days out, 50% refund 60-89 days out, no refund under 60 days. Some premium camps have stricter terms. We always recommend travel insurance.',
  },
  {
    id: 'travel-insurance',
    category: 'booking',
    question: 'Do I need travel insurance?',
    answer:
      'Yes. We require comprehensive travel insurance covering trip cancellation, medical emergencies, and evacuation. Safari regions can be remote, and medical evacuation to Nairobi or Johannesburg may cost $20,000-50,000 without insurance. We can recommend providers.',
  },
  {
    id: 'response-time',
    category: 'booking',
    question: 'How quickly will I receive a proposal?',
    answer:
      'For straightforward trips, within 2-3 business days. Complex multi-country itineraries may take longer. We prioritize getting it right over getting it fast. Rush requests can be accommodated if you let us know your timeline.',
    showOn: ['contact'],
  },

  // ============================================
  // DESTINATIONS
  // ============================================
  {
    id: 'tanzania-vs-kenya',
    category: 'destinations',
    question: 'Should I choose Tanzania or Kenya for my first safari?',
    answer:
      'Tanzania if you prioritize raw wilderness and want the Migration year-round—Serengeti is 6x larger than the Mara with fewer fenced boundaries. Kenya if you prefer conservancy access and shorter drives between parks—Mara conservancies limit vehicles to 4-6 per sighting vs. 20+ in Serengeti peak season. Tanzania costs 15-20% more in park fees; Kenya conservancy rates are comparable but include exclusive access.',
    showOn: ['destinations'],
  },
  {
    id: 'botswana-vs-east-africa',
    category: 'destinations',
    question: 'How does Botswana compare to East Africa?',
    answer:
      'Botswana is more exclusive and expensive, with smaller camps and strict visitor limits. The Okavango Delta offers unique water-based safaris. East Africa has bigger herds, the Great Migration, and more budget options. Botswana suits those prioritizing solitude; East Africa suits those wanting iconic wildlife density.',
    showOn: ['destinations'],
  },
  {
    id: 'which-countries',
    category: 'destinations',
    question: 'Which countries do you cover?',
    answer:
      'Tanzania, Kenya, Botswana, Zimbabwe, Zambia, Namibia, South Africa, Rwanda, and Uganda. Each has specific strengths: Tanzania and Kenya for migration and Big Five density, Botswana for water-based safari and low crowds, Rwanda and Uganda for gorillas, Namibia for landscapes and self-drive, South Africa for malaria-free options and value.',
    showOn: ['destinations', 'home'],
  },
  {
    id: 'combining-countries',
    category: 'destinations',
    question: 'Can I combine multiple countries in one trip?',
    answer:
      'Yes, though it adds complexity and cost. Common combinations: Tanzania + Zanzibar, Kenya + Rwanda (gorillas), Botswana + Victoria Falls. We generally recommend 2-3 locations maximum to avoid spending too much time in transit.',
  },

  // ============================================
  // TIMING
  // ============================================
  {
    id: 'best-time-safari',
    category: 'timing',
    question: 'When is the best time for a safari?',
    answer:
      'Big Five density: June-October when animals concentrate at water sources. Newborn animals: January-March during calving season. Migration river crossings: July-October in Kenya, December-July in Tanzania. Green season (November-May) offers 20-40% lower prices and quieter camps, with good but more dispersed wildlife.',
    showOn: ['home'],
  },
  {
    id: 'green-season-worth-it',
    category: 'timing',
    question: 'Is green season worth considering?',
    answer:
      'Yes, for many travelers. Prices drop 20-40%, lodges are quieter, and the landscape is photogenic. Wildlife viewing is still excellent, just more dispersed. Some regions (like the Kalahari) are actually better in green season. We can advise based on your destination.',
  },
  {
    id: 'migration-timing',
    category: 'timing',
    question: 'When can I see the Great Migration?',
    answer:
      'The Migration is year-round, just in different locations. Calving in southern Serengeti: January-March. River crossings in northern Serengeti: July-October. Masai Mara crossings: August-October. We can time your trip to the specific phase you want to see.',
  },
  {
    id: 'how-many-days',
    category: 'timing',
    question: 'How many days do I need for a safari?',
    answer:
      '5 days covers three parks and absorbs jet-lag loss. 7 days adds a second game drive per park—critical for shy species like leopards that require patience. Under 5 days means 40% of your time is transfers. 10-14 days allows multiple regions or a beach extension without rush.',
  },

  // ============================================
  // COSTS
  // ============================================
  {
    id: 'safari-cost',
    category: 'costs',
    question: 'How much does a safari cost?',
    answer:
      'Budgets vary widely. A mid-range Tanzania or Kenya safari runs $400-600 per person per day. Premium camps and exclusive areas range $800-1,500+ per day. Botswana starts around $800/day. Green season and longer trips reduce daily cost. We can work within most budgets above $350/day.',
    showOn: ['inquire', 'trips'],
  },
  {
    id: 'whats-included',
    category: 'costs',
    question: 'What is included in the price?',
    answer:
      'Most safari packages include: accommodation, all meals, game drives, park fees, and internal transfers. Not typically included: international flights, visas, travel insurance, tips, and premium drinks. We provide a detailed breakdown with every proposal.',
  },
  {
    id: 'budget-safari-possible',
    category: 'costs',
    question: 'Can I do a safari on a budget?',
    answer:
      'Yes, with trade-offs. Budget options ($250-400/day) use smaller lodges, shared vehicles, or camping. You see the same wildlife but with less exclusivity. Kenya and Tanzania offer the most budget-friendly options. Botswana and Rwanda are harder to do cheaply.',
  },
  {
    id: 'tipping',
    category: 'costs',
    question: 'How much should I tip?',
    answer:
      'Tipping is customary but not mandatory. General guidelines: guides $15-25 per person per day, camp staff $10-20 per person per day. Most camps have a shared tip box for staff. We provide specific guidance for each destination in your trip documents.',
  },

  // ============================================
  // LOGISTICS
  // ============================================
  {
    id: 'visa-requirements',
    category: 'logistics',
    question: 'Do I need a visa?',
    answer:
      'Most nationalities need visas for African safari destinations. Tanzania, Kenya, and Rwanda offer e-visas or visa-on-arrival. Some countries require advance applications. We provide specific visa guidance for your nationality and destinations as part of trip planning.',
    showOn: ['inquire'],
  },
  {
    id: 'vaccinations',
    category: 'logistics',
    question: 'What vaccinations do I need?',
    answer:
      'Yellow fever vaccination is required for some countries and recommended for others. Consult a travel medicine specialist 6-8 weeks before travel. Malaria prophylaxis is recommended for most safari areas. We provide destination-specific health guidance but recommend consulting your doctor.',
  },
  {
    id: 'flights',
    category: 'logistics',
    question: 'Do you book flights?',
    answer:
      'We handle all internal flights within Africa (bush planes, regional connections). For international flights, we can advise on routing and timing, but most clients prefer to book these directly or use frequent flyer miles. We coordinate arrival times with your safari schedule.',
  },
  {
    id: 'luggage-restrictions',
    category: 'logistics',
    question: 'Are there luggage restrictions on safari?',
    answer:
      'Yes. Bush planes typically allow 15-20kg in soft-sided bags. Hard suitcases are not permitted on most charter flights. Pack light, neutral colors, and layers. We provide a detailed packing list with your trip documents.',
  },
  {
    id: 'safety',
    category: 'logistics',
    question: 'Is it safe to go on safari?',
    answer:
      'Safari travel has a safety record comparable to European tourism. Lodges maintain 24-hour security; guides undergo annual certification in wilderness first aid; wildlife encounters follow established protocols. Incidents are rare—you are statistically safer on safari than driving to the airport. Medical evacuation insurance is essential for remote camps.',
  },
  {
    id: 'children-on-safari',
    category: 'logistics',
    question: 'Can I bring children on safari?',
    answer:
      'Yes, with considerations. Some camps have minimum age requirements (often 6-12 years). Family-friendly camps offer private vehicles, flexible schedules, and child-focused activities. We specialize in matching families with appropriate accommodations and activities.',
    showOn: ['inquire'],
  },
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: FAQCategory): FAQ[] {
  return FAQS.filter((faq) => faq.category === category);
}

/** Page identifiers where FAQs can be shown */
export type FAQPageContext = 'contact' | 'inquire' | 'trips' | 'destinations' | 'home';

/**
 * Get FAQs for a specific page context
 */
export function getFAQsForPage(page: FAQPageContext): FAQ[] {
  return FAQS.filter((faq) => faq.showOn?.includes(page));
}

/**
 * Get all FAQs grouped by category
 */
export function getFAQsGroupedByCategory(): Record<FAQCategory, FAQ[]> {
  const grouped: Record<FAQCategory, FAQ[]> = {
    planning: [],
    booking: [],
    destinations: [],
    timing: [],
    costs: [],
    logistics: [],
  };

  for (const faq of FAQS) {
    grouped[faq.category].push(faq);
  }

  return grouped;
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQ | undefined {
  return FAQS.find((faq) => faq.id === id);
}

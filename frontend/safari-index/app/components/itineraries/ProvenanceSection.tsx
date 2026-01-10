/**
 * ProvenanceSection Component
 *
 * Displays the decision-backed reasoning behind itinerary structure.
 * Shows why specific locations were chosen and what trade-offs were considered.
 *
 * Per governance: documentary tone, transparent reasoning, decision-backed.
 */

import Link from 'next/link';
import { Lightbulb, ArrowRight, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import type { Itinerary, ItinerarySegment } from '../../content/itineraries/types';

interface ProvenanceSectionProps {
  itinerary: Itinerary;
}

/**
 * Generate provenance explanations for each segment
 */
function getSegmentProvenance(segment: ItinerarySegment, itinerary: Itinerary): string {
  const { location, id } = segment;
  const locationLower = location.toLowerCase();

  // Generate context-aware explanations based on segment characteristics
  if (locationLower.includes('serengeti')) {
    return 'Central positioning maximizes predator encounters across the open plains. Migration location varies by month.';
  }
  if (locationLower.includes('ngorongoro')) {
    return 'Crater floor offers the highest density of wildlife in Africa. One full day is optimal; more time faces diminishing returns.';
  }
  if (locationLower.includes('tarangire')) {
    return 'Elephant concentrations peak here in dry season. Baobab landscape provides photographic variety from open plains.';
  }
  if (locationLower.includes('mara') || locationLower.includes('masai')) {
    return 'Conservancy positioning allows off-road driving and night drives not permitted in the national reserve.';
  }
  if (locationLower.includes('okavango') || locationLower.includes('delta')) {
    return 'Water-based activities require flood timing. Camp selection balances accessibility against exclusivity.';
  }
  if (locationLower.includes('chobe')) {
    return 'River frontage creates reliable elephant and predator sightings. Boat safaris add activity variety.';
  }
  if (locationLower.includes('luangwa')) {
    return 'Walking safari birthplace. Guide expertise here is unmatched. Remote positioning limits crowds.';
  }
  if (locationLower.includes('kruger') || locationLower.includes('sabi')) {
    return 'Private reserve borders allow traversing between properties. Big Five density is predictable.';
  }
  if (locationLower.includes('sossusvlei') || locationLower.includes('namib')) {
    return 'Dawn access to dunes requires nearby positioning. Light quality is optimal before 9am.';
  }
  if (locationLower.includes('etosha')) {
    return 'Waterhole positioning is strategic. Eastern vs western camps change which species dominate.';
  }
  if (locationLower.includes('bwindi') || locationLower.includes('volcanoes')) {
    return 'Gorilla group assignment affects trek difficulty. Permit timing constrains itinerary structure.';
  }
  if (locationLower.includes('kibale')) {
    return 'Chimpanzee habituation here is excellent. Morning treks have higher success rates.';
  }

  // Default explanation
  return 'Location selected for wildlife density, logistical efficiency, and alignment with stated priorities.';
}

/**
 * Get overall itinerary provenance based on style and region
 */
function getItineraryProvenance(itinerary: Itinerary): { icon: typeof Lightbulb; title: string; explanation: string }[] {
  const reasons: { icon: typeof Lightbulb; title: string; explanation: string }[] = [];

  // Duration reasoning
  reasons.push({
    icon: Clock,
    title: 'Duration logic',
    explanation: `${itinerary.duration_band.typical_days} days balances depth at each location against travel fatigue. Shorter trips sacrifice wildlife time; longer trips face diminishing returns.`,
  });

  // Route order reasoning
  reasons.push({
    icon: MapPin,
    title: 'Route sequence',
    explanation: 'Segment order minimizes backtracking and positions high-density wildlife areas at optimal points in the journey.',
  });

  // Comfort tier reasoning
  const tierReasons: Record<string, string> = {
    budget: 'Budget tier prioritizes wildlife access over amenities. Shared vehicles and basic camps reduce per-person costs without sacrificing game viewing.',
    mid: 'Mid-range tier balances comfort with value. Private guiding available; camps offer quality without premium positioning.',
    luxury: 'Premium positioning in private concessions or exclusive-use camps. Higher cost buys exclusivity, flexibility, and guide expertise.',
  };
  reasons.push({
    icon: DollarSign,
    title: 'Comfort positioning',
    explanation: tierReasons[itinerary.comfort_tier] || tierReasons.mid,
  });

  // Traveler fit reasoning
  reasons.push({
    icon: Users,
    title: 'Audience fit',
    explanation: itinerary.who_this_is_for,
  });

  return reasons;
}

/**
 * ProvenanceSection Component
 */
export function ProvenanceSection({ itinerary }: ProvenanceSectionProps) {
  const overallProvenance = getItineraryProvenance(itinerary);

  return (
    <section data-testid="provenance">
      <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
        Why This Itinerary Works
      </h2>

      {/* Overall reasoning */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <span className="font-medium text-stone-900">Decision provenance</span>
        </div>
        <p className="text-sm text-stone-600 mb-4">
          Every Vurara Safaris itinerary reflects specific trade-offs. Here is the reasoning behind this route:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {overallProvenance.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div key={idx} className="bg-white rounded-lg border border-stone-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-stone-800">{reason.title}</span>
                </div>
                <p className="text-sm text-stone-600">{reason.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Segment-level provenance */}
      <div className="space-y-3">
        <p className="text-sm text-stone-500 mb-4">
          Why each segment was chosen:
        </p>
        {itinerary.core_segments.map((segment) => (
          <div
            key={segment.id}
            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 font-medium text-sm">
              {segment.order}
            </div>
            <div className="flex-1">
              <p className="font-medium text-stone-900 text-sm">{segment.title}</p>
              <p className="text-sm text-stone-600 mt-1">
                {getSegmentProvenance(segment, itinerary)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Link to decision framework */}
      <div className="mt-6 p-4 bg-stone-100 rounded-lg border border-stone-200">
        <p className="text-sm text-stone-600 mb-3">
          These decisions are not arbitrary. They reflect documented trade-offs from thousands of safari conversations.
        </p>
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          How Vurara Safaris makes decisions
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

/**
 * Trip Qualification Section Component
 *
 * Clear "Right for you if" and "Not right for you if" guidance
 * to help travelers self-qualify before inquiring.
 *
 * Per governance: documentary, calm, honest tone.
 * Help users disqualify themselves as much as qualify.
 */

import {
  Check,
  X,
  Users,
  Wallet,
  Calendar,
  Clock,
  Mountain,
  Heart,
} from 'lucide-react';
import { cn } from '../../ui/utils';
import type { TripArchetype, TravelerFit, ComfortTier } from '../../content/trip-shapes/trips';

interface TripQualificationSectionProps {
  trip: TripArchetype;
  className?: string;
}

/**
 * Generate qualification criteria based on trip attributes
 */
function generateQualificationCriteria(trip: TripArchetype): {
  rightFor: Array<{ icon: React.ReactNode; text: string }>;
  notRightFor: Array<{ icon: React.ReactNode; text: string }>;
} {
  const rightFor: Array<{ icon: React.ReactNode; text: string }> = [];
  const notRightFor: Array<{ icon: React.ReactNode; text: string }> = [];

  // Traveler fit criteria
  if (trip.traveler_fit.includes('first-safari')) {
    rightFor.push({
      icon: <Users className="w-4 h-4" />,
      text: "You're planning your first safari and want a reliable introduction",
    });
  } else {
    notRightFor.push({
      icon: <Users className="w-4 h-4" />,
      text: "You've never been on safari and want the most accessible experience",
    });
  }

  if (trip.traveler_fit.includes('family')) {
    rightFor.push({
      icon: <Users className="w-4 h-4" />,
      text: 'You have children and need family-friendly logistics',
    });
  }

  if (trip.traveler_fit.includes('honeymoon')) {
    rightFor.push({
      icon: <Heart className="w-4 h-4" />,
      text: "You're celebrating a special occasion and want romance",
    });
  }

  if (trip.traveler_fit.includes('photography')) {
    rightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: "You're a serious photographer prioritizing light and positioning",
    });
  } else {
    notRightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: 'Photography is your primary goal and you need private vehicles',
    });
  }

  if (trip.traveler_fit.includes('adventure')) {
    rightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: "You're physically active and want walking or more adventurous activities",
    });
  }

  if (trip.traveler_fit.includes('repeat-visitor')) {
    rightFor.push({
      icon: <Users className="w-4 h-4" />,
      text: "You've been on safari before and want something different",
    });
  } else if (!trip.traveler_fit.includes('first-safari')) {
    notRightFor.push({
      icon: <Users className="w-4 h-4" />,
      text: "You're a safari veteran looking for off-the-beaten-path experiences",
    });
  }

  // Comfort tier criteria
  if (trip.comfort_tier === 'budget') {
    rightFor.push({
      icon: <Wallet className="w-4 h-4" />,
      text: 'Value matters more than luxury and you prioritize wildlife over comfort',
    });
    notRightFor.push({
      icon: <Wallet className="w-4 h-4" />,
      text: 'High-end accommodation and service is important to you',
    });
  } else if (trip.comfort_tier === 'luxury') {
    rightFor.push({
      icon: <Wallet className="w-4 h-4" />,
      text: 'Premium accommodation and exclusivity are priorities',
    });
    notRightFor.push({
      icon: <Wallet className="w-4 h-4" />,
      text: 'You have a limited budget and need the most cost-effective option',
    });
  }

  // Duration criteria
  const duration = Array.isArray(trip.duration_days) ? trip.duration_days : [trip.duration_days, trip.duration_days];
  if (duration[0] >= 10) {
    rightFor.push({
      icon: <Clock className="w-4 h-4" />,
      text: 'You have 10+ days and want an immersive, unhurried experience',
    });
    notRightFor.push({
      icon: <Clock className="w-4 h-4" />,
      text: "You're short on time and need a quick safari",
    });
  } else if (duration[1] <= 6) {
    rightFor.push({
      icon: <Clock className="w-4 h-4" />,
      text: 'You have limited time but still want a meaningful safari',
    });
    notRightFor.push({
      icon: <Clock className="w-4 h-4" />,
      text: 'You want a long, slow-paced journey across multiple regions',
    });
  }

  // Region-specific criteria
  if (trip.regions.includes('botswana')) {
    rightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: 'You want water-based safari experiences (mokoro, boat)',
    });
  }

  if (trip.regions.includes('uganda-rwanda')) {
    rightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: 'Gorilla or chimpanzee encounters are a priority',
    });
    notRightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: "You're focused on Big Five and savannah landscapes",
    });
  }

  if (trip.regions.includes('namibia')) {
    rightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: 'Dramatic landscapes and desert wildlife interest you',
    });
    notRightFor.push({
      icon: <Mountain className="w-4 h-4" />,
      text: "You want high-density Big Five game viewing",
    });
  }

  // Season criteria
  if (trip.best_months.length < 6) {
    rightFor.push({
      icon: <Calendar className="w-4 h-4" />,
      text: 'Your travel dates fall within the ideal season for this trip',
    });
  } else {
    rightFor.push({
      icon: <Calendar className="w-4 h-4" />,
      text: 'You have flexible dates and can travel most times of year',
    });
  }

  // Ensure we have at least 3-4 items in each list
  // Add generic criteria if needed
  if (rightFor.length < 3) {
    rightFor.push({
      icon: <Check className="w-4 h-4" />,
      text: 'You appreciate expert guidance and curated experiences',
    });
  }

  if (notRightFor.length < 2) {
    notRightFor.push({
      icon: <X className="w-4 h-4" />,
      text: 'You prefer completely independent, self-planned travel',
    });
  }

  // Limit to reasonable number
  return {
    rightFor: rightFor.slice(0, 5),
    notRightFor: notRightFor.slice(0, 4),
  };
}

export function TripQualificationSection({ trip, className = '' }: TripQualificationSectionProps) {
  const { rightFor, notRightFor } = generateQualificationCriteria(trip);

  return (
    <section className={cn('mb-8', className)} data-testid="section-qualification">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
        Is this the right trip for you?
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Right for you */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-medium text-green-800">Right for you if</h3>
          </div>
          <ul className="space-y-3">
            {rightFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="text-green-600 mt-0.5 flex-shrink-0">{item.icon}</div>
                <span className="text-sm text-green-900">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not right for you */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
              <X className="w-4 h-4 text-stone-500" />
            </div>
            <h3 className="font-medium text-stone-700">May not be right if</h3>
          </div>
          <ul className="space-y-3">
            {notRightFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="text-stone-400 mt-0.5 flex-shrink-0">{item.icon}</div>
                <span className="text-sm text-stone-600">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Unsure callout */}
      <div className="mt-4 bg-amber-50 rounded-lg border border-amber-200 px-4 py-3">
        <p className="text-sm text-amber-800">
          <strong>Not sure?</strong> Try our{' '}
          <a href="/safari-finder" className="underline hover:text-amber-900">
            Safari Finder
          </a>{' '}
          to see which trips match your priorities, or{' '}
          <a href={`/trips/compare?ids=${trip.id}`} className="underline hover:text-amber-900">
            compare trips
          </a>{' '}
          side by side.
        </p>
      </div>
    </section>
  );
}

export default TripQualificationSection;

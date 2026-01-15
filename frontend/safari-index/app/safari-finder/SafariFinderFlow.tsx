'use client';

/**
 * Safari Finder Decision Flow
 *
 * A structured decision tree that routes travelers based on priorities.
 * Each step reveals something about what matters, and the final recommendation
 * includes alternatives they might not have considered.
 */

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Camera,
  Users,
  Heart,
  Footprints,
  TreePine,
  Sparkles,
  Map,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../ui/utils';

// Step definitions
type StepId =
  | 'priority'
  | 'experience-level'
  | 'travel-style'
  | 'timing'
  | 'budget'
  | 'result';

interface Choice {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface Step {
  id: StepId;
  question: string;
  subtext?: string;
  choices: Choice[];
  multiSelect?: boolean;
}

const STEPS: Step[] = [
  {
    id: 'priority',
    question: 'What draws you to a safari?',
    subtext: 'This shapes everything—where to go, when, and how long.',
    choices: [
      {
        id: 'big-five',
        label: 'The Big Five',
        description: 'Lions, elephants, leopards, rhinos, buffalo—the iconic wildlife',
        icon: <TreePine className="w-5 h-5" />,
      },
      {
        id: 'migration',
        label: 'The Great Migration',
        description: 'Wildebeest herds, river crossings, predator action',
        icon: <Map className="w-5 h-5" />,
      },
      {
        id: 'primates',
        label: 'Gorillas or chimpanzees',
        description: 'Mountain gorillas in Rwanda/Uganda, chimps in forest reserves',
        icon: <TreePine className="w-5 h-5" />,
      },
      {
        id: 'photography',
        label: 'Wildlife photography',
        description: 'Optimal light, positioning, private vehicles, patience',
        icon: <Camera className="w-5 h-5" />,
      },
      {
        id: 'landscapes',
        label: 'Dramatic landscapes',
        description: 'Namibia dunes, Okavango waters, volcanic craters',
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        id: 'adventure',
        label: 'Active adventure',
        description: 'Walking safaris, canoe trips, camping under stars',
        icon: <Footprints className="w-5 h-5" />,
      },
      {
        id: 'not-sure',
        label: 'Not sure yet',
        description: 'Help me understand what\'s possible',
        icon: <Sparkles className="w-5 h-5" />,
      },
    ],
  },
  {
    id: 'experience-level',
    question: 'Have you been on a safari before?',
    subtext: 'First-timers and repeat visitors often want different things.',
    choices: [
      {
        id: 'first-time',
        label: 'This is my first safari',
        description: 'I want to understand what a safari is like',
      },
      {
        id: 'been-once',
        label: 'I\'ve done one safari',
        description: 'Looking for something different or deeper',
      },
      {
        id: 'experienced',
        label: 'Multiple safaris',
        description: 'Seeking specific experiences or remote areas',
      },
    ],
  },
  {
    id: 'travel-style',
    question: 'Who are you traveling with?',
    subtext: 'This affects logistics, accommodation, and pacing.',
    choices: [
      {
        id: 'couple',
        label: 'Partner / couple',
        description: 'Two adults, possibly romantic occasion',
        icon: <Heart className="w-5 h-5" />,
      },
      {
        id: 'family-kids',
        label: 'Family with children',
        description: 'Kids under 12 years old',
        icon: <Users className="w-5 h-5" />,
      },
      {
        id: 'family-teens',
        label: 'Family with teens',
        description: 'Teenagers who can handle adult activities',
        icon: <Users className="w-5 h-5" />,
      },
      {
        id: 'multigenerational',
        label: 'Multiple generations',
        description: 'Grandparents, parents, children together',
        icon: <Users className="w-5 h-5" />,
      },
      {
        id: 'friends',
        label: 'Friends group',
        description: 'Adults traveling together',
        icon: <Users className="w-5 h-5" />,
      },
      {
        id: 'solo',
        label: 'Solo',
        description: 'Traveling alone',
      },
    ],
  },
  {
    id: 'timing',
    question: 'When are you thinking of traveling?',
    subtext: 'Timing determines what\'s possible and what it costs.',
    choices: [
      {
        id: 'jun-oct',
        label: 'June to October',
        description: 'Peak dry season—best game viewing, highest demand',
        icon: <Clock className="w-5 h-5" />,
      },
      {
        id: 'jan-mar',
        label: 'January to March',
        description: 'Calving season, green landscapes, good value',
        icon: <Clock className="w-5 h-5" />,
      },
      {
        id: 'nov-dec',
        label: 'November to December',
        description: 'Short rains, shoulder season, fewer crowds',
        icon: <Clock className="w-5 h-5" />,
      },
      {
        id: 'apr-may',
        label: 'April to May',
        description: 'Green season, lowest prices, some camps close',
        icon: <Clock className="w-5 h-5" />,
      },
      {
        id: 'flexible',
        label: 'Flexible',
        description: 'Timing is open, optimize for experience or value',
        icon: <Clock className="w-5 h-5" />,
      },
    ],
  },
  {
    id: 'budget',
    question: 'What\'s your realistic budget per person?',
    subtext: 'Excluding international flights. Honest budgeting prevents disappointment.',
    choices: [
      {
        id: 'under-4k',
        label: 'Under $4,000',
        description: 'Budget lodges, shared vehicles, shorter trips',
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        id: '4k-8k',
        label: '$4,000–$8,000',
        description: 'Mid-range, good quality, most options available',
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        id: '8k-15k',
        label: '$8,000–$15,000',
        description: 'Luxury camps, private vehicles, premium locations',
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        id: 'over-15k',
        label: 'Over $15,000',
        description: 'Ultra-luxury, fly-in camps, maximum exclusivity',
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        id: 'need-guidance',
        label: 'Need guidance',
        description: 'Help me understand what things cost',
        icon: <DollarSign className="w-5 h-5" />,
      },
    ],
  },
];

// Recommendation logic
interface Recommendation {
  primary: {
    tripId: string;
    title: string;
    reason: string;
  };
  alternatives: {
    tripId: string;
    title: string;
    reason: string;
  }[];
  considerations: string[];
  warnings?: string[];
}

function generateRecommendation(answers: Record<string, string>): Recommendation {
  const { priority, 'experience-level': experience, 'travel-style': travelStyle, timing, budget } = answers;

  // Default recommendation structure
  let recommendation: Recommendation = {
    primary: {
      tripId: 'classic-serengeti-ngorongoro',
      title: 'Classic Serengeti and Ngorongoro',
      reason: 'The most complete first safari experience with reliable wildlife viewing.',
    },
    alternatives: [],
    considerations: [],
  };

  // Priority-based routing
  if (priority === 'primates') {
    if (budget === 'under-4k' || budget === '4k-8k') {
      recommendation.primary = {
        tripId: 'uganda-primate-safari',
        title: 'Uganda Primate Safari',
        reason: 'Gorillas plus chimps plus savannah—Uganda permits cost $800 vs Rwanda\'s $1,500.',
      };
      recommendation.alternatives.push({
        tripId: 'rwanda-gorilla-focused',
        title: 'Rwanda Gorilla Trek',
        reason: 'More efficient logistics from Kigali, but higher permit cost.',
      });
    } else {
      recommendation.primary = {
        tripId: 'rwanda-gorilla-focused',
        title: 'Rwanda Gorilla Trek',
        reason: 'Efficient logistics from Kigali, luxury lodges, concentrated experience.',
      };
      recommendation.alternatives.push({
        tripId: 'uganda-primate-safari',
        title: 'Uganda Primate Safari',
        reason: 'More diverse wildlife and lower permit cost, but longer drives.',
      });
    }
    recommendation.considerations.push(
      'Gorilla permits must be booked months in advance',
      'Trek difficulty varies—fitness matters'
    );
  } else if (priority === 'migration') {
    if (timing === 'jan-mar') {
      recommendation.primary = {
        tripId: 'migration-focused-serengeti',
        title: 'Migration-Focused Serengeti (Calving)',
        reason: 'January-February calving season offers reliable predator action daily.',
      };
      recommendation.considerations.push(
        'Calving happens in the southern Serengeti',
        'Less dramatic than crossings, but more predictable'
      );
    } else {
      recommendation.primary = {
        tripId: 'migration-focused-serengeti',
        title: 'Migration-Focused Serengeti',
        reason: 'Position for river crossings July-October in northern Serengeti.',
      };
      recommendation.alternatives.push({
        tripId: 'classic-kenya-safari',
        title: 'Masai Mara Migration',
        reason: 'Kenya side offers more concentrated access but higher crowds.',
      });
      recommendation.considerations.push(
        'Crossings are unpredictable—no guarantees on any specific day',
        'Peak season means higher prices and more vehicles'
      );
    }
  } else if (priority === 'landscapes') {
    recommendation.primary = {
      tripId: 'namibia-highlights',
      title: 'Namibia Highlights',
      reason: 'Sossusvlei dunes, Etosha salt pans, Skeleton Coast—landscape-first safari.',
    };
    recommendation.alternatives.push(
      {
        tripId: 'okavango-delta-immersion',
        title: 'Okavango Delta',
        reason: 'Water-based experience in a unique inland delta ecosystem.',
      },
      {
        tripId: 'botswana-diverse-ecosystems',
        title: 'Botswana Diverse',
        reason: 'Delta, desert, and saltpans in one journey.',
      }
    );
    recommendation.considerations.push(
      'Namibia has lower wildlife density than East Africa',
      'Self-drive is common and practical in Namibia'
    );
  } else if (priority === 'adventure') {
    recommendation.primary = {
      tripId: 'zambia-walking-safari',
      title: 'Zambia Walking Safari',
      reason: 'On-foot safari in the birthplace of walking safaris—genuine wilderness immersion.',
    };
    recommendation.alternatives.push({
      tripId: 'namibia-self-drive',
      title: 'Namibia Self-Drive',
      reason: 'Independent exploration with maximum flexibility.',
    });
    recommendation.considerations.push(
      'Walking safaris are physically demanding',
      'Limited to dry season when practical'
    );
  } else if (priority === 'photography') {
    recommendation.primary = {
      tripId: 'photography-focused-safari',
      title: 'Photography-Focused Safari',
      reason: 'Private vehicles, golden hour positioning, extended sightings.',
    };
    recommendation.alternatives.push({
      tripId: 'kenya-conservancy-focused',
      title: 'Kenya Conservancy Experience',
      reason: 'Off-road access and vehicle limits mean better angles.',
    });
    recommendation.considerations.push(
      'Private vehicle adds significant cost but transforms results',
      'Non-photographer companions may find pace slow'
    );
  }

  // Experience level adjustments
  if (experience === 'first-time' && !['primates', 'landscapes', 'adventure'].includes(priority)) {
    // First-timers should consider classic circuits
    if (recommendation.primary.tripId !== 'classic-serengeti-ngorongoro') {
      recommendation.alternatives.unshift({
        tripId: 'classic-serengeti-ngorongoro',
        title: 'Classic Serengeti and Ngorongoro',
        reason: 'First safaris often benefit from the complete East African experience before specializing.',
      });
    }
  }

  if (experience === 'experienced') {
    // Experienced travelers might want alternatives
    if (!recommendation.alternatives.find(a => a.tripId === 'tanzania-southern-circuit')) {
      recommendation.alternatives.push({
        tripId: 'tanzania-southern-circuit',
        title: 'Tanzania Southern Circuit',
        reason: 'Remote wilderness for repeat visitors seeking solitude.',
      });
    }
  }

  // Travel style adjustments
  if (travelStyle === 'family-kids') {
    recommendation.considerations.push(
      'Some camps have minimum age requirements',
      'Walking safaris typically require 16+ age'
    );
    if (!recommendation.alternatives.find(a => a.tripId === 'kruger-greater-kruger')) {
      recommendation.alternatives.push({
        tripId: 'kruger-greater-kruger',
        title: 'Greater Kruger',
        reason: 'Malaria-free areas available, good for young children.',
      });
    }
  }

  if (travelStyle === 'multigenerational') {
    recommendation.primary = {
      tripId: 'family-multigenerational',
      title: 'Multigenerational Family Safari',
      reason: 'Pacing and logistics designed for three generations traveling together.',
    };
    recommendation.considerations.push(
      'Pace accommodates slowest member',
      'Private vehicles essential for flexibility'
    );
  }

  if (travelStyle === 'couple' && budget !== 'under-4k') {
    if (!recommendation.alternatives.find(a => a.tripId === 'honeymoon-romance-safari')) {
      recommendation.alternatives.push({
        tripId: 'honeymoon-romance-safari',
        title: 'Honeymoon Safari',
        reason: 'Intimate camps and romantic settings for couples.',
      });
    }
  }

  // Budget warnings
  if (budget === 'under-4k') {
    if (['okavango-delta-immersion', 'botswana-diverse-ecosystems'].includes(recommendation.primary.tripId)) {
      recommendation.warnings = [
        'Your budget of under $4,000 is below the minimum for Botswana fly-in camps. Consider South Luangwa or Greater Kruger as alternatives with similar wildlife at lower cost.',
      ];
      recommendation.alternatives.unshift({
        tripId: 'kruger-greater-kruger',
        title: 'Greater Kruger',
        reason: 'Quality Big Five safari at a fraction of Botswana cost.',
      });
    }
    recommendation.considerations.push(
      'Budget safaris often use shared vehicles',
      'Consider green season for 30-40% savings'
    );
  }

  if (budget === 'need-guidance') {
    recommendation.considerations.push(
      'Quality safaris typically cost $500-1,200/person/day all-inclusive',
      'Botswana and fly-in camps cost more; Kenya/Tanzania drive-in costs less'
    );
  }

  // Timing warnings
  if (timing === 'apr-may') {
    recommendation.warnings = recommendation.warnings || [];
    recommendation.warnings.push(
      'April-May is green season. Some camps close, roads can be challenging, but prices are lowest and landscapes are lush.'
    );
  }

  // Limit alternatives to 3
  recommendation.alternatives = recommendation.alternatives.slice(0, 3);

  return recommendation;
}

// Components
function ChoiceCard({
  choice,
  selected,
  onSelect,
}: {
  choice: Choice;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all',
        selected
          ? 'border-amber-500 bg-amber-50'
          : 'border-stone-200 bg-white hover:border-stone-300'
      )}
    >
      <div className="flex items-start gap-3">
        {choice.icon && (
          <div className={cn(
            'mt-0.5 p-2 rounded-lg',
            selected ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'
          )}>
            {choice.icon}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={cn(
              'font-medium',
              selected ? 'text-amber-900' : 'text-stone-900'
            )}>
              {choice.label}
            </span>
            {selected && (
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <p className={cn(
            'text-sm mt-1',
            selected ? 'text-amber-700' : 'text-stone-500'
          )}>
            {choice.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function ResultCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="space-y-6">
      {/* Primary Recommendation */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-900 px-6 py-4">
          <p className="text-stone-400 text-sm">Our recommendation</p>
          <h3 className="font-editorial text-xl text-white mt-1">
            {recommendation.primary.title}
          </h3>
        </div>
        <div className="p-6">
          <p className="text-stone-600">{recommendation.primary.reason}</p>
          <Link
            href={`/trips/${recommendation.primary.tripId}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            View this trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Warnings */}
      {recommendation.warnings && recommendation.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800 mb-2">Important consideration</p>
          {recommendation.warnings.map((warning, idx) => (
            <p key={idx} className="text-sm text-amber-700">{warning}</p>
          ))}
        </div>
      )}

      {/* Alternatives */}
      {recommendation.alternatives.length > 0 && (
        <div>
          <h4 className="font-medium text-stone-900 mb-3">Alternatives to consider</h4>
          <div className="space-y-3">
            {recommendation.alternatives.map((alt) => (
              <Link
                key={alt.tripId}
                href={`/trips/${alt.tripId}`}
                className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                      {alt.title}
                    </p>
                    <p className="text-sm text-stone-500 mt-1">{alt.reason}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Considerations */}
      {recommendation.considerations.length > 0 && (
        <div className="bg-stone-50 rounded-xl p-4">
          <p className="text-sm font-medium text-stone-700 mb-2">Things to know</p>
          <ul className="space-y-1">
            {recommendation.considerations.map((consideration, idx) => (
              <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                <span className="text-stone-400 mt-1">•</span>
                {consideration}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="bg-stone-900 rounded-xl p-6 text-center">
        <p className="text-stone-400 text-sm mb-2">Ready to discuss your options?</p>
        <p className="text-white mb-4">
          Share your priorities and we'll help refine the right fit.
        </p>
        <Link
          href="/inquire"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
        >
          Start planning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function SafariFinderFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const showResult = currentStepIndex >= STEPS.length;

  const handleSelect = useCallback((choiceId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep.id]: choiceId,
    }));
  }, [currentStep?.id]);

  const handleNext = useCallback(() => {
    if (answers[currentStep.id]) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [answers, currentStep?.id]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const recommendation = showResult ? generateRecommendation(answers) : null;

  if (showResult && recommendation) {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={() => setCurrentStepIndex(STEPS.length - 1)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Adjust answers
        </button>

        <ResultCard recommendation={recommendation} />
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
          <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
          <span>{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="font-editorial text-2xl font-semibold text-stone-900">
          {currentStep.question}
        </h2>
        {currentStep.subtext && (
          <p className="text-stone-500 mt-2">{currentStep.subtext}</p>
        )}
      </div>

      {/* Choices */}
      <div className="space-y-3 mb-8">
        {currentStep.choices.map((choice) => (
          <ChoiceCard
            key={choice.id}
            choice={choice}
            selected={answers[currentStep.id] === choice.id}
            onSelect={() => handleSelect(choice.id)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {currentStepIndex > 0 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={!answers[currentStep.id]}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
            answers[currentStep.id]
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          )}
        >
          {isLastStep ? 'See recommendations' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

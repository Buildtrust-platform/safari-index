/**
 * DecisionProcess Component
 *
 * Static 4-step diagram explaining how Safari Index makes decisions.
 * Documentary aesthetic - calm, informational, no animation.
 *
 * Steps:
 * 1. Question framed
 * 2. Context gathered
 * 3. Trade-offs weighed
 * 4. Verdict issued
 *
 * Governance:
 * - 01_brand_voice.md: Senior safari planner voice
 * - 02_decision_doctrine.md: Decision framework reference
 * - 13_frontend_templates.md: Component patterns
 */

import { cn } from '../../ui/utils';
import { Text, Heading3, Meta } from '../ui';
import { MessageCircle, Compass, Scale, CheckCircle } from 'lucide-react';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Question framed',
    description:
      'Each decision starts with a clear, answerable question about a specific safari choice.',
    icon: MessageCircle,
  },
  {
    number: 2,
    title: 'Context gathered',
    description:
      'We consider timing, destinations, traveler preferences, and seasonal factors.',
    icon: Compass,
  },
  {
    number: 3,
    title: 'Trade-offs weighed',
    description:
      'Every option has gains and losses. We surface both so you can decide what matters.',
    icon: Scale,
  },
  {
    number: 4,
    title: 'Verdict issued',
    description:
      'A clear recommendation—book, wait, or skip—with the reasoning and conditions stated.',
    icon: CheckCircle,
  },
];

function ProcessStepCard({ step, isLast }: { step: ProcessStep; isLast: boolean }) {
  const IconComponent = step.icon;

  return (
    <div className="relative flex gap-4">
      {/* Step indicator with connecting line */}
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-white" aria-hidden />
        </div>
        {/* Connecting line - hidden on last step */}
        {!isLast && (
          <div className="w-px h-full bg-neutral-200 my-2" aria-hidden />
        )}
      </div>

      {/* Step content */}
      <div className={cn('flex-1 pb-8', isLast && 'pb-0')}>
        <div className="flex items-center gap-2 mb-1">
          <Meta className="text-neutral-500">Step {step.number}</Meta>
        </div>
        <Heading3 className="mb-2">{step.title}</Heading3>
        <Text variant="body" color="secondary">
          {step.description}
        </Text>
      </div>
    </div>
  );
}

export interface DecisionProcessProps {
  /** Show compact version without descriptions */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DecisionProcess - 4-step decision diagram
 *
 * Visual explanation of how Safari Index approaches decisions.
 * Static, documentary treatment - no animations or interactivity.
 */
export function DecisionProcess({ compact = false, className }: DecisionProcessProps) {
  if (compact) {
    // Compact inline version for sidebars or summaries
    return (
      <div className={cn('flex flex-wrap gap-6', className)}>
        {PROCESS_STEPS.map((step) => {
          const IconComponent = step.icon;
          return (
            <div key={step.number} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center">
                <span className="text-xs font-medium text-white">{step.number}</span>
              </div>
              <Text variant="meta" color="secondary">
                {step.title}
              </Text>
            </div>
          );
        })}
      </div>
    );
  }

  // Full version with descriptions
  return (
    <div className={cn('', className)}>
      {PROCESS_STEPS.map((step, index) => (
        <ProcessStepCard
          key={step.number}
          step={step}
          isLast={index === PROCESS_STEPS.length - 1}
        />
      ))}
    </div>
  );
}

/**
 * ProcessStepHighlight - Single step with emphasis
 *
 * For use when highlighting a specific step in context.
 */
export function ProcessStepHighlight({
  stepNumber,
  className,
}: {
  stepNumber: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const step = PROCESS_STEPS.find((s) => s.number === stepNumber);
  if (!step) return null;

  const IconComponent = step.icon;

  return (
    <div
      className={cn(
        'flex gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-lg',
        className
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
        <IconComponent className="w-5 h-5 text-white" aria-hidden />
      </div>
      <div>
        <Meta className="text-neutral-500 mb-1">Step {step.number}</Meta>
        <Heading3 className="mb-1">{step.title}</Heading3>
        <Text variant="body" color="secondary">
          {step.description}
        </Text>
      </div>
    </div>
  );
}

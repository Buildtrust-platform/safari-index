'use client';

/**
 * SafariQuizContent Component
 *
 * Interactive quiz for personalized trip recommendations.
 * Steps through questions and displays matching trips.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  MapPin,
  Sparkles,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
  QUIZ_QUESTIONS,
  TRIP_DISPLAY,
  getRecommendations,
  type QuizQuestion,
  type QuizOption,
  type TripMatch,
} from './quiz-data';

/**
 * Progress indicator
 */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = ((current) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Option card component
 */
function OptionCard({
  option,
  isSelected,
  onSelect,
  isMultiple,
}: {
  option: QuizOption;
  isSelected: boolean;
  onSelect: () => void;
  isMultiple: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left p-4 rounded-xl border-2 transition-all',
        isSelected
          ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {isSelected ? (
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
          ) : (
            <Circle className="w-5 h-5 text-stone-300" />
          )}
        </div>
        <div className="flex-1">
          <p className={cn(
            'font-medium',
            isSelected ? 'text-amber-900' : 'text-stone-900'
          )}>
            {option.label}
          </p>
          {option.description && (
            <p className={cn(
              'text-sm mt-0.5',
              isSelected ? 'text-amber-700' : 'text-stone-500'
            )}>
              {option.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

/**
 * Question component
 */
function QuestionStep({
  question,
  selectedOptions,
  onSelect,
  onNext,
  onBack,
  isFirst,
  isLast,
  canProceed,
}: {
  question: QuizQuestion;
  selectedOptions: string[];
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
}) {
  const handleSelect = (optionId: string) => {
    onSelect(optionId);
    // Auto-advance for single-select questions
    if (question.type === 'single') {
      setTimeout(onNext, 300);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-stone-500 mt-2">{question.description}</p>
        )}
      </div>

      <div className="grid gap-3 max-w-xl mx-auto">
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={selectedOptions.includes(option.id)}
            onSelect={() => handleSelect(option.id)}
            isMultiple={question.type === 'multiple'}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          disabled={isFirst}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isFirst
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-600 hover:bg-stone-100'
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {question.type === 'multiple' && (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors',
              canProceed
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            )}
          >
            {isLast ? 'See Results' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Result card component
 */
function ResultCard({ match, rank }: { match: TripMatch; rank: number }) {
  const tripInfo = TRIP_DISPLAY[match.tripId];
  if (!tripInfo) return null;

  return (
    <Link
      href={`/trips/${match.tripId}`}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
            rank === 1 ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'
          )}>
            {rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-amber-700 mb-1">
              <MapPin className="w-3 h-3" />
              {tripInfo.region}
            </div>
            <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
              {tripInfo.title}
            </h3>
            <p className="text-sm text-stone-500 mt-1">{tripInfo.subtitle}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-stone-400">
                {match.score} matching criteria
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Results component
 */
function Results({
  answers,
  onRestart,
}: {
  answers: Record<string, string[]>;
  onRestart: () => void;
}) {
  const recommendations = useMemo(() => getRecommendations(answers, 5), [answers]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
          <Sparkles className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-900">
          Your Perfect Safaris
        </h2>
        <p className="text-stone-500 mt-2 max-w-md mx-auto">
          Based on your preferences, here are our top recommendations for you.
        </p>
      </div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {recommendations.length > 0 ? (
          recommendations.map((match, index) => (
            <ResultCard key={match.tripId} match={match} rank={index + 1} />
          ))
        ) : (
          <div className="text-center py-8 bg-stone-50 rounded-xl">
            <p className="text-stone-500">
              No exact matches found. Try adjusting your preferences.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
        <Link
          href="/inquire"
          className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
        >
          Discuss with an Expert
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5 text-center max-w-2xl mx-auto">
        <p className="text-stone-700">
          Want more personalized recommendations? Share your exact dates and
          budget with our safari experts.
        </p>
        <Link
          href="/inquire"
          className="inline-flex items-center gap-2 mt-3 text-amber-700 hover:text-amber-800 font-medium text-sm"
        >
          Start a conversation
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Main quiz component
 */
export default function SafariQuizContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const currentAnswers = answers[currentQuestion?.id] || [];

  const handleSelect = (optionId: string) => {
    const question = QUIZ_QUESTIONS[currentStep];

    if (question.type === 'single') {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: [optionId],
      }));
    } else {
      setAnswers((prev) => {
        const current = prev[question.id] || [];
        const maxSelections = question.maxSelections || Infinity;

        if (current.includes(optionId)) {
          return {
            ...prev,
            [question.id]: current.filter((id) => id !== optionId),
          };
        } else if (current.length < maxSelections) {
          return {
            ...prev,
            [question.id]: [...current, optionId],
          };
        }
        return prev;
      });
    }
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  // Can proceed if at least one option is selected
  const canProceed = currentAnswers.length > 0;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Results answers={answers} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <ProgressBar current={currentStep + 1} total={QUIZ_QUESTIONS.length} />
      </div>

      <QuestionStep
        question={currentQuestion}
        selectedOptions={currentAnswers}
        onSelect={handleSelect}
        onNext={handleNext}
        onBack={handleBack}
        isFirst={currentStep === 0}
        isLast={currentStep === QUIZ_QUESTIONS.length - 1}
        canProceed={canProceed}
      />
    </div>
  );
}

/**
 * Safari Index Output Enforcer
 * Enforces verdict-or-refusal logic and validates AI output
 * Aligned with:
 * - 02_decision_doctrine.md (decision rules)
 * - 08_ai_behavior.md (output constraints)
 * - 12_ai_prompts.md (output schemas, forbidden patterns)
 */

import {
  AIOutput,
  DecisionOutput,
  RefusalOutput,
  ClarificationOutput,
  TradeoffExplanationOutput,
  RevisionOutput,
  ValidationResult,
  ValidationError,
} from './types';

// Forbidden phrases from 12_ai_prompts.md
const FORBIDDEN_PHRASES = [
  'unforgettable',
  'magical',
  'once-in-a-lifetime',
  'breathtaking',
  'seamless',
  'curated',
  'unlock',
  'elevate',
  'world-class',
  'hidden gem',
  'bucket list',
  'AI-powered',
  // Additional forbidden patterns from 08_ai_behavior.md
  "you'll love",
  'perfect for',
  'ideal choice',
  'great option',
];

// Hard-fail patterns from 12_ai_prompts.md section 8
const GUARANTEE_PATTERNS = [
  /you will see/i,
  /guaranteed sightings/i,
  /you are guaranteed/i,
  /promise you/i,
  /certainly will/i,
  /definitely will/i,
];

const SELF_REFERENCE_PATTERNS = [/as an ai/i, /i am an ai/i, /as a language model/i];

/**
 * Detects forbidden phrases in text
 * Returns list of detected violations
 */
export function detectForbiddenPhrases(text: string): string[] {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of FORBIDDEN_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      violations.push(`Forbidden phrase detected: "${phrase}"`);
    }
  }

  return violations;
}

/**
 * Detects guarantee language that violates the constitution
 */
export function detectGuarantees(text: string): string[] {
  const violations: string[] = [];

  for (const pattern of GUARANTEE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(`Guarantee language detected: ${pattern.source}`);
    }
  }

  return violations;
}

/**
 * Detects self-reference that violates constitution
 */
export function detectSelfReference(text: string): string[] {
  const violations: string[] = [];

  for (const pattern of SELF_REFERENCE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(`Self-reference detected: ${pattern.source}`);
    }
  }

  return violations;
}

/**
 * Detects emojis in text (forbidden in output)
 */
export function detectEmojis(text: string): boolean {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
}

/**
 * Detects exclamation marks (forbidden in output per voice rules)
 */
export function detectExclamationMarks(text: string): boolean {
  return text.includes('!');
}

/**
 * Validates a decision output structure
 * Per 12_ai_prompts.md section 3 and 08_ai_behavior.md section 5
 */
function validateDecisionOutput(
  output: DecisionOutput,
  errors: ValidationError[]
): void {
  const { decision } = output;

  // Verdict is required
  if (!decision.outcome) {
    errors.push({
      field: 'decision.outcome',
      message: 'Decision outcome (verdict) is required',
    });
  } else if (!['book', 'wait', 'switch', 'discard'].includes(decision.outcome)) {
    errors.push({
      field: 'decision.outcome',
      message: 'Decision outcome must be: book, wait, switch, or discard',
    });
  }

  // Headline is required (max 90 chars)
  if (!decision.headline) {
    errors.push({
      field: 'decision.headline',
      message: 'Decision headline is required',
    });
  } else if (decision.headline.length > 90) {
    errors.push({
      field: 'decision.headline',
      message: 'Decision headline must be 90 characters or less',
    });
  }

  // Summary is required
  if (!decision.summary) {
    errors.push({
      field: 'decision.summary',
      message: 'Decision summary is required',
    });
  }

  // Assumptions are required (2-5 per schema)
  if (!decision.assumptions || !Array.isArray(decision.assumptions)) {
    errors.push({
      field: 'decision.assumptions',
      message: 'Assumptions array is required',
    });
  } else if (decision.assumptions.length < 2 || decision.assumptions.length > 5) {
    errors.push({
      field: 'decision.assumptions',
      message: 'Must have 2-5 explicit assumptions',
    });
  } else {
    for (let i = 0; i < decision.assumptions.length; i++) {
      const assumption = decision.assumptions[i];
      if (!assumption.id || !assumption.text) {
        errors.push({
          field: `decision.assumptions[${i}]`,
          message: 'Each assumption must have id and text',
        });
      }
      if (
        typeof assumption.confidence !== 'number' ||
        assumption.confidence < 0 ||
        assumption.confidence > 1
      ) {
        errors.push({
          field: `decision.assumptions[${i}].confidence`,
          message: 'Assumption confidence must be a number between 0 and 1',
        });
      }
    }
  }

  // Trade-offs are required (at least 1 gain and 1 loss)
  if (!decision.tradeoffs) {
    errors.push({
      field: 'decision.tradeoffs',
      message: 'Trade-offs are required',
    });
  } else {
    if (
      !decision.tradeoffs.gains ||
      !Array.isArray(decision.tradeoffs.gains) ||
      decision.tradeoffs.gains.length < 1
    ) {
      errors.push({
        field: 'decision.tradeoffs.gains',
        message: 'At least one trade-off gain is required',
      });
    }
    if (
      !decision.tradeoffs.losses ||
      !Array.isArray(decision.tradeoffs.losses) ||
      decision.tradeoffs.losses.length < 1
    ) {
      errors.push({
        field: 'decision.tradeoffs.losses',
        message: 'At least one trade-off loss is required',
      });
    }
  }

  // Change conditions are required (2-4 per schema)
  if (!decision.change_conditions || !Array.isArray(decision.change_conditions)) {
    errors.push({
      field: 'decision.change_conditions',
      message: 'Change conditions array is required',
    });
  } else if (
    decision.change_conditions.length < 2 ||
    decision.change_conditions.length > 4
  ) {
    errors.push({
      field: 'decision.change_conditions',
      message: 'Must have 2-4 change conditions',
    });
  }

  // Confidence is required (0-1)
  if (
    typeof decision.confidence !== 'number' ||
    decision.confidence < 0 ||
    decision.confidence > 1
  ) {
    errors.push({
      field: 'decision.confidence',
      message: 'Confidence must be a number between 0 and 1',
    });
  }

  // Check for forbidden content in text fields
  const textToCheck = [decision.headline, decision.summary].join(' ');
  const forbiddenViolations = detectForbiddenPhrases(textToCheck);
  const guaranteeViolations = detectGuarantees(textToCheck);
  const selfRefViolations = detectSelfReference(textToCheck);

  for (const violation of [
    ...forbiddenViolations,
    ...guaranteeViolations,
    ...selfRefViolations,
  ]) {
    errors.push({ field: 'decision.content', message: violation });
  }

  if (detectEmojis(textToCheck)) {
    errors.push({
      field: 'decision.content',
      message: 'Emojis are forbidden in output',
    });
  }

  if (detectExclamationMarks(textToCheck)) {
    errors.push({
      field: 'decision.content',
      message: 'Exclamation marks are forbidden in output',
    });
  }
}

/**
 * Validates a refusal output structure
 * Per 12_ai_prompts.md section 4
 */
function validateRefusalOutput(
  output: RefusalOutput,
  errors: ValidationError[]
): void {
  const { refusal } = output;

  if (!refusal.reason) {
    errors.push({
      field: 'refusal.reason',
      message: 'Refusal reason is required',
    });
  }

  if (
    !refusal.missing_or_conflicting_inputs ||
    !Array.isArray(refusal.missing_or_conflicting_inputs)
  ) {
    errors.push({
      field: 'refusal.missing_or_conflicting_inputs',
      message: 'Missing or conflicting inputs array is required',
    });
  } else if (
    refusal.missing_or_conflicting_inputs.length < 2 ||
    refusal.missing_or_conflicting_inputs.length > 5
  ) {
    errors.push({
      field: 'refusal.missing_or_conflicting_inputs',
      message: 'Must list 2-5 specific missing or conflicting inputs',
    });
  }

  if (!refusal.safe_next_step) {
    errors.push({
      field: 'refusal.safe_next_step',
      message: 'Safe next step is required',
    });
  }
}

/**
 * Validates a clarification output structure
 * Per 12_ai_prompts.md section 5
 */
function validateClarificationOutput(
  output: ClarificationOutput,
  errors: ValidationError[]
): void {
  const { clarification } = output;

  if (!clarification.questions || !Array.isArray(clarification.questions)) {
    errors.push({
      field: 'clarification.questions',
      message: 'Questions array is required',
    });
  } else if (
    clarification.questions.length < 1 ||
    clarification.questions.length > 3
  ) {
    errors.push({
      field: 'clarification.questions',
      message: 'Must have 1-3 clarifying questions',
    });
  } else {
    for (let i = 0; i < clarification.questions.length; i++) {
      const q = clarification.questions[i];
      if (!q.id || !q.question || !q.why_it_matters) {
        errors.push({
          field: `clarification.questions[${i}]`,
          message: 'Each question must have id, question, and why_it_matters',
        });
      }
    }
  }
}

/**
 * Validates a trade-off explanation output structure
 * Per 12_ai_prompts.md section 6
 */
function validateTradeoffExplanationOutput(
  output: TradeoffExplanationOutput,
  errors: ValidationError[]
): void {
  const { explanation } = output;

  if (!explanation.text) {
    errors.push({
      field: 'explanation.text',
      message: 'Explanation text is required',
    });
  }

  if (!explanation.next_step) {
    errors.push({
      field: 'explanation.next_step',
      message: 'Next step is required',
    });
  }

  // Check forbidden content
  const textToCheck = [explanation.text, explanation.next_step].join(' ');
  const forbiddenViolations = detectForbiddenPhrases(textToCheck);

  for (const violation of forbiddenViolations) {
    errors.push({ field: 'explanation.content', message: violation });
  }
}

/**
 * Validates a revision output structure
 * Per 12_ai_prompts.md section 7
 */
function validateRevisionOutput(
  output: RevisionOutput,
  errors: ValidationError[]
): void {
  const { revision } = output;

  if (!revision.what_changed) {
    errors.push({
      field: 'revision.what_changed',
      message: 'What changed description is required',
    });
  }

  // Validate the nested decision with same rules as DecisionOutput
  if (!revision.decision) {
    errors.push({
      field: 'revision.decision',
      message: 'Revised decision is required',
    });
  } else {
    validateDecisionOutput(
      { type: 'decision', decision: revision.decision },
      errors.map((e) => ({
        ...e,
        field: e.field.replace('decision.', 'revision.decision.'),
      }))
    );
  }
}

/**
 * Main output validation function
 * Enforces verdict-or-refusal logic per constitution
 */
export function validateAIOutput(rawOutput: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  // Must be valid JSON object
  if (!rawOutput || typeof rawOutput !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Output must be a valid JSON object' }],
    };
  }

  const output = rawOutput as Partial<AIOutput>;

  // Must have a type field
  if (!output.type) {
    return {
      valid: false,
      errors: [
        {
          field: 'type',
          message:
            'Output must have a type: decision, refusal, clarification, tradeoff_explanation, or revision',
        },
      ],
    };
  }

  // Validate based on type
  switch (output.type) {
    case 'decision':
      if (!(output as DecisionOutput).decision) {
        errors.push({
          field: 'decision',
          message: 'Decision object is required for decision type',
        });
      } else {
        validateDecisionOutput(output as DecisionOutput, errors);
      }
      break;

    case 'refusal':
      if (!(output as RefusalOutput).refusal) {
        errors.push({
          field: 'refusal',
          message: 'Refusal object is required for refusal type',
        });
      } else {
        validateRefusalOutput(output as RefusalOutput, errors);
      }
      break;

    case 'clarification':
      if (!(output as ClarificationOutput).clarification) {
        errors.push({
          field: 'clarification',
          message: 'Clarification object is required for clarification type',
        });
      } else {
        validateClarificationOutput(output as ClarificationOutput, errors);
      }
      break;

    case 'tradeoff_explanation':
      if (!(output as TradeoffExplanationOutput).explanation) {
        errors.push({
          field: 'explanation',
          message: 'Explanation object is required for tradeoff_explanation type',
        });
      } else {
        validateTradeoffExplanationOutput(
          output as TradeoffExplanationOutput,
          errors
        );
      }
      break;

    case 'revision':
      if (!(output as RevisionOutput).revision) {
        errors.push({
          field: 'revision',
          message: 'Revision object is required for revision type',
        });
      } else {
        validateRevisionOutput(output as RevisionOutput, errors);
      }
      break;

    default:
      errors.push({
        field: 'type',
        message: `Invalid output type: ${output.type}`,
      });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates the retry prompt for invalid outputs
 * Per 12_ai_prompts.md section 8
 */
export function generateRetryPrompt(errors: ValidationError[]): string {
  const errorSummary = errors.map((e) => `- ${e.field}: ${e.message}`).join('\n');

  return `Your output violated Safari Index constraints. Reproduce the output as valid JSON only.
Remove hype and guarantees. Include assumptions, trade-offs, and change conditions.
If you cannot decide reliably, output a refusal instead.

Specific violations:
${errorSummary}`;
}

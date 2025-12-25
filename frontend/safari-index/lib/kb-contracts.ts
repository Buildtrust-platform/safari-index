/**
 * Knowledge Base Contracts
 *
 * Strict Zod schemas for the Decision Knowledge Base.
 * These schemas enforce content consistency and governance compliance.
 *
 * Per _governance/constitution/01_brand_voice.md:
 * - No hype, no emojis, no guarantee language
 * - Banned phrases are validated at runtime
 *
 * Schema Hierarchy:
 * 1. TopicRecord - Topic metadata and routing
 * 2. BaselineDecisionRecord - Pre-computed decisions for fallback
 * 3. EvidenceCard - Supporting evidence for decisions
 * 4. TemplateRecord - Writing templates and phrase lists
 */

import { z } from 'zod';

// ============================================================================
// Shared Enums and Primitives
// ============================================================================

export const OutcomeSchema = z.enum(['book', 'wait', 'switch', 'discard']);
export type Outcome = z.infer<typeof OutcomeSchema>;

export const LaunchPrioritySchema = z.enum(['P0', 'P1', 'P2']);
export type LaunchPriority = z.infer<typeof LaunchPrioritySchema>;

export const TopicBucketSchema = z.enum([
  'personal_fit',
  'destination_choice',
  'timing',
  'experience_type',
  'accommodation',
  'logistics',
  'risk_ethics',
  'value_cost',
]);
export type TopicBucket = z.infer<typeof TopicBucketSchema>;

export const DecisionComplexitySchema = z.enum(['binary', 'conditional', 'multi-factor']);
export type DecisionComplexity = z.infer<typeof DecisionComplexitySchema>;

export const SeoIntentSchema = z.enum(['high', 'medium', 'low']);
export type SeoIntent = z.infer<typeof SeoIntentSchema>;

export const EvidenceTypeSchema = z.enum([
  'statistic',
  'expert_quote',
  'seasonal_pattern',
  'cost_benchmark',
  'risk_factor',
  'historical_data',
]);
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

// ============================================================================
// TopicRecord Schema
// ============================================================================

/**
 * Topic metadata record
 * Defines a decision topic with routing, SEO, and operational attributes
 */
export const TopicRecordSchema = z.object({
  // Identity
  topic_id: z.string().regex(/^[a-z0-9-]+$/, 'topic_id must be kebab-case'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be semver'),

  // Content
  title: z.string().min(10).max(100),
  question: z.string().min(10).max(200),
  context_line: z.string().min(20).max(300),

  // Classification
  bucket: TopicBucketSchema,
  decision_complexity: DecisionComplexitySchema,
  destinations: z.array(z.string()).min(1),

  // Outcomes
  eligible_outcomes: z.array(OutcomeSchema).min(1),
  default_outcome: OutcomeSchema,

  // Business attributes
  launch_priority: LaunchPrioritySchema,
  seo_intent: SeoIntentSchema,
  assurance_eligible: z.boolean(),
  compare_enabled: z.boolean(),

  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type TopicRecord = z.infer<typeof TopicRecordSchema>;

// ============================================================================
// Assumption Schema (shared)
// ============================================================================

export const AssumptionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'assumption id must be kebab-case'),
  text: z.string().min(10).max(200),
  confidence: z.number().min(0).max(1),
});

export type Assumption = z.infer<typeof AssumptionSchema>;

// ============================================================================
// Tradeoffs Schema (shared)
// ============================================================================

export const TradeoffsSchema = z.object({
  gains: z.array(z.string().min(5).max(150)).min(1),
  losses: z.array(z.string().min(5).max(150)).min(1),
});

export type Tradeoffs = z.infer<typeof TradeoffsSchema>;

// ============================================================================
// BaselineDecisionRecord Schema
// ============================================================================

/**
 * Baseline decision record
 * Pre-computed decisions used as fallbacks when live inference is unavailable
 */
export const BaselineDecisionRecordSchema = z.object({
  // Identity
  topic_id: z.string().regex(/^[a-z0-9-]+$/, 'topic_id must be kebab-case'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be semver'),

  // Decision content
  outcome: OutcomeSchema,
  headline: z.string().min(20).max(120),
  summary: z.string().min(50).max(500),
  assumptions: z.array(AssumptionSchema).min(2).max(5),
  tradeoffs: TradeoffsSchema,
  change_conditions: z.array(z.string().min(10).max(150)).min(1).max(5),
  confidence: z.number().min(0).max(1),

  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  author: z.string().optional(),
  review_status: z.enum(['draft', 'reviewed', 'approved']).default('draft'),
});

export type BaselineDecisionRecord = z.infer<typeof BaselineDecisionRecordSchema>;

// ============================================================================
// EvidenceCard Schema
// ============================================================================

/**
 * Evidence card for supporting decision rationale
 * Used in content generation and decision explanations
 */
export const EvidenceCardSchema = z.object({
  // Identity
  evidence_id: z.string().regex(/^[a-z0-9-]+$/, 'evidence_id must be kebab-case'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be semver'),

  // Content
  type: EvidenceTypeSchema,
  title: z.string().min(10).max(100),
  content: z.string().min(20).max(500),
  source: z.string().min(5).max(200).optional(),
  source_url: z.string().url().optional(),
  source_date: z.string().datetime().optional(),

  // Classification
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  topic_ids: z.array(z.string().regex(/^[a-z0-9-]+$/)),
  destinations: z.array(z.string()),

  // Validity
  valid_from: z.string().datetime().optional(),
  valid_until: z.string().datetime().optional(),
  requires_annual_review: z.boolean().default(false),

  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type EvidenceCard = z.infer<typeof EvidenceCardSchema>;

// ============================================================================
// TemplateRecord Schema
// ============================================================================

/**
 * Writing template for consistent content generation
 * Includes phrase lists (preferred and banned)
 */
export const TemplateRecordSchema = z.object({
  // Identity
  template_id: z.string().regex(/^[a-z0-9-]+$/, 'template_id must be kebab-case'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be semver'),

  // Content
  name: z.string().min(5).max(100),
  description: z.string().min(10).max(300),
  template: z.string().min(20),

  // Classification
  category: z.enum([
    'headline',
    'summary',
    'assumption',
    'tradeoff',
    'change_condition',
    'refusal',
  ]),

  // Examples
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })).optional(),

  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type TemplateRecord = z.infer<typeof TemplateRecordSchema>;

// ============================================================================
// Banned Phrases Schema
// ============================================================================

/**
 * Banned phrases list for governance compliance
 * Per _governance/constitution/01_brand_voice.md
 */
export const BannedPhrasesSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be semver'),
  updated_at: z.string().datetime(),

  // Absolutely banned words (never appear)
  banned_words: z.array(z.string()),

  // Forbidden patterns (regex-testable)
  forbidden_patterns: z.array(z.object({
    pattern: z.string(),
    description: z.string(),
  })),

  // Preferred alternatives
  preferred_vocabulary: z.array(z.string()),
});

export type BannedPhrases = z.infer<typeof BannedPhrasesSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates that text does not contain banned phrases
 */
export function validateNoBannedPhrases(
  text: string,
  bannedPhrases: BannedPhrases
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();

  // Check banned words
  for (const word of bannedPhrases.banned_words) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Contains banned word: "${word}"`);
    }
  }

  // Check forbidden patterns
  for (const { pattern, description } of bannedPhrases.forbidden_patterns) {
    try {
      // Some patterns need unicode flag (emoji patterns)
      const needsUnicode = pattern.includes('\\u{');
      const regex = new RegExp(pattern, needsUnicode ? 'iu' : 'i');
      if (regex.test(text)) {
        violations.push(`Matches forbidden pattern: ${description}`);
      }
    } catch {
      // Skip invalid patterns silently
      continue;
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Validates a baseline decision record against governance rules
 */
export function validateBaselineGovernance(
  baseline: BaselineDecisionRecord,
  bannedPhrases: BannedPhrases
): { valid: boolean; violations: string[] } {
  const allViolations: string[] = [];

  // Check headline
  const headlineResult = validateNoBannedPhrases(baseline.headline, bannedPhrases);
  if (!headlineResult.valid) {
    allViolations.push(...headlineResult.violations.map(v => `headline: ${v}`));
  }

  // Check summary
  const summaryResult = validateNoBannedPhrases(baseline.summary, bannedPhrases);
  if (!summaryResult.valid) {
    allViolations.push(...summaryResult.violations.map(v => `summary: ${v}`));
  }

  // Check assumptions
  for (const assumption of baseline.assumptions) {
    const result = validateNoBannedPhrases(assumption.text, bannedPhrases);
    if (!result.valid) {
      allViolations.push(...result.violations.map(v => `assumption "${assumption.id}": ${v}`));
    }
  }

  // Check tradeoffs
  for (const gain of baseline.tradeoffs.gains) {
    const result = validateNoBannedPhrases(gain, bannedPhrases);
    if (!result.valid) {
      allViolations.push(...result.violations.map(v => `gain: ${v}`));
    }
  }
  for (const loss of baseline.tradeoffs.losses) {
    const result = validateNoBannedPhrases(loss, bannedPhrases);
    if (!result.valid) {
      allViolations.push(...result.violations.map(v => `loss: ${v}`));
    }
  }

  // Check change conditions
  for (const condition of baseline.change_conditions) {
    const result = validateNoBannedPhrases(condition, bannedPhrases);
    if (!result.valid) {
      allViolations.push(...result.violations.map(v => `change_condition: ${v}`));
    }
  }

  return {
    valid: allViolations.length === 0,
    violations: allViolations,
  };
}

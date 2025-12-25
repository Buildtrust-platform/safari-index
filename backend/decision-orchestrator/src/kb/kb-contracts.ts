/**
 * Knowledge Base Contracts (Backend)
 *
 * Minimal Zod schemas for KB content validation.
 * Synced from frontend via sync-kb.sh
 *
 * These schemas validate evidence cards and templates
 * loaded at build time for prompt injection.
 */

import { z } from 'zod';

// ============================================================================
// Evidence Card Schema
// ============================================================================

export const EvidenceTypeSchema = z.enum([
  'statistic',
  'expert_quote',
  'seasonal_pattern',
  'cost_benchmark',
  'risk_factor',
  'historical_data',
]);

export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

export const EvidenceCardSchema = z.object({
  evidence_id: z.string(),
  version: z.string(),
  type: EvidenceTypeSchema,
  title: z.string(),
  content: z.string(),
  source: z.string().optional(),
  source_url: z.string().optional(),
  source_date: z.string().optional(),
  tags: z.array(z.string()),
  topic_ids: z.array(z.string()),
  destinations: z.array(z.string()),
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),
  requires_annual_review: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export type EvidenceCard = z.infer<typeof EvidenceCardSchema>;

// ============================================================================
// Banned Phrases Schema
// ============================================================================

export const BannedPhrasesSchema = z.object({
  version: z.string(),
  updated_at: z.string(),
  banned_words: z.array(z.string()),
  forbidden_patterns: z.array(z.object({
    pattern: z.string(),
    description: z.string(),
  })),
  preferred_vocabulary: z.array(z.string()),
});

export type BannedPhrases = z.infer<typeof BannedPhrasesSchema>;

// ============================================================================
// Topic Metadata Schema (for retrieval context)
// ============================================================================

export const TopicMetadataSchema = z.object({
  topic_id: z.string(),
  title: z.string(),
  bucket: z.string(),
  destinations: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});

export type TopicMetadata = z.infer<typeof TopicMetadataSchema>;

// ============================================================================
// KB Data Bundle Schema (what gets synced)
// ============================================================================

export const KBDataBundleSchema = z.object({
  version: z.string(),
  synced_at: z.string(),
  evidence: z.record(EvidenceCardSchema),
  banned_phrases: BannedPhrasesSchema,
  topics: z.record(TopicMetadataSchema),
});

export type KBDataBundle = z.infer<typeof KBDataBundleSchema>;

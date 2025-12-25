/**
 * Knowledge Base Loader
 *
 * Loads KB data from bundled JSON files at runtime.
 * Designed to fail closed - if KB is missing, retrieval returns empty.
 *
 * The KB data is synced from frontend via sync-kb.sh and bundled
 * into the Lambda deployment package at build time.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  KBDataBundleSchema,
  KBDataBundle,
  EvidenceCard,
  BannedPhrases,
  TopicMetadata,
} from './kb-contracts';

// ============================================================================
// State
// ============================================================================

let kbData: KBDataBundle | null = null;
let loadError: string | null = null;
let isLoaded = false;

// ============================================================================
// Loader
// ============================================================================

/**
 * Load KB data from bundled JSON file
 * Called once at Lambda cold start
 */
export function loadKB(): boolean {
  if (isLoaded) return kbData !== null;

  isLoaded = true;

  try {
    // Path relative to this file in the deployed Lambda
    const kbDataPath = path.join(__dirname, 'kb-data.json');

    if (!fs.existsSync(kbDataPath)) {
      console.warn('KB data file not found:', kbDataPath);
      console.warn('KB retrieval will return empty results (fail-closed)');
      loadError = 'KB data file not found';
      return false;
    }

    const rawData = fs.readFileSync(kbDataPath, 'utf-8');
    const parsed = JSON.parse(rawData);

    // Validate with Zod
    const result = KBDataBundleSchema.safeParse(parsed);
    if (!result.success) {
      console.error('KB data validation failed:', result.error.message);
      loadError = `Validation failed: ${result.error.message}`;
      return false;
    }

    kbData = result.data;
    console.log(`KB loaded: ${Object.keys(kbData.evidence).length} evidence cards, ${Object.keys(kbData.topics).length} topics`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('KB load error:', message);
    loadError = message;
    return false;
  }
}

// ============================================================================
// Accessors
// ============================================================================

/**
 * Check if KB is loaded and available
 */
export function isKBAvailable(): boolean {
  if (!isLoaded) loadKB();
  return kbData !== null;
}

/**
 * Get the load error message (if any)
 */
export function getKBLoadError(): string | null {
  return loadError;
}

/**
 * Get all evidence cards
 */
export function getAllEvidence(): Record<string, EvidenceCard> {
  if (!isLoaded) loadKB();
  return kbData?.evidence ?? {};
}

/**
 * Get evidence card by ID
 */
export function getEvidence(evidenceId: string): EvidenceCard | null {
  if (!isLoaded) loadKB();
  return kbData?.evidence?.[evidenceId] ?? null;
}

/**
 * Get banned phrases
 */
export function getBannedPhrases(): BannedPhrases | null {
  if (!isLoaded) loadKB();
  return kbData?.banned_phrases ?? null;
}

/**
 * Get topic metadata by ID
 */
export function getTopicMetadata(topicId: string): TopicMetadata | null {
  if (!isLoaded) loadKB();
  return kbData?.topics?.[topicId] ?? null;
}

/**
 * Get all topic metadata
 */
export function getAllTopics(): Record<string, TopicMetadata> {
  if (!isLoaded) loadKB();
  return kbData?.topics ?? {};
}

/**
 * Get KB version info
 */
export function getKBVersion(): { version: string; synced_at: string } | null {
  if (!isLoaded) loadKB();
  if (!kbData) return null;
  return {
    version: kbData.version,
    synced_at: kbData.synced_at,
  };
}

// ============================================================================
// Testing Support
// ============================================================================

/**
 * Reset KB state (for testing only)
 */
export function resetKBState(): void {
  kbData = null;
  loadError = null;
  isLoaded = false;
}

/**
 * Inject KB data directly (for testing only)
 */
export function injectKBData(data: KBDataBundle): void {
  kbData = data;
  loadError = null;
  isLoaded = true;
}

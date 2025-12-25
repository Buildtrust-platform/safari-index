/**
 * Knowledge Base Module
 *
 * Exports KB functionality for use by the decision engine.
 *
 * Usage:
 *   import { getEvidenceForTopic, formatEvidenceForPrompt } from './kb';
 */

// Contracts
export type {
  EvidenceCard,
  BannedPhrases,
  TopicMetadata,
  KBDataBundle,
} from './kb-contracts';

// Loader
export {
  loadKB,
  isKBAvailable,
  getKBLoadError,
  getEvidence,
  getAllEvidence,
  getBannedPhrases,
  getTopicMetadata,
  getAllTopics,
  getKBVersion,
  resetKBState,
  injectKBData,
} from './kb-loader';

// Retrieval
export {
  getEvidenceForTopic,
  formatEvidenceForPrompt,
  inferTagsFromInputs,
} from './retrieval';

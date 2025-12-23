/**
 * Decision Assurance Module
 * Exports assurance generation and persistence services
 *
 * Per 02_decision_doctrine.md:
 * - Assurance is a paid artifact of professional judgment
 * - It never changes the underlying decision
 * - It refuses to generate for weak decisions
 */

// Types
export * from './types';

// Assurance generation
export { generateAssurance, buildAssuranceRecord } from './generator';

// Assurance persistence
export {
  storeAssurance,
  getAssurance,
  getAssuranceByDecisionId,
  getAssurancesByTraveler,
  updatePaymentStatus,
  recordAccess,
  revokeAssurance,
} from './assurance-store';

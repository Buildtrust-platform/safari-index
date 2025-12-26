/**
 * Decision Assurance Generator
 *
 * Per 02_decision_doctrine.md:
 * - Assurance must NEVER change the decision outcome
 * - Assurance must NEVER promise certainty
 * - Refuse to generate if decision quality is insufficient
 *
 * Per 06_review_correction.md:
 * - Decisions flagged for review cannot have assurance issued
 */
import { DecisionAssuranceArtifact, AssuranceRecord, AssuranceRequest, AssuranceResult } from './types';
/**
 * Generate Decision Assurance artifact from a decision
 *
 * GOVERNANCE ENFORCEMENT:
 * - This function COPIES the decision, it does NOT modify it
 * - Validation gates prevent weak decisions from receiving assurance
 * - The artifact is a record of professional judgment, not a guarantee
 */
export declare function generateAssurance(request: AssuranceRequest): Promise<AssuranceResult>;
/**
 * Build full assurance record for storage
 */
export declare function buildAssuranceRecord(artifact: DecisionAssuranceArtifact, sessionId: string, travelerId: string | null): AssuranceRecord;
//# sourceMappingURL=generator.d.ts.map
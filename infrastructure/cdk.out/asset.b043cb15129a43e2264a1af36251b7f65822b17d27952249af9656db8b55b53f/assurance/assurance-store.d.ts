/**
 * Decision Assurance Store
 * Persists assurance records to DynamoDB
 *
 * Per 02_decision_doctrine.md:
 * - Assurance records are immutable once issued
 * - Payment completion triggers "issued" status
 *
 * Per 11_mvp_build_plan.md:
 * - Monetization artifact must be auditable
 */
import { AssuranceRecord } from './types';
/**
 * Store a new assurance record
 * Per governance: immutable once stored
 */
export declare function storeAssurance(record: AssuranceRecord): Promise<{
    assuranceId: string;
}>;
/**
 * Get assurance by ID
 */
export declare function getAssurance(assuranceId: string): Promise<AssuranceRecord | null>;
/**
 * Get assurance by decision ID
 * Uses GSI: decision_id index
 */
export declare function getAssuranceByDecisionId(decisionId: string): Promise<AssuranceRecord | null>;
/**
 * Get assurances by traveler ID
 * Uses GSI: traveler_id + created_at
 */
export declare function getAssurancesByTraveler(travelerId: string, limit?: number): Promise<AssuranceRecord[]>;
/**
 * Update payment status after successful payment
 * Per governance: this is the only update allowed after creation
 */
export declare function updatePaymentStatus(assuranceId: string, paymentId: string, status: 'completed' | 'refunded'): Promise<void>;
/**
 * Record artifact access (download)
 * For audit and usage tracking
 */
export declare function recordAccess(assuranceId: string): Promise<void>;
/**
 * Revoke an assurance (for refunds or policy violations)
 * Per governance: revocation reason must be documented
 */
export declare function revokeAssurance(assuranceId: string, reason: string): Promise<void>;
//# sourceMappingURL=assurance-store.d.ts.map
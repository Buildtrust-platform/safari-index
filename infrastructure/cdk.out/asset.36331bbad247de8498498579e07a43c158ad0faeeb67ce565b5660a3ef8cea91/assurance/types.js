"use strict";
/**
 * Decision Assurance Types
 *
 * Per 02_decision_doctrine.md:
 * - Decision Assurance is a finalized, reviewable artifact
 * - It does NOT change the decision outcome
 * - It does NOT promise certainty or guarantees
 *
 * Per 11_mvp_build_plan.md:
 * - Monetization must not undermine authority
 * - No subscriptions, no bundles, no upsells
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSURANCE_CONFIDENCE_THRESHOLD = exports.ASSURANCE_PRICING = void 0;
/**
 * Pricing configuration
 * Per governance: one-time, single decision, no bundles
 */
exports.ASSURANCE_PRICING = {
    // Base price in cents
    BASE_PRICE_CENTS: 2900, // $29
    CURRENCY: 'USD',
    // No discounts, no bundles - this is the price
    // Price reflects risk reduction value, not content volume
};
/**
 * Minimum confidence threshold for assurance
 * Per 02_decision_doctrine.md: prefer refusal over weak decisions
 */
exports.ASSURANCE_CONFIDENCE_THRESHOLD = 0.5;
//# sourceMappingURL=types.js.map
"use strict";
/**
 * Decision Assurance Module
 * Exports assurance generation and persistence services
 *
 * Per 02_decision_doctrine.md:
 * - Assurance is a paid artifact of professional judgment
 * - It never changes the underlying decision
 * - It refuses to generate for weak decisions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAssurance = exports.recordAccess = exports.updatePaymentStatus = exports.getAssurancesByTraveler = exports.getAssuranceByDecisionId = exports.getAssurance = exports.storeAssurance = exports.buildAssuranceRecord = exports.generateAssurance = void 0;
// Types
__exportStar(require("./types"), exports);
// Assurance generation
var generator_1 = require("./generator");
Object.defineProperty(exports, "generateAssurance", { enumerable: true, get: function () { return generator_1.generateAssurance; } });
Object.defineProperty(exports, "buildAssuranceRecord", { enumerable: true, get: function () { return generator_1.buildAssuranceRecord; } });
// Assurance persistence
var assurance_store_1 = require("./assurance-store");
Object.defineProperty(exports, "storeAssurance", { enumerable: true, get: function () { return assurance_store_1.storeAssurance; } });
Object.defineProperty(exports, "getAssurance", { enumerable: true, get: function () { return assurance_store_1.getAssurance; } });
Object.defineProperty(exports, "getAssuranceByDecisionId", { enumerable: true, get: function () { return assurance_store_1.getAssuranceByDecisionId; } });
Object.defineProperty(exports, "getAssurancesByTraveler", { enumerable: true, get: function () { return assurance_store_1.getAssurancesByTraveler; } });
Object.defineProperty(exports, "updatePaymentStatus", { enumerable: true, get: function () { return assurance_store_1.updatePaymentStatus; } });
Object.defineProperty(exports, "recordAccess", { enumerable: true, get: function () { return assurance_store_1.recordAccess; } });
Object.defineProperty(exports, "revokeAssurance", { enumerable: true, get: function () { return assurance_store_1.revokeAssurance; } });
//# sourceMappingURL=index.js.map
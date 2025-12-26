"use strict";
/**
 * Safari Index Database Layer
 * Exports persistence and event logging services
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
exports.isDefaultInput = exports.extractTopicId = exports.hashInputs = exports.invalidateSnapshot = exports.releaseLock = exports.acquireLock = exports.storeSnapshot = exports.getSnapshot = exports.updateReviewStatus = exports.getReviewsByTopic = exports.getPendingReviews = exports.createReviewRecord = exports.getEventsBySession = exports.getEventsByType = exports.getEventsByTraveler = exports.logEvent = exports.logToolCompleted = exports.logDecisionRefused = exports.logDecisionIssued = exports.logEngaged = exports.logSessionStarted = exports.getDecisionsNeedingReview = exports.getDecisionsByTraveler = exports.getDecision = exports.storeDecision = void 0;
// Types
__exportStar(require("./types"), exports);
// Decision persistence
var decision_store_1 = require("./decision-store");
Object.defineProperty(exports, "storeDecision", { enumerable: true, get: function () { return decision_store_1.storeDecision; } });
Object.defineProperty(exports, "getDecision", { enumerable: true, get: function () { return decision_store_1.getDecision; } });
Object.defineProperty(exports, "getDecisionsByTraveler", { enumerable: true, get: function () { return decision_store_1.getDecisionsByTraveler; } });
Object.defineProperty(exports, "getDecisionsNeedingReview", { enumerable: true, get: function () { return decision_store_1.getDecisionsNeedingReview; } });
// Event logging
var event_store_1 = require("./event-store");
Object.defineProperty(exports, "logSessionStarted", { enumerable: true, get: function () { return event_store_1.logSessionStarted; } });
Object.defineProperty(exports, "logEngaged", { enumerable: true, get: function () { return event_store_1.logEngaged; } });
Object.defineProperty(exports, "logDecisionIssued", { enumerable: true, get: function () { return event_store_1.logDecisionIssued; } });
Object.defineProperty(exports, "logDecisionRefused", { enumerable: true, get: function () { return event_store_1.logDecisionRefused; } });
Object.defineProperty(exports, "logToolCompleted", { enumerable: true, get: function () { return event_store_1.logToolCompleted; } });
Object.defineProperty(exports, "logEvent", { enumerable: true, get: function () { return event_store_1.logEvent; } });
Object.defineProperty(exports, "getEventsByTraveler", { enumerable: true, get: function () { return event_store_1.getEventsByTraveler; } });
Object.defineProperty(exports, "getEventsByType", { enumerable: true, get: function () { return event_store_1.getEventsByType; } });
Object.defineProperty(exports, "getEventsBySession", { enumerable: true, get: function () { return event_store_1.getEventsBySession; } });
// Review queue
var review_store_1 = require("./review-store");
Object.defineProperty(exports, "createReviewRecord", { enumerable: true, get: function () { return review_store_1.createReviewRecord; } });
Object.defineProperty(exports, "getPendingReviews", { enumerable: true, get: function () { return review_store_1.getPendingReviews; } });
Object.defineProperty(exports, "getReviewsByTopic", { enumerable: true, get: function () { return review_store_1.getReviewsByTopic; } });
Object.defineProperty(exports, "updateReviewStatus", { enumerable: true, get: function () { return review_store_1.updateReviewStatus; } });
// Snapshot cache
var snapshot_store_1 = require("./snapshot-store");
Object.defineProperty(exports, "getSnapshot", { enumerable: true, get: function () { return snapshot_store_1.getSnapshot; } });
Object.defineProperty(exports, "storeSnapshot", { enumerable: true, get: function () { return snapshot_store_1.storeSnapshot; } });
Object.defineProperty(exports, "acquireLock", { enumerable: true, get: function () { return snapshot_store_1.acquireLock; } });
Object.defineProperty(exports, "releaseLock", { enumerable: true, get: function () { return snapshot_store_1.releaseLock; } });
Object.defineProperty(exports, "invalidateSnapshot", { enumerable: true, get: function () { return snapshot_store_1.invalidateSnapshot; } });
Object.defineProperty(exports, "hashInputs", { enumerable: true, get: function () { return snapshot_store_1.hashInputs; } });
Object.defineProperty(exports, "extractTopicId", { enumerable: true, get: function () { return snapshot_store_1.extractTopicId; } });
Object.defineProperty(exports, "isDefaultInput", { enumerable: true, get: function () { return snapshot_store_1.isDefaultInput; } });
//# sourceMappingURL=index.js.map
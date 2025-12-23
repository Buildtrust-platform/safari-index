DATA MODEL & STATE MACHINE
AWS-Native Decision Authority Platform

(Executable blueprint for vibe coding)

This document makes the architecture buildable. It defines:

core entities

tables and keys

required fields

events

state machines

how everything connects

examples of real records

If you follow this, you can generate code without inventing structure.

1. Purpose

This data model exists to enforce the constitutions:

Decision Doctrine: every interaction ends in Book / Wait / Switch / Discard or Refuse

UX Constitution: one decision per screen, verdict-first

Metrics Constitution: measure decision completion, reversals, drop-offs

Review Doctrine: everything auditable and correctable

AI Constitution: structured outputs, clear assumptions, refusal allowed

If the data model allows “vague outcomes” or “untracked advice”, it violates the product.

2. Design choices
Storage approach (recommended)

Use DynamoDB as the system-of-record for operational data:

fast iteration

simple scaling

event-friendly

flexible schema

Use S3 for artifacts (PDFs, itinerary HTML snapshots, decision reports).

Use Athena/QuickSight off event logs for analytics.

IDs

Use UUIDs for all primary IDs:

trav_...

sess_...

lead_...

dec_...

itin_...

page_...

evt_...

Time

Use ISO 8601 timestamps in UTC:

created_at

updated_at

3. Core entities (dictionary)
Traveler

A person (or primary planner) interacting with the platform.

Session

A bounded interaction window (visit). Used for metrics and drop-off analysis.

Lead

A traveler who has shown intent and entered an inquiry flow.

Decision

A structured recommendation or refusal.

Itinerary

A generated plan artifact (web + PDF), tied to a decision.

Content Page

A structured SEO/AEO page (decision page, comparison page, guide). Not HTML blobs.

Event

An immutable record of what happened (for metrics and audit).

Review Item

A record created when a decision is flagged for evaluation and correction.

4. DynamoDB tables
Table A: core_entities

Purpose: store traveler, session, lead, decision, itinerary in one table using a single-table design OR separate tables.
To keep implementation simple for vibe coding, I’ll describe a clear multi-table model first (easier), then show the single-table option later.

Recommended multi-table model (simpler)
Table 1: traveler

PK: traveler_id (string)

Required fields

traveler_id

created_at

updated_at

status (active | suppressed | deleted)

contact

email (optional)

phone (optional)

whatsapp (optional)

locale (default en)

timezone (optional)

consent

marketing_opt_in (bool)

data_processing_opt_in (bool)

profile

traveler_type (first_time | repeat | photographer | family | honeymoon | etc.)

budget_band (budget | fair_value | premium)

pace_preference (slow | balanced | fast)

drive_tolerance_hours (int)

comfort_priority (low | medium | high)

risk_tolerance (low | medium | high)

notes (short text, internal)

Indexes

GSI1: email → traveler_id (for lookup)

GSI2: phone → traveler_id

Table 2: session

PK: session_id

Required fields

session_id

traveler_id (nullable until identified)

created_at

updated_at

entry

source (organic | direct | referral | paid | partner)

utm (object)

landing_page_id (optional)

landing_url (string)

engagement

engaged (bool)

engaged_at (timestamp)

outcome

decision_outcome (book | wait | switch | discard | refused | none)

decision_id (optional)

ended_at (timestamp)

technical

user_agent (optional)

ip_hash (optional)

device_type (desktop | mobile | tablet)

Indexes

GSI1: traveler_id + created_at

Table 3: lead

PK: lead_id

Required fields

lead_id

traveler_id

created_at

updated_at

status

lead_state (new | assessing | plan_ready | waiting | switched | discarded | booked | dormant)

state_reason (short code)

intent

destinations_considered (array)

travel_dates (start/end or month/year)

group_size (int)

style (family | honeymoon | photography | adventure | etc.)

budget_range (min/max)

constraints (object)

objections (array of codes: price, timing, drive_fatigue, trust, etc.)

priority_score (0–100)

last_activity_at

next_action_at (for recovery engine)

assigned_to (optional, human later)

Indexes

GSI1: traveler_id + created_at

GSI2: lead_state + updated_at (for queues)

Table 4: decision

PK: decision_id

Required fields

decision_id

traveler_id

session_id (optional)

lead_id (optional)

created_at

updated_at

decision_type (timing_verdict | fit_assessment | comparison | itinerary_reco | refusal)

verdict

outcome (book | wait | switch | discard | refused)

headline (string, calm)

summary (2–4 sentences)

assumptions (array of objects)

{ id, text, confidence, expires_at? }

tradeoffs

gains (array)

losses (array)

change_conditions (array)

confidence (0–1)

inputs_snapshot (object of the user inputs used)

logic_version (string, e.g. rules_v1.3)

ai_used (bool)

ai_trace

model (string, if used)

prompt_version

safety_flags (array)

linked_entities

itinerary_id (optional)

content_page_id (optional)

review

needs_review (bool)

review_reason (code)

review_status (none | queued | reviewed | corrected)

Indexes

GSI1: traveler_id + created_at

GSI2: lead_id + created_at

GSI3: review.needs_review + created_at

Table 5: itinerary

PK: itinerary_id

Required fields

itinerary_id

traveler_id

lead_id (optional)

decision_id

created_at

updated_at

title

duration_days

pace (slow | balanced | fast)

route (array of stops)

lodging_tiers (budget | fair_value | premium)

daily_plan (array of day objects, summarized)

assumptions (array)

risks (array)

inclusions (array)

exclusions (array)

artifact_links

web_url

pdf_s3_key

pdf_url_signed (optional)

versioning

version (int)

parent_itinerary_id (optional)

change_notes (string)

Indexes

GSI1: traveler_id + created_at

GSI2: decision_id

Table 6: content_page

PK: page_id

Required fields

page_id

created_at

updated_at

page_type (decision | comparison | guide)

slug

title

verdict_block

headline

summary

outcome_hint (book | wait | switch | discard | none)

sections (structured array)

each section: { type, heading, body, bullets?, tables? }

tradeoff_ledger

faq (array)

schema

jsonld_type (FAQPage | Article | etc.)

internal_links

recommended_page_ids (array)

version

status (draft | published | archived)

Indexes

GSI1: slug → page_id

GSI2: page_type + status + updated_at

Table 7: event_log

PK: event_id

Required fields

event_id

created_at

event_type (enum)

traveler_id (optional)

session_id (optional)

lead_id (optional)

decision_id (optional)

itinerary_id (optional)

page_id (optional)

payload (object, validated per event type)

Event types (initial)

SESSION_STARTED

ENGAGED

PAGE_VIEWED

TOOL_STARTED

TOOL_COMPLETED

DECISION_ISSUED

DECISION_REFUSED

ITINERARY_GENERATED

ASSURANCE_REQUESTED

ASSURANCE_DELIVERED

LEAD_CREATED

LEAD_STATE_CHANGED

FOLLOWUP_SCHEDULED

FOLLOWUP_SENT

DECISION_REVERSED

TRUST_FLAG_RAISED

Indexes

GSI1: traveler_id + created_at

GSI2: event_type + created_at

Table 8: review_queue

PK: review_id

Required fields

review_id

created_at

updated_at

decision_id

status (queued | in_review | corrected | closed)

reason_code (assumption_failure | comms_failure | scope_failure | external_shock)

notes (internal)

resolution

action_taken (updated_rules | updated_copy | adjusted_threshold | added_refusal | none)

logic_version_new (optional)

public_note (optional)

Indexes

GSI1: status + updated_at

5. State machines

You need two state machines:

Lead State Machine (business outcome)

Decision State Machine (authority output + audit)

5.1 Lead State Machine (Lead Lifecycle)

States

NEW

ASSESSING

PLAN_READY

WAITING

SWITCHED

DISCARDED

BOOKED

DORMANT (inactive but recoverable)

SUPPRESSED (do not contact)

Transitions

NEW → ASSESSING
Trigger: tool started, inquiry started, or inputs captured.

ASSESSING → PLAN_READY
Trigger: decision issued AND itinerary generated.

ASSESSING → WAITING
Trigger: decision outcome = wait.

ASSESSING → SWITCHED
Trigger: decision outcome = switch AND new destination recorded.

ASSESSING → DISCARDED
Trigger: decision outcome = discard.

PLAN_READY → BOOKED
Trigger: booking conversion event received (manual for now).

WAITING → ASSESSING
Trigger: new info, user returns, or condition change alert.

ANY → DORMANT
Trigger: inactivity threshold crossed (e.g., 21–45 days, configurable).

DORMANT → ASSESSING
Trigger: recovery reactivation success.

ANY → SUPPRESSED
Trigger: opt-out, repeated negative response, trust failure escalation.

Lead state rules

A lead must always have:

lead_state

state_reason

last_activity_at

next_action_at if state is WAITING or DORMANT

Example reasons

STATE_REASON.TIMING_NOT_OPTIMAL

STATE_REASON.BUDGET_MISMATCH

STATE_REASON.DRIVE_FATIGUE_RISK

STATE_REASON.TRUST_UNCLEAR

STATE_REASON.USER_NOT_READY

5.2 Decision State Machine (Decision Lifecycle)

A decision is an auditable object. It can be revised.

States

DRAFTED (optional internal)

ISSUED

REFUSED

REVISED

SUPERSEDED

FLAGGED_FOR_REVIEW

REVIEWED

CORRECTED

CLOSED

Transitions

ISSUED → FLAGGED_FOR_REVIEW
Trigger: regret signal, reversal, trust flag, or anomaly rule.

REFUSED → ISSUED
Trigger: user provides missing inputs; new decision created (preferred)
Note: best practice is new decision object with supersedes_decision_id.

ISSUED → REVISED
Trigger: assumption drift detected or user constraints updated.

REVISED → SUPERSEDED
Trigger: later revision exists.

FLAGGED_FOR_REVIEW → REVIEWED
Trigger: reviewer completed evaluation.

REVIEWED → CORRECTED
Trigger: logic or copy changed and tagged with new version.

REVIEWED → CLOSED
Trigger: no action required.

Decision rules (from Constitution)
Every ISSUED decision must include:

verdict outcome

assumptions list

trade-off ledger

change conditions

A refusal must include:

reason

what input would make it decidable (bounded)

safe next action

6. Event-driven behavior (how the system moves)

This is how you get “platform behavior” without building a monolith.

Core idea

Whenever anything happens, you write an event_log event.
Then you trigger automation with EventBridge rules.

Examples

DECISION_ISSUED → update session outcome + update lead state + schedule follow-up if WAIT

ITINERARY_GENERATED → move lead to PLAN_READY

DECISION_REVERSED → flag for review + adjust confidence thresholds

This makes the platform:

auditable

measurable

correctable

7. Example records (so it’s not abstract)
Example: Decision record (timing verdict)
{
  "decision_id": "dec_7f1a...",
  "traveler_id": "trav_19c3...",
  "session_id": "sess_aa12...",
  "lead_id": "lead_55b0...",
  "created_at": "2025-12-21T08:10:00Z",
  "updated_at": "2025-12-21T08:10:00Z",
  "decision_type": "timing_verdict",
  "verdict": {
    "outcome": "wait",
    "headline": "Waiting improves predictability for your priorities.",
    "summary": "Your dates fall into a period where wildlife movement is less predictable in the regions you prefer. If you can shift by 4–6 weeks, the experience becomes more reliable."
  },
  "assumptions": [
    { "id": "a1", "text": "You prefer high wildlife density over privacy.", "confidence": 0.8 },
    { "id": "a2", "text": "You want to avoid long daily drives.", "confidence": 0.9 }
  ],
  "tradeoffs": {
    "gains": ["Better predictability", "Easier routing"],
    "losses": ["Less flexibility on travel dates", "Higher accommodation pressure"]
  },
  "change_conditions": [
    "If privacy becomes more important than density, we would revise the recommendation.",
    "If your dates become fixed, we would switch destinations/routes instead of waiting."
  ],
  "confidence": 0.72,
  "inputs_snapshot": {
    "month": "February",
    "group_size": 4,
    "drive_tolerance_hours": 3,
    "priority": "wildlife_density"
  },
  "logic_version": "rules_v1.3",
  "ai_used": true,
  "ai_trace": {
    "model": "bedrock:...",
    "prompt_version": "prompt_decision_v1.0",
    "safety_flags": []
  },
  "review": {
    "needs_review": false,
    "review_reason": null,
    "review_status": "none"
  }
}

Example: Lead state change event
{
  "event_id": "evt_1a2b...",
  "created_at": "2025-12-21T08:10:02Z",
  "event_type": "LEAD_STATE_CHANGED",
  "traveler_id": "trav_19c3...",
  "lead_id": "lead_55b0...",
  "decision_id": "dec_7f1a...",
  "payload": {
    "from": "ASSESSING",
    "to": "WAITING",
    "reason": "STATE_REASON.TIMING_NOT_OPTIMAL",
    "next_action_at": "2026-01-20T09:00:00Z"
  }
}

8. Internal linking intelligence data hooks (future-ready)

Even before AI, you need a simple graph:

Table 9: topic_graph

PK: topic_id

Fields:

topic_id

name

related_topics (array)

recommended_page_ids (array)

priority (int)

This is how your internal linking stays disciplined and scalable.

9. Single-table DynamoDB option (later optimization)

If you want to optimize later, you can fold traveler/session/lead/decision/itinerary into one table with:

PK = ENTITY#<id>

SK = TYPE#<timestamp or subid>

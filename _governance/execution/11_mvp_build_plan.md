MVP BUILD PLAN
60–90 Day Execution Doctrine

(What to build · In what order · Why)

0. PURPOSE OF THE MVP (LOCK THIS FIRST)

The MVP is not meant to:

prove scale

cover all safari cases

feel feature-rich

impress with UI

The MVP exists to answer one question only:

Can this platform reliably take a confused safari planner and help them leave with a confident, defensible decision?

Everything else is noise.

1. MVP SUCCESS CRITERIA (NON-NEGOTIABLE)

The MVP is successful if, within real usage:

Decision Completion Rate is measurable

At least 50–60% of engaged users reach Book / Wait / Switch / Discard

Decisions can be reviewed and corrected

Users do not ask “so what should I do now?”

Revenue is allowed but not required yet.
Clarity is mandatory.

2. WHAT MUST BE REAL ON DAY ONE

These components cannot be faked. If they are fake, the product is lying.

2.1 Decision Object (Core)

Full decision schema

Stored in DB

Includes verdict, assumptions, trade-offs, change conditions

Logged as event

If decisions are not persisted, nothing else matters.

2.2 Decision Doctrine Enforcement

Decision Orchestrator Lambda

Enforces:

decision or refusal

trade-offs mandatory

assumptions mandatory

AI never runs directly

This prevents drift from day one.

2.3 One Thin-Edge Decision Page

Not many. One.

Example:

“Is February a good time for a safari in Tanzania?”

This page must:

load fast

show verdict immediately

link into decision flow

generate real decisions

SEO quality > quantity.

2.4 Event Logging

DECISION_ISSUED

DECISION_REFUSED

SESSION_STARTED

ENGAGED

LEAD_STATE_CHANGED

If you don’t log events now, you will never trust metrics later.

3. WHAT IS ALLOWED TO BE “SIMULATED” INITIALLY

These can be real-looking but simplified.

3.1 Rules Engine (Initial)

Hard-coded heuristics

Simple thresholds

Few destinations

Few trade-offs

This is fine.
The correction loop exists for a reason.

3.2 AI Reasoning

One LLM model

One strict system prompt

No prompt chaining yet

No embeddings yet

Depth comes later. Discipline comes now.

3.3 Itinerary Generation

High-level itinerary

No pricing engine

No live availability

PDF can be basic

The itinerary exists to anchor a decision, not to transact yet.

3.4 Lead Recovery Logic

Simple “wait until date X” scheduling

Manual trigger allowed

Automation comes later.

4. WHAT MUST NOT BE BUILT IN MVP (ABSOLUTE)

These are forbidden, even if tempting:

Full CMS UI

Dozens of pages

Advanced filters

Chatbot UI

Partner dashboards

Payment systems

Over-designed UI polish

Mobile app

Multi-region logic

Each of these delays learning and corrupts signals.

5. MVP BUILD PHASES (SEQUENCED)
PHASE 1 (Days 1–15): Skeleton with Authority

Goal: decisions exist, doctrine enforced

Build:

API Gateway

Decision Orchestrator Lambda

Decision schema + DB

Event logging

One Decision Page (hardcoded content OK)

Minimal frontend

Outcome:

A real decision can be issued and stored.

PHASE 2 (Days 16–30): One Complete Decision Loop

Goal: uncertainty → clarity → outcome

Build:

Fit / Timing tool (5 inputs max)

AI Reasoning Engine (constrained)

Lead creation + lead state machine

Session tracking

One itinerary generator

Outcome:

User reaches Book / Wait / Switch / Discard.

PHASE 3 (Days 31–45): Learning & Trust Signals

Goal: see where decisions fail

Build:

Decision reversal detection

Review queue

Manual review UI (very basic)

Confidence scoring

Decision revision logic

Outcome:

Platform can admit error and evolve.

PHASE 4 (Days 46–60): SEO + AEO Expansion (Controlled)

Goal: traffic that matches thin edge

Build:

5–10 additional Decision Pages

Programmatic page rendering

JSON-LD schema

Internal linking rules

Outcome:

Organic traffic with intent, not noise.

OPTIONAL PHASE 5 (Days 61–90): Monetization Test

Only if DCR is healthy.

Build:

Decision Assurance artifact

PDF generation

Soft paywall or request-based delivery

Outcome:

Validate willingness to pay for responsibility.

6. MVP UX RULES (REMINDER)

Even in MVP:

Verdict always first

One action per screen

No exploration detours

No urgency language

No “browse more” patterns

If MVP UX breaks doctrine, later polish won’t fix it.

7. MVP METRICS TO WATCH (ONLY THESE)

Track daily:

Decision Completion Rate

Refusal Rate (too high = inputs unclear, too low = overconfidence)

Decision Reversal Rate

Time to Decision

Drop-off after verdict

Ignore everything else.

8. MVP FAILURE MODES (AND WHAT THEY MEAN)
Low DCR

→ decision unclear, trade-offs weak, verdict buried

High refusal rate

→ inputs missing or scope too broad

High reversal rate

→ assumptions not explicit or confidence too high

Long time to decision

→ too many steps, too much explanation

These are signals, not problems.

9. DEFINITION OF MVP “DONE”

You are done when:

You can point to real decisions

You can show decision revisions

You can explain why users waited or switched

You trust your own metrics

You feel calm shipping changes

If you don’t feel calm, something is wrong.

10. FINAL LOCK STATEMENT

We do not build everything.
We build the smallest system that can take responsibility for a decision.
Authority is earned before scale.
Speed is allowed only inside discipline.

STATUS

LOCKED — MVP Build Plan v1.0
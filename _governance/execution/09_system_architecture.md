SYSTEM ARCHITECTURE DOCUMENT
AWS-Native Decision Authority Platform
1. PURPOSE OF THIS DOCUMENT

This document defines how all constitutional decisions are implemented technically using AWS services.

It exists to ensure:

scalability without rebuilds

separation of concerns

AI integration without hacks

SEO and AEO without WordPress dependency

fast iteration with long-term integrity

If this architecture is violated:

features will entangle

AI will become brittle

scaling will become expensive

authority will degrade under growth

2. ARCHITECTURAL PRINCIPLE (NON-NEGOTIABLE)

The platform is composable, headless, and decision-first.

This means:

frontend is replaceable

intelligence lives in services

content is structured, not “pages”

AI is an engine, not a UI feature

3. HIGH-LEVEL SYSTEM LAYERS

The platform has five core layers, each isolated on purpose.

[ Frontend Experience ]
        ↓
[ API Gateway Layer ]
        ↓
[ Decision & AI Engines ]
        ↓
[ Data & Knowledge Layer ]
        ↓
[ Monitoring & Learning Layer ]


Each layer may evolve independently.

4. FRONTEND EXPERIENCE LAYER
Purpose

Deliver a calm, editorial, verdict-first experience to users and search engines.

Technology

Next.js (App Router)

Static + server-side rendering

Deployed on AWS Amplify or CloudFront + S3

Why

SEO and AEO native

Fast global delivery

Full design control

No plugin bloat

No CMS lock-in

Responsibilities

Render Decision Pages

Render Tool Pages

Render Itineraries

Render structured content

Collect user inputs

Display AI outputs

Explicitly NOT responsible for

decision logic

AI reasoning

business rules

data storage

Frontend is a viewer, not a thinker.

5. API GATEWAY LAYER
Purpose

Act as the single contract between frontend and intelligence.

Technology

AWS API Gateway

REST initially (GraphQL optional later)

Why

clean separation

security

versioning

future partner access

multi-frontend support

Responsibilities

route requests

validate inputs

enforce schemas

handle auth

rate limit

log activity

Key APIs (initial)

/decision/evaluate

/decision/refuse

/itinerary/generate

/content/fetch

/context/recall

/metrics/record

No frontend talks directly to AI or databases.

6. DECISION & AI ENGINES LAYER (CORE VALUE)

This is the heart of the platform.

Subsystems
6.1 Decision Orchestrator

Technology

AWS Lambda

Step Functions (for complex flows)

Purpose

enforce Decision Doctrine

sequence logic

decide when AI is allowed to run

decide when to refuse

apply thresholds and rules

This is where responsibility lives.

6.2 AI Reasoning Engine

Technology

Amazon Bedrock (LLMs)

Strict system prompts (from Constitution)

Purpose

generate assessments

explain trade-offs

produce verdicts

revise decisions

AI never runs directly.
It is invoked by the orchestrator.

6.3 Rules & Heuristics Engine

Technology

Lambda + config tables

Versioned logic rules

Purpose

non-AI constraints

guardrails

refusal thresholds

deterministic exclusions

This prevents over-reliance on AI.

6.4 Decision Assurance Generator

Technology

Lambda

PDF generation service (server-side)

Purpose

produce timestamped decision artifacts

capture assumptions

create paid value

7. DATA & KNOWLEDGE LAYER

This layer replaces WordPress entirely.

7.1 Structured Content Store

Technology

DynamoDB or Aurora Serverless

Stores

Decision Page content

Comparison logic

Destination facts

Trade-off notes

Editorial explanations

Content is:

structured

queryable

versioned

Not blobs of HTML.

7.2 User Context & Memory Store

Technology

DynamoDB

Stores

prior decisions

preferences

hesitation points

assumptions

refusal reasons

This enables:

return-user intelligence

no repeated questions

better AI grounding

7.3 Knowledge Artifacts

Technology

S3

Stores

generated itineraries

decision reports

PDFs

static assets

8. SEO & AEO ENGINE (CRITICAL)
How SEO works without WordPress

Pages are programmatically generated

Based on structured decision content

Each page answers one question

Verdict appears immediately

Schema markup injected at render time

Tools

Next.js ISR

JSON-LD schema

Sitemap automation

Canonical logic

Internal linking logic (AI-assisted later)

Result

Unlimited high-quality pages

No manual blog writing

AEO-ready

Google-friendly

LLM-friendly

This is more powerful than WordPress, not less.

9. MONITORING & LEARNING LAYER

This enforces the Metrics Constitution.

9.1 Metrics Capture

Technology

AWS EventBridge

Lambda

Captures

decision completion

reversals

hesitation

refusals

assurance attachment

9.2 Analytics & Review

Technology

Amazon Athena

QuickSight

Purpose

decision quality review

pattern detection

correction inputs

9.3 Alerting

Technology

CloudWatch

SNS

Purpose

assumption drift alerts

AI confidence downgrade triggers

trust failure signals

10. SECURITY & ACCESS (BASELINE)

Cognito for auth (later)

IAM least privilege

API throttling

Prompt injection protection

AI input validation

Authority platforms must be boring and secure.

11. WHY THIS ARCHITECTURE FITS VIBE CODING

Because:

each Lambda can be vibe-coded independently

prompts are governed

frontend can change without logic change

mistakes are isolated

AI is constrained structurally

scaling is automatic

You can build fast without creating a mess.

12. WHAT THIS ARCHITECTURE INTENTIONALLY AVOIDS

monolithic backend

CMS plugins

tight coupling

direct AI calls from UI

hard-coded content

manual SEO workflows

All of these kill authority over time.

13. FINAL LOCK STATEMENT

The frontend presents judgment.
The backend enforces responsibility.
AI reasons under constraint.
Content is structured, not written.
Scaling does not change behavior.

STATUS

LOCKED — Architecture v1.0
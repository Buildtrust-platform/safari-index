# MVP Freeze Definition

Defines what constitutes the MVP, what is excluded, and when changes are permitted.

---

## What Is INCLUDED in the MVP

### Decision Pages (`/decisions/[slug]`)
- VerdictCard with outcome (book, wait, switch, discard, refused)
- Confidence display (High, Medium, Low)
- TradeoffLedger (gains/losses)
- FitMisfitBlock (right for/not ideal for)
- AssumptionsBlock (numbered assumptions with confidence)
- ChangeConditions (bullet list)
- AnswerOwnershipBlock (quotable verdict)
- AttributionFooter (decision ID, logic version, answer version, issued date)
- DecisionFollowUp (email subscription checkbox)
- NextSensibleStep (contextual guidance based on outcome)

### Assurance Pages (`/assurance/[id]`)
- Immutable decision artifact display
- Invalidation checklist
- Print/PDF functionality
- Shareable link copy
- Embed code generator

### Embed System (`/embed/decision/[id]`)
- Standalone embed widget
- Flagged-for-review state
- Canonical URL attribution

### API Endpoints
- `/api/answers` - Decision retrieval
- `/api/events/embed` - Embed view tracking
- `/api/followup/subscribe` - Email subscription
- `/api/ops/health` - System health check
- `/api/review-queue` - Review queue management

### Static Assets
- Homepage (`/`)
- Sitemap (`/sitemap.xml`)
- robots.txt

### Dev Tools (gated)
- `/dev/components` - Component preview (ENABLE_DEV_PAGES only)

---

## What Is EXCLUDED from the MVP

### Features NOT included
- User accounts or authentication
- Personalized recommendations
- Search functionality
- Comparison tools
- Price tracking or alerts
- Booking integration
- Affiliate links
- Comments or community features
- Mobile applications
- Push notifications
- A/B testing framework
- Analytics dashboards (beyond /api/ops/health)

### Content NOT included
- Blog or editorial content
- Destination guides
- Operator reviews
- Photo galleries
- Video content
- User-generated content

### Monetization NOT included
- Advertising
- Sponsored placements
- Premium tiers beyond assurance
- Subscription models

---

## What Constitutes a Breaking Change

A breaking change is any modification that:

### User-Facing Breaking Changes
- Alters the meaning or outcome of an existing decision
- Changes the structure of the verdict display
- Modifies the confidence calculation formula
- Removes or renames any visible component
- Changes the URL structure of published pages
- Alters the format of the embed widget
- Modifies the quotable verdict format

### API Breaking Changes
- Changes response schema for existing endpoints
- Removes or renames API endpoints
- Modifies authentication requirements
- Changes error response formats

### Data Breaking Changes
- Alters decision ID format
- Modifies assurance artifact structure
- Changes logic version semantics
- Breaks backward compatibility with stored artifacts

---

## Change Permission Rules

### Changes Permitted Without Report
- Bug fixes that restore intended behavior
- Security patches
- Dependency updates (minor/patch only)
- Performance improvements with no visible change
- Documentation updates
- Test additions or improvements

### Changes Requiring Observation Report
- Any UI modification
- Any copy change
- Any new feature
- Any removed feature
- Any API schema change
- Any pricing change
- Any new decision topic

### Changes Requiring Week 4 Gate Review
- Scope expansion
- Domain pivot
- Monetization model change
- Target audience change

---

## Enforcement

- This document is referenced before any pull request
- Breaking changes require explicit justification citing observation data
- "It feels right" is not a valid justification
- Urgency does not override this freeze
- This freeze expires only at Week 4 Gate review or explicit founder decision documented in writing

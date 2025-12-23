# Decision Topic Expansion Rules

Defines criteria for adding or retiring decision topics. Paper rules only; no content creation permitted during Observation Mode.

---

## Preconditions for Any Expansion

Before adding any new decision topic:

- Observation Mode must be complete (Week 4 Gate passed)
- Existing topics must have at least 4 weeks of observation data
- No unresolved quality gate failures in existing topics
- Review queue must be empty or at stable equilibrium

---

## Criteria to ADD a New Decision Topic

A topic may be added only if ALL of the following are true:

### Demand Signal (Required)
- Refusal pattern shows >10 requests for the specific question in 4 weeks
- OR existing topic has >20% "this doesn't apply to me" follow-up feedback
- Traffic is NOT a valid signal (refusals are)

### Feasibility (Required)
- Topic can be answered with existing logic framework
- Topic has clear book/wait/switch/discard outcomes
- Topic has identifiable assumptions that can be stated
- Topic has measurable change conditions

### Scope Constraint (Required)
- Topic fits within safari travel decisions domain
- Topic does not require new data sources
- Topic does not require partnerships or integrations
- Topic can be validated by founder without external expertise

### Exclusions
- Topics suggested by a single user (minimum 3 distinct requesters)
- Topics that require real-time data
- Topics that involve price guarantees
- Topics that require operator-specific recommendations

---

## Criteria to RETIRE a Decision Topic

A topic should be retired if ANY of the following are true:

### Quality Failure
- Quality gate failure rate >50% for 2 consecutive weeks
- No successful assurance issued in 4 weeks
- Confidence consistently below 0.5 for 4 weeks

### Demand Absence
- Zero page views for 4 consecutive weeks
- Zero assurance requests for 8 consecutive weeks
- Zero embed renders for 8 consecutive weeks

### Accuracy Concern
- Outcome change required >3 times in 4 weeks
- User feedback indicates systematic inaccuracy
- External validation proves recommendation wrong

### Retirement Process
- Topic is marked `published: false` in topic registry
- Existing assurances remain valid and accessible
- Embeds display "This decision has been retired" state
- No deletion of historical data

---

## Maximum New Topics Per Cycle

- Maximum 2 new topics per 4-week cycle
- Topics must be added sequentially, not simultaneously
- Second topic cannot be added until first topic has 2 weeks of observation
- Batch additions are prohibited

---

## How Refusal Patterns Guide Expansion

### Valid Refusal Signals
- "Missing information about [specific destination]" - indicates geographic gap
- "My dates are [outside covered period]" - indicates temporal gap
- "I need to know about [specific activity]" - indicates activity gap
- Repeated clarification requests for same missing input

### Invalid Signals for Expansion
- High traffic to existing topics (success, not gap)
- Social media mentions (vanity, not demand)
- Competitor coverage (external, not user-driven)
- Founder intuition (bias, not data)

### Refusal Aggregation
- Refusals are grouped by semantic similarity
- Groups with <10 instances in 4 weeks are ignored
- Groups are reviewed only at Week 4 Gate
- No real-time expansion based on refusals

---

## Documentation Requirements

Before adding any topic:

- Create topic proposal document with:
  - Exact question phrasing
  - Expected outcomes and conditions
  - Assumptions to be stated
  - Change conditions
  - Refusal evidence (counts and examples)
- Proposal must sit for 7 days before implementation
- Founder must re-read proposal after 7 days and confirm

---

## Prohibited Expansion Patterns

- Adding topics because "we should have this"
- Adding topics because a competitor has them
- Adding topics to increase perceived completeness
- Adding topics to satisfy a vocal user
- Adding topics during stress or low-traffic periods
- Adding topics without refusal evidence

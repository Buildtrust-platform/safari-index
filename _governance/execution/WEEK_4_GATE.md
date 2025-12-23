# Week 4 Gate

Defines the signals required by Week 4 and the decision framework for next steps.

---

## Purpose

Week 4 is the first decision point. Before Week 4, no strategic decisions are made. At Week 4, accumulated data is reviewed and one of four paths is chosen.

---

## Required Signals by Week 4

The following must be collected and documented before the gate review:

### Traffic Signals
- Total unique visitors (4 weeks)
- Page views per decision topic
- Bounce rate per decision topic
- Return visitor rate

### Engagement Signals
- Follow-up subscription count
- Follow-up subscription rate (subscriptions / page views)
- Embed render count
- Embed view count (renders that resulted in clicks)

### Conversion Signals
- Assurance requests (initiated checkout)
- Assurance purchases (completed payment)
- Assurance conversion rate (purchases / requests)
- Revenue total

### Quality Signals
- Quality gate failure count
- Quality gate failure rate (failures / decisions rendered)
- Review queue size
- Decisions requiring outcome revision

### Refusal Signals
- Total refusals
- Refusal rate (refusals / total decision requests)
- Top 5 refusal reasons with counts
- Topics with highest refusal rates

### Feedback Signals
- Direct feedback received (count and categorization)
- Refund requests
- Negative feedback instances
- Positive feedback instances

---

## Signal Thresholds

These thresholds inform decision outcomes but are not absolute triggers.

### Minimum Viable Signals (all must be met)
- At least 100 unique visitors total
- At least 1 assurance purchase
- At least 1 follow-up subscription
- Quality gate failure rate below 20%

### Concerning Signals (any one is a warning)
- Bounce rate above 80% on decision pages
- Zero assurance purchases
- Refusal rate above 50%
- Negative feedback exceeds positive feedback

### Positive Signals (any one is encouraging)
- Assurance conversion rate above 2%
- Return visitor rate above 20%
- Embed requests from external sites
- Organic search traffic appearing

---

## Decision Outcomes

At Week 4, one of four outcomes is chosen:

### 1. Continue Observing

**Criteria:**
- Minimum viable signals are met
- No concerning signals are dominant
- Data suggests more time will clarify patterns
- Founder has capacity to continue

**Actions:**
- Extend observation for 4 more weeks
- No product changes
- Continue data collection
- Set Week 8 Gate

### 2. Narrow Scope

**Criteria:**
- Some topics perform significantly better than others
- Refusal patterns show clear topic mismatch
- Quality is higher in subset of topics
- Resource constraints favor focus

**Actions:**
- Retire underperforming topics (per DECISION_EXPANSION.md)
- Focus observation on remaining topics
- Do not add new topics
- Set Week 8 Gate for narrowed scope

### 3. Pivot Domain

**Criteria:**
- Minimum viable signals not met after 4 weeks
- Refusal patterns suggest different question domain
- Traffic exists but engagement does not
- Safari travel specifically is not resonating

**Actions:**
- Document pivot rationale with data
- Archive current MVP (do not delete)
- Apply same governance framework to new domain
- Reset to Week 0 for new domain

### 4. Double Down

**Criteria:**
- All positive signals present
- No concerning signals
- Clear demand for expansion
- Founder capacity exists for growth

**Actions:**
- Exit Observation Mode
- Begin controlled expansion (per DECISION_EXPANSION.md)
- Consider human review introduction (per HUMAN_REVIEW_THRESHOLD.md)
- Set monthly review cadence

---

## What Does NOT Justify Action

The following are not valid reasons to change course:

### External Factors
- Competitor launched similar product
- Industry news or trends
- Investor or advisor opinion
- Social media commentary

### Emotional Factors
- Founder boredom
- Desire to "do something"
- Embarrassment about metrics
- Impatience with timeline

### Isolated Incidents
- Single viral moment (positive or negative)
- Single large customer
- Single refund request
- Single piece of feedback

### Incomplete Data
- Metrics from less than 4 weeks
- Metrics with known collection errors
- Metrics without context from all signal categories

---

## Gate Review Process

### Preparation (Day before)
- Complete final Weekly Observation Report
- Compile all 4 reports into summary document
- Calculate aggregate metrics across period
- Identify any data gaps or collection failures

### Review (Gate day)
- Read all 4 weekly reports sequentially
- Compare to thresholds defined above
- Identify which decision outcome fits
- Document reasoning for outcome choice

### Documentation
- Write Week 4 Gate Decision document
- Include: chosen outcome, supporting data, rejected alternatives
- Store in `_governance/decisions/` directory
- Date and sign

### Execution
- Follow actions defined for chosen outcome
- Update OPERATIONS.md if observing continues
- Communicate decision (internally only, no public announcement)

---

## Post-Gate

After Week 4 Gate:

- This document remains in effect for future gates
- Gate cadence continues (Week 8, Week 12, etc.)
- Each gate follows same process
- Outcomes may change based on new data
- Governance documents may be revised only at gates

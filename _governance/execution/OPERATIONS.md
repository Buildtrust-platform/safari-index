# Safari Index Operations Guide

## Purpose

This document defines how to monitor and maintain Safari Index in production. It covers health signals, guardrails, safe defaults, and incident response.

Per governance: metrics exist for truth, not optimization. Health signals detect degradation, not performance.

---

## Health Signals

Seven health signals indicate system state. Each has a threshold that triggers concern.

### 1. Decision Failure Rate

**What it measures:** Rate of decision requests that fail completely (not refusals, but errors).

| Status | Threshold | Action |
|--------|-----------|--------|
| Healthy | <5% | None |
| Warning | 5-15% | Monitor |
| Critical | >15% | Investigate immediately |

**Common causes:** Bedrock unavailable, invalid input data, schema violations.

### 2. Refusal Rate

**What it measures:** Rate of decisions that result in principled refusal (not enough data, out of scope, etc.).

| Status | Threshold | Action |
|--------|-----------|--------|
| Healthy | <40% | None |
| Warning | 40-60% | Review topic configurations |
| Critical | >60% | Check if logic is too strict or inputs are malformed |

**Note:** Some refusal is healthy. We prefer to refuse rather than give weak decisions.

### 3. Bedrock Failure Rate

**What it measures:** Rate of AWS Bedrock AI calls that fail.

| Status | Threshold | Action |
|--------|-----------|--------|
| Healthy | <10% | None |
| Warning | 10-30% | Check AWS status |
| Critical | >30% | Circuit breaker activates |

### 4. Assurance Success Rate

**What it measures:** Rate of Decision Assurance generation requests that succeed.

| Status | Threshold | Action |
|--------|-----------|--------|
| Healthy | >80% | None |
| Warning | 60-80% | Check PDF generation, AI services |
| Critical | <60% | Assurance paused automatically |

### 5. Embed Error Rate

**What it measures:** Rate of embed renders that fail.

| Status | Threshold | Action |
|--------|-----------|--------|
| Healthy | <5% | None |
| Warning | 5-15% | Check embed service |
| Critical | >15% | Investigate embed infrastructure |

### 6. Review Queue Growth

**What it measures:** Net growth of human review queue in current 1-hour window.

| Status | Threshold | Action |
|--------|-----------|--------|
| Healthy | <10 | None |
| Warning | 10-25 | Monitor reviewer capacity |
| Critical | >25 | Add reviewers or adjust review criteria |

### 7. Total Decisions

**What it measures:** Total decision requests in current window. Informational only.

---

## Guardrails

Guardrails detect silent failures and trigger automatic interventions.

### Bedrock Circuit Breaker

**Trigger:** 3 consecutive Bedrock failures.

**Effect:**
- New decisions return safe default (refuse or cached)
- Circuit remains open until manually reset or Bedrock recovers

**Recovery:**
1. Check AWS Bedrock status
2. Verify credentials in SSM Parameter Store
3. Call reset endpoint or wait for automatic recovery

### Assurance Pause

**Trigger:** 3 consecutive assurance generation failures.

**Effect:**
- Assurance purchases temporarily unavailable
- Existing assurances remain valid
- Users see "temporarily unavailable" message

**Recovery:**
1. Check PDF generation logs
2. Verify AI service connectivity
3. Reset via ops endpoint

### Refusal Spike Detection

**Trigger:** >60% refusal rate for a specific topic with 5+ decisions.

**Effect:**
- Warning alert generated
- No automatic intervention

**Action:**
- Review topic configuration
- Check if input constraints are too strict
- Verify topic is still in scope

### Schema Violation Detection

**Trigger:** Any decision output fails schema validation.

**Effect:**
- Critical alert generated
- Decision not stored or served

**Action:**
- Review AI prompt engineering
- Check for prompt injection attempts
- Verify output parsing

---

## Safe Defaults

When services are unavailable, the system applies safe defaults. Philosophy: **It is better to refuse than to guess.**

### Decision Unavailable

1. **With valid cache (<24h):** Serve cached decision with "generated earlier" notice
2. **No valid cache:** Refuse with "temporarily unavailable" message
3. **Never:** Guess, hallucinate, or serve stale data without notice

### Assurance Unavailable

- Return "temporarily unavailable" with retry suggestion
- Do not charge users if generation fails
- Existing assurances remain accessible

### Embed Unavailable

- Return fallback HTML with link to main site
- No broken embeds or error traces

---

## Monitoring Endpoints

### GET /api/ops/health

Returns complete operational snapshot.

**Response structure:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "production",
  "health": {
    "overall": "healthy",
    "signals": [...],
    "summary": "All signals within normal parameters."
  },
  "guardrails": {
    "alerts": [],
    "interventions": {
      "bedrockCircuitOpen": false,
      "assurancePaused": false,
      "embedsDisabled": false
    }
  },
  "actions": [],
  "version": "1.0.0"
}
```

**Access:** Protected. Requires ops credentials in production.

---

## Incident Response

### Level 1: Warning

**Indicators:** 1-2 warning signals, no critical alerts.

**Response:**
1. Acknowledge in ops channel
2. Monitor for 15 minutes
3. Escalate if condition persists or worsens

### Level 2: Degraded

**Indicators:** 3+ warning signals OR 1 critical signal with intervention.

**Response:**
1. Page on-call engineer
2. Check health endpoint for recommended actions
3. Communicate status to users if public-facing impact
4. Resolve within 1 hour or escalate

### Level 3: Critical

**Indicators:** Multiple critical signals, multiple interventions active.

**Response:**
1. All hands incident
2. Consider disabling public access if integrity is at risk
3. Root cause analysis required before full recovery
4. Post-incident review within 24 hours

---

## Recovery Procedures

### Reset Bedrock Circuit

```bash
# Via Lambda console or CLI
aws lambda invoke \
  --function-name safari-index-decision-orchestrator \
  --payload '{"action": "reset_bedrock_circuit"}' \
  response.json
```

### Reset Assurance Circuit

```bash
aws lambda invoke \
  --function-name safari-index-decision-orchestrator \
  --payload '{"action": "reset_assurance_circuit"}' \
  response.json
```

### Force Health Check

```bash
curl -H "Authorization: Bearer $OPS_TOKEN" \
  https://api.safariindex.com/ops/health
```

---

## Alerting Philosophy

Per governance:
- Alerts are calm, actionable, and rare
- No noisy monitoring
- False positives degrade trust

**Good alert:** "Bedrock failure rate 25%. 3 consecutive failures. Circuit open. Check AWS status."

**Bad alert:** "API latency increased 5ms. Possible degradation detected. Please investigate."

---

## Metrics Collection

Health counters are collected per 1-hour window:
- decisionsIssued, decisionsRefused, decisionsFailed
- assurancesIssued, assurancesFailed
- embedsRendered, embedErrors
- bedrockCalls, bedrockFailures
- reviewsCreated, reviewsResolved

In production, these are stored in CloudWatch Metrics or DynamoDB with TTL.

---

## Document History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2024-12-21 | Initial operations guide |

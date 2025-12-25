# Email Notification Debugging Guide

Troubleshooting guide for Safari Index inquiry email notifications.

## Architecture

```
Inquiry Form → /api/inquire (Next.js) → DynamoDB → sendInquiryNotification() → SES
```

- **Localhost**: Next.js dev server handles `/api/inquire`, uses local AWS credentials
- **Deployed (Amplify)**: Amplify runs Next.js server, uses IAM role credentials

---

## Quick Diagnostics

### 1. Check Environment Variables

Required in `.env.local` (localhost) or Amplify Environment Variables (deployed):

```bash
OPERATOR_EMAIL=your-email@example.com    # Must be SES-verified in sandbox
FROM_EMAIL=your-email@example.com        # Must be SES-verified in sandbox
AWS_REGION=us-east-1                     # Must match SES region
```

### 2. Check SES Verification Status

```bash
# Check if emails are verified
aws ses get-identity-verification-attributes \
  --identities your-email@example.com \
  --region us-east-1

# Expected output for working setup:
# "VerificationStatus": "Success"
```

### 3. Check SES Sandbox Status

```bash
# Check sending quota (low quota = sandbox mode)
aws ses get-send-quota --region us-east-1

# Sandbox mode: Max24HourSend = 200, MaxSendRate = 1
# Production mode: Much higher limits
```

---

## SES Identity Verification

### Verify Email Address

```bash
# Request verification email
aws ses verify-email-identity \
  --email-address your-email@example.com \
  --region us-east-1

# Then click the link in the verification email from AWS
```

### Check Verification Status

```bash
aws ses get-identity-verification-attributes \
  --identities your-email@example.com \
  --region us-east-1
```

Statuses:
- `Pending` - Verification email sent, waiting for link click
- `Success` - Verified, can send from/to this address
- `Failed` - Verification failed, re-request

### Resend Verification Email

```bash
# Just run the same command again
aws ses verify-email-identity \
  --email-address your-email@example.com \
  --region us-east-1
```

**Check spam/junk folder** - AWS verification emails often land there.

---

## SES Sandbox Mode

By default, new SES accounts are in **sandbox mode**:

| Sandbox Mode | Production Mode |
|--------------|-----------------|
| Can only send TO verified emails | Can send to any email |
| Can only send FROM verified emails | Can only send FROM verified emails |
| 200 emails/day limit | Higher limits |
| 1 email/second | Higher rate |

### Request Production Access

1. AWS Console → SES → Account dashboard
2. Click "Request production access"
3. Fill out form:
   - Mail type: **Transactional**
   - Use case: "Safari trip inquiry notifications to operator"
   - Expected volume: <100/day
4. Wait 24-48 hours for approval

---

## Region Checklist

SES is region-specific. Ensure consistency:

| Setting | Value |
|---------|-------|
| `.env.local` AWS_REGION | `us-east-1` |
| SES identity verification | `us-east-1` |
| Amplify env AWS_REGION | `us-east-1` |

To check which region has your identities:

```bash
# Check us-east-1
aws ses list-identities --region us-east-1

# Check eu-central-1
aws ses list-identities --region eu-central-1
```

---

## Local Development

### Verify AWS Credentials

```bash
aws sts get-caller-identity
```

Should return your IAM user/role ARN.

### Start Dev Server with Env Vars

```bash
cd frontend/safari-index
npm run dev
```

The `.env.local` file is automatically loaded.

### Test Email Send

```bash
curl -X POST http://localhost:3000/api/inquire \
  -H "Content-Type: application/json" \
  -d '{
    "trip_shape_id": null,
    "budget_band": "10k-20k",
    "travel_month": 7,
    "travel_year": 2025,
    "traveler_count": 2,
    "travel_style": "couple",
    "email": "test@example.com",
    "whatsapp": null,
    "linked_decision_ids": [],
    "notes": "Test inquiry",
    "source_path": "/test"
  }'
```

### Expected Console Output (Success)

```
[Inquiry Notification] Config check: {
  inquiry_id: 'inq_abc123...',
  operator_email: 'ngu***@gmail.com',
  from_email: 'ngu***@gmail.com',
  region: 'us-east-1',
  has_aws_credentials: true
}
[Inquiry Notification] Sending email for inq_abc123...
[Inquiry Notification] SUCCESS {
  inquiry_id: 'inq_abc123...',
  message_id: '0100...',
  to: 'ngu***@gmail.com'
}
```

### Expected Console Output (Failure - Not Verified)

```
[Inquiry Notification] FAILED {
  inquiry_id: 'inq_abc123...',
  error_name: 'MessageRejected',
  error_code: 'MessageRejected',
  error_message: 'Email address is not verified...',
  ...
}
[Inquiry Notification] HINT: Email identities must be verified in SES. Run:
  aws ses verify-email-identity --email-address your@email.com --region us-east-1
```

---

## Deployed (Amplify) Debugging

### Check CloudWatch Logs

1. AWS Console → CloudWatch → Log groups
2. Find log group: `/aws/amplify/{app-id}`
3. Search for `[Inquiry Notification]`

### Verify Environment Variables

1. Amplify Console → App → Hosting → Environment variables
2. Ensure these are set:
   - `OPERATOR_EMAIL`
   - `FROM_EMAIL`
   - `AWS_REGION`

### Verify IAM Permissions

Amplify service role needs SES permissions:

```json
{
  "Effect": "Allow",
  "Action": [
    "ses:SendEmail",
    "ses:SendRawEmail"
  ],
  "Resource": "*"
}
```

---

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| "OPERATOR_EMAIL not configured" | Missing env var | Add to `.env.local` or Amplify |
| "Email address is not verified" | SES identity not verified | Run `aws ses verify-email-identity` and click link |
| "Access Denied" | Missing IAM permissions | Add SES permissions to role |
| "Invalid security token" | Expired/missing AWS creds | Refresh credentials or check AWS_PROFILE |
| Email sent but not received | Check spam folder | Also verify recipient email in sandbox |
| Duplicate emails | Retry without idempotency | Fixed in current code |

---

## Testing Checklist

### Local Test
- [ ] `.env.local` has OPERATOR_EMAIL, FROM_EMAIL, AWS_REGION
- [ ] `aws sts get-caller-identity` works
- [ ] Both emails verified in SES (check verification status)
- [ ] Submit inquiry on localhost
- [ ] Console shows `[Inquiry Notification] SUCCESS`
- [ ] Email arrives in inbox

### Deployed Test
- [ ] Amplify env vars set
- [ ] Submit inquiry on Amplify URL
- [ ] CloudWatch logs show `[Inquiry Notification] SUCCESS`
- [ ] Email arrives in inbox

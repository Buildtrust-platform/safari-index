# Safari Index AWS Setup Runbook

Complete setup guide for Safari Index hosting infrastructure.

**Status:** CDN deployed. Amplify pending GitHub connection.
**Last Updated:** 2025-12-23

---

## Prerequisites

- [ ] AWS CLI configured with credentials
- [ ] AWS CDK installed (`npm install -g aws-cdk`)
- [ ] Node.js 20.x or later
- [ ] GitHub repository access
- [ ] AWS Console access

---

## Section A: Assets CDN (Already Deployed)

### A.1 Current Deployment

| Environment | CloudFront Domain | S3 Bucket |
|-------------|-------------------|-----------|
| Staging | `d3akaqzbxcmb8k.cloudfront.net` | `staging-safari-index-assets-928622536086-eu-central-1` |
| Production | `d7lhxuw5xhnoj.cloudfront.net` | `safari-index-assets-928622536086-eu-central-1` |

### A.2 CDN Features

- Private S3 bucket (all public access blocked)
- CloudFront with Origin Access Control (OAC)
- 365-day cache TTL for immutable versioned assets
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Brotli/Gzip compression
- Price Class 100 (US, Canada, Europe)

### A.3 Deploy/Update CDN (if needed)

```bash
cd infrastructure
npm install

# Staging
ENV_NAME=staging npx cdk deploy StagingSafariIndexAssetsStack

# Production
npx cdk deploy SafariIndexAssetsStack
```

---

## Section B: Amplify Hosting + GitHub Connection

### B.1 Create Amplify App (Console)

1. **Open AWS Console** → Amplify → Create new app → Host web app

2. **Connect GitHub:**
   - Select "GitHub" as source provider
   - Click "Connect to GitHub"
   - This opens GitHub authorization for **AWS Amplify GitHub App**
   - Authorize the app and select the repository

3. **Configure repository:**
   - Repository: `safari-index` (or your repo name)
   - Branch: `main` (for production app)

4. **Build settings:**
   - Framework: Auto-detected as Next.js
   - Build command: Already in `amplify.yml`
   - Click "Next"

5. **Review and create:**
   - App name: `safari-index` (or `safari-index-staging`)
   - Click "Save and deploy"

### B.2 Verify GitHub App Installation

After connecting, verify in GitHub:

1. Go to GitHub → Settings → Applications → Installed GitHub Apps
2. Find "AWS Amplify" and click "Configure"
3. Verify repository access is granted for `safari-index`

### B.3 Add Staging Branch

After production is created:

1. In Amplify Console → App → Hosting → Branch
2. Click "Connect branch"
3. Select `staging` branch
4. This creates a separate environment for staging

### B.4 Configure Environment Variables

**For main (production) branch:**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_MODE` | `observation` |
| `NEXT_PUBLIC_API_BASE` | `https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1` |
| `NEXT_PUBLIC_ASSETS_CDN_BASE` | `https://d7lhxuw5xhnoj.cloudfront.net` |

**For staging branch:**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_MODE` | `build` |
| `NEXT_PUBLIC_API_BASE` | `https://{staging-api-id}.execute-api.eu-central-1.amazonaws.com/v1` |
| `NEXT_PUBLIC_ASSETS_CDN_BASE` | `https://d3akaqzbxcmb8k.cloudfront.net` |
| `ENABLE_DEV_PAGES` | `true` |

To set environment variables:

1. Amplify Console → App → Hosting → Environment variables
2. Click "Manage variables"
3. Add each variable
4. Select which branches it applies to

### B.5 Verification Checklist

After deployment:

- [ ] Production URL loads (e.g., `https://main.{app-id}.amplifyapp.com`)
- [ ] Staging URL loads (e.g., `https://staging.{app-id}.amplifyapp.com`)
- [ ] `/api/ops/health` returns 200
- [ ] Decision pages render correctly
- [ ] Images load (check Network tab for CloudFront)
- [ ] No console errors

---

## Section C: Environment Variables Reference

### Required for Production

```
NEXT_PUBLIC_APP_MODE=observation
NEXT_PUBLIC_API_BASE=https://{api-id}.execute-api.{region}.amazonaws.com/v1
OPERATOR_EMAIL=steve@safariindex.com
FROM_EMAIL=notifications@safariindex.com
```

### Required for Staging

```
NEXT_PUBLIC_APP_MODE=build
NEXT_PUBLIC_API_BASE=https://{staging-api-id}.execute-api.{region}.amazonaws.com/v1
ENABLE_DEV_PAGES=true
OPERATOR_EMAIL=steve@safariindex.com
FROM_EMAIL=notifications@safariindex.com
```

### Optional (Both Environments)

```
NEXT_PUBLIC_ASSETS_CDN_BASE=https://{distribution-id}.cloudfront.net
SITE_ORIGIN=https://safariindex.com
```

### Email Notification Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPERATOR_EMAIL` | Email address to receive inquiry notifications | Yes (for notifications) |
| `FROM_EMAIL` | Sender email address (must be SES-verified) | Defaults to `notifications@safariindex.com` |
| `AWS_REGION` | AWS region for SES | Defaults to `us-east-1` |

---

## Section D: Safety Checks

### D.1 Pre-Deployment Validation

The build process automatically runs `npm run validate-env` which:

1. Checks `NEXT_PUBLIC_APP_MODE` matches expected environment
2. Warns if `NEXT_PUBLIC_API_BASE` is not set
3. Reports CDN configuration status

### D.2 Manual Verification

```bash
# Local validation
cd frontend/safari-index
npm run validate-env

# With production settings
NODE_ENV=production NEXT_PUBLIC_APP_MODE=observation npm run validate-env
```

### D.3 Post-Deployment Checks

```bash
# Check production health
curl https://main.{app-id}.amplifyapp.com/api/ops/health

# Check staging health
curl https://staging.{app-id}.amplifyapp.com/api/ops/health

# Verify CDN headers
curl -I https://d7lhxuw5xhnoj.cloudfront.net/images/heroes/home-hero.jpg
```

---

## Section E: Troubleshooting

### Build fails with "App mode" error

```
❌ ERROR: Production must use observation mode
```

**Fix:** Set `NEXT_PUBLIC_APP_MODE=observation` in Amplify environment variables.

### Images not loading from CDN

1. Check `NEXT_PUBLIC_ASSETS_CDN_BASE` is set
2. Verify images exist in S3 bucket
3. Check CloudFront distribution is deployed

### API calls failing

1. Check `NEXT_PUBLIC_API_BASE` is set correctly
2. Verify API Gateway is deployed
3. Check CORS configuration allows Amplify domain

### GitHub connection issues

1. Go to GitHub → Settings → Applications
2. Find "AWS Amplify" and check repository access
3. If missing, reconfigure in Amplify Console

---

## Section F: Asset Upload (Optional)

To serve images from CDN instead of locally:

```bash
# Upload to staging
aws s3 sync public/images/ s3://staging-safari-index-assets-928622536086-eu-central-1/images/ \
  --cache-control "public, max-age=31536000, immutable"

# Upload to production
aws s3 sync public/images/ s3://safari-index-assets-928622536086-eu-central-1/images/ \
  --cache-control "public, max-age=31536000, immutable"

# Invalidate CloudFront cache if updating existing files
aws cloudfront create-invalidation \
  --distribution-id {distribution-id} \
  --paths "/images/*"
```

---

## Section G: Assurance Payment Troubleshooting

### G.1 User Reports "Paid But Not Unlocked"

When a user reports they paid but can't access their assurance:

1. **Get identifiers from user:**
   - Assurance ID (visible in footer of assurance page)
   - Stripe payment receipt email (contains payment intent ID `pi_...`)

2. **Check Stripe Dashboard:**
   - Go to Stripe Dashboard → Payments
   - Search by payment intent ID or customer email
   - Verify payment status is "Succeeded"
   - Note the `checkout.session.id` from metadata

3. **Check webhook delivery:**
   - Stripe Dashboard → Developers → Webhooks → Recent events
   - Find `checkout.session.completed` event
   - Check delivery status (Success/Failed)
   - View request/response logs

4. **Check backend assurance record:**
   ```bash
   # Query DynamoDB for assurance
   aws dynamodb get-item \
     --table-name safari-index-assurance \
     --key '{"assurance_id": {"S": "asr_XXXXXX"}}' \
     --region eu-central-1
   ```

   Look for:
   - `payment_status`: Should be `completed`
   - `payment_id`: Should match Stripe payment intent

### G.2 Replay Stripe Webhook Safely

If webhook was missed or failed:

1. **Verify idempotency is safe:**
   - Backend `/assurance/{id}/payment` endpoint is idempotent
   - Returns 409 if already processed (safe to retry)

2. **Replay from Stripe:**
   - Stripe Dashboard → Developers → Webhooks
   - Find the failed event
   - Click "Resend" to replay webhook

3. **Manual update (last resort):**
   ```bash
   # Only if Stripe shows successful payment but backend missed it
   curl -X POST \
     "https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1/assurance/{assurance_id}/payment" \
     -H "Content-Type: application/json" \
     -d '{
       "payment_id": "pi_XXXXXX",
       "payment_status": "completed",
       "stripe_session_id": "cs_XXXXXX"
     }'
   ```

### G.3 Where to Find IDs

| ID Type | Location |
|---------|----------|
| `assurance_id` | Footer of `/assurance/{id}` page, Stripe checkout metadata |
| `decision_id` | Footer of decision page, Stripe checkout metadata |
| `payment_id` (Stripe PI) | Stripe Dashboard → Payments, user's receipt email |
| `session_id` | Stripe Dashboard → Checkout Sessions |

### G.4 Common Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Banner shows "Payment processing" | Webhook delayed | User clicks "Refresh status" or waits |
| 402 Payment Required | Webhook never received | Replay webhook from Stripe |
| Banner persists after refresh | Backend didn't update | Check webhook logs, manual update if needed |

---

## Section H: SES Email Configuration

### H.1 Verify Email Identities

For inquiry notifications to work, you must verify email identities in SES:

1. **AWS Console** → SES → Verified identities
2. **Create identity** for sender email (`notifications@safariindex.com`)
3. **Create identity** for operator email (`steve@safariindex.com`)
4. Complete DNS verification (for domain) or click verification link (for email)

### H.2 Move Out of SES Sandbox

By default, SES is in sandbox mode (can only send to verified emails).

To send to any email:

1. **AWS Console** → SES → Account dashboard
2. Click "Request production access"
3. Fill out the form:
   - Mail type: Transactional
   - Use case: Safari trip inquiry notifications
   - Expected sending volume: <100/day
4. Wait for approval (usually 24-48 hours)

### H.3 Set Environment Variables in Amplify

1. **Amplify Console** → App → Hosting → Environment variables
2. Add for both staging and production branches:
   - `OPERATOR_EMAIL`: `steve@safariindex.com`
   - `FROM_EMAIL`: `notifications@safariindex.com`
   - `AWS_REGION`: `us-east-1` (or your SES region)

### H.4 Verify Email Delivery

After configuration:

1. Submit a test inquiry on staging
2. Check CloudWatch logs for the Amplify app
3. Search for `[Inquiry Notification]` messages
4. Verify email arrives at operator inbox

Common issues:
- "OPERATOR_EMAIL not configured" → Add env var in Amplify
- SES SendEmail error → Check SES identity verification
- No email received → Check spam folder, verify SES not in sandbox

---

## What Is NOT Configured Yet

Per governance documents (MVP_FREEZE.md):

- **Custom domains** — Using default `*.amplifyapp.com` and `*.cloudfront.net`
- **Route53** — Deferred until custom domain decision
- **ACM certificates** — Deferred until custom domain
- **WAF** — Cost optimization, can add later
- **Access logs** — Cost optimization, can enable if needed

---

## Quick Reference

| Component | Staging | Production |
|-----------|---------|------------|
| Amplify URL | `staging.{app-id}.amplifyapp.com` | `main.{app-id}.amplifyapp.com` |
| CDN URL | `d3akaqzbxcmb8k.cloudfront.net` | `d7lhxuw5xhnoj.cloudfront.net` |
| App Mode | `build` | `observation` |
| Dev Pages | Enabled | Disabled |

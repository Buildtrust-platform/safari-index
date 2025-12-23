# Safari Index Architecture Snapshot

System architecture overview as of 2025-12-23.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SAFARI INDEX                                    │
│                         Decision Authority Platform                          │
└─────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AWS AMPLIFY HOSTING                               │
│  ┌────────────────────────────┐    ┌────────────────────────────┐           │
│  │   main.{id}.amplifyapp.com │    │ staging.{id}.amplifyapp.com│           │
│  │   NEXT_PUBLIC_APP_MODE=    │    │ NEXT_PUBLIC_APP_MODE=      │           │
│  │         observation        │    │         build              │           │
│  │   (Production - Frozen)    │    │   (Staging - Iterating)    │           │
│  └────────────────────────────┘    └────────────────────────────┘           │
│                                                                              │
│  Build: amplify.yml → npm ci → validate-env → next build                    │
│  Framework: Next.js 16 App Router, SSG + Dynamic routes                     │
└─────────────────────────────────────────────────────────────────────────────┘
                │                                    │
                │ API calls                          │ Static assets
                ▼                                    ▼
┌───────────────────────────┐        ┌───────────────────────────────────────┐
│      API GATEWAY          │        │           CLOUDFRONT CDN              │
│  (REST API, v1 stage)     │        │  ┌─────────────────────────────────┐  │
│                           │        │  │ d7lhxuw5xhnoj.cloudfront.net    │  │
│  POST /decision/evaluate  │        │  │ (Production)                    │  │
│  POST /assurance/generate │        │  ├─────────────────────────────────┤  │
│  GET  /assurance/{id}     │        │  │ d3akaqzbxcmb8k.cloudfront.net   │  │
│  GET  /ops/health         │        │  │ (Staging)                       │  │
│                           │        │  └─────────────────────────────────┘  │
│  Throttle: 100 req/s      │        │                                       │
│  Burst: 200 req/s         │        │  Cache: 365 days (immutable)          │
│                           │        │  Security headers: HSTS, X-Frame, etc │
└───────────────────────────┘        │  Compression: Brotli + Gzip           │
                │                    └───────────────────────────────────────┘
                │                                    │
                ▼                                    │ OAC
┌───────────────────────────┐                       ▼
│   LAMBDA (Node.js 20)     │        ┌───────────────────────────────────────┐
│   Decision Orchestrator   │        │              S3 BUCKET                │
│                           │        │  ┌─────────────────────────────────┐  │
│  - Input validation       │        │  │ safari-index-assets-*           │  │
│  - Bedrock AI invocation  │        │  │ (Block all public access)       │  │
│  - Verdict-or-refusal     │        │  │                                 │  │
│  - DynamoDB persistence   │        │  │ /images/heroes/                 │  │
│  - Event logging          │        │  │ /images/ecosystems/             │  │
│                           │        │  └─────────────────────────────────┘  │
│  Timeout: 60s             │        └───────────────────────────────────────┘
│  Memory: 512MB            │
└───────────────────────────┘
                │
                │ Read/Write
                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DYNAMODB                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   decisions     │  │     events      │  │    reviews      │              │
│  │                 │  │   (immutable)   │  │                 │              │
│  │ PK: decision_id │  │ PK: event_id    │  │ PK: review_id   │              │
│  │ GSI: traveler   │  │ GSI: traveler   │  │ GSI: topic      │              │
│  │ GSI: lead       │  │ GSI: type       │  │ GSI: status     │              │
│  └─────────────────┘  │ GSI: session    │  └─────────────────┘              │
│                       └─────────────────┘                                    │
│  ┌─────────────────┐                                                         │
│  │   assurances    │  All tables: PAY_PER_REQUEST, PITR enabled, RETAIN     │
│  │                 │                                                         │
│  │ PK: assurance_id│                                                         │
│  │ GSI: decision   │                                                         │
│  │ GSI: traveler   │                                                         │
│  └─────────────────┘                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                │
                │ InvokeModel
                ▼
┌───────────────────────────┐
│      AMAZON BEDROCK       │
│                           │
│  Model: Claude 3 Sonnet   │
│  Region: us-east-1        │
└───────────────────────────┘
```

---

## Environment Boundaries

| Environment | App Mode | API | CDN | Purpose |
|-------------|----------|-----|-----|---------|
| Production | `observation` | Production API Gateway | Production CloudFront | Live users, frozen UI |
| Staging | `build` | Staging API Gateway | Staging CloudFront | Feature iteration |
| Development | `build` | Default (prod) | Local paths | Local development |

---

## What Is Used

| Component | Service | Purpose |
|-----------|---------|---------|
| Frontend Hosting | AWS Amplify | Next.js hosting, CI/CD |
| API | API Gateway + Lambda | Decision orchestration |
| Database | DynamoDB | Decisions, events, reviews, assurances |
| AI | Amazon Bedrock | Claude 3 Sonnet for decision reasoning |
| Static Assets | S3 + CloudFront | Hero images, ecosystem imagery |

---

## What Is Intentionally NOT Used Yet

| Component | Why Deferred |
|-----------|--------------|
| Route53 | No custom domain yet |
| ACM Certificates | No custom domain yet |
| WAF | Cost optimization |
| CloudWatch Alarms | Can add when needed |
| Access Logs | Cost optimization |
| Cognito | No user accounts in MVP |
| SES | No email in MVP |

---

## How Custom Domains Will Be Attached Later

When ready to add custom domains (e.g., `safariindex.com`):

### 1. DNS Setup (Route53)

```
safariindex.com           → Amplify distribution
www.safariindex.com       → Redirect to apex
assets.safariindex.com    → CloudFront distribution
api.safariindex.com       → API Gateway (optional)
```

### 2. SSL Certificates (ACM)

- Request certificate in ACM (us-east-1 for CloudFront)
- Validate via DNS (add CNAME to Route53)
- Attach to CloudFront distribution
- Attach to Amplify custom domain

### 3. Amplify Custom Domain

1. Amplify Console → App → Domain management
2. Add domain → Enter `safariindex.com`
3. Follow DNS validation steps
4. Automatic HTTPS via ACM

### 4. CloudFront Alternate Domain

1. CloudFront Console → Distribution → Edit
2. Add alternate domain: `assets.safariindex.com`
3. Select ACM certificate
4. Update Route53 to point to CloudFront

### 5. Update Environment Variables

```
SITE_ORIGIN=https://safariindex.com
NEXT_PUBLIC_ASSETS_CDN_BASE=https://assets.safariindex.com
```

---

## Data Flow

### Decision Request Flow

```
User → Amplify → Next.js Page
         │
         ├─ Client-side fetch() to API_BASE
         │
         ▼
    API Gateway → Lambda (Decision Orchestrator)
                      │
                      ├─ Validate inputs
                      ├─ Check topic exists
                      ├─ Build prompt
                      │
                      ▼
                   Bedrock (Claude)
                      │
                      ├─ Parse AI response
                      ├─ Validate verdict structure
                      │
                      ▼
                   DynamoDB
                      │
                      ├─ Store decision
                      ├─ Log event
                      │
                      ▼
    API Gateway ← Lambda returns response
         │
         ▼
    Next.js renders decision
```

### Asset Loading Flow

```
Next.js ImageBand component
         │
         ├─ getCdnUrl(image.src)
         │
         ├─ NEXT_PUBLIC_ASSETS_CDN_BASE set?
         │      │
         │      ├─ Yes: https://{cdn}/images/...
         │      └─ No:  /images/... (local)
         │
         ▼
    <Image src={cdnUrl} />
         │
         ├─ CloudFront (if CDN)
         │      │
         │      └─ S3 origin (OAC)
         │
         └─ Local public/ (if no CDN)
```

---

## Security Model

| Layer | Protection |
|-------|------------|
| Frontend | HTTPS only, CSP headers |
| API | HTTPS, rate limiting (100/s), CORS |
| Lambda | IAM role, scoped permissions |
| DynamoDB | IAM access only, no public |
| S3 | Block all public access, OAC only |
| CloudFront | HTTPS only, TLS 1.2+, security headers |

---

## Governance Integration

| Document | Enforced By |
|----------|-------------|
| MVP_FREEZE.md | `isBuildMode()` guards, feature gates |
| APP_MODE | `lib/app-mode.ts`, `validate-env.js` |
| Data Model | DynamoDB schema, Lambda validation |
| Decision Doctrine | Lambda orchestrator logic |

---

## File Structure Reference

```
safari-index/
├── frontend/safari-index/     # Next.js application
│   ├── app/                   # App Router pages
│   ├── lib/                   # Utilities
│   │   ├── api-base.ts       # API configuration
│   │   ├── app-mode.ts       # Mode guards
│   │   ├── cdn.ts            # CDN helper
│   │   └── env.ts            # Central env authority
│   └── scripts/              # Build scripts
│
├── infrastructure/            # AWS CDK
│   ├── app.ts                # CDK entry point
│   ├── data-stack.ts         # DynamoDB
│   ├── api-stack.ts          # API Gateway + Lambda
│   └── assets-stack.ts       # S3 + CloudFront
│
├── backend/                   # Lambda functions
│   └── decision-orchestrator/
│
├── docs/                      # Documentation
│   ├── SETUP_RUNBOOK.md      # Deployment guide
│   └── ARCHITECTURE_SNAPSHOT.md  # This file
│
├── scripts/                   # Operator tools
│   ├── print-live-config.sh
│   └── verify-live-surface.sh
│
├── amplify.yml               # Amplify build config
└── _governance/              # Governance documents
```

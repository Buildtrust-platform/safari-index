# Amplify Hosting Setup for Safari Index

This document describes how to set up AWS Amplify Hosting for the Safari Index Next.js frontend.

## Overview

Safari Index uses AWS Amplify Hosting with two environments:
- **Production** (`main` branch): Observation mode - public-facing, read-only decision pages
- **Staging** (`staging` branch): Build mode - full feature set for testing and development

Both environments use Amplify's default `*.amplifyapp.com` domain (no custom domain yet).

---

## Prerequisites

- AWS Account with Amplify access
- GitHub repository access (safari-index repo)
- API Gateway endpoint URL from CDK deployment

---

## Step 1: Connect GitHub Repository

1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Select **"GitHub"** as the source provider
4. Click **"Connect"** and authorize AWS Amplify to access your GitHub account
5. Select the **safari-index** repository
6. Select the **main** branch for initial setup
7. Click **"Next"**

---

## Step 2: Configure Build Settings

Amplify will auto-detect Next.js. Override with this `amplify.yml`:

### amplify.yml

Create this file in the repository root:

```yaml
version: 1
applications:
  - appRoot: frontend/safari-index
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
```

### Build Image Settings

In Amplify Console → App settings → Build settings:
- Build image: `Amazon Linux 2023`
- Node.js version: `20`

---

## Step 3: Environment Variables

### Production Environment (main branch)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_MODE` | `observation` | Read-only mode, no staging features |
| `NEXT_PUBLIC_API_BASE` | `https://<api-id>.execute-api.<region>.amazonaws.com/v1` | Production API Gateway URL |

### Staging Environment (staging branch)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_MODE` | `build` | Full feature set, staging pages visible |
| `NEXT_PUBLIC_API_BASE` | `https://<staging-api-id>.execute-api.<region>.amazonaws.com/v1` | Staging API Gateway URL |
| `ENABLE_DEV_PAGES` | `true` | Enable /dev/* routes |

### Setting Environment Variables

1. Go to Amplify Console → Your App → **Hosting** → **Environment variables**
2. Click **"Manage variables"**
3. Add each variable with the appropriate value
4. For branch-specific overrides:
   - Click **"Actions"** → **"Add variable override"**
   - Select the branch and set the override value

---

## Step 4: Add Staging Branch

1. In Amplify Console, go to **Hosting** → **Branches**
2. Click **"Connect branch"**
3. Select the **staging** branch
4. Environment variables will inherit from app-level, with overrides applied
5. Click **"Save and deploy"**

---

## Step 5: Configure Branch Settings

### Production Branch (main)

1. Go to **Hosting** → **Branches** → **main** → **Edit**
2. Set:
   - **Branch name**: main
   - **Stage**: Production
   - **Pull request previews**: Disabled (optional)

### Staging Branch (staging)

1. Go to **Hosting** → **Branches** → **staging** → **Edit**
2. Set:
   - **Branch name**: staging
   - **Stage**: Development
   - **Pull request previews**: Enabled (optional)

---

## Step 6: Verify Deployment

### Production Verification Checklist

After deployment completes, verify these URLs work:

```bash
# Get the Amplify domain from console (e.g., main.d1abc123xyz.amplifyapp.com)
PROD_DOMAIN="main.<app-id>.amplifyapp.com"

# Homepage loads
curl -s -o /dev/null -w "%{http_code}" "https://${PROD_DOMAIN}/"
# Expected: 200

# How it works page (should 404 in observation mode)
curl -s -o /dev/null -w "%{http_code}" "https://${PROD_DOMAIN}/how-it-works"
# Expected: 404

# Decision page loads
curl -s -o /dev/null -w "%{http_code}" "https://${PROD_DOMAIN}/decisions/when-to-visit-serengeti"
# Expected: 200

# API calls succeed (check browser console)
# Open https://${PROD_DOMAIN}/decisions/when-to-visit-serengeti
# Verify no CORS errors, decision loads
```

### Staging Verification Checklist

```bash
STAGING_DOMAIN="staging.<app-id>.amplifyapp.com"

# Homepage loads
curl -s -o /dev/null -w "%{http_code}" "https://${STAGING_DOMAIN}/"
# Expected: 200

# How it works page (visible in build mode)
curl -s -o /dev/null -w "%{http_code}" "https://${STAGING_DOMAIN}/how-it-works"
# Expected: 200

# Explore page (staging only)
curl -s -o /dev/null -w "%{http_code}" "https://${STAGING_DOMAIN}/explore"
# Expected: 200

# Compare page (staging only)
curl -s -o /dev/null -w "%{http_code}" "https://${STAGING_DOMAIN}/compare"
# Expected: 200

# Dev components page (staging only with ENABLE_DEV_PAGES)
curl -s -o /dev/null -w "%{http_code}" "https://${STAGING_DOMAIN}/dev/components"
# Expected: 200
```

---

## Deployment Workflow

### Automatic Deployments

- **Push to `main`**: Triggers production deployment
- **Push to `staging`**: Triggers staging deployment

### Manual Deployments

1. Go to Amplify Console → Your App → **Hosting**
2. Click the branch you want to deploy
3. Click **"Redeploy this version"** or trigger a new build

---

## Troubleshooting

### Build Fails with "Module not found"

Ensure `appRoot` in `amplify.yml` points to `frontend/safari-index`.

### API Calls Fail with CORS Error

1. Verify `NEXT_PUBLIC_API_BASE` is set correctly
2. Check API Gateway CORS configuration allows the Amplify domain
3. Ensure the API Gateway stage is deployed

### Pages Return 404

1. Check `NEXT_PUBLIC_APP_MODE` is set correctly for the branch
2. For staging pages, ensure `ENABLE_DEV_PAGES=true` is set
3. Verify the page exists and is not gated by `isBuildMode()`

### Slow Build Times

1. Enable caching in `amplify.yml` (already configured above)
2. Consider using `npm ci` instead of `npm install`

---

## Custom Domain (Future)

When a custom domain is finalized, follow these steps:

1. Go to Amplify Console → Your App → **Hosting** → **Custom domains**
2. Click **"Add domain"**
3. Enter your domain name (e.g., `safariindex.com`)
4. Amplify will:
   - Request an SSL certificate via ACM
   - Provide DNS records to add to your DNS provider
5. Add the DNS records:
   - CNAME for `www.safariindex.com` → Amplify domain
   - CNAME for SSL validation
6. Wait for DNS propagation and SSL certificate validation
7. Configure subdomain routing:
   - `safariindex.com` → main branch
   - `staging.safariindex.com` → staging branch

**Note**: Custom domain setup requires Route53 or external DNS provider configuration. This is deferred until the domain name is finalized.

---

## Cost Considerations

- Amplify Hosting: Pay per build minute + hosting (bandwidth)
- Free tier: 1000 build minutes/month, 15 GB served/month
- No additional WAF or CloudFront charges (included in Amplify)

---

## Related Documentation

- [AWS Amplify Hosting Docs](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html)
- [MVP_FREEZE.md](./_governance/execution/MVP_FREEZE.md) - What can/cannot be changed

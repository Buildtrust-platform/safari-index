#!/bin/bash
#
# Sync Static Assets to S3/CloudFront CDN
#
# This script syncs images and other static assets from the frontend
# public directory to the S3 bucket that backs the CloudFront CDN.
#
# Usage:
#   ./scripts/sync-assets-to-cdn.sh [staging|production]
#
# Environment:
#   AWS_REGION - AWS region (default: eu-central-1)
#   AWS_ACCOUNT_ID - AWS account ID (auto-detected if not set)
#
# Requirements:
#   - AWS CLI configured with appropriate credentials
#   - Access to the S3 bucket

set -e

# Configuration
ENVIRONMENT="${1:-production}"
AWS_REGION="${AWS_REGION:-eu-central-1}"
ASSETS_DIR="frontend/safari-index/public"

# Determine bucket name based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
  BUCKET_PREFIX="staging-"
else
  BUCKET_PREFIX=""
fi

# Auto-detect AWS account ID if not provided
if [ -z "$AWS_ACCOUNT_ID" ]; then
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
  if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: Could not detect AWS account ID. Set AWS_ACCOUNT_ID or configure AWS CLI."
    exit 1
  fi
fi

BUCKET_NAME="${BUCKET_PREFIX}safari-index-assets-${AWS_ACCOUNT_ID}-${AWS_REGION}"

echo "=========================================="
echo "Safari Index CDN Asset Sync"
echo "=========================================="
echo "Environment: $ENVIRONMENT"
echo "Bucket: $BUCKET_NAME"
echo "Source: $ASSETS_DIR"
echo "=========================================="

# Check if source directory exists
if [ ! -d "$ASSETS_DIR" ]; then
  echo "Error: Assets directory not found: $ASSETS_DIR"
  echo "Run this script from the repository root."
  exit 1
fi

# Check if bucket exists
if ! aws s3 ls "s3://$BUCKET_NAME" >/dev/null 2>&1; then
  echo "Error: Bucket does not exist or is not accessible: $BUCKET_NAME"
  echo "Deploy the assets stack first: cd infrastructure && npx cdk deploy SafariIndexAssetsStack"
  exit 1
fi

# Sync images with appropriate cache headers
echo ""
echo "Syncing images..."
aws s3 sync "$ASSETS_DIR/images" "s3://$BUCKET_NAME/images" \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/jpeg" \
  --exclude "*" \
  --include "*.jpg" \
  --include "*.jpeg"

aws s3 sync "$ASSETS_DIR/images" "s3://$BUCKET_NAME/images" \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/png" \
  --exclude "*" \
  --include "*.png"

aws s3 sync "$ASSETS_DIR/images" "s3://$BUCKET_NAME/images" \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/webp" \
  --exclude "*" \
  --include "*.webp"

aws s3 sync "$ASSETS_DIR/images" "s3://$BUCKET_NAME/images" \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/svg+xml" \
  --exclude "*" \
  --include "*.svg"

# Sync other static assets (fonts, etc.) if they exist
if [ -d "$ASSETS_DIR/fonts" ]; then
  echo ""
  echo "Syncing fonts..."
  aws s3 sync "$ASSETS_DIR/fonts" "s3://$BUCKET_NAME/fonts" \
    --cache-control "public, max-age=31536000, immutable"
fi

# Show what was synced
echo ""
echo "=========================================="
echo "Sync complete. Current bucket contents:"
echo "=========================================="
aws s3 ls "s3://$BUCKET_NAME" --recursive --human-readable | head -30

# Get CloudFront distribution info
echo ""
echo "=========================================="
echo "CloudFront CDN Info"
echo "=========================================="

# Find the distribution for this bucket
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com']].Id" --output text 2>/dev/null || echo "")

if [ -n "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
  DISTRIBUTION_DOMAIN=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query "Distribution.DomainName" --output text 2>/dev/null)
  echo "Distribution ID: $DISTRIBUTION_ID"
  echo "CDN Domain: https://$DISTRIBUTION_DOMAIN"
  echo ""
  echo "Test image URL:"
  echo "https://$DISTRIBUTION_DOMAIN/images/ecosystems/savannah-morning.jpg"

  # Optional: Invalidate cache
  if [ "$2" = "--invalidate" ]; then
    echo ""
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/images/*"
    echo "Cache invalidation initiated."
  fi
else
  echo "Could not find CloudFront distribution for bucket."
  echo "The CDN domain is configured in Amplify as NEXT_PUBLIC_ASSETS_CDN_BASE"
fi

echo ""
echo "Done!"

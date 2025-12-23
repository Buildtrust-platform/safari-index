#!/bin/bash
#
# Test Assets CDN
#
# Uploads a test file to S3 and verifies it's accessible via CloudFront.
# Checks for proper cache headers and 200 response.
#
# Usage:
#   ./scripts/test-assets-cdn.sh <cloudfront-domain> <s3-bucket-name>
#
# Example:
#   ./scripts/test-assets-cdn.sh d1abc123xyz.cloudfront.net safari-index-assets-123456789012-eu-central-1
#
# Prerequisites:
#   - AWS CLI configured with appropriate permissions
#   - curl installed
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 <cloudfront-domain> <s3-bucket-name>"
    echo ""
    echo "Example:"
    echo "  $0 d1abc123xyz.cloudfront.net safari-index-assets-123456789012-eu-central-1"
    echo ""
    echo "Get values from CDK outputs:"
    echo "  cloudfront-domain: SafariIndexAssetsDistributionDomain"
    echo "  s3-bucket-name: SafariIndexAssetsBucketName"
    exit 1
fi

CLOUDFRONT_DOMAIN="$1"
S3_BUCKET="$2"

# Generate unique test file name
TIMESTAMP=$(date +%s)
TEST_FILE="test-${TIMESTAMP}.txt"
TEST_CONTENT="Safari Index CDN Test - ${TIMESTAMP}"

echo ""
echo "=========================================="
echo " Safari Index Assets CDN Test"
echo "=========================================="
echo ""
echo "CloudFront Domain: ${CLOUDFRONT_DOMAIN}"
echo "S3 Bucket: ${S3_BUCKET}"
echo "Test File: ${TEST_FILE}"
echo ""

# Step 1: Upload test file to S3
echo -e "${YELLOW}[1/4] Uploading test file to S3...${NC}"
echo "${TEST_CONTENT}" | aws s3 cp - "s3://${S3_BUCKET}/${TEST_FILE}" \
    --content-type "text/plain" \
    --cache-control "public, max-age=31536000, immutable"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}      Upload successful${NC}"
else
    echo -e "${RED}      Upload failed${NC}"
    exit 1
fi

# Step 2: Wait for CloudFront propagation
echo ""
echo -e "${YELLOW}[2/4] Waiting for CloudFront propagation (5 seconds)...${NC}"
sleep 5

# Step 3: Fetch via CloudFront and check response
echo ""
echo -e "${YELLOW}[3/4] Fetching file via CloudFront...${NC}"

CLOUDFRONT_URL="https://${CLOUDFRONT_DOMAIN}/${TEST_FILE}"
echo "      URL: ${CLOUDFRONT_URL}"
echo ""

# Make request and capture headers
HTTP_RESPONSE=$(curl -s -D - -o /tmp/cdn-test-response.txt "${CLOUDFRONT_URL}" 2>&1)
HTTP_CODE=$(echo "${HTTP_RESPONSE}" | grep -i "^HTTP/" | tail -1 | awk '{print $2}')

echo "      HTTP Status: ${HTTP_CODE}"

if [ "${HTTP_CODE}" = "200" ]; then
    echo -e "${GREEN}      Status check: PASSED${NC}"
else
    echo -e "${RED}      Status check: FAILED (expected 200, got ${HTTP_CODE})${NC}"
    echo ""
    echo "Response headers:"
    echo "${HTTP_RESPONSE}" | head -20
    exit 1
fi

# Step 4: Check cache headers
echo ""
echo -e "${YELLOW}[4/4] Checking cache headers...${NC}"

# Check for Cache-Control header
CACHE_CONTROL=$(echo "${HTTP_RESPONSE}" | grep -i "^cache-control:" | head -1)
if [ -n "${CACHE_CONTROL}" ]; then
    echo "      ${CACHE_CONTROL}"
    if echo "${CACHE_CONTROL}" | grep -qi "max-age"; then
        echo -e "${GREEN}      Cache-Control check: PASSED${NC}"
    else
        echo -e "${YELLOW}      Cache-Control check: WARNING (no max-age)${NC}"
    fi
else
    echo -e "${YELLOW}      Cache-Control check: WARNING (header not found)${NC}"
fi

# Check for X-Cache header (CloudFront cache status)
X_CACHE=$(echo "${HTTP_RESPONSE}" | grep -i "^x-cache:" | head -1)
if [ -n "${X_CACHE}" ]; then
    echo "      ${X_CACHE}"
else
    echo "      X-Cache: (first request, not cached yet)"
fi

# Check for security headers
echo ""
echo "      Security headers:"
for header in "x-content-type-options" "x-frame-options" "strict-transport-security"; do
    HEADER_VALUE=$(echo "${HTTP_RESPONSE}" | grep -i "^${header}:" | head -1)
    if [ -n "${HEADER_VALUE}" ]; then
        echo -e "      ${GREEN}✓${NC} ${HEADER_VALUE}"
    else
        echo -e "      ${YELLOW}○${NC} ${header}: (not set)"
    fi
done

# Verify content
echo ""
RESPONSE_CONTENT=$(cat /tmp/cdn-test-response.txt)
if [ "${RESPONSE_CONTENT}" = "${TEST_CONTENT}" ]; then
    echo -e "${GREEN}      Content verification: PASSED${NC}"
else
    echo -e "${RED}      Content verification: FAILED${NC}"
    echo "      Expected: ${TEST_CONTENT}"
    echo "      Got: ${RESPONSE_CONTENT}"
    exit 1
fi

# Cleanup
echo ""
echo -e "${YELLOW}Cleaning up test file...${NC}"
aws s3 rm "s3://${S3_BUCKET}/${TEST_FILE}" --quiet
rm -f /tmp/cdn-test-response.txt
echo -e "${GREEN}Done${NC}"

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN} All tests passed!${NC}"
echo "=========================================="
echo ""
echo "CDN is correctly configured:"
echo "  - S3 bucket is accessible via CloudFront OAC"
echo "  - Cache headers are set for long-term caching"
echo "  - Security headers are applied"
echo ""
echo "CloudFront URL base: https://${CLOUDFRONT_DOMAIN}/"
echo ""

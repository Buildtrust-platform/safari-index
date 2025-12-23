#!/bin/bash
#
# Print Live Configuration
#
# Displays current environment configuration for debugging deployments.
# Run locally or on deployed environments to verify settings.
#
# Usage:
#   ./scripts/print-live-config.sh
#

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Safari Index Live Configuration                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Environment
echo "ENVIRONMENT"
echo "─────────────────────────────────────────────────────────────────"
echo "NODE_ENV:                 ${NODE_ENV:-(not set, defaults to development)}"
echo "ENV_NAME:                 ${ENV_NAME:-(not set)}"
echo ""

# App Mode
echo "APP MODE"
echo "─────────────────────────────────────────────────────────────────"
echo "NEXT_PUBLIC_APP_MODE:     ${NEXT_PUBLIC_APP_MODE:-(not set, defaults to observation)}"
if [ "$NEXT_PUBLIC_APP_MODE" = "observation" ]; then
  echo "                          🔒 Production (frozen)"
elif [ "$NEXT_PUBLIC_APP_MODE" = "build" ]; then
  echo "                          🔧 Staging (iterating)"
else
  echo "                          ⚠️  Unknown mode"
fi
echo ""

# API Configuration
echo "API CONFIGURATION"
echo "─────────────────────────────────────────────────────────────────"
echo "NEXT_PUBLIC_API_BASE:     ${NEXT_PUBLIC_API_BASE:-(not set, using default)}"
echo ""

# CDN Configuration
echo "CDN CONFIGURATION"
echo "─────────────────────────────────────────────────────────────────"
echo "NEXT_PUBLIC_ASSETS_CDN_BASE: ${NEXT_PUBLIC_ASSETS_CDN_BASE:-(not set, using local paths)}"
echo ""

# Other
echo "OTHER"
echo "─────────────────────────────────────────────────────────────────"
echo "SITE_ORIGIN:              ${SITE_ORIGIN:-(not set, defaults to safariindex.com)}"
echo "ENABLE_DEV_PAGES:         ${ENABLE_DEV_PAGES:-(not set, dev pages disabled)}"
echo ""

# Known Values Reference
echo "KNOWN DEPLOYED VALUES"
echo "─────────────────────────────────────────────────────────────────"
echo "Production API:           https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1"
echo "Production CDN:           https://d7lhxuw5xhnoj.cloudfront.net"
echo "Staging CDN:              https://d3akaqzbxcmb8k.cloudfront.net"
echo ""

#!/bin/bash
#
# Safari Index Build Protection
# Validates APP_MODE matches expected deployment target
#
# Usage:
#   ./scripts/check-app-mode.sh observation  # For production builds
#   ./scripts/check-app-mode.sh build        # For staging builds
#
# Per STAGING_DEPLOY.md: Prevents accidental wrong deployments

set -e

EXPECTED_MODE="$1"

if [ -z "$EXPECTED_MODE" ]; then
  echo "Error: Expected mode not specified"
  echo "Usage: $0 <observation|build>"
  exit 1
fi

if [ "$EXPECTED_MODE" != "observation" ] && [ "$EXPECTED_MODE" != "build" ]; then
  echo "Error: Invalid mode '$EXPECTED_MODE'"
  echo "Valid modes: observation, build"
  exit 1
fi

# Check NEXT_PUBLIC_APP_MODE first, then APP_MODE
ACTUAL_MODE="${NEXT_PUBLIC_APP_MODE:-${APP_MODE:-observation}}"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "=========================================="
echo "Safari Index Build Protection Check"
echo "=========================================="
echo ""
echo "Expected mode: ${EXPECTED_MODE}"
echo "Actual mode:   ${ACTUAL_MODE}"
echo ""

if [ "$ACTUAL_MODE" != "$EXPECTED_MODE" ]; then
  echo -e "${RED}BUILD BLOCKED${NC}"
  echo ""
  echo "APP_MODE mismatch detected!"
  echo ""
  if [ "$EXPECTED_MODE" = "observation" ]; then
    echo "You are trying to build for PRODUCTION but APP_MODE is not 'observation'."
    echo ""
    echo "To fix, set the correct environment variable:"
    echo "  export NEXT_PUBLIC_APP_MODE=observation"
    echo "  # or"
    echo "  export APP_MODE=observation"
  else
    echo "You are trying to build for STAGING but APP_MODE is not 'build'."
    echo ""
    echo "To fix, set the correct environment variable:"
    echo "  export NEXT_PUBLIC_APP_MODE=build"
    echo "  # or"
    echo "  export APP_MODE=build"
  fi
  echo ""
  echo "This check prevents deploying staging code to production or vice versa."
  exit 1
fi

echo -e "${GREEN}BUILD ALLOWED${NC}"
echo ""
echo "APP_MODE is correctly set to '${ACTUAL_MODE}'."
echo "Proceeding with build..."
echo ""

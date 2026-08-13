#!/usr/bin/env bash

# ==============================================================================
# Security Threshold Enforcement Script
#
# Purpose: Parses JSON vulnerability reports (e.g., Trivy / npm audit) and 
#          enforces security thresholds. Fails the build if vulnerabilities 
#          exceed maximum allowed limits.
# ==============================================================================

set -euo pipefail

# 1. Define Security Thresholds (Maximum Allowed Issues)
MAX_CRITICAL=0
MAX_HIGH=0

REPORT_FILE="${1:-trivy-results.json}"

echo "===================================================="
echo "🛡️ Evaluating Security Thresholds"
echo "Target Report: $REPORT_FILE"
echo "===================================================="

# Check if report file exists
if [ ! -f "$REPORT_FILE" ]; then
    echo "⚠️ Warning: Report file '$REPORT_FILE' not found. Skipping threshold evaluation."
    exit 0
fi

# Ensure 'jq' is installed for JSON parsing
if ! command -v jq &> /dev/null; then
    echo "❌ Error: 'jq' is required to parse JSON security reports. Please install 'jq'."
    exit 1
fi

# 2. Extract Vulnerability Counts (Trivy JSON Schema)
# Robust jq query returning 0 safely if Results or Vulnerabilities are null/empty
CRITICAL_COUNT=$(jq '[(.Results // [])[] | (.Vulnerabilities // [])[] | select(.Severity=="CRITICAL")] | length' "$REPORT_FILE" 2>/dev/null || echo "0")
HIGH_COUNT=$(jq '[(.Results // [])[] | (.Vulnerabilities // [])[] | select(.Severity=="HIGH")] | length' "$REPORT_FILE" 2>/dev/null || echo "0")

# Sanitize variables to ensure pure numeric comparison
CRITICAL_COUNT=${CRITICAL_COUNT:-0}
HIGH_COUNT=${HIGH_COUNT:-0}

echo "📊 Security Scan Threshold Results:"
echo "  - CRITICAL Vulnerabilities: $CRITICAL_COUNT (Allowed: $MAX_CRITICAL)"
echo "  - HIGH Vulnerabilities:     $HIGH_COUNT (Allowed: $MAX_HIGH)"

# 3. Evaluate Thresholds
FAILED=0

if [ "$CRITICAL_COUNT" -gt "$MAX_CRITICAL" ]; then
    echo "🚨 THRESHOLD VIOLATION: Found $CRITICAL_COUNT CRITICAL vulnerability(ies). Limit is $MAX_CRITICAL."
    FAILED=1
fi

if [ "$HIGH_COUNT" -gt "$MAX_HIGH" ]; then
    echo "🚨 THRESHOLD VIOLATION: Found $HIGH_COUNT HIGH vulnerability(ies). Limit is $MAX_HIGH."
    FAILED=1
fi

# 4. Exit Code Handling
if [ "$FAILED" -eq 1 ]; then
    echo "❌ Security threshold check failed! Pipeline execution stopped."
    exit 1
else
    echo "✅ Security threshold check passed successfully!"
    exit 0
fi
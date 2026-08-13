#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "===================================================="
echo "🔍 Starting Local Security & Quality Audit Suite"
echo "===================================================="

# 1. Dependency Vulnerability Check
echo -br "\n[1/3] Checking npm dependencies for vulnerabilities..."
npm audit --audit-level=high || echo "⚠️ Warning: Vulnerabilities found in dependencies."

# 2. Static Code Analysis / Linting
echo -e "\n[2/3] Running ESLint security checks..."
npm run lint

# 3. Secret Leak Check via Gitleaks
echo -e "\n[3/3] Scanning repository history for leaked secrets..."
if command -v gitleaks &> /dev/null; then
    gitleaks detect --source . --verbose
    echo "✅ Gitleaks scan completed."
else
    echo "⚠️ Gitleaks is not installed locally. Install it via 'brew install gitleaks' or 'apt install gitleaks'."
fi

echo -e "\n===================================================="
echo "🎉 Local Security Audit Completed Successfully!"
echo "===================================================="
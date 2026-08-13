# Quality Gates Architecture

## Overview

A **Quality Gate** is an automated policy enforcer in the CI/CD pipeline that prevents substandard, insecure, or untested code from progressing toward deployment.

## Pipeline Order & Execution Logic

| Stage | Trigger Step | Tool / Package | Execution Purpose | Failure Condition (Pipeline Stop) |
| :--- | :--- | :--- | :--- | :--- |
| **01. Pre-Build** | Code Commit / Pull Request | `Gitleaks`, `ESLint` | Detect hardcoded API keys, secrets, and insecure client-side storage (e.g., `localStorage`). | Any detected credential leak or severe lint error. |
| **02. Build** | Post-Compile | `SonarQube`, `npm audit` | Analyze code quality, code coverage, and vulnerable package dependencies. | Code coverage < 80% or open `CRITICAL` / `HIGH` vulnerabilities. |
| **03. Packaging** | Post-Docker Build | `Trivy` (Aqua Security) | Scan base OS image and system binaries inside the container. | Presence of any unpatched `CRITICAL` CVE. |
| **04. Staging** | Post-Deployment (Staging) | `OWASP ZAP`, `Playwright` | Conduct Dynamic Application Security Testing (DAST) and E2E regression testing. | Failed E2E journeys or high-risk OWASP Top 10 vulnerabilities. |

## Implementation Rules

1. **No Test, No Merge:** Code commits without corresponding unit test updates are blocked by branch protection rules.
2. **Transparent Coverage:** Code coverage metrics must be exported to SonarQube dashboards on every Pull Request.
3. **Dummy Data Enforcement:** Never use production or sensitive personal data in test environments. Use synthetic XML/JSON mock generators.
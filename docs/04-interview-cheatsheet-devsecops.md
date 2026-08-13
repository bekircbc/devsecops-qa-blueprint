# Interview Talking Points & DevSecOps Strategy

Use these concise points during technical interviews to communicate senior-level DevSecOps and QA ownership.

## Key Interview Script Quotes

> **On Container Security:**  
> *"We execute Trivy scans immediately after the container build step. If any CRITICAL OS-level CVE is detected, the pipeline halts with exit code 1 before the container image reaches the private registry."*

> **On SAST & Secret Detection:**  
> *"To ensure sensitive credentials never enter git history, we run Gitleaks during the pre-build pipeline stage. In parallel, ESLint security rules and SonarQube flag any improper client-side token storage in LocalStorage."*

> **On OWASP & DAST:**  
> *"In staging, we combine Playwright E2E automation with OWASP ZAP container runs. Playwright executes functional journeys while OWASP ZAP probes endpoints for Injection and XSS vulnerabilities."*
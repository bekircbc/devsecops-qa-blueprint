# Enterprise DevSecOps & QA Pipeline Blueprint

This repository serves as a production-grade blueprint for integrating **DevSecOps**, **Quality Assurance (QA)**, and **Quality Gates** into modern CI/CD automation pipelines (GitHub Actions / GitLab CI).

## Pipeline Flow Architecture

```text
[Code Commit] ──► [Static Analysis & Secrets] ──► [Dependency Scan] ──► [Container Scan] ──► [DAST & E2E] ──► [Production Deployment]
```

## Core Security and Quality

### Shift-Left Security: 

Catching hardcoded secrets and OWASP Top 10 vulnerabilities during the code commit and static analysis phases.

### Container Hygiene

Scanning Docker images at the OS and package level before pushing to registries.

### Automated Quality Gates

Enforcing mandatory test pass rates, minimum coverage, and zero critical vulnerabilities before merging.

### Inclusive UX 

Enforcing Accessibility (A11y/BITV) and Storybook UI design system integrity.

## Setting up Trivy manually and running Trivy in repo mode

```    name: Build
    runs-on: ubuntu-24.04
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Manual Trivy Setup
      uses: aquasecurity/setup-trivy@v0.2.0
      with:
        cache: true
        version: v0.73.0

   - name: Run Trivy vulnerability scanner in repo mode
      uses: aquasecurity/trivy-action@v0.36.0
      with:
        scan-type: 'fs'
        ignore-unfixed: true
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL'
        skip-setup-trivy: true} 
```
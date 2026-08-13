# Testing Strategy & Accessibility (A11y) Standards

This document defines the Quality Assurance (QA) strategy and Accessibility compliance standards integrated into our continuous delivery pipeline.

---

## 1. Multi-Layered Testing Strategy

To balance speed and confidence, automated testing is divided into three distinct execution layers:

| Layer | Scope / Focus | Primary Framework | Pipeline Execution Point |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Pure business logic, utilities, DMN/Camunda rules | `Jest` / `Vitest` | Pre-Build (`01-static-analysis.yml`) |
| **Component / UI** | Isolated UI components & Design Systems | `Storybook` + `Test Runner` | Build Phase |
| **End-to-End (E2E)** | Critical user journeys & integration points | `Playwright` | Post-Deployment / Staging (`04-dast-and-e2e.yml`) |

---

## 2. Accessibility Compliance (A11y / BITV 2.0 / WCAG 2.1)

In European public sector and enterprise applications, compliance with accessibility guidelines (WCAG 2.1 Level AA / BITV 2.0) is mandatory.

### Automated Accessibility Testing
1. **Storybook A11y Addon:** Integrated directly into UI component development to detect missing ARIA labels, insufficient contrast, and keyboard navigation flaws at design time.
2. **Playwright + `@axe-core/playwright`:** Executed during E2E testing to scan dynamically rendered pages for DOM accessibility violations before reaching production.

```typescript
// Example: Playwright A11y Test Snippet (using official @axe-core/playwright)
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Screen accessibility check', async ({ page }) => {
  await page.goto('https://staging.example.com/form');

  // Run the accessibility scan using official Deque AxeBuilder
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  // Assert that zero accessibility violations were found
  expect(accessibilityScanResults.violations).toEqual([]);
});
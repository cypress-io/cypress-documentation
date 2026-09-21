# Agent rules: API reference pages

The root [`AGENTS.md`](../../AGENTS.md) still applies; this file adds the rules
specific to `docs/api/` (commands, `Cypress.*` APIs, node events, utilities).
Reasoning and examples live in
[`AGENTS_REFERENCE.md`](../../AGENTS_REFERENCE.md).

## Source of truth

These pages describe behavior implemented in `cypress-io/cypress`. Read that
source before writing or changing a behavior claim: `npm run api:source -- blur`
resolves a command to the files that define it. What each section is answerable
from, and why a conflict gets flagged rather than written away, is in
[`AGENTS_REFERENCE.md`](../../AGENTS_REFERENCE.md#api-source-of-truth).

## Frontmatter

Reference frontmatter is terse. Mirror the sibling file you're adding next to.

```yaml
---
title: 'cy.click()'
description: Click a DOM element in Cypress.
sidebar_label: click
slug: /api/commands/click
---
```

- `title`: the symbol as a reader writes it in code (`'cy.click()'`,
  `'Cypress.Promise()'`, `'before:spec event'`). Never append a suffix. Every
  page under `/api` gets ` | Cypress API Documentation` at build time from
  `src/sectionTitles.js`, asserted by `cypress/e2e/page_titles.cy.ts`.
- `description`: one sentence saying what the command does.
- `sidebar_label`: the bare name, no `cy.` prefix, no parentheses.
- `slug`: only where the siblings carry one. It repeats the file's own route, so
  `docs/api/cypress-api/` omits it entirely.
- The H1 is the bare name (`# click`), not the title.

## Page skeleton

`<ProductHeading product="app" />` goes above the H1. Then these sections, in
this order, using only the ones the page needs:

| Section          | Contents                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `## Syntax`      | signatures in a `javascript` block, then `### Usage` (correct/incorrect), `### Arguments`, `<HeaderYields />` |
| `## Examples`    | grouped under `###` by argument shape                                                                         |
| `## Notes`       | behavior worth calling out                                                                                    |
| `## Rules`       | `<HeaderRequirements />`, `<HeaderAssertions />`, `<HeaderTimeouts />`, each followed by bullets              |
| `## Command Log` | a snippet, the rendered log as `<DocsImage>`, then the console output                                         |
| `## History`     | version table, newest first                                                                                   |
| `## See also`    | 2 to 5 sibling commands                                                                                       |

Never hand-write the `Yields`, `Requirements`, `Assertions`, or `Timeouts`
headings. The four `Header*` partials render them,
`src/theme/MDXComponents.js` registers them globally so they take no import, and
each carries the anchor other pages link to (`{#Yields}`, `{#Requirements}`,
`{#Assertions}`, `{#Timeouts}`). Hand-writing one drops its anchor and breaks
every inbound link to it.

## History tables

Newest version first, each version linking its changelog anchor:

```markdown
| Version                                  | Changes                       |
| ---------------------------------------- | ----------------------------- |
| [6.1.0](/app/references/changelog#6-1-0) | Added option `scrollBehavior` |
```

Add a row whenever a release changes documented behavior, and add the matching
changelog entry in the same PR (see `docs/app/releases/AGENTS.md`).

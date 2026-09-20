# Agent rules: API reference pages

The root [`AGENTS.md`](../../AGENTS.md) still applies; this file adds the rules
specific to `docs/api/` (commands, `Cypress.*` APIs, node events, utilities).
Reasoning and examples live in
[`AGENTS_REFERENCE.md`](../../AGENTS_REFERENCE.md#api-reference-pages).

## Source of truth

These pages describe behavior implemented in `cypress-io/cypress`. Read that
source before writing or changing a behavior claim: `npm run api:source -- blur`
resolves a command to the files that define it. What each section is answerable
from, and why a conflict gets flagged rather than written away, is in
[`AGENTS_REFERENCE.md`](../../AGENTS_REFERENCE.md#api-source-of-truth).

## Frontmatter

Terse, and mirrors the sibling file you're adding next to:

```yaml
---
title: 'cy.click()'
description: Click a DOM element in Cypress.
sidebar_label: click
slug: /api/commands/click
---
```

`title` is the symbol as a reader writes it in code (`'Cypress.Promise()'`,
`'before:spec event'`) and never carries a suffix. `description` is one sentence
saying what the command does. `sidebar_label` is the bare name, no `cy.` prefix
and no parentheses. `slug` appears only where the siblings carry one, so
`docs/api/cypress-api/` omits it. The H1 is the bare name (`# click`).

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
headings. The `Header*` partials own them and the anchors other pages link to
([details](../../AGENTS_REFERENCE.md#the-header-partials)).

## History tables

Newest version first, each version linking its changelog anchor
([format](../../AGENTS_REFERENCE.md#history-tables)). Add a row whenever a
release changes documented behavior, and add the matching changelog entry in the
same PR (see `docs/app/releases/AGENTS.md`).

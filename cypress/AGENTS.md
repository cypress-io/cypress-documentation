# Agent rules: end-to-end tests

The root [`AGENTS.md`](../AGENTS.md) still applies; this file adds the rules
specific to `cypress/`. Where the suite sits in the verify ladder, and what CI
runs, is in [`AGENTS_REFERENCE.md`](../AGENTS_REFERENCE.md#testing).

## The page list is generated

`setupNodeEvents` in [`cypress.config.ts`](../cypress.config.ts) walks `docs/`
at startup and hands every published route to the specs as
`Cypress.expose('URLs')`. **Adding a page needs no change in here.** It is
crawled the next time the suite runs.

The walker skips `partials/`, `_category_.json`, and anything that is not
`.mdx`, and it derives a route from the file's path on disk. Frontmatter
overrides that in one case only:

- An **absolute** `slug`, one starting with `/`, wins over the file's location.
- A **relative** `slug` does not. The walker falls back to the path, so a page
  that publishes somewhere other than where it sits is visited at the wrong URL
  and fails as `Page Not Found`. The `lodash` page is the one that does this
  today and the walker hard-codes its `_` route; a second such page needs the
  walker taught about it.

## Visiting every page

The `all_*_pages.cy.ts` specs are one-liners over
[`visitAllPages`](./support/visitAllPages.ts), which filters `URLs` by section,
visits each page, and asserts it renders an `h1` other than `Page Not Found`
before toggling dark mode. They exist mostly to generate UI Coverage and
Accessibility reports in Cypress Cloud, which is why they cover breadth rather
than assert much per page.

The numbered files (`all_api_pages_1` through `_3`) are one section split into
chunks so Cloud can load-balance them across containers: `visitAllPages('api',
0, 3)` takes every third URL. The split is about run time, not coverage. Adding
a **new top-level docs section** means adding a spec file; nothing else here
does.

## Page titles

`page_titles.cy.ts` asserts every page's `<title>` ends with the suffix
`src/sectionTitles.js` maps for its section. It is the check behind the
frontmatter rule that a `title` never carries one: hand-write a suffix and the
page ships with it twice.

## Writing and running specs

- TypeScript, named `*.cy.ts`. Take the page list from `Cypress.expose('URLs')`
  rather than hardcoding one that will go stale.
- Specs run against the site at `http://localhost:3000`, so start it first (see
  the root guide's verify ladder). Because they crawl real pages, `blockHosts`
  in the config keeps Pendo, GA4, and FullStory from minting visitors on every
  run.
- `cypress run --expose limitPerSection=2` spot-checks a couple of pages per
  section instead of all of them. Use it while iterating; CI runs the lot.
- [`support/e2e.ts`](./support/e2e.ts) stubs the Osano consent script for every
  spec except `osano.cy.ts`, so a new spec never has to dismiss the banner, and
  a spec that needs the real one has to opt out there.

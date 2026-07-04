# Algolia search tuning

Follow-ups for improving docs search relevance beyond the crawler config in
[`config.json`](./config.json). Split into things applied **in this repo** (take
effect on the next scrape) and things applied **in the Algolia dashboard**
(one-time or periodic, need admin access to the `cypress_docs` index).

The docs are one flat index spanning five products (App, API, Cloud, UI
Coverage, Accessibility). The swizzled search bar
(`src/theme/SearchBar/index.js`) already sends click analytics and soft-boosts
results from the section the reader is currently in.

---

## 1. Enable Dynamic Re-Ranking (dashboard — highest impact)

The search bar already sends `clickedObjectIDsAfterSearch` events, but that data
only improves ranking once Re-Ranking is turned on.

1. Algolia dashboard → **Search → Re-Ranking** → index `cypress_docs`.
2. Enable **Dynamic Re-Ranking**. It uses the click/conversion events already
   being collected to promote the results users actually pick.
3. Confirm events are arriving under **Search → Analytics → Click analytics**
   (click-through and conversion should be non-zero within a day or two).

No code change required — it consumes the analytics this PR's click tracking
produces.

## 2. Review no-result & low-CTR queries (dashboard — recurring)

Roughly monthly:

- **Search → Analytics → No results** — queries that returned nothing. Feed each
  into the `synonyms` list in [`config.json`](./config.json), or file a content
  gap. (As of the last audit there were no zero-result queries among common
  terms, so the existing ~90 synonyms are doing their job — keep it that way.)
- **Search → Analytics → Top searches** sorted by low click-through — queries
  where the right page isn't winning. These are candidates for the pin rules in
  §4.

## 3. Synonyms (in-repo — applied on next scrape)

Synonyms live under `custom_settings.synonyms` in
[`config.json`](./config.json) and are re-applied every scrape. This PR added a
findings-driven batch (`mock`↔`intercept`, `signin`↔`login`,
`upload`↔`selectfile`, `assert`↔`assertion`↔`should`, `hook`↔`hooks`,
`beforeeach`/`aftereach`↔`hooks`, `selector`↔`selectors`, `datacy`↔`selector`,
`viewport`↔`responsive`, `variable`↔`variables`, `mocking`↔`stubbing`).

When adding more, prefer entries tied to a real no-result/low-CTR query — every
synonym trades a little precision for recall, so don't add speculative ones.

## 4. Query Rules (dashboard / Rules API)

Two kinds, delivered differently because of how DocSearch records work.

### 4a. Query-cleaning rules — durable, ready to import

[`query-rules.json`](./query-rules.json) contains rules that only rewrite the
**query** (strip `cypress`, `how to`, `how do i`, `example`/`examples`/
`tutorial`). They reference no records, so they survive re-scrapes. Apply via:

- **Dashboard:** Search → Rules → `cypress_docs` → **Import** → upload the file, or
- **Rules API:** `POST /1/indexes/cypress_docs/rules/batch` with the array (admin key).

Test each in the dashboard **Rule tester** before relying on it.

### 4b. Pin/promote rules — need objectID resolution ⚠️

The probe (see §5) found high-intent queries whose top result is wrong because
the Playwright-migration page and other broad pages outrank the canonical page:

| Trigger query(s)             | Currently returns (wrong)                  | Should promote (verified page)                            |
| ---------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| `data-cy`, `data cy`         | Error Messages → React Hydration Errors    | `/app/core-concepts/best-practices` (Selecting Elements)  |
| `best practices selectors`   | FAQ                                        | `/app/core-concepts/best-practices`                       |
| `stub network`, `mock api`   | Optimizing test performance / plugins list | `/api/commands/intercept`                                 |
| `file upload`                | Playwright-to-Cypress migration            | `/api/commands/selectfile`                                |
| `clock time`, `control time` | Playwright-to-Cypress migration            | `/api/commands/clock`                                     |
| `shadow dom`                 | Playwright-to-Cypress migration            | `/api/commands/shadow`                                    |
| `before each`, `beforeeach`  | `cy.task`                                  | `/app/core-concepts/writing-and-organizing-tests` (Hooks) |
| `jenkins`                    | UI Coverage → Results API                  | (content gap — no Jenkins CI guide exists)                |

**Why these can't ship as a static JSON:** Algolia `promote`/`hide`
consequences target a record `objectID`, and the DocSearch scraper derives
objectIDs from a content hash — they change on **every** scrape. A rule pinning
today's objectID silently stops matching after the next crawl. Two safe options:

1. **Create them in the dashboard** (Search → Rules → _Create_ → "Promote a
   result"). When you pick the page by searching for it, Algolia re-resolves it,
   and dashboard pins are more resilient to re-indexing. Simplest for this
   short list. Re-verify after large doc restructures.
2. **Automate a post-scrape sync** (if the list grows): a script that, after the
   scraper runs, looks up each target URL's current `lvl1` objectID and upserts
   the matching Query Rule via the Rules API — run it right after
   `scrape-and-compare-algolia-index.mjs` in CI so objectIDs are always fresh.
   Not built yet; ask if you want it.

The `jenkins` row is a **content gap**, not a rules problem — consider adding a
Jenkins page under `docs/app/continuous-integration/` (siblings:
`github-actions`, `bitbucket-pipelines`).

## 5. Reproducing the audit

The findings above came from probing the live index with the public search key:

- Gap/relevance sweep across ~55 realistic queries (nb-hits + top result).
- Target-page verification (each promote target exists as a doc and is indexed).

Both are throwaway scripts against
`https://R9KDA5FMJB-dsn.algolia.net/1/indexes/cypress_docs/query`
(`attributesToRetrieve=hierarchy,url`). Re-run after major content changes to
refresh §4b. Note `url_without_anchor` is **not** a faceted attribute, so you
can't `filters=url_without_anchor:...`; match the URL client-side instead.

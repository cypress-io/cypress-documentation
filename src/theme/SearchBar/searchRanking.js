/**
 * Pure ranking/filtering helpers for the Algolia DocSearch integration.
 *
 * These live in their own module (rather than inline in the SearchBar
 * component) so they can be unit tested without pulling in React, Docusaurus,
 * or the DocSearch modal.
 */

/**
 * Maps the first path segment of the current URL to the Algolia
 * `hierarchy.lvl0` value the crawler assigns to that product section (derived
 * from the active navbar item — see scripts/search/config.json). These strings
 * must match the values present in the index exactly.
 */
export const SECTION_LVL0_BY_PREFIX = {
  app: 'App',
  api: 'API',
  cloud: 'Cloud',
  'ui-coverage': 'UI Coverage',
  accessibility: 'Accessibility',
}

/**
 * Resolves the `hierarchy.lvl0` value for the product section a pathname
 * belongs to, or `null` when the path is outside the known sections (home,
 * /search, etc.).
 *
 * @param {string} pathname
 * @returns {string | null}
 */
export function getCurrentSectionLvl0(pathname) {
  if (typeof pathname !== 'string') return null
  const segment = pathname.split('/').filter(Boolean)[0]
  return SECTION_LVL0_BY_PREFIX[segment] ?? null
}

/**
 * Decides whether a hit has anything worth displaying to the user.
 *
 * The docsearch scraper emits one `type: "lvl0"` record per page whose only
 * populated field is `hierarchy.lvl0` — the section label ("API", "App",
 * "Cloud", …) — with every deeper level and `content` left null. DocSearch
 * renders a result's title from the deepest hierarchy level (or the content
 * snippet), so these section-label-only records render as blank rows. They are
 * also an exact match for queries like "api", so they flood the top of the
 * list (see the `type:-lvl0` query filter in docusaurus.config.js, which drops
 * them at query time; this is the client-side backstop).
 *
 * A hit is displayable only if it has a hierarchy level below lvl0, or body
 * content, to render as its title.
 *
 * @param {{ hierarchy?: Record<string, string | null>, content?: string | null }} hit
 * @returns {boolean}
 */
export function isDisplayableHit(hit) {
  const h = hit?.hierarchy ?? {}
  return Boolean(
    h.lvl1 || h.lvl2 || h.lvl3 || h.lvl4 || h.lvl5 || h.lvl6 || hit?.content
  )
}

/**
 * Removes hits that have nothing to render (see {@link isDisplayableHit}),
 * preserving the relative order of everything that remains.
 *
 * @template {{ hierarchy?: Record<string, string | null>, content?: string | null }} T
 * @param {T[]} items
 * @returns {T[]}
 */
export function filterDisplayableHits(items) {
  return items.filter(isDisplayableHit)
}

/**
 * Soft-boosts results from the section the reader is currently in to the top of
 * the list, preserving Algolia's relevance order within each partition and
 * keeping every other result visible. This is the client-side equivalent of an
 * Algolia `optionalFilters` boost, which isn't available on the current plan.
 *
 * The reorder is stable and lossless: the returned array always contains the
 * same items as the input, in the same relative order within the boosted and
 * non-boosted groups.
 *
 * @template {{ hierarchy?: { lvl0?: string } }} T
 * @param {T[]} items
 * @param {string | null | undefined} sectionLvl0
 * @returns {T[]}
 */
export function boostCurrentSection(items, sectionLvl0) {
  if (!sectionLvl0) return items
  const inSection = []
  const others = []
  for (const item of items) {
    if (item.hierarchy?.lvl0 === sectionLvl0) inSection.push(item)
    else others.push(item)
  }
  return [...inSection, ...others]
}

/**
 * Matches the URL of a "Migrate from <tool> to Cypress" guide (published at
 * `/app/guides/migration/<tool>-to-cypress` via each page's `slug`) and
 * captures the tool name. These guides walk through Cypress concepts side by
 * side with their Playwright, Selenium, or Protractor equivalents, so they
 * match general queries like "page object" or "retries" and crowd out the
 * pages the reader is looking for. Matching on the final path segment keeps
 * this working if the guides move.
 */
const MIGRATION_GUIDE_URL_RE =
  /\/(playwright|selenium|protractor)-to-cypress(?:[/?#]|$)/i

/**
 * Returns the tool a migration guide covers (`"playwright"`, `"selenium"`, or
 * `"protractor"`), or `null` when the hit is not a migration guide.
 *
 * @param {{ url?: string }} hit
 * @returns {string | null}
 */
export function getMigrationGuideTool(hit) {
  const match =
    typeof hit?.url === 'string' && MIGRATION_GUIDE_URL_RE.exec(hit.url)
  return match ? match[1].toLowerCase() : null
}

/**
 * Splits a search query into lowercase word tokens, so "Playwright's locator"
 * yields `["playwright", "s", "locator"]`.
 *
 * @param {string | null | undefined} query
 * @returns {string[]}
 */
export function tokenizeQuery(query) {
  if (typeof query !== 'string') return []
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

/**
 * The result group demoted migration guides are moved into. Matches the
 * sidebar label in docs/app/get-started/migrate-from-another-tool/_category_.json.
 */
export const DEMOTED_MIGRATION_GROUP = 'Migrate from another tool'

/**
 * Relabels a hit's section so DocSearch renders it under
 * {@link DEMOTED_MIGRATION_GROUP}. DocSearch groups hits by section after
 * transformItems runs, keyed on the highlighted `hierarchy.lvl0` when there is
 * one, so both copies are rewritten.
 *
 * @template {{ hierarchy?: object, _highlightResult?: { hierarchy?: object } }} T
 * @param {T} hit
 * @returns {T}
 */
function moveToDemotedGroup(hit) {
  const moved = {
    ...hit,
    hierarchy: { ...hit.hierarchy, lvl0: DEMOTED_MIGRATION_GROUP },
  }
  if (hit._highlightResult?.hierarchy) {
    moved._highlightResult = {
      ...hit._highlightResult,
      hierarchy: {
        ...hit._highlightResult.hierarchy,
        lvl0: {
          ...hit._highlightResult.hierarchy.lvl0,
          value: DEMOTED_MIGRATION_GROUP,
        },
      },
    }
  }
  return moved
}

/**
 * Moves migration guide hits to the end of the results unless the query names
 * the guide's tool as a whole word. A search for "playwright" keeps the
 * Playwright guide where Algolia ranked it (and still demotes the Selenium and
 * Protractor guides), while a search for "page object" pushes all three below
 * the rest.
 *
 * DocSearch groups results by section, so reordering alone would leave a
 * demoted guide at the end of the "App" group, which can still be the first
 * group. Demoted hits are therefore also moved into their own
 * {@link DEMOTED_MIGRATION_GROUP} group, which renders last.
 *
 * The result is stable and lossless: every hit is kept, in Algolia's relative
 * order within the kept and demoted groups.
 *
 * @template {{ url?: string, hierarchy?: object }} T
 * @param {T[]} items
 * @param {string | null | undefined} query
 * @returns {T[]}
 */
export function demoteUnrequestedMigrationGuides(items, query) {
  const tokens = new Set(tokenizeQuery(query))
  const kept = []
  const demoted = []
  for (const item of items) {
    const tool = getMigrationGuideTool(item)
    if (tool && !tokens.has(tool)) demoted.push(moveToDemotedGroup(item))
    else kept.push(item)
  }
  return [...kept, ...demoted]
}

/**
 * Stamps each hit with its 1-based position in the list as displayed to the
 * user. Because {@link boostCurrentSection} reorders hits on the client, the
 * rank Algolia originally assigned (`__position`) no longer matches what the
 * user sees (and {@link demoteUnrequestedMigrationGuides} reorders them
 * again). Click-analytics events must report the displayed position, so we
 * record it here — after any reordering — under `__displayPosition`, which the
 * click handler reads first.
 *
 * @template T
 * @param {T[]} items
 * @returns {(T & { __displayPosition: number })[]}
 */
export function assignDisplayPositions(items) {
  return items.map((item, index) => ({ ...item, __displayPosition: index + 1 }))
}

/**
 * Merges two facet-filter values (each of which may be a string or an array)
 * into a single flat array.
 *
 * @param {string | string[]} f1
 * @param {string | string[]} f2
 * @returns {string[]}
 */
export function mergeFacetFilters(f1, f2) {
  const normalize = (f) => (typeof f === 'string' ? [f] : f)
  return [...normalize(f1), ...normalize(f2)]
}

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
 * Stamps each hit with its 1-based position in the list as displayed to the
 * user. Because {@link boostCurrentSection} reorders hits on the client, the
 * rank Algolia originally assigned (`__position`) no longer matches what the
 * user sees. Click-analytics events must report the displayed position, so we
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

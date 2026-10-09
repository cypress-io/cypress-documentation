// @ts-check
/**
 * Find the plugins a pull request adds to src/data/plugins.json.
 *
 * This matches entries by link and by name rather than by a text diff, so a
 * reformatted file, a reordered category, or a plugin moved between categories
 * doesn't count as new. An entry counts as new only when neither its link nor
 * its name appears anywhere in the base file.
 */

/** Every plugin entry in the file, across categories. */
export const flattenPlugins = (data) =>
  (data?.plugins || []).flatMap((category) => category.plugins || [])

/** Normalize a link so `https://github.com/a/b/` and `http://www.github.com/a/b.git`
 *  compare equal. */
export function normalizeLink(link) {
  if (typeof link !== 'string') return ''
  return link
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
    .replace(/\.git$/, '')
}

/** The head entries that don't exist in base, in head order. */
export function findNewPlugins(base, head) {
  const known = new Set(
    flattenPlugins(base).flatMap((p) => [
      normalizeLink(p.link),
      String(p.name).toLowerCase(),
    ])
  )
  return flattenPlugins(head).filter(
    (p) =>
      !known.has(normalizeLink(p.link)) &&
      !known.has(String(p.name).toLowerCase())
  )
}

// @ts-check
/**
 * Find the plugins a pull request adds to src/data/plugins.json.
 *
 * This matches entries by link and by name rather than by a text diff, so a
 * reformatted file, a reordered category, or a plugin moved between categories
 * doesn't count as new. An entry counts as new only when neither its link nor
 * its name appears anywhere in the base file.
 */

/** Flatten the categorized list into `{ category, plugin }` pairs. */
export function flattenPlugins(data) {
  const out = []
  for (const category of (data && data.plugins) || []) {
    for (const plugin of category.plugins || []) {
      out.push({ category: category.name, plugin })
    }
  }
  return out
}

/** Normalize a link so `https://github.com/a/b/` and `http://www.github.com/a/b.git`
 *  compare equal. */
export function normalizeLink(link) {
  if (typeof link !== 'string') return ''
  return link
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
    .replace(/\.git$/, '')
}

function normalizeName(name) {
  return typeof name === 'string' ? name.trim().toLowerCase() : ''
}

/** Return the head entries that don't exist in base, in head order. */
export function findNewPlugins(base, head) {
  const baseEntries = flattenPlugins(base)
  const links = new Set(baseEntries.map((e) => normalizeLink(e.plugin.link)))
  const names = new Set(baseEntries.map((e) => normalizeName(e.plugin.name)))
  links.delete('')
  names.delete('')

  return flattenPlugins(head).filter(({ plugin }) => {
    const link = normalizeLink(plugin.link)
    const name = normalizeName(plugin.name)
    return !(link && links.has(link)) && !(name && names.has(name))
  })
}

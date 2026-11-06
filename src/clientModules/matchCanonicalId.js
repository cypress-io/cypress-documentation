/**
 * Heading ids on this site preserve the heading's original casing (via the
 * `@docusaurus/mdx-loader` patch). Inbound hashes from Google, LLMs, and
 * humans are often lowercased. These helpers pick the canonical id when the
 * only difference is case.
 */

/**
 * @param {string} hash `location.hash`, with or without a leading `#`
 * @returns {string}
 */
export function decodeHash(hash) {
  if (typeof hash !== 'string' || hash.length === 0) {
    return ''
  }
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw) {
    return ''
  }
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/**
 * @param {string} hash `location.hash`, with or without a leading `#`
 * @param {string[]} ids document ids in document order
 * @returns {{id: string, rewrite: boolean} | null}
 *   `rewrite: true` when a case-insensitive match should replace the hash.
 *   Exact matches return `rewrite: false` so the caller leaves scrolling to
 *   Docusaurus. `null` when nothing matches.
 */
export function matchCanonicalId(hash, ids) {
  const decoded = decodeHash(hash)
  if (!decoded || !Array.isArray(ids) || ids.length === 0) {
    return null
  }
  if (ids.includes(decoded)) {
    return { id: decoded, rewrite: false }
  }
  const lower = decoded.toLowerCase()
  const id = ids.find((candidate) => candidate.toLowerCase() === lower)
  return id ? { id, rewrite: true } : null
}

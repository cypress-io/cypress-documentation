const fs = require('fs')
const path = require('path')

// Cloudflare's documented `_redirects` limits. Rules past them are not applied.
const MAX_STATIC_RULES = 2000
const MAX_DYNAMIC_RULES = 100

const isDynamic = (source) => source.includes('*') || source.includes(':')
const isComment = (line) => !line || line.startsWith('#')

// `/a`, `/a.html`, and `/a/` are one bookmark to a reader.
const basePath = (source) =>
  source.endsWith('.html')
    ? source.slice(0, -'.html'.length)
    : source.replace(/\/+$/, '')

// A source like `/install.md` names a file, not a page, so it has no other
// spellings.
const hasOtherExtension = (source) => {
  const last = source.replace(/\/+$/, '').split('/').pop()
  return last.includes('.') && !source.endsWith('.html')
}

// Cloudflare matches a `_redirects` source exactly, so a bookmark of
// `/old/page.html` or `/old/page/` misses the `/old/page` rule and falls
// through to a wildcard or a 404. Every exact rule therefore gets those two
// spellings in the built file, inserted right after it so they keep its
// place in the order.
function addRedirectVariants(text, isPage = () => false) {
  const lines = text.split('\n').map((line) => line.trim())
  const rules = lines
    .filter((line) => !isComment(line))
    .map((line) => line.split(/\s+/))

  // Spellings of one path that disagree would leave the missing spellings
  // following whichever rule happens to come first.
  const targets = new Map()
  for (const [source, target] of rules) {
    if (isDynamic(source) || hasOtherExtension(source)) continue
    const base = basePath(source)
    const seen = targets.get(base)
    if (seen && seen.target !== target) {
      throw new Error(
        `_redirects: ${seen.source} goes to ${seen.target} but ${source} goes to ${target}. Spellings of one path must share a target.`
      )
    }
    targets.set(base, { source, target })
  }

  const sources = new Set(rules.map(([source]) => source))
  const out = []

  for (const line of lines) {
    out.push(line)
    if (isComment(line)) continue

    const [source, ...rest] = line.split(/\s+/)
    if (isDynamic(source) || hasOtherExtension(source)) continue

    const base = basePath(source)
    if (!base) continue

    for (const variant of [base, `${base}.html`, `${base}/`]) {
      // A rule on a real page's path would shadow the page.
      if (sources.has(variant) || isPage(variant)) continue
      sources.add(variant)
      out.push([variant, ...rest].join(' '))
    }
  }

  return out.join('\n')
}

function checkRuleLimits(text) {
  const sources = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !isComment(line))
    .map((line) => line.split(/\s+/)[0])
  const dynamic = sources.filter(isDynamic).length
  const staticCount = sources.length - dynamic

  if (staticCount > MAX_STATIC_RULES || dynamic > MAX_DYNAMIC_RULES) {
    throw new Error(
      `_redirects has ${staticCount} static and ${dynamic} dynamic rules after adding .html and trailing-slash spellings. Cloudflare applies at most ${MAX_STATIC_RULES} static and ${MAX_DYNAMIC_RULES} dynamic rules.`
    )
  }
}

module.exports = function redirectVariantsPlugin() {
  return {
    name: 'docusaurus-redirect-variants',
    async postBuild({ outDir }) {
      const file = path.join(outDir, '_redirects')
      if (!fs.existsSync(file)) return

      const isPage = (urlPath) => {
        const p = path.join(outDir, urlPath)
        if (urlPath.endsWith('.html')) return fs.existsSync(p)
        return (
          fs.existsSync(path.join(p, 'index.html')) ||
          fs.existsSync(`${p}.html`)
        )
      }
      const expanded = addRedirectVariants(
        fs.readFileSync(file, 'utf8'),
        isPage
      )
      checkRuleLimits(expanded)
      fs.writeFileSync(file, expanded)
    },
  }
}

module.exports.addRedirectVariants = addRedirectVariants
module.exports.checkRuleLimits = checkRuleLimits

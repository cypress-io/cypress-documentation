const fs = require('fs')
const path = require('path')

// Cloudflare matches a `_redirects` source exactly, so a bookmark of
// `/old/page.html` or `/old/page/` misses the `/old/page` rule and falls
// through to a wildcard or a 404. Every exact rule therefore gets those two
// spellings in the built file, inserted right after it so they keep its
// place in the order.
function addRedirectVariants(text, isPage = () => false) {
  const lines = text.split('\n')
  const rules = lines.filter((line) => line.trim() && !line.startsWith('#'))
  const sources = new Set(rules.map((line) => line.split(/\s+/)[0]))
  const out = []

  for (const line of lines) {
    out.push(line)
    if (!line.trim() || line.startsWith('#')) continue

    const [source, ...rest] = line.trim().split(/\s+/)
    if (source.includes('*') || source.includes(':')) continue

    const base = source.endsWith('.html')
      ? source.slice(0, -'.html'.length)
      : source.replace(/\/+$/, '')
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

module.exports = function redirectVariantsPlugin() {
  return {
    name: 'docusaurus-redirect-variants',
    async postBuild({ outDir }) {
      const file = path.join(outDir, '_redirects')
      if (!fs.existsSync(file)) return

      const isPage = (urlPath) => {
        const p = path.join(outDir, urlPath)
        return (
          fs.existsSync(path.join(p, 'index.html')) ||
          (urlPath.endsWith('.html') && fs.existsSync(p))
        )
      }
      fs.writeFileSync(
        file,
        addRedirectVariants(fs.readFileSync(file, 'utf8'), isPage)
      )
    },
  }
}

module.exports.addRedirectVariants = addRedirectVariants

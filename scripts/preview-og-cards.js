#!/usr/bin/env node
/**
 * Preview the per-page Open Graph cards locally WITHOUT a full Docusaurus build.
 *
 * Reads frontmatter (title/description) from every doc, renders each card with
 * the same code path the build uses (plugins/og-image-cards.js), and writes a
 * browsable gallery to `.og-preview/index.html`.
 *
 *   node scripts/preview-og-cards.js            # all docs, then open the gallery
 *   node scripts/preview-og-cards.js auth       # only routes matching "auth"
 *   node scripts/preview-og-cards.js --no-open  # don't auto-open the browser
 *
 * Iterate on the design in plugins/og-image-cards.js, re-run this, refresh.
 */
const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')
const matter = require('gray-matter')
const {
  renderCardPng,
  cardTitle,
  eyebrowForSegments,
} = require('../plugins/og-image-cards')

const SITE_DIR = path.resolve(__dirname, '..')
const DOCS_DIR = path.join(SITE_DIR, 'docs')
const OUT_DIR = path.join(SITE_DIR, '.og-preview')
const CARDS_DIR = path.join(OUT_DIR, 'cards')
const SITE_TITLE = 'Cypress Documentation' // matches docusaurus.config.js `title`

const args = process.argv.slice(2)
const noOpen = args.includes('--no-open')
const filter = args.find((a) => !a.startsWith('--')) // optional substring filter

/** Recursively collect .md/.mdx docs, skipping partials and `_`-prefixed files. */
function findDocs(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name === 'partials') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) findDocs(full, acc)
    else if (/\.mdx?$/.test(entry.name)) acc.push(full)
  }
  return acc
}

function routeInfo(file) {
  const rel = path.relative(DOCS_DIR, file).replace(/\.mdx?$/, '')
  const segments = rel.split(path.sep).filter((s) => s && s !== 'index')
  return { segments, slug: segments.join('-') || 'home' }
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  )
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(CARDS_DIR, { recursive: true })

  let docs = findDocs(DOCS_DIR)
  if (filter) docs = docs.filter((f) => f.toLowerCase().includes(filter.toLowerCase()))
  if (!docs.length) {
    console.error(`No docs matched "${filter}".`)
    process.exit(1)
  }

  const cards = []
  const work = async (file) => {
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    const { segments, slug } = routeInfo(file)
    const title = cardTitle(data.title || segments[segments.length - 1] || SITE_TITLE, SITE_TITLE)
    const description = data.description || ''
    const eyebrow = eyebrowForSegments(segments)
    const png = await renderCardPng({ siteDir: SITE_DIR, eyebrow, title, description })
    fs.writeFileSync(path.join(CARDS_DIR, `${slug}.png`), png)
    cards.push({ slug, title, eyebrow, route: '/' + segments.join('/') })
  }

  const BATCH = 16
  for (let i = 0; i < docs.length; i += BATCH) {
    await Promise.all(docs.slice(i, i + BATCH).map(work))
    process.stdout.write(`\r  rendered ${Math.min(i + BATCH, docs.length)}/${docs.length} cards`)
  }
  process.stdout.write('\n')

  cards.sort((a, b) => a.slug.localeCompare(b.slug))
  const items = cards
    .map(
      (c) => `<figure class="card" data-q="${escapeHtml((c.route + ' ' + c.title).toLowerCase())}">
      <img loading="lazy" src="cards/${c.slug}.png" width="600" height="315" alt="${escapeHtml(c.title)}"/>
      <figcaption><span class="eyebrow">${escapeHtml(c.eyebrow)}</span>${escapeHtml(c.route)}</figcaption>
    </figure>`
    )
    .join('\n')

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>OG card preview (${cards.length})</title>
<style>
  body{margin:0;background:#0f1115;color:#e6e6e6;font:14px/1.4 -apple-system,Segoe UI,Roboto,sans-serif}
  header{position:sticky;top:0;background:#0f1115;padding:16px 24px;border-bottom:1px solid #2a2d34;z-index:1}
  h1{font-size:16px;margin:0 0 8px}
  input{width:320px;max-width:60vw;padding:8px 10px;border-radius:8px;border:1px solid #2a2d34;background:#1a1d24;color:#fff}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px;padding:24px}
  .card{margin:0;background:#1a1d24;border:1px solid #2a2d34;border-radius:12px;overflow:hidden}
  .card img{display:block;width:100%;height:auto}
  figcaption{padding:8px 12px;color:#aeb4c0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
  .eyebrow{display:inline-block;margin-right:8px;color:#6AD3A7;font-weight:600}
  .count{color:#aeb4c0;font-weight:400}
</style></head>
<body>
  <header>
    <h1>Cypress OG cards <span class="count" id="count">(${cards.length})</span></h1>
    <input id="q" type="search" placeholder="Filter by route or title…" autofocus/>
  </header>
  <div class="grid" id="grid">
${items}
  </div>
  <script>
    const q=document.getElementById('q'),grid=document.getElementById('grid'),count=document.getElementById('count');
    const cards=[...grid.children];
    q.addEventListener('input',()=>{const t=q.value.trim().toLowerCase();let n=0;
      for(const c of cards){const show=!t||c.dataset.q.includes(t);c.style.display=show?'':'none';if(show)n++;}
      count.textContent='('+n+')';});
  </script>
</body></html>`

  const indexPath = path.join(OUT_DIR, 'index.html')
  fs.writeFileSync(indexPath, html)
  console.log(`\nGallery: ${path.relative(SITE_DIR, indexPath)}  (${cards.length} cards)`)

  if (!noOpen) {
    const opener =
      process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
    execFile(opener, [indexPath], (err) => {
      if (err) console.log(`Open it manually: file://${indexPath}`)
    })
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

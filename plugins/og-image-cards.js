const fs = require('fs')
const path = require('path')

/**
 * Generates a unique 1200x630 social-share ("Open Graph") card for every built
 * page and rewrites that page's og:image / twitter:image to point at it.
 *
 * The card mirrors the docs branding: the Cypress logo + wordmark in the top
 * left, a product eyebrow, the page title, and the page description — so links
 * shared in Slack, X, etc. unfurl with a rich, page-specific preview instead of
 * a single generic image.
 *
 * Runs in `postBuild` only (production builds). `npm start` keeps using the
 * static fallback card from `themeConfig.image`.
 */

const WIDTH = 1200
const HEIGHT = 630
const PAD = 80
const MAX_WIDTH = WIDTH - PAD * 2

// Brand palette.
const BG = '#004143' // teal background
const JADE = '#6AD3A7' // eyebrow accent
const WHITE = '#FFFFFF'

// Layered "hills" at the bottom, back (highest) -> front (lowest).
const HILLS = [
  { d: 'M0,602 C220,548 430,600 640,576 C840,553 1030,606 1200,566 L1200,630 L0,630 Z', fill: '#6AD3A7' },
  { d: 'M0,616 C260,578 470,620 720,596 C920,577 1060,616 1200,592 L1200,630 L0,630 Z', fill: '#A4E7CB' },
  { d: 'M0,630 C210,606 520,628 760,613 C960,601 1110,626 1200,609 L1200,630 L0,630 Z', fill: '#C3F1DE' },
]

// First URL segment -> human product label shown as the eyebrow.
const EYEBROWS = {
  app: 'Cypress App',
  api: 'Cypress API',
  cloud: 'Cypress Cloud',
  'ui-coverage': 'UI Coverage',
  accessibility: 'Cypress Accessibility',
}
const DEFAULT_EYEBROW = 'Cypress Documentation'

const FONT = 'Helvetica, Arial, sans-serif'

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Decode the handful of HTML entities Docusaurus emits into meta content. */
function decodeEntities(str) {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
}

function getMeta(html, key, attr) {
  // attr is 'property' (og:*) or 'name' (twitter:*, description)
  const re = new RegExp(
    `<meta[^>]*\\b${attr}="${key}"[^>]*\\bcontent="([^"]*)"`,
    'i'
  )
  const m = html.match(re) || html.match(
    new RegExp(`<meta[^>]*\\bcontent="([^"]*)"[^>]*\\b${attr}="${key}"`, 'i')
  )
  return m ? decodeEntities(m[1]) : null
}

/**
 * Greedy word-wrap using an estimated average glyph width. `factor` is the mean
 * glyph width as a fraction of the font size (bold sans ~0.56, regular ~0.52).
 */
function wrap(text, fontSize, factor, maxLines) {
  const maxChars = Math.floor(MAX_WIDTH / (fontSize * factor))
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maxChars || !line) {
      line = candidate
    } else {
      lines.push(line)
      line = word
    }
    if (lines.length === maxLines) break
  }
  if (lines.length < maxLines && line) lines.push(line)

  // Truncate with an ellipsis if the text overflowed the allowed line count.
  const consumed = lines.join(' ').length
  if (consumed < text.replace(/\s+/g, ' ').length && lines.length) {
    let last = lines[lines.length - 1]
    while (last.length > 3 && last.length + 1 > maxChars) last = last.slice(0, -1)
    lines[lines.length - 1] = last.replace(/[\s.,;:]*$/, '') + '…'
  }
  return lines
}

/** Pick the largest title size that fits in <=2 lines, else shrink to 3 lines. */
function fitTitle(title) {
  for (const size of [76, 66, 58]) {
    const lines = wrap(title, size, 0.56, 2)
    if (lines.join(' ').length >= title.replace(/\s+/g, ' ').length) {
      return { size, lineHeight: Math.round(size * 1.15), lines }
    }
  }
  const size = 54
  return { size, lineHeight: Math.round(size * 1.15), lines: wrap(title, size, 0.56, 3) }
}

function buildSvg({ logoBase64, eyebrow, title, description }) {
  const fit = fitTitle(title)
  const descSize = 27
  const descLineHeight = 38
  const eyebrowToTitle = 86 // eyebrow baseline -> first title baseline
  const titleToDesc = 56 // last title baseline -> first desc baseline

  const descLines = description ? wrap(description, descSize, 0.52, 2) : []

  // Vertically center the eyebrow+title+description block in the band between
  // the brand row and the hills. We work in baselines, padding for the eyebrow
  // cap height above and the description descender below.
  const CAP = 22
  const DESCENDER = 8
  const bandTop = 150
  const bandBottom = 520 // stays clear of the hill peaks (~545)

  const baselineSpan =
    eyebrowToTitle +
    (fit.lines.length - 1) * fit.lineHeight +
    (descLines.length
      ? titleToDesc + (descLines.length - 1) * descLineHeight
      : 0)
  const blockHeight = CAP + baselineSpan + DESCENDER
  const visualTop = Math.max(
    bandTop,
    bandTop + (bandBottom - bandTop - blockHeight) / 2
  )

  const eyebrowY = Math.round(visualTop + CAP)
  const titleTop = eyebrowY + eyebrowToTitle
  const descY =
    titleTop + (fit.lines.length - 1) * fit.lineHeight + titleToDesc

  const titleTspans = fit.lines
    .map(
      (line, i) =>
        `<tspan x="${PAD}" y="${titleTop + i * fit.lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join('')
  const descTspans = descLines
    .map(
      (line, i) =>
        `<tspan x="${PAD}" y="${descY + i * descLineHeight}">${escapeXml(line)}</tspan>`
    )
    .join('')

  const hills = HILLS.map((h) => `<path d="${h.d}" fill="${h.fill}"/>`).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  ${hills}
  <image x="${PAD}" y="56" width="56" height="56" xlink:href="data:image/png;base64,${logoBase64}"/>
  <text x="${PAD + 76}" y="96" font-family="${FONT}" font-size="34" font-weight="700" fill="${WHITE}">Cypress Documentation</text>
  <text font-family="${FONT}" font-size="30" font-weight="600" fill="${JADE}"><tspan x="${PAD}" y="${eyebrowY}">${escapeXml(eyebrow)}</tspan></text>
  <text font-family="${FONT}" font-size="${fit.size}" font-weight="700" fill="${WHITE}">${titleTspans}</text>
  <text font-family="${FONT}" font-size="${descSize}" font-weight="400" fill="${WHITE}">${descTspans}</text>
</svg>`
}

/** Walk a directory tree collecting every index.html path. */
function findHtmlFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) findHtmlFiles(full, acc)
    else if (entry.name === 'index.html') acc.push(full)
  }
  return acc
}

/**
 * Rasterize the white logomark once (high-res for crisp downscaling) and cache
 * the resulting PNG data as base64 for embedding into every card.
 */
let _logoBase64
async function loadLogoBase64(siteDir) {
  if (_logoBase64) return _logoBase64
  const sharp = require('sharp')
  const logoSvg = fs.readFileSync(
    path.join(siteDir, 'static/img/logo/cypress-logomark-white.svg')
  )
  _logoBase64 = (
    await sharp(logoSvg, { density: 384 })
      .resize(168, 168, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()
  ).toString('base64')
  return _logoBase64
}

/** Render a single card to a PNG buffer. Shared by the build and the preview. */
async function renderCardPng({ siteDir, eyebrow, title, description }) {
  const sharp = require('sharp')
  const logoBase64 = await loadLogoBase64(siteDir)
  const svg = buildSvg({ logoBase64, eyebrow, title, description })
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** Strip the " | <siteTitle>" SEO suffix to get the card headline. */
function cardTitle(rawTitle, siteTitle) {
  return (
    decodeEntities(rawTitle)
      .replace(new RegExp(`\\s*\\|\\s*${siteTitle}\\s*$`), '')
      .trim() || siteTitle
  )
}

/** Map a route's first path segment to its product eyebrow label. */
function eyebrowForSegments(segments) {
  return EYEBROWS[segments[0]] || DEFAULT_EYEBROW
}

module.exports = async function ogImageCardsPlugin(context) {
  const { siteConfig, siteDir } = context
  const siteTitle = siteConfig.title // "Cypress Documentation"
  const baseUrl = (siteConfig.url || '') + (siteConfig.baseUrl || '/')

  return {
    name: 'docusaurus-og-image-cards',
    async postBuild({ outDir }) {
      const ogDir = path.join(outDir, 'img', 'og')
      fs.mkdirSync(ogDir, { recursive: true })

      const files = findHtmlFiles(outDir)
      let generated = 0

      const work = async (file) => {
        let html = fs.readFileSync(file, 'utf8')

        const rawTitle =
          getMeta(html, 'og:title', 'property') ||
          (html.match(/<title>([^<]*)<\/title>/i) || [])[1] ||
          siteTitle
        // The page title carries the " | Cypress Documentation" site suffix —
        // strip it so the card shows just the page title.
        const title = cardTitle(rawTitle, siteTitle)
        const description =
          getMeta(html, 'og:description', 'property') ||
          getMeta(html, 'description', 'name') ||
          ''

        // Slug + eyebrow come from the route directory relative to outDir.
        const relDir = path.relative(outDir, path.dirname(file))
        const segments = relDir.split(path.sep).filter(Boolean)
        const slug = segments.length ? segments.join('-') : 'home'
        const eyebrow = eyebrowForSegments(segments)

        const png = await renderCardPng({ siteDir, eyebrow, title, description })
        const outFile = path.join(ogDir, `${slug}.png`)
        fs.writeFileSync(outFile, png)

        const cardUrl = `${baseUrl}img/og/${slug}.png`
        // Repoint og:image / twitter:image (currently the static fallback card).
        html = html.replace(
          new RegExp(
            `${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}img/social-card\\.png`,
            'g'
          ),
          cardUrl
        )
        fs.writeFileSync(file, html)
        generated++
      }

      // Bounded concurrency so we don't spawn 300+ sharp pipelines at once.
      const BATCH = 16
      for (let i = 0; i < files.length; i += BATCH) {
        await Promise.all(files.slice(i, i + BATCH).map(work))
      }

      console.log(
        `[og-image-cards] generated ${generated} per-page OG cards in ${path.relative(
          siteDir,
          ogDir
        )}`
      )
    },
  }
}

// Exported for standalone testing and the preview script.
module.exports.buildSvg = buildSvg
module.exports.wrap = wrap
module.exports.fitTitle = fitTitle
module.exports.renderCardPng = renderCardPng
module.exports.cardTitle = cardTitle
module.exports.eyebrowForSegments = eyebrowForSegments
module.exports.EYEBROWS = EYEBROWS
module.exports.DEFAULT_EYEBROW = DEFAULT_EYEBROW

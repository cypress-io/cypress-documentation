const fs = require('fs')
const path = require('path')

/**
 * Source pages mapped to the routes they are published at. `routeBasePath` is
 * '/' for the docs, so docs/app/faq.mdx -> /app/faq.
 *
 * Each entry may set:
 *   - requireIconHeading: only treat `###` headings that begin with an <Icon>
 *     as questions. Used by the Error Messages page, where icon-marked
 *     headings are the actual errors and plain `###` headings are guide
 *     subsections that should not become FAQ entries.
 */
const STRUCTURED_DATA_PAGES = [
  { route: '/app/faq', file: 'docs/app/faq.mdx' },
  { route: '/cloud/faq', file: 'docs/cloud/faq.mdx' },
  { route: '/ui-coverage/faq', file: 'docs/ui-coverage/faq.mdx' },
  { route: '/accessibility/faq', file: 'docs/accessibility/faq.mdx' },
  {
    route: '/app/references/error-messages',
    file: 'docs/app/references/error-messages.mdx',
    requireIconHeading: true,
  },
]

/** Remove the leading YAML frontmatter block, if present. */
function stripFrontmatter(content) {
  if (!content.startsWith('---')) return content
  const end = content.indexOf('\n---', 3)
  if (end === -1) return content
  const afterClosing = content.indexOf('\n', end + 1)
  return afterClosing === -1 ? '' : content.slice(afterClosing + 1)
}

/**
 * Build a map of { ComponentName: absolutePartialPath } from the global MDX
 * component registrations in src/theme/MDXComponents.js. The FAQ answers use
 * these partials (e.g. <UrlAllowList />) without local imports, so their
 * content needs to be inlined to be captured in the structured data.
 */
function loadPartialMap(siteDir) {
  const map = {}
  const componentsFile = path.join(siteDir, 'src/theme/MDXComponents.js')
  if (!fs.existsSync(componentsFile)) return map
  const source = fs.readFileSync(componentsFile, 'utf8')
  const importRe =
    /import\s+(\w+)\s+from\s+["']@site\/docs\/partials\/(_[\w-]+\.mdx)["']/g
  let match
  while ((match = importRe.exec(source))) {
    map[match[1]] = path.join(siteDir, 'docs/partials', match[2])
  }
  return map
}

/**
 * Recursively inline partial-component usages (both self-closing and paired)
 * with the partial file's body so their prose is captured. A `seen` set and a
 * depth cap guard against import cycles.
 */
function inlinePartials(content, partialMap, seen = new Set(), depth = 0) {
  if (depth > 5) return content
  let result = content
  for (const [name, file] of Object.entries(partialMap)) {
    if (!result.includes('<' + name)) continue
    let replacement = ' '
    if (!seen.has(name) && fs.existsSync(file)) {
      const nextSeen = new Set(seen).add(name)
      const body = stripFrontmatter(fs.readFileSync(file, 'utf8'))
      replacement =
        '\n' + inlinePartials(body, partialMap, nextSeen, depth + 1) + '\n'
    }
    const paired = new RegExp(
      '<' + name + '(?:\\s[^>]*?)?>[\\s\\S]*?</' + name + '>',
      'g'
    )
    const selfClosing = new RegExp('<' + name + '(?:\\s[^>]*?)?/>', 'g')
    result = result
      .replace(paired, () => replacement)
      .replace(selfClosing, () => replacement)
  }
  return result
}

/**
 * Best-effort conversion of MDX/Markdown to plain text suitable for the
 * `text` field of a schema.org Answer. JSX components, code blocks, links,
 * images, admonitions and Markdown formatting are stripped or unwrapped.
 */
function toPlainText(markdown) {
  let text = markdown
  // Unescape Markdown backslash escapes (e.g. \< \> \* ) to their literals
  text = text.replace(/\\([\\`*_{}\[\]()#+\-.!<>~|])/g, '$1')
  // Fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, ' ')
  // HTML / MDX comments
  text = text.replace(/<!--[\s\S]*?-->/g, ' ')
  // Admonition / directive markers (:::note, :::, etc.)
  text = text.replace(/^\s*:::.*$/gm, ' ')
  // Images ![alt](url)
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  // Links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  // JSX / HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Table separator rows (| --- | --- |)
  text = text.replace(/^\s*\|?[\s:|-]+\|?\s*$/gm, ' ')
  // Table cell pipes
  text = text.replace(/\|/g, ' ')
  // Blockquote markers
  text = text.replace(/^\s{0,3}>+\s?/gm, ' ')
  // List markers
  text = text.replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, ' ')
  // Heading markers
  text = text.replace(/^#{1,6}\s+/gm, ' ')
  // Inline code backticks
  text = text.replace(/`([^`]*)`/g, '$1')
  // Bold / italic / strikethrough markers
  text = text.replace(/(\*\*|__|~~|\*|_)/g, '')
  // Common HTML entities
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  // Collapse whitespace
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Parse the FAQ body into { question, answer } entries. Each `###` heading is
 * treated as a question; everything until the next `###`, `##` or `#` heading
 * is its answer. Headings inside fenced code blocks are ignored.
 *
 * Options:
 *   - requireIconHeading: when true, only `###` headings that begin with an
 *     <Icon> become questions; other `###` headings act as section breaks (so
 *     guide subsections such as "The Problem" are not captured as entries).
 */
function parseFaq(content, { requireIconHeading = false } = {}) {
  const lines = stripFrontmatter(content).split('\n')
  const entries = []
  let current = null
  let inFence = false

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      if (current) current.answerLines.push(line)
      continue
    }
    if (!inFence && /^###\s+/.test(line)) {
      const heading = line.replace(/^###\s+/, '')
      // With requireIconHeading, a non-icon ### is a section break, not a question.
      if (requireIconHeading && !/^<Icon[\s/>]/.test(heading)) {
        if (current) {
          entries.push(current)
          current = null
        }
        continue
      }
      if (current) entries.push(current)
      current = { question: toPlainText(heading), answerLines: [] }
      continue
    }
    // An h1/h2 (category header or new section) ends the current answer.
    if (!inFence && /^#{1,2}\s+/.test(line)) {
      if (current) {
        entries.push(current)
        current = null
      }
      continue
    }
    if (current) current.answerLines.push(line)
  }
  if (current) entries.push(current)

  return entries
    .map(({ question, answerLines }) => ({
      question,
      answer: toPlainText(answerLines.join('\n')),
    }))
    .filter((entry) => entry.question && entry.answer)
}

/** Build a schema.org FAQPage JSON-LD object from parsed entries. */
function buildJsonLd(entries) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}

/**
 * Docusaurus plugin that generates FAQPage JSON-LD structured data from the
 * FAQ and Error Messages MDX files and exposes it as global data keyed by
 * route. The swizzled DocItem/Layout reads this and injects the JSON-LD
 * <script> into the page <head> for the matching routes, making the Q&As
 * eligible for rich results and AI/answer-engine citations.
 */
module.exports = async function faqStructuredDataPlugin(context) {
  return {
    name: 'docusaurus-faq-structured-data',
    async contentLoaded({ actions }) {
      const partialMap = loadPartialMap(context.siteDir)
      const byRoute = {}
      for (const { route, file, requireIconHeading } of STRUCTURED_DATA_PAGES) {
        const absolutePath = path.join(context.siteDir, file)
        if (!fs.existsSync(absolutePath)) continue
        const raw = fs.readFileSync(absolutePath, 'utf8')
        const entries = parseFaq(inlinePartials(raw, partialMap), {
          requireIconHeading,
        })
        if (entries.length) byRoute[route] = buildJsonLd(entries)
      }
      actions.setGlobalData({ byRoute })
    },
  }
}

// Exported for standalone testing.
module.exports.parseFaq = parseFaq
module.exports.buildJsonLd = buildJsonLd
module.exports.toPlainText = toPlainText
module.exports.loadPartialMap = loadPartialMap
module.exports.inlinePartials = inlinePartials

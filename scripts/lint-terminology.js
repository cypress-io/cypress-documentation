// @ts-check
/**
 * Lints (and optionally fixes) house terminology in the docs.
 *
 * Scope is deliberately narrow: only terms with exactly one correct form no
 * matter where they appear in a sentence. Anything that depends on context —
 * hyphenating "front-end" as a modifier but not as a noun, "Single Sign-On" in
 * a heading versus "single sign-on" in prose, whether "local storage" means the
 * browser concept or the `localStorage` API — is a judgement call a regex gets
 * wrong more often than right, and is left to review. See
 * AGENTS_REFERENCE.md#terminology for those.
 *
 * Usage:
 *   node scripts/lint-terminology.js          # check only, non-zero exit on problems
 *   node scripts/lint-terminology.js --fix     # rewrite in place
 *
 * Code is not prose: fenced and inline code, JSX tags and expressions, link
 * targets, bare URLs, and import/export lines are masked out before matching,
 * so `cy.getAllLocalStorage()` and ```yaml fences are never flagged.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const DOCS_DIR = path.join(ROOT, 'docs')

// Changelogs are historical records copied from the released product's notes.
// Rewording shipped release notes misrepresents them, so they are left alone.
const IGNORED = new Set([
  'docs/app/references/changelog.mdx',
  'docs/accessibility/changelog.mdx',
  'docs/ui-coverage/changelog.mdx',
])

/**
 * `brand` terms are replaced verbatim — a brand's casing is the same at the
 * start of a sentence as in the middle ("npm", "jQuery", "iOS").
 * `word` terms preserve the leading capital of whatever was matched, so
 * "Behaviour" becomes "Behavior" rather than "behavior".
 * @type {{ pattern: string, replacement: string, kind: 'brand' | 'word' }[]}
 */
const TERMS = [
  // Cypress product names
  { pattern: 'Cypress cloud', replacement: 'Cypress Cloud', kind: 'brand' },

  // Brands and technologies. Casing follows each project's own styling.
  { pattern: 'appveyor', replacement: 'AppVeyor', kind: 'brand' },
  { pattern: 'browserify', replacement: 'Browserify', kind: 'brand' },
  { pattern: 'browserstack', replacement: 'BrowserStack', kind: 'brand' },
  { pattern: 'eslint', replacement: 'ESLint', kind: 'brand' },
  { pattern: 'ffmpeg', replacement: 'FFmpeg', kind: 'brand' },
  { pattern: 'github', replacement: 'GitHub', kind: 'brand' },
  { pattern: 'graphql', replacement: 'GraphQL', kind: 'brand' },
  { pattern: 'istanbul', replacement: 'Istanbul', kind: 'brand' },
  { pattern: 'javascript', replacement: 'JavaScript', kind: 'brand' },
  { pattern: 'jest', replacement: 'Jest', kind: 'brand' },
  { pattern: 'jquery(?!-)', replacement: 'jQuery', kind: 'brand' },
  { pattern: 'jsdoc', replacement: 'JSDoc', kind: 'brand' },
  { pattern: 'lodash', replacement: 'Lodash', kind: 'brand' },
  { pattern: 'mocha', replacement: 'Mocha', kind: 'brand' },
  { pattern: 'saucelabs', replacement: 'Sauce Labs', kind: 'brand' },
  { pattern: 'typescript', replacement: 'TypeScript', kind: 'brand' },
  { pattern: 'vscode', replacement: 'VS Code', kind: 'brand' },
  { pattern: 'webkit', replacement: 'WebKit', kind: 'brand' },
  { pattern: 'websocket(s?)', replacement: 'WebSocket$1', kind: 'brand' },
  { pattern: 'xvfb', replacement: 'Xvfb', kind: 'brand' },
  { pattern: 'youtube', replacement: 'YouTube', kind: 'brand' },

  // `word` rather than `brand` so a sentence-initial "Iframes" is left alone;
  // the error being corrected is the interior capital in "iFrame".
  { pattern: 'iframe(s?)', replacement: 'iframe$1', kind: 'word' },

  // Hyphenation and spelling with a single accepted form
  { pattern: 'e-mail(s?)', replacement: 'email$1', kind: 'word' },
  { pattern: 'end to end', replacement: 'end-to-end', kind: 'word' },
  { pattern: 'retr(?:y|i)ability', replacement: 'retry-ability', kind: 'word' },
  { pattern: 'gaurantee(s|d)?', replacement: 'guarantee$1', kind: 'word' },

  // American spelling
  { pattern: 'behaviour(s|al)?', replacement: 'behavior$1', kind: 'word' },
  { pattern: 'cancell(ed|ing)', replacement: 'cancel$1', kind: 'word' },
  { pattern: 'centre(s?)', replacement: 'center$1', kind: 'word' },
  { pattern: 'colour(s|ed|ing)?', replacement: 'color$1', kind: 'word' },
  { pattern: 'customis(e|ed|ing|ation)', replacement: 'customiz$1', kind: 'word' },
  { pattern: 'favourite(s?)', replacement: 'favorite$1', kind: 'word' },
  { pattern: 'labell(ed|ing)', replacement: 'label$1', kind: 'word' },
  { pattern: 'organis(e|ed|ing|ation|ations)', replacement: 'organiz$1', kind: 'word' },

  // Inclusive language. "allowlist" takes "an", so the article is absorbed into
  // the match; this rule has to precede the bare one to win the overlap.
  { pattern: 'a whitelist', replacement: 'an allowlist', kind: 'word' },
  { pattern: 'blacklist(s|ed|ing)?', replacement: 'blocklist$1', kind: 'word' },
  { pattern: 'whitelist(s|ed|ing)?', replacement: 'allowlist$1', kind: 'word' },
  { pattern: '\\(s\\)he', replacement: 'they', kind: 'word' },
  { pattern: 'he or she', replacement: 'they', kind: 'word' },
  { pattern: 'he/she', replacement: 'they', kind: 'word' },
]

// Adjacent `.` or `/` means the match is part of a path or hostname rather than
// prose — `.github/workflows/main.yml` is a filename, not a misspelled brand.
const RULES = TERMS.map((term) => ({
  ...term,
  regex: new RegExp(`(?<![-\\w./])(?:${term.pattern})(?![-\\w/])`, 'gi'),
}))

/** Recursively collect .md/.mdx files. */
function collectDocs(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectDocs(full, files)
    else if (/\.mdx?$/.test(entry.name)) files.push(full)
  }
  return files
}

/**
 * Blank out fenced code by tracking fence openers and closers line by line.
 * Pairing fences with a regex mis-associates them as soon as one block quotes
 * a fence of its own, which silently exposes the code inside to the term rules.
 */
function maskFencedCode(content) {
  let fence = null
  return content
    .split('\n')
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)
      if (fence) {
        const closes = marker && marker[1][0] === fence[0] && marker[1].length >= fence.length
        if (closes) fence = null
        return line.replace(/[^\n]/g, ' ')
      }
      if (marker) {
        fence = marker[1]
        return line.replace(/[^\n]/g, ' ')
      }
      return line
    })
    .join('\n')
}

/**
 * Blank out every region that isn't prose, preserving offsets and newlines so
 * matches found in the mask map back onto the original text.
 */
function maskNonProse(content) {
  let out = maskFencedCode(content)

  const patterns = [
    /^---\r?\n[\s\S]*?\r?\n---/, // frontmatter
    /^ {4,}\S[^\n]*$/gm, // indented code
    /`[^`\n]*`/g, // inline code
    /<!--[\s\S]*?-->/g, // html comments
    /^import [^\n]*$|^export [^\n]*$/gm, // mdx imports/exports
    /<\/?[A-Za-z][^>]*>/g, // jsx and html tags, attributes may span lines
    /\{[^{}\n]*\}/g, // mdx expressions and heading ids
    /\]\([^)\n]*\)/g, // link and image targets
    /^\[[^\]\n]+\]:[^\n]*$/gm, // link reference definitions
    /https?:\/\/\S+/g, // bare urls
    // Double-quoted spans are verbatim quotes of a UI label or an error
    // message. Correcting someone else's string makes the docs describe
    // something the reader will not find on screen.
    /"[^"\n]{1,200}"/g,
  ]

  for (const pattern of patterns) {
    out = out.replace(pattern, (match) => match.replace(/[^\n]/g, ' '))
  }

  return out
}

/** Apply the match's leading capitalization to the replacement. */
function matchCase(matched, replacement) {
  if (!/^[A-Z]/.test(matched)) return replacement
  return replacement.charAt(0).toUpperCase() + replacement.slice(1)
}

function lineOf(content, index) {
  return content.slice(0, index).split('\n').length
}

/**
 * @returns {{ findings: {line: number, matched: string, suggestion: string, inHeading: boolean}[], fixed: string }}
 */
function checkContent(content) {
  const prose = maskNonProse(content)
  const findings = []
  /** @type {{ start: number, end: number, text: string }[]} */
  const edits = []

  for (const rule of RULES) {
    rule.regex.lastIndex = 0
    let match
    while ((match = rule.regex.exec(prose)) !== null) {
      const start = match.index
      const end = start + match[0].length
      // Two rules can cover the same words. Applying both would corrupt the
      // text, so the rule declared first in TERMS keeps the span.
      if (edits.some((edit) => start < edit.end && end > edit.start)) continue

      const matched = content.slice(start, end)
      let suggestion = matched.replace(
        new RegExp(`^(?:${rule.pattern})$`, 'i'),
        rule.replacement
      )
      if (rule.kind === 'word') suggestion = matchCase(matched, suggestion)
      if (suggestion === matched) continue

      const line = lineOf(content, match.index)
      const lineText = content.split('\n')[line - 1] || ''
      findings.push({
        line,
        matched,
        suggestion,
        inHeading: /^#{1,6}\s/.test(lineText),
      })
      edits.push({ start, end, text: suggestion })
    }
  }

  edits.sort((a, b) => b.start - a.start)
  let fixed = content
  for (const edit of edits) {
    fixed = fixed.slice(0, edit.start) + edit.text + fixed.slice(edit.end)
  }

  findings.sort((a, b) => a.line - b.line)
  return { findings, fixed }
}

function main() {
  const fix = process.argv.includes('--fix')
  const files = collectDocs(DOCS_DIR)
  const problems = []
  let fixedFiles = 0
  let fixedTerms = 0
  const headingChanges = []

  for (const file of files) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/')
    if (IGNORED.has(rel)) continue

    const content = fs.readFileSync(file, 'utf8')
    const { findings, fixed } = checkContent(content)
    if (!findings.length) continue

    for (const finding of findings) {
      if (finding.inHeading) headingChanges.push(`${rel}:${finding.line}`)
    }

    if (fix) {
      fs.writeFileSync(file, fixed)
      fixedFiles++
      fixedTerms += findings.length
    } else {
      for (const { line, matched, suggestion } of findings) {
        problems.push(`${rel}:${line}  "${matched}" → "${suggestion}"`)
      }
    }
  }

  // Casing changes inside a heading change its anchor, which breaks any link
  // pointing at the old one. The Docusaurus build catches in-repo links
  // (`onBrokenAnchors: 'throw'`) but nothing catches inbound external links.
  if (headingChanges.length) {
    console.warn(
      `\n⚠ ${headingChanges.length} term(s) sit inside a heading; fixing them changes the anchor:\n` +
        headingChanges.map((h) => `    ${h}`).join('\n')
    )
  }

  if (fix) {
    console.log(`Terminology: fixed ${fixedTerms} term(s) in ${fixedFiles} file(s).`)
    return
  }

  if (problems.length) {
    console.error(`\nTerminology lint found ${problems.length} problem(s):\n`)
    problems.forEach((p) => console.error(`  ✖ ${p}`))
    console.error('\nRun "npm run lint:terminology:fix" to auto-fix.')
    process.exit(1)
  }

  console.log(`Terminology OK in ${files.length} doc(s).`)
}

if (require.main === module) main()

module.exports = { checkContent, maskNonProse }

// @ts-check
/**
 * Lints (and optionally fixes) the frontmatter of all docs.
 *
 * Two responsibilities:
 *   1. Normalize the order of frontmatter keys to a single canonical order
 *      so every doc lists `title`, `description`, `sidebar_label`, ... in the
 *      same sequence.
 *   2. Enforce that every doc declares a non-empty `title`, `description`, and
 *      `sidebar_label`.
 *
 * Usage:
 *   node scripts/lint-frontmatter.js          # check only, non-zero exit on problems
 *   node scripts/lint-frontmatter.js --fix     # reorder keys in place
 *
 * Partial files (anything under docs/partials or named `_*.mdx`) are skipped:
 * they are fragments included into other pages and intentionally have no
 * frontmatter.
 */
const fs = require('fs')
const path = require('path')

const DOCS_DIR = path.join(__dirname, '..', 'docs')

// The canonical order. Any key present in a file's frontmatter is emitted in
// this order; the first three are also required to be present and non-empty.
const REQUIRED_KEYS = ['title', 'description', 'sidebar_label']
const KEY_ORDER = [
  'title',
  'description',
  'sidebar_label',
  'sidebar_position',
  'slug',
  'hide_table_of_contents',
  'sidebar_custom_props',
  'e2eSpecific',
  'componentSpecific',
]

/** Recursively collect .md/.mdx files, skipping partials. */
function collectDocs(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectDocs(full, files)
    } else if (/\.mdx?$/.test(entry.name)) {
      const isPartial =
        entry.name.startsWith('_') ||
        path.relative(DOCS_DIR, full).split(path.sep).includes('partials')
      if (!isPartial) files.push(full)
    }
  }
  return files
}

/**
 * Parse the leading frontmatter block of a file.
 * Returns null if the file has no frontmatter.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const block = match[1]
  const newline = content.includes('\r\n') ? '\r\n' : '\n'
  const lines = block.split(/\r?\n/)
  /** @type {{ key: string, line: string }[]} */
  const entries = []
  for (const line of lines) {
    const keyMatch = line.match(/^([A-Za-z0-9_]+):(.*)$/)
    if (keyMatch) {
      entries.push({ key: keyMatch[1], line, value: keyMatch[2].trim() })
    } else {
      // Unexpected continuation / nested line — preserve it attached to the
      // previous key so we never lose content.
      if (entries.length) entries[entries.length - 1].line += newline + line
    }
  }
  return { raw: match[0], block, entries, newline }
}

/** Return entries reordered to the canonical key order. */
function reorder(entries) {
  const rank = (key) => {
    const i = KEY_ORDER.indexOf(key)
    return i === -1 ? KEY_ORDER.length : i
  }
  // Stable sort so unknown keys keep their relative order at the end.
  return entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => rank(a.e.key) - rank(b.e.key) || a.i - b.i)
    .map(({ e }) => e)
}

function main() {
  const fix = process.argv.includes('--fix')
  const files = collectDocs(DOCS_DIR)
  const errors = []
  let fixedCount = 0

  for (const file of files) {
    const rel = path.relative(path.join(__dirname, '..'), file)
    const content = fs.readFileSync(file, 'utf8')
    const fm = parseFrontmatter(content)

    if (!fm) {
      errors.push(`${rel}: missing frontmatter block`)
      continue
    }

    const present = new Set(fm.entries.map((e) => e.key))
    for (const key of REQUIRED_KEYS) {
      const entry = fm.entries.find((e) => e.key === key)
      if (!entry) {
        errors.push(`${rel}: missing required frontmatter "${key}"`)
      } else if (entry.value === '' || /^(''|"")$/.test(entry.value)) {
        errors.push(`${rel}: required frontmatter "${key}" must not be empty`)
      }
    }

    const ordered = reorder(fm.entries)
    const isOrdered = ordered.every((e, i) => e === fm.entries[i])

    if (!isOrdered) {
      if (fix) {
        const newBlock = ordered.map((e) => e.line).join(fm.newline)
        const newFrontmatter = `---${fm.newline}${newBlock}${fm.newline}---`
        fs.writeFileSync(file, content.replace(fm.raw, newFrontmatter))
        fixedCount++
      } else {
        const expected = ordered.map((e) => e.key).join(', ')
        const actual = fm.entries.map((e) => e.key).join(', ')
        errors.push(
          `${rel}: frontmatter keys out of order\n    expected: ${expected}\n    actual:   ${actual}`
        )
      }
    }
  }

  if (fix) {
    console.log(`Frontmatter normalized in ${fixedCount} file(s).`)
  }

  if (errors.length) {
    console.error(`\nFrontmatter lint found ${errors.length} problem(s):\n`)
    errors.forEach((e) => console.error(`  ✖ ${e}`))
    if (!fix) {
      console.error(
        '\nRun "npm run lint:frontmatter:fix" to auto-fix key ordering.'
      )
    }
    process.exit(1)
  }

  console.log(`Frontmatter OK in ${files.length} doc(s).`)
}

main()

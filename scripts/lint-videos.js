// @ts-check
/**
 * Fails when a YouTube <DocsVideo> embed in docs/ has no valid 11-character
 * video ID in its `src`, such as a truncated ID. A broken ID leaves the embed
 * unplayable and skips its VideoObject structured data, and the build only
 * warns about it, so this check turns it into a CI failure.
 *
 * Usage:
 *   node scripts/lint-videos.js   # non-zero exit on problems
 *
 * Partials are scanned too, since they can embed videos. Per-directory agent
 * instructions (`AGENTS.md` / `CLAUDE.md`) are skipped: they are guidance for
 * coding agents rather than pages.
 */
const fs = require('fs')
const path = require('path')
const { findInvalidYouTubeEmbeds } = require('../plugins/video-structured-data')

const ROOT_DIR = path.join(__dirname, '..')
const DOCS_DIR = path.join(ROOT_DIR, 'docs')

// Agent instructions, not pages. Kept in sync with the docs `exclude` list in
// `docusaurus.config.js`.
const AGENT_INSTRUCTION_FILES = new Set(['AGENTS.md', 'CLAUDE.md'])

/** Recursively collect .md/.mdx files, skipping agent instructions. */
function collectDocs(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectDocs(full, files)
    } else if (
      /\.mdx?$/.test(entry.name) &&
      !AGENT_INSTRUCTION_FILES.has(entry.name)
    ) {
      files.push(full)
    }
  }
  return files
}

function main() {
  const errors = []
  for (const file of collectDocs(DOCS_DIR)) {
    const content = fs.readFileSync(file, 'utf8')
    if (!content.includes('youtube')) continue
    const rel = path.relative(ROOT_DIR, file)
    for (const { line, src } of findInvalidYouTubeEmbeds(content)) {
      errors.push(`${rel}:${line}: invalid YouTube embed src "${src}"`)
    }
  }

  if (errors.length) {
    console.error(`\nVideo lint found ${errors.length} problem(s):\n`)
    errors.forEach((e) => console.error(`  ✖ ${e}`))
    console.error(
      '\nA YouTube <DocsVideo> src must be https://www.youtube.com/embed/<id> or' +
        ' https://youtube.com/embed/<id>, where <id> is the 11-character video ID' +
        ' from the watch URL (youtube.com/watch?v=<id>).'
    )
    process.exit(1)
  }
  console.log('Video embeds OK.')
}

main()

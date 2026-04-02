import fs from 'fs'
import { spawnSync } from 'child_process'
import path from 'path'

/** Matches `.md`, `.mdx`, or `.markdown` at end of path (case-insensitive). */
const MARKDOWN_EXT_RE = /\.(md|mdx|markdown)$/i

/**
 * Normalizes path separators to `/` for URLs and stable cross-platform output.
 */
export function toPosixPath(p: string): string {
  return p.replace(/\\/g, '/')
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true })
}

/**
 * Produces a URL-safe slug from heading text (aligned with typical anchor behavior).
 */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[`"'’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

/**
 * Rough word count for filtering and chunk sizing (split on whitespace).
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Heuristic token estimate for LLM context sizing (~0.75 tokens per word).
 */
export function tokenizeCount(str: string): number {
  return Math.round(countWords(str) * 0.75)
}

/**
 * Parses a markdown ATX heading line, or returns null if not a heading.
 */
/**
 * Removes MDX/JSX (PascalCase components) from inline text, for headings and titles.
 * Handles self-closing tags and simple paired tags with no nested markup inside.
 */
export function stripMdxJsxFromInlineText(text: string): string {
  let prev = ''
  let s = text
  while (s !== prev) {
    prev = s
    s = s.replace(/<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?>([^<]*)<\/\1>/g, '$2')
    s = s.replace(/<[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\/>/g, '')
  }
  s = s.replace(/\[\s*\]\([^)]*\)/g, '')
  return s.replace(/\s{2,}/g, ' ').trim()
}

export function parseHeadingLine(trimmedLine: string): { level: number; text: string } | null {
  const m = /^(#{1,6})\s+(.*)/.exec(trimmedLine)
  if (!m) return null
  return { level: m[1].length, text: m[2].trim() }
}

/**
 * Net nesting delta for PascalCase MDX/JSX component tags on a line (order-preserving scan).
 * Opening `<Name>` → +1; closing `</Name>` → -1; self-closing `<Name .../>` → 0.
 * Lowercase tags (e.g. `<div>`) are skipped so they do not affect depth.
 */
export function computeJsxPascalTagDepthDelta(line: string): number {
  let delta = 0
  let i = 0
  while (i < line.length) {
    const lt = line.indexOf('<', i)
    if (lt === -1) break
    const rest = line.slice(lt)
    const closeMatch = /^<\/([A-Z][A-Za-z0-9]*)\s*>/.exec(rest)
    if (closeMatch) {
      delta -= 1
      i = lt + closeMatch[0].length
      continue
    }
    const selfCloseMatch = /^<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?\/>/.exec(rest)
    if (selfCloseMatch) {
      i = lt + selfCloseMatch[0].length
      continue
    }
    const openMatch = /^<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?>/.exec(rest)
    if (openMatch) {
      delta += 1
      i = lt + openMatch[0].length
      continue
    }
    i = lt + 1
  }
  return delta
}

/**
 * Strips a markdown file extension from a path segment (e.g. doc id without suffix).
 */
export function stripMarkdownExtension(pathStr: string): string {
  return pathStr.replace(MARKDOWN_EXT_RE, '')
}

/**
 * Replaces the markdown extension with another (e.g. `.md` or `.json`).
 */
export function replaceMarkdownExtension(pathStr: string, newExt: string): string {
  const ext = newExt.startsWith('.') ? newExt : `.${newExt}`
  return pathStr.replace(MARKDOWN_EXT_RE, ext)
}

/**
 * Returns current `git rev-parse HEAD`, or null if unavailable.
 */
export function getGitSha(cwd: string): string | null {
  try {
    const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' })
    if (result.status === 0) return result.stdout.trim()
  } catch {
    // non-git checkout or git missing
  }
  return null
}

/**
 * Reads `MDXComponents.js` and maps partial basenames (e.g. `_foo.mdx`) to React import names.
 */
export function loadPartialsFileToComponentName(mdxComponentsPath: string): Record<string, string> {
  const map: Record<string, string> = {}
  if (!fs.existsSync(mdxComponentsPath)) return map

  const src = fs.readFileSync(mdxComponentsPath, 'utf8')
  // import Foo from "@site/docs/partials/_bar.mdx";
  const importRe =
    /^import\s+([A-Za-z][A-Za-z0-9]*)\s+from\s+["']@site\/docs\/partials\/([^"']+)["']/

  for (const line of src.split('\n')) {
    const m = importRe.exec(line.trim())
    if (!m) continue
    const basename = path.posix.basename(toPosixPath(m[2]))
    map[basename] = m[1]
  }
  return map
}

/**
 * Recursively counts `.md` and `.json` files under `rootDir` (e.g. `dist/llm`).
 */
export function countMarkdownAndJsonFiles(rootDir: string): { markdown: number; json: number } {
  const counts = { markdown: 0, json: 0 }
  if (!fs.existsSync(rootDir)) return counts

  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.isFile()) {
        if (/\.md$/i.test(entry.name)) counts.markdown++
        else if (/\.json$/i.test(entry.name)) counts.json++
      }
    }
  }

  walk(rootDir)
  return counts
}

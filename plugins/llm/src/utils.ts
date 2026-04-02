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
export function parseHeadingLine(trimmedLine: string): { level: number; text: string } | null {
  const m = /^(#{1,6})\s+(.*)/.exec(trimmedLine)
  if (!m) return null
  return { level: m[1].length, text: m[2].trim() }
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

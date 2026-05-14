import fs from 'fs'
import { spawnSync } from 'child_process'
import path from 'path'

import { LlmExportConfig } from './types'

export const DEFAULT_LLM_EXPORT_CONFIG: LlmExportConfig = {
  url: 'https://docs.cypress.io',
  includeSections: ['accessibility', 'api', 'app', 'cloud', 'ui-coverage'],
  emit: { json: true },
  chunk: { minHeadingLevel: 2, minContentWords: 30 },
}

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

export function writeFile(filePath: string, data: string): void {
  fs.writeFileSync(filePath, data, 'utf8')
}

/** Writes `data` as formatted JSON (UTF-8). Parent directory must exist. */
export function writeJsonFile(filePath: string, data: unknown): void {
  writeFile(filePath, JSON.stringify(data, null, 2))
}

/** Collects all markdown / MDX source files under `dir` (recursive). */
export function walkDocs(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDocs(fullPath, files)
    }
    else if (entry.isFile() && /\.(md|mdx|markdown)$/i.test(entry.name)) {
      files.push(fullPath)
    }
  }
  return files
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
 * Heuristic token estimate for LLM context sizing (~0.75 words per token for English,
 * i.e. ~4/3 tokens per word — aligned with common “100 tokens ≈ 75 words” guidance).
 */
export function tokenizeCount(str: string): number {
  return Math.round(countWords(str) / 0.75)
}

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

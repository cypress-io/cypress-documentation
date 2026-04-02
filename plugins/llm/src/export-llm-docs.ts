/* eslint-disable no-console */

/**
 * LLM-oriented export of the Docusaurus docs tree.
 *
 * Pipeline:
 * 1. Walk `docs/` for `.md`/`.mdx`, filter by configured sections.
 * 2. Normalize MDX (strip imports/exports, inline configured partials) and write flat markdown under `dist/llm/markdown/`.
 * 3. Optionally emit per-doc JSON + chunk index under `dist/llm/json/` for retrieval / RAG-style use.
 * 4. Write `dist/llms.json` (site manifest) and per-directory `index.md` listings under the markdown export root.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Chunk, HeadingMeta, LlmExportConfig } from './types'
import {
  countMarkdownAndJsonFiles,
  countWords,
  ensureDir,
  getGitSha,
  loadPartialsFileToComponentName,
  parseHeadingLine,
  replaceMarkdownExtension,
  slugify,
  stripMarkdownExtension,
  toPosixPath,
  tokenizeCount,
} from './utils'

const ROOT = process.cwd()
const DOCS_ROOT = path.join(ROOT, 'docs')
const DIST_ROOT = path.join(ROOT, 'dist')
const EXPORT_ROOT = path.join(DIST_ROOT, 'llm')
const MARKDOWN_ROOT = path.join(EXPORT_ROOT, 'markdown')
const JSON_ROOT = path.join(EXPORT_ROOT, 'json')
const PARTIALS_SECTION = 'partials'
const PARTIALS_DIR = path.join(DOCS_ROOT, PARTIALS_SECTION)
const MDX_COMPONENTS_PATH = path.join(ROOT, 'src/theme/MDXComponents.js')

const CONFIG: LlmExportConfig = {
  includeSections: ['accessibility', 'api', 'app', 'cloud', 'ui-coverage', 'partials'],
  partialsMode: 'inline',
  emit: { json: true },
  chunk: { minHeadingLevel: 2, minContentWords: 30 },
}

/** Recursively writes `index.md` in each directory under `rootDir`, listing sibling `.md` files and subfolders. */
function buildMarkdownDirectoryIndexes(rootDir: string): void {
  function processDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const subdirs: string[] = []
    const files: string[] = []

    for (const entry of entries) {
      if (entry.isDirectory()) subdirs.push(entry.name)
      else if (entry.isFile() && /\.md$/i.test(entry.name) && entry.name.toLowerCase() !== 'index.md') {
        files.push(entry.name)
      }
    }

    // Recurse first so child indexes exist before parent links to them
    for (const sub of subdirs) processDir(path.join(dir, sub))

    const relFromRoot = toPosixPath(path.relative(rootDir, dir))
    const isRoot = relFromRoot === ''
    const dirName = isRoot ? 'Docs' : path.basename(dir)
    const lines: string[] = [`# ${dirName}`, '']

    if (files.length) {
      lines.push('## Pages', '')
      for (const file of files.sort()) {
        lines.push(`- [${file.replace(/\.md$/i, '')}](${encodeURI(file)})`)
      }
      lines.push('')
    }
    if (subdirs.length) {
      lines.push('## Sections', '')
      for (const sub of subdirs.sort()) {
        lines.push(`- [${sub}](${encodeURI(path.posix.join(sub, 'index.md'))})`)
      }
      lines.push('')
    }

    fs.writeFileSync(path.join(dir, 'index.md'), lines.join('\n'), 'utf8')
  }

  processDir(rootDir)
}

/** Collects all markdown files under `dir` (recursive). */
function walkDocs(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walkDocs(fullPath, files)
    else if (entry.isFile() && /\.(md|mdx|markdown)$/i.test(entry.name)) files.push(fullPath)
  }
  return files
}

/**
 * Strips MDX-only syntax and optionally replaces imported partial components with their normalized markdown bodies.
 */
function normalizeContent(raw: string, inlinePartialsByComponentName: Record<string, string> | null): string {
  const lines = raw.split('\n')
  const out: string[] = []
  let inComponentBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (/^export\s/.test(trimmed)) continue
    if (/^import\s/.test(trimmed)) continue
    if (/^:{3,}/.test(trimmed)) continue

    if (inComponentBlock) {
      if (trimmed.endsWith('/>') || /^<\/[A-Z]/.test(trimmed)) inComponentBlock = false
      continue
    }

    if (/^<[A-Z]/.test(trimmed)) {
      const selfClosingMatch = /^<([A-Z][A-Za-z0-9]*)\b[^>]*\/>(.*)$/.exec(trimmed)
      const openCloseMatch = /^<([A-Z][A-Za-z0-9]*)\s*>\s*<\/\1>/.exec(trimmed)
      const componentName =
        (selfClosingMatch && selfClosingMatch[1]) || (openCloseMatch && openCloseMatch[1]) || null

      if (componentName && inlinePartialsByComponentName?.[componentName]) {
        out.push(inlinePartialsByComponentName[componentName].trimEnd())
        continue
      }
      if (selfClosingMatch) {
        const trailing = selfClosingMatch[2].trim()
        if (trailing) out.push(trailing)
        continue
      }
      if (!(trimmed.endsWith('/>') || /^<\/[A-Z]/.test(trimmed))) inComponentBlock = true
      continue
    }

    out.push(line)
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/** Loads normalized partial bodies keyed by component name when `partials` is included in config. */
function loadPartialsMap(config: LlmExportConfig): Record<string, string> {
  const mapByComponentName: Record<string, string> = {}
  if (
    !Array.isArray(config.includeSections) ||
    (config.includeSections.length > 0 && !config.includeSections.includes(PARTIALS_SECTION))
  ) {
    return mapByComponentName
  }
  if (!fs.existsSync(PARTIALS_DIR)) return mapByComponentName

  const fileToComponentName = loadPartialsFileToComponentName(MDX_COMPONENTS_PATH)

  for (const absPath of walkDocs(PARTIALS_DIR)) {
    const parsed = matter(fs.readFileSync(absPath, 'utf8'))
    const normalized = normalizeContent(parsed.content, null)
    const fileName = path.basename(absPath)
    const baseName = stripMarkdownExtension(fileName)
    const stripped = baseName.replace(/^_+/, '')
    const fallbackName = stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : 'Partial'
    mapByComponentName[fileToComponentName[fileName] ?? fallbackName] = normalized
  }

  return mapByComponentName
}

function extractTitleFromContent(content: string): string | null {
  for (const line of content.split('\n')) {
    const h = parseHeadingLine(line.trim())
    if (h) return h.text
  }
  return null
}

/** Ensures content starts with a single `#` title line (uses `title` if missing). */
function ensureTopHeading(content: string, title: string): string {
  for (const line of content.split('\n')) {
    if (line.trim() === '') continue
    if (/^#\s+/.test(line.trim())) return content
    break
  }
  return `# ${title}\n\n${content}`
}

type HeadingRow = { index: number; level: number; text: string; slug: string; id: string }

/**
 * Splits markdown into chunks by headings at or above `minHeadingLevel`, dropping chunks under `minContentWords`.
 */
function buildChunks(
  docId: string,
  section: string,
  sourcePath: string,
  markdown: string,
  minHeadingLevel: number,
  minContentWords: number,
): { chunks: Chunk[]; headingMeta: HeadingMeta[] } {
  const lines = markdown.split('\n')
  const headings: HeadingRow[] = []

  for (let i = 0; i < lines.length; i++) {
    const parsed = parseHeadingLine(lines[i].trim())
    if (parsed) {
      const slug = slugify(parsed.text)
      headings.push({
        index: i,
        level: parsed.level,
        text: parsed.text,
        slug,
        id: `${docId}#${slug}`,
      })
    }
  }

  const chunks: Chunk[] = []
  for (let idx = 0; idx < headings.length; idx++) {
    const h = headings[idx]
    if (h.level < minHeadingLevel) continue

    let end = lines.length
    for (let j = idx + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) {
        end = headings[j].index
        break
      }
    }

    const content = lines.slice(h.index, end).join('\n').trim()
    if (countWords(content) < minContentWords) continue

    chunks.push({
      id: h.id,
      doc_id: docId,
      heading: h.text,
      heading_level: h.level,
      content_markdown: `${content}\n`,
      section,
      path: sourcePath,
      anchors: [h.slug],
      token_estimate: tokenizeCount(content),
    })
  }

  const headingMeta: HeadingMeta[] = headings.map((h) => ({ id: h.id, text: h.text, level: h.level }))
  return { chunks, headingMeta }
}

function buildManifest(config: LlmExportConfig, generatedAt: string): void {
  const manifest = {
    site_name: 'Cypress Documentation',
    description:
      'Cypress is an open-source, JavaScript-based testing framework for anything that runs in a browser. It targets front-end developers and QA engineers building modern web applications. Unlike WebDriver-based tools, Cypress runs directly inside the browser alongside your application, giving it native access to the DOM, network layer, and application state.',
    last_updated: generatedAt,
    root_url: 'https://docs.cypress.io',
    files: [
      {
        url: '/',
        format: 'html',
        intended_for: ['human'],
        description: 'The index page of the Cypress Documentation.',
      },
      {
        url: '/llm/markdown/index.md',
        format: 'markdown',
        intended_for: ['human', 'llm'],
        description: 'The index page of the Cypress Documentation in markdown format.',
      },
    ],
  }

  if (config.emit?.json) {
    manifest.files.push({
      url: '/llm/json/index.json',
      format: 'json',
      intended_for: ['llm'],
      description: 'The index page of the Cypress Documentation in JSON format.',
    })
  }

  fs.writeFileSync(path.join(DIST_ROOT, 'llms.json'), JSON.stringify(manifest, null, 2), 'utf8')
}

export async function runLlmExport(): Promise<void> {
  const startedAt = performance.now()
  const config = CONFIG

  ensureDir(MARKDOWN_ROOT)
  ensureDir(JSON_ROOT)

  const files = walkDocs(DOCS_ROOT)
  const allChunks: Chunk[] = []
  const generatedAt = new Date().toISOString()
  const gitSha = getGitSha(ROOT)
  const partialsByComponentName =
    config.partialsMode === 'inline' ? loadPartialsMap(config) : ({} as Record<string, string>)

  for (const absPath of files) {
    const relFromDocs = toPosixPath(path.relative(DOCS_ROOT, absPath))
    const section = relFromDocs.split('/')[0] || ''

    if (Array.isArray(config.includeSections) && config.includeSections.length > 0) {
      if (!config.includeSections.includes(section)) continue
    }
    if (config.partialsMode === 'inline' && section === PARTIALS_SECTION) continue

    const sourcePath = toPosixPath(path.relative(ROOT, absPath))
    const id = stripMarkdownExtension(relFromDocs)
    const raw = fs.readFileSync(absPath, 'utf8')
    const parsed = matter(raw)
    const normalizedBody = normalizeContent(parsed.content, partialsByComponentName)

    const titleFromContent = extractTitleFromContent(normalizedBody)
    const title =
      (parsed.data && typeof (parsed.data as { title?: string }).title === 'string'
        ? (parsed.data as { title: string }).title
        : titleFromContent) || path.basename(id)

    const bodyWithHeading = ensureTopHeading(normalizedBody, title)
    const metadata: Record<string, unknown> = {
      ...(parsed.data || {}),
      id,
      title,
      section,
      source_path: sourcePath,
      version: (parsed.data as { version?: string } | undefined)?.version || gitSha || undefined,
      updated_at: generatedAt,
    }

    const markdownOut = matter.stringify(`${bodyWithHeading.trim()}\n`, metadata)
    const relOutPath = replaceMarkdownExtension(relFromDocs, '.md')
    const mdOutPath = path.join(MARKDOWN_ROOT, relOutPath)
    ensureDir(path.dirname(mdOutPath))
    fs.writeFileSync(mdOutPath, markdownOut, 'utf8')

    const jsonSourcePath = `/${toPosixPath(path.relative(DIST_ROOT, mdOutPath))}`
    const { chunks, headingMeta } = buildChunks(
      id,
      section,
      jsonSourcePath,
      bodyWithHeading,
      config.chunk?.minHeadingLevel ?? 2,
      config.chunk?.minContentWords ?? 30,
    )

    const jsonOutPath = path.join(JSON_ROOT, replaceMarkdownExtension(relFromDocs, '.json'))
    ensureDir(path.dirname(jsonOutPath))

    if (config.emit?.json) {
      fs.writeFileSync(
        jsonOutPath,
        JSON.stringify(
          {
            doc: {
              id,
              title,
              description: (metadata.description as string) || null,
              section,
              source_path: jsonSourcePath,
              version: (metadata.version as string) || null,
              updated_at: (metadata.updated_at as string) || null,
              headings: headingMeta,
            },
            chunks,
          },
          null,
          2,
        ),
        'utf8',
      )
    }

    allChunks.push(...chunks)
  }

  fs.writeFileSync(
    path.join(JSON_ROOT, 'index.json'),
    JSON.stringify(
      {
        build: { version: gitSha || null, generated_at: generatedAt },
        chunks: allChunks.map((c) => ({
          id: c.id,
          doc_id: c.doc_id,
          heading: c.heading,
          heading_level: c.heading_level,
          section: c.section,
          path: c.path,
          token_estimate: c.token_estimate,
        })),
      },
      null,
      2,
    ),
    'utf8',
  )

  buildManifest(config, generatedAt)

  buildMarkdownDirectoryIndexes(MARKDOWN_ROOT)

  const elapsedMs = Math.round(performance.now() - startedAt)
  const { markdown: outMarkdown, json: outJson } = countMarkdownAndJsonFiles(EXPORT_ROOT)
  const outTotal = outMarkdown + outJson

  // Output metrics
  // Note: File counts *are not* expected to match. Partials get dropped from the source docs, and markdown adds index files, so it is very unlikely the three counts will match.
  console.log(
    [
      'LLM Export complete.',
      `Time: ${elapsedMs}ms`,
      `Source docs scanned: ${files.length}`,
      `Chunks indexed: ${allChunks.length}`,
      `Output files under ${toPosixPath(path.relative(ROOT, EXPORT_ROOT))}/: ${outTotal} total`,
      `  — ${outMarkdown} markdown (.md)`,
      `  — ${outJson} json (.json)`,
    ].join('\n'),
  )
}

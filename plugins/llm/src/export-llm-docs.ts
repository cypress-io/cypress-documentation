/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { spawnSync } from 'child_process'
import { Chunk, HeadingMeta, LlmExportConfig } from './types'

const ROOT = process.cwd()
const DOCS_ROOT = path.join(ROOT, 'docs')
const DIST_ROOT = path.join(ROOT, 'dist')
const EXPORT_ROOT = path.join(DIST_ROOT, 'llm')
const MARKDOWN_ROOT = path.join(EXPORT_ROOT, 'markdown')
const JSON_ROOT = path.join(EXPORT_ROOT, 'json')
const PARTIALS_SECTION = 'partials'
const PARTIALS_DIR = path.join(DOCS_ROOT, PARTIALS_SECTION)

const CONFIG: LlmExportConfig = {
  includeSections: ['accessibility', 'api', 'app', 'cloud', 'ui-coverage', 'partials'],
  partialsMode: 'inline',
  emit: {
    json: true,
  },
  chunk: {
    minHeadingLevel: 2,
    minContentWords: 30,
  },
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true })
}

function buildMarkdownDirectoryIndexes(rootDir: string) {
  function processDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    const subdirs: string[] = []
    const files: string[] = []

    for (const entry of entries) {
      if (entry.isDirectory()) {
        subdirs.push(entry.name)
      } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
        if (entry.name.toLowerCase() === 'index.md') {
          continue
        }
        files.push(entry.name)
      }
    }

    // Recurse first so child indexes exist before we link to them
    for (const sub of subdirs) {
      processDir(path.join(dir, sub))
    }

    const relFromRoot = path.relative(rootDir, dir).replace(/\\/g, '/')
    const isRoot = relFromRoot === ''
    const dirName = isRoot ? 'Docs' : path.basename(dir)

    const lines: string[] = []
    lines.push(`# ${dirName}`)
    lines.push('')

    if (files.length) {
      lines.push('## Pages')
      lines.push('')
      for (const file of files.sort()) {
        const label = file.replace(/\.md$/i, '')
        const link = encodeURI(file)
        lines.push(`- [${label}](${link})`)
      }
      lines.push('')
    }

    if (subdirs.length) {
      lines.push('## Sections')
      lines.push('')
      for (const sub of subdirs.sort()) {
        const label = sub
        const link = encodeURI(path.posix.join(sub, 'index.md'))
        lines.push(`- [${label}](${link})`)
      }
      lines.push('')
    }

    const indexPath = path.join(dir, 'index.md')
    fs.writeFileSync(indexPath, lines.join('\n'), 'utf8')
  }

  processDir(rootDir)
}

function walkDocs(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDocs(fullPath, files)
    } else if (entry.isFile()) {
      if (/\.(md|mdx|markdown)$/i.test(entry.name)) {
        files.push(fullPath)
      }
    }
  }
  return files
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[`"'’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

function normalizeContent(raw: string, inlinePartialsByComponentName: Record<string, string> | null): string {
  const lines = raw.split('\n')
  const out: string[] = []
  let inComponentBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Strip MDX export lines
    if (/^export\s/.test(trimmed)) {
      continue
    }

    // Remove MDX import lines (handled separately when resolving partials)
    if (/^import\s/.test(trimmed)) {
      continue
    }

    // Strip Docusaurus-style admonition fences like ::::
    if (/^:{3,}/.test(trimmed)) {
      continue
    }

    // Inline known partial components, strip other JSX / MDX component blocks
    if (inComponentBlock) {
      if (trimmed.endsWith('/>') || /^<\/[A-Z]/.test(trimmed)) {
        inComponentBlock = false
      }
      continue
    }

    if (/^<[A-Z]/.test(trimmed)) {
      const selfClosingMatch = /^<([A-Z][A-Za-z0-9]*)\b[^>]*\/>(.*)$/.exec(trimmed)
      const openCloseMatch = /^<([A-Z][A-Za-z0-9]*)\s*>\s*<\/\1>/.exec(trimmed)

      const componentName =
        (selfClosingMatch && selfClosingMatch[1]) ||
        (openCloseMatch && openCloseMatch[1]) ||
        null

      if (componentName && inlinePartialsByComponentName && inlinePartialsByComponentName[componentName]) {
        out.push(inlinePartialsByComponentName[componentName].trimEnd())
        continue
      }

      // If this is a self-closing component with trailing text, strip the component
      // and keep the remaining markdown on the line, e.g.:
      // <Icon name="angle-right" /> **name _(String)_** -> **name _(String)_**
      if (selfClosingMatch) {
        const trailing = selfClosingMatch[2].trim()
        if (trailing) {
          out.push(trailing)
        }
        continue
      }

      if (!(trimmed.endsWith('/>') || /^<\/[A-Z]/.test(trimmed))) {
        inComponentBlock = true
      }
      continue
    }

    out.push(line)
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

function loadPartialsMap(config: LlmExportConfig): Record<string, string> {
  const mapByComponentName: Record<string, string> = {}

  // If partials section is not included, nothing to inline
  if (
    !Array.isArray(config.includeSections) ||
    (config.includeSections.length > 0 && !config.includeSections.includes(PARTIALS_SECTION))
  ) {
    return mapByComponentName
  }

  if (!fs.existsSync(PARTIALS_DIR)) {
    return mapByComponentName
  }

  const partialFiles = walkDocs(PARTIALS_DIR)

  for (const absPath of partialFiles) {
    const raw = fs.readFileSync(absPath, 'utf8')
    const parsed = matter(raw)
    const normalized = normalizeContent(parsed.content, null)

    const baseName = path.basename(absPath).replace(/\.(md|mdx|markdown)$/i, '')
    const stripped = baseName.replace(/^_+/, '')
    const defaultComponentName = stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : 'Partial'

    mapByComponentName[defaultComponentName] = normalized
  }

  return mapByComponentName
}

function extractTitleFromContent(content: string): string | null {
  const lines = content.split('\n')
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.*)/.exec(line.trim())
    if (m) {
      return m[2].trim()
    }
  }
  return null
}

function ensureTopHeading(content: string, title: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.trim() === '') continue
    if (/^#\s+/.test(line.trim())) {
      return content
    }
    break
  }
  const heading = `# ${title}\n\n`
  return heading + content
}

function tokenizeCount(str: string): number {
  const words = str.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  return Math.round(wordCount * 0.75)
}

function buildChunks(
  docId: string,
  section: string,
  sourcePath: string,
  markdown: string,
  minHeadingLevel: number,
  minContentWords: number,
): { chunks: Chunk[]; headingMeta: HeadingMeta[] } {
  const lines = markdown.split('\n')
  const headings: { index: number; level: number; text: string; slug: string; id: string }[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = /^(#{1,6})\s+(.*)/.exec(line.trim())
    if (m) {
      const level = m[1].length
      const text = m[2].trim()
      const slug = slugify(text)
      const id = `${docId}#${slug}`
      headings.push({ index: i, level, text, slug, id })
    }
  }

  const chunks: Chunk[] = []

  for (let idx = 0; idx < headings.length; idx++) {
    const h = headings[idx]
    if (h.level < minHeadingLevel) continue

    const start = h.index
    let end = lines.length

    for (let j = idx + 1; j < headings.length; j++) {
      const next = headings[j]
      if (next.level <= h.level) {
        end = next.index
        break
      }
    }

    const contentLines = lines.slice(start, end)
    const content = contentLines.join('\n').trim()
    const wordCount = content.split(/\s+/).filter(Boolean).length
    if (wordCount < minContentWords) {
      continue
    }

    chunks.push({
      id: h.id,
      doc_id: docId,
      heading: h.text,
      heading_level: h.level,
      content_markdown: content + '\n',
      section,
      path: sourcePath,
      anchors: [h.slug],
      token_estimate: tokenizeCount(content),
    })
  }

  const headingMeta: HeadingMeta[] = headings.map((h) => ({
    id: h.id,
    text: h.text,
    level: h.level,
  }))

  return { chunks, headingMeta }
}

function getGitSha(): string | null {
  try {
    const result = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
    })
    if (result.status === 0) {
      return result.stdout.trim()
    }
  } catch {
    // ignore
  }
  return null
}

function buildManifest(config: LlmExportConfig, generatedAt: string): void {
  const manifest = {
    site_name: 'Cypress Documentation',
    description: 'Cypress is an open-source, JavaScript-based testing framework for anything that runs in a browser. It targets front-end developers and QA engineers building modern web applications. Unlike WebDriver-based tools, Cypress runs directly inside the browser alongside your application, giving it native access to the DOM, network layer, and application state.',
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
  const config = CONFIG

  ensureDir(MARKDOWN_ROOT)
  ensureDir(JSON_ROOT)

  const files = walkDocs(DOCS_ROOT)
  const allChunks: Chunk[] = []

  const now = new Date()
  const generatedAt = now.toISOString()
  const gitSha = getGitSha()

  const partialsByComponentName =
    config.partialsMode === 'inline' ? loadPartialsMap(config) : ({} as Record<string, string>)

  for (const absPath of files) {
    const relFromDocs = path
      .relative(DOCS_ROOT, absPath)
      .replace(/\\/g, '/')
    const section = relFromDocs.split('/')[0] || ''

    if (Array.isArray(config.includeSections) && config.includeSections.length > 0) {
      if (!config.includeSections.includes(section)) {
        continue
      }
    }

    if (config.partialsMode === 'inline' && section === PARTIALS_SECTION) {
      // Skip emitting standalone artifacts for partials when they are inlined
      continue
    }

    const sourcePath = path
      .relative(ROOT, absPath)
      .replace(/\\/g, '/')
    const id = relFromDocs.replace(/\.(md|mdx|markdown)$/i, '')

    const raw = fs.readFileSync(absPath, 'utf8')
    const parsed = matter(raw)

    const normalizedBody = normalizeContent(parsed.content, partialsByComponentName)

    const titleFromContent = extractTitleFromContent(normalizedBody)
    const title =
      (parsed.data && typeof (parsed.data as any).title === 'string'
        ? (parsed.data as any).title
        : titleFromContent) || path.basename(id)

    const bodyWithHeading = ensureTopHeading(normalizedBody, title)

    const metadata: any = {
      ...(parsed.data || {}),
      id,
      title,
      section,
      source_path: sourcePath,
      version: (parsed.data as any)?.version || gitSha || undefined,
      updated_at: generatedAt,
    }

    const markdownOut = matter.stringify(bodyWithHeading.trim() + '\n', metadata)

    const relOutPath = relFromDocs.replace(/\.(md|mdx|markdown)$/i, '.md')
    const mdOutPath = path.join(MARKDOWN_ROOT, relOutPath)
    ensureDir(path.dirname(mdOutPath))

    fs.writeFileSync(mdOutPath, markdownOut, 'utf8')


    const jsonSourcePath = `/${path.relative(DIST_ROOT, mdOutPath)}`
      .replace(/\\/g, '/')
    const { chunks, headingMeta } = buildChunks(
      id,
      section,
      jsonSourcePath,
      bodyWithHeading,
      config.chunk?.minHeadingLevel ?? 2,
      config.chunk?.minContentWords ?? 30,
    )

    const jsonOutPath = path.join(JSON_ROOT, relFromDocs.replace(/\.(md|mdx|markdown)$/i, '.json'))
    ensureDir(path.dirname(jsonOutPath))

    if (config.emit?.json) {
      const docJson = {
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
      }

      fs.writeFileSync(jsonOutPath, JSON.stringify(docJson, null, 2), 'utf8')
    }

    allChunks.push(...chunks)

    const index = {
      build: {
        version: gitSha || null,
        generated_at: generatedAt,
      },
      chunks: allChunks.map((c) => ({
        id: c.id,
        doc_id: c.doc_id,
        heading: c.heading,
        heading_level: c.heading_level,
        section: c.section,
        path: c.path,
        token_estimate: c.token_estimate,
      })),
    }
  
    fs.writeFileSync(path.join(JSON_ROOT, 'index.json'), JSON.stringify(index, null, 2), 'utf8')
  }

  buildManifest(config, generatedAt)

  console.log(`LLM Export: Exported ${files.length} source files with ${allChunks.length} chunks.`)

  // Ensure every markdown directory has an index.md with a listing
  buildMarkdownDirectoryIndexes(MARKDOWN_ROOT)

  console.log('LLM Export: Wrote llms.json file')
}


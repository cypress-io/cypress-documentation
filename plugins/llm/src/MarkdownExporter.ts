import fs from 'fs'
import path from 'path'
import { ensureDir, parseHeadingLine, replaceMarkdownExtension, stripMarkdownExtension, toPosixPath } from './utils'
import matter from 'gray-matter'
import { normalizeContent } from './mdx-normalize'

export class MarkdownExporter {
  private readonly markdownRoot: string

  constructor(
    private readonly rootDir: string,
    exportRoot: string,
    private readonly partialsByComponentName: Record<string, string>,
  ) {
    this.markdownRoot = path.join(exportRoot, 'markdown')
  }

  exportFile(params: {
    section: string,
    siteDir: string,
    absPath: string,
    relFromDocs: string,
    generatedAt: string,
    gitSha: string | null,
  }) {
    const { section, siteDir, absPath, relFromDocs, generatedAt, gitSha } = params
    const sourcePath = toPosixPath(path.relative(siteDir, absPath))
    const id = stripMarkdownExtension(relFromDocs)
    const raw = fs.readFileSync(absPath, 'utf8')
    const parsed = matter(raw)
    
    const normalizedBody = normalizeContent(parsed.content, this.partialsByComponentName)

    const titleFromContent = this.extractTitleFromContent(normalizedBody)
    const title =
      (parsed.data && typeof (parsed.data as { title?: string }).title === 'string'
        ? (parsed.data as { title: string }).title
        : titleFromContent) || path.basename(id)

    
    const metadata: Record<string, string> = {
      ...(parsed.data || {}),
      id,
      title,
      section,
      source_path: sourcePath,
      version: (parsed.data as { version?: string } | undefined)?.version || gitSha || 'N/A',
      updated_at: generatedAt,
    }

    const bodyWithHeading = this.ensureTopHeading(normalizedBody, title)
    const markdownOut = matter.stringify(`${bodyWithHeading.trim()}\n`, metadata)
    const relOutPath = replaceMarkdownExtension(relFromDocs, '.md')
    const mdOutPath = path.join(this.markdownRoot, relOutPath)
    ensureDir(path.dirname(mdOutPath))
    fs.writeFileSync(mdOutPath, markdownOut, 'utf8')

    return {
      bodyWithHeading,
      mdOutPath,
      metadata,
    }
  }
/** Recursively writes `index.md` in each directory under `rootDir`, listing sibling `.md` files and subfolders. */
  buildMarkdownDirectoryIndexes(): void {
    ensureDir(this.markdownRoot)
    this.processDir(this.rootDir)
  }

  private extractTitleFromContent(content: string): string | null {
    for (const line of content.split('\n')) {
      const h = parseHeadingLine(line.trim())
      if (h) return h.text
    }
    return null
  }
  
  /** Ensures content starts with a single `#` title line (uses `title` if missing). */
  private ensureTopHeading(content: string, title: string): string {
    for (const line of content.split('\n')) {
      if (line.trim() === '') continue
      if (/^#\s+/.test(line.trim())) return content
      break
    }
    return `# ${title}\n\n${content}`
  }

  private processDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const subdirs: string[] = []
    const files: string[] = []

    for (const entry of entries) {
      if (entry.isDirectory()) subdirs.push(entry.name)
      else if (entry.isFile() && /\.md$/i.test(entry.name) && entry.name.toLowerCase() !== 'index.md') {
        files.push(entry.name)
      }
    }

    for (const sub of subdirs) {
      this.processDir(path.join(dir, sub))
    }

    const relFromRoot = toPosixPath(path.relative(this.rootDir, dir))
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
}
import fs from 'fs'
import path from 'path'
import { ensureDir, parseHeadingLine, replaceMarkdownExtension, stripMarkdownExtension, toPosixPath } from './utils'
import matter from 'gray-matter'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { normalizeHtml } from './html-normalize'

export class MarkdownExporter {
  private readonly markdownRoot: string
  private readonly markdownProcessor: TurndownService

  constructor(
    private readonly rootDir: string,
    private readonly exportRoot: string,
  ) {
    this.markdownRoot = path.join(exportRoot, 'markdown')
    this.markdownProcessor = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      fence: '```',
      emDelimiter: '_',
    })
    this.markdownProcessor.use(gfm)
    this.markdownProcessor.addRule('fencedCodeBlocks', {
      filter: (node) =>
        node.nodeName === 'PRE' &&
        !!node.querySelector('code'),
    
      replacement: (content, node) => {
        const codeNode = node.querySelector('code');
        const className = codeNode?.className || '';
        
        const languageMatch = className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : '';
    
        const code = (codeNode?.textContent || '')
          .replace(/\n+$/, '') // trim trailing newlines
          .replace(/^\n+/, '');
    
        return `\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
      }
    });
  }

  exportFile(params: {
    section: string,
    siteDir: string,
    absPath: string,
    relFromDocs: string,
    generatedAt: string,
    gitSha: string | null,
  }) {
    // Right now this is source-centric (MDX) - for each MDX file, search for corresponding output HTML file. This is primarily
    // because we want to extract some of the frontmatter from the MDX file. This data is available in the output HTML file but
    // requires some extra processing to extract, and we also would need to restructure the output paths a bit, so for now leaving
    // it this way.
    const { section, siteDir, absPath, relFromDocs, generatedAt, gitSha } = params
    const sourcePath = toPosixPath(path.relative(siteDir, absPath))
    const id = stripMarkdownExtension(relFromDocs)
    const raw = fs.readFileSync(absPath, 'utf8')
    const mdxSource = matter(raw)
    
    let htmlPath: string
    if (mdxSource.data?.slug) {
      if (mdxSource.data.slug.startsWith('/')) {
        htmlPath = path.resolve(this.rootDir, `.${mdxSource.data.slug}`, 'index.html')
      } else {
        htmlPath = path.resolve(this.rootDir, id, '..', mdxSource.data.slug, 'index.html')
      }
    } else {
      htmlPath = path.join(this.rootDir, id, 'index.html')
    }
    const htmlContent = fs.readFileSync(htmlPath, 'utf8')
    const htmlBody = normalizeHtml(htmlContent)
    const normalizedBody = this.markdownProcessor.turndown(htmlBody)

    const titleFromContent = this.extractTitleFromContent(normalizedBody)
    const title =
      (mdxSource.data && typeof (mdxSource.data as { title?: string }).title === 'string'
        ? (mdxSource.data as { title: string }).title
        : titleFromContent) || path.basename(id)

    const metadata = {
      id,
      title,
      description: mdxSource.data?.description || '',
      section,
      source_path: sourcePath,
      version: (mdxSource.data as { version?: string } | undefined)?.version || gitSha || 'N/A',
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
    this.processDir(this.markdownRoot)
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
      if (line.trim() === '') {
        continue
      }
      if (/^#\s+/.test(line.trim())) {
        return content
      }
      break
    }
    return `# ${title}\n\n${content}`
  }

  private processDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const subdirs: string[] = []
    const files: string[] = []

    let alreadyHasIndex = false
    for (const entry of entries) {
      if (entry.isDirectory()) {
        subdirs.push(entry.name)
      } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
        if (entry.name.toLowerCase() === 'index.md') {
          alreadyHasIndex = true
        }
        files.push(entry.name)
      }
    }

    for (const sub of subdirs) {
      this.processDir(path.join(dir, sub))
    }

    // if the directory already has an index.md, don't overwrite it
    if (alreadyHasIndex) {
      return
    }

    const relFromRoot = toPosixPath('/'+path.relative(this.rootDir, dir))
    const isRoot = relFromRoot === '/llm/markdown'
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
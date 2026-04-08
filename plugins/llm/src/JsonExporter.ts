import path from 'path'
import type { InlineCode, Node, Parent, Root, Text } from 'mdast'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { Chunk, ChunkHeadingEntry, HeadingMeta, LlmDocExportMeta, LlmExportConfig, LlmFullDocIndexEntry } from './types'
import { ensureDir, replaceMarkdownExtension, toPosixPath, tokenizeCount, writeJsonFile,countWords, slugify, stripMdxJsxFromInlineText, } from './utils'
import type { Heading, Node as UnistNode } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

const TEXT = 'text' as const
export class JsonExporter {
  private readonly chunks: Chunk[] = []
  private readonly fullDocIndex: LlmFullDocIndexEntry[] = []
  private readonly jsonRoot: string
  private readonly chunkedJsonRoot: string
  private readonly fullJsonRoot: string
  private readonly markdownProcessor = unified().use(remarkParse).use(remarkGfm)
  
  constructor(
    private readonly distRoot: string,
    exportRoot: string
  ) {
    this.jsonRoot = path.join(exportRoot, 'json')
    this.chunkedJsonRoot = path.join(this.jsonRoot, 'chunked')
    this.fullJsonRoot = path.join(this.jsonRoot, 'full')
  }

  /** Produce a JSON-serializable mdast (drops `position` to cut size and avoid noisy diffs). */
  private mdastToJsonValue(node: unknown): unknown {
    if (node === null || typeof node !== 'object') {
      return node
    }
    if (Array.isArray(node)) {
      return node.map((n) => this.mdastToJsonValue(n))
    }
    const record = node as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(record)) {
      if (key === 'position') {
        continue
      }
      out[key] = this.mdastToJsonValue(record[key])
    }
    return out
  }

  prepareJsonOutputDirs(): void {
    ensureDir(this.jsonRoot)
    ensureDir(this.chunkedJsonRoot)
    ensureDir(this.fullJsonRoot)
  }

  exportFile(params: {
    relFromDocs: string,
    mdOutPath: string,
    metadata: Record<string, string>,
    bodyWithHeading: string,
    config: LlmExportConfig,
  }) {
    const { relFromDocs, metadata, mdOutPath, bodyWithHeading, config } = params
    
    const jsonSourcePath = this.distRelativeUrl(this.distRoot, mdOutPath)
    const { chunkedJsonOutPath, fullJsonOutPath } = this.resolvePerDocJsonPaths(
      relFromDocs,
      this.chunkedJsonRoot,
      this.fullJsonRoot,
    )

    const mdastTree = this.markdownProcessor.parse(bodyWithHeading)
    const { chunks, headingMeta } = this.buildChunks(
      metadata.id,
      metadata.section,
      '/'+path.relative(this.distRoot, chunkedJsonOutPath),
      bodyWithHeading,
      config.chunk?.minHeadingLevel ?? 2,
      config.chunk?.minContentWords ?? 30,
      mdastTree,
    )
    
    const docBlock = this.buildLlmDocBlock({
      id: metadata.id,
      title: metadata.title,
      metadata,
      section: metadata.section,
      jsonSourcePath,
      headingMeta,
    })

    this.writeChunkedPerDocJson(chunkedJsonOutPath, docBlock, chunks)
    this.fullDocIndex.push({
      id: metadata.id,
      title: metadata.title,
      section: metadata.section,
      path: this.distRelativeUrl(this.distRoot, fullJsonOutPath),
    })
    this.writeFullPerDocJson(fullJsonOutPath, docBlock, bodyWithHeading, mdastTree)
  
    this.chunks.push(...chunks)
  }

  exportIndex(params: {
    gitSha: string | null,
    generatedAt: string,
  }) {
    const { gitSha, generatedAt } = params
    const build = { version: gitSha || null, generated_at: generatedAt }
    this.writeChunkedIndexJson(path.join(this.chunkedJsonRoot, 'index.json'), build, this.chunks)
    this.writeFullIndexJson(path.join(this.fullJsonRoot, 'index.json'), build, this.fullDocIndex)
  }

  getMetrics(): { chunkCount: number, fullDocCount: number } {
    return { chunkCount: this.chunks.length, fullDocCount: this.fullDocIndex.length }
  }

  private buildLlmDocBlock(args: {
    id: string
    title: string
    metadata: Record<string, unknown>
    section: string
    jsonSourcePath: string
    headingMeta: HeadingMeta[]
  }): LlmDocExportMeta {
    const { id, title, metadata, section, jsonSourcePath, headingMeta } = args
    return {
      id,
      title,
      description: (metadata.description as string) || null,
      section,
      source_path: jsonSourcePath,
      version: (metadata.version as string) || null,
      updated_at: (metadata.updated_at as string) || null,
      headings: headingMeta,
    }
  }
  
  private writeChunkedPerDocJson(filePath: string, doc: LlmDocExportMeta, chunks: Chunk[]): void {
    writeJsonFile(filePath, { doc, chunks })
  }
  
  private writeFullPerDocJson(
    filePath: string,
    doc: LlmDocExportMeta,
    bodyWithHeading: string,
    tree: Root,
  ): void {
    const simplifiedTree = this.simplifyMdastFormatting(tree)
    writeJsonFile(filePath, {
      doc,
      content: this.mdastToJsonValue(simplifiedTree) as Record<string, unknown>,
      token_estimate: tokenizeCount(bodyWithHeading),
    })
  }
  
  private writeChunkedIndexJson(
    filePath: string,
    build: { version: string | null; generated_at: string },
    allChunks: Chunk[],
  ): void {
    writeJsonFile(filePath, {
      build,
      chunks: allChunks.map((c) => ({
        id: c.id,
        doc_id: c.doc_id,
        heading: c.heading,
        heading_level: c.heading_level,
        section: c.section,
        path: c.path,
        token_estimate: c.token_estimate,
      })),
    })
  }
  
  private writeFullIndexJson(
    filePath: string,
    build: { version: string | null; generated_at: string },
    documents: LlmFullDocIndexEntry[],
  ): void {
    const sorted = [...documents].sort((a, b) => a.id.localeCompare(b.id))
    writeJsonFile(filePath, { build, documents: sorted })
  }
  
  /** Paths for one source doc's JSON outputs; ensures parent dirs exist. */
  private resolvePerDocJsonPaths(
    relFromDocs: string,
    chunkedJsonRoot: string,
    fullJsonRoot: string,
  ): { chunkedJsonOutPath: string; fullJsonOutPath: string } {
    const chunkedJsonOutPath = path.join(chunkedJsonRoot, replaceMarkdownExtension(relFromDocs, '.json'))
    const fullJsonOutPath = path.join(fullJsonRoot, replaceMarkdownExtension(relFromDocs, '.json'))
    ensureDir(path.dirname(chunkedJsonOutPath))
    ensureDir(path.dirname(fullJsonOutPath))
    return { chunkedJsonOutPath, fullJsonOutPath }
  }
  
  private distRelativeUrl(distRoot: string, absoluteFilePath: string): string {
    return `/${toPosixPath(path.relative(distRoot, absoluteFilePath))}`
  }

  /**
   * Renders inline code as plain text using markdown-style backtick fences (handles
   * embedded backticks per CommonMark rules).
   */
  private wrapInlineCodeValue(value: string): string {
    let maxRun = 0
    let cur = 0
    for (const ch of value) {
      if (ch === '`') {
        cur += 1
        if (cur > maxRun) maxRun = cur
      } else {
        cur = 0
      }
    }
    const fence = '`'.repeat(maxRun + 1)
    const pad =
      value.includes('`') || value.startsWith(' ') || value.endsWith(' ') ? ' ' : ''
    return fence + pad + value + pad + fence
  }

  private mergeAdjacentText(nodes: Node[]): Node[] {
    const out: Node[] = []
    for (const n of nodes) {
      if (n.type === TEXT && out.length > 0 && out[out.length - 1].type === TEXT) {
        ;(out[out.length - 1] as Text).value += (n as Text).value
      } else {
        out.push(n)
      }
    }
    return out
  }

  private isParent(node: Node): node is Parent {
    return 'children' in node && Array.isArray((node as Parent).children)
  }

  /**
   * Returns a list of sibling nodes after collapsing `strong` / `emphasis` into plain
   * text flow and replacing `inlineCode` with backtick-wrapped {@link Text} nodes.
   */
  private transformNodes(node: Node): Node[] {
    if (node.type === 'inlineCode') {
      const t: Text = {
        type: TEXT,
        value: this.wrapInlineCodeValue((node as InlineCode).value),
      }
      return [t]
    }

    if (node.type === 'strong' || node.type === 'emphasis') {
      const inner = (node as Parent).children.flatMap((c) => this.transformNodes(c))
      return this.mergeAdjacentText(inner)
    }

    if (this.isParent(node)) {
      const children = this.mergeAdjacentText((node as Parent).children.flatMap((c) => this.transformNodes(c)))
      return [{ ...(node as Parent), children } as Node]
    }

    return [node]
  }

  /**
   * Clones the tree and simplifies non-structural inline formatting for JSON export:
   * inline code becomes literal backticks in text; bold/italic wrappers are removed
   * and merged with adjacent text.
   */
  private simplifyMdastFormatting(tree: Root): Root {
    const clone = structuredClone(tree) as Root
    const out = this.transformNodes(clone)
    if (out.length !== 1 || out[0].type !== 'root') {
      throw new Error('LLM mdast simplify: expected a single root')
    }
    return out[0] as Root
  }

  private headingPlainText(node: Heading): string {
    const raw = toString(node)
    return stripMdxJsxFromInlineText(raw) || raw
  }

  /**
   * Splits markdown into chunks by headings at or above `minHeadingLevel`, dropping chunks under `minContentWords`.
   */
  private buildChunks(
    docId: string,
    section: string,
    chunkedJsonPath: string,
    markdown: string,
    minHeadingLevel: number,
    minContentWords: number,
    mdastTree: UnistNode,
  ): { chunks: Chunk[]; headingMeta: HeadingMeta[] } {
    const headings: ChunkHeadingEntry[] = []

    visit(mdastTree, 'heading', (node: Heading) => {
      const start = node.position?.start?.offset
      if (start === undefined) {
        throw new Error('LLM chunk export: heading node missing source position')
      }
      const text = this.headingPlainText(node)
      const slug = slugify(text)
      headings.push({
        level: node.depth,
        text,
        slug,
        id: `${docId}#${slug}`,
        startOffset: start,
      })
    })

    const chunks: Chunk[] = []
    for (let idx = 0; idx < headings.length; idx++) {
      const h = headings[idx]
      if (h.level < minHeadingLevel) continue

      let endOffset = markdown.length
      for (let j = idx + 1; j < headings.length; j++) {
        if (headings[j].level <= h.level) {
          endOffset = headings[j].startOffset
          break
        }
      }

      const content = markdown.slice(h.startOffset, endOffset).trim()
      if (countWords(content) < minContentWords) {
        continue
      }

      chunks.push({
        id: h.id,
        doc_id: docId,
        heading: h.text,
        heading_level: h.level,
        content_markdown: `${content}\n`,
        section,
        anchors: [h.slug],
        path: chunkedJsonPath,
        token_estimate: tokenizeCount(content),
      })
    }

    const headingMeta: HeadingMeta[] = headings.map((h) => ({ id: h.id, text: h.text, level: h.level }))
    return { chunks, headingMeta }
  }
}

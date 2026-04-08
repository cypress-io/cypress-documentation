import path from 'path'
import { Chunk, HeadingMeta, LlmDocExportMeta, LlmExportConfig, LlmFullDocIndexEntry, LlmJsonRoots } from './types'
import { ensureDir, replaceMarkdownExtension, toPosixPath, tokenizeCount, writeJsonFile } from './utils'
import { buildChunks } from './chunk-builder'

function buildLlmDocBlock(args: {
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

function writeChunkedPerDocJson(filePath: string, doc: LlmDocExportMeta, chunks: Chunk[]): void {
  writeJsonFile(filePath, { doc, chunks })
}

function writeFullPerDocJson(filePath: string, doc: LlmDocExportMeta, bodyWithHeading: string): void {
  writeJsonFile(filePath, {
    doc,
    content_markdown: `${bodyWithHeading.trim()}\n`,
    token_estimate: tokenizeCount(bodyWithHeading),
  })
}

function writeChunkedIndexJson(
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

function writeFullIndexJson(
  filePath: string,
  build: { version: string | null; generated_at: string },
  documents: LlmFullDocIndexEntry[],
): void {
  const sorted = [...documents].sort((a, b) => a.id.localeCompare(b.id))
  writeJsonFile(filePath, { build, documents: sorted })
}

/** Paths for one source doc's JSON outputs; ensures parent dirs exist. */
function resolvePerDocJsonPaths(
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

function distRelativeUrl(distRoot: string, absoluteFilePath: string): string {
  return `/${toPosixPath(path.relative(distRoot, absoluteFilePath))}`
}

export class JsonExporter {
  private readonly chunks: Chunk[] = []
  private readonly fullDocIndex: LlmFullDocIndexEntry[] = []
  private readonly jsonRoot: string
  private readonly chunkedJsonRoot: string
  private readonly fullJsonRoot: string

  constructor(
    private readonly distRoot: string,
    private readonly exportRoot: string
  ) {
    this.jsonRoot = path.join(exportRoot, 'json')
    this.chunkedJsonRoot = path.join(this.jsonRoot, 'chunked')
    this.fullJsonRoot = path.join(this.jsonRoot, 'full')
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
    
    const jsonSourcePath = distRelativeUrl(this.distRoot, mdOutPath)
    
    const { chunks, headingMeta } = buildChunks(
      metadata.id,
      metadata.section,
      jsonSourcePath,
      bodyWithHeading,
      config.chunk?.minHeadingLevel ?? 2,
      config.chunk?.minContentWords ?? 30,
    )
    
    const { chunkedJsonOutPath, fullJsonOutPath } = resolvePerDocJsonPaths(
      relFromDocs,
      this.chunkedJsonRoot,
      this.fullJsonRoot,
    )
  
    const docBlock = buildLlmDocBlock({
      id: metadata.id,
      title: metadata.title,
      metadata,
      section: metadata.section,
      jsonSourcePath,
      headingMeta,
    })
  
    writeChunkedPerDocJson(chunkedJsonOutPath, docBlock, chunks)
    this.fullDocIndex.push({
      id: metadata.id,
      title: metadata.title,
      section: metadata.section,
      path: distRelativeUrl(this.distRoot, fullJsonOutPath),
    })
    writeFullPerDocJson(fullJsonOutPath, docBlock, bodyWithHeading)
  
    this.chunks.push(...chunks)
  }

  exportIndex(params: {
    gitSha: string | null,
    generatedAt: string,
  }) {
    const { gitSha, generatedAt } = params
    const build = { version: gitSha || null, generated_at: generatedAt }
    writeChunkedIndexJson(path.join(this.chunkedJsonRoot, 'index.json'), build, this.chunks)
    writeFullIndexJson(path.join(this.fullJsonRoot, 'index.json'), build, this.fullDocIndex)
  }

  getMetrics(): { chunkCount: number, fullDocCount: number } {
    return { chunkCount: this.chunks.length, fullDocCount: this.fullDocIndex.length }
  }
}

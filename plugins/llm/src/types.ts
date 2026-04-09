export type Chunk = {
  id: string
  doc_id: string
  heading: string
  heading_level: number
  content_markdown: string
  section: string
  path: string
  anchors: string[]
  token_estimate: number
}

export type HeadingMeta = {
  id: string
  text: string
  level: number
}

/** Metadata block shared by chunked and full JSON exports for one document. */
export type LlmDocExportMeta = {
  id: string
  title: string
  description: string | null
  section: string
  source_path: string
  version: string | null
  updated_at: string | null
  headings: HeadingMeta[]
}

/** Row in `json/full/index.json`. */
export type LlmFullDocIndexEntry = {
  id: string
  title: string
  section: string
  path: string
}

export type LlmExportConfig = {
  includeSections?: string[]
  partialsMode?: 'inline' | 'standalone'
  emit?: {
    json?: boolean
  }
  chunk?: {
    minHeadingLevel?: number
    minContentWords?: number
  }
}

/** Resolved at export time — not tied to `process.cwd()` at module load. */
export type LlmExportRunOptions = {
  /** Project root (contains `docs/`, `src/`). Defaults to `process.cwd()` when omitted. */
  siteDir?: string
  /** Docusaurus build output directory. Defaults to `<siteDir>/dist` when omitted. */
  outDir?: string
}

export type ChunkHeadingEntry = {
  level: number
  text: string
  slug: string
  id: string
  startOffset: number
}

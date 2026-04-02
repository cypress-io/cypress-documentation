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

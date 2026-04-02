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

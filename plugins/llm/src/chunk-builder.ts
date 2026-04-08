import { Chunk, HeadingMeta } from './types'
import {
  countWords,
  parseHeadingLine,
  slugify,
  tokenizeCount,
} from './utils'

type HeadingRow = { index: number; level: number; text: string; slug: string; id: string }

/**
 * Splits markdown into chunks by headings at or above `minHeadingLevel`, dropping chunks under `minContentWords`.
 */
export function buildChunks(
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

import type { Heading, Node as UnistNode } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'
import { Chunk, HeadingMeta } from './types'
import { countWords, slugify, stripMdxJsxFromInlineText, tokenizeCount } from './utils'

type HeadingEntry = {
  level: number
  text: string
  slug: string
  id: string
  startOffset: number
}

function headingPlainText(node: Heading): string {
  const raw = toString(node)
  return stripMdxJsxFromInlineText(raw) || raw
}

/**
 * Splits markdown into chunks by headings at or above `minHeadingLevel`, dropping chunks under `minContentWords`.
 */
export function buildChunks(
  docId: string,
  section: string,
  chunkedJsonPath: string,
  markdown: string,
  minHeadingLevel: number,
  minContentWords: number,
  mdastTree: UnistNode,
): { chunks: Chunk[]; headingMeta: HeadingMeta[] } {
  const headings: HeadingEntry[] = []

  visit(mdastTree, 'heading', (node: Heading) => {
    const start = node.position?.start?.offset
    if (start === undefined) {
      throw new Error('LLM chunk export: heading node missing source position')
    }
    const text = headingPlainText(node)
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

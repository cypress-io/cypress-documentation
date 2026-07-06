import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import type { Heading } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'
import {
  ensureDir,
  slugify,
  stripMarkdownExtension,
  toPosixPath,
} from './utils'

type SectionSlice = {
  heading: string
  slug: string
  content: string
}

/**
 * Emits one markdown file per `##` section of a page, at
 * `markdown/<doc-id>/<h2-slug>.md`, so an LLM can fetch a single topic
 * without spending tokens on the whole page. Slugs match the chunked JSON
 * anchors: `<doc-id>/<slug>.md` corresponds to chunk id `<doc-id>#<slug>`.
 */
export class SectionMarkdownExporter {
  private readonly markdownRoot: string
  private readonly markdownProcessor = unified().use(remarkParse).use(remarkGfm)
  private readonly fragmentDirs = new Set<string>()

  constructor(exportRoot: string) {
    this.markdownRoot = path.join(exportRoot, 'markdown')
  }

  /** Doc ids (posix, relative to the markdown root) that own a fragment dir. */
  getFragmentDirs(): ReadonlySet<string> {
    return this.fragmentDirs
  }

  exportFile(params: {
    relFromDocs: string
    metadata: Record<string, string>
    bodyWithHeading: string
  }): { sectionCount: number } {
    const { relFromDocs, metadata, bodyWithHeading } = params
    const docId = stripMarkdownExtension(relFromDocs)
    const sections = this.splitByH2(bodyWithHeading)
    if (sections.length === 0) {
      return { sectionCount: 0 }
    }

    const sectionDir = path.join(this.markdownRoot, docId)
    ensureDir(sectionDir)
    this.fragmentDirs.add(toPosixPath(docId))
    const pagePath = `/llm/markdown/${toPosixPath(docId)}.md`

    for (const section of sections) {
      const sectionMetadata = {
        id: `${docId}#${section.slug}`,
        title: section.heading,
        page_title: metadata.title,
        page: pagePath,
        section: metadata.section,
        source_path: metadata.source_path,
        version: metadata.version,
        updated_at: metadata.updated_at,
      }
      const out = matter.stringify(`${section.content.trim()}\n`, sectionMetadata)
      fs.writeFileSync(path.join(sectionDir, `${section.slug}.md`), out, 'utf8')
    }

    return { sectionCount: sections.length }
  }

  /** Mirrors the chunked JSON boundary logic; duplicate slugs get `-2`, `-3`, … suffixes. */
  private splitByH2(markdown: string): SectionSlice[] {
    const tree = this.markdownProcessor.parse(markdown)
    const headings: { level: number; text: string; startOffset: number }[] = []

    visit(tree, 'heading', (node: Heading) => {
      const start = node.position?.start?.offset
      if (start === undefined) {
        throw new Error('LLM section export: heading node missing source position')
      }
      headings.push({ level: node.depth, text: toString(node), startOffset: start })
    })

    const sections: SectionSlice[] = []
    const usedSlugs = new Map<string, number>()

    for (let idx = 0; idx < headings.length; idx++) {
      const h = headings[idx]
      if (h.level !== 2) {
        continue
      }

      let endOffset = markdown.length
      for (let j = idx + 1; j < headings.length; j++) {
        if (headings[j].level <= 2) {
          endOffset = headings[j].startOffset
          break
        }
      }

      const baseSlug = slugify(h.text)
      const seen = usedSlugs.get(baseSlug) ?? 0
      usedSlugs.set(baseSlug, seen + 1)
      const slug = seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`

      sections.push({
        heading: h.text,
        slug,
        content: markdown.slice(h.startOffset, endOffset),
      })
    }

    return sections
  }
}

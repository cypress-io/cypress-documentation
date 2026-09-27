import fs from 'fs'
import path from 'path'
import { ensureDir } from './utils'

/**
 * Mirrors each page's exported markdown to `<page-route>.md` at the site root,
 * so `https://docs.cypress.io/app/get-started/why-cypress.md` returns the
 * markdown for the page served at that URL.
 *
 * The `/llm/markdown/` corpus is only reachable by an agent that first reads
 * `llms.txt` or the page's `<link rel="alternate">`; appending `.md` to a page
 * URL is the convention agents and AI clients try unprompted, so the same files
 * are published under both paths rather than one redirecting to the other —
 * physical copies keep the convention working on any static host, and the two
 * trees do not share a path layout (a page's route can differ from its doc id
 * when frontmatter sets a `slug`).
 */
export class CanonicalMarkdownMirror {
  private pageCount = 0
  private sectionCount = 0
  private readonly written = new Set<string>()

  constructor(private readonly distRoot: string) {}

  /**
   * `sectionDir` is the page's per-`##` fragment directory in the markdown
   * corpus, or null for a page that exported no fragments. Fragments mirror to
   * `<page-route>/<h2-slug>.md`, alongside the page's own `index.html`.
   */
  mirror(params: {
    route: string
    pageMarkdownPath: string
    sectionDir: string | null
  }): void {
    const { route, pageMarkdownPath, sectionDir } = params

    const pageTarget = path.join(this.distRoot, `${route || 'index'}.md`)
    ensureDir(path.dirname(pageTarget))
    this.copy(pageMarkdownPath, pageTarget)
    this.pageCount++

    if (!sectionDir || !fs.existsSync(sectionDir)) return

    const sectionTargetDir = path.join(this.distRoot, route)
    ensureDir(sectionTargetDir)
    for (const entry of fs.readdirSync(sectionDir, { withFileTypes: true })) {
      if (!entry.isFile() || !/\.md$/i.test(entry.name)) continue
      this.copy(
        path.join(sectionDir, entry.name),
        path.join(sectionTargetDir, entry.name),
      )
      this.sectionCount++
    }
  }

  /**
   * A page fragment mirrors into the page's own route directory, which is also
   * where a nested page's markdown would land if one were ever routed there.
   * Fail the build rather than serve whichever of the two was copied last.
   */
  private copy(source: string, target: string): void {
    if (this.written.has(target)) {
      throw new Error(
        `LLM export: two documents both publish markdown at ${path.relative(this.distRoot, target)}`,
      )
    }
    this.written.add(target)
    fs.copyFileSync(source, target)
  }

  getMetrics(): { pageCount: number; sectionCount: number } {
    return { pageCount: this.pageCount, sectionCount: this.sectionCount }
  }
}

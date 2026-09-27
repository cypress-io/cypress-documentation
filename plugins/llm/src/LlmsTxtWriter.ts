import path from 'path'
import { LlmExportConfig } from './types'
import { writeFile } from './utils'

/** One documentation page, as it appears in the llms.txt link index. */
export type LlmsTxtEntry = {
  /** Site route without a leading slash, e.g. `app/get-started/why-cypress`. */
  route: string
  title: string
  description: string
  /** Top-level `docs/` folder the page came from, e.g. `app`. */
  section: string
  /** The page's exported markdown, starting with its `#` heading. */
  body: string
}

export type LlmsTxtMetrics = {
  pageCount: number
  indexBytes: number
  fullCorpusBytes: number
}

/**
 * Display names for the top-level docs sections, in the order they are listed.
 * Sections not named here are appended alphabetically under their folder name.
 */
const SECTION_HEADINGS: ReadonlyArray<[string, string]> = [
  ['app', 'Cypress App'],
  ['api', 'API'],
  ['cloud', 'Cypress Cloud'],
  ['accessibility', 'Cypress Accessibility'],
  ['ui-coverage', 'UI Coverage'],
]

const SUMMARY =
  'Cypress is a modern end-to-end testing framework for web applications, designed for developers to write, run, and debug tests easily.'

/** Opens the line that marks where one page starts in `llms-full.txt`. */
const PAGE_MARKER_PREFIX = 'Source: '

/**
 * A body line that a consumer would mistake for the page boundary above. This
 * is deliberately the whole prefix and not the `<url>.md` the marker carries:
 * the corpus tells consumers to split on `Source:` lines, so anything they
 * would split on has to be rejected, not just the lines that look like ours.
 */
const FORGED_PAGE_MARKER_RE = new RegExp(`^${PAGE_MARKER_PREFIX}`)

/**
 * Writes the two files the llms.txt convention defines for a site:
 *
 * - `/llms.txt` — the index, in the [llmstxt.org](https://llmstxt.org) format:
 *   an H1, a blockquote summary, free markdown, then `##` sections whose link
 *   lists point at every documentation page. Consumers such as Cursor's `@Docs`
 *   indexer and agent fetchers read the link lists, so the first `##` section
 *   lists the corpus endpoints (`/llm/markdown`, `/llm/json`, `/llms-full.txt`)
 *   and the rest list the pages themselves.
 * - `/llms-full.txt` — every page's markdown concatenated in index order, for
 *   tools that ingest one file instead of crawling links.
 *
 * Both link to the page markdown published at `<page-route>.md`, which is the
 * same file served from `/llm/markdown/<doc-id>.md`.
 */
export class LlmsTxtWriter {
  private readonly entries: LlmsTxtEntry[] = []

  constructor(private readonly distRoot: string) {}

  add(entry: LlmsTxtEntry): void {
    this.entries.push(entry)
  }

  write(config: LlmExportConfig): LlmsTxtMetrics {
    const baseUrl = normalizeBaseUrl(config.url)
    const grouped = this.groupBySection()

    // The corpus is built first so the index can quote its real size: it runs to
    // several megabytes, and an agent should know that before fetching it.
    const fullCorpus = this.buildFullCorpus(baseUrl, grouped)
    const index = this.buildIndex(baseUrl, grouped, Buffer.byteLength(fullCorpus, 'utf8'))

    writeFile(path.join(this.distRoot, 'llms.txt'), index)
    writeFile(path.join(this.distRoot, 'llms-full.txt'), fullCorpus)

    return {
      pageCount: this.entries.length,
      indexBytes: Buffer.byteLength(index, 'utf8'),
      fullCorpusBytes: Buffer.byteLength(fullCorpus, 'utf8'),
    }
  }

  /** Sections in {@link SECTION_HEADINGS} order, each sorted by route. */
  private groupBySection(): Array<{ heading: string; entries: LlmsTxtEntry[] }> {
    const bySection = new Map<string, LlmsTxtEntry[]>()
    for (const entry of this.entries) {
      const bucket = bySection.get(entry.section)
      if (bucket) {
        bucket.push(entry)
      } else {
        bySection.set(entry.section, [entry])
      }
    }

    const known = SECTION_HEADINGS.map(([section]) => section)
    const extra = [...bySection.keys()].filter((section) => !known.includes(section)).sort()
    const ordered = [
      ...SECTION_HEADINGS,
      ...extra.map((section) => [section, section] as [string, string]),
    ]

    return ordered
      .filter(([section]) => bySection.has(section))
      .map(([section, heading]) => ({
        heading,
        entries: [...(bySection.get(section) as LlmsTxtEntry[])].sort((a, b) =>
          a.route.localeCompare(b.route),
        ),
      }))
  }

  private buildIndex(
    baseUrl: string,
    grouped: Array<{ heading: string; entries: LlmsTxtEntry[] }>,
    fullCorpusBytes: number,
  ): string {
    const lines: string[] = [
      '# Cypress',
      '',
      `> ${SUMMARY}`,
      '',
      'This index links the markdown for every page of the Cypress documentation.',
      'Every page is published at its own URL plus `.md`, so dropping the `.md` from',
      'any link below gives the HTML page, and the same file is served from',
      `\`${baseUrl}/llm/markdown/<page-path>.md\`. Fetch markdown rather than HTML: it is`,
      'the same content without the site chrome.',
      '',
      '## Documentation formats',
      '',
      `- [Full corpus](${baseUrl}/llms-full.txt): every page listed below, concatenated into one markdown file (${formatMegabytes(fullCorpusBytes)}, ${this.entries.length} pages). Use it to index the whole corpus, not to answer one question.`,
      `- [Markdown corpus index](${baseUrl}/llm/markdown/index.md): browsable directory listing of \`/llm/markdown/\`, which mirrors the \`docs/\` tree.`,
      `- [Page markdown](${baseUrl}/app/get-started/why-cypress.md): any documentation URL plus \`.md\`, also served at \`${baseUrl}/llm/markdown/app/get-started/why-cypress.md\`.`,
      `- [Page section markdown](${baseUrl}/app/get-started/why-cypress/features.md): a single \`##\` section of a page, at \`<page-path>/<h2-slug>.md\`. Prefer it over the whole page when you only need one topic.`,
      `- [Chunked JSON index](${baseUrl}/llm/json/chunked/index.json): every page split at its headings, with token estimates. Use for retrieval and embeddings.`,
      `- [Full JSON index](${baseUrl}/llm/json/full/index.json): whole documents as structured JSON. Use when you want complete context for one page.`,
      `- [Docs manifest](${baseUrl}/docs-manifest.json): machine-readable project metadata and the same list of endpoints.`,
      `- [Agent skills](${baseUrl}/.well-known/agent-skills/index.json): Cypress skills for AI coding agents.`,
      '',
    ]

    for (const { heading, entries } of grouped) {
      lines.push(`## ${heading}`, '')
      for (const entry of entries) {
        lines.push(`- ${this.link(baseUrl, entry)}`)
      }
      lines.push('')
    }

    return lines.join('\n')
  }

  private buildFullCorpus(
    baseUrl: string,
    grouped: Array<{ heading: string; entries: LlmsTxtEntry[] }>,
  ): string {
    const parts: string[] = [
      [
        '# Cypress Documentation',
        '',
        `> ${SUMMARY}`,
        '',
        `This file is the complete Cypress documentation corpus: all ${this.entries.length} pages listed`,
        `in ${baseUrl}/llms.txt, concatenated in the same order. Each page begins with a`,
        '`Source:` line giving the URL of its markdown; drop the `.md` for the HTML page.',
        'Split on those lines to separate the pages: the `---` rule before each one is',
        'only a visual break, and a page body may contain one. To fetch a single page',
        `instead of all of them, read the index at ${baseUrl}/llms.txt.`,
        '',
      ].join('\n'),
    ]

    for (const { heading, entries } of grouped) {
      for (const entry of entries) {
        const body = entry.body.trim()
        this.assertNoForgedPageMarker(entry.route, body)
        parts.push(
          [
            '---',
            '',
            `${PAGE_MARKER_PREFIX}${this.markdownUrl(baseUrl, entry.route)}`,
            `Section: ${heading}`,
            '',
            body,
            '',
          ].join('\n'),
        )
      }
    }

    return `${parts.join('\n')}`
  }

  /**
   * The page boundary in `llms-full.txt` has to be something a page body cannot
   * contain, or a consumer splitting the corpus silently gets the wrong pages.
   * A bare `---` is not that: pages legitimately show YAML frontmatter inside
   * fenced examples, so the rule between pages is decorative and the `Source:`
   * line is the marker. Fail the build rather than emit a corpus that splits
   * wrongly, the same way `CanonicalMarkdownMirror` refuses to publish two
   * documents to one path.
   */
  private assertNoForgedPageMarker(route: string, body: string): void {
    const lines = body.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (FORGED_PAGE_MARKER_RE.test(lines[i])) {
        throw new Error(
          `LLM export: ${route} line ${i + 1} would read as a page boundary in llms-full.txt: ${lines[i]}`,
        )
      }
    }
  }

  private link(baseUrl: string, entry: LlmsTxtEntry): string {
    const title = escapeLinkText(entry.title)
    const url = this.markdownUrl(baseUrl, entry.route)
    const description = collapseWhitespace(entry.description)
    return description ? `[${title}](${url}): ${description}` : `[${title}](${url})`
  }

  private markdownUrl(baseUrl: string, route: string): string {
    return `${baseUrl}/${route || 'index'}.md`
  }
}

function formatMegabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function normalizeBaseUrl(url: string): string {
  return (url || '').replace(/\/+$/, '')
}

/** Keeps a title with brackets from breaking the surrounding markdown link. */
function escapeLinkText(title: string): string {
  return title.replace(/([[\]])/g, '\\$1')
}

/** Descriptions are frontmatter prose and can wrap; a list item needs one line. */
function collapseWhitespace(text: string): string {
  return (text || '').replace(/\s+/g, ' ').trim()
}

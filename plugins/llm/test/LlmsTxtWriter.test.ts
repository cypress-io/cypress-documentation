import { afterEach, test, expect, describe } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { LlmsTxtEntry, LlmsTxtWriter } from '../src/LlmsTxtWriter'
import { LlmExportConfig } from '../src/types'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'llms-txt-test-'))
  tempDirs.push(dir)
  return dir
}

function entry(overrides: Partial<LlmsTxtEntry> = {}): LlmsTxtEntry {
  return {
    route: 'app/get-started/why-cypress',
    title: 'Why Cypress?',
    description: 'Learn what Cypress is and why you should use it.',
    section: 'app',
    body: '# Why Cypress?\n\nCypress is a next generation testing tool.\n',
    ...overrides,
  }
}

function writeAndRead(entries: LlmsTxtEntry[], config: Partial<LlmExportConfig> = {}) {
  const dist = makeTempDir()
  const writer = new LlmsTxtWriter(dist)
  for (const e of entries) {
    writer.add(e)
  }
  const metrics = writer.write({ url: 'https://docs.cypress.io', ...config } as LlmExportConfig)
  return {
    metrics,
    index: fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8'),
    fullCorpus: fs.readFileSync(path.join(dist, 'llms-full.txt'), 'utf8'),
  }
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

// ---------------------------------------------------------------------------
// llmstxt.org structure
// ---------------------------------------------------------------------------

describe('llms.txt: llmstxt.org structure', () => {
  test('starts with a single H1', () => {
    const { index } = writeAndRead([entry()])
    expect(index.split('\n')[0]).toBe('# Cypress')
    expect(index.split('\n').filter((line) => /^# /.test(line))).toHaveLength(1)
  })

  test('follows the H1 with a blockquote summary', () => {
    const { index } = writeAndRead([entry()])
    const lines = index.split('\n')
    expect(lines[1]).toBe('')
    expect(lines[2].startsWith('> ')).toBe(true)
    expect(lines[2].length).toBeGreaterThan(20)
  })

  test('emits no YAML frontmatter', () => {
    const { index } = writeAndRead([entry()])
    expect(index.startsWith('---')).toBe(false)
    expect(index).not.toContain('llm_guidance:')
  })

  test('every non-heading, non-blockquote list item is a spec-shaped link', () => {
    const { index } = writeAndRead([entry()])
    const items = index.split('\n').filter((line) => line.startsWith('- '))
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(item).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/)
    }
  })

  test('all content after the free markdown lives under H2 sections', () => {
    const { index } = writeAndRead([entry()])
    const firstH2 = index.indexOf('\n## ')
    expect(firstH2).toBeGreaterThan(0)
    const afterFirstH2 = index.slice(firstH2 + 1).split('\n')
    for (const line of afterFirstH2) {
      if (line === '' || line.startsWith('## ') || line.startsWith('- ')) continue
      throw new Error(`unexpected line outside a link list: ${line}`)
    }
  })
})

// ---------------------------------------------------------------------------
// The page index
// ---------------------------------------------------------------------------

describe('llms.txt: page index', () => {
  test('links each page to its markdown', () => {
    const { index } = writeAndRead([entry()])
    expect(index).toContain(
      '- [Why Cypress?](https://docs.cypress.io/app/get-started/why-cypress.md): Learn what Cypress is and why you should use it.',
    )
  })

  test('omits the description suffix when a page has none', () => {
    const { index } = writeAndRead([entry({ description: '' })])
    expect(index).toContain('- [Why Cypress?](https://docs.cypress.io/app/get-started/why-cypress.md)\n')
    expect(index).not.toContain('why-cypress.md): \n')
  })

  test('collapses a wrapped description onto one line', () => {
    const { index } = writeAndRead([entry({ description: 'Spy and stub\n  network requests.' })])
    expect(index).toContain('): Spy and stub network requests.')
  })

  test('groups pages under a heading per docs section, in product order', () => {
    const { index } = writeAndRead([
      entry({ route: 'cloud/get-started/introduction', section: 'cloud', title: 'Cloud' }),
      entry({ route: 'api/commands/get', section: 'api', title: 'cy.get()' }),
      entry(),
    ])
    const headings = index.split('\n').filter((line) => line.startsWith('## '))
    expect(headings).toEqual(['## Documentation formats', '## Cypress App', '## API', '## Cypress Cloud'])
  })

  test('sorts pages within a section by route', () => {
    const { index } = writeAndRead([
      entry({ route: 'api/commands/within', title: 'within' }),
      entry({ route: 'api/commands/get', title: 'get' }),
      entry({ route: 'api/commands/click', title: 'click' }),
    ])
    expect(index.indexOf('[click]')).toBeLessThan(index.indexOf('[get]'))
    expect(index.indexOf('[get]')).toBeLessThan(index.indexOf('[within]'))
  })

  test('lists an unrecognized section after the known ones', () => {
    const { index } = writeAndRead([
      entry({ route: 'zzz/page', section: 'zzz', title: 'Z' }),
      entry(),
    ])
    const headings = index.split('\n').filter((line) => line.startsWith('## '))
    expect(headings[headings.length - 1]).toBe('## zzz')
  })

  test('escapes brackets in a title so the link still parses', () => {
    const { index } = writeAndRead([entry({ title: 'cy.get() [beta]' })])
    expect(index).toContain('[cy.get() \\[beta\\]](https://docs.cypress.io/app/get-started/why-cypress.md)')
  })

  test('trims a trailing slash from the configured site URL', () => {
    const { index } = writeAndRead([entry()], { url: 'https://docs.cypress.io/' })
    expect(index).toContain('(https://docs.cypress.io/app/get-started/why-cypress.md)')
    expect(index).not.toContain('.io//')
  })
})

// ---------------------------------------------------------------------------
// Discovery of the /llm corpus — the Cypress AI skills read llms.txt for this
// ---------------------------------------------------------------------------

describe('llms.txt: corpus discovery', () => {
  test('links the markdown corpus index under /llm', () => {
    const { index } = writeAndRead([entry()])
    expect(index).toContain('https://docs.cypress.io/llm/markdown/index.md')
  })

  test('links both JSON indexes under /llm', () => {
    const { index } = writeAndRead([entry()])
    expect(index).toContain('https://docs.cypress.io/llm/json/chunked/index.json')
    expect(index).toContain('https://docs.cypress.io/llm/json/full/index.json')
  })

  test('documents the /llm/markdown path pattern for arbitrary pages', () => {
    const { index } = writeAndRead([entry()])
    expect(index).toContain('/llm/markdown/<page-path>.md')
  })

  test('links llms-full.txt and the docs manifest', () => {
    const { index } = writeAndRead([entry()])
    expect(index).toContain('https://docs.cypress.io/llms-full.txt')
    expect(index).toContain('https://docs.cypress.io/docs-manifest.json')
  })

  test('tells an agent how big llms-full.txt is before it fetches it', () => {
    const { index, metrics } = writeAndRead([entry(), entry({ route: 'app/other' })])
    const fullCorpusLine = index
      .split('\n')
      .find((line) => line.includes('/llms-full.txt')) as string
    expect(fullCorpusLine).toContain(`${(metrics.fullCorpusBytes / (1024 * 1024)).toFixed(1)} MB`)
    expect(fullCorpusLine).toContain('2 pages')
  })
})

// ---------------------------------------------------------------------------
// llms-full.txt
// ---------------------------------------------------------------------------

describe('llms-full.txt', () => {
  test('contains every page body verbatim', () => {
    const { fullCorpus } = writeAndRead([
      entry(),
      entry({ route: 'api/commands/get', section: 'api', body: '# cy.get()\n\nGets elements.\n' }),
    ])
    expect(fullCorpus).toContain('Cypress is a next generation testing tool.')
    expect(fullCorpus).toContain('Gets elements.')
  })

  test('precedes each page with the URL of its markdown', () => {
    const { fullCorpus } = writeAndRead([entry()])
    expect(fullCorpus).toContain('Source: https://docs.cypress.io/app/get-started/why-cypress.md')
  })

  test('precedes each page with a thematic break', () => {
    const { fullCorpus } = writeAndRead([entry(), entry({ route: 'app/other' })])
    const lines = fullCorpus.split('\n')
    const markers = lines
      .map((line, i) => (line.startsWith('Source: ') ? i : -1))
      .filter((i) => i >= 0)
    expect(markers).toHaveLength(2)
    for (const i of markers) {
      expect(lines[i - 1]).toBe('')
      expect(lines[i - 2]).toBe('---')
    }
  })

  // A page that documents YAML frontmatter inside a fenced example puts a bare
  // `---` in its body, so the rule between pages cannot be the page boundary.
  test('stays splittable when a page body contains a bare --- line', () => {
    const withFrontmatterExample = entry({
      body: '# Cypress AI Skills\n\n```md\n---\nname: cypress-author\n---\n```\n',
    })
    const { fullCorpus } = writeAndRead([
      withFrontmatterExample,
      entry({ route: 'app/other' }),
    ])
    expect(fullCorpus.match(/^Source: /gm)).toHaveLength(2)
    expect(fullCorpus).toContain('name: cypress-author')
  })

  test('fails the build if a body line would read as a page boundary', () => {
    expect(() =>
      writeAndRead([
        entry({
          route: 'app/sneaky',
          body: '# Sneaky\n\nSource: https://docs.cypress.io/api/commands/get.md\n',
        }),
      ]),
    ).toThrow(/app\/sneaky line 3 would read as a page boundary/)
  })

  test('orders pages the same way the index lists them', () => {
    const entries = [
      entry({ route: 'api/commands/get', section: 'api', title: 'cy.get()' }),
      entry(),
    ]
    const { index, fullCorpus } = writeAndRead(entries)
    expect(index.indexOf('why-cypress.md')).toBeLessThan(index.indexOf('commands/get.md'))
    expect(fullCorpus.indexOf('why-cypress.md')).toBeLessThan(fullCorpus.indexOf('commands/get.md'))
  })

  test('points back at the index for agents that want one page', () => {
    const { fullCorpus } = writeAndRead([entry()])
    expect(fullCorpus).toContain('https://docs.cypress.io/llms.txt')
  })
})

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

describe('write: metrics', () => {
  test('reports the page count and the byte size of both files', () => {
    const { metrics, index, fullCorpus } = writeAndRead([entry(), entry({ route: 'app/other' })])
    expect(metrics.pageCount).toBe(2)
    expect(metrics.indexBytes).toBe(Buffer.byteLength(index, 'utf8'))
    expect(metrics.fullCorpusBytes).toBe(Buffer.byteLength(fullCorpus, 'utf8'))
  })
})

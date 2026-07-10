import { afterEach, describe, expect, test } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import matter from 'gray-matter'
import { SectionMarkdownExporter } from '../src/SectionMarkdownExporter'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'section-md-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

const METADATA = {
  id: 'app/references/migration-guide',
  title: 'Migration Guide',
  section: 'app',
  source_path: 'docs/app/references/migration-guide.mdx',
  version: 'abc123',
  updated_at: '2024-01-01T00:00:00.000Z',
}

function runExport(body: string, relFromDocs = 'app/references/migration-guide.mdx') {
  const exportRoot = makeTempDir()
  const exporter = new SectionMarkdownExporter(exportRoot)
  const result = exporter.exportFile({ relFromDocs, metadata: METADATA, bodyWithHeading: body })
  return { exportRoot, exporter, result }
}

function readSection(exportRoot: string, relPath: string) {
  const raw = fs.readFileSync(path.join(exportRoot, 'markdown', relPath), 'utf8')
  return matter(raw)
}

describe('h2 splitting', () => {
  test('writes one file per h2, named by heading slug', () => {
    const { exportRoot, result } = runExport(
      [
        '# Migration Guide',
        '',
        '## Migrating to Cypress 15.0',
        '',
        'Fifteen content.',
        '',
        '## Migrating to Cypress 14.0',
        '',
        'Fourteen content.',
      ].join('\n'),
    )

    expect(result.sectionCount).toBe(2)
    const dir = path.join(exportRoot, 'markdown', 'app/references/migration-guide')
    expect(fs.readdirSync(dir).sort()).toEqual([
      'migrating-to-cypress-14-0.md',
      'migrating-to-cypress-15-0.md',
    ])
  })

  test('a section runs to the next h2 and keeps nested h3/h4 content', () => {
    const { exportRoot } = runExport(
      [
        '# Migration Guide',
        '',
        '## First',
        '',
        'Intro.',
        '',
        '### Nested',
        '',
        'Nested content.',
        '',
        '## Second',
        '',
        'Other.',
      ].join('\n'),
    )

    const first = readSection(exportRoot, 'app/references/migration-guide/first.md')
    expect(first.content).toContain('## First')
    expect(first.content).toContain('### Nested')
    expect(first.content).toContain('Nested content.')
    expect(first.content).not.toContain('## Second')
  })

  test('the last section runs to the end of the document', () => {
    const { exportRoot } = runExport(
      ['# T', '', '## Only', '', 'Tail line one.', '', 'Tail line two.'].join('\n'),
    )
    const only = readSection(exportRoot, 'app/references/migration-guide/only.md')
    expect(only.content).toContain('Tail line two.')
  })

  test('an h2-looking line inside a fenced code block does not split', () => {
    const { exportRoot, result } = runExport(
      ['# T', '', '## Real', '', '```md', '## not a heading', '```', '', 'After.'].join('\n'),
    )
    expect(result.sectionCount).toBe(1)
    const real = readSection(exportRoot, 'app/references/migration-guide/real.md')
    expect(real.content).toContain('## not a heading')
  })

  test('duplicate h2 text on one page gets suffixed slugs', () => {
    const { exportRoot, result } = runExport(
      ['# T', '', '## Setup', '', 'One.', '', '## Setup', '', 'Two.'].join('\n'),
    )
    expect(result.sectionCount).toBe(2)
    const dir = path.join(exportRoot, 'markdown', 'app/references/migration-guide')
    expect(fs.readdirSync(dir).sort()).toEqual(['setup-2.md', 'setup.md'])
  })

  test('a page with no h2 headings writes nothing', () => {
    const { exportRoot, result } = runExport(['# Title only', '', 'Body.'].join('\n'))
    expect(result.sectionCount).toBe(0)
    expect(
      fs.existsSync(path.join(exportRoot, 'markdown', 'app/references/migration-guide')),
    ).toBe(false)
  })
})

describe('getFragmentDirs', () => {
  test('records the doc id of each page that produced sections', () => {
    const { exporter } = runExport(['# T', '', '## One', '', 'Content.'].join('\n'))
    expect([...exporter.getFragmentDirs()]).toEqual(['app/references/migration-guide'])
  })

  test('does not record pages without h2 sections', () => {
    const { exporter } = runExport(['# Title only', '', 'Body.'].join('\n'))
    expect(exporter.getFragmentDirs().size).toBe(0)
  })
})

describe('section frontmatter', () => {
  test('carries the section id, heading title, and page metadata', () => {
    const { exportRoot } = runExport(
      ['# Migration Guide', '', '## Migrating to Cypress 15.0', '', 'Content.'].join('\n'),
    )
    const section = readSection(
      exportRoot,
      'app/references/migration-guide/migrating-to-cypress-15-0.md',
    )
    expect(section.data.id).toBe('app/references/migration-guide#migrating-to-cypress-15-0')
    expect(section.data.title).toBe('Migrating to Cypress 15.0')
    expect(section.data.page_title).toBe('Migration Guide')
    expect(section.data.page).toBe('/llm/markdown/app/references/migration-guide.md')
    expect(section.data.section).toBe('app')
    expect(section.data.source_path).toBe('docs/app/references/migration-guide.mdx')
  })
})

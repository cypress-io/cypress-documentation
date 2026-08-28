import { afterEach, describe, expect, test } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { CanonicalMarkdownMirror } from '../src/CanonicalMarkdownMirror'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-mirror-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

/** Lays out one page's markdown export: the page file and its fragment dir. */
function makeExport(
  distRoot: string,
  docId: string,
  sections: Record<string, string> = {},
): { pageMarkdownPath: string; sectionDir: string | null } {
  const markdownRoot = path.join(distRoot, 'llm', 'markdown')
  const pageMarkdownPath = path.join(markdownRoot, `${docId}.md`)
  fs.mkdirSync(path.dirname(pageMarkdownPath), { recursive: true })
  fs.writeFileSync(pageMarkdownPath, `# ${docId}\n`)

  const sectionNames = Object.keys(sections)
  if (sectionNames.length === 0) {
    return { pageMarkdownPath, sectionDir: null }
  }

  const sectionDir = path.join(markdownRoot, docId)
  fs.mkdirSync(sectionDir, { recursive: true })
  for (const name of sectionNames) {
    fs.writeFileSync(path.join(sectionDir, name), sections[name])
  }
  return { pageMarkdownPath, sectionDir }
}

describe('mirror', () => {
  test('publishes a page at its route plus .md', () => {
    const distRoot = makeTempDir()
    const { pageMarkdownPath, sectionDir } = makeExport(
      distRoot,
      'app/get-started/why-cypress',
    )

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: 'app/get-started/why-cypress',
      pageMarkdownPath,
      sectionDir,
    })

    const mirrored = path.join(distRoot, 'app/get-started/why-cypress.md')
    expect(fs.readFileSync(mirrored, 'utf8')).toBe('# app/get-started/why-cypress\n')
  })

  test('uses the route, not the doc id, when a slug moves the page', () => {
    const distRoot = makeTempDir()
    const { pageMarkdownPath, sectionDir } = makeExport(distRoot, 'api/utilities/lodash')

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: 'api/utilities/_',
      pageMarkdownPath,
      sectionDir,
    })

    expect(fs.existsSync(path.join(distRoot, 'api/utilities/_.md'))).toBe(true)
    expect(fs.existsSync(path.join(distRoot, 'api/utilities/lodash.md'))).toBe(false)
  })

  test('publishes each h2 fragment under the page route', () => {
    const distRoot = makeTempDir()
    const { pageMarkdownPath, sectionDir } = makeExport(distRoot, 'app/guide', {
      'part-one.md': '## Part one\n',
      'part-two.md': '## Part two\n',
    })

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: 'app/guide',
      pageMarkdownPath,
      sectionDir,
    })

    expect(fs.readFileSync(path.join(distRoot, 'app/guide/part-one.md'), 'utf8')).toBe(
      '## Part one\n',
    )
    expect(fs.existsSync(path.join(distRoot, 'app/guide/part-two.md'))).toBe(true)
  })

  test('leaves the page route directory alone when there are no fragments', () => {
    const distRoot = makeTempDir()
    const { pageMarkdownPath } = makeExport(distRoot, 'app/guide')

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: 'app/guide',
      pageMarkdownPath,
      sectionDir: null,
    })

    expect(fs.existsSync(path.join(distRoot, 'app/guide.md'))).toBe(true)
    expect(fs.existsSync(path.join(distRoot, 'app/guide'))).toBe(false)
  })

  test('writes alongside the route directory the page itself is built into', () => {
    const distRoot = makeTempDir()
    fs.mkdirSync(path.join(distRoot, 'app/guide'), { recursive: true })
    fs.writeFileSync(path.join(distRoot, 'app/guide/index.html'), '<html></html>')
    const { pageMarkdownPath, sectionDir } = makeExport(distRoot, 'app/guide', {
      'part-one.md': '## Part one\n',
    })

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: 'app/guide',
      pageMarkdownPath,
      sectionDir,
    })

    expect(fs.existsSync(path.join(distRoot, 'app/guide/index.html'))).toBe(true)
    expect(fs.existsSync(path.join(distRoot, 'app/guide/part-one.md'))).toBe(true)
    expect(fs.existsSync(path.join(distRoot, 'app/guide.md'))).toBe(true)
  })

  test('copies only markdown out of the fragment directory', () => {
    const distRoot = makeTempDir()
    const { pageMarkdownPath, sectionDir } = makeExport(distRoot, 'app/guide', {
      'part-one.md': '## Part one\n',
      'notes.txt': 'not markdown',
    })

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: 'app/guide',
      pageMarkdownPath,
      sectionDir,
    })

    expect(fs.readdirSync(path.join(distRoot, 'app/guide'))).toEqual(['part-one.md'])
  })

  test('counts the pages and fragments it published', () => {
    const distRoot = makeTempDir()
    const mirror = new CanonicalMarkdownMirror(distRoot)

    const withSections = makeExport(distRoot, 'app/guide', {
      'part-one.md': '## Part one\n',
      'part-two.md': '## Part two\n',
    })
    mirror.mirror({ route: 'app/guide', ...withSections })

    const withoutSections = makeExport(distRoot, 'app/other')
    mirror.mirror({ route: 'app/other', ...withoutSections })

    expect(mirror.getMetrics()).toEqual({ pageCount: 2, sectionCount: 2 })
  })

  test('throws when two documents claim the same markdown path', () => {
    const distRoot = makeTempDir()
    const mirror = new CanonicalMarkdownMirror(distRoot)

    const parent = makeExport(distRoot, 'app/guide', { 'setup.md': '## Setup\n' })
    mirror.mirror({ route: 'app/guide', ...parent })

    const nested = makeExport(distRoot, 'app/elsewhere')
    expect(() => mirror.mirror({ route: 'app/guide/setup', ...nested })).toThrow(
      /app\/guide\/setup\.md/,
    )
  })

  test('falls back to index.md for a page routed at the site root', () => {
    const distRoot = makeTempDir()
    const { pageMarkdownPath } = makeExport(distRoot, 'home')

    new CanonicalMarkdownMirror(distRoot).mirror({
      route: '',
      pageMarkdownPath,
      sectionDir: null,
    })

    expect(fs.existsSync(path.join(distRoot, 'index.md'))).toBe(true)
  })
})

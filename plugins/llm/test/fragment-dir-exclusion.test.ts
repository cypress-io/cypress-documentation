import { afterEach, describe, expect, test } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { MarkdownExporter } from '../src/MarkdownExporter'
import { writeSitemap } from '../src/sitemap'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fragment-excl-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

/** Lays out markdown export output: a page, its fragment dir, and a real subdir. */
function makeMarkdownTree(distRoot: string): string {
  const markdownRoot = path.join(distRoot, 'llm', 'markdown')
  fs.mkdirSync(path.join(markdownRoot, 'app', 'guide'), { recursive: true })
  fs.mkdirSync(path.join(markdownRoot, 'app', 'real-section'), { recursive: true })
  fs.writeFileSync(path.join(markdownRoot, 'app', 'guide.md'), '# Guide\n')
  fs.writeFileSync(path.join(markdownRoot, 'app', 'guide', 'part-one.md'), '## Part one\n')
  fs.writeFileSync(path.join(markdownRoot, 'app', 'real-section', 'page.md'), '# Page\n')
  return markdownRoot
}

// ---------------------------------------------------------------------------
// directory indexes
// ---------------------------------------------------------------------------

describe('buildMarkdownDirectoryIndexes with fragment dirs', () => {
  test('fragment dirs get no index.md and are not listed in the parent index', () => {
    const distRoot = makeTempDir()
    makeMarkdownTree(distRoot)
    const exporter = new MarkdownExporter(distRoot, path.join(distRoot, 'llm'))

    exporter.buildMarkdownDirectoryIndexes(new Set(['app/guide']))

    const markdownRoot = path.join(distRoot, 'llm', 'markdown')
    expect(fs.existsSync(path.join(markdownRoot, 'app', 'guide', 'index.md'))).toBe(false)

    const appIndex = fs.readFileSync(path.join(markdownRoot, 'app', 'index.md'), 'utf8')
    expect(appIndex).toContain('[guide](guide.md)')
    expect(appIndex).not.toContain('guide/index.md')
    // non-fragment subdirs are still indexed and listed
    expect(appIndex).toContain('real-section/index.md')
    expect(fs.existsSync(path.join(markdownRoot, 'app', 'real-section', 'index.md'))).toBe(true)
  })

  test('lists and indexes all subdirs when no fragment dirs are passed', () => {
    const distRoot = makeTempDir()
    makeMarkdownTree(distRoot)
    const exporter = new MarkdownExporter(distRoot, path.join(distRoot, 'llm'))

    exporter.buildMarkdownDirectoryIndexes()

    const markdownRoot = path.join(distRoot, 'llm', 'markdown')
    const appIndex = fs.readFileSync(path.join(markdownRoot, 'app', 'index.md'), 'utf8')
    expect(appIndex).toContain('guide/index.md')
  })
})

// ---------------------------------------------------------------------------
// sitemap
// ---------------------------------------------------------------------------

describe('writeSitemap with fragment dirs', () => {
  test('excludes files inside fragment dirs but keeps pages and other dirs', () => {
    const distRoot = makeTempDir()
    makeMarkdownTree(distRoot)
    fs.writeFileSync(path.join(distRoot, 'llms.txt'), 'manifest')

    writeSitemap('https://docs.cypress.io', distRoot, new Set(['app/guide']))

    const sitemap = fs.readFileSync(path.join(distRoot, 'sitemap-llm.xml'), 'utf8')
    expect(sitemap).toContain('llm/markdown/app/guide.md')
    expect(sitemap).not.toContain('llm/markdown/app/guide/part-one.md')
    expect(sitemap).toContain('llm/markdown/app/real-section/page.md')
    expect(sitemap).toContain('llms.txt')
  })

  test('includes fragment files when no exclusions are passed', () => {
    const distRoot = makeTempDir()
    makeMarkdownTree(distRoot)

    writeSitemap('https://docs.cypress.io', distRoot)

    const sitemap = fs.readFileSync(path.join(distRoot, 'sitemap-llm.xml'), 'utf8')
    expect(sitemap).toContain('llm/markdown/app/guide/part-one.md')
  })
})

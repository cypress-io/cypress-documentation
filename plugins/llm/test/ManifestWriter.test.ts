import { afterEach, test, expect, describe } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { ManifestWriter } from '../src/ManifestWriter'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'))
  tempDirs.push(dir)
  return dir
}

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

// ---------------------------------------------------------------------------
// Output files
// ---------------------------------------------------------------------------

describe('write: output files', () => {
  test('creates llms.json at the distRoot', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    expect(fs.existsSync(path.join(dist, 'llms.json'))).toBe(true)
  })

  test('creates .well-known/llms.json', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    expect(fs.existsSync(path.join(dist, '.well-known', 'llms.json'))).toBe(true)
  })

  test('creates .well-known directory even when it does not exist beforehand', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    expect(fs.statSync(path.join(dist, '.well-known')).isDirectory()).toBe(true)
  })

  test('both output files contain identical content', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({ emit: { json: true } }, '2024-06-15T12:00:00Z')
    const root = readJson(path.join(dist, 'llms.json'))
    const wellKnown = readJson(path.join(dist, '.well-known', 'llms.json'))
    expect(root).toEqual(wellKnown)
  })
})

// ---------------------------------------------------------------------------
// Fixed manifest fields
// ---------------------------------------------------------------------------

describe('buildManifest: fixed fields', () => {
  test('site_name is always "Cypress Documentation"', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    expect(readJson(path.join(dist, 'llms.json')).site_name).toBe('Cypress Documentation')
  })

  test('root_url is always "https://docs.cypress.io"', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    expect(readJson(path.join(dist, 'llms.json')).root_url).toBe('https://docs.cypress.io')
  })

  test('last_updated reflects the generatedAt argument', () => {
    const dist = makeTempDir()
    const ts = '2025-03-22T08:30:00Z'
    new ManifestWriter(dist).write({}, ts)
    expect(readJson(path.join(dist, 'llms.json')).last_updated).toBe(ts)
  })

  test('description field is present and non-empty', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    const { description } = readJson(path.join(dist, 'llms.json'))
    expect(typeof description).toBe('string')
    expect((description as string).length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// datasets
// ---------------------------------------------------------------------------

describe('buildManifest: datasets', () => {
  test('always includes the HTML index dataset', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: { url: string; format: string }[] }
    expect(datasets.some((d) => d.url === '/' && d.format === 'html')).toBe(true)
  })

  test('always includes the markdown index dataset', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: { url: string; format: string }[] }
    expect(datasets.some((d) => d.url === '/llm/markdown/index.md' && d.format === 'markdown')).toBe(true)
  })

  test('has exactly 2 datasets when emit.json is absent', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: unknown[] }
    expect(datasets).toHaveLength(2)
  })

  test('has exactly 2 datasets when emit.json is false', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({ emit: { json: false } }, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: unknown[] }
    expect(datasets).toHaveLength(2)
  })

  test('has 4 datasets when emit.json is true', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({ emit: { json: true } }, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: unknown[] }
    expect(datasets).toHaveLength(4)
  })

  test('includes chunked JSON index dataset when emit.json is true', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({ emit: { json: true } }, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: { url: string; format: string }[] }
    expect(datasets.some((d) => d.url === '/llm/json/chunked/index.json' && d.format === 'json')).toBe(true)
  })

  test('includes full JSON index dataset when emit.json is true', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({ emit: { json: true } }, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as { datasets: { url: string; format: string }[] }
    expect(datasets.some((d) => d.url === '/llm/json/full/index.json' && d.format === 'json')).toBe(true)
  })

  test('JSON datasets are intended_for llm only', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({ emit: { json: true } }, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as {
      datasets: { url: string; intended_for: string[] }[]
    }
    const jsonDatasets = datasets.filter((d) => d.url.endsWith('.json'))
    for (const d of jsonDatasets) {
      expect(d.intended_for).toEqual(['llm'])
    }
  })

  test('HTML dataset is intended_for human only', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as {
      datasets: { url: string; intended_for: string[] }[]
    }
    const htmlDataset = datasets.find((d) => d.format === 'html')!
    expect(htmlDataset.intended_for).toEqual(['human'])
  })

  test('markdown dataset is intended_for both human and llm', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({}, '2024-01-01T00:00:00Z')
    const { datasets } = readJson(path.join(dist, 'llms.json')) as {
      datasets: { format: string; intended_for: string[] }[]
    }
    const mdDataset = datasets.find((d) => d.format === 'markdown')!
    expect(mdDataset.intended_for).toContain('human')
    expect(mdDataset.intended_for).toContain('llm')
  })
})

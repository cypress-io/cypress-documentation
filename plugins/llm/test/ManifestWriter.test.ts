import { afterEach, test, expect, describe } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { ManifestWriter } from '../src/ManifestWriter'
import matter from 'gray-matter'
import { LlmExportConfig } from '../src/types'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'))
  tempDirs.push(dir)
  return dir
}

function writeAndRetrieveManifest(config: Partial<LlmExportConfig>) {
  const dist = makeTempDir()
  new ManifestWriter(dist).write(config as LlmExportConfig)
  const fileContent = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8')
  const parsed = matter(fileContent, { engines: {  } })
  return{
    frontmatter: parsed.data,
    content: parsed.content,
  } 
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
    expect(fs.existsSync(path.join(dist, 'llms.txt'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Fixed manifest fields
// ---------------------------------------------------------------------------

describe('buildManifest: fixed fields', () => {
  test('name is always "Cypress"', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(frontmatter.name).toBe('Cypress')
  })

  test('description field is present and non-empty', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(typeof frontmatter.description).toBe('string')
    expect(frontmatter.description.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// datasets
// ---------------------------------------------------------------------------

describe('buildManifest: datasets', () => {
  test('always includes the HTML index dataset', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(frontmatter.documentation.some((d) => d.type === 'primary' && d.format === 'html')).toBe(true)
  })

  test('always includes the markdown index dataset', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(frontmatter.documentation.some((d) => d.type === 'markdown' && d.format === 'markdown')).toBe(true)
  })

  test('has exactly 2 datasets when emit.json is absent', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(frontmatter.documentation).toHaveLength(2)
  })

  test('has exactly 2 datasets when emit.json is false', () => {
    const { frontmatter } = writeAndRetrieveManifest({ emit: { json: false } })
    expect(frontmatter.documentation).toHaveLength(2)
  })

  test('has 4 datasets when emit.json is true', () => {
    const { frontmatter } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(frontmatter.documentation).toHaveLength(4)
  })

  test('includes chunked JSON index dataset when emit.json is true', () => {
    const { frontmatter } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(frontmatter.documentation.some((d) => d.type === 'json_chunked' && d.format === 'json')).toBe(true)
  })

  test('includes full JSON index dataset when emit.json is true', () => {
    const { frontmatter } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(frontmatter.documentation.some((d) => d.type === 'json' && d.format === 'json')).toBe(true)
  })

  test('JSON datasets are intended_for llm only', () => {
    const { frontmatter } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(frontmatter.documentation.filter((d) => d.type === 'json' || d.type === 'json_chunked').every((d) => d.audience === 'llm')).toBe(true)
  })

  test('HTML dataset is intended_for human only', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(frontmatter.documentation.find((d) => d.type === 'primary')?.audience).toEqual('human')
  })

  test('markdown dataset is intended_for both human and llm', () => {
    const { frontmatter } = writeAndRetrieveManifest({})
    expect(frontmatter.documentation.find((d) => d.type === 'markdown')?.audience).toEqual(['human', 'llm'])
  })
})

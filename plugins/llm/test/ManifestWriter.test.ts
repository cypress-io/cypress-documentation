import { afterEach, test, expect, describe } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { ManifestWriter } from '../src/ManifestWriter'
import { LlmExportConfig } from '../src/types'

const tempDirs: string[] = []

type ManifestEntry = {
  type: string
  format: string
  audience: string | string[]
  url?: string
  url_pattern?: string
  example?: string
}

type Manifest = {
  name: string
  description: string
  generated_at: string | null
  key_features: string[]
  documentation: ManifestEntry[]
  llm_guidance: string[]
}

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'))
  tempDirs.push(dir)
  return dir
}

function writeAndRetrieveManifest(
  config: Partial<LlmExportConfig>,
  generatedAt?: string,
): Manifest {
  const dist = makeTempDir()
  new ManifestWriter(dist).write(config as LlmExportConfig, generatedAt)
  return JSON.parse(fs.readFileSync(path.join(dist, 'docs-manifest.json'), 'utf8')) as Manifest
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
  test('creates docs-manifest.json at the distRoot', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({} as LlmExportConfig, '2024-01-01T00:00:00Z')
    expect(fs.existsSync(path.join(dist, 'docs-manifest.json'))).toBe(true)
  })

  test('does not write llms.txt — that is LlmsTxtWriter\'s file', () => {
    const dist = makeTempDir()
    new ManifestWriter(dist).write({} as LlmExportConfig)
    expect(fs.existsSync(path.join(dist, 'llms.txt'))).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Fixed manifest fields
// ---------------------------------------------------------------------------

describe('buildManifest: fixed fields', () => {
  test('name is always "Cypress"', () => {
    expect(writeAndRetrieveManifest({}).name).toBe('Cypress')
  })

  test('description field is present and non-empty', () => {
    const manifest = writeAndRetrieveManifest({})
    expect(typeof manifest.description).toBe('string')
    expect(manifest.description.length).toBeGreaterThan(0)
  })

  test('carries over the key features that used to sit below the llms.txt frontmatter', () => {
    expect(writeAndRetrieveManifest({}).key_features).toContain('Time-travel debugging')
  })

  test('records the export timestamp when given one', () => {
    expect(writeAndRetrieveManifest({}, '2024-01-01T00:00:00Z').generated_at).toBe(
      '2024-01-01T00:00:00Z',
    )
  })

  test('generated_at is null when no timestamp is given', () => {
    expect(writeAndRetrieveManifest({}).generated_at).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// datasets
// ---------------------------------------------------------------------------

describe('buildManifest: datasets', () => {
  test('always includes the HTML index dataset', () => {
    const { documentation } = writeAndRetrieveManifest({})
    expect(documentation.some((d) => d.type === 'primary' && d.format === 'html')).toBe(true)
  })

  test('always includes the markdown index dataset', () => {
    const { documentation } = writeAndRetrieveManifest({})
    expect(documentation.some((d) => d.type === 'markdown' && d.format === 'markdown')).toBe(true)
  })

  test('has exactly 6 datasets when emit.json is absent', () => {
    expect(writeAndRetrieveManifest({}).documentation).toHaveLength(6)
  })

  test('has exactly 6 datasets when emit.json is false', () => {
    expect(writeAndRetrieveManifest({ emit: { json: false } }).documentation).toHaveLength(6)
  })

  test('has 8 datasets when emit.json is true', () => {
    expect(writeAndRetrieveManifest({ emit: { json: true } }).documentation).toHaveLength(8)
  })

  test('includes chunked JSON index dataset when emit.json is true', () => {
    const { documentation } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(documentation.some((d) => d.type === 'json_chunked' && d.format === 'json')).toBe(true)
  })

  test('includes full JSON index dataset when emit.json is true', () => {
    const { documentation } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(documentation.some((d) => d.type === 'json' && d.format === 'json')).toBe(true)
  })

  test('JSON datasets are intended_for llm only', () => {
    const { documentation } = writeAndRetrieveManifest({ emit: { json: true } })
    expect(
      documentation
        .filter((d) => d.type === 'json' || d.type === 'json_chunked')
        .every((d) => d.audience === 'llm'),
    ).toBe(true)
  })

  test('HTML dataset is intended_for human only', () => {
    const { documentation } = writeAndRetrieveManifest({})
    expect(documentation.find((d) => d.type === 'primary')?.audience).toEqual('human')
  })

  test('advertises the per-page markdown URL pattern', () => {
    const { documentation } = writeAndRetrieveManifest({ url: 'https://docs.cypress.io' })
    const pageMarkdown = documentation.find((d) => d.type === 'markdown_page')
    expect(pageMarkdown?.url_pattern).toBe('https://docs.cypress.io/<page-path>.md')
    expect(pageMarkdown?.audience).toEqual(['human', 'llm'])
  })

  test('advertises the per-section markdown URL pattern', () => {
    const { documentation } = writeAndRetrieveManifest({ url: 'https://docs.cypress.io' })
    expect(documentation.find((d) => d.type === 'markdown_section')?.url_pattern).toBe(
      'https://docs.cypress.io/<page-path>/<h2-slug>.md',
    )
  })

  test('markdown dataset is intended_for both human and llm', () => {
    const { documentation } = writeAndRetrieveManifest({})
    expect(documentation.find((d) => d.type === 'markdown')?.audience).toEqual(['human', 'llm'])
  })

  test('points at both llms.txt and llms-full.txt', () => {
    const { documentation } = writeAndRetrieveManifest({ url: 'https://docs.cypress.io' })
    expect(documentation.find((d) => d.type === 'llms_txt')?.url).toBe(
      'https://docs.cypress.io/llms.txt',
    )
    expect(documentation.find((d) => d.type === 'llms_full')?.url).toBe(
      'https://docs.cypress.io/llms-full.txt',
    )
  })

  test('trims a trailing slash from the configured site URL', () => {
    const { documentation } = writeAndRetrieveManifest({ url: 'https://docs.cypress.io/' })
    expect(documentation.find((d) => d.type === 'llms_txt')?.url).toBe(
      'https://docs.cypress.io/llms.txt',
    )
  })
})

// ---------------------------------------------------------------------------
// llm_guidance
// ---------------------------------------------------------------------------

describe('buildManifest: llm_guidance', () => {
  test('still tells an agent how to reach a page\'s markdown', () => {
    const { llm_guidance } = writeAndRetrieveManifest({})
    expect(llm_guidance.some((line) => line.includes('.md'))).toBe(true)
  })

  test('points agents at llms.txt first', () => {
    expect(writeAndRetrieveManifest({}).llm_guidance[0]).toContain('llms.txt')
  })
})

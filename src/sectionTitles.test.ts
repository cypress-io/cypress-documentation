import { readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, test } from 'vitest'
import sectionTitles from './sectionTitles'

const { productForDocId } = sectionTitles

const docsDir = join(__dirname, '..', 'docs')

// A doc id is its source path under docs/ without the extension. No doc sets
// an `id` in frontmatter or carries a number prefix, either of which would
// change it.
function allDocIds(dir = docsDir): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name === 'partials' ? [] : allDocIds(path)
    }
    return entry.name.endsWith('.mdx')
      ? [relative(docsDir, path).replace(/\.mdx$/, '')]
      : []
  })
}

describe('productForDocId', () => {
  test.each([
    ['api/commands/blur', 'app'],
    ['app/get-started/why-cypress', 'app'],
    ['app/ai/overview', 'ai'],
    ['app/ai/cypress-studio', 'ai'],
    ['cloud/get-started/introduction', 'cloud'],
    ['accessibility/configuration/profiles', 'accessibility'],
    ['ui-coverage/configuration/profiles', 'ui-coverage'],
  ])('%s is %s', (docId, product) => {
    expect(productForDocId(docId)).toBe(product)
  })

  test('matches whole folder names, not prefixes of them', () => {
    expect(productForDocId('app/ai-tools/page')).toBe('app')
    expect(productForDocId('apps/page')).toBeUndefined()
  })

  test('a folder name alone is a doc at the top level, not the folder', () => {
    expect(productForDocId('app')).toBeUndefined()
    expect(productForDocId('app/ai')).toBe('app')
  })

  test('a doc in no listed folder has no product', () => {
    expect(productForDocId('other/page')).toBeUndefined()
    expect(productForDocId('page')).toBeUndefined()
  })

  test('every doc page has a product', () => {
    const docIds = allDocIds()
    expect(docIds.length).toBeGreaterThan(300)
    expect(docIds.filter((id) => !productForDocId(id))).toEqual([])
  })

  test('every page in docs/app/ai/ is ai, wherever it publishes', () => {
    const aiDocs = allDocIds().filter((id) => id.startsWith('app/ai/'))
    expect(aiDocs.length).toBeGreaterThan(0)
    aiDocs.forEach((id) => expect(productForDocId(id)).toBe('ai'))
  })
})

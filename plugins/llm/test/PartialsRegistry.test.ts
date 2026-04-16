import { afterEach, test, expect } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { PartialsRegistry } from '../src/PartialsRegistry'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'partials-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

test('getPartials: returns empty object before loadPartials is called', () => {
  const registry = new PartialsRegistry('/nonexistent', '/nonexistent')
  expect(registry.getPartials()).toEqual({})
})

test('loadPartials: no-op when partialsMode is not "inline"', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_item.mdx'), 'Content.\n')
  const registry = new PartialsRegistry(root, root)
  registry.loadPartials({ partialsMode: 'standalone', includeSections: [] })
  expect(registry.getPartials()).toEqual({})
})

test('loadPartials: no-op when includeSections is undefined', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_item.mdx'), 'Content.\n')
  const registry = new PartialsRegistry(root, root)
  registry.loadPartials({ partialsMode: 'inline' })
  expect(registry.getPartials()).toEqual({})
})

test('loadPartials: no-op when includeSections excludes "partials"', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_item.mdx'), 'Content.\n')
  const registry = new PartialsRegistry(root, root)
  registry.loadPartials({ partialsMode: 'inline', includeSections: ['api', 'app'] })
  expect(registry.getPartials()).toEqual({})
})

test('loadPartials: no-op when partials directory does not exist', () => {
  const root = makeTempDir()
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  expect(registry.getPartials()).toEqual({})
})

test('loadPartials: empty includeSections array loads partials (does not exclude)', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_item.mdx'), 'Item content.\n')
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  expect(Object.keys(registry.getPartials()).length).toBeGreaterThan(0)
})

test('loadPartials: includeSections containing "partials" loads partials', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_item.mdx'), 'Item content.\n')
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: ['api', 'partials'] })
  expect(Object.keys(registry.getPartials()).length).toBeGreaterThan(0)
})

test('loadPartials: derives component name by capitalising stripped filename when no MDXComponents.js', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_my-partial.mdx'), '# Partial\n\nBody.\n')
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  const partials = registry.getPartials()
  expect(Object.keys(partials)).toContain('My-partial')
  expect(partials['My-partial']).toMatch(/# Partial/)
  expect(partials['My-partial']).toMatch(/Body\./)
})

test('loadPartials: underscore-only filename falls back to "Partial" as component name', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_.mdx'), 'Content.\n')
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  expect(Object.keys(registry.getPartials())).toContain('Partial')
})

test('loadPartials: uses MDXComponents.js import name as component key', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(path.join(root, 'partials', '_foo.mdx'), 'Foo content.\n')
  const siteDir = makeTempDir()
  fs.mkdirSync(path.join(siteDir, 'src', 'theme'), { recursive: true })
  fs.writeFileSync(
    path.join(siteDir, 'src', 'theme', 'MDXComponents.js'),
    'import FooComponent from "@site/docs/partials/_foo.mdx";\n',
  )
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  const partials = registry.getPartials()
  expect(Object.keys(partials)).toContain('FooComponent')
  expect(partials['FooComponent']).toMatch(/Foo content\./)
})

test('loadPartials: MDX imports in partial content are normalized away', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(
    path.join(root, 'partials', '_with-import.mdx'),
    "import Foo from './foo'\n\n# Title\n\nBody text.\n",
  )
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  const content = Object.values(registry.getPartials())[0] as string
  expect(content.includes('import')).toBe(false)
  expect(content).toMatch(/# Title/)
  expect(content).toMatch(/Body text\./)
})

test('loadPartials: frontmatter is stripped from partial content', () => {
  const root = makeTempDir()
  fs.mkdirSync(path.join(root, 'partials'))
  fs.writeFileSync(
    path.join(root, 'partials', '_with-fm.mdx'),
    '---\ntitle: Secret Title\n---\n\nBody content.\n',
  )
  const siteDir = makeTempDir()
  const registry = new PartialsRegistry(root, siteDir)
  registry.loadPartials({ partialsMode: 'inline', includeSections: [] })
  const content = Object.values(registry.getPartials())[0] as string
  expect(content.includes('---')).toBe(false)
  expect(content.includes('Secret Title')).toBe(false)
  expect(content).toMatch(/Body content\./)
})

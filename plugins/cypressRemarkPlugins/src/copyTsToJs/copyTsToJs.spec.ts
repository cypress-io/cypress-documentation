import { expect, it } from 'vitest'
import { copyTsToJs, toJsMeta } from './copyTsToJs'

it('rewrites a .ts title to .js for the generated JS block', () => {
  expect(toJsMeta('copyTsToJs title="cypress/support/commands.ts"')).toEqual(
    ' title="cypress/support/commands.js"',
  )
})

it('rewrites .tsx, .mts, and .cts titles', () => {
  expect(toJsMeta('copyTsToJs title="Button.cy.tsx"')).toEqual(' title="Button.cy.jsx"')
  expect(toJsMeta("copyTsToJs title='config.mts'")).toEqual(" title='config.mjs'")
  expect(toJsMeta('copyTsToJs title="config.cts"')).toEqual(' title="config.cjs"')
})

it('leaves meta without a TypeScript title unchanged', () => {
  expect(toJsMeta('copyTsToJs')).toEqual('')
  expect(toJsMeta('copyTsToJs title="notes.txt"')).toEqual(' title="notes.txt"')
  expect(toJsMeta('copyTsToJs showLineNumbers')).toEqual(' showLineNumbers')
})

// The options docusaurus.config.js passes, so Prettier parses TypeScript
const siteOptions = { prettierOptions: { parser: 'typescript' } }

const code = (meta: string, value: string) => ({ type: 'code', lang: 'typescript', meta, value })

it('groups the JS and TS blocks under a CypressLangTabs node, JS first', () => {
  const root = { type: 'root', children: [code('copyTsToJs title="a.ts"', 'const a: number = 1\n')] }
  copyTsToJs(siteOptions)(root)

  expect(root.children).toHaveLength(1)
  const [tabs] = root.children as any[]
  expect(tabs.data).toEqual({ hName: 'CypressLangTabs' })
  expect(tabs.children.map((c) => [c.lang, c.meta])).toEqual([
    ['js', ' title="a.js"'],
    ['typescript', ' title="a.ts"'],
  ])
})

it('leaves the blocks ungrouped inside a parent that renders its own tabs', () => {
  const directive = {
    type: 'containerDirective',
    data: { hName: 'CypressConfigFileTabs' },
    children: [code('copyTsToJs', 'const a: number = 1\n')],
  }
  const root = { type: 'root', children: [directive] }
  copyTsToJs(siteOptions)(root)

  expect(directive.children.map((c: any) => c.lang)).toEqual(['js', 'typescript'])
})

it('leaves code blocks without copyTsToJs untouched', () => {
  const block = code('title="a.ts"', 'const a: number = 1\n')
  const root = { type: 'root', children: [block] }
  copyTsToJs(siteOptions)(root)

  expect(root.children).toEqual([block])
})

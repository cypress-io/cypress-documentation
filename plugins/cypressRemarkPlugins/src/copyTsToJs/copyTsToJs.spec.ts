import { expect, it } from 'vitest'
import { toJsMeta } from './copyTsToJs'

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

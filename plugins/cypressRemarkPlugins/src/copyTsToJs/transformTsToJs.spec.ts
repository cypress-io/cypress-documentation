import { transformTsToJs } from './transformTsToJs'
import { expect, it } from 'vitest'

it(`should strip out any typings`, () => {
  const code = `const age: number = 23
  const name: string = 'joe';
  function foo(bar: string) {}
  `

  const { jsCode } = transformTsToJs(code, {})

  expect(jsCode).toEqual(`const age = 23
const name = 'joe'
function foo(bar) {}`)
})

it('should maintain newlines', () => {
  const code = `import { defineConfig } from 'cypress'

export default defineConfig({})

export const name = 'joe'`

  const { jsCode } = transformTsToJs(code, {})

  expect(jsCode).toEqual(`const { defineConfig } = require('cypress')

module.exports = defineConfig({})

module.exports.name = 'joe'`)
})

it('should convert imports/exports to require/modules', () => {
  const code = `import { defineConfig } from 'cypress'
export default defineConfig({})
export const name = 'joe'`
  const { jsCode } = transformTsToJs(code, {})

  expect(jsCode).toEqual(`const { defineConfig } = require('cypress')
module.exports = defineConfig({})
module.exports.name = 'joe'`)
})

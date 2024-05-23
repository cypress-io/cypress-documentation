import { expect, it } from 'vitest'
import { transformTsToJs } from './transformTsToJs'

it(`should strip out any typings`, async () => {
  const code = `const age: number = 23
  const name: string = 'joe';
  function foo(bar: string) {}
  `

  const { jsCode } = await transformTsToJs(code, {})

  expect(jsCode).toEqual(`const age = 23
const name = 'joe'
function foo(bar) {}`)
})

it('should maintain newlines', async () => {
  const code = `import { defineConfig } from 'cypress'

export default defineConfig({})

export const name = 'joe'`

  const { jsCode } = await transformTsToJs(code, {})

  expect(jsCode).toEqual(`const { defineConfig } = require('cypress')

module.exports = defineConfig({})

module.exports.name = 'joe'`)
})

it('should convert imports/exports to require/modules', async () => {
  const code = `import { defineConfig } from 'cypress'
export default defineConfig({})
export const name = 'joe'`
  const { jsCode } = await transformTsToJs(code, {})

  expect(jsCode).toEqual(`const { defineConfig } = require('cypress')
module.exports = defineConfig({})
module.exports.name = 'joe'`)
})

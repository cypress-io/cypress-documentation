import { transformEsmToCjs } from './transformEsmToCjs'
import { expect, it } from 'vitest'

it(`should replace "import foo from 'bar'" with "const foo = require('bar')"`, () => {
  const code = `import foo from 'bar'`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`const foo = require('bar')`)
})

it(`should replace "import { foo } from 'bar'" with "const { foo } = require('bar')"`, () => {
  const code = `import { foo } from 'bar'`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`const { foo } = require('bar')`)
})

it(`should replace "import { a, b, c } from 'bar'" with "const { a, b, c } = require('bar')"`, () => {
  const code = `import { a, b, c } from 'bar'`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`const { a, b, c } = require('bar')`)
})

it(`should replace "import 'bar'" with "require('bar')"`, () => {
  const code = `import 'bar'`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`require('bar')`)
})

it(`should replace "import { 
  a,
  b,
  c
} from 'bar'" with "const {
  a,
  b,
  c
} = require('bar')"`, () => {
  const code = `import {
  a,
  b,
  c
} from 'bar'`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`const {
  a,
  b,
  c
} = require('bar')`)
})

it(`should replace "export default defineConfig({})" with "module.exports = defineConfig({})"`, () => {
  const code = `export default defineConfig({})`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`module.exports = defineConfig({})`)
})

it(`should replace "export const name = 'joe'" with "module.exports.name = 'joe'"`, () => {
  const code = `export const name = 'joe'`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`module.exports.name = 'joe'`)
})

it(`should work on longer example`, () => {
  const code = `import { defineConfig } from 'cypress';
import '@cypress/instrument-cra';
export default defineConfig({
  component: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    },
  },
});`

  const result = transformEsmToCjs(code)
  expect(result).toEqual(`const { defineConfig } = require('cypress')
require('@cypress/instrument-cra')
module.exports = defineConfig({
  component: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    },
  },
});`)
})

it('should maintain newlines', () => {
  const code = `import { defineConfig } from 'cypress';

export default defineConfig({

});
export const name = 'joe';`
  const result = transformEsmToCjs(code)
  expect(result).toEqual(`const { defineConfig } = require('cypress')

module.exports = defineConfig({

});
module.exports.name = 'joe';`)
})

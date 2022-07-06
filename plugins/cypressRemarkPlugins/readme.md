This "package" contains a few remark plugins for creating Tabs/code-blocks for
Cypress config samples.

## cypressConfigSample

This is a remark plugin that will take a TypeScript code block and turn it into
a cypress config example with TS and JS code blocks. It uses the
`CypressConfigFileTabs` component to display each code block in its own tab.

Usage:

```ts cypressConfigSample
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
  },
})
```

Will output:

<CypressConfigFileTabs>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
  },
})
```

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
  },
})
```

</CypressConfigFileTabs>

> Note that the JS code block is the first one outputed

This is developed as a separate "package" so it can be in TS and have its own
tests/builds outside of the main docs. The docs reference the compiled JS files
in the dist folder, so its intended that the dist folder be checked into git.

To build run `yarn build`

To test run `yarn test`

## cypress-plugin-sample directive

This "package" is a remark plugin that will take a triple colon directive
(`:::cypress-plugin-sample`) with one or two code blocks and convert it to a
tabs with examples on how to use the plugin in TS and JS. If two code blocks are
present, then the first will be included after the initial imports, and the
second will be included in the `setupNodeEvents` method. If only one code block
exists, it will be included in the `setupNodeEvents` method.

It uses the `CypressConfigFileTabs` component to display each code block in its
own tab.

Usage:

:::cypress-plugin-sample

```ts
import fs from 'fs'
```

```ts
on('before:browser:launch', (browser = {}, launchOptions) => {
  /* ... */
})
```

:::

Will output:

<CypressConfigFileTabs>

```js
const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        /* ... */
      })
    },
  },
})
```

```typescript
import { defineConfig } from 'cypress'
import fs from 'fs'

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        /* ... */
      })
    },
  },
})
```

</CypressConfigFileTabs>

> Note that the JS code block is the first one outputed

This is developed as a separate "package" so it can be in TS and have its own
tests/builds outside of the main docs. The docs reference the compiled JS files
in the dist folder, so its intended that the dist folder be checked into git.

To build run `yarn build`

To test run `yarn test`

## copyTsToJs Plugin

This "package" is a remark plugin that will take a TypeScript code block, make a
copy of it, and convert it to a JavaScript block. To do so, put the
`copyTsToJs` as meta data for the code block.

Usage:

```typescript copyTsToJs
const name: string = 'joe'

export default name
```

Will output:

```js
const name = 'joe'

module.exports = name
```

```typescript
const name: string = 'joe'

export default name
```

> Note that the JS code block is the first one

From here, a custom MDX component can do what it wishes with the outputted code
blocks.

Inspired from
https://github.com/sapphiredev/documentation-plugins/tree/main/packages/ts2esm2cjs
and modified for our needs.

This is developed as a separate "package" so it can be in TS and have its own
tests/builds outside of the main docs. The docs reference the compiled JS files
in the dist folder, so its intended that the dist folder be checked into git.

To build run `yarn build`

To test run `yarn test`


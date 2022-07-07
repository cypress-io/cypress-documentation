This "package" contains a few remark plugins for creating Tabs/code-blocks for
Cypress config samples.

This is developed as a separate package so it can be in TS and have its own
tests/builds outside of the main docs.

To build run `yarn build`

To test run `yarn test`

## cypress-config-example directive

This is a remark plugin that will take a triple colon directive
(`:::cypress-config-example`) with one or two code blocks. If only one code
block is supplied, it will be the object that gets passed into the
`defineConfig` method. If two code blocks are supplied, the first will be after
the import, and the second will be passed to the `defineConfig` method. It will
then hydrate a template that contains a full TS code example. The code example
will get the `copyTsToJs` plugin applied to it so it will also get converted to
JS. Then, both examples are wrapped with the `CypressConfigFileTabs` component
to display each code block in its own tab.

Usage:

:::cypress-config-example

```ts
{
    baseUrl: 'http://localhost:1234',
}
```

:::

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

## cypress-config-plugin-example directive

This "package" is a remark plugin that will take a triple colon directive
(`:::cypress-config-plugin-example`) with one or two code blocks and convert it
to a tabs with examples on how to use the plugin in TS and JS. If two code
blocks are present, then the first will be included after the initial imports,
and the second will be included in the `setupNodeEvents` method. If only one
code block exists, it will be included in the `setupNodeEvents` method.

It uses the `CypressConfigFileTabs` component to display each code block in its
own tab.

Usage:

:::cypress-config-plugin-example

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

## copyTsToJs Plugin

This "package" is a remark plugin that will take a TypeScript code block, make a
copy of it, and convert it to a JavaScript block. To do so, put the `copyTsToJs`
as meta data for the code block.

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

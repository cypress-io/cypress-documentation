This "package" contains a few remark plugins for creating Tabs/code-blocks for Cypress config samples.

## cypressConfigSample

This is a remark plugin that will take a TypeScript code block and
turn it into a cypress config example with TS and JS code blocks. It uses the
`CypressConfigFileTabs` component to display each code block in its own tab.

Usage:

```ts cypressConfigSample
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
})
```

Will output:

<CypressConfigFileTabs>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
})
```

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
})
```

</CypressConfigFileTabs>

> Note that the JS code block is the first one outputed

This is developed as a separate "package" so it can be in TS and have its own
tests/builds outside of the main docs. The docs reference the compiled JS files
in the dist folder, so its intended that the dist folder be checked into git.

To build run `yarn build`

To test run `yarn test`


## cypressConfigPluginSample

This "package" is a remark plugin that will take a TypeScript code block
containing the code that goes into the `setupNodeEvents` and turn it into a
cypress plugin example with TS and JS code blocks. It uses the
`CypressConfigFileTabs` component to display each code block in its own tab.

Usage:

```ts cypressConfigPluginSample
on('before:browser:launch', (browser = {}, launchOptions) => {
  /* ... */
})
```

Will output:

<CypressConfigFileTabs>

```js
const { defineConfig } = require('cypress')

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


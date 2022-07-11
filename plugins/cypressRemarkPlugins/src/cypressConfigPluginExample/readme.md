# cypress-config-plugin-example directive

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

> Note that the JS code block is the first one outputted

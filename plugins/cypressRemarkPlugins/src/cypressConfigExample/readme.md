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

> Note that the JS code block is the first one outputted

# copyTsToJs Plugin

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

The plugin groups the two blocks under a node that renders as the
`CypressLangTabs` component (`src/components/cypress-lang-tabs`), so they show as
JavaScript and TypeScript tabs in the `cypress-lang` tab group.

When the block sits inside a parent that already renders its own tabs, such as
the `:::cypress-config-example` directive (which sets an `hName` on the
directive node), the plugin leaves the two blocks ungrouped for that parent's
component to place.

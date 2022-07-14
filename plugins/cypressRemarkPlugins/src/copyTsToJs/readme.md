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

From here, a custom MDX component can do what it wishes with the outputted code
blocks.

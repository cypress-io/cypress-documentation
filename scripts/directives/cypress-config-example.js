const vm = require('vm')

const replacer = (key, value) => {
  if (typeof value === 'function') {
    throw new Error(`Function values not supported in json: ${key}`)
  }

  return value
}

function processNode(node, { error, warn }) {
  const { children = [] } = node
  const [{ type, value } = {}] = children

  if (type !== 'code') {
    return error(`Expected a code block inside directive`)
  }

  const configStr = value.trim()
  let configObj

  try {
    configObj = vm.runInNewContext(`(${configStr})`, {})
  } catch (err) {
    return error(`Unable to parse code`, err)
  }

  let jsonCodeBlock = ''

  try {
    jsonCodeBlock = `<code-block label="cypress.json (deprecated)">

\`\`\`json
${JSON.stringify(configObj, replacer, 2)}
\`\`\`

</code-block>`
  } catch (err) {
    warn(`${err.message} (skipping cypress.json tab)`)
  }

  return `<code-group>
<code-block label="cypress.config.js" active>

\`\`\`js
const { defineConfig } = require('cypress')

module.exports = defineConfig(${configStr})
\`\`\`

</code-block>
<code-block label="cypress.config.ts">

\`\`\`ts
import { defineConfig } from 'cypress'

export default defineConfig(${configStr})
\`\`\`

</code-block>
${jsonCodeBlock}
</code-group>`
}

module.exports = {
  type: 'containerDirective',
  name: 'cypress-config-example',
  processNode,
}

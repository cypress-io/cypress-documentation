function processNode(node, { error }) {
  const { children = [] } = node
  
  if (children.length < 1 || children.length > 2
    || !children.every(({ type }) => type === 'code')) {
    return error(`Expected 1 or 2 code blocks inside directive`)
  }
  
  let header
  let functionBody
  
  if (children.length === 1) {
    header = ''
    functionBody = children[0].value.trim()
  } else {
    header = children[0].value.trim()
    functionBody = children[1].value.trim()
  }
  
  const indent = (str, numSpaces) => {
    const padding = ' '.repeat(numSpaces)

    return str.split('\n').map(line => `${padding}${line}`).join('\n')
  }
  
  return `<code-group>
<code-block label="cypress.config.js" active>

\`\`\`js
const { defineConfig } = require('cypress')
${header}
module.exports = defineConfig({
  // setupNodeEvents can be defined in either the e2e or component
  // configuration
  e2e: {
    setupNodeEvents(on, config) {
${indent(functionBody, 6)}
    }
  }
})
\`\`\`

</code-block>
<code-block label="cypress.config.ts">

\`\`\`ts
import { defineConfig } from 'cypress'
${header}
export default defineConfig({
  // setupNodeEvents can be defined in either the e2e or component
  // configuration
  e2e: {
    setupNodeEvents(on, config) {
${indent(functionBody, 6)}
    }
  }
})
\`\`\`

</code-block>
<code-block label="plugins/index.js (deprecated)">

\`\`\`js
${header}
module.exports = (on, config) => {
${indent(functionBody, 2)}
}
\`\`\`

</code-block>
</code-group>`
}

module.exports = {
  type: 'containerDirective',
  name: 'cypress-plugin-example',
  processNode,
}

const endent = require('endent').default

function processNode(node, { _require, error, warn }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { attributes, children } = helpers.getNodeProperties(node)
  const { errorArgs, parts } = helpers.getCodeBlocks(children, { count: 2 })

  if (errorArgs) {
    return error(...errorArgs)
  }

  const [header, bodyJson] = parts
  const bodyData = Object.entries(JSON.parse(bodyJson))

  const { noPrefixKeys = [] } = attributes

  const getValue = (key, val) => {
    return noPrefixKeys.includes(key) ? val : `process.env.${val}`
  }

  const envProperties = () => {
    return bodyData
      .map(([key, val]) => `${key}: ${getValue(key, val)}`)
      .join(',\n')
  }

  const envFunctionLines = () => {
    return bodyData
      .map(([key, val]) => `config.env.${key} = ${getValue(key, val)}`)
      .join('\n')
  }

  return helpers.getCodeGroup(
    {
      label: 'cypress.config.js',
      language: 'js',
      body: endent`
        const { defineConfig } = require('cypress')

        ${header}

        module.exports = defineConfig({
          env: {
            ${envProperties(bodyData)}
          }
        })
      `,
    },
    {
      label: 'cypress.config.ts',
      language: 'ts',
      body: endent`
        import { defineConfig } from 'cypress'

        ${header}

        module.exports = defineConfig({
          env: {
            ${envProperties(bodyData)}
          }
        })
      `,
    },
    {
      label: 'plugins file (deprecated)',
      language: 'js',
      alert: endent`
      <Alert type="warning">
        
      <strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
      Deprecated</strong>

      The plugins file is deprecated as of Cypress CFG_VERSION. We recommend
      that you update your configuration. Please see the
      [plugins guide](/guides/tooling/plugins-guide) and the
      [migration guide](/guides/references/migration-guide) for more information.

      </Alert>
      `,
      body: endent`
        // cypress/plugins/index.js
        
        ${helpers.adjustPluginsFileContent(header)}

        module.exports = (on, config) => {
          ${envFunctionLines(bodyData)}
          return config
        }
      `,
    }
  )
}

module.exports = {
  type: 'containerDirective',
  name: 'cypress-env-example',
  processNode,
}

const endent = require('endent').default

function processNode(node, { _require, error, warn }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { children } = helpers.getNodeProperties(node)
  const { errorArgs, parts } = helpers.getCodeBlocks(children, { count: 2 })

  if (errorArgs) {
    return error(...errorArgs)
  }

  const [header, bodyJson] = parts
  const bodyData = Object.entries(JSON.parse(bodyJson))

  function envProperties(bodyData) {
    return bodyData
      .map(([key, val]) => {
        if (key.includes('awsConfig')) {
          return `config.env.${key}: ${val}`
        }

        return `config.env.${key}: process.env.${val}`
      })
      .join(',\n')
  }

  function envFunctionLines(bodyData) {
    return bodyData
      .map(([key, val]) => {
        if (key.includes('awsConfig')) {
          return `config.env.${key} = ${val}`
        }

        return `config.env.${key} = process.env.${val}`
      })
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
      label: 'plugins/index.js',
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
        ${header}

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

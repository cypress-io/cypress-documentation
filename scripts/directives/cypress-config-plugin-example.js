const endent = require('endent').default

function processNode(node, { _require, error, warn }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { children } = helpers.getNodeProperties(node)
  const { errorArgs, parts } = helpers.getCodeBlocks(children, { count: 4 })

  if (errorArgs) {
    return error(...errorArgs)
  }

  const [header, body, cypressJson, pluginsFile] = parts

  return helpers.getCodeGroup(
    {
      label: 'cypress.config.js',
      language: 'js',
      body: endent`
        const { defineConfig } = require('cypress')
        ${header}

        module.exports = defineConfig(${body})
      `,
    },
    {
      label: 'cypress.config.ts',
      language: 'ts',
      body: endent`
        import { defineConfig } from 'cypress'
        ${header}

        export default defineConfig(${body})
      `,
    },
    {
      label: 'cypress.json & plugins file',
      language: 'js',
      alert: endent`
        <Alert type="warning">

        <strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
        Deprecated</strong>

        The \`cypress.json\` file and plugins file are no longer supported as of Cypress
        version 10.0.0.

        We recommend that you update your configuration. Please see the
        [new configuration guide](/guides/references/configuration),
        [plugins guide](/guides/tooling/plugins-guide) and the
        [migration guide](/guides/references/migration-guide) for more information.

        </Alert>
      `,
      body: endent`
        // cypress.json (deprecated)

        __FIX_INDENT__${cypressJson}

        // plugins file (deprecated)

        __FIX_INDENT__${pluginsFile}
      `,
    }
  )
}

module.exports = {
  type: 'containerDirective',
  name: 'cypress-config-plugin-example',
  processNode,
}

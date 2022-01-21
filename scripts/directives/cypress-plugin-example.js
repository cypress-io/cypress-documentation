const endent = require('endent').default

function processNode(node, { _require, error }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { attributes, children = [] } = node

  const { errorArgs, header, body } = helpers.getHeaderAndBody(children)

  if (errorArgs) {
    return error(...errorArgs)
  }

  const noComment = 'noComment' in attributes
  const { configProp = 'e2e' } = attributes
  let configPropAndComment = noComment
    ? configProp
    : endent`
        // setupNodeEvents can be defined in either
        // the e2e or component configuration
        ${configProp}
      `

  return helpers.getCodeGroup(
    {
      label: 'cypress.config.js',
      language: 'js',
      body: endent`
        const { defineConfig } = require('cypress')
        ${header}
        module.exports = defineConfig({
          ${configPropAndComment}: {
            setupNodeEvents(on, config) {
              ${body}
            }
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
        export default defineConfig({
          ${configPropAndComment}: {
            setupNodeEvents(on, config) {
              ${body}
            }
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

        The plugins file is no longer supported as of Cypress CFG_VERSION. We recommend
        that you update your configuration. Please see the
        [plugins guide](/guides/tooling/plugins-guide) and the
        [migration guide](/guides/references/migration-guide) for more information.

        </Alert>
      `,
      body: endent`
        // cypress/plugins/index.js
        ${helpers.adjustPluginsFileContent(header)}
        module.exports = (on, config) => {
          ${helpers.adjustPluginsFileContent(body)}
        }
      `,
    }
  )
}

module.exports = {
  type: 'containerDirective',
  name: 'cypress-plugin-example',
  processNode,
}

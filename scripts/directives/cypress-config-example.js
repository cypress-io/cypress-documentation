const vm = require('vm')
const endent = require('endent').default

const replacer = (key, value) => {
  if (typeof value === 'function') {
    throw new Error(`Function values not supported in json: ${key}`)
  }

  return value
}

function processNode(node, { _require, error, warn }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { attributes, children = [] } = node
  const { errorArgs, header, body } = helpers.getHeaderAndBody(children)

  if (errorArgs) {
    return error(...errorArgs)
  }

  const noJson = header !== '' || 'noJson' in attributes
  let configObj

  if (!noJson) {
    try {
      configObj = vm.runInNewContext(`(${body})`, {})
    } catch (err) {
      return error(`Unable to parse code`, err)
    }
  }

  let jsonBody = false

  if (!noJson) {
    try {
      jsonBody = JSON.stringify(configObj, replacer, 2)
    } catch (err) {
      warn(`${err.message} (skipping cypress.json tab)`)
    }
  }

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
      label: 'cypress.json',
      language: 'json',
      alert: endent`
        <Alert type="warning">
        
        <strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
        Deprecated</strong>

        The \`cypress.json\` file is deprecated as of Cypress CFG_VERSION. We recommend
        that you update your configuration. Please see the
        [plugins guide](/guides/tooling/plugins-guide) and the
        [migration guide](/guides/references/migration-guide) for more information.

        </Alert>
      `,
      // Workaround for https://github.com/indentjs/endent/issues/10
      body: jsonBody && `WEIRD_WORKAROUND_SORRY${jsonBody}`,
    }
  )
}

module.exports = {
  type: 'containerDirective',
  name: 'cypress-config-example',
  processNode,
}

const CYPRESS_JSON_ALERT = `<alert type="warning">
<p><strong class="alert-header"><icon name="exclamation-triangle"></icon>
Deprecated</strong></p>
<p>The <code>cypress.json</code> file is no longer supported as of Cypress CFG_VERSION. We recommend
that you update your configuration.</p>
<p>Please see the <a href="/guides/references/configuration">new configuration guide</a> and the
<a href="/guides/references/migration-guide">migration guide</a> for more information.</p>
</alert>`

const PLUGINS_FILE_ALERT = `<alert type="warning">
<p><strong class="alert-header"><icon name="exclamation-triangle"></icon>
Deprecated</strong></p>
<p>The plugins file is no longer supported as of Cypress CFG_VERSION.</p>
<p>We recommend that you update your configuration. Please see the
<a href="/guides/tooling/plugins-guide">plugins guide</a> and the
<a href="/guides/references/migration-guide">migration guide</a> for more information.</p>
</alert>`

const CYPRESS_JSON_PLUGINS_FILE_ALERT = `<alert type="warning">
<p><strong class="alert-header"><icon name="exclamation-triangle"></icon>
Deprecated</strong></p>
<p>The <code>cypress.json</code> file and plugins file are no longer supported as of Cypress
CFG_VERSION.</p>
<p>We recommend that you update your configuration. Please see the
<a href="/guides/references/configuration">new configuration guide</a>,
<a href="/guides/tooling/plugins-guide">plugins guide</a> and the
<a href="/guides/references/migration-guide">migration guide</a> for more information.</p>
</alert>`

// ==============================================================================

const cce = (exports['cypress-config-example'] = {})

const cypressConfigExample = ({ tab1, tab2, tab3 }) => {
  return `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">${tab1}
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">${tab2}
</code></pre>
</code-block>
${
  tab3
    ? `<code-block label="cypress.json (deprecated)">
<template v-slot:alert>${CYPRESS_JSON_ALERT}
</template>
<pre><code class="language-json">${tab3}
</code></pre>
</code-block>
`
    : ''
}</code-group>
<h2>bbb</h2>`
}

cce.codeBlock = cypressConfigExample({
  tab1: `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

export default defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})`,
  tab3: `{
  "foo": 123,
  "prop": {
    "bar": true
  }
}`,
})

cce.codeBlockWithHeader = cypressConfigExample({
  tab1: `const { defineConfig } = require('cypress')

const { foo } = require('foo')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

const { foo } = require('foo')

export default defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})`,
})

cce.codeBlockWithFunction = cypressConfigExample({
  tab1: `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar() {
      // code
    }
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

export default defineConfig({
  foo: 123,
  prop: {
    bar() {
      // code
    }
  }
})`,
})

cce.codeBlockWithNoJson = cypressConfigExample({
  tab1: `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

export default defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})`,
})

// ==============================================================================

const cpe = (exports['cypress-plugin-example'] = {})

const cypressPluginExample = ({ tab1, tab2, tab3 }) => {
  return `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">${tab1}
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">${tab2}
</code></pre>
</code-block>
${
  tab3
    ? `<code-block label="plugins file (deprecated)">
<template v-slot:alert>${PLUGINS_FILE_ALERT}
</template>
<pre><code class="language-js">${tab3}
</code></pre>
</code-block>
`
    : ''
}</code-group>
<h2>bbb</h2>`
}

cpe.functionBody = cypressPluginExample({
  tab1: `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        someThing(config)
      })
    }
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        someThing(config)
      })
    }
  }
})`,
  tab3: `// cypress/plugins/index.js

module.exports = (on, config) => {
  on('something', () => {
    someThing(config)
  })
}`,
})

cpe.functionBodyComponent = cypressPluginExample({
  tab1: `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  component: {
    setupNodeEvents(on, config) {
      on('something', () => {
        someThing(config)
      })
    }
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  component: {
    setupNodeEvents(on, config) {
      on('something', () => {
        someThing(config)
      })
    }
  }
})`,
  tab3: `// cypress/plugins/index.js

module.exports = (on, config) => {
  on('something', () => {
    someThing(config)
  })
}`,
})

cpe.functionBodyNoComment = cypressPluginExample({
  tab1: `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        someThing(config)
      })
    }
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        someThing(config)
      })
    }
  }
})`,
  tab3: `// cypress/plugins/index.js

module.exports = (on, config) => {
  on('something', () => {
    someThing(config)
  })
}`,
})

cpe.functionBodyAndHeader = cypressPluginExample({
  tab1: `const { defineConfig } = require('cypress')

const { foo } = require('foo')

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        foo(config)
      })
    }
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

const { foo } = require('foo')

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        foo(config)
      })
    }
  }
})`,
  tab3: `// cypress/plugins/index.js

const { foo } = require('foo')

module.exports = (on, config) => {
  on('something', () => {
    foo(config)
  })
}`,
})

cpe.functionBodyAndHeaderAdjustedForPluginsFile = cypressPluginExample({
  tab1: `const { defineConfig } = require('cypress')

const { foo } = require('./foo')

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        require('./bar')(foo, config)
      })
    }
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

const { foo } = require('./foo')

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      on('something', () => {
        require('./bar')(foo, config)
      })
    }
  }
})`,
  tab3: `// cypress/plugins/index.js

const { foo } = require('../../foo')

module.exports = (on, config) => {
  on('something', () => {
    require('../../bar')(foo, config)
  })
}`,
})

// ==============================================================================

const ccpe = (exports['cypress-config-plugin-example'] = {})

const cypressConfigPluginExample = ({ tab1, tab2, tab3 }) => {
  return `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">${tab1}
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">${tab2}
</code></pre>
</code-block>
<code-block label="cypress.json &amp; plugins file">
<template v-slot:alert>${CYPRESS_JSON_PLUGINS_FILE_ALERT}
</template>
<pre><code class="language-js">${tab3}
</code></pre>
</code-block>
</code-group>
<h2>bbb</h2>`
}

ccpe.threeTabs = cypressConfigPluginExample({
  tab1: `const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/react/plugins/react-scripts')

module.exports = defineConfig({
  component: {
    devServer,
    specPattern: '**/*.cy.{js,jsx,ts,tsx}'
  }
})`,
  tab2: `import { defineConfig } from 'cypress'
const { devServer } = require('@cypress/react/plugins/react-scripts')

export default defineConfig({
  component: {
    devServer,
    specPattern: '**/*.cy.{js,jsx,ts,tsx}'
  }
})`,
  tab3: `// cypress.json (deprecated)

{
  "component": {
    "specPattern": "**/*.cy.{js,jsx,ts,tsx}"
  }
}

// plugins file (deprecated)

const injectDevServer = require('@cypress/react/plugins/react-scripts')

module.exports = (on, config) => {
  injectDevServer(on, config)
  return config
}`,
})

// ==============================================================================

const cee = (exports['cypress-env-example'] = {})

const cypressEnvExample = ({ tab1, tab2, tab3 }) => {
  return `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">${tab1}
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">${tab2}
</code></pre>
</code-block>
<code-block label="plugins file (deprecated)">
<template v-slot:alert>${PLUGINS_FILE_ALERT}
</template>
<pre><code class="language-js">${tab3}
</code></pre>
</code-block>
</code-group>
<h2>bbb</h2>`
}

cee.headerAndVars = cypressEnvExample({
  tab1: `const { defineConfig } = require('cypress')

// Populate process.env with values from .env file
require('dotenv').config()

module.exports = defineConfig({
  env: {
    auth_username: process.env.AUTH_USERNAME,
    auth_password: process.env.AUTH_PASSWORD,
    okta_domain: process.env.REACT_APP_OKTA_DOMAIN,
    okta_client_id: process.env.REACT_APP_OKTA_CLIENTID
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

// Populate process.env with values from .env file
require('dotenv').config()

export default defineConfig({
  env: {
    auth_username: process.env.AUTH_USERNAME,
    auth_password: process.env.AUTH_PASSWORD,
    okta_domain: process.env.REACT_APP_OKTA_DOMAIN,
    okta_client_id: process.env.REACT_APP_OKTA_CLIENTID
  }
})`,
  tab3: `// cypress/plugins/index.js

// Populate process.env with values from .env file
require('dotenv').config()

module.exports = (on, config) => {
  config.env.auth_username = process.env.AUTH_USERNAME
  config.env.auth_password = process.env.AUTH_PASSWORD
  config.env.okta_domain = process.env.REACT_APP_OKTA_DOMAIN
  config.env.okta_client_id = process.env.REACT_APP_OKTA_CLIENTID
  return config
}`,
})

cee.headerAdjustedForPluginsFile = cypressEnvExample({
  tab1: `const { defineConfig } = require('cypress')

// AWS exports
const awsConfig = require('./aws-exports-es5.js')

module.exports = defineConfig({
  env: {
    cognito_username: process.env.AWS_COGNITO_USERNAME,
    cognito_password: process.env.AWS_COGNITO_PASSWORD
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

// AWS exports
const awsConfig = require('./aws-exports-es5.js')

export default defineConfig({
  env: {
    cognito_username: process.env.AWS_COGNITO_USERNAME,
    cognito_password: process.env.AWS_COGNITO_PASSWORD
  }
})`,
  tab3: `// cypress/plugins/index.js

// AWS exports
const awsConfig = require('../../aws-exports-es5.js')

module.exports = (on, config) => {
  config.env.cognito_username = process.env.AWS_COGNITO_USERNAME
  config.env.cognito_password = process.env.AWS_COGNITO_PASSWORD
  return config
}`,
})

cee.noPrefixKeys = cypressEnvExample({
  tab1: `const { defineConfig } = require('cypress')

const example = require('example')

module.exports = defineConfig({
  env: {
    foo: example.foo,
    bar: example.bar,
    baz: process.env.BAZ_ENV_VAR
  }
})`,
  tab2: `import { defineConfig } from 'cypress'

const example = require('example')

export default defineConfig({
  env: {
    foo: example.foo,
    bar: example.bar,
    baz: process.env.BAZ_ENV_VAR
  }
})`,
  tab3: `// cypress/plugins/index.js

const example = require('example')

module.exports = (on, config) => {
  config.env.foo = example.foo
  config.env.bar = example.bar
  config.env.baz = process.env.BAZ_ENV_VAR
  return config
}`,
})

// ==============================================================================

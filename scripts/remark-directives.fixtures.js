
const CYPRESS_JSON_ALERT = `<alert type="warning">
<p><strong class="alert-header"><icon name="exclamation-triangle"></icon>
Deprecated</strong></p>
<p>The <code>cypress.json</code> file is deprecated as of Cypress CFG_VERSION. We recommend
that you update your configuration. Please see the
<a href="/guides/references/configuration">new configuration guide</a> and the
<a href="/guides/references/migration-guide">migration guide</a> for more information.</p>
</alert>`

const cce = exports['cypress-config-example'] = {}

cce.codeBlock = `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">const { defineConfig } = require('cypress')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">import { defineConfig } from 'cypress'

export default defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})
</code></pre>
</code-block>
<code-block label="cypress.json (deprecated)">
<template v-slot:alert>${CYPRESS_JSON_ALERT}
</template>
<pre><code class="language-json">{
  "foo": 123,
  "prop": {
    "bar": true
  }
}
</code></pre>
</code-block>
</code-group>
<h2>bbb</h2>`

cce.codeBlockWithHeader = `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">const { defineConfig } = require('cypress')

const { foo } = require('foo')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">import { defineConfig } from 'cypress'

const { foo } = require('foo')

export default defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})
</code></pre>
</code-block>
</code-group>
<h2>bbb</h2>`

cce.codeBlockWithFunction = `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">const { defineConfig } = require('cypress')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar() {
      // code
    }
  }
})
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">import { defineConfig } from 'cypress'

export default defineConfig({
  foo: 123,
  prop: {
    bar() {
      // code
    }
  }
})
</code></pre>
</code-block>
</code-group>
<h2>bbb</h2>`

cce.codeBlockWithNoJson = `<h1>aaa</h1>
<code-group>
<code-block label="cypress.config.js" active>
<pre><code class="language-js">const { defineConfig } = require('cypress')

module.exports = defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})
</code></pre>
</code-block>
<code-block label="cypress.config.ts">
<pre><code class="language-ts">import { defineConfig } from 'cypress'

export default defineConfig({
  foo: 123,
  prop: {
    bar: true
  }
})
</code></pre>
</code-block>
</code-group>
<h2>bbb</h2>`


---
title: Experiments
---

If you'd like to try out what we're working on in the {% url "Test Runner" test-runner %}, you can enable beta features for your project by turning on the experimental features you'd like to try.

{% note warning %}
⚠️ The experimental features might change or ultimately be removed without making it into the core product. Our primary goal for experiments is to collect real-world feedback during the development.
{% endnote %}

# Configuration

You can pass the {% url "configuration" configuration %} options below to enable or disable experiments. See our {% url "Configuration Guide" configuration %} on how to pass configuration to Cypress.

Option | Default | Description
----- | ---- | ----
`experimentalComponentTesting` | `false` | Enables component testing using framework-specific adaptors. See {% urlHash "Component Testing" Component-Testing %} for more detail.
`experimentalFetchPolyfill` | `false` | Automatically replaces `window.fetch` with a polyfill that Cypress can spy on and stub.
`experimentalSourceRewriting` | `false` | Enables AST-based JS/HTML rewriting. This may fix issues caused by the existing regex-based JS/HTML replacement algorithm. See {% issue 5273 %} for details.
`experimentalNetworkStubbing` | `false` | Enables {% url "`cy.route2`" route2 %}: a new version of the `cy.route` API that works on the HTTP layer, instead of stubbing out XMLHttpRequests. See {% issue 687 %} for details.

# Component Testing

Component testing is a feature that is experimental. You can enable component testing by setting the `experimentalComponentTesting` configuration to `true`.

## Component Libraries

Component testing can be used with the libraries below. You can find more details on integration with each library in their respective repo.

- **React:** {% url "cypress-react-unit-test" https://github.com/bahmutov/cypress-react-unit-test %}
- **Vue:** {% url "cypress-vue-unit-test" https://github.com/bahmutov/cypress-vue-unit-test %}

## Component Folder

By default `cypress/component` is the path for component tests. You can change this path by setting the `componentFolder` configuration option.

**Example `cypress.json`**

```json
{
  "experimentalComponentTesting": true,
  "componentFolder": "cypress/component"
}
```

## Example

An example of a component test may look like the code below. This test would execute in the browser, similar to the full end-to-end test, except with no URL website being visited.

```js
import { mount } from 'cypress-react-unit-test'
import Post from './Post.jsx'

describe('Post skeletons', () => {
  it('loads title after timeout', () => {
    mount(<Post title={title} children={text} />)
    // and then use regular Cypress commands
    // at first, the title and the text are 💀
    cy.get('h1 .react-loading-skeleton').should('have.length', 1)
    cy.get('p .react-loading-skeleton').should('have.length', 5)
  })
})
```

{% imgTag /img/guides/references/component-test.gif "Example React component test" %}

{% history %}
{% url "5.2.0" changelog#5-2-0 %} | Removed `experimentalShadowDomSupport` and made it the default behavior.
{% url "5.0.0" changelog#5-0-0 %} | Removed `experimentalGetCookiesSameSite` and made it the default behavior.
{% url "4.9.0" changelog#4-9-0 %} | Added support for `experimentalFetchPolyfill`.
{% url "4.8.0" changelog#4-8-0 %} | Added support for `experimentalShadowDomSupport`.
{% url "4.6.0" changelog#4-6-0 %} | Added support for `experimentalSourceRewriting`.
{% url "4.5.0" changelog#4-5-0 %} | Added support for `experimentalComponentTesting`.
{% url "4.3.0" changelog#4-3-0 %} | Added support for `experimentalGetCookiesSameSite`.
{% endhistory %}

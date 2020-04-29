---
title: Experiments
---

If you'd like to try out what we're working on, you can enable beta features for your project by setting configuration using the options below.

{% note warning %}
⚠️ The experimental features might change or ultimately be removed without making it into the core product. Our primary goal for experiments is to collect real-world feedback during the development.
{% endnote %}

When you open a Cypress project, clicking on the **Settings** tab and clicking into the **Experiments** panel will display the experimental features that are available and whether they are enabled for your project.

Option | Default | Description
----- | ---- | ----
`experimentalGetCookiesSameSite` | `false` | If `true`, Cypress will add `sameSite` values to the objects yielded from {% url "`cy.setCookie()`" setcookie %}, {% url "`cy.getCookie()`" getcookie %}, and {% url "`cy.getCookies()`" getcookies %}. This will become the default behavior in Cypress 5.0.
`experimentalComponentTesting` | `false` | When set to `true`, Cypress allows you to execute component tests using framework-specific adaptors. By default  `cypress/component` is the path for component tests. You can change this setting by setting the `componentFolder` configuration option. For more details see the {% url "cypress-react-unit-test" https://github.com/bahmutov/cypress-react-unit-test %} and {% url "cypress-vue-unit-test" https://github.com/bahmutov/cypress-vue-unit-test/tree/feature/cypress-mount-mode %} repos.

An example component test would look like this

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
    ...
  })
})
```

This test would execute in the browser, similar to the full end-to-end test, except there is no website URL:

{% imgTag /img/guides/references/component-test.gif "Example React component test" %}

Feature | Test libraries | Cypress component tests
--- | --- | ---
Test runs in real browser | ❌ | ✅
Uses full mount | ❌ | ✅
Test speed | 🏎 | as fast as the app works in the browser
Test can use additional plugins | maybe | use any [Cypress plugin](https://on.cypress.io/plugins)
Test can interact with component | synthetic limited API | use any [Cypress command](https://on.cypress.io/api)
Test can be debugged | via terminal and Node debugger | use browser DevTools
Built-in time traveling debugger | ❌ | Cypress time traveling debugger
Re-run tests on file or test change | ✅ | ✅
Test output on CI | terminal | terminal, screenshots, videos
Tests can be run in parallel | ✅ | ✅ via [parallelization](https://on.cypress.io/parallelization)
Spying and mocking | Jest mocks / 3rd party | Built-in via Sinon library
Code coverage | ✅ / maybe | ✅

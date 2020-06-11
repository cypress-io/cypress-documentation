---
title: Experiments
---

# Configuration

If you'd like to try out what we're working on, you can enable beta features for your project by setting configuration using the options below.

{% note warning %}
⚠️ The experimental features might change or ultimately be removed without making it into the core product. Our primary goal for experiments is to collect real-world feedback during the development.
{% endnote %}

When you open a Cypress project, clicking on the **Settings** tab and clicking into the **Experiments** panel will display the experimental features that are available and whether they are enabled for your project.

Option | Default | Description
----- | ---- | ----
`experimentalGetCookiesSameSite` | `false` | If `true`, Cypress will add `sameSite` values to the objects yielded from {% url "`cy.setCookie()`" setcookie %}, {% url "`cy.getCookie()`" getcookie %}, and {% url "`cy.getCookies()`" getcookies %}. This will become the default behavior in Cypress 5.0.
`experimentalComponentTesting` | `false` | When set to `true`, Cypress allows you to execute component tests using framework-specific adaptors. By default  `cypress/component` is the path for component tests. You can change this setting by setting the `componentFolder` configuration option. For more details see the {% url "cypress-react-unit-test" https://github.com/bahmutov/cypress-react-unit-test %} and {% url "cypress-vue-unit-test" https://github.com/bahmutov/cypress-vue-unit-test %} repos.
`experimentalSourceRewriting` | `false` | Enables AST-based JS/HTML rewriting. This may fix issues caused by the existing regex-based JS/HTML replacement algorithm. See {% issue 5273 %} for details.
`experimentalShadowDomSupport` | `false` | Enables shadow DOM support. Adds the `cy.shadow()` command and the `includeShadowDom` option to some DOM commands.

# Component Testing

Component testing is a feature that is experimental. Here you'll find some guidance on how to do component testing.

An example component test may look like the code below. This test would execute in the browser, similar to the full end-to-end test, except with no URL website being visited.

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

Feature | Other testing libraries * | Cypress component testing
--- | --- | ---
Test runs in real browser | ❌ | ✅
Mounts realistic components | ❌ | ✅
Test speed | 🏎 | as fast as the app works in the browser
Test can use additional plugins | maybe | use any {% url "Cypress plugin" plugins %}
Test can interact with component | synthetic limited API | use any {% url "Cypress command" table-of-contents %}
Test can be debugged | via terminal and Node debugger | use browser DevTools
Built-in time traveling debugger | ❌ | Cypress time traveling debugger
Re-run tests on file or test change | ✅ | ✅
Test output on CI | terminal | terminal, screenshots, videos
Tests can be run in parallel | ✅ | ✅ via {% url "parallelization" parallelization %}
Spying and mocking | Jest mocks / 3rd party | Built-in via Sinon library
Code coverage | ✅ / maybe | ✅

\* Most common libraries: React Testing Library, Enzyme, Vue Testing Library, Vue Test Utils

# Shadow DOM

Support for shadow DOM is currently experimental and includes the addition of a new command `.shadow()` and an `includeShadowDom` option for some DOM commands.

## .shadow()

`.shadow()` will traverse into an element's shadow root, so that further DOM commands will find elements within that shadow root.

## includeShadowDom

Enabling the `includeShadowDom` option allows using existing commands to query the DOM, finding elements within the shadow DOM that would normally not be found due to the shadow DOM's boundary hiding them. It is supported by the following commands:

- {% url `cy.get()` get %}
- {% url `.find()` find %}

## Examples

Given the following DOM:

```html
<div class="container">
  <my-component>
    #shadow-root
      <button class="my-button">Click me</button>
  </my-component>
</div>
```

You can query for the button in two ways:

```javascript
// with .shadow()
cy
.get('my-component')
.shadow()
.find('.my-button')
.click()

// - or -

// with { includeShadowDom: true }
cy
.get('my-component')
.find('.my-button', { includeShadowDom: true })
.click()
```

## Cross-boundary selectors

Note that cross-boundary selectors are not supported. This is best illustrated with an example (using the html above):

```javascript
// INVALID CODE - WILL NOT WORK
cy.get('.container .my-button', { includeShadowDom: true })
```

In the selector `.container .my-button`, the first part (`.container`) exists in the light DOM and the second part (`.my-button`) exists in the shadow DOM. This will not find the button element. Instead, you can use one of the methods in the above examples.

{% history %}
{% url "4.8.0" changelog#4-8-0 %} | Added support for `experimentalShadowDomSupport`.
{% url "4.6.0" changelog#4-6-0 %} | Added support for `experimentalSourceRewriting`.
{% url "4.5.0" changelog#4-5-0 %} | Added support for `experimentalComponentTesting`.
{% url "4.3.0" changelog#4-3-0 %} | Added support for `experimentalGetCookiesSameSite`.
{% endhistory %}

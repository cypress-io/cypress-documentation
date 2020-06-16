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
`experimentalGetCookiesSameSite` | `false` | Adds `sameSite` values to the objects yielded from {% url "`cy.setCookie()`" setcookie %}, {% url "`cy.getCookie()`" getcookie %}, and {% url "`cy.getCookies()`" getcookies %}. This will become the default behavior in a later Cypress version.
`experimentalComponentTesting` | `false` | Enables component testing using framework-specific adaptors. See {% urlHash "Component Testing" Component-Testing %} for more detail.
`experimentalSourceRewriting` | `false` | Enables AST-based JS/HTML rewriting. This may fix issues caused by the existing regex-based JS/HTML replacement algorithm. See {% issue 5273 %} for details.
`experimentalShadowDomSupport` | `false` | Enables shadow DOM support. Adds the `cy.shadow()` command and the `includeShadowDom` option to some DOM commands. See {% urlHash "Shadow DOM" Shadow-DOM %} for more detail.

When you open a Cypress project, clicking on the **Settings** tab and clicking into the **Experiments** panel will display the experimental features that are available and whether they are enabled for your project.

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

# Shadow DOM

Support for shadow DOM is currently experimental and includes the addition of a new command `.shadow()` and an `includeShadowDom` option for some DOM commands. You can enable component testing by setting the `experimentalShadowDomSupport` configuration to `true`.

## `.shadow()`

`.shadow()` will traverse into an element's shadow root, so that further DOM commands will find elements within that shadow root.

## `includeShadowDom`

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

## {% fa fa-warning red %} Cross-boundary selectors

Note that cross-boundary selectors are not supported. This is best illustrated with an example (using the html above):

```javascript
// ❗️INVALID CODE - WILL NOT WORK
cy.get('.container .my-button', { includeShadowDom: true })
```

In the selector `.container .my-button`, the first part (`.container`) exists in the light DOM and the second part (`.my-button`) exists in the shadow DOM. This will not find the button element. Instead, you can use one of the methods in the above examples.

{% history %}
{% url "4.8.0" changelog#4-8-0 %} | Added support for `experimentalShadowDomSupport`.
{% url "4.6.0" changelog#4-6-0 %} | Added support for `experimentalSourceRewriting`.
{% url "4.5.0" changelog#4-5-0 %} | Added support for `experimentalComponentTesting`.
{% url "4.3.0" changelog#4-3-0 %} | Added support for `experimentalGetCookiesSameSite`.
{% endhistory %}

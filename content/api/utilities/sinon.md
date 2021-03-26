---
title: Cypress.sinon
---

Cypress automatically includes [Sinon.JS](http://sinonjs.org/) and exposes it as `Cypress.sinon`. Because commands [`cy.spy`](/api/commands/spy) and [`cy.stub`](/api/commands/stub) are already wrapping Sinon methods, the most common use for `Cypress.sinon` is to provide flexible [matchers](https://sinonjs.org/releases/latest/matchers/) when doing assertions.

## Syntax

```javascript
Cypress.sinon.match(value)
Cypress.sinon.match.<matcher name>
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.sinon.match.string
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.sinon.match.string // Errors, cannot be chained off 'cy'
```

## Examples

### `match.string`

This example comes from the recipe [Root style](https://github.com/cypress-io/cypress-example-recipes#testing-the-dom). Imagine an application code where the method `setProperty` is called to change a CSS variable:

```js
document.querySelector('input[type=color]').addEventListener('change', (e) => {
  document.documentElement.style.setProperty(
    '--background-color',
    e.target.value
  )
})
```

We can write a test to confirm that the method `setProperty` was called with two strings; we don't care about value of the first string, but we do want to check if it was indeed a string.

```javascript
cy.document()
  .its('documentElement.style')
  .then((style) => {
    cy.spy(style, 'setProperty').as('setColor')
  })

cy.get('input[type=color]').invoke('val', '#ff0000').trigger('change')

// we don't care about '--background-color' exact
// value but know it should be a string
cy.get('@setColor').should(
  'have.been.calledWith',
  Cypress.sinon.match.string,
  '#ff0000'
)
```

## See also

- [Spies, stubs & clocks](https://example.cypress.io/commands/spies-stubs-clocks) example page
- [Sinon matchers](https://sinonjs.org/releases/latest/matchers/) documentation page
- [Bundled Tools](/guides/references/bundled-tools)
- [`cy.spy()`](/api/commands/spy)
- [`cy.stub()`](/api/commands/stub)
- [Stubs, Spies, and Clocks](/guides/guides/stubs-spies-and-clocks) guide

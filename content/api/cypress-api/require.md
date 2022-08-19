---
title: Cypress.require
---

`Cypress.require` is used with [`cy.origin()`](/api/commands/origin) to utilize
dependencies within the [`cy.origin()`](/api/commands/ callback function. It
enables the use of [npm](https://www.npmjs.com/) packages and sharing code from
other files.

It is functionally the same as the
[CommonJS `require()`](https://nodejs.org/en/knowledge/getting-started/what-is-require/)
used in NodeJs.

## Syntax

```js
Cypress.require(moduleId)
```

## Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
cy.origin('somesite.com', () => {
  const _ = Cypress.require('lodash')
  const utils = Cypress.require('./utils')

  // ... use lodash and utils ...
})
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```js
// `Cypress.require()` cannot be used outside the `cy.origin()` callback.
// Use `require()` instead
const _ = Cypress.require('lodash')

cy.origin('somesite.com', () => {
  // `require()` cannot be used inside the `cy.origin()` callback.
  // Use `Cypress.require()` instead
  const _ = require('lodash')
})
```

## Examples

See [`cy.origin()` Dependencies / Sharing Code]() for example usages.

## Limitations

- `Cypress.require` only works when called within the
  [`cy.origin()`](/api/commands/origin) callback function. It will error if used
  elsewhere.
- `Cypress.require` only works in conjunction with the
  [webpack preprocessor](https://www.npmjs.com/package/@cypress/webpack-preprocessor),
  which is the default preprocessor for Cypress. If you have manually installed
  and configured the webpack preprocessor, ensure you are using version `5.13.0`
  or greater.

## History

| Version                                       | Changes                 |
| --------------------------------------------- | ----------------------- |
| [10.7.0](/guides/references/changelog#10-7-0) | `Cypress.require` added |

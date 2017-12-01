---
title: Cypress.version
comments: false
---

Constant `Cypress.version` returns the version string of the current Cypress NPM module, same as reading it from `node_modules/cypress/package.json`.

# Syntax

```javascript
Cypress.version
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.version // "1.1.3"
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.version  // returns undefined
Cypress.version() // Errors, not a function
```

# Examples

## Using Cypress features only available in a particular version

```javascript
if (Cypress.version.startsWith('1.1.3')) {
    it('has Cypress.platform', () => {
        expect(Cypress.platform).to.be.a('string')
    })
}
```

**Hint:** you can use [semver](https://github.com/npm/node-semver#readme) library to work with semantic versions.

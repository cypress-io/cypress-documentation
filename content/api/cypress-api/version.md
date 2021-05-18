---
title: Cypress.version
menuTitle: version
---

`Cypress.version` returns you the current version of Cypress you are running.

## Syntax

```javascript
Cypress.version // '1.1.0'
```

## Examples

### Conditionals

```javascript
const semver = require('semver')

if (semver.gte(Cypress.version, '1.1.3')) {
  it('has Cypress.platform', () => {
    expect(Cypress.platform).to.be.a('string')
  })
}
```

**Hint:** you can use [semver](https://github.com/npm/node-semver#readme) library to work with semantic versions.

## See also

To find the version of the Electron component, or the bundled Node version, use the Cypress CLI command [cypress version](/guides/guides/command-line#cypress-version).

---
title: Cypress.isBrowser
---

`Cypress.isBrowser` checks if the current browser matches the given name or filter.

## Syntax

```javascript
Cypress.isBrowser(matcher)
Cypress.isBrowser(matchers)
Cypress.isBrowser(filter)
```

### Arguments

**<Icon name="angle-right"></Icon> matcher** **_(String)_**

The name of the browser (case-insensitive) you want to check against. Name can be prepended with a `!` character to inverse the check.

**<Icon name="angle-right"></Icon> matchers** **_(Array)_**

An array of the names of the browsers (case-insensitive) you want to check against. Name can be prepended with a `!` character to inverse the check.

**<Icon name="angle-right"></Icon> filter** **_(Object or Array)_**

Filter one or multiple browsers by the browser properties. You can inspect the current browser's properties by using the [Cypress.browser](/api/cypress-api/browser). Supported properties are:

| Property       | Type      | Description                                                           |
| -------------- | --------- | --------------------------------------------------------------------- |
| `name`         | `string`  | Machine-friendly name, like `chrome`, `electron`, or `firefox`.       |
| `family`       | `string`  | Rendering engine being used. `chromium` or `firefox`.                 |
| `channel`      | `string`  | Release channel of the browser, such as `stable`, `dev`, or `canary`. |
| `displayName`  | `string`  | Human-readable display name for the browser.                          |
| `version`      | `string`  | Full version.                                                         |
| `path`         | `string`  | Path to the browser on disk. Blank for Electron.                      |
| `majorVersion` | `number`  | The major version number of the browser.                              |
| `isHeadless`   | `boolean` | Whether the browser is running headlessly.                            |
| `isHeaded`     | `boolean` | Whether the browser displays headed.                                  |

## Examples

### Matcher

#### Only run command in Chrome

```javascript
it('download extension link', () => {
  // true when running in Firefox
  if (Cypress.isBrowser('firefox')) {
    cy.get('#dl-extension').should('contain', 'Download Firefox Extension')
  }

  // true when running in Chrome
  if (Cypress.isBrowser('chrome')) {
    cy.get('#dl-extension').should('contain', 'Download Chrome Extension')
  }
})
```

#### Run command in all browsers except Chrome

```javascript
it('warns to view page in Chrome browser', () => {
  // true when running in Firefox, etc...
  if (Cypress.isBrowser('!chrome')) {
    cy.get('.browser-warning').should(
      'contain',
      'For optimal viewing, use Chrome browser'
    )
  }
})
```

### Matchers

#### Run commands in all specified browsers

```javascript
it('colors rainbow', () => {
  // true when running in Electron or Chrome
  if (Cypress.isBrowser(['electron', 'chrome'])) {
    cy.get('.rainbox').should(
      'have.css',
      'conic-gradient(red, orange, yellow, green, blue)'
    )
  }
})
```

#### Run commands in all browsers except specified

```javascript
// true when running in browser other than chrome and electron
it('does not run in Firefox and Chrome', () => {
  if (Cypress.isBrowser(['!electron', '!chrome'])) {
    cy.get('#h4').should('have.css', 'font-size-adjust', '0.5')
  }
})
```

### Filter

#### Only run commands in Chromium-based browser

```javascript
it('has CSS reflections', () => {
  // if in Chromium-based browser (Chrome, Electron, etc...)
  // check css property was properly applied
  if (Cypress.isBrowser({ family: 'chromium' })) {
    cy.get('.header').should('have.css', '-webkit-box-reflect', 'left')
  }
})
```

#### Only run on stable release in Chromium-based browser

```javascript
it('test', () => {
  // true when in any stable release of a Chromium-based browser
  if (Cypress.isBrowser({ family: 'chromium', channel: 'stable' })) {
    // test some (hypothetical) scenario in chrome stable
  }
})
```

#### Only run on specific release channels of browsers

```javascript
it('test', () => {
  // true when running in Chrome Canary
  // and dev releases of Firefox browser
  if (
    Cypress.isBrowser([
      { family: 'chromium', channel: 'canary' },
      { family: 'firefox', channel: 'dev' },
    ])
  ) {
    // test some (hypothetical) scenario
  }
})
```

### Notes

#### Test configuration: `browser`

If you want to target a test or suite to run or be excluded when run in a specific browser, we suggest passing the `browser` within the [test configuration](/guides/references/configuration#Test-Configuration). The `browser` option accepts the same [arguments](#Arguments) as `Cypress.isBrowser()`.

```js
it('Download extension in Firefox', { browser: 'firefox' }, () => {
  cy.get('#dl-extension').should('contain', 'Download Firefox Extension')
})
```

```js
it('Show warning outside Chrome', { browser: '!chrome' }, () => {
  cy.get('.browser-warning').should(
    'contain',
    'For optimal viewing, use Chrome browser'
  )
})
```

## History

| Version                                     | Changes                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| [4.8.0](/guides/references/changelog#4-8-0) | Expanded `matcher` and `matchers` arguments to assist in filtering browsers. |
| [4.0.0](/guides/references/changelog#4-0-0) | Added `isBrowser` command.                                                   |

## See also

- [Browser Launch API](/api/plugins/browser-launch-api)
- [Cross Browser Testing](/guides/guides/cross-browser-testing)
- [Cypress.browser](/api/cypress-api/browser)
- [Launching Browsers](/guides/guides/launching-browsers)
- [Test Configuration](/guides/references/configuration#Test-Configuration)

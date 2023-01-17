---
title: Cypress.browser
---

`Cypress.browser` returns you properties of the browser.

## Syntax

```javascript
Cypress.browser // returns browser object
```

The object has the following properties:

| Property       | Type      | Description                                                           |
| -------------- | --------- | --------------------------------------------------------------------- |
| `channel`      | `string`  | Release channel of the browser, such as `stable`, `dev`, or `canary`. |
| `displayName`  | `string`  | Human-readable display name for the browser.                          |
| `family`       | `string`  | Rendering engine being used. `chromium` or `firefox`.                 |
| `isChosen`     | `boolean` | Whether the browser is selected in the browser selector of Cypress.   |
| `majorVersion` | `number`  | The major version number of the browser.                              |
| `name`         | `string`  | Machine-friendly name, like `chrome`, `electron`, or `firefox`.       |
| `path`         | `string`  | Path to the browser on disk. Blank for Electron.                      |
| `version`      | `string`  | Full version.                                                         |
| `isHeadless`   | `boolean` | Whether the browser is running headlessly.                            |
| `isHeaded`     | `boolean` | Whether the browser displays headed.                                  |

## Examples

### Log browser information

#### `Cypress.browser` returns browser object

```js
it('log browser info', () => {
  console.log(Cypress.browser)
  // {
  //   channel: 'stable',
  //   displayName: 'Chrome',
  //   family: 'chromium',
  //   isChosen: true,
  //   majorVersion: 80,
  //   name: 'chrome',
  //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  //   version: '80.0.3987.87',
  //   isHeaded: true,
  //   isHeadless: false
  // }
})
```

### Conditionals

#### Check that Chrome specific styles are applied

```css
@media and (-webkit-min-device-pixel-ratio: 0) {
  .header {
    margin-right: 0;
  }
}
```

```javascript
it('has correct Chrome specific css property', () => {
  // if in Chrome, check css property was properly applied
  if (Cypress.browser.name === 'chrome') {
    cy.get('.header').should('have.css', 'margin-right').and('eq', '0')
  }
})
```

#### Screenshot only in headless browser

```javascript
Cypress.Commands.overwrite(
  'screenshot',
  (originalFn, subject, name, options) => {
    // only take screenshots in headless browser
    if (Cypress.browser.isHeadless) {
      // return the original screenshot function
      return originalFn(subject, name, options)
    }

    return cy.log('No screenshot taken when headed')
  }
)

// only takes in headless browser
cy.screenshot()
```

## History

| Version                                     | Changes                      |
| ------------------------------------------- | ---------------------------- |
| [3.0.2](/guides/references/changelog#3-0-2) | `Cypress.browser` introduced |

## See also

- [Browser Launch API](/api/plugins/browser-launch-api)
- [Cross Browser Testing](/guides/guides/cross-browser-testing)
- [Cypress.isBrowser](/api/cypress-api/isbrowser)
- [Launching Browsers](/guides/guides/launching-browsers)

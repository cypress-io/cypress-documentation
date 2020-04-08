---
title: Cypress.isBrowser
---

`Cypress.isBrowser` checks if the current browser matches the given name or filter.

# Syntax

```javascript
Cypress.isBrowser(matcher)
Cypress.isBrowser(matchers)
Cypress.isBrowser(filter)
```

## Arguments

**{% fa fa-angle-right %} matcher**  ***(String)***

The name of the browser (case-insensitive) you want to match or you want to exclude (prepended with a `!` character).

**{% fa fa-angle-right %} matchers**  ***(Array)***

An array of the names of the browsers (case-insensitive) you want to match or you want to exclude (prepended with a `!` character).

**{% fa fa-angle-right %} filter**  ***(Object or Array)***

Filter one or multiple browsers by the browser properties. You can inspect the current browser's properties by using the {% url "`Cypress.browser`" browser %}. Supported properties are:

Property | Type | Description
--- | --- | ---
`name`| `string` | Machine-friendly name, like `chrome`, `electron`, or `firefox`.
`family` | `string` | Rendering engine being used. `chromium` or `firefox`.
`channel` | `string` | Release channel of the browser, such as `stable`, `dev`, or `canary`.
`displayName` | `string` | Human-readable display name for the browser.
`version` | `string` | Full version.
`path` | `string` | Path to the browser on disk. Blank for Electron.
`majorVersion` | `number` | The major version number of the browser.
`isHeadless` | `boolean` | Whether the browser is running headlessly.
`isHeaded` | `boolean` | Whether the browser displays headed.

# Examples

## Matcher

### Only run tests in Chrome

```javascript
// true when running in Chrome
if (Cypress.isBrowser('chrome')) {
  it('only runs in chrome', () => {
    // test some (hypothetical) issue with chrome
  })
}
```

### Skip a test in Firefox

```javascript
it('a test', function() {
  // true when running in Firefox
  if (Cypress.isBrowser('firefox')) {
    this.skip()
  }
})
```

### Run tests in all browsers but firefox

```javascript
// true when running in Chrome, Electron, etc...
if (Cypress.isBrowser('!firefox')) {
  it('does not run in Firefox', () => {
    // test some (hypothetical) issue excluding Firefox
  })
}
```

## Matchers

### Run tests in all specified browsers

```javascript
// true when running in Firefox and Chrome
if (Cypress.isBrowser(['firefox', 'chrome'])) {
  it('runs in Firefox and Chrome only', () => {
    // test some (hypothetical) issue in the browsers
  })
}
```

### Run tests in all browsers except specified

```javascript
// true when running in browser other than chrome and firefox
if (Cypress.isBrowser(['!firefox', '!chrome'])) {
  it('does not run in Firefox and Chrome', () => {
    // test some (hypothetical) issue in the browsers
  })
}
```

## Filter

### Only run commands in Chromium-based browser

```javascript
it('has correct Chromium-based specific css property', () => {
  // if in Chromium-based browser (Chrome, Electron, etc...)
  // check css property was properly applied
  if (Cypress.isBrowser({ family: 'chromium' })) {
    cy
    .get('.header')
    .should('have.css', 'margin-right')
    .and('eq', '0')
  }
})
```

### Only run on stable release in Chromium-based browser

```javascript
// true when running in any stable release of a Chromium-based browser
if (Cypress.isBrowser({ family: 'chromium', channel: 'stable' })) {
  it('will not run in Canary or Dev browsers', () => {
    // test some (hypothetical) issue with chrome
  })
}
```

### Only run on specific release channels of browsers

```javascript
// true when running in any stable release of a Chromium-based browser
// and dev releases of Firefox browser
if (Cypress.isBrowser([
  { family: 'chromium', channel: 'stable' },
  { family: 'firefox', channel: 'dev' }
])) {
  it('will not run in Canary or stable Firefox browsers', () => {
    // test some (hypothetical) issue
  })
}
```

{% history %}
{% url "4.0.0" changelog#4-0-0 %} | Added `isBrowser` command.
{% endhistory %}

# See also

- {% url "Browser Launch API" browser-launch-api %}
- {% url "Cross Browser Testing" cross-browser-testing %}
- {% url "`Cypress.browser`" browser %}
- {% url "Launching Browsers" launching-browsers %}

---
title: Cypress.isBrowser
---

`Cypress.isBrowser` checks if the current browser matches the given name or filter.

# Syntax

```javascript
Cypress.isBrowser(name)
Cypress.isBrowser(filter)
```

## Arguments

**{% fa fa-angle-right %} name**  ***(String)***

The name of the browser (case-insensitive).

**{% fa fa-angle-right %} filter**  ***(Object)***

Filter by the browser properties. You can inspect the current browser's properties by using the {% url "`Cypress.browser`" browser %}. Supported properties are:

- `name`
- `family`
- `channel`
- `displayName`
- `version`
- `path`
- `majorVersion`

# Examples

## Name

### Only run tests in Chrome

```javascript
// true when running in Chrome
if (Cypress.isBrowser('chrome')) {
  it('only runs in chrome', function () {
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

## Filter

### Only run commands in Chromium-based browser

```javascript
it('has correct Chromium-based specific css property', function () {
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
  it('will not run in Canary or Dev browsers', function () {
    // test some (hypothetical) issue with chrome
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

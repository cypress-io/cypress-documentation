---
title: Cypress.isBrowser
---

`Cypress.isBrowser` returns `true` if the current browser matches the filter passed or `false` if it does not.

# Syntax

```javascript
Cypress.isBrowser('chrome') // true when running in Chrome
Cypress.isBrowser('firefox') // true when running in Firefox
Cypress.isBrowser({ family: 'chromium' }) // true when running in any Chromium-based browser (Chrome, Electron, etc...)
Cypress.isBrowser({ family: 'chromium', channel: 'stable' }) // true when running in any stable release of a Chromium-based browser
```

## Arguments

**{% fa fa-angle-right %} filter**  ***(string or object)***

The filter to check against. If an object, it should match the browser types returned by the {% url "browser launch API" browser-launch-api %}. If a name, it will be matched against the name of the browser (case-insensitive).

# Examples

## Conditionals

```javascript
if (Cypress.isBrowser('chrome')) {
  it('only runs in chrome', function () {
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

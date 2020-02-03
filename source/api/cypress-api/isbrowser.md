---
title: Cypress.isBrowser
---

`Cypress.isBrowser` returns `true` if the current browser matches the name passed or `false` if it does not. The name is case-insensitive.

# Syntax

```javascript
// while running in Chrome
Cypress.isBrowser('chrome')  // true
Cypress.isBrowser('firefox')  // false
```

## Arguments

**{% fa fa-angle-right %} name**  ***(String)***

The name of the browser to check against.

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

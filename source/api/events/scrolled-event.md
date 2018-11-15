---
title: scrolled
---

The `scrolled` event fires whenever **Cypress** is scrolling your application. This event is fired when Cypress is {% url 'waiting for and calculating actionability' interacting-with-elements %}. It will scroll to 'uncover' elements currently being covered. This event is extremely useful to debug why Cypress may think an element is not interactive.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`scrolled` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} el** ***(Object)***

The element or `window` being scrolled

**{% fa fa-angle-right %} type** ***('element'|'window'|'container')***

The type of element being scrolled.

# Usage

## In the browser

In a spec file or support file you can tap into the `scrolled` event.

```javascript
Cypress.on('scrolled', (elOrWindow, type) => {

})
```

# See also

- {% url `cy.scrollTo()` scrollto %}
- {% url `.scrollIntoView()` scrollintoview %}

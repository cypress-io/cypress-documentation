---
title: scrolled
---

The `scrolled` event fires whenever **Cypress** is scrolling your application. This event is fired when Cypress is {% url 'waiting for and calculating actionability' interacting-with-elements %}. It will scroll to 'uncover' elements currently being covered. This event is extremely useful to debug why Cypress may think an element is not interactive.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `scrolled` scrolled-event %} | {% fa fa-check-circle green %} |

# Arguments

* the element or window being scrolled **(Object)**
* type of element scrolled ('element' | 'window' | 'container')

# Usage

```javascript
Cypress.on('scrolled', (elOrWindow, type) => {

})
```
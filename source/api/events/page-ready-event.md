---
title: page:ready
---

The `page:ready` event fires after all the page's resources have finished loading after a page transition. This fires at the exact same time as a `cy.visit()` `onLoad` callback.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`page:ready` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} window** ***(Object)***

The remote window

# Usage

## In the browser

In a spec file or support file you can tap into the `page:ready` event.

```javascript
it('listens for page:ready', function () {
  cy.on('page:ready', (win) => {
    // window is the newly loaded window
  })

  cy.visit('/test.html')
})
```

# See also

- {% url `page:start` page-start-event %}
- {% url `before:window:unload` before-window-unload-event %}
- {% url `window:unload` window-unload-event %}

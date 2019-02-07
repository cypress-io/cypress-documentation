---
title: page:start
---

The `page:start` event fires as the page begins to load, but before any of your application's JavaScript has executed. This fires immediately after the `cy.visit()` `onBeforeLoad` callback. Useful to modify the window on a page transition.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`page:start` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} page details** ***(Object)***

An object with the following properties:

* _win_: The page's window object
* _url_: The page's URL
* _statusCode_: The http status code of the page
* _headers_: An object containing the headers of the page

# Usage

## In the browser

In a spec file or support file you can tap into the `page:start` event.

```js
cy.on('page:start', (details) => {
  // details looks something like this:
  // {
  //   win: {
  //     ... window properties ...
  //   }
  //   url: 'http://localhost:3333
  //   statusCode: 200
  //   headers: {
  //     'Content-Type': 'text/html',
  //     ...
  //   }
  // }
})
```

# Examples

## Stub a global variable before window loads or after page transitions

```javascript
it('can modify the window prior to page load on all pages', function () {
  const stub = cy.stub()

  // prevent google analytics from loading and replace it with a stub before
  // every single page load including all new page navigations
  cy.on('page:start', ({ win }) => {
    Object.defineProperty(win, 'ga', {
      configurable: false,
      writeable: false,
      get: () => stub // always return the stub
    })
  })

  cy
    // page:start will be called here
    .visit('/first/page')
    .then((win) => {
      // and here
      win.location.href = '/second/page'
    })
    // and here
    .get('a').click()
})
```

# See also

- {% url `before:window:unload` before-window-unload-event %}
- {% url `page:ready` page-ready-event %}
- {% url `page:end` page-end-event %}

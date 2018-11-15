---
title: window:alert
---

The `window:alert` event fires when your app calls the global `window.alert()` method. Cypress will auto accept alerts. You cannot change this behavior.

# Environment

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`window:alert` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

# Arguments

**{% fa fa-angle-right %} text** ***(String)***

The alert text.

# Usage

## In the browser

In a spec file or support file you can tap into the `window:alert` event.

```js
Cypress.on('window:alert', (text) => {

})
```

# Examples

## Assert on the alert text

Cypress automatically accepts alerts but you can still assert on the text content.

```javascript
// app code
$('button').on('click', (e) => {
  alert('hi')
  alert('there')
  alert('friend')
})

it('can assert on the alert text content', function () {
  const stub = cy.stub()

  cy.on('window:alert', stub)

  cy
    .get('button').click()
    .then(() => {
      expect(stub.getCall(0)).to.be.calledWith('hi')
      expect(stub.getCall(1)).to.be.calledWith('there')
      expect(stub.getCall(2)).to.be.calledWith('friend')
    })
})
```

# See also

- {% url `window:confirm` window-confirm-event %}

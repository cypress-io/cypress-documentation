---
title: window:alert Event
---

The `window:alert` event fires when your app calls the global `window.alert()` method. Cypress will auto accept alerts. You cannot change this behavior.

# Environment

Occurs only in the **browser**.

# Arguments

* the alert text **(String)**

# Usage

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

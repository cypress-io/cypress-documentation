---
title: window:confirm
---

The `window:confirm` event fires when your app calls the global `window.confirm()` method. Cypress will auto accept confirmations. Return `false` from this event and the confirmation will be cancelled.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`window:confirm` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} text** ***(String)***

The confirmation text.

# Usage

## In the browser

In a spec file or support file you can tap into the `window:confirm` event.

```js
cy.on('window:confirm', (text) => {

})
```

# Examples

## Control whether you accept or reject confirmations

This enables you to test how your application reacts to accepted confirmations and rejected confirmations.

<!-- textlint-disable -->
```javascript
// app code
$('button').on('click', (e) => {
  const one = confirm('first confirm')

  if (one) {
    const two = confirm('second confirm')

    if (!two) {
      const three = confirm('third confirm')

      confirm('third confirm was ' + three)
    }
  }
})

// test code
it('can control application confirms', function (done) {
  let count = 0

  // make sure you bind to this **before** the
  // confirm method is called in your application
  //
  // this event will automatically be unbound when this
  // test ends because it's attached to 'cy'
  cy.on('window:confirm', (str) => {
    count += 1

    switch (count) {
      case 1:
        expect(str).to.eq('first confirm')
        // returning nothing here automatically
        // accepts the confirmation
        return
      case 2:
        expect(str).to.eq('second confirm')

        // reject the confirmation
        return false

      case 3:
        expect(str).to.eq('third confirm')

        // don't have to return true but it works
        // as well
        return true

      case 4:
        expect(str).to.eq('third confirm was true')

        // using mocha's async done callback to finish
        // this test so we are guaranteed everything
        // got to this point okay without throwing an error
        done()
    }
  })

  // click the button causing the confirm to fire
  cy.get('button').click()
})

it('could also use a stub instead of imperative code', function () {
  const stub = cy.stub()

  // not necessary but showing for clarity
  stub.onFirstCall().returns(undefined)
  stub.onSecondCall().returns(false)
  stub.onThirdCall().returns(true)

  cy.on('window:confirm', stub)

  cy
    .get('button').click()
    .then(() => {
      expect(stub.getCall(0)).to.be.calledWith('first confirm')
      expect(stub.getCall(1)).to.be.calledWith('second confirm')
      expect(stub.getCall(2)).to.be.calledWith('third confirm')
      expect(stub.getCall(3)).to.be.calledWith('third confirm was true')
    })
})
```
<!-- textlint-enable -->

# See also

- {% url `page:alert` page-alert-event %}

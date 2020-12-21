---
title: useSession
containerClass: experimental
---

{% note warning %}
{% fa fa-warning orange %} **This is an experimental feature. In order to use it, you must set the {% url "`experimentalSessionSupport`" experiments %} configuration option to `true`.**
{% endnote %}


Use `cy.useSession()` to set client-stored persisted data in your application. A `Session` consists of `cookies` and `localStorage` and is created with the accompanying {% url `cy.defineSession()` defineSession %} command.

With `cy.useSession()`, you can:
* set `cookies` and `localStorage` without use of `cy.request` or `cy.visit` before every test. 
* switch between multiple `Sessions` during a single test
* inspect `Session` data that applied to test in the Command Log
* quickly iterate as an authenticated user in `Interactive mode` without replaying login steps 
* keep the convenience and test coverage of UI based authentication while gaining the speed of programmatic login
* gain massive reductions in spec run time. Since `Session` data is saved after the first time it's used,future tests that share a call to `useSession()` will use near-instant `Session` restoration without needing to perform slow UI actions.


# Usage

```ts
cy.useSession(sessionReference)
```


**Note:** when using `Sessions`, all cookies and localStorage will be cleared before every test *for all domains*.

## Arguments

### **{% fa fa-angle-right %} sessionReference** **_(`string | object`)_**

Specifies the `Session` reference, as previously defined in {% url `cy.defineSession()` defineSession %}, to apply. This is either the name (`string`) of a `Session` or the return value of the {% url `cy.defineSession()` defineSession %} command.

```ts
cy.useSession('mySession')

// OR

const mySession = cy.defineSession({
  name: 'mySession'
  steps () {...}
})

cy.useSession(mySession)
```

# Examples

### `Session` applied in a `beforeEach` hook:
```ts
// can be placed inside spec or in a cypress/support file
cy.defineSession({
  name: 'myUser',
  steps () {
    cy.visit('/login')
    cy.get('.username').type('user')
    cy.get('.password').type('pass')
    cy.get('.login').click()
  }
})

describe('suite', ()=>{
  beforeEach(()=>{
    cy.useSession('myUser')
    // useSession() always navigates you to a blank page
    cy.visit('...')
  })

  it('test one', ()=>{
    // beforeEach executed session steps
    // and saved the 'myUser' Session 
  })

  it('test two', ()=>{
    // beforeEach did NOT execute session steps
    // and instantaneously restored saved 'myUser' session data
  })
})
```

### Switch users within a single test
```ts
it('admin can ban user', ()=> {
  cy.useSession('admin')
  cy.visit('/user/one')
  cy.get('.ban-user-button').click()
  // wait for the network request to be completed
  cy.get('.toast').contains('successfully banned user')

  cy.useSession('basicUser')
  cy.visit('/home')
  cy.contains('sorry, you can no longer access this site')
})

```

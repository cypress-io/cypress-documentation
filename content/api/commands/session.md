---
title: session
---

Cache and restore [cookies](/api/cypress-api/cookies),
[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
and
[`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
in order to reduce test setup times.

<Alert type="warning">

The `cy.session()` API is currently experimental, and can be enabled by setting
the `experimentalSessionSupport` flag to `true` in the Cypress config or by
using [`Cypress.config()`](/api/cypress-api/config) at the top of a spec file.

Enabling this flag does the following:

- It enables the `cy.session()` API for use in tests.
- It adds the following new behaviors (that will be the default in a future
  major update of Cypress) at the beginning of each test:
  - The page is cleared (by setting it to `about:blank`)
  - All active session data (cookies, `localStorage` and `sessionStorage`)
    across all domains are cleared
- It overrides the
  [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies#Preserve-Once) and
  [`Cypress.Cookies.defaults()`](/api/cypress-api/cookies#Defaults) methods.

Because the page is cleared before each test,
[`cy.visit()`](/api/commands/visit) must be explicitly called in each test to
visit a page in your application.

</Alert>

## Syntax

```javascript
cy.session(id, setupFn)
cy.session(id, setupFn, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('[data-test=username]').type(username)
    cy.get('[data-test=password]').type(password)
    cy.get('form').contains('Log In').click()
    cy.url().should('contain', '/login-successful')
  })
})
```

<!--
**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.session(...) // something
```
-->

#### Usage notes

- The page is cleared and all active session data across all domains are cleared
  automatically when `cy.session()` runs. This guarantees consistent behavior
  whether a session is being created or restored. It also allows you to switch
  sessions without first having to explicitly log out.

|                      | Current page                                    | Active session data                             |
| -------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Before `setupFn`     | <Icon name="check-circle" color="green"></Icon> | <Icon name="check-circle" color="green"></Icon> |
| Before `validate`    | <Icon name="check-circle" color="green"></Icon> |                                                 |
| After `cy.session()` | <Icon name="check-circle" color="green"></Icon> |                                                 |

- Because calling `cy.session()` clears the current page, `cy.visit()` must
  always be explicitly called afterwards to ensure a page is visited.
- Once created, a session is cached for the duration of the spec file.
- You can't modify a stored session after it has been cached, but you can always
  create a new session with a different `id`.
- It is a best practice to call `cy.session()` inside a wrapper function or
  custom command.

### Arguments

**<Icon name="angle-right"></Icon> id** **_(String, Array, Object)_**

A unique identifier that will be used to cache and restore a given session. In
simple cases, a `String` value is sufficient. If an `Array` or `Object` is
passed as the `id`, an identifier will be deterministically generated from that
value.

<Alert type="info">

Any variable that is used inside the `setupFn` function that could possibly
change across tests in a single spec file should be specified in the `id`
argument so that the session may be cached properly. This includes objects that
may be mutated. If there are multiple variables, use an array.

</Alert>

<Alert type="warning">

Note that large or cyclical data structures may be slow or difficult to
serialize into an identifier, so exercise care with the data you specify as the
`id`.

</Alert>

**<Icon name="angle-right"></Icon> setupFn** **_(Function)_**

This function is called whenever a session for the given `id` hasn't yet been
cached, or if it's no longer valid (see the `validate` option). After `setupFn`
runs, Cypress will preserve all cookies, `sessionStorage`, and `localStorage`,
so that subsequent calls to `cy.session()` with the same `id` will bypass this
function and just restore the cached session data.

The page is always cleared before `setupFn` runs.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

| Option     | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `log`      | `true`      | Displays the command in the Command log                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `validate` | `undefined` | Validates the newly-created or restored session.<br><br>The `validate` function is run immediately after the `setupFn` function runs, and also every time `cy.session()` restores a cached session. If the `validate` function returns `false` or contains any failing Cypress command, the session will be considered invalid, and `setupFn` will be re-run. However, if validation fails immediately after `setupFn` is run, the test will fail.<br><br>The page is always cleared before `validate` runs. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `cy.session()` yields `null`.
- `cy.session()` cannot be chained further.

## Examples

### Updating an existing login custom command

Adding session caching to your custom login command couldn't be easier. Just
wrap the inside of the command with a call to `cy.session()`.

**Before**

```javascript
Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: { username, password },
  }).then(({ body }) => {
    window.localStorage.setItem('authToken', body.token)
  })
})
```

**After**

```javascript
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: { username, password },
    }).then(({ body }) => {
      window.localStorage.setItem('authToken', body.token)
    })
  })
})
```

**With session validation**

```javascript
Cypress.Commands.add(
  'login',
  (username, password) => {
    cy.session([username, password], () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: { username, password },
      }).then(({ body }) => {
        window.localStorage.setItem('authToken', body.token)
      })
    })
  },
  {
    validate() {
      cy.request('/whoami').its('statusCode').should('eq', 200)
    },
  }
)
```

### Updating an existing login helper function

Adding session caching to your custom login command couldn't be easier. Just
wrap the inside of the command with a call to `cy.session()`.

**Before**

```javascript
const login = (name, password) => {
  cy.visit('/login')
  cy.get('[data-test=name]').type(name)
  cy.get('[data-test=password]').type(password)
  cy.get('#submit').click()
  cy.url().should('contain', '/home')
}
```

**After**

```javascript
const login = (name, password) => {
  cy.session([name, password], () => {
    cy.visit('/login')
    cy.get('[data-test=name]').type(name)
    cy.get('[data-test=password]').type(password)
    cy.get('#submit').click()
    cy.url().should('contain', '/home')
  })
}
```

**With session validation**

```javascript
const login = (name, password) => {
  cy.session(
    [name, password],
    () => {
      cy.visit('/login')
      cy.get('[data-test=name]').type(name)
      cy.get('[data-test=password]').type(password)
      cy.get('#submit').click()
      cy.url().should('contain', '/home')
    },
    {
      validate() {
        cy.visit('/account-details')
      },
    }
  )
}
```

### Conditionally caching a session

Specs usually contain two types of tests where a login is necessary:

1. Testing functionality that only exists for logged-in users
2. Testing the act of logging in

For the 1st, caching sessions can be incredibly useful for reducing the amount
of time it takes to run tests. However, for the 2nd, it may be necessary to
_not_ cache the session, so that other things can be asserted about the login
process.

In this case, it can be helpful to create a custom login command that will
conditionally cache the session:

```javascript
Cypress.Commands.add('login', (name, { cacheSession = true } = {}) => {
  const login = () => {
    cy.visit('/login')
    cy.get('input').type(name)
    cy.get('#login').click()
    cy.url().should('contain', '/login-successful')
  }
  if (cacheSession) {
    cy.session(name, login)
  } else {
    login()
  }
})

// Testing the login flow itself
describe('login', () => {
  it('should redirect to the correct page after logging in', () => {
    cy.login('user', { cacheSession: false })
    cy.url().should('contain', '/login-successful')
  })
})

// Testing something that simply requires being logged in
describe('account details', () => {
  it('should have the correct document title', () => {
    cy.login('user')
    cy.visit('/account')
    cy.title().should('eq', 'User Account Details')
  })
})
```

### Switching sessions inside tests

Because `cy.session()` clears the page and all active session data before
running `setupFn`, you can use it to easily switch between sessions without
first needing to log the previous user out. This allows tests to more accurately
represent real-world scenarios and helps manage test run times.

```jsx
const login = (name) => {
  cy.session(name, () => {
    cy.visit('/login')
    cy.get('[data-test=name]').type(name)
    cy.get('[data-test=password]').type('s3cr3t')
    cy.get('#submit').click()
    cy.url().should('contain', '/home')
  })
}

it('should transfer money between users', () => {
  login('user')
  cy.visit('/account')
  cy.get('#amount').type('100.00')
  cy.get('#send-money').click()

  login('other-user')
  cy.visit('/account')
  cy.get('#balance').should('eq', '100.00')
})
```

### Asserting the session inside setupFn

Because `cy.session()` caches session data immediately after the `setupFn`
function completes, it's a best practice to assert that the login process has
completed at the end of session setup, to ensure the function doesn't return too
early.

```javascript
cy.session('user', () => {
  cy.visit('/login')
  cy.get('name').type('user')
  cy.get('password').type('p4ssw0rd123')
  cy.get('#submit').click()
  // Wait for the post-login redirect to ensure that the
  // session actually exists to be cached
  cy.url().should('contain', '/home')
})
```

### Validating the session

If the `validate` function returns `false` or contains a failing Cypress
command, the session will be considered invalid, and the `setupFn` will be
re-run.

Here are a few `validate` examples:

```javascript
// Attempt to visit a page that only a logged-in user can see
function validate() {
  cy.visit('/private')
}

// Make an API request that returns a 200 only when logged in
function validate() {
  cy.request('/api/user').its('statusCode').should('eq', 200)
}

// Run any Cypress command that fails if the user is not logged in
function validate() {
  cy.visit('/account', { failOnStatusCode: false })
  cy.url().should('match', /^/account/)
}

// Or just return false if the session is invalid
function validate() {
  if (!MyApp.isSessionValid()) {
    return false
  }
}
```

### Modifying session data

If you don't want to cache all session data (cookies, `localStorage` and
`sessionStorage`), you can modify session data as-necessary in `setupFn`.

```javascript
cy.session('user', () => {
  cy.visit('/login')
  cy.get('name').type('user')
  cy.get('password').type('p4ssw0rd123')
  cy.get('#submit').click()
  cy.url().should('contain', '/home')
  // Remove session data we don't want to cache
  cy.clearCookie('authId')
  cy.window().then((win) => {
    win.localStorage.removeItem('authToken')
  })
})
```

### Caching sessions via the correct id

Any variable that is used inside the `setup` function that could possibly change
throughout the spec file should be specified in the `id` argument. This includes
objects that may be mutated. If there are multiple variables, use an array.

```javascript
// If your session setup code uses a string variable, pass in the
// string as the id
const login = (name) => {
  cy.session(name, () => {
    loginWith(name)
  })
}

// If your session setup code uses a single object, pass in the
// object as the id and it will be serialized into an identifier
const login = (params = {}) => {
  cy.session(params, () => {
    loginWith(params)
  })
}

// If your session setup code uses multiple variables, pass in an
// array of those variables and it will be serialized into an
// identifier
const login = (name, email, params = {}) => {
  cy.session([name, email, params], () => {
    loginWith(name, email, params)
  })
}
```

### Updating login functions that return a value

If your custom login command returns a value that you use to assert in a test,
wrapping it with `cy.session()` will break that test. However, it's usually easy
to solve this by refactoring the login code to assert directly inside `setupFn`.

**Before**

```javascript
Cypress.Commands.add('loginByApi', (username, password) => {
  return cy.request('POST', `/api/login`, {
    username,
    password,
  })
})

it('should return the correct value', () => {
  cy.loginByApi('user', 's3cr3t').then((response) => {
    expect(response.status).to.eq(200)
  })
})
```

**After**

```javascript
Cypress.Commands.add('loginByApi', (username, password) => {
  cy.session([username, password], () => {
    cy.request('POST', `/api/login`, {
      username,
      password,
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})

it('is a redundant test', () => {
  /* which you can now delete! */
})
```

### Cross-domain sessions

It's possible to switch domains while caching sessions, just be sure to
explicitly visit the domain in your login command before calling `cy.session()`.

```jsx
const login = (name) => {
  if (location.hostname !== 'example.com') {
    cy.visit('example.com')
  }
  cy.session(name, () => {
    cy.visit('/login')
    // etc
  }, {
    validate() {
      cy.request('/whoami', {
        headers: { 'Authorization' : localStorage.token }
        method: 'POST'
      }).its('statusCode').should('equal', '200')
    }
  })
}

it('t1', ()=>{
  login('bob')
  // do things on example.com
})

it('t2', ()=>{
  cy.visit('anotherexample.com')
  // do things on anotherexample.com
})

it('t3', ()=>{
  login('bob')
  // do things on example.com
})
```

### Explicitly clearing all sessions

For diagnostic purposes, it's possible to explicitly clear all stored sessions
with the `Cypress.session.clearAllSavedSessions()` method or via the "Clear All
Sessions" button in the Test Runner UI.

**TODO: SHOW IMAGE**

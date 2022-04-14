---
title: origin
---

Visit multiple domains of different
[origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#definition_of_an_origin)
in a single test.

In normal use, a single Cypress test may only run commands in a single origin, a
limitation determined by standard web security features of the browser. The
`cy.origin()` command allows your tests to bypass this limitation.

<Alert type="warning">

<strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
Experimental</strong>

TODO Maybe rework this & move to a partial

The `origin` API is currently experimental, and can be enabled by setting
the [`experimentalSessionAndOrigin`](/guides/references/experiments) flag
to `true` in the Cypress config or by
using [`Cypress.config()`](/api/cypress-api/config) at the top of a spec file.

Enabling this flag does the following:

- It adds the [`cy.session()`](/api/commands/session) and `cy.origin()`
  commands, and [`Cypress.session`](/api/cypress-api/session) API.
- It adds the following new behaviors (that will be the default in a future
  major update of Cypress) at the beginning of each test:
  - The page is cleared (by setting it to `about:blank`).
  - All active session data (cookies, `localStorage` and `sessionStorage`)
    across all domains are cleared.
- It overrides
  the [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies#Preserve-Once) and [`Cypress.Cookies.defaults()`](/api/cypress-api/cookies#Defaults) methods.
- Cross-domain requests will no longer fail immediately, but instead, time out
  based on [`pageLoadTimeout`](/guides/references/configuration#Timeouts).
- Tests will no longer wait on page loads before moving on to the next test.

Because the page is cleared before each
test, [`cy.visit()`](/api/commands/visit) must be explicitly called in each test
to visit a page in your application.

</Alert>

## Syntax

```js
cy.origin(url, callbackFn)
cy.origin(url, options, callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
const hits = getHits() // Defined elsewhere
// Run commands in a secondary origin, passing in any serializable values we need
cy.origin('https://www.acme.com', { args: { hits } }, ({ hits }) => {
  // Inside callback baseUrl is https://www.acme.com
  cy.visit('/history/founder')
  // Commands are executed in secondary origin
  cy.get('h1').contains('About our Founder, Marvin Acme')
  // Passed in values are accessed via callback args
  cy.get('#hitcounter').contains(hits)
})
// Even though we are outside the secondary origin block, we are still on acme.com
// so return to baseUrl
cy.visit('/')
// Continue running commands on primary origin
cy.get('h1').contains('My cool site under test')
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```js
const hits = 9000
// This should be inside the callback, Cypress needs to be injected before visit
cy.visit('https://www.acme.com/history/founder')
cy.origin('https://www.acme.com', () => {
  // Won't work because Cypress is not present on secondary origin
  cy.get('h1').contains('About our Founder, Marvin Acme')
  // Won't work because hits is not passed in via args
  cy.get('#hitcounter').contains(hits)
})
// Won't work because still on acme.com
cy.get('h1').contains('My cool site under test')
```

### Arguments

**<Icon name="angle-right"></Icon> url** **_(String)_**

A URL specifying the secondary origin in which the callback is to be executed.
This should at the very least contain a hostname, and may also include the
protocol, port number & path. This argument will be used in two ways.

Firstly, it uniquely identifies a secondary origin in which the commands in the
callback will be executed. The test-runner will inject the Cypress runtime into
this origin, and then send it code to evaluate in that origin, without violating
the browser's same-origin policy.

Secondly, it temporarily overrides the `baseUrl` configured in your
[global configuration](/guides/references/configuration#Global) whilst inside
the callback. So `cy.visit()` will navigate relative to this URL, not the
configured `baseUrl`.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to control the behavior of `cy.origin()`.

| option | description                                                                                                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| args   | Plain JavaScript object which will be serialized and sent from the primary origin to the secondary origin, where it will be deserialized and passed into the callback function as its first and only argument. |

<Alert type="warning">

The `args` object is the **only** mechanism via which data may be injected into
the callback, the callback is **not** a closure and does not retain access to
the JavaScript context in which it was declared.

</Alert>

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

The function containing the commands to be executed in the secondary origin.

This function will be stringified, sent to the Cypress instance in the secondary
origin and evaluated. If the `args` option is specified, the deserialized args
object will be passed into the function as its first and only argument.

There are a number of limitations placed on commands run inside the callback,
please see [Callback restrictions](#Callback-restrictions) section below for a
full list.

The function's return value is ignored. ???

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `cy.origin()` yields `null`.
- `cy.origin()` cannot be chained further.

## Examples

### Using dynamic data in a secondary origin

Callbacks are executed inside an entirely separate instance of Cypress, so
arguments must be transmitted to the other instance by means of serialization &
deserialization. The interface for this mechanism is the `args` option.

```js
const sentArgs = { password: 'P@55w0rd!!!1!?!111one' }
cy.origin(
  'supersecurelogons.com',
  // Send the args here...
  { args: sentArgs },
  // ...and receive them at the other end here!
  (receivedArgs) => {
    const { password } = receivedArgs
    cy.visit('/login')
    cy.get('input#password').type(password)
    cy.contains('button', 'Login').click()
  }
)
```

Note: You can just replace `sentArgs` and `receivedArgs` with `args` if you
want, the naming in this example is purely for clarity.

### Navigating to secondary origin with cy.visit

When navigating to a secondary origin using `cy.visit()`, it is essential to
trigger the navigation **after** entering the origin callback, otherwise a
cross-domain error will be thrown.

```js
// Do things in primary domain...

cy.origin('acme.com', () => {
  // Visit https://www.acme.com/history/founder
  cy.visit('/history/founder')
  cy.get('h1').contains('About our Founder, Marvin Acme')
})
```

```js
// TODO Example with onBeforeLoad...
```

TODO baseUrl

TODO default protocol

### Navigating to secondary origin with UI

When navigating to a secondary origin by clicking a link or button in the
primary origin, it is essential to trigger the navigation _before_ entering the
origin callback, otherwise a cross-domain error will be thrown.

```js
// Click button in primary origin that navigates to https://acme.com
cy.contains('button', 'Go to Acme.com').click()

cy.origin('acme.com', () => {
  // No cy.visit is needed as the button brought us here
  cy.get('h1').contains('ACME CORP')
})
```

### Navigating to multiple secondary origins in succession

Callbacks may **not** themselves contain `cy.origin()` calls, so when visiting
multiple origins, do so at the top level of the test.

```js
cy.origin('foo.com', () => {
  cy.visit('/')
  cy.url().should('contain', 'foo.com')
})

cy.origin('bar.com', () => {
  cy.visit('/')
  cy.url().should('contain', 'bar.com')
})

cy.origin('baz.com', () => {
  cy.visit('/')
  cy.url().should('contain', 'baz.com')
})
```

TODO Stabilization?

### Waiting to return to primary origin

Sometimes, a secondary origin returns to the primary origin as a result of user
action (for example, by clicking a "Login" button on a syndicated login
provider). In this situation, your test should wait for the navigation to
complete before making further assertions, otherwise a cross-domain error will
be thrown.

```js
cy.visit('/home')
// This will take us to the secondary origin
cy.contains('button', 'Go to someothersite').click()

cy.origin('someothersite.com', () => {
  // Click button that takes us back to primary origin
  cy.contains('button', 'Go back').click()
)
// Wait until confirmation we are back at the primary origin before continuing
cy.url().should('contain', '/home')
// Do more things in primary domain...
```

### SSO login custom command

A very common requirement is logging in to a site before running a test. If
login itself is not the specific focus of the test, it's good to encapsulate
this functionality in a `login`
[custom command](/api/cypress-api/custom-commands) so you don't have to
duplicate this login code in every test. Here's an idealized example of how to
do this with `cy.origin()`.

```js
Cypress.Commands.add('login', (username, password) => {
  // Remember to pass in dependencies via `args`
  const args = { username, password }
  cy.origin('auth-provider.com', { args }, ({ username, password }) => {
    // Go to https://auth-provider.com/login
    cy.visit('/login')
    cy.contains('Username').find('input').type(username)
    cy.contains('Password').find('input').type(password)
    cy.get('button').contains('Login').click()
  })
  // Wait until confirmation we are back at the primary origin before continuing
  cy.url().should('contain', '/home')
})
```

However, having to go through an entire login flow before every test is not very
performant. Up until now you could get around this by putting login code in the
first test of your file, then performing subsequent tests reusing the same
session. However, once the `experimentalSessionAndOrigin` flag is activated this
is no longer possible, as all session state is now cleared between tests. So to
avoid this overhead we have added the [`cy.session()`](/api/commands/session)
command, which allows you to easily cache session information and reuse it
across not just tests, but test files too. So now let's enhance our custom login
command with `cy.session()` for a complete syndicated login flow with session
caching and validation. No mocking, no workarounds, no third-party plugins!

```js
Cypress.Commands.add('login', (username, password) => {
  const args = { username, password }
  cy.session(
    // The username & password combination can be used as the cache key too
    args,
    () => {
      cy.origin('auth-provider.com', { args }, ({ username, password }) => {
        cy.visit('/login')
        cy.contains('Username').find('input').type(username)
        cy.contains('Password').find('input').type(password)
        cy.get('button').contains('Login').click()
      })
      cy.url().should('contain', '/home')
    },
    {
      validate() {
        cy.request('/api/user').its('status').should('eq', 200)
      },
    }
  )
})
```

## Notes

### Migrating existing tests

Enabling the `experimentalSessionAndOrigin` flag makes the test-runner work
slightly differently, and some test suites that rely on the existing behaviour
may have to be updated. The most important of these changes is **test
isolation**. This means that after every test, the current page is reset to
[`about:blank`](https://en.wikipedia.org/wiki/About_URI_scheme#Standardization)
and all active session data (cookies, `localStorage` and `sessionStorage`)
across all domains are cleared. This change is opt-in for now, but will be
standardized in a future major release of Cypress, so eventually all tests will
need to be isolated.

Before this change, it was possible to write tests such that you could, for
example, login to a CMS in the first test, change some content in the second
test, verify the new version is displayed on a different URL in the third, and
logout in the fourth. Here's a simplified example of such a test strategy.

<Badge type="danger">Before</Badge> Multiple small tests against different
origins

```js
it('logs in', () => {
  cy.visit('https"//supersecurelogons.com')
  cy.get('input#password').type('Password123!')
  cy.get('button#submit').click()
})

it('updates the content', () => {
  cy.get('#current-user').contains('logged in')
  cy.get('button#edit-1').click()
  cy.get('input#title').type('Updated title')
  cy.get('button#submit').click()
  cy.get('.toast').type('Changes saved!')
})

it('validates the change', () => {
  cy.visit('/items/1')
  cy.get('h1').contains('Updated title')
})
```

After switching on `experimentalSessionAndOrigin`, this flow would need to be
contained within a single test. While this practice has always been
[discouraged](/guides/references/best-practices#Having-tests-rely-on-the-state-of-previous-tests)
we know some users have historically written tests this way, often to get around
the same-origin restrictions. But with `cy.origin()` you no longer need these
kind of brittle hacks, as your multi-origin logic can all reside in a single
test, like the following.

<Badge type="success">After</Badge> One big test using `cy.origin()`

```js
it('securely edits content', () => {
  cy.origin('supersecurelogons.com', () => {
    cy.visit('https"//supersecurelogons.com')
    cy.get('input#password').type('Password123!')
    cy.get('button#submit').click()
  })

  cy.origin('mycms.com', () => {
    cy.url().should('contain', 'cms')
    cy.get('#current-user').contains('logged in')
    cy.get('button#edit-1').click()
    cy.get('input#title').type('Updated title')
    cy.get('button#submit').click()
    cy.get('.toast').type('Changes saved!')
  })

  cy.visit('/items/1')
  cy.get('h1').contains('Updated title')
})
```

Always remember,
[Cypress tests are not unit tests](https://docs.cypress.io/guides/references/best-practices#Creating-tiny-tests-with-a-single-assertion).

### Serialization

When entering a `cy.origin()` block, the test-runner injects the Cypress
runtime, with all your configurations settings, into the requested origin, and
sets up bidirectional communication with that instance. This coordination model
requires that any data sent from one instance to another be
[serialized](https://developer.mozilla.org/en-US/docs/Glossary/Serialization)
for transmission. It is very important to understand that variables **inside**
the callback are not shared with the scope **outside** the callback. For example
this will not work:

```js
const foo = 1
cy.origin('somesite.com', () => {
  cy.visit('/')
  // This line will throw a ReferenceError because `foo` is not defined in the
  // scope of the callback
  cy.get('input').type(foo)
})
```

Instead, the variable must be explicitly passed into the callback using the
`args` option:

```js
const foo = 1
cy.origin('somesite.com', { args: { foo } }, ({ foo }) => {
  cy.visit('/')
  // Now it will pass
  cy.get('input').type(foo)
})
```

Underneath the hood, Cypress uses
[`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
and
[`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
(or equivalent library functions, implementation details may change) to
serialize and deserialize the `args` object. This introduces a number of
restrictions on the data which may be transmitted:

- Primitive values only: object, array, string, number, boolean, null
- Date objects will be converted to strings
- Inherited properties are not serialized
- Circular references are not allowed and will throw an error

### Callback restrictions

Because of the way in which the callback is transmitted and executed, there are
certain limitations on what code may be run inside it. In particular, the
following Cypress commands will throw errors if used in the callback:

- `cy.origin()`
- [`cy.intercept()`](/api/commands/intercept)
- [`cy.session()`](/api/commands/session)
- [`cy.server()`](/api/commands/server)
- [`cy.route()`](/api/commands/route)
- [`Cypress.Server.defaults()`](/api/cypress-api/cypress-server)
- [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies)

TODO require

TODO maybe repeat the part about evaluation

## Command log

TODO

## See also

- [Custom Commands](/api/cypress-api/custom-commands)
- [`cy.session()`](/api/commands/session)
- [`cy.visit()`](/api/commands/visit)

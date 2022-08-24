---
title: origin
e2eSpecific: true
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

The `cy.origin()` command is currently experimental and can be enabled by
setting
the [`experimentalSessionAndOrigin`](/guides/references/experiments) flag
to `true` in the Cypress config.

Enabling this flag does the following:

- It adds the [`cy.session()`](/api/commands/session) and `cy.origin()`
  commands, and [`Cypress.session`](/api/cypress-api/session) API.
- It adds the following new behaviors (that will be the default in a future
  major version release of Cypress) at the beginning of each test:
  - The page is cleared (by setting it to `about:blank`).
  - All active session data (cookies, `localStorage` and `sessionStorage`)
    across all domains are cleared.
- It supersedes
  the [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies#Preserve-Once) and
  [`Cypress.Cookies.defaults()`](/api/cypress-api/cookies#Defaults) methods.
- Cross-origin requests will no longer fail immediately, but instead, time out
  based on [`pageLoadTimeout`](/guides/references/configuration#Timeouts).
- Tests will no longer wait on page loads before moving on to the next test.

Because the page is cleared before each
test, [`cy.visit()`](/api/commands/visit) must be explicitly called in each test
to visit a page in your application.

</Alert>

<Alert type="warning">

<strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
Obstructive Third Party Code</strong>

By default Cypress will search through the response streams coming from your
server on first party `.html` and `.js` files and replace code that matches
patterns commonly found in framebusting. When using the `cy.origin()` command,
the third party code may also need to be modified for framebusting techniques.
This can be enabled by setting the
[`experimentalModifyObstructiveThirdPartyCode`](/guides/references/experiments)
flag to `true` in the Cypress configuration.

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
// Run commands in secondary origin, passing in serializable values
cy.origin('https://www.acme.com', { args: { hits } }, ({ hits }) => {
  // Inside callback baseUrl is https://www.acme.com
  cy.visit('/history/founder')
  // Commands are executed in secondary origin
  cy.get('h1').contains('About our Founder, Marvin Acme')
  // Passed in values are accessed via callback args
  cy.get('#hitcounter').contains(hits)
})
// Even though we're outside the secondary origin block,
// we're still on acme.com so return to baseUrl
cy.visit('/')
// Continue running commands on primary origin
cy.get('h1').contains('My cool site under test')
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```js
const hits = getHits()
// cy.visit() should be inside cy.origin() callback
cy.visit('https://www.acme.com/history/founder')
cy.origin('https://www.acme.com', () => {
  // Fails because origin was visited before cy.origin() block
  cy.get('h1').contains('About our Founder, Marvin Acme')
  // Fails because hits is not passed in via args
  cy.get('#hitcounter').contains(hits)
})
// Won't work because still on acme.com
cy.get('h1').contains('My cool site under test')
```

### Arguments

**<Icon name="angle-right"></Icon> url** **_(String)_**

A URL specifying the secondary origin in which the callback is to be executed.
This should at the very least contain a hostname, and may also include the
protocol, port number & path. Query params are not supported.

This argument will be used in two ways:

1. It uniquely identifies a secondary origin in which the commands in the
   callback will be executed. Cypress will inject itself into this origin, and
   then send it code to evaluate in that origin, without violating the browser's
   same-origin policy.

2. It overrides the `baseUrl` configured in your
   [global configuration](/guides/references/configuration#Global) while inside
   the callback. So `cy.visit()` and `cy.request()` will use this URL as a
   prefix, not the configured `baseUrl`.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to control the behavior of `cy.origin()`.

| option | description                                                                                                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| args   | Plain JavaScript object which will be serialized and sent from the primary origin to the secondary origin, where it will be deserialized and passed into the callback function as its first and only argument. |

<Alert type="warning">

The `args` object is the **only** mechanism via which data may be injected into
the callback, the callback is **not** a closure and does not retain access to
the JavaScript context in which it was declared. Values passed into `args`
**must** be serializable.

</Alert>

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

The function containing the commands to be executed in the secondary origin.

This function will be stringified, sent to the Cypress instance in the secondary
origin and evaluated. If the `args` option is specified, the deserialized args
object will be passed into the function as its first and only argument.

There are a number of limitations placed on commands run inside the callback,
please see [Callback restrictions](#Callback-restrictions) section below for a
full list.

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `cy.origin()` yields the value yielded by the last Cypress command in the
  callback function.
- If the callback contains no Cypress commands, `cy.origin()` yields the return
  value of the function.
- In either of the two cases above, if the value is not serializable, attempting
  to access the yielded value will throw an error.

## Examples

### Using dynamic data in a secondary origin

Callbacks are executed inside an entirely separate instance of Cypress, so
arguments must be transmitted to the other instance by means of
[the structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
The interface for this mechanism is the `args` option.

```js
const sentArgs = { username: 'username', password: 'P@55w0rd!' }
cy.origin(
  'supersecurelogons.com',
  // Send the args here...
  { args: sentArgs },
  // ...and receive them at the other end here!
  ({ username, password }) => {
    cy.visit('/login')
    cy.get('input#username').type(username)
    cy.get('input#password').type(password)
    cy.contains('button', 'Login').click()
  }
)
```

### Yielding a value

Values returned or yielded from the callback function **must** be serializable
or they will not be returned to the primary origin. For example, the following
will not work:

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```js
cy.origin('https://www.acme.com', () => {
  cy.visit('/')
  cy.get('h1') // Yields an element, which can't be serialized...
}).contains('ACME CORP') // ...so this will fail
```

Instead, you must explicitly yield a serializable value:

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
cy.origin('https://www.acme.com', () => {
  cy.visit('/')
  cy.get('h1').invoke('textContent') // Yields a string...
}).should('equal', 'ACME CORP') // 👍
```

### Navigating to secondary origin with cy.visit

When navigating to a secondary origin using `cy.visit()`, it is essential to
trigger the navigation **after** entering the origin callback, otherwise a
cross-origin error will be thrown.

```js
// Do things in primary origin...

cy.origin('www.acme.com', () => {
  // Visit https://www.acme.com/history/founder
  cy.visit('/history/founder')
  cy.get('h1').contains('About our Founder, Marvin Acme')
})
```

Here the `baseUrl` inside the `cy.origin()` callback is set to `www.acme.com`
and the protocol defaults to `https`. When `cy.visit()` is called with the path
`/history/founder`, the three are concatenated to make
`https://www.acme.com/history/founder`.

### Navigating to secondary origin with UI

When navigating to a secondary origin by clicking a link or button in the
primary origin, it is essential to trigger the navigation _before_ entering the
origin callback, otherwise a cross-origin error will be thrown.

```js
// Button in primary origin goes to https://www.acme.com
cy.contains('button', 'Go').click()

cy.origin('www.acme.com', () => {
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

<Alert type="info">

A future version of Cypress will allow the use of nested `cy.origin()` calls.

</Alert>

### SSO login custom command

A very common requirement is logging in to a site before running a test. If
login itself is not the specific focus of the test, it's good to encapsulate
this functionality in a `login`
[custom command](/api/cypress-api/custom-commands) so you don't have to
duplicate this login code in every test. Here's an idealized example of how to
do this with `cy.origin()`.

**<Icon name="exclamation-triangle" color="#f0ad4e"></Icon> Inefficient Usage**

```js
Cypress.Commands.add('login', (username, password) => {
  // Remember to pass in arguments via `args`
  const args = { username, password }
  cy.origin('my-auth.com', { args }, ({ username, password }) => {
    // Go to https://auth-provider.com/login
    cy.visit('/login')
    cy.contains('Username').find('input').type(username)
    cy.contains('Password').find('input').type(password)
    cy.get('button').contains('Login').click()
  })
  // Confirm we're back at the primary origin before continuing
  cy.url().should('contain', '/home')
})
```

Having to go through an entire login flow before every test is not very
performant. Up until now you could get around this problem by putting login code
in the first test of your file, then performing subsequent tests reusing the
same session.

However, once the `experimentalSessionAndOrigin` flag is activated, this is no
longer possible, since all session state is now cleared between tests. So to
avoid this overhead we recommend you leverage the
[`cy.session()`](/api/commands/session) command, which allows you to easily
cache session information and reuse it across tests. So now let's enhance our
custom login command with `cy.session()` for a complete syndicated login flow
with session caching and validation. No mocking, no workarounds, no third-party
plugins!

```js
Cypress.Commands.add('login', (username, password) => {
  const args = { username, password }
  cy.session(
    // Username & password can be used as the cache key too
    args,
    () => {
      cy.origin('my-auth.com', { args }, ({ username, password }) => {
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

## Learn More

### How to Test Multiple Origins

<DocsVideo src="https://youtube.com/embed/Fohrq5GZSD8"></DocsVideo>

In this video we walk through how to test multiple origins in a single test. We
also look at how to use the `cy.session()` command to cache session information
and reuse it across tests.

## Notes

### Migrating existing tests

Enabling the `experimentalSessionAndOrigin` flag makes the test-runner work
slightly differently, and some test suites that rely on the existing behaviour
may have to be updated. The most important of these changes is **test
isolation**. This means that after every test, the current page is reset to
`about:blank` and all active session data
(cookies, `localStorage` and `sessionStorage`) across all domains are cleared.
This change is opt-in for now, but will be standardized in a future major
release of Cypress, so eventually all tests will need to be isolated.

Before this change, it was possible to write tests such that you could, for
example, log in to a CMS in the first test, change some content in the second
test, verify the new version is displayed on a different URL in the third, and
log out in the fourth. Here's a simplified example of such a test strategy.

<Badge type="danger">Before</Badge> Multiple small tests against different
origins

```js
it('logs in', () => {
  cy.visit('https://supersecurelogons.com')
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
    cy.visit('https://supersecurelogons.com')
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

When entering a `cy.origin()` block, Cypress injects itself at runtime, with all
your configuration settings, into the requested origin, and sets up
bidirectional communication with that instance. This coordination model requires
that any data sent from one instance to another be
[serialized](https://developer.mozilla.org/en-US/docs/Glossary/Serialization)
for transmission. It is very important to understand that variables **inside**
the callback are not shared with the scope **outside** the callback. For example
this will not work:

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```js
const foo = 1
cy.origin('somesite.com', () => {
  cy.visit('/')
  // This line will throw a ReferenceError because
  // `foo` is not defined in the scope of the callback
  cy.get('input').type(foo)
})
```

Instead, the variable must be explicitly passed into the callback using the
`args` option:

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
const foo = 1
cy.origin('somesite.com', { args: { foo } }, ({ foo }) => {
  cy.visit('/')
  // Now it will pass
  cy.get('input').type(foo)
})
```

Cypress uses
[the structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
to transfer the `args` option to the secondary origin. This introduces a number
of
[restrictions on the data which may be passed](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#things_that_dont_work_with_structured_clone)
into the callback.

### Dependencies / Sharing Code

It is not possible to use
[CommonJS `require()`](https://nodejs.org/en/knowledge/getting-started/what-is-require/)
or
[dynamic ES module `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)
within the callback. However, [`Cypress.require()`](/api/cypress-api/require)
can be utilized to include [npm](https://www.npmjs.com/) packages and other
files. It is functionally the same as using
[CommonJS `require()`](https://nodejs.org/en/knowledge/getting-started/what-is-require/)
in browser-targeted code.

```js
cy.origin('somesite.com', () => {
  const _ = Cypress.require('lodash')
  const utils = Cypress.require('../support/utils')

  // ... use lodash and utils ...
})
```

`Cypress.require()` can be used to share custom commands between tests run in
primary and secondary origins. We recommend this pattern for setting up your
[support file](/guides/core-concepts/writing-and-organizing-tests#Support-file)
and setting up custom commands to run within the `cy.origin()` callback:

`cypress/support/commands.js`:

```js
Cypress.Commands.add('clickLink', (label) => {
  cy.get('a').contains(label).click()
})
```

`cypress/support/e2e.js`:

```js
// makes custom commands available to all Cypress tests, outside of
// cy.origin() callbacks
import './commands'

// code we only want run per test, so it shouldn't be run as part of
// the execution of cy.origin() as well
beforeEach(() => {
  // ... code to run before each test ...
})
```

`cypress/e2e/spec.cy.js`:

```js
it('tests somesite.com', () => {
  cy.origin('somesite.com', () => {
    // makes custom commands available to all subsequent
    // cy.origin('somesite.com') calls
    Cypress.require('../support/commands')

    cy.visit('/page')
    cy.clickLink('Click Me')
  })
})
```

The JavaScript execution context is persisted between `cy.origin()` callbacks
that share the same origin. This can be utilized to share code between
successive `cy.origin()` calls.

```js
before(() => {
  cy.origin('somesite.com', () => {
    // makes commands defined in this file available to all callbacks
    // for somesite.com
    Cypress.require('../support/commands')
  })
})

it('uses cy.origin() + custom command', () => {
  cy.origin('somesite.com', () => {
    cy.visit('/page')
    cy.clickLink('Click Me')
  })
})

it('also uses cy.origin() + custom command', () => {
  cy.origin('somesite.com', () => {
    cy.visit('/page')
    cy.clickLink('Click Me')
  })

  cy.origin('differentsite.com', () => {
    // WARNING: cy.clickLink() will not be available because it is a
    // different origin
  })
})
```

### Callback restrictions

Because of the way in which the callback is transmitted and executed, there are
certain limitations on what code may be run inside it. In particular, the
following Cypress commands will throw errors if used in the callback:

- `cy.origin()`
- [`cy.intercept()`](/api/commands/intercept)
- [`cy.session()`](/api/commands/session)
- [`cy.server()`](/api/commands/server)
- [`cy.route()`](/api/commands/route)
- [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies)

### Other limitations

There are other testing scenarios which are not currently covered by
`cy.origin()`:

- It cannot run commands
  [in a different browser window](/guides/references/trade-offs#Multiple-browsers-open-at-the-same-time)
- It cannot run commands
  [in a different browser tab](/guides/references/trade-offs#Multiple-tabs)
- It cannot run commands
  [inside an `<iframe>` element](/faq/questions/using-cypress-faq#How-do-I-test-elements-inside-an-iframe)

However, `<iframe>` support is on [our roadmap](/guides/references/roadmap) for
inclusion in a future version of Cypress.

## See also

- [Easily test multi-domain workflows with cy.origin](https://cypress.io/blog/2022/04/25/cypress-9-6-0-easily-test-multi-domain-workflows-with-cy-origin/)
- [Custom Commands](/api/cypress-api/custom-commands)
- [`cy.session()`](/api/commands/session)
- [`cy.visit()`](/api/commands/visit)

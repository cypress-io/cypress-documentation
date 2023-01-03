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
Obstructive Third Party Code</strong>

By default Cypress will search through the response streams coming from your
server on first party `.html` and `.js` files and replace code that matches
patterns commonly found in framebusting. When using the `cy.origin()` command,
the third party code may also need to be modified for framebusting techniques.
This can be enabled by setting the
[`experimentalModifyObstructiveThirdPartyCode`](/guides/references/experiments)
flag to `true` in the Cypress configuration. More information about this
experimental flag can be found on our
[Web Security](/guides/guides/web-security#Modifying-Obstructive-Third-Party-Code)
page.

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
cy.visit('https://www.acme.com/history/founder')
// To interact with cross-origin content, move this inside cy.origin() callback
cy.get('h1').contains('About our Founder, Marvin Acme')
// Domain must be a precise match including subdomain, i.e. www.acme.com
cy.origin('acme.com', () => {
  cy.visit('/history/founder')
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
protocol, port number & path. The hostname must precisely match that of the
secondary origin, including all subdomains. Query params are not supported.

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

When navigating to a secondary origin using `cy.visit()`, you can either
navigate prior to or after the `cy.origin` block. Errors are no longer thrown on
cross-origin navigation, but instead when commands interact with a cross-origin
page.

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

#### Alternative navigation

```js
// Do things in primary origin...

cy.visit('https://www.acme.com/history/founder')

// The cy.origin block is required to interact with the cross-origin page.
cy.origin('www.acme.com', () => {
  cy.get('h1').contains('About our Founder, Marvin Acme')
})
```

Here the cross-origin page is visited prior to the `cy.origin` block, but any
interactions with the window are performed within the block which can
communicate with the cross-origin page

#### <Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage

```js
// Do things in primary origin...

cy.visit('https://www.acme.com/history/founder')

// This command will fail, it's executed on localhost but the application is at acme.com
cy.get('h1').contains('About our Founder, Marvin Acme')
```

Here `cy.get('h1')` fails because we are trying to interact with a cross-origin
page outside of the cy.origin block, due to 'same-origin' restrictions, the
'localhost' javascript context can't communicate with 'acme.com'.

### Navigating to secondary origin with UI

Navigating to a secondary origin by clicking a link or button in the primary
origin is supported.

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

However, this is no longer possible, since all session state is now cleared
between tests. So to avoid this overhead we recommend you leverage the
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

[ES module dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)
and/or
[CommonJS `require()`](https://nodejs.org/en/knowledge/getting-started/what-is-require/)
can be used within the callback to include [npm](https://www.npmjs.com/)
packages and other files.

<Alert type="warning">

Using `import()` and `require()` within the callback requires enabling the
[`experimentalOriginDependencies`](/guides/references/experiments) flag in the
Cypress configuration and using version `5.15.0` or greater of the
[`@cypress/webpack-preprocessor`](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor).
The `@cypress/webpack-preprocessor` is included in Cypress by default, but if
your project installs its own version in the Cypress configuration, make sure it
is version `5.15.0` or greater.

If using an older version of the webpack or a different preprocessor, you'll see
an error that includes the following text:

_Using `require()` or `import()` to include dependencies requires enabling the
`experimentalOriginDependencies` flag and using the latest version of
`@cypress/webpack-preprocessor`._

</Alert>

<Alert type="warning">

Using `require()` or `import()` within the callback from a `node_modules` plugin
is not currently supported. We anticipate adding support with issue
[#24976](https://github.com/cypress-io/cypress/issues/24976).

</Alert>

#### Example

```js
// ES modules
cy.origin('somesite.com', async () => {
  const _ = await import('lodash')
  const utils = await import('../support/utils')

  // ... use lodash and utils ...
})

// CommonJS
cy.origin('somesite.com', () => {
  const _ = require('lodash')
  const utils = require('../support/utils')

  // ... use lodash and utils ...
})
```

#### Custom commands

This makes it possible to share custom commands between tests run in primary and
secondary origins. We recommend this pattern for setting up your
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
// makes custom commands available to all Cypress tests in this spec,
// outside of cy.origin() callbacks
import './commands'

// code we only want run per test, so it shouldn't be run as part of
// the execution of cy.origin() as well
beforeEach(() => {
  // ... code to run before each test ...
})
```

`cypress/e2e/spec.cy.js`:

```js
before(() => {
  // makes custom commands available to all subsequent cy.origin('somesite.com')
  // calls in this spec. put it in your support file to make them available to
  // all specs
  cy.origin('somesite.com', () => {
    require('../support/commands')
  })
})

it('tests somesite.com', () => {
  cy.origin('somesite.com', () => {
    cy.visit('/page')
    cy.clickLink('Click Me')
  })
})
```

#### Shared execution context

The JavaScript execution context is persisted between `cy.origin()` callbacks
that share the same origin. This can be utilized to share code between
successive `cy.origin()` calls.

```js
before(() => {
  cy.origin('somesite.com', () => {
    // makes commands defined in this file available to all callbacks
    // for somesite.com
    require('../support/commands')
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

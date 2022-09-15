---
title: wait
---

Wait for a number of milliseconds or wait for an aliased resource to resolve
before moving on to the next command.

## Syntax

```javascript
cy.wait(time)
cy.wait(alias)
cy.wait(aliases)
cy.wait(time, options)
cy.wait(alias, options)
cy.wait(aliases, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.wait(500)
cy.wait('@getProfile')
```

### Arguments

**<Icon name="angle-right"></Icon> time** **_(Number)_**

The amount of time to wait in milliseconds.

**<Icon name="angle-right"></Icon> alias** **_(String)_**

An aliased route as defined using the [`.as()`](/api/commands/as) command and
referenced with the `@` character and the name of the alias.

<Alert type="info">

<strong class="alert-header">Core Concept</strong>

[You can read more about aliasing routes in our Core Concept Guide](/guides/guides/network-requests#Waiting).

</Alert>

**<Icon name="angle-right"></Icon> aliases** **_(Array)_**

An array of aliased routes as defined using the [`.as()`](/api/commands/as)
command and referenced with the `@` character and the name of the alias.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.wait()`.

| Option            | Default                                                                                                                       | Description                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`             | `true`                                                                                                                        | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout`         | [`requestTimeout`](/guides/references/configuration#Timeouts), [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.wait()` to resolve before [timing out](#Timeouts)                   |
| `requestTimeout`  | [`requestTimeout`](/guides/references/configuration#Timeouts)                                                                 | Overrides the global `requestTimeout` for this request. Defaults to `timeout`.           |
| `responseTimeout` | [`responseTimeout`](/guides/references/configuration#Timeouts)                                                                | Overrides the global `responseTimeout` for this request. Defaults to `timeout`.          |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

#### When given a `time` argument:

<List><li>`cy.wait()` yields the same subject it was given from the previous
command.</li></List>

#### When given an `alias` argument:

<List><li>`cy.wait()` 'yields an object containing the HTTP request and response
properties of the request' </li></List>

## Examples

### Time

#### Wait for an arbitrary period of milliseconds:

```js
cy.wait(2000) // wait for 2 seconds
```

<Alert type="warning">

<strong class="alert-header">Anti-Pattern</strong>

You almost **never** need to wait for an arbitrary period of time. There are
always better ways to express this in Cypress.

Read about
[best practices](/guides/references/best-practices#Unnecessary-Waiting) here.

</Alert>

Additionally, it is often much easier to use [`cy.debug()`](/api/commands/debug)
or [`cy.pause()`](/api/commands/pause) when debugging your test code.

### Alias

For a detailed explanation of aliasing,
[read more about waiting on routes here](/guides/guides/network-requests#Waiting).

#### Wait for a specific request to respond

<e2e-or-ct>
<template #e2e>

```js
// Wait for the alias 'getAccount' to respond
// without changing or stubbing its response
cy.intercept('/accounts/*').as('getAccount')
cy.visit('/accounts/123')
cy.wait('@getAccount').then((interception) => {
  // we can now access the low level interception
  // that contains the request body,
  // response body, status, etc
})
```

</template>
<template #ct>

```js
// Wait for the alias 'getAccount' to respond
// without changing or stubbing its response
cy.intercept('/accounts/*').as('getAccount')
cy.mount(<Account />)
cy.wait('@getAccount').then((interception) => {
  // we can now access the low level interception
  // that contains the request body,
  // response body, status, etc
})
```

</template>
</e2e-or-ct>

#### Wait automatically increments responses

Each time we use `cy.wait()` for an alias, Cypress waits for the next nth
matching request.

```javascript
// stub an empty response to requests for books
cy.intercept('GET', '/books', []).as('getBooks')
cy.get('#search').type('Peter Pan')

// wait for the first response to finish
cy.wait('@getBooks')

// the results should be empty because we
// responded with an empty array first
cy.get('#book-results').should('be.empty')

// now the request (aliased again as `getBooks`) will return one book
cy.intercept('GET', '/books', [{ name: 'Peter Pan' }]).as('getBooks')

cy.get('#search').type('Peter Pan')

// when we wait for 'getBooks' again, Cypress will
// automatically know to wait for the 2nd response
cy.wait('@getBooks')

// we responded with one book the second time
cy.get('#book-results').should('have.length', 1)
```

### Aliases

#### You can pass an array of aliases that will be waited on before resolving.

When passing an array of aliases to `cy.wait()`, Cypress will wait for all
requests to complete within the given `requestTimeout` and `responseTimeout`.

<e2e-or-ct>
<template #e2e>

```js
cy.intercept('/users/*').as('getUsers')
cy.intercept('/activities/*').as('getActivities')
cy.intercept('/comments/*').as('getComments')
cy.visit('/dashboard')

cy.wait(['@getUsers', '@getActivities', '@getComments']).then(
  (interceptions) => {
    // interceptions will now be an array of matching requests
    // interceptions[0] <-- getUsers
    // interceptions[1] <-- getActivities
    // interceptions[2] <-- getComments
  }
)
```

</template>
<template #ct>

```js
cy.intercept('/users/*').as('getUsers')
cy.intercept('/activities/*').as('getActivities')
cy.intercept('/comments/*').as('getComments')
cy.mount(<Dashboard />)

cy.wait(['@getUsers', '@getActivities', '@getComments']).then(
  (interceptions) => {
    // interceptions will now be an array of matching requests
    // interceptions[0] <-- getUsers
    // interceptions[1] <-- getActivities
    // interceptions[2] <-- getComments
  }
)
```

</template>
</e2e-or-ct>

#### Using [`.spread()`](/api/commands/spread) to spread the array into multiple arguments.

```javascript
cy.intercept('/users/*').as('getUsers')
cy.intercept('/activities/*').as('getActivities')
cy.intercept('/comments/*').as('getComments')
cy.wait(['@getUsers', '@getActivities', '@getComments']).spread(
  (getUsers, getActivities, getComments) => {
    // each interception is now an individual argument
  }
)
```

## Notes

### Nesting

Cypress automatically waits for the network call to complete before proceeding
to the next command.

```js
// Anti-pattern: placing Cypress commands inside .then callbacks
cy.wait('@alias')
  .then(() => {
    cy.get(...)
  })

// Recommended practice: write Cypress commands serially
cy.wait('@alias')
cy.get(...)

// Example: assert status from cy.intercept() before proceeding
cy.wait('@alias').its('response.statusCode').should('eq', 200)
cy.get(...)
```

Read
[Guide: Introduction to Cypress](/guides/core-concepts/introduction-to-cypress#Commands-Run-Serially)

### Timeouts

#### `requestTimeout` and `responseTimeout`

When used with an alias, `cy.wait()` goes through two separate "waiting"
periods.

The first period waits for a matching request to leave the browser. This
duration is configured by the
[`requestTimeout`](/guides/references/configuration#Timeouts) option - which has
a default of `5000` ms.

This means that when you begin waiting for an aliased request, Cypress will wait
up to 5 seconds for a matching request to be created. If no matching request is
found, you will get an error message that looks like this:

<DocsImage src="/img/api/wait/error-for-no-matching-route-when-waiting-in-test.png" alt="Error for no matching request" ></DocsImage>

Once Cypress detects that a matching request has begun its request, it then
switches over to the 2nd waiting period. This duration is configured by the
[`responseTimeout`](/guides/references/configuration#Timeouts) option - which
has a default of `30000` ms.

This means Cypress will now wait up to 30 seconds for the external server to
respond to this request. If no response is detected, you will get an error
message that looks like this:

<DocsImage src="/img/api/wait/timeout-error-when-waiting-for-route-response.png" alt="Timeout error for request wait" ></DocsImage>

This gives you the best of both worlds - a fast error feedback loop when
requests never go out and a much longer duration for the actual external
response.

#### Using an Array of Aliases

When passing an array of aliases to `cy.wait()`, Cypress will wait for all
requests to complete within the given `requestTimeout` and `responseTimeout`.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>When passed a `time` argument `cy.wait()` can be chained off of `cy`
or off another command..</li><li>When passed an `alias` argument `cy.wait()`
requires being chained off of `cy`..</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.wait()` will only run assertions you have chained once, and will
not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.wait()` can time out waiting for the request to go
out.</li><li>`cy.wait()` can time out waiting for the response to
return.</li></List>

## Command Log

**_Wait for the PUT to users to resolve._**

```javascript
cy.intercept('PUT', /users/, {}).as('userPut')
cy.get('form').submit()
cy.wait('@userPut').its('request.url').should('include', 'users')
```

The `cy.wait()` will display in the Command Log as:

<!-- Code to reproduce screenshot:
it('assets/img/api/wait/command-log-when-waiting-for-aliased-route.png', () => {
    cy.intercept('PUT', /users/, {}).as('userPut')
    cy.then(() => {
        Cypress.$.ajax({ method: 'put', url: '/users/8983' })
    })
    cy.wait('@userPut').its('request.url').should('include', 'users')
})
-->

<DocsImage src="/img/api/wait/command-log-when-waiting-for-aliased-route.png" alt="Command Log wait" ></DocsImage>

When clicking on `wait` within the command log, the console outputs the
following:

<DocsImage src="/img/api/wait/wait-console-log-displays-all-the-data-of-the-route-request-and-response.png" alt="Console Log wait" ></DocsImage>

## History

| Version                                       | Changes                                             |
| --------------------------------------------- | --------------------------------------------------- |
| [3.1.3](/guides/references/changelog#3-1-3)   | Added `requestTimeout` and `responseTimeout` option |
| [< 0.3.3](/guides/references/changelog#0.3.3) | `cy.wait()` command added                           |

## See also

- [`.as()`](/api/commands/as)
- [`cy.intercept()`](/api/commands/intercept)
- [`.spread()`](/api/commands/spread)

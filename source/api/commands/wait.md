---
title: wait
---

Wait for a number of milliseconds or wait for an aliased resource to resolve before moving on to the next command.

# Syntax

```javascript
cy.wait(time)
cy.wait(alias)
cy.wait(aliases)
cy.wait(time, options)
cy.wait(alias, options)
cy.wait(aliases, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.wait(500)
cy.wait('@getProfile')
```

## Arguments

**{% fa fa-angle-right %} time** ***(Number)***

The amount of time to wait in milliseconds.

**{% fa fa-angle-right %} alias** ***(String)***

An aliased route as defined using the {% url `.as()` as %} command and referenced with the `@` character and the name of the alias.

{% note info 'Core Concept' %}
{% url 'You can read more about aliasing routes in our Core Concept Guide' network-requests#Waiting %}.
{% endnote %}

**{% fa fa-angle-right %} aliases** ***(Array)***

An array of aliased routes as defined using the {% url `.as()` as %} command and referenced with the `@` character and the name of the alias.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.wait()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `requestTimeout` configuration#Timeouts %}, {% url `responseTimeout` configuration#Timeouts %} | {% usage_options timeout cy.wait %}
`requestTimeout` | {% url `requestTimeout` configuration#Timeouts %} | Overrides the global `requestTimeout` for this request. Defaults to `timeout`.
`responseTimeout` | {% url `responseTimeout` configuration#Timeouts %} | Overrides the global `responseTimeout` for this request. Defaults to `timeout`.

## Yields {% helper_icon yields %}

### When given a `time` argument:

{% yields same_subject cy.wait %}

### When given an `alias` argument:

{% yields sets_subject cy.wait 'yields an object containing the HTTP request and response properties of the request' %}

# Examples

## Time

### Wait for an arbitrary period of milliseconds:

```js
cy.wait(2000) // wait for 2 seconds
```

{% note warning 'Anti-Pattern' %}
You almost **never** need to wait for an arbitrary period of time. There are always better ways to express this in Cypress.

Read about {% url 'best practices' best-practices#Unnecessary-Waiting %} here.
{% endnote %}

Additionally, it is often much easier to use {% url `cy.debug()` debug %} or {% url `cy.pause()` pause %} when debugging your test code.

## Alias

For a detailed explanation of aliasing, {% url 'read more about waiting on routes here' network-requests#Waiting %}.

### Wait for a specific request to respond

```javascript
// Wait for the route aliased as 'getAccount' to respond
// without changing or stubbing its response
cy.intercept('/accounts/*').as('getAccount')
cy.visit('/accounts/123')
cy.wait('@getAccount').then((interception) => {
  // we can now access the low level interception
  // that contains the request body,
  // response body, status, etc
})
```

### Wait automatically increments responses

Each time we use `cy.wait()` for an alias, Cypress waits for the next nth matching request.

```javascript
cy.intercept('/books', []).as('getBooks')
cy.get('#search').type('Grendel')

// wait for the first response to finish
cy.wait('@getBooks')

// the results should be empty because we
// responded with an empty array first
cy.get('#book-results').should('be.empty')

// now re-define the /books response
cy.intercept('/books', [{ name: 'Emperor of all maladies' }])

cy.get('#search').type('Emperor of')

// now when we wait for 'getBooks' again, Cypress will
// automatically know to wait for the 2nd response
cy.wait('@getBooks')

// we responded with 1 book item so now we should
// have one result
cy.get('#book-results').should('have.length', 1)
```

## Aliases

### You can pass an array of aliases that will be waited on before resolving.

When passing an array of aliases to `cy.wait()`, Cypress will wait for all requests to complete within the given `requestTimeout` and `responseTimeout`.

```javascript
cy.intercept('users/*').as('getUsers')
cy.intercept('activities/*').as('getActivities')
cy.intercept('comments/*').as('getComments')
cy.visit('/dashboard')

cy.wait(['@getUsers', '@getActivities', '@getComments']).then((interceptions) => {
  // interceptions will now be an array of matching requests
  // interceptions[0] <-- getUsers
  // interceptions[1] <-- getActivities
  // interceptions[2] <-- getComments
})
```

### Using {% url `.spread()` spread %} to spread the array into multiple arguments.

```javascript
cy.intercept('users/*').as('getUsers')
cy.intercept('activities/*').as('getActivities')
cy.intercept('comments/*').as('getComments')
cy.wait(['@getUsers', '@getActivities', '@getComments'])
  .spread((getUsers, getActivities, getComments) => {
    // each interception is now an individual argument
  })
```

# Notes

## Nesting

Cypress automatically waits for the network call to complete before proceeding to the next command.

```js
// Anti-pattern: placing Cypress commands inside .then callbacks
cy.wait('@alias')
  .then(() => {
    cy.get(...)
  })

// Recommended practice: write Cypress commands serially
cy.wait('@alias')
cy.get(...)

// Example: assert response property before proceeding
cy.wait('@alias').its('status').should('eq', 200)
cy.get(...)
```

Read {% url 'Guide: Introduction to Cypress' introduction-to-cypress#Commands-Run-Serially %}

## Timeouts

### `requestTimeout` and `responseTimeout`

When used with an alias, `cy.wait()` goes through two separate "waiting" periods.

The first period waits for a matching request to leave the browser. This duration is configured by the {% url `requestTimeout` configuration#Timeouts %} option - which has a default of `5000` ms.

This means that when you begin waiting for an aliased request, Cypress will wait up to 5 seconds for a matching request to be created. If no matching request is found, you will get an error message that looks like this:

{% imgTag /img/api/wait/error-for-no-matching-route-when-waiting-in-test.png "Error for no matching request" %}

Once Cypress detects that a matching request has begun its request, it then switches over to the 2nd waiting period. This duration is configured by the {% url `responseTimeout` configuration#Timeouts %} option - which has a default of `20000` ms.

This means Cypress will now wait up to 20 seconds for the external server to respond to this request. If no response is detected, you will get an error message that looks like this:

{% imgTag /img/api/wait/timeout-error-when-waiting-for-route-response.png "Timeout error for request wait" %}

This gives you the best of both worlds - a fast error feedback loop when requests never go out and a much longer duration for the actual external response.

### Using an Array of Aliases

When passing an array of aliases to `cy.wait()`, Cypress will wait for all requests to complete within the given `requestTimeout` and `responseTimeout`.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements wait cy.wait %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.wait %}

## Timeouts {% helper_icon timeout %}

{% timeouts wait cy.wait %}

# Command Log

***Wait for the PUT to users to resolve.***

```javascript
cy.intercept('PUT', /users/, {}).as('userPut')
cy.get('form').submit()
cy.wait('@userPut').its('interception.url').should('include', 'users')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/wait/command-log-when-waiting-for-aliased-route.png "Command Log wait" %}

When clicking on `wait` within the command log, the console outputs the following:

{% imgTag /img/api/wait/wait-console-log-displays-all-the-data-of-the-route-request-and-response.png "Console Log wait" %}

{% history %}
{% url "3.1.3" changelog#3-1-3 %} | Added `requestTimeout` and `responseTimout` option
{% url "< 0.3.3" changelog#0.3.3 %} | `cy.wait()` command added
{% endhistory %}

# See also

- {% url `.as()` as %}
- {% url `cy.intercept()` intercept %}
- {% url `cy.route()` route %}
- {% url `cy.server()` server %}
- {% url `.spread()` spread %}

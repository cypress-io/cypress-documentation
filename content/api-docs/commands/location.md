---
title: location
---

Get the global `window.location` object of the page that is currently active.

## Syntax

```javascript
cy.location()
cy.location(key)
cy.location(options)
cy.location(key, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.location() // Get location object
cy.location('host') // Get the host of the location object
cy.location('port') // Get the port of the location object
```

### Arguments

**<Icon name="angle-right"></Icon> key** **_(String)_**

A key on the location object. Returns this value instead of the full location
object.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.location()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.location()` to resolve before [timing out](#Timeouts)               |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.location()` yields the location object with the following properties:

- `hash`
- `host`
- `hostname`
- `href`
- `origin`
- `pathname`
- `port`
- `protocol`
- `search`
- `toString`

#### When given a `key` argument:

- `cy.location()` yields the value of the location property as a string

## Examples

### No Args

#### Make assertions about every location property

```javascript
cy.visit('http://localhost:8000/app/index.html?q=dan#/users/123/edit')

cy.location().should((loc) => {
  expect(loc.hash).to.eq('#/users/123/edit')
  expect(loc.host).to.eq('localhost:8000')
  expect(loc.hostname).to.eq('localhost')
  expect(loc.href).to.eq('http://localhost:8000/app/index.html?q=dan#/users/123/edit')
  expect(loc.origin).to.eq('http://localhost:8000')
  expect(loc.pathname).to.eq('/app/index.html')
  expect(loc.port).to.eq('8000')
  expect(loc.protocol).to.eq('http:')
  expect(loc.search).to.eq('?q=dan')
  expect(loc.toString()).to.eq('http://localhost:8000/app/index.html?q=brian#/users/123/edit')
})
```

#### Check location for query params and pathname

We can yield the location object within a [`.should()`](/api/commands/should)
command and work with it directly.

```javascript
cy.get('#search').type('niklas{enter}')
cy.location().should((loc) => {
  expect(loc.search).to.eq('?search=niklas')
  expect(loc.pathname).to.eq('/users')
})
```

### Key

#### Assert that a redirect works

Grab only the `pathname` and add an assertion.

```javascript
cy.visit('http://localhost:3000/admin')
cy.location('pathname').should('eq', '/login')
```

## Notes

### Native Location

#### No need to use `window.location`

Cypress automatically normalizes the `cy.location()` command and strips out
extraneous values and properties found in `window.location`. Also, the object
literal yielded by `cy.location()` is a basic object literal, not the special
`window.location` object.

When changing properties on the real `window.location` object, it forces the
browser to navigate away. In Cypress, the object yielded is a plain object, so
changing its properties will have no effect on navigation.

#### Console output of `window.location`

```javascript
cy.window().then((win) => {
  console.log(win.location)
})
```

<DocsImage src="/img/api/location/window-location-object-printed-in-console-log.png" alt="Console.log of window.location" />

#### Console output of `.location()`

```javascript
cy.location().then((loc) => {
  console.log(loc)
})
```

<DocsImage src="/img/api/location/special-cypress-location-object-logged-in-console-output.png" alt="Console Log of Cypress location command" />

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.location()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.location()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.location()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Assert on the location's href_**

```javascript
cy.location().should((loc) => {
  expect(loc.href).to.include('commands/querying')
})
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/location/make-assertion-about-location-url-in-tests.png" alt="Command Log of Cypress location command" />

When clicking on `location` within the command log, the console outputs the
following:

<DocsImage src="/img/api/location/location-object-in-console-log.png" alt="Console Log of Cypress location command" />

## See also

- [`cy.hash()`](/api/commands/hash)
- [`cy.url()`](/api/commands/url)

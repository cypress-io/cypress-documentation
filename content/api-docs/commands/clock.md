---
title: clock
---

`cy.clock()` overrides native global functions related to time allowing them to
be controlled synchronously via [`cy.tick()`](/api/commands/tick) or the yielded
`clock` object. This includes controlling:

- `setTimeout`
- `clearTimeout`
- `setInterval`
- `clearInterval`
- `Date` Objects

The clock starts at the unix epoch (timestamp of 0). This means that when you
instantiate `new Date` in your application, it will have a time of
`January 1st, 1970`.

## Syntax

```javascript
cy.clock()
cy.clock(now)
cy.clock(now, functionNames)
cy.clock(options)
cy.clock(now, options)
cy.clock(now, functionNames, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.clock()
```

### Arguments

**<Icon name="angle-right"></Icon> now** **_(number)_**

A timestamp specifying where the clock should start.

**<Icon name="angle-right"></Icon> functionNames** **_(Array)_**

Name of native functions that clock should override.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.clock()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.clock()` yields a `clock` object with the following methods:

- **`clock.tick(milliseconds)`**

  Move the clock the specified number of `milliseconds`. Any timers within the
  affected range of time will be called.

- **`clock.restore()`**

  Restore all overridden native functions. This is automatically called between
  tests, so should not generally be needed.

You can also access the `clock` object via `this.clock` in a
[`.then()`](/api/commands/then) callback.

## Examples

### No Args

#### Create a clock and use it to trigger a `setInterval`

```javascript
// your app code
let seconds = 0

setInterval(() => {
  $('#seconds-elapsed').text(++seconds + ' seconds')
}, 1000)
```

```javascript
cy.clock()
cy.visit('/index.html')
cy.tick(1000)
cy.get('#seconds-elapsed').should('have.text', '1 seconds')
cy.tick(1000)
cy.get('#seconds-elapsed').should('have.text', '2 seconds')
```

#### Access the clock object to synchronously move time

In most cases, it's easier to use [`cy.tick()`](/api/commands/tick) to move
time, but you can also use the `clock` object yielded by `cy.clock()`.

```javascript
cy.clock().then((clock) => {
  clock.tick(1000)
})
```

You can call `cy.clock()` again for this purpose later in a chain if necessary.

```javascript
cy.clock()
cy.get('input').type('Jane Lane')
cy.clock().then((clock) => {
  clock.tick(1000)
})
```

The clock object is also available via `this.clock` in any
[`.then()`](/api/commands/then) callback.

```javascript
cy.clock()
cy.get('form').then(($form) => {
  this.clock.tick(1000)
  // do something with $form ...
})
```

#### Access the clock object to restore native functions

In general, it should not be necessary to manually restore the native functions
that `cy.clock()` overrides since this is done automatically between tests. But
if you need to, the `clock` object yield has a `.restore()` method.

```javascript
cy.clock().then((clock) => {
  clock.restore()
})
```

Or via `this.clock`:

```javascript
cy.clock()
cy.get('.timer').then(($timer) => {
  this.clock.restore()
  // do something with $timer ...
})
```

### Now

#### Specify a now timestamp

```javascript
// your app code
$('#date').text(new Date().toJSON())
```

```javascript
const now = new Date(2017, 3, 14).getTime() // April 14, 2017 timestamp

cy.clock(now)
cy.visit('/index.html')
cy.get('#date').contains('2017-04-14')
```

### Function names

#### Specify which functions to override

This example below will only override `setTimeout` and `clearTimeout` and leave
the other time-related functions as they are.

```javascript
cy.clock(null, ['setTimeout', 'clearTimeout'])
```

Note that you must specify `Date` in order to override the current datetime. The
example below affects the current datetime without affecting scheduled timers.

```javascript
cy.clock(Date.UTC(2018, 10, 30), ['Date'])
```

#### `Using cy.clock()` with `cy.tick()`

<Alert type="info">

[Check out our example recipe testing spying, stubbing and time.](/examples/examples/recipes#Stubbing-and-spying)

</Alert>

### Restore clock

You can restore the clock and allow your application to resume normally without
manipulating native global functions related to time. This is automatically
called between tests.

```javascript
cy.clock()
cy.visit('http://localhost:3333')
cy.get('#search').type('Acme Company')
cy.tick(1000)
// more test code here

// restore the clock
cy.clock().then((clock) => {
  clock.restore()
})
// more test code here
```

You could also restore by using [.invoke()](/api/commands/invoke) to invoke the
`restore` function.

```js
cy.clock().invoke('restore')
```

## Notes

### iframes

#### iframes not supported

Note that `cy.clock()` only applies to the `top` window on a web page. It will
not override the time functions of any `iframe` embedded on the page.

### Behavior

#### clock behavior before `cy.visit()`

If you call `cy.clock()` before visiting a page with
[`cy.visit()`](/api/commands/visit), the page's native global functions will be
overridden on window load, before any of your app code runs, so even if
`setTimeout`, for example, is called on page load, it can still be controlled
via [`cy.tick()`](/api/commands/tick). This also applies if, during the course
of a test, the page under test is reloaded or changed.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.clock()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.clock()` is a utility command.</li><li>`cy.clock()` will not run
assertions. Assertions will pass through as if this command did not
exist.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.clock()` cannot time out.</li></List>

## Command Log

**_Create a clock and tick it 1 second_**

```javascript
cy.clock()
cy.tick(1000)
```

The command above will display in the Command Log as:

<DocsImage src="/img/api/clock/clock-displays-in-command-log.png" alt="Command Log clock" />

When clicking on the `clock` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/clock/clock-displays-methods-replaced-in-console.png" alt="console.log clock command" />

## See also

- [`cy.spy()`](/api/commands/spy)
- [`cy.stub()`](/api/commands/stub)
- [`cy.tick()`](/api/commands/tick)
- [Guide: Stubs, Spies and Clocks](/guides/guides/stubs-spies-and-clocks)
- [Recipe: Stubbing, Spying](/examples/examples/recipes#Stubbing-and-spying)

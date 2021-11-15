---
title: tick
---

Move time after overriding a native time function with
[`cy.clock()`](/api/commands/clock).

<Alert type="warning">

[`cy.clock()`](/api/commands/clock) must be called before `cy.tick()` in order
to override native time functions first.

</Alert>

## Syntax

```javascript
cy.tick(milliseconds, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.tick(500)
```

### Arguments

**<Icon name="angle-right"></Icon> milliseconds** **_(Number)_**

The number of `milliseconds` to move the clock. Any timers within the affected
range of time will be called.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.tick()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.tick()` yields a `clock` object with the following methods:

- **`clock.tick(milliseconds)`**

  Move the clock a number of milliseconds. Any timers within the affected range
  of time will be called.

- **`clock.restore()`**

  Restore all overridden native functions. This is automatically called between
  tests, so should not generally be needed.

You can also access the `clock` object via `this.clock` in a
[`.then()`](/api/commands/then) callback.

## Examples

### Milliseconds

#### Create a clock and move time to trigger a `setTimeout`

```javascript
// app code loaded by index.html
window.addIntro = () => {
  setTimeout(() => {
    document.getElementById('#header').textContent = 'Hello, World'
  }, 500)
}
```

```javascript
cy.clock()
cy.visit('/index.html')
cy.window().invoke('addIntro')
cy.tick(500)
cy.get('#header').should('have.text', 'Hello, World')
```

#### Using `cy.clock()` with `cy.tick()`

<Alert type="info">

[Check out our example recipe testing spying, stubbing and time](/examples/examples/recipes#Stubbing-and-spying)

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

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.tick()` requires being chained off of `cy`.</li><li>`cy.tick()`
requires that `cy.clock()` be called before it.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.tick()` is a utility command.</li><li>`cy.tick()` will not run
assertions. Assertions will pass through as if this command did not
exist.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.tick()` cannot time out.</li></List>

## Command Log

**_Create a clock and tick it 1 second_**

```javascript
cy.clock()
cy.tick(1000)
```

The command above will display in the Command Log as:

<DocsImage src="/img/api/tick/tick-machine-clock-1-second-in-time.png" alt="Console Log tick" ></DocsImage>

When clicking on the `tick` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/tick/console-shows-same-clock-object-as-clock-command.png" alt="Console Log tick" ></DocsImage>

## History

| Version                                       | Changes                           |
| --------------------------------------------- | --------------------------------- |
| [7.0.0](/guides/references/changelog#7-0-0)   | `log` option added to `cy.tick()` |
| [0.18.8](/guides/references/changelog#0-18-8) | `cy.tick()` command added         |

## See also

- [`cy.clock()`](/api/commands/clock)
- [`cy.spy()`](/api/commands/spy)
- [`cy.stub()`](/api/commands/stub)
- [Guide: Stubs, Spies and Clocks](/guides/guides/stubs-spies-and-clocks)
- [Recipe: Stubbing, Spying](/examples/examples/recipes#Stubbing-and-spying)

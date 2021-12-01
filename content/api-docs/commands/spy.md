---
title: spy
---

Wrap a method in a spy in order to record calls to and arguments of the
function.

<Alert type="info">

**Note:** `.spy()` assumes you are already familiar with our guide:
[Stubs, Spies, and Clocks](/guides/guides/stubs-spies-and-clocks)

</Alert>

## Syntax

```javascript
cy.spy(object, method)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.spy(user, 'addFriend')
```

### Arguments

**<Icon name="angle-right"/> object** **_(Object)_**

The `object` that has the `method` to be wrapped.

**<Icon name="angle-right"/> method** **_(String)_**

The name of the `method` on the `object` to be wrapped.

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

Unlike most Cypress commands, `cy.spy()` is _synchronous_ and returns a value
(the spy) instead of a Promise-like chain-able object.

`cy.spy()` returns a [Sinon.js spy](https://sinonjs.org/releases/v6.1.5/spies/).
All methods found on Sinon.JS spies are supported.

## Examples

### Method

#### Wrap a method with a spy

```javascript
// assume App.start calls util.addListeners
cy.spy(util, 'addListeners')
App.start()
expect(util.addListeners).to.be.called
```

#### Disable logging to Command Log

You can chain a `.log(bool)` method to disable `cy.stub()` calls from being
shown in the Command Log. This may be useful when your stubs are called an
excessive number of times.

```javascript
const obj = {
  foo() {},
}
const stub = cy.stub(obj, 'foo').log(false)
```

#### More `cy.spy()` examples

<Alert type="info">

[Check out our example recipe testing spying, stubbing and time](/examples/examples/recipes#Stubbing-and-spying)

</Alert>

### Aliases

Adding an alias using [`.as()`](/api/commands/as) to spies makes them easier to
identify in error messages and Cypress' command log.

```javascript
const obj = {
  foo() {},
}
const spy = cy.spy(obj, 'foo').as('anyArgs')
const withFoo = spy.withArgs('foo').as('withFoo')

obj.foo()
expect(spy).to.be.called
expect(withFoo).to.be.called // purposefully failing assertion
```

You will see the following in the command log:

<DocsImage src="/img/api/spy/using-spy-with-alias.png" alt="spies with aliases" />

## Notes

### Restores

#### Automatic reset/restore between tests

`cy.spy()` creates spies in a
[sandbox](https://sinonjs.org/releases/v6.1.5/sandbox/), so all spies created
are automatically reset/restored between tests without you having to explicitly
reset/restore them.

### Differences

#### Difference between cy.spy() and cy.stub()

The main difference between `cy.spy()` and [`cy.stub()`](/api/commands/stub) is
that `cy.spy()` does not replace the method, it only wraps it. So, while
invocations are recorded, the original method is still called. This can be very
useful when testing methods on native browser objects. You can verify a method
is being called by your test and still have the original method action invoked.

### Assertions

#### Assertion Support

Cypress has also built-in
[sinon-chai](/guides/references/bundled-tools#Sinon-Chai) support, so any
[assertions supported by `sinon-chai`](/guides/references/assertions#Sinon-Chai)
can be used without any configuration.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.spy()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.spy()` cannot have any assertions chained.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.spy()` cannot time out.</li></List>

## Command Log

**_Create a spy, alias it, and call it_**

```javascript
const obj = {
  foo() {},
}
const spy = cy.spy(obj, 'foo').as('foo')

obj.foo('foo', 'bar')
expect(spy).to.be.called
```

The command above will display in the Command Log as:

<DocsImage src="/img/api/spy/spying-shows-any-aliases-and-also-any-assertions-made.png" alt="Command Log spy" />

When clicking on the `spy-1` event within the command log, the console outputs
the following:

<DocsImage src="/img/api/spy/console-shows-spy-arguments-calls-and-the-object-being-spied.png" alt="Console Log spy" />

## History

| Version                                       | Changes                   |
| --------------------------------------------- | ------------------------- |
| [0.20.0](/guides/references/changelog#0-20.0) | Added `.log(bool)` method |
| [0.18.8](/guides/references/changelog#0-18-8) | `cy.spy()` command added  |

## See also

- [`.as()`](/api/commands/as)
- [`cy.clock()`](/api/commands/clock)
- [Guide: Stubs, Spies and Clocks](/guides/guides/stubs-spies-and-clocks)
- [Recipe: Stubbing, Spying](/examples/examples/recipes#Stubbing-and-spying)
- [`cy.stub()`](/api/commands/stub)

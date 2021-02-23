---
title: stub
---

Replace a function, record its usage and control its behavior.

<Alert type="info">

**Note:** `.stub()` assumes you are already familiar with our guide: [Stubs, Spies, and Clocks](/guides/guides/stubs-spies-and-clocks)

</Alert>

## Syntax

```javascript
cy.stub();
cy.stub(object, method);
cy.stub(object, method, replacerFn);
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.stub(user, "addFriend");
```

### Arguments

**<Icon name="angle-right"></Icon> object** **_(Object)_**

The `object` that has the `method` to be replaced.

**<Icon name="angle-right"></Icon> method** **_(String)_**

The name of the `method` on the `object` to be wrapped.

**<Icon name="angle-right"></Icon> replacerFn** **_(Function)_**

The function used to replace the `method` on the `object`.

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

Unlike most Cypress commands, `cy.stub()` is _synchronous_ and returns a value (the stub) instead of a Promise-like chain-able object.

`cy.stub()` returns a [Sinon.js stub](http://sinonjs.org). All methods found on [Sinon.js](http://sinonjs.org) spies and stubs are supported.

## Examples

### Method

#### Create a stub and manually replace a function

```javascript
// assume App.start calls util.addListeners
util.addListeners = cy.stub();

App.start();
expect(util.addListeners).to.be.called;
```

#### Replace a method with a stub

```javascript
// assume App.start calls util.addListeners
cy.stub(util, "addListeners");

App.start();
expect(util.addListeners).to.be.called;
```

#### Replace a method with a function

```javascript
// assume App.start calls util.addListeners
let listenersAdded = false;

cy.stub(util, "addListeners", () => {
  listenersAdded = true;
});

App.start();
expect(listenersAdded).to.be.true;
```

#### Specify the return value of a stubbed method

```javascript
// assume App.start calls util.addListeners, which returns a function
// that removes the listeners
const removeStub = cy.stub();

cy.stub(util, "addListeners").returns(removeStub);

App.start();
App.stop();
expect(removeStub).to.be.called;
```

#### Replace built-in window methods like prompt

```javascript
// assume App.start uses prompt to set the value of an element with class "name"
cy.visit("http://localhost:3000", {
  onBeforeLoad(win) {
    cy.stub(win, "prompt").returns("my custom message");
  },
});

App.start();

cy.window().its("prompt").should("be.called");
cy.get(".name").should("have.value", "my custom message");
```

#### Disable logging to Command Log

You can chain a `.log(bool)` method to disable `cy.stub()` calls from being shown in the Command Log. This may be useful when your stubs are called an excessive number of times.

```javascript
const obj = {
  foo() {},
};
const stub = cy.stub(obj, "foo").log(false);
```

#### More `cy.stub()` examples

<Alert type="info">

[Check out our example recipe testing spying, stubbing and time](/examples/examples/recipes#Stubbing-and-spying)

</Alert>

### Aliases

Adding an alias using [`.as()`](/api/commands/as) to stubs makes them easier to identify in error messages and Cypress's command log.

```javascript
const obj = {
  foo() {},
};
const stub = cy.stub(obj, "foo").as("anyArgs");
const withFoo = stub.withArgs("foo").as("withFoo");

obj.foo();
expect(stub).to.be.called;
expect(withFoo).to.be.called; // purposefully failing assertion
```

You will see the following in the command log:

<DocsImage src="/img/api/stub/stubs-with-aliases-and-error-in-command-log.png" alt="stubs with aliases" ></DocsImage>

## Notes

### Restores

#### Automatic reset/restore between tests

`cy.stub()` creates stubs in a [sandbox](http://sinonjs.org/releases/v2.0.0/sandbox/), so all stubs created are automatically reset/restored between tests without you having to explicitly reset/restore them.

### Differences

#### Difference between cy.spy() and cy.stub()

The main difference between `cy.spy()` and [`cy.stub()`](/api/commands/stub) is that `cy.spy()` does not replace the method, it only wraps it. So, while invocations are recorded, the original method is still called. This can be very useful when testing methods on native browser objects. You can verify a method is being called by your test and still have the original method action invoked.

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.stub()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`cy.stub` cannot have any assertions chained.</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`cy.stub()` cannot time out.</li></List>

## Command Log

**_Create a stub, alias it, and call it_**

```javascript
const obj = {
  foo() {},
};
const stub = cy.stub(obj, "foo").as("foo");

obj.foo("foo", "bar");
expect(stub).to.be.called;
```

The command above will display in the Command Log as:

<DocsImage src="/img/api/stub/stub-in-command-log.png" alt="Command Log stub" ></DocsImage>

When clicking on the `(stub-1)` event within the command log, the console outputs the following:

<DocsImage src="/img/api/stub/inspect-the-stubbed-object-and-any-calls-or-arguments-made.png" alt="Console Log stub" ></DocsImage>

## History

| Version                                       | Changes                   |
| --------------------------------------------- | ------------------------- |
| [0.20.0](/guides/references/changelog#0-20.0) | Added `.log(bool)` method |
| [0.18.8](/guides/references/changelog#0-18-8) | `cy.stub()` command added |

## See also

- [`.as()`](/api/commands/as)
- [`cy.clock()`](/api/commands/clock)
- [`cy.spy()`](/api/commands/spy)
- [Guide: Stubs, Spies and Clocks](/guides/guides/stubs-spies-and-clocks)
- [Recipe: Stubbing, Spying](/examples/examples/recipes#Stubbing-and-spying)
- [Recipe: Unit Test - Stubbing Dependencies](/examples/examples/recipes)
- [Stub navigator API in end-to-end tests](https://glebbahmutov.com/blog/stub-navigator-api/)

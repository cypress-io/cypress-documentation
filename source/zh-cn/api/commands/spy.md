---
title: spy
---

Wrap a method in a spy in order to record calls to and arguments of the function.

{% note info %}
**Note:** `.spy()` assumes you are already familiar with our guide: {% url 'Stubs, Spies, and Clocks' stubs-spies-and-clocks %}
{% endnote %}

# Syntax

```javascript
cy.spy(object, method)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.spy(user, 'addFriend')
```

## Arguments

**{% fa fa-angle-right %} object** ***(Object)***

The `object` that has the `method` to be wrapped.

**{% fa fa-angle-right %} method** ***(String)***

The name of the `method` on the `object` to be wrapped.

## Yields {% helper_icon yields %}

Unlike most Cypress commands, `cy.spy()` is *synchronous* and returns a value (the spy) instead of a Promise-like chain-able object.

`cy.spy()` returns a {% url "Sinon.js spy" https://sinonjs.org/releases/v6.1.5/spies/ %}. All methods found on Sinon.JS spies are supported.

# Examples

## Method

### Wrap a method with a spy

```javascript
// assume App.start calls util.addListeners
cy.spy(util, 'addListeners')
App.start()
expect(util.addListeners).to.be.called
```

### Disable logging to Command Log

You can chain a `.log(bool)` method to disable `cy.stub()` calls from being shown in the Command Log. This may be useful when your stubs are called an excessive number of times.

```javascript
const obj = {
  foo () {}
}
const stub = cy.stub(obj, 'foo').log(false)
```

### More `cy.spy()` examples

{% note info %}
{% url "Check out our example recipe testing spying, stubbing and time" recipes#Stubbing-and-spying %}
{% endnote %}

## Aliases

Adding an alias using {% url `.as()` as %} to spies makes them easier to identify in error messages and Cypress' command log.

```javascript
const obj = {
  foo () {}
}
const spy = cy.spy(obj, 'foo').as('anyArgs')
const withFoo = spy.withArgs('foo').as('withFoo')

obj.foo()
expect(spy).to.be.called
expect(withFoo).to.be.called // purposefully failing assertion
```

You will see the following in the command log:

{% imgTag /img/api/spy/using-spy-with-alias.png "spies with aliases" %}

# Notes

## Restores

### Automatic reset/restore between tests

`cy.spy()` creates spies in a {% url "sandbox" https://sinonjs.org/releases/v6.1.5/sandbox/ %}, so all spies created are automatically reset/restored between tests without you having to explicitly reset/restore them.

## Differences

### Difference between cy.spy() and cy.stub()

The main difference between `cy.spy()` and {% url `cy.stub()` stub %} is that `cy.spy()` does not replace the method, it only wraps it. So, while invocations are recorded, the original method is still called. This can be very useful when testing methods on native browser objects. You can verify a method is being called by your test and still have the original method action invoked.

## Assertions

### Assertion Support

Cypress has also built-in {% url "sinon-chai" bundled-tools#Sinon-Chai %} support, so any {% url "assertions supported by `sinon-chai`" assertions#Sinon-Chai %} can be used without any configuration.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.spy %}

## Assertions {% helper_icon assertions %}

{% assertions none cy.spy %}

## Timeouts {% helper_icon timeout %}

{% timeouts none cy.spy %}

# Command Log

***Create a spy, alias it, and call it***

```javascript
const obj = {
  foo () {}
}
const spy = cy.spy(obj, 'foo').as('foo')

obj.foo('foo', 'bar')
expect(spy).to.be.called
```

The command above will display in the Command Log as:

{% imgTag /img/api/spy/spying-shows-any-aliases-and-also-any-assertions-made.png "Command Log spy" %}

When clicking on the `spy-1` event within the command log, the console outputs the following:

{% imgTag /img/api/spy/console-shows-spy-arguments-calls-and-the-object-being-spied.png "Console Log spy" %}

{% history %}
{% url "0.20.0" changelog#0-20.0 %} | Added `.log(bool)` method
{% url "0.18.8" changelog#0-18-8 %} | `cy.spy()` command added
{% endhistory %}

# See also

- {% url `.as()` as %}
- {% url `cy.clock()` clock %}
- {% url 'Guide: Stubs, Spies and Clocks' stubs-spies-and-clocks %}
- {% url "Recipe: Stubbing, Spying" recipes#Stubbing-and-spying %}
- {% url `cy.stub()` stub %}

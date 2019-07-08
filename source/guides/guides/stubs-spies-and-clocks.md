---
title: Stubs, Spies, and Clocks
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- Which libraries Cypress includes to provide typical testing functionality
- How to use stubs for asserting that code was called but preventing it from executing
- How to use spies for asserting that code was called without interfering with its execution
- How to control time for deterministically testing code that is time-dependent
- How Cypress improves and extends the included libraries
{% endnote %}

# Capabilities

Cypress comes built in with the ability to stub and spy with {% url `cy.stub()` stub %}, {% url `cy.spy()` spy %} or modify your application's time with {% url `cy.clock()` clock %} - which lets you manipulate `Date`, `setTimeout`, `setInterval`, amongst others.

These commands are useful when writing both **unit tests** and **integration tests**.

# Libraries and Tools

Cypress automatically bundles and wraps these libraries:

| Name | What it does |
| --- | ---- |
| {% url "`sinon`" http://sinonjs.org %} | provides the {% url `cy.stub()` stub %} and {% url `cy.spy()` spy %} APIs |
| {% url "`lolex`" https://github.com/sinonjs/lolex %} | provides the {% url `cy.clock()` clock %} and {% url `cy.tick()` tick %} APIs |
| {% url "`sinon-chai`" https://github.com/domenic/sinon-chai %} | adds `chai` assertions for stubs and spies |

You can refer to each of these libraries' documentation for more examples and explanations.

# Common Scenarios

{% note info Example test! %}
{% url 'Check out our example recipe testing spying, stubbing and time' recipes#Stubbing-and-spying %}
{% endnote %}

## Stubs

A stub is a way to modify a function and delegate control overs its behavior to you (the programmer).

A stub is most commonly used in a unit test but is still useful during some integration/e2e tests.

```javascript
// create a standalone stub (generally for use in unit test)
cy.stub()

// replace obj.method() with a stubbed function
cy.stub(obj, 'method')

// force obj.method() to return "foo"
cy.stub(obj, 'method').returns('foo')

// force obj.method() when called with "bar" argument to return "foo"
cy.stub(obj, 'method').withArgs('bar').returns('foo')

// force obj.method() to return a promise which resolves to "foo"
cy.stub(obj, 'method').resolves('foo')

// force obj.method() to return a promise rejected with an error
cy.stub(obj, 'method').rejects(new Error('foo'))
```

You generally stub a function when it has side effects you are trying to control.

***Common Scenarios:***

- You have a function that accepts a callback, and want to invoke the callback.
- Your function returns a `Promise`, and you want to automatically resolve or reject it.
- You have a function that wraps `window.location` and don't want your application to be navigated.
- You're trying to test your application's "failure path" by forcing things to fail.
- You're trying to test your application's "happy path" by forcing things to pass.
- You want to "trick" your application into thinking it's logged in or logged out.
- You're using `oauth` and want to stub login methods.

{% note info cy.stub() %}
{% url 'Read more about how to use `cy.stub()`' stub %}
{% endnote %}

## Spies

A spy gives you the ability to "spy" on a function, by letting you capture and then assert that the function was called with the right arguments, or that the function was called a certain number of times, or even what the return value was or what context the function was called with.

A spy does **not** modify the behavior of the function - it is left perfectly intact. A spy is most useful when you are testing the contract between multiple functions and you don't care about the side effects the real function may create (if any).

```javascript
cy.spy(obj, 'method')
```

{% note info cy.spy() %}
{% url 'Read more about how to use `cy.spy()`' spy %}
{% endnote %}

## Clock

There are situations when it is useful to control your application's `date` and `time` in order to override its behavior or avoid slow tests.

{% url `cy.clock()` clock %} gives you the ability to control:

- `Date`
- `setTimeout`
- `setInterval`

***Common Scenarios***

- You're polling something in your application with `setInterval` and want to control that.
- You have **throttled** or **debounced** functions which you want to control.

Once you've enabled {% url `cy.clock()` clock %} you can control time by **ticking** it ahead by milliseconds.

```javascript
cy.clock()
cy.visit('http://localhost:3333')
cy.get('#search').type('foobarbaz')
cy.tick(1000)
```

{% url `cy.clock()` clock %} is special in that it can be called **prior** to visiting your application, and we will automatically bind it to the application on the next {% url `cy.visit()` visit %}. We bind **before** any timers from your application can be invoked. This works identically to {% url `cy.server()` server %} + {% url `cy.route()` route %}.

## Assertions

Once you have a `stub` or a `spy` in hand, you can then create assertions about them.

```javascript
const user = {
  getName: (arg) => {
    return arg
  },

  updateEmail: (arg) => {
    return arg
  },

  fail: () => {
    throw new Error('fail whale')
  }
}

// force user.getName() to return "Jane"
cy.stub(user, 'getName').returns('Jane Lane')

// spy on updateEmail but do not change its behavior
cy.spy(user, 'updateEmail')

// spy on fail but do not change its behavior
cy.spy(user, 'fail')

// invoke getName
const name  = user.getName(123)

// invoke updateEmail
const email = user.updateEmail('jane@devs.com')

try {
  // invoke fail
  user.fail()
} catch (e) {

}

expect(name).to.eq('Jane Lane')                            // true
expect(user.getName).to.be.calledOnce                      // true
expect(user.getName).not.to.be.calledTwice                 // true
expect(user.getName).to.be.calledWith(123)
expect(user.getName).to.be.calledWithExactly(123)          // true
expect(user.getName).to.be.calledOn(user)                  // true

expect(email).to.eq('jane@devs.com')                       // true
expect(user.updateEmail).to.be.calledWith('jane@devs.com') // true
expect(user.updateEmail).to.have.returned('jane@devs.com') // true

expect(user.fail).to.have.thrown('Error')                  // true
```

# Integration and Extensions

Beyond just integrating these tools together we have also extended and improved collaboration between these tools.

***Some examples:***

- We replaced Sinon's argument stringifier for a much less noisy, more performant, custom version.
- We improved the `sinon-chai` assertion output by changing what is displayed during a passing vs. failing test.
- We added aliasing support to `stub` and `spy` APIs.
- We automatically restore and tear down `stub`, `spy`, and `clock` between tests.

We also integrated all of these APIs directly into the Command Log, so you can visually see what's happening in your application.

***We visually indicate when:***

- A `stub` is called
- A `spy` is called
- A `clock` is ticked

When you use aliasing with the {% url `.as()` as %} command, we also correlate those aliases with the calls. This works identically to aliasing a {% url `cy.route()` route %}.

When stubs are created by calling the method `.withArgs(...)` we also visually link these together.

When you click on a stub or spy, we also output **remarkably** helpful debugging information.

***For instance we automatically display:***

- The call count (and total number of calls)
- The arguments, without transforming them (they are the real arguments)
- The return value of the function
- The context the function was invoked with

# See also

- ["Stub navigator API in end-to-end tests"](https://glebbahmutov.com/blog/stub-navigator-api/)
- ["Shrink the Untestable Code With App Actions And Effects"](https://www.cypress.io/blog/2019/02/28/shrink-the-untestable-code-with-app-actions-and-effects/)

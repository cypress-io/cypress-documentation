---
title: Best Practices
comments: false
layout: toc-top
---

<!-- ## Using your UI to Build Up State

- use cy.request
- seed the database
- use stubbing
- modify cookies
- modify local storage
- mock / stub methods

Mostly WIP.

Began {% url 'discussing here' testing-your-app#Testing-Strategies %}. -->

<!-- ## Acting Too Much like a User

WIP.

## Testing like you did with Selenium

WIP.

## Testing Across Domains

WIP.

## Creating too many Abstractions

WIP.

## Logging Out after each Test

WIP.

## Running code in `after` or `afterEach` hooks

WIP.

## Overusing `.then()`

WIP.

## Avoid 3rd Party Services

WIP.

## Adding Promises Unnecessarily

WIP.

## Mutating State Between Tests

WIP.

## Running too many Tests at Once

WIP.

## Putting up with Slow Tests

WIP.

## Writing E2E Tests only for Production

WIP.

## Running all the Tests in GUI Mode

WIP.

## Splitting up the "One Giant Test"

WIP. -->

## Having tests rely on the state of previous tests

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Coupling multiple tests together.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Tests should always be able to be run independently from one another **and still pass**.
{% endnote %}

You only need to do one thing to know whether you've coupled your tests incorrectly,  or if one test is relying on the state of a previous one.

Simply put an `.only` on the test and refresh the browser.

If this test can run **by itself** and pass - congratulations you have written a good test.

If this is not the case, then you should refactor and change your approach.

How to solve this:

- Move repeated code in previous tests to `before` or `beforeEach` hooks.
- Combine multiple tests into one larger test.

Let's imagine the following test that is filling out the form.


```javascript
// an example of what NOT TO DO
describe('my form', function () {
  it('visits the form', function () {
    cy.visit('/users/new')
  })

  it('requires first name', function () {
    cy.get('#first').type('Johnny')
  })

  it('requires last name', function () {
    cy.get('#last').type('Appleseed')
  })

  it('can submit a valid form', function () {
    cy.get('form').submit()
  })
})
```

What's wrong with the above tests? They are all coupled together!

If you were to put an `.only` on any of the last three tests, they would fail. Each test requires the previous to run in a specific order in order to pass.

Here's 2 ways we can fix this:

***1. Combine into one test***

```javascript
// a bit better
describe('my form', function () {
  it('can submit a valid form', function () {
    cy.visit('/users/new')

    cy.log('filling out first name') // if you really need this
    cy.get('#first').type('Johnny')

    cy.log('filling out last name') // if you really need this
    cy.get('#last').type('Appleseed')

    cy.log('submitting form') // if you really need this
    cy.get('form').submit()
  })
})
```

Now we can put an `.only` on this test and it will run successfully irrespective of any other test. The ideal Cypress workflow is writing and iterating on a single test at a time.

***2. Run shared code before each test***

```javascript
describe('my form', function () {
  beforeEach(function () {
    cy.visit('/users/new')
    cy.get('#first').type('Johnny')
    cy.get('#last').type('Appleseed')
  })

  it('displays form validation', function () {
    cy.get('#first').clear() // clear out first name
    cy.get('form').submit()
    cy.get('#errors').should('contain', 'First name is required')
  })

  it('can submit a valid form', function () {
    cy.get('form').submit()
  })
})
```

This above example is ideal because now we are resetting the state between each test and ensuring nothing in previous tests leaks into subsequent ones.

We're also paving the way to make it easy to write multiple tests against the "default" state of the form. That way each test stays lean but each can be run independently and pass.

## Creating "tiny" tests with a single assertion

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Acting like you're writing unit tests.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Add multiple assertions and don't worry about it
{% endnote %}

We've seen many users writing this kind of code:

```javascript
describe('my form', function () {
  before(function () {
    cy.visit('/users/new')
    cy.get('#first').type('johnny')
  })

  it('has validation attr', function () {
    cy.get('#first').should('have.attr', 'data-validation', 'required')
  })

  it('has active class', function () {
    cy.get('#first').should('have.class', 'active')
  })

  it('has formatted first name', function () {
    cy.get('#first').should('have.value', 'Johnny') // capitalized first letter
  })
})
```

While technically this runs fine - this is really excessive, and not performant.

Why you did this pattern in unit tests:

- When assertions failed you relied on the test's title to know what failed
- You were told that adding multiple assertions was bad and accepted this as truth
- There was no performance penalty splitting up multiple tests because they run really fast

Why you shouldn't do this in Cypress:

- Writing integration tests is not the same as unit tests
- You will always know (and can visually see) which assertion failed in a large test
- Cypress runs a series of async lifecycle events that reset state between tests
- Resetting tests is much slower than simply adding more assertions

It is common for tests in Cypress to issue 30+ commands. Because nearly every command has a default assertion (and can therefore fail), even by limiting your assertions you're not saving yourself anything because **any single command could implicitly fail**.

How you should rewrite those tests:

```javascript
describe('my form', function () {
  before(function () {
    cy.visit('/users/new')
  })

  it('validates and formats first name', function () {
    cy.get('#first')
      .type('johnny')
      .should('have.attr', 'data-validation', 'required')
      .and('have.class', 'active')
      .and('have.value', 'Johnny')
  })
})
```

## Unnecessary Waiting

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Waiting for arbitrary time periods using {% url `cy.wait(Number)` wait#Time %}.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Use route aliases or assertions to guard Cypress from proceeding until an explicit condition is met.
{% endnote %}

In Cypress, you almost never need to use `cy.wait()` for an arbitrary amount of time. If you are finding yourself doing this, there is likely a much better, simpler way.

Let's imagine the following examples:

***Unnecessary wait for `cy.request()`***

Waiting here is unnecessary since the {% url `cy.request()` request %} command will not resolve until it receives a response from your server. Adding the wait here only adds 5 seconds after the {% url `cy.request()` request %} has already resolved.

```javascript
cy.request("http://localhost:8080/db/seed")
cy.wait(5000)     // <--- this is unnecessary
```

***Unnecessary wait for `cy.visit()`***

Waiting for this is unnecessary because the {% url '`cy.visit()`' visit %} resolves once the page fires its `load` event. By that time all of your assets have been loaded including javascript, stylesheets, and html.

```javascript
cy.visit("http://localhost/8080")
cy.wait(5000)     // <--- this is unnecessary
```

***Unnecessary wait for `cy.get()`***

Waiting for the {% url `cy.get()` get %} below is unnecessary because {% url `cy.get()` get %} automatically retries until the table's `tr` has a length of 2.

Whenever commands have an assertion they will not resolve until their associated assertions pass. This enables you to simply describe the state of your application without having to worry about when it gets there.

```javascript
cy.server()
cy.route("GET", /users/, [{"name": "Maggy"}, {"name": "Joan"}])
cy.get("#fetch").click()
cy.wait(4000)     // <--- this is unnecessary
cy.get("table tr").should("have.length", 2)
```

Alternatively a better solution to this problem is by waiting explicitly for an aliased route.

```javascript
cy.server()
cy.route("GET", /users/, [{"name": "Maggy"}, {"name": "Joan"}]).as("getUsers")
cy.get("#fetch").click()
cy.wait("@getUsers")     // <--- wait explicitly for this route to finish
cy.get("table tr").should("have.length", 2)
```

## Web Servers

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Trying to a start a webserver from within Cypress scripts with {% url `cy.exec()` exec %}.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Start a webserver prior to running Cypress in GUI mode or headless mode.
{% endnote %}

We do NOT recommend trying to start your backend web server from within Cypress.

`cy.exec()` can only run commands which eventually exit.

Trying to start a web server from `cy.exec()` causes all kinds of problems because:

- You have to background the process
- You lose access to it via terminal
- You don't have access to its `stdout` or logs
- Every time your tests run, you'd have to work out the complexity around starting an already running web server.
- You would likely encounter constant port conflicts

**Why can't I shut down the process in an `after` hook?**

Because there is no guarantee that code running in an `after` will always run.

While working in the Cypress GUI you can always restart / refresh while in the middle of a test. When that happens, code in an `after` won't execute.

**What should I do then?**

Simple. Start your web server before running Cypress. That's it!

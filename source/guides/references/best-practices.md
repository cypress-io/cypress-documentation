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

## Running all the Tests in Test Runner

WIP.

## Splitting up the "One Giant Test"

WIP. -->

## Assigning Return Values

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Trying to assign the return value of Commands with `const`, `let`, or `var`.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Use {% url 'closures to access and store' variables-and-aliases %} what Commands yield you.
{% endnote %}

Many first time users look at Cypress code and think it runs synchronously.

We see new users commonly write code that looks like this:

```js
// DONT DO THIS. IT DOES NOT WORK
// THE WAY YOU THINK IT DOES.

const button = cy.get('button')

const form = cy.get('form')

// nope, fails
button.click()
```

{% note info 'Did you know?' %}
You rarely have to ever use `const`, `let`, or `var` in Cypress. If you're using them, it's usually a sign you're doing it wrong.
{% endnote %}

If you are new to Cypress and wanting to better understand how Commands work - {% url 'please read our Introduction to Cypress guide' introduction-to-cypress#Chains-of-Commands %}.

If you're familiar with Cypress commands already, but find yourself using `const`, `let`, or `var` then you're typically trying to do one of two things:

- You're trying to **store and compare** values such as **text**, **classes**, **attributes**.
- You're trying to share **values** between tests and hooks like `before` and `beforeEach`.

For working with either of these patterns, please read our {% url 'Variables and Aliases guide' variables-and-aliases %}.

## Visiting external sites

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Trying to visit or interact with sites or servers you do not control.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Only test what you control. Try to avoid requiring a 3rd party server. When necessary, always use {% url `cy.request()` request %} to talk to 3rd party servers via their APIs.
{% endnote %}

One of the first things many of our users attempt to do is involve 3rd party servers in their tests.

You may want to access 3rd party servers in several situations:

1. Testing log in when your app uses another provider via OAuth.
2. Verifying your server updates a 3rd party server.
3. Checking your email to see if your server sent a "forgot password" email.

Initially you may be tempted to use {% url `cy.visit()` visit %} or use Cypress to traverse to the 3rd party login window.

However, you should **never** use your UI or visit a 3rd party site when testing because:

- It is incredibly time consuming and slows down your tests.
- The 3rd party site may have changed or updated its content.
- The 3rd party site may be having issues outside of your control.
- The 3rd party site may detect you are testing via a script and block you.
- The 3rd party site may be running A/B campaigns.

Let's look at a few strategies for dealing with these situations.

***When logging in:***

Many OAuth providers run A/B experiments, which means that their login screen is dynamically changing. This makes automated testing difficult.

Many OAuth providers also throttle the number of web requests you can make to them. For instance, if you try to test Google, Google will **automatically** detect that you are not a human and instead of giving you an OAuth login screen, they will make you fill out a captcha.

Additionally, testing through an OAuth provider is mutable - you will first need a real user on their service and then modifying anything on that user might affect other tests downstream.

**Here are potential solutions to alleviate these problems:**

1. {% url "Stub" stub %} out the OAuth provider and bypass using their UI altogether. You could just trick your application into believing the OAuth provider has passed its token to your application.
2. If you **must** get a real token you can use {% url `cy.request()` request %} and use the **programmatic** API that your OAuth provider provides. These APIs likely change **more** infrequently and you avoid problems like throttling and A/B campaigns.
3. Instead of having your test code bypass OAuth, you could also ask your server for help. Perhaps all an OAuth token does is generate a user in your database. Oftentimes OAuth is only useful initially and your server establishes its own session with the client. If that is the case, just use {% url `cy.request()` request %} to get the session directly from your server and bypass the provider altogether.

{% note info Recipes %}
{% url "We have several examples of doing this in our logging in recipes." recipes %}
{% endnote %}

***3rd party servers:***

Sometimes actions that you take in your application **may** affect another 3rd party application. These situations are not that common, but it is possible. Imagine your application integrates with GitHub and by using your application you can change data inside of GitHub.

After running your test, instead of trying to {% url `cy.visit()` visit %} GitHub, you can simply use {% url `cy.request()` request %} to programmatically interact with GitHub's APIs directly.

This avoids ever needing to touch the UI of another application.

***Verifying sent emails:***

Typically, when going through scenarios like user registration or forgotten passwords, your server schedules an email to be delivered.

The easiest way to check that this happened is likely with a unit or integration test at the server level and not at the end-to-end level. You generally do not need to test things only your server interacts with like side effects and services.

Nevertheless, if you **did** want to write a test in Cypress, you already have the tools to do this without involving the UI.

1. You could `cy.request()` an endpoint on your server that tells you what email has been queued or delivered. That would give you a programmatic way to know without involving the UI. Your server would have to expose this endpoint.
2. You could also use `cy.request()` to a 3rd party server that exposes an API to read off emails. You will then need the proper authentication credentials, which your server could provide, or you could use environment variables.

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

## Using `after` or `afterEach` hooks

{% note danger %}
{% fa fa-warning %} **Anti-Pattern:** Using `after` or `afterEach` hooks to clean up state.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Clean up state **before** tests run.
{% endnote %}

We see many of our users adding code to an `after` or `afterEach` hook in order to clean up the state generated by the current test(s).

We most often see test code that like this:

```js
describe('logged in user', function () {
  beforeEach(function () {
    cy.login()
  })

  afterEach(function () {
    cy.logout()
  })

  it('tests', ...)
  it('more', ...)
  it('things', ...)
})
```

Let's look at why this is not really necessary.

***Dangling state is your friend:***

One of the **best** parts of Cypress is its emphasis on debuggability. Unlike other testing tools - when your tests end - you are left with your working application at the exact point where your test finished.

This is an **excellent** opportunity for you to **use** your application in the state the tests finished! This enables you to write **partial tests** that drive your application step by step, writing your test and application code at the same time.

We have built Cypress to support this use case. In fact, Cypress **does not** clean up its own internal state when the test ends. We **want** you to have dangling state at the end of the test! Things like {% url "`stubs`" stub %}, {% url "`spies`" spy %}, even {% url "`routes`" route %} are **not** removed at the end of the test. This means your application will behave identically while it is running Cypress commands or when you manually work with it after a test ends.

If you remove your application's state after each test, then you instantly lose the ability to use your application in this mode. Logging out at the end would always leave you with the same login page at the end of the test. In order to debug your application or write a partial test, you would always be left commenting out your custom `cy.logout()` command.

***It's all downside with no upside:***

For the moment, let's assume that for some reason your application desperately **needs** that last bit of `after` or `afterEach` code to run. Let's assume that if that code is not run - all is lost.

That is fine - but even if this is the case, it should not go in an `after` or `afterEach` hook. Why? So far we have been talking about logging out, but let's use a different example. Let's use the pattern of needing to reset your database.

**The idea goes like this:**

> After each test I want to ensure the database is reset back to 0 records so when the next test runs, it is run with a clean state.

**With that in mind you write something like this:**

```js
afterEach(function () {
  cy.resetDb()
})
```

Here is the problem: **there is no guarantee that this code will run.**

If, hypothetically, you have written this command because it **has** to run before the next test does, then the absolute **worst place** to put it is in an `after` or `afterEach` hook.

Why? Because if you refresh Cypress in the middle of the test - you will have built up partial state in the database, and your custom `cy.resetDb()` function **will never get called**.

If this state cleanup is **truly** required, then the next test will instantly fail. Why? Because resetting the state never happened when you refreshed Cypress.

***State reset should go before each test:***

The simplest solution here is to move your reset code to **before** the test runs.

Code put in a `before` or `beforeEach` hook will **always** run prior to the test - even if you refreshed Cypress in the middle of an existing one!

This is also a great opportunity to use {%url 'root level hooks in mocha' https://github.com/mochajs/mochajs.github.io/blob/master/index.md#root-level-hooks %}. A perfect place to put these is in the {% url "`cypress/support/index.js` file" writing-and-organizing-tests#Support-file %} because it is always evaluated before any test code from your spec files.

**Hooks you add to the root will always run on all suites!**

```js
// cypress/support/index.js

beforeEach(function () {
  // now this runs prior to every test
  // across all files no matter what
  cy.resetDb()
})
```

That's it! It couldn't be simpler!

***Is resetting the state necessary?***

One final question you should ask yourself is - is resetting the state even necessary? Remember, Cypress already automatically clears {% url "`localStorage`" clearlocalstorage %}, {% url "cookies" clearcookies %}, sessions, etc before each test. Make sure you are not trying to clean up state that is already cleaned up by Cypress automatically.

If the state you are trying to clean lives on the server - by all means, clean that state. You will need to run these types of routines! But if the state is related to your application currently under test - you likely do not even need to clear it.

The only times you **ever** need to clean up state, is if the operations that one test runs affects another test downstream. In only those cases do you need state cleanup.

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
{% fa fa-warning %} **Anti-Pattern:** Trying to a start a web server from within Cypress scripts with {% url `cy.exec()` exec %}.
{% endnote %}

{% note success %}
{% fa fa-check-circle %} **Best Practice:** Start a web server prior to running Cypress in the Test Runner or headless mode.
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

While working in the Cypress Test Runner you can always restart / refresh while in the middle of a test. When that happens, code in an `after` won't execute.

**What should I do then?**

Simple. Start your web server before running Cypress and kill it after it completes.

Are you trying to run in CI?

We have {% url 'examples showing you how to start and stop your web server' continuous-integration#Booting-Your-Server %}.

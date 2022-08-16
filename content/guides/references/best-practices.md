---
title: Best Practices
layout: toc-top
---

<Alert type="info">

### <Icon name="graduation-cap"></Icon> Real World Practices

The Cypress team maintains the <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app), a
full stack example application that demonstrates **best practices and scalable
strategies with Cypress in practical and realistic scenarios**.

The RWA achieves full [code-coverage](/guides/tooling/code-coverage) with
end-to-end tests
[across multiple browsers](/guides/guides/cross-browser-testing) and
[device sizes](/api/commands/viewport), but also includes
[visual regression tests](/guides/tooling/visual-testing), API tests, unit
tests, and runs them all in an
[efficient CI pipeline](https://dashboard.cypress.io/projects/7s5okt).

The app is bundled with everything you need,
[just clone the repository](https://github.com/cypress-io/cypress-realworld-app)
and start testing.

</Alert>

## Organizing Tests, Logging In, Controlling State

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Sharing
page objects, using your UI to log in, and not taking shortcuts.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Test specs in
isolation, programmatically log into your application, and take control of your
application's state.

</Alert>

In February 2018 we gave a "Best Practices" conference talk at AssertJS. This
video demonstrates how to approach writing fast, scalable tests.

<Icon name="play-circle"></Icon>
[https://www.youtube.com/watch?v=5XQOK0v_YRE](https://www.youtube.com/watch?v=5XQOK0v_YRE)

We have several
[Logging in recipes](https://github.com/cypress-io/cypress-example-recipes#logging-in-recipes)
in our examples.

## Selecting Elements

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Using
highly brittle selectors that are subject to change.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Use `data-*`
attributes to provide context to your selectors and isolate them from CSS or JS
changes.

</Alert>

Every test you write will include selectors for elements. To save yourself a lot
of headaches, you should write selectors that are resilient to changes.

Oftentimes we see users run into problems targeting their elements because:

- Your application may use dynamic classes or ID's that change
- Your selectors break from development changes to CSS styles or JS behavior

Luckily, it is possible to avoid both of these problems.

1. Don't target elements based on CSS attributes such as: `id`, `class`, `tag`
2. Don't target elements that may change their `textContent`
3. Add `data-*` attributes to make it easier to target elements

### How It Works:

Given a button that we want to interact with:

```html
<button
  id="main"
  class="btn btn-large"
  name="submission"
  role="button"
  data-cy="submit"
>
  Submit
</button>
```

Let's investigate how we could target it:

| Selector                                | Recommended                                                        | Notes                                                           |
| --------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| `cy.get('button').click()`              | <Icon name="exclamation-triangle" color="red"></Icon> Never        | Worst - too generic, no context.                                |
| `cy.get('.btn.btn-large').click()`      | <Icon name="exclamation-triangle" color="red"></Icon> Never        | Bad. Coupled to styling. Highly subject to change.              |
| `cy.get('#main').click()`               | <Icon name="exclamation-triangle" color="orange"></Icon> Sparingly | Better. But still coupled to styling or JS event listeners.     |
| `cy.get('[name="submission"]').click()` | <Icon name="exclamation-triangle" color="orange"></Icon> Sparingly | Coupled to the `name` attribute which has HTML semantics.       |
| `cy.contains('Submit').click()`         | <Icon name="check-circle" color="green"></Icon> Depends            | Much better. But still coupled to text content that may change. |
| `cy.get('[data-cy="submit"]').click()`  | <Icon name="check-circle" color="green"></Icon> Always             | Best. Isolated from all changes.                                |

Targeting the element above by `tag`, `class` or `id` is very volatile and
highly subject to change. You may swap out the element, you may refactor CSS and
update ID's, or you may add or remove classes that affect the style of the
element.

Instead, adding the `data-cy` attribute to the element gives us a targeted
selector that's only used for testing.

The `data-cy` attribute will not change from CSS style or JS behavioral changes,
meaning it's not coupled to the **behavior** or **styling** of an element.

Additionally, it makes it clear to everyone that this element is used directly
by test code.

<Alert type="info">

<strong class="alert-header">Did you know?</strong>

The [Selector Playground](/guides/core-concepts/cypress-app#Selector-Playground)
automatically follows these best practices.

When determining an unique selector it will automatically prefer elements with:

- `data-cy`
- `data-test`
- `data-testid`

</Alert>

#### <Icon name="graduation-cap"></Icon> Real World Example

The [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app)
uses two useful custom commands for selecting elements for testing:

- `getBySel` yields elements with a `data-test` attribute that **match** a
  specified selector.
- `getBySelLike` yields elements with a `data-test` attribute that **contains**
  a specified selector.

```ts
// cypress/support/commands.ts

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})
```

> _<Icon name="github"></Icon> Source:
> [cypress/support/commands.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/support/commands.ts)_

### Text Content:

After reading the above rules you may be wondering:

> If I should always use data attributes, then when should I use
> `cy.contains()`?

A rule of thumb is to ask yourself this:

If the content of the element **changed** would you want the test to fail?

- If the answer is yes: then use [`cy.contains()`](/api/commands/contains)
- If the answer is no: then use a data attribute.

**Example:**

If we looked at the `<html>` of our button again...

```html
<button id="main" class="btn btn-large" data-cy="submit">Submit</button>
```

The question is: how important is the `Submit` text content to your test? If the
text changed from `Submit` to `Save` - would you want the test to fail?

If the answer is **yes** because the word `Submit` is critical and should not be
changed - then use [`cy.contains()`](/api/commands/contains) to target the
element. This way, if it is changed, the test will fail.

If the answer is **no** because the text could be changed - then use
[`cy.get()`](/api/commands/get) with data attributes. Changing the text to
`Save` would then not cause a test failure.

## Assigning Return Values

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Trying
to assign the return value of Commands with `const`, `let`, or `var`.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Use
[closures to access and store](/guides/core-concepts/variables-and-aliases) what
Commands yield you.

</Alert>

Many first time users look at Cypress code and think it runs synchronously.

We see new users commonly write code that looks like this:

```js
// DONT DO THIS. IT DOES NOT WORK
// THE WAY YOU THINK IT DOES.
const a = cy.get('a')

cy.visit('https://example.cypress.io')

// nope, fails
a.first().click()
```

<Alert type="info">

<strong class="alert-header">Did you know?</strong>

You rarely have to ever use `const`, `let`, or `var` in Cypress. If you're using
them, you will want to do some refactoring.

</Alert>

If you are new to Cypress and wanting to better understand how Commands work -
[please read our Introduction to Cypress guide](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands).

If you're familiar with Cypress commands already, but find yourself using
`const`, `let`, or `var` then you're typically trying to do one of two things:

- You're trying to **store and compare** values such as **text**, **classes**,
  **attributes**.
- You're trying to share **values** between tests and hooks like `before` and
  `beforeEach`.

For working with either of these patterns, please read our
[Variables and Aliases guide](/guides/core-concepts/variables-and-aliases).

## Visiting external sites

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Trying
to visit or interact with sites or servers you do not control.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Only test
what you control. Try to avoid requiring a 3rd party server. When necessary,
always use [`cy.request()`](/api/commands/request) to talk to 3rd party servers
via their APIs.

</Alert>

One of the first things many of our users attempt to do is involve 3rd party
servers in their tests.

You may want to access 3rd party servers in several situations:

1. Testing log in when your app uses another provider via OAuth.
2. Verifying your server updates a 3rd party server.
3. Checking your email to see if your server sent a "forgot password" email.

Initially you may be tempted to use [`cy.visit()`](/api/commands/visit) or use
Cypress to traverse to the 3rd party login window.

However, you should **never** use your UI or visit a 3rd party site when testing
because:

- It is incredibly time consuming and slows down your tests.
- The 3rd party site may have changed or updated its content.
- The 3rd party site may be having issues outside of your control.
- The 3rd party site may detect you are testing via a script and block you.
- The 3rd party site may be running A/B campaigns.

Let's look at a few strategies for dealing with these situations.

### When logging in:

Many OAuth providers run A/B experiments, which means that their login screen is
dynamically changing. This makes automated testing difficult.

Many OAuth providers also throttle the number of web requests you can make to
them. For instance, if you try to test Google, Google will **automatically**
detect that you are not a human and instead of giving you an OAuth login screen,
they will make you fill out a captcha.

Additionally, testing through an OAuth provider is mutable - you will first need
a real user on their service and then modifying anything on that user might
affect other tests downstream.

**Here are potential solutions to alleviate these problems:**

1. [Stub](/api/commands/stub) out the OAuth provider and bypass using their UI
   altogether. You could trick your application into believing the OAuth
   provider has passed its token to your application.
2. If you **must** get a real token you can use
   [`cy.request()`](/api/commands/request) and use the **programmatic** API that
   your OAuth provider provides. These APIs likely change **more** infrequently
   and you avoid problems like throttling and A/B campaigns.
3. Instead of having your test code bypass OAuth, you could also ask your server
   for help. Perhaps all an OAuth token does is generate a user in your
   database. Oftentimes OAuth is only useful initially and your server
   establishes its own session with the client. If that is the case, use
   [`cy.request()`](/api/commands/request) to get the session directly from your
   server and bypass the provider altogether.

<Alert type="info">

<strong class="alert-header">Recipes</strong>

[We have several examples of doing this in our logging in recipes.](/examples/examples/recipes)

</Alert>

### 3rd party servers:

Sometimes actions that you take in your application **may** affect another 3rd
party application. These situations are not that common, but it is possible.
Imagine your application integrates with GitHub and by using your application
you can change data inside of GitHub.

After running your test, instead of trying to
[`cy.visit()`](/api/commands/visit) GitHub, you can use
[`cy.request()`](/api/commands/request) to programmatically interact with
GitHub's APIs directly.

This avoids ever needing to touch the UI of another application.

### Verifying sent emails:

Typically, when going through scenarios like user registration or forgotten
passwords, your server schedules an email to be delivered.

1. If your application is running locally and is sending the emails directly
   through an SMTP server, you can use a temporary local test SMTP server
   running inside Cypress. Read the blog post
   ["Testing HTML Emails using Cypress"](https://www.cypress.io/blog/2021/05/11/testing-html-emails-using-cypress/)
   for details.
2. If your application is using a 3rd party email service, or you cannot stub
   the SMTP requests, you can use a test email inbox with an API access. Read
   the blog post
   ["Full Testing of HTML Emails using SendGrid and Ethereal Accounts"](https://www.cypress.io/blog/2021/05/24/full-testing-of-html-emails-using-ethereal-accounts/)
   for details.

Cypress can even load the received HTML email in its browser to verify the
email's functionality and visual style:

<DocsImage
  src="/img/guides/references/email-test.png"
  title="The HTML email loaded during the test"
  alt="The test finds and clicks the Confirm registration button"></DocsImage>

3. In other cases, you should try using [`cy.request()`](/api/commands/request)
   command to query the an endpoint on your server that tells you what email has
   been queued or delivered. That would give you a programmatic way to know
   without involving the UI. Your server would have to expose this endpoint.
4. You could also use `cy.request()` to a 3rd party email recipient server that
   exposes an API to read off emails. You will then need the proper
   authentication credentials, which your server could provide, or you could use
   environment variables. Some email services already provide
   [Cypress plugins](/plugins/directory#Email) to access emails.

## Having tests rely on the state of previous tests

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Coupling
multiple tests together.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Tests should
always be able to be run independently from one another **and still pass**.

</Alert>

You only need to do one thing to know whether you've coupled your tests
incorrectly, or if one test is relying on the state of a previous one.

Change `it` to [`it.only`](https://jestjs.io/docs/api#testonlyname-fn-timeout)
on the test and refresh the browser.

If this test can run **by itself** and pass - congratulations you have written a
good test.

If this is not the case, then you should refactor and change your approach.

How to solve this:

- Move repeated code in previous tests to `before` or `beforeEach` hooks.
- Combine multiple tests into one larger test.

Let's imagine the following test that is filling out the form.

<e2e-or-ct>
<template #e2e>

```js
// an example of what NOT TO DO
describe('my form', () => {
  it('visits the form', () => {
    cy.visit('/users/new')
  })

  it('requires first name', () => {
    cy.get('[data-testid="first-name"]').type('Johnny')
  })

  it('requires last name', () => {
    cy.get('[data-testid="last-name"]').type('Appleseed')
  })

  it('can submit a valid form', () => {
    cy.get('form').submit()
  })
})
```

</template>
<template #ct>

```js
// an example of what NOT TO DO
describe('my form', () => {
  it('mounts the form', () => {
    cy.mount(<UserForm />)
  })

  it('requires first name', () => {
    cy.get('[data-testid="first-name"]').type('Johnny')
  })

  it('requires last name', () => {
    cy.get('[data-testid="last-name"]').type('Appleseed')
  })

  it('can submit a valid form', () => {
    cy.get('form').submit()
  })
})
```

</template>
</e2e-or-ct>

What's wrong with the above tests? They are all coupled together!

If you were to change `it` to
[`it.only`](https://jestjs.io/docs/api#testonlyname-fn-timeout) on any of the
last three tests, they would fail. Each test requires the previous to run in a
specific order in order to pass.

Here's 2 ways we can fix this:

### 1. Combine into one test

<e2e-or-ct>
<template #e2e>

```js
// a bit better
describe('my form', () => {
  it('can submit a valid form', () => {
    cy.visit('/users/new')

    cy.log('filling out first name') // if you really need this
    cy.get('[data-testid="first-name"]').type('Johnny')

    cy.log('filling out last name') // if you really need this
    cy.get('[data-testid="last-name"]').type('Appleseed')

    cy.log('submitting form') // if you really need this
    cy.get('form').submit()
  })
})
```

</template>
<template #ct>

```js
// a bit better
describe('my form', () => {
  it('can submit a valid form', () => {
    cy.mount(<NewUser />)

    cy.log('filling out first name') // if you really need this
    cy.get('[data-testid="first-name"]').type('Johnny')

    cy.log('filling out last name') // if you really need this
    cy.get('[data-testid="last-name"]').type('Appleseed')

    cy.log('submitting form') // if you really need this
    cy.get('form').submit()
  })
})
```

</template>
</e2e-or-ct>

Now we can put an `.only` on this test and it will run successfully irrespective
of any other test. The ideal Cypress workflow is writing and iterating on a
single test at a time.

### 2. Run shared code before each test

<e2e-or-ct>
<template #e2e>

```js
describe('my form', () => {
  beforeEach(() => {
    cy.visit('/users/new')
    cy.get('[data-testid="first-name"]').type('Johnny')
    cy.get('[data-testid="last-name"]').type('Appleseed')
  })

  it('displays form validation', () => {
    // clear out first name
    cy.get('[data-testid="first-name"]').clear()
    cy.get('form').submit()
    cy.get('[data-testid="errors"]').should('contain', 'First name is required')
  })

  it('can submit a valid form', () => {
    cy.get('form').submit()
  })
})
```

</template>
<template #ct>

```js
describe('my form', () => {
  beforeEach(() => {
    cy.mount(<NewUser />)
    cy.get('[data-testid="first-name"]').type('Johnny')
    cy.get('[data-testid="last-name"]').type('Appleseed')
  })

  it('displays form validation', () => {
    // clear out first name
    cy.get('[data-testid="first-name"]').clear()
    cy.get('form').submit()
    cy.get('[data-testid="errors"]').should('contain', 'First name is required')
  })

  it('can submit a valid form', () => {
    cy.get('form').submit()
  })
})
```

</template>
</e2e-or-ct>

This above example is ideal because now we are resetting the state between each
test and ensuring nothing in previous tests leaks into subsequent ones.

We're also paving the way to make it less complicated to write multiple tests
against the "default" state of the form. That way each test stays lean but each
can be run independently and pass.

## Creating "tiny" tests with a single assertion <E2EOnlyBadge />

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Acting
like you're writing unit tests.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Add multiple
assertions and don't worry about it

</Alert>

We've seen many users writing this kind of code:

```js
describe('my form', () => {
  beforeEach(() => {
    cy.visit('/users/new')
    cy.get('[data-testid="first-name"]').type('johnny')
  })

  it('has validation attr', () => {
    cy.get('[data-testid="first-name"]').should(
      'have.attr',
      'data-validation',
      'required'
    )
  })

  it('has active class', () => {
    cy.get('[data-testid="first-name"]').should('have.class', 'active')
  })

  it('has formatted first name', () => {
    cy.get('[data-testid="first-name"]')
      // capitalized first letter
      .should('have.value', 'Johnny')
  })
})
```

While technically this runs fine - this is really excessive, and not performant.

Why you do this pattern in component and unit tests:

- When assertions failed you relied on the test's title to know what failed
- You were told that adding multiple assertions was bad and accepted this as
  truth
- There was no performance penalty splitting up multiple tests because they run
  really fast

Why you shouldn't do this in end-to-end tests:

- Writing integration tests is not the same as unit tests
- You will always know (and can visually see) which assertion failed in a large
  test
- Cypress runs a series of async lifecycle events that reset state between tests
- Resetting tests is much slower than adding more assertions

It is common for tests in Cypress to issue 30+ commands. Because nearly every
command has a default assertion (and can therefore fail), even by limiting your
assertions you're not saving yourself anything because **any single command
could implicitly fail**.

How you should rewrite those tests:

```js
describe('my form', () => {
  beforeEach(() => {
    cy.visit('/users/new')
  })

  it('validates and formats first name', () => {
    cy.get('[data-testid="first-name"]')
      .type('johnny')
      .should('have.attr', 'data-validation', 'required')
      .and('have.class', 'active')
      .and('have.value', 'Johnny')
  })
})
```

## Using `after` or `afterEach` hooks

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Using
`after` or `afterEach` hooks to clean up state.

</Alert>

<Alert type="success">
<Icon name="check-circle" color="green"></Icon> **Best Practice:** Clean up
state **before** tests run.
</Alert>

We see many of our users adding code to an `after` or `afterEach` hook in order
to clean up the state generated by the current test(s).

We most often see test code that looks like this:

```js
describe('logged in user', () => {
  beforeEach(() => {
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })

  it('tests', ...)
  it('more', ...)
  it('things', ...)
})
```

Let's look at why this is not really necessary.

### Dangling state is your friend:

One of the **best** parts of Cypress is its emphasis on debuggability. Unlike
other testing tools - when your tests end - you are left with your working
application at the exact point where your test finished.

This is an **excellent** opportunity for you to **use** your application in the
state the tests finished! This enables you to write **partial tests** that drive
your application step by step, writing your test and application code at the
same time.

We have built Cypress to support this use case. In fact, Cypress **does not**
clean up its own internal state when the test ends. We **want** you to have
dangling state at the end of the test! Things like [stubs](/api/commands/stub),
[spies](/api/commands/spy), even [routes](/api/commands/route) are **not**
removed at the end of the test. This means your application will behave
identically while it is running Cypress commands or when you manually work with
it after a test ends.

If you remove your application's state after each test, then you instantly lose
the ability to use your application in this mode. Logging out at the end would
always leave you with the same login page at the end of the test. In order to
debug your application or write a partial test, you would always be left
commenting out your custom `cy.logout()` command.

### It's all downside with no upside:

For the moment, let's assume that for some reason your application desperately
**needs** that last bit of `after` or `afterEach` code to run. Let's assume that
if that code is not run - all is lost.

That is fine - but even if this is the case, it should not go in an `after` or
`afterEach` hook. Why? So far we have been talking about logging out, but let's
use a different example. Let's use the pattern of needing to reset your
database.

**The idea goes like this:**

> After each test I want to ensure the database is reset back to 0 records so
> when the next test runs, it is run with a clean state.

**With that in mind you write something like this:**

```js
afterEach(() => {
  cy.resetDb()
})
```

Here is the problem: **there is no guarantee that this code will run.**

If, hypothetically, you have written this command because it **has** to run
before the next test does, then the absolute **worst place** to put it is in an
`after` or `afterEach` hook.

Why? Because if you refresh Cypress in the middle of the test - you will have
built up partial state in the database, and your custom `cy.resetDb()` function
**will never get called**.

If this state cleanup is **truly** required, then the next test will instantly
fail. Why? Because resetting the state never happened when you refreshed
Cypress.

### State reset should go before each test:

The simplest solution here is to move your reset code to **before** the test
runs.

Code put in a `before` or `beforeEach` hook will **always** run prior to the
test - even if you refreshed Cypress in the middle of an existing one!

This is also a great opportunity to use
[root level hooks in mocha](https://github.com/mochajs/mochajs.github.io/blob/master/index.md#root-level-hooks).
::include{file=partials/support-file-configuration.md}

**Hooks you add to the root will always run on all suites!**

```js
// cypress/support/e2e.js or cypress/support/component.js

beforeEach(() => {
  // now this runs prior to every test
  // across all files no matter what
  cy.resetDb()
})
```

### Is resetting the state necessary?

One final question you should ask yourself is - is resetting the state even
necessary? Remember, Cypress already automatically enforces
[test isolation](/guides/core-concepts/writing-and-organizing-tests#Test-Isolation)
by clearing state before each test. Make sure you are not trying to clean up
state that is already cleaned up by Cypress automatically.

If the state you are trying to clean lives on the server - by all means, clean
that state. You will need to run these types of routines! But if the state is
related to your application currently under test - you likely do not even need
to clear it.

The only times you **ever** need to clean up state, is if the operations that
one test runs affects another test downstream. In only those cases do you need
state cleanup.

#### <Icon name="graduation-cap"></Icon> Real World Example

The [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app)
resets and re-seeds its database via a custom [Cypress task](/api/commands/task)
called `db:seed` in a `beforeEach` hook. This allows each test to start from a
clean slate and a deterministic state. For example:

```ts
// cypress/tests/ui/auth.cy.ts

beforeEach(function () {
  cy.task('db:seed')
  // ...
})
```

> _<Icon name="github"></Icon> Source:
> [cypress/tests/ui/auth.cy.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui/auth.spec.ts)_

The `db:seed` task is defined within the
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function of the
project, and in this case sends a request to a dedicated back end API of the app
to appropriately re-seed the database.

:::cypress-plugin-example

```js
on('task', {
  async 'db:seed'() {
    // Send request to backend API to re-seed database with test data
    const { data } = await axios.post(`${testDataApiEndpoint}/seed`)
    return data
  },
  //...
})
```

:::

> _<Icon name="github"></Icon> Source:
> [cypress/plugins/index.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/plugins/index.ts)_

The same practice above can be used for any type of database (PostgreSQL,
MongoDB, etc.). In this example, a request is sent to a back end API, but you
could also interact directly with your database with direct queries, custom
libraries, etc. If you already have non-JavaScript methods of handling or
interacting with your database, you can use [`cy.exec`](/api/commands/exec),
instead of [`cy.task`](/api/commands/task), to execute any system command or
script.

## Unnecessary Waiting

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Waiting
for arbitrary time periods using [`cy.wait(Number)`](/api/commands/wait#Time).

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Use route
aliases or assertions to guard Cypress from proceeding until an explicit
condition is met.

</Alert>

In Cypress, you almost never need to use `cy.wait()` for an arbitrary amount of
time. If you are finding yourself doing this, there is likely a much simpler
way.

Let's imagine the following examples:

### Unnecessary wait for `cy.request()`

Waiting here is unnecessary since the [`cy.request()`](/api/commands/request)
command will not resolve until it receives a response from your server. Adding
the wait here only adds 5 seconds after the
[`cy.request()`](/api/commands/request) has already resolved.

```javascript
cy.request('http://localhost:8080/db/seed')
cy.wait(5000) // <--- this is unnecessary
```

### Unnecessary wait for `cy.visit()` <E2EOnlyBadge />

Waiting for this is unnecessary because the [cy.visit()](/api/commands/visit)
resolves once the page fires its `load` event. By that time all of your assets
have been loaded including javascript, stylesheets, and html.

```javascript
cy.visit('http://localhost/8080')
cy.wait(5000) // <--- this is unnecessary
```

### Unnecessary wait for `cy.get()`

Waiting for the [`cy.get()`](/api/commands/get) below is unnecessary because
[`cy.get()`](/api/commands/get) automatically retries until the table's `tr` has
a length of 2.

Whenever commands have an assertion they will not resolve until their associated
assertions pass. This enables you to describe the state of your application
without having to worry about when it gets there.

```javascript
cy.intercept('GET', '/users', [{ name: 'Maggy' }, { name: 'Joan' }])
cy.get('#fetch').click()
cy.wait(4000) // <--- this is unnecessary
cy.get('table tr').should('have.length', 2)
```

Alternatively a better solution to this problem is by waiting explicitly for an
aliased route.

```javascript
cy.intercept('GET', '/users', [{ name: 'Maggy' }, { name: 'Joan' }]).as(
  'getUsers'
)
cy.get('[data-testid="fetch-users"]').click()
cy.wait('@getUsers') // <--- wait explicitly for this route to finish
cy.get('table tr').should('have.length', 2)
```

## Web Servers

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Trying
to start a web server from within Cypress scripts with
[`cy.exec()`](/api/commands/exec) or [`cy.task()`](/api/commands/task).

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Start a web
server prior to running Cypress.

</Alert>

We do NOT recommend trying to start your back end web server from within
Cypress.

Any command run by [cy.exec()](/api/commands/exec) or
[cy.task()](/api/commands/task) has to exit eventually. Otherwise, Cypress will
not continue running any other commands.

Trying to start a web server from [cy.exec()](/api/commands/exec) or
[cy.task()](/api/commands/task) causes all kinds of problems because:

- You have to background the process
- You lose access to it via terminal
- You don't have access to its `stdout` or logs
- Every time your tests run, you'd have to work out the complexity around
  starting an already running web server.
- You would likely encounter constant port conflicts

**Why can't I shut down the process in an `after` hook?**

Because there is no guarantee that code running in an `after` will always run.

While working in the Cypress Test Runner you can always restart / refresh while
in the middle of a test. When that happens, code in an `after` won't execute.

**What should I do then?**

Start your web server before running Cypress and kill it after it completes.

Are you trying to run in CI?

We have
[examples showing you how to start and stop your web server](/guides/continuous-integration/introduction#Boot-your-server).

## Setting a global baseUrl

<Alert type="danger">

<Icon name="exclamation-triangle" color="red"></Icon> **Anti-Pattern:** Using
[cy.visit()](/api/commands/visit) without setting a `baseUrl`.

</Alert>

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Set a
`baseUrl` in your [Cypress configuration](/guides/references/configuration).

</Alert>

By adding a [baseUrl](/guides/references/configuration#Global) in your
configuration Cypress will attempt to prefix the `baseUrl` any URL provided to
commands like [cy.visit()](/api/commands/visit) and
[cy.request()](/api/commands/request) that are not fully qualified domain name
(FQDN) URLs.

This allows you to omit hard-coding fully qualified domain name (FQDN) URLs in
commands. For example,

```javascript
cy.visit('http://localhost:8080/index.html')
```

can be shortened to

```javascript
cy.visit('index.html')
```

Not only does this create tests that can easily switch between domains, i.e.
running a dev server on `http://localhost:8080` vs a deployed production server
domain, but adding a `baseUrl` can also save some time during the initial
startup of your Cypress tests.

When you start running your tests, Cypress does not know the url of the app you
plan to test. So, Cypress initially opens on `https://localhost` + a random
port.

### Without `baseUrl` set, Cypress loads main window in `localhost` + random port

<DocsImage src="/img/guides/references/cypress-loads-in-localhost-and-random-port.png" alt="Url address shows localhost:53927/__/#tests/integration/organizations/list_spec.coffee" ></DocsImage>

As soon as it encounters a [cy.visit()](/api/commands/visit), Cypress then
switches to the url of the main window to the url specified in your visit. This
can result in a 'flash' or 'reload' when your tests first start.

By setting the `baseUrl`, you can avoid this reload altogether. Cypress will
load the main window in the `baseUrl` you specified as soon as your tests start.

### Cypress configuration file

:::cypress-config-example

```js
{
  e2e: {
    baseUrl: 'http://localhost:8484'
  }
}
```

:::

### With `baseUrl` set, Cypress loads main window in `baseUrl`

<DocsImage src="/img/guides/references/cypress-loads-window-in-base-url-localhost.png" alt="Url address bar shows localhost:8484/__tests/integration/organizations/list_spec.coffee" ></DocsImage>

Having a `baseUrl` set gives you the added bonus of seeing an error if your
server is not running during `cypress open` at the specified `baseUrl`.

<DocsImage src="/img/guides/references/cypress-ensures-baseUrl-server-is-running.png" alt="Cypress Launchpad with warning about how Cypress could not verify server set as the baseUrl is running"></DocsImage>

We also display an error if your server is not running at the specified
`baseUrl` during `cypress run` after several retries.

<DocsImage src="/img/guides/references/cypress-verifies-server-is-running-during-cypress-run.png" alt="The terminal warns and retries when the url at your baseUrl is not running" ></DocsImage>

### Usage of `baseUrl` in depth

This [short video](https://www.youtube.com/watch?v=f5UaXuAc52c) explains in
depth how to use `baseUrl` correctly.

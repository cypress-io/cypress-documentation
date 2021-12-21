---
title: Why Cypress?
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- What Cypress is and why you should use it
- Our mission, and what we believe in
- Key Cypress features
- Types of tests Cypress is designed for

</Alert>

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/LcGHiFnBh3Y"></DocsVideo>

<!-- textlint-enable -->

## In a nutshell

Cypress is a next generation front end testing tool built for the modern web. We
address the key pain points developers and QA engineers face when testing modern
applications.

We make it possible to:

- [Set up tests](#Setting-up-tests)
- [Write tests](#Writing-tests)
- [Run tests](#Running-tests)
- [Debug Tests](#Debugging-tests)

Cypress is most often compared to Selenium; however Cypress is both
fundamentally and architecturally different. Cypress is not constrained by the
same restrictions as Selenium.

This enables you to **write faster**, **easier** and **more reliable** tests.

## Who uses Cypress?

Our users are typically developers or QA engineers building web applications
using modern JavaScript frameworks.

Cypress enables you to write all types of tests:

- End-to-end tests
- Integration tests
- Unit tests

Cypress can test anything that runs in a browser.

## Cypress ecosystem

Cypress consists of a free,
[open source](https://github.com/cypress-io/cypress),
[locally installed](/guides/getting-started/installing-cypress) application
**and** a Dashboard Service for
[recording your tests](/guides/dashboard/introduction).

- **_First:_** Cypress helps you set up and start writing tests every day while
  you build your application locally. _TDD at its best!_
- **_Later:_** After building up a suite of tests and
  [integrating Cypress](/guides/continuous-integration/introduction) with your
  CI Provider, our [Dashboard Service](/guides/dashboard/introduction) can
  record your test runs. You'll never have to wonder: _Why did this fail?_

## Our mission

Our mission is to build a thriving, open source ecosystem that enhances
productivity, makes testing an enjoyable experience, and generates developer
happiness. We hold ourselves accountable to champion a testing process **that
actually works**.

We believe our documentation should be approachable. This means enabling our
readers to understand fully not just the **what** but the **why** as well.

We want to help developers build a new generation of modern applications faster,
better, and without the stress and anxiety associated with managing tests.

We know that in order for us to be successful we must enable, nurture, and
foster an ecosystem that thrives on open source. Every line of test code is an
investment in **your codebase**, it will never be coupled to us as a paid
service or company. Tests will be able to run and work independently, _always_.

We believe testing needs a lot of <Icon name="heart"></Icon> and we are here to
build a tool, a service, and a community that everyone can learn and benefit
from. We're solving the hardest pain points shared by every developer working on
the web. We believe in this mission and hope that you will join us to make
Cypress a lasting ecosystem that makes everyone happy.

## Features

Cypress comes fully baked, batteries included. Here is a list of things it can
do that no other testing framework can:

- **Time Travel:** Cypress takes snapshots as your tests run. Hover over
  commands in the [Command Log](/guides/core-concepts/cypress-app#Command-Log)
  to see exactly what happened at each step.
- **Debuggability:** Stop guessing why your tests are failing.
  [Debug directly](/guides/guides/debugging) from familiar tools like Developer
  Tools. Our readable errors and stack traces make debugging lightning fast.
- **Automatic Waiting:** Never add waits or sleeps to your tests. Cypress
  [automatically waits](/guides/core-concepts/introduction-to-cypress#Cypress-is-Not-Like-jQuery)
  for commands and assertions before moving on. No more async hell.
- **Spies, Stubs, and Clocks:** Verify and
  [control the behavior](/guides/guides/stubs-spies-and-clocks) of functions,
  server responses, or timers. The same functionality you love from unit testing
  is right at your fingertips.
- **Network Traffic Control:** Easily
  [control, stub, and test edge cases](/guides/guides/network-requests) without
  involving your server. You can stub network traffic however you like.
- **Consistent Results:** Our architecture doesn’t use Selenium or WebDriver.
  Say hello to fast, consistent and reliable tests that are flake-free.
- **Screenshots and Videos:** View screenshots taken automatically on failure,
  or videos of your entire test suite when run from the CLI. Record to the
  Dashboard to store them with your test results for easy online browsing.
- **Cross browser Testing:** Run tests within Firefox and Chrome-family browsers
  (including Edge and Electron) locally and
  [optimally in a Continuous Integration pipeline](/guides/guides/cross-browser-testing).
- **Test Orchestration:** Once you're set up to record to the Dashboard, easily
  [parallelize](/guides/guides/parallelization) your test suite and
  [fail-fast](/guides/dashboard/smart-orchestration#Run-failed-specs-first) for
  tight feedback loops.
- **Flake Detection:** Sometimes tests pass, sometimes they fail? Discover and
  diagnose unreliable tests with the Dashboard's
  [Flaky tests](/guides/dashboard/flaky-test-management) feature.

### <Icon name="cog"></Icon> Setting up tests

There are no servers, drivers, or any other dependencies to install or
configure. You can write your first passing test in 60 seconds.

<DocsVideo src="/img/snippets/installing-cli.mp4" title="Installing and opening Cypress"></DocsVideo>

### <Icon name="code"></Icon> Writing tests

Tests written in Cypress are meant to be easy to read and understand. Our API
comes fully baked, on top of tools you are familiar with already.

<DocsVideo src="/img/snippets/writing-tests.mp4" title="Writing Tests"></DocsVideo>

### <Icon name="play-circle"></Icon> Running tests

Cypress runs as fast as your browser can render content. You can watch tests run
in real time as you develop your applications. TDD FTW!

<DocsVideo src="/img/snippets/running-tests.mp4" title="Running Tests"></DocsVideo>

### <Icon name="bug"></Icon> Debugging tests

Readable error messages help you to debug quickly. You also have access to all
the developer tools you know and love.

<DocsVideo src="/img/snippets/debugging.mp4" title="Debugging Tests"></DocsVideo>

## Test types

Cypress can be used to write several different types of tests. This can provide
even more confidence that your application under test is working as intended.

### End-to-end

Cypress was originally designed to run end-to-end (E2E) tests on anything that
runs in a browser. A typical E2E test visits the application in a browser and
performs actions via the UI just like a real user would.

```js
it('adds todos', () => {
  cy.visit('https://todo.app.com')
  cy.get('[data-testid="new-todo"]')
    .type('write code{enter}')
    .type('write tests{enter}')
  // confirm the application is showing two items
  cy.get('[data-testid="todos"]').should('have.length', 2)
})
```

### Component

You can also use Cypress to mount components from supported web frameworks and
execute
[component tests](/guides/component-testing/writing-your-first-component-test).

```js
import TodoList from './components/TodoList'

it('contains the correct number of todos', () => {
  const todos = [
    { text: 'Buy milk', id: 1 },
    { text: 'Learn Component Testing', id: 2 },
  ]

  cy.mount(<TodoList todos={todos} />)
  // the component starts running like a mini web app
  cy.get('[data-testid="todos"]').should('have.length', todos.length)
})
```

### API

Cypress can perform arbitrary HTTP calls, thus you can use it for API testing.

```js
it('adds a todo', () => {
  cy.request({
    url: '/todos',
    method: 'POST',
    body: {
      title: 'Write REST API',
    },
  })
    .its('body')
    .should('deep.contain', {
      title: 'Write REST API',
      completed: false,
    })
})
```

### Other

Finally, through a large number of
[official and 3rd party plugins](/plugins/directory) you can write Cypress
[a11y](https://github.com/component-driven/cypress-axe),
[visual](/plugins/directory#Visual%20Testing),
[email](/faq/questions/using-cypress-faq#How-do-I-check-that-an-email-was-sent-out)
and other types of tests.

## Cypress in the Real World

<DocsImage src="/img/guides/overview/v10/real-world-app.png" alt="Cypress Real World App"></DocsImage>

Cypress makes it quick and easy to start testing, and as you begin to test your
app, **you'll often wonder if you're using best practices or scalable
strategies**.

To guide the way, the Cypress team has created the <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app), a
full stack example application that demonstrates testing with **Cypress in
practical and realistic scenarios**.

The RWA achieves full [code-coverage](/guides/tooling/code-coverage) with
end-to-end tests
[across multiple browsers](/guides/guides/cross-browser-testing) and
[device sizes](/api/commands/viewport), but also includes
[visual regression tests](/guides/tooling/visual-testing), API tests, unit
tests, and runs them all in an
[efficient CI pipeline](https://dashboard.cypress.io/projects/7s5okt). Use the
RWA to **learn, experiment, tinker, and practice** web application testing with
Cypress.

The app is bundled with everything you need,
[just clone the repository](https://github.com/cypress-io/cypress-realworld-app)
and start testing.

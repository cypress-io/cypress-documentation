---
title: Cypress App
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- The names and purposes of the visual parts of Cypress
- How to use the Selector Playground for targeting your page elements
- How to debug tests using the built-in features of Cypress

</Alert>

## Overview

The Cypress desktop app has powerful features for creating, configuring,
browsing, and most importantly running your tests. We'll touch on a few of the
different functions before moving on to the Test Runner, the heart of the
Cypress testing experience.

<Alert type="info">

<strong class="alert-header">Dashboard integration</strong>

When you configure Cypress to record tests to the
[Dashboard](/guides/dashboard/introduction), you'll see data from your latest
recorded runs directly in Cypress. This increased visibility into your test
history allows you to debug your tests faster and more effectively, all within
your local workflow.

The data used by these features is pulled from the Dashboard, so they will only
reflect test results that were
[recorded](/guides/dashboard/projects#Set-up-a-project-to-record).

If you're not sure whether you're logged in, you can always check using the
profile control in the top right of the window.

</Alert>

### The Launchpad

<DocsImage src="/img/guides/core-concepts/cypress-app/the-launchpad.png" alt="The Launchpad"></DocsImage>

The Launchpad is your portal to Cypress, helping with onboarding, choosing a
testing type and launching a browser.

Once you get comfortable with Cypress you might find you don't need the
Launchpad any more. In this case
[you can run `cypress open` with the `--browser` and `--component` or `--e2e` options](/guides/guides/command-line#cypress-open)
to go straight to the Spec Explorer.

### The Spec Explorer

<DocsImage src="/img/guides/core-concepts/cypress-app/spec-explorer.png" alt="The Spec Explorer"></DocsImage>

On choosing your browser in the Launchpad, you'll be presented with a list of
your specs, their names, locations, and information about your latest recorded
runs. Here you can launch specs by clicking them, create new blank or example
specs, or search specs by name (handy for large test suites).

We've made the following spec data available directly in the Spec Explorer:

#### Last updated

This column tells you when the code of this spec was last updated, using local
file data from git or your own filesystem. It surfaces the change history of
your tests, so you can quickly find the most relevant specs as you’re browsing
your project.

This column will vary from machine to machine, as it reflects the state of the
code as stored on that computer.

#### Latest runs

This column shows the last time the spec was run, and the last four returned
statuses. Results are scoped to your current git branch if available, falling
back to the default branch if not, then finally all branches.

With this intelligence you can monitor, run, and fix tests locally within CI
workflows, and then further dig into your results by clicking through to the
Dashboard.

The runs data is sourced from the Dashboard (see [note above](#Overview)) so
should be the same everywhere.

#### Average duration

This column indicates the time taken to run the entire spec file, averaged over
the last four runs, so that you can quickly identify and take action to improve
the performance of your long-running tests.

Again, this analysis comes from the Dashboard.

#### Flake annotation

<Alert type="info">

<strong class="alert-header">What is a flaky test?</strong>

A test is considered to be [flaky](/guides/dashboard/flaky-test-management) when
it can pass and fail across multiple retry attempts without any code changes.

</Alert>

Specs with flaky tests are flagged with an indicator beside the spec name. This
means you can easily discern which areas of your application might result in an
unreliable user experience.

The flake indicator will display if any tests in the given spec have been flaky
in your latest runs (limited to 4). Hovering over the indicator will show a
tooltip with the following analytics, based off the last 50 runs:

- Rate (flaky runs divided by total runs)
- Severity (flaky rate at a glance)
- Last flaky (how many runs ago)

Clicking on the flake indicator will take you to the spec’s
[Flaky Test Analytics in the Dashboard](https://dashboard.cypress.io/projects/7s5okt/analytics/flaky-tests).

### Project Runs

<DocsImage src="/img/guides/core-concepts/cypress-app/recorded-runs.png" alt="Recorded Runs"></DocsImage>

This screen shows detailed information about the most recently recorded
[test runs](/guides/dashboard/runs) across all git branches, latest first. This
data comes from the Dashboard (see [note above](#Overview)) so should be the
same everywhere.

The title of each run is taken from the
[git commit message](https://www.educative.io/edpresso/git-commit-message-simply-explained)
for that change, and clicking on it will take you to the corresponding run page
in the Dashboard.

## The Test Runner

At the core of the app is the Test Runner itself. Cypress runs tests
interactively, allowing you to see commands as they execute while also viewing
the Application or Component Under Test, and exploring its DOM.

<DocsImage src="/img/guides/core-concepts/cypress-app/test-runner.png" alt="The Test Runner"></DocsImage>

## Command Log

The left-hand side of the Test Runner is a visual representation of your test
suite. Each test block is properly nested and each test, when clicked, displays
every Cypress command and assertion executed within the test's block as well as
any command or assertion executed in relevant `before`, `beforeEach`,
`afterEach`, and `after` hooks.

<DocsImage src="/img/guides/core-concepts/cypress-app/command-log.png" alt="Cypress app" width-600></DocsImage>

### Open files in your IDE

There are some places in the Command Log that display a link to the relevant
file where the code is located. Clicking on this link will open the file in your
[preferred file opener](/guides/tooling/IDE-integration#File-Opener-Preference).

<DocsImage src="/img/guides/core-concepts/cypress-app/open-file-in-IDE.gif" alt="Open file in your IDE"></DocsImage>

### Time traveling

Each command and assertion, when hovered over, restores the Application or
Component Under Test (right-hand side) to the state it was in when that command
executed. This allows you to **time travel** back to previous states when
testing.

<Alert type="info">

By default, Cypress keeps 50 tests worth of snapshots and command data for time
traveling. If you are seeing extremely high memory consumption in your browser,
you may want to lower the `numTestsKeptInMemory` in your
[Cypress configuration](/guides/references/configuration#Global).

</Alert>

In the following example, hovering over the `CONTAINS` command in the Command
Log changes the state of the [AUT](#Application-Under-Test) preview:

<DocsImage src="/img/guides/core-concepts/cypress-app/first-test-hover-contains.png" alt="Hovering over the contains tab highlights the dom element in the App in the Cypress app"></DocsImage>

Cypress automatically travels back in time to a snapshot of when a hovered-over
command resolved. Additionally, since [`cy.contains()`](/api/commands/contains)
finds DOM elements on the page, Cypress also highlights the element and scrolls
it into view (to the top of the page).

Also note that as we hover over the `CONTAINS` command, Cypress reverts back to
the URL that was present when the snapshot was taken.

<DocsImage src="/img/guides/core-concepts/cypress-app/first-test-url-revert.png" alt="The url address bar shows https://example.cypress.io/"></DocsImage>

### Pinning snapshots

Each command, assertion, or error, when clicked on, displays extra information
in the dev tools console. Clicking also **pins** the Application or Component
Under Test (right-hand side) to its previous state, or **snapshot**, when the
command executed.

In the following example, clicking on the `CLICK` command highlights it in
purple, and does three other things worth noting:

<DocsImage src="/img/guides/core-concepts/cypress-app/first-test-click-revert.png" alt="A click on the click command in the Command Log with Cypress app labeled as 1, 2, 3"></DocsImage>

#### 1. Pinned snapshots

We have now **pinned** this snapshot. Hovering over other commands will not
revert to them. This gives us a chance to manually inspect the DOM of our
application under test at the time the snapshot was taken.

#### 2. Event hitbox

Since [`.click()`](/api/commands/click) is an action command, that means we also
see a red hitbox at the coordinates the event took place.

#### 3. Snapshot menu panel

There is also a new menu panel. Some commands (like action commands) will take
multiple snapshots: **before** and **after**. We can now cycle through these.

The **before** snapshot is taken prior to the click event firing. The **after**
snapshot is taken immediately after the click event. Although this click event
caused our browser to load a new page, it's not an instantaneous transition.
Depending on how fast your page loaded, you may still see the same page, or a
blank screen as the page is unloading and in transition.

When a command causes an immediate visual change in our application, cycling
between before and after will update our snapshot. We can see this in action by
clicking the `TYPE` command in the Command Log. Now, clicking **before** will
show us the input in a default state, showing the placeholder text. Click
**after** will show us what the input looks like when the `TYPE` command has
completed.

### Page events

In addition to showing all the commands that were called, the command log also
shows important events from your application or component when they occur.
Notice these look different (they are gray and without a number).

<DocsImage src="/img/guides/core-concepts/cypress-app/first-test-page-load.png" alt="Command log shows 'Page load --page loaded--' and 'New url https://example.cypress.io/'"></DocsImage>

**Cypress logs out page events for:**

- Network XHR Requests
- URL hash changes
- Page Loads
- Form Submissions

### Instrument panel

For certain commands like [`cy.intercept()`](/api/commands/intercept),
[`cy.stub()`](/api/commands/stub), and [`cy.spy()`](/api/commands/spy), an extra
instrument panel is displayed above the test to give more information about the
state of your tests.

#### Routes

<!-- Code to reproduce screenshot:
it('intercept command log', () => {
    cy.intercept('GET', '/comments/1').as('getComment')
    .intercept('POST', '/comments').as('postComment')
    .intercept('PUT', /comments\/\d+/, 'res').as('putComment')

    cy.then(() => {
        Cypress.$.get('/comments/1')
    })
})
-->

<DocsImage src="/img/guides/core-concepts/cypress-app/instrument-panel-routes.png" alt="Routes Instrument Panel"></DocsImage>

#### Stubs

<DocsImage src="/img/guides/core-concepts/cypress-app/instrument-panel-stubs.png" alt="Stubs Instrument Panel"></DocsImage>

#### Spies

<DocsImage src="/img/guides/core-concepts/cypress-app/instrument-panel-spies.png" alt="Spies Instrument Panel"></DocsImage>

## Preview pane

The right-hand side of the Test Runner is where the Application or Component
Under Test is rendered.

### Application Under Test <E2EOnlyBadge />

In
[E2E Testing](/guides/core-concepts/testing-types#What-is-End-to-end-Testing),
the right-hand side of the Test Runner is used to display the Application Under
Test (AUT): the application that was navigated to using a
[`cy.visit()`](/api/commands/visit) or any subsequent routing calls made from
the visited application.

In the example below, we wrote the following code in our test file:

```javascript
cy.visit('https://example.cypress.io')

cy.title().should('include', 'Kitchen Sink')
```

In the corresponding application preview below, you can see
`https://example.cypress.io` is being displayed in the right-hand side. Not only
is the application visible, but it is fully interactive. You can open your
developer tools to inspect elements as you would in your normal application. The
DOM is completely available for debugging.

<DocsImage src="/img/guides/core-concepts/cypress-app/application-under-test.png" alt="Application Under Test"></DocsImage>

The AUT also displays in the size and orientation specified in your tests. You
can change the size or orientation with the
[`cy.viewport()`](/api/commands/viewport) command or in your
[Cypress configuration](/guides/references/configuration#Viewport). If the AUT
does not fit within the current browser window, it is scaled appropriately to
fit within the window.

The current size and scale of the AUT is displayed in the top right corner of
the window.

The image below shows that our application is displaying at `1000px` width,
`660px` height and scaled to `100%`.

<DocsImage src="/img/guides/core-concepts/cypress-app/viewport-scaling.png" alt="Viewport Scaling"></DocsImage>

_Note: The right-hand side may also be used to display syntax errors in your
test file that prevent the tests from running._

<DocsImage src="/img/guides/core-concepts/cypress-app/aut-error-e2e.png" alt="Errors"></DocsImage>

_Note: Internally, the AUT renders within an iframe. This can sometimes cause
unexpected behaviors
[explained here.](/api/commands/window#Cypress-uses-2-different-windows)_

### Component Under Test <ComponentOnlyBadge />

In
[Component testing](/guides/core-concepts/testing-types#What-is-Component-Testing),
the right-hand side of the Test Runner is used to display the Component Under
Test (CUT): the component that was mounted using the
[`cy.mount()`](/api/commands/mount) command.

In the following example, we have the following test in our spec file:

<code-group-react-vue>
<template #react>

```js
it('should have password input of type password', () => {
  mount(<LoginForm />)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

</template>
<template #vue>

```js
it('should have password input of type password', () => {
  mount(LoginForm)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

</template>
</code-group-react-vue>

In the corresponding Component Preview below, you can see the the `LoginForm`
component is being displayed in the right-hand side. Not only is the component
visible, but it is fully interactable. You can open your developer tools to
inspect elements as you would in your normal application. The DOM is completely
available for debugging.

<DocsImage src="/img/guides/core-concepts/v10/component-under-test.png" alt="Cypress app showing mounted component and password assertion"></DocsImage>

The CUT also displays in the size and orientation specified in your tests. You
can change the size or orientation with the
[`cy.viewport()`](/api/commands/viewport) command or in your
[Cypress configuration](/guides/references/configuration#Viewport). If the CUT
does not fit within the current browser window, it is scaled appropriately to
fit within the window.

The current size and scale of the CUT is displayed in the top right corner of
the window.

The image below shows that our application is displaying at `500px` width,
`500px` height and scaled to `100%`.

<DocsImage src="/img/guides/core-concepts/cypress-app/viewport-scaling-ct.png" alt="Cypress app showing mounted component test viewport scale"></DocsImage>

_Note: The right-hand side may also be used to display syntax errors in your
spec file that prevent the tests from running._

<DocsImage src="/img/guides/core-concepts/cypress-app/aut-error-ct.png" alt="Cypress app showing error as application under test"></DocsImage>

_Note: Internally, the CUT renders within an iframe. This can sometimes cause
unexpected behaviors
[explained here.](/api/commands/window#Cypress-uses-2-different-windows)_

## Selector Playground

The Selector Playground is an interactive feature that helps you:

- Determine a unique selector for an element.
- See what elements match a given selector.
- See what element matches a string of text.

<DocsVideo src="/img/snippets/selector-playground.mp4" title="Selector Playground demo"></DocsVideo>

### Uniqueness

Cypress will automatically calculate a **unique selector** to use targeted
element by running through a series of selector strategies.

::include{file=partials/default-selector-priority.md}

<Alert type="info">

<strong class="alert-header">This is configurable</strong>

Cypress allows you to control how a selector is determined.

Use the [Cypress.SelectorPlayground](/api/cypress-api/selector-playground-api)
API to control the selectors you want returned.

</Alert>

### Best practices

You may find yourself struggling to write good selectors because:

- Your application or component uses dynamic ID's and class names
- Your tests break whenever there are CSS or content changes

To help with these common challenges, the Selector Playground automatically
prefers certain `data-*` attributes when determining a unique selector.

Please read our
[Best Practices guide](/guides/references/best-practices#Selecting-Elements) on
helping you target elements and prevent tests from breaking on CSS or JS
changes.

### Finding selectors

To open the Selector Playground, click the <Icon name="crosshairs"></Icon>
button next to the URL at the top of the Test Runner. Hover over elements in
your app to preview a unique selector for that element in the tooltip.

<DocsImage src="/img/guides/core-concepts/cypress-app/open-selector-playground.gif" alt="Opening selector playground and hovering over elements"></DocsImage>

Click on the element and its selector will appear at the top. From there, you
can copy it to your clipboard ( <Icon name="copy"></Icon> ) or print it to the
console ( <Icon name="terminal"></Icon> ).

<DocsImage src="/img/guides/core-concepts/cypress-app/copy-selector-in-selector-playground.gif" alt="Clicking an element, copying its selector to clipboard, printing it to the console"></DocsImage>

### Running experiments

The box at the top that displays the selector is also a text input.

#### Editing a selector

When you edit the selector, it will show you how many elements match and
highlight those elements in your app.

<DocsImage src="/img/guides/core-concepts/cypress-app/typing-a-selector-to-find-in-playground.gif" alt="Type a selector to see what elements it matches"></DocsImage>

#### Switching to contains

You can also experiment with what [`cy.contains()`](/api/commands/contains)
would yield given a string of text. Click on `cy.get` and switch to
`cy.contains`.

Type in text to see which element it matches. Note that
[`cy.contains()`](/api/commands/contains) only yields the first element that
matches the text, even if multiple elements on the page contain the text.

<DocsImage src="/img/guides/core-concepts/cypress-app/cy-contains-in-selector-playground.gif" alt="Experiment with cy.contains"></DocsImage>

#### Disabling highlights

If you would like to interact with your app while the Selector Playground is
open, the element highlighting might get in the way. Toggling the highlighting
off will allow you to interact with your app more easily.

<DocsImage src="/img/guides/core-concepts/cypress-app/turn-off-highlight-in-selector-playground.gif" alt="Turn off highlighting"></DocsImage>

## Keyboard shortcuts

There are keyboard shortcuts to quickly perform common actions from within
Cypress.

| Key | Action                        |
| --- | ----------------------------- |
| `r` | Rerun tests                   |
| `s` | Stop tests                    |
| `f` | Bring focus to 'specs' window |

<DocsImage src="/img/guides/core-concepts/cypress-app/keyboard-shortcuts.png" alt="Tooltips show keyboard shortcuts"></DocsImage>

## Debugging

In addition to the features already mentioned, Cypress comes with a host of
debugging tools to help you understand a test. You can:

- See detailed information about [errors](#Errors) that occur.
- Receive additional [console output](#Console-output) about each command.
- [Pause commands](#Special-commands) and step through them iteratively.
<!-- - Visualize when hidden or multiple elements are found. -->

### Errors

::include{file=partials/anatomy-of-an-error.md}

### Console output

Besides Commands being interactive, they also output additional debugging
information to your console.

Open up your Dev Tools and click on the `GET` for the `.action-email` class
selector.

<DocsImage src="/img/guides/core-concepts/cypress-app/first-test-console-output.png" alt="Cypress app with get command pinned and console log open showing the yielded element"></DocsImage>

**We can see Cypress output additional information in the console:**

- Command (that was issued)
- Yielded (what was returned by this command)
- Elements (the number of elements found)
- Selector (the argument we used)

We can even expand what was returned and inspect each individual element or even
right click and inspect them in the Elements panel!

### Special commands

In addition to having a helpful UI, there are also special commands dedicated to
the task of debugging, for example:

- [cy.pause()](/api/commands/pause)
- [cy.debug()](/api/commands/debug)

In the following example, we've added a [cy.pause()](/api/commands/pause)
command to this test:

```js
describe('My First Test', () => {
  it('clicking "type" shows the right headings', () => {
    cy.visit('https://example.cypress.io')

    cy.pause()

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('[data-testid="action-email"]')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

Now, when the test runs, Cypress provides us a UI (similar to debugger) to step
forward through each command in the test.

<DocsImage src="/img/guides/core-concepts/cypress-app/first-test-paused.png" alt="Cypress app shows label saying 'Paused' with Command Log showing 'Pause'"></DocsImage>

In action:

<DocsVideo src="/img/snippets/first-test-debugging-30fps.mp4" title="Pause test runner demo"></DocsVideo>

## History

| Version                                     | Changes                             |
| ------------------------------------------- | ----------------------------------- |
| [3.5.0](/guides/references/changelog#3-5-0) | Added keyboard shortcuts to Cypress |
| [1.3.0](/guides/references/changelog#1-3-0) | Added Selector Playground           |

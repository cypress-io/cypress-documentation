---
title: The Test Runner
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- The names and purposes of the visual parts of the Cypress Test Runner
- How to use the Selector Playground for targeting your page elements
- How to debug tests using the built-in features of the Test Runner

</Alert>

## Overview

Cypress runs tests in a unique interactive runner that allows you to see
commands as they execute while also viewing the Application or Component Under
Test.

<DocsImage src="/img/guides/gui-diagram.png" alt="Cypress Test Runner"></DocsImage>

## Command Log

The lefthand side of the Test Runner is a visual representation of your test
suite. Each test block is properly nested and each test, when clicked, displays
every Cypress command and assertion executed within the test's block as well as
any command or assertion executed in relevant `before`, `beforeEach`,
`afterEach`, and `after` hooks.

<DocsImage src="/img/guides/command-log.png" alt="Cypress Test Runner" width-600 ></DocsImage>

### Open files in your IDE

There are some places in the Command Log that display a link to the relevant
file where the code is located. Clicking on this link will open the file in your
[preferred file opener](/guides/tooling/IDE-integration#File-Opener-Preference).

<DocsImage src="/img/guides/open-file-in-IDE.gif" alt="Open file your IDE" ></DocsImage>

### Time Traveling

Each command and assertion, when hovered over, restores the Application or
Component Under Test (righthand side) to the state it was in when that command
executed. This allows you to **time travel** back to previous states when
testing.

<Alert type="info">

By default, Cypress keeps 50 tests worth of snapshots and command data for time
traveling. If you are seeing extremely high memory consumption in your browser,
you may want to lower the `numTestsKeptInMemory` in your
[Cypress configuration](/guides/references/configuration#Global).

</Alert>

In the following example, hovering over the `CONTAINS` command in the Command
Log changes the state of the Test Runner:

<DocsImage src="/img/guides/first-test-hover-contains.png" alt="Hovering over the contains tab highlights the dom element in the App in the Test Runner" ></DocsImage>

Cypress automatically travels back in time to a snapshot of when a hovered-over
command resolved. Additionally, since [`cy.contains()`](/api/commands/contains)
finds DOM elements on the page, Cypress also highlights the element and scrolls
it into view (to the top of the page).

Also note that as we hover over the `CONTAINS` command, Cypress reverts back to
the URL that was present when the snapshot was taken.

<DocsImage src="/img/guides/first-test-url-revert.png" alt="The url address bar shows https://example.cypress.io/" ></DocsImage>

### Pinning Snapshots

Each command, assertion, or error, when clicked on, displays extra information
in the dev tools console. Clicking also **pins** the Application or Component
Under Test (righthand side) to its previous state, or **snapshot**, when the
command executed.

In the following example, clicking on the `CLICK` command highlights it in
purple, and does three other things worth noting:

<DocsImage src="/img/guides/first-test-click-revert.png" alt="A click on the click command in the Command Log with Test Runner labeled as 1, 2, 3" ></DocsImage>

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

<DocsImage src="/img/guides/first-test-page-load.png" alt="Command log shows 'Page load --page loaded--' and 'New url https://example.cypress.io/'" ></DocsImage>

**Cypress logs out page events for:**

- Network XHR Requests
- URL hash changes
- Page Loads
- Form Submissions

### Instrument Panel

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

<DocsImage src="/img/guides/instrument-panel-routes.png" alt="Routes Instrument Panel" ></DocsImage>

#### Stubs

<DocsImage src="/img/guides/instrument-panel-stubs.png" alt="Stubs Instrument Panel" ></DocsImage>

#### Spies

<DocsImage src="/img/guides/instrument-panel-spies.png" alt="Spies Instrument Panel" ></DocsImage>

## Preview Pane

The righthand side of the Test Runner is where the Application or Component
Under Test is rendered.

### Application Under Test <E2EOnlyBadge />

In
[End-to-End testing](/guides/overview/choosing-testing-type#What-is-End-to-end-Testing),
the righthand side of the Test Runner is used to display the Application Under
Test (AUT): the application that was navigated to using a
[`cy.visit()`](/api/commands/visit) or any subsequent routing calls made from
the visited application.

In the example below, we wrote the following code in our test file:

```javascript
cy.visit('https://example.cypress.io')

cy.title().should('include', 'Kitchen Sink')
```

In the corresponding Application Preview below, you can see
`https://example.cypress.io` is being displayed in the righthand side. Not only
is the application visible, but it is fully interactable. You can open your
developer tools to inspect elements as you would in your normal application. The
DOM is completely available for debugging.

<DocsImage src="/img/guides/application-under-test.png" alt="Application Under Test" ></DocsImage>

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

<DocsImage src="/img/guides/viewport-scaling.png" alt="Viewport Scaling" ></DocsImage>

_Note: The righthand side may also be used to display syntax errors in your test
file that prevent the tests from running._

<DocsImage src="/img/guides/errors.png" alt="Errors" ></DocsImage>

_Note: Internally, the AUT renders within an iframe. This can sometimes cause
unexpected behaviors
[explained here.](/api/commands/window#Cypress-uses-2-different-windows)_

### Component Under Test <ComponentOnlyBadge />

In
[Component testing](/guides/overview/choosing-testing-type#What-is-Component-Testing),
the righthand side of the Test Runner is used to display the Component Under
Test (CUT): the component that was mounted using the
[`cy.mount()`](/api/commands/mount) command.

In the following example, taken from the
[Writing Your First Component Test](/guides/getting-started/writing-your-first-component-test)
guide, we wrote the following test in our spec file:

:::react-vue-example

```js
it('should have password input of type password', () => {
  mount(<LoginForm />)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

```js
it('should have password input of type password', () => {
  mount(LoginForm)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

:::

In the corresponding Component Preview below, you can see the the `LoginForm`
component is being displayed in the righthand side. Not only is the component
visible, but it is fully interactable. You can open your developer tools to
inspect elements as you would in your normal application. The DOM is completely
available for debugging.

(SCREENSHOT OF TEST RUN WITH COMPONENT RENDERED)

The CUT also displays in the size and orientation specified in your tests. You
can change the size or orientation with the
[`cy.viewport()`](/api/commands/viewport) command or in your
[Cypress configuration](/guides/references/configuration#Viewport). If the CUT
does not fit within the current browser window, it is scaled appropriately to
fit within the window.

The current size and scale of the CUT is displayed in the top right corner of
the window.

The image below shows that our application is displaying at `1000px` width,
`660px` height and scaled to `100%`.

(CROPPED SCREENSHOT OF VIEWPORT SIZE)

_Note: The righthand side may also be used to display syntax errors in your spec
file that prevent the tests from running._

(SCREENSHOT OF AN ERROR APEARING ON THE RIGHT SIDE)

_Note: Internally, the CUT renders within an iframe. This can sometimes cause
unexpected behaviors
[explained here.](/api/commands/window#Cypress-uses-2-different-windows)_

## Selector Playground

The Selector Playground is an interactive feature that helps you:

- Determine a unique selector for an element.
- See what elements match a given selector.
- See what element matches a string of text.

<DocsVideo src="/img/snippets/selector-playground.mp4"></DocsVideo>

### Uniqueness

Cypress will automatically calculate a **unique selector** to use targeted
element by running through a series of selector strategies.

By default Cypress will favor:

1. `data-cy`
2. `data-test`
3. `data-testid`
4. `id`
5. `class`
6. `tag`
7. `attributes`
8. `nth-child`

<Alert type="info">

<strong class="alert-header">This is configurable</strong>

Cypress allows you to control how a selector is determined.

Use the [Cypress.SelectorPlayground](/api/cypress-api/selector-playground-api)
API to control the selectors you want returned.

</Alert>

### Best Practices

You may find yourself struggling to write good selectors because:

- Your application or component uses dynamic ID's and class names
- Your tests break whenever there are CSS or content changes

To help with these common challenges, the Selector Playground automatically
prefers certain `data-*` attributes when determining a unique selector.

Please read our
[Best Practices guide](/guides/references/best-practices#Selecting-Elements) on
helping you target elements and prevent tests from breaking on CSS or JS
changes.

### Finding Selectors

To open the Selector Playground, click the <Icon name="crosshairs"></Icon>
button next to the URL at the top of the runner. Hover over elements in your app
to preview a unique selector for that element in the tooltip.

<DocsImage src="/img/guides/test-runner/open-selector-playground.gif" alt="Opening selector playground and hovering over elements" ></DocsImage>

Click on the element and its selector will appear at the top. From there, you
can copy it to your clipboard ( <Icon name="copy"></Icon> ) or print it to the
console ( <Icon name="terminal"></Icon> ).

<DocsImage src="/img/guides/test-runner/copy-selector-in-selector-playground.gif" alt="Clicking an element, copying its selector to clipboard, printing it to the console" ></DocsImage>

### Running Experiments

The box at the top that displays the selector is also a text input.

#### Editing a Selector

When you edit the selector, it will show you how many elements match and
highlight those elements in your app.

<DocsImage src="/img/guides/test-runner/typing-a-selector-to-find-in-playground.gif" alt="Type a selector to see what elements it matches" ></DocsImage>

#### Switching to Contains

You can also experiment with what [`cy.contains()`](/api/commands/contains)
would yield given a string of text. Click on `cy.get` and switch to
`cy.contains`.

Type in text to see which element it matches. Note that
[`cy.contains()`](/api/commands/contains) only yields the first element that
matches the text, even if multiple elements on the page contain the text.

<DocsImage src="/img/guides/test-runner/cy-contains-in-selector-playground.gif" alt="Experiment with cy.contains" ></DocsImage>

#### Disabling Highlights

If you would like to interact with your app while the Selector Playground is
open, the element highlighting might get in the way. Toggling the highlighting
off will allow you to interact with your app more easily.

<DocsImage src="/img/guides/test-runner/turn-off-highlight-in-selector-playground.gif" alt="Turn off highlighting" ></DocsImage>

## Keyboard Shortcuts

There are keyboard shortcuts to quickly perform common actions from within the
Test Runner.

| Key | Action                        |
| --- | ----------------------------- |
| `r` | Rerun tests                   |
| `s` | Stop tests                    |
| `f` | Bring focus to 'specs' window |

<DocsImage src="/img/guides/test-runner/keyboard-shortcuts.png" alt="Tooltips show keyboard shortcuts" ></DocsImage>

## Debugging

In addition to the features already mentioned, Cypress comes with a host of
debugging tools to help you understand a test. You can:

- See detailed information about [errors](#Errors) that occur.
- Receive additional [console output](#Console-output) about each command.
- [Pause commands](#Special-commands) and step through them iteratively.
<!-- - Visualize when hidden or multiple elements are found. -->

### Errors

Cypress prints several pieces of information when an error occurs during a
Cypress test.

1. **Error name**: This is the type of the error (e.g. `AssertionError`,
   `CypressError`)
1. **Error message**: This generally tells you what went wrong. It can vary in
   length. Some are short like in the example, while some are long, and may tell
   you exactly how to fix the error.
1. **Learn more:** Some error messages contain a Learn more link that will take
   you to relevant Cypress documentation.
1. **Code frame file**: This is usually the top line of the stack trace and it
   shows the file, line number, and column number that is highlighted in the
   code frame below. Clicking on this link will open the file in your
   [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference)
   and highlight the line and column in editors that support it.
1. **Code frame**: This shows a snippet of code where the failure occurred, with
   the relevant line and column highlighted.
1. **View stack trace**: Clicking this toggles the visibility of the stack
   trace. Stack traces vary in length. Clicking on a blue file path will open
   the file in your
   [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference).
1. **Print to console button**: Click this to print the full error to your
   DevTools console. This will usually allow you to click on lines in the stack
   trace and open files in your DevTools.

<DocsImage src="/img/guides/command-failure-error.png" alt="example command failure error" ></DocsImage>

### Console output

Besides Commands being interactive, they also output additional debugging
information to your console.

Open up your Dev Tools and click on the `GET` for the `.action-email` class
selector.

<DocsImage src="/img/guides/first-test-console-output.png" alt="Test Runner with get command pinned and console log open showing the yielded element" ></DocsImage>

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
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

Now, when the test runs, Cypress provides us a UI (similar to debugger) to step
forward through each command in the test.

<DocsImage src="/img/guides/first-test-paused.png" alt="Test Runner shows label saying 'Paused' with Command Log showing 'Pause'" ></DocsImage>

In action:

<DocsVideo src="/img/snippets/first-test-debugging-30fps.mp4"></DocsVideo>

## History

| Version                                     | Changes                                 |
| ------------------------------------------- | --------------------------------------- |
| [3.5.0](/guides/references/changelog#3-5-0) | Added keyboard shortcuts to Test Runner |
| [1.3.0](/guides/references/changelog#1-3-0) | Added Selector Playground               |

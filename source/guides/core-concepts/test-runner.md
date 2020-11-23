---
title: The Test Runner
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- The names and purposes of the visual parts of the Cypress Test Runner
- How to use the Selector Playground for targeting your page elements
{% endnote %}

# Overview

Cypress runs tests in a unique interactive runner that allows you to see commands as they execute while also viewing the application under test.

{% imgTag /img/guides/gui-diagram.png "Cypress Test Runner" "no-border" %}

# Command Log

The lefthand side of the Test Runner is a visual representation of your test suite. Each test block is properly nested and each test, when clicked, displays every Cypress command and assertion executed within the test's block as well as any command or assertion executed in relevant `before`, `beforeEach`, `afterEach`, and `after` hooks.

{% imgTag /img/guides/command-log.png "Cypress Test Runner" width-600 %}

## Open files in your IDE

There are some places in the Command Log that display a link to the relevant file where the code is located. Clicking on this link will open the file in your {% url "preferred file opener" IDE-integration#File-Opener-Preference %}.

{% imgTag /img/guides/open-file-in-IDE.gif "Open file your IDE" %}

## Hovering on Commands

Each command and assertion, when hovered over, restores the Application Under Test (righthand side) to the state it was in when that command executed. This allows you to 'time-travel' back to previous states of your application when testing.

{% note info  %}
By default, Cypress keeps 50 tests worth of snapshots and command data for time traveling. If you are seeing extremely high memory consumption in your browser, you may want to lower the `numTestsKeptInMemory` in your {% url 'configuration' configuration#Global %}.
{% endnote %}

## Clicking on Commands

Each command, assertion, or error, when clicked on, displays extra information in the dev tools console. Clicking also 'pins' the Application Under Test (righthand side) to its previous state when the command executed.

{% imgTag /img/guides/clicking-commands.png "Click to console.log and to pin" %}

# Errors

Cypress prints several pieces of information when an error occurs during a Cypress test.

{% partial errors_anatomy %}

# Instrument Panel

For certain commands like {% url `cy.intercept()` intercept %}, {% url `cy.stub()` stub %}, and {% url `cy.spy()` spy %}, an extra instrument panel is displayed above the test to give more information about the state of your tests.

## Routes

{% imgTag /img/guides/instrument-panel-routes.png "Routes Instrument Panel" %}

## Stubs

{% imgTag /img/guides/instrument-panel-stubs.png "Stubs Instrument Panel" %}

## Spies

{% imgTag /img/guides/instrument-panel-spies.png "Spies Instrument Panel" %}

# Application Under Test

The righthand side of the Test Runner is used to display the Application Under Test (AUT): the application that was navigated to using a {% url `cy.visit()` visit %} or any subsequent routing calls made from the visited application.

In the example below, we wrote the following code in our test file:

```javascript
cy.visit('https://example.cypress.io')

cy.title().should('include', 'Kitchen Sink')
```

In the corresponding Application Preview below, you can see `https://example.cypress.io` is being displayed in the righthand side. Not only is the application visible, but it is fully interactable. You can open your developer tools to inspect elements as you would in your normal application. The DOM is completely available for debugging.

{% imgTag /img/guides/application-under-test.png "Application Under Test" %}

The AUT also displays in the size and orientation specified in your tests. You can change the size or orientation with the {% url `cy.viewport()` viewport %} command or in your {% url "Cypress configuration" configuration#Viewport %}. If the AUT does not fit within the current browser window, it is scaled appropriately to fit within the window.

The current size and scale of the AUT is displayed in the top right corner of the window.

The image below shows that our application is displaying at `1000px` width, `660px` height and scaled to `100%`.

{% imgTag /img/guides/viewport-scaling.png "Viewport Scaling" %}

*Note: The righthand side may also be used to display syntax errors in your test file that prevent the tests from running.*

{% imgTag /img/guides/errors.png "Errors" %}

*Note: Internally, the AUT renders within an iframe. This can sometimes cause unexpected behaviors {% url "explained here." /api/commands/window.html#Cypress-uses-2-different-windows %}*

# Selector Playground

The Selector Playground is an interactive feature that helps you:

- Determine a unique selector for an element.
- See what elements match a given selector.
- See what element matches a string of text.

{% video local /img/snippets/selector-playground.mp4 %}

## Uniqueness

Cypress will automatically calculate a **unique selector** to use targeted element by running through a series of selector strategies.

By default Cypress will favor:

1. `data-cy`
2. `data-test`
3. `data-testid`
4. `id`
5. `class`
6. `tag`
7. `attributes`
8. `nth-child`

{% note info "This is configurable" %}
Cypress allows you to control how a selector is determined.

Use the {% url "`Cypress.SelectorPlayground`" selector-playground-api %} API to control the selectors you want returned.
{% endnote %}

## Best Practices

You may find yourself struggling to write good selectors because:

- Your application uses dynamic ID's and class names
- Your tests break whenever there are CSS or content changes

To help with these common challenges, the Selector Playground automatically prefers certain `data-*` attributes when determining a unique selector.

Please read our {% url "Best Practices guide" best-practices#Selecting-Elements %} on helping you target elements and prevent tests from breaking on CSS or JS changes.

## Finding Selectors

To open the Selector Playground, click the `{% fa fa-crosshairs grey %}` button next to the URL at the top of the runner. Hover over elements in your app to preview a unique selector for that element in the tooltip.

{% imgTag /img/guides/test-runner/open-selector-playground.gif "Opening selector playground and hovering over elements" %}

Click on the element and its selector will appear at the top. From there, you can copy it to your clipboard (`{% fa fa-copy grey %}`) or print it to the console (`{% fa fa-terminal %}`).

{% imgTag /img/guides/test-runner/copy-selector-in-selector-playground.gif "Clicking an element, copying its selector to clipboard, printing it to the console" %}

## Running Experiments

The box at the top that displays the selector is also a text input.

### Editing a Selector

When you edit the selector, it will show you how many elements match and highlight those elements in your app.

{% imgTag /img/guides/test-runner/typing-a-selector-to-find-in-playground.gif "Type a selector to see what elements it matches" %}

### Switching to Contains

You can also experiment with what {% url `cy.contains()` contains %} would yield given a string of text. Click on `cy.get` and switch to `cy.contains`.

Type in text to see which element it matches. Note that {% url `cy.contains()` contains %} only yields the first element that matches the text, even if multiple elements on the page contain the text.

{% imgTag /img/guides/test-runner/cy-contains-in-selector-playground.gif "Experiment with cy.contains" %}

### Disabling Highlights

If you would like to interact with your app while the Selector Playground is open, the element highlighting might get in the way. Toggling the highlighting off will allow you to interact with your app more easily.

{% imgTag /img/guides/test-runner/turn-off-highlight-in-selector-playground.gif "Turn off highlighting" %}

# Keyboard Shortcuts

There are keyboard shortcuts to quickly perform common actions from within the Test Runner.

| Key      | Action |
| ----------- | ----------- |
| `r`      | Rerun tests       |
| `s`      | Stop tests        |
| `f`      | Bring focus to 'specs' window  |

{% imgTag /img/guides/test-runner/keyboard-shortcuts.png "Tooltips show keyboard shortcuts" %}

{% history %}
{% url "3.5.0" changelog#3-5-0 %} | Added keyboard shortcuts to Test Runner
{% url "1.3.0" changelog#1-3-0 %} | Added Selector Playground
{% endhistory %}

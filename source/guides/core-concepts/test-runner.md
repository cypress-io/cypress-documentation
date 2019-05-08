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

{% img no-border /img/guides/gui-diagram.png "Cypress Test Runner" %}

# Command Log

The lefthand side of the Test Runner is a visual representation of your test suite. Each test block is properly nested and each test, when clicked, displays every Cypress command and assertion executed within the test's block as well as any command or assertion executed in relevant `before`, `beforeEach`, `afterEach`, and `after` hooks.

{% img /img/guides/command-log.png 436 "Cypress Test Runner" %}

### Hovering on Commands

Each command and assertion, when hovered over, restores the Application Under Test (righthand side) to the state it was in when that command executed. This allows you to 'time-travel' back to previous states of your application when testing.

{% note info  %}
By default, Cypress keeps 50 tests worth of snapshots and command data for time traveling. If you are seeing extremely high memory consumption in your browser, you may want to lower the `numTestsKeptInMemory` in your {% url 'configuration' configuration#Global %}.
{% endnote %}

### Clicking on Commands

Each command, assertion, or error, when clicked on, displays extra information in the dev tools console. Clicking also 'pins' the Application Under Test (righthand side) to its previous state when the command executed.

{% img /img/guides/clicking-commands.png "Click to console.log and to pin" %}

# Instrument Panel

For certain commands like {% url `cy.route()` route %}, {% url `cy.stub()` stub %}, and {% url `cy.spy()` spy %}, an extra instrument panel is displayed above the test to give more information about the state of your tests.

### Routes:

{% img /img/guides/instrument-panel-routes.png "Routes Instrument Panel" %}

### Stubs:

{% img /img/guides/instrument-panel-stubs.png "Stubs Instrument Panel" %}

### Spies:

{% img /img/guides/instrument-panel-spies.png "Spies Instrument Panel" %}

# Application Under Test

The righthand side of the Test Runner is used to display the Application Under Test (AUT): the application that was navigated to using a {% url `cy.visit()` visit %} or any subsequent routing calls made from the visited application.

In the example below, we wrote the following code in our test file:

```javascript
cy.visit('https://example.cypress.io')

cy.title().should('include', 'Kitchen Sink')
```

In the corresponding Application Preview below, you can see `https://example.cypress.io` is being displayed in the righthand side. Not only is the application visible, but it is fully interactable. You can open your developer tools to inspect elements as you would your normal application. The DOM is completely available for debugging.

{% img /img/guides/application-under-test.png "Application Under Test" %}

The AUT also displays in the size and orientation specified in your tests. You can change the size or orientation with the {% url `cy.viewport()` viewport %} command or in your {% url "Cypress configuration" configuration#Viewport %}. If the AUT does not fit within the current browser window, it is scaled appropriately to fit within the window.

The current size and scale of the AUT is displayed in the top right corner of the window.

The image below shows that our application is displaying at `1000px` width, `660px` height and scaled to `100%`.

{% img /img/guides/viewport-scaling.png "Viewport Scaling" %}

*Note: The righthand side may also be used to display syntax errors in your test file that prevent the tests from running.*

{% img /img/guides/errors.png "Errors" %}

# Selector Playground

The Selector Playground is an interactive feature that helps you:

* Determine a unique selector for an element.
* See what elements match a given selector.
* See what element matches a string of text.

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

![Opening selector playground and hovering over elements](https://user-images.githubusercontent.com/1157043/36675057-ebec0caa-1ad5-11e8-9308-1497bddd84aa.gif)

Click on the element and its selector will appear at the top. From there, you can copy it to your clipboard (`{% fa fa-copy grey %}`) or print it to the console (`{% fa fa-terminal %}`).

![Clicking an element, copying its selector to clipboard, printing it to the console](https://user-images.githubusercontent.com/1157043/36675058-ebf76de8-1ad5-11e8-9aa8-57f997d6b469.gif)

## Running Experiments

The box at the top that displays the selector is also a text input.

### Editing a Selector

When you edit the selector, it will show you how many elements match and highlight those elements in your app.

![Type a selector to see what elements it matches](https://user-images.githubusercontent.com/1157043/36675059-ec04b89a-1ad5-11e8-8fec-273600912ce8.gif)

### Switching to Contains

You can also experiment with what {% url `cy.contains()` contains %} would yield given a string of text. Click on `cy.get` and switch to `cy.contains`.

Type in text to see which element it matches. Note that {% url `cy.contains()` contains %} only yields the first element that matches the text, even if multiple elements on the page contain the text.

![Experiment with cy.contains](https://user-images.githubusercontent.com/1157043/36675344-b312762a-1ad6-11e8-89c0-f7aebbe5a985.gif)

### Disabling Highlights

If you would like to interact with your app while the Selector Playground is open, the element highlighting might get in the way. Toggling the highlighting off will allow you to interact with your app more easily.

![Turn off highlighting](https://user-images.githubusercontent.com/1157043/36675343-b2fe0532-1ad6-11e8-82fe-369fdf0b1f5a.gif)

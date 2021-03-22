---
title: click
---

Click a DOM element.

## Syntax

```javascript
.click()
.click(options)
.click(position)
.click(position, options)
.click(x, y)
.click(x, y, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.btn').click() // Click on button
cy.focused().click() // Click on el with focus
cy.contains('Welcome').click() // Click on first el containing 'Welcome'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.click('.btn') // Errors, cannot be chained off 'cy'
cy.window().click() // Errors, 'window' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> position** **_(String)_**

The position where the click should be issued. The `center` position is the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

<DocsImage src="/img/api/coordinates-diagram.jpg" alt="cypress-command-positions-diagram" ></DocsImage>

**<Icon name="angle-right"></Icon> x** **_(Number)_**

The distance in pixels from the element's left to issue the click.

**<Icon name="angle-right"></Icon> y** **_(Number)_**

The distance in pixels from the element's top to issue the click.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.click()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `altKey`                     | `false`                                                                        | Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.                                                                       |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `ctrlKey`                    | `false`                                                                        | Activates the control key. Aliases: <code>controlKey</code>.                                                                                       |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `metaKey`                    | `false`                                                                        | Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>.                                |
| `multiple`                   | `false`                                                                        | Serially click multiple elements                                                                                                                   |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `shiftKey`                   | `false`                                                                        | Activates the shift key.                                                                                                                           |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.click()` to resolve before [timing out](#Timeouts)                                                                              |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.click()` yields the same subject it was given from the previous command.</li></List>

## Examples

### No Args

#### Click a link in a nav

```javascript
cy.get('.nav > a').click()
```

### Position

#### Specify a corner of the element to click

Click the top right corner of the button.

```javascript
cy.get('img').click('topRight')
```

### Coordinates

#### Specify explicit coordinates relative to the top left corner

The click below will be issued inside of the element (15px from the left and 40px from the top).

```javascript
cy.get('#top-banner').click(15, 40)
```

### Options

#### Force a click regardless of its actionable state

Forcing a click overrides the [actionable checks](/guides/core-concepts/interacting-with-elements#Forcing) Cypress applies and will automatically fire the events.

```javascript
cy.get('.close').as('closeBtn')
cy.get('@closeBtn').click({ force: true })
```

#### Force a click with position argument

```javascript
cy.get('#collapse-sidebar').click('bottomLeft', { force: true })
```

#### Force a click with relative coordinates

```javascript
cy.get('#footer .next').click(5, 60, { force: true })
```

#### Click all elements with id starting with 'btn'

By default, Cypress will error if you're trying to click multiple elements. By passing `{ multiple: true }` Cypress will iteratively apply the click to each element and will also log to the [Command Log](/guides/core-concepts/test-runner#Command-Log) multiple times.

```javascript
cy.get('[id^=btn]').click({ multiple: true })
```

#### Click with key combinations

The `.click()` command may also be fired with key modifiers in order to simulate holding key combinations while clicking, such as `ALT + click`.

<Alert type="info">

You can also use key combinations during [.type()](/api/commands/type). This offers options to hold down keys across multiple commands. See [Key Combinations](/api/commands/type#Key-Combinations) for more information.

</Alert>

The following keys can be combined with `.click()` through the `options`.

| Option     | Notes                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `altKey`   | Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.                                        |
| `ctrlKey`  | Activates the control key. Aliases: <code>controlKey</code>.                                                        |
| `metaKey`  | Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>. |
| `shiftKey` | Activates the shift key.                                                                                            |

#### Shift click

```js
// execute a SHIFT + click on the first <li>
cy.get('li:first').click({
  shiftKey: true,
})
```

## Notes

### Actionability

#### The element must first reach actionability

`.click()` is an "action command" that follows all the rules [defined here](/guides/core-concepts/interacting-with-elements).

### Focus

#### Focus is given to the first focusable element

For example, clicking a `<span>` inside of a `<button>` gives the focus to the button, since that's what would happen in a real user scenario.

However, Cypress additionally handles situations where a child descendent is clicked inside of a focusable parent, but actually isn't visually inside the parent (per the CSS Object Model). In those cases if no focusable parent is found the window is given focus instead (which matches real browser behavior).

### Cancellation

#### Mousedown cancellation will not cause focus

If the mousedown event has its default action prevented (`e.preventDefault()`) then the element will not receive focus as per the spec.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.click()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.click()` will automatically wait for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.click()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.click()` can time out waiting for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.click()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Click the button_**

```javascript
cy.get('.action-btn').click()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/click/click-button-in-form-during-test.png" alt="Command log for click" ></DocsImage>

When clicking on `click` within the command log, the console outputs the following:

<DocsImage src="/img/api/click/click-coords-and-events-in-console.png" alt="console.log for click" ></DocsImage>

## History

| Version                                     | Changes                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [6.1.0](/guides/references/changelog#6-1-0) | Added option `scrollBehavior`                                                                                       |
| [3.5.0](/guides/references/changelog#3-5-0) | Added sending `mouseover`, `mousemove`, `mouseout`, `pointerdown`, `pointerup`, and `pointermove` during `.click()` |

## See also

- [`.check()`](/api/commands/check)
- [`.click()` examples in kitchensink app](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/examples/actions.spec.js#L66 })
- [`.dblclick()`](/api/commands/dblclick)
- [`.rightclick()`](/api/commands/rightclick)
- [`.select()`](/api/commands/select)
- [`.submit()`](/api/commands/submit)
- [`.type()`](/api/commands/type)
- ['When can the test click?' blog](https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/)

---
title: rightclick
---

Right click a DOM element.

<Alert type="warning">

`.rightclick()` will not open context menus native to the browser.
`.rightclick()` should be used to test your app's handling of right click
related events such as `contextmenu`.

</Alert>

## Syntax

```javascript
.rightclick()
.rightclick(options)
.rightclick(position)
.rightclick(position, options)
.rightclick(x, y)
.rightclick(x, y, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.menu').rightclick() // Right click on .menu
cy.focused().rightclick() // Right click on el with focus
cy.contains('Today').rightclick() // Right click on first el containing 'Today'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.rightclick('button') // Errors, cannot be chained off 'cy'
cy.window().rightclick() // Errors, 'window' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> position** **_(String)_**

The position where the right click should be issued. The `center` position is
the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`,
`center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

<DocsImage src="/img/api/coordinates-diagram.jpg" alt="cypress-command-positions-diagram" ></DocsImage>

**<Icon name="angle-right"></Icon> x** **_(Number)_**

The distance in pixels from the element's left to issue the right click.

**<Icon name="angle-right"></Icon> y** **_(Number)_**

The distance in pixels from the element's top to issue the right click.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.rightclick()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `altKey`                     | `false`                                                                        | Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.                                                                       |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `ctrlKey`                    | `false`                                                                        | Activates the control key. Aliases: <code>controlKey</code>.                                                                                       |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `metaKey`                    | `false`                                                                        | Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>.                                |
| `multiple`                   | `false`                                                                        | Serially click multiple elements                                                                                                                   |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `shiftKey`                   | `false`                                                                        | Activates the shift key.                                                                                                                           |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.rightclick()` to resolve before [timing out](#Timeouts)                                                                         |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.rightclick()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### No Args

#### Right click the menu

```javascript
cy.get('#open-menu').rightclick()
```

### Position

#### Specify a corner of the element to right click

Right click the top right corner of the DOM element.

```javascript
cy.get('#open-menu').rightclick('topRight')
```

### Coordinates

#### Specify explicit coordinates relative to the top left corner

The right click below will be issued inside of the element (15px from the left
and 40px from the top).

```javascript
cy.get('#open-menu').rightclick(15, 40)
```

### Options

#### Force a right click regardless of its actionable state

Forcing a right click overrides the
[actionable checks](/guides/core-concepts/interacting-with-elements#Forcing)
Cypress applies and will automatically fire the events.

```javascript
cy.get('#open-menu').rightclick({ force: true })
```

#### Force a right click with position argument

```javascript
cy.get('#open-menu').rightclick('bottomLeft', { force: true })
```

#### Force a right click with relative coordinates

```javascript
cy.get('#open-menu').rightclick(5, 60, { force: true })
```

#### Right click all buttons found on the page

By default, Cypress will error if you're trying to right click multiple
elements. By passing `{ multiple: true }` Cypress will iteratively apply the
right click to each element and will also log to the
[Command Log](/guides/core-concepts/test-runner#Command-Log) multiple times.

```javascript
cy.get('.open-menu').rightclick({ multiple: true })
```

#### Right click with key combinations

The `.rightclick()` command may also be fired with key modifiers in order to
simulate holding key combinations while right clicking, such as
`ALT + rightclick`.

<Alert type="info">

You can also use key combinations during [.type()](/api/commands/type). This
offers options to hold down keys across multiple commands. See
[Key Combinations](/api/commands/type#Key-Combinations) for more information.

</Alert>

The following key can be combined with `.rightclick()` through the `options`..

| Option     | Notes                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `altKey`   | Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.                                        |
| `ctrlKey`  | Activates the control key. Aliases: <code>controlKey</code>.                                                        |
| `metaKey`  | Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>. |
| `shiftKey` | Activates the shift key.                                                                                            |

##### Command right click

```js
// execute a CMD + right click on the .menu-item
cy.get('.menu-item').rightclick({
  metaKey: true,
})
```

## Notes

### Actionability

#### The element must first reach actionability

`.rightclick()` is an "action command" that follows all the rules of
[Actionability](/guides/core-concepts/interacting-with-elements).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.rightclick()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.rightclick()` will automatically wait for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.rightclick()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.rightclick()` can time out waiting for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.rightclick()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Right click the DOM element_**

```javascript
cy.get('.rightclick-action-div').rightclick()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/rightclick/rightclick-dom-element-in-command-log.png" alt="Command log for right click" ></DocsImage>

When clicking on `rightclick` within the command log, the console outputs the
following:

<DocsImage src="/img/api/rightclick/rightclick-console-log-with-mouse-events.png" alt="console.log for right click" ></DocsImage>

## History

| Version                                     | Changes                       |
| ------------------------------------------- | ----------------------------- |
| [6.1.0](/guides/references/changelog#6-1-0) | Added option `scrollBehavior` |
| [3.5.0](/guides/references/changelog#3-5-0) | `.rightclick()` command added |

## See also

- [`.click()`](/api/commands/click)
- [`.dblclick()`](/api/commands/dblclick)
- [`.trigger()`](/api/commands/trigger)

---
title: dblclick
---

Double-click a DOM element.

## Syntax

```javascript
.dblclick()
.dblclick(options)
.dblclick(position)
.dblclick(position, options)
.dblclick(x, y)
.dblclick(x, y, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get("button").dblclick(); // Double click on button
cy.focused().dblclick(); // Double click on el with focus
cy.contains("Welcome").dblclick(); // Double click on first el containing 'Welcome'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.dblclick("button"); // Errors, cannot be chained off 'cy'
cy.window().dblclick(); // Errors, 'window' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> position** **_(String)_**

The position where the double click should be issued. The `center` position is the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

<DocsImage src="/img/api/coordinates-diagram.jpg" alt="cypress-command-positions-diagram" ></DocsImage>

**<Icon name="angle-right"></Icon> x** **_(Number)_**

The distance in pixels from the element's left to issue the double click.

**<Icon name="angle-right"></Icon> y** **_(Number)_**

The distance in pixels from the element's top to issue the double click.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.dblclick()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `altKey`                     | `false`                                                                        | Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.                                                                       |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `ctrlKey`                    | `false`                                                                        | Activates the control key. Aliases: <code>controlKey</code>.                                                                                       |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `metaKey`                    | `false`                                                                        | Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>.                                |
| `multiple`                   | `true`                                                                         | Serially click multiple elements                                                                                                                   |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `shiftKey`                   | `false`                                                                        | Activates the shift key.                                                                                                                           |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.dblclick()` to resolve before [timing out](#Timeouts)                                                                           |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.dblclick()` yields the same subject it was given from the previous command.</li></List>

## Examples

### No Args

#### Double click an anchor link

```javascript
cy.get("a#nav1").dblclick(); // yields the <a>
```

### Position

#### Specify a position of the element to double click

Click the bottom center of the button.

```javascript
cy.get("button").dblclick("bottom");
```

### Coordinates

#### Specify coordinates relative to the top left corner

The double click below will be issued inside of the element (30px from the left and 10px from the top).

```javascript
cy.get("button").dblclick(30, 10);
```

### Options

#### Force a double click regardless of its actionable state

Forcing a double click overrides the [actionable checks](/guides/core-concepts/interacting-with-elements#Forcing) Cypress applies and will automatically fire the events.

```javascript
cy.get("button").dblclick({ force: true });
```

#### Force a double click with position argument

```javascript
cy.get("button").dblclick("topRight", { force: true });
```

#### Force a double click with relative coordinates

```javascript
cy.get("button").dblclick(60, 60, { force: true });
```

#### Double click all buttons found on the page

By default, Cypress will iteratively apply the double click to each element and will also log to the [Command Log](/guides/core-concepts/test-runner#Command-Log) multiple times.

You can turn this off by passing `multiple: false` to `.dblclick()`.

```javascript
cy.get("button").dblclick({ multiple: false });
```

#### Double click with key combinations

The `.dblclick()` command may also be fired with key modifiers in order to simulate holding key combinations while double clicking, such as `SHIFT + double click`.

<Alert type="info">

You can also use key combinations during [.type()](/api/commands/type). This offers options to hold down keys across multiple commands. See [Key Combinations](/api/commands/type#Key-Combinations) for more information.

</Alert>

The following modifiers can be combined with `.dblclick()`.

| Option     | Notes                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `altKey`   | Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.                                        |
| `ctrlKey`  | Activates the control key. Aliases: <code>controlKey</code>.                                                        |
| `metaKey`  | Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>. |
| `shiftKey` | Activates the shift key.                                                                                            |

##### Alt click

```js
// execute ALT + dblclick on the first <li>
cy.get("li:first").dblclick({
  altKey: true,
});
```

## Notes

### Actionability

#### The element must first reach actionability

`.dblclick()` is an "action command" that follows all the rules [defined here](/guides/core-concepts/interacting-with-elements).

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.dblclick()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.dblclick` will automatically wait for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.dblclick` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.dblclick()` can time out waiting for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.dblclick()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Double click on a div_**

```javascript
cy.get(".action-div").dblclick();
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/dblclick/double-click-in-testing.png" alt="Command Log dblclick" ></DocsImage>

When clicking on `dblclick` within the command log, the console outputs the following:

<DocsImage src="/img/api/dblclick/element-double-clicked-on.png" alt="console.log dblclick" ></DocsImage>

## History

| Version                                     | Changes                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [6.1.0](/guides/references/changelog#6-1-0) | Added option `scrollBehavior`                                                                                           |
| [3.5.0](/guides/references/changelog#3-5-0) | Added support for options `force` and `multiple`.                                                                       |
| [3.5.0](/guides/references/changelog#3-5-0) | Added support for `position`, `x`, and `y` arguments.                                                                   |
| [3.5.0](/guides/references/changelog#3-5-0) | Added sending `mouseover`, `mousemove`, `mouseout`, `pointerdown`, `pointerup`, and `pointermove` during `.dblclick()`. |

## See also

- [`.click()`](/api/commands/click)
- [`.rightclick()`](/api/commands/rightclick)

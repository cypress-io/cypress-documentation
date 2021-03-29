---
title: trigger
---

Trigger an event on a DOM element.

## Syntax

```javascript
.trigger(eventName)
.trigger(eventName, position)
.trigger(eventName, options)
.trigger(eventName, x, y)
.trigger(eventName, position, options)
.trigger(eventName, x, y, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('a').trigger('mousedown') // Trigger mousedown event on link
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.trigger('touchstart') // Errors, cannot be chained off 'cy'
cy.location().trigger('mouseleave') // Errors, 'location' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> eventName** **_(String)_**

The name of the `event` to be triggered on the DOM element.

**<Icon name="angle-right"></Icon> position** **_(String)_**

The position where the event should be triggered. The `center` position is the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

<DocsImage src="/img/api/coordinates-diagram.jpg" alt="cypress-command-positions-diagram" ></DocsImage>

**<Icon name="angle-right"></Icon> x** **_(Number)_**

The distance in pixels from element's left to trigger the event.

**<Icon name="angle-right"></Icon> y** **_(Number)_**

The distance in pixels from element's top to trigger the event.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.trigger()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `bubbles`                    | `true`                                                                         | Whether the event bubbles                                                                                                                          |
| `cancelable`                 | `true`                                                                         | Whether the event is cancelable                                                                                                                    |
| `eventConstructor`           | `Event`                                                                        | The constructor for creating the event object (e.g. `MouseEvent`, `KeyboardEvent`)                                                                 |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.trigger()` to resolve before [timing out](#Timeouts)                                                                            |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

You can also include arbitrary event properties (e.g. `clientX`, `shiftKey`) and they will be attached to the event. Passing in coordinate arguments (`clientX`, `pageX`, etc) will override the position coordinates.

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.trigger()` yields the same subject it was given from the previous command.</li></List>

## Examples

### Mouse Events

#### Trigger a `mouseover` on the button

The DOM element must be in an "interactable" state prior to the triggered event happening (it must be visible and not disabled).

```javascript
cy.get('button').trigger('mouseover') // yields 'button'
```

#### Simulate a "long press" event

```javascript
cy.get('.target').trigger('mousedown')
cy.wait(1000)
cy.get('.target').trigger('mouseup')
```

#### Trigger a `mousedown` from a specific mouse button

```js
// Main button pressed (usually the left button)
cy.get('.target').trigger('mousedown', { button: 0 })
// Auxiliary button pressed (usually the middle button)
cy.get('.target').trigger('mousedown', { button: 1 })
//Secondary button pressed (usually the right button)
cy.get('.target').trigger('mousedown', { button: 2 })
```

#### jQuery UI Sortable

To simulate drag and drop using jQuery UI sortable requires `pageX` and `pageY` properties along with `which:1`.

```javascript
cy.get('[data-cy=draggable]')
  .trigger('mousedown', { which: 1, pageX: 600, pageY: 100 })
  .trigger('mousemove', { which: 1, pageX: 600, pageY: 600 })
  .trigger('mouseup')
```

#### Drag and Drop

<Alert type="info">

[Check out our example recipe triggering mouse and drag events to test drag and drop](/examples/examples/recipes#Testing-the-DOM)

</Alert>

### Change Event

#### Interact with a range input (slider)

To interact with a range input (slider), we need to set its value and
then trigger the appropriate event to signal it has changed.

Below we invoke jQuery's `val()` method to set the value, then trigger the `change` event.

Note that some implementations may rely on the `input` event instead, which is fired as a user moves the slider, but is not supported by some browsers.

```javascript
cy.get('input[type=range]').as('range').invoke('val', 25).trigger('change')

cy.get('@range').siblings('p').should('have.text', '25')
```

### Position

#### Trigger a `mousedown` on the top right of a button

```javascript
cy.get('button').trigger('mousedown', 'topRight')
```

### Coordinates

#### Specify explicit coordinates relative to the top left corner

```javascript
cy.get('button').trigger('mouseup', 15, 40)
```

### Options

#### Specify that the event should not bubble

By default, the event will bubble up the DOM tree. This will prevent the event from bubbling.

```javascript
cy.get('button').trigger('mouseover', { bubbles: false })
```

#### Specify the exact `clientX` and `clientY` the event should have

This overrides the default auto-positioning based on the element itself. Useful for events like `mousemove` where you need the position to be outside the element itself.

```javascript
cy.get('button').trigger('mousemove', { clientX: 200, clientY: 300 })
```

### Fire other Event types.

By default, `cy.trigger()` fires [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). But you may want to trigger other events like `MouseEvent` or `KeyboardEvent`.

In that case, use the `eventConstructor` option.

```js
cy.get('button').trigger('mouseover', { eventConstructor: 'MouseEvent' })
```

## Notes

### Actionability

#### The element must first reach actionability

`.trigger()` is an "action command" that follows all the rules [defined here](/guides/core-concepts/interacting-with-elements).

### Events

#### What event should I fire?

`cy.trigger()` is meant to be a low-level utility that makes triggering events easier than manually constructing and dispatching them. Since any arbitrary event can be triggered, Cypress tries not to make any assumptions about how it should be triggered. This means you'll need to know the implementation details (which may be in a 3rd party library) of the event handler(s) receiving the event and provide the necessary properties.

#### Why should I manually set the event type?

As you can see the documentation of [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), most properties of event class instances are read-only. Because of that, it's sometimes impossible to set the value of some properties like `pageX`, `pageY`. This can be problematic in when testing some situations.

### Differences

#### What's the difference between triggering and event and calling the corresponding cypress command?

In other words, what's the difference between:

```javascript
cy.get('button').trigger('focus')
cy.get('button').focus()

// ... or ...

cy.get('button').trigger('click')
cy.get('button').click()
```

Both types commands will first verify element actionability, but only the "true" action commands will implement all of the default actions of the browser, and additionally perform low level actions to fulfill what's defined in the spec.

`.trigger()` will _only_ fire the corresponding event and do nothing else.

That means that your event listener callbacks will be invoked, but don't expect the browser to actually "do" anything for these events. For the most part, it shouldn't matter, which is why `.trigger()` is an excellent stop-gap if the command / event you're looking for hasn't been implemented yet.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.trigger()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.trigger()` will automatically wait for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.trigger()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.trigger()` can time out waiting for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.trigger()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Trigger a `change` event on input type='range'_**

```javascript
cy.get('.trigger-input-range').invoke('val', 25).trigger('change')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/trigger/command-log-trigger.png" alt="command log trigger" ></DocsImage>

When clicking on `trigger` within the command log, the console outputs the following:

<DocsImage src="/img/api/trigger/console-log-trigger.png" alt="console log trigger" ></DocsImage>

## History

| Version                                       | Changes                                            |
| --------------------------------------------- | -------------------------------------------------- |
| [6.1.0](/guides/references/changelog#6-1-0)   | Added option `scrollBehavior`                      |
| [3.5.0](/guides/references/changelog#3-5-0)   | Added `screenX` and `screenY` properties to events |
| [0.20.0](/guides/references/changelog#0-20-0) | `.trigger()` command added                         |

## See also

- [`.blur()`](/api/commands/blur)
- [`.check()`](/api/commands/check)
- [`.click()`](/api/commands/click)
- [`.focus()`](/api/commands/focus)
- [`.rightclick()`](/api/commands/rightclick)
- [`.select()`](/api/commands/select)
- [`.submit()`](/api/commands/submit)
- [`.type()`](/api/commands/type)
- [`.uncheck()`](/api/commands/uncheck)

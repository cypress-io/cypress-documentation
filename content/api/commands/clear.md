---
title: clear
---

Clear the value of an `input` or `textarea`.

<Alert type="info">

An alias for [`.type('{selectall}{backspace}')`](/api/commands/type)

</Alert>

## Syntax

```javascript
.clear()
.clear(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('[type="text"]').clear() // Clear text input
cy.get('textarea').type('Hi!').clear() // Clear textarea
cy.focused().clear() // Clear focused input/textarea
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.clear() // Errors, cannot be chained off 'cy'
cy.get('nav').clear() // Errors, 'get' doesn't yield input or textarea
cy.url().clear() // Errors, 'url' doesn't yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.clear()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.clear()` to resolve before [timing out](#Timeouts)                                                                              |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.clear()` yields the same subject it was given from the previous command.</li></List>

## Examples

### No Args

#### Clear the input and type a new value

```javascript
cy.get('textarea').clear().type('Hello, World')
```

## Notes

### Actionability

#### The element must first reach actionability

`.clear()` is an "action command" that follows all the rules [defined here](/guides/core-concepts/interacting-with-elements).

### Documentation

`.clear()` is an alias for [`.type({selectall}{backspace})`](/api/commands/type).

Please read the [`.type()`](/api/commands/type) documentation for more details.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.clear()` requires being chained off a command that yields DOM element(s).</li><li>`.clear()` requires the element to be an `input` or `textarea`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.clear()` will automatically wait for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.clear()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.clear()` can time out waiting for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.clear()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Clear the input and type a new value_**

```javascript
cy.get('input[name="name"]').clear().type('Jane Lane')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/clear/clear-input-in-cypress.png" alt="Command log for clear" ></DocsImage>

When clicking on `clear` within the command log, the console outputs the following:

<DocsImage src="/img/api/clear/one-input-cleared-in-tests.png" alt="console.log for clear" ></DocsImage>

## See also

- [`.blur()`](/api/commands/blur)
- [`.focus()`](/api/commands/focus)
- [`.type()`](/api/commands/type)

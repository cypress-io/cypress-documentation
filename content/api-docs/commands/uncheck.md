---
title: uncheck
---

Uncheck checkbox(es).

## Syntax

```javascript
.uncheck()
.uncheck(value)
.uncheck(values)
.uncheck(options)
.uncheck(value, options)
.uncheck(values, options)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.get('[type="checkbox"]').uncheck() // Unchecks checkbox element
```

**<Icon name="exclamation-triangle" color="red"/> Incorrect Usage**

```javascript
cy.uncheck('[type="checkbox"]') // Errors, cannot be chained off 'cy'
cy.get('p:first').uncheck() // Errors, '.get()' does not yield checkbox
```

### Arguments

**<Icon name="angle-right"/> value** **_(String)_**

Value of checkbox that should be unchecked.

**<Icon name="angle-right"/> values** **_(Array)_**

Values of checkboxes that should be unchecked.

**<Icon name="angle-right"/> options** **_(Object)_**

Pass in an options object to change the default behavior of `.uncheck()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.uncheck()` to resolve before [timing out](#Timeouts)                                                                            |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.uncheck()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### No Args

#### Uncheck all checkboxes

```javascript
cy.get(':checkbox').uncheck()
```

#### Uncheck element with the id 'saveUserName'

```javascript
cy.get('#saveUserName').uncheck()
```

### Value

#### Uncheck the checkbox with the value of 'ga'

```javascript
cy.get('input[type="checkbox"]').uncheck(['ga'])
```

### Values

#### Uncheck the checkboxes with the values 'ga' and 'ca'

```javascript
cy.get('[type="checkbox"]').uncheck(['ga', 'ca'])
```

## Notes

### Actionability

#### The element must first reach actionability

`.uncheck()` is an "action command" that follows all the rules
[defined here](/guides/core-concepts/interacting-with-elements).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.uncheck()` requires being chained off a command that yields DOM
element(s).</li><li>.uncheck() requires the element to have type
`checkbox`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.uncheck()` will automatically wait for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.uncheck()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.uncheck()` can time out waiting for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.uncheck()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Uncheck the first checkbox_**

```javascript
cy.get('[data-js="choose-all"]').click().find('input[type="checkbox"]').first().uncheck()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/uncheck/test-unchecking-a-checkbox.png" alt="Command Log uncheck" />

When clicking on `uncheck` within the command log, the console outputs the
following:

<DocsImage src="/img/api/uncheck/console-shows-events-from-clicking-the-checkbox.png" alt="Console Log uncheck" />

## History

| Version                                       | Changes                       |
| --------------------------------------------- | ----------------------------- |
| [6.1.0](/guides/references/changelog#6-1-0)   | Added option `scrollBehavior` |
| [0.6.12](/guides/references/changelog#0-6-12) | Added option `force`          |
| [0.3.3](/guides/references/changelog#0-3-3)   | `.uncheck()` command added    |

## See also

- [`.check()`](/api/commands/check)
- [`.click()`](/api/commands/click)

---
title: scrollIntoView
---

Scroll an element into view.

## Syntax

```javascript
.scrollIntoView()
.scrollIntoView(options)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.get('footer').scrollIntoView() // Scrolls 'footer' into view
```

**<Icon name="exclamation-triangle" color="red"/> Incorrect Usage**

```javascript
cy.scrollIntoView('footer') // Errors, cannot be chained off 'cy'
cy.window().scrollIntoView() // Errors, 'window' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"/> options** **_(Object)_**

Pass in an options object to change the default behavior of `.scrollIntoView()`.

| Option     | Default                                                              | Description                                                                              |
| ---------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `duration` | `0`                                                                  | Scrolls over the duration (in ms)                                                        |
| `easing`   | `swing`                                                              | Will scroll with the easing animation                                                    |
| `log`      | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `offset`   | `{top: 0, left: 0}`                                                  | Amount to scroll after the element has been scrolled into view                           |
| `timeout`  | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.scrollIntoView()` to resolve before [timing out](#Timeouts)           |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.scrollIntoView()` yields the same subject it was given from the
previous command.</li></List>

## Examples

### Scrolling

```javascript
cy.get('button#checkout').scrollIntoView().should('be.visible')
```

### Options

#### Use linear easing animation to scroll

```javascript
cy.get('.next-page').scrollIntoView({ easing: 'linear' })
```

#### Scroll to element over 2000ms

```javascript
cy.get('footer').scrollIntoView({ duration: 2000 })
```

#### Scroll 150px below an element

```js
cy.get('#nav').scrollIntoView({ offset: { top: 150, left: 0 } })
```

## Notes

### Snapshots

#### Snapshots do not reflect scroll behavior

_Cypress does not reflect the accurate scroll positions of any elements within
snapshots._ If you want to see the actual scrolling behavior in action, we
recommend using [`.pause()`](/api/commands/pause) to walk through each command
or
[watching the video of the test run](/guides/guides/screenshots-and-videos#Videos).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.scrollIntoView()` requires being chained off a command that yields
DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.scrollIntoView()` will automatically wait for assertions you have
chained to pass</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.scrollIntoView()` can time out waiting for assertions you've added
to pass.</li></List>

## Command Log

#### Assert element is visible after scrolling it into view

```javascript
cy.get('#scroll-horizontal button').scrollIntoView().should('be.visible')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/scrollintoview/command-log-for-scrollintoview.png" alt="command log scrollintoview" />

When clicking on the `scrollintoview` command within the command log, the
console outputs the following:

<DocsImage src="/img/api/scrollintoview/console-log-for-scrollintoview.png" alt="console.log scrollintoview" />

## See also

- [`cy.scrollTo()`](/api/commands/scrollto)

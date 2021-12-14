---
title: scrollTo
---

Scroll to a specific position.

## Syntax

```javascript
cy.scrollTo(position)
cy.scrollTo(x, y)
cy.scrollTo(position, options)
cy.scrollTo(x, y, options)

  // ---or---

  .scrollTo(position)
  .scrollTo(x, y)
  .scrollTo(position, options)
  .scrollTo(x, y, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.scrollTo(0, 500) // Scroll the window 500px down
cy.get('.sidebar').scrollTo('bottom') // Scroll 'sidebar' to its bottom
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.title().scrollTo('My App') // Errors, 'title' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> position** **_(String)_**

A specified position to scroll the window or element to. Valid positions are
`topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`,
and `bottomRight`.

<DocsImage src="/img/api/coordinates-diagram.jpg" alt="cypress-command-positions-diagram" ></DocsImage>

**<Icon name="angle-right"></Icon> x** **_(Number, String)_**

The distance in pixels from window/element's left or percentage of the
window/element's width to scroll to.

**<Icon name="angle-right"></Icon> y** **_(Number, String)_**

The distance in pixels from window/element's top or percentage of the
window/element's height to scroll to.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.scrollTo()`.

| Option             | Default                                                              | Description                                                                              |
| ------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `duration`         | `0`                                                                  | Scrolls over the duration (in ms)                                                        |
| `easing`           | `swing`                                                              | Will scroll with the easing animation                                                    |
| `ensureScrollable` | `true`                                                               | Ensure element is scrollable. Error if element cannot scroll.                            |
| `log`              | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout`          | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.scrollTo()` to resolve before [timing out](#Timeouts)                 |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.scrollTo()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### Position

#### Scroll to the bottom of the window

```javascript
cy.scrollTo('bottom')
```

#### Scroll to the center of the list

```javascript
cy.get('#movies-list').scrollTo('center')
```

### Coordinates

#### Scroll 500px down the list

```javascript
cy.get('#infinite-scroll-list').scrollTo(0, 500)
```

#### Scroll the window 500px to the right

```javascript
cy.scrollTo('500px')
```

#### Scroll 25% down the element's height

```javascript
cy.get('.user-photo').scrollTo('0%', '25%')
```

### Options

#### Use linear easing animation to scroll

```javascript
cy.get('.documentation').scrollTo('top', { easing: 'linear' })
```

#### Scroll to the right over 2000ms

```javascript
cy.get('#slider').scrollTo('right', { duration: 2000 })
```

#### Do not error if element is not scrollable

Let's say we do not know whether our `table` element is scrollable. Sometimes
the `table` may be scrollable (with 2,000 rows) and sometimes the `table` may
not be scrollable (with 5 rows). You can ignore the error checking to ensure the
element is scrollable by passing `ensureScrollable: false`.

```js
// will move on to next command even if table is not scrollable
cy.get('table').scrollTo('bottom', { ensureScrollable: false })
cy.get('table').find('tr:last-child').should('be.visible')
```

## Notes

### Actionability

`cy.scrollTo()` is an "action command" that follows all the rules
of [Actionability](/guides/core-concepts/interacting-with-elements).

### Scopes

`cy.scrollTo()` acts differently whether it's starting a series of commands or
being chained off of an existing.

#### When starting a series of commands:

This scrolls the `window`.

```javascript
cy.scrollTo('bottom')
```

#### When chained to an existing series of commands:

This will scroll the `<#checkout-items>` element.

```javascript
cy.get('#checkout-items').scrollTo('right')
```

### Snapshots

#### Snapshots do not reflect scroll behavior

_Cypress does not reflect the accurate scroll positions of any elements within
snapshots._ If you want to see the actual scrolling behavior in action, we
recommend using [`.pause()`](/api/commands/pause) to walk through each command
or
[watching the video of the test run](/guides/guides/screenshots-and-videos#Videos).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.scrollTo()` requires being chained off a command that yields DOM
element(s).</li><li>`.scrollTo()` requires the element to be
scrollable.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.scrollTo()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Scroll to the bottom of the window then scroll the element to the "right"_**

```javascript
cy.scrollTo('bottom')
cy.get('#scrollable-horizontal').scrollTo('right')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/scrollto/command-log-scrollto.png" alt="command log for scrollTo" ></DocsImage>

When clicking on `scrollTo` within the command log, the console outputs the
following:

<DocsImage src="/img/api/scrollto/console-log-scrollto.png" alt="console.log for scrollTo" ></DocsImage>

## History

| Version                                       | Changes                                      |
| --------------------------------------------- | -------------------------------------------- |
| [4.11.0](/guides/references/changelog#4-11-0) | Added support for `ensureScrollable` option. |

## See also

- [`.scrollIntoView()`](/api/commands/scrollintoview)

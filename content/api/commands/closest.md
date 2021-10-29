---
title: closest
---

Get the first DOM element that matches the selector (whether it be itself or one
of its ancestors).

<Alert type="info">

The querying behavior of this command matches exactly how
[`.closest()`](http://api.jquery.com/closest) works in jQuery.

</Alert>

## Syntax

```javascript
.closest(selector)
.closest(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('td').closest('.filled') // Yield closest el with class '.filled'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.closest('.active') // Errors, cannot be chained off 'cy'
cy.clock().closest() // Errors, 'clock' does not yield DOM elements
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.closest()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.closest()` to resolve before [timing out](#Timeouts)                  |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.closest()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Find the closest element of the `.error` with the class 'banner'

```javascript
cy.get('p.error').closest('.banner')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.closest()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.closest()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.closest()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.closest()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.closest()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

#### Find the closest element of `li.active` with the class 'nav'

```javascript
cy.get('li.active').closest('.nav')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/closest/find-closest-nav-element-in-test.png" alt="Command Log closest" ></DocsImage>

When clicking on the `closest` command within the command log, the console
outputs the following:

<DocsImage src="/img/api/closest/closest-console-logs-elements-found.png" alt="console.log closest" ></DocsImage>

## See also

- [`.first()`](/api/commands/first)
- [`.parent()`](/api/commands/parent)
- [`.parents()`](/api/commands/parents)
- [`.parentsUntil()`](/api/commands/parentsuntil)
- [`.prev()`](/api/commands/prev)
- [`.prevAll()`](/api/commands/prevall)
- [`.prevUntil()`](/api/commands/prevuntil)

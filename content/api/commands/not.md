---
title: not
---

Filter DOM element(s) from a set of DOM elements.

<Alert type="info">

Opposite of [`.filter()`](/api/commands/filter)

</Alert>

<Alert type="info">

The querying behavior of this command matches exactly how [`.not()`](http://api.jquery.com/not) works in jQuery.

</Alert>

## Syntax

```javascript
.not(selector)
.not(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('input').not('.required') // Yield all inputs without class '.required'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.not('.icon') // Errors, cannot be chained off 'cy'
cy.location().not() // Errors, 'location' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to remove matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.not()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.not()` to resolve before [timing out](#Timeouts)                      |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.not()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Yield the elements that do not have class `active`

```html
<ul>
  <li>Home</li>
  <li class="active">About</li>
  <li>Services</li>
  <li>Pricing</li>
  <li>Contact</li>
</ul>
```

```javascript
cy.get('ul>li').not('.active').should('have.length', 4) // true
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.not()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.not()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.not()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.not()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.not()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find all buttons that are not of type submit_**

```javascript
cy.get('form').find('button').not('[type="submit"]')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/not/filter-elements-with-not-and-optional-selector.png" alt="Command Log not" ></DocsImage>

When clicking on `not` within the command log, the console outputs the following:

<DocsImage src="/img/api/not/log-elements-found-when-using-cy-not.png" alt="Console Log not" ></DocsImage>

## See also

- [`.filter()`](/api/commands/filter)

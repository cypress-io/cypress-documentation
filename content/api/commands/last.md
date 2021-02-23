---
title: last
---

Get the last DOM element within a set of DOM elements.

<Alert type="info">

The querying behavior of this command matches exactly how [`.last()`](http://api.jquery.com/last) works in jQuery.

</Alert>

## Syntax

```javascript
.last()
.last(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get("nav a").last(); // Yield last link in nav
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.last(); // Errors, cannot be chained off 'cy'
cy.getCookies().last(); // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.last()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.last()` to resolve before [timing out](#Timeouts)                     |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.last()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the last list item in a list

```html
<ul>
  <li class="one">Knick knack on my thumb</li>
  <li class="two">Knick knack on my shoe</li>
  <li class="three">Knick knack on my knee</li>
  <li class="four">Knick knack on my door</li>
</ul>
```

```javascript
// yields <li class="four">Knick knack on my door</li>
cy.get("li").last();
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.last()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.last` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.last` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.last()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.last()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find the last button in the form_**

```javascript
cy.get("form").find("button").last();
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/last/find-the-last-button-in-a-form.png" alt="Command Log for last" ></DocsImage>

When clicking on `last` within the command log, the console outputs the following:

<DocsImage src="/img/api/last/inspect-last-element-in-console.png" alt="Console Log for last" ></DocsImage>

## See also

- [`.eq()`](/api/commands/eq)
- [`.first()`](/api/commands/first)

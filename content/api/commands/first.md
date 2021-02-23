---
title: first
---

Get the first DOM element within a set of DOM elements.

<Alert type="info">

The querying behavior of this command matches exactly how [`.first()`](http://api.jquery.com/first) works in jQuery.

</Alert>

## Syntax

```javascript
.first()
.first(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get("nav a").first(); // Yield first link in nav
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.first(); // Errors, cannot be chained off 'cy'
cy.getCookies().first(); // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.first()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.first()` to resolve before [timing out](#Timeouts)                    |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.first()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the first list item in a list

```html
<ul>
  <li class="one">Knick knack on my thumb</li>
  <li class="two">Knick knack on my shoe</li>
  <li class="three">Knick knack on my knee</li>
  <li class="four">Knick knack on my door</li>
</ul>
```

```javascript
// yields <li class="one">Knick knack on my thumb</li>
cy.get("li").first();
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.first()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.first` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.first` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.first()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.first()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find the first input in the form_**

```javascript
cy.get("form").find("input").first();
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/first/get-the-first-in-list-of-elements.png" alt="Command Log first" ></DocsImage>

When clicking on `first` within the command log, the console outputs the following:

<DocsImage src="/img/api/first/console-log-the-first-element.png" alt="console.log first" ></DocsImage>

## See also

- [`.eq()`](/api/commands/eq)
- [`.last()`](/api/commands/last)

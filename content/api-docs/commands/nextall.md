---
title: nextAll
---

Get all following siblings of each DOM element in a set of matched DOM elements.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.nextAll()`](http://api.jquery.com/nextAll) works in jQuery.

</Alert>

## Syntax

```javascript
.nextAll()
.nextAll(selector)
.nextAll(options)
.nextAll(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.get('.active').nextAll() // Yield all links next to `.active`
```

**<Icon name="exclamation-triangle" color="red"/> Incorrect Usage**

```javascript
cy.nextAll() // Errors, cannot be chained off 'cy'
cy.getCookies().nextAll() // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"/> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"/> options** **_(Object)_**

Pass in an options object to change the default behavior of `.nextAll()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.nextAll()` to resolve before [timing out](#Timeouts)                  |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.nextAll()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Find all of the element's siblings following `.second`

```html
<ul>
  <li>apples</li>
  <li class="second">oranges</li>
  <li>bananas</li>
  <li>pineapples</li>
  <li>grapes</li>
</ul>
```

```javascript
// yields [<li>bananas</li>, <li>pineapples</li>, <li>grapes</li>]
cy.get('.second').nextAll()
```

### Selector

#### Find all of the following siblings of each li. Keep only the ones with a class `selected`

```html
<ul>
  <li>apples</li>
  <li>oranges</li>
  <li>bananas</li>
  <li class="selected">pineapples</li>
  <li>grapes</li>
</ul>
```

```javascript
// yields <li>pineapples</li>
cy.get('li').nextAll('.selected')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.nextAll()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.nextAll()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.nextAll()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.nextAll()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.nextAll()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find all elements following the `.active` li_**

```javascript
cy.get('.left-nav').find('li.active').nextAll()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/nextall/next-all-traversal-command-for-the-dom.png" alt="Command Log nextAll" />

When clicking on `nextAll` within the command log, the console outputs the
following:

<DocsImage src="/img/api/nextall/all-next-elements-are-logged-in-console.png" alt="Console Log nextAll" />

## See also

- [`.next()`](/api/commands/next)
- [`.nextUntil()`](/api/commands/nextuntil)
- [`.prevAll()`](/api/commands/prevall)

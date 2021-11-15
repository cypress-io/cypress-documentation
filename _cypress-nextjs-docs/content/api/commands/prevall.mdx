---
title: prevAll
---

Get all previous siblings of each DOM element in a set of matched DOM elements.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.prevAll()`](http://api.jquery.com/prevAll) works in jQuery.

</Alert>

## Syntax

```javascript
.prevAll()
.prevAll(selector)
.prevAll(options)
.prevAll(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.active').prevAll() // Yield all links previous to `.active`
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.prevAll() // Errors, cannot be chained off 'cy'
cy.getCookies().prevAll() // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.prevAll()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.prevAll()` to resolve before [timing out](#Timeouts)                  |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.prevAll()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Find all of the element's siblings before `.third`

```html
<ul>
  <li>apples</li>
  <li>oranges</li>
  <li class="third">bananas</li>
  <li>pineapples</li>
  <li>grapes</li>
</ul>
```

```javascript
// yields [<li>apples</li>, <li>oranges</li>]
cy.get('.third').prevAll()
```

### Selector

#### Find all of the previous siblings of each `li`. Keep only the ones with a class `selected`

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
cy.get('li').prevAll('.selected')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.prevAll()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.prevAll()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.prevAll()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.prevAll()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.prevAll()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find all elements before the `.active` li_**

```javascript
cy.get('.left-nav').find('li.active').prevAll()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/prevall/find-all-previous-elements-with-optional-selector.png" alt="Command Log prevAll" ></DocsImage>

When clicking on `prevAll` within the command log, the console outputs the
following:

<DocsImage src="/img/api/prevall/console-log-all-previous-elements-traversed.png" alt="Console Log prevAll" ></DocsImage>

## See also

- [`.nextAll()`](/api/commands/nextall)
- [`.parents()`](/api/commands/parents)
- [`.prev()`](/api/commands/prev)
- [`.prevUntil()`](/api/commands/prevuntil)

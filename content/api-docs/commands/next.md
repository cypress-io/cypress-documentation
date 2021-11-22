---
title: next
---

Get the immediately following sibling of each DOM element within a set of DOM
elements.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.next()`](http://api.jquery.com/next) works in jQuery.

</Alert>

## Syntax

```javascript
.next()
.next(selector)
.next(options)
.next(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('nav a:first').next() // Yield next link in nav
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.next() // Errors, cannot be chained off 'cy'
cy.getCookies().next() // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.next()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.next()` to resolve before [timing out](#Timeouts)                     |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.next()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Find the element next to `.second`

```html
<ul>
  <li>apples</li>
  <li class="second">oranges</li>
  <li>bananas</li>
</ul>
```

```javascript
// yields <li>bananas</li>
cy.get('.second').next()
```

#### Testing a datalist

```html
<input list="fruit" />
<datalist id="fruit">
  <option>Apple</option>
  <option>Banana</option>
  <option>Cantaloupe</option>
</datalist>
```

```javascript
cy.get('#fruit option')
  .first()
  .should('have.text', 'Apple')
  .next()
  .should('have.text', 'Banana')
  .next()
  .should('have.text', 'Cantaloupe')
```

### Selector

#### Find the very next sibling of each li. Keep only the ones with a class `selected`

```html
<ul>
  <li>apples</li>
  <li>oranges</li>
  <li>bananas</li>
  <li class="selected">pineapples</li>
</ul>
```

```javascript
// yields <li>pineapples</li>
cy.get('li').next('.selected')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.next()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.next()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.next()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.next()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.next()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find the element next to the `.active` li_**

```javascript
cy.get('.left-nav').find('li.active').next()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/next/find-next-element-when-testing-dom.png" alt="Command Log next" />

When clicking on `next` within the command log, the console outputs the
following:

<DocsImage src="/img/api/next/elements-next-command-applied-to.png" alt="Console Log next" />

## See also

- [`.nextAll()`](/api/commands/nextall)
- [`.nextUntil()`](/api/commands/nextuntil)
- [`.prev()`](/api/commands/prev)

---
title: parentsUntil
---

Get all ancestors of each DOM element in a set of matched DOM elements up to,
but not including, the element provided.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.parentsUntil()`](http://api.jquery.com/parentsUntil) works in jQuery.

</Alert>

## Syntax

```javascript
.parentsUntil(selector)
.parentsUntil(selector, filter)
.parentsUntil(selector, filter, options)
.parentsUntil(element)
.parentsUntil(element, filter)
.parentsUntil(element, filter, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('p').parentsUntil('.article') // Yield parents of 'p' until '.article'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.parentsUntil() // Errors, cannot be chained off 'cy'
cy.clock().parentsUntil('href') // Errors, 'clock' does not yield DOM elements
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

The selector where you want finding parent ancestors to stop.

**<Icon name="angle-right"></Icon> element** **_(DOM node, jQuery Object)_**

The element where you want finding parent ancestors to stop.

**<Icon name="angle-right"></Icon> filter** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.parentsUntil()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.parentsUntil()` to resolve before [timing out](#Timeouts)             |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.parentsUntil()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Find all of the `.active` element's ancestors until `.nav`

```html
<ul class="nav">
  <li>
    <a href="#">Clothes</a>
    <ul class="menu">
      <li>
        <a href="/shirts">Shirts</a>
      </li>
      <li class="active">
        <a href="/pants">Pants</a>
      </li>
    </ul>
  </li>
</ul>
```

```javascript
// yields [ul.menu, li]
cy.get('.active').parentsUntil('.nav')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.parentsUntil()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.parentsUntil()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.parentsUntil()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.parentsUntil()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.parentsUntil()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find all of the `active` element's ancestors until `.nav`_**

```javascript
cy.get('.active').parentsUntil('.nav')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/parentsuntil/get-all-parents-until-nav-selector.png" alt="Command Log parentsUntil" ></DocsImage>

When clicking on `parentsUntil` within the command log, the console outputs the
following:

<DocsImage src="/img/api/parentsuntil/show-parents-until-nav-in-console.png" alt="Console Log parentsUntil" ></DocsImage>

## See also

- [`.parent()`](/api/commands/parent)
- [`.parents()`](/api/commands/parents)
- [`.prevUntil()`](/api/commands/prevuntil)
- [`.nextUntil()`](/api/commands/nextuntil)

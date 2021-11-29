---
title: prevUntil
---

Get all previous siblings of each DOM element in a set of matched DOM elements
up to, but not including, the element provided.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.prevUntil()`](http://api.jquery.com/prevUntil) works in jQuery.

</Alert>

## Syntax

```javascript
.prevUntil(selector)
.prevUntil(selector, filter)
.prevUntil(selector, filter, options)
.prevUntil(element)
.prevUntil(element, filter)
.prevUntil(element, filter, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('p').prevUntil('.intro') // Yield siblings before 'p' until '.intro'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.prevUntil() // Errors, cannot be chained off 'cy'
cy.location().prevUntil('path') // Errors, 'location' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

The selector where you want finding previous siblings to stop.

**<Icon name="angle-right"></Icon> element** **_(DOM node, jQuery Object)_**

The element where you want finding previous siblings to stop.

**<Icon name="angle-right"></Icon> filter** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.prevUntil()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.prevUntil()` to resolve before [timing out](#Timeouts)                |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.prevUntil()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Find all of the element's siblings before `#nuts` until `#veggies`

```html
<ul>
  <li id="fruits" class="header">Fruits</li>
  <li>apples</li>
  <li>oranges</li>
  <li>bananas</li>
  <li id="veggies" class="header">Vegetables</li>
  <li>cucumbers</li>
  <li>carrots</li>
  <li>corn</li>
  <li id="nuts" class="header">Nuts</li>
  <li>walnuts</li>
  <li>cashews</li>
  <li>almonds</li>
</ul>
```

```javascript
// yields [<li>cucumbers</li>, <li>carrots</li>, <li>corn</li>]
cy.get('#nuts').prevUntil('#veggies')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.prevUntil()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.prevUntil()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.prevUntil()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.prevUntil()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.prevUntil()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find all of the element's siblings before `#nuts` until `#veggies`_**

```javascript
cy.get('#nuts').prevUntil('#veggies')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/prevuntil/prev-until-finding-elements-in-command-log.png" alt="Command Log prevUntil" />

When clicking on `prevUntil` within the command log, the console outputs the
following:

<DocsImage src="/img/api/prevuntil/console-log-previous-elements-until-defined-el.png" alt="Console Log prevUntil" />

## See also

- [`.prev()`](/api/commands/prev)
- [`.prevAll()`](/api/commands/prevall)
- [`.parentsUntil()`](/api/commands/parentsuntil)
- [`.nextUntil()`](/api/commands/nextuntil)

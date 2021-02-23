---
title: nextUntil
---

Get all following siblings of each DOM element in a set of matched DOM elements up to, but not including, the element provided.

<Alert type="info">

The querying behavior of this command matches exactly how [`.nextUntil()`](http://api.jquery.com/nextUntil) works in jQuery.

</Alert>

## Syntax

```javascript
.nextUntil(selector)
.nextUntil(selector, filter)
.nextUntil(selector, filter, options)
.nextUntil(element)
.nextUntil(element, filter)
.nextUntil(element, filter, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get("div").nextUntil(".warning"); // Yield siblings after 'div' until '.warning'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.nextUntil(); // Errors, cannot be chained off 'cy'
cy.location().nextUntil("path"); // Errors, 'location' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

The selector where you want finding next siblings to stop.

**<Icon name="angle-right"></Icon> element** **_(DOM node, jQuery Object)_**

The element where you want finding next siblings to stop.

**<Icon name="angle-right"></Icon> filter** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.nextUntil()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.nextUntil()` to resolve before [timing out](#Timeouts)                |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.nextUntil()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Find all of the element's siblings following `#veggies` until `#nuts`

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
//returns [<li>cucumbers</li>, <li>carrots</li>, <li>corn</li>]
cy.get("#veggies").nextUntil("#nuts");
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.nextUntil()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.nextUntil` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.nextUntil` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.nextUntil()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.nextUntil()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find all of the element's siblings following `#veggies` until `#nuts`_**

```javascript
cy.get("#veggies").nextUntil("#nuts");
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/nextuntil/find-next-elements-until-selector.png" alt="Command Log nextUntil" ></DocsImage>

When clicking on `nextUntil` within the command log, the console outputs the following:

<DocsImage src="/img/api/nextuntil/console-log-of-next-elements-until.png" alt="Console Log nextUntil" ></DocsImage>

## See also

- [`.next()`](/api/commands/next)
- [`.nextAll()`](/api/commands/nextall)
- [`.parentsUntil()`](/api/commands/parentsuntil)
- [`.prevUntil()`](/api/commands/prevuntil)

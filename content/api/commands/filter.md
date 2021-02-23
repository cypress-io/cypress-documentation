---
title: filter
---

Get the DOM elements that match a specific selector.

<Alert type="info">

Opposite of [`.not()`](/api/commands/not)

</Alert>

<Alert type="info">

The querying behavior of this command matches exactly how [`.filter()`](http://api.jquery.com/filter) works in jQuery.

</Alert>

## Syntax

```javascript
.filter(selector)
.filter(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get("td").filter(".users"); // Yield all el's with class '.users'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.filter(".animated"); // Errors, cannot be chained off 'cy'
cy.location().filter(); // Errors, 'location' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.filter()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.filter()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.filter()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Filter the current subject to the elements with the class 'active'

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
// yields <li>About</li>
cy.get("ul").find(">li").filter(".active");
```

### Contains

#### Filter by text

You can use the [jQuery :contains](https://api.jquery.com/contains-selector/) selector to perform a case-sensitive text substring match.

```html
<ul>
  <li>Home</li>
  <li>Services</li>
  <li>Advanced Services</li>
  <li>Pricing</li>
  <li>Contact</li>
</ul>
```

Let's find both list items that contain the work "Services"

```javascript
cy.get("li").filter(':contains("Services")').should("have.length", 2);
```

#### Non-breaking space

If the HTML contains a [non-breaking space](https://en.wikipedia.org/wiki/Non-breaking_space) entity `&nbsp;` and the test uses the [jQuery :contains](https://api.jquery.com/contains-selector/) selector, then the test needs to use the Unicode value `\u00a0` instead of `&nbsp;`.

```html
<div data-testid="testattr">
  <span>Hello&nbsp;world</span>
</div>
```

```javascript
cy.get("[data-testid=testattr]").filter(':contains("Hello\u00a0world")');
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.filter()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.filter` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.filter` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.filter()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.filter()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Filter the li's to the li with the class 'active'._**

```javascript
cy.get(".left-nav>.nav").find(">li").filter(".active");
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/filter/filter-el-by-selector.png" alt="Command Log filter" ></DocsImage>

When clicking on the `filter` command within the command log, the console outputs the following:

<DocsImage src="/img/api/filter/console-shows-list-and-filtered-element.png" alt="console.log filter" ></DocsImage>

## See also

- [`.not()`](/api/commands/not)

---
title: children
---

Get the children of each DOM element within a set of DOM elements.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.children()`](http://api.jquery.com/children) works in jQuery.

</Alert>

## Syntax

```javascript
.children()
.children(selector)
.children(options)
.children(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('nav').children() // Yield children of nav
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.children() // Errors, cannot be chained off 'cy'
cy.clock().children() // Errors, 'clock' does not yield DOM elements
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.children()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.children()` to resolve before [timing out](#Timeouts)                 |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.children()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the children of the `.secondary-nav`

```html
<ul>
  <li>About</li>
  <li>
    Services
    <ul class="secondary-nav">
      <li class="services-1">Web Design</li>
      <li class="services-2">Logo Design</li>
      <li class="services-3">
        Print Design
        <ul class="tertiary-nav">
          <li>Signage</li>
          <li>T-Shirt</li>
          <li>Business Cards</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Contact</li>
</ul>
```

```javascript
// yields [
//  <li class="services-1">Web Design</li>,
//  <li class="services-2">Logo Design</li>,
//  <li class="services-3">Print Design</li>
// ]
cy.get('ul.secondary-nav').children()
```

### Selector

#### Get the children with class `active`

```html
<div>
  <ul>
    <li class="active">Unit Testing</li>
    <li>Integration Testing</li>
  </ul>
</div>
```

```javascript
// yields [
//  <li class="active">Unit Testing</li>
// ]
cy.get('ul').children('.active')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.children()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.children()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.children()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.children()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.children()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Assert that there should be 8 children elements in a nav_**

```javascript
cy.get('.left-nav>.nav').children().should('have.length', 8)
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/children/children-elements-shown-in-command-log.png" alt="Command log for children" ></DocsImage>

When clicking on the `children` command within the command log, the console
outputs the following:

<DocsImage src="/img/api/children/children-yielded-in-console.png" alt="console.log for children" ></DocsImage>

## See also

- [`.next()`](/api/commands/next)
- [`.parent()`](/api/commands/parent)
- [`.parents()`](/api/commands/parents)
- [`.siblings()`](/api/commands/siblings)

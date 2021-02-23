---
title: parent
---

Get the parent DOM element of a set of DOM elements.

Please note that `.parent()` only travels a single level up the DOM tree as opposed to the [.parents()](/api/commands/parents) command.

<Alert type="info">

The querying behavior of this command matches exactly how [`.parent()`](http://api.jquery.com/parent) works in jQuery.

</Alert>

## Syntax

```javascript
.parent()
.parent(selector)
.parent(options)
.parent(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get("header").parent(); // Yield parent el of `header`
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.parent(); // Errors, cannot be chained off 'cy'
cy.reload().parent(); // Errors, 'reload' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.parent()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.parent()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.parent()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the parent of the active `li`

```html
<ul class="main-nav">
  <li>Overview</li>
  <li>
    Getting started
    <ul class="sub-nav">
      <li>Install</li>
      <li class="active">Build</li>
      <li>Test</li>
    </ul>
  </li>
</ul>
```

```javascript
// yields .sub-nav
cy.get("li.active").parent();
```

### Selector

#### Get the parent with class `sub-nav` of all `li` elements

```html
<ul class="main-nav">
  <li>Overview</li>
  <li>
    Getting started
    <ul class="sub-nav">
      <li>Install</li>
      <li class="active">Build</li>
      <li>Test</li>
    </ul>
  </li>
</ul>
```

```javascript
// yields .sub-nav
cy.get("li").parent(".sub-nav");
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.parent()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.parent` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.parent` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.parent()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.parent()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Assert on the parent of the active li_**

```javascript
cy.get("li.active").parent().should("have.class", "nav");
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/parent/get-parent-element-just-like-jquery.png" alt="Command Log parent" ></DocsImage>

When clicking on the `parent` command within the command log, the console outputs the following:

<DocsImage src="/img/api/parent/parent-command-found-elements-for-console-log.png" alt="Console Log parent" ></DocsImage>

## See also

- [`.children()`](/api/commands/children)
- [`.parents()`](/api/commands/parents)
- [`.parentsUntil()`](/api/commands/parentsuntil)

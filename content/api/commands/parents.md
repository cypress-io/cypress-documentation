---
title: parents
---

Get the parent DOM elements of a set of DOM elements.

Please note that `.parents()` travels multiple levels up the DOM tree as opposed to the [.parent
()](/api/commands/parent) command which travels a single level up the DOM tree.

<Alert type="info">

The querying behavior of this command matches exactly how [`.parents()`](http://api.jquery.com/parents) works in jQuery.

</Alert>

## Syntax

```javascript
.parents()
.parents(selector)
.parents(options)
.parents(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('aside').parents() // Yield parents of aside
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.parents() // Errors, cannot be chained off 'cy'
cy.go('back').parents() // Errors, 'go' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.parents()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.parents()` to resolve before [timing out](#Timeouts)                  |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.parents()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the parents of the active li

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
// yields [.sub-nav, li, .main-nav]
cy.get('li.active').parents()
```

### Selector

#### Get the parents with class `main-nav` of the active li

```javascript
// yields [.main-nav]
cy.get('li.active').parents('.main-nav')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.parents()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.parents()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.parents()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.parents()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.parents()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Get the parents of the active `li`_**

```javascript
cy.get('li.active').parents()
```

<DocsImage src="/img/api/parents/get-all-parents-of-a-dom-element.png" alt="Command Log parents" ></DocsImage>

When clicking on the `parents` command within the command log, the console outputs the following:

<DocsImage src="/img/api/parents/parents-elements-displayed-in-devtools-console.png" alt="Console Log parents" ></DocsImage>

## See also

- [`.children()`](/api/commands/children)
- [`.parent()`](/api/commands/parent)
- [`.parentsUntil()`](/api/commands/parentsuntil)

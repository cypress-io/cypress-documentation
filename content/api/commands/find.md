---
title: find
---

Get the descendent DOM elements of a specific selector.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.find()`](http://api.jquery.com/find) works in jQuery.

</Alert>

## Syntax

```javascript
.find(selector)
.find(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.article').find('footer') // Yield 'footer' within '.article'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.find('.progress') // Errors, cannot be chained off 'cy'
cy.exec('node start').find() // Errors, 'exec' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching descendent DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.find()`.

| Option             | Default                                                                           | Description                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `log`              | `true`                                                                            | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log)                     |
| `timeout`          | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)              | Time to wait for `.find()` to resolve before [timing out](#Timeouts)                                         |
| `includeShadowDom` | [`includeShadowDom` config option value](/guides/references/configuration#Global) | Whether to traverse shadow DOM boundaries and include elements within the shadow DOM in the yielded results. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.find()` yields the new DOM element(s) it found.</li></List>

## Examples

### Selector

#### Get li's within parent

```html
<ul id="parent">
  <li class="first"></li>
  <li class="second"></li>
</ul>
```

```javascript
// yields [<li class="first"></li>, <li class="second"></li>]
cy.get('#parent').find('li')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.find()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.find()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.find()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.find()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.find()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find the li's within the nav_**

```javascript
cy.get('.left-nav>.nav').find('>li')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/find/find-li-of-uls-in-test.png" alt="Command Log find" ></DocsImage>

When clicking on the `find` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/find/find-in-console-shows-list-and-yields.png" alt="console.log find" ></DocsImage>

## History

| Version                                     | Changes                          |
| ------------------------------------------- | -------------------------------- |
| [5.2.0](/guides/references/changelog#5-2-0) | Added `includeShadowDom` option. |

## See also

- [`cy.get()`](/api/commands/get)

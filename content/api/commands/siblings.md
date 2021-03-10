---
title: siblings
---

Get sibling DOM elements.

## Syntax

```javascript
.siblings()
.siblings(selector)
.siblings(options)
.siblings(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('td').siblings() // Yield all td's siblings
cy.get('li').siblings('.active') // Yield all li's siblings with class '.active'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.siblings('.error') // Errors, cannot be chained off 'cy'
cy.location().siblings() // Errors, 'location' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.siblings()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.siblings()` to resolve before [timing out](#Timeouts)                 |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.siblings()` yields the new DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the siblings of each `li`

```html
<ul>
  <li>Home</li>
  <li>Contact</li>
  <li class="active">Services</li>
  <li>Price</li>
</ul>
```

```javascript
// yields all other li's in list
cy.get('.active').siblings()
```

### Selector

#### Get siblings of element with class `active`

```javascript
// yields <li class="active">Services</li>
cy.get('li').siblings('.active')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.siblings()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.siblings()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.siblings()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.siblings()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.siblings()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Get the siblings of element with class `active`_**

```javascript
cy.get('.left-nav').find('li.active').siblings()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/siblings/find-siblings-of-dom-elements-to-test.png" alt="Command Log siblings" ></DocsImage>

When clicking on `siblings` within the command log, the console outputs the following:

<DocsImage src="/img/api/siblings/console-log-of-sibling-elements.png" alt="Console Log siblings" ></DocsImage>

## History

| Version                                       | Changes                     |
| --------------------------------------------- | --------------------------- |
| [< 0.3.3](/guides/references/changelog#0-3-3) | `.siblings()` command added |

## See also

- [`.prev()`](/api/commands/prev)
- [`.next()`](/api/commands/next)

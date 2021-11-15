---
title: eq
---

Get A DOM element at a specific index in an array of elements.

<Alert type="info">

The querying behavior of this command matches exactly how
[`.eq()`](https://api.jquery.com/eq) works in jQuery.

</Alert>

## Syntax

```javascript
.eq(index)
.eq(indexFromEnd)
.eq(index, options)
.eq(indexFromEnd, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('tbody>tr').eq(0) // Yield first 'tr' in 'tbody'
cy.get('ul>li').eq(4) // Yield fifth 'li' in 'ul'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.eq(0) // Errors, cannot be chained off 'cy'
cy.getCookies().eq(4) // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> index** **_(Number)_**

A number indicating the index to find the element at within an array of
elements. Starts with 0.

**<Icon name="angle-right"></Icon> indexFromEnd** **_(Number)_**

A negative number indicating the index position from the end to find the element
at within an array of elements.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.eq()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.eq()` to resolve before [timing out](#Timeouts)                       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.eq()` yields the new DOM element(s) it found.</li></List>

## Examples

### Index

#### Find the 2nd element within the elements

```html
<ul>
  <li>tabby</li>
  <li>siamese</li>
  <li>persian</li>
  <li>sphynx</li>
  <li>burmese</li>
</ul>
```

```javascript
cy.get('li').eq(1).should('contain', 'siamese') // true
```

#### Make an assertion on the 3rd row of a table

```html
<table>
  <tr>
    <th>Breed</th>
    <th>Origin</th>
  </tr>
  <tr>
    <td>Siamese</td>
    <td>Thailand</td>
  </tr>
  <tr>
    <td>Sphynx</td>
    <td>Canada</td>
  </tr>
  <tr>
    <td>Persian</td>
    <td>Iran</td>
  </tr>
</table>
```

```javascript
cy.get('tr').eq(2).should('contain', 'Canada') //true
```

### Index From End

#### Find the 2nd from the last element within the elements

```html
<ul>
  <li>tabby</li>
  <li>siamese</li>
  <li>persian</li>
  <li>sphynx</li>
  <li>burmese</li>
</ul>
```

```javascript
cy.get('li').eq(-2).should('contain', 'sphynx') // true
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.eq()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.eq()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.eq()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.eq()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.eq()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Find the 4th `<li>` in the navigation_**

```javascript
cy.get('.left-nav.nav').find('>li').eq(3)
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/eq/find-element-at-index.png" alt="Command log eq" ></DocsImage>

When clicking on the `eq` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/eq/see-element-and-list-when-using-eq.png" alt="console.log eq" ></DocsImage>

## See also

- [`.first()`](/api/commands/first)
- [`.last()`](/api/commands/last)
- [`.next()`](/api/commands/next)
- [`.prev()`](/api/commands/prev)

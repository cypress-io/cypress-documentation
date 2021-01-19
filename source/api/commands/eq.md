---
title: eq
---

Get A DOM element at a specific index in an array of elements.

{% note info %}
The querying behavior of this command matches exactly how {% url `.eq()` http://api.jquery.com/eq %} works in jQuery. Its behavior is also similar to that of the CSS pseudo-class {% url `:nth-child()` https://api.jquery.com/nth-child-selector/ %} selector.
{% endnote %}

# Syntax

```javascript
.eq(index)
.eq(indexFromEnd)
.eq(index, options)
.eq(indexFromEnd, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('tbody>tr').eq(0)    // Yield first 'tr' in 'tbody'
cy.get('ul>li').eq(4)       // Yield fifth 'li' in 'ul'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.eq(0)                  // Errors, cannot be chained off 'cy'
cy.getCookies().eq(4)     // Errors, 'getCookies' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} index**  ***(Number)***

A number indicating the index to find the element at within an array of elements. Starts with 0.

**{% fa fa-angle-right %} indexFromEnd**  ***(Number)***

A negative number indicating the index position from the end to find the element at within an array of elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.eq()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .eq %}

## Yields {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .eq %}

# Examples

## Index

### Find the 2nd element within the elements

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

### Make an assertion on the 3rd row of a table

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
</table>
```

```javascript
cy.get('tr').eq(2).should('contain', 'Canada')  //true
```

## Index From End

### Find the 2nd from the last element within the elements

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

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .eq %}

## Assertions {% helper_icon assertions %}

{% assertions existence .eq %}

## Timeouts {% helper_icon timeout %}

{% timeouts existence .eq %}

# Command Log

***Find the 4th `<li>` in the navigation***

```javascript
cy.get('.left-nav.nav').find('>li').eq(3)
```

The commands above will display in the Command Log as:

{% imgTag /img/api/eq/find-element-at-index.png "Command log eq" %}

When clicking on the `eq` command within the command log, the console outputs the following:

{% imgTag /img/api/eq/see-element-and-list-when-using-eq.png "console.log eq" %}

# See also

- {% url `.first()` first %}
- {% url `.last()` last %}
- {% url `.next()` next %}
- {% url `.prev()` prev %}

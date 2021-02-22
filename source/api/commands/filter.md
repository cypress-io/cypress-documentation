---
title: filter
---

Get the DOM elements that match a specific selector.

{% note info %}
Opposite of {% url `.not()` not %}
{% endnote %}

{% note info %}
The querying behavior of this command matches exactly how {% url `.filter()` http://api.jquery.com/filter %} works in jQuery.
{% endnote %}

# Syntax

```javascript
.filter(selector)
.filter(selector, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('td').filter('.users') // Yield all el's with class '.users'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.filter('.animated')  // Errors, cannot be chained off 'cy'
cy.location().filter()  // Errors, 'location' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.filter()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .filter %}

## Yields {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .filter %}

# Examples

## Selector

### Filter the current subject to the elements with the class 'active'

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
cy.get('ul').find('>li').filter('.active')
```

## Contains

### Filter by text

You can use the {% url "jQuery :contains" https://api.jquery.com/contains-selector/ %} selector to perform a case-sensitive text substring match.

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
cy.get('li')
  .filter(':contains("Services")')
  .should('have.length', 2)
```

### Non-breaking space

If the HTML contains a {% url "non-breaking space" https://en.wikipedia.org/wiki/Non-breaking_space %} entity `&nbsp;` and the test uses the {% url "jQuery :contains" https://api.jquery.com/contains-selector/ %} selector, then the test needs to use the Unicode value `\u00a0` instead of `&nbsp;`.

```html
<div data-testid="testattr">
  <span>Hello&nbsp;world</span>
</div>
```

```javascript
cy.get('[data-testid=testattr]')
  .filter(':contains("Hello\u00a0world")')
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .filter %}

## Assertions {% helper_icon assertions %}

{% assertions existence .filter %}

## Timeouts {% helper_icon timeout %}

{% timeouts existence .filter %}

# Command Log

***Filter the li's to the li with the class 'active'.***

```javascript
cy.get('.left-nav>.nav').find('>li').filter('.active')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/filter/filter-el-by-selector.png "Command Log filter" %}

When clicking on the `filter` command within the command log, the console outputs the following:

{% imgTag /img/api/filter/console-shows-list-and-filtered-element.png "console.log filter" %}

# See also

- {% url `.not()` not %}

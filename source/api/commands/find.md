---
title: find
---

Get the descendent DOM elements of a specific selector.

{% note info %}
The querying behavior of this command matches exactly how {% url `.find()` http://api.jquery.com/find %} works in jQuery.
{% endnote %}

# Syntax

```javascript
.find(selector)
.find(selector, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.article').find('footer') // Yield 'footer' within '.article'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.find('.progress')          // Errors, cannot be chained off 'cy'
cy.exec('node start').find()  // Errors, 'exec' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching descendent DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.find()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .find %}
`includeShadowDom` | {% url '`includeShadowDom`<br /> config option value' configuration#Global %} | {% usage_options includeShadowDom %}

## Yields {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .find %}

# Examples

## Selector

### Get li's within parent

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

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .find %}

## Assertions {% helper_icon assertions %}

{% assertions existence .find %}

## Timeouts {% helper_icon timeout %}

{% timeouts existence .find %}

# Command Log

***Find the li's within the nav***

```javascript
cy.get('.left-nav>.nav').find('>li')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/find/find-li-of-uls-in-test.png "Command Log find" %}

When clicking on the `find` command within the command log, the console outputs the following:

{% imgTag /img/api/find/find-in-console-shows-list-and-yields.png "console.log find" %}

{% history %}
{% url "5.2.0" changelog#5-2-0 %} | Added `includeShadowDom` option.
{% endhistory %}

# See also

- {% url `cy.get()` get %}

---
title: parent
---

Get the parent DOM element of a set of DOM elements.

Please note that `.parent()` only travels a single level up the DOM tree as opposed to the {% url ".parents()" parents %} command.

{% note info %}
The querying behavior of this command matches exactly how {% url `.parent()` http://api.jquery.com/parent %} works in jQuery.
{% endnote %}

# Syntax

```javascript
.parent()
.parent(selector)
.parent(options)
.parent(selector, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('header').parent() // Yield parent el of `header`
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.parent()            // Errors, cannot be chained off 'cy'
cy.reload().parent()   // Errors, 'reload' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.parent()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .parent %}

## Yields {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .parent %}

# Examples

## No Args

### Get the parent of the active `li`

```html
<ul class='main-nav'>
  <li>Overview</li>
  <li>Getting started
    <ul class='sub-nav'>
      <li>Install</li>
      <li class='active'>Build</li>
      <li>Test</li>
    </ul>
  </li>
</ul>
```

```javascript
// yields .sub-nav
cy.get('li.active').parent()
```

## Selector

### Get the parent with class `sub-nav` of all `li` elements

```html
<ul class='main-nav'>
  <li>Overview</li>
  <li>Getting started
    <ul class='sub-nav'>
      <li>Install</li>
      <li class='active'>Build</li>
      <li>Test</li>
    </ul>
  </li>
</ul>
```

```javascript
// yields .sub-nav
cy.get('li').parent('.sub-nav')
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .parent %}

## Assertions {% helper_icon assertions %}

{% assertions existence .parent %}

## Timeouts {% helper_icon timeout %}

{% timeouts existence .parent %}

# Command Log

***Assert on the parent of the active li***

```javascript
cy.get('li.active').parent().should('have.class', 'nav')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/parent/get-parent-element-just-like-jquery.png "Command Log parent" %}

When clicking on the `parent` command within the command log, the console outputs the following:

{% imgTag /img/api/parent/parent-command-found-elements-for-console-log.png "Console Log parent" %}

# See also

- {% url `.children()` children %}
- {% url `.parents()` parents %}
- {% url `.parentsUntil()` parentsuntil %}

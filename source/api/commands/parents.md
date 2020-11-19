---
title: parents
---

Get the parent DOM elements of a set of DOM elements.

Please note that `.parents()` travels multiple levels up the DOM tree as opposed to the {% url ".parent
()" parent %} command which travels a single level up the DOM tree.

{% note info %}
The querying behavior of this command matches exactly how {% url `.parents()` http://api.jquery.com/parents %} works in jQuery.
{% endnote %}

# Syntax

```javascript
.parents()
.parents(selector)
.parents(options)
.parents(selector, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('aside').parents()  // Yield parents of aside
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.parents()              // Errors, cannot be chained off 'cy'
cy.go('back').parents()   // Errors, 'go' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.parents()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .parents %}

## Yields {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .parents %}

# Examples

## No Args

### Get the parents of the active li

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
// yields [.sub-nav, li, .main-nav]
cy.get('li.active').parents()
```

## Selector

### Get the parents with class `main-nav` of the active li

```javascript
// yields [.main-nav]
cy.get('li.active').parents('.main-nav')
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .parents %}

## Assertions {% helper_icon assertions %}

{% assertions existence .parents %}

## Timeouts {% helper_icon timeout %}

{% timeouts existence .parents %}

# Command Log

***Get the parents of the active `li`***

```javascript
cy.get('li.active').parents()
```

{% imgTag /img/api/parents/get-all-parents-of-a-dom-element.png "Command Log parents" %}

When clicking on the `parents` command within the command log, the console outputs the following:

{% imgTag /img/api/parents/parents-elements-displayed-in-devtools-console.png "Console Log parents" %}

# See also

- {% url `.children()` children %}
- {% url `.parent()` parent %}
- {% url `.parentsUntil()` parentsuntil %}

---
title: dblclick
---

Double-click a DOM element.

# Syntax

```javascript
.dblclick()
.dblclick(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('button').dblclick()          // Double click on button
cy.focused().dblclick()              // Double click on el with focus
cy.contains('Welcome').dblclick()    // Double click on first el containing 'Welcome'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.dblclick('button')          // Errors, cannot be chained off 'cy'
cy.window().dblclick()         // Errors, 'window' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} position** ***(String)***

The position where the double click should be issued. The `center` position is the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

{% imgTag "/img/api/coordinates-diagram.jpg" "cypress-command-positions-diagram" %}

**{% fa fa-angle-right %} x** ***(Number)***

The distance in pixels from the element's left to issue the double click.

**{% fa fa-angle-right %} y** ***(Number)***

The distance in pixels from the element's top to issue the double click.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.dblclick()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`force` | `false` | {% usage_options force dblclick %}
`multiple` | `false` | {% usage_options multiple dblclick %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .dblclick %}

## Yields {% helper_icon yields %}

{% yields same_subject .dblclick %}

# Examples

## No Args

### Double click an anchor link

```javascript
cy.get('a#nav1').dblclick() // yields the <a>
```

# Notes

## Actionability

### The element must first reach actionability

`.dblclick()` is an "action command" that follows all the rules {% url 'defined here' interacting-with-elements %}.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .dblclick %}

## Assertions {% helper_icon assertions %}

{% assertions actions .dblclick %}

## Timeouts {% helper_icon timeout %}

{% timeouts actions .dblclick %}

# Command Log

***Double click on a calendar schedule***

```javascript
cy.get('[data-schedule-id="4529114"]:first').dblclick()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/dblclick/double-click-in-testing.png "Command Log dblclick" %}

When clicking on `dblclick` within the command log, the console outputs the following:

{% imgTag /img/api/dblclick/element-double-clicked-on.png "console.log dblclick" %}

{% history %}
{% url "3.5.0" changelog#3-5-0 %} | Added support for `position`, `x`, and `y` arguments.
{% url "3.5.0" changelog#3-5-0 %} | Added support for options `force` and `multiple`.
{% url "3.5.0" changelog#3-5-0 %} | Added sending `mouseover`, `mousemove`, `mouseout`, `pointerdown`, `pointerup`, and `pointermove` during `.click()`.
{% endhistory %}

# See also

- {% url `.click()` click %}

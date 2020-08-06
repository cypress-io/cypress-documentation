---
title: dblclick
---

Double-click a DOM element.

# Syntax

```javascript
.dblclick()
.dblclick(options)
.dblclick(position)
.dblclick(position, options)
.dblclick(x, y)
.dblclick(x, y, options)
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
`multiple` | `true` | {% usage_options multiple dblclick %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .dblclick %}
`ctrlKey` | `false` | {% usage_options ctrlKey %}
`altKey` | `false` | {% usage_options altKey %}
`shiftKey` | `false` | {% usage_options shiftKey %}
`metaKey` | `false` | {% usage_options metaKey %}

## Yields {% helper_icon yields %}

{% yields same_subject .dblclick %}

# Examples

## No Args

### Double click an anchor link

```javascript
cy.get('a#nav1').dblclick() // yields the <a>
```

## Position

### Specify a position of the element to double click

Click the bottom center of the button.

```javascript
cy.get('button').dblclick('bottom')
```

## Coordinates

### Specify coordinates relative to the top left corner

The double click below will be issued inside of the element (30px from the left and 10px from the top).

```javascript
cy.get('button').dblclick(30, 10)
```

## Options

### Force a double click regardless of its actionable state

Forcing a double click overrides the {% url 'actionable checks' interacting-with-elements#Forcing %} Cypress applies and will automatically fire the events.

```javascript
cy.get('button').dblclick({ force: true })
```

### Force a double click with position argument

```javascript
cy.get('button').dblclick('topRight', { force: true })
```

### Force a double click with relative coordinates

```javascript
cy.get('button').dblclick(60, 60, { force: true })
```

### Double click all buttons found on the page

By default, Cypress will iteratively apply the double click to each element and will also log to the {% url 'Command Log' test-runner#Command-Log %} multiple times.

You can turn this off by passing `multiple: false` to `.dblclick()`.

```javascript
cy.get('button').dblclick({ multiple: false })
```

## Double click with key combinations

The `.dblclick()` command may also be fired with key modifiers in combination with the {% url "`.type()`" type %} command in order to simulate character sequences while double clicking, such as `SHIFT + double click`. In order to keep the modifier key active, `{release: false}` should be passed to the options of the {% url "`.type()`" type %} command.

The following modifiers can be combined with `.dblclick()`.

Sequence | Notes
--- | ---
`{alt}` | Activates the `altKey` modifier. Aliases: `{option}`
`{ctrl}` | Activates the `ctrlKey` modifier. Aliases: `{control}`
`{meta}` | Activates the `metaKey` modifier. Aliases: `{command}`, `{cmd}`
`{shift}` | Activates the `shiftKey` modifier.

### Alt click

```js
// execute a ALT + dblclick on the first <li>
// { release: false } is necessary so that
// ALT will not be released after the type command
cy.get('body').type('{alt}', { release: false })
cy.get('li:first').dblclick()
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

***Double click on a div***

```javascript
cy.get('.action-div').dblclick()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/dblclick/double-click-in-testing.png "Command Log dblclick" %}

When clicking on `dblclick` within the command log, the console outputs the following:

{% imgTag /img/api/dblclick/element-double-clicked-on.png "console.log dblclick" %}

{% history %}
{% url "3.5.0" changelog#3-5-0 %} | Added support for options `force` and `multiple`.
{% url "3.5.0" changelog#3-5-0 %} | Added support for `position`, `x`, and `y` arguments.
{% url "3.5.0" changelog#3-5-0 %} | Added sending `mouseover`, `mousemove`, `mouseout`, `pointerdown`, `pointerup`, and `pointermove` during `.dblclick()`.
{% endhistory %}

# See also

- {% url `.click()` click %}
- {% url `.rightclick()` rightclick %}

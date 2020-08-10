---
title: rightclick
---

Right click a DOM element.

{% note warning %}
`.rightclick()` will not open context menus native to the browser. `.rightclick()` should be used to test your app's handling of right click related events such as `contextmenu`.
{% endnote %}

# Syntax

```javascript
.rightclick()
.rightclick(options)
.rightclick(position)
.rightclick(position, options)
.rightclick(x, y)
.rightclick(x, y, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.menu').rightclick()       // Right click on .menu
cy.focused().rightclick()          // Right click on el with focus
cy.contains('Today').rightclick()  // Right click on first el containing 'Today'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.rightclick('button')    // Errors, cannot be chained off 'cy'
cy.window().rightclick()   // Errors, 'window' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} position** ***(String)***

The position where the right click should be issued. The `center` position is the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

{% imgTag "/img/api/coordinates-diagram.jpg" "cypress-command-positions-diagram" %}

**{% fa fa-angle-right %} x** ***(Number)***

The distance in pixels from the element's left to issue the right click.

**{% fa fa-angle-right %} y** ***(Number)***

The distance in pixels from the element's top to issue the right click.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.rightclick()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`force` | `false` | {% usage_options force rightclick %}
`multiple` | `false` | {% usage_options multiple rightclick %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .rightclick %}
`ctrlKey` | `false` | {% usage_options ctrlKey %}
`altKey` | `false` | {% usage_options altKey %}
`shiftKey` | `false` | {% usage_options shiftKey %}
`metaKey` | `false` | {% usage_options metaKey %}

## Yields {% helper_icon yields %}

{% yields same_subject .rightclick %}

# Examples

## No Args

### Right click the menu

```javascript
cy.get('#open-menu').rightclick()
```

## Position

### Specify a corner of the element to right click

Right click the top right corner of the DOM element.

```javascript
cy.get('#open-menu').rightclick('topRight')
```

## Coordinates

### Specify explicit coordinates relative to the top left corner

The right click below will be issued inside of the element (15px from the left and 40px from the top).

```javascript
cy.get('#open-menu').rightclick(15, 40)
```

## Options

### Force a right click regardless of its actionable state

Forcing a right click overrides the {% url 'actionable checks' interacting-with-elements#Forcing %} Cypress applies and will automatically fire the events.

```javascript
cy.get('#open-menu').rightclick({ force: true })
```

### Force a right click with position argument

```javascript
cy.get('#open-menu').rightclick('bottomLeft', { force: true })
```

### Force a right click with relative coordinates

```javascript
cy.get('#open-menu').rightclick(5, 60, { force: true })
```

### Right click all buttons found on the page

By default, Cypress will error if you're trying to right click multiple elements. By passing `{ multiple: true }` Cypress will iteratively apply the right click to each element and will also log to the {% url 'Command Log' test-runner#Command-Log %} multiple times.

```javascript
cy.get('.open-menu').rightclick({ multiple: true })
```

### Right click with key combinations

The `.rightclick()` command may also be fired with key modifiers in order to simulate holding key combinations while right clicking, such as `ALT + rightclick`.

{% note info %}
You can also use key combinations during {% url "`.type()`" type %}. This offers options to hold down keys across multiple commands. See {% url "Key Combinations" type#Key-Combinations %} for more information.
{% endnote %}

The following key can be combined with `.rightclick()` through the `options`..

Option | Notes
--- | ---
`altKey` | {% usage_options altKey %}
`ctrlKey` | {% usage_options ctrlKey %}
`metaKey` | {% usage_options metaKey %}
`shiftKey` | {% usage_options shiftKey %}

#### Command right click

```js
// execute a CMD + right click on the .menu-item
cy.get('.menu-item').rightclick({
  metaKey: true
})
```

# Notes

## Actionability

### The element must first reach actionability

`.rightclick()` is an "action command" that follows all the rules {% url 'defined here' interacting-with-elements %}.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .rightclick %}

## Assertions {% helper_icon assertions %}

{% assertions actions .rightclick %}

## Timeouts {% helper_icon timeout %}

{% timeouts actions .rightclick %}

# Command Log

***Right click the DOM element***

```javascript
cy.get('.rightclick-action-div').rightclick()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/rightclick/rightclick-dom-element-in-command-log.png "Command log for right click" %}

When clicking on `rightclick` within the command log, the console outputs the following:

{% imgTag /img/api/rightclick/rightclick-console-log-with-mouse-events.png "console.log for right click" %}

{% history %}
{% url "3.5.0" changelog#3-5-0 %} | `.rightclick()` command added
{% endhistory %}

# See also

- {% url `.click()` click %}
- {% url `.dblclick()` dblclick %}
- {% url `.trigger()` trigger %}

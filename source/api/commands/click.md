---
title: click
---

Click a DOM element.

# Syntax

```javascript
.click()
.click(options)
.click(position)
.click(position, options)
.click(x, y)
.click(x, y, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.btn').click()          // Click on button
cy.focused().click()            // Click on el with focus
cy.contains('Welcome').click()  // Click on first el containing 'Welcome'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.click('.btn')          // Errors, cannot be chained off 'cy'
cy.window().click()       // Errors, 'window' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} position** ***(String)***

The position where the click should be issued. The `center` position is the default position. Valid positions are `topLeft`, `top`, `topRight`, `left`, `center`, `right`, `bottomLeft`, `bottom`, and `bottomRight`.

{% imgTag "/img/api/coordinates-diagram.jpg" "cypress-command-positions-diagram" %}

**{% fa fa-angle-right %} x** ***(Number)***

The distance in pixels from the element's left to issue the click.

**{% fa fa-angle-right %} y** ***(Number)***

The distance in pixels from the element's top to issue the click.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.click()`.

Option | Default | Description
--- | --- | ---
`altKey` | `false` | {% usage_options altKey %}
`ctrlKey` | `false` | {% usage_options ctrlKey %}
`log` | `true` | {% usage_options log %}
`force` | `false` | {% usage_options force click %}
`metaKey` | `false` | {% usage_options metaKey %}
`multiple` | `false` | {% usage_options multiple click %}
`shiftKey` | `false` | {% usage_options shiftKey %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .click %}
`waitForAnimations` | {% url `waitForAnimations` configuration#Animations %} | {% usage_options waitForAnimations %}

## Yields {% helper_icon yields %}

{% yields same_subject .click %}

# Examples

## No Args

### Click a link in a nav

```javascript
cy.get('.nav > a').click()
```

## Position

### Specify a corner of the element to click

Click the top right corner of the button.

```javascript
cy.get('img').click('topRight')
```

## Coordinates

### Specify explicit coordinates relative to the top left corner

The click below will be issued inside of the element (15px from the left and 40px from the top).

```javascript
cy.get('#top-banner').click(15, 40)
```

## Options

### Force a click regardless of its actionable state

Forcing a click overrides the {% url 'actionable checks' interacting-with-elements#Forcing %} Cypress applies and will automatically fire the events.

```javascript
cy.get('.close').as('closeBtn')
cy.get('@closeBtn').click({ force: true })
```

### Force a click with position argument

```javascript
cy.get('#collapse-sidebar').click('bottomLeft', { force: true })
```

### Force a click with relative coordinates

```javascript
cy.get('#footer .next').click(5, 60, { force: true })
```

### Click all elements with id starting with 'btn'

By default, Cypress will error if you're trying to click multiple elements. By passing `{ multiple: true }` Cypress will iteratively apply the click to each element and will also log to the {% url 'Command Log' test-runner#Command-Log %} multiple times.

```javascript
cy.get('[id^=btn]').click({ multiple: true })
```

### Click with key combinations

The `.click()` command may also be fired with key modifiers in order to simulate holding key combinations while clicking, such as `ALT + click`.

{% note info %}
You can also use key combinations during {% url "`.type()`" type %}. This offers options to hold down keys across multiple commands. See {% url "Key Combinations" type#Key-Combinations %} for more information.
{% endnote %}

The following keys can be combined with `.click()` through the `options`.

Option | Notes
--- | ---
`altKey` | {% usage_options altKey %}
`ctrlKey` | {% usage_options ctrlKey %}
`metaKey` | {% usage_options metaKey %}
`shiftKey` | {% usage_options shiftKey %}

#### Shift click

```js
// execute a SHIFT + click on the first <li>
cy.get('li:first').click({
  shiftKey: true
})
```

# Notes

## Actionability

### The element must first reach actionability

`.click()` is an "action command" that follows all the rules {% url 'defined here' interacting-with-elements %}.

## Focus

### Focus is given to the first focusable element

For example, clicking a `<span>` inside of a `<button>` gives the focus to the button, since that's what would happen in a real user scenario.

However, Cypress additionally handles situations where a child descendent is clicked inside of a focusable parent, but actually isn't visually inside the parent (per the CSS Object Model). In those cases if no focusable parent is found the window is given focus instead (which matches real browser behavior).

## Cancellation

### Mousedown cancellation will not cause focus

If the mousedown event has its default action prevented (`e.preventDefault()`) then the element will not receive focus as per the spec.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom .click %}

## Assertions {% helper_icon assertions %}

{% assertions actions .click %}

## Timeouts {% helper_icon timeout %}

{% timeouts actions .click %}

# Command Log

***Click the button***

```javascript
cy.get('.action-btn').click()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/click/click-button-in-form-during-test.png "Command log for click" %}

When clicking on `click` within the command log, the console outputs the following:

{% imgTag /img/api/click/click-coords-and-events-in-console.png "console.log for click" %}

{% history %}
{% url "3.5.0" changelog#3-5-0 %} | Added sending `mouseover`, `mousemove`, `mouseout`, `pointerdown`, `pointerup`, and `pointermove` during `.click()`
{% endhistory %}

# See also

- {% url `.check()` check %}
- {% url "`.click()` examples in kitchensink app" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/examples/actions.spec.js#L66 } %}
- {% url `.dblclick()` dblclick %}
- {% url `.rightclick()` rightclick %}
- {% url `.select()` select %}
- {% url `.submit()` submit %}
- {% url `.type()` type %}
- {% url "'When can the test click?' blog" https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/ %}

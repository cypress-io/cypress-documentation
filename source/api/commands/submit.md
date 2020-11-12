---
title: submit
---

Submit a form.

{% note warning %}
The {% url subject introduction-to-cypress#Subject-Management %} must be a `<form>`.
{% endnote %}

# Syntax

```javascript
.submit()
.submit(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('form').submit()   // Submit a form
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.submit()               // Errors, cannot be chained off 'cy'
cy.get('input').submit()  // Errors, 'input' does not yield a form
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.submit()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .submit %}

## Yields {% helper_icon yields %}

{% yields same_subject .submit %}

# Example

## No Args

### Submit can only be called on a single form

```html
<form id="contact">
  <input type="text" name="message">
  <button type="submit">Send</button>
</form>
```

```javascript
cy.get('#contact').submit()
```

# Notes

## Actionability

### Submit is not an action command

`.submit()` is not implemented like other action commands, and does not follow the same rules of {% url 'waiting for actionability' interacting-with-elements %}.

`.submit()` is a helpful command used as a shortcut. Normally a user has to perform a different "action" to submit a form. It could be clicking a submit `<button>`, or pressing `enter` on a keyboard.

Oftentimes using `.submit()` directly is more concise and conveys what you're trying to test.

If you want the other guarantees of waiting for an element to become actionable, you should use a different command like {% url `.click()` click %} or {% url `.type()` type %}.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements submitability .submit %}

## Assertions {% helper_icon assertions %}

{% assertions wait .submit %}

## Timeouts {% helper_icon timeout %}

{% timeouts assertions .submit %}

# Command Log

***Submit a form***

```javascript
cy.http('POST', '/users', { fixture: 'user' }).as('userSuccess')
cy.get('form').submit()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/submit/form-submit-shows-in-command-log-of-cypress.png "Command Log submit" %}

When clicking on `submit` within the command log, the console outputs the following:

{% imgTag /img/api/submit/console-shows-what-form-was-submitted.png "Console Log submit" %}

{% history %}
{% url "< 0.3.3" changelog#0-3-3 %} | `.submit()` command added
{% endhistory %}

# See also

- {% url `.click()` click %}
- {% url `.type()` type %}

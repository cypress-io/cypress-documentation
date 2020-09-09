---
title: shadow
---

Traverse into the shadow DOM of an element.

# Syntax

```javascript
.shadow(selector)
.shadow(selector, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.shadow-host').shadow()
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.shadow()                            // Errors, cannot be chained off 'cy'
cy.exec('npm start').shadow()          // Errors, 'exec' does not yield DOM element
cy.get('.not-a-shadow-host').shadow()  // Errors, subject must host a shadow root
```

## Yields {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .shadow %}

# Examples

## Traverse into the shadow DOM of an element

```html
<div class="shadow-host">
  #shadow-root
    <button class="my-button">Click me</button>
</div>
```

```javascript
// yields [#shadow-root (open)]
cy.get('.shadow-host').shadow()
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements shadow_dom .shadow %}

## Assertions {% helper_icon assertions %}

{% assertions shadow_dom_existence .shadow %}

## Timeouts {% helper_icon timeout %}

{% timeouts shadow_dom_existence .shadow %}

# Command Log

***Traverse into the shadow DOM of an element***

```javascript
cy.get('.shadow-host').shadow()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/shadow/shadow-command-log.png "Command Log shadow" %}

When clicking on the `shadow` command within the command log, the console outputs the following:

{% imgTag /img/api/shadow/shadow-in-console.png "console.log shadow" %}

# See also

- {% url `cy.get()` get#Arguments %} with `includeShadowDom` option
- {% url `cy.find()` find#Arguments %} with `includeShadowDom` option
- {% url `cy.contains()` contains#Arguments %} with `includeShadowDom` option

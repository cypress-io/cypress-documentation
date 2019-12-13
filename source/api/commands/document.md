---
title: document
---

Get the `window.document` of the page that is currently active.

# Syntax

```javascript
cy.document()
cy.document(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.document()     // yield the window.document object
```

## Arguments

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.document()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.document %}

## Yields {% helper_icon yields %}

{% yields sets_subject cy.document 'yields the `window.document` object' %}

# Examples

## No Args

### Get document and do some work

```javascript
cy.document().then((doc) => {
  // work with document element
})
```

### Make an assertion about the document

```javascript
cy.document().its('contentType').should('eq', 'text/html')
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.document %}

## Assertions {% helper_icon assertions %}

{% assertions retry cy.document %}

## Timeouts {% helper_icon timeout %}

{% timeouts assertions cy.document %}

# Command Log

***Get the document***

```javascript
cy.document()
```

The command above will display in the Command Log as:

{% imgTag /img/api/document/get-document-of-application-in-command-log.png "Command log document" %}

When clicking on `document` within the command log, the console outputs the following:

{% imgTag /img/api/document/console-yields-the-document-of-aut.png "console.log document" %}

# See also

- {% url `cy.window()` window %}
- {% url 'Cypress `should` callback' https://glebbahmutov.com/blog/cypress-should-callback/ %}

---
title: url
---

Get the current URL of the page that is currently active.

{% note info %}
This is an alias of {% url "`cy.location('href')`" location %}
{% endnote %}

# Syntax

```javascript
cy.url()
cy.url(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.url()    // Yields the current URL as a string
```

## Arguments

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.url()`.

**cy.url( *options* )**

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.url %}

## Yields {% helper_icon yields %}

{% yields sets_subject cy.url 'yields the current URL as a string' %}

# Examples

## No Args

### Assert the URL is `http://localhost:8000/users/1/edit`

```javascript
// clicking the anchor causes the browser to follow the link
cy.get('#user-edit a').click()
cy.url().should('include', '/users/1/edit') // => true
cy.url().should('eq', 'http://localhost:8000/users/1/edit') // => true
```

# Notes

## Href Shorthand

### URL is an alias for `cy.location('href')`

`cy.url()` uses `href` under the hood.

```javascript
cy.url()                  // these yield the same string
cy.location('href')       // these yield the same string
```

## Differences

### URL versus href

Given the remote URL, `http://localhost:8000/index.html`, all 3 of these assertions are the same.

```javascript
cy.location('href').should('include', '/index.html')

cy.location().its('href').should('include', '/index.html')

cy.url().should('include', '/index.html')
```

`href` and `toString` come from the `window.location` spec.

But you may be wondering where the URL property comes from.  Per the `window.location` spec, there actually isn't a URL property on the `location` object.

`cy.url()` exists because it's what most developers naturally assume would return them the full current URL.  We almost never refer to the URL as an `href`.

### Hardcoded versus using the configuration object

Instead of hardcoding the URL you can use the `baseUrl` of the {% url 'Cypress configuration' configuration %}.

Given the remote URL, `http://localhost:8000/index.html`, these assertions are the same.

```javascript
cy.url().should('eq', 'http://localhost:8000/index.html')
cy.url().should('eq', Cypress.config().baseUrl + '/index.html') // tests won't fail in case the port changes
```

### Assert that the url contains "#users/new"

```javascript
cy.url().should('contain', '#users/new')
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.url %}

## Assertions {% helper_icon assertions %}

{% assertions retry cy.url %}

## Timeouts {% helper_icon timeout %}

{% timeouts assertions cy.url %}

# Command Log

The commands above will display in the Command Log as:

{% imgTag /img/api/url/test-url-of-website-or-web-application.png "Command Log url" %}

When clicking on URL within the Command Log, the console outputs the following:

{% imgTag /img/api/url/console-log-of-browser-url-string.png "Console Log url" %}

{% history %}
{% url "< 0.3.3" changelog#0-3-3 %} | `cy.url()` command added
{% endhistory %}

# See also

- {% url `cy.hash()` hash %}
- {% url `cy.location()` location %}

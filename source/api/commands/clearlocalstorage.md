---
title: clearLocalStorage
---

Clear data in localStorage for current domain and subdomain.

{% note warning %}
Cypress automatically runs this command *before* each test to prevent state from being shared across tests. You shouldn't need to use this command unless you're using it to clear localStorage inside a single test.
{% endnote %}

# Syntax

```javascript
cy.clearLocalStorage()
cy.clearLocalStorage(key)
cy.clearLocalStorage(options)
cy.clearLocalStorage(keys, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.clearLocalStorage()  // clear all local storage
```

## Arguments

**{% fa fa-angle-right %} keys** ***(String, RegExp)***

Specify key to be cleared in localStorage.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.clearLocalStorage()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}

## Yields {% helper_icon yields %}

{% yields null cy.clearLocalStorage %}

# Examples

## No Args

### Clear all localStorage

```javascript
cy.clearLocalStorage()
```

## Specific Key

### Clear localStorage with the key 'appName'

```javascript
cy.clearLocalStorage('appName')
```

### Clear all localStorage matching `/app-/` RegExp

```javascript
cy.clearLocalStorage(/app-/)
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.clearLocalStorage %}

## Assertions {% helper_icon assertions %}

{% assertions none cy.clearLocalStorage %}

## Timeouts {% helper_icon timeout %}

{% timeouts none cy.clearLocalStorage %}

# Command Log

```javascript
cy.clearLocalStorage(/prop1|2/).then((ls) => {
  expect(ls.getItem('prop1')).to.be.null
  expect(ls.getItem('prop2')).to.be.null
  expect(ls.getItem('prop3')).to.eq('magenta')
})
```

The commands above will display in the Command Log as:

{% imgTag /img/api/clearlocalstorage/clear-ls-localstorage-in-command-log.png "Command log for clearLocalStorage" %}

When clicking on `clearLocalStorage` within the command log, the console outputs the following:

{% imgTag /img/api/clearlocalstorage/local-storage-object-shown-in-console.png "console.log for clearLocalStorage" %}

# See also

- {% url `cy.clearCookies()` clearcookies %}

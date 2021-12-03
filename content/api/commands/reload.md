---
title: reload
e2eSpecific: true
---

Reload the page.

## Syntax

```javascript
cy.reload()
cy.reload(forceReload)
cy.reload(options)
cy.reload(forceReload, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.reload()
```

### Arguments

**<Icon name="angle-right"></Icon> forceReload** **_(Boolean)_**

Whether to reload the current page without using the cache. `true` forces the
reload without cache.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

| Option    | Default                                                        | Description                                                                                                                                                                                        |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log`     | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log)                                                                                                           |
| `timeout` | [`pageLoadTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.reload()` to resolve before [timing out](#Timeouts) Note: Network requests are limited by the underlying operating system, and may still time out if this value is increased. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.reload()` 'yields the `window` object after the page finishes
loading' </li></List>

## Examples

### No Args

#### Reload the page as if the user clicked 'Refresh'

```javascript
cy.visit('http://localhost:3000/admin')
cy.get('#undo-btn').click().should('not.be.visible')
cy.reload()
cy.get('#undo-btn').click().should('not.be.visible')
```

### Force Reload

#### Reload the page without using the cache

```javascript
cy.visit('http://localhost:3000/admin')
cy.reload(true)
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.reload()` requires being chained off of
`cy`.</li><li>`cy.reload()` requires the response to be
`content-type: text/html`.</li><li>`cy.reload()` requires the response code to
be `2xx` after following redirects.</li><li>`cy.reload()` requires the load
`load` event to eventually fire.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.reload()` will automatically wait for assertions you have chained
to pass</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.reload()` can time out waiting for the page to fire its `load`
event.</li><li>`cy.reload()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Reload the page_**

```javascript
cy.reload()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/reload/test-page-after-reload-button.png" alt="Command Log reload" ></DocsImage>

When clicking on `reload` within the command log, the console outputs the
following:

<DocsImage src="/img/api/reload/command-log-for-reload-cypress.png" alt="Console Log reload" ></DocsImage>

## See also

- [`cy.go()`](/api/commands/go)
- [`cy.visit()`](/api/commands/visit)

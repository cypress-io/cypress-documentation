---
title: hash
e2eSpecific: true
---

Get the current URL hash of the page that is currently active.

<Alert type="info">

This is an alias of [`cy.location('hash')`](/api/commands/location)

</Alert>

## Syntax

```javascript
cy.hash()
cy.hash(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.hash() // Get the url hash
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.hash()`.

**cy.hash( _options_ )**

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.hash()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

#### When the current URL contains a hash:

<List><li>`cy.hash()` "yields the current URL's hash (including the `#`
character)" </li></List>

#### When the current URL does not contain a hash:

<List><li>`cy.hash()` "yields an empty string" </li></List>

## Examples

### No Args

#### Assert that hash is `#/users/1` given remote URL: `http://localhost:8000/app/#/users/1`

```javascript
// yields #/users/1
cy.hash().should('eq', '#/users/1') // => true
```

#### Assert that the hash matches via RegExp

```html
<ul id="users">
  <li>
    <a href="#/users/8fc45b67-d2e5-465a-b822-b281d9c8e4d1">Fred</a>
  </li>
</ul>
```

```javascript
cy.get('#users li').find('a').click()
cy.hash().should('match', /users\/.+$/) // => true
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.hash()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.hash()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.hash()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Assert that the hash matches `#users/new`_**

```javascript
cy.hash().should('eq', '#users/new')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/hash/test-url-hash-for-users-page.png" alt="Command Log for hash" ></DocsImage>

When clicking on `hash` within the command log, the console outputs the
following:

<DocsImage src="/img/api/hash/hash-command-yields-url-after-hash.png" alt="Console Log for hash" ></DocsImage>

## See also

- [`cy.location()`](/api/commands/location)
- [`cy.url()`](/api/commands/url)

---
title: url
---

Get the current URL of the page that is currently active.

<Alert type="info">

This is an alias of [`cy.location('href')`](/api/commands/location)

</Alert>

## Syntax

```javascript
cy.url()
cy.url(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.url() // Yields the current URL as a string
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.url()`.

**cy.url( _options_ )**

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `decode`  | `false`                                                              | Decode URL                                                                               |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.url()` to resolve before [timing out](#Timeouts)                    |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.url()` 'yields the current URL as a string' </li></List>

## Examples

### No Args

#### Assert the URL is `http://localhost:8000/users/1/edit`

```javascript
// clicking the anchor causes the browser to follow the link
cy.get('#user-edit a').click()
cy.url().should('include', '/users/1/edit') // => true
cy.url().should('eq', 'http://localhost:8000/users/1/edit') // => true
```

### `decode` option

When the URL contains non-ASCII characters, use the `decode` option.

```javascript
// For the curious, '사랑' means 'love' in Korean.
cy.url({ decode: true }).should('contain', '사랑')
```

## Notes

### Href Shorthand

#### URL is an alias for `cy.location('href')`

`cy.url()` uses `href` under the hood.

```javascript
cy.url() // these yield the same string
cy.location('href') // these yield the same string
```

### Differences

#### URL versus href

Given the remote URL, `http://localhost:8000/index.html`, all 3 of these
assertions are the same.

```javascript
cy.location('href').should('include', '/index.html')

cy.location().its('href').should('include', '/index.html')

cy.url().should('include', '/index.html')
```

`href` and `toString` come from the `window.location` spec.

But you may be wondering where the URL property comes from. Per the
`window.location` spec, there actually isn't a URL property on the `location`
object.

`cy.url()` exists because it's what most developers naturally assume would
return them the full current URL. We almost never refer to the URL as an `href`.

#### Hardcoded versus using the configuration object

Instead of hard-coding the URL used in the assertion, you can use the `baseUrl` the
defined in the [Cypress configuration](/guides/references/configuration).

Given the remote URL, `http://localhost:8000/index.html`, and the baseUrl, `http://localhost:8000`,
these assertions are the same.

```javascript
cy.url().should('eq', 'http://localhost:8000/index.html')
cy.url().should('eq', Cypress.config().baseUrl + '/index.html') // tests won't fail in case the port changes
```

#### Assert that the url contains "#users/new"

```javascript
cy.url().should('contain', '#users/new')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.url()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.url()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.url()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

The commands above will display in the Command Log as:

<DocsImage src="/img/api/url/test-url-of-website-or-web-application.png" alt="Command Log url" ></DocsImage>

When clicking on URL within the Command Log, the console outputs the following:

<DocsImage src="/img/api/url/console-log-of-browser-url-string.png" alt="Console Log url" ></DocsImage>

## History

| Version                                       | Changes                  |
| --------------------------------------------- | ------------------------ |
| [8.4.0](/guides/references/changelog#8-4-0)   | `decode` option added    |
| [< 0.3.3](/guides/references/changelog#0-3-3) | `cy.url()` command added |

## See also

- [`cy.hash()`](/api/commands/hash)
- [`cy.location()`](/api/commands/location)

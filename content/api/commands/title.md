---
title: title
---

Get the `document.title` property of the page that is currently active.

## Syntax

```javascript
cy.title()
cy.title(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.title() // Yields the documents title as a string
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.title()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.title()` to resolve before [timing out](#Timeouts)                  |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.title()` 'yields the `document.title` property of the current
page' </li></List>

## Examples

### No Args

#### Assert that the document's title is "My Awesome Application"

```javascript
cy.title().should('eq', 'My Awesome Application')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.title()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.title()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.title()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Assert that the document's title includes 'New User'_**

```javascript
cy.title().should('include', 'New User')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/title/test-title-of-website-or-webapp.png" alt="Command Log title" />

When clicking on `title` within the command log, the console outputs the
following:

<DocsImage src="/img/api/title/see-the-string-yielded-in-the-console.png" alt="Console Log title" />

## History

| Version                                       | Changes                    |
| --------------------------------------------- | -------------------------- |
| [< 0.3.3](/guides/references/changelog#0-3-3) | `cy.title()` command added |

## See also

- [`cy.document()`](/api/commands/document)

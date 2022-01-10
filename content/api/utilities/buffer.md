---
title: Cypress.Buffer
---

Cypress automatically includes a [Buffer](https://github.com/feross/buffer)
polyfill for the browser and exposes it as `Cypress.Buffer`.

Use `Cypress.Buffer` to manipulate binary data, similar to the
[nodejs Buffer class](https://nodejs.org/api/buffer.html). Instances are
returned by `cy.readFile()` and `cy.fixture()`, and it is used with
`.selectFile()`.

## Syntax

```javascript
Cypress.Buffer.method()
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.Buffer.method()
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.Buffer.method() // Errors, cannot be chained off 'cy'
```

## Examples

### Image Fixture

#### Maniulating binary data read from disk

```javascript
// Programmatically upload the logo
cy.readFile('images/logo.png', null).then((file) => {
  Cypress.Buffer.isBuffer(file) // true
})
```

#### Using dynamic file contents with `.selectFile()`

```javascript
const files = []

for (var i = 1; i <= 10; i++) {
  files.push(Buffer.from(`Contents of file #${i}`))
}

// Attach 10 files, of the form "Contents of file #1", "Contents of file #2", etc.
cy.get('input[type=file]').selectFile(files)
```

## History

| Version                               | Changes                 |
| ------------------------------------- | ----------------------- |
| [9.3.0](/guides/references/changelog) | Added `Cypress.Buffer`. |

## See also

- [Bundled Tools](/guides/references/bundled-tools)

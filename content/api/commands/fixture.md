---
title: fixture
---

Load a fixed set of data located in a file.

## Syntax

```javascript
cy.fixture(filePath)
cy.fixture(filePath, encoding)
cy.fixture(filePath, options)
cy.fixture(filePath, encoding, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.fixture('users').as('usersJson') // load data from users.json
cy.fixture('logo.png').then((logo) => {
  // load data from logo.png
})
```

### Arguments

**<Icon name="angle-right"></Icon> filePath** **_(String)_**

A path to a file within the [`fixturesFolder`](/guides/references/configuration#Folders-Files) , which defaults to `cypress/fixtures`.

You can nest fixtures within folders and reference them by defining the path from the fixturesFolder:

```javascript
cy.fixture('users/admin.json') // Get data from {fixturesFolder}/users/admin.json
```

**<Icon name="angle-right"></Icon> encoding** **_(String)_**

The encoding to be used when reading the file. The following encodings are supported:

- `ascii`
- `base64`
- `binary`
- `hex`
- `latin1`
- `utf8`
- `utf-8`
- `ucs2`
- `ucs-2`
- `utf16le`
- `utf-16le`

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.fixture()`.

| Option    | Default                                                        | Description                                                               |
| --------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.fixture()` to resolve before [timing out](#Timeouts) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.fixture()` yields the contents of the file. Formatting is determined by its file extension.

## Examples

### JSON

#### Load a `users.json` fixture

```javascript
cy.fixture('users.json').as('usersData')
```

#### Omit the fixture file's extension

When no extension is passed to `cy.fixture()`, Cypress will search for files with the specified name within the [`fixturesFolder`](/guides/references/configuration#Folders-Files) (which defaults to `cypress/fixtures`) and resolve the first one.

```javascript
cy.fixture('admin').as('adminJSON')
```

The example above would resolve in the following order:

1. `cypress/fixtures/admin.json`
2. `cypress/fixtures/admin.js`
3. `cypress/fixtures/admin.coffee`
4. `cypress/fixtures/admin.html`
5. `cypress/fixtures/admin.txt`
6. `cypress/fixtures/admin.csv`
7. `cypress/fixtures/admin.png`
8. `cypress/fixtures/admin.jpg`
9. `cypress/fixtures/admin.jpeg`
10. `cypress/fixtures/admin.gif`
11. `cypress/fixtures/admin.tif`
12. `cypress/fixtures/admin.tiff`
13. `cypress/fixtures/admin.zip`

### Images

#### Image fixtures are sent as `base64`

```javascript
cy.fixture('images/logo.png').then((logo) => {
  // logo will be encoded as base64
  // and should look something like this:
  // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
})
```

#### Change encoding of Image fixture

```javascript
cy.fixture('images/logo.png', 'binary').then((logo) => {
  // logo will be encoded as binary
  // and should look something like this:
  // 000000000000000000000000000000000000000000...
})
```

### Playing MP3 file

```javascript
cy.fixture('audio/sound.mp3', 'base64').then((mp3) => {
  const uri = 'data:audio/mp3;base64,' + mp3
  const audio = new Audio(uri)

  audio.play()
})
```

### Accessing Fixture Data

#### Using `.then()` to access fixture data

```javascript
cy.fixture('users').then((json) => {
  cy.intercept('GET', '/users/**', json)
})
```

#### Using fixtures to bootstrap data

<Alert type="info">

[Check out our example recipe using `cy.fixture()` to bootstrap data for our application.](/examples/examples/recipes#Server-Communication)

</Alert>

#### Modifying fixture data before using it

You can modify fixture data directly before passing it along to a route.

```javascript
cy.fixture('user').then((user) => {
  user.firstName = 'Jane'
  cy.intercept('GET', '/users/1', user).as('getUser')
})

cy.visit('/users')
cy.wait('@getUser').then(({ request }) => {
  expect(request.body.firstName).to.eq('Jane')
})
```

## Notes

### Shortcuts

#### Using the `fixture` `StaticResponse` property

Fixtures can also be referenced directly without using the `.fixture()` command by using the special property `fixture` on the [`cy.intercept()`](/api/commands/intercept) `StaticResponse` object.

```javascript
cy.intercept('GET', '/users/**', { fixture: 'users' })
```

### Validation

#### Automated File Validation

Cypress automatically validates your fixtures. If your `.json`, `.js`, or `.coffee` files contain syntax errors, they will be shown in the Command Log.

### Encoding

#### Default Encoding

Cypress automatically determines the encoding for the following file types:

- `.json`
- `.js`
- `.coffee`
- `.html`
- `.txt`
- `.csv`
- `.png`
- `.jpg`
- `.jpeg`
- `.gif`
- `.tif`
- `.tiff`
- `.zip`

For other types of files, they will be read as `utf8` by default, unless specified in the second argument of `cy.fixture()`.

### `this` context

If you store and access the fixture data using `this` test context object, make sure to use `function () { ... }` callbacks. Otherwise the test engine will NOT have `this` pointing at the test context.

```javascript
describe('User page', () => {
  beforeEach(function () {
    // "this" points at the test context object
    cy.fixture('user').then((user) => {
      // "this" is still the test context object
      this.user = user
    })
  })

  // the test callback is in "function () { ... }" form
  it('has user', function () {
    // this.user exists
    expect(this.user.firstName).to.equal('Jane')
  })
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.fixture()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.fixture()` will only run assertions you have chained once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.fixture()` should never time out.

<Alert type="warning">

Because `cy.fixture()` is asynchronous it is technically possible for there to be a timeout while talking to the internal Cypress automation APIs. But for practical purposes it should never happen.

</Alert>

## Command Log

- `cy.fixture()` does _not_ log in the Command Log

## See also

- [`cy.intercept()`](/api/commands/intercept)
- [`.then()`](/api/commands/then)
- [Recipe: Bootstrapping App Test Data](/examples/examples/recipes#Server-Communication)
- [Fixtures](https://github.com/cypress-io/testing-workshop-cypress#fixtures) section of the Cypress Testing Workshop

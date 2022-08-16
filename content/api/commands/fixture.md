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

A path to a file within the
[`fixturesFolder`](/guides/references/configuration#Folders-Files) , which
defaults to `cypress/fixtures`.

You can nest fixtures within folders and reference them by defining the path
from the fixturesFolder:

```javascript
cy.fixture('users/admin.json') // Get data from {fixturesFolder}/users/admin.json
```

**<Icon name="angle-right"></Icon> encoding** **_(String)_**

The encoding to be used when reading the file. The following encodings are
supported:

- `'ascii'`
- `'base64'`
- `'binary'`
- `'hex'`
- `'latin1'`
- `'utf8'`
- `'utf-8'`
- `'ucs2'`
- `'ucs-2'`
- `'utf16le'`
- `'utf-16le'`
- `null`

Using `null` explicitly will return the fixture as a
[`Cypress.Buffer`](/api/utilities/buffer) instance, regardless of file
extension.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.fixture()`.

| Option    | Default                                                        | Description                                                               |
| --------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.fixture()` to resolve before [timing out](#Timeouts) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.fixture()` yields the contents of the file. Formatting is determined by its
file extension.

## Examples

### JSON

#### Load a `users.json` fixture

```javascript
cy.fixture('users.json').as('usersData')
```

#### Omit the fixture file's extension

When no extension is passed to `cy.fixture()`, Cypress will search for files
with the specified name within the
[`fixturesFolder`](/guides/references/configuration#Folders-Files) (which
defaults to `cypress/fixtures`) and resolve the first one.

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

#### Use import statement

If you are loading a JSON fixture, you can simply use the `import` statement and
let the bundler load it:

```js
// cypress/e2e/spec.cy.js
import user from '../fixtures/user.json'
it('loads the same object', () => {
  cy.fixture('user').then((userFixture) => {
    expect(user, 'the same data').to.deep.equal(userFixture)
  })
})
```

### Images

#### Image fixtures are sent as `base64` by default

```javascript
cy.fixture('images/logo.png').then((logo) => {
  // logo will be encoded as base64
  // and should look something like this:
  // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
})
```

#### Change encoding of Image fixture

```javascript
cy.fixture('images/logo.png', null).then((logo) => {
  // logo will be read as a buffer
  // and should look something like this:
  // Buffer([0, 0, ...])
  expect(Cypress.Buffer.isBuffer(logo)).to.be.true
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

You can modify fixture data directly before visiting a URL or mounting a
component that makes a network request to that URL.

<e2e-or-ct>
<template #e2e>

```js
cy.fixture('user').then((user) => {
  user.firstName = 'Jane'
  cy.intercept('GET', '/users/1', user).as('getUser')
})

cy.visit('/users')
cy.wait('@getUser').then(({ request }) => {
  expect(request.body.firstName).to.eq('Jane')
})
```

</template>
<template #ct>

```js
cy.fixture('user').then((user) => {
  user.firstName = 'Jane'
  cy.intercept('GET', '/users/1', user).as('getUser')
})

cy.mount(<Users />)
cy.wait('@getUser').then(({ request }) => {
  expect(request.body.firstName).to.eq('Jane')
})
```

</template>
</e2e-or-ct>

## Notes

### Shortcuts

#### Using the `fixture` `StaticResponse` property

Fixtures can also be referenced directly without using the `.fixture()` command
by using the special property `fixture` on the
[`cy.intercept()`](/api/commands/intercept) `StaticResponse` object.

```javascript
cy.intercept('GET', '/users/**', { fixture: 'users' })
```

### Validation

#### Automated File Validation

Cypress automatically validates your fixtures. If your `.json`, `.js`, or
`.coffee` files contain syntax errors, they will be shown in the Command Log.

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

For other types of files, they will be read as `utf8` by default, unless
specified in the second argument of `cy.fixture()`. You can specify `null` as
the encoding in order to read the file as a
[`Cypress.Buffer`](/api/utilities/buffer) instance instead.

### `this` context

If you store and access the fixture data using `this` test context object, make
sure to use `function () { ... }` callbacks. Otherwise the test engine will NOT
have `this` pointing at the test context.

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

### Loaded just once

Please keep in mind that fixture files are assumed to be unchanged during the
test, and thus Cypress loads them just once. Even if you overwrite the fixture
file itself, the already loaded fixture data remains the same.

If you wish to dynamically change the contents of a file during your tests,
consider [`cy.readFile()`](/api/commands/readFile) instead.

For example, if you want to reply to a network request with different object,
the following **will not work**:

```js
// 🚨 DOES NOT WORK
cy.intercept('GET', '/todos/1', { fixture: 'todo' }).as('todo')
// application requests the /todos/1 resource
// the intercept replies with the object from todo.json file

cy.wait('@todo').then(() => {
  cy.writeFile('/cypress/fixtures/todo.json', { title: 'New data' })
})
// application requests the /todos/1 resource again
// the intercept replies with the originally loaded object
// from the todo.json file and NOT { "title": "New data" }
```

In this situation, avoid using the fixture file and instead respond to the
network request with the object

```js
// ✅ RESPOND WITH OBJECT
cy.fixture('todo.json').then((todo) => {
  cy.intercept('GET', '/todos/1', { body: todo }).as('todo')
  // application requests the /todos/1 resource
  // the intercept replies with the initial object

  cy.wait('@todo').then(() => {
    // modify the response object
    todo.title = 'New data'
    // and override the intercept
    cy.intercept('GET', '/todos/1', { body: todo })
  })
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.fixture()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.fixture()` will only run assertions you have chained once, and
will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.fixture()` should never time out.

<Alert type="warning">

Because `cy.fixture()` is asynchronous it is technically possible for there to
be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

- `cy.fixture()` does _not_ log in the Command Log

## See also

- [Guide: Variables and Aliases](/guides/core-concepts/variables-and-aliases)
- [`cy.intercept()`](/api/commands/intercept)
- [`.then()`](/api/commands/then)
- [`.readFile()`](/api/commands/readFile) for a similar command without caching
  and with builtin retryability
- [Recipe: Bootstrapping App Test Data](/examples/examples/recipes#Server-Communication)
- [Fixtures](https://github.com/cypress-io/testing-workshop-cypress#fixtures)
  section of the Cypress Testing Workshop
- [Blog: Load Fixtures from Cypress Custom Commands](https://glebbahmutov.com/blog/fixtures-in-custom-commands/)
  explains how to load or import fixtures to be used in the Cypress custom
  commands.

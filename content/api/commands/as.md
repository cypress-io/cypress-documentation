---
title: as
---

Assign an alias for later use. Reference the alias later within a
[`cy.get()`](/api/commands/get) query or [`cy.wait()`](/api/commands/wait)
command with an `@` prefix.

<Alert type="info">

**Note:** `.as()` assumes you are already familiar with core concepts such as
[aliases](/guides/core-concepts/variables-and-aliases)

</Alert>

## Syntax

```javascript
.as(aliasName)
.as(aliasName, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.main-nav').find('li').first().as('firstNav') // Alias element as @firstNav
cy.get('input.username').invoke('val').as('username', { type: 'value' }) // Alias a static (not re-queried) value
cy.intercept('PUT', '/users').as('putUser') // Alias route as @putUser
cy.stub(api, 'onUnauth').as('unauth') // Alias stub as @unauth
cy.spy(win, 'fetch').as('winFetch') // Alias spy as @winFetch
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.as('foo') // Errors, cannot be chained off 'cy'
```

### Arguments

**<Icon name="angle-right"></Icon> aliasName** **_(String)_**

The name of the alias to be referenced later within a
[`cy.get()`](/api/commands/get) or [`cy.wait()`](/api/commands/wait) command
using an `@` prefix.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.as`.

| Option | Default | Description                                                                                                                                                                                                                          |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type` | `query` | Valid values are `query` and `value`. A query alias re-runs all queries leading up to it each time the value is requested, providing a live value. A value alias is frozen as soon as the alias is stored, providing a static value. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `.as()` yields the same subject it was given.
- It is _safe_ to chain further commands after `.as()`.

## Examples

### DOM element

Aliasing a DOM element and then using [`cy.get()`](/api/commands/get) to access
the aliased element.

```javascript
it('disables on click', () => {
  cy.get('button[type=submit]').as('submitBtn')
  cy.get('@submitBtn').click().should('be.disabled')
})
```

### Intercept

Aliasing an intercepted route defined with
[`cy.intercept()`](/api/commands/intercept) and then using
[`cy.wait()`](/api/commands/wait) to wait for the aliased route.

```javascript
// `PUT` requests on the `/users` endpoint will be stubbed with
// the `user` fixture and be aliased as `editUser`
cy.intercept('PUT', '/users', { fixture: 'user' }).as('editUser')

// we'll assume submitting `form` triggers a matching request
cy.get('form').submit()

// once a response comes back from the `editUser`
// this `wait` will resolve with the subject containing `url`
cy.wait('@editUser').its('url').should('contain', 'users')
```

More examples of aliasing routes can be found
[here](/api/commands/intercept#Aliasing-an-intercepted-route).

### Fixture

Aliasing [`cy.fixture()`](/api/commands/fixture) data and then using `this` to
access it via the alias.

```javascript
beforeEach(() => {
  cy.fixture('users-admins.json').as('admins')
})

it('the users fixture is bound to this.admins', function () {
  cy.log(`There are ${this.admins.length} administrators.`)
})
```

<Alert type="warning">

Note the use of the standard function syntax. Using
[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
to access aliases via `this` won't work because of
[the lexical binding](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_separate_this)
of `this`.

</Alert>

## Notes

### Aliases are reset

<Alert type="warning">

**Note:** all aliases are reset before each test. See the
[aliases guide](/guides/core-concepts/variables-and-aliases) for details.

</Alert>

### Reserved words

#### Alias names cannot match some reserved words.

Some strings are not allowed as alias names since they are reserved words in
Cypress. These words include: `test`, `runnable`, `timeout`, `slow`, `skip`, and
`inspect`.

### `as` is asynchronous

Remember that **Cypress commands are async**, including `.as()`.

Because of this you cannot _synchronously_ access anything you have aliased. You
must use other asynchronous commands such as [`.then()`](/api/commands/then) to
access what you've aliased.

Here are some further examples of using `.as()` that illustrate the asynchronous
behavior.

```javascript
describe('A fixture', () => {
  describe('alias can be accessed', () => {
    it('via get().', () => {
      cy.fixture('admin-users.json').as('admins')
      cy.get('@admins').then((users) => {
        cy.log(`There are ${users.length} admins.`)
      })
    })

    it('via then().', function () {
      cy.fixture('admin-users.json').as('admins')
      cy.visit('/').then(() => {
        cy.log(`There are ${this.admins.length} admins.`)
      })
    })
  })

  describe('aliased in beforeEach()', () => {
    beforeEach(() => {
      cy.fixture('admin-users.json').as('admins')
    })

    it('is bound to this.', function () {
      cy.log(`There are ${this.admins.length} admins.`)
    })
  })
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.as()` requires being chained off a previous command.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.as()` is a utility command.</li><li>`.as()` will not run assertions.
Assertions will pass through as if this command did not exist.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.as()` cannot time out.</li></List>

## Command Log

**_Alias several routes_**

```javascript
cy.intercept('/company/*').as('companyGet')
cy.intercept('/roles/*').as('rolesGet')
cy.intercept('/teams/*').as('teamsGet')
cy.intercept(/users\/\d+/).as('userGet')
cy.intercept('PUT', /^\/users\/\d+/).as('userPut')
```

Aliases of routes display in the routes instrument panel:

<DocsImage src="/img/api/as/routes-table-in-command-log.png" alt="Command log for route" ></DocsImage>

## History

| Version                                       | Changes                                                       |
| --------------------------------------------- | ------------------------------------------------------------- |
| [12.3.0](/guides/references/changelog#12-3-0) | Added option `type` to opt into the pre-12.0.0 behavior.      |
| [12.0.0](/guides/references/changelog#12-0-0) | All aliases now re-run queries leading up to them by default. |

## See also

- [`cy.get()`](/api/commands/get)
- [`cy.wait()`](/api/commands/wait)
- [Guides: Aliases](/guides/core-concepts/variables-and-aliases)

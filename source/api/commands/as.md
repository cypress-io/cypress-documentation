---
title: as
---

Assign an alias for later use. Reference the alias later within a {% url `cy.get()` get %} or {% url `cy.wait()` wait %} command with an `@` prefix.

{% note info %}
**Note:** `.as()` assumes you are already familiar with core concepts such as {% url 'aliases' variables-and-aliases %}
{% endnote %}

# Syntax

```javascript
.as(aliasName)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.main-nav').find('li').first().as('firstNav') // Alias first 'li' as @firstNav
cy.http('PUT', 'users', { fixture: 'user' }).as('putUser')     // Alias that route as @putUser
cy.stub(api, 'onUnauth').as('unauth')                 // Alias that stub as @unauth
cy.spy(win, 'fetch').as('winFetch')                   // Alias that spy as @winFetch
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.as('foo')   // Errors, cannot be chained off 'cy'
```

## Arguments

**{% fa fa-angle-right %} aliasName** ***(String)***

The name of the alias to be referenced later within a {% url `cy.get()` get %} or {% url `cy.wait()` wait %} command using an `@` prefix.

## Yields {% helper_icon yields %}

{% yields same_subject .as %}

# Examples

## DOM element

Aliasing a DOM element and then using {% url `cy.get()` get %} to access the aliased element.

```javascript
it('disables on click', () => {
  cy.get('button[type=submit]').as('submitBtn')
  cy.get('@submitBtn').click().should('be.disabled')
})
```

## Route

Aliasing a route and then using {% url `cy.wait()` wait %} to wait for the aliased route.

```javascript
cy.http('PUT', 'users', { fixture: 'user' }).as('userPut')
cy.get('form').submit()
cy.wait('@userPut')
  .its('url').should('contain', 'users')
```

## Fixture

Aliasing {% url `cy.fixture()` fixture %} data and then using `this` to access it via the alias.

```javascript
beforeEach(() => {
  cy.fixture('users-admins.json').as('admins')
})

it('the users fixture is bound to this.admins', function () {
  cy.log(`There are ${this.admins.length} administrators.`)
})
```

{% note warning %}
Note the use of the standard function syntax. Using {% url 'arrow functions' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions %} to access aliases via `this` won't work because of {% url 'the lexical binding' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_separate_this %} of `this`.
{% endnote %}

# Notes

## Reserved words

### Alias names cannot match some reserved words.

Some strings are not allowed as alias names since they are reserved words in Cypress. These words include: `test`, `runnable`, `timeout`, `slow`, `skip`, and `inspect`.

## `as` is asynchronous

Remember that **Cypress commands are async**, including `.as()`.

Because of this you cannot _synchronously_ access anything you have aliased. You must use other asynchronous commands such as {% url `.then()` then %} to access what you've aliased.

Here are some further examples of using `.as()` that illustrate the asynchronous behavior.

```javascript
describe('A fixture', () => {
  describe('alias can be accessed', () => {
    it('via get().', () => {
      cy.fixture('admin-users.json').as('admins')
      cy.get('@admins')
        .then((users) => {
          cy.log(`There are ${users.length} admins.`)
        })
    })

    it('via then().', function () {
      cy.fixture('admin-users.json').as('admins')
      cy.visit('/')
        .then(() => {
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

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .as %}

## Assertions {% helper_icon assertions %}

{% assertions utility .as %}

## Timeouts {% helper_icon timeout %}

{% timeouts none .as %}

# Command Log

***Alias several routes***

```javascript
cy.http(/company/, { fixture: 'company' }).as('companyGet')
cy.http(/roles/, { fixture: 'roles' }).as('rolesGet')
cy.http(/teams/, { fixture: 'teams' }).as('teamsGet')
cy.http(/users\/\d+/, { fixture: 'user' }).as('userGet')
cy.http('PUT', /^\/users\/\d+/, { fixture: 'user' }).as('userPut')
```

Aliases of routes display in the routes instrument panel:

{% imgTag /img/api/as/routes-table-in-command-log.png "Command log for route" %}

# See also

- {% url `cy.get()` get %}
- {% url `cy.wait()` wait %}
- {% url 'Guides: Aliases' variables-and-aliases %}

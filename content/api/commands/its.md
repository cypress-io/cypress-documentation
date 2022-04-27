---
title: its
---

Get a property's value on the previously yielded subject.

<Alert type="info">

If you want to call a `function` on the previously yielded subject, use
[`.invoke()`](/api/commands/invoke).

</Alert>

## Syntax

```javascript
.its(propertyName)
.its(propertyName, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.wrap({ width: '50' }).its('width') // Get the 'width' property
cy.window().its('sessionStorage') // Get the 'sessionStorage' property
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.its('window') // Errors, cannot be chained off 'cy'
cy.clearCookies().its('length') // Errors, 'clearCookies' does not yield Object
```

### Arguments

**<Icon name="angle-right"></Icon> propertyName** **_(String, Number)_**

Index, name of property or name of nested properties (with dot notation) to get.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.its()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.its()` to resolve before [timing out](#Timeouts)                      |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.its()` 'yields the value of the property' </li></List>

## Examples

### Objects

#### Get property

```javascript
cy.wrap({ age: 52 }).its('age').should('eq', 52) // true
```

### Arrays

#### Get index

```javascript
cy.wrap(['Wai Yan', 'Yu']).its(1).should('eq', 'Yu') // true
```

### DOM Elements

#### Get the `length` property of a DOM element

```javascript
cy.get('ul li') // this yields us a jquery object
  .its('length') // calls 'length' property returning that value
  .should('be.gt', 2) // ensure the length is greater than 2
```

### Requests

#### Get the `user` object of the response's `body`

```javascript
cy.request(/*...*/)
  .its('body.user')
  .then((user) => {
    /*...*/
  })
```

alternatively, use destructuring

```javascript
cy.request(/*...*/)
  .its('body')
  .then(({ user }) => {
    /*...*/
  })
```

### Strings

#### Get `length` of title

```javascript
cy.title().its('length').should('eq', 24)
```

### Functions

#### Get function as property

```javascript
const fn = () => {
  return 42
}

cy.wrap({ getNum: fn }).its('getNum').should('be.a', 'function')
```

#### Access function properties

You can access functions to then drill into their own properties instead of
invoking them.

```javascript
// Your app code
// a basic Factory constructor
const Factory = (arg) => {
  // ...
}

Factory.create = (arg) => {
  return new Factory(arg)
}

// assign it to the window
window.Factory = Factory
```

```javascript
cy.window() // yields window object
  .its('Factory') // yields Factory function
  .invoke('create', 'arg') // now invoke properties on it
```

#### Use `.its()` to test `window.fetch`

<Alert type="info">

[Check out our example recipe on testing `window.fetch` using `.its()`](/examples/examples/recipes#Stubbing-and-spying)

</Alert>

### Nested Properties

You can drill into nested properties by using _dot notation_.

```javascript
const user = {
  contacts: {
    work: {
      name: 'Kamil',
    },
  },
}

cy.wrap(user).its('contacts.work.name').should('eq', 'Kamil') // true
```

### Existence

#### Wait for some property to exist on `window`

```javascript
cy.window()
  .its('globalProp')
  .then((globalProp) => {
    // do something now that window.globalProp exists
  })
```

#### Assert that a property does not exist on `window`

```javascript
cy.window().its('evilProp').should('not.exist')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.its()` requires being chained off a previous command.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.its()` will automatically
[retry](/guides/core-concepts/retry-ability) until it has a property that is not
`null` or `undefined`.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.its()` can time out waiting for the property to
exist.</li><li>`.its()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Get `responseBody` of aliased route_**

```javascript
cy.intercept('/comments', { fixture: 'comments.json' }).as('getComments')
cy.get('#fetch-comments').click()
cy.wait('@getComments')
  .its('response.body')
  .should(
    'deep.eq',
    JSON.stringify([
      { id: 1, comment: 'hi' },
      { id: 2, comment: 'there' },
    ])
  )
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/its/xhr-response-its-response-body-for-testing.png" alt="Command Log for its" ></DocsImage>

When clicking on `its` within the command log, the console outputs the
following:

<DocsImage src="/img/api/its/response-body-yielded-with-its-command-log.png" alt="Console Log for its" ></DocsImage>

## History

| Version                                     | Changes                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| [3.8.0](/guides/references/changelog#3-8-0) | Added support for `options` argument                          |
| [3.7.0](/guides/references/changelog#3-7-0) | Added support for arguments of type Number for `propertyName` |

## See also

- [`.invoke()`](/api/commands/invoke)
- [`.then()`](/api/commands/then)
- [`cy.wrap()`](/api/commands/wrap)
- [Adding custom properties to the global `window` with the right TypeScript type](https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense)
- [Set flag to start tests](https://glebbahmutov.com/blog/set-flag-to-start-tests/)

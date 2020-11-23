---
title: its
---

Get a property's value on the previously yielded subject.

{% note info %}
If you want to call a `function` on the previously yielded subject, use {% url `.invoke()` invoke %}.
{% endnote %}

# Syntax

```javascript
.its(propertyName)
.its(propertyName, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.wrap({ width: '50' }).its('width') // Get the 'width' property
cy.window().its('sessionStorage')     // Get the 'sessionStorage' property
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.its('window')                // Errors, cannot be chained off 'cy'
cy.clearCookies().its('length') // Errors, 'clearCookies' does not yield Object
```

## Arguments

**{% fa fa-angle-right %} propertyName**  ***(String, Number)***

Index, name of property or name of nested properties (with dot notation) to get.

**{% fa fa-angle-right %} options** **_(Object)_**

Pass in an options object to change the default behavior of `.its()`.

| Option    | Default                                                  | Description                        |
| --------- | -------------------------------------------------------- | ---------------------------------- |
| `log`     | `true`                                                   | {% usage_options log %}            |
| `timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .its %}   |

## Yields {% helper_icon yields %}

{% yields changes_subject .its 'yields the value of the property' %}

# Examples

## Objects

### Get property

```javascript
cy.wrap({ age: 52 }).its('age').should('eq', 52) // true
```

## Arrays

### Get index

```javascript
cy.wrap(['Wai Yan', 'Yu']).its(1).should('eq', 'Yu') // true
```

## DOM Elements

### Get the `length` property of a DOM element

```javascript
cy
  .get('ul li')       // this yields us a jquery object
  .its('length')      // calls 'length' property returning that value
  .should('be.gt', 2) // ensure the length is greater than 2
})
```

## Requests

### Get the `user` object of the response's `body`

```javascript
cy
  .request(...)
  .its('body.user')
  .then(user => ...)
```

alternatively, use destructuring

```javascript
cy
  .request(...)
  .its('body')
  .then(({user}) => ...)
```

## Strings

### Get `length` of title

```javascript
cy.title().its('length').should('eq', 24)
```

## Functions

### Get function as property

```javascript
const fn = () => {
  return 42
}

cy.wrap({ getNum: fn }).its('getNum').should('be.a', 'function')
```

### Access function properties

You can access functions to then drill into their own properties instead of invoking them.

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
cy
  .window()                 // yields window object
  .its('Factory')           // yields Factory function
  .invoke('create', 'arg')  // now invoke properties on it
```

### Use `.its()` to test `window.fetch`

{% note info %}
{% url "Check out our example recipe on testing `window.fetch` using `.its()`" recipes#Stubbing-and-spying %}
{% endnote %}

## Nested Properties

You can drill into nested properties by using *dot notation*.

```javascript
const user = {
  contacts: {
    work: {
      name: 'Kamil'
    }
  }
}

cy.wrap(user).its('contacts.work.name').should('eq', 'Kamil') // true
```

## Existence

### Wait for some property to exist on `window`

```javascript
cy.window().its('globalProp').then((globalProp) => {
  // do something now that window.globalProp exists
})
```

### Assert that a property does not exist on `window`

```javascript
cy.window().its('evilProp').should('not.exist')
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .its %}

## Assertions {% helper_icon assertions %}

{% assertions its .its %}

## Timeouts {% helper_icon timeout %}

{% timeouts its .its %}

# Command Log

***Get `responseBody` of aliased route***

```javascript
cy.intercept(/comments/, { fixture: 'comments.json' }).as('getComments')
cy.get('#fetch-comments').click()
cy.wait('@getComments').its('response.body').should('deep.eq', JSON.stringify([
  { id: 1, comment: 'hi' },
  { id: 2, comment: 'there' }
]))
```

The commands above will display in the Command Log as:

{% imgTag /img/api/its/xhr-response-its-response-body-for-testing.png "Command Log for its" %}

When clicking on `its` within the command log, the console outputs the following:

{% imgTag /img/api/its/response-body-yielded-with-its-command-log.png "Console Log for its" %}

{% history %}
{% url "3.8.0" changelog#3-8-0 %} | Added support for `options` argument
{% url "3.7.0" changelog#3-7-0 %} | Added support for arguments of type Number for `propertyName`
{% endhistory %}

# See also

- {% url `.invoke()` invoke %}
- {% url `.then()` then %}
- {% url `cy.wrap()` wrap %}
- {% url 'Adding custom properties to the global `window` with the right TypeScript type' https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense %}
- {% url 'Set flag to start tests' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %}

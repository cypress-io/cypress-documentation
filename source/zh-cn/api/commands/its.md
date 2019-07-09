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
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.wrap({ width: '50' }).its('width') // Get the 'width' property
cy.window().its('angular')          // Get the 'angular' property
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.its('window')                // Errors, cannot be chained off 'cy'
cy.clearCookies().its('length') // Errors, 'clearCookies' does not yield Object
```

## Arguments

**{% fa fa-angle-right %} propertyName**  ***(String)***

Name of property or nested properties (with dot notation) to get.

## Yields {% helper_icon yields %}

{% yields changes_subject .its 'yields the value of the property' %}

# Examples

## Plain Objects

### Get property

```javascript
cy.wrap({ age: 52 }).its('age').should('eq', 52) // true
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

### Wait for some propery to exist on `window`

```javascript
cy.window().its('globalProp').then((globalProp) => {
  // do something now that window.globalProp exists
})
```

### Assert that a propery does not exist on `window`

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
cy.server()
cy.route(/comments/, 'fixture:comments.json').as('getComments')
cy.get('#fetch-comments').click()
cy.wait('@getComments').its('responseBody').should('deep.eq', [
  { id: 1, comment: 'hi' },
  { id: 2, comment: 'there' }
])
```

The commands above will display in the Command Log as:

{% imgTag /img/api/its/xhr-response-its-response-body-for-testing.png "Command Log for its" %}

When clicking on `its` within the command log, the console outputs the following:

{% imgTag /img/api/its/response-body-yielded-with-its-command-log.png "Console Log for its" %}

# See also

- {% url `.invoke()` invoke %}
- {% url `.then()` then %}
- {% url `cy.wrap()` wrap %}
- {% url 'Adding custom properties to the global `window` with the right TypeScript type' https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense %}
- {% url 'Set flag to start tests' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %}

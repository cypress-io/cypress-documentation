---
title: 自定义命令
---

Cypress comes with its own API for creating custom commands and overwriting existing commands. The built in Cypress commands use the very same API that's defined below.

{% note info  %}
A great place to define or overwrite commands is in your `cypress/support/commands.js` file, since it is loaded before any test files are evaluated via an import statement in cypress/support/index.js.
{% endnote %}

# Syntax

```javascript
Cypress.Commands.add(name, callbackFn)
Cypress.Commands.add(name, options, callbackFn)
Cypress.Commands.overwrite(name, callbackFn)
Cypress.Commands.overwrite(name, options, callbackFn)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.Commands.add('login', (email, pw) => {})
Cypress.Commands.overwrite('visit', (orig, url, options) => {})
```

## Arguments

**{% fa fa-angle-right %} name** ***(String)***

The name of the command you're either adding or overwriting.

**{% fa fa-angle-right %} callbackFn** ***(Function)***

Pass a function that receives the arguments passed to the command.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to define the implicit behavior of the custom command.

Option | Accepts | Default | Description
--- | --- | --- | ---
`prevSubject` | `String` or `Array` | `false` | how to handle the previously yielded subject.

The `prevSubject` accepts the following values:

- `false`: ignore any previous subjects: ***(parent command)***
- `true`: receives the previous subject: ***(child command)***
- `optional`: may start a chain, or use an existing chain: ***(dual command)***

In additional to controlling the command's implicit behavior you can also add declarative subject validations such as:

- `element`: requires the previous subject be a DOM element
- `document`: requires the previous subject be the document
- `window`: requires the previous subject be the window

Internally our built in commands make use of every single one of these combinations above.

# Examples

## Parent Commands

Parent commands always **begin** a new chain of commands. Even if you've chained it off of a previous command, parent commands will always start a new chain, and ignore previously yielded subjects.

Examples of parent commands:

- {% url `cy.visit()` visit %}
- {% url `cy.get()` get %}
- {% url `cy.request()` request %}
- {% url `cy.exec()` exec %}
- {% url `cy.route()` route %}

### Custom `login` command

```javascript
Cypress.Commands.add('login', (userType, options = {}) => {
  // this is an example of skipping your UI and logging in programmatically

  // setup some basic types
  // and user properties
  const types = {
    admin: {
      name: 'Jane Lane',
      admin: true,
    },
    user: {
      name: 'Jim Bob',
      admin: false,
    }
  }

  // grab the user
  const user = types[userType]

  // create the user first in the DB
  cy.request({
    url: '/seed/users', // assuming you've exposed a seeds route
    method: 'POST',
    body: user,
  })
  .its('body')
  .then((body) => {
    // assuming the server sends back the user details
    // including a randomly generated password
    //
    // we can now login as this newly created user
    cy.request({
      url: '/login',
      method: 'POST',
      body: {
        email: body.email,
        password: body.password,
      }
    })
  })
})
```

### Usage

```javascript
cy.login('admin') // can start a chain off of cy

cy
  .get('button')
  .login('user') // can be chained but will not receive the previous subject
```

{% note info 'Command Log' %}
Did you know that you can control how your custom commands appear in the Command Log? Read more about {% urlHash 'Command Logging' Command-Logging %}.
{% endnote %}

## Child Commands

Child commands are always chained off of a **parent** command, or another **child** command.

The previous subject will automatically be yielded to the callback function.

Examples of child commands:

- {% url `.click()` click %}
- {% url `.trigger()` trigger %}
- {% url `.find()` find %}
- {% url `.should()` should %}
- {% url `.as()` as %}

### Custom `console` command

```javascript
// not a super useful custom command
// but demonstrates how subject is passed
// and how the arguments are shifted
Cypress.Commands.add('console', {
  prevSubject: true
}, (subject, method) => {
  // the previous subject is automatically received
  // and the commands arguments are shifted

  // allow us to change the console method used
  method = method || 'log'

  // log the subject to the console
  console[method]('The subject is', subject)

  // whatever we return becomes the new subject
  //
  // we don't want to change the subject so
  // we return whatever was passed in
  return subject
})
```

### Usage

```javascript
cy.get('button').console('info').then(($button) => {
  // subject is still $button
})
```

By setting the `{ prevSubject: true }`, our new `.console()` command will require a subject.

Invoking it like this would error:

```javascript
cy.console() // error about how you can't call console without a subject
```

{% note info %}
Whenever you're using a child command you likely want to use `cy.wrap()` on the subject. Wrapping it enables you to immediately use more Cypress commands on that subject.
{% endnote %}

## Dual Commands

A dual command can either start a chain of commands or be chained off of an existing one. It is basically the hybrid between both a parent and a child command. You will likely rarely use this, and only a handful of our internal commands use this.

Nevertheless, it is useful if your command can work in multiple ways - either with an existing subject or without one.

Examples of dual commands:

- {% url `cy.contains()` contains %}
- {% url `cy.screenshot()` screenshot %}
- {% url `cy.scrollTo()` scrollto %}
- {% url `cy.wait()` wait %}

### Custom Dual Command

```javascript
Cypress.Commands.add('dismiss', {
  prevSubject: 'optional'
}, (subject, arg1, arg2) => {
  // subject may be defined or undefined
  // so you likely want to branch the logic
  // based off of that

  if (subject) {
    // wrap the existing subject
    // and do something with it
    cy.wrap(subject)
    ...
  } else {
    ...
  }
})
```

### Usage

```javascript
cy.dismiss() // no subject
cy.get('#dialog').dismiss() // with subject
```

## Overwrite Existing Commands

You can also modify the behavior of existing Cypress commands. This is useful to always set some defaults to avoid creating another command that ends up just using the original.

### Overwrite `visit` command

```javascript
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const domain = Cypress.env('BASE_DOMAIN')

  if (domain === '...') {
    url = '...'
  }

  if (options.something === 'else') {
    url = '...'
  }

  // originalFn is the existing `visit` command that you need to call
  // and it will receive whatever you pass in here.
  //
  // make sure to add a return here!
  return originalFn(url, options)
})
```

{% note info %}
We see many of our users creating their own `visitApp` command. We commonly see that all you're doing is swapping out base urls for `development` vs `production` environments.

This is usually unnecessary because Cypress is already configured to swap out baseUrl's that both `cy.visit()` and `cy.request()` use. Just set the `baseUrl` config property in `cypress.json` and override it with environment variable `CYPRESS_BASE_URL`.

For more complex use cases feel free to overwrite existing commands.
{% endnote %}

### Overwrite `screenshot` command

This example overwrites `screenshot` to always wait until a certain element is visible.

```javascript
Cypress.Commands.overwrite('screenshot', (originalFn, subject, name, options) => {

  // call another command, no need to return as it is managed
  cy.get('.app')
    .should('be.visible')

    // overwrite the default timeout, because screenshot does that internally
    // otherwise the `then` is limited to the default command timeout
    .then({ timeout: Cypress.config('responseTimeout') },
      () => {

        // return the original function so that cypress waits for it
        return originalFn(subject, name, options)
      })
})
```

# Validations

As noted in the {% urlHash 'Arguments' 'Arguments' %} above, you can also set `prevSubject` to one of:

- `element`
- `document`
- `window`

When doing so Cypress will automatically validate your subject to ensure it conforms to one of those types.

{% note info  %}
Adding validations is optional. Passing `{ prevSubject: true }` will require a subject, but not validate its type.
{% endnote %}

## Require Element

Require subject be of type: `element`.

```javascript
// this is how .click() is implemented
Cypress.Commands.add('click', {
  prevSubject: 'element'
}, (subject, options) => {
  // receives the previous subject and it's
  // guaranteed to be an element
})
```

**{% fa fa-check-circle green %} Valid Usage**

```javascript
cy.get('button').click() // has subject, and is `element`
```

**{% fa fa-exclamation-triangle red %} Invalid Usage**

```javascript
cy.click() // no subject, will error
cy.wrap([]).click() // has subject, but not `element`, will error
```

## Allow Multiple Types

### `.trigger()`

Require subject be one of the following types: `element`, `document` or `window`

```javascript
// this is how .trigger() is implemented
Cypress.Commands.add('trigger', {
  prevSubject: ['element', 'document', 'window']
}, (subject, eventName, options) => {
  // receives the previous subject and it's
  // guaranteed to be an element, document, or window
})
```

**{% fa fa-check-circle green %} Valid Usage**

```javascript
cy.get('button').trigger() // has subject, and is `element`
cy.document().trigger() // has subject, and is `document`
cy.window().trigger() // has subject, and is `window`
```

**{% fa fa-exclamation-triangle red %} Invalid Usage**

```javascript
cy.trigger() // no subject, will error
cy.wrap(true).trigger() // has subject, but not `element`, will error
```

Validations always work as "or" not "and".

## Optional with Types

You can also mix optional commands **with** validations.

```javascript
// this is how .contains() is implemented
Cypress.Commands.add('contains', {
  prevSubject: ['optional', 'window', 'document', 'element']
}, (subject, options) => {
  // subject could be undefined
  // since it's optional.
  //
  // if it's present
  // then it's window, document, or element.
  // - when window or document we'll query the entire DOM.
  // - when element we'll query only inside of its children.
  if (subject) {
    // ...
  } else {
    // ...
  }
})
```

**{% fa fa-check-circle green %} Valid Usage**

```javascript
cy.contains() // no subject, but valid because it's optional
cy.get('#main').contains() // has subject, and is `element`
cy.window().contains() // has subject, and is `window`
cy.document().contains() // has subject, and is `document`
cy.visit().contains() // has subject, and since visit yields `window` it's ok
```

**{% fa fa-exclamation-triangle red %} Invalid Usage**

```javascript
cy.wrap(null).contains() // has subject, but not `element`, will error
```

# Notes

## Command Logging

When creating your own custom command, you can control how it appears and behaves in the Command Log.

Take advantage of the {% url `Cypress.log()` cypress-log %} API. When you're issuing many internal Cypress commands, consider passing `{ log: false }` to those commands, and programmatically controlling your custom command. This will cleanup the Command Log and be much more visually appealing and understandable.

## Best Practices

### 1. Don't make everything a custom command

Custom commands work well when you're needing to describe behavior that's desirable across **all of your tests**. Examples would be a `cy.setup()` or `cy.login()` or extending your application's behavior like `cy.get('.dropdown').dropdown('Apples')`. These are specific to your application and can be used everywhere.

However, this pattern can be used and abused. Let's not forget - writing Cypress tests is just **JavaScript**, and it's often much easier just to write a simple function for repeatable behavior that's specific to only **a single spec file**.

If you're working on a `search_spec.js` file and want to compose several repeatable actions together, you should first ask yourself:

> Can this just be written as a simple function?

The answer is usually **yes**. Here's an example:

```javascript
// There's no reason to create something like a cy.search() custom
// command because this behavior is only applicable to a single spec file
//
// Just use a regular ol' javascript function folks!
const search = (term, options = {}) => {
  // example massaging to defaults
  _.defaults(options, {
    headers: {},
  })

  const { fixture, headers } = options

  // return cy chain here so we can
  // chain off this function below
  return cy
    .log(`Searching for: ${term} `)
    .route({
      url: '/search/**',
      response: `fixture:${fixture}`,
      headers: headers,
    })
    .as('getSearchResults')
    .get('#search').type(term)
    .wait('@getSearchResults')
}

it('displays a list of search results', function () {
  cy
    .visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'list',
      })
      .then((reqRes) => {
        // do something with the '@getSearchResults'
        // request such as make assertions on the
        // request body or url params
        // {
        //   url: 'http://app.com/search?cypress.io'
        //   method: 'GET',
        //   duration: 123,
        //   request: {...},
        //   response: {...},
        // }
      })
    })
    .get('#results li').should('have.length', 5)
    .get('#pagination').should('not.exist')
})

it('displays no search results', function () {
  cy
    .visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'zero',
      })
    })
    .get('#results').should('contain', 'No results found')
})

it('paginates many search results', function () {
  cy
    .visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'list',
        headers: {
          // just trick our app into thinking
          // there's a bunch of pages
          'x-pagination-total': 3,
        }
      })
    })
    .get('#pagination').should(($pagination) => {
      // should offer to goto next page
      expect($pagination).to.contain('Next')

      // should have provided 3 page links
      expect($pagination.find('li.page')).to.have.length(3)
    })
})
```

### 2. Don't overcomplicate things

Every custom command you write is generally an abstraction over a series of internal commands. That means you and your team members exert much more mental effort to understand what your custom command does.

There's no reason to add this level of complexity when you're only wrapping a couple commands.

Don't do things like:

- **{% fa fa-exclamation-triangle red %}** `cy.clickButton(selector)`
- **{% fa fa-exclamation-triangle red %}** `.shouldBeVisible()`

This first custom command is really just wrapping `cy.get(selector).click()`. Going down this route would lead to creating dozens or even hundreds of custom commands to cover every possible combination of element interactions. It's completely unnecessary.

The `.shouldBeVisible()` custom command isn't worth the trouble or abstraction when it's already as simple as typing: `.should('be.visible')`

Testing in Cypress is all about **readability** and **simplicity**. You don't have to do that much actual programming to get a lot done. You also don't need to worry about keeping your code as DRY as possible. Test code serves a different purpose than app code. Understandability and debuggability should be prioritized above all else.

Try not to overcomplicate things and create too many abstractions. When in doubt, just use a regular function for individual spec files.

### 3. Don't do too much in a single command

Make your custom commands composable and as unopinionated as possible. Cramming too much into them makes them inflexible and requires more and more options passing to control their behavior.

Try to add either zero or as few assertions as possible in your custom command. Those tend to shape your command into a much more rigid structure. Sometimes this is unavoidable, but a best practice is to let the calling code choose when and how to use assertions.

### 4. Skip your UI as much as possible

Custom commands are a great way to abstract away setup (specific to your app). When doing those kinds of tasks, skip as much of the UI as possible. Use {% url `cy.request()` request %} to login, set cookies or localStorage directly, stub and mock your applications functions, and / or trigger events programmatically.

Having custom commands repeat the same UI actions over and over again is slow, and unnecessary. Try to take as many shortcuts as possible.

### 5. Write TypeScript definitions

You can describe the method signature for your custom command, allowing IntelliSense to show helpful documentation. See the {% url `cypress-example-todomvc` https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense %} repository for a working example.

{% history %}
{% url "0.20.0" changelog#0-20-0 %} | `Cypress.Commands` API added
{% endhistory %}

# See also

- {% url `cypress-xpath` https://github.com/cypress-io/cypress-xpath %} adds a `cy.xpath()` command and shows best practices for writing custom commands: retries, logging, and TypeScript definition.
- {% url 'Cypress.log()' cypress-log %}
- {% url 'Recipe: Logging In' recipes %}

---
title: Custom Commands
---

Cypress comes with its own API for creating custom commands and overwriting
existing commands. The built in Cypress commands use the very same API that's
defined below.

<Alert type="info">

A great place to define or overwrite commands is in your
`cypress/support/commands.js` file, since it is loaded before any test files are
evaluated via an import statement in the
[supportFile](/guides/core-concepts/writing-and-organizing-tests#Support-file).

</Alert>

## Syntax

```javascript
Cypress.Commands.add(name, callbackFn)
Cypress.Commands.add(name, options, callbackFn)
Cypress.Commands.addAll(callbackObj)
Cypress.Commands.addAll(options, callbackObj)
Cypress.Commands.overwrite(name, callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.Commands.add('login', (email, pw) => {})
Cypress.Commands.addAll({
  login(email, pw) {},
  visit(orig, url, options) {},
})
Cypress.Commands.overwrite('visit', (orig, url, options) => {})
```

### Arguments

**<Icon name="angle-right"></Icon> name** **_(String)_**

The name of the command you're either adding or overwriting.

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

Pass a function that receives the arguments passed to the command.

**<Icon name="angle-right"></Icon> callbackObj** **_(Object)_**

An object with `callbackFn`s as properties.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to define the implicit behavior of the custom command.

<Alert type="warning">

`options` is only supported for use in `Cypress.Commands.add()` and not
supported for use in `Cypress.Commands.overwrite()`

</Alert>

| Option        | Accepts                        | Default | Description                                   |
| ------------- | ------------------------------ | ------- | --------------------------------------------- |
| `prevSubject` | `Boolean`, `String` or `Array` | `false` | how to handle the previously yielded subject. |

The `prevSubject` accepts the following values:

- `false`: ignore any previous subjects: **_(parent command)_**
- `true`: receives the previous subject: **_(child command)_**
- `optional`: may start a chain, or use an existing chain: **_(dual command)_**

In addition to controlling the command's implicit behavior you can also add
declarative subject validations such as:

- `element`: requires the previous subject be a DOM element
- `document`: requires the previous subject be the document
- `window`: requires the previous subject be the window

## Examples

### Parent Commands

Parent commands always **begin** a new chain of commands. Even if you've chained
it off of a previous command, parent commands will always start a new chain, and
ignore previously yielded subjects.

Examples of parent commands:

- [`cy.visit()`](/api/commands/visit)
- [`cy.get()`](/api/commands/get)
- [`cy.request()`](/api/commands/request)
- [`cy.exec()`](/api/commands/exec)
- [`cy.intercept()`](/api/commands/intercept)

#### Click link containing text

```js
Cypress.Commands.add('clickLink', (label) => {
  cy.get('a').contains(label).click()
})
```

```js
cy.clickLink('Buy Now')
```

#### Check a token

```js
Cypress.Commands.add('checkToken', (token) => {
  cy.window().its('localStorage.token').should('eq', token)
})
```

```js
cy.checkToken('abc123')
```

#### Download a file

Originally used in
[cypress-downloadfile](https://github.com/Xvier/cypress-downloadfile), this
command calls other Cypress commands.

```javascript
Cypress.Commands.add('downloadFile', (url, directory, fileName) => {
  return cy.getCookies().then((cookies) => {
    return cy.task('downloadFile', {
      url,
      directory,
      cookies,
      fileName,
    })
  })
})
```

```js
cy.downloadFile('https://path_to_file.pdf', 'mydownloads', 'demo.pdf')
```

#### Commands to work with `sessionStorage`

```js
Cypress.Commands.add('getSessionStorage', (key) => {
  cy.window().then((window) => window.sessionStorage.getItem(key))
})

Cypress.Commands.add('setSessionStorage', (key, value) => {
  cy.window().then((window) => {
    window.sessionStorage.setItem(key, value)
  })
})
```

```js
cy.setSessionStorage('token', 'abc123')
cy.getSessionStorage('token').should('eq', 'abc123')
```

#### Log in command using UI

```js
Cypress.Commands.add('typeLogin', (user) => {
  cy.get('input[name=email]').type(user.email)

  cy.get('input[name=password]').type(user.password)
})
```

```js
cy.typeLogin({ email: 'fake@email.com', password: 'Secret1' })
```

#### Log in command using request

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
    },
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
        },
      })
    })
})
```

```javascript
// can start a chain off of cy
cy.login('admin')

// can be chained but will not receive the previous subject
cy.get('button').login('user')
```

#### Log out command using UI

```js
Cypress.Commands.add('logout', () => {
  cy.contains('Login').should('not.exist')
  cy.get('.avatar').click()
  cy.contains('Logout').click()
})
```

#### Log out command using `localStorage` <E2EOnlyBadge />

```js
Cypress.Commands.add('logout', () => {
  cy.window().its('localStorage').invoke('removeItem', 'session')

  cy.visit('/login')
})
```

```js
cy.logout()
```

#### Create a user

```js
Cypress.Commands.add('createUser', (user) => {
  cy.request({
    method: 'POST',
    url: 'https://www.example.com/tokens',
    body: {
      email: 'admin_username',
      password: 'admin_password',
    },
  }).then((resp) => {
    cy.request({
      method: 'POST',
      url: 'https://www.example.com/users',
      headers: { Authorization: 'Bearer ' + resp.body.token },
      body: user,
    })
  })
})
```

```js
cy.createUser({
  id: 123,
  name: 'Jane Lane',
})
```

<Alert type="info">

<strong class="alert-header">Command Log</strong>

Did you know that you can control how your custom commands appear in the Command
Log? Read more about [Command Logging](#Command-Logging).

</Alert>

### Child Commands

Child commands are always chained off of a **parent** command, or another
**child** command.

The previous subject will automatically be yielded to the callback function.

Examples of child commands:

- [`.click()`](/api/commands/click)
- [`.trigger()`](/api/commands/trigger)
- [`.find()`](/api/commands/find)
- [`.should()`](/api/commands/should)
- [`.as()`](/api/commands/as)

#### Custom `console` command

```javascript
// not a super useful custom command
// but demonstrates how subject is passed
// and how the arguments are shifted
Cypress.Commands.add(
  'console',
  {
    prevSubject: true,
  },
  (subject, method) => {
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
  }
)
```

```javascript
cy.get('button')
  .console('info')
  .then(($button) => {
    // subject is still $button
  })
```

By setting the `{ prevSubject: true }`, our new `.console()` command will
require a subject.

Invoking it like this would error:

```javascript
cy.console() // error about how you can't call console without a subject
```

<Alert type="info">

Whenever you're using a child command you likely want to use
[cy.wrap()](/api/commands/wrap) on the subject. Wrapping it enables you to
immediately use more Cypress commands on that subject.

</Alert>

### Dual Commands

A dual command can either start a chain of commands or be chained off of an
existing one. It is basically the hybrid between both a parent and a child
command. You will likely rarely use this, and only a handful of our internal
commands use this.

Nevertheless, it is useful if your command can work in multiple ways - either
with an existing subject or without one.

Examples of dual commands:

- [`cy.contains()`](/api/commands/contains)
- [`cy.screenshot()`](/api/commands/screenshot)
- [`cy.scrollTo()`](/api/commands/scrollto)
- [`cy.wait()`](/api/commands/wait)

#### Custom Dual Command

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

```javascript
cy.dismiss() // no subject
cy.get('#dialog').dismiss() // with subject
```

### Overwrite Existing Commands

You can also modify the behavior of existing Cypress commands. This is useful to
always set some defaults to avoid creating another command that ends up using
the original.

#### Overwrite `visit` command

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

<Alert type="info">

We see many of our users creating their own `visitApp` command. We commonly see
that all you're doing is swapping out base urls for `development` vs
`production` environments.

This is usually unnecessary because Cypress is already configured to swap out a
`baseUrl` that both [cy.visit()](/api/commands/visit) and
[cy.request()](/api/commands/request) use. Set the `baseUrl` configuration
property in your [Cypress configuration](/guides/references/configuration) and
override it with the `CYPRESS_BASE_URL` environment variable.

For more complex use cases feel free to overwrite existing commands.

</Alert>

#### Overwrite `type` command

If you are typing into a password field, the password input is masked
automatically within your application. But [.type()](/api/commands/type)
automatically logs any typed content into the Cypress Command Log.

```js
cy.get('#username').type('username@email.com')
cy.get('#password').type('superSecret123')
```

<DocsImage src="/img/api/custom-commands/custom-command-type-no-masked-password.png"></DocsImage>

You may want to mask some values passed to the [.type()](/api/commands/type)
command so that sensitive data does not display in screenshots or videos of your
test run. This example overwrites the [.type()](/api/commands/type) command to
allow you to mask sensitive data in the Cypress Command Log.

```js
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    })
  }

  return originalFn(element, text, options)
})
```

```js
cy.get('#username').type('username@email.com')
cy.get('#password').type('superSecret123', { sensitive: true })
```

Now our sensitive password is not printed to the Cypress Command Log when
`sensitive: true` is passed as an option to [.type()](/api/commands/type).

<DocsImage src="/img/api/custom-commands/custom-command-type-masked-password.png"></DocsImage>

<Alert type="info">

<strong class="alert-header">Keep passwords secret blog</strong>

Check out
[this blog](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/)
to explore another way to keep passwords secret within your tests.

</Alert>

#### Overwrite `screenshot` command

This example overwrites [cy.screenshot()](/api/commands/screenshot) to always
wait until a certain element is visible.

```javascript
Cypress.Commands.overwrite(
  'screenshot',
  (originalFn, subject, name, options) => {
    // call another command, no need to return as it is managed
    cy.get('.app')
      .should('be.visible')

      // overwrite the default timeout, because screenshot does that internally
      // otherwise the `then` is limited to the default command timeout
      .then({ timeout: Cypress.config('responseTimeout') }, () => {
        // return the original function so that cypress waits for it
        return originalFn(subject, name, options)
      })
  }
)
```

#### Overwrite `contains` command

This example overwrites [.contains()](/api/commands/contains) to always have the
`matchCase` option set to `false`.

```js
Cypress.Commands.overwrite(
  'contains',
  (originalFn, subject, filter, text, options = {}) => {
    // determine if a filter argument was passed
    if (typeof text === 'object') {
      options = text
      text = filter
      filter = undefined
    }

    options.matchCase = false

    return originalFn(subject, filter, text, options)
  }
)
```

## Validations

As noted in the [Arguments](#Arguments) above, you can also set `prevSubject` to
one of:

- `element`
- `document`
- `window`

When doing so Cypress will automatically validate your subject to ensure it
conforms to one of those types.

<Alert type="info">

Adding validations is optional. Passing `{ prevSubject: true }` will require a
subject, but not validate its type.

</Alert>

### Require Element

Require subject be of type: `element`.

```javascript
// this is how .click() is implemented
Cypress.Commands.add(
  'click',
  {
    prevSubject: 'element',
  },
  (subject, options) => {
    // receives the previous subject and it's
    // guaranteed to be an element
  }
)
```

**<Icon name="check-circle" color="green"></Icon> Valid Usage**

```javascript
cy.get('button').click() // has subject, and is `element`
```

**<Icon name="exclamation-triangle" color="red"></Icon> Invalid Usage**

```javascript
cy.click() // no subject, will error
cy.wrap([]).click() // has subject, but not `element`, will error
```

### Allow Multiple Types

#### `.trigger()`

Require subject be one of the following types: `element`, `document` or `window`

```javascript
// this is how .trigger() is implemented
Cypress.Commands.add(
  'trigger',
  {
    prevSubject: ['element', 'document', 'window'],
  },
  (subject, eventName, options) => {
    // receives the previous subject and it's
    // guaranteed to be an element, document, or window
  }
)
```

**<Icon name="check-circle" color="green"></Icon> Valid Usage**

```javascript
cy.get('button').trigger() // has subject, and is `element`
cy.document().trigger() // has subject, and is `document`
cy.window().trigger() // has subject, and is `window`
```

**<Icon name="exclamation-triangle" color="red"></Icon> Invalid Usage**

```javascript
cy.trigger() // no subject, will error
cy.wrap(true).trigger() // has subject, but not `element`, will error
```

Validations always work as "or" not "and".

### Optional with Types

You can also mix optional commands **with** validations.

```javascript
// this is how .contains() is implemented
Cypress.Commands.add(
  'contains',
  {
    prevSubject: ['optional', 'window', 'document', 'element'],
  },
  (subject, options) => {
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
  }
)
```

**<Icon name="check-circle" color="green"></Icon> Valid Usage**

```javascript
cy.contains() // no subject, but valid because it's optional
cy.get('#main').contains() // has subject, and is `element`
cy.window().contains() // has subject, and is `window`
cy.document().contains() // has subject, and is `document`
cy.visit().contains() // has subject, and since visit yields `window` it's ok
```

**<Icon name="exclamation-triangle" color="red"></Icon> Invalid Usage**

```javascript
cy.wrap(null).contains() // has subject, but not `element`, will error
```

## Notes

### Command Logging

When creating your own custom command, you can control how it appears and
behaves in the Command Log.

Take advantage of the [`Cypress.log()`](/api/cypress-api/cypress-log) API. When
you're issuing many internal Cypress commands, consider passing `{ log: false }`
to those commands, and programmatically controlling your custom command. This
will cleanup the Command Log and be much more visually appealing and
understandable.

### `cy.hover()` and `cy.mount()`

Cypress does not have `cy.hover()` or `cy.mount()` commands out-of-the-box. See
how to craft your own [`cy.hover()`](/api/commands/hover) and
[`cy.mount()`](/api/commands/mount) custom commands.

### Best Practices

#### 1. Don't make everything a custom command

Custom commands work well when you're needing to describe behavior that's
desirable across **all of your tests**. Examples would be a `cy.setup()` or
`cy.login()` or extending your application's behavior like
`cy.get('.dropdown').dropdown('Apples')`. These are specific to your application
and can be used everywhere.

However, this pattern can be used and abused. Let's not forget - writing Cypress
tests is **JavaScript**, and it's often more efficient to write a function for
repeatable behavior that's specific to only **a single spec file**.

If you're working on a `search.cy.js` file and want to compose several
repeatable actions together, you should first ask yourself:

> Can this be written as a function?

The answer is usually **yes**. Here's an example:

```javascript
// There's no reason to create something like a cy.search() custom
// command because this behavior is only applicable to a single spec file
//
// Use a regular ol' javascript function folks!
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
    .intercept('GET', '/search/**', (req) => {
      req.reply({
        statusCode: 200,
        body: `fixture:${fixture}`,
        headers: headers,
      })
    })
    .as('getSearchResults')
    .get('#search')
    .type(term)
    .wait('@getSearchResults')
}

it('displays a list of search results', () => {
  cy.visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'list',
      }).then((reqRes) => {
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
    .get('#results li')
    .should('have.length', 5)
    .get('#pagination')
    .should('not.exist')
})

it('displays no search results', () => {
  cy.visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'zero',
      })
    })
    .get('#results')
    .should('contain', 'No results found')
})

it('paginates many search results', () => {
  cy.visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'list',
        headers: {
          // trick our app into thinking
          // there's a bunch of pages
          'x-pagination-total': 3,
        },
      })
    })
    .get('#pagination')
    .should(($pagination) => {
      // should offer to goto next page
      expect($pagination).to.contain('Next')

      // should have provided 3 page links
      expect($pagination.find('li.page')).to.have.length(3)
    })
})
```

#### 2. Don't overcomplicate things

Every custom command you write is generally an abstraction over a series of
internal commands. That means you and your team members exert much more mental
effort to understand what your custom command does.

There's no reason to add this level of complexity when you're only wrapping a
couple commands.

Don't do things like:

- **<Icon name="exclamation-triangle" color="red"></Icon>**
  `cy.clickButton(selector)`
- **<Icon name="exclamation-triangle" color="red"></Icon>** `.shouldBeVisible()`

This first custom command is wrapping `cy.get(selector).click()`. Going down
this route would lead to creating dozens or even hundreds of custom commands to
cover every possible combination of element interactions. It's completely
unnecessary.

The `.shouldBeVisible()` custom command isn't worth the trouble or abstraction
when you can already use: `.should('be.visible')`

Testing in Cypress is all about **readability** and **simplicity**. You don't
have to do that much actual programming to get a lot done. You also don't need
to worry about keeping your code as DRY as possible. Test code serves a
different purpose than app code. Understandability and debuggability should be
prioritized above all else.

Try not to overcomplicate things and create too many abstractions. When in
doubt, use a regular function for individual spec files.

#### 3. Don't do too much in a single command

Make your custom commands composable and as unopinionated as possible. Cramming
too much into them makes them inflexible and requires more and more options
passing to control their behavior.

Try to add either zero or as few assertions as possible in your custom command.
Those tend to shape your command into a much more rigid structure. Sometimes
this is unavoidable, but a best practice is to let the calling code choose when
and how to use assertions.

#### 4. Skip your UI as much as possible

Custom commands are a great way to abstract away setup (specific to your app).
When doing those kinds of tasks, skip as much of the UI as possible. Use
[`cy.request()`](/api/commands/request) to login, set cookies or localStorage
directly, stub and mock your applications functions, and / or trigger events
programmatically.

Having custom commands repeat the same UI actions over and over again is slow,
and unnecessary. Try to take as many shortcuts as possible.

#### 5. Write TypeScript definitions

You can describe the method signature for your custom command, allowing
IntelliSense to show helpful documentation. See the
[`cypress-example-todomvc`](https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense)
repository for a working example.

## History

| Version                                       | Changes                      |
| --------------------------------------------- | ---------------------------- |
| [0.20.0](/guides/references/changelog#0-20-0) | `Cypress.Commands` API added |

## See also

- See how to add
  [TypeScript support for custom commands](/guides/tooling/typescript-support#Types-for-custom-commands)
- Blog posts
  [Writing a Custom Cypress Command](https://glebbahmutov.com/blog/writing-custom-cypress-command/)
  and
  [How to Publish Custom Cypress Command on NPM](https://glebbahmutov.com/blog/publishing-cypress-command/).
- [Plugins using custom commands](/plugins/directory#custom-commands)
- [`cypress-xpath`](https://github.com/cypress-io/cypress-xpath) adds a
  `cy.xpath()` command and shows best practices for writing custom commands:
  retries, logging, and TypeScript definition.
- [Cypress.log()](/api/cypress-api/cypress-log)
- [Recipe: Logging In](/examples/examples/recipes)

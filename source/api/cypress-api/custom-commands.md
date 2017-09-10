---
title: Custom Commands
comments: false
---

Cypress comes with its own API for creating custom commands and overwriting existing commands. The built in Cypress commands use the very same API that's defined below.

{% note info  %}
A great place to define or overwrite commands is in your `cypress/support/commands.js` file, since it is loaded before any test files are evaluated.
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

Option | Default | Description
--- | --- | ---
`prevSubject` | `false` | how to handle the previously yielded subject.

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

***Custom Parent Command***

```javascript
Cypress.Commands.add('login', function(user, options = {}) {
  // this is an example of skipping your UI and logging in programmatically

  // create the user first in the DB
  cy.request({

  })

  // login as this user

  // TODO: below let's show how you can use Cypress.log()
  // to output useful information about what happened
  // in the case where you silence the requests
})
```

## Add Child Command

Child commands are always chained off of a **parent** command, or another **child** command.

***Custom command to right click on DOM element***

```javascript
Cypress.Commands.add('rightclick', {prevSubject: 'dom'}, function(subject, arg1, arg2){
  // enforces that the previous subject is DOM and the subject is yielded here
  // blows up and provides a great error when improperly chained

  // show example error of chaining cy.rightclick()
  // show example error of cy.wrap({}).rightclick()
})
```

## Overwrite Existing Command

You can modify the logic of existing Cypress commands or previously defined custom commands.

```javascript
Cypress.Commands.overwrite('visit', function(orig, url, options){
  // modify url or options here...
  // showing to use Cypress.env() or something like auth: {...}
  return orig(url, options)
})
```

# Notes

## Retryability

## Composability

## Best Practices

***1. Don't make everything a custom command***

Custom commands work well when you're needing to describe behavior that's desirable across **all of your tests**. Examples would be a `cy.setup()` or `cy.login()` or extending your application's behavior like `cy.get('.dropdown').dropdown('Apples')`. These are specific to your application and can be used everywhere.

However, this pattern can be used and abused. Let's not forget - writing Cypress tests is just **JavaScript**, and its often much easier just to write a simple function for repeatable behavior that's specific to only **a single spec file**.

If you're working on a `search_spec.js` file and want to compose several repeatable actions together, you should first ask yourself: can this just be written as a simple function?

```javascript
// There's no reason to create something like a cy.search() custom
// command because this behavior is only applicable to a single spec file
//
// Just us a regular ol' javascript function folks!
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

it('displays a list of search results', function(){
  cy
    .visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'list',
      })
      .then((reqRes) => {
        /*
        // do something with the '@getSearchResults'
        // request such as make assertions on the
        // request body or url params
        // {
        //   url: 'http://app.com/search?cypress.io'
        //   method: 'GET',
        //   duration: 123,
        //   request: {...}
        //   response: {...}
        // }
        */
      })
    })
    .get('#results li').should('have.length', 5)
    .get('#pagination').should('not.exist')
})

it('displays no search results', function(){
  cy
    .visit('/page')
    .then(() => {
      search('cypress.io', {
        fixture: 'zero',
      })
    })
    .get('#results').should('contain', 'No results found')
})

it('paginates many search results', function(){
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
    .get('#pagination').should($pagination) => {
      // should offer to goto next page
      expect($pagination).to.contain('Next')

      // should have provided 3 page links
      expect($pagination.find('li.page')).to.have.length(3)
    })
})
```

***2. Don't overcomplicate things***

Every custom command you write is generally an abstraction over a series of internal commands. That means you and your team members exert much more mental effort to understand what your custom command does.

There's no reason to add this level of complexity when you're only wrapping a couple commands.

Don't do things like:

**{% fa fa-exclamation-triangle red %}** `cy.clickButton(selector)`

This custom command is really just wrapping `cy.get(selector).click()`. Going down this route would lead to creating dozens or even hundreds of custom commands to cover every possible combination of element interactions.

Cypress tests are all about **readability** and **simplicity**. You don't have to do that much actual programming to get a lot done.

Try not to overcomplicate things and create too many abstractions. When in doubt, just use a regular function local to an individual spec file.

***3. Don't do too much in a single command***

Make your custom commands composable and as unopinionated as possible. Cramming too much into them makes them inflexible and requires more and more options passing to control their behavior.

Try to add either zero or as few assertions as possible in your custom command. Those tend to shape your command into a much more rigid structure. Sometimes this is unavoidable, but a best practice is to let the calling code when and how to use assertions.

***4. Use the Cypress.log API***

Take advantage of the {% url `Cypress.log()` cypress-log %} API. When you're issuing many internal Cypress commands, consider passing `{ log: false }` to those commands, and programmatically controlling your custom command. This will cleanup the Command Log and be much more visually appealing and understandable.

***5. Skip your UI as much as possible***

Custom commands are a great way to abstract away setup (specific to your app). When doing those kinds of tasks, skip as much of the UI as possible. Use {% url `cy.request()` request %} to login, set cookies or local storage directly, stub and mock your applications functions, and / or trigger events programmatically.

Having custom commands repeat the same UI actions over and over again is slow, so try to skip as much as possible.

# See also

- {% url 'Recipe: Logging In' logging-in-recipe %}

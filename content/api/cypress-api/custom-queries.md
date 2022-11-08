---
title: Custom Queries
---

Cypress comes with its own API for creating custom queries. The built in Cypress
queries use the very same API that's defined below.

<Alert type="info">

If your method needs to be asynchronous, or it shouldn't be called more than
once, consider writing a [custom command](/api/cypress-api/custom-command)
instead.

</Alert>

<Alert type="info">

A great place to define queries is in your `cypress/support/commands.js` file,
since it is loaded before any test files are evaluated via an import statement
in the
[supportFile](/guides/core-concepts/writing-and-organizing-tests#Support-file).

</Alert>

Queries follow three main rules.

1. Queries are _synchronous._ They do not return or await promises.
2. Queries are _retrieable._ Once you return the inner function, Cypress takes
   control, handling retries on your behalf.
3. Queries are _idempotent._ Once you return the inner function, Cypress will
   invoke it repeatedly.

With these rules, queries are simple to write and extremely powerful. They are
the building blocks on which Cypress' API is built.

## Syntax

```javascript
Cypress.Commands.addQuery(name, callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.Commands.addQuery('getById', function (id) {
  return (subject) => newSubject
})
```

### Arguments

**<Icon name="angle-right"></Icon> name** **_(String)_**

The name of the query you're adding.

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

Pass a function that receives the arguments passed to the query.

This outer function is invoked once. It should return a function that takes a
subject and returns a new subject; this inner function will be called multple
times.

## Examples

### `.focused()`

The callback function can be thought of as two separate parts. The _outer
function_, which is invoked once, where you perform setup and state management,
and the _query function_, which is called repeatedly.

Let's look at an example. This is actual Cypress code - how `.focused()` is
implemented internally. The only thing omitted here for simplicity is the
typescript definitions.

```javascript
Commands.addQuery('focused', function focused(options = {}) {
  const log = options.log !== false && Cypress.log({ timeout: options.timeout })

  this.set('timeout', options.timeout)

  return () => {
    let $el = cy.getFocused()

    log &&
      cy.state('current') === this &&
      log.set({
        $el,
        consoleProps: () => {
          return {
            Yielded: $el?.length ? $dom.getElements($el) : '--nothing--',
            Elements: $el != null ? $el.length : 0,
          }
        },
      })

    if (!$el) {
      $el = $dom.wrap(null)
      $el.selector = 'focused'
    }

    return $el
  }
})
```

Let's go over this piece by piece.

#### The outer function

The outer function is called once each time test uses the query. It performs
setup and state management:

```javascript
function focused(options = {}) {
  const log = options.log !== false && Cypress.log({ timeout: options.timeout })

  this.set('timeout', options.timeout)

  return () => {} // Inner function
}
```

Piece by piece, then.

```javascript
function focused(options = {}) {}
```

Cypress passes the outer function whatever arguments the user calls it with; no
processing or validation is done on the user's arguments. In our case,
`.focused()` accepts one optional argument, `options`.

If you wanted to validate the incoming arguments, you might write something
like:

```javascript
if (options === null || !_.isPlainObject(options)) {
  const err = `cy.root() requires an \`options\` object. You passed in: \`{options}\``
  throw new TypeError(err)
}
```

This is a general pattern: when something goes wrong, queries just throw an
error. Cypress will handle displaying this in the Command Log nicely.

```javascript
const log = options.log !== false && Cypress.log({ timeout: options.timeout })
```

If the user has not set `{ log: false }`, we create a new `Cypress.log()`
instance. See [`Cypress.log()`](/api/cypress-api/cypress-log) for more
information.

This is setup code - we only want it to run once, creating the log message when
Cypress first begins executing this query. We hold onto a reference to `Log`
instance - we'll update it later with additional details.

```javascript
this.set('timeout', options.timeout)
```

When defining `focused()`, it's important to note that we used `function`,
rather than an arrow function. This gives us access to `this`, where we can set
the `timeout`. If you don't call `this.set('timeout')`, or call it with `null`
or `undefined`, your query will use the
[default timeout](/guides/core-concepts/introduction-to-cypress#Timeouts).

```
  return () => { ... }
```

The outer function's return value is the inner function.

#### The inner function

The inner function is called any number of times. It's first invoked repeatedly
until it passes or the query times out; it can then be invoked again later to
determine the subject of future commands, or when the user retrieves an alias.

The inner function is called with one argument: the previous subject. Cypress
performs no validation on this - it could be any type, including `null` or
`undefined`.

`.focused()` ignores any previous subject, but many queries do not - for
example, `.contains()` accepts only certain types of subjects. You can use
Cypress' builtin `ensures` functions, as `.contains()` does:
`cy.ensureSubjectByType(subject, ['optional', 'element', 'window', 'document'], this)`

or you can perform your own validation and simply throw an error:
`if (!_.isString(subject)) { throw new Error('MyCustomCommand only accepts strings as a subject!') }`

If the inner function throws an error, Cypress will retry it after a short delay
until it either passes or the query times out. This is the core of Cypress'
retry-ability, and the guarantees it provides that your tests interact with the
page as a user would.

Looking back to our `.focused()` example:

```javascript
return () => {
  let $el = cy.getFocused()

  log &&
    cy.state('current') === this &&
    log.set({
      $el,
      consoleProps: () => {
        return {
          Yielded: $el?.length ? $dom.getElements($el) : '--nothing--',
          Elements: $el != null ? $el.length : 0,
        }
      },
    })

  if (!$el) {
    $el = $dom.wrap(null)
    $el.selector = 'focused'
  }

  return $el
}
```

Piece by piece again:

```javascript
let $el = cy.getFocused()
```

This is the 'business end' of `.focused()` - finding the element on the page
that's currently focused.

```javascript
    log && cy.state('current') === this && log.set({...})
```

If `log` is defined (ie, the user did not pass in `{ log: false }`), and this
query is the current command, we update the log message with new information,
such as `$el` (the subject we're about to yield from this query), and the
`consoleProps`, a function that
[returns console output](/guides/core-concepts/cypress-app#Console-output) for
the user.

```javascript
if (!$el) {
  $el = $dom.wrap(null)
  $el.selector = 'focused'
}
```

If there's no focused element on the page, we create an empty jquery object.

```javascript
return $el
```

The return value of the inner function becomes the new subject for the next
command.

With this return value in hand, Cypress verifies any upcoming assertions, such
as user's `.should()` commands, or if there are none, the default implicit
assertions that the subject should exist.

### Using existing queries

Many custom queries are wrappers around other, already implemented queries -
most commonly `.get()`.

This is quite simple:

```javascript
Cypress.Commands.addQuery('getFirstButton', function getFirstButton(options) {
  const getFn = cy.now('get', 'button:first', options)

  return (subject) => {
    console.log('The subject we received was:', subject)

    const btn = getFn(subject)

    console.log('.get returned this element:', btn)

    return btn
  }
})
```

Calling `cy.now()` on a query calls the outer function of that query, and
returns the inner function. In our case, we call `get` with `button:first` and
pass through whatever `options` the user provided us.

In our own inner function, we can then call `getFn`, and do whatever we want
with the return value.

## Validations

As noted in the examples above, Cypress performs very little validation around
queries - it is the repsonsibility of each implementation to ensure that its
arguments and subject are of the correct type.

Cypress has several builtin 'ensures' which can be helpful in this regard:

- `cy.ensureSubjectByType(subject, types, this)`: Accepts an array with any of
  the strings `optional`, `element`, `document`, or `window`.
  `ensureSubjectByType` is how
  [`prevSubject` validation](/api/cypress-api/custom-commands#Validations) is
  implemented for commmands.
- `cy.ensureElement(subject, queryName)`: Ensure that the passed in `subject` is
  one or more DOM elements.
- `cy.ensureWindow(subject)`: Ensure that the passed in `subject` is a
  `document`.
- `cy.ensureDocument(subject)`: Ensure that the passed in `subject` is a
  `window`.

- `cy.ensureAttached(subject, queryName)`: Ensure that DOM element(s) are
  attached to the page.
- `cy.ensureNotDisabled(subject)`: Ensure that form elements aren't disabled.
- `cy.ensureVisibility(subject)`: Ensure that a DOM element is visible on the
  page.

There's nothing special about these functions - they simply validate their
argument and throw an error if the check fails. You can throw errors of any type
at any time inside your queries - Cypress will catch and handle it
appropriately.

## Notes

### Best Practices

#### 1. Don't make everything a custom query

Custom queries work well when you're needing to describe behavior that's
desirable across **all of your tests**. Examples would be `cy.findBreadcrumbs()`
or `cy.getLoginForm()`. These are specific to your application and can be used
everywhere.

However, this pattern can be used and abused. Let's not forget - writing Cypress
tests is **JavaScript**, and it's often more efficient to write a function for
repeatable behavior than it is to implement a custom query.

#### 2. Don't overcomplicate things

Every custom query you write is generally an abstraction for locating elements
on the page. That means you and your team members exert much more mental effort
to understand what your custom command does.

There's no reason to add this level of complexity when the builtin queries are
already quite expressive and powerful.

Don't do things like:

- **<Icon name="exclamation-triangle" color="red"></Icon>** `cy.getButton()`
- **<Icon name="exclamation-triangle" color="red"></Icon>**
  `.getFirstTableRow()`

Both of these are wrapping `cy.get(selector)`. It's completely unnecessary. Just
call `.get('button')` or `.get('tr:first')`.

Testing in Cypress is all about **readability** and **simplicity**. You don't
have to do that much actual programming to get a lot done. You also don't need
to worry about keeping your code as DRY as possible. Test code serves a
different purpose than app code. Understandability and debuggability should be
prioritized above all else.

Try not to overcomplicate things and create too many abstractions.

## History

| Version                                       | Changes              |
| --------------------------------------------- | -------------------- |
| [12.0.0](/guides/references/changelog#12-0-0) | `addQuery` API added |

## See also

- See how to add
  [TypeScript support for custom commands](/guides/tooling/typescript-support#Types-for-custom-commands)
- [Plugins using custom commands](/plugins/directory#custom-commands)
- [Cypress.log()](/api/cypress-api/cypress-log)

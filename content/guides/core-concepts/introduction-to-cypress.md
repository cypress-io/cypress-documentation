---
title: Introduction to Cypress
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How Cypress queries the DOM
- How Cypress manages subjects and chains of commands
- What assertions look like and how they work
- How timeouts are applied to commands

</Alert>

<Alert type="success">

<strong class="alert-header">Important!</strong>

**This is the single most important guide** for understanding how to test with
Cypress. Read it. Understand it. Ask questions about it so that we can improve
it.

After you're done, we suggest watching some of our <Icon name="video"></Icon>
[Tutorial Videos](/examples/examples/tutorials).

</Alert>

## Cypress Can Be Simple (Sometimes)

Simplicity is all about getting more done with less typing. Let's look at an
example:

:::visit-mount-test-example

```js
cy.visit('/posts/new')
```

```js
cy.mount(<PostBuilder />)
```

```js
describe('Post Resource', () => {
  it('Creating a New Post', () => {
    __VISIT_MOUNT_PLACEHOLDER__ // 1.

    cy.get('input.post-title') // 2.
      .type('My First Post') // 3.

    cy.get('input.post-body') // 4.
      .type('Hello, world!') // 5.

    cy.contains('Submit') // 6.
      .click() // 7.

    cy.get('h1') // 8.
      .should('contain', 'My First Post')
  })
})
```

:::

Can you read this? If you did, it might sound something like this:

> 1. Visit page at `/posts/new` or `mount(<PostBuilder />)`.
> 2. Find the `<input>` with class `post-title`.
> 3. Type "My First Post" into it.
> 4. Find the `<input>` with class `post-body`.
> 5. Type "Hello, world!" into it.
> 6. Find the element containing the text `Submit`.
> 7. Click it.
> 8. Find the `h1` tag, ensure it contains the text "My First Post".

This is a relatively straightforward test, but consider how much code has been
covered by it, both on the client and the server!

For the remainder of this guide, we'll explore the basics of Cypress that make
this example work. We'll demystify the rules Cypress follows so you can
productively test your application to act as much like a user as possible, as
well as discuss how to take shortcuts when it's useful.

## Querying Elements

### Cypress is Like jQuery

If you've used [jQuery](https://jquery.com/) before, you may be used to querying
for elements like this:

```js
$('.my-selector')
```

In Cypress, querying elements is the same:

```js
cy.get('.my-selector')
```

In fact, Cypress
[bundles jQuery](/guides/references/bundled-tools#Other-Library-Utilities) and
exposes many of its DOM traversal methods to you so you can work with complex
HTML structures with ease using APIs you're already familiar with.

```js
// Each method is equivalent to its jQuery counterpart. Use what you know!
cy.get('#main-content').find('.article').children('img[src^="/static"]').first()
```

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Cypress leverages jQuery's powerful selector engine to help make tests familiar
and readable for modern web developers.

Interested in the best practices for selecting elements?
[Read here](/guides/references/best-practices#Selecting-Elements).

</Alert>

Accessing the DOM elements returned from the query works differently, however:

```js
// This is fine, jQuery returns the element synchronously.
const $jqElement = $('.element')

// This will not work! Cypress does not return the element synchronously.
const $cyElement = cy.get('.element')
```

Let's look at why this is...

### Cypress is _Not_ Like jQuery

**Question:** What happens when jQuery can't find any matching DOM elements from
its selector?

**Answer:** _Oops!_ It returns an empty jQuery collection. We've got a real
object to work with, but it doesn't contain the element we wanted. So we start
adding conditional checks and retrying our queries manually.

```js
// $() returns immediately with an empty collection.
const $myElement = $('.element').first()

// Leads to ugly conditional checks
// and worse - flaky tests!
if ($myElement.length) {
  doSomething($myElement)
}
```

**Question:** What happens when Cypress can't find any matching DOM elements
from its selector?

**Answer:** _No big deal!_ Cypress automatically retries the query until either:

#### 1. The element is found

```js
cy
  // cy.get() looks for '#element', repeating the query until...
  .get('#element')

  // ...it finds the element!
  // You can now work with it by using .then
  .then(($myElement) => {
    doSomething($myElement)
  })
```

#### 2. A set timeout is reached

```js
cy
  // cy.get() looks for '#element-does-not-exist', repeating the query until...
  // ...it doesn't find the element before its timeout.
  // Cypress halts and fails the test.
  .get('#element-does-not-exist')

  // ...this code is never run...
  .then(($myElement) => {
    doSomething($myElement)
  })
```

This makes Cypress robust and immune to dozens of common problems that occur in
other testing tools. Consider all the circumstances that could cause querying a
DOM element to fail:

- The DOM has not loaded yet.
- Your framework hasn't finished bootstrapping.
- An XHR request hasn't responded.
- An animation hasn't completed.
- and on and on...

Before, you'd be forced to write custom code to protect against any and all of
these issues: a nasty mashup of arbitrary waits, conditional retries, and null
checks littering your tests. Not in Cypress! With built-in retrying and
[customizable timeouts](/guides/references/configuration#Timeouts), Cypress
sidesteps all of these flaky issues.

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Cypress wraps all DOM queries with robust retry-and-timeout logic that better
suits how real web apps work. We trade a minor change in how we find DOM
elements for a major stability upgrade to all of our tests. Banishing flake for
good!

</Alert>

<Alert type="info">

In Cypress, when you want to interact with a DOM element directly, call
[`.then()`](/api/commands/then) with a callback function that receives the
element as its first argument. When you want to skip the retry-and-timeout
functionality entirely and perform traditional synchronous work, use
[`Cypress.$`](/api/utilities/$).

</Alert>

### Querying by Text Content

Another way to locate things -- a more human way -- is to look them up by their
content, by what the user would see on the page. For this, there's the handy
[`cy.contains()`](/api/commands/contains) command, for example:

```js
// Find an element in the document containing the text 'New Post'
cy.contains('New Post')

// Find an element within '.main' containing the text 'New Post'
cy.get('.main').contains('New Post')
```

This is helpful when writing tests from the perspective of a user interacting
with your app. They only know that they want to click the button labeled
"Submit". They have no idea that it has a `type` attribute of `submit`, or a CSS
class of `my-submit-button`.

<Alert type="warning">

<strong class="alert-header">Internationalization</strong>

If your app is translated into multiple languages for i18n, make sure you
consider the implications of using user-facing text to find DOM elements!

</Alert>

### When Elements Are Missing

As we showed above, Cypress anticipates the asynchronous nature of web
applications and doesn't fail immediately the first time an element is not
found. Instead, Cypress gives your app a window of time to finish whatever it
may be doing!

This is known as a `timeout`, and most commands can be customized with specific
timeout periods
([the default timeout is 4 seconds](/guides/references/configuration#Timeouts)).
These Commands will list a `timeout` option in their API documentation,
detailing how to set the number of milliseconds you want to continue to try
finding the element.

```js
// Give this element 10 seconds to appear
cy.get('.my-slow-selector', { timeout: 10000 })
```

You can also set the timeout globally via the
[configuration setting: `defaultCommandTimeout`](/guides/references/configuration#Timeouts).

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

To match the behavior of web applications, Cypress is asynchronous and relies on
timeouts to know when to stop waiting on an app to get into the expected state.
Timeouts can be configured globally, or on a per-command basis.

</Alert>

<Alert type="info">

<strong class="alert-header">Timeouts and Performance</strong>

There is a performance tradeoff here: **tests that have longer timeout periods
take longer to fail**. Commands always proceed as soon as their expected
criteria is met, so working tests will be performed as fast as your application
allows. A test that fails due to timeout will consume the entire timeout period,
by design. This means that while you _may_ want to increase your timeout period
to suit specific parts of your app, you _don't_ want to make it "extra long,
just in case".

</Alert>

Later in this guide we'll go into much more detail about
[Default Assertions](#Default-Assertions) and [Timeouts](#Timeouts).

## Chains of Commands

It's very important to understand the mechanism Cypress uses to chain commands
together. It manages a Promise chain on your behalf, with each command yielding
a 'subject' to the next command, until the chain ends or an error is
encountered. The developer should not need to use Promises directly, but
understanding how they work is helpful!

### Interacting With Elements

As we saw in the initial example, Cypress allows you to click on and type into
elements on the page by using [`.click()`](/api/commands/click) and
[`.type()`](/api/commands/type) commands with a [`cy.get()`](/api/commands/get)
or [`cy.contains()`](/api/commands/contains) command. This is a great example of
chaining in action. Let's see it again:

```js
cy.get('textarea.post-body').type('This is an excellent post.')
```

We're chaining the [`.type()`](/api/commands/type) onto the
[`cy.get()`](/api/commands/get), telling it to type into the subject yielded
from the [`cy.get()`](/api/commands/get) command, which will be a DOM element.

Here are even more action commands Cypress provides to interact with your app:

- [`.blur()`](/api/commands/blur) - Make a focused DOM element blur.
- [`.focus()`](/api/commands/focus) - Focus on a DOM element.
- [`.clear()`](/api/commands/clear) - Clear the value of an input or textarea.
- [`.check()`](/api/commands/check) - Check checkbox(es) or radio(s).
- [`.uncheck()`](/api/commands/uncheck) - Uncheck checkbox(es).
- [`.select()`](/api/commands/select) - Select an `<option>` within a
  `<select>`.
- [`.dblclick()`](/api/commands/dblclick) - Double-click a DOM element.
- [`.rightclick()`](/api/commands/rightclick) - Right-click a DOM element.

These commands ensure
[some guarantees](/guides/core-concepts/interacting-with-elements) about what
the state of the elements should be prior to performing their actions.

For example, when writing a [`.click()`](/api/commands/click) command, Cypress
ensures that the element is able to be interacted with (like a real user would).
It will automatically wait until the element reaches an "actionable" state by:

- Not being hidden
- Not being covered
- Not being disabled
- Not animating

This also helps prevent flake when interacting with your application in tests.
You can usually override this behavior with a `force` option.

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Cypress provides a simple but powerful algorithm when
[ interacting with elements.](/guides/core-concepts/interacting-with-elements)

</Alert>

### Asserting About Elements

Assertions let you do things like ensuring an element is visible or has a
particular attribute, CSS class, or state. Assertions are commands that enable
you to describe the _desired_ state of your application. Cypress will
automatically wait until your elements reach this state, or fail the test if the
assertions don't pass. Here's a quick look at assertions in action:

```js
cy.get(':checkbox').should('be.disabled')

cy.get('form').should('have.class', 'form-horizontal')

cy.get('input').should('not.have.value', 'US')
```

In each of these examples, it's important to note that Cypress will
automatically _wait_ until these assertions pass. This prevents you from having
to know or care about the precise moment your elements eventually do reach this
state.

We will learn more about [assertions](#Assertions) later in this guide.

### Subject Management

A new Cypress chain always starts with `cy.[command]`, where what is yielded by
the `command` establishes what other commands can be called next (chained).

Some methods yield `null` and thus cannot be chained, such as
[`cy.clearCookies()`](/api/commands/clearcookies).

Some methods, such as [`cy.get()`](/api/commands/get) or
[`cy.contains()`](/api/commands/contains), yield a DOM element, allowing further
commands to be chained onto them (assuming they expect a DOM subject) like
[`.click()`](/api/commands/click) or even
[`cy.contains()`](/api/commands/contains) again.

#### Some commands can be chained from...

- `cy` only, meaning they do not operate on a subject:
  [`cy.clearCookies()`](/api/commands/clearcookies).
- commands yielding particular kinds of subjects (like DOM elements):
  [`.type()`](/api/commands/type).
- both `cy` _and_ from a subject-yielding command:
  [`cy.contains()`](/api/commands/contains).

#### Some commands yield...

- `null`, meaning no command can be chained after the command:
  [`cy.clearCookie()`](/api/commands/clearcookie).
- the same subject they were originally yielded:
  [`.click()`](/api/commands/click).
- a new subject, as appropriate for the command [`.wait()`](/api/commands/wait).

This is actually much more intuitive than it sounds.

#### Examples:

```js
cy.clearCookies() // Done: 'null' was yielded, no chaining possible

cy.get('.main-container') // Yields an array of matching DOM elements
  .contains('Headlines') // Yields the first DOM element containing content
  .click() // Yields same DOM element from previous command
```

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Cypress commands do not **return** their subjects, they **yield** them.
Remember: Cypress commands are asynchronous and get queued for execution at a
later time. During execution, subjects are yielded from one command to the next,
and a lot of helpful Cypress code runs between each command to ensure everything
is in order.

</Alert>

<Alert type="info">

To work around the need to reference elements, Cypress has a feature
[known as aliasing](/guides/core-concepts/variables-and-aliases). Aliasing helps
you to **store** and **save** element references for future use.

</Alert>

#### Using [`.then()`](/api/commands/then) To Act On A Subject

Want to jump into the command flow and get your hands on the subject directly?
No problem, add a [.then()](/api/commands/then) to your command chain. When the
previous command resolves, it will call your callback function with the yielded
subject as the first argument.

If you wish to continue chaining commands after your
[`.then()`](/api/commands/then), you'll need to specify the subject you want to
yield to those commands, which you can achieve with a return value other than
`null` or `undefined`. Cypress will yield that to the next command for you.

#### Let's look at an example:

```js
cy
  // Find the el with id 'some-link'
  .get('#some-link')

  .then(($myElement) => {
    // ...massage the subject with some arbitrary code

    // grab its href property
    const href = $myElement.prop('href')

    // strip out the 'hash' character and everything after it
    return href.replace(/(#.*)/, '')
  })
  .then((href) => {
    // href is now the new subject
    // which we can work with now
  })
```

<Alert type="info">

<strong class="alert-header">Core Concept</strong>

We have many more examples and use cases of [cy.then()](/api/commands/then) in
our [Core Concept Guide](/guides/core-concepts/variables-and-aliases) that
teaches you how to properly deal with asynchronous code, when to use variables,
and what aliasing is.

</Alert>

#### Using Aliases to Refer to Previous Subjects

Cypress has some added functionality for quickly referring back to past subjects
called [Aliases](/guides/core-concepts/variables-and-aliases). It looks
something like this:

```js
cy.get('.my-selector')
  .as('myElement') // sets the alias
  .click()

/* many more actions */

cy.get('@myElement') // re-queries the DOM as before (only if necessary)
  .click()
```

This lets us reuse our DOM queries for faster tests when the element is still in
the DOM, and it automatically handles re-querying the DOM for us when it is not
immediately found in the DOM. This is particularly helpful when dealing with
front end frameworks that do a lot of re-rendering!

### Commands Are Asynchronous

It is very important to understand that Cypress commands don't do anything at
the moment they are invoked, but rather enqueue themselves to be run later. This
is what we mean when we say Cypress commands are asynchronous.

#### Take this short test, for example:

:::visit-mount-test-example

```js
cy.visit('/my/resource/path') // Nothing happens yet
```

```js
cy.mount(<MyComponent />)     // Nothing happens yet
```

```js
it('hides the thing when it is clicked', () => {
  __VISIT_MOUNT_PLACEHOLDER__

  cy.get('.hides-when-clicked') // Still nothing happening
    .should('be.visible')       // Still absolutely nothing
    .click()                    // Nope, nothing
    .should('not.be.visible')   // Definitely nothing happening yet
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

:::

Cypress doesn't kick off the browser automation magic until the test function
exits.

#### Mixing Async and Sync code

Remembering that Cypress commands run asynchronously is important if you are
attempting to mix Cypress commands with synchronous code. Synchronous code will
execute immediately - not waiting for the Cypress commands above it to execute.

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect usage**

In the example below, the `el` evaluates immediately, before the `cy.visit()`
has executed, so will always evaluate to an empty array.

```js
it('does not work as we expect', () => {
  cy.visit('/my/resource/path') // Nothing happens yet

  cy.get('.awesome-selector') // Still nothing happening
    .click() // Nope, nothing

  // Cypress.$ is synchronous, so evaluates immediately
  // there is no element to find yet because
  // the cy.visit() was only queued to visit
  // and did not actually visit the application
  let el = Cypress.$('.new-el') // evaluates immediately as []

  if (el.length) {
    // evaluates immediately as 0
    cy.get('.another-selector')
  } else {
    // this will always run
    // because the 'el.length' is 0
    // when the code executes
    cy.get('.optional-selector')
  }
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

**<Icon name="check-circle" color="green"></Icon> Correct usage**

Below is one way the code above could be rewritten in order to ensure the
commands run as expected.

```js
it('does not work as we expect', () => {
  cy.visit('/my/resource/path') // Nothing happens yet

  cy.get('.awesome-selector') // Still nothing happening
    .click() // Nope, nothing
    .then(() => {
      // placing this code inside the .then() ensures
      // it runs after the cypress commands 'execute'
      let el = Cypress.$('.new-el') // evaluates after .then()

      if (el.length) {
        cy.get('.another-selector')
      } else {
        cy.get('.optional-selector')
      }
    })
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect usage**

In the example below, the check on the `username` value gets evaluated
immediately, before the `cy.visit()` has executed, so will always evaluate to
`undefined`.

```js
it('test', () => {
  let username = undefined // evaluates immediately as undefined

  cy.visit('https://app.com') // Nothing happens yet
  cy.get('.user-name') // Still, nothing happens yet
    .then(($el) => {
      // Nothing happens yet
      // this line evaluates after the .then executes
      username = $el.text()
    })

  // this evaluates before the .then() above
  // so the username is still undefined
  if (username) {
    // evaluates immediately as undefined
    cy.contains(username).click()
  } else {
    // this will always run
    // because username will always
    // evaluate to undefined
    cy.contains('My Profile').click()
  }
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

**<Icon name="check-circle" color="green"></Icon> Correct usage**

Below is one way the code above could be rewritten in order to ensure the
commands run as expected.

```js
it('test', () => {
  let username = undefined // evaluates immediately as undefined

  cy.visit('https://app.com') // Nothing happens yet
  cy.get('.user-name') // Still, nothing happens yet
    .then(($el) => {
      // Nothing happens yet
      // this line evaluates after the .then() executes
      username = $el.text()

      // evaluates after the .then() executes
      // it's the correct value gotten from the $el.text()
      if (username) {
        cy.contains(username).click()
      } else {
        cy.get('My Profile').click()
      }
    })
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Each Cypress command (and chain of commands) returns immediately, having only
been appended to a queue of commands to be executed at a later time.

You purposefully **cannot** do anything useful with the return value from a
command. Commands are enqueued and managed entirely behind the scenes.

We've designed our API this way because the DOM is a highly mutable object that
constantly goes stale. For Cypress to prevent flake, and know when to proceed,
we manage commands in a highly controlled deterministic way.

</Alert>

<Alert type="info">

<strong class="alert-header">Why can't I use async / await?</strong>

If you're a modern JS programmer you might hear "asynchronous" and think: **why
can't I just use `async/await`** instead of learning some proprietary API?

Cypress's APIs are built very differently from what you're likely used to: but
these design patterns are incredibly intentional. We'll go into more detail
later in this guide.

</Alert>

#### Avoid loops

Using JavaScript loop commands like `while` can have unexpected effects. Let's
say our application shows a random number on load.

<DocsImage src="/img/guides/core-concepts/reload-page.gif" alt="Manually reloading the browser page until the number 7 appears"></DocsImage>

We want the test to stop when it finds the number 7. If any other number is
displayed the test reloads the page and checks again.

**Note:** you can find this application and the correct test in our
[Recipes](https://github.com/cypress-io/cypress-example-recipes#testing-the-dom).

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect test**

The test written below WILL NOT work and most likely will crash your browser.

```js
let found7 = false

while (!found7) {
  // this schedules an infinite number
  // of "cy.get..." commands, eventually crashing
  // before any of them have a chance to run
  // and set found7 to true
  cy.get('#result')
    .should('not.be.empty')
    .invoke('text')
    .then(parseInt)
    .then((number) => {
      if (number === 7) {
        found7 = true
        cy.log('lucky **7**')
      } else {
        cy.reload()
      }
    })
}
```

The above test keeps adding more `cy.get('#result')` commands to the test chain
without executing any! The chain of commands keeps growing, but never executes -
since the test function never finishes running. The `while` loop never allows
Cypress to start executing even the very first `cy.get(...)` command.

**<Icon name="check-circle" color="green"></Icon> Correct test**

We need to give the test a chance to run a few commands before deciding if it
needs to continue. Thus the correct test would use recursion.

```js
const checkAndReload = () => {
  // get the element's text, convert into a number
  cy.get('#result')
    .should('not.be.empty')
    .invoke('text')
    .then(parseInt)
    .then((number) => {
      // if the expected number is found
      // stop adding any more commands
      if (number === 7) {
        cy.log('lucky **7**')

        return
      }

      // otherwise insert more Cypress commands
      // by calling the function after reload
      cy.wait(500, { log: false })
      cy.reload()
      checkAndReload()
    })
}

cy.visit('public/index.html')
checkAndReload()
```

The test runs and correctly finishes.

<DocsImage src="/img/guides/core-concepts/lucky-7.gif" alt="Test reloads the page until the number 7 appears"></DocsImage>

You can see a short video going through this example at
[https://www.youtube.com/watch?v=5Z8BaPNDfvA](https://www.youtube.com/watch?v=5Z8BaPNDfvA).

### Commands Run Serially

After a test function is finished running, Cypress goes to work executing the
commands that were enqueued using the `cy.*` command chains.

#### Let's take another look at an example

:::visit-mount-test-example

```js
cy.visit('/my/resource/path') // 1.
```

```js
cy.mount(<MyComponent />) // 1.
```

```js
it('hides the thing when it is clicked', () => {
  __VISIT_MOUNT_PLACEHOLDER__

  cy.get('.hides-when-clicked') // 2.
    .should('be.visible') // 3.
    .click() // 4.
    .should('not.be.visible') // 5.
})
```

:::

The test above would cause an execution in this order:

1. Visit the URL (or mount the component).
2. Find an element by its selector.
3. Assert that the element is visible.
4. Perform a click action on that element.
5. Assert that the element is no longer visible.

These actions will always happen serially (one after the other), never in
parallel (at the same time). Why?

To illustrate this, let's revisit that list of actions and expose some of the
hidden **✨ magic ✨** Cypress does for us at each step:

1. Visit the URL ✨ **and wait for the page load event to fire after all
   external resources have loaded** ✨ (or mount the component ✨ **and wait for
   the component to finish mounting** ✨)
2. Find an element by its selector ✨ **and retry until it is found in the DOM**
   ✨
3. Assert that the element is visible ✨ **and retry until the assertion
   passes** ✨
4. Perform a click action on that element ✨ **after we wait for the element to
   reach an actionable state** ✨
5. Assert that the element is no longer visible ✨ **and retry until the
   assertion passes** ✨

As you can see, Cypress does a lot of extra work to ensure the state of the
application matches what our commands expect about it. Each command may resolve
quickly (so fast you won't see them in a pending state) but others may take
seconds, or even dozens of seconds to resolve.

While most commands time out after a few seconds, other specialized commands
that expect particular things to take much longer like
[`cy.visit()`](/api/commands/visit) will naturally wait longer before timing
out.

These commands have their own particular timeout values which are documented in
the [Cypress configuration](/guides/references/configuration).

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Any waiting or retrying that is necessary to ensure a step was successful must
complete before the next step begins. If they don't complete successfully before
the timeout is reached, the test will fail.

</Alert>

### Commands Are Promises

This is the big secret of Cypress: we've taken our favorite pattern for
composing JavaScript code, Promises, and built them right into the fabric of
Cypress. Above, when we say we're enqueuing actions to be taken later, we could
restate that as "adding Promises to a chain of Promises".

Let's compare the prior example to a fictional version of it as raw,
Promise-based code:

#### Noisy Promise demonstration. Not valid code.

```js
it('changes the URL when "awesome" is clicked', () => {
  // THIS IS NOT VALID CODE.
  // THIS IS JUST FOR DEMONSTRATION.
  return cy
    .visit('/my/resource/path')
    .then(() => {
      return cy.get('.awesome-selector')
    })
    .then(($element) => {
      // not analogous
      return cy.click($element)
    })
    .then(() => {
      return cy.url()
    })
    .then((url) => {
      expect(url).to.eq('/my/resource/path#awesomeness')
    })
})
```

#### How Cypress really looks, Promises wrapped up and hidden from us.

```javascript
it('changes the URL when "awesome" is clicked', () => {
  cy.visit('/my/resource/path')

  cy.get('.awesome-selector').click()

  cy.url().should('include', '/my/resource/path#awesomeness')
})
```

Big difference! In addition to reading much cleaner, Cypress does more than
this, because **Promises themselves have no concepts of
[retry-ability](/guides/core-concepts/retry-ability)**.

Without [**retry-ability**](/guides/core-concepts/retry-ability), assertions
would randomly fail. This would lead to flaky, inconsistent results. This is
also why we cannot use new JS features like `async / await`.

Cypress cannot yield you primitive values isolated away from other commands.
That is because Cypress commands act internally like an asynchronous stream of
data that only resolve after being affected and modified **by other commands**.
This means we cannot yield you discrete values in chunks because we have to know
everything about what you expect before handing off a value.

These design patterns ensure we can create **deterministic**, **repeatable**,
**consistent** tests that are **flake free**.

<Alert type="info">

Cypress is built using Promises that come from
[Bluebird](http://bluebirdjs.com/). However, Cypress commands do not return
these typical Promise instances. Instead we return what's called a `Chainer`
that acts like a layer sitting on top of the internal Promise instances.

For this reason you cannot **ever** return or assign anything useful from
Cypress commands.

If you'd like to learn more about handling asynchronous Cypress Commands please
read our [Core Concept Guide](/guides/core-concepts/variables-and-aliases).

</Alert>

### Commands Are Not Promises

The Cypress API is not an exact 1:1 implementation of Promises. They have
Promise like qualities and yet there are important differences you should be
aware of.

1. You cannot **race** or run multiple commands at the same time (in parallel).
2. You cannot 'accidentally' forget to return or chain a command.
3. You cannot add a `.catch` error handler to a failed command.

There are _very_ specific reasons these limitations are built into the Cypress
API.

The whole intention of Cypress (and what makes it very different from other
testing tools) is to create consistent, non-flaky tests that perform identically
from one run to the next. Making this happen isn't free - there are some
trade-offs we make that may initially seem unfamiliar to developers accustomed
to working with Promises.

Let's take a look at each trade-off in depth:

#### You cannot race or run multiple commands at the same time

Cypress guarantees that it will execute all of its commands _deterministically_
and identically every time they are run.

A lot of Cypress commands _mutate_ the state of the browser in some way.

- [`cy.request()`](/api/commands/request) automatically gets + sets cookies to
  and from the remote server.
- [`cy.clearCookies()`](/api/commands/clearcookies) clears all of the browser
  cookies.
- [`.click()`](/api/commands/click) causes your application to react to click
  events.

None of the above commands are _idempotent_; they all cause side effects. Racing
commands is not possible because commands must be run in a controlled, serial
manner in order to create consistency. Because integration and e2e tests
primarily mimic the actions of a real user, Cypress models its command execution
model after a real user working step by step.

#### You cannot accidentally forget to return or chain a command

In real promises it's very easy to 'lose' a nested Promise if you don't return
it or chain it correctly.

Let's imagine the following Node code:

```js
// assuming we've promisified our fs module
return fs.readFile('/foo.txt', 'utf8').then((txt) => {
  // oops we forgot to chain / return this Promise
  // so it essentially becomes 'lost'.
  // this can create bizarre race conditions and
  // bugs that are difficult to track down
  fs.writeFile('/foo.txt', txt.replace('foo', 'bar'))

  return fs.readFile('/bar.json').then((json) => {
    // ...
  })
})
```

The reason this is even possible to do in the Promise world is because you have
the power to execute multiple asynchronous actions in parallel. Under the hood,
each promise 'chain' returns a promise instance that tracks the relationship
between linked parent and child instances.

Because Cypress enforces commands to run _only_ serially, you do not need to be
concerned with this in Cypress. We enqueue all commands onto a _global_
singleton. Because there is only ever a single command queue instance, it's
impossible for commands to ever be _'lost'_.

You can think of Cypress as "queueing" every command. Eventually they'll get run
and in the exact order they were used, 100% of the time.

There is no need to ever `return` Cypress commands.

#### You cannot add a `.catch` error handler to a failed command

In Cypress there is no built in error recovery from a failed command. A command
and its assertions all _eventually_ pass, or if one fails, all remaining
commands are not run, and the test fails.

You might be wondering:

> How do I create conditional control flow, using if/else? So that if an element
> does (or doesn't) exist, I choose what to do?

The problem with this question is that this type of conditional control flow
ends up being non-deterministic. This means it's impossible for a script (or
robot), to follow it 100% consistently.

In general, there are only a handful of very specific situations where you _can_
create control flow. Asking to recover from errors is actually the same as
asking for another `if/else` control flow.

With that said, as long as you are aware of the potential pitfalls with control
flow, it is possible to do this in Cypress!

You can read all about how to do
[conditional testing](/guides/core-concepts/conditional-testing) here.

## Assertions

As we mentioned previously in this guide:

> Assertions describe the **desired** state of your **elements**, your
> **objects**, and your **application**.

What makes Cypress unique from other testing tools is that commands
**automatically retry** their assertions. In fact, they will look "downstream"
at what you're expressing and modify their behavior to make your assertions
pass.

You should think of assertions as **guards**.

Use your **guards** to describe what your application should look like, and
Cypress will automatically **block, wait, and retry** until it reaches that
state.

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

Each API Command documents its behavior with assertions - such as how it retries
or waits for assertions to pass.

</Alert>

### Asserting in English

Let's look at how you'd describe an assertion in English:

> After clicking on this `<button>`, I expect its class to eventually be
> `active`.

To express this in Cypress you'd write:

```js
cy.get('button').click().should('have.class', 'active')
```

This above test will pass even if the `.active` class is applied to the button
asynchronously - or after an indeterminate period of time.

```javascript
// even though we are adding the class
// after two seconds...
// this test will still pass!
$('button').on('click', (e) => {
  setTimeout(() => {
    $(e.target).addClass('active')
  }, 2000)
})
```

Here's another example.

> After making an HTTP request to my server, I expect the response body to equal
> `{name: 'Jane'}`

To express this with an assertion you'd write:

```js
cy.request('/users/1').its('body').should('deep.eq', { name: 'Jane' })
```

### When To Assert?

Despite the dozens of assertions Cypress makes available to you, sometimes the
best test may make no assertions at all! How can this be? Aren't assertions a
basic part of testing?

#### Consider this example:

:::visit-mount-test-example

```js
cy.visit('/home')
```

```js
cy.mount(<MyComponent />)
```

```js
__VISIT_MOUNT_PLACEHOLDER__

cy.get('.main-menu').contains('New Project').click()

cy.get('.title').type('My Awesome Project')

cy.get('form').submit()
```

:::

Without a single explicit assertion, there are dozens of ways this test can
fail! Here's a few:

- The initial [`cy.visit()`](/api/commands/visit) or
  [`cy.mount()`](/api/commands/mount) could respond with something other than
  success.
- Any of the [`cy.get()`](/api/commands/get) commands could fail to find their
  elements in the DOM.
- The element we want to [`.click()`](/api/commands/click) on could be covered
  by another element.
- The input we want to [`.type()`](/api/commands/type) into could be disabled.
- Form submission could result in a non-success status code.
- The in-page JS (the application under test) or the component could throw an
  error.

Can you think of any more?

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

With Cypress, you don't have to assert to have a useful test. Even without
assertions, a few lines of Cypress can ensure thousands of lines of code are
working properly across the client and server!

This is because many commands have a built in
[Default Assertion](#Default-Assertions) which offer you a high level of
guarantee.

</Alert>

### Default Assertions

Many commands have a default, built-in assertion, or rather have requirements
that may cause it to fail without needing an explicit assertion you've added.

#### For instance:

- [`cy.visit()`](/api/commands/visit) expects the page to send `text/html`
  content with a `200` status code.
- [`cy.request()`](/api/commands/request) expects the remote server to exist and
  provide a response.
- [`cy.contains()`](/api/commands/contains) expects the element with content to
  eventually exist in the DOM.
- [`cy.get()`](/api/commands/get) expects the element to eventually exist in the
  DOM.
- [`.find()`](/api/commands/find) also expects the element to eventually exist
  in the DOM.
- [`.type()`](/api/commands/type) expects the element to eventually be in a
  _typeable_ state.
- [`.click()`](/api/commands/click) expects the element to eventually be in an
  _actionable_ state.
- [`.its()`](/api/commands/its) expects to eventually find a property on the
  current subject.

Certain commands may have a specific requirement that causes them to immediately
fail without retrying: such as [`cy.request()`](/api/commands/request).

Others, such as DOM based commands will automatically
[retry](/guides/core-concepts/retry-ability) and wait for their corresponding
elements to exist before failing.

Even more - action commands will automatically wait for their element to reach
an [actionable state](/guides/core-concepts/interacting-with-elements) before
failing.

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

All DOM based commands automatically wait for their elements to exist in the
DOM.

You **never** need to write [`.should('exist')`](/api/commands/should) after a
DOM based command.

</Alert>

Most commands give you the flexibility to override or bypass the default ways
they can fail, typically by passing a `{force: true}` option.

#### Example #1: Existence and Actionability

```js
cy
  // there is a default assertion that this
  // button must exist in the DOM before proceeding
  .get('button')

  // before issuing the click, this button must be "actionable"
  // it cannot be disabled, covered, or hidden from view.
  .click()
```

Cypress will automatically _wait_ for elements to pass their default assertions.
Like with the explicit assertions you've added, all of these assertions share
the _same_ timeout values.

#### Example #2: Reversing the Default Assertion

Most of the time, when querying for elements, you expect them to eventually
exist. But sometimes you wish to wait until they _don't_ exist.

All you have to do is add that assertion and Cypress will **reverse** its rules
waiting for elements to exist.

```js
// now Cypress will wait until this
// <button> is not in the DOM after the click
cy.get('button.close').click().should('not.exist')

// and now make sure this #modal does not exist in the DOM
// and automatically wait until it's gone!
cy.get('#modal').should('not.exist')
```

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

By adding [`.should('not.exist')`](/api/commands/should) to any DOM command,
Cypress will reverse its default assertion and automatically wait until the
element does not exist.

</Alert>

#### Example #3: Other Default Assertions

Other commands have other default assertions not related to the DOM.

For instance, [`.its()`](/api/commands/its) requires that the property you're
asking about exists on the object.

```js
// create an empty object
const obj = {}

// set the 'foo' property after 1 second
setTimeout(() => {
  obj.foo = 'bar'
}, 1000)

// .its() will wait until the 'foo' property is on the object
cy.wrap(obj).its('foo')
```

### List of Assertions

Cypress bundles [Chai](/guides/references/bundled-tools#Chai),
[Chai-jQuery](/guides/references/bundled-tools#Chai-jQuery), and
[Sinon-Chai](/guides/references/bundled-tools#Sinon-Chai) to provide built-in
assertions. You can see a comprehensive list of them in
[the list of assertions reference](/guides/references/assertions). You can also
[write your own assertions as Chai plugins](/examples/examples/recipes#Fundamentals)
and use them in Cypress.

### Writing Assertions

There are two ways to write assertions in Cypress:

1. **Implicit Subjects:** Using [`.should()`](/api/commands/should) or
   [`.and()`](/api/commands/and).
2. **Explicit Subjects:** Using `expect`.

### Implicit Subjects

Using [`.should()`](/api/commands/should) or [`.and()`](/api/commands/and)
commands is the preferred way of making assertions in Cypress. These are typical
Cypress commands, which means they apply to the currently yielded subject in the
command chain.

```javascript
// the implicit subject here is the first <tr>
// this asserts that the <tr> has an .active class
cy.get('tbody tr:first').should('have.class', 'active')
```

You can chain multiple assertions together using [`.and()`](/api/commands/and),
which is another name for [`.should()`](/api/commands/should) that makes things
more readable:

```js
cy.get('#header a')
  .should('have.class', 'active')
  .and('have.attr', 'href', '/users')
```

Because [`.should('have.class')`](/api/commands/should) does not change the
subject, [`.and('have.attr')`](/api/commands/and) is executed against the same
element. This is handy when you need to assert multiple things against a single
subject quickly.

If we wrote this assertion in the explicit form "the long way", it would look
like this:

```js
cy.get('tbody tr:first').should(($tr) => {
  expect($tr).to.have.class('active')
  expect($tr).to.have.attr('href', '/users')
})
```

The implicit form is much shorter! So when would you want to use the explicit
form?

Typically when you want to:

- Assert multiple things about the same subject
- Massage the subject in some way prior to making the assertion

### Explicit Subjects

Using `expect` allows you to pass in a specific subject and make an assertion
about it. This is probably how you're used to seeing assertions written in unit
tests:

```js
// the explicit subject here is the boolean: true
expect(true).to.be.true
```

<Alert type="info">

<strong class="alert-header">Did you know you can write Unit Tests in
Cypress?</strong>

Check out our example recipes for [unit testing](/examples/examples/recipes) and
[unit testing React components](/examples/examples/recipes#Unit-Testing).

</Alert>

Explicit assertions are great when you want to:

- Perform custom logic prior to making the assertion.
- Make multiple assertions against the same subject.

The [`.should()`](/api/commands/should) command allows us to pass a callback
function that takes the yielded subject as its first argument. This works like
[`.then()`](/api/commands/then), except Cypress automatically **waits and
retries** for everything inside of the callback function to pass.

<Alert type="info">

<strong class="alert-header">Complex Assertions</strong>

The example below is a use case where we are asserting across multiple elements.
Using a [`.should()`](/api/commands/should) callback function is a great way to
query from a **parent** into multiple children elements and assert something
about their state.

Doing so enables you to **block** and **guard** Cypress by ensuring the state of
descendants matches what you expect without needing to query them individually
with regular Cypress DOM commands.

</Alert>

```javascript
cy.get('p').should(($p) => {
  // massage our subject from a DOM element
  // into an array of texts from all of the p's
  let texts = $p.map((i, el) => {
    return Cypress.$(el).text()
  })

  // jQuery map returns jQuery object
  // and .get() converts this to an array
  texts = texts.get()

  // array should have length of 3
  expect(texts).to.have.length(3)

  // with this specific content
  expect(texts).to.deep.eq([
    'Some text from first p',
    'More text from second p',
    'And even more text from third p',
  ])
})
```

<Alert type="danger">

<strong class="alert-header">Make sure `.should()` is safe</strong>

When using a callback function with [`.should()`](/api/commands/should), be sure
that the entire function can be executed multiple times without side effects.
Cypress applies its [retry](/guides/core-concepts/retry-ability) logic to these
functions: if there's a failure, it will repeatedly rerun the assertions until
the timeout is reached. That means your code should be retry-safe. The technical
term for this means your code must be **idempotent**.

</Alert>

## Timeouts

Almost all commands can time out in some way.

All assertions, whether they're the default ones or whether they've been added
by you all share the same timeout values.

### Applying Timeouts

You can modify a command's timeout. This timeout affects both its default
assertions (if any) and any specific assertions you've added.

Remember because assertions are used to describe a condition of the previous
commands - the `timeout` modification goes on the previous commands _not the
assertions_.

#### Example #1: Default Assertion

```js
// because .get() has a default assertion
// that this element exists, it can time out and fail
cy.get('.mobile-nav')
```

Under the hood Cypress:

- Queries for the element `.mobile-nav`

  ✨**and waits up to 4 seconds for it to exist in the DOM**✨

#### Example #2: Additional Assertions

```js
// we've added 2 assertions to our test
cy.get('.mobile-nav').should('be.visible').and('contain', 'Home')
```

Under the hood Cypress:

- Queries for the element `.mobile-nav`

  ✨**and waits up to 4 seconds for it to exist in the DOM**✨

  ✨**and waits up to 4 seconds for it to be visible**✨

  ✨**and waits up to 4 seconds for it to contain the text: Home**✨

The _total_ amount of time Cypress will wait for _all_ of the assertions to pass
is for the duration of the [cy.get()](/api/commands/get) `timeout` (which is 4
seconds).

Timeouts can be modified per command and this will affect all default assertions
and any assertions chained after that command.

#### Example #3: Modifying Timeouts

```js
// we've modified the timeout which affects default
// plus all added assertions
cy.get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Under the hood Cypress:

- Gets the element `.mobile-nav`

  ✨**and waits up to 10 seconds for it to exist in the DOM**✨

  ✨**and waits up to 10 seconds for it to be visible**✨

  ✨**and waits up to 10 seconds for it to contain the text: Home**✨

Notice that this timeout has flowed down to all assertions and Cypress will now
wait _up to 10 seconds total_ for all of them to pass.

<Alert type="danger">

Note that you _never_ change the timeout inside the assertion. The `timeout`
parameter **always** goes inside the command.

```js
// 🚨 DOES NOT WORK
cy.get('.selector').should('be.visible', { timeout: 1000 })
// ✅ THE CORRECT WAY
cy.get('.selector', { timeout: 1000 }).should('be.visible')
```

Remember, you are retrying the command with attached assertions, not just the
assertions!

</Alert>

### Default Values

Cypress offers several different timeout values based on the type of command.

We've set their default timeout durations based on how long we expect certain
actions to take.

For instance:

- [`cy.visit()`](/api/commands/visit) loads a remote page and does not resolve
  _until all of the external resources complete their loading phase_. This may
  take awhile, so its default timeout is set to `60000ms`.
- [`cy.exec()`](/api/commands/exec) runs a system command such as _seeding a
  database_. We expect this to potentially take a long time, and its default
  timeout is set to `60000ms`.
- [`cy.wait()`](/api/commands/wait) actually uses 2 different timeouts. When
  waiting for a
  [routing alias](/guides/core-concepts/variables-and-aliases#Routes), we wait
  for a matching request for `5000ms`, and then additionally for the server's
  response for `30000ms`. We expect your application to make a matching request
  quickly, but we expect the server's response to potentially take much longer.

That leaves most other commands including all DOM based commands to time out by
default after 4000ms.

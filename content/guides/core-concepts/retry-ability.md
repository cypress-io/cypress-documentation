---
title: Retry-ability
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How Cypress retries commands and assertions
- When commands are retried and when they are not
- How to address some situations of flaky tests

</Alert>

A core feature of Cypress that assists with testing dynamic web applications is
retry-ability. Like a good transmission in a car, it usually works without you
noticing it. But understanding how it works will help you write faster tests
with fewer run-time surprises.

<Alert type="info">

<strong class="alert-header">Test Retries</strong>

If you are looking to retry tests a configured number of times when the test
fails, check out our guide on [Test Retries](/guides/guides/test-retries).

</Alert>

## Commands, Queries and Assertions

While all methods you chain off of `cy` in your Cypress tests are commands,
there are some different types of commands it's important to understand:
**queries**, **assertions** and **actions** have special rules about
retryability. For example, there are 4 queries, an action, and 2 assertions in
the test below.

```javascript
it('creates an item', () => {
  cy.visit('/')

  cy.focused() // query
    .should('have.class', 'new-todo') // assertion

  cy.get('.new-todo') // query
    .type('todo A{enter}') // action

  cy.get('.todoapp') // query
    .find('.todo-list li') // query
    .should('have.length', 1) // assertion
})
```

The [Command Log](/guides/core-concepts/cypress-app#Command-Log) shows all
commands regardless of types, with passing assertions showing in green.

<DocsImage src="/img/guides/retry-ability/command-assertions.png" alt="Cypress tests shoing commands and assertions"></DocsImage>

Let's look at the last chain of commands:

```javascript
cy.get('.todoapp') // query
  .children('.todo-list li') // query
  .should('have.length', 1) // assertion
```

Because nothing is synchronous in modern web applications, Cypress can't query
all the DOM elements matching `.todo-list li` and check if there is exactly one
of them. There are many examples of why this would not work well.

- What if the application has not updated the DOM by the time these commands
  run?
- What if the application is waiting for its back end to respond before
  populating the DOM element?
- What if the application does some intensive computation before showing the
  results in the DOM?

Thus [`cy.get`](/api/commands/get) and [`cy.find()`](/api/commands/find) have to
be smarter and expect the application to potentially update. `cy.get()` queries
the application's DOM, finds the elements that match the selector, and then
passes them to `.find('.todo-list li')`. `.find()` locates a new set of
elements, and tries the assertion that follows (in our case
`should('have.length', 1)`) against the list of found elements.

- ✅ If the assertion that follows `cy.find()` passes, then the query finishes
  successfully.
- 🚨 If the assertion that follows `cy.find()` fails, then Cypress will requery
  the application's DOM again - starting from the top of the list of chain. Then
  Cypress will try the assertion against the elements yielded from
  `cy.get().find()`. If the assertion still fails, Cypress continues retrying
  until the `cy.find()` timeout is reached.

Retry-ability allows the test to complete each query as soon as the assertion
passes, without hard-coding waits. If your application takes a few milliseconds
or even seconds to render each DOM element - no big deal, the test does not have
to change at all. For example, let's introduce an artificial delay of 3 seconds
when refreshing the application's UI below in an example TodoMVC model code:

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false,
  })

  // let's trigger the UI to render after 3 seconds
  setTimeout(() => {
    this.inform()
  }, 3000)
}
```

The test still passes! `cy.get('.todo-list')` passes immediately - the
`todo-list` exists - but `.children('li').should('have.length', 1)` show the
spinning indicators, meaning Cypress is requerying for them.

<DocsImage src="/img/guides/retry-ability/retry-assertion.gif" alt="Retrying assertion"></DocsImage>

Within a few milliseconds after the DOM updates, `cy.find()` finds an element
and the `should('have.length', 1)` assertion passes

## Multiple assertions

Queries and assertions are always executed in order, and always retry 'from the
top'. If you have multiple assertions, Cypress will retry until each passes
before moving on to the next one.

For example, the following test has [`.should()`](/api/commands/should) and
[`.and()`](/api/commands/and) assertions. `.and()` is an alias of the
`.should()` command, so the second assertion is really a custom callback
assertion in the form of the [`.should(cb)`](/api/commands/should#Function)
function with 2 [`expect`](/guides/references/assertions#BDD-Assertions)
assertions inside of it.

```javascript
it('creates two items', () => {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.new-todo').type('todo B{enter}')

  cy.get('.todo-list li') // command
    .should('have.length', 2) // assertion
    .and(($li) => {
      // 2 more assertions
      expect($li.get(0).textContent, 'first item').to.equal('todo a')
      expect($li.get(1).textContent, 'second item').to.equal('todo B')
    })
})
```

Because the second assertion
`expect($li.get(0).textContent, 'first item').to.equal('todo a')` fails, the
third assertion is never reached. The command fails after timing out, and the
Command Log correctly shows that the first encountered assertion
`should('have.length', 2)` passed, but the second assertion and the command
itself failed.

<DocsImage src="/img/guides/retry-ability/second-assertion-fails.gif" alt="Retrying multiple assertions"></DocsImage>

## Built-in assertions

Often a Cypress command has built-in assertions that will cause the previous
queries to be retried. For example, the [`.eq()`](/api/commands/eq) query will
be retried even without any attached assertions until it finds an element with
the given index.

```javascript
cy.get('.todo-list li') // query
  .should('have.length', 2) // assertion
  .eq(3) // query
```

<DocsImage src="/img/guides/retry-ability/eq.gif" alt="Retrying built-in assertion"></DocsImage>

Only queries can be retried, but most other commands still have built-in
_waiting_. For example, as described in the "Assertions" section of
[.click()](/api/commands/click), the `click()` action command waits to click
until the element becomes
[actionable](/guides/core-concepts/interacting-with-elements#Actionability),
including re-running the query chain leading up to it in case the page updates
while we're waiting.

Cypress tries to act like a human user would using the browser.

- Can a user click on the element?
- Is the element invisible?
- Is the element behind another element?
- Does the element have the `disabled` attribute?

Actions - such as `.click()` - automatically wait until multiple built-in
assertions like these pass, and then it will attempt to click just once.

## Timeouts

By default each command that retries does so for up to 4 seconds - the
[`defaultCommandTimeout`](/guides/references/configuration#Timeouts) setting.

### Increase time to retry

You can change the default timeout for _all commands_. See
[Configuration: Overriding Options](/guides/references/configuration#Overriding-Options)
for examples of overriding this option.

For example, to set the default command timeout to 10 seconds via the command
line:

```shell
cypress run --config defaultCommandTimeout=10000
```

We do not recommend changing the command timeout globally. Instead, pass the
individual command's `{ timeout: ms }` option to retry for a different period of
time. For example:

```javascript
// we've modified the timeout which affects default + added assertions
cy.get('[data-testid="mobile-nav"]', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Cypress will retry for up to 10 seconds to find a visible element of class
`mobile-nav` with text containing "Home". For more examples, read the
[Timeouts](/guides/core-concepts/introduction-to-cypress#Timeouts) section in
the "Introduction to Cypress" guide.

### Disable retry

Overriding the timeout to `0` will essentially disable retrying the query or
waiting on an other, since it will spend 0 milliseconds retrying.

```javascript
// check synchronously that the element does not exist (no retry)
// for example just after a server-side render
cy.get('[data-testid="ssr-error"]', { timeout: 0 }).should('not.exist')
```

## Only queries are retried

Any command that isn't a query, such as `cy.click()`, follows different rules
than queries do. Cypress will retry any queries _leading up to_ a command, and
retry any assertions _after_ a command, but commands themselves never retry -
nor does anything leading up to them after they've resolved.

Most commands are not retried because they could potentially change the state of
the application under test. For example, Cypress will not retry the
[.click()](/api/commands/click) action command, because it could change
something in the application. After the click occurs, Cypress will also not
re-run any queries before `.click()`.

### Actions should be at the end of chains, not the middle

The following test might have problems if:

- Your JS framework re-rendered asynchronously
- Your app code reacted to an event firing and removed the element

#### <Icon name="exclamation-triangle" color="red"></Icon> Incorrectly chaining commands

```javascript
cy.get('.new-todo')
  .type('todo A{enter}') // action
  .type('todo B{enter}') // action after another action - bad
  .should('have.class', 'active') // assertion after an action - bad
```

#### <Icon name="check-circle" color="green"></Icon> Correctly ending chains after an action

To avoid these issues entirely, it is better to split up the above chain of
commands.

```javascript
cy.get('.new-todo').type('todo A{enter}')
cy.get('.new-todo').type('todo B{enter}')
cy.get('.new-todo').should('have.class', 'active')
```

Writing your tests in this way will help you avoid issues where the page
rerenders in the middle of your test and Cypress loses track of which elements
it's supposed to be operating or asserting on. Aliases -
[`cy.as()`](/api/commands/as) - can help make this pattern less intrusive.

```javascript
cy.get('.new-todo').as('new')

cy.get('@new').type('todo A{enter}')
cy.get('@new').type('todo B{enter}')
cy.get('@new').should('have.class', 'active')
```

<Alert type="warning">

Very rarely you may want to retry a command like `.click()`. We describe one
case like that where the event listeners are attached to a modal popup only
after a delay, thus causing default events fired during `.click()` to not
register. In this special case you may want to "keep clicking" until the event
registers, and the dialog disappears. Read about it in the
[When Can the Test Click?](https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/)
blog post.

Because of the assertions built into every command, and action commands in
particular, you should rarely need this pattern.

</Alert>

As another example, when confirming that the button component invokes the
`click` prop testing with the
[cypress/react](https://github.com/cypress-io/cypress/tree/master/npm/react)
mounting library, the following test might or might not work:

#### <Icon name="exclamation-triangle" color="red"></Icon> Incorrectly checking if the stub was called

```js
const Clicker = ({ click }) => (
  <div>
    <button onClick={click}>Click me</button>
  </div>
)

it('calls the click prop twice', () => {
  const onClick = cy.stub()
  cy.mount(<Clicker click={onClick} />)
  cy.get('button')
    .click()
    .click()
    .then(() => {
      // works in this case, but not recommended
      // because .click() and .then() do not retry
      expect(onClick).to.be.calledTwice
    })
})
```

The above example will fail if the component calls the `click` prop after a
delay.

```js
const Clicker = ({ click }) => (
  <div>
    <button onClick={() => setTimeout(click, 500)}>Click me</button>
  </div>
)
```

<DocsImage src="/img/guides/retry-ability/delay-click.png" alt="Expect fails the test without waiting for the delayed stub"></DocsImage>

The test finishes before the component calls the `click` prop twice, and without
retrying the assertion `expect(onClick).to.be.calledTwice`.

It could also fail if React decides to rerender the DOM between clicks.

#### <Icon name="check-circle" color="green"></Icon> Correctly waiting for the stub to be called

We recommend aliasing the stub using the [`.as`](/api/commands/as) command and
using `cy.get('@alias').should(...)` assertions.

```js
it('calls the click prop', () => {
  const onClick = cy.stub().as('clicker')

  cy.mount(<Clicker click={onClick} />)
  // Good practice 💡: Don't chain anything off of commands
  cy.get('button').click()
  cy.get('button').click()

  // Good practice 💡: Reference the stub with an alias
  cy.get('@clicker').should('have.been.calledTwice')
})
```

<DocsImage src="/img/guides/retry-ability/click-twice.gif" alt="Retrying the assertions using a stub alias"></DocsImage>

### Use `.should()` with a callback

If you are using commands, but need to retry the entire chain, consider
rewriting the commands into a
[.should(callbackFn)](/api/commands/should#Function).

Below is an example where the number value is set after a delay:

```html
<div class="random-number-example">
  Random number: <span id="random-number">🎁</span>
</div>
<script>
  const el = document.getElementById('random-number')
  setTimeout(() => {
    el.innerText = Math.floor(Math.random() * 10 + 1)
  }, 1500)
</script>
```

<DocsImage src="/img/guides/retry-ability/random-number.gif" alt="Random number"></DocsImage>

### <Icon name="exclamation-triangle" color="red"></Icon> Incorrectly waiting for values

You may want to write a test like below, to test that the number is between 1
and 10, although **this will not work as intended**. The test yields the
following values, noted in the comments, before failing.

```javascript
// WRONG: this test will not work as intended
cy.get('[data-testid="random-number"]') // <div>🎁</div>
  .invoke('text') // "🎁"
  .then(parseFloat) // NaN
  .should('be.gte', 1) // fails
  .and('be.lte', 10) // never evaluates
```

Unfortunately, the [.then()](/api/commands/then) command is not retried. Thus
the test only runs the entire chain once before failing.

<DocsImage src="/img/guides/retry-ability/random-number-first-attempt.png" alt="First attempt at writing the test"></DocsImage>

#### <Icon name="check-circle" color="green"></Icon> Correctly waiting for values

We need to retry getting the element, invoking the `text()` method, calling the
`parseFloat` function and running the `gte` and `lte` assertions. We can achieve
this using the `.should(callbackFn)`.

```javascript
cy.get('[data-testid="random-number"]').should(($div) => {
  // all the code inside here will retry
  // until it passes or times out
  const n = parseFloat($div.text())

  expect(n).to.be.gte(1).and.be.lte(10)
})
```

The above test retries getting the element and invoking the text of the element
to get the number. When the number is finally set in the application, then the
`gte` and `lte` assertions pass and the test passes.

<DocsImage src="/img/guides/retry-ability/random-number-callback.gif" alt="Random number using callback"></DocsImage>

## See also

- Read our blog posts about fighting
  [the test flake](https://cypress.io/blog/tag/flake/).
- You can add retry-ability to your own
  [custom commands](/api/cypress-api/custom-commands) and queries.
- You can retry any function with attached assertions using the 3rd party
  plugins [cypress-pipe](https://github.com/NicholasBoll/cypress-pipe) and
  [cypress-wait-until](https://github.com/NoriSte/cypress-wait-until).
- 3rd party plugin
  [cypress-recurse](https://github.com/bahmutov/cypress-recurse) can be used to
  implement the
  [visual testing with retry-ability for canvas elements](https://glebbahmutov.com/blog/canvas-testing/)
- To learn how to enable Cypress' test retries functionality, which retries
  tests that fail, check out our official guide on
  [Test Retries](/guides/guides/test-retries).

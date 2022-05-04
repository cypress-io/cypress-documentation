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
fails, check out our official guide on
[Test Retries](/guides/guides/test-retries).

</Alert>

## Commands vs assertions

There are two types of methods you can call in your Cypress tests: **commands**
and **assertions**. For example, there are 6 commands and 2 assertions in the
test below.

```javascript
it('creates 2 items', () => {
  cy.visit('/') // command
  cy.focused() // command
    .should('have.class', 'new-todo') // assertion

  cy.get('[data-testid="new-todo"]') // command
    .type('todo A{enter}') // command
    .type('todo B{enter}') // command

  cy.get('[data-testid="todo-list"] li') // command
    .should('have.length', 2) // assertion
})
```

The [Command Log](/guides/core-concepts/cypress-app#Command-Log) shows both
commands and assertions with passing assertions showing in green.

<DocsImage src="/img/guides/retry-ability/v10/command-assertions.png" alt="Cypress tests shoing commands and assertions"></DocsImage>

Let's look at the last command and assertion pair:

```javascript
cy.get('[data-testid="todo-list"] li') // command
  .should('have.length', 2) // assertion
```

Because nothing is synchronous in modern web applications, Cypress can't query
all the DOM elements with the class `todo-list` and check if there are only two
of them. There are many examples of why this would not work well.

- What if the application has not updated the DOM by the time these commands
  run?
- What if the application is waiting for its back end to respond before
  populating the DOM element?
- What if the application does some intensive computation before showing the
  results in the DOM?

Thus the Cypress [`cy.get`](/api/commands/get) command has to be smarter and
expect the application to potentially update. The `cy.get()` queries the
application's DOM, finds the elements that match the selector, and then tries
the assertion that follows it (in our case `should('have.length', 2)`) against
the list of found elements.

- ✅ If the assertion that follows the `cy.get()` command passes, then the
  command finishes successfully.
- 🚨 If the assertion that follows the `cy.get()` command fails, then the
  `cy.get()` command will requery the application's DOM again. Then Cypress will
  try the assertion against the elements yielded from `cy.get()`. If the
  assertion still fails, `cy.get()` will try requerying the DOM again, and so on
  until the `cy.get()` command timeout is reached.

The retry-ability allows the tests to complete each command as soon as the
assertion passes, without hard-coding waits. If your application takes a few
milliseconds or even seconds to render each DOM element - no big deal, the test
does not have to change at all. For example, let's introduce an artificial delay
of 3 seconds when refreshing the application's UI below in an example TodoMVC
model code:

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

My test still passes! The last `cy.get('[data-testid="todo-list"]')` and the
assertion `should('have.length', 2)` are clearly showing the spinning
indicators, meaning Cypress is requerying for them.

<DocsImage src="/img/guides/retry-ability/v10/retry-2-items.gif" alt="Retrying finding 2 items"></DocsImage>

Within a few milliseconds after the DOM updates, `cy.get()` finds two elements
and the `should('have.length', 2)` assertion passes

## Multiple assertions

A single command followed by multiple assertions retries each one of them -- in
order. Thus when the first assertion passes, the command will be retried with
first and second assertion. When the first and second assertion pass, then the
command will be retried with the first, second, and third assertion, and so on.

For example, the following test has [`.should()`](/api/commands/should) and
[`.and()`](/api/commands/and) assertions. `.and()` is an alias of the
`.should()` command, so the second assertion is really a custom callback
assertion in the form of the [`.should(cb)`](/api/commands/should#Function)
function with 2 [`expect`](/guides/references/assertions#BDD-Assertions)
assertions inside of it.

```javascript
cy.get('[data-testid="todo-list"] li') // command
  .should('have.length', 2) // assertion
  .and(($li) => {
    // 2 more assertions
    expect($li.get(0).textContent, 'first item').to.equal('todo a')
    expect($li.get(1).textContent, 'second item').to.equal('todo B')
  })
```

Because the second assertion
`expect($li.get(0).textContent, 'first item').to.equal('todo a')` fails, the
third assertion is never reached. The command fails after timing out, and the
Command Log correctly shows that the first encountered assertion
`should('have.length', 2)` passed, but the second assertion and the command
itself failed.

<DocsImage src="/img/guides/retry-ability/v10/second-assertion-fails.gif" alt="Retrying multiple assertions"></DocsImage>

## Not every command is retried

Cypress only retries commands that query the DOM:
[`cy.get()`](/api/commands/get), [`.find()`](/api/commands/find),
[`.contains()`](/api/commands/contains), etc. You can check if a particular
command is retried by looking at the "Assertions" section in its API
documentation. For example, "Assertions section" of
[`.first()`](/api/commands/first) tells us that the command is retried until all
assertions that follow it are passing.

<List><li>`.first()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.first()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Why are some commands _NOT_ retried?

Commands are not retried when they could potentially change the state of the
application under test. For example, Cypress will not retry the
[.click()](/api/commands/click) command, because it could change something in
the application.

<Alert type="warning">

Very rarely you may want to retry a command like `.click()`. We describe one
case like that where the event listeners are attached to a modal popup only
after a delay, thus causing default events fired during `.click()` to not
register. In this special case you may want to "keep clicking" until the event
registers, and the dialog disappears. Read about it in the
[When Can the Test Click?](https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/)
blog post.

</Alert>

## Built-in assertions

Often a Cypress command has built-in assertions that will cause the command to
be retried. For example, the [`.eq()`](/api/commands/eq) command will be retried
even without any attached assertions until it finds an element with the given
index in the previously yielded list of elements.

```javascript
cy.get('[data-testid="todo-list"] li') // command
  .should('have.length', 2) // assertion
  .eq(3) // command
```

<DocsImage src="/img/guides/retry-ability/v10/eq.gif" alt="Retrying built-in assertion"></DocsImage>

Some commands that cannot be retried still have built-in _waiting_. For example,
as described in the "Assertions" section of [.click()](/api/commands/click), the
`click()` command waits to click until the element becomes
[actionable](/guides/core-concepts/interacting-with-elements#Actionability).

Cypress tries to act like a human user would using the browser.

- Can a user click on the element?
- Is the element invisible?
- Is the element behind another element?
- Does the element have the `disabled` attribute?

The `.click()` command will automatically wait until multiple built-in assertion
checks like these pass, and then it will attempt to click just once.

## Timeouts

By default each command that retries, does so for up to 4 seconds - the
[`defaultCommandTimeout`](/guides/references/configuration#Timeouts) setting.

### Increase time to retry

You can change this timeout for _all commands_. See
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

Overriding the timeout to `0` will essentially disable retrying the command,
since it will spend 0 milliseconds retrying.

```javascript
// check synchronously that the element does not exist (no retry)
// for example just after a server-side render
cy.get('[data-testid="ssr-error"]', { timeout: 0 }).should('not.exist')
```

## Only the last command is retried

Here is a short test that demonstrates some flake.

:::visit-mount-test-example

```js
cy.visit('/')
```

```js
cy.mount(<Todos />)
```

```js
it('adds two items', () => {
  __VISIT_MOUNT_PLACEHOLDER__

  cy.get('[data-testid="new-todo"]').type('todo A{enter}')
  cy.get('[data-testid="todo-list"] li')
    .find('label')
    .should('contain', 'todo A')

  cy.get('[data-testid="new-todo"]').type('todo B{enter}')
  cy.get('[data-testid="todo-list"] li')
    .find('label')
    .should('contain', 'todo B')
})
```

:::

The test passes in Cypress without a hitch.

<DocsImage src="/img/guides/retry-ability/v10/adds-two-items-passes.gif" alt="Test passes"></DocsImage>

But sometimes the test fails - not usually locally, no - it almost always fails
on our continuous integration server. When the test fails, the recorded video
and screenshots are NOT showing any obvious problems! Here is the failing test
video:

<DocsImage src="/img/guides/retry-ability/v10/adds-two-items-fails.gif" alt="Test fails"></DocsImage>

The problem looks weird - I can clearly see the label "todo B" present in the
list, so why isn't Cypress finding it? What is going on?

Remember the delay we introduced into our application code that causes the test
to time out? We added a 100ms delay before the UI rerenders itself.

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false,
  })

  setTimeout(() => {
    this.inform()
  }, 100)
}
```

This delay could be the source of our flaky tests when the application is
running on our CI server. Here is how to see the source of the problem. In the
Command Log, hover over each command to see which elements Cypress found at each
step.

In the failing test, the first label was indeed found correctly:

<DocsImage src="/img/guides/retry-ability/v10/first-item-label.png" alt="First item label"></DocsImage>

Hover over the second "FIND label" command - something is wrong here. It found
the _first label_, then kept requerying to find the text "todo B", but the first
item always remains "todo A".

<DocsImage src="/img/guides/retry-ability/v10/second-item-label.png" alt="Second item label"></DocsImage>

Hmm, weird, why is Cypress only looking at the _first_ item? Let's hover over
the "GET .todo-list li" command to inspect what _that command found_. Ohh,
interesting - there was only one item at that moment.

<DocsImage src="/img/guides/retry-ability/v10/second-get-li.png" alt="Second get li"></DocsImage>

During the test, the `cy.get('[data-testid="todo-list"] li')` command quickly
found the rendered `<li>` item - and that item was the first and only "todo A"
item. Our application was waiting 100ms before appending the second item "todo
B" to the list. By the time the second item was added, Cypress had already
"moved on", working only with the first `<li>` element. It only searched for
`<label>` inside the first `<li>` element, completely ignoring the newly created
2nd item.

To confirm this, let's remove the artificial delay to see what's happening in
the passing test.

<DocsImage src="/img/guides/retry-ability/v10/two-items.png" alt="Two items"></DocsImage>

When the web application runs without the delay, it gets its items into the DOM
before the Cypress command `cy.get('[data-testid="todo-list"] li')` runs. After
the `cy.get()` returns 2 items, the `.find()` command just has to find the right
label. Great.

Now that we understand the real reason behind the flaky test, we need to think
about why the default retry-ability has not helped us in this situation. Why
hasn't Cypress found the 2 `<li>` elements after the second one was added?

For a variety of implementation reasons, Cypress commands **only** retry the
**last command** before the assertion. In our test:

```javascript
cy.get('[data-testid="new-todo"]').type('todo B{enter}')
cy.get('[data-testid="todo-list"] li') // queries immediately, finds 1 <li>
  .find('label') // retried, retried, retried with 1 <li>
  .should('contain', 'todo B') // never succeeds with only 1st <li>
```

## Use retry-ability correctly

Luckily, once we understand how retry-ability works and how only the last
command is used for assertion retries, we can fix this test for good.

### Merging queries

The first solution we recommend is to avoid unnecessarily splitting commands
that query elements. Instead of
`cy.get('[data-testid="todo-list"] li').find('label')` we can combine two
separate queries into one - forcing the combined query to be retried.

:::visit-mount-test-example

```js
cy.visit('/')
```

```js
cy.mount(<Todos />)
```

```js
it('adds two items', () => {
  __VISIT_MOUNT_PLACEHOLDER__

  cy.get('[data-testid="new-todo"]').type('todo A{enter}')
  cy.get('[data-testid="todo-list"] li label') // 1 query command
    .should('contain', 'todo A') // assertion

  cy.get('[data-testid="new-todo"]').type('todo B{enter}')
  cy.get('[data-testid="todo-list"] li label') // 1 query command
    .should('contain', 'todo B') // assertion
})
```

:::

To show the retries, I increased the application's artificial delay to 500ms.
The test now always passes because the entire selector is retried. It finds 2
list elements when the second "todo B" is added to the DOM.

<DocsImage src="/img/guides/retry-ability/v10/combined-selectors.gif" alt="Combined selector"></DocsImage>

<Alert type="info">

<strong class="alert-header">Use
[`cy.contains`](/api/commands/contains)</strong>

**Tip:** instead of `cy.get(selector).should('contain', text)` or
`cy.get(selector).contains(text)` chain, we recommend using
`cy.contains(selector, text)` which is retried automatically as a single
command.

```javascript
cy.get('[data-testid="new-todo"]').type('todo A{enter}')
cy.contains('[data-testid="todo-list"] li', 'todo A')
cy.get('[data-testid="new-todo"]').type('todo B{enter}')
// you can use a regular expression
// to match the text exactly
cy.contains('[data-testid="todo-list"] li', /^todo B$/)
```

</Alert>

Similarly, when working with deeply nested JavaScript properties using the
[`.its()`](/api/commands/its) command, try not to split it across multiple
calls. Instead, combine property names into a single call using the `.`
separator:

```javascript
// 🛑 not recommended
// only the last "its" will be retried
cy.window()
  .its('app') // runs once
  .its('model') // runs once
  .its('todos') // retried
  .should('have.length', 2)

// ✅ recommended
cy.window()
  .its('app.model.todos') // retried
  .should('have.length', 2)
```

See the
[Set flag to start tests](https://glebbahmutov.com/blog/set-flag-to-start-tests/)
blog for the full example.

### Alternate commands and assertions

There is another way to fix our flaky test. Whenever you write a longer test, we
recommend alternating commands with assertions. In this case, I will add an
assertion after the `cy.get()` command, but before the `.find()` command.

:::visit-mount-test-example

```js
cy.visit('/')
```

```js
cy.mount(<Todos />)
```

```js
it('adds two items', () => {
  __VISIT_MOUNT_PLACEHOLDER__

  cy.get('[data-testid="new-todo"]').type('todo A{enter}')
  cy.get('[data-testid="todo-list"] li') // command
    .should('have.length', 1) // assertion
    .find('label') // command
    .should('contain', 'todo A') // assertion

  cy.get('[data-testid="new-todo"]').type('todo B{enter}')
  cy.get('[data-testid="todo-list"] li') // command
    .should('have.length', 2) // assertion
    .find('label') // command
    .should('contain', 'todo B') // assertion
})
```

:::

<DocsImage src="/img/guides/retry-ability/v10/alternating-commands-assertions.png" alt="Passing test"></DocsImage>

The test passes, because the second `cy.get('[data-testid="todo-list"] li')` is
retried with its own assertion now `.should('have.length', 2)`. Only after
successfully finding two `<li>` elements, the command `.find('label')` and its
assertion starts, and by now, the item with the correct "todo B" label has been
correctly queried.

### Use `.should()` with a callback

If you have to use commands that cannot be retried, but need to retry the entire
chain, consider rewriting the commands into a single
[.should(callbackFn)](/api/commands/should#Function) chained off the very first
retry-able command.

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

<DocsImage src="/img/guides/retry-ability/v10/random-number.gif" alt="Random number"></DocsImage>

#### <Icon name="exclamation-triangle" color="red"></Icon> Incorrectly waiting for values

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

<DocsImage src="/img/guides/retry-ability/v10/random-number-first-attempt.png" alt="First attempt at writing the test"></DocsImage>

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

<DocsImage src="/img/guides/retry-ability/v10/random-number-callback.gif" alt="Random number using callback"></DocsImage>

### Use aliases

When using [`cy.stub()`](/api/commands/stub) or [`cy.spy()`](/api/commands/spy)
to test application's code, a good practice is to give it an alias and use the
`cy.get('@alias').should('...')` assertion to retry.

For example, when confirming that the button component invokes the `click` prop
testing with the
[@cypress/react](https://github.com/cypress-io/cypress/tree/master/npm/react)
plugin, the following test might or might not work:

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
      // because .then() does not retry
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

<DocsImage src="/img/guides/retry-ability/v10/delay-click.png" alt="Expect fails the test without waiting for the delayed stub"></DocsImage>

The test finishes before the component calls the `click` prop twice, and without
retrying the assertion `expect(onClick).to.be.calledTwice`.

#### <Icon name="check-circle" color="green"></Icon> Correctly waiting for the stub to be called

We recommend aliasing the stub using the [`.as`](/api/commands/as) command and
using `cy.get('@alias').should(...)` assertions.

```js
it('calls the click prop', () => {
  const onClick = cy.stub().as('clicker')
  cy.mount(<Clicker click={onClick} />)
  cy.get('button').click().click()

  // good practice 💡
  // auto-retry the stub until it was called twice
  cy.get('@clicker').should('have.been.calledTwice')
})
```

<DocsImage src="/img/guides/retry-ability/v10/click-twice.gif" alt="Retrying the assertions using a stub alias"></DocsImage>

Watch the short video below to see this example in action

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/AlltFcsIFvc"></DocsVideo>

<!-- textlint-enable -->

## See also

- Read our blog posts about fighting
  [the test flake](https://cypress.io/blog/tag/flake/).
- You can add retry-ability to your own
  [custom commands](/api/cypress-api/custom-commands); see
  [this pull request to cypress-xpath](https://github.com/cypress-io/cypress-xpath/pull/12/files)
  for an example.
- You can retry any function with attached assertions using the 3rd party
  plugins [cypress-pipe](https://github.com/NicholasBoll/cypress-pipe) and
  [cypress-wait-until](https://github.com/NoriSte/cypress-wait-until).
- 3rd party plugin
  [cypress-recurse](https://github.com/bahmutov/cypress-recurse) can be used to
  implement the
  [visual testing with retry-ability for canvas elements](https://glebbahmutov.com/blog/canvas-testing/)
- See retry-ability examples in the
  [Cypress should callback](https://glebbahmutov.com/blog/cypress-should-callback/)
  blog post.
- To learn how to enable Cypress' test retries functionality, which retries
  tests that fail up to the configured number, check out our official guide on
  [Test Retries](/guides/guides/test-retries).

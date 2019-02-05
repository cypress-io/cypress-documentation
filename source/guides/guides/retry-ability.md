---
title: Retry-ability
---

Retry-ability is the core part of Cypress Test Runner that allows it to test dynamic web applications. Like a good car transmission, it usually works without you noticing it, but understanding how it works will help you write faster tests with fewer run-time surprises.

## Commands and assertions

There are two types of methods you call in your Cypress tests: commands and assertions. For example, there are 6 commands and 2 assertions in the test below.

```javascript
it('creates 2 items', function () {
  cy.visit('/') // command
  cy.focused() // command
    .should('have.class', 'new-todo') // assertion
  cy.get('.new-todo') // command
    .type('todo A{enter}') // command
    .type('todo B{enter}') // command
  cy.get('.todo-list li') // command
    .should('have.length', 2) // assertion
})
```

Command Log shows both commands and assertions, passing assertions are shown in green.

![Commands and assertions](/img/guides/retry-ability/commands-assertions.png)

Let's look at the last command and assertion pair:

```javascript
cy.get('.todo-list li') // command
  .should('have.length', 2) // assertion
```

Because nothing is instant or synchronous in the modern web applications, Cypress Test Runner cannot "simply" select DOM elements with class `todo-list` and check if there are only two of them. Maybe application has not updated the DOM yet; maybe the application is waiting for its backend to respond; maybe the web application does some intensive computation before showing the results in the DOM. Thus the Cypress {% url `cy.get` get %} command has to be smarter and expect the application to update itself. The `cy.get()` queries the web page DOM, finds the elements that match the selector, and then tries the assertion that follows it against the list of found elements. If the assertion that follows it (in our case it is `should('have.length', 2)` assertion) passes, the command finishes successfully.

But if the assertion that follows the `cy.get` command throws an error, then the `cy.get` command will try querying the web page DOM again. And then it will try the assertion against the new list. And if the assertion still fails, `cy.get` will try querying the DOM again, and so on.

The retry-ability allows the tests to complete each command as soon as the assertion passes, without hard-coding waits. If your application takes a few milliseconds or even seconds to render each entered item - no big deal, the test does not have to change at all. For example, I will introduce an artificial delay of 3 seconds when refreshing the application's UI below in a TodoMVC model code:

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false
  })

  // let's trigger UI render after 3 seconds
  setTimeout(() => {
    this.inform()
  }, 3000)
}
```

My test still passes. The last `cy.get('.todo-list')` and the assertion `should('have.length', 2)` are clearly showing the spinning indicators, meaning Cypress Test Runner is retrying them.

![Retrying finding 2 items](/img/guides/retry-ability/retry-2-items.gif)

Within a few milliseconds after updating the DOM, the `cy.get` finds two elements, the assertion `should('have.length', 2)` passes, and the command successfully completes.

## Multiple assertions

A single command followed by multiple assertions retries each one of them - in order. Thus when the first assertion passes, then the command will be retried with first and second assertion. When first and second assertion pass, then the command will be retried with first, second and third assertion and so on. For example, the following test has {% url `should` should %} and {% url `and` and %} assertions. The `and` is an alias to the `should` for readability, so the second assertion is really custom callback assertion in the form {% url `should(cb)` should#Function %} function with 2 {% url `expect` assertions#BDD-Assertions %} assertions inside of it.

```javascript
cy.get('.todo-list li') // command
  .should('have.length', 2) // assertion
  .and(($li) => {
    // 2 more assertions
    expect($li.get(0).textContent, 'first item').to.equal('todo a')
    expect($li.get(1).textContent, 'second item').to.equal('todo B')
  })
```

Because the second assertion `expect($li.get(0).textContent, 'first item').to.equal('todo a')` fails, the third assertion is never reached. The command fails after timing out, and the Command Log correctly shows that the first encountered assertion `should('have.length', 2)` passed, but the next assertion and the command itself failed.

![Retrying multiple assertions](/img/guides/retry-ability/second-assertion-fails.gif)

## Not every command can be retried

Cypress only retries commands that query the web application's DOM: {% url `get` get %}, {% url `find` find %}, {% url `contains` contains %}, etc. You can check if a particular command is retried by looking at the "Assertions" section in its API documentation page. For example, [first#Assertions](https://on.cypress.io/first#Assertions) tells us that the command is retried until all assertions that follow it are passing.

{% assertions existence .first %}

Why are some commands NOT retried? Because they change the state of the application under test. For example, Cypress will not retry the {% url 'cy.click' click %} command, because it will _probably_ change something in the application.

{% note warning %}
Very rarely you do have to retry a command like `click`. We describe one case like that where the event listeners are attached to a modal popup only after a delay, causing "normal" `cy.click` to NOT register. In this special case you need to "keep clicking" until the event registers, and the dialog disappears. Read about it in {% url "When Can the Test Click?" https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/ %} blog post.
{% endnote %}

## Built-in assertions

Often a Cypress command has built-in assertions that will cause the command to be retried. For example, the {% url `cy.eq(k)` eq %} command will be retried even without any attached assertions until it finds an element with the given index in the list of elements it has started with.

```javascript
cy.get('.todo-list li') // command
  .should('have.length', 2) // assertion
  .eq(3) // command
```

![Retrying built-in assertion](/img/guides/retry-ability/eq.gif)

Some commands that cannot be retried still have built-in _waiting_. For example, `cy.click` command will not "blindly" send a click event to an element. As described in [click#Assertions](https://on.cypress.io/click#Assertions) section, `cy.click` waits to click until the element becomes [actionable](https://on.cypress.io/interacting-with-elements#Actionability). Cypress Test Runner always tries to act like a human user using the browser. Think - can a user click on the element? Or is it invisible, or behind another element, or has the `disabled` attribute? The `cy.click` command will automatically wait until multiple built-in actionability checks like these pass, and then it will click just once.

## Timeouts

By default each command that retries, does so for up to 4 seconds - the {% url `defaultCommandTimeout` https://on.cypress.io/configuration#Timeouts %} setting. You can change this timeout for _all commands_ using configuration file `cypress.json`, or CLI parameter, or via an environment variable, or programmatically. For example, to set the default command timeout to 15 seconds via command line:

```shell
cypress run --config defaultCommandTimeout=15000
```

See {% url 'Configuration: Overriding Options' https://on.cypress.io/configuration#Overriding-Options %} for other examples overriding this option. We do not recommend changing the command timeout globally. Instead, add `{ timeout: ms }` option to the actual command you would like to retry for a different period of time. For example:

```javascript
// we've modified the timeout which affects default + added assertions
cy.get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Cypress will retry for up to 10 seconds to find a visible element with class `mobile-nav` in the DOM with text containing "Home". For more examples, read section {% url 'Timeouts' https://on.cypress.io/introduction-to-cypress#Timeouts %} in the "Introduction to Cypress" guide.

## Only the last command is retried

Here is a short test that has a subtle reef that can sink your test ship.

```javascript
it('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li')
    .find('label')
    .should('contain', 'todo A')

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li')
    .find('label')
    .should('contain', 'todo B')
})
```

The test passes in the Test Runner without a hitch.

![Test passes](/img/guides/retry-ability/adds-two-items-passes.gif)

But sometimes the test fails - not locally, no - it fails on continuous integration server, and when it fails, the test run movie and screenshots are NOT showing any problems! Here is the failing test movie.

![Test fails](/img/guides/retry-ability/adds-two-items-fails.gif)

The problem looks weird - I can clearly see the label "todo B" present in the list, so why isn't Cypress finding it? What is going on? Here is the problem I have introduced into my application code that causes the test to time out: I have added a 100ms delay before the UI rerenders itself.

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false
  })
  setTimeout(() => {
    this.inform()
  }, 100)
}
```

This delay could be the source of flaky tests when the application is running on CI server, or against staging or production environments. Here is how to see the source of the problem: in the Command Log hover over each command to see which elements the Test Runner found at each step.

In the failing test, the first label has indeed been found correctly:

![First item label](/img/guides/retry-ability/first-item-label.png)

Hover over the second "FIND label" command - something is wrong there. It found the _first label_, and kept retrying finding text "todo B", but the first item always remained with "todo A".

![Second item label](/img/guides/retry-ability/second-item-label.png)

Hmm, weird, why is the Test Runner only looking at the _first_ item? Let us hover over "GET .todo-list li" command to inspect what _that command found_. Ohh, interesting - there was only one item at that moment.

![Second get li](/img/guides/retry-ability/second-get-li.png)

During the test, `get('.todo-list li')` command quickly found 1 `<li>` item - and that item was the first "todo A" item, because our application was waiting for 100ms before appending the second item "todo B" to the list. By the time the second item has been added, the Test Runner has already "moved on" working with the single first `<li>` element. It only searched for `<label>` inside the first `<li>` element, completely ignoring the newly created 2nd item.

To confirm this, let me remove the artificial delay to see what is happening in the passing test.

![Two items](/img/guides/retry-ability/two-items.png)

When the web application is fast, it gets its items into the DOM before the Cypress command `get('.todo-list li')` runs. After that `get` returns 2 items, the `find` command just has to find the right label. Great.

Now that we understand the real reason behind the flaky test, we need to think why the default retry-ability has not helped us in this situation. Why hasn't Cypress found the 2 `<li>` elements after the second one was added?

For a variety of implementation reasons, Cypress commands **only** retries the **last command** before the assertion. In our test:

```javascript
cy.get('.new-todo').type('todo B{enter}')
cy.get('.todo-list li') // passes immediately with 1 element
  .find('label') // retried, retried, retried with 1 <li>
  .should('contain', 'todo B') // never succeeds
```

Luckily, once we understand how retry-ability works, and how only the last command before any assertion retries, we can fix this test for good.

### Merging selectors

The first solution we recommend is to avoid unnecessarily splitting commands that select elements. In our case we first select elements using `cy.get` and then select from that list elements using `cy.find`. We can combine two separate selectors into one - forcing the combined selector to be retried.

```javascript
it('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li label') // 1 selector command
    .should('contain', 'todo A') // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li label') // 1 selector command
    .should('contain', 'todo B') // assertion
})
```

To show the retries I increased the application's artificial delay to 500ms. The test always passes because the entire selector is retried - and it does find 2 items when the second "todo B" is added to the DOM.

![Combined selector](/img/guides/retry-ability/combined-selectors.gif)

Similarly, when working with deeply nested JavaScript properties using {% url `cy.its` its %} command, do not split it across multiple calls. Instead combine property names into a single call using `.` separator:

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

See {% url 'Set flag to start tests' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %} for the full example.

### Alternate commands and assertions

There is another way to fix the test. Whenever you write a longer test, we recommend alternating commands with assertions. In this case, I will add an assertion after the `cy.get` command, before the `cy.find` command.

```javascript
it.only('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li')         // command
    .should('have.length', 1)     // assertion
    .find('label')                // command
    .should('contain', 'todo A')  // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li')         // command
    .should('have.length', 2)     // assertion
    .find('label')                // command
    .should('contain', 'todo B')  // assertion
})
```

![Passing test](/img/guides/retry-ability/alternating.png)

The test passes, because the second `cy.get('.todo-list li')` is retried with its own assertion now `should('have.length', 2)`. Only after successfully finding two `<li>` elements, the command `find('label')` and its assertion starts, and by now, the item with correct label "todo B" has been correctly selected.

## See also

- You can add retry-ability to your own {% url "custom commands" custom-commands %}, see {% url 'this pull request to cypress-xpath' https://github.com/cypress-io/cypress-xpath/pull/12/files %} for example.
- You can retry any function with attached assertions using the 3rd party plugin {% url cypress-pipe https://github.com/NicholasBoll/cypress-pipe %}.
- See retry-ability examples in {% url "Cypress should callback" https://glebbahmutov.com/blog/cypress-should-callback/ %} blog post.

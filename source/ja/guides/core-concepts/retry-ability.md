---
title: Retry-ability
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn
- How Cypress retries commands and assertions
- When commands are retried and when they are not
- How to address some situations of flaky tests
{% endnote %}

A core feature of Cypress that assists with testing dynamic web applications is retry-ability. Like a good transmission in a car, it usually works without you noticing it. But understanding how it works will help you write faster tests with fewer run-time surprises.

# Commands vs assertions

There are two types of methods you can call in your Cypress tests: **commands** and **assertions**. For example, there are 6 commands and 2 assertions in the test below.

```javascript
it('creates 2 items', function () {
  cy.visit('/')                       // command
  cy.focused()                        // command
    .should('have.class', 'new-todo') // assertion
  cy.get('.new-todo')                 // command
    .type('todo A{enter}')            // command
    .type('todo B{enter}')            // command
  cy.get('.todo-list li')             // command
    .should('have.length', 2)         // assertion
})
```

The {% url "Command Log" test-runner#Command-Log %} shows both commands and assertions with passing assertions showing in green.

{% imgTag /img/guides/retry-ability/commands-assertions.png "ommands and assertions" %}

Let's look at the last command and assertion pair:

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
```

Because nothing is synchronous in modern web applications, Cypress can't query all the DOM elements with the class `todo-list` and check if there are only two of them. There are many examples of why this would not work well.

- What if the application has not updated the DOM by the time these commands run?
- What if the application is waiting for its back end to respond before populating the DOM element?
- What if the application does some intensive computation before showing the results in the DOM?

Thus the Cypress {% url `cy.get` get %} command has to be smarter and expect the application to potentially update. The `cy.get()` queries the application's DOM, finds the elements that match the selector, and then tries the assertion that follows it (in our case `should('have.length', 2)`) against the list of found elements.

- ✅ If the assertion that follows the `cy.get()` command passes, then the command finishes successfully.
- 🚨 If the assertion that follows the `cy.get()` command fails, then the `cy.get()` command will requery the application's DOM again. Then Cypress will try the assertion against the elements yielded from `cy.get()`. If the assertion still fails, `cy.get()` will try requery the DOM again, and so on until the `cy.get()` command timeout is reached.

The retry-ability allows the tests to complete each command as soon as the assertion passes, without hard-coding waits. If your application takes a few milliseconds or even seconds to render each DOM element - no big deal, the test does not have to change at all. For example, let's introduce an artificial delay of 3 seconds when refreshing the application's UI below in an example TodoMVC model code:

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false
  })

  // let's trigger the UI to render after 3 seconds
  setTimeout(() => {
    this.inform()
  }, 3000)
}
```

My test still passes! The last `cy.get('.todo-list')` and the assertion `should('have.length', 2)` are clearly showing the spinning indicators, meaning Cypress is requerying for them.

{% imgTag /img/guides/retry-ability/retry-2-items.gif "Retrying finding 2 items" %}

Within a few milliseconds after the DOM updates, `cy.get()` finds two elements and the `should('have.length', 2)` assertion passes

# Multiple assertions

A single command followed by multiple assertions retries each one of them -- in order. Thus when the first assertion passes, the command will be retried with first and second assertion. When the first and second assertion pass, then the command will be retried with the first, second, and third assertion, and so on.

For example, the following test has {% url `.should()` should %} and {% url `.and()` and %} assertions. `.and()` is an alias of the `.should()` command, so the second assertion is really a custom callback assertion in the form of the {% url `.should(cb)` should#Function %} function with 2 {% url `expect` assertions#BDD-Assertions %} assertions inside of it.

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
  .and(($li) => {
    // 2 more assertions
    expect($li.get(0).textContent, 'first item').to.equal('todo a')
    expect($li.get(1).textContent, 'second item').to.equal('todo B')
  })
```

Because the second assertion `expect($li.get(0).textContent, 'first item').to.equal('todo a')` fails, the third assertion is never reached. The command fails after timing out, and the Command Log correctly shows that the first encountered assertion `should('have.length', 2)` passed, but the second assertion and the command itself failed.

{% imgTag /img/guides/retry-ability/second-assertion-fails.gif "Retrying multiple assertions" %}

# Not every command is retried

Cypress only retries commands that query the DOM: {% url `cy.get()` get %}, {% url `.find()` find %}, {% url `.contains()` contains %}, etc. You can check if a particular command is retried by looking at the "Assertions" section in its API documentation. For example, "Assertions section" of {% url `.first()` first %} tells us that the command is retried until all assertions that follow it are passing.

{% assertions existence .first %}

## Why are some commands *NOT* retried?

Commands are not retried when they could potentially change the state of the application under test. For example, Cypress will not retry the {% url '.click()' click %} command, because it could change something in the application.

{% note warning %}
Very rarely you may want to retry a command like `.click()`. We describe one case like that where the event listeners are attached to a modal popup only after a delay, the causing default events fired during `.click()` to not register. In this special case you may want to "keep clicking" until the event registers, and the dialog disappears. Read about it in the {% url "When Can the Test Click?" https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/ %} blog post.
{% endnote %}

# Built-in assertions

Often a Cypress command has built-in assertions that will cause the command to be retried. For example, the {% url `.eq()` eq %} command will be retried even without any attached assertions until it finds an element with the given index in the previously yielded list of elements.

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
  .eq(3)                    // command
```

{% imgTag /img/guides/retry-ability/eq.gif "Retrying built-in assertion" %}

Some commands that cannot be retried still have built-in _waiting_. For example, as described in the "Assertions" section of {% url "`.click()`" click %}, the `click()` command waits to click until the element becomes {% url "actionable" interacting-with-elements#Actionability %}.

Cypress tries to act like a human user would using the browser.

- Can a user click on the element?
- Is the element invisible?
- Is the element behind another element?
- Does the element have the `disabled` attribute?

The `.click()` command will automatically wait until multiple built-in assertion checks like these pass, and then it will attempt to click just once.

# Timeouts

By default each command that retries, does so for up to 4 seconds - the {% url `defaultCommandTimeout` configuration#Timeouts %} setting. You can change this timeout for _all commands_ using your configuration file, a CLI parameter, via an environment variable, or programmatically.

For example, to set the default command timeout to 10 seconds via command line:

```shell
cypress run --config defaultCommandTimeout=10000
```

See {% url 'Configuration: Overriding Options' configuration#Overriding-Options %} for other examples of overriding this option. We do not recommend changing the command timeout globally. Instead, pass the inividual command's `{ timeout: ms }` option to retry for a different period of time. For example:

```javascript
// we've modified the timeout which affects default + added assertions
cy.get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Cypress will retry for up to 10 seconds to find a visible element of class `mobile-nav` with text containing "Home". For more examples, read the {% url 'Timeouts' introduction-to-cypress#Timeouts %} section in the "Introduction to Cypress" guide.

# Only the last command is retried

Here is a short test that demonstrates some flake.

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

The test passes in Cypress without a hitch.

{% imgTag /img/guides/retry-ability/adds-two-items-passes.gif "Test passes" %}

But sometimes the test fails - not usually locally, no - it almost always fails on our continuous integration server. When the test fails, the recorded video and screenshots are NOT showing any obvious problems! Here is the failing test video:

{% imgTag /img/guides/retry-ability/adds-two-items-fails.gif "Test fails" %}

The problem looks weird - I can clearly see the label "todo B" present in the list, so why isn't Cypress finding it? What is going on?

Remember the delay we introduced into our application code that causes the test to time out? We added a 100ms delay before the UI rerenders itself.

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

This delay could be the source of our flaky tests when the application is running on our CI server. Here is how to see the source of the problem. In the Command Log, hover over each command to see which elements Cypress found at each step.

In the failing test, the first label was indeed found correctly:

{% imgTag /img/guides/retry-ability/first-item-label.png "First item label" %}

Hover over the second "FIND label" command - something is wrong here. It found the _first label_, then kept requerying to find the text "todo B", but the first item always remains "todo A".

{% imgTag /img/guides/retry-ability/second-item-label.png "Second item label" %}

Hmm, weird, why is Cypress only looking at the _first_ item? Let's hover over the "GET .todo-list li" command to inspect what _that command found_. Ohh, interesting - there was only one item at that moment.

{% imgTag /img/guides/retry-ability/second-get-li.png "Second get li" %}

During the test, the `cy.get('.todo-list li')` command quickly found the rendered `<li>` item - and that item was the first and only "todo A" item. Our application was waiting 100ms before appending the second item "todo B" to the list. By the time the second item was added, Cypress had already "moved on", working only with the first `<li>` element. It only searched for `<label>` inside the first `<li>` element, completely ignoring the newly created 2nd item.

To confirm this, let's remove the artificial delay to see what's happening in the passing test.

{% imgTag /img/guides/retry-ability/two-items.png "Two items" %}

When the web application runs without the delay, it gets its items into the DOM before the Cypress command `cy.get('.todo-list li')` runs. After the `cy.get()` returns 2 items, the `.find()` command just has to find the right label. Great.

Now that we understand the real reason behind the flaky test, we need to think about why the default retry-ability has not helped us in this situation. Why hasn't Cypress found the 2 `<li>` elements after the second one was added?

For a variety of implementation reasons, Cypress commands **only** retry the **last command** before the assertion. In our test:

```javascript
cy.get('.new-todo').type('todo B{enter}')
cy.get('.todo-list li')         // queries immediately, finds 1 <li>
  .find('label')                // retried, retried, retried with 1 <li>
  .should('contain', 'todo B')  // never succeeds with only 1st <li>
```

Luckily, once we understand how retry-ability works and how only the last command is used for assertion retries, we can fix this test for good.

## Merging queries

The first solution we recommend is to avoid unnecessarily splitting commands that query elements. In our case we first query elements using `cy.get()` and then query from that list of elements using `.find()`. We can combine two separate queries into one - forcing the combined query to be retried.

```javascript
it('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li label')   // 1 query command
    .should('contain', 'todo A')  // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li label')   // 1 query command
    .should('contain', 'todo B')  // assertion
})
```

To show the retries, I increased the application's artificial delay to 500ms. The test now always passes because the entire selector is retried. It finds 2 list elements when the second "todo B" is added to the DOM.

{% imgTag /img/guides/retry-ability/combined-selectors.gif "Combined selector" %}

Similarly, when working with deeply nested JavaScript properties using the {% url `.its()` its %} command, try not to split it across multiple calls. Instead, combine property names into a single call using the `.` separator:

```javascript
// 🛑 not recommended
// only the last "its" will be retried
cy.window()
  .its('app')             // runs once
  .its('model')           // runs once
  .its('todos')           // retried
  .should('have.length', 2)

// ✅ recommended
cy.window()
  .its('app.model.todos') // retried
  .should('have.length', 2)
```

See the {% url 'Set flag to start tests' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %} blog for the full example.

## Alternate commands and assertions

There is another way to fix our flaky test. Whenever you write a longer test, we recommend alternating commands with assertions. In this case, I will add an assertion after the `cy.get()` command, but before the `.find()` command.

```javascript
it('adds two items', function () {
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

{% imgTag /img/guides/retry-ability/alternating.png "Passing test" %}

The test passes, because the second `cy.get('.todo-list li')` is retried with its own assertion now `.should('have.length', 2)`. Only after successfully finding two `<li>` elements, the command `.find('label')` and its assertion starts, and by now, the item with correct "todo B" label has been correctly queried.

# See also

- You can add retry-ability to your own {% url "custom commands" custom-commands %}, see {% url 'this pull request to cypress-xpath' https://github.com/cypress-io/cypress-xpath/pull/12/files %} for an example.
- You can retry any function with attached assertions using this 3rd party plugin {% url cypress-pipe https://github.com/NicholasBoll/cypress-pipe %}.
- See retry-ability examples in the {% url "Cypress should callback" https://glebbahmutov.com/blog/cypress-should-callback/ %} blog post.

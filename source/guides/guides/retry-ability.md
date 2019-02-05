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

## Only the last command is retried

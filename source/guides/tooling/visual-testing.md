---
title: Visual Testing
---

Cypress is a _functional_ Test Runner. It drives the web application the way a user would, and checks if the app _functions_ as expected: if the expected message appears, or an element is removed, or a CSS class is added. A typical Cypress test for example can check if the toggled Todo item gets a class name "completed":

```js
it('completes todo', () => {
  // opens TodoMVC running at "baseUrl"
  cy.visit('/')
  cy.get('.new-todo').type('write tests{enter}')
  cy.contains('.todo-list li', 'write tests').find('.toggle').check()
  cy.contains('.todo-list li', 'write tests').should('have.class', 'completed')
})
```

The test runs and passes

{% img /img/guides/visual-testing/completed-test.gif "Passing Cypress functional test" %}

Cypress does NOT check how the page looks though. For example, Cypress does care that the CSS class "completed" grays out the label element and adds a strike-through line.

{% img /img/guides/visual-testing/completed-item.png "Completed item style" %}

Luckily, Cypress gives a stable platform for writing plugins that _can perform visual testing_. Our users have published several open source modules in {% url 'Visual Testing plugins' plugins %}, and several commercial companies have developed visual testing solutions on top of the Cypress Test Runner. Read the following tutorials to learn how to perform visual testing and diffing from your tests:

- {% url 'Testing a chart with Cypress and Applitools' https://glebbahmutov.com/blog/testing-a-chart/ %}
- {% url 'Testing how an application renders a drawing with Cypress and Percy.io' https://glebbahmutov.com/blog/testing-visually/ %}

As a general rule we advise:

- taking a snapshot for comparison after the page has performed the action. For example, if the snapshot command is `cy.mySnapshotCommand`:

```js
// BAD - the web application might take longer
// to add the new item, thus sometimes
// taking the snapshot BEFORE the new item appears
cy.get('.new-todo').type('write tests{enter}')
cy.mySnapshotCommand()

// GOOD - use a functional assertion to ensure
// the web application has re-rendered the page
cy.get('.new-todo').type('write tests{enter}')
cy.contains('.todo-list li', 'write tests')
// great, the new item is displayed,
// now we can take the snapshot
cy.mySnapshotCommand()
```

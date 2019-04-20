---
title: Visual Testing
---

## Functional vs visual testing

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

Someone could accidentally remove the CSS style ".todo-list li.completed label", changing the application and its usability - and the functional test would never warn you.

Luckily, Cypress gives a stable platform for writing plugins that _can perform visual testing_. Typically such plugins take an image snapshot of the entire application or a specific element, and then compare the image to a previously approved baseline image. If the images are the same (within pixel tolerance), the web application looks the same to the user. If there are differences, then there is some change in the DOM layout, fonts, colors or other visual properties that needs to be investigated.

For example one can use {% url 'cypress-plugin-snapshots' https://github.com/meinaart/cypress-plugin-snapshots %} plugin and catch the following visual regression:

```css
.todo-list li.completed label {
	color: #d9d9d9;
  /* removed the line-through */
}
```

```js
it('completes todo', () => {
  // opens TodoMVC running at "baseUrl"
  cy.visit('/')
  cy.get('.new-todo').type('write tests{enter}')
  cy.contains('.todo-list li', 'write tests')
    .find('.toggle')
    .check()
  cy.contains('.todo-list li', 'write tests')
    .should('have.class', 'completed')
  // capture the element screenshot and
  // compare to the baseline image
  cy.get('.todoapp').toMatchImageSnapshot({
    threshold: 0.001,
  })
})
```

This open source plugin shows the baseline and the current images side by side if pixel difference is above the threshold; notice how the baseline image has the label text with line through, while the new image does not have it.

{% img /img/guides/visual-testing/diff.png "Baseline vs current image" %}

Like most image comparison tools, the plugin shows a difference view on mouse hover:

{% img /img/guides/visual-testing/diff-2.png "Highlighted changes" %}

## Tooling

Our users have published several open source modules, listed on the [Visual Testing plugins](https://on.cypress.io/plugins#visual-testing) page, and several commercial companies have developed visual testing solutions on top of the Cypress Test Runner. Read the following tutorials to learn how to perform visual testing and diffing from your tests:

### Applitools

- {% url 'Testing a chart with Cypress and Applitools' https://glebbahmutov.com/blog/testing-a-chart/ %}
- {% url 'Applitools Cypress documentation' https://applitools.com/cypress %}

### Percy.io

- {% url 'Cypress.io + Percy = End-to-end functional and visual testing for the web' https://www.cypress.io/blog/2019/04/19/webinar-recording-cypress-and-percy-end-to-end-functional-and-visual-testing-for-the-web/ %} webinar blog post and watch the {% url 'webinar video' https://www.youtube.com/watch?v=MXfZeE9RQDw %}. The companion slides can be found {% url here https://slides.com/bahmutov/visual-testing-with-percy %}. You can find the entire project with tests and visual setup at {% url cypress-io/angular-pizza-creator https://github.com/cypress-io/angular-pizza-creator %}.
- {% url 'Testing how an application renders a drawing with Cypress and Percy.io' https://glebbahmutov.com/blog/testing-visually/ %} blog post.
- {% url 'Percy.io Cypress documentation' https://docs.percy.io/docs/cypress %}

## Best practices

As a general rule we advise:

- to take a snapshot after the page has finished changing after actions. The test itself should confirm this using an assertion. For example, if the snapshot command is `cy.mySnapshotCommand`:

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

- control the timestamp inside the application

```js
// GOOD - freeze the system time to Jan 1, 2018 using "cy.clock"
const now = new Date(2018, 1, 1)

cy.clock(now)
// ... test
cy.mySnapshotCommand()
```

- use {% url 'data fixtures' fixture %} and network mocking to set the application to the same state

```js
// GOOD - use stubbed network calls
cy.server()
cy.route('/api/users', 'fixture:users')
cy.route('/api/items', 'fixture:items')
// ... test
cy.mySnapshotCommand()
```

- consider using visual diffing to check individual elements rather than the entire page. This will target the image comparison better to avoid the visual change for component X from breaking tests for the unrelated components.

- you might want to look at the {% url "Component Testing plugins" plugins %} to load and test the individual components in addition to the regular end-to-end functional and visual tests.

- consider the development costs of implementing the visual testing yourself vs using an external 3rd party provider. Storing, reviewing and analyzing image differences are non-trivial tasks, and they quickly becomes a chore when going with a DIY solution.

## See also

- "Visual Testing" section in the {% url recipes recipes %} page
- [`cy.screenshot`](https://on.cypress.io/screenshot)

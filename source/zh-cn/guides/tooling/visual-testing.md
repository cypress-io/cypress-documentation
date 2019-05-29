---
title: Visual Testing
---

Cypress is a _functional_ Test Runner. It drives the web application the way a user would, and checks if the app _functions_ as expected: if the expected message appears, an element is removed, or a CSS class is added after the appropriate user action. A typical Cypress test, for example, can check if a toggled "Todo" item gets a class of "completed" after the `.toggle` is checked:

```js
it('completes todo', () => {
  // opens TodoMVC running at "baseUrl"
  cy.visit('/')
  cy.get('.new-todo').type('write tests{enter}')
  cy.contains('.todo-list li', 'write tests')
    .find('.toggle').check()
  cy.contains('.todo-list li', 'write tests')
    .should('have.class', 'completed')
})
```

{% imgTag /img/guides/visual-testing/completed-test.gif "Passing Cypress functional test" %}

Cypress does NOT see how the page actually looks though. For example, Cypress will not see if the CSS class `completed` grays out the label element and adds a strike-through line.

{% imgTag /img/guides/visual-testing/completed-item.png "Completed item style" %}

You could technically write a functional test asserting the CSS properties using the {% url "`have.css` assertion" assertions#CSS %}, but these may quickly become cumbersome to write and maintain, especially when visual styles rely on a lot of CSS styles.

```js
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')
cy.get('.completed').should('have.css', 'color', 'rgb(217,217,217)')
```

Your visual styles may also rely on more than just CSS, perhaps you want to ensure an SVG or image has rendered correctly or shapes were correctly drawn to a canvas.

Luckily, Cypress gives a stable platform for {% url "writing plugins" plugins-guide %} that _can perform visual testing_.

Typically such plugins take an image snapshot of the entire application under test or a specific element, and then compare the image to a previously approved baseline image. If the images are the same (within a set pixel tolerance), it is determined that the web application looks the same to the user. If there are differences, then there has been some change to the DOM layout, fonts, colors or other visual properties that needs to be investigated.

For example, one can use the {% url 'cypress-plugin-snapshots' https://github.com/meinaart/cypress-plugin-snapshots %} plugin and catch the following visual regression:

```css
.todo-list li.completed label {
  color: #d9d9d9;
  /* removed the line-through */
}
```

```js
it('completes todo', () => {
  cy.visit('/')
  cy.get('.new-todo').type('write tests{enter}')
  cy.contains('.todo-list li', 'write tests')
    .find('.toggle')
    .check()
  cy.contains('.todo-list li', 'write tests')
    .should('have.class', 'completed')
  // run 'npm i cypress-plugin-snapshots -S'
  // capture the element screenshot and
  // compare to the baseline image
  cy.get('.todoapp').toMatchImageSnapshot({
    threshold: 0.001,
  })
})
```

This open source plugin compares the baseline and the current images side by side within the Cypress Test Runner if pixel difference is above the threshold; notice how the baseline image (*Expected result*) has the label text with the line through, while the new image (*Actual result*) does not have it.

{% imgTag /img/guides/visual-testing/diff.png "Baseline vs current image" %}

Like most image comparison tools, the plugin also shows a difference view on mouse hover:

{% imgTag /img/guides/visual-testing/diff-2.png "Highlighted changes" %}

# Tooling

There are several published, open source plugins, listed in the {% url "Visual Testing plugins" plugins#visual-testing %} section, and several commercial companies have developed visual testing solutions on top of the Cypress Test Runner listed below.

## Open source

Listed in the {% url "Visual Testing plugins" plugins#visual-testing %} section.

## Applitools

{% fa fa-external-link %} {% url "https://applitools.com" https://applitools.com/ %}

Resource |  Description
------- |  ----
{% url 'Official docs' https://applitools.com/cypress %} | Applitools' Cypress documentation
{% url 'Tutorial' https://applitools.com/tutorials/cypress.html#how-it-works %} | Applitools' Cypress tutorial
{% url 'Webinar' https://applitools.com/blog/cypress-applitools-end-to-end-testing %} | *Creating a Flawless User Experience, End-to-End, Functional to Visual – Practical Hands-on Session*, a webinar recorded together with Cypress and Applitools
{% url 'Blog' https://glebbahmutov.com/blog/testing-a-chart/ %} | Testing a chart with Cypress and Applitools

## Percy

{% fa fa-external-link %} {% url "https://percy.io" https://percy.io/ %}

Resource |  Description
------- |  ----
{% url 'Official docs' https://docs.percy.io/docs/cypress %} | Percy's Cypress documentation
{% url 'Tutorial'  https://docs.percy.io/docs/cypress-tutorial %} | Percy's Cypress tutorial
{% url "Webinar" https://www.youtube.com/watch?v=MXfZeE9RQDw %} | *Cypress + Percy = End-to-end functional and visual testing for the web*, a webinar recorded together with Cypress and Percy.io
{% url "Blog" https://www.cypress.io/blog/2019/04/19/webinar-recording-cypress-and-percy-end-to-end-functional-and-visual-testing-for-the-web/ %} | The companion blog for the Cypress + Percy webinar
{% url "Slides" https://slides.com/bahmutov/visual-testing-with-percy %} | The companion slides for the Cypress + Percy webinar
{% url "Blog" https://glebbahmutov.com/blog/testing-visually/ %} | Testing how an application renders a drawing with Cypress and Percy

## Do It Yourself

Even if you decide to skip using a 3rd party image storage and comparison service, you can still perform visual testing. Follow the example {% url "Visual Regression testing with Cypress.io and cypress-image-snapshot" https://medium.com/norwich-node-user-group/visual-regression-testing-with-cypress-io-and-cypress-image-snapshot-99c520ccc595 %} tutorial and do it all yourself.

{% note warning %}
You will want to consider the development costs of implementing a visual testing tool yourself versus using an external 3rd party provider. Storing, reviewing and analyzing image differences are non-trivial tasks and they can quickly become a chore when going with a DIY solution.
{% endnote %}

# Best practices

As a general rule there are some best practices when visual testing.

## DOM state


{% note success %}
{% fa fa-check-circle green %} **Best Practice:** Take a snapshot after you confirm the page is done changing.
{% endnote %}

For example, if the snapshot command is `cy.mySnapshotCommand`:

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```js
// the web application takes time to add the new item,
// sometimes it takes the snapshot BEFORE the new item appears
cy.get('.new-todo').type('write tests{enter}')
cy.mySnapshotCommand()
```

**{% fa fa-check-circle green %} Correct Usage**

```js
// use a functional assertion to ensure
// the web application has re-rendered the page
cy.get('.new-todo').type('write tests{enter}')
cy.contains('.todo-list li', 'write tests')
// great, the new item is displayed,
// now we can take the snapshot
cy.mySnapshotCommand()
```

## Timestamps

{% note success %}
{% fa fa-check-circle green %} **Best Practice:** Control the timestamp inside the application under test.
{% endnote %}

Below we freeze the operating system's time to `Jan 1, 2018` using {% url "`cy.clock()`" clock %} to ensure all images displaying dates and times match.

```js
const now = new Date(2018, 1, 1)

cy.clock(now)
// ... test
cy.mySnapshotCommand()
```

## Application state

{% note success %}
{% fa fa-check-circle green %} **Best Practice:** Use {% url "`cy.fixture()`" fixture %} and network mocking to set the application state.
{% endnote %}

Below we stub network calls using {% url "`cy.route()`" route %} to return the same response data for each XHR request. This ensures that the data displayed in our application images does not change.

```js
cy.server()
cy.route('/api/items', 'fixture:items').as('getItems')
// ... action
cy.wait('@getUsers')
cy.mySnapshotCommand()
```

## Visual diff elements

{% note success %}
{% fa fa-check-circle green %} **Best Practice:** Use visual diffing to check individual DOM elements rather than the entire page.
{% endnote %}

Targeting specific DOM element will help avoid visual changes from component "X" breaking tests in other unrelated components.

## Component testing

{% note success %}
{% fa fa-check-circle green %} **Best Practice:** Use {% url "Component Testing plugins" plugins %} to test the individual components functionality in addition to end-to-end and visual tests.
{% endnote %}

# See also

- {% url "After Screenshot API" after-screenshot-api %}
- {% url "`cy.screenshot()`" screenshot %}
- {% url "`Cypress.Screenshot`" screenshot-api %}
- {% url "Plugins" plugins-guide %}
- {% url "Visual Testing Plugins" plugins#visual-testing %}
- {% url "Writing a Plugin" writing-a-plugin %}

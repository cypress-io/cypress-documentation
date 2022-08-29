---
title: Visual Testing
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How visual testing complements functional testing
- How to implement visual diffing yourself or using 3rd party service
- How to ensure the application is in consistent state before capturing an image

</Alert>

## Functional vs visual testing

Cypress is a _functional_ test runner. It drives the web application the way a
user would, and checks if the app _functions_ as expected: if the expected
message appears, an element is removed, or a CSS class is added after the
appropriate user action. A typical Cypress test, for example, can check if a
toggled "Todo" item gets a class of "completed" after the `.toggle` is checked:

<e2e-or-ct>
<template #e2e>

```js
it('completes todo', () => {
  cy.visit('/') // opens TodoMVC running at "baseUrl"
  cy.get('.new-todo').type('write tests{enter}')
  cy.contains('.todo-list li', 'write tests').find('.toggle').check()

  cy.contains('.todo-list li', 'write tests').should('have.class', 'completed')
})
```

</template>
<template #ct>

```js
it('completes todo', () => {
  cy.mount(<Todos />)
  cy.get('.new-todo').type('write tests{enter}')
  cy.contains('.todo-list li', 'write tests').find('.toggle').check()

  cy.contains('.todo-list li', 'write tests').should('have.class', 'completed')
})
```

</template>
</e2e-or-ct>

<DocsImage src="/img/guides/visual-testing/completed-test.gif" alt="Passing Cypress functional test" ></DocsImage>

Cypress does NOT see how the page actually looks though. For example, Cypress
will not see if the CSS class `completed` grays out the label element and adds a
strike-through line.

<DocsImage src="/img/guides/visual-testing/completed-item.png" alt="Completed item style" ></DocsImage>

You could technically write a functional test asserting the CSS properties using
the [`have.css` assertion](/guides/references/assertions#CSS), but these may
quickly become cumbersome to write and maintain, especially when visual styles
rely on a lot of CSS styles.

```js
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')
cy.get('.completed').should('have.css', 'color', 'rgb(217,217,217)')
```

Your visual styles may also rely on more than CSS, perhaps you want to ensure an
SVG or image has rendered correctly or shapes were correctly drawn to a canvas.

Luckily, Cypress gives a stable platform for
[writing plugins](/guides/tooling/plugins-guide) that _can perform visual
testing_.

Typically such plugins take an image snapshot of the entire application under
test or a specific element, and then compare the image to a previously approved
baseline image. If the images are the same (within a set pixel tolerance), it is
determined that the web application looks the same to the user. If there are
differences, then there has been some change to the DOM layout, fonts, colors or
other visual properties that needs to be investigated.

For example, one can use the
[cypress-plugin-snapshots](https://github.com/meinaart/cypress-plugin-snapshots)
plugin and catch the following visual regression:

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
  cy.contains('.todo-list li', 'write tests').find('.toggle').check()

  cy.contains('.todo-list li', 'write tests').should('have.class', 'completed')

  // run 'npm i cypress-plugin-snapshots -S'
  // capture the element screenshot and
  // compare to the baseline image
  cy.get('.todoapp').toMatchImageSnapshot({
    imageConfig: {
      threshold: 0.001,
    },
  })
})
```

This open source plugin compares the baseline and the current images side by
side if pixel difference is above the threshold; notice how the baseline image
(_Expected result_) has the label text with the line through, while the new
image (_Actual result_) does not have it.

<DocsImage src="/img/guides/visual-testing/diff.png" alt="Baseline vs current image" ></DocsImage>

Like most image comparison tools, the plugin also shows a difference view on
mouse hover:

<DocsImage src="/img/guides/visual-testing/diff-2.png" alt="Highlighted changes" ></DocsImage>

## Tooling

There are several published, open source plugins, listed in the
[Visual Testing plugins](/plugins/directory#visual-testing) section, and several
commercial companies have developed visual testing solutions on top of Cypress
listed below.

### Open source

Listed in the [Visual Testing plugins](/plugins/directory#Visual%20Testing)
section.

### Applitools

First joint webinar with Applitools

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/qVRjhABuyG0"></DocsVideo>

<!-- textlint-enable -->

Second joint webinar with Applitools with a focus on
[Component Testing](/guides/core-concepts/testing-types#What-is-Component-Testing)

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/Bxh_ebMk1aM"></DocsVideo>

<!-- textlint-enable -->

<Icon name="external-link-alt"></Icon>
[https://applitools.com](https://applitools.com/)

| Resource                                                                     | Description                                                                                                                                                   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Official docs](https://applitools.com/cypress)                              | Applitools' Cypress documentation                                                                                                                             |
| [Tutorial](https://applitools.com/tutorials/cypress.html)                    | Applitools' Cypress tutorial                                                                                                                                  |
| [Webinar](https://applitools.com/blog/cypress-applitools-end-to-end-testing) | _Creating a Flawless User Experience, End-to-End, Functional to Visual – Practical Hands-on Session_, a webinar recorded together with Cypress and Applitools |
| [Blog](https://glebbahmutov.com/blog/testing-a-chart/)                       | Testing a chart with Cypress and Applitools                                                                                                                   |

### Percy

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/MXfZeE9RQDw"></DocsVideo>

<!-- textlint-enable -->

<Icon name="external-link-alt"></Icon> [https://percy.io](https://percy.io/)

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
the `cy.percySnapshot()` command provided by the
[Cypress Percy plugin](https://github.com/percy/percy-cypress) to take visual
snapshots throughout the user journey end-to-end tests

Check out the
[Real World App test suites](https://github.com/cypress-io/cypress-realworld-app/tree/develop/cypress/tests/ui)
to see these Percy and Cypress in action.

</Alert>

| Resource                                                                                                                                | Description                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [Official docs](https://docs.percy.io/docs/cypress)                                                                                     | Percy's Cypress documentation                                                                                                   |
| [Tutorial](https://docs.percy.io/docs/cypress-tutorial)                                                                                 | Percy's Cypress tutorial                                                                                                        |
| [Webinar](https://www.youtube.com/watch?v=MXfZeE9RQDw)                                                                                  | _Cypress + Percy = End-to-end functional and visual testing for the web_, a webinar recorded together with Cypress and Percy.io |
| [Blog](https://www.cypress.io/blog/2019/04/19/webinar-recording-cypress-io-percy-end-to-end-functional-and-visual-testing-for-the-web/) | The companion blog for the Cypress + Percy webinar                                                                              |
| [Slides](https://slides.com/bahmutov/visual-testing-with-percy)                                                                         | The companion slides for the Cypress + Percy webinar                                                                            |
| [Blog](https://glebbahmutov.com/blog/testing-visually/)                                                                                 | Testing how an application renders a drawing with Cypress and Percy                                                             |

### Happo

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/C_p12IvN5HU"></DocsVideo>

<!-- textlint-enable -->

<Icon name="external-link-alt"></Icon> [https://happo.io/](https://happo.io/)

| Resource                                                                             | Description                                                                                                                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [Official docs](https://docs.happo.io/docs/cypress)                                  | Happo's Cypress documentation                                                                                                               |
| [Webinar](https://www.youtube.com/watch?v=C_p12IvN5HU)                               | _Keep your UI Sharp: Ensuring Functional and Visual Quality with Cypress.io + Happo.io_, a webinar recorded together with Cypress and Happo |
| [Blog](https://www.cypress.io/blog/2020/05/27/webcast-recording-keep-your-ui-sharp/) | The companion blog for the Cypress + Happo webinar                                                                                          |
| [Slides](https://cypress.slides.com/cypress-io/cypress-and-happo)                    | The companion slides for the Cypress + Happo webinar                                                                                        |

### Do It Yourself

Even if you decide to skip using a 3rd party image storage and comparison
service, you can still perform visual testing. Follow these examples

- [Visual Regression testing with Cypress and cypress-image-snapshot](https://medium.com/norwich-node-user-group/visual-regression-testing-with-cypress-io-and-cypress-image-snapshot-99c520ccc595)
  tutorial.
- [Visual testing for React components using open source tools](https://glebbahmutov.com/blog/open-source-visual-testing-of-components/)
  with companion
  [videos](https://www.youtube.com/playlist?list=PLP9o9QNnQuAYhotnIDEUQNXuvXL7ZmlyZ).

<Alert type="warning">

You will want to consider the development costs of implementing a visual testing
tool yourself versus using an external 3rd party provider. Storing, reviewing
and analyzing image differences are non-trivial tasks and they can quickly
become a chore when going with a DIY solution.

</Alert>

## Best practices

As a general rule there are some best practices when visual testing.

### Recognize the need for visual testing

**<Icon name="exclamation-triangle" color="red"></Icon> assertions that verify
style properties**

```js
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')
  .and('have.css', 'color', 'rgb(217,217,217)')
cy.get('.user-info').should('have.css', 'display', 'none')
...
```

If your end-to-end tests become full of assertions checking visibility, color
and other style properties, it might be time to start using visual diffing to
verify the page appearance.

### DOM state

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Take a
snapshot after you confirm the page is done changing.

</Alert>

For example, if the snapshot command is `cy.mySnapshotCommand`:

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```js
// the web application takes time to add the new item,
// sometimes it takes the snapshot BEFORE the new item appears
cy.get('.new-todo').type('write tests{enter}')
cy.mySnapshotCommand()
```

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
// use a functional assertion to ensure
// the web application has re-rendered the page
cy.get('.new-todo').type('write tests{enter}')
cy.contains('.todo-list li', 'write tests')
// great, the new item is displayed,
// now we can take the snapshot
cy.mySnapshotCommand()
```

### Timestamps

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Control the
timestamp inside the application under test.

</Alert>

Below we freeze the operating system's time to `Jan 1, 2018` using
[cy.clock()](/api/commands/clock) to ensure all images displaying dates and
times match.

```js
const now = new Date(2018, 1, 1)

cy.clock(now)
// ... test
cy.mySnapshotCommand()
```

### Application state

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Use
[cy.fixture()](/api/commands/fixture) and network mocking to set the application
state.

</Alert>

Below we stub network calls using [cy.intercept()](/api/commands/intercept) to
return the same response data for each XHR request. This ensures that the data
displayed in our application images does not change.

```js
cy.intercept('/api/items', { fixture: 'items' }).as('getItems')
// ... action
cy.wait('@getItems')
cy.mySnapshotCommand()
```

### Visual diff elements

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Use visual
diffing to check individual DOM elements rather than the entire page.

</Alert>

Targeting specific DOM element will help avoid visual changes from component "X"
breaking tests in other unrelated components.

### Component testing

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Use
[Component Testing plugins](/plugins/directory) to test the individual
components functionality in addition to end-to-end and visual tests.

</Alert>

If you are working on React components, read
[Visual testing for React components using open source tools](https://glebbahmutov.com/blog/open-source-visual-testing-of-components/),
browse [slides](https://slides.com/bahmutov/i-see-what-is-going-on), and watch
the
[companion videos](https://www.youtube.com/playlist?list=PLP9o9QNnQuAYhotnIDEUQNXuvXL7ZmlyZ).

## See also

- [After Screenshot API](/api/plugins/after-screenshot-api)
- [cy.screenshot()](/api/commands/screenshot)
- [Cypress.Screenshot](/api/cypress-api/screenshot-api)
- [Plugins](/guides/tooling/plugins-guide)
- [Visual Testing Plugins](/plugins/directory#visual-testing)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
- <Icon name="github"></Icon>
  [Cypress Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app)
  is a full stack example application that demonstrates **best practices and
  scalable strategies with Cypress in practical and realistic scenarios**.
- Read the blog post
  [Debug a Flaky Visual Regression Test](https://www.cypress.io/blog/2020/10/02/debug-a-flaky-visual-regression-test/)
- Read the blog post
  [Canvas Visual Testing with Retries](https://glebbahmutov.com/blog/canvas-testing/)

---
title: Debugging
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How Cypress runs in the same event loop with your code, keeping debugging less demanding and more understandable
- How Cypress embraces the standard Developer Tools
- How and when to use `debugger` and the shorthand {% url `.debug()` debug %} command
{% endnote %}

# Using `debugger`

Your Cypress test code runs in the same run loop as your application. This means you have access to the code running on the page, as well as the things the browser makes available to you, like `document`, `window`, and `debugger`.

## Debug just like you always do

Based on those statements, you might be tempted to throw a `debugger` into your test, like so:

```js
it('let me debug like a fiend', () => {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')

  debugger // Doesn't work
})
```

This may not work exactly as you are expecting. As you may remember from the {% url "Introduction to Cypress" introduction-to-cypress %}, `cy` commands enqueue an action to be taken later. Can you see what the test above will do given that perspective?

Both {% url `cy.visit()` visit %} and {% url `cy.get()` get %} will return immediately, having enqueued their work to be done later, and `debugger` will be executed before any of the commands have actually run.

Let's use {% url `.then()` then %} to tap into the Cypress command during execution and add a `debugger` at the appropriate time:

```js
it('let me debug when the after the command executes', () => {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')
    .then(($selectedElement) => {
      // Debugger is hit after the cy.visit
      // and cy.get command have completed
      debugger
    })
})
```

Now we're in business! The first time through, {% url `cy.visit()` visit %} and the {% url `cy.get()` get %} chain (with its {% url `.then()` then %} attached) are enqueued for Cypress to execute. The `it` block exits, and Cypress starts its work:

1. The page is visited, and Cypress waits for it to load.
2. The element is queried, and Cypress automatically waits and retries for a few moments if it isn't found immediately.
3. The function passed to {% url `.then()` then %} is executed, with the found element yielded to it.
4. Within the context of the {% url `.then()` then %} function, the `debugger` is called, halting the browser and calling focus to the Developer Tools.
5. You're in! Inspect the state of your application like you normally would if you'd dropped the `debugger` into your application code.

## Using {% url `.debug()` debug %}

Cypress also exposes a shortcut for debugging commands, {% url `.debug()` debug %}. Let's rewrite the test above using this helper method:

```js
it('let me debug like a fiend', () => {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')
    .debug()
})
```

The current subject that is yielded by the {% url `cy.get()` get %} is exposed as the variable `subject` within your Developer Tools so that you can interact with it in the console.

{% imgTag /img/guides/debugging-subject.png "Debugging Subject" %}

Use {% url `.debug()` debug %} to quickly inspect any (or many!) part(s) of your application during the test. You can attach it to any Cypress chain of commands to have a look at the system's state at that moment.

# Step through test commands

You can run the test command by command using the {% url `.pause()` pause %} command.

```javascript
it('adds items', () => {
  cy.pause()
  cy.get('.new-todo')
  // more commands
})
```

This allows you to inspect the web application, the DOM, the network, and any storage after each command to make sure everything happens as expected.

# Using the Developer Tools

Though Cypress has built out {% url "an excellent Test Runner" test-runner %} to help you understand what is happening in your application and your tests, there's no replacing all the amazing work browser teams have done on their built-in development tools. Once again, we see that Cypress goes _with_ the flow of the modern ecosystem, opting to leverage these tools wherever possible.

{% note info %}
## {% fa fa-video-camera %} See it in action!

You can see a walk-through of debugging some application code from Cypress {% url "in this segment from our React tutorial series" https://vimeo.com/242961930#t=264s %}.
{% endnote %}

## Get console logs for commands

All of Cypress's commands, when clicked on within the {% url "Command Log" test-runner#Command-Log %}, print extra information about the command, its subject, and its yielded result. Try clicking around the Command Log with your Developer Tools open! You may find some useful information here.

### When clicking on `.type()` command, the Developer Tools console outputs the following:

{% imgTag /img/api/type/console-log-of-typing-with-entire-key-events-table-for-each-character.png "Console Log type" %}

# Errors

Sometimes tests fail. Sometimes we want them to fail, just so we know they're testing the right thing when they pass. But other times, tests fail unintentionally and we need to figure out why. Cypress provides some tools to help make that process as easy as possible.

## Anatomy of an error

Let's take a look at the anatomy of an error and how it is displayed in Cypress, by way of a failing test.

```js
it('reroutes on users page', () => {
  cy.contains('Users').click()
  cy.url().should('include', 'users')
})
```

The center of the `<li>Users</li>` element is hidden from view in our application under test, so the test above will fail. Within Cypress, an error will show on failure that includes the following pieces of information:

{% partial errors_anatomy %}

## Source maps

Cypress utilizes source maps to enhance the error experience. Stack traces are translated so that your source files are shown instead of the generated file that is loaded by the browser. This also enables displaying code frames. Without inline source maps, you will not see code frames.

By default, Cypress will include an inline source map in your spec file, so you will get the most out of the error experience. If you {% url "modify the preprocessor" preprocessors-api %}, ensure that inline source maps are enabled to get the same experience. With webpack and the {% url "webpack preprocessor" https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor %}, for example, set {% url "the `devtool` option" https://webpack.js.org/configuration/devtool/ %} to `inline-source-map`.

# Debugging flake

While Cypress is {% url "flake-resistant" key-differences#Flake-resistant %}, some users do experience flake, particularly when running in CI versus locally. Most often in cases of flaky tests, we see that there are not enough assertions surrounding test actions or network requests before moving on to the next assertion.

If there is any variation in the speed of the network requests or responses when run locally versus in CI, then there can be failures in one over the other.

Because of this, we recommend asserting on as many required steps as possible before moving forward with the test. This also helps later to isolate where the exact failure is when debugging.

Flake can also occur when there are differences between your local and CI environments. You can use the following methods troubleshoot tests that pass locally but fail in CI.

- Review your CI build process to ensure nothing is changing with your application that would result in failing tests.
- Remove time-sensitive variability in your tests. For example, ensure a network request has finished before looking for the DOM element that relies on the data from that network request. You can leverage {% url "aliasing" variables-and-aliases#Aliases %} for this.

The Cypress Dashboard also offers {% url "Analytics" analytics %} that illustrate trends in your tests and can help identify the tests that fail most often. This could help narrow down what is causing the flake -- for example, seeing increased failures after a change to the test environment could indicate issues with the new environment.

For more advice on dealing with flake read a {% url "series of our blog posts" https://cypress.io/blog/tag/flake/ %} and {% url "Identifying Code Smells in Cypress" https://codingitwrong.com/2020/10/09/identifying-code-smells-in-cypress.html %} by {% url "Cypress Ambassador" https://www.cypress.io/ambassadors/ %} Josh Justice.

# Log Cypress events

Cypress emits multiple events you can listen to as shown below. {% url 'Read more about logging events in the browser here' catalog-of-events#Logging-All-Events %}.

{% imgTag /img/api/catalog-of-events/console-log-events-debug.png "console log events for debugging" %}

# Run Cypress command outside the test

If you need to run a Cypress command straight from the Developer Tools console, you can use the internal command `cy.now('command name', ...arguments)`. For example, to run the equivalent of `cy.task('database', 123)` outside the normal execution command chain:

```javascript
cy.now('task', 123)
  .then(console.log)
// runs cy.task(123) and prints the resolved value
```

{% note warning %}
The `cy.now()` command is an internal command and may change in the future.
{% endnote %}

# Cypress fiddle

While learning Cypress it may be a good idea to try small tests against some HTML. We have written a {% url @cypress/fiddle https://github.com/cypress-io/cypress-fiddle %} plugin for this. It can quickly mount any given HTML and run some Cypress test commands against it.

# Troubleshooting Cypress

There are times when you will encounter errors or unexpected behavior with Cypress itself. In this situation, we recommend checking out our {% url "Troubleshooting Guide" troubleshooting %}.

# More info

Often debugging a failing Cypress test means understanding better how your own application works, and how the application might race against the test commands. We recommend reading these blog posts where we show common error scenarios and how to solve them:

- {% url "When Can The Test Start?" https://www.cypress.io/blog/2018/02/05/when-can-the-test-start/ %}
- {% url "When Can The Test Stop?" https://www.cypress.io/blog/2020/01/16/when-can-the-test-stop/ %}
- {% url "When Can The Test Click?" https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/ %}
- {% url "When Can The Test Log Out?" https://www.cypress.io/blog/2020/06/25/when-can-the-test-log-out/ %}
- {% url "Do Not Get Too Detached" https://www.cypress.io/blog/2020/07/22/do-not-get-too-detached/ %}

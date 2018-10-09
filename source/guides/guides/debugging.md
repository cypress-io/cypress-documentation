---
title: Debugging
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How Cypress runs in the runloop with your code, keeping debugging simple and understandable for modern web developers
- How Cypress embraces the standard DevTools
- How and when to use `debugger` and the shorthand {% url `.debug()` debug %} command
{% endnote %}

# Using `debugger`

Your Cypress test code runs in the same run loop as your application. This means we have access to variables and the code running on the page, as well as the things the browser makes available to you, like `document`, `window`, and, of course, `debugger`.

## Debug Just Like You Always Do... _Almost_

Based on those statements, you might be tempted to just throw a `debugger` into your test, like so:

```js
it('let me debug like a fiend', function() {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')

  debugger // Doesn't work
})
```

...alas, this will not work. As you may remember from {% url "Introduction to Cypress" introduction-to-cypress %}, `cy.*` commands simply enqueue an action to be taken later. Can you see what this test will do given that perspective? {% url "`cy.visit()`" visit %} and {% url `cy.get()` get %} will both return immediately, having enqueued their work to be done later, and `debugger` will be executed before anything has happened.

Let's use {% url `.then()` then %} to tap into the Cypress command flow and execute `debugger` at the appropriate time:

```js
it('let me debug like a fiend', function() {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')
    .then(($selectedElement) => {
      debugger // Works like you think!
    })
})
```

Now we're in business! The first time through, {% url `cy.visit()` visit %} and the {% url `cy.get()` get %} chain (with its {% url `.then()` then %} attached) are enqueued for Cypress to execute. The `it` block exits, and Cypress starts its work:

1. The page is visited, and Cypress waits for it to load.
2. The element is selected, and Cypress automatically waits and retries for a few moments if it isn't found immediately.
3. The function passed to {% url `.then()` then %} is executed, with the found element yielded to it.
4. Within the context of this function, `debugger` is called, halting the browser and focusing on the DevTools.
5. You're in! Inspect the state of your application like you normally would if you'd dropped the `debugger` into your application code.

## Using {% url `.debug()` debug %}

But that's a lot of typing just to call `debugger` in context, yeah? Cypress exposes a shortcut for this, {% url `.debug()` debug %}. Let's rewrite the test using this helper method:

```js
it('let me debug like a fiend', function() {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')
    .debug()
})
```

Ah, that's better! And functionally equivalent. The current subject that was yielded by the {% url `cy.get()` get %} is exposed as `subject` so that you can interact with it in the console.

{% img /img/guides/debugging-subject.png "Debugging Subject" %}

This is just another example of how Cypress seeks elegance and expressivity for the modern web tester. Fewer keystrokes, more power, don't break standard assumptions, and we all win.

Use {% url `.debug()` debug %} to quickly inspect any (or many!) part(s) of your application during the test. You can attach it to any Cypress chain of commands to have a look at the system state at that moment.

# Using the DevTools

Though Cypress has built out {% url "an excellent Test Runner" test-runner %} to help you understand what is happening in your app and your tests, there's simply no replacing all the amazing work browser teams have done on their built-in development tools. Once again, we see that Cypress goes _with_ the flow of the modern ecosystem, opting to leverage these tools wherever possible.

{% note info %}
## {% fa fa-video-camera %} See it in action!

You can see a walk-through of debugging some application code from Cypress {% url "in this segment from our React tutorial series" https://vimeo.com/242961930#t=264s %}.

{% endnote %}

<!-- TODO: show how clicking commands populates the dev tools, demonstrate a few commands -->

# Debug the Command Line

Cypress is built using the {% url 'debug' https://github.com/visionmedia/debug %} module. That means you can receive helpful debugging output by running Cypress with this turned on.

**On Mac or Linux:**

```shell
DEBUG=cypress:* cypress open
```

**On Windows:**

```shell
set DEBUG=cypress:*
```

{% url 'Read more about the CLI options here' command-line#Debugging-commands %}.

# Debug the Browser Driver

When Cypress is running in your browser, you can have every event it fires logged out to the console.

{% url 'Read more about logging events in the browser here' catalog-of-events#Logging-All-Events %}.

---
title: 条件付きテスト
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- When conditional testing is a good choice for your tests
- Situations where conditional testing is impossible
- Strategies to handle common scenarios of conditional testing
{% endnote %}

# Definition

Conditional testing refers to the common programming pattern:

> If X, then Y, else Z

Many of our users ask how to accomplish this seemingly simple idiom in Cypress.

Here are some example use cases:

- How do I do something different whether an element does or doesn't exist?
- My application does A/B testing, how do I account for that?
- My users receive a "welcome wizard", but existing ones don't. Can I always close the wizard in case it's shown, and ignore it when it's not?
- Can I recover from failed Cypress commands like if a {% url "`cy.get()`" get %} doesn't find an element?
- I am trying to write dynamic tests that do something different based on the text on the page.
- I want to automatically find all `<a>` elements and based on which ones I find, I want to check that each link works.

The problem is - while first appearing simple, writing tests in this fashion often leads to flaky tests, random failures, and difficult to track down edge cases.

Let's investigate why and how you can overcome these problems...

# The problem

These days modern JavaScript applications are highly dynamic and mutable. Their state and the DOM are continuously changing over a period of time.

The problem with **conditional testing** is that it can only be used when the state has stabilized. In modern day applications, knowing when state is stable is oftentimes impossible.

To a human - if something changes 10ms or 100ms from now, we may not even notice this change and assume the state was always the same.

To a robot - even 10ms represents billions+ of clock cycles. The timescale difference is incredible.

A human also has intuition. If you click a button and see a loading spinner, you will assume the state is in flux and will automatically wait for it to finish.

A robot has no intuition - it will do exactly as it is programmed to do.

To illustrate this, let's take a very simple example of trying to conditionally test unstable state.

## The DOM is unstable

```js
// your app code

// random amount of time
const random = Math.random() * 100

// create a <button> element
const btn = document.createElement('button')

// attach it to the body
document.body.appendChild(btn)

setTimeout(() => {
  // add the class active after an indeterminate amount of time
  btn.setAttribute('class', 'active')
}, random)
```

```js
// your cypress test code
it('does something different based on the class of the button', function () {
  // RERUN THIS TEST OVER AND OVER AGAIN
  // AND IT WILL SOMETIMES BE TRUE, AND
  // SOMETIMES BE FALSE.

  cy.get('button').then(($btn) => {
    if ($btn.hasClass('active')) {
      // do something if it's active
    } else {
      // do something else
    }
  })
})
```

Do you see the problem here? This test is non-deterministic. The `<button>` will sometimes have the class `active` and sometimes not. In **most** cases, you cannot rely on the state of the DOM to determine what you should conditionally do.

This is the heart of flaky tests. At Cypress we have designed our API to combat this type of flakiness at every step.

# The situations

The **only** way to do conditional testing on the DOM is if you are 100% sure that the state has "settled" and there is no possible way for it to change.

That is it! In any other circumstance you will have flaky tests if you try to rely on the state of the DOM for conditional testing.

Let's explore a few examples.

## Server side rendering

If your application is server side rendered without JavaScript that asynchronously modifies the DOM - congratulations, you can easily do conditional testing on the DOM!

Why? Because if the DOM is not going to change after the `load` event occurs, then it can accurately represent a stable state of truth.

You can safely skip down to the bottom where we provide examples of conditional testing.

## Client side rendering

However, in most modern applications these days - when the `load` event occurs, usually nothing has rendered on the screen. It is usually at this moment that your scripts begin to load dynamic content and begin to render asynchronously.

Unfortunately, it is not possible for you to use the DOM to do conditional testing. To do this would require you to know with 100% guarantee that your application has finished all asynchronous rendering and that there are no pending network requests, setTimeouts, intervals, postMessage, or async/await code.

This is difficult to do (if not impossible) without making changes to your application. You could use a library like {% url "Zone.js" https://github.com/angular/zone.js/ %}, but even that does not capture every async possibility.

In other words, you cannot do conditional testing safely if you want your tests to run 100% consistently.

But do not fret - there are better workarounds to still achieve conditional testing **without** relying on the DOM. You just have to *anchor* yourself to another piece of truth that is not mutable.

# The strategies

If you are unable to guarantee that the DOM is stable - don't worry, there are other ways you can do conditional testing or work around the problems inherent with it.

**You could:**

- Remove the need to ever do conditional testing.
- Force your application to behave deterministically.
- Check other sources of truth (like your server or database).
- Embed data into other places (cookies / local storage) you could read off.
- Add data to the DOM that you can read off to know how to proceed.

Let's explore some examples of conditional testing that will pass or fail 100% of the time.

## A/B campaign

In this example let's assume you visit your website and the content will be different based on which A/B campaign your server decides to send. Perhaps it is based on geo-location, IP address, time of day, locale, or other factors that are difficult to control. How can you write tests in this manner?

Easily: control which campaign gets sent, or provide a reliable means to know which one it is.

### Use URL query params:

```js
// tell your back end server which campaign you want sent
// so you can deterministically know what it is ahead of time
cy.visit('https://app.com?campaign=A')

...

cy.visit('https://app.com?campaign=B')

...

cy.visit('https://app.com?campaign=C')
```

Now there is not even a need to do conditional testing since you are able to know ahead of time what campaign was sent. Yes, this may require server side updates, but you have to make an untestable app testable if you want to test it!

### Use the server:

Alternatively, if your server saves the campaign with a session, you could just ask your server to tell you which campaign you are on.

```js
// this sends us the session cookies
cy.visit('https://app.com')

// assuming this sends us back
// the campaign information
cy.request('https://app.com/me')
  .its('body.campaign')
  .then((campaign) => {
    // runs different cypress test code
    // based on the type of campaign
    return campaigns.test(campaign)
  })
```

### Use session cookies:

Perhaps an even easier way to test this is if your server sent the campaign in a session cookie that you could read off.

```js
cy.visit('https://app.com')
cy.getCookie('campaign')
  .then((campaign) => {
    return campaigns.test(campaign)
  })
```

### Embed data in the DOM:

Another valid strategy would be to embed data directly into the DOM - but do so in a way where this data is **always** present and query-able. It would have to be present 100% of the time, else this would not work.

```js
cy.get('html')
  .should('have.attr', 'data-campaign').then((campaign) => {
    return campaigns.test(campaign)
  })
```

## Welcome wizard

In this example, let's imagine you are running a bunch of tests and each time you load your application, it may show a "Welcome Wizard" modal.

In this situation, you want to close the wizard when it is present and ignore it if it is not.

The problem with this is that if the wizard renders asynchronously (as it likely does) you cannot use the DOM to conditionally dismiss it.

Once again - we will need another reliable way to achieve this without involving the DOM.

These patterns are pretty much the same as before:

### Use the URL to control it:

```js
// dont show the wizard
cy.visit('https://app.com?wizard=0')
```

```js
// show the wizard
cy.visit('https://app.com?wizard=1')
```

We would likely just need to update our client side code to check whether this query param is present. Now we know ahead of time whether it will or will not be shown.

### Use Cookies to know ahead of time:

In the case where you cannot control it, you can still conditionally dismiss it **if** you know whether it is going to be shown.

```js
cy.visit('https://app.com')
cy.getCookie('showWizard')
  .then((val) => {
    if (val) {
      // dismiss the wizard conditionally by enqueuing these
      // three additional commands
      cy.get('#wizard').contains('Close').click()
    }
  })
  .get(...)    // more commands here
  .should(...) // more commands here
  .click()     // more commands here
```

### Use your server or database:

If you store and/or persist whether to show the wizard on the server, then just ask it.

```js
cy.visit('https://app.com')
cy.request('https://app.com/me')
  .its('body.showWizard')
  .then((val) => {
    if (val) {
      // dismiss the wizard conditionally by enqueuing these
      // three additional commands
      cy.get('#wizard').contains('Close').click()
    }
  })
  .get(...)    // more commands here
  .should(...) // more commands here
  .click()     // more commands here
```

Alternatively, if you are creating users, it might just be easier to create the user and set whether you want the wizard to be shown ahead of time. That would avoid this check later.

### Embed data in the DOM:

Another valid strategy would be to embed data directly into the DOM but to do so in a way that the data is **always** present and query-able. The data would have to be present 100% of the time, otherwise this strategy would not work.

```js
cy.get('html').should('have.attr', 'data-wizard').then((wizard) => {
  if (wizard) {
    // dismiss the wizard conditionally by enqueuing these
    // three additional commands
    cy.get('#wizard').contains('Close').click()
  }
})
.get(...)    // more commands here
.should(...) // more commands here
.click()     // more commands here
```

## Element existence

In the case where you **are** trying to use the DOM to do conditional testing, you can utilize the ability to synchronously query for elements in Cypress to create control flow.

{% note warning %}
In the event you did not read a word above and skipped down here, we will reiterate it one more time:

You cannot do conditional testing on the DOM unless you are either:

- Server side rendering with no asynchronous JavaScript.
- Using client side JavaScript that **only** ever does synchronous rendering.

It is crucial that you understand how your application works else you will write flaky tests.
{% endnote %}

Let's imagine we have a scenario where our application may do two separate things that we are unable to control. In other words you tried every strategy above and for whatever reason you were unable to know ahead of time what your application will do.

Testing this in Cypress is possible.

```js
// app code
$('button').on('click', (e) => {
  // do something synchronously randomly
  if (Math.random() < .5) {
    // append an input
    $('<input />').appendTo($('body'))
  } else {
    // or append a textarea
    $('<textarea />').appendTo($('body'))
  }
})
```

```js
// click the button causing the new
// elements to appear
cy.get('button').click()
cy.get('body').then(($body) => {
  // synchronously query from body
  // to find which element was created
  if ($body.find('input').length) {
    // input was found, do something else here
    return 'input'
  }

  // else assume it was textarea
  return 'textarea'
})
  .then((selector) => {
    // selector is a string that represents
    // the selector we could use to find it
    cy.get(selector).type(`found the element by selector ${selector}`)
  })
```

We will reiterate one more time. Had the `<input>` or the `<textarea>` been rendered asynchronously, you could not use the pattern above. You would have to involve arbitrary delays which will not work in every situation, will slow down your tests, and will still leave chances that your tests are flaky (and are an all-around anti-pattern).

Cypress is built around creating **reliable tests**. The secret to writing good tests is to provide as much "state" and "facts" to Cypress and to "guard it" from issuing new commands until your application has reached the desired state it needs to proceed.

Doing conditional testing adds a huge problem - that the test writer themselves are unsure what the given state will be. In those situations, the only reliable way to have accurate tests is to embed this dynamic state in a reliable and consistent way.

If you are not sure if you have written a potentially flaky test, there is an easy way to figure it out. Repeat the test an excessive number of times, and then repeat by modifying the Developer Tools to throttle the Network and the CPU. This will create different loads that simulate different environments (like CI). If you've written a good test, it will pass or fail 100% of the time.

```js
Cypress._.times(100, (i) => {
  it(`num ${i + 1} - test the thing conditionally`, () => {
    // do the conditional bits 100 times
  })
})
```

## Dynamic text

The pattern of doing something conditionally based on whether or not certain text is present is identical to element existence above.

### Conditionally check whether an element has certain text:

```js
// this only works if there's 100% guarantee
// body has fully rendered without any pending changes
// to its state
cy.get('body').then(($body) => {
    // synchronously ask for the body's text
    // and do something based on whether it includes
    // another string
    if ($body.text().includes('some string')) {
      // yup found it
      cy.get(...).should(...)
    } else {
      // nope not here
      cy.get(...).should(...)
    }
  })
```

# Error Recovery

Many of our users ask how they can recover from failed commands.

> If I had error handling, I could just try to find X and if X fails go find Y

Because error handling is a common idiom in most programming languages, and especially in Node, it seems reasonable to expect to do that in Cypress.

However, this is really the same question as asking to do conditional testing just wrapped up in a slightly different implementation detail.

For instance you may want to do this:

**The following code is not valid, you cannot add error handling to Cypress commands. The code is just for demonstration purposes.**

```js
cy.get('button').contains('hello')
  .catch((err) => {
    // oh no the button wasn't found
    // (or something else failed)
    cy.get('somethingElse').click()
  })
```

If you've been reading along, then you should already have a grasp on why trying to implement conditional code with asynchronous rendering is not a good idea. If the test writer cannot accurately predict the given state of the system, then neither can Cypress. Error handling offers no additional proof this can be done deterministically.

You should think of failed commands in Cypress as akin to uncaught exceptions in server side code. It is not possible to try to recover in those scenarios because the system has transitioned to an unreliable state. Instead you generally always opt to crash and log. When Cypress fails the test - that is exactly what it is doing. Bailing out, skipping any remaining commands in the test, and logging out the failure.

But... for the sake of the argument, let's imagine for a moment you did have error handling in Cypress.

Enabling this would mean that for every single command, it would recover from errors, but only after each applicable command timeout was reached. Since timeouts start at 4 seconds (and exceed from there), this means that it would only fail after a long, long time.

Let's reimagine our "Welcome Wizard" example from before.

**The following code is not valid, you cannot add error handling to Cypress commands. The code is just for demonstration purposes.**
```js
// great error recovery code
function keepCalmAndCarryOn () {
  cy.get(...).should(...).click()
}

cy
  .get('#wizard').contains('Close').click()
  .catch((err) => {
    // no problem, i guess the wizard didn't exist
    // or something... no worries
    keepCalmAndCarryOn()
  })
  .then(keepCalmAndCarryOn)
```

In the **best** case scenario, we have wasted at LEAST 4 seconds waiting on the `<#wizard>` element to possibly exist before we errored and continued on.

But in the **worst** case scenario we have a situation where the `<#wizard>` **was** going to be rendered, but it didn't render within our given timeout. Let's assume this was due to a pending network request or WebSocket message or a queued timer, or anything else.

In this situation, not only did we wait a long period of time, but when the `<#wizard>` element was eventually shown it's likely caused an error downstream on other commands.

If you cannot accurately know the state of your application then no matter what programming idioms you have available - **you cannot write 100% deterministic tests**.

Still not convinced?

Not only is this an anti-pattern, but it's an actual logical fallacy.

You may think to yourself... okay fine, but 4 seconds - man that's not enough. Network requests could be slow, let's bump it up to 1 minute!

Even then, it's still possible a WebSocket message could come in... so 5 minutes!

Even then, not enough, it's possible a setTimeout could trigger... 60 minutes.

As you approach infinity your confidence does continue to rise on the chances you could prove the desired state will be reached, but you can never prove it will. Instead you could theoretically be waiting for the heat death of the universe for a condition to come that is only a moment away from happening. There is no way to prove or disprove that it *may* conditionally happen.

You, the test writer must know ahead of time what your application is programmed to do - or have 100% confidence that the state of a mutable object (like the DOM) has stabilized in order to write accurate conditional tests.

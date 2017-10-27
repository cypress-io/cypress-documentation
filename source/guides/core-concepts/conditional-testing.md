---
title: Conditional Testing
comments: false
---

Conditional testing refers to the common programming pattern:

> If X, then Y, else Z

Many of our users ask how to accomplish this seemingly simple idiom in Cypress.

Here are some example use cases:

- How do I do something different whether an element does or doesn't exist?
- My application does A/B testing, how do I account for that?
- My users receive a "welcome wizard", but existing ones don't. Can I always close the wizard in case it's shown, and ignore it when it's not?
- Can I recover from failed Cypress commands like if a `cy.get()` doesn't find an element?
- I'm trying to write dynamic tests that do something different based on text on the page.
- I want to automatically find all `<a>` elements, and based on which ones I found, I want to check that each link works.

The problem is - while first appearing simple, writing tests in this fashion often leads to flaky tests, random failures, and difficult to track down edge cases.

Let's investigate why and how you can overcome these problems...

# The Problem

These days modern JS applications are highly dynamic and mutable. Their state, and the DOM are continuously changing over a period of time.

The problem with **conditional testing** is that you cannot accurately determine or even know **when** the state is stable.

To a human - if something changes 10ms, or 100ms from now, we may not even notice this change and assume the state was always the same.

To a robot - even 10ms represents billions+ of clock cycles. The timescale difference is incredible.

A human also has intuition. If you click a button and see a loading spinner, you'll assume the state is in flux and will automatically wait for it to finish.

To a robot, they have no intuition - they'll do exactly as they're programmed to do.

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
      // do something if its active
    } else {
      // do something else
    }
  })
})
```

Do you see the problem here? This test is non-deterministic. The `<button>` will sometimes have the class `active` and sometimes not. In **most** cases, you cannot rely on the state of the DOM to determine what you should conditionally do.

This is the heart of flakiness and bad tests. At Cypress we've designed our API's to combat this type of flakiness at every step.

# The Situations

The **only** way to do conditional testing on the DOM is if you are 100% the state has "settled" and there is no possible way for it to change.

This is it! In any other circumstance you will have flaky tests if you try to rely on the state of the DOM for conditional testing.

Let's explore a few examples.

## Server side rendering

If your application is server side rendered with no JavaScript that asynchronously modifies the DOM - congratulations, you can easily do conditional testing on the DOM!

Why? It's simple. If by the time your `cy.visit()` completes and is no possibility of the DOM changing, then the state has settled.

Skip the next section and go look at some examples.

## Client side rendering

In most modern applications these days - when a `cy.visit()` completes, usually nothing is even rendered on the screen. It's usually at that moment your scripts begin to load dynamic content, or begin to render asynchronously.

Unfortunately it is not possible for you to use the DOM to do conditional testing. The only way for you to come close to doing this is to ensure you've waited for all async rendering to complete.

This is difficult to do, and oftentimes requires changes to your application. Perhaps it sets some value somewhere to indicate it's done. Sometimes if content renders after an XHR completes - so you wait on the XHR.

Even then however - if your application renders asynchronously, even if you wait for the thing that causes the rendering - there's no guarantee your app *has* rendered yet.

In other words, you're basically out of luck trying to do conditional testing with the DOM.

Luckily there are oftentimes easier ways to do conditional testing that don't rely on the DOM!

The good news is - you most often **don't** need the DOM to do conditional testing. In fact, it's much easier if you *anchor* yourself to some other piece of truth which is not mutable.

#

Now let's look at an example of conditional testing for elements that may or may not exist.

You must anchor yourself to things which are more deterministic than the DOM. Here are some possibilities:

- cookies
- local storage
- the URL / query params
- bootstrapped data in the DOM
- asking your server for the truth

Let's imagine an example where we display on onboarding wizard to new users.

You **have** to know ahead of time what the condition is that causes this onboarding wizard to be shown. You cannot rely on the DOM to determine this.

Easy with traditional server side rendered apps.

To demonstrate how simple of a problem this is.

- add class async
- attach DOM node async
- check a checkbox async

Strategies

- ensure you've waited for anything asynchronous to be done
- use a then and query synchronously
- repeat the test dozens of times if you want to see what happens

Why we don't offer a `.catch` - ways you could potentially implement this yourself.

If we set the defaultCommandTimeout really high this would be a terrible idea.

What if the thing causing the side effect never occurs? In most given situations, if the state of what you're expecting isn't there - there is no capacity to retry, or recover. It's just like the way uncaught exceptions work in server side languages. When an error does occur the best thing to do is exit instead of try to recover - because there is no guarantee that the state is correct.

# The Solutions

# Examples

## DOM

Here are some examples of using the DOM for conditional testing:

***Conditionally check whether an element exists:***

```js
cy
  .get('body').then(($body) => {
    // synchronously query to avoid cy commands
    // which require the element to either exist
    // or not exist
    if ($body.find('h3:contains(Welcome)').length) {
      // this exists, execute more cy commands
      cy.foo().bar()
    } else {
      // nope, not found, do something else
      cy.baz().quux()
    }
  })

```

## Server

## URL

---
title: Trade Offs
comments: false
containerClass: faq
---

Cypress automates the browser with its own unique architecture - differently from any other testing tool. While this unlocks the power to do things you won't find anywhere else, there are specific trade offs that are made. There is no free lunch!

In this guide we'll lay out what some of the tradeoffs are - and specifically how you can work around them.

While at first it may seem like these are some strict limitations in Cypress - we think you'll soon realize that many of these boundaries are actually **good** to have. In a sense they prevent you from writing really bad, slow, or flaky tests.

***Permanent Trade Offs:***

- Cypress is not a general purpose automation tool
- Cypress commands run inside of the browser
- There will never be support for multiple tabs
- You cannot use Cypress to drive two browsers at the same time
- Each test is bound to a single origin

***Temporary Trade Offs:***

While we of course have more {% url 'open issues' 'https://github.com/cypress-io/cypress/issues' %} than this, we believe these are some of the more important *temporary* restrictions that Cypress will eventually fix. PR's are welcome ;-)

Many of these issues are currently being worked on or are on our {% url "Roadmap" roadmap %}.

- {% url "Workarounds for `cy.hover()` command" hover %}
- {% url "There is no `cy.tab()` command" https://github.com/cypress-io/cypress/issues/299 %}
- {% url "You cannot visit a TLD domain" https://github.com/cypress-io/cypress/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20tld %}
- {% url "There are no native or mobile events" https://github.com/cypress-io/cypress/issues/311#issuecomment-339824191 %}
- {% url "Testing file uploads is application specific" https://github.com/cypress-io/cypress/issues/170#issuecomment-340012621 %}
- {% url "Testing file downloads is application specific" https://github.com/cypress-io/cypress/issues/433#issuecomment-280465552 %}
- {% url "You can take screenshots, but diffing them needs work" https://github.com/cypress-io/cypress/issues/181 %}
- {% url "Iframe support is somewhat limited, but does work" https://github.com/cypress-io/cypress/issues/685 %}
- {% url "There is no cross browser support other than Chrome + Electron" https://github.com/cypress-io/cypress/issues/310 %}
- {% url "Third party sites may implement security mechanisms which defeat Cypress" https://github.com/cypress-io/cypress/issues/392#issuecomment-274987217 %}
- {% url "You cannot use `cy.route()` on `window.fetch` but there is a workaround" https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126 %}, also a {% url "recipe here" https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/spy_stub_clock_spec.js %}

# Permanent Trade Offs

## Automation Restrictions

Cypress is a hyper focused specialized tool that does one thing really well. You should not use Cypress for things it's not designed for such as:

- Indexing the web
- Spidering links
- Performance Testing
- Scripting 3rd party sites

There are already excellent tools that are optimized for doing each item listed above.

The **sweet spot** of Cypress is to be used as a tool to test your own applications **as you build them**. It's built for developers and QA engineers, not manual testers or exploratory testing.

## Inside the Browser

In case you've missed it before - Cypress tests run inside of the browser! This means we can do things nobody else can. There is no object serialization, JSON wire protocols, you have real, native access to everything in your application. It's impossible for Cypress to 'miss' elements, and it always knows the moment your application fires any kind of event.

But what this also means is that your test code **is being evaluated inside the browser**. Test code is not evaluated in `Node.js`, or any other server side language. The **only** language we will ever support is JavaScript.

This trade off means it makes it a little bit harder to communicate with backend things - like your server or database. You will not be able to connect or import those server side libraries or modules directly. Although you can of course require `node_modules` which can be used in the browser. Additionally you will soon have the ability to use `Node.js` to import or talk directly to your backend scripts once {% issue 684 %} lands.

To talk to your database or server you'll need to go through {% url `cy.exec()` exec %} or {% url `cy.request()` request %}. That means you'll need to expose a way to seed and setup your database. This really isn't that hard, but it might take a bit more elbow grease than another testing tool written in your backend language.

The trade off here is that doing all the things in the browser (basically all of your tests) is a much better experience in Cypress. But doing things outside of the browser may take a bit more work.

In the future we **do** have plans to release backend adapters for other languages, but that's going to happen down the road a bit.

## Multiple Tabs

Because Cypress runs in the browser, it will never support multi-tabs. We do have access to the browser automation API's to actually switch tabs, but there is no reason for us to ever expose them.

Most of the time this use case is needed when users click a `<a>` that opens a new tab. Users then want to switch to that tab to verify that the content loaded. Trust us - you don't need to do this. In fact we have {% url 'recipes of showing you how to test this without multiple tab support' testing-the-dom-recipe %}.

To take this a step further - we don't believe there is any use case testing the browsers native behavior. You should ask yourself why you are testing that clicking an `<a href="/foo" target="_blank">` opens a new tab. You already know that's what the browser does. And you already know that it's triggered by the `target="_blank"` attribute.

Since that's the case just test **the thing** triggering the browser to perform this behavior - as opposed to testing the behavior itself.

```js
cy.get('a[href="/foo"]').should('have.attr', 'target', '_blank') // so simple
```

This principle applies to everything at Cypress. Don't test what doesn't need testing. It's slow, brittle, and adds zero value. Test only the underlying thing that causes the behavior you care about.

## Multiple Browsers

Just like with multiple tabs - Cypress will never support controlling more than 1 browser at a time.

However it **is possible** to use Cypress and synchronize it with another backend process - whether its Selenium or Puppeteer to drive a 2nd browser. We have actually seen this work together quite nicely!

With that said - except in the most unusual and rare circumstances we **don't believe** in ever using needing to use two browsers at the same time.

Trying to do this is not scalable, its slow, and completely unnecessary.

In virtually every situation where someone asks about this functionality they'll ask the question like this:

> I'm trying to test a chat application. Can I run more than one browser at a time with Cypress?

Whether you're testing a chat application or anything else - what you're really asking about is testing collaboration. The thing is though - you don't need to recreate the entire environment in order to test collaboration with 100% coverage.

Doing it this way will be faster, more accurate, and much more scalable.

Trying to spin up the entire environment is a race to the bottom. Imagine when you want to test the collaboration of 3 users, then 4 users, then 5 users. Perhaps you then want to test how your backend handles the load of dozens, hundreds, maybe thousands of users. Would you spin up a browser to simulate the environment for each one of them?

No, of course you wouldn't - because you can still test all of these scenarios without involving more than 1 browser.

While outside the scope of this article, you could test a chat application using the following principles. Each one will incrementally introduce more collaboration:

***1. Use only the browser:***

```text
    &downarrow;
&leftarrow; browser &rightarrow;
    &uparrow;
```

Avoid the server, invoke your JavaScript callbacks manually thereby simulating what happens when "notifications come in", or "users leave the chat" purely in the browser.

You can easily stub everything and simulate every single scenario. Chat messages, offline messages, connections, reconnections, disconnections, group chat, everything.  Everything that happens inside of the browser can be fully tested. Requests leaving the browser could also be stubbed and you could simply assert that the request bodies were correct.

***2. Stub the other connection:***

```text
server &rightarrow; browser
            &downarrow;
server &leftarrow; browser
  &downarrow;
(other connections stubbed)
  &downarrow;
server &rightarrow; browser
```

Use your server to receive messages from the browser, and simply simulate "the other participant" by sending messages as them. This is certainly application specific, but generally you could insert records into the database or do whatever it takes for your server to act as if a message of one client needs to be sent back to the browser.

Typically this pattern enables you to avoid making a secondary websocket connection and yet still fulfills the bidirectional browser and server contract. This means you could also test edge cases (disconnections, etc) without actually creating to handle real connections.

***3: Introduce another connection:***

```text
server &rightarrow; browser
            &downarrow;
server &leftarrow; browser
  &downarrow;
server &rightarrow; other connection
            &downarrow;
server &leftarrow; other connection
  &downarrow;
server &rightarrow; browser
```

To do this - you'll need a background process outside of the browser to make the underlying websocket connection that you can then communicate with and control.

You can do this in may ways and here's a simple example of using an HTTP server to act as the client and exposing a REST interface that enables us to control it.

```js
// cypress code

// tell the http server at 8081 to connect to 8080
cy.request('http://localhost:8081/connect?url=http://localhost:8080')

// tell the http server at 8081 to send a message
cy.request('http://localhost:8081/message?m=hello')

// tell the http server at 8081 to disconnect
cy.request('http://localhost:8081/disconnect')
```

And the HTTP server code would look something like this...

```js
const client = require('socket.io:client')
const express = require('express')

const app = express()

let socket

app.get('/connect', (req, res) => {
  const url = req.query.url

  socket = client(url)

  socket.on('connect', () => {
    res.sendStatus(200)
  })
})

app.get('/message', (req, res) => {
  const msg = req.query.m

  socket.send(msg, () => {
    res.sendStatus(200)
  })
})

app.get('/disconnect', (req, res) => {
  socket.on('disconnect', () => {
    res.sendStatus(200)
  })

  socket.disconnect()
})

app.listen(8081, () => {})
```

This avoids ever needing a 2nd browser, but still gives you an e2e test that provides 100% confidence that two clients can communicate with each other.

## Single Origin

Each test is limited to only visiting a single superdomain.

What is a superdomain?

```js
// examples of superdomains
// given these origins below

http://google.com       // superdomain is google.com
https://google.com      // superdomain is google.com
https://www.google.com  // superdomain is google.com
https://mail.google.com // superdomain is google.com
```

The rules are:

- {% fa fa-warning %} You **cannot** visit two different superdomains in the same test.
- {% fa fa-check-circle %} But you **can** visit different subdomains in the same test.

```javascript
cy.visit('https://www.cypress.io')
cy.visit('https://docs.cypress.io') // yup all good
```

```javascript
cy.visit('https://apple.com')
cy.visit('https://google.com')      // this will immediately error
```

This limitation exists because Cypress switches to the domain under each specific test when it runs.

The good news here is that it is extremely rare to need to visit two different superdomains in a single test. Why? Because the browser has a natural security barrier called `origin policy` which means that state like `localStorage`, `cookies`, `service workers` and many other API's are not shared between them.

Therefore what you do on one site could not possibly affect another.

As a best practice, you should not visit or interact with a 3rd party service not under your control. However, there are exceptions! If your organization uses Single Sign On (SSO) or OAuth then you might involve a 3rd party service other than your superdomain.

We've written several other guides specifically about handling this situation.

- {% url 'Best Practices: Visiting external sites' best-practices#Visiting-external-sites %}
- {% url 'Web Security: Common Workarounds' web-security#Common-Workarounds %}
- {% url 'Recipes: Logging In (Single Sign On)' logging-in-recipe %}

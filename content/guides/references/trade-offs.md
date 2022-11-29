---
title: Trade-offs
containerClass: faq
e2eSpecific: true
---

Cypress automates the browser with its own unique architecture. While this
unlocks the power to do things you will not find anywhere else, there are
specific trade-offs that are made. There is no free lunch!

In this guide we will lay out what some of the trade-offs are - and specifically
how you can work around them.

While at first it may seem like these are strict limitations in Cypress - we
think you will soon realize that many of these boundaries are actually **good**
to have. In a sense they prevent you from writing bad, slow, or flaky tests.

#### Permanent trade-offs:

- Cypress is not a general purpose [automation tool](#Automation-restrictions).
- Cypress commands run [inside of a browser](#Inside-the-browser).
- There will never be support for [multiple browser tabs](#Multiple-tabs).
- You cannot use Cypress to drive
  [two browsers at the same time](#Multiple-browsers-open-at-the-same-time).
- Each test is bound to a [single superdomain](#Navigation-Rules). Cross-origin
  navigation inside each test is permitted with the use of the
  [`cy.origin`](/api/commands/origin) command.

#### Temporary trade-offs:

We have [open issues](https://github.com/cypress-io/cypress/issues) where you
can find a full list of things Cypress will eventually address, we wanted to
highlight some of the more important _temporary_ restrictions that Cypress will
eventually address. [PRs are welcome ;-)](https://on.cypress.io/contributing)

Many of these issues are currently being worked on or are on our
[Roadmap](/guides/references/roadmap).

- [Workarounds for the lack of a `cy.hover()` command.](/api/commands/hover)
- [`cy.tab()` command.](https://github.com/cypress-io/cypress/issues/299)
- [There is not any native or mobile events support.](https://github.com/cypress-io/cypress/issues/311#issuecomment-339824191)
- [iframe support is somewhat limited, but does work.](https://github.com/cypress-io/cypress/issues/136)

## Permanent trade-offs

### Automation restrictions

Cypress is a specialized tool that does one thing really well: end-to-end
testing web applications while they are under development. You should not use
Cypress for things it is not designed for such as:

- Indexing the web
- Spidering links
- Performance testing
- Scripting 3rd party sites

There are other excellent tools that are optimized for doing each item listed
above.

The **sweet spot** of Cypress is to be used as a tool to test your own
application **as you build it**. It is built for developers and QA engineers,
not manual testers or exploratory testing.

### Inside the browser

In case you missed it before - Cypress tests run inside of the browser! This
means we can do things nobody else can. There is no object serialization or JSON
wire protocols. You have real, native access to everything in your application
under test. It is impossible for Cypress to 'miss' elements and it always knows
the moment your application fires any kind of event.

But what this also means is that your test code **is being evaluated inside the
browser**. Test code is not evaluated in Node, or any other server side
language. The **only** language we will ever support is the language of the web:
JavaScript.

This trade-off means it makes it a little bit harder to communicate with the
back end - like your server or database. You will not be able to connect or
import those server-side libraries or modules directly. Although you can require
`node_modules` which can be used in the browser. Additionally, you have the
ability to use Node to import or talk directly to your back end scripts using
[our Plugins API](/api/plugins/writing-a-plugin) or
[cy.task()](/api/commands/task).

To talk to your database or server you need to use the
[`cy.exec()`](/api/commands/exec), [`cy.task()`](/api/commands/task), or
[`cy.request()`](/api/commands/request) commands. That means you will need to
expose a way to seed and setup your database. This really is not that hard, but
it might take a bit more elbow grease than other testing tools written in your
back end language.

The trade-off here is that doing everything in the browser (basically all of
your tests) is a much better experience in Cypress. But doing things outside of
the browser may take a little extra work.

In the future we **do** have plans to release back end adapters for other
languages.

### Multiple tabs

Because Cypress runs in the browser, it will never have multi-tabs support. We
do have access to the browser automation APIs to actually switch tabs, but there
is no reason for us to ever expose them.

Most of the time this use case is needed when users click an `<a>` that opens a
new tab. Users then want to switch to that tab to verify that the content
loaded. But, you shouldn't need to do this. In fact we have
[recipes of showing you how to test this without multiple tabs](/examples/examples/recipes#Testing-the-DOM).

To take this a step further - we don't believe there is any use case for testing
the browser's native behavior. You should ask yourself why you are testing that
clicking an `<a href="/foo" target="_blank">` opens a new tab. You already know
that is what the browser is designed to do and you already know that it is
triggered by the `target="_blank"` attribute.

Since that is the case, test **the thing** triggering the browser to perform
this behavior - as opposed to testing the behavior itself.

```js
cy.get('a[href="/foo"]').should('have.attr', 'target', '_blank')
```

This principle applies to everything in Cypress. Do not test what does not need
testing. It is slow, brittle, and adds zero value. Only test the underlying
thing that causes the behavior you care about testing.

### Multiple browsers open at the same time

Just like with multiple tabs - Cypress does not support controlling more than 1
open browser at a time.

However it **is possible** to synchronize Cypress with another back end
process - whether it is Selenium or Puppeteer to drive a 2nd open browser. We
have actually seen this work together quite nicely!

With that said, except in the most unusual and rare circumstances, you can still
test most application behavior without opening multiple browsers at the same
time.

You may ask about this functionality like this:

> I'm trying to test a chat application. Can I run more than one browser at a
> time with Cypress?

Whether you are testing a chat application or anything else - what you are
really asking about is testing collaboration. But, **you don't need to recreate
the entire environment in order to test collaboration with 100% coverage**.

Doing it this way can be faster, more accurate, and more scalable.

While outside the scope of this article, you could test a chat application using
the following principles. Each one will incrementally introduce more
collaboration:

#### 1. Use only the browser:

```text
    ↓
← browser →
    ↑
```

Avoid the server, invoke your JavaScript callbacks manually thereby simulating
what happens when "notifications come in", or "users leave the chat" purely in
the browser.

You can [stub](/api/commands/stub) everything and simulate every single
scenario. Chat messages, offline messages, connections, reconnections,
disconnections, group chat, etc. Everything that happens inside of the browser
can be fully tested. Requests leaving the browser could also be stubbed and you
could assert that the request bodies were correct.

#### 2. Stub the other connection:

```text
server → browser
            ↓
server ← browser
  ↓
(other connections stubbed)
  ↓
server → browser
```

Use your server to receive messages from the browser, and simulate "the other
participant" by sending messages as that participant. This is certainly
application specific, but generally you could insert records into the database
or do whatever it takes for your server to act as if a message of one client
needs to be sent back to the browser.

Typically this pattern enables you to avoid making a secondary WebSocket
connection and yet still fulfills the bidirectional browser and server contract.
This means you could also test edge cases (disconnections, etc) without actually
handling real connections.

#### 3: Introduce another connection:

```text
server → browser
            ↓
server ← browser
  ↓
server → other connection
            ↓
server ← other connection
  ↓
server → browser
```

To do this - you would need a background process outside of the browser to make
the underlying WebSocket connection that you can then communicate with and
control.

You can do this in many ways and here is an example of using an HTTP server to
act as the client and exposing a REST interface that enables us to control it.

```js
// Cypress tests

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

This avoids ever needing a second open browser, but still gives you an
end-to-end test that provides 100% confidence that the two clients can
communicate with each other.

### Navigation Rules

By itself, Cypress limits each test to only visiting domains that are considered
to be same superdomain to one another. If a navigation occurs that does not meet
the same superdomain rule, the [`cy.origin`](/api/commands/origin) command must
be used to execute assertions inside the newly navigated origin.

But what is same superdomain? It is actually very similar to that of same
origin! Two URLs have the same origin if the protocol, port (if specified), and
host are the same for both. Cypress automatically handles hosts of the same
superdomain by injecting the
[`document.domain`](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain)
property into the visited `text/html` pages. This is why navigations without the
use of the [`cy.origin`](/api/commands/origin) command are solely scope to same
superdomain.

Given the URLs below, all have the same superdomain compared to
`https://www.cypress.io`.

- `https://cypress.io`
- `https://docs.cypress.io`
- `https://example.cypress.io/commands/querying`

The URLs below, however, will have different superdomains/origins compared to
`https://www.cypress.io`.

- `http://www.cypress.io` (Different protocol)
- `https://docs.cypress.io:81` (Different port)
- `https://www.auth0.com/` (Different host of different superdomain)

The `http://localhost` URLs differ if their ports are different. For example,
the `http://localhost:3000` URL is considered to be a different origin from the
`http://localhost:8080` URL.

The rules are:

- <Icon name="exclamation-triangle" color="red"></Icon> You **cannot**
  [visit](/api/commands/visit) two domains of different superdomains in the same
  test and continue to run assertions without the use of the
  [`cy.origin`](/api/commands/origin) command.
- <Icon name="check-circle" color="green"></Icon> You **can**
  [visit](/api/commands/visit) two or more domains of different origin in
  **different** tests without needing [`cy.origin`](/api/commands/origin).

We understand this is a bit complicated to understand, so we have built a nifty
chart to help clarify the differences!

#### Parts of a URL

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                         href                                          │
├──────────┬──┬─────────────────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │               host                  │           path            │ hash  │
│          │  ├──────────────────────────────┬──────┼──────────┬────────────────┤       │
│          │  │           hostname           │ port │ pathname │     search     │       │
|          |  ├───────────┬──────────────────┤      │          │                │       │
│          │  │ subdomain │ superdomain (sd) │      │          │                │       │
|          |  ├───────────┼─────────┬────────┤      │          ├─┬──────────────┤       │
│          │  │           │  domain │  TLD   │      │          │ │    query     │       │
│          │  │           │         │        │      │          │ │              │       │
"  https:   //     sub    . example .  com   : 8080   /p/a/t/h  ?  query=string   #hash "
│                                                   │          │                │       │
│                      origin                       │          |                │       │
├─────────────┬───────────┬─────────────────────────┤          │                │       │
│ (sd) origin │           │   (sd) origin           │          │                │       │
└─────────────┴───────────┴─────────────────────────┴──────────┴────────────────┴───────┘
```

For practical purposes, this means the following:

```javascript
it('navigates', () => {
  cy.visit('https://www.cypress.io')
  cy.visit('https://docs.cypress.io')
  cy.get('selector') // yup all good
})
```

```javascript
it('navigates', () => {
  cy.visit('https://www.cypress.io')
  cy.visit('https://stackoverflow.com')
  cy.get('selector') // this will error w/o cy.origin wrap
})
```

```javascript
it('navigates', () => {
  cy.visit('https://www.cypress.io')
  cy.visit('https://stackoverflow.com')
  cy.origin('https://stackoverflow.com', () => {
    cy.get('selector') // yup all good
  })
})
```

```javascript
it('navigates', () => {
  cy.visit('https://www.cypress.io')
})

// split visiting different origin in another test
it('navigates to new origin', () => {
  cy.visit('https://stackoverflow.com')
  cy.get('selector') // yup all good
})
```

This limitation exists because Cypress switches to the domain under each
specific test when it runs. For more information on this, please see our Web
Security page regarding
[Different superdomain per test requires cy.origin command](/guides/guides/web-security#Different-superdomain-per-test-requires-cy-origin-command).

#### Other workarounds

There are other ways of testing the interaction between 2 superdomains. Because
the browser has a natural security barrier called `origin policy` this means
that state like `localStorage`, `cookies`, `service workers` and many other APIs
are not shared between them anyways. Because of this, the Cypress APIs that
interact with `localStorage`, `sessionStorage`, and `cookies` are able to take a
domain option in order to interact with the appropriate domain.

As a best practice, you should not visit or interact with a 3rd party service
not under your control. However, there are exceptions! If your organization uses
Single Sign On (SSO) or OAuth then you might involve a 3rd party service other
than your superdomain, which can be safely tested with
[`cy.origin`](/api/commands/origin).

We've written several other guides specifically about handling this situation.

- [Best Practices: Visiting external sites](/guides/references/best-practices#Visiting-external-sites)
- [Web Security: Common Workarounds](/guides/guides/web-security#Common-Workarounds)
- [Recipes: Logging In - Single Sign On](/examples/examples/recipes#Logging-In)
- LINK AUTHENTICATION GUIDES HERE

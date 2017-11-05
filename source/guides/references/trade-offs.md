---
title: Trade Offs
comments: false
containerClass: faq
---

Cypress automates the browser with its own unique architecture - apart from any other testing tool. While this unlocks the power to do things you won't find anywhere else, there are specific trade offs that are made. Remember - there is no free lunch!

In this reference we'll lay out what some of the tradeoffs are - and specifically how you can work around them.

While at first it may seem like these are some strict limitations in Cypress - we think you'll soon realize that many of these boundaries are actually **good** to have. In a sense they prevent you from writing really bad, slow, or flaky tests.

***Permanent Trade Offs:***

- Cypress is not a general purpose automation tool
- Cypress commands run inside of the browser
- There will never be support for multiple tabs
- You cannot use Cypress to drive two browsers at the same time
- Each test is bound to a single origin

***Temporary Trade Offs:***

While we of course have more {% url 'open issues' 'https://github.com/cypress-io/cypress/issues' %} than this, we believe these are some of the more important *temporary* restrictions that Cypress will eventually fix. PR's are welcome ;-)

- There is no `cy.hover()` command
- There is no `cy.tab()` command
- You cannot visit a TLD domain
- There are no native or mobile events
- Testing file uploads is application specific
- Testing file downloads requires a workaround
- You can take screenshots, but diffing them needs work
- Iframe support is somewhat limited, but does work
- You cannot stub `window.fetch`, but there is a workaround
- There is no cross browser support other than Chrome + Electron
- Third party sites may implement security mechanisms which defeat Cypress

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

collaboration of the road, the tires, and the load.

1. Scalability (group chat / 1000's a messages)
do you think facebook tests messenger by spinning up 1,000,000 browsers to figure out the load? No they use network load testing.

Do you use a browser to test API calls? No, of course not. You just shoot network requests directly to your server.

If you needed to recreate the very conditions to test this, then you'll be killing yourself.

What about the chat experience when users are halfway across the world? Just imagine all the edge cases and scenarios you made need to account for. Do you think spinning up the browser is feasible?

Do you spin up the browser to seed the database? No. You just seed the database directly.

Trying to coordinate an army of browsers would take enormous resources. It wouldn't be practical. The same principle applies whether its 2 browsers or 2 million browsers.

2. Don't involve the server
Stub it out. Easy. Done. All within a single browser. You could even use Cypress test scripts itself to connect to the websocket connection! Wow.

3. Use the server as the other client
You could actually connect another client and give it remote commands. Easy.

4. Don't connect a client but force your server into thinking many are connected.

5. Don't test the collaboration at all. Likely you can just write server level (backend end) tests to cover the whole thing. Sure you might want 1-2 e2e tests making sure your message got sent and picked up by your server, but that cover most of the use case in one shot.

## Single Origin

Each test is limited to only visiting a single superdomain.

What is a superdomain?

```js
// examples of superdomains
// given these origins below

http://google.com       // google.com
https://google.com      // google.com
https://www.google.com  // google.com
https://mail.google.com // google.com
```

You can navigate between **subdomains** in a single test - you just cannot navigate from `google.com` to `apple.com` in the same test.

This limitation exists due to the way Cypress is bound to a single superdomain origin per test. Fortunately, there is never a situation where it is actually useful to transition between domains. All browsers have a security model bound to origin; sites are completely isolated from one another. In the unusual situation where an action *does* affect another origin, you can simply use cy.request() to programmatically interact with the other site. Imagine submitting a form on your web application which ends up updating some value in Github. The thing is, you don't need to navigate to the other website to verify this. You could just programmatically interact with the other sites' APIs. So, while this restriction may initially seem counter-intuitive, it is actually a fundamentally good best practice. Testing or visiting applications you don't control is a recipe for flake and disaster.

With that said, there are situations where you may need to navigation between two origins and you control both parts. This regularly occurs with Single Sign On (SSO). This is very easy to test in Cypress and we even have recipes showing you how. "


This is one of those situations where this restriction is actually good.

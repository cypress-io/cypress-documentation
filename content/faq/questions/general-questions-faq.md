---
layout: toc-top
title: General Questions
containerClass: faq
---

## <Icon name="angle-right"></Icon> Is Cypress free and open source?

[Cypress](/guides/core-concepts/cypress-app) is a free, downloadable and open
source (MIT license) application. This is always free to use. Our
[Dashboard Service](/guides/dashboard/introduction) is a web application that
offers a variety of billing plans (including a free, open source plan) for when
you want to record your test runs in CI.

Please see our [Pricing Page](https://www.cypress.io/pricing) for more details.

## <Icon name="angle-right"></Icon> What operating systems do you support?

You can [install Cypress](/guides/getting-started/installing-cypress) on Mac,
Linux, and Windows. For additional information, please see our
[System requirements](/guides/getting-started/installing-cypress#System-requirements).

## <Icon name="angle-right"></Icon> Do you support native mobile apps?

Cypress will never be able to run on a native mobile app, but we can test some
functionality of mobile web browsers and test mobile applications that are
developed in a browser, such as with
[the Ionic framework](https://ionicframework.com/).

Currently you can control the viewport with the
[`cy.viewport()`](/api/commands/viewport) command to test responsive, mobile
views in a website or web application. You can also mimic certain behaviors like
swiping using [custom commands](/api/cypress-api/custom-commands).

You can read about testing mobile applications with Ionic and Cypress
[here](https://www.cypress.io/blog/2020/07/08/end-to-end-testing-mobile-apps-with-ionic-and-cypress/)
and see how we manage testing the mobile viewport in the
[Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

## <Icon name="angle-right"></Icon> How is this different from 'X' testing tool?

Cypress is a hybrid application/framework/service all rolled into one. It takes
a little bit of other testing tools, brings them together and improves on them.

#### Mocha

Mocha is a testing framework for JavaScript. [Mocha](http://mochajs.org/) gives
you the `it`, `describe`, `beforeEach` methods. Cypress isn't **different** from
Mocha, it actually **uses** Mocha under the hood. All of your tests will be
written on top of Mocha's `bdd` interface.

#### Karma

A unit testing runner for JavaScript, [Karma](http://karma-runner.github.io/),
works with either [Jasmine](https://jasmine.github.io/),
[Mocha](http://mochajs.org/), or any other JavaScript testing framework.

Karma also watches your JavaScript files, live reloads when they change, and is
also the `reporter` for your tests failing / passing. It runs from the command
line.

Cypress essentially replaces Karma because it does all of this already and much
more.

#### Capybara

The `Ruby` specific tool that allows you to write integration tests for your web
application is [Capybara](http://teamcapybara.github.io/capybara/). In the Rails
world, this is the _go-to_ tool for testing your application. It uses
[Sauce Labs](https://SauceLabs.com/) (or another headless driver) to interact
with browsers. Its API consists of commands that query for DOM elements, perform
user actions, navigate around, etc.

Cypress essentially replaces Capybara because it does all of these things and
much more. The difference is that instead of testing your application in a
GUI-less console, you would see your application at all times. You'd never have
to take a screenshot to debug because all commands instantly provide you the
state of your application while they run. Upon any command failing, you'll get a
human-readable error explaining why it failed. There's no "guessing" when
debugging.

Oftentimes Capybara begins to not work as well in complex JavaScript
applications. Additionally, trying to TDD your application is often difficult.
You often have to resort to writing your application code first (typically
manually refreshing your browser after changes) until you get it working. From
there you write tests, but lose the entire value of TDD.

#### Protractor

Using [Protractor](http://www.protractortest.org/) provides a nice Promise-based
interface on top of Selenium, which makes it less complicated to deal with
asynchronous code. Protractor comes with all of the features of Capybara and
essentially suffers from the same problems.

Cypress replaces Protractor because it does all of these things and much more.
One major difference is that Cypress enables you to write your unit tests and
integration tests in the same tool, as opposed to splitting up this work across
both Karma and Protractor.

Also, Protractor is very much focused on `AngularJS`, whereas Cypress is
designed to work with any JavaScript framework. Protractor, because it's based
on Selenium, is still pretty slow, and is prohibitive when trying to TDD your
application. Cypress, on the other hand, runs at the speed your browser and
application are capable of serving and rendering; there is no additional bloat.

## <Icon name="angle-right"></Icon> Do you support X language or X framework?

Any and all. Ruby, Node, C#, PHP - none of that matters. Cypress tests anything
that runs in the context of a browser. It is back end, front end, language and
framework agnostic.

You'll write your tests in JavaScript, but beyond that Cypress works everywhere.

## <Icon name="angle-right"></Icon> Can I run Cypress on another browser other than Chrome?

You can read about our currently available browsers
[here](/guides/guides/launching-browsers).

## <Icon name="angle-right"></Icon> Will Cypress work in my CI provider?

Cypress works in any [CI provider](/guides/continuous-integration/introduction).

## <Icon name="angle-right"></Icon> Does Cypress require me to change any of my existing code?

No. But if you're wanting to test parts of your application that are not easily
testable, you'll want to refactor those situations (as you would for any
testing).

## <Icon name="angle-right"></Icon> Does Cypress use Selenium / Webdriver?

No. In fact Cypress' architecture is very different from Selenium in a few
critical ways:

- Cypress runs in the context of the browser. With Cypress it's easier to
  inspect what is running in the browser, but harder to talk to the outside
  world. In Selenium it's the exact opposite. Selenium runs outside of the
  browser where your application is running (though Cypress is adding more
  commands every day that give you access to the outside world - like
  [`cy.request()`](/api/commands/request), [`cy.exec()`](/api/commands/exec),
  and [`cy.task()`](/api/commands/task)).
- With Selenium you get either 100% simulated events (with Selenium RC) or 100%
  native events (with Selenium WebDriver). With Cypress, you get both. For the
  most part we use simulated events. However we do use automation APIs for
  things like Cookies where we extend outside of the JavaScript sandbox and
  interact with the underlying browser APIs. This gives us flexibility to
  determine which type of event to use in specific situations. Native event
  support is on our [roadmap](/guides/references/roadmap).

## <Icon name="angle-right"></Icon> If Cypress runs in the browser, doesn't that mean it's sandboxed?

Yes, technically; it's sandboxed and has to follow the same rules as every other
browser. That's actually a good thing because it doesn't require a browser
extension, and it naturally will work across all browsers (which enables cross
browser testing).

But Cypress is actually way beyond a basic JavaScript application running in the
browser. It is also a desktop application and communicates with back end web
services.

All of these technologies together are coordinated and enable Cypress to work,
which extends its capabilities far outside of the browser sandbox. Without
these, Cypress would not work at all. For the vast majority of your web
development, Cypress will work fine, and already _does_ work.

## <Icon name="angle-right"></Icon> We use WebSockets; will Cypress work with that?

Yes.

## <Icon name="angle-right"></Icon> We have the most complex most outrageous authentication system ever; will Cypress work with that?

If you're using some complex thumb-print, retinal-scan, time-based,
key-changing, microphone, audial, decoding mechanism to log in your users, then
no, Cypress won't work with that. But seriously, Cypress is a _development_
tool, which helps you test your web applications. If your application is doing
100x things to make it extremely difficult to access, Cypress won't magically
make it any easier.

Because Cypress is a development tool, you can always make your application more
accessible while in your development environment. If you want, disable complex
steps in your authentication systems while you're in your testing environment.
After all, that's why we have different environments! Normally you already have
a development environment, a testing environment, a staging environment, and a
production environment. So expose the parts of your system you want accessible
in each appropriate environment.

In doing so, Cypress may not be able to give you 100% coverage without you
changing anything, but that's okay. Use different tools to test the less
accessible parts of your application, and let Cypress test the other 99%.

Remember, Cypress won't make a non-testable application suddenly testable. It's
on your shoulders to architect your code in an accessible manner.

## <Icon name="angle-right"></Icon> Is it possible to use cypress on `.jspa`?

Yes. Cypress works on anything rendered to a browser.

## <Icon name="angle-right"></Icon> Can I use Cypress to script user-actions on an external site like `gmail.com`?

No. There are already lots of tools to do that. Using Cypress to test against a
3rd party application is not its intended use. It _may_ work but will defeat the
purpose of why it was created. You use Cypress _while_ you develop your
application, it helps you write your tests.

## <Icon name="angle-right"></Icon> Is there code coverage?

There is a plugin and detailed documentation on how to get end-to-end, unit and
full stack code coverage.

- Read our [Code Coverage guide](https://on.cypress.io/code-coverage)
- Use the [@cypress/code-coverage](https://github.com/cypress-io/code-coverage)
  plugin

You may also find the following resources helpful when writing end-to-end tests:

- [element coverage](https://glebbahmutov.com/blog/element-coverage/)
- [application state coverage](https://glebbahmutov.com/blog/hyperapp-state-machine/)

## <Icon name="angle-right"></Icon> Are there driver bindings in my language?

Cypress does _not_ utilize WebDriver for testing, so it does not use or have any
notion of driver bindings. If your language can be somehow transpiled to
JavaScript, then you can configure
[Cypress webpack preprocessor](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor)
or
[Cypress Browserify preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)
to transpile your tests to JavaScript that Cypress can run.

## <Icon name="angle-right"></Icon> What resources do you recommend to learn JavaScript before writing Cypress tests?

We hope that Cypress makes test writing simple and fun, even for people with a
minimal knowledge of JavaScript. If you would like to develop your JS skills, we
recommend the following free online resources:

- Online tutorial [Learn Javascript](https://gitbookio.gitbooks.io/JavaScript)
  with small exercises
- Book [Eloquent JavaScript](https://eloquentjavascript.net/)
- Book [Human JavaScript](http://read.humanjavascript.com/)
- an entire collection of free JavaScript books at the
  [Free Frontend](https://freefrontend.com/javascript-books/) site
- [The Modern JavaScript Tutorial](https://javascript.info/) teaches you both
  JavaScript and HTML programming, and is available in several translations

You can also learn JavaScript by watching these videos:

- [Learn JavaScript - Full Course for Beginners](https://www.youtube.com/watch?v=PkZNo7MFNFg)
  from freeCodeCamp
- [Learn JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
  by CodeAcademy

## <Icon name="angle-right"></Icon> So what benefits would one get for converting one's unit tests from Karma or Jest to Cypress?

Unit tests are not something we are really trying to solve right now. Most of
the `cy` API commands are useless in unit tests. The biggest benefit of writing
unit tests in Cypress is that they run in a browser, which has debugger support
built in.

We have internally experimented at doing DOM based component unit testing in
Cypress - and that has the possibility of being an excellent "sweet spot" for
unit tests. You'd get full DOM support, screenshot support, snapshot testing,
and you could then use other `cy` commands (if need be). But as I mentioned this
isn't something we're actively pushing; it remains a thing that's possible if we
wanted to go down that route.

With that said - we actually believe the best form of testing in Cypress is a
combination of a "unit test" mixed with an "e2e test". We don't believe in a
"hands off" approach. We want you to modify the state of your application, take
shortcuts as much as possible (because you have native access to all objects
including your app). In other words, we want you to think in unit tests while
you write integration tests.

## <Icon name="angle-right"></Icon> When should I write a unit test and when should I write an end-to-end test?

We believe unit tests and end-to-end tests have differences that should guide
your choice.

| Unit tests                             | End-to-end tests                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| Focus on code                          | Focus on the features                                                        |
| Should be kept short                   | Can be long                                                                  |
| Examine the returned result of actions | Examine side effect of actions: DOM, storage, network, file system, database |
| Important to developer workflow        | Important to end user's workflow                                             |

In addition to the above differences, below are a few rules of thumb to decide
when to write a unit test and when to write an end-to-end test.

- If the code you are trying to test is called from other code, use a unit test.
- If the code is going be called from the external system, like a browser, use
  an end-to-end test.
- If a unit test requires a lot of mocking and you have to bring tools like
  `jsdom`, `enzyme`, or `sinon.js` to simulate a real world environment, you may
  want to rewrite it as an end-to-end test.
- If an end-to-end test does _not_ go through the browser and instead calls the
  code directly, you probably want to rewrite it as a unit test

Finally, unit and end-to-end tests are not _that_ different and have common
features. Good tests:

- Focus on and test only one thing.
- Are flake-free and do not fail randomly.
- Give you confidence to refactor code and add new features.
- Are able to run both locally and on a
  [continuous integration](/guides/continuous-integration/introduction) server.

Certainly, unit and end-to-end tests are NOT in opposition to each other and are
complementary tools in your toolbox.

## <Icon name="angle-right"></Icon> How do I convince my company to use Cypress?

First, be honest with yourself -
[is Cypress the right tool](/guides/overview/why-cypress) for your company and
your project? We believe that the best approach is a "bottoms up" approach,
where you can demonstrate how Cypress solves your company's particular needs.
Implement a prototype with your project to see how it feels. Test a couple of
common user stories. Identify if there are any technical blockers. Show the
prototype to others before proceeding any further. If you can demonstrate the
benefits of using Cypress as a developer tool for your project to other
engineers, then Cypress will likely be more quickly adopted.

## <Icon name="angle-right"></Icon> How can I find out about new versions of Cypress?

We publish our releases at GitHub and Npm, together with the releases we also
publish a changelog with the principal changes, fixes, and updates. You can
follow through these links:

- [GitHub (Releases & changelog)](https://github.com/cypress-io/cypress/releases)
- [npm (Releases)](https://www.npmjs.com/package/cypress)
- [Changelog at Cypress Docs](/guides/references/changelog)

## <Icon name="angle-right"></Icon> How often are Cypress versions released?

We schedule releases of Cypress on Monday every two weeks. This new version
includes any bugfixes and/or features that have been completed by that time. You
can see all issues merged into the default code branch but not yet released by
looking at the issues with the label
[stage: pending release](https://github.com/cypress-io/cypress/issues?q=label%3A%22stage%3A+pending+release%22+is%3Aclosed).

We schedule major releases with breaking changes approximately every 3 months.

If there is a significant bug outside of our release schedule then we release a
patch as soon as possible.

## <Icon name="angle-right"></Icon> What information is captured or transmitted when using Cypress?

Cypress runs locally so no data is sent to Cypress aside from exception data,
which can be disabled using the instructions
[here](https://docs.cypress.io/guides/references/advanced-installation#Opt-out-of-sending-exception-data-to-Cypress).

## <Icon name="angle-right"></Icon> Can I write API tests using Cypress? <E2EOnlyBadge />

Cypress is mainly designed to run end-to-end and component tests, but if you
need to write a few tests that call the backend API using the
[`cy.request()`](/api/commands/request) command ... who can stop you?

```js
it('adds a todo', () => {
  cy.request({
    url: '/todos',
    method: 'POST',
    body: {
      title: 'Write REST API',
    },
  })
    .its('body')
    .should('deep.contain', {
      title: 'Write REST API',
      completed: false,
    })
})
```

Take a look at our
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) that
uses quite a few such tests to verify the backend APIs.

You can verify the responses using the built-in assertions and perform multiple
calls. You can even write E2E tests that combine UI commands with API testing as
needed:

```js
it('adds todos', () => {
  // drive the application through its UI
  cy.visit('/')
  cy.get('.new-todo')
    .type('write E2E tests{enter}')
    .type('add API tests as needed{enter}')
  // now confirm the server has 2 todo items
  cy.request('/todos')
    .its('body')
    .should('have.length', 2)
    .and((items) => {
      // confirm the returned items
    })
})
```

Take a look at
[Add GUI to your E2E API tests](https://www.cypress.io/blog/2017/11/07/add-gui-to-your-e2e-api-tests/)
blog post, then at [cy-api](https://github.com/bahmutov/cy-api) plugin that
pipes the request and response objects into Cypress GUI for easier debugging.

A good strategy for writing targeted API tests is to use them to reach the
hard-to-test code not covered by other tests. You can find such places in the
code using the [code coverage](/guides/tooling/code-coverage) as a guide. Watch
the
[Ship safer code with Cypress and Codecov](https://www.cypress.io/blog/2021/01/22/webcast-recording-ship-safer-code-with-cypress-and-codecov/)
webinar where we show how to apply this strategy and reach the 100% fullstack
code coverage via mostly E2E tests and a few targeted API and unit tests.

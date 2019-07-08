---
layout: toc-top
title: General Questions
containerClass: faq
---

## {% fa fa-angle-right %} Is Cypress free and open source?

The {% url "Test Runner" test-runner %} is a free, downloadable and open source (MIT license) application. This is always free to use. Our {% url "Dashboard Service" dashboard-service %} is a web application that offers a variety of billing plans (including a free, open source plan) for when you want to record your test runs in CI.

Please see our {% url 'Pricing Page' https://www.cypress.io/pricing %} for more details.

## {% fa fa-angle-right %} What operating systems do you support?

You can {% url "install Cypress" installing-cypress %} on Mac, Linux, and Windows. For additional information, please see our {% url "System requirements"  installing-cypress#System-requirements %}.

## {% fa fa-angle-right %} Do you support native mobile apps?

Cypress will never be able to run on a native mobile app, but we do intend to support mobile web browsers in the future. Down the road we'll likely have first class support for this, but today it is not a current priority. Cypress can test JavaScript code in hybrid mobile platforms like Ionic.
Currently our users use Cypress to control the viewport with the {% url `cy.viewport()` viewport %} command to test responsive, mobile views in a website or web application.

## {% fa fa-angle-right %} How is this different from 'X' testing tool?

The Cypress Test Runner is a hybrid application/framework/service all rolled into one. It takes a little bit of other testing tools, brings them together and improves on them.

### Mocha

 Mocha is a testing framework for JavaScript. {% url "Mocha" http://mochajs.org/ %} gives you the `it`, `describe`, `beforeEach` methods. Cypress isn't **different** from Mocha, it actually **uses** Mocha under the hood. All of your tests will be written on top of Mocha's `bdd` interface.

### Karma

A unit testing runner for JavaScript, {% url "Karma" http://karma-runner.github.io/ %}, works with either {% url "Jasmine" https://jasmine.github.io/ %}, {% url "Mocha" http://mochajs.org/ %}, or any other JavaScript testing framework.

Karma also watches your JavaScript files, live reloads when they change, and is also the `reporter` for your tests failing / passing. It runs from the command line.

Cypress essentially replaces Karma because it does all of this already and much more.

### Capybara

The `Ruby` specific tool that allows you to write integration tests for your web application is {% url "Capybara" http://teamcapybara.github.io/capybara/ %}. In the Rails world, this is the *go-to* tool for testing your application. It uses {% url "Sauce Labs" https://SauceLabs.com/ %} (or another headless driver) to interact with browsers. Its API consists of commands that query for DOM elements, perform user actions, navigate around, etc.

Cypress essentially replaces Capybara because it does all of these things and much more. The difference is that instead of testing your application in a GUI-less console, you would see your application at all times. You'd never have to take a screenshot to debug because all commands instantly provide you the state of your application while they run. Upon any command failing, you'll get a human-readable error explaining why it failed. There's no "guessing" when debugging.

Oftentimes Capybara begins to not work as well in complex JavaScript applications. Additionally, trying to TDD your application is often difficult. You often have to resort to writing your application code first (typically manually refreshing your browser after changes) until you get it working. From there you write tests, but lose the entire value of TDD.

### Protractor

Using {% url "Protractor" http://www.protractortest.org/ %} provides a nice Promise-based interface on top of Selenium, which makes it easy to deal with asynchronous code. Protractor comes with all of the features of Capybara and essentially suffers from the same problems.

Cypress replaces Protractor because it does all of these things and much more. One major difference is that Cypress enables you to write your unit tests and integration tests in the same tool, as opposed to splitting up this work across both Karma and Protractor.

Also, Protractor is very much focused on `AngularJS`, whereas Cypress is designed to work with any JavaScript framework. Protractor, because it's based on Selenium, is still pretty slow, and is prohibitive when trying to TDD your application. Cypress, on the other hand, runs at the speed your browser and application are capable of serving and rendering, there is no additional bloat.

### Sauce Labs

Using {% url "Sauce Labs" https://SauceLabs.com/ %} enables Selenium-based tests to be run across various browsers and operating systems. Additionally, they have a JavaScript Unit Testing tool that isn't Selenium focused.

Sauce Labs also has a `manual testing` mode, where you can remotely control browsers in the cloud as if they were installed on your machine.

Ultimately Sauce Labs and Cypress offer very different value propositions. Sauce Labs doesn't help you write your tests, it takes your existing tests and runs them across different browsers and aggregates the results for you.

Cypress on the other hand **helps** you write your tests. You would use Cypress every day, building and testing your application, and then use Sauce Labs to ensure your application works on every browser.

{% note info A note about Cypress and Sauce Labs %}
Cypress' API is written to be completely compatible for integration with Sauce Labs. It is our goal to offer full integration with Sauce Labs in the future, however, complete integration is not yet available.
{% endnote %}

## {% fa fa-angle-right %} Do you support X language or X framework?

Any and all. Ruby, Node, C#, PHP - none of that matters. Cypress tests anything that runs in the context of a browser. It is back end, front end, language and framework agnostic.

You'll write your tests in JavaScript, but beyond that Cypress works everywhere.

## {% fa fa-angle-right %} Can I run Cypress on another browser other than Chrome?

You can read about our currently available browsers {% url "here" launching-browsers %}.

## {% fa fa-angle-right %} Will Cypress work in my CI provider?

Cypress works in any {% url "CI provider" continuous-integration %}.

## {% fa fa-angle-right %} Does Cypress require me to change any of my existing code?

No. But if you're wanting to test parts of your application that are not easily testable, you'll want to refactor those situations (as you would for any testing).

## {% fa fa-angle-right %} Does Cypress use Selenium / Webdriver?

No. In fact Cypress' architecture is very different from Selenium in a few critical ways:

- Cypress runs in the context of the browser. With Cypress it's easier to inspect what is running in the browser, but harder to talk to the outside world. In Selenium it's the exact opposite. Selenium runs outside of the browser where your application is running. Although Cypress is adding more commands every day that give you access to the outside world - like {% url `cy.request()` request %}, {% url `cy.exec()` exec %}, and {% url `cy.task()` task %}.
- With Selenium you get either 100% simulated events (with Selenium RC) or 100% native events (with Selenium WebDriver). With Cypress, you get both. For the most part we use simulated events. However we do use automation APIs for things like Cookies where we extend outside of the JavaScript sandbox and interact with the underlying browser APIs. This gives us flexibility to determine which type of event to use in specific situations. Native event support is on our {% url "roadmap" roadmap %}.

## {% fa fa-angle-right %} If Cypress runs in the browser, doesn't that mean it's sandboxed?

Yes, technically; it's sandboxed and has to follow the same rules as every other browser. That's actually a good thing because it doesn't require a browser extension, and it naturally will work across all browsers (which enables cross-browser testing).

But Cypress is actually way beyond just a basic JavaScript application running in the browser. It is also a desktop application and communicates with back end web services.

All of these technologies together are coordinated and enable Cypress to work, which extends its capabilities far outside of the browser sandbox. Without these, Cypress would not work at all. For the vast majority of your web development, Cypress will work just fine, and already *does* work.

## {% fa fa-angle-right %} We use WebSockets, will Cypress work with that?

Yes.

## {% fa fa-angle-right %} We have the most complex most outrageous authentication system ever, will Cypress work with that?

If you're using some complex thumb-print, retinal-scan, time-based, key-changing, microphone, audial, decoding mechanism to log in your users, then no, Cypress won't work with that.  But seriously, Cypress is a *development* tool, which makes it easy to test your web applications. If your application is doing 100x things to make it extremely difficult to access, Cypress won't magically make it any easier.

Because Cypress is a development tool, you can always make your application more accessible while in your development environment. If you want, disable complex steps in your authentication systems while you're in your testing environment. After all, that's why we have different environments! Normally you already have a development environment, a testing environment, a staging environment, and a production environment.  So expose the parts of your system you want accessible in each appropriate environment.

In doing so, Cypress may not be able to give you 100% coverage without you changing anything, but that's okay. Just use different tools to test the crazier, less accessible parts of your application, and let Cypress test the other 99%.

Just remember, Cypress won't make a non-testable application suddenly testable. It's on your shoulders to architect your code in an accessible manner.

## {% fa fa-angle-right %} Is it possible to use cypress on `.jspa`?
Yes. Cypress works on anything rendered to a browser.

## {% fa fa-angle-right %} Can I use Cypress to script user-actions on an external site like `gmail.com`?

No. There are already lots of tools to do that. Using Cypress to test against a 3rd party application is not its intended use. It *may* work but will defeat the purpose of why it was created. You use Cypress *while* you develop your application, it helps you write your tests.

## {% fa fa-angle-right %} Is there code coverage?

There is nothing currently built into Cypress to do this. Adding code coverage around end-to-end tests is much harder than unit tests and it may not be feasible to do in a generic way. You can read in more detail about code coverage {% issue 346 'here' %}. You may find some other coverage utilities useful when writing end-to-end tests like:

- {% url "element coverage" https://glebbahmutov.com/blog/element-coverage/ %}
- {% url "application state coverage" https://glebbahmutov.com/blog/hyperapp-state-machine/ %}

## {% fa fa-angle-right %} Are there driver bindings in my language?

Cypress does *not* utilize WebDriver for testing, so it does not use or have any notion of driver bindings. If your language can be somehow transpiled to JavaScript, then you can configure {% url "Cypress webpack preprocessor" https://github.com/cypress-io/cypress-webpack-preprocessor %} or {% url "Cypress Browserify preprocessor" https://github.com/cypress-io/cypress-browserify-preprocessor %} to transpile your tests to JavaScript that Cypress can run.

## {% fa fa-angle-right %} So what benefits would one get for converting one's unit tests from Karma or Jest to Cypress?

Unit tests are not something we are really trying to solve right now. Most of the `cy` API commands are useless in unit tests. The biggest benefit of writing unit tests in Cypress is that they run in a browser, which has debugger support built in.

We have internally experimented at doing DOM based component unit testing in Cypress - and that has the possibility of being an excellent "sweet spot" for unit tests. You'd get full DOM support, screenshot support, snapshot testing, and you could then use other `cy` commands (if need be). But as I mentioned this isn't something we're actively pushing, it just remains a thing that's possible if we wanted to go down that route.

With that said - we actually believe the best form of testing in Cypress is a combination of a "unit test" mixed with an "e2e test". We don't believe in a "hands off" approach. We want you to modify the state of your application, take shortcuts as much as possible (because you have native access to all objects including your app). In other words, we want you to think in unit tests while you write integration tests.

## {% fa fa-angle-right %} When should I write a unit test and when should I write an end-to-end test?

We believe unit tests and end-to-end tests have differences that should guide your choice.

| Unit tests | End-to-end tests |
| --- | ---- |
| Focus on code | Focus on the features |
| Should be kept short | Can be long |
| Examine the returned result of actions | Examine side effect of actions: DOM, storage, network, file system, database |
| Important to developer workflow | Important to end user's workflow |

In addition to the above differences, below are a few rules of thumb to decide when to write a unit test and when to write an end-to-end test.

- If the code you are trying to test is called from other code, use a unit test.
- If the code is going be called from the external system, like a browser, use an end-to-end test.
- If a unit test requires a lot of mocking and you have to bring tools like `js-dom`, `enzyme`, or `sinon.js` to simulate a real world environment, you may want to rewrite it as an end-to-end test.
- If an end-to-end test does *not* go through the browser and instead calls the code directly, you probably want to rewite it as a unit test

Finally, unit and end-to-end tests are not _that_ different and have common features. Good tests:

- Focus on and test just one thing.
- Are flake-free and do not fail randomly.
- Give you confidence to refactor code and add new features.
- Are easy to run both locally and on a {% url "continuous integration" continuous-integration %} server.

Certainly, unit and end-to-end tests are NOT in opposition to each other and are complementary tools in your toolbox.

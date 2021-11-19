---
title: Bundled Tools
---

<Alert type="info">

Cypress relies on many best-of-breed open source testing libraries to lend
stability and familiarity to the platform from the get-go. If you've been
testing in JavaScript, you'll recognize many old friends in this list.
Understand how we exploit them and hit the ground running with Cypress!

</Alert>

## Mocha

<Icon name="github"></Icon> [http://mochajs.org/](http://mochajs.org/)

Cypress has adopted Mocha's `bdd` syntax, which fits perfectly with both
integration and unit testing. All of the tests you'll be writing sit on the
fundamental harness Mocha provides, namely:

- [`describe()`](http://mochajs.org/#bdd)
- [`context()`](http://mochajs.org/#bdd)
- [`it()`](http://mochajs.org/#bdd)
- [`before()`](http://mochajs.org/#hooks)
- [`beforeEach()`](http://mochajs.org/#hooks)
- [`afterEach()`](http://mochajs.org/#hooks)
- [`after()`](http://mochajs.org/#hooks)
- [`.only()`](http://mochajs.org/#exclusive-tests)
- [`.skip()`](http://mochajs.org/#exclusive-tests)

Additionally, Mocha gives us excellent
[`async` support](http://mochajs.org/#asynchronous-code). Cypress has extended
Mocha, sanding off the rough edges, weird edge cases, bugs, and error messages.
These fixes are all completely transparent.

<Alert type="info">

[Check out our guide to writing and organizing tests.](/guides/core-concepts/writing-and-organizing-tests)

</Alert>

## Chai

<Icon name="github"></Icon> [http://chaijs.com/](http://chaijs.com/)

While Mocha provides us a framework to structure our tests, Chai gives us the
ability to easily write assertions. Chai gives us readable assertions with
excellent error messages. Cypress extends this, fixes several common pitfalls,
and wraps Chai's DSL using
[subjects](/guides/core-concepts/introduction-to-cypress#Assertions) and the
[`.should()`](/api/commands/should) command.

> <Icon name="chevron-right"></Icon> > [List of available Chai Assertions](/guides/references/assertions#Chai)

## Chai-jQuery

<Icon name="github"></Icon>
[https://github.com/chaijs/chai-jquery](https://github.com/chaijs/chai-jquery)

When writing integration tests, you will likely work a lot with the DOM. Cypress
brings in Chai-jQuery, which automatically extends Chai with specific jQuery
chainer methods.

> <Icon name="chevron-right"></Icon> > [List of available Chai-jQuery Assertions](/guides/references/assertions#Chai-jQuery)

## Sinon.JS

<Icon name="github"></Icon> [http://sinonjs.org/](http://sinonjs.org/)

When writing unit tests, or even in integration-like tests, you often need to
ability to stub and spy methods. Cypress includes two methods,
[`cy.stub()`](/api/commands/stub) and [`cy.spy()`](/api/commands/spy) that
return Sinon stubs and spies, respectively.

Cypress also exposes a utility so that `sinon` can be called anywhere inside of
your tests using [`Cypress.sinon`](/api/utilities/sinon).

<Alert type="info">

[Check out our guide for working with spies, stubs, and clocks.](/guides/guides/stubs-spies-and-clocks)

</Alert>

## Sinon-Chai

<Icon name="github"></Icon>
[https://github.com/cypress-io/sinon-chai](https://github.com/cypress-io/sinon-chai)

When working with `stubs` or `spies` you'll regularly want to use those when
writing Chai assertions. Cypress bundles in Sinon-Chai which extends Chai
allowing you to [write assertions](https://github.com/cypress-io/sinon-chai)
about `stubs` and `spies`.

> <Icon name="chevron-right"></Icon> > [List of available Sinon-Chai Assertions](/guides/references/assertions#Sinon-Chai)

## Other Library Utilities

Cypress also bundles the following tools on the `Cypress` object. These can be
used anywhere inside of your tests.

- [`Cypress._`](/api/utilities/_) (lodash)
- [`Cypress.$`](/api/utilities/$) (jQuery)
- [`Cypress.minimatch`](/api/utilities/minimatch) (minimatch.js)
- [`Cypress.Blob`](/api/utilities/blob) (Blob utils)
- [`Cypress.Promise`](/api/utilities/promise) (Bluebird)

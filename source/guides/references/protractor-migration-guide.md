---
title: Protractor Migration Guide
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- Benefits of using Cypress in Angular apps
- How Cypress can create reliable e2e tests for Angular apps
- How to migrate Protractor tests into Cypress
{% endnote %}


# Introduction

Considering using Cypress but unsure of whether the migration is worth it for your Angular app? We got you covered here with this migration guide to help transition from Protractor to Cypress. 

{% note warning %}
If you see any inaccuracies with this or feel something has been misrepresented, please {% url "submit an issue here" https://github.com/cypress-io/cypress-documentation/issues/new %}.
{% endnote %}

To start, let's take a quick look at a common test case scenario: allowing a user to sign up for a new account.

**Before: Protractor**

```javascript
describe('Authorization tests', () => {
  it('allows the user to signup for a new account', () => {
    browser.get('/signup')
    element(by.css('#email-field')).sendKeys('user@email.com')
    element(by.css('#confirm-email-field')).sendKeys('user@email.com')
    element(by.css('#password-field')).sendKeys('testPassword1234')
    element(by.cssContainingText('button', 'Create new account')).click()

    expect(browser.getCurrentUrl()).toEqual('/signup/success')
  })
})
```

**After: Cypress**

```javascript
describe('Authorization Tests', () => {
  it('allows the user to signup for a new account', () => {
    cy.visit('/signup')
    cy.get('#email-field').type('user@email.com')
    cy.get('#confirm-email-field').type('user@email.com')
    cy.get('#password-field').type('testPassword1234')
    cy.get('button')
      .contains('Create new account')
      .click()

    cy.url().should('include', '/signup/success')
  })
})
```

## Why Choose Cypress over Protractor?

A common question when teams are considering migrating to a different tool is why choose a different tool when something like Protractor is created specifically for Angular. After all, isn't a tailored tool to the framework better than something more generic like Cypress? 

While this logic holds true in many tool evaluations, end-to-end testing is different because **the value of end-to-end testing resides in ensuring that what the user will see and use on production works**. In other words, whether your application is created using AngularJS, Angular 2, or Angular 9, users will be unaware of this detail. After all, at the end of the day, the user cares primarily about one thing: "Does it work?"

## Benefits of Using Cypress

As many developers can attest to, end-to-end testing is one of those things that they know they *should* do; but often do not. Or if they do run tests, the tests are often flaky and often very expensive due to how long it can take to run. And while there are often ideals of complete code coverage, the realities of business and deadlines often take precedence and the tests are left unwritten, or worse, ignored when errors are being reported because they are not reliable. With Cypress, not only will your tests be reliable, but it provides developers with tools that make e2e testing an asset to development rather than a hindrance.

### Interact with your tests in a browser

When Protractor runs tests, the browser automation launches a browser instance and often runs through tests too fast for the human eye. Without additional configuration, this often leads to a reliance on lengthy terminal errors that can be expensive from a context-switching perspective.

{% video local /img/snippets/cypress-interactive-debugging.mp4 %}

### Faster feedback loops

When it comes to your end-to-end tests, being able to see your tests as they run is critical to allowing you to iterate faster with confidence. Though this is not possible out of the box with Protractor, Cypress tests {% url "automatically re-run within the browser whenever test files are saved" writing-and-organizing-tests#Watching-tests %} which allows you to iterate faster with confidence.

### Time travel through tests

Rather than trying to decipher errors inside of your terminal, with Cypress you can debug your tests just like you would debug your application normally. In addition, Cypress allows you to {% url "see snapshots of your Angular application" test-runner#Hovering-on-Commands %} as the test is executed so you can debug your applications more easily.

### Easily automate screenshots

Another powerful feature of end-to-end testing is the ability to {% url "capture screenshots and video recording" screenshots-and-videos %}. While possible in both tools, Protractor requires you to manually tap into Node.js and has limited configuration options.

**Before: Protractor**

```javascript
const fs = require('fs')

describe('Dashboard', () => {
  it('should render dashboard', () => {
    browser.get('/dashboard')
    browser.takeScreenshot().then((png) => {
      const stream = fs.createWriteStream(filename)

      writeScreenShot(png, 'dashboard.png')
      // eslint-disable-next-line
      stream.write(new Buffer(png, 'base64'))
      stream.end()
    })
  })
})
```

**After: Cypress**

```javascript
describe('Dashboard', () => {
  it('should render dashboard', () => {
    cy.visit('/dashboard')
    cy.screenshot('dashboard.png')
  })
})
```

For more information on what configuration options are available, be sure to check out the {% url "official Cypress documentation on the `cy.screenshot()` command" screenshot %}.

## FAQs

### Do I have to replace all of my tests with Cypress immediately?

Absolutely not. While it might sound ideal to replace Protractor entirely, we know that most projects and teams still need to deliver features to customers and it's unrealistic to halt the team's progress.

### Can Protractor and Cypress coexist in the same app?

Yes! Your Protractor tests would continue to live in the `e2e` directory that Angular CLI scaffolded while all Cypress tests would live in a sibling folder named `cypress` in the root of your project, but can be {% url "configured" configuration#Folders-Files %} to another directory.

```text
📁 cypress
📁 e2e
📁 src
📄 .editorconfig
📄 .gitignore
📄 angular.json
📄 browserslist
📄 cypress.json
📄 karma.conf.js
📄 package.json
📄 README.md
📄 tsconfig.app.json
📄 tsconfig.json
📄 tsconfig.spec.json
📄 tslint.json
```

In fact, as you work through migrating to Cypress, we believe that progressively enhancing your e2e tests with Cypress is the best path forward to ensure that feature development is not impacted.

# Getting Started

Like any library you would add to your application, we start by {% url "adding it as a dependency" installing-cypress#Installing %} to our `package.json`.

```shell
npm install cypress -D

Then, since Cypress can run in parallel with your application, let's install {% url "Concurrently" https://github.com/kimmobrunfeldt/concurrently %} to simplify our npm script.

```shell
npm install concurrently -D

Then we will update our `package.json` with a script to run Cypress and your Angular app simultaneously:

```js
"cypress": "concurrently \"ng serve\" \"cypress open\""
```

```js
// Example config in package.json
{
  "scripts": {
    ...
    "e2e": "ng e2e",
    "cypress:open": "concurrently \"ng serve\" \"cypress open\""
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

Now, when we run:

```bash
npm run cypress:open
```

It will start up Cypress and our Angular app at the same time!

{% video local /img/snippets/npm-run-cypress.mp4 %}

# Essentials

## How to Get DOM Elements

### Getting a single element on the page

When it comes to e2e tests, one of the most common things you'll need to do is query one or more HTML elements on a page. Rather than split element fetching into multiple methods that you need to memorize, everything can be accomplished with {% url "`cy.get()`" get %} while using specific selectors to account for all use cases.

**Before: Protractor**

```js
// Get an element
element(by.tagName('h1'))

/// Get an element using a CSS selector.
element(by.css('.my-class'))

// Get an element with the given id.
element(by.id('my-id'))

// Get an element using an input name selector.
element(by.name('field-name'))
```

**After: Cypress**

```js
// Get an element
cy.get('h1')

// Get an element using a CSS selector.
cy.get('.my-class')

// Get an element with the given id.
cy.get('#my-id')

// Get an element using an input name selector.
cy.get('input[name="field-name"]')
```

### Getting multiple elements on a page

When you want to get access to more than one element on the page, you would need to chain the `.all()` method. However, in Cypress, no syntax change is necessary!

**Before: Protractor**

```js
// Get all list-item elements on the page
element.all(by.tagName('li'))

/// Get all elements by using a class selector.
element.all(by.css('.list-item'))

// Find an element using an input name selector.
element.all(by.name('field-name'))
```

**After: Cypress**

```js
// Get all list-item elements on the page
cy.get('li')

/// Get all elements by using a class selector.
cy.get('.list-item')

// Find an element using an input name selector.
cy.get('input[name="field-name"]')
```

You can learn more about how to {% url "get DOM elements in our official documentation" get %}.

## How to Interact with DOM Elements

**Before: Protractor**

```jsx
// Click on the element
element(by.css('button')).click()

// Send keys to the element (usually an input)
element(by.css('input')).sendKeys('my text')

// Clear the text in an element (usually an input).
element(by.css('input')).clear()

// Get the attribute of an element
// Example: Get the value of an input
element(by.css('input')).getAttribute('value')
```

**After: Cypress**

```jsx
// Click on the element
cy.get('button').click()

// Type in an element (usually an input)
cy.get('input').type('my text')

// Clear the text in an element (usually an input)
cy.get('input').clear()

// Get the attribute of an element
// Example: Get the value of an input
cy.get('input').invoke('val')
```

You can learn more about {% url "interacting with DOM elements in our official documentation" interacting-with-elements %}.

## Assertions

Similar to Protractor, Cypress enables to use human readable assertions.

**Before: Protractor**

```js
describe('verify elements on a page', () => {
  it('verifies that a link is visible', () => {
    expect($('a.submit-link').isDisplayed()).toBe(true)
  })
})
```

**After: Cypress**

```js
describe('verify elements on a page', () => {
  it('verifies that a link is visible', () => {
    cy.get('a.submit-link').should('be.visible)
  })
})
```

But Cypress has one additional feature that can make a critical difference in the reliability of your tests' assertions: {% url "retry-ability" retry-ability %}. When your test fails an assertion or command, Cypress will mimic a real user with build-in wait times and multiple attempts at asserting your tests in order to minimize the amount of false negatives / positives. 

In the example above, if the submit link does not appear on the page at the exact moment when Protractor runs the test (which can be due to any number of factors including API calls, slow browser rendering, etc.), your test will fail. However, Cypress factors these conditions into its assertions and will only fail if the time goes beyond the {% url "command timeout" configuration#Timeouts %}.

You can learn more about how Cypress handles {% url "assertions in our official documentation" assertions %}.

## Network Spies

By default, Protractor utilizes Jasmine's `spyOn` function to call a method and test that it was called.

```js
// paymentApi.js
export default {
  submit() { ... }
}
```

**Before: Protractor**

```js
import paymentApi from './paymentApi.js'

describe('Protractor payment example', () => {
  it('verifies payment is only sent once', () => {
    spyOn(paymentApi, 'submit')
    browser.get('/payment')
    expect(paymentApi.submit).toHaveBeenCalledTimes(1)
  })
})
```

Fortunately for us, creating a spy in Cypress is almost identical!

**After: Cypress**

```js
describe('Cypress payment example', () => {
  it('verifies payment is only sent once', () => {
    cy.spy(paymentApi, 'submit')
    cy.visit('/payment').then(() => {
      expect(paymentApi.submit).to.have.been.called.once
   }
  })
})
```

For more information, check out our {% url "official documentation on spies" spy %}.

## Stubbing

In Protractor, stubbing is a complex topic where many resources recommend the `browser.addMockModules()` method to stub behaviors. This requires a lot of manual configuration and can lead to an additional dependency that you need to maintain. With Cypress however, there is a built-in method to allow you to stub network requests: {% url "`cy.stub()`" stub %}.

**Before: Protractor**

```js
// Unable to get this to work just yet
describe('show stubbing example', () => {
  it('stubs a call to the login API', () => {
    browser.addMockModule('modName', function() {
      🔥 angular.module('modName', []).value('foo', 'bar');
    });		
  })
})
```

**After: Cypress**

```js
describe('show stubbing scaffold', () => {
  it('stubs a call to the login API', () => {
    cy.stub(api, 'login').resolves('user-id-123')
  })
})
```

With the {% url "`cy.stub()`" stub %} method, you can easily replace a function, record its usage, and even control its behavior.

For more information, check out our {% url "official documentation on stubbing" stub %}.

## Navigating Websites

When you want to visit a page, you can do so with the following code:

**Before: Protractor**

```js
it('visits a page', () => {
  browser.get('/about')
  browser.navigate().forward()
  browser.navigate().back()
})
```

**After: Cypress**

```js
it('visit a non-Angular page', () => {
  cy.visit('http://localhost:4200/about')
  cy.go('forward')
  cy.go('back')
})
```

However, Protractor assumes that all websites you want to visit are Angular apps. As a result, you have to take an extra step to disable this behavior when visiting a non-Angular page. When you write Cypress tests though, you don't need to do any extra work!

**Before: Protractor**

```js
it('visit a non-Angular page', () => {
  browser.waitForAngularEnabled(false)
  browser.get('/about')
})
```

**After: Cypress**

```js
it('visit a non-Angular page', () => {
  cy.visit('/about')
})
```

# Workflows

## Debugging Tests

In Protractor, per {% url "the official docs" https://github.com/angular/protractor/blob/master/docs/debugging.md#disabled-control-flow %}, the process for debugging your tests interactively involves a few steps:

1. Add `debugger` keyword to the test case that you want to debug

**Before: Protractor**

```js
describe('example test suite', () => 
  it('contains an error we need to debug', () => {
    browser.get('/login')
    debugger
    element(by.css('#password-field')).sendKeys('testPassword1234')
  })
})
```

2. Set the inspector agent with a breakpoint flag and a config file
3. Use Chrome's DevTools devices to locate the correct target 

With Cypress however, because your tests are available through the browser, you can debug with developer tools without any additional configuration. Rather than rely solely on the `debugger` keyword, Cypress allows you to debug specific stages of your test by chaining the {% url "`.debug()`" debug %} command!

**After: Cypress**

```js
describe('example test suite', () => {
  it('contains an error we need to debug', () => {
    cy.visit('/login')
    cy.get('#password-field')).debug().sendKeys('testPassword1234')
  })
})
```

For more information, check out our {% url "official documentation on debugging" debugging %}!

## Parallelization

One of the worst things that can happen to a developer is to be forced to wait for a 2 hour end-to-end test suite to finish before verifying something works. Instead, the {% url "Cypress Dashboard Service" dashboard-introduction %} allows your tests to run {% url "in parallel" parallelization %}. If your longest test only takes a minute to run, this means that you've just cut down your testing by over 12,000%!

This feature is available in Protractor and requires you to configure your application with multiple options (i.e., `sharedTestFiles`, `maxInstances`, etc.). An example is provided below:

**Before: Protractor**

```js
// Example from https://developers.perfectomobile.com/display/PD/Protractor+parallel+execution
// An example configuration file.
exports.config = {

  seleniumAddress: 'https://cloudName.perfectomobile.com/nexperience/perfectomobile/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome',

    // allows different specs to run in parallel.
    // If this is set to be true, specs will be sharded by file
    // (i.e. all files to be run by this set of capabilities will run in parallel).
    // Default is false.
    sharedTestFiles: true,

    // Maximum number of browser instances that can run in parallel for this
    // set of capabilities. This is only needed if shardTestFiles is true.
    // Default is 1.
    maxInstances: 2,

    // Cloud capabilities
    user: 'user@perfectomobile.com',
    password: 'password',

    // Device capabilities
    platformName: 'Android',
    manufacturer: 'Samsung',
    model: 'Galaxy S5'
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['spec.js', 'spec2.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
}
```

However, with Cypress, you can pass the {% url "`--parallel`" command-line#cypress-run-parallel %} and {% url "`--record`" command-line#cypress-run-record-key-lt-record-key-gt %} flag to `cypress run`, and your tests will automatically run in parallel:

**After: Cypress**

```shell
cypress run --record --parallel
```

For more information, check out our {% url "official docs on parallelization" parallelization %}!

## Element Explorer

For those who are big fans of {% url "Protractor's Element Explorer functionality" https://www.protractortest.org/#/debugging#enabled-control-flow %}, Cypress also provides you with a Selector Playground that allows you to:

- Determine a unique selector for an element
- See what elements match a given selector
- See what element matches a string of text

For more information, check out our official docs on the {% url "Selector Playground" test-runner#Selector-Playground %}.

# Next Steps

For more information on how to create end-to-end tests with Cypress, be sure to check out {% url "our official documentation here" why-cypress %}.

{% note warning %}
If you see any inaccuracies with this or feel something has been misrepresented, please {% url "submit an issue here" https://github.com/cypress-io/cypress-documentation/issues/new %}.
{% endnote %}

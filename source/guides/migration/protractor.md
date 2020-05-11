---
title: Protractor Migration Guide
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- Benefits of using Cypress in Angular apps
- How Cypress can create reliable e2e tests for Angular apps
- How to migrate Protractor tests into Cypress
{% endnote %}


## Introduction

Considering using Cypress but worried about the obstacles that might get in your way when migrating from Protractor? We got you covered here with this comprehensive guide for migrating from Protractor to Cypress. 

If you see any inaccuracies with this or feel something has been misrepresented, please submit an issue here.

To start, let's take a quick look at a common test case scenario: allowing a user to sign up for a new account. We 

{% badge danger Before %} **Protractor**

```js
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

{% badge success After %} **Cypress**

```js
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

When Protractor runs tests, the browser automation launches a browser instance and often runs through tests too fast for the human eye. Without additional configuration, this often leads to over reliance on terminal errors to 

### Faster feedback loops

When it comes to your end-to-end tests, being able to see your tests as they run is critical to allowing you to iterate faster with confidence. Without additional configuration and dependencies, this is not possible out of the box with Protractor.

### Time travel through tests

Rather than trying to decipher errors inside of your terminal, with Cypress you can debug your tests just like you would debug your application normally. In addition, Cypress allows you to see snapshots of your Angular application as the test is executed so you can debug your applications more easily.

### Interactively debug your tests

Rather than wait to the end of development to write or verify tests to see if your codebase is valid, Cypress enables developers to do this in parallel workflows involve waiting until you're done with development 

### Easily automate screenshots

Another powerful feature of end-to-end testing is the ability to capture screenshots and recording. While possible in both tools, Protractor requires you to manually tap into Node.js and has limited configuration options. 

{% badge danger Before %} **Protractor**

```js
const fs = require('fs')

describe('Dashboard', () => {
  it('should render dashboard', () => {
    i
    browser.get('/dashboard')
    browser.takeScreenshot().then((png) => {
      const stream = fs.createWriteStream(filename)

      writeScreenShot(png, 'dashboard.png')
      stream.write(new Buffer(png, 'base64'))
      stream.end()
    })
  })
})
```

{% badge success After %} **Cypress**

```jsx
describe('Dashboard', () => {
  it('should render dashboard', () => {
	  cy.visit('/dashboard')
	  cy.screenshot('dashboard.png')
  })
})
```

For more information on what configuration options are available, be sure to check out the [official Cypress documentation on the screenshot command](https://docs.cypress.io/api/commands/screenshot.html).

## FAQs

### Do I have to replace all of my tests with Cypress immediately?

Absolutely not. While it might sound ideal to replace Protractor entirely, we know that most projects and teams still need to deliver features to customers and it's unrealistic to halt the team's progress.

### Can Protractor and Cypress coexist in the same app?

Yes! Your Protractor tests would continue to live in the `e2e` directory that Angular CLI scaffolded while all Cypress tests would live in a sibling folder named `cypress`.

```
.
├── cypress
├── e2e
├── src
├── .editorconfig
├── .gitignore
├── angular.json
├── browserslist
├── cypress.json
├── karma.conf.js
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
└── tslint.json
```

In fact, as you work through migrating to Cypress, we believe that progressively enhancing your e2e tests with Cypress is the best path forward to ensure that feature development is not impacted.

## Getting Started

Like any library you would add to your application, we start by adding it as a dependency to our `package.json`.

```
npm install cypress -D
```

Then, since Cypress can run in parallel with your application, let's install Concurrently to simplify our npm script.

```
npm install concurrently -D
```

Then we will update our `package.json` with the a script to run Cypress and your Angular app simultaneously:

```js
"cypress": "concurrently \"ng serve\" \"cypress open\""
```

```js
// Example config in package.json
{
  "scripts": {
    ...
    "e2e": "ng e2e",
    "e2e:debug": "node --inspect-brk ./node_modules/.bin/protractor ./e2e/protractor.conf.js",
    "cypress": "concurrently \"ng serve\" \"cypress open\""
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

Now, when we run:

```bash
npm run cypress
```

It will start up Cypress and our Angular app at the same time!

## Essentials

### How to Get DOM Elements

#### Getting a single element on the page

When it comes to e2e tests, one of the most common things you'll need to do is get one or more HTML elements on a page. Rather than split element fetching into multiple methods that you need to memorize, everything can be accomplished with `cy.get` while using CSS selectors to account for all use cases.

{% badge danger Before %} **Protractor**

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

{% badge success After %} **Cypress**

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

{% badge danger Before %} **Protractor**

```js
// Get all list-item elements on the page
element.all(by.tagName('li'))

/// Get all elements by using a CSS selector.
element.all(by.css('.list-item'))

// Find an element using an input name selector.
element.all(by.name('field-name'))
```

{% badge success After %} **Cypress**

```jsx
// Get all list-item elements on the page
cy.get('li')

/// Get all elements by using a CSS selector.
cy.get('.list-item')

// Find an element using an input name selector.
cy.get('input[name="field-name"]')
```

You can learn more about how to get DOM elements in our official documentation.

## How to Interact with DOM Elements

---

- Choose a common scenario
    - Filling out a form
    - Getting text values
    - Waiting for data to populate

{% badge danger Before %} **Protractor**

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

{% badge success After %} **Cypress**

```jsx
// Click on the element
cy.get('button').click()

// Send keys to the element (usually an input)
cy.get('input').type('my text')

// Clear the text in an element (usually an input)
cy.get('input').clear()

// Get the attribute of an element
// Example: Get the value of an input
cy.get('input').its('value')
```

You can learn more about [interacting with DOM elements in our official documentation](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html).

## Network Spies

By default, Protractor utilizes Jasmine's `spyOn` function to call a method and test that it was called.

```jsx
// paymentApi.js
export default {
  submit() { ... }
}
```

```jsx
// Protractor
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

```jsx
// Cypress
describe('Cypress payment example', () => {
  it('verifies payment is only sent once', () => {
    cy.spy(paymentApi, 'submit')
    cy.visit('/payment')
    expect(paymentApi.submit).to.have.been.called.once
  })
})
```

## Stubbing

Ran into a hard block with this since many code examples on blog posts don't seem to work in the Angular 9 codebase

Similar to how Protractor allows you to use the `browser.addMockModules()` method to stub behaviors such as API requests, Cypress allows you to do the same with `cy.stub()`.

```jsx
// Unable to get this to work just yet
describe('show stubbing example', () => {
  it('stubs a call to the login API', () => {
    browser.addMockModule('modName', function() {
      🔥 angular.module('modName', []).value('foo', 'bar');
    });		
  })
})
```

```jsx
it('shows cypress example', () => {
  // A lot of e2e testing is about waiting for network requests
  // It helps to ensure that things are asserted at the right time

  // Declare an alias for the route you want to watch
  cy.route('GET', 'comments/*').as('getComment')

  // we have code that gets a comment when
  // the button is clicked in scripts.js
  cy.get('.network-btn').click()

  // https://on.cypress.io/wait
  cy.wait('@getComment').its('status').should('eq', 200)
  cy.wait('@postComment').should((xhr) => {
    expect(xhr.requestBody).to.include('email')
    expect(xhr.requestHeaders).to.have.property('Content-Type')
    expect(xhr.responseBody).to.have.property('name', 'Using POST in cy.route()')
  })

  // Listen to POST to comments
  cy.route('POST', '/comments').as('postComment')

  // we have code that posts a comment when
  // the button is clicked in scripts.js
  cy.get('.network-post').click()
  cy.wait('@postComment').should((xhr) => {
    expect(xhr.requestBody).to.include('email')
    expect(xhr.requestHeaders).to.have.property('Content-Type')
    expect(xhr.responseBody).to.have.property('name', 'Using POST in cy.route()')
  })
})
```

## Navigating Websites

When you want to visit a page, the code is fairly straightforward.

{% badge danger Before %} **Protractor**

```jsx
it('visits a page', () => {
  browser.get('/about')
  browser.navigate().forward()
  browser.navigate().back()
})
```

{% badge success After %} **Protractor**

```js
it('visit a non-Angular page', () => {
  cy.visit('/about')
})
```

However, Protractor assumes that all websites you want to visit are Angular apps. As a result, you have to take an extra step to disable this behavior. When you write Cypress tests though, you don't need to do any extra work!

{% badge danger Before %} **Protractor**

```js
it('visit a non-Angular page', () => {
  browser.waitForAngularEnabled(false)
  browser.get('/about')
})
```

{% badge success After %} **Protractor**

```js
it('visit a non-Angular page', () => {
  cy.visit('/about')
})
```

### Parallelization

One of the worst things that can happen to a developer is to be forced to wait for a 2 hour end-to-end test suite to before verifying something works or not. Instead, Cypress Dashboard Service allows your tests to run in parallel. If your longest test only test a minute to run, this means that you've just cut down your testing by over 12,000%!

This feature is available in Protractor and requires you to configure your application with multiple options (i.e., `sharedTestFiles`, `maxInstances`, etc.). An example is provided below:

```jsx
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

However, with Cypress, all you need to do is pass the `--parallel` and `--record` flag to `cypress run`, and it will take care of the rest for you:

```bash
$ cypress run --record --parallel
```

# Conclusion

For more information on how to create end-to-end tests with Cypress, be sure to check out [our official documentation here](https://docs.cypress.io/guides/overview/why-cypress.html).
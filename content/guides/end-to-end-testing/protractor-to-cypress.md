---
title: Migrating from Protractor to Cypress
e2eSpecific: true
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- Benefits of using Cypress in Angular apps
- How Cypress can create reliable e2e tests for Angular apps
- How to migrate Protractor tests to Cypress

</Alert>

## Introduction

Protractor has been a popular end-to-end testing tool for Angular and AngularJS
apps. However, Protractor is
[no longer included](https://blog.angular.io/angular-v12-is-now-available-32ed51fbfd49)
in new Angular projects as of Angular 12. We've got you covered here with this
migration guide to help you and your team transition from Protractor to Cypress.

<Alert type="warning">

If you see any inaccuracies with this guide or feel like something has been
misrepresented, please
[start a discussion here](https://github.com/cypress-io/cypress/discussions/new).

</Alert>

To start, let's look at a quick code sample to see how approachable Cypress is
coming from Protractor. In this scenario, we have a test to validate that a user
can sign up for a new account.

<Badge type="danger">Before: Protractor</Badge>

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

<Badge type="success">After: Cypress</Badge>

```js
describe('Authorization Tests', () => {
  it('allows the user to signup for a new account', () => {
    cy.visit('/signup')
    cy.get('#email-field').type('user@email.com')
    cy.get('#confirm-email-field').type('user@email.com')
    cy.get('#password-field').type('testPassword1234')
    cy.get('button').contains('Create new account').click()

    cy.url().should('include', '/signup/success')
  })
})
```

## Benefits of Using Cypress

As many developers can attest to, end-to-end testing is one of those things that
they know they _should_ do, but often do not. Or if they do run tests, the tests
are often flaky and often very expensive due to how long it can take to run. And
while there are often ideals of complete code coverage, the realities of
business and deadlines often take precedence and the tests are left unwritten,
or worse, ignored when errors are being reported because they are not reliable.
Not only does Cypress make sure that your tests will be reliable, but it
provides developers with tools that make e2e testing an asset to development
rather than a hindrance.

### Interact with your tests in a browser

When Protractor runs tests, the browser automation launches a browser instance
and often runs through tests too fast for the human eye. Without additional
configuration, this often leads to a reliance on lengthy terminal messages that
can be expensive from a context-switching perspective.

With [Cypress](/guides/core-concepts/cypress-app), your tests run in an
interactive browser environment in real time. Cypress's
[Command Log](/guides/core-concepts/cypress-app#Command-Log) displays the tests
from your test suite and their assertions. When you
[click on a command or assertion](https://docs.cypress.io/guides/core-concepts/cypress-app#Clicking-on-Commands)
in the command log, a DOM snapshot displays so you can see what the application
under test looked like at the time of the test's execution. This allows you to
see the **real rendered UI** and the behavior of the app under **real user
interactions.** Since the app is loaded within a real browser, you can also
manually explore its behavior while it is under the state of a desired test
scenario.

Cypress also helps you to write your tests by making it as easy as possible to
find the right CSS selectors for the DOM elements in your application with its
[Selector Playground](https://docs.cypress.io/guides/core-concepts/cypress-app#Selector-Playground).
The Selector Playground helps you cut down on time spent finding the right
selectors so you can focus on what's important: writing tests that verify your
app's logic.

<DocsVideo src="/img/guides/migrating-to-cypress/DevTools.mp4" title="interacting with tests in a browser"></DocsVideo>

### Faster feedback loops

When it comes to your end-to-end tests, being able to see your tests as they run
is critical to allowing you to confidently iterate faster. With Cypress, your
tests are automatically re-run upon file save as you are iterating on them.

Having your code editor and application under test within a browser side-by-side
(shown below) while re-running tests on save is a highly productive workflow. It
provides an instant feedback loop that allows you to iterate faster with
confidence.

<DocsVideo src="/img/guides/migrating-to-cypress/codeframe-ex.webm" title="auto-reloading"></DocsVideo>

### Time travel through tests

Cypress gives you time travel capabilities to see exactly how your app was
behaving at any point during test execution. Cypress takes DOM snapshots of your
application under test as the commands and assertions in your tests are
executed. This enables you to view the **real UI** of your application at any
point during your tests' execution. By clicking from one command to another in
the [command log](/guides/core-concepts/cypress-app#Command-Log), you can see
which elements Cypress acted upon and how your application responded to the
simulated **real user behavior**.

<DocsVideo src="/img/guides/migrating-to-cypress/interactivity.mp4" title="Time travel debugging"></DocsVideo>

### Gain Visibility in Headless Mode with Screenshots and Videos

Running browser tests in headless mode (locally or in continuous integration
pipeline) can be a bit of a black-box without much visibility. When tests fail,
error messages by themselves can often fall short in painting the picture of
**why** something failed, especially if assertions were not explicit enough or
too indirect. To understand the reason behind test failures it also helps to see
the state of the app UI at the point of failure or see the events that led up to
the failure.

Cypress assists with debugging in headless mode, by automatically taking a
screenshot of the app UI and command log at the exact point of test failure. To
help see everything that happened prior to test failure, Cypress provides a
video recording (as an MP4 file) of a full test spec run by default.

### Test Retries

End-to-end tests can be complicated because modern web applications are also
complex. You may find that some features of your web application are challenging
to test or the tests sporadically fail. We call these tests "flaky." Cypress
allows you to [retry failed tests](/guides/guides/test-retries). Sometimes tests
will fail in a CI environment when they otherwise would pass on a developer's
machine. Enabling test retries in the Cypress configuration can help you to get
unblocked when unpredictable, flaky tests are occasionally failing.

The Cypress Dashboard goes a step further and helps you and your team to
[detect flaky tests](/guides/dashboard/flaky-test-management) that run in your
CI/CD pipeline.

## Getting Started

### Recommended Installation

We recommend using our
[official Cypress Angular schematic](https://www.npmjs.com/package/@cypress/schematic)
to add Cypress to your Angular project:

```shell
ng add @cypress/schematic
```

This will install Cypress, add scripts for running Cypress in `run` and `open`
mode, scaffold base Cypress files and directories, and (optional) prompt you to
remove Protractor and reconfigure the default `ng e2e` command to use Cypress.

With our schematic installed and Protractor removed, you can run Cypress in
`open` mode with the following command:

```shell
ng e2e
```

You can also use the following command to start Cypress in `open` mode:

```shell
ng run {your-project-name}:cypress-open
```

Both of these commands will launch Cypress in an Electron browser.

You can also launch Cypress via `run` mode, which runs headlessly:

```shell
ng run {your-project-name}:cypress-run
```

<Alert type="info">

Check out the
[Cypress Angular Schematic Configuration section](#Angular-Schematic-Configuration)
documentation for more details like how to
[configure your tests to run in a specific browser](#Running-the-builder-with-a-specific-browser)
or [record test results](#Recording-test-results-to-the-Cypress-Dashboard) to
the [Cypress Dashboard](https://docs.cypress.io/guides/dashboard/introduction).

</Alert>

<Alert type="success">

The
[Cypress Angular Schematic](https://www.npmjs.com/package/@cypress/schematic)
package was made possible by the original work of the
[Briebug](https://briebug.com/) team and the contributors of
[@briebug/cypress-schematic](https://www.npmjs.com/package/@briebug/cypress-schematic).

@briebug/cypress-schematic served as the starting point for improvements and new
functionality the Cypress team will continue to develop along with the
community.

</Alert>

### Manual Installation

While we recommend using our official Angular schematic, you can still install
Cypress manually.

<code-group>
  <code-block label="npm" active>

```bash
npm install --save-dev cypress
```

  </code-block>
  <code-block label="yarn">

```bash
yarn add --dev cypress
```

  </code-block>
</code-group>

Then, since Cypress can run in parallel with your application, let's install
[concurrently](https://www.npmjs.com/package/concurrently) to simplify our npm
script. This is optional; however, you will need another way to serve your
Angular app for Cypress to run tests against your application.

<code-group>
  <code-block label="npm" active>

```bash
npm install --save-dev concurrently
```

  </code-block>
  <code-block label="yarn">

```bash
yarn add --dev concurrently
```

  </code-block>
</code-group>

Then we will update our `package.json` with the following scripts:

```json
// Example package.json
{
  "scripts": {
    "cy:open": "concurrently \"ng serve\" \"cypress open\"",
    "cy:run": "concurrently \"ng serve\" \"cypress run\""
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

Now, when we run:

<code-group>
  <code-block label="npm" active>

```bash
npm run cy:open
```

  </code-block>
  <code-block label="yarn">

```bash
yarn run cy:open
```

  </code-block>
</code-group>

It will start up Cypress and our Angular app at the same time.

Again, we highly recommend using our
[Angular Schematic](https://github.com/cypress-io/cypress/tree/master/npm/cypress-schematic)
to install Cypress, and we plan on adding new capabilities to it over time.

## Working with the DOM

### How to Get DOM Elements

#### Getting a single element on the page

When it comes to e2e tests, one of the most common things you'll need to do is
get one or more HTML elements on a page. Rather than split element fetching into
multiple methods that you need to memorize, everything can be accomplished with
[`cy.get`](/api/commands/get) while using CSS selectors or the preferred
[**data attribute**](https://on.cypress.io/selecting-elements)

<Badge type="danger">Before: Protractor</Badge>

```js
// Get an element
element(by.tagName('h1'))

/// Get an element using a CSS selector.
element(by.css('.my-class'))

// Get an element with the given id.
element(by.id('my-id'))

// Get an element using an input name selector.
element(by.name('field-name'))

//Get an element by the text it contains within a certain CSS selector
element(by.cssContainingText('.my-class', 'text'))

//Get the first element containing a specific text (only for link elements)
element(by.linkText('text')
```

<Badge type="success">After: Cypress</Badge>

```js
// Get an element
cy.get('h1')

// Get an element using a CSS selector.
cy.get('.my-class')

// Get an element with the given id.
cy.get('#my-id')

// Get an element using an input name selector.
cy.get('input[name="field-name"]')

//Get an element by the text it contains within a certain CSS selector
cy.get('.my-class').contains('text')

//Get the first element containing a specific text (available for any element)
cy.contains('text')
```

You can also get elements by their text value. This can be accomplished using
[`cy.contains`](/api/commands/contains) while using CSS selectors to account for
all use cases.

<Badge type="danger">Before: Protractor</Badge>

```js
// Get an element by the text it contains within a certain CSS selector
element(by.cssContainingText('.my-class', 'text'))

// Get the first element containing a specific text (only for link elements)
element(by.linkText('text'))
```

<Badge type="success">After: Cypress</Badge>

```js
// Get an element by the text it contains within a certain CSS selector
cy.get('.my-class').contains('text')

// Get the first element containing a specific text (available for any element)
cy.contains('text')
```

<Alert type="info">

While Protractor also allows for selection by XPath, Cypress doesn't support
this out of the box. However, you can add the
[cypress-xpath plugin](https://www.npmjs.com/package/cypress-xpath) to easily
enable it.

</Alert>

#### Getting multiple elements on a page

When you want to get access to more than one element on the page, you would need
to chain the `.all()` method. However, in Cypress, no syntax change is
necessary!

<Badge type="danger">Before: Protractor</Badge>

```js
// Get all list-item elements on the page
element.all(by.tagName('li'))

/// Get all elements by using a CSS selector.
element.all(by.css('.list-item'))

// Find an element using an input name selector.
element.all(by.name('field-name'))
```

<Badge type="success">After: Cypress</Badge>

```js
// Get all list-item elements on the page
cy.get('li')

/// Get all elements by using a CSS selector.
cy.get('.list-item')

// Find an element using an input name selector.
cy.get('input[name="field-name"]')
```

<Alert type="info">

Another plugin that we recommend for selecting multiple elements is the
[Cypress Testing Library](https://github.com/testing-library/cypress-testing-library).
This extends Cypress by adding `findBy` and `findAllBy` commands.

</Alert>

<Alert type="info">

You can learn more about
[how to get DOM elements in our official documentation](/api/commands/get#Syntax).

</Alert>

#### Selector Playground

For those who are big fans of
[Protractor's Element Explorer functionality](https://www.protractortest.org/#/debugging#enabled-control-flow),
Cypress also provides you with a
[Selector Playground](/guides/core-concepts/cypress-app#Selector-Playground)
that allows you to:

- Determine a unique selector for an element
- See what elements match a given selector
- See what element matches a string of text

The Selector Playground can be useful when you need to find a specific selector
to use in your Cypress tests.

<DocsVideo src="/img/snippets/selector-playground.mp4" title="Selector Playground"></DocsVideo>

### How to Interact with DOM Elements

<Badge type="danger">Before: Protractor</Badge>

```js
// Click on the element
element(by.css('button')).click()

// Send keys to the element (usually an input)
element(by.css('input')).sendKeys('my text')

// Clear the text in an element (usually an input).
element(by.css('input')).clear()

// Check the first checkbox on a page
element.all(by.css('[type="checkbox"]')).first().click()

// Check a radio button with the value "radio1"
element(by.css('[type="radio"][value="radio1"]')).click()

// Uncheck the first checkbox that is checked
element.all(by.css('[type="checkbox"][checked="true"]')).first().click()

// Select an option with the text value "my value" from a select list
element(by.cssContainingText('option', 'my value')).click()

// Scroll an element into view
browser
  .actions()
  .mouseMove(element(by.id('my-id')))
  .perform()
```

<Badge type="success">After: Cypress</Badge>

```js
// Click on the element
cy.get('button').click()

// Send keys to the element (usually an input)
cy.get('input').type('my text')

// Clear the text in an element (usually an input)
cy.get('input').clear()

// Check the first checkbox on a page
cy.get('[type="checkbox"]').first().check()

// Check a radio button with the value "radio1"
cy.get('[type="radio"]').check('radio1')

// Uncheck the first checkbox that is not disabled
cy.get('[type="checkbox"]').not('[disabled]').first().uncheck()

// Select an option with the text value "my value" from a select list
cy.get('select[name="optionsList"]').select('my value')

// Scroll an element into view
cy.get('#my-id').scrollIntoView()
```

<Alert type="info">

You can learn more about
[interacting with DOM elements in our official documentation](/guides/core-concepts/interacting-with-elements.html).

</Alert>

## Assertions

Similar to Protractor, Cypress enables use of human readable assertions.

Here are some common DOM element assertions with Cypress and equivalent
assertions with Protractor.

### Length

<Badge type="danger">Before: Protractor</Badge>

```javascript
const list = element.all(by.css('li.selected'))
expect(list.count()).toBe(3)
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until we find 3 matching <li.selected>
cy.get('li.selected').should('have.length', 3)
```

### Class

<Badge type="danger">Before: Protractor</Badge>

```javascript
expect(
  element(by.tagName('form')).element(by.tagName('input')).getAttribute('class')
).not.toContain('disabled')
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until this input does not have class disabled
cy.get('form').find('input').should('not.have.class', 'disabled')
```

### Value

<Badge type="danger">Before: Protractor</Badge>

```javascript
expect(element(by.tagName('textarea'))).getAttribute('value')).toBe('foo bar baz')
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until this textarea has the correct value
cy.get('textarea').should('have.value', 'foo bar baz')
```

### Text Content

<Badge type="danger">Before: Protractor</Badge>

```javascript
// assert the element's text content is exactly the given text
expect(element(by.id('user-name')).getText()).toBe('Joe Smith')
// assert the element's text includes the given substring
expect(element(by.id('address')).getText()).toContain('Atlanta')
// assert the span does not contain 'click me'
const child = element(by.tagName('a')).getWebElement()
const parent = child.getDriver().findElement(by.css('span.help'))
expect(parent.getText()).not.toContain('click me')
// assert that the greeting starts with "Hello"
element(by.id('greeting').getText()).toMatch(/^Hello/)
```

<Badge type="success">After: Cypress</Badge>

```javascript
// assert the element's text content is exactly the given text
cy.get('#user-name').should('have.text', 'Joe Smith')
// assert the element's text includes the given substring
cy.get('#address').should('include.text', 'Atlanta')
// retry until this span does not contain 'click me'
cy.get('a').parent('span.help').should('not.contain', 'click me')
// the element's text should start with "Hello"
cy.get('#greeting')
  .invoke('text')
  .should('match', /^Hello/)
// tip: use cy.contains to find element with its text
// matching the given regular expression
cy.contains('#a-greeting', /^Hello/)
```

### Visibility

<Badge type="danger">Before: Protractor</Badge>

```javascript
// assert button is visible
expect(element(by.tagName('button')).isDisplayed()).toBe(true)
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until this button is visible
cy.get('button').should('be.visible')
```

### Existence

<Badge type="danger">Before: Protractor</Badge>

```javascript
// assert the spinner no longer exists
expect(element(by.id('loading')).isPresent()).toBe(false)
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until loading spinner no longer exists
cy.get('#loading').should('not.exist')
```

### State

<Badge type="danger">Before: Protractor</Badge>

```javascript
expect(element('input[type="radio"]').isSelected()).toBeTruthy()
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until our radio is checked
cy.get(':radio').should('be.checked')
```

### CSS

<Badge type="danger">Before: Protractor</Badge>

```javascript
// assert .completed has css style "line-through" for "text-decoration" property
expect(element(by.css('.completed')).getCssValue('text-decoration')).toBe(
  'line-through'
)

// assert the accordion does not have a "display: none"
expect(element(by.id('accordion')).getCssValue('display')).not.toBe('none')
```

<Badge type="success">After: Cypress</Badge>

```javascript
// retry until .completed has matching css
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')

// retry while .accordion css has the "display: none" property
cy.get('#accordion').should('not.have.css', 'display', 'none')
```

### Disabled property

```html
<input type="text" id="example-input" disabled />
```

<Badge type="danger">Before: Protractor</Badge>

```javascript
// assert the input is disabled
expect(element(by.id('example-input')).isEnabled()).toBe(false)
```

<Badge type="success">After: Cypress</Badge>

```javascript
cy.get('#example-input')
  .should('be.disabled')
  // let's enable this element from the test
  .invoke('prop', 'disabled', false)

cy.get('#example-input')
  // we can use "enabled" assertion
  .should('be.enabled')
  // or negate the "disabled" assertion
  .and('not.be.disabled')
```

Cypress has one additional feature that can make a critical difference in the
reliability of your tests' assertions:
[retry-ability](https://docs.cypress.io/guides/core-concepts/retry-ability).
When your test fails an assertion or command, Cypress will mimic a real user
with build-in wait times and multiple attempts at asserting your tests in order
to minimize the amount of false negatives / positives.

<Badge type="danger">Before: Protractor</Badge>

```js
describe('verify elements on a page', () => {
  it('verifies that a link is visible', () => {
    expect($('a.submit-link').isDisplayed()).toBe(true)
  })
})
```

<Badge type="success">After: Cypress</Badge>

```js
describe('verify elements on a page', () => {
  it('verifies that a link is visible', () => {
    cy.get('a.submit-link').should('be.visible')
  })
})
```

In the example above, if the submit link does not appear on the page at the
exact moment when Protractor runs the test (which can be due to any number of
factors including API calls, slow browser rendering, etc.), your test will fail.
However, Cypress factors these conditions into its assertions and will only fail
if the time goes beyond a reasonable amount.

## Negative assertions

There are positive and negative assertions. Negative assertions have the "not"
chainer prefixed to the assertion. Examples of negative assertions in both
Protractor and Cypress:

<Badge type="danger">Before: Protractor</Badge>

```javascript
expect(
  element(by.css('.todo'))
    .getAttribute('class')
    .then((classes) => {
      return classes.split(' ').indexOf('completed') !== -1
    })
).not.toBe(true)

expect(element(by.id('loading')).isDisplayed()).not.toBe(true)
```

<Badge type="success">After: Cypress</Badge>

```javascript
cy.get('.todo').should('not.have.class', 'completed')
cy.get('#loading').should('not.be.visible')
```

<Alert type="info">

Learn more about how Cypress handles
[assertions](/guides/references/assertions).

</Alert>

## Network Handling

### Network Spying

Protractor doesn't offer a built-in solution for network spying. With Cypress,
you can leverage the [intercept API](/api/commands/intercept) to spy on and
manage the behavior of any network request.

For example, if you wanted to wait on a network request to complete before
continuing your test, you could write the following:

```js
it('should display a Load More button after fetching and displaying a list of users', () => {
  cy.visit('/users')
  cy.intercept('/users/**')
  cy.get('button').contains('Load More')
})
```

Cypress will automatically wait for any request to `/users/**` to complete
before continuing your test.

### Network Stubbing

Cypress's [intercept API](/api/commands/intercept) also allows you to stub any
network request for your app under test. You can use the
[intercept API](/api/commands/intercept) to make assertions based on different
simulated responses for your network requests. For example, you might want to
simulate a 3rd-party API outage by forcing a network error and test your app
under those conditions. With Cypress's [intercept API](/api/commands/intercept),
this and more is possible!

```js
it('should display a warning when the third-party API is down', () => {
  cy.intercept(
    'GET',
    'https://api.openweathermap.org/data/2.5/weather?q=Atlanta',
    { statusCode: 500 }
  )
  cy.get('.weather-forecast').contains('Weather Forecast Unavailable')
})
```

You can also use the intercept API to stub a custom response for specific
network requests:

```js
it('projects endpoint should return 2 projects', () => {
  cy.intercept('/projects', {
    body: [{ projectId: '1' }, { projectId: '2' }],
  }).as('projects')
  cy.wait('@projects').its('response.body').should('have.length', 2)
})
```

<Alert type="info">

For more information, check out the
[intercept API documentation](/api/commands/intercept).

</Alert>

## Navigating Websites

When you want to visit a page, you can do so with the following code:

<Badge type="danger">Before: Protractor</Badge>

```js
it('visits a page', () => {
  browser.get('/about')
  browser.navigate().forward()
  browser.navigate().back()
})
```

<Badge type="success">After: Cypress</Badge>

```js
it('visits a page', () => {
  cy.visit('/about')
  cy.go('forward')
  cy.go('back')
})
```

However, Protractor assumes that all websites you want to visit are Angular
apps. As a result, you have to take an extra step to disable this behavior. When
you write Cypress tests though, you don't need to do any extra work!

<Badge type="danger">Before: Protractor</Badge>

```js
it('visit a non-Angular page', () => {
  browser.waitForAngularEnabled(false)
  browser.get('/about')
})
```

<Badge type="success">After: Cypress</Badge>

```js
it('visit a non-Angular page', () => {
  cy.visit('/about')
})
```

<Alert type="info">

For more information, check out our
[official documentation on navigation](https://example.cypress.io/commands/navigation)!

</Alert>

## Automatic Retrying and Waiting

Web applications are usually rarely synchronous. With Protractor, you may be
accustomed to adding arbitrary timeouts or using the
[waitForAngular](https://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.waitForAngular)
API to wait for Angular to finish rendering before attempting to interact with
an element.

With Cypress, commands that query the DOM are
[automatically retried](/guides/core-concepts/retry-ability). Cypress will
automatically wait and retry most commands until an element appears in the DOM.
If an element is not
[actionable](/guides/core-concepts/interacting-with-elements#Actionability)
within the
[`defaultCommandTimeout`](/guides/core-concepts/retry-ability#Timeouts) setting,
the command will fail. This enables you to write tests without the need for
arbitrary timeouts, enabling you to write more predictable tests.

<Badge type="danger">Before: Protractor</Badge>

```js
// Clicking a button
element(by.css('button')).click()
// Waiting for Angular to re-render the page
browser.waitForAngular()
// Make assertion after waiting for Angular to update
expect(by.css('.list-item').getText()).toEqual('my text')
```

<Badge type="success">After: Cypress</Badge>

```js
// Clicking a button
cy.get('button').click()
// Make assertion. No waiting necessary!
cy.get('.list-item').contains('my text')
```

## Cypress vs WebDriver Control Flow

Cypress commands are similar to Protractor code at first glance. Cypress
commands are
[not invoked immediately](/guides/core-concepts/introduction-to-cypress#Commands-Are-Asynchronous)
and are enqueued to run serially at a later time. Cypress commands might look
like promises, but the
[Cypress API is not an exact implementation of Promises](/guides/core-concepts/introduction-to-cypress#Commands-Are-Not-Promises).
The modern web is asychronous, therefore you need to interact with modern web
apps in an asynchronous fashion. This is why the Cypress API is asynchronous.
This allows you to write deterministic tests since all of your commands are
executed serially, enabling your tests to run predictably each time.

In comparison, Protractor's WebDriverJS API is based on promises, which is
managed by a control flow. This
[Control Flow](https://www.protractortest.org/#/control-flow) enables you to
write asynchronous Protractor tests in a synchronous style.

```js
// Click on the element
// This code looks synchronous!
element(by.css('button')).click()

// Send keys to the element (usually an input)
element(by.css('input')).sendKeys('my text')
```

Protractor's Control Flow can be disabled, allowing you to write your test cases
as asynchronous functions.

```js
// Wait for the button to be found and click it
await element(by.css('button')).click()

// Wait for the input to be found and type into the field
await element(by.css('input')).sendKeys('my text')
```

The Control Flow example rewritten as a Cypress test would look something like
this:

```js
// Click on the element
cy.get('button').click()

// Send keys to the element (usually an input)
cy.get('input').type('my text')
```

## Using Page Objects

A common pattern when writing end-to-end tests, especially with Protractor, is
[Page Objects](https://github.com/SeleniumHQ/selenium/wiki/PageObjects). Page
Objects can simplify your test code by creating reusable methods if you find
yourself writing the same test code across multiple test cases.

### Protractor without Page Objects

```js
// Type into username field
element(by.css('.username')).sendKeys('my username')
// Type into password field
element(by.css('.password')).sendKeys('my password')
// Click the login button
element(by.css('button')).click()
```

### Protractor with Page Objects

```js
const page = {
  login: () => {
    element(by.css('.username')).sendKeys('my username')
    element(by.css('.password')).sendKeys('my password')
    element(by.css('button')).click()
  },
}

it('should display the username of a logged in user', () => {
  page.login()
  expect(by.css('.username').getText()).toEqual('my username')
})
```

You can use the same Page Object pattern within your Cypress tests:

### Cypress without Page Objects

```js
cy.get('.username').type('my username')
cy.get('.password').type('my password')
cy.get('button').click()
```

### Cypress with Page Objects

```js
const page = {
  login: () => {
    cy.get('.username').type('my username')
    cy.get('.password').type('my password')
    cy.get('button').click()
  },
}

it('should display the username of a logged in user', () => {
  page.login()
  cy.get('.username').contains('my username')
})
```

Cypress also provides a [Custom Command](/api/cypress-api/custom-commands) API
to enable you to add methods to the `cy` global directly:

```js
Cypress.Commands.add('login', (username, password) => {
  cy.get('.username').type(username)
  cy.get('.password').type(password)
})
```

You can use your own custom commands in any of your tests:

```js
it('should display the username of a logged in user', () => {
  cy.login('Matt', Cypress.env('password'))
  cy.get('.username').contains('Matt')
})
```

## Continuous Integration

Cypress makes it easy to
[run your tests in all Continuous Integration environments](/guides/continuous-integration/introduction).

Check out our in-depth guides to run your Cypress tests in
[GitHub Actions](/guides/continuous-integration/github-actions),
[CircleCI](/guides/continuous-integration/introduction#CircleCI),
[GitLab CI](/guides/continuous-integration/gitlab-ci),
[Bitbucket Pipeline](/guides/continuous-integration/bitbucket-pipelines), or
[AWS CodeBuild](/guides/continuous-integration/aws-codebuild).

We also have code samples to get Cypress up and running in
[many of the other popular CI environments](/guides/continuous-integration/ci-provider-examples).
Even if your CI provider isn't listed, you can still run Cypress in your CI
environment.

## Parallelization

The [Cypress Dashboard Service](/guides/dashboard/introduction) allows you to
run your test files in parallel across multiple CI machines.

With Cypress, your tests can be
[parallelized on a per spec file basis](https://docs.cypress.io/guides/guides/parallelization).
This is an important distinction between Protractor and Cypress parallelization.
One of the reasons why Cypress parallelizes tests per file is because some users
may write tests that build up state that subsequent tests, although we
[do not recommend relying on the state of previous tests](/guides/references/best-practices#Having-tests-rely-on-the-state-of-previous-tests).

With Cypress, all you need to do is pass the `--parallel` and `--record` flag to
`cypress run`, and it will take care of the rest for you:

```bash
cypress run --record --parallel
```

<Alert type="info">

For more information, check out our
[docs on parallelization](/guides/guides/parallelization#Overview)!

</Alert>

## Angular Schematic Configuration

The
[Cypress Angular Schematic](https://github.com/cypress-io/cypress/tree/master/npm/cypress-schematic#readme)
has many configurable options to fit the needs of your project.

### Running the builder with a specific browser

Before running Cypress in `open` mode, ensure that you have started your
application server using `ng serve`.

```json
"cypress-open": {
  "builder": "@cypress/schematic:cypress",
  "options": {
    "watch": true,
    "headless": false,
    "browser": "chrome"
  },
  "configurations": {
    "production": {
      "devServerTarget": "{project-name}:serve:production"
    }
  }
}
```

<Alert type="info">

Read the docs on [launching browsers](http://on.cypress.io/launching-browsers)
to learn more.

</Alert>

### Recording test results to the Cypress Dashboard

We recommend setting your
[Cypress Dashboard](https://docs.cypress.io/guides/dashboard/introduction)
recording key as an environment variable and _NOT_ as a builder option when
running it in CI.

```json
"cypress-run": {
  "builder": "@cypress/schematic:cypress",
  "options": {
    "devServerTarget": "{project-name}:serve",
    "record": true,
    "key": "your-cypress-dashboard-recording-key"
  },
  "configurations": {
    "production": {
      "devServerTarget": "{project-name}:production"
    }
  }
}
```

Read the docs on
[recording test results](http://on.cypress.io/recording-project-runs) to the
[Cypress Dashboard](/guides/dashboard/introduction) to learn more.

### Specifying a custom Cypress configuration file

It may be useful to have different Cypress configuration files per environment
(ie. development, staging, production).

```json
"cypress-run": {
  "builder": "@cypress/schematic:cypress",
  "options": {
    "devServerTarget": "{project-name}:serve",
    "configFile": "cypress.production.config.js"
  },
  "configurations": {
    "production": {
      "devServerTarget": "{project-name}:production"
    }
  }
}
```

<Alert type="info">

Read our docs to learn more about all the
[configuration options](http://on.cypress.io/configuration) Cypress offers.

</Alert>

### Running Cypress in parallel mode within CI

```json
"cypress-run": {
  "builder": "@cypress/schematic:cypress",
  "options": {
    "devServerTarget": "{project-name}:serve",
    "parallel": true,
    "record": true,
    "key": "your-cypress-dashboard-recording-key"
  },
  "configurations": {
    "production": {
      "devServerTarget": "{project-name}:production"
    }
  }
}
```

<Alert type="info">

Read our docs to learn more about speeding up test execution in CI via
[Cypress parallelization](http://on.cypress.io/parallelization)

</Alert>

### Code Coverage

As you write more and more end-to-end tests, you will find yourself wondering -
do I need to write more tests? Are there parts of the application still
untested? Are there parts of the application that perhaps are tested too much?
This [code coverage guide](https://on.cypress.io/code-coverage) is an excellent
resource to learn how to add code coverage.

### Questions or Issues?

Visit our
[plugins discussion](https://github.com/cypress-io/cypress/discussions/categories/plugins)
to ask questions or report issues related to our Cypress Angular Schematic.

## Next Steps

For more information on how to create end-to-end tests with Cypress, be sure to
check out [our official documentation here](/guides/overview/why-cypress.html).

<Alert type="warning">

If you see any inaccuracies with this guide or feel like something has been
misrepresented, please
[start a discussion here](https://github.com/cypress-io/cypress/discussions/new).

</Alert>

## FAQs

### Do I have to replace all of my tests with Cypress immediately?

Absolutely not. While it might sound ideal to replace Protractor immediately,
you can gradually migrate Protractor tests over to Cypress.

### Can Protractor and Cypress coexist in the same app?

Yes! Your Protractor tests would continue to live in the `e2e` directory that
Angular CLI scaffolded while all Cypress tests would live in a sibling folder
named `cypress`.

```
.
├── cypress
├── e2e
├── src
├── .editorconfig
├── .gitignore
├── angular.json
├── browserslist
├── cypress.config.js
├── karma.conf.js
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
└── tslint.json
```

In fact, as you work through migrating to Cypress, we believe that progressively
enhancing your e2e tests with Cypress is the best path forward to ensure that
feature development is not impacted.

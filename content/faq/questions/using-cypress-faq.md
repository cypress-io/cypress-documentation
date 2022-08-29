---
layout: toc-top
title: Using Cypress
containerClass: faq
---

## <Icon name="angle-right"></Icon> How do I get an element's text contents?

Cypress commands yield jQuery objects, so you can call methods on them.

If you're trying to assert on an element's text content:

```javascript
cy.get('div').should('have.text', 'foobarbaz')
```

If the text contains a
[non-breaking space](https://en.wikipedia.org/wiki/Non-breaking_space) entity
`&nbsp;` then use the Unicode character `\u00a0` instead of `&nbsp;`.

```html
<div>Hello&nbsp;world</div>
```

```javascript
cy.get('div').should('have.text', 'Hello\u00a0world')
```

You can also use the [cy.contains](/api/commands/contains) command which handles
the non-breaking space entities

```javascript
cy.contains('div', 'Hello world')
```

**Tip:** watch the
[Confirming the text with non breaking space entity](https://youtu.be/6CxZuolWlYM)
video.

If you'd like to work with the text prior to an assertion:

```javascript
cy.get('div').should(($div) => {
  const text = $div.text()

  expect(text).to.match(/foo/)
  expect(text).to.include('foo')
  expect(text).not.to.include('bar')
})
```

If you need to convert text to a number before checking if it is greater than
10:

```javascript
cy.get('div').invoke('text').then(parseFloat).should('be.gt', 10)
```

If you need to hold a reference or compare values of text:

```javascript
cy.get('div')
  .invoke('text')
  .then((text1) => {
    // do more work here

    // click the button which changes the div's text
    cy.get('button').click()

    // grab the div again and compare its previous text
    // to the current text
    cy.get('div')
      .invoke('text')
      .should((text2) => {
        expect(text1).not.to.eq(text2)
      })
  })
```

jQuery's `.text()` method automatically calls `elem.textContent` under the hood.
If you'd like to instead use `innerText` you can do the following:

```javascript
cy.get('div').should(($div) => {
  // access the native DOM element
  expect($div.get(0).innerText).to.eq('foobarbaz')
})
```

This is the equivalent of Selenium's `getText()` method, which returns the
innerText of a visible element.

## <Icon name="angle-right"></Icon> How do I get an input's value?

Cypress yields you jQuery objects, so you can call methods on them.

If you're trying to assert on an input's value:

```javascript
// make an assertion on the value
cy.get('input').should('have.value', 'abc')
```

If you'd like to massage or work with the text prior to an assertion:

```javascript
cy.get('input').should(($input) => {
  const val = $input.val()

  expect(val).to.match(/foo/)
  expect(val).to.include('foo')
  expect(val).not.to.include('bar')
})
```

If you need to hold a reference or compare values of text:

```javascript
cy.get('input')
  .invoke('val')
  .then((val1) => {
    // do more work here

    // click the button which changes the input's value
    cy.get('button').click()

    // grab the input again and compare its previous value
    // to the current value
    cy.get('input')
      .invoke('val')
      .should((val2) => {
        expect(val1).not.to.eq(val2)
      })
  })
```

## <Icon name="angle-right"></Icon> How do I compare the value or state of one thing to another?

Our [Variables and Aliases guide](/guides/core-concepts/variables-and-aliases)
gives you examples of doing exactly that.

## <Icon name="angle-right"></Icon> Can I store an attribute's value in a constant or a variable for later use?

Yes, and there are a couple of ways to do this. One way to hold a value or
reference is with
[closures](/guides/core-concepts/variables-and-aliases#Closures). Commonly,
users believe they have a need to store a value in a `const`, `var`, or `let`.
Cypress recommends doing this only when dealing with mutable objects (that
change state).

For examples how to do this, please read our
[Variables and Aliases guide](/guides/core-concepts/variables-and-aliases).

## <Icon name="angle-right"></Icon> How do I get the native DOM reference of an element found using Cypress?

Cypress wraps elements in jQuery so you'd get the native element from there
within a [.then()](/api/commands/then) command.

```javascript
cy.get('button').then(($el) => {
  $el.get(0)
})
```

## <Icon name="angle-right"></Icon> How do I do something different if an element doesn't exist?

What you're asking about is conditional testing and control flow.

Please read our extensive
[Conditional Testing Guide](/guides/core-concepts/conditional-testing) which
explains this in detail.

## <Icon name="angle-right"></Icon> How can I make Cypress wait until something is visible in the DOM?

<Alert type="info">

<strong class="alert-header">Remember</strong>

DOM based commands will automatically
[retry](/guides/core-concepts/retry-ability) and wait for their corresponding
elements to exist before failing.

</Alert>

Cypress offers you many robust ways to
[query the DOM](/guides/core-concepts/introduction-to-cypress#Querying-Elements),
all wrapped with retry-and-timeout logic.

Other ways to wait for an element's presence in the DOM is through `timeouts`.
Cypress commands have a default timeout of 4 seconds, however, most Cypress
commands have
[customizable timeout options](/guides/references/configuration#Timeouts).
Timeouts can be configured globally or on a per-command basis.

In [some cases](/guides/core-concepts/interacting-with-elements#Visibility),
your DOM element will not be actionable. Cypress gives you a powerful
[`{force:true}`](/guides/core-concepts/interacting-with-elements#Forcing) option
you can pass to most action commands.

**Please read** our
[Core Concepts Introduction to Cypress](/guides/core-concepts/introduction-to-cypress).
This is the single most important guide for understanding how to test with
Cypress.

## <Icon name="angle-right"></Icon> How do I wait for my application to load? <E2EOnlyBadge />

We have seen many different iterations of this question. The answers can be
varied depending on how your application behaves and the circumstances under
which you are testing it. Here are a few of the most common versions of this
question.

**_How do I know if my page is done loading?_**

When you load your application using `cy.visit()`, Cypress will wait for the
`load` event to fire. The [cy.visit()](/api/commands/visit#Usage) command loads
a remote page and does not resolve until all of the external resources complete
their loading phase. Because we expect your applications to observe differing
load times, this command's default timeout is set to 60000ms. If you visit an
invalid url or a
[second unique domain](/guides/guides/web-security#Same-superdomain-per-test),
Cypress will log a verbose yet friendly error message.

**_In CI, how do I make sure my server has started?_**

We recommend these great modules for this use case:

- [`wait-on`](https://www.npmjs.com/package/wait-on)
- [`start-server-and-test`](https://github.com/bahmutov/start-server-and-test)

**_How can I wait for my requests to be complete?_**

The prescribed way to do this is to define your routes using
[cy.intercept()](/api/commands/intercept), create
[aliases](/guides/core-concepts/variables-and-aliases#Aliases) for these routes
prior to the visit, and _then_ you can explicitly tell Cypress which routes you
want to wait on using [cy.wait()](/api/commands/wait#Syntax). **There is no
magical way to wait for all of your XHRs or Ajax requests.** Because of the
asynchronous nature of these requests, Cypress cannot intuitively know to wait
for them. You must define these routes and be able to unambiguously tell Cypress
which requests you want to wait on.

## <Icon name="angle-right"></Icon> Can I test the HTML `<head>` element?

Yes, you sure can. While executing tests, you can view the entire
`window.document` object in your open console using
[cy.document()](/api/commands/document). You can even make assertions on the
`<head>` element. Check out this example.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
    <meta name="description" content="This description is so meta" />
    <title>Test the HEAD content</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body></body>
</html>
```

```js
describe('The Document Metadata', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('looks inside the head content using `cy.document()`', () => {
    // this will yield the entire window.document object
    // if you click on DOCUMENT from the command log,
    // it will output the entire #document to the console
    cy.document()
  })

  // or make assertions on any of the metadata in the head element

  it('looks inside <title> tag', () => {
    cy.get('head title').should('contain', 'Test the HEAD content')
  })

  it('looks inside <meta> tag for description', () => {
    cy.get('head meta[name="description"]').should(
      'have.attr',
      'content',
      'This description is so meta'
    )
  })
})
```

## <Icon name="angle-right"></Icon> Can I check that a form's HTML form validation is shown when an input is invalid?

You certainly can.

**Test default validation error**

```html
<form>
  <input type="text" id="name" name="name" required />
  <button type="submit">Submit</button>
</form>
```

```js
cy.get('[type="submit"]').click()
cy.get('input:invalid').should('have.length', 1)
cy.get('#name').then(($input) => {
  expect($input[0].validationMessage).to.eq('Please fill out this field.')
})
```

**Test custom validation error**

```html
<body>
  <form>
    <input type="email" id="email" name="email" />
    <button type="submit">Submit</button>
  </form>
  <script>
    const email = document.getElementById('email')

    email.addEventListener('input', function (event) {
      if (email.validity.typeMismatch) {
        email.setCustomValidity('I expect an email!')
      } else {
        email.setCustomValidity('')
      }
    })
  </script>
</body>
```

```javascript
cy.get('input:invalid').should('have.length', 0)
cy.get('[type="email"]').type('not_an_email')
cy.get('[type="submit"]').click()
cy.get('input:invalid').should('have.length', 1)
cy.get('[type="email"]').then(($input) => {
  expect($input[0].validationMessage).to.eq('I expect an email!')
})
```

For more examples, read the blog post
[HTML Form Validation in Cypress](https://glebbahmutov.com/blog/form-validation-in-cypress/).

## <Icon name="angle-right"></Icon> Can I throttle network speeds using Cypress?

You can throttle your network connection by accessing your Developer Tools
Network panel. Additionally, you can add your own custom presets by selecting
**Custom > Add** from the Network Conditions drawer.

We do not currently offer any options to simulate this during `cypress run`.

## <Icon name="angle-right"></Icon> Can I use the new ES7 async / await syntax?

No. The Command API is not designed in a way that makes this possible. This is
not a limitation of Cypress - it is a very conscious and important design
decision.

Async / await is sugar around promises and Cypress commands are a mixture of
both promises and streams.

If you're curious please read:

- Our
  [Introduction to Cypress guide](/guides/core-concepts/introduction-to-cypress#Commands-Are-Asynchronous)
  which explains how the Commands are designed
- Our [Variables and Aliases guide](/guides/core-concepts/variables-and-aliases)
  which talks about patterns dealing with async code

## <Icon name="angle-right"></Icon> How do I select or query for elements if my application uses dynamic classes or dynamic IDs?

Don't use classes or ID's. You add `data-*` attributes to your elements and
target them that way.

Read more about the
[best practices for selecting elements here](/guides/references/best-practices#Selecting-Elements).

## <Icon name="angle-right"></Icon> I want to run tests only within one specific folder. How do I do this?

You can specify which test files to run during
[cypress run](/guides/guides/command-line#cypress-run) by
[passing a glob to the `--spec` flag](/guides/guides/command-line#cypress-run-spec-lt-spec-gt)
matching the files you want to run. You should be able to pass a glob matching
the specific folder where the tests are you want to run.

This feature is only available when using
[cypress run](/guides/guides/command-line#cypress-run).

## <Icon name="angle-right"></Icon> Is there a suggested way or best practice for how I should target elements or write element selectors?

Yes. Read more about the
[best practices for selecting elements here](/guides/references/best-practices#Selecting-Elements).

## <Icon name="angle-right"></Icon> Can I prevent Cypress from failing my test when my application throws an uncaught exception error?

Yes.

By default Cypress will automatically fail tests whenever an uncaught exception
bubbles up out of your app.

Cypress exposes an event for this (amongst many others) that you can listen for
to either:

- Debug the error instance itself
- Prevent Cypress from failing the test

This is documented in detail on the
[Catalog Of Events](/api/events/catalog-of-events) page and the recipe
[Handling errors](/examples/examples/recipes#Fundamentals).

## <Icon name="angle-right"></Icon> Will Cypress fail the test when an application has unhandled rejected promise?

By default no, Cypress does not listen to the unhandled promise rejection event
in your application, and thus does not fail the test. You can set up your own
listener though and fail the test, see our recipe
[Handling errors](/examples/examples/recipes#Fundamentals):

```js
// register listener during cy.visit
it('fails on unhandled rejection', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.addEventListener('unhandledrejection', (event) => {
        const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

        // fail the test
        throw new Error(msg)
      })
    },
  })
})

// ALTERNATIVE: register listener for this test
it('fails on unhandled rejection', () => {
  cy.on('window:before:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

      // fail the test
      throw new Error(msg)
    })
  })

  cy.visit('/')
})

// ALTERNATIVE: register listener in every test
before(() => {
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

      // fail the test
      throw new Error(msg)
    })
  })
})

it('fails on unhandled rejection', () => {
  cy.visit('/')
})
```

## <Icon name="angle-right"></Icon> Can I override environment variables or create configuration for different environments?

Yes, you can pass configuration to Cypress via environment variables, CLI
arguments, JSON files and other means.

[Read the Environment Variables guide.](/guides/guides/environment-variables)

## <Icon name="angle-right"></Icon> Can I override or change the default user agent the browser uses?

Yes.
[You can override this with `userAgent` in your Cypress configuration](/guides/references/configuration#Browser).

## <Icon name="angle-right"></Icon> Can I block traffic going to specific domains? I want to block Google Analytics or other providers.

Yes.
[You can set this with `blockHosts` in the Cypress configuration](/guides/references/configuration#Browser).

Also, check out our
[Stubbing Google Analytics Recipe](/examples/examples/recipes#Stubbing-and-spying).

## <Icon name="angle-right"></Icon> How can I verify that calls to analytics like Google Analytics are being made correct?

You can stub their functions and then ensure they're being called.

Check out our
[Stubbing Google Analytics Recipe](/examples/examples/recipes#Stubbing-and-spying).

## <Icon name="angle-right"></Icon> I'm trying to test a chat application. Can I run more than one browser at a time with Cypress?

[We've answered this question in detail here.](/guides/references/trade-offs#Multiple-browsers-open-at-the-same-time)

## <Icon name="angle-right"></Icon> Can I test a chrome extension? How do I load my chrome extension?

Yes. You can test your extensions by
[loading them when we launch the browser.](/api/plugins/browser-launch-api).

## <Icon name="angle-right"></Icon> How can I modify or pass arguments used to launch the browser?

You use the [`before:browser:launch`](/api/plugins/browser-launch-api) plugin
event.

## <Icon name="angle-right"></Icon> Can I make cy.request() poll until a condition is met?

Yes. You do it the
[same way as any other recursive loop](/api/commands/request#Request-Polling).

## <Icon name="angle-right"></Icon> Can I use the Page Object pattern?

Yes.

The page object pattern isn't actually anything "special". If you're coming from
Selenium you may be accustomed to creating instances of classes, but this is
completely unnecessary and irrelevant.

The "Page Object Pattern" should really be renamed to: "Using functions and
creating custom commands".

If you're looking to abstract behavior or roll up a series of actions you can
create reusable
[Custom Commands with our API](/api/cypress-api/custom-commands). You can also
use regular ol' JavaScript functions without any of the ceremony typical with
"Page Objects".

For those wanting to use page objects, we've highlighted the
[best practices ](/api/cypress-api/custom-commands#Best-Practices) for
replicating the page object pattern.

## <Icon name="angle-right"></Icon> Why do my Cypress tests pass locally but not in CI?

There are many reasons why tests may fail in CI but pass locally. Some of these
include:

- There is a problem isolated to the Electron browser (`cypress run` by default
  runs in the Electron browser)
- A test failure in CI could be highlighting a bug in your CI build process
- Variability in timing when running your application in CI (For example,
  network requests that resolve within the timeout locally may take longer in
  CI)
- Machine differences in CI versus your local machine -- CPU resources,
  environment variables, etc.

To troubleshoot why tests are failing in CI but passing locally, you can try
these strategies:

- Test locally with Electron to identify if the issue is specific to the
  browser.
- You can also identify browser-specific issues by running in a different
  browser in CI with the `--browser` flag.
- Review your CI build process to ensure nothing is changing with your
  application that would result in failing tests.
- Remove time-sensitive variability in your tests. For example, ensure a network
  request has finished before looking for the DOM element that relies on the
  data from that network request. You can leverage
  [aliasing](/guides/core-concepts/variables-and-aliases#Aliases) for this.
- Ensure video recording and/or screenshots are enabled for the CI run and
  compare the recording to the Command Log when running the test locally.

## <Icon name="angle-right"></Icon> Why are my video recordings freezing or dropping frames when running in CI?

Videos recorded on Continuous Integration may have frozen or dropped frames if
there are not enough resources available when running the tests in your CI
container. Like with any application, there needs to be the required CPU to run
Cypress and record video. You can run your tests with
[memory and CPU logs enabled](/guides/references/troubleshooting#Log-memory-and-CPU-usage)
to identify and evaluate the resource utilization within your CI.

If you are experiencing this issue, we recommend switching to a more powerful CI
container or provider.

## <Icon name="angle-right"></Icon> What can I do if my tests crash or hang on CI?

As some users have noted, a longer test has a higher chance of hanging or even
crashing when running on CI. When a test runs for a long period of time, its
commands and the application itself might allocate more memory than available,
causing the crash. The exact risk of crashing depends on the application and the
available hardware resources. While there is no single time limit that would
solve this problem, in general we recommend splitting spec files to run in under
one minute each. You can read the blog post
[Make Cypress Run Faster by Splitting Specs](https://glebbahmutov.com/blog/split-spec/)
to learn how to split a spec file.

You can further split individual long-running tests. For example, you can verify
parts of the longer user feature in the separate tests as described in
[Split a very long Cypress test into shorter ones using App Actions](https://www.cypress.io/blog/2019/10/29/split-a-very-long-cypress-test-into-shorter-ones-using-app-actions/).

## <Icon name="angle-right"></Icon> How can I parallelize my runs?

You can read more about parallelization [here](/guides/guides/parallelization).

## <Icon name="angle-right"></Icon> Can I run a single test or group of tests?

You can run a group of tests or a single test by placing an
[`.only`](/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests)
on a test suite or specific test.

You can run a single test file or group of tests by passing the `--spec` flag to
[cypress run](/guides/guides/command-line#cypress-run).

## <Icon name="angle-right"></Icon> How do I test uploading a file?

It is possible to upload files in your application but it's different based on
how you've written your own upload code. The various options are detailed in the
[`.selectFile()` command](/api/commands/selectfile), but in many cases the
simplest option will work:

```javascript
cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/data.json')
```

You can read more about uploading files in
[this issue](https://github.com/cypress-io/cypress/issues/170).

## <Icon name="angle-right"></Icon> What is the projectId for?

The `projectId` is a 6 character string that helps identify your project once
you've [set up your tests to record](/guides/dashboard/runs). It's generated by
Cypress and typically is found in your
[Cypress configuration](/guides/references/configuration).

:::cypress-config-example

```js
{
  projectId: 'a7bq2k'
}
```

:::

For further detail see the
[Identification](/guides/dashboard/projects#Identification) section of the
[Dashboard Service](/guides/dashboard/introduction) docs.

## <Icon name="angle-right"></Icon> What is a Record Key?

A _Record Key_ is a GUID that's generated automatically by Cypress once you've
[set up your tests to record](/guides/dashboard/runs). It helps identify your
project and authenticate that your project is even _allowed_ to record tests.

You can find your project's record key inside of the _Settings_ tab.

<DocsImage src="/img/dashboard/record-key-shown-in-desktop-gui-configuration.jpg" alt="Record Key in Configuration Tab" ></DocsImage>

For further detail see the
[Identification](/guides/dashboard/projects#Identification) section of the
[Dashboard Service](/guides/dashboard/introduction) docs.

## <Icon name="angle-right"></Icon> How do I check that an email was sent out?

<Alert type="warning">

<strong class="alert-header">Anti-Pattern</strong>

Don't try to use your UI to check email. Instead opt to programmatically use 3rd
party APIs or talk directly to your server. Read about this
[best practice](/guides/references/best-practices#Visiting-external-sites) here.

</Alert>

1. If your application is running locally and is sending the emails directly
   through an SMTP server, you can use a temporary local test SMTP server
   running inside Cypress. Read the blog post
   ["Testing HTML Emails using Cypress"](https://www.cypress.io/blog/2021/05/11/testing-html-emails-using-cypress/)
   for details.
2. If your application is using a 3rd party email service, or you cannot stub
   the SMTP requests, you can use a test email inbox with an API access. Read
   the blog post
   ["Full Testing of HTML Emails using SendGrid and Ethereal Accounts"](https://www.cypress.io/blog/2021/05/24/full-testing-of-html-emails-using-ethereal-accounts/)
   for details.

Cypress can even load the received HTML email in its browser to verify the
email's functionality and visual style:

<DocsImage
  src="/img/guides/references/email-test.png"
  title="The HTML email loaded during the test"
  alt="The test finds and clicks the Confirm registration button"></DocsImage>

3. You can use a 3rd party email service that provides temporary email addresses
   for testing. Some of these services even offer a
   [Cypress plugin](/plugins/directory#Email) to access emails.

## <Icon name="angle-right"></Icon> How do I wait for multiple requests to the same url?

You should set up an alias (using [`.as()`](/api/commands/as)) to a single
[`cy.intercept()`](/api/commands/intercept) that matches all of the XHRs. You
can then [`cy.wait()`](/api/commands/wait) on it multiple times. Cypress keeps
track of how many matching requests there are.

```javascript
cy.intercept('/users*').as('getUsers')
cy.wait('@getUsers') // Wait for first GET to /users/
cy.get('#list>li').should('have.length', 10)
cy.get('#load-more-btn').click()
cy.wait('@getUsers') // Wait for second GET to /users/
cy.get('#list>li').should('have.length', 20)
```

## <Icon name="angle-right"></Icon> How do I seed / reset my database?

You can use [`cy.request()`](/api/commands/request),
[`cy.exec()`](/api/commands/exec), or [`cy.task()`](/api/commands/task) to talk
to your back end to seed data.

You could also stub requests directly using
[`cy.intercept()`](/api/commands/intercept) which avoids ever even needing to
fuss with your database.

## <Icon name="angle-right"></Icon> How do I test elements inside an iframe?

We have an [open proposal](https://github.com/cypress-io/cypress/issues/136) to
expand the APIs to support "switching into" an iframe and then back out of them.

## <Icon name="angle-right"></Icon> How do I preserve cookies / localStorage in between my tests?

By default, Cypress automatically
[clears all cookies **before** each test](/api/commands/clearcookies) to prevent
state from building up.

You can preserve specific cookies across tests using the
[Cypress.Cookies api](/api/cypress-api/cookies):

```javascript
// now any cookie with the name 'session_id' will
// not be cleared before each test runs
Cypress.Cookies.defaults({
  preserve: 'session_id',
})
```

You **cannot** currently preserve localStorage across tests and can read more in
[this issue](https://github.com/cypress-io/cypress/issues/461#issuecomment-325402086).

## <Icon name="angle-right"></Icon> Some of my elements animate in; how do I work around that?

Oftentimes you can usually account for animation by asserting
[`.should('be.visible')`](/api/commands/should) or
[another assertion](/guides/core-concepts/introduction-to-cypress#Assertions) on
one of the elements you expect to be animated in.

```javascript
// assuming a click event causes the animation
cy.get('.element').click().should('not.have.class', 'animating')
```

If the animation is especially long, you could extend the time Cypress waits for
the assertion to pass by increasing the `timeout` of the previous command before
the assertion.

```javascript
cy.get('button', { timeout: 10000 }) // wait up to 10 seconds for this 'button' to exist
  .should('be.visible') // and to be visible

cy.get('.element')
  .click({ timeout: 10000 })
  .should('not.have.class', 'animating')
// wait up to 10 seconds for the .element to not have 'animating' class
```

However, most of the time you don't even have to worry about animations. Why
not? Cypress will
[automatically wait](/guides/core-concepts/interacting-with-elements) for
elements to stop animating prior to interacting with them via action commands
like `.click()` or `.type()`.

## <Icon name="angle-right"></Icon> Can I test anchor links that open in a new tab?

Cypress does not and may never have multi-tab support for various reasons.

Luckily there are lots of clear and safe workarounds that enable you to test
this behavior in your application.

[Read through the recipe on tab handling and links to see how to test anchor links.](/examples/examples/recipes#Testing-the-DOM)

## <Icon name="angle-right"></Icon> Can I dynamically test multiple viewports?

Yes, you can. We provide an [example here](/api/commands/viewport#Width-Height).

## <Icon name="angle-right"></Icon> Can I run the same tests on multiple subdomains? <E2EOnlyBadge />

Yes. In this example, we loop through an array of urls and make assertions on
the logo.

```javascript
const urls = ['https://docs.cypress.io', 'https://www.cypress.io']

describe('Logo', () => {
  urls.forEach((url) => {
    it(`Should display logo on ${url}`, () => {
      cy.visit(url)
      cy.get('#logo img').should('have.attr', 'src').and('include', 'logo')
    })
  })
})
```

<DocsImage src="/img/faq/questions/command-log-of-dynamic-url-test.png" alt="Command Log multiple urls" ></DocsImage>

## <Icon name="angle-right"></Icon> How do I require or import node modules in Cypress?

The code you write in Cypress is executed in the browser, so you can import or
require JS modules, _but_ only those that work in a browser.

You can `require` or `import` them as you're accustomed to. We preprocess your
spec files with webpack and Babel.

We recommend utilizing one of the following to execute code outside of the
browser.

- [`cy.task()`](/api/commands/task) to run code in Node via the
  [setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function
- [`cy.exec()`](/api/commands/exec) to execute a shell command

[Check out the "Node Modules" example recipe.](/examples/examples/recipes#Fundamentals)

## <Icon name="angle-right"></Icon> Is there a way to give a proper SSL certificate to your proxy so the page doesn't show up as "not secure"?

No, Cypress modifies network traffic in real time and therefore must sit between
your server and the browser. There is no other way for us to achieve that.

## <Icon name="angle-right"></Icon> Is there any way to detect if my app is running under Cypress?

You can check for the existence of `window.Cypress`, in your **application
code**.

Here's an example:

```javascript
if (window.Cypress) {
  // we are running in Cypress
  // so do something different here
  window.env = 'test'
} else {
  // we are running in a regular ol' browser
}
```

If you want to detect if your Node.js code is running within Cypress, Cypress
sets an OS level environment variable of `CYPRESS=true`. You could detect that
you're running in Cypress by looking for `process.env.CYPRESS`.

## <Icon name="angle-right"></Icon> Do you allow before, beforeEach, after, or afterEach hooks?

Yes. You can read more
[here](/guides/core-concepts/writing-and-organizing-tests#Hooks).

## <Icon name="angle-right"></Icon> I tried to install Cypress in my CI, but I get the error: `EACCES: permission denied`.

First, make sure you have [Node](https://nodejs.org) installed on your system.
`npm` is a Node package that is installed globally by default when you install
Node and is required to install our
[`cypress` npm package](/guides/guides/command-line).

Next, you'd want to check that you have the proper permissions for installing on
your system or you may need to run `sudo npm install cypress`.

## <Icon name="angle-right"></Icon> Is there a way to test that a file got downloaded? I want to test that a button click triggers a download.

There are a lot of ways to test this, so it depends. You'll need to be aware of
what actually causes the download, then think of a way to test that mechanism.

If your server sends specific disposition headers which cause a browser to
prompt for download, you can figure out what URL this request is made to, and
use [cy.request()](/api/commands/request) to hit that directly. Then you can
test that the server send the right response headers.

If it's an anchor that initiates the download, you could test that it has the
right `href` property. As long as you can verify that clicking the button is
going to make the right HTTP request, that might be enough to test for.

Finally, if you want to really download the file and verify its contents, see
our
[File download](https://github.com/cypress-io/cypress-example-recipes#testing-the-dom)
recipe.

In the end, it's up to you to know your implementation and to test enough to
cover everything.

## <Icon name="angle-right"></Icon> Is it possible to catch the promise chain in Cypress?

No. You cannot add a `.catch` error handler to a failed command.
[Read more about how the Cypress commands are not Promises](/guides/core-concepts/introduction-to-cypress#Commands-Are-Not-Promises)

## <Icon name="angle-right"></Icon> Is there a way to modify the screenshots/video resolution?

There is an [open issue](https://github.com/cypress-io/cypress/issues/587) for
more easily configuring this.

You can modify the screenshot and video size when running headlessly with
[this workaround](/api/plugins/browser-launch-api#Set-screen-size-when-running-headless).

## <Icon name="angle-right"></Icon> Does Cypress support ES7?

Yes. You can customize how specs are processed by using one of our
[preprocessor plugins](/plugins/directory) or by
[writing your own custom preprocessor](/api/plugins/preprocessors-api).

Typically you'd reuse your existing Babel and webpack configurations.

## <Icon name="angle-right"></Icon> How does one determine what the latest version of Cypress is?

There are a few ways.

- The easiest way is probably to check our
  [changelog](/guides/references/changelog).
- You can also check the latest version
  [here](https://download.cypress.io/desktop.json).
- It's also always in our [repo](https://github.com/cypress-io/cypress).

## <Icon name="angle-right"></Icon> Is there an ESLint plugin for Cypress or a list of globals?

Yes! Check out our
[ESLint plugin](https://github.com/cypress-io/eslint-plugin-cypress). It will
set up all the globals you need for running Cypress, including browser globals
and [Mocha](https://mochajs.org/) globals.

## <Icon name="angle-right"></Icon> When I visit my site directly, the certificate is verified, however the browser launched through Cypress is showing it as "Not Secure". Why?

When using Cypress to test an HTTPS site, you might see a browser warning next
to the browser URL. This is normal. Cypress modifies the traffic between your
server and the browser. The browser notices this and displays a certificate
warning. However, this is purely cosmetic and does not alter the way your
application under test runs in any way, so you can safely ignore this warning.
The network traffic between Cypress and the backend server still happens via
HTTPS.

See also the [Web Security](/guides/guides/web-security) guide.

## <Icon name="angle-right"></Icon> Is there an option to run Cypress in CI with Developer Tools open? We want to track network and console issues.

No. There is not currently a way to run Cypress in `cypress run` with Developer
Tools open. Refer to
[this issue](https://github.com/cypress-io/cypress/issues/2024) if you'd like
this feature.

You may try running the tests locally and
[select the Electron browser](/guides/guides/launching-browsers#Electron-Browser),
that is as close as you will get with Developer Tools open and replicating the
environment that was run during `cypress run`.

## <Icon name="angle-right"></Icon> How do I run the server and tests together and then shutdown the server?

To start the server, run the tests and then shutdown the server we recommend
[these npm tools](/guides/continuous-integration/introduction#Boot-your-server).

## <Icon name="angle-right"></Icon> Can I test my Electron app?

Testing your Electron app will not 'just work', as Cypress is designed to test
anything that runs in a browser and Electron is a browser + Node.

That being said, we use Cypress to test our own Desktop app's front end - by
stubbing events from Electron. These tests are open source so you can check them
out
[here](https://github.com/cypress-io/cypress/tree/develop/packages/desktop-gui/cypress/integration).

## <Icon name="angle-right"></Icon> I found a bug! What do I do?

- Search existing [open issues](https://github.com/cypress-io/cypress/issues),
  it may already be reported!
- Update Cypress. Your issue may have
  [already been fixed](/guides/references/changelog).
- [open an issue](https://github.com/cypress-io/cypress/issues/new/choose). Your
  best chance of getting a bug looked at quickly is to provide a repository with
  a reproducible bug that can be cloned and run.

## <Icon name="angle-right"></Icon> What are your best practices for organizing tests?

We see organizations _starting_ with Cypress by placing end-to-end tests in a
separate repo. This is a great practice that allows someone on the team to
prototype a few tests and evaluate Cypress within minutes. As the time passes
and the number of tests grows, we _strongly suggest_ moving end-to-end tests to
live right alongside your front end code. This brings many benefits:

- engages developers in writing end-to-end tests sooner
- keeps tests and the features they test in sync
- tests can be run every time the code changes
- allows code sharing between the application code and the tests (like
  selectors)

## <Icon name="angle-right"></Icon> What is the right balance between custom commands and utility functions?

There is already a great section in
[Custom Commands](/api/cypress-api/custom-commands#Best-Practices) guide that
talks about trade-offs between custom commands and utility functions. We feel
reusable functions in general are a way to go. Plus they do not confuse
[IntelliSense like custom commands do](https://github.com/cypress-io/cypress/issues/1065).

## <Icon name="angle-right"></Icon> Can I print the list of commands from a test in the terminal?

If a test fails, Cypress takes a screenshot image, but does not print the list
of commands in the terminal, only the failed assertion. There is a user space
plugin [cypress-failed-log](https://github.com/bahmutov/cypress-failed-log) that
saves a JSON file with all commands from a failed test.

## <Icon name="angle-right"></Icon> Can my tests interact with Redux / Vuex data store?

Usually your end-to-end tests interact with the application through public
browser APIs: DOM, network, storage, etc. But sometimes you might want to make
assertions against the data held inside the application's data store. Cypress
helps you do this. Tests run right in the same browser instance and can reach
into the application's context using [`cy.window`](/api/commands/window). By
conditionally exposing the application reference and data store from the
application's code, you can allow the tests to make assertions about the data
store, and even drive the application via Redux actions.

- see
  [Testing Redux Store](https://www.cypress.io/blog/2018/11/14/testing-redux-store/)
  blog post and [Redux Testing](/examples/examples/recipes#Blogs) recipe.
- see
  [Testing Vue web applications with Vuex data store & REST back end](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)
  blog post and [Vue + Vuex + REST Testing](/examples/examples/recipes#Blogs)
  recipe.

For component testing, you have a bit more control on how you set up your
providers and plugins for state stores. See the
[Mount API Guide](/api/commands/mount) for various examples on using stores with
component testing.

## <Icon name="angle-right"></Icon> How do I spy on console.log?

To spy on `console.log` you should use [cy.stub()](/api/commands/stub).

:::e2e-component-example

```js
cy.visit('/', {
  onBeforeLoad(win) {
    // Stub your functions here
    cy.stub(win.console, 'log').as('consoleLog')
  },
})

// Other test code

cy.get('@consoleLog').should('be.calledWith', 'Hello World!')
```

```js
// Stub your functions here
cy.stub(window.console, 'log').as('consoleLog')

// After that, mount your component
cy.mount(<MyComponent />)

// Other test code

cy.get('@consoleLog').should('be.calledWith', 'Hello World!')
```

:::

Also, check out our
[Stubbing `console` Receipe](/examples/examples/recipes#Stubbing-and-spying).

## <Icon name="angle-right"></Icon> How do I use special characters with `cy.get()`?

Special characters like `/`, `.` are valid characters for ids
[according to the CSS spec](https://www.w3.org/TR/html50/dom.html#the-id-attribute).

To test elements with those characters in ids, they need to be escaped with
[`CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape) or
[`Cypress.$.escapeSelector`](https://api.jquery.com/jQuery.escapeSelector/).

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="Configuration/Setup/TextField.id">Hello World</div>
  </body>
</html>
```

```js
it('test', () => {
  cy.visit('index.html')
  cy.get(`#${CSS.escape('Configuration/Setup/TextField.id')}`).contains(
    'Hello World'
  )

  cy.get(
    `#${Cypress.$.escapeSelector('Configuration/Setup/TextField.id')}`
  ).contains('Hello World')
})
```

Note that `cy.$$.escapeSelector()` doesn't work. `cy.$$` doesn't refer to
`jQuery`. It only queries DOM. [Learn more about why](/api/utilities/$#Notes)

## <Icon name="angle-right"></Icon> Can I use Cypress to test charts and graphs?

Yes. You can leverage visual testing tools to test that charts and graphs are
rendering as expected. For more information, check out the
[Visual Testing guide](/guides/tooling/visual-testing) and the following blog
posts.

- see
  [Testing a chart with Cypress and Applitools](https://glebbahmutov.com/blog/testing-a-chart/)
- see
  [Testing how an application renders a drawing with Cypress and Percy.io](https://glebbahmutov.com/blog/testing-visually/)

## <Icon name="angle-right"></Icon> Why doesn't the `instanceof Event` work?

It might be because of the 2 different windows in the Cypress Test Runner. For
more information, please check
[the note here](/api/commands/window#Cypress-uses-2-different-windows).

## <Icon name="angle-right"></Icon> Can I use Cucumber to write tests?

Yes, you can. You can write feature files containing Cucumber scenarios and then
use Cypress to write your step definitions in your spec files. A special
preprocessor then converts the scenarios and step definitions into "regular"
JavaScript Cypress tests.

- try using the
  [Cucumber preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
  and search our [Plugins](/plugins/directory) page for additional helper
  plugins
- read
  [Cypress Super-patterns: How to elevate the quality of your test suite](https://dev.to/wescopeland/cypress-super-patterns-how-to-elevate-the-quality-of-your-test-suite-1lcf)
  for best practices when writing Cucumber tests

## <Icon name="angle-right"></Icon> Can I test Next.js sites using Cypress?

For end-to-end tests, yes, absolutely. See an example in the
[next-and-cypress-example](https://github.com/bahmutov/next-and-cypress-example)
repository where we show how to instrument the application's source code to get
[code coverage](/guides/tooling/code-coverage) from tests. You can learn how to
set good Cypress tests for a Next.js application in this
[tutorial](https://getstarted.sh/bulletproof-next/e2e-testing-with-cypress).

For component tests, Next.js support is currently in alpha. See the
[Framework Configuration Guide on Next.js](/guides/component-testing/component-framework-configuration#Next-js)
for more info.

## <Icon name="angle-right"></Icon> Can I test Gatsby.js sites using Cypress?

For end-to-end tests, yes, as you can read in the official
[Gatsby docs](https://www.gatsbyjs.com/docs/end-to-end-testing/). You can also
watch the "Cypress + Gatsby webinar"
[recording](https://www.youtube.com/watch?v=Tx6Lg9mwcCE) and browse the
webinar's
[slides](https://cypress.slides.com/amirrustam/cypress-gatsby-confidently-fast-web-development).

For component testing, Gatsby is not currently supported out of the box, but it
might be possible by
[configuring a custom devServer](/guides/references/configuration#devServer).

## <Icon name="angle-right"></Icon> Can I test React applications using Cypress?

For end-to-end testing, yes, absolutely. A good example of a fully tested React
application is our
[Cypress RealWorld App](https://github.com/cypress-io/cypress-example-realworld)
and
[TodoMVC Redux App](https://github.com/cypress-io/cypress-example-todomvc-redux).
You can even use React DevTools while testing your application, read
[The easiest way to connect Cypress and React DevTools](https://dev.to/dmtrkovalenko/the-easiest-way-to-connect-cypress-and-react-devtools-5hgm).
If you really need to select React components by their name, props, or state,
check out
[cypress-react-selector](https://github.com/abhinaba-ghosh/cypress-react-selector).

For component testing, we support various different frameworks like Create React
App, Vite, and Next.js for React applications. See the
[Framework Configuration Guide](/guides/component-testing/component-framework-configuration)
for more info.

## <Icon name="angle-right"></Icon> Can I check the GraphQL network calls using Cypress?

Yes, by using the newer API command [cy.intercept()](/api/commands/intercept) as
described in the
[Smart GraphQL Stubbing in Cypress](https://glebbahmutov.com/blog/smart-graphql-stubbing/)
post or by utilizing the
[cypress-graphql-mock](https://github.com/tgriesser/cypress-graphql-mock)
plugin.

## <Icon name="angle-right"></Icon> Can Cypress be used for model-based testing?

Yes, for example see [this webinar](https://www.youtube.com/watch?v=U30BKedA2CY)
hosted by Curiosity Software. In addition, since our
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) is
implemented using XState model state library, we are looking for ways to make
model-based testing simpler and more powerful. Read
[Access XState from Cypress Test](https://glebbahmutov.com/blog/cypress-and-xstate/)
for our start.

## <Icon name="angle-right"></Icon> Can Cypress be used for performance testing?

Cypress is not built for performance testing. Because Cypress instruments the
page under test, proxies the network requests, and tightly controls the test
steps, Cypress adds its own overhead. Thus, the performance numbers you get from
Cypress tests are slower than "normal" use. Still, you can access the native
`window.performance` object and grab the page time measurements, see the
[Evaluate performance metrics](https://github.com/cypress-io/cypress-example-recipes#testing-the-dom)
recipe. You can also
[run Lighthouse audit straight from Cypress](https://www.mariedrake.com/post/web-performance-testing-with-google-lighthouse)
via [cypress-audit](https://www.npmjs.com/package/cypress-audit) community
plugin.

## <Icon name="angle-right"></Icon> Can Cypress test WASM code?

Yes, read the blog post
[Cypress WASM Example](https://glebbahmutov.com/blog/cypress-wasm-example/). We
welcome more user feedback to make WASM testing simpler.

## <Icon name="angle-right"></Icon> Can I use Cypress to document my application?

End-to-end tests are an excellent way to keep your application's documentation
accurate and up-to-date. Read
[Cypress Book](https://glebbahmutov.com/blog/cypress-book/) blog post, and take
a look at [cypress-movie](https://github.com/bahmutov/cypress-movie) project.

## <Icon name="angle-right"></Icon> Can I use Jest snapshots?

While there is no built-in `snapshot` command in Cypress, you can make your own
snapshot assertion command. Read how to do so in our blog post
[End-to-End Snapshot Testing](https://www.cypress.io/blog/2018/01/16/end-to-end-snapshot-testing/).
We recommend using the 3rd-party module
[cypress-plugin-snapshots](https://github.com/meinaart/cypress-plugin-snapshots).
For other snapshot plugins, search the [Plugins](/plugins/directory) page.

## <Icon name="angle-right"></Icon> Can I use Testing Library?

Absolutely! Feel free to add the
[@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
to your setup and use its methods like `findByRole`, `findByLabelText`,
`findByText`, `findByTestId`, and others to find the DOM elements.

The following example comes from the Testing Library's documentation

```js
cy.findByRole('button', { name: /Jackie Chan/i }).click()
cy.findByRole('button', { name: /Button Text/i }).should('exist')
cy.findByRole('button', { name: /Non-existing Button Text/i }).should(
  'not.exist'
)

cy.findByLabelText(/Label text/i, { timeout: 7000 }).should('exist')

// findAllByText _inside_ a form element
cy.get('form')
  .findByText('button', { name: /Button Text/i })
  .should('exist')

cy.findByRole('dialog').within(() => {
  cy.findByRole('button', { name: /confirm/i })
})
```

We have had a webinar with [Roman Sandler](https://twitter.com/RomanSndlr) where
he has given practical advice on writing effective tests using the Testing
Library. You can find the recording and the slides
[here](https://www.cypress.io/blog/2020/07/15/webcast-recording-build-invincible-integration-tests-using-cypress-and-cypress-testing-library/).

## <Icon name="angle-right"></Icon> How do I prevent the application from opening a new browser window?

If the application is opening a second browser window or tab, the test can stop
that action. Read the linked resources for to learn how to:

- [deal with `<a target="_blank">` links](https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-target_blank)
- [deal with `window.open` calls](https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-windowopen)

## <Icon name="angle-right"></Icon> How do I prevent application redirecting to another URL?

Sometimes, your application might redirect the browser to another domain, losing
the Cypress's control. If the application is using `window.location.replace`
method to set a _relative_ URL, try using the `experimentalSourceRewriting`
option described in our [Experiments](/guides/references/experiments) page. You
can also try rewriting the problematic application code from the test using the
`cy.intercept` command, as described in the
[Deal with `window.location.replace`](https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-windowlocationreplace)
tip.

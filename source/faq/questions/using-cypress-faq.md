---
layout: toc-top
title: Using Cypress
comments: false
containerClass: faq
---

## {% fa fa-angle-right %} How do I get an element's text contents?

Cypress commands yield jQuery objects, so you can simply call methods on them.

If you're just trying to assert on an element's text content:

```javascript
cy.get('div').should('have.text', 'foobarbaz')
```

If you'd like to work with the text prior to an assertion:

```javascript
cy.get('div').should(($div) => {
  const text = $div.text()

  expect(text).to.match(/foo/)
  expect(text).to.include('foo')
  expect(text).not.to.include('bar')
})
```

If you need to hold a reference or compare values of text:

```javascript
cy.get('div').invoke('text').then((text1) => {
  // do more work here

  // click the button which changes the div's text
  cy.get('button').click()

  // grab the div again and compare its previous text
  // to the current text
  cy.get('div').invoke('text').should((text2) => {
    expect(text1).not.to.eq(text2)
  })
})
```

jQuery's `.text()` method automatically calls `elem.textContent` under the hood. If you'd like to instead use `innerText` you can do the following:

```javascript
cy.get('div').should(($div) => {
  // access the native DOM element
  expect($div.get(0).innerText).to.eq('foobarbaz')
})
```

## {% fa fa-angle-right %} How do I get an input's value?

Cypress yields you jQuery objects, so you can simply call methods on them.

If you're just trying to assert on an input's value:

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

If you need to hold a reference reference or compare values of text:

```javascript
cy.get('input').invoke('val').then((val1) => {
  // do more work here

  // click the button which changes the input's value
  cy.get('button').click()

  // grab the input again and compare its previous value
  // to the current value
  cy.get('input').invoke('val').should((val2) => {
    expect(val1).not.to.eq(val2)
  })
})
```

## {% fa fa-angle-right %} How do I compare the value or state of one thing to another?

Our {% url 'Variables and Aliases guide' variables-and-aliases %} gives you examples of doing exactly that.

## {% fa fa-angle-right %} How do I get the native DOM reference of an element found using Cypress?

Cypress wraps elements in jQuery so you'd just get the native element from there within a {% url "`.then()`" then %} command.

```javascript
cy.get('button').then(($el) => {
  $el.get(0)
})
```

## {% fa fa-angle-right %} How do I do something different if an element doesn't exist?

What you're asking about is conditional testing and control flow.

Please read our extensive {% url 'Conditional Testing Guide' conditional-testing %} which explains this in detail.

## {% fa fa-angle-right %} Can I use the new ES7 async / await syntax?

No. The Command API is not designed in a way that makes this possible.

If you're curious please read:

- Our {% url 'Introduction to Cypress guide' introduction-to-cypress#Commands-Are-Asynchronous %} which explains how the Commands are designed
- Our {% url 'Variables and Aliases guide' variables-and-aliases %} which talks about patterns dealing with async code

## {% fa fa-angle-right %} Can I prevent Cypress from failing my test when my application throws an uncaught exception error?

Yes.

By default Cypress will automatically fail tests whenever an uncaught exception bubbles up out of your app.

Cypress exposes an event for this (amongst many others) that you can listen for to either:

- Debug the error instance itself
- Prevent Cypress from failing the test

This is documented in detail on the {% url "Catalog Of Events" catalog-of-events %} page.

## {% fa fa-angle-right %} Can I override environment variables or create configuration for different environments?

Yes, you use your `pluginsFile` to modify configuration values and environment variables.

{% url "We have a whole API document showing you how to do just that." configuration-api %}

## {% fa fa-angle-right %} Can I override or change the default user agent the browser uses?

Yes. {% url "You can override this with `userAgent` in `cypress.json`." configuration#Browser %}

## {% fa fa-angle-right %} Can I block traffic going to specific domains? I want to block Google Analytics or other providers.

Yes. {% url "You can set this with `blacklistHosts` in `cypress.json`." configuration#Browser %}

Also, check out our {% url 'Google Analytics Recipe' recipes#Stubbing-Google-Analytics %}.

## {% fa fa-angle-right %} How can I verify that calls to analytics like Google Analytics are being made correct?

Easy - you stub their functions and then ensure they're being called.

Check out our {% url 'Google Analytics Recipe' recipes#Stubbing-Google-Analytics %}.

## {% fa fa-angle-right %} I'm trying to test a chat application. Can I run more than one browser at a time with Cypress?

{% url "We've answered this question in detail here." trade-offs#Multiple-browsers %}

## {% fa fa-angle-right %} Can I test a chrome extension? How do I load my chrome extension?

Yes. You can test your extensions by {% url 'loading them when we launch the browser.' browser-launch-api %}.

## {% fa fa-angle-right %} How can I modify or pass arguments used to launch the browser?

You use the {% url `before:browser:launch` browser-launch-api %} plugin event.

## {% fa fa-angle-right %} Can I make cy.request() poll until a condition is met?

Yes. You do it the {% url 'same way as any other recursive loop' request#Request-Polling %}.

## {% fa fa-angle-right %} Can I use the Page Object pattern?

Yes.

The page object pattern isn't actually anything "special". If you're coming from Selenium you may be accustomed to creating instances of classes, but this is completely unnecessary and irrelevant.

The "Page Object Pattern" should really be renamed to: "Using functions and creating custom commands".

If you're looking to abstract behavior or roll up a series of actions you can create reusable {% url 'Custom Commands with our API' custom-commands %}. You can also just use regular ol' JavaScript functions without any of the ceremony typical with "Page Objects".

For those wanting to use page objects, we've highlighted the {% url 'best practices ' custom-commands#Best-Practices %} for replicating the page object pattern.

## {% fa fa-angle-right %} How can I parallelize my runs?

You can read more about parallelization {% issue 64 'here' %}.

## {% fa fa-angle-right %} Can I run a single test or group of tests?

You can run a group of tests or a single test by placing an {% url `.only` writing-and-organizing-tests#Excluding-and-Including-Tests %} on a test suite or specific test.

You can run a single test file headlessly by passing the `--spec` flag to {% url '`cypress run`' command-line#cypress-run %}.

Currently there is no way to specify a group of test files to run headlessly. You can read more {% issue 263 'here' %}.

## {% fa fa-angle-right %} How do I test uploading a file?

It is possible to upload files in your application but it's different based on how you've written your own upload code. You can read more about this {% issue 170 'here' %}

## {% fa fa-angle-right %} What is the projectId for?

Once you {% url "set up your tests to record" dashboard-service#Recorded-runs %}, we generate a unique `projectId` for your project and automatically insert it into your `cypress.json` file.

***The `projectId` is a 6 character string in your cypress.json:***

```json
{
  "projectId": "a7bq2k"
}
```

This is how we uniquely identify your project. If you manually alter this, *Cypress will no longer be able to identify your project or find the recorded tests for it*. We recommend that you check your `cypress.json`, including the `projectId`, into source control.

## {% fa fa-angle-right %} What is a Record Key?

Once you're {% url "set up to record test runs" dashboard-service#Recorded-runs %}, we automatically generate a *Record Key* for the project.

***A record key is a GUID that looks like this:***

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

{% note info  %}
You can create multiple Record Keys for a project, or delete existing ones from our {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.
{% endnote %}

You can also find your Record Key inside of the *Settings* tab in the Test Runner.

![Settings Tab of Test Runner](/img/dashboard/record-key-shown-in-desktop-gui-configuration.png)

## {% fa fa-angle-right %} How do I check that an email was sent out?

{% note warning 'Anti-Pattern' %}
Don't try to use your UI to check email. Instead opt to programmatically use 3rd party API's or talk directly to your server. Read about this {% url 'best practice' best-practices#Visiting-external-sites %} here.
{% endnote %}

## {% fa fa-angle-right %} How do I wait for multiple XHR requests to the same url?

You should set up an alias (using {% url `.as()` as %}) to a single {% url `cy.route()` route %} that matches all of the XHRs. You can then {% url `cy.wait()` wait %} on it multiple times. Cypress keeps track of how many matching XHR requests there are.

```javascript
cy.server()
cy.route('users').as('getUsers')
cy.wait('@getUsers')  // Wait for first GET to /users/
cy.get('#list>li').should('have.length', 10)
cy.get('#load-more-btn').click()
cy.wait('@getUsers')  // Wait for second GET to /users/
cy.get('#list>li').should('have.length', 20)
```

## {% fa fa-angle-right %} How do I seed / reset my database?

You can use either {% url `cy.request()` request %} or {% url `cy.exec()` exec %} to talk to your backend to seed data.

You could also just stub XHR requests directly using {% url `cy.route()` route %} which avoids ever even needing to fuss with your database.

## {% fa fa-angle-right %} How do I test elements inside an iframe?

As of {% issue 136#issuecomment-328100955 `0.20.0` %} you can now wrap the elements of an iframe and work with them.

We have an {% issue 685 'open proposal' %} to expand the API's to support "switching into" an iframe and then back out of them.

## {% fa fa-angle-right %} How do I preserve cookies / localStorage in between my tests?

By default, Cypress automatically {% url "clears all cookies **before** each test" clearcookies %} to prevent state from building up.

You can whitelist specific cookies to be preserved across tests using the {% url "Cypress.Cookies api" cookies %}:

```javascript
// now any cookie with the name 'session_id' will
// not be cleared before each test runs
Cypress.Cookies.defaults({
  whitelist: "session_id"
})
```

You can **not** currently preserve localStorage across tests and can read more {% issue '461#issuecomment-325402086' 'here' %}.

## {% fa fa-angle-right %} Some of my elements animate in, how do I work around that?

Oftentimes you can usually account for animation by asserting {% url "`.should('be.visible')`" should %} or {% url "another assertion" introduction-to-cypress#Assertions %} on one of the elements you expect to be animated in.

```javascript
// assuming a click event causes the animation
cy.get('.element').click().should('not.have.class', 'animating')
```

If the animation is especially long, you could extend the time Cypress waits for the assertion to pass by increasing the `timeout` of the previous command before the assertion.

```javascript
cy.get('button', { timeout: 10000 }) // wait up to 10 seconds for this 'button' to exist
  .should('be.visible')              // and to be visible

cy.get('.element').click({ timeout: 10000 }).should('not.have.class', 'animating')
// wait up to 10 seconds for the .element to not have 'animating' class

```

However, most of the time you don't even have to worry about animations. Why not?  Cypress will {% url "automatically wait" interacting-with-elements %} for elements to stop animating prior to interacting with them via action commands like `.click()` or `.type()`.

## {% fa fa-angle-right %} Can I test anchor links that open in a new tab?

Cypress does not and may never have multi-tab support for various reasons.

Luckily there are lots of easy and safe workarounds that enable you to test this behavior in your application.

{% url 'Read through this recipe to see how to test anchor links.' recipes#Tab-Handling-and-Links %}


## {% fa fa-angle-right %} How do I require or import node modules in Cypress?

The code you write in Cypress is executed in the browser, so you can import or require JS modules, *but* only those that work in a browser.

You can simply `require` or `import` them as you're accustomed to. We preprocess your spec files with `babel` and `browserify`.

Cypress doesn't have direct access to node or your file system. We recommend utilizing {% url `cy.exec()` exec %} or {% url `cy.readFile()` readfile %} to execute a shell command or a node script that will do what you need.

{% url 'Check out this example recipe.' recipes#Node-Modules %}

## {% fa fa-angle-right %} Is there a way to give a proper SSL certificate to your proxy so the page doesn't show up as "not secure"?

No, Cypress modifies network traffic in real time and therefore must sit between your server and the browser. There is no other way for us to achieve that.

## {% fa fa-angle-right %} Is there any way to detect if my app is running under Cypress?

You can check for the existence of `window.Cypress`, in your **application code**.

Here's a simple example:

```javascript
if (window.Cypress) {
  // we are running in Cypress
  // so do something different here
  window.env = 'test'
} else {
  // we are running in a regular ol' browser
}
```

## {% fa fa-angle-right %} Do you allow before, beforeEach, after, or afterEach hooks?

Yes. You can read more {% url "here" writing-and-organizing-tests#Hooks %}.

## {% fa fa-angle-right %} I tried to install Cypress in my CI, but I get the error: `EACCES: permission denied`.

First, make sure you have {% url "`node`" https://nodejs.org %} installed on your system. `npm` is a `node` package that is installed globally by default when you install node and is required to install our {% url "`cypress` npm  package" command-line %}.

Next, you'd want to check that you have the proper permissions for installing on your system or you may need to run `sudo npm install cypress`.

## {% fa fa-angle-right %} Is there a way to test that a file got downloaded? I want to test that a button click triggers a download.

There are a lot of ways to test this, so it depends. You'll need to be aware of what actually causes the download, then think of a way to test that mechanism.

If your server sends specific disposition headers which cause a browser to prompt for download, you can figure out what URL this request is made to, and use {% url "cy.request()" request %} to hit that directly. Then you can test that the server send the right response headers.

If it's just an anchor that initiates the download, you could just test that it has the right `href` property. As long as you can verify that clicking the button is going to make the right HTTP request, there's nothing else to test for.

In the end, it's up to you to know your implementation and to test just enough to cover everything.

## {% fa fa-angle-right %} Is is possible to catch the promise chain in Cypress?

No. You cannot add a `.catch` error handler to a failed command. {% url "Read more about how the Cypress commands are not Promises" introduction-to-cypress#Commands-Are-Not-Promises %}

## {% fa fa-angle-right %} Is there a way to modify the screenshots/video resolution?

Not at the moment. {% issue 587 "There is an open issue for this." %}

## {% fa fa-angle-right %} Does Cypress support ES7?

Not currently. It uses {% url "browserify" http://browserify.org/ %} and {% url "babelify" https://github.com/babel/babelify %} with the presets/plugins are hard-coded. {% issue 343 "There is an open issue for making this configurable." %}

## {% fa fa-angle-right %} How does one determine what the latest version of Cypress is?

There are a few ways.

- The easiest way is probably to check our {% url "changelog" changelog %}.
- You can also check the latest version {% url "here" https://download.cypress.io/desktop.json %}.
- It's also always in our {% url "repo" https://github.com/cypress-io/cypress %}.

## {% fa fa-angle-right %} Is there an ESLint plugin for Cypress or a list of globals?

Yes! Check out our {% url "ESLint plugin" https://github.com/cypress-io/eslint-plugin-cypress %}. It will set up all the globals you need for running Cypress, including browser globals and {% url "Mocha" https://mochajs.org/ %} globals.

## {% fa fa-angle-right %} When I visit my site directly, the certificate is verified, however the browser launched through Cypress is showing it as "Not Secure". Why?

This is normal. Cypress modifies the traffic between your server and the browser. The browser notices this and displays a certificate warning. However, this is purely cosmetic and does not alter the way your application under test runs in any way, so you can safely ignore this warning.

## {% fa fa-angle-right %} Is there an option to run Cypress with DevTools open? We want to track network and console issues.

No. This is definitely the motivation behind {% issue 448 "this open issue" %}, but there is not a way to run Cypress headlessly with DevTools open.

You may try running the tests locally and {% url "select the Electron browser" launching-browsers#Electron-Browser %}, that's as close as you'll get with DevTools open and replicating the environment that was run headlessly.

## {% fa fa-angle-right %} How do I run the server and tests together and then shutdown the server?

To start the server, run the tests and then shutdown the server we recommend {% url "these NPM tools" continuous-integration#Helpers %}.

## {% fa fa-angle-right %} Can I test my Electron app?

Testing your Electron app will not 'just work', as Cypress is designed to test anything that runs in a browser and Electron is a browser + node.

That being said, we use Cypress to test our own Desktop app's front end - by stubbing events from Electron. These tests are open source so you can check them out {% url "here" https://github.com/cypress-io/cypress/tree/develop/packages/desktop-gui/cypress/integration %}.

## {% fa fa-angle-right %} I found a bug! What do I do?

- Search existing {% url "open issues" https://github.com/cypress-io/cypress/issues %}, it may already be reported!
- Update Cypress. Your issue may have {% url "already been fixed" changelog %}.
- {% open_an_issue %}. Your best chance of getting a bug looked at quickly is to provide a repository with a reproducible bug that can be cloned and run.

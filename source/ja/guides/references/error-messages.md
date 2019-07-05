---
layout: toc-top
title: エラーメッセージ
---

# Test File Errors

## {% fa fa-exclamation-triangle red %} No tests found in your file

This message means that Cypress was unable to find tests in the specified file. You'll likely get this message if you have an empty test file and have not yet written any tests.

{% imgTag /img/guides/no-tests-found.png "No tests found" %}

## {% fa fa-exclamation-triangle red %} We found an error preparing your test file

This message means that Cypress encountered an error when compiling and/or bundling your test file. Cypress automatically compiles and bundles your test code so you can use ES2015, CoffeeScript, modules, etc.

### You'll typically receive this message due to:

- The file not existing
- A syntax error in the file or one of its dependencies
- A missing dependency

When the error is fixed in your test file, your tests will automatically re-run.

# Support File Errors

## {% fa fa-exclamation-triangle red %} Support file missing or invalid

The `supportFolder` option was removed from Cypress in version {% url `0.18.0` changelog#0-18-0 %} and was replaced by module support and the {% url `supportFile` configuration#Folders-Files %} configuration option.

Cypress used to automatically include any scripts in the `supportFolder` before your test files. However, automatically including all the files in a certain directory is somewhat magical and unintuitive, and requires creating globals for the purpose of utility functions.

### Use modules for utility functions

Cypress supports both ES2015 modules and CommonJS modules. You can import/require npm modules as well as local modules:

```javascript
import _ from 'lodash'
import util from './util'

it('uses modules', function () {
  expect(_.kebabCase('FooBar')).to.equal('foo-bar')
  expect(util.secretCode()).to.equal('1-2-3-4')
})
```

### Use supportFile to load scripts before your test code

It's still useful to load a setup file before your test code. If you are setting Cypress defaults or utilizing custom Cypress commands, instead of needing to import/require those defaults/commands in every test file, you can use the {% url `supportFile` configuration#Folders-Files %} configuration option.

To include code before your test files, set the {% url `supportFile` configuration#Folders-Files %} path. By default, {% url `supportFile` configuration#Folders-Files %} is set to look for one of the following files:

* `cypress/support/index.js`
* `cypress/support/index.coffee`

Just like with your test files, the {% url `supportFile` configuration#Folders-Files %} can use ES2015+ (or CoffeeScript) and modules, so you can import/require other files as needed.

# Command Errors

## {% fa fa-exclamation-triangle red %} Cypress cannot execute commands outside a running test

{% imgTag /img/guides/cypress-cannot-execute.png "Cannot execute commands" %}

This message means you tried to execute one or more Cypress commands outside of a currently running test. Cypress has to be able to associate commands to a specific test.

Typically this happens accidentally, like in the following situation.

```javascript
describe('Some Tests', function () {
  it('is true', function () {
    expect(true).to.be.true   // yup, fine
  })

  it('is false', function () {
    expect(false).to.be.false // yup, also fine
  })

  context('some nested tests', function () {
    // oops you forgot to write an it(...) here!
    // these cypress commands below
    // are running outside of a test and cypress
    // throws an error
    cy.visit('http://localhost:8080')
    cy.get('h1').should('contain', 'todos')
  })
})
```

Move those Cypress commands into an `it(...)` block and everything will work correctly.

If you are purposefully writing commands outside of a test, there is probably a better way to accomplish what you're trying to do. Read through the {% url "Examples" examples/examples/recipes %}, {% url "chat with someone in our chat" https://gitter.im/cypress-io/cypress %}, or {% open_an_issue %}.

## {% fa fa-exclamation-triangle red %} `cy...()` failed because the element you are chaining off of has become detached or removed from the dom

Getting this errors means you've tried to interact with a "dead" DOM element - meaning it's been detached or completely removed from the DOM.

{% imgTag /img/guides/cy-method-failed-element-is-detached.png "cy.method() failed because element is detached" %}

Cypress errors because it can't interact with "dead" elements - just like a real user could not do this either. Understanding how this happens is very important - and it is often easy to prevent.

Let's take a look at an example below.

### Application HTML

```html
<body>
  <div id="parent">
    <button>delete</button>
  </div>
</body>
```

### Application JavaScript

```javascript
$('button').click(() => {
  // when the <button> is clicked
  // we remove the button from the DOM
  $(this).remove()
})
```

### Test Code causing error

```javascript
cy.get('button').click().parent()
```

We've programmed our application above so that as soon as the `click` event happens, the button is removed from the DOM. When Cypress begins processing the next command ({% url `.parent()` parent %}) in the test above, it detects that the yielded subject (the button) is detached from the DOM and throws the error.

We can prevent Cypress from throwing this error by rewriting our test code.

### Fixed Test Code

```javascript
cy.get('button').click()
cy.get('#parent')
```

The above example is an oversimplification. Let's look at a more complex example.

In modern JavaScript frameworks, DOM elements are regularly re-rendered - meaning that the old element is thrown away and a new one is put in its place. Because this happens so fast, it may *appear* as if nothing has visibly changed to the user. But if you are in the middle of executing test commands, it's possible the element you're interacting with has become "dead". To deal with this situation you must:

- Understand when your application re-renders
- Re-query for newly added DOM elements
- *Guard* Cypress from running commands until a specific condition is met

When we say *guard*, this usually means:

- Writing an assertion
- Waiting on an XHR

## {% fa fa-exclamation-triangle red %} `cy....()` failed because the element cannot be interacted with

You may see a variation of this message for 4 different reasons:

1. The element is not visible
2. The element is being covered by another element
3. The element's center is hidden from view
4. The element is disabled

Cypress runs several calculations to ensure an element can *actually* be interacted with like a real user would. If you're seeing this error, the solution is often obvious. You may need to *guard* your commands (due to a timing or an animation issue).

There have been situations where Cypress does not correctly allow you to interact with an element that should be interactable. If that's the case, {% open_an_issue %}.

If you'd like to override these built-in checks, provide the `{force: true}` option to the action itself. Refer to each command for their available options, additional use cases, and argument usage.

### Ignore built-in error checking

```javascript
cy.get('[disabled]').click({force: true}).
```

*Be careful with this option. It's possible to force your tests to pass when the element is actually not interactable in your application.*

## {% fa fa-exclamation-triangle red %} `cy....()` failed because the element is currently animating

{% imgTag /img/guides/cy-method-failed-element-is-animating.png "cy.method() failed because element is animating" %}

By default Cypress detects if an element you're trying to interact with is animating. This check ensures that an element is not animating too quickly for a real user to interact with the element. This also prevents some edge cases where actions, such as {% url `.type()` type %} or {% url `.click()` click %}, happened too fast during a transition.

Cypress will continuously attempt to interact with the element until it eventually times out. If you'd like to force Cypress to interact with the element there are a few options:

- Pass `{force: true}`. This disables *all* error checking
- Pass `{waitForAnimations: false}` to disable animation error checking
- Pass `{animationDistanceThreshold: 20}` to decrease the sensitivity of detecting if an element is animating. By increasing the threshold this enables your element to move farther on the page without causing Cypress to continuously retry.

```javascript
cy.get('#modal button').click({ waitForAnimations: false })
```

You can globally disable animation error checking, or increase the threshold by modifying the {% url 'configuration' configuration %} in your {% url 'configuration' configuration %}.

### cypress.json

```json
{
  "waitForAnimations": false,
  "animationDistanceThreshold": 50
}
```

## {% fa fa-exclamation-triangle red %} The test has finished but Cypress still has commands in its queue

Let's examine several different ways you may get this error message. In every situation, you'll need to change something in your test code to prevent the error.

{% imgTag /img/guides/the-test-has-finished.png "The test has finished but Cypress still has commands" %}

{% note warning Flaky tests below! %}
Several of these tests are dependent on race conditions. You may have to run these tests multiple times before they will actually fail. You can also try tweaking some of the delays.
{% endnote %}

### Simple Example

This first test below will pass and shows you that Cypress tries to prevent leaving commands behind in the queue in every test.

Even though we return a string in our test, Cypress automatically figures out that you've queued commands above and does not end the test until all cy commands have finished.

```javascript
// This test passes!
it('Cypress is smart and this does not fail', function () {
  cy.get('body').children().should('not.contain', 'foo') // <- no return here

  return 'foobarbaz'    // <- return here
})
```

The example below will fail because you've forcibly terminated the test early with mocha's `done`.

```javascript
// This test errors!
it('but you can forcibly end the test early which does fail', function (done) {
  cy.get('body')
    .then(() => {
      done() // forcibly end test even though there are commands below
    })
    .children()
    .should('not.contain', 'foo')
})
```

### Complex Async Example

What's happening in this example is that because we have *NOT* told Mocha this is an asynchronous test, this test will pass *immediately* then move onto the next test. Then, when the `setTimeout` callback function runs, new commands will get queued on the wrong test. Cypress will detect this and fail the *next* test.

```javascript
describe('a complex example with async code', function() {
  it('you can cause commands to bleed into the next test', function() {
    // This test passes...but...
    setTimeout(() => {
      cy.get('body').children().should('not.contain', 'foo')
    }, 10)
  })

  it('this test will fail due to the previous poorly written test', function() {
    // This test errors!
    cy.wait(10)
  })
})
```

The correct way to write the above test code is using Mocha's `done` to signify it is asynchronous.

```javascript
it('does not cause commands to bleed into the next test', function (done) {
  setTimeout(() => {
    cy.get('body').children().should('not.contain', 'foo').then(() => {
      done()
    })
  }, 10)
})
```

### Complex Promise Example

In the example below, we forget to return the `Promise` in our test. This means the test passes synchronously but our `Promise` resolves in the next test.
This also causes the commands to be queued on the wrong test. We will get the error in the next test that Cypress detected it had commands in its command queue.

```javascript
describe('another complex example using a forgotten "return"', function () {
  it('forgets to return a promise', function () {
    // This test passes...but...
    Cypress.Promise.delay(10).then(() => {
      cy.get('body').children().should('not.contain', 'foo')
    })
  })

  it('this test will fail due to the previous poorly written test', function () {
    // This test errors!
    cy.wait(10)
  })
})
```

The correct way to write the above test code would be to return our `Promise`:

```javascript
it('does not forget to return a promise', function () {
  return Cypress.Promise.delay(10).then(() => {
    return cy.get('body').children().should('not.contain', 'foo')
  })
})
```

## {% fa fa-exclamation-triangle red %} `cy.visit()` failed because you are attempting to visit a second unique domain

See our {% url "Web Security" web-security#Limitations %} documentation.

## {% fa fa-exclamation-triangle red %} `Cypress.addParentCommand()` / `Cypress.addDualCommand()` / `Cypress.addChildCommand()` has been removed and replaced by `Cypress.Commands.add()`

In version {% url "`0.20.0`" changelog %}, we removed the commands for adding custom commands and replaced them with, what we believe to be, a simpler interface.

Now you can create parent, dual, and child commands using the same {% url "`Cypress.Commands.add()`" custom-commands %} command.

Please read our {% url "new documentation on writing custom commands" custom-commands %}.

## {% fa fa-exclamation-triangle red %} Cypress detected that you invoked one or more `cy` commands in a custom command but returned a different value.

Because `cy` commands are asynchronous and are queued to be run later, it doesn't make sense to return anything else.

For convenience, you can also omit any return value or return `undefined` and Cypress will not error.

In versions before {% url "`0.20.0`" changelog %} of Cypress we automatically detected this and forced the `cy` commands to be returned. To make things less magical and clearer, we are now throwing an error.

## {% fa fa-exclamation-triangle red %} Cypress detected that you invoked one or more `cy` commands but returned a different value.

Because cy commands are asynchronous and are queued to be run later, it doesn't make sense to return anything else.

For convenience, you can also omit any return value or return `undefined` and Cypress will not error.

In versions before {% url "`0.20.0`" changelog %} of Cypress we automatically detected this and forced the `cy` commands to be returned. To make things less magical and clearer, we are now throwing an error.

## {% fa fa-exclamation-triangle red %} Cypress detected that you returned a promise from a command while also invoking one or more cy commands in that promise.

Because Cypress commands are already promise-like, you don't need to wrap them or return your own promise.

Cypress will resolve your command with whatever the final Cypress command yields.

The reason this is an error instead of a warning is because Cypress internally queues commands serially whereas Promises execute as soon as they are invoked. Attempting to reconcile this would prevent Cypress from ever resolving.

## {% fa fa-exclamation-triangle red %} Cypress detected that you returned a promise in a test, but also invoked one or more `cy` commands inside of that promise.

While this works in practice, it's often indicative of an anti-pattern. You almost never need to return both a promise and also invoke `cy` commands.

`cy` commands themselves are already promise like, and you can likely avoid the use of the separate Promise.

## {% fa fa-exclamation-triangle red %} Passing `cy.route({stub: false})` or `cy.server({stub: false})` is now deprecated.

You can safely remove: `{stub: false}`.

# CLI Errors

## {% fa fa-exclamation-triangle red %} You passed the `--record` flag but did not provide us your Record Key.

You may receive this error when trying to run Cypress tests in {% url 'Continuous Integration' continuous-integration %}. This means that you did not pass a specific record key to: {% url '`cypress run --record`' command-line#cypress-run %}.

Since no record key was passed, Cypress checks for any environment variable with the name `CYPRESS_RECORD_KEY`. In this case, that was also not found.

You can get your project's record key by locating it in your settings tab in the Test Runner or in the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

You will want to then {% url 'add the key to your config file or as an environment variable' continuous-integration#Record-tests %}.

## {% fa fa-exclamation-triangle red %} The `cypress ci` command has been deprecated

As of version {% url `0.19.0` changelog#0-19-0 %} and CLI versions `0.13.0`, the `cypress ci` command has been deprecated. We did this to make it clearer what the difference was between a *regular test run* and a *recorded test run*.

Previously to record runs you had the environment variable: `CYPRESS_CI_KEY` or you wrote:

```shell
cypress ci abc-key-123
```

You need to rewrite this as:

```shell
cypress run --record --key abc-key-123
```

If you were using the environment variable `CYPRESS_CI_KEY`, rename it to`CYPRESS_RECORD_KEY`.

You can now run and omit the `--key` flag:

```shell
cypress run --record
```

We will automatically apply the record key environment variable.

## {% fa fa-exclamation-triangle red %} A Cached Cypress Binary Could not be found

This error occurs in CI when using `cypress run` without a valid Cypress binary cache installed on the system (on linux that's `~/.cache/Cypress`).

To fix this error, follow instructions on {% url "caching the cypress binary in CI" continuous-integration#Caching %}, then bump the version of your CI cache to ensure a clean build.

## {% fa fa-exclamation-triangle red %} Incorrect usage of `--ci-build-id` flag

You passed the `--ci-build-id` flag but did not provide either a {% url "`--group`" command-line#cypress-run-group-lt-name-gt %} or {% url "`--parallel`" command-line#cypress-run-parallel %} flag.

The `--ci-build-id` flag is used to either group or parallelize multiple runs together.

Check out our {% url "guide on parallelizing runs" parallelization %} and when to use the {% url "`--ci-build-id`" command-line#cypress-run-ci-build-id-lt-id-gt %} option.

## {% fa fa-exclamation-triangle red %} The `--ci-build-id`, `--group`, or `--parallel` flags can only be used when recording

You passed the `--ci-build-id`, {% url "`--group`" command-line#cypress-run-group-lt-name-gt %}, or {% url "`--parallel`" command-line#cypress-run-parallel %} flag without also passing the `--record` flag.

These flags can only be used when recording to the {% url "Dashboard Service" dashboard-service %}.

Please review our {% url "parallelization" parallelization %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} We could not determine a unique CI build ID

You passed the {% url "`--group`" command-line#cypress-run-group-lt-name-gt %} or {% url "`--parallel`" command-line#cypress-run-parallel %} flag but we could not automatically determine or generate a `ciBuildId`.

In order to use either of these parameters a `ciBuildId` must be determined.

The `ciBuildId` is automatically detected if you are running Cypress in most {% url "CI providers" continuous-integration#Examples %}. Please review the {% url "natively recognized environment variables" parallelization#CI-Build-ID-environment-variables-by-provider %} for your CI provider.

You can avoid this check in the future by passing an ID to the {% url "`--ci-build-id`" command-line#cypress-run-ci-build-id-lt-id-gt %} flag manually.

Please review our {% url "parallelization" parallelization %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} Group name has already been used for this run

You passed the {% url "`--group`" command-line#cypress-run-group-lt-name-gt %} flag, but this group name has already been used for this run.

If you are trying to parallelize this run, then also pass the {% url "`--parallel`" command-line#cypress-run-parallel %} flag, else pass a different group name.

Please review {% url "grouping test runs" parallelization#Grouping-test-runs %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} Cannot parallelize tests across environments

You passed the {% url "`--parallel`" command-line#cypress-run-parallel %} flag, but we do not parallelize tests across different environments.

This machine is sending different environment parameters than the first machine that started this parallel run.

In order to run in parallel mode each machine must send identical environment parameters such as:

- Specs
- Operation system name
- Operating system version
- Browser name
- Major browser version

Please review our {% url "parallelization" parallelization %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} Cannot parallelize tests in this group

You passed the `--parallel` flag, but this run group was originally created without the `--parallel` flag.

You cannot use the {% url "`--parallel`" command-line#cypress-run-parallel %} flag with this group.

Please review our {% url "grouping test runs" parallelization#Grouping-test-runs %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} Run must pass `--parallel` flag

You did not pass the `--parallel` flag, but this run's group was originally created with the `--parallel` flag.

You must use the {% url "`--parallel`" command-line#cypress-run-parallel %} flag with this group.

Please review our {% url "parallelization" parallelization %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} Cannot parallelize tests on a stale run

You are attempting to pass the {% url "`--parallel`" command-line#cypress-run-parallel %} flag to a run that was completed over 24 hours ago.

You cannot run tests on a run that has been complete for that long.

Please review our {% url "parallelization" parallelization %} documentation to learn more.

## {% fa fa-exclamation-triangle red %} Run is not accepting any new groups

The run you are attempting access to is already complete and will not accept new groups.

When a run finishes all of its groups, it waits for a configurable set of time before finally completing. You must add more groups during that time period.

Please review our {% url "parallelization" parallelization %} documentation to learn more.

# Page Load Errors

## {% fa fa-exclamation-triangle red %} Cypress detected a cross-origin error happened on page load

{% note info %}
For a more thorough explanation of Cypress's Web Security model, {% url 'please read our dedicated guide to it' web-security %}.
{% endnote %}

This error means that your application navigated to a superdomain that Cypress was not bound to. Initially when you {% url `cy.visit()` visit %}, Cypress changes the browser's URL to match the `url` passed to {% url `cy.visit()` visit %}. This enables Cypress to communicate with your application to bypasses all same-origin security policies among other things.

When your application navigates to a superdomain outside of the current origin-policy, Cypress is unable to communicate with it, and thus fails.

### There are a few simple workarounds to these common situations:

1. Don't click `<a>` links in your tests that navigate outside of your application. Likely this isn't worth testing anyway. You should ask yourself: *What's the point of clicking and going to another app?* Likely all you care about is that the `href` attribute matches what you expect. So make an assertion about that. You can see more strategies on testing anchor links {% url 'in our "Tab Handling and Links" example recipe' recipes#Testing-the-DOM %}.

2. You are testing a page that uses Single sign-on (SSO). In this case your web server is likely redirecting you between superdomains, so you receive this error message. You can likely get around this redirect problem by using {% url `cy.request()` request %} to manually handle the session yourself.

If you find yourself stuck and can't work around these issues you can just set this in your `cypress.json` file. But before doing so you should really understand and {% url 'read about the reasoning here' web-security %}.

```javascript
// cypress.json

{
  "chromeWebSecurity": false
}
```

## {% fa fa-exclamation-triangle red %} Cypress detected that an uncaught error was thrown from a cross-origin script.

Check your Developer Tools Console for the actual error - it should be printed there.

It's possible to enable debugging these scripts by adding the `crossorigin` attribute and setting a `CORS` header.

# Browser Errors

## {% fa fa-exclamation-triangle red %} The Chromium Renderer process just crashed

Browsers are enormously complex pieces of software, and from time to time they will inconsistently crash *for no good reason*. Crashes are just a part of running automated tests.

{% imgTag /img/guides/chromium-renderer-crashed.png "Chromium Renderer process just crashed" %}

At the moment, we haven't implemented an automatic way to recover from them, but it is actually possible for us to do so. We have an {% issue 349 'open issue documenting the steps' %} we could take to restart the renderer process and continue the run. If you're seeing consistent crashes and would like this implemented, please leave a note in the issue.

If you are running `Docker` {% issue 350 'there is a simple one line fix for this problem documented here' %}.

# Test Runner errors

## {% fa fa-exclamation-triangle red %} Cannot connect to API server

Logging in, viewing runs, and setting up new projects to record requires connecting to an external API server. This error displays when we failed to connect to the API server.

This error likely appeared because:

1. You do not have internet. Please ensure you have connectivity then try again.
2. You are a developer that has forked our codebase and do not have access to run our API locally. Please read more about this in our {% url "contributing doc" https://on.cypress.io/contributing %}.

## {% fa fa-exclamation-triangle red %} Cypress detected policy settings on your computer that may cause issues

When Cypress launches Chrome, it attempts to launch it with a custom proxy server and browser extension. Certain group policies (GPOs) on Windows can prevent this from working as intended, which can cause tests to break.

If your administrator has set any of the following Chrome GPOs, it can prevent your tests from running in Chrome:

- Proxy policies: `ProxySettings, ProxyMode, ProxyServerMode, ProxyServer, ProxyPacUrl, ProxyBypassList`
- Extension policies: `ExtensionInstallBlacklist, ExtensionInstallWhitelist, ExtensionInstallForcelist, ExtensionInstallSources, ExtensionAllowedTypes, ExtensionAllowInsecureUpdates, ExtensionSettings, UninstallBlacklistedExtensions`

Here are some potential workarounds:

1. Ask your administrator to disable these policies so that you can use Cypress with Chrome.
2. Use the built-in Electron browser for tests, since it is not affected by these policies. {% url 'See the guide to launching browsers for more information.' launching-browsers#Electron-Browser %}
3. Try using Chromium instead of Google Chrome for your tests, since it may be unaffected by GPO. You can {% url "download the latest Chromium build here." https://download-chromium.appspot.com/ %}
4. If you have Local Administrator access to your computer, you may be able to delete the registry keys that are affecting Chrome. Here are some instructions:
    1. Open up Registry Editor by pressing WinKey+R and typing `regedit.exe`
    2. Look in the following locations for the policy settings listed above:
        - `HKEY_LOCAL_MACHINE\Software\Policies\Google\Chrome`
        - `HKEY_LOCAL_MACHINE\Software\Policies\Google\Chromium`
        - `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`
        - `HKEY_CURRENT_USER\Software\Policies\Google\Chromium`
    3. Delete or rename any policy keys found. *Make sure to back up your registry before making any changes.*

## {% fa fa-exclamation-triangle red %} Uncaught exceptions from your application

WIP. We'll be adding more here soon.

For now, please visit the {% url 'Catalog of Events' catalog-of-events#Uncaught-Exceptions %} page for examples how to turn off catching uncaught exceptions.

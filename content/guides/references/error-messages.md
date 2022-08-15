---
layout: toc-top
title: Error Messages
---

## Test File Errors

### <Icon name="exclamation-triangle" color="red"></Icon> No tests found

This message means that Cypress was unable to find tests in the specified file.
You'll likely get this message if you have an empty test file and have not yet
written any tests.

<DocsImage src="/img/guides/references/no-tests-found.png" alt="No tests found" ></DocsImage>

### <Icon name="exclamation-triangle" color="red"></Icon> We found an error preparing your test file

This message means that Cypress encountered an error when compiling and/or
bundling your test file. Cypress automatically compiles and bundles your test
code so you can use ES2015, CoffeeScript, modules, etc.

#### You’ll typically receive this message due to:

- The file not existing
- A syntax error in the file or one of its dependencies
- A missing dependency

When the error is fixed in your test file, your tests will automatically re-run.

## Support File Errors

### <Icon name="exclamation-triangle" color="red"></Icon> Support file missing or invalid

The `supportFolder` option was removed from Cypress in version
[`0.18.0`](/guides/references/changelog#0-18-0) and was replaced by module
support and the
[`supportFile`](/guides/references/configuration#Testing-Type-Specific-Options)
configuration option.

Cypress used to automatically include any scripts in the `supportFolder` before
your test files. However, automatically including all the files in a certain
directory is somewhat magical and unintuitive, and requires creating globals for
the purpose of utility functions.

### <Icon name="exclamation-triangle" color="red"></Icon> Error Loading Config

The `supportFile` configuration option was removed from the root configutation
object in Cypress version `10.0.0`. Instead, it must be added within each
testing type's configuration object as a separate property if you would like to
use a file other than the default
[supportFile](/guides/references/configuration#Folders-Files) configuration.

#### Use modules for utility functions

Cypress supports both ES2015 modules and CommonJS modules. You can
import/require npm modules as well as local modules:

```javascript
import _ from 'lodash'
import util from './util'

it('uses modules', () => {
  expect(_.kebabCase('FooBar')).to.equal('foo-bar')
  expect(util.secretCode()).to.equal('1-2-3-4')
})
```

#### Use supportFile to load scripts before your test code

It's still useful to load a setup file before your test code. If you are setting
Cypress defaults or utilizing custom Cypress commands, instead of needing to
import/require those defaults/commands in every test file, you can use the
[`supportFile`](/guides/references/configuration#Testing-Type-Specific-Options)
configuration option within each testing type's configuration object.

<Alert type="danger">

⚠️ For a given testing type, multiple matching `supportFile` files will result
in an error when Cypress loads.

</Alert>

Just like with your test files, the
[`supportFile`](/guides/references/configuration#Testing-Type-Specific-Options)
can use ES2015+, [TypeScript](/guides/tooling/typescript-support) or
CoffeeScript and modules, so you can import/require other files as needed.

## Command Errors

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress cannot execute commands outside a running test

<DocsImage src="/img/guides/references/cypress-cannot-execute.png" alt="Cannot execute commands" ></DocsImage>

This message means you tried to execute one or more Cypress commands outside of
a currently running test. Cypress has to be able to associate commands to a
specific test.

Typically this happens accidentally, like in the following situation.

```javascript
describe('Some Tests', () => {
  it('is true', () => {
    expect(true).to.be.true // yup, fine
  })

  it('is false', () => {
    expect(false).to.be.false // yup, also fine
  })

  context('some nested tests', () => {
    // oops you forgot to write an it(...) here!
    // these cypress commands below
    // are running outside of a test and cypress
    // throws an error
    cy.get('h1').should('contain', 'todos')
  })
})
```

Move those Cypress commands into an `it(...)` block and everything will work
correctly.

If you are purposefully writing commands outside of a test, there is probably a
better way to accomplish what you're trying to do. Read through the
[Examples](/examples/examples/recipes),
[chat with someone in Discord](https://discord.gg/ncdA3Jz63n), or
[open an issue](https://github.com/cypress-io/cypress/issues/new/choose).

### <Icon name="exclamation-triangle" color="red"></Icon> `cy...()` failed because the element you are chaining off of has become detached or removed from the dom

Getting this error means you've tried to interact with a "dead" DOM element -
meaning it's been detached or completely removed from the DOM.

<!--
To reproduce the following screenshot:
describe('detachment example', () => {
  beforeEach(() => {
    cy.get('body').then(($body) => {
      const $outer = Cypress.$('<div />').appendTo($body)
      Cypress.$('<button />').on('click', () => { $outer[0].remove() }).appendTo($outer)
    })
  })
  it('detaches from dom', () => {
    cy.get('button')
    .click()
    .parent()
    .should('have.text', 'Clicked')
  })
})
-->

<!--
To reproduce the following screenshot:
describe('detachment example', () => {
  beforeEach(() => {
    cy.get('body').then(($body) => {
      const $outer = Cypress.$('<div />').appendTo($body)
      Cypress.$('<button />').on('click', () => { $outer[0].remove() }).appendTo($outer)
    })
  })
  it('detaches from dom', () => {
    cy.get('button')
    .click()
    .parent()
    .should('have.text', 'Clicked')
  })
})
-->

<DocsImage src="/img/guides/references/cy-method-failed-element-is-detached.png" alt="cy.method() failed because element is detached" ></DocsImage>

Cypress errors because it can't interact with "dead" elements - much like a real
user could not do this either. Understanding how this happens is very
important - and it is often preventable.

Let's take a look at an example below.

#### Application HTML

```html
<body>
  <div data-testid="parent">
    <button>Delete</button>
  </div>
</body>
```

#### Application JavaScript

```javascript
$('button').click(function () {
  // when the <button> is clicked
  // we remove the button from the DOM
  $(this).remove()
})
```

#### Test Code causing error

```javascript
cy.get('button').click().parent()
```

We've programmed our application above so that as soon as the `click` event
happens, the button is removed from the DOM. When Cypress begins processing the
next command ([`.parent()`](/api/commands/parent)) in the test above, it detects
that the yielded subject (the button) is detached from the DOM and throws the
error.

We can prevent Cypress from throwing this error by rewriting our test code.

#### Fixed Test Code

```javascript
cy.get('button').click()
cy.get('[data-testid="parent"]')
```

The above example is an oversimplification. Let's look at a more complex
example.

In modern JavaScript frameworks, DOM elements are regularly re-rendered -
meaning that the old element is thrown away and a new one is put in its place.
Because this happens so fast, it may _appear_ as if nothing has visibly changed
to the user. But if you are in the middle of executing test commands, it's
possible the element you're interacting with has become "dead". To deal with
this situation you must:

- Understand when your application re-renders
- Re-query for newly added DOM elements
- _Guard_ Cypress from running commands until a specific condition is met

When we say _guard_, this usually means:

- Writing an assertion
- Waiting on an XHR

#### More info

<Alert type="info">

Read the blog post
[Do Not Get Too Detached](https://www.cypress.io/blog/2020/07/22/do-not-get-too-detached/)
for another example of this error, and how to solve it.

</Alert>

### <Icon name="exclamation-triangle" color="red"></Icon> `cy....()` failed because the element cannot be interacted with

You may see a variation of this message for 4 different reasons:

1. The element is not visible
2. The element is being covered by another element
3. The element's center is hidden from view
4. The element is disabled

Cypress runs several calculations to ensure an element can _actually_ be
interacted with like a real user would. If you're seeing this error, you may
need to _guard_ your commands (due to a timing or an animation issue).

There have been situations where Cypress does not correctly allow you to
interact with an element that should be interactable. If that's the case,
[open an issue](https://github.com/cypress-io/cypress/issues/new/choose).

If you'd like to override these built-in checks, provide the `{force: true}`
option to the action itself. Refer to each command for their available options,
additional use cases, and argument usage.

#### Ignore built-in error checking

```javascript
cy.get('[disabled]').click({force: true}).
```

_Be careful with this option. It's possible to force your tests to pass when the
element is actually not interactable in your application._

### <Icon name="exclamation-triangle" color="red"></Icon> `cy....()` failed because the element is currently animating

<!--
To reproduce the following screenshot:
describe('animating example', () => {
  beforeEach(() => {
    cy.get('body').then(($body) => {
      Cypress.$('<input style="position: absolute;" />').appendTo($body)
      .animate({ left: '+=1000000' }, 10)
    })
  })
  it('is animating', () => {
    cy.get('input')
    .type('some text', { timeout: 20 })
  })
})
-->

<DocsImage src="/img/guides/references/cy-method-failed-element-is-animating.png" alt="cy.method() failed because element is animating" ></DocsImage>

By default Cypress detects if an element you're trying to interact with is
animating. This check ensures that an element is not animating too quickly for a
real user to interact with the element. This also prevents some edge cases where
actions, such as [`.type()`](/api/commands/type) or
[`.click()`](/api/commands/click), happened too fast during a transition.

Cypress will continuously attempt to interact with the element until it
eventually times out. If you'd like to force Cypress to interact with the
element there are a few options:

- Pass `{force: true}`. This disables _all_ error checking
- Pass `{waitForAnimations: false}` to disable animation error checking
- Pass `{animationDistanceThreshold: 20}` to decrease the sensitivity of
  detecting if an element is animating. By increasing the threshold this enables
  your element to move farther on the page without causing Cypress to
  continuously retry.

```javascript
cy.get('[data-testid="modal-close"]').click({ waitForAnimations: false })
```

You can globally disable animation error checking, or increase the threshold by
modifying the [Cypress configuration](/guides/references/configuration).

#### Cypress configuration file

:::cypress-config-example

```js
{
  waitForAnimations: false,
  animationDistanceThreshold: 50
}
```

:::

### <Icon name="exclamation-triangle" color="red"></Icon> The test has finished but Cypress still has commands in its queue

Let's examine several different ways you may get this error message. In every
situation, you'll need to change something in your test code to prevent the
error.

<DocsImage src="/img/guides/references/the-test-has-finished.png" alt="The test has finished but Cypress still has commands" ></DocsImage>

<Alert type="warning">

<strong class="alert-header">Flaky tests below!</strong>

Several of these tests are dependent on race conditions. You may have to run
these tests multiple times before they will actually fail. You can also try
tweaking some of the delays.

</Alert>

#### Short Example

This first test below will pass and shows you that Cypress tries to prevent
leaving commands behind in the queue in every test.

Even though we return a string in our test, Cypress automatically figures out
that you've queued commands above and does not end the test until all cy
commands have finished.

```javascript
// This test passes!
it('Cypress is smart and this does not fail', () => {
  cy.get('body').children().should('not.contain', 'foo') // <- no return here

  return 'foobarbaz' // <- return here
})
```

The example below will fail because you've forcibly terminated the test early
with mocha's `done`.

```javascript
// This test errors!
it('but you can forcibly end the test early which does fail', (done) => {
  cy.get('body')
    .then(() => {
      done() // forcibly end test even though there are commands below
    })
    .children()
    .should('not.contain', 'foo')
})
```

#### Complex Async Example

What's happening in this example is that because we have _NOT_ told Mocha this
is an asynchronous test, this test will pass _immediately_ then move onto the
next test. Then, when the `setTimeout` callback function runs, new commands will
get queued on the wrong test. Cypress will detect this and fail the _next_ test.

```javascript
describe('a complex example with async code', function () {
  it('you can cause commands to bleed into the next test', function () {
    // This test passes...but...
    setTimeout(() => {
      cy.get('body').children().should('not.contain', 'foo')
    }, 10)
  })

  it('this test will fail due to the previous poorly written test', () => {
    // This test errors!
    cy.wait(10)
  })
})
```

The correct way to write the above test code is using Mocha's `done` to signify
it is asynchronous.

```javascript
it('does not cause commands to bleed into the next test', (done) => {
  setTimeout(() => {
    cy.get('body')
      .children()
      .should('not.contain', 'foo')
      .then(() => {
        done()
      })
  }, 10)
})
```

#### Complex Promise Example

In the example below, we forget to return the `Promise` in our test. This means
the test passes synchronously but our `Promise` resolves in the next test. This
also causes the commands to be queued on the wrong test. We will get the error
in the next test that Cypress detected it had commands in its command queue.

```javascript
describe('another complex example using a forgotten "return"', () => {
  it('forgets to return a promise', () => {
    // This test passes...but...
    Cypress.Promise.delay(10).then(() => {
      cy.get('body').children().should('not.contain', 'foo')
    })
  })

  it('this test will fail due to the previous poorly written test', () => {
    // This test errors!
    cy.wait(10)
  })
})
```

The correct way to write the above test code would be to return our `Promise`:

```javascript
it('does not forget to return a promise', () => {
  return Cypress.Promise.delay(10).then(() => {
    return cy.get('body').children().should('not.contain', 'foo')
  })
})
```

### <Icon name="exclamation-triangle" color="red"></Icon> `cy.visit()` failed because you are attempting to visit a second unique domain

::include{file=partials/single-domain-workaround.md}

See our [Web Security](/guides/guides/web-security#Limitations) documentation.

### <Icon name="exclamation-triangle" color="red"></Icon> `cy.visit()` failed because you are attempting to visit a different origin domain

::include{file=partials/single-domain-workaround.md}

Two URLs have the same origin if the `protocol`, `port` (if specified), and
`host` are the same for both. You can only visit domains that are of the
same-origin within a single test. You can read more about same-origin policy in
general
[here](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

You can visit urls that are of different origin across different tests, so you
may consider splitting your `cy.visit()` of different origin domains into
separate tests.

See our [Web Security](/guides/guides/web-security#Limitations) documentation
for more information and workarounds.

### <Icon name="exclamation-triangle" color="red"></Icon> `Cypress.addParentCommand()` / `Cypress.addDualCommand()` / `Cypress.addChildCommand()` has been removed and replaced by `Cypress.Commands.add()`

In version [0.20.0](/guides/references/changelog), we removed the commands for
adding custom commands and replaced them with, what we believe to be, a simpler
interface.

Now you can create parent, dual, and child commands using the same
[Cypress.Commands.add()](/api/cypress-api/custom-commands) command.

Please read our
[new documentation on writing custom commands](/api/cypress-api/custom-commands).

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected that you invoked one or more `cy` commands in a custom command but returned a different value.

Because `cy` commands are asynchronous and are queued to be run later, it
doesn't make sense to return anything else.

For convenience, you can also omit any return value or return `undefined` and
Cypress will not error.

In versions before [0.20.0](/guides/references/changelog) of Cypress we
automatically detected this and forced the `cy` commands to be returned. To make
things less magical and clearer, we are now throwing an error.

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected that you invoked one or more `cy` commands but returned a different value.

Because cy commands are asynchronous and are queued to be run later, it doesn't
make sense to return anything else.

For convenience, you can also omit any return value or return `undefined` and
Cypress will not error.

In versions before [0.20.0](/guides/references/changelog) of Cypress we
automatically detected this and forced the `cy` commands to be returned. To make
things less magical and clearer, we are now throwing an error.

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected that you returned a promise from a command while also invoking one or more cy commands in that promise.

Because Cypress commands are already promise-like, you don't need to wrap them
or return your own promise.

Cypress will resolve your command with whatever the final Cypress command
yields.

The reason this is an error instead of a warning is because Cypress internally
queues commands serially whereas Promises execute as soon as they are invoked.
Attempting to reconcile this would prevent Cypress from ever resolving.

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected that you returned a promise in a test, but also invoked one or more `cy` commands inside of that promise.

While this works in practice, it's often indicative of an anti-pattern. You
almost never need to return both a promise and also invoke `cy` commands.

`cy` commands themselves are already promise like, and you can likely avoid the
use of the separate Promise.

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected that you returned a promise in a test, but also invoked a done callback.

The version of Mocha was upgraded with Cypress 4.0. Mocha 3+ no longer allows
returning a promise and invoking a done callback. Read more about it in the
[4.0 migration guide](/guides/references/migration-guide#Mocha-upgrade).

### <Icon name="exclamation-triangle" color="red"></Icon> Passing `cy.route({stub: false})` or `cy.server({stub: false})` is now deprecated.

You can safely remove: `{stub: false}`.

### <Icon name="exclamation-triangle" color="red"></Icon> CypressError: Timed out retrying: Expected to find element: ‘…’, but never found it. Queried from element: <…>

If you get this error in a case where the element is definitely visible in the
DOM, your document might contain malformed HTML. In such cases,
`document.querySelector()` will not find any elements that appear after the
point where the HTML is malformed. Even if you feel certain your HTML is not
malformed anywhere, check it anyway (line by line in the dev tools). Especially
if you've exhausted all other possibilities.

## CLI Errors

### <Icon name="exclamation-triangle" color="red"></Icon> You passed the `--record` flag but did not provide us your Record Key.

You may receive this error when trying to run Cypress tests in
[Continuous Integration](/guides/continuous-integration/introduction). This
means that you did not pass a specific record key to:
[cypress run --record](/guides/guides/command-line#cypress-run).

Since no record key was passed, Cypress checks for any environment variable with
the name `CYPRESS_RECORD_KEY`. In this case, that was also not found.

You can get your project's record key by locating it in your settings tab in the
Cypress app or in the [Dashboard Service](https://on.cypress.io/dashboard).

You will want to then
[add the key to your config file or as an environment variable](/guides/continuous-integration/introduction#Record-tests).

### <Icon name="exclamation-triangle" color="red"></Icon> The `cypress ci` command has been deprecated

As of version [`0.19.0`](/guides/references/changelog#0-19-0) and CLI versions
`0.13.0`, the `cypress ci` command has been deprecated. We did this to make it
clearer what the difference was between a _regular test run_ and a _recorded
test run_.

Previously to record runs you had the environment variable: `CYPRESS_CI_KEY` or
you wrote:

```shell
cypress ci abc-key-123
```

You need to rewrite this as:

```shell
cypress run --record --key abc-key-123
```

If you were using the environment variable `CYPRESS_CI_KEY`, rename it
to`CYPRESS_RECORD_KEY`.

You can now run and omit the `--key` flag:

```shell
cypress run --record
```

We will automatically apply the record key environment variable.

### <Icon name="exclamation-triangle" color="red"></Icon> A Cached Cypress Binary Could not be found

This error occurs in CI when using `cypress run` without a valid Cypress binary
cache installed on the system (on linux that's `~/.cache/Cypress`).

To fix this error, follow instructions on
[caching the cypress binary in CI](/guides/continuous-integration/introduction#Caching),
then bump the version of your CI cache to ensure a clean build.

### <Icon name="exclamation-triangle" color="red"></Icon> Incorrect usage of `--ci-build-id` flag

You passed the `--ci-build-id` flag but did not provide either a
[--group](/guides/guides/command-line#cypress-run-group-lt-name-gt) or
[--parallel](/guides/guides/command-line#cypress-run-parallel) flag.

The `--ci-build-id` flag is used to either group or parallelize multiple runs
together.

Check out our [guide on parallelizing runs](/guides/guides/parallelization) and
when to use the
[--ci-build-id](/guides/guides/command-line#cypress-run-ci-build-id-lt-id-gt)
option.

### <Icon name="exclamation-triangle" color="red"></Icon> The `--ci-build-id`, `--group`, or `--parallel` flags can only be used when recording

You passed the `--ci-build-id`,
[--group](/guides/guides/command-line#cypress-run-group-lt-name-gt), or
[--parallel](/guides/guides/command-line#cypress-run-parallel) flag without also
passing the `--record` flag.

These flags can only be used when recording to the
[Dashboard Service](/guides/dashboard/introduction).

Please review our [parallelization](/guides/guides/parallelization)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> We could not determine a unique CI build ID

You passed the
[--group](/guides/guides/command-line#cypress-run-group-lt-name-gt) or
[--parallel](/guides/guides/command-line#cypress-run-parallel) flag but we could
not automatically determine or generate a `ciBuildId`.

In order to use either of these parameters a `ciBuildId` must be determined.

The `ciBuildId` is automatically detected if you are running Cypress in most
[CI providers](/guides/continuous-integration/introduction#Examples). Please
review the
[natively recognized environment variables](/guides/guides/parallelization#CI-Build-ID-environment-variables-by-provider)
for your CI provider.

You can avoid this check in the future by passing an ID to the
[--ci-build-id](/guides/guides/command-line#cypress-run-ci-build-id-lt-id-gt)
flag manually.

Please review our [parallelization](/guides/guides/parallelization)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> Group name has already been used for this run

You passed the
[--group](/guides/guides/command-line#cypress-run-group-lt-name-gt) flag, but
this group name has already been used for this run.

If you are trying to parallelize this run, then also pass the
[--parallel](/guides/guides/command-line#cypress-run-parallel) flag, else pass a
different group name.

Please review
[grouping test runs](/guides/guides/parallelization#Grouping-test-runs)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> Cannot parallelize tests across environments

You passed the [--parallel](/guides/guides/command-line#cypress-run-parallel)
flag, but we do not parallelize tests across different environments.

This machine is sending different environment parameters than the first machine
that started this parallel run.

In order to run in parallel mode each machine must send identical environment
parameters such as:

- Specs
- Operation system name
- Operating system version
- Browser name
- Major browser version

Please review our [parallelization](/guides/guides/parallelization)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> Cannot parallelize tests in this group

You passed the `--parallel` flag, but this run group was originally created
without the `--parallel` flag.

You cannot use the
[--parallel](/guides/guides/command-line#cypress-run-parallel) flag with this
group.

Please review our
[grouping test runs](/guides/guides/parallelization#Grouping-test-runs)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> Run must pass `--parallel` flag

You did not pass the `--parallel` flag, but this run's group was originally
created with the `--parallel` flag.

You must use the [--parallel](/guides/guides/command-line#cypress-run-parallel)
flag with this group.

Please review our [parallelization](/guides/guides/parallelization)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> Cannot parallelize tests on a stale run

This error is thrown when you are attempting to pass the
[--parallel](/guides/guides/command-line#cypress-run-parallel) flag to a run
that Cypress detected was completed over 24 hours ago.

In order to uniquely identify each run during `cypress run`, Cypress attempts to
read a unique identifier from your CI provider as described in our
[parallelization doc](/guides/guides/parallelization#CI-Build-ID-environment-variables-by-provider).

You may encounter this error if Cypress is detecting the exact same CI Build ID
matching a previous CI Build ID in a run that was completed over 24 hours ago.
You cannot run tests on a run that has been complete for that long. ​ ​You can
see the CI Build ID that is detected for each completed run by looking at the
details section at the top of your run in the
[Dashboard](https://on.cypress.io/dashboard). ​ ​You can generate and pass in
your own unique CI Build ID per run as described
[here](/guides/guides/command-line#cypress-run-ci-build-id-lt-id-gt).

Please also review our [parallelization](/guides/guides/parallelization)
documentation to learn more.

### <Icon name="exclamation-triangle" color="red"></Icon> Run is not accepting any new groups

The run you are attempting access to is already complete and will not accept new
groups.

When a run finishes all of its groups, it waits for a configurable set of time
before finally completing. You must add more groups during that time period.

Please review our [parallelization](/guides/guides/parallelization)
documentation to learn more.

<a name='win-max-path-length'></a>

### <Icon name="exclamation-triangle" color="red"></Icon> The Cypress App could not be unzipped. This is most likely because the maximum path length is being exceeded on your system.

When Cypress is installed, it unzips to the designated cache location on your
computer. This error means that Cypress detected that it has exceeded the
maximum path length while unzipping Cypress.

This is common on Windows, where the maximum path length used to be 260
characters.

To fix this error, enable "long paths" on your Windows system:

1. Go to the Start Menu, and right click on PowerShell. Select "Run as
   administrator."
2. Run this command:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

3. Restart your computer.

This should get rid of the error. If you are still receiving this error, please
[search for an open issue](https://github.com/cypress-io/cypress/issues) or
[open a new one](https://github.com/cypress-io/cypress/issues/new/choose).

If you do not have Powershell available, you can also make this change via
regedit or gpedit.
[See Microsoft's documentation for details.](https://docs.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation)

## Page Load Errors

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected a cross-origin error happened on page load

<Alert type="info">

For a more thorough explanation of Cypress's Web Security model,
[please read our dedicated guide to it](/guides/guides/web-security).

</Alert>

This error means that your application navigated to a superdomain that Cypress
was not bound to. Initially when you [`cy.visit()`](/api/commands/visit),
Cypress changes the browser's URL to match the `url` passed to
[`cy.visit()`](/api/commands/visit). This enables Cypress to communicate with
your application to bypass all same-origin security policies among other things.

When your application navigates to a superdomain outside of the current
origin-policy, Cypress is unable to communicate with it, and thus fails.

#### There are a few workarounds to these common situations:

1. Don't click `<a>` links in your tests that navigate outside of your
   application. Likely this isn't worth testing anyway. You should ask yourself:
   _What's the point of clicking and going to another app?_ Likely all you care
   about is that the `href` attribute matches what you expect. So make an
   assertion about that. You can see more strategies on testing anchor links
   [in our "Tab Handling and Links" example recipe](/examples/examples/recipes#Testing-the-DOM).

2. You are testing a page that uses Single sign-on (SSO). In this case your web
   server is likely redirecting you between superdomains, so you receive this
   error message. You can likely get around this redirect problem by using
   [`cy.request()`](/api/commands/request) to manually handle the session
   yourself.

If you find yourself stuck and can't work around these issues you can set
`chromeWebSecurity` to `false` in your
[Cypress configuration](/guides/references/configuration) when running in Chrome
family browsers (this setting will not work in other browsers). Before doing so
you should really understand and
[read about the reasoning here](/guides/guides/web-security).

:::cypress-config-example

```js
{
  chromeWebSecurity: false
}
```

:::

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected that an uncaught error was thrown from a cross-origin script.

Check your Developer Tools Console for the actual error - it should be printed
there.

It's possible to enable debugging these scripts by adding the `crossorigin`
attribute and setting a `CORS` header.

## Browser Errors

<!-- keep old hash -->

<a name='The-Chromium-Renderer-process-just-crashed'></a>

### <Icon name="exclamation-triangle" color="red"></Icon> The browser process running your tests just exited unexpectedly

This error can occur whenever Cypress detects that the launched browser has
exited or crashed before the tests could finish running.

This can happen for a number of reasons, including:

- The browser was exited manually, by clicking the "Quit" button or otherwise
- Your test suite or application under test is starving the browser of
  resources, such as running an infinite loop
- Cypress is running in a memory-starved environment
- The browser is testing a memory-heavy application
- Cypress is running within Docker (there is an easy fix for this: see
  [this thread](https://github.com/cypress-io/cypress/issues/350))
- There are problems with the GPU / GPU drivers
- There is a bug in the browser involving memory management
- There is a memory leak in Cypress

If the browser running Cypress tests crashes, currently, Cypress will abort any
remaining tests and print out this error.

There is an [open issue](https://github.com/cypress-io/cypress/issues/349) to
recover from browser crashes automatically, so tests can continue to run.

## Cypress App errors

### <Icon name="exclamation-triangle" color="red"></Icon> Whoops, we can't run your tests

This error happens when Cypress detects that the browser automation is not
connected, or that Cypress's internal proxy is being bypassed. This is caused by
one of the following:

**A policy setting blocks the Cypress proxy server or browser extension**

- See
  [Cypress detected policy settings on your computer that may cause issues](#Cypress-detected-policy-settings-on-your-computer-that-may-cause-issues).

**The `--proxy-server` or `--load-extension` arguments have been changed**

- When adding a plugin with the
  [Browser Launch API](/api/plugins/browser-launch-api), it's possible for a
  necessary command-line argument to be changed. If you're running into this
  error, you can troubleshoot by inspecting `args` before and after the plugin
  runs, either by using `console.log()` or by
  [printing DEBUG logs](/guides/references/troubleshooting#Print-DEBUG-logs)
  with `DEBUG=cypress:server:plugins,cypress:server:plugins:*`.

**You visit the Cypress proxy URL outside of a Cypress browser.**

- Don't copy the URL you see when launching a Cypress browser from the Cypress
  App and open it in a non-Cypress browser. If you want to run your tests in a
  different browser, follow the instructions in the
  [Cross Browser Testing](/guides/guides/cross-browser-testing) guide.

### <Icon name="exclamation-triangle" color="red"></Icon> Cannot connect to API server

Logging in, viewing runs, and setting up new projects to record requires
connecting to an external API server. This error displays when we failed to
connect to the API server.

This error likely appeared because:

1. You do not have internet. Please ensure you have connectivity then try again.
2. You are a developer that has forked our codebase and do not have access to
   run our API locally. Please read more about this in our
   [contributing doc](https://on.cypress.io/contributing).

### <Icon name="exclamation-triangle" color="red"></Icon> Cypress detected policy settings on your computer that may cause issues

When Cypress launches Chrome, it attempts to launch it with a custom proxy
server and browser extension. Certain group policies (GPOs) on Windows can
prevent this from working as intended, which can cause tests to break.

If your administrator has set any of the following Chrome GPOs, it can prevent
your tests from running in Chrome:

- Proxy policies:
  `ProxySettings, ProxyMode, ProxyServerMode, ProxyServer, ProxyPacUrl, ProxyBypassList`
- Extension policies:
  `ExtensionInstallBlacklist, ExtensionInstallWhitelist, ExtensionInstallForcelist, ExtensionInstallSources, ExtensionAllowedTypes, ExtensionAllowInsecureUpdates, ExtensionSettings, UninstallBlacklistedExtensions`

Here are some potential workarounds:

1. Ask your administrator to disable these policies so that you can use Cypress
   with Chrome.
2. Use the built-in Electron browser for tests, since it is not affected by
   these policies.
   [See the guide to launching browsers for more information.](/guides/guides/launching-browsers#Electron-Browser)
3. Try using Chromium instead of Google Chrome for your tests, since it may be
   unaffected by GPO. You can
   [download the latest Chromium build here.](https://download-chromium.appspot.com)
4. If you have Local Administrator access to your computer, you may be able to
   delete the registry keys that are affecting Chrome. Here are some
   instructions:
   1. Open up Registry Editor by pressing WinKey+R and typing `regedit.exe`
   2. Look in the following locations for the policy settings listed above:
      - `HKEY_LOCAL_MACHINE\Software\Policies\Google\Chrome`
      - `HKEY_LOCAL_MACHINE\Software\Policies\Google\Chromium`
      - `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`
      - `HKEY_CURRENT_USER\Software\Policies\Google\Chromium`
   3. Delete or rename any policy keys found. _Make sure to back up your
      registry before making any changes._

### <Icon name="exclamation-triangle" color="red"></Icon> Uncaught exceptions from your application

When Cypress detects an uncaught exception in your application, it will fail the
currently running test.

You can turn off this behavior globally or conditionally with the
`uncaught:exception` event. Please see the
[Catalog of Events](/api/events/catalog-of-events#Uncaught-Exceptions) for
examples.

On a technical note, Cypress considers uncaught exceptions to be any error that
is uncaught by your application, whether they are "standard" errors or unhandled
promise rejections. If the error triggers the window's global `error` handler or
its `unhandledrejection` handler, Cypress will detect it and fail the test.

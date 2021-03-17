---
title: Writing Your First Test
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to start testing a new project in Cypress.
- What passing and failing tests look like.
- Testing web navigation, DOM querying, and writing assertions.

</Alert>

<DocsVideo src="https://vimeo.com/237115455"></DocsVideo>

## Add a test file

Assuming you've successfully [installed the Test Runner](/guides/getting-started/installing-cypress#Installing) and [opened the Cypress app](/guides/getting-started/installing-cypress#Opening-Cypress), now it's time to write our first test. We're going to:

1. Create a `sample_spec.js` file.
2. Watch Cypress update our list of specs.
3. Launch the Cypress Test Runner.

Let's create a new file in the `cypress/integration` folder that was created for us:

```shell
touch {your_project}/cypress/integration/sample_spec.js
```

Once we've created that file, we should see the Cypress Test Runner immediately display it in the list of Integration Tests. Cypress monitors your spec files for any changes and automatically displays any changes.

Even though we haven't written any tests yet - that's okay - let's click on `sample_spec.js` and watch Cypress launch your browser.

<Alert type="info">

Cypress opens the test in a browser installed on your system. You can read more about how we do this in [Launching Browsers](/guides/guides/launching-browsers).

</Alert>

<DocsVideo src="/img/snippets/empty-file-30fps.mp4"></DocsVideo>

We are now officially in the [Cypress Test Runner](/guides/core-concepts/test-runner). This is where we will spend the majority of your time testing.

<Alert type="warning">

Notice Cypress displays the message that it couldn't find any tests. This is normal - we haven't written any tests! Sometimes you'll also see this message if there was an error parsing your test file. You can always open your **Dev Tools** to inspect the Console for any syntax or parsing errors that prevented Cypress from reading your tests.

</Alert>

## Write your first test

Now it's time to write our first test. We're going to:

1. Write our first passing test.
2. Write our first failing test.
3. Watch Cypress reload in real time.

As we continue to save our new test file we'll see the browser auto reloading in real time.

Open up your favorite IDE and add the code below to our `sample_spec.js` test file.

```js
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})
```

Once you save this file you should see the browser reload.

Although it doesn't do anything useful, this is our first passing test! ✅

Over in the [Command Log](/guides/core-concepts/test-runner#Command-Log) you'll see Cypress display the suite, the test and your first assertion (which should be passing in green).

<DocsImage src="/img/guides/first-test.png" alt="My first test shown passing in the Test Runner" ></DocsImage>

<Alert type="info">

Notice Cypress displays a message about this being the default page [on the righthand side](/guides/core-concepts/test-runner#Application-Under-Test). Cypress assumes you'll want to go out and [visit](/api/commands/visit) a URL on the internet - but it can also work just fine without that.

</Alert>

Now let's write our first failing test.

```js
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(false)
  })
})
```

Once you save again, you'll see Cypress display the failing test in red since `true` does not equal `false`.

Cypress also displays the stack trace and the code frame where the assertion failed (when available). You can click on the blue file link to open the file where the error occurred in [your preferred file opener](/guides/tooling/IDE-integration#File-Opener-Preference). To read more about the error's display, read about [Debugging Errors](/guides/guides/debugging#Errors).

<!--
To reproduce the following screenshot:
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.be.false
  })
})
-->

<DocsImage src="/img/guides/failing-test.png" alt="Failing test" ></DocsImage>

Cypress provides a nice [Test Runner](/guides/core-concepts/test-runner) that gives you a visual structure of suites, tests, and assertions. Soon you'll also see commands, page events, network requests, and more.

<DocsVideo src="/img/snippets/first-test-30fps.mp4"></DocsVideo>

<Alert type="info">

<strong class="alert-header">What are describe, it, and expect?</strong>

All of these functions come from [Bundled Tools](/guides/references/bundled-tools) that Cypress bakes in.

- `describe` and `it` come from [Mocha](https://mochajs.org)
- `expect` comes from [Chai](http://www.chaijs.com)

Cypress builds on these popular tools and frameworks that you _hopefully_ already have some familiarity and knowledge of. If not, that's okay too.

</Alert>

<Alert type="success">

<strong class="alert-header">Using ESlint?</strong>

Check out our [Cypress ESLint plugin](https://github.com/cypress-io/eslint-plugin-cypress).

</Alert>

## Write a _real_ test

**A solid test generally covers 3 phases:**

1. Set up the application state.
2. Take an action.
3. Make an assertion about the resulting application state.

You might also see this phrased as "Given, When, Then", or "Arrange, Act, Assert". But the idea is: First you put the application into a specific state, then you take some action in the application that causes it to change, and finally you check the resulting application state.

Today, we'll take a narrow view of these steps and map them cleanly to Cypress commands:

1. Visit a web page.
2. Query for an element.
3. Interact with that element.
4. Assert about the content on the page.

### <Icon name="globe"></Icon> Step 1: Visit a page

First, let's visit a web page. We will visit our [Kitchen Sink](/examples/examples/applications#Kitchen-Sink) application in this example so that you can try Cypress out without needing to worry about finding a page to test.

We can pass the URL we want to visit to [`cy.visit()`](/api/commands/visit). Let's replace our previous test with the one below that actually visits a page:

```js
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('https://example.cypress.io')
  })
})
```

Save the file and switch back over to the Cypress Test Runner. You might notice a few things:

1. The [Command Log](/guides/core-concepts/test-runner#Command-Log) now shows the new `VISIT` action.
2. The Kitchen Sink application has been loaded into the [App Preview](/guides/core-concepts/test-runner#Overview) pane.
3. The test is green, even though we made no assertions.
4. The `VISIT` displays a **blue pending state** until the page finishes loading.

Had this request come back with a non `2xx` status code such as `404` or `500`, or if there was a JavaScript error in the application's code, the test would have failed.

<DocsVideo src="/img/snippets/first-test-visit-30fps.mp4"></DocsVideo>

<Alert type="danger">

<strong class="alert-header">Only Test Apps You Control</strong>

Although in this guide we are testing our example application: [`https://example.cypress.io`](https://example.cypress.io) - you **shouldn't** test applications you **don't control**. Why?

- They are liable to change at any moment which will break tests.
- They may do A/B testing which makes it impossible to get consistent results.
- They may detect you are a script and block your access (Google does this).
- They may have security features enabled which prevent Cypress from working.

The point of Cypress is to be a tool you use every day to build and test **your own applications**.

Cypress is not a **general purpose** web automation tool. It is poorly suited for scripting live, production websites not under your control.

</Alert>

### <Icon name="search"></Icon> Step 2: Query for an element

Now that we've got a page loaded, we need to take some action on it. Why don't we click a link on the page? Sounds easy enough, let's go look for one we like... how about `type`?

To find this element by its contents, we'll use [cy.contains()](/api/commands/contains).

Let's add it to our test and see what happens:

```js
describe('My First Test', () => {
  it('finds the content "type"', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type')
  })
})
```

Our test should now display `CONTAINS` in the [Command Log](/guides/core-concepts/test-runner#Command-Log) and still be green.

Even without adding an assertion, we know that everything is okay! This is because many of Cypress' commands are built to fail if they don't find what they're expecting to find. This is known as a [Default Assertion](/guides/core-concepts/introduction-to-cypress#Default-Assertions).

To verify this, replace `type` with something not on the page, like `hype`. You'll notice the test goes red, but only after about 4 seconds!

Can you see what Cypress is doing under the hood? It's automatically waiting and retrying because it expects the content to **eventually** be found in the DOM. It doesn't immediately fail!

<!--
To reproduce the following screenshot:
describe('My First Test', () => {
  it('finds the content "type"', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('hype')
  })
})
-->

<DocsImage src="/img/guides/first-test-failing-contains.png" alt="Test failing to not find content 'hype'" ></DocsImage>

<Alert type="warning">

<strong class="alert-header">Error Messages</strong>

We've taken care at Cypress to write hundreds of custom error messages that attempt to clearly explain what went wrong. In this case, Cypress **timed out retrying** to find the content `hype` within the entire page. To read more about the error's display, read about [Debugging Errors](/guides/guides/debugging#Errors).

</Alert>

Before we add another command - let's get this test back to passing. Replace `hype` with `type`.

<DocsVideo src="/img/snippets/first-test-contains-30fps.mp4"></DocsVideo>

### <Icon name="mouse-pointer"></Icon> Step 3: Click an element

Ok, now we want to click on the link we found. How do we do that? Add a [.click()](/api/commands/click) command to the end of the previous command, like so:

```js
describe('My First Test', () => {
  it('clicks the link "type"', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()
  })
})
```

You can almost read it like a little story! Cypress calls this "chaining" and we chain together commands to build tests that really express what the app does in a declarative way.

Also note that the [App Preview](/guides/core-concepts/test-runner#Overview) pane has updated further after the click, following the link and showing the destination page:

Now we can assert something about this new page!

<DocsVideo src="/img/snippets/first-test-click-30fps.mp4"></DocsVideo>

<Alert type="info">

<Icon name="magic"></Icon> You can see IntelliSense in your spec files by adding a single special comment line. Read about [Intelligent Code Completion](/guides/tooling/IDE-integration#Triple-slash-directives).

</Alert>

### <Icon name="check-square"></Icon> Step 4: Make an assertion

Let's make an assertion about something on the new page we clicked into. Perhaps we'd like to make sure the new URL is the expected URL. We can do that by looking up the URL and chaining an assertion to it with [.should()](/api/commands/should).

Here's what that looks like:

```js
describe('My First Test', () => {
  it('clicking "type" navigates to a new url', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')
  })
})
```

#### Adding more commands and assertions

We are not limited to a single interaction and assertion in a given test. In fact, many interactions in an application may require multiple steps and are likely to change your application state in more than one way.

We can continue the interactions and assertions in this test by adding another chain to interact with and verify the behavior of elements on this new page.

We can use [cy.get()](/api/commands/get) to select an element based on a CSS class. Then we can use the [.type()](/api/commands/type) command to enter text into the selected input. Finally, we can verify that the value of the input reflects the text that was typed with another [.should()](/api/commands/should).

```js
describe('My First Test', () => {
  it('Gets, types and asserts', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

And there you have it: a short test in Cypress that visits a page, finds and clicks a link, verifies the URL and then verifies the behavior of an element on the new page. If we read it out loud, it might sound like:

> 1. Visit: `https://example.cypress.io`
> 2. Find the element with content: `type`
> 3. Click on it
> 4. Get the URL
> 5. Assert it includes: `/commands/actions`
> 6. Get the input with the `.action-email` class
> 7. Type `fake@email.com` into the input
> 8. Assert the input reflects the new value

Or in the Given, When, Then syntax:

> 1. Given a user visits `https://example.cypress.io`
> 2. When they click the link labeled `type`
> 3. And they type "fake@email.com" into the `.action-email` input
> 4. Then the URL should include `/commands/actions`
> 5. And the `.action-email` input has "fake@email.com" as its value

And hey, this is a very clean test! We didn't have to say anything about _how_ things work, just that we'd like to verify a particular series of events and outcomes.

<DocsVideo src="/img/snippets/first-test-assertions-30fps.mp4"></DocsVideo>

<Alert type="info">

<strong class="alert-header">Page Transitions</strong>

Worth noting is that this test transitioned across two different pages.

1. The initial [cy.visit()](/api/commands/visit)
2. The [.click()](/api/commands/click) to a new page

Cypress automatically detects things like a `page transition event` and will automatically **halt** running commands until the next page has **finished** loading.

Had the **next page** not finished its loading phase, Cypress would have ended the test and presented an error.

Under the hood - this means you don't have to worry about commands accidentally running against a stale page, nor do you have to worry about running commands against a partially loaded page.

We mentioned previously that Cypress waited **4 seconds** before timing out finding a DOM element - but in this case, when Cypress detects a `page transition event` it automatically increases the timeout to **60 seconds** for the single `PAGE LOAD` event.

In other words, based on the commands and the events happening, Cypress automatically alters its expected timeouts to match web application behavior.

These various timeouts are defined in the [Configuration](/guides/references/configuration#Timeouts) document.

</Alert>

## Debugging

Cypress comes with a host of debugging tools to help you understand a test.

**We give you the ability to:**

- Travel back in time to each command's snapshot.
- See special `page events` that happened.
- Receive additional output about each command.
- Step forward / backward between multiple command snapshots.
- Pause commands and step through them iteratively.
- Visualize when hidden or multiple elements are found.

Let's see some of this in action using our existing test code.

### Time travel

Take your mouse and **hover over** the `CONTAINS` command in the Command Log.

Do you see what happened?

<DocsImage src="/img/guides/first-test-hover-contains.png" alt="Hovering over the contains tab highlights the dom element in the App in the Test Runner" ></DocsImage>

Cypress automatically traveled back in time to a snapshot of when that command resolved. Additionally, since [`cy.contains()`](/api/commands/contains) finds DOM elements on the page, Cypress also highlights the element and scrolls it into view (to the top of the page).

Now if you remember at the end of the test we ended up on a different URL:

> https://example.cypress.io/commands/actions

But as we hover over the `CONTAINS`, Cypress reverts back to the URL that was present when our snapshot was taken.

<DocsImage src="/img/guides/first-test-url-revert.png" alt="The url address bar shows https://example.cypress.io/" ></DocsImage>

### Snapshots

Commands are also interactive. Go ahead and click on the `CLICK` command.

<DocsImage src="/img/guides/first-test-click-revert.png" alt="A click on the click command in the Command Log with Test Runner labeled as 1, 2, 3" ></DocsImage>

Notice it highlights in purple. This did three things worth noting...

#### 1. Pinned snapshots

We have now **pinned** this snapshot. Hovering over other commands will not revert to them. This gives us a chance to manually inspect the DOM of our application under test at the time the snapshot was taken.

#### 2. Event hitbox

Since [`.click()`](/api/commands/click) is an action command, that means we also see a red hitbox at the coordinates the event took place.

#### 3. Snapshot menu panel

There is also a new menu panel. Some commands (like action commands) will take multiple snapshots: **before** and **after**. We can now cycle through these.

The **before** snapshot is taken prior to the click event firing. The **after** snapshot is taken immediately after the click event. Although this click event caused our browser to load a new page, it's not an instantaneous transition. Depending on how fast your page loaded, you may still see the same page, or a blank screen as the page is unloading and in transition.

When a command causes an immediate visual change in our application, cycling between before and after will update our snapshot. We can see this in action by clicking the `TYPE` command in the Command Log. Now, clicking **before** will show us the input in a default state, showing the placeholder text. Click **after** will show us what the input looks like when the `TYPE` command has completed.

### Errors

Cypress prints several pieces of information when an error occurs during a Cypress test.

1. **Error name**: This is the type of the error (e.g. AssertionError, CypressError)
1. **Error message**: This generally tells you what went wrong. It can vary in length. Some are short like in the example, while some are long, and may tell you exactly how to fix the error. Some also contain a **Learn more** link that will take you to relevant Cypress documentation.
1. **Learn more:** Some error messages contain a Learn more link that will take you to relevant Cypress documentation.
1. **Code frame file**: This is usually the top line of the stack trace and it shows the file, line number, and column number that is highlighted in the code frame below. Clicking on this link will open the file in your [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference) and highlight the line and column in editors that support it.
1. **Code frame**: This shows a snippet of code where the failure occurred, with the relevant line and column highlighted.
1. **View stack trace**: Clicking this toggles the visibility of the stack trace. Stack traces vary in length. Clicking on a blue file path will open the file in your [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference).
1. **Print to console button**: Click this to print the full error to your DevTools console. This will usually allow you to click on lines in the stack trace and open files in your DevTools.

<DocsImage src="/img/guides/command-failure-error.png" alt="example command failure error" ></DocsImage>

### Page events

Notice there is also a funny looking Log called: `(PAGE LOAD)` followed by another entry for `(NEW URL)`. Neither of these was a command that we issued - rather Cypress itself will log out important events from your application when they occur. Notice these look different (they are gray and without a number).

<DocsImage src="/img/guides/first-test-page-load.png" alt="Command log shows 'Page load --page loaded--' and 'New url https://example.cypress.io/'" ></DocsImage>

**Cypress logs out page events for:**

- Network XHR Requests
- URL hash changes
- Page Loads
- Form Submissions

### Console output

Besides Commands being interactive, they also output additional debugging information to your console.

Open up your Dev Tools and click on the `GET` for the `.action-email` class selector.

<DocsImage src="/img/guides/first-test-console-output.png" alt="Test Runner with get command pinned and console log open showing the yielded element" ></DocsImage>

**We can see Cypress output additional information in the console:**

- Command (that was issued)
- Yielded (what was returned by this command)
- Elements (the number of elements found)
- Selector (the argument we used)

We can even expand what was returned and inspect each individual element or even right click and inspect them in the Elements panel!

### Special commands

In addition to having a helpful UI, there are also special commands dedicated to the task of debugging.

For instance there is:

- [cy.pause()](/api/commands/pause)
- [cy.debug()](/api/commands/debug)

Let's add a [cy.pause()](/api/commands/pause) to our test code and see what happens.

```js
describe('My First Test', () => {
  it('clicking "type" shows the right headings', () => {
    cy.visit('https://example.cypress.io')

    cy.pause()

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

Now Cypress provides us a UI (similar to debugger) to step forward through each command.

<DocsImage src="/img/guides/first-test-paused.png" alt="Test Runner shows label saying 'Paused' with Command Log showing 'Pause'" ></DocsImage>

#### In action

<DocsVideo src="/img/snippets/first-test-debugging-30fps.mp4"></DocsVideo>

## Next steps

- Start [testing your app](/guides/getting-started/testing-your-app).
- Set up [intelligent code completion](/guides/tooling/IDE-integration#Intelligent-Code-Completion) for Cypress commands and assertions.
- Check out the <Icon name="github"></Icon> [Cypress Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) for practical demonstrations of Cypress testing practices, configuration, and strategies in a real-world project.
- Search Cypress's documentation to quickly find what you need.

<DocsImage src="/img/guides/search-box.png" alt="Use the search box to find relevant documentation" ></DocsImage>

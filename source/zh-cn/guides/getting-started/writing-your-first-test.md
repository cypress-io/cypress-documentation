---
title: 编写第一个测试
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么

- 如何使用Cypress开始测试.
- 通过和失败的用例是怎样的.
- 测试web导航、DOM查询和编写断言.
{% endnote %}

{% video vimeo 237115455 %}

# 添加一个测试文件

假设您已经成功地安装了 {% url "installed the Test Runner" installing-cypress#Installing %} 和 {% url "opened the Cypress app" installing-cypress#Opening-Cypress %}, 现在是编写第一个测试的时候了。我们要:

1. 创建一个  `sample_spec.js` 文件.
2. 查看 Cypress 更新后的测试列表.
3. 以交互模式启动Cypress

让我们先在 `cypress/integration` 文件下创建一个文件:

```shell
touch {your_project}/cypress/integration/sample_spec.js
```

一旦我们创建好文件, 我们应该可以看到在Cypress Test Runner Integration Tests的列表中这份文件立即被呈现出来. 无论你的项目文件有任何改变Cypress都会自动检测且呈现出来.

虽然我们还没有写任何测试脚本- 让我们点击`sample_spec.js`  看看Cypress启动你的浏览器

{% note info %}
Cypress使用安装在系统上的浏览器打开测试。你可以阅读更多关于我们如何做到这一点{% url "Launching Browsers" launching-browsers %}.
{% endnote %}

{% video local /img/snippets/empty-file-30fps.mp4 %}

现让我们正式进入 {% url 'Cypress Test Runner' test-runner %}. 这是我们花费大部分时间测试的地方。

{% note warning %}
请注意Cypress显示无法找到任何测试的信息。 这很正常 - 我们还没有写过任何测试！ 如果解析测试文件时出错，有时您也会看到此消息。 您可以打开** Dev Tools **来检查控制台是否存在阻止Cypress读取测试的任何语法或解析错误。
{% endnote %}

# 写一个简单的例子

现在是开始第一个测试的时候了，我们将会：

1. 写一个通过的测试
2. 写一个失败的测试
3. 观察Cypress实时的重新加载

当我们继续保存我们的测试文件，我们会看到浏览器自动实时运行了我们的用例。

打开你常用的IDE添加如下的代码在之前创建的 `sample_spec.js` 文件

```js
describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true)
  })
})
```

当你保存文件以后，你会看到浏览器重新加载了

虽然我们并没有做任何有价值的事，但这是我们的第一个通过的测试 ✅

在{% url 'Command Log' test-runner#Command-Log %} 你会看到你的测试和断言展示在测试组件中 (通过的话步骤会显示绿色).

{% imgTag /img/guides/first-test.png "My first test shown passing in the Test Runner" %}

{% note info %}
请注意，Cypress会显示一条消息，指出这是右侧的默认页面{％url“”test-runner #Application-Under-Test％}。 Cypress假设你想去{％url'访问“访问％}一个互联网上的网址 - 但没有这个网址Cypress也可以正常工作。

{% endnote %}

现在让我们来写一个失败的测试用例。

```js
describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(false)
  })
})
```

当你再次保存，你会看到Cypress用红色显示测试失败，因为`true` 不等于`false`。

{% imgTag /img/guides/failing-test.png "Failing test" %}

Cypress提供了一个很好的{％url'Test Runner'test-runner％}，它为您提供了套件，测试和断言的可视化结构。 很快你也会看到命令，页面事件，网络请求等。
{% video local /img/snippets/first-test-30fps.mp4 %}

{% note info What are describe, it, and expect? %}
这些所有的功能都基于{% url 'Bundled Tools' bundled-tools %} 
- `describe` 和 `it` 来自于 {% url 'Mocha' https://mochajs.org %}
- `expect` 来自于 {% url 'Chai' http://www.chaijs.com %}

Cypress builds on these popular tools and frameworks that you *hopefully* already have some familiarity and knowledge of. If not, that's okay too.
{% endnote %}

{% note success Using ESlint? %}
Check out our {% url "Cypress ESLint plugin" https://github.com/cypress-io/eslint-plugin-cypress %}.
{% endnote %}

# Write a *real* test

**A solid test generally covers 3 phases:**

1. Set up the application state.
2. Take an action.
3. Make an assertion about the resulting application state.

You might also see this phrased as "Given, When, Then", or "Arrange, Act, Assert". The idea is simple: first you put the application into a specific state, then you take some action in the application that causes it to change, and finally you check the resulting application state.

Today, we'll take a narrow view of these steps and map them cleanly to Cypress commands:

1. Visit a web page.
2. Query for an element.
3. Interact with that element.
4. Assert about the content on the page.

## {% fa fa-globe %} Step 1: Visit a page

First, let's visit a web page. We will visit our {% url 'Kitchen Sink' applications#Kitchen-Sink %} application in this example so that you can try Cypress out without needing to worry about finding a page to test.

Using {% url `cy.visit()` visit %} is easy, we just pass it the URL we want to visit. Let's replace our previous test with the one below that actually visits a page:

```js
describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('https://example.cypress.io')
  })
})
```

Save the file and switch back over to the Cypress Test Runner. You might notice a few things:

1. The {% url 'Command Log' test-runner#Command-Log %} now shows the new `VISIT` action.
2. The Kitchen Sink application has been loaded into the {% url 'App Preview' test-runner#Overview %} pane.
3. The test is green, even though we made no assertions.
4. The `VISIT` displays a **blue pending state** until the page finishes loading.

Had this request come back with a non `2xx` status code such as `404` or `500`, or if there was a JavaScript error in the application's code, the test would have failed.

{% video local /img/snippets/first-test-visit-30fps.mp4 %}

{% note danger Only Test Apps You Control %}
Although in this guide we are testing our example application: {% url "`https://example.cypress.io`" https://example.cypress.io %} - you **shouldn't** test applications you **don't control**. Why?

- They are liable to change at any moment which will break tests.
- They may do A/B testing which makes it impossible to get consistent results.
- They may detect you are a script and block your access (Google does this).
- They may have security features enabled which prevent Cypress from working.

The point of Cypress is to be a tool you use every day to build and test **your own applications**.

Cypress is not a **general purpose** web automation tool. It is poorly suited for scripting live, production websites not under your control.
{% endnote %}

## {% fa fa-search %} Step 2: Query for an element

Now that we've got a page loaded, we need to take some action on it. Why don't we click a link on the page? Sounds easy enough, let's go look for one we like... how about `type`?

To find this element by its contents, we'll use {% url "`cy.contains()`" contains %}.

Let's add it to our test and see what happens:

```js
describe('My First Test', function() {
  it('finds the content "type"', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type')
  })
})
```

Our test should now display `CONTAINS` in the {% url 'Command Log' test-runner#Command-Log %} and still be green.

Even without adding an assertion, we know that everything is okay! This is because many of Cypress' commands are built to fail if they don't find what they're expecting to find. This is known as a {% url 'Default Assertion' introduction-to-cypress#Default-Assertions %}.

To verify this, replace `type` with something not on the page, like `hype`. You'll notice the test goes red, but only after about 4 seconds!

Can you see what Cypress is doing under the hood? It's automatically waiting and retrying because it expects the content to **eventually** be found in the DOM. It doesn't immediately fail!

{% imgTag /img/guides/first-test-failing-contains.png "Test failing to not find content 'hype'" %}

{% note warning 'Error Messages' %}
We've taken care at Cypress to write hundreds of custom error messages that attempt to explain in simple terms what went wrong. In this case Cypress **timed out retrying** to find the content: `hype` within the entire page.
{% endnote %}

Before we add another command - let's get this test back to passing. Replace `hype` with `type`.

{% video local /img/snippets/first-test-contains-30fps.mp4 %}

## {% fa fa-mouse-pointer %} Step 3: Click an element

Ok, now we want to click on the link we found. How do we do that? You could almost guess this one: just add a {% url "`.click()`" click %} command to the end of the previous command, like so:

```js
describe('My First Test', function() {
  it('clicks the link "type"', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()
  })
})
```

You can almost read it like a little story! Cypress calls this "chaining" and we chain together commands to build tests that really express what the app does in a declarative way.

Also note that the {% url 'App Preview' test-runner#Overview %} pane has updated further after the click, following the link and showing the destination page:

Now we can assert something about this new page!

{% video local /img/snippets/first-test-click-30fps.mp4 %}

{% note info %}
{% fa fa-magic %} Seeing IntelliSense in your spec files is as easy as adding a single special comment line. Read about {% url 'Intelligent Code Completion' intelligent-code-completion#Triple-slash-directives %}.
{% endnote %}

## {% fa fa-check-square-o %} Step 4: Make an assertion

Let's make an assertion about something on the new page we clicked into. Perhaps we'd like to make sure the new URL is the expected URL. We can do that by looking up the URL and chaining an assertion to it with {% url "`.should()`" should %}.

Here's what that looks like:

```js
describe('My First Test', function() {
  it('clicking "type" navigates to a new url', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')
  })
})
```

### Adding more commands and assertions

We are not limited to a single interaction and assertion in a given test. In fact, many interactions in an application may require multiple steps and are likely to change your application state in more than one way.

We can continue the interactions and assertions in this test by adding another chain to interact with and verify the behavior of elements on this new page.

We can use {% url "`cy.get()`" get %} to select an element based on a CSS class. Then we can use the {% url "`.type()`" type %} command to enter text into the selected input. Finally, we can verify that the value of the input reflects the text that was typed with another {% url "`.should()`" should %}.

```js
describe('My First Test', function() {
  it('Gets, types and asserts', function() {
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

And there you have it: a simple test in Cypress that visits a page, finds and clicks a link, verifies the URL and then verifies the behavior of an element on the new page. If we read it out loud, it might sound like:

> 1. Visit: `https://example.cypress.io`
> 2. Find the element with content: `type`
> 3. Click on it
> 4. Get the URL
> 5. Assert it includes: `/commands/actions`
> 6. Get the input with the `.actions-email` class
> 7. Type `fake@email.com` into the input
> 8. Assert the input reflects the new value

Or in the Given, When, Then syntax:

> 1. Given a user visits `https://example.cypress.io`
> 2. When they click the link labeled `type`
> 3. And they type "fake@email.com" into the `.actions-email` input
> 3. Then the URL should include `/commands/actions`
> 4. And the `.actions-email` input has "fake@email.com" as its value

Even your non-technical collaborators can appreciate the way this reads!

And hey, this is a very clean test! We didn't have to say anything about *how* things work, just that we'd like to verify a particular series of events and outcomes.

{% video local /img/snippets/first-test-assertions-30fps.mp4 %}

{% note info 'Page Transitions' %}
Worth noting is that this test transitioned across two different pages.

1. The initial {% url "`cy.visit()`" visit %}
2. The {% url "`.click()`" click %} to a new page

Cypress automatically detects things like a `page transition event` and will automatically **halt** running commands until the next page has **finished** loading.

Had the **next page** not finished its loading phase, Cypress would have ended the test and presented an error.

Under the hood - this means you don't have to worry about commands accidentally running against a stale page, nor do you have to worry about running commands against a partially loaded page.

We mentioned previously that Cypress waited **4 seconds** before timing out finding a DOM element - but in this case, when Cypress detects a `page transition event` it automatically increases the timeout to **60 seconds** for the single `PAGE LOAD` event.

In other words, based on the commands and the events happening, Cypress automatically alters its expected timeouts to match web application behavior.

These various timeouts are defined in the {% url 'Configuration' configuration#Timeouts %} document.
{% endnote %}

# Debugging

Cypress comes with a host of debugging tools to help you understand a test.

**We give you the ability to:**

- Travel back in time to each command's snapshot.
- See special `page events` that happened.
- Receive additional output about each command.
- Step forward / backward between multiple command snapshots.
- Pause commands and step through them iteratively.
- Visualize when hidden or multiple elements are found.

Let's see some of this in action using our existing test code.

## Time travel

Take your mouse and **hover over** the `CONTAINS` command in the Command Log.

Do you see what happened?

{% imgTag /img/guides/first-test-hover-contains.png "Hovering over the contains tab highlights the dom element in the App in the Test Runner" %}

Cypress automatically traveled back in time to a snapshot of when that command resolved. Additionally, since {% url `cy.contains()` contains %} finds DOM elements on the page, Cypress also highlights the element and scrolls it into view (to the top of the page).

Now if you remember at the end of the test we ended up on a different URL:

> https://example.cypress.io/commands/actions

But as we hover over the `CONTAINS`, Cypress reverts back to the URL that was present when our snapshot was taken.

{% imgTag /img/guides/first-test-url-revert.png "The url address bar shows https://example.cypress.io/" %}

## Snapshots

Commands are also interactive. Go ahead and click on the `CLICK` command.

{% imgTag /img/guides/first-test-click-revert.png "A click on the click command in the Command Log with Test Runner labeled as 1, 2, 3" %}

Notice it highlights in purple. This did three things worth noting...

### 1. Pinned snapshots
We have now **pinned** this snapshot. Hovering over other commands will not revert to them. This gives us a chance to manually inspect the DOM of our application under test at the time the snapshot was taken.

### 2. Event hitbox
Since {% url `.click()` click %} is an action command, that means we also see a red hitbox at the coordinates the event took place.

### 3. Snapshot menu panel
There is also a new menu panel. Some commands (like action commands) will take multiple snapshots: **before** and **after**. We can now cycle through these.

The **before** snapshot is taken prior to the click event firing. The **after** snapshot is taken immediately after the click event. Although this click event caused our browser to load a new page, it's not an instantaneous transition. Depending on how fast your page loaded, you may still see the same page, or a blank screen as the page is unloading and in transition.

When a command causes an immediate visual change in our application, cycling between before and after will update our snapshot. We can see this in action by clicking the `TYPE` command in the Command Log. Now, clicking **before** will show us the input in a default state, showing the placeholder text. Click **after** will show us what the input looks like when the `TYPE` command has completed.

## Page events

Notice there is also a funny looking Log called: `(PAGE LOAD)` followed by another entry for `(NEW URL)`. Neither of these was a command that we issued - rather Cypress itself will log out important events from your application when they occur. Notice these look different (they are gray and without a number).

{% imgTag /img/guides/first-test-page-load.png "Command log shows 'Page load --page loaded--' and 'New url https://example.cypress.io/'" %}

**Cypress logs out page events for:**

- Network XHR Requests
- URL hash changes
- Page Loads
- Form Submissions

## Console output

Besides Commands being interactive, they also output additional debugging information to your console.

Open up your Dev Tools and click on the `GET` for the `.action-email` class selector.

{% imgTag /img/guides/first-test-console-output.png "Test Runner with get command pinned and console log open showing the yielded element" %}

**We can see Cypress output additional information in the console:**

- Command (that was issued)
- Yielded (what was returned by this command)
- Elements (the number of elements found)
- Selector (the argument we used)

We can even expand what was returned and inspect each individual element or even right click and inspect them in the Elements panel!

## Special commands

In addition to having a helpful UI, there are also special commands dedicated to the task of debugging.

For instance there is:

- {% url "`cy.pause()`" pause %}
- {% url "`cy.debug()`" debug %}

Let's add a {% url "`cy.pause()`" pause %} to our test code and see what happens.

```js
describe('My First Test', function() {
  it('clicking "type" shows the right headings', function() {
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

{% imgTag /img/guides/first-test-paused.png "Test Runner shows label saying 'Paused' with Command Log showing 'Pause'" %}

## In action

{% video local /img/snippets/first-test-debugging-30fps.mp4 %}

<!-- ## Bonus Step: Refactor

Once we have a passing test that covers the system we're working on, we usually like to go one step further and make sure the test code itself is well-structured and maintainable. This is sometimes expressed in TDD circles as "Red, Green, Refactor", which means:

1. Write a failing test.
2. Write the code to make the test pass.
3. Clean up the code, keeping the test passing.

Regardless of how you feel about writing tests first, the refactor step is very important! We want all of our code to be maintainable and extensible so that it lives a long and productive life, *including our test code*.

To make this concrete, imagine we added a second, similar test to this suite:

```js
describe('My First Test', function() {
  it("clicking type shows the heading Actions", function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    cy.get("h1").should('have.value', "Actions")
  })

  it("clicking focus shows the heading Focus Command", function() {
    cy.visit('https://example.cypress.io')

    cy.contains("focus").click()

    cy.get("h1").should('have.value', "Focus Command")
  })
})
```

We've got some duplication here and could probably make a number of refactoring moves, but for this brief tutorial we'll do a simple and common one. Let's move that initial visit out into a `beforeEach()` block.

```js
describe('My First Test', function() {
  beforeEach(function() {
    cy.visit('https://example.cypress.io')
  })

  it("clicking type shows the heading Actions", function() {
    cy.contains('type').click()

    cy.get("h1").should('have.value', "Actions")
  })

  it("clicking focus shows the heading Focus Command", function() {
    cy.contains("focus").click()

    cy.get("h1").should('have.value', "Focus Command")
  })
})
```

`beforeEach()` runs before each and every test in the same `describe()` block, so both of our tests in this case. Both tests still pass, and both are a bit shorter and easier to read.

-->

# Next steps

- Start {% url 'testing your app' testing-your-app %}.
- Set up {% url 'intelligent code completion' intelligent-code-completion %} for Cypress commands and assertions.
- Search Cypress's documentation to quickly find what you need.

{% imgTag /img/guides/search-box.png "Use the search box to find relevant documentation" %}

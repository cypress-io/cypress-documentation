---
title: contains
---

Get the DOM element containing the text. DOM elements can contain _more_ than the desired text and still match. Additionally, Cypress [prefers some DOM elements](#Notes) over the deepest element found.

## Syntax

```javascript
.contains(content)
.contains(content, options)
.contains(selector, content)
.contains(selector, content, options)

// ---or---

cy.contains(content)
cy.contains(content, options)
cy.contains(selector, content)
cy.contains(selector, content, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.nav').contains('About') // Yield el in .nav containing 'About'
cy.contains('Hello') // Yield first el in document containing 'Hello'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.title().contains('My App') // Errors, 'title' does not yield DOM element
cy.getCookies().contains('_key') // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> content** **_(String, Number, RegExp)_**

Get the DOM element containing the content.

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

Specify a selector to filter DOM elements containing the text. Cypress will _ignore_ its [default preference order](#Notes) for the specified selector. Using a selector allows you to return more _shallow_ elements (higher in the tree) that contain the specific text.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.contains()`.

| Option             | Default                                                               | Description                                                                                                  |
| ------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `matchCase`        | `true`                                                                | Check case sensitivity                                                                                       |
| `log`              | `true`                                                                | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                     |
| `timeout`          | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)  | Time to wait for `.contains()` to resolve before [timing out](#Timeouts)                                     |
| `includeShadowDom` | [`includeShadowDom`<br](/> config option value' configuration#Global) | Whether to traverse shadow DOM boundaries and include elements within the shadow DOM in the yielded results. |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.contains()` yields the new DOM element it found.</li></List>

## Examples

### Content

#### Find the first element containing some text

```html
<ul>
  <li>apples</li>
  <li>oranges</li>
  <li>bananas</li>
</ul>
```

```javascript
// yields <li>apples</li>
cy.contains('apples')
```

#### Find the `input[type='submit']` by value

Get the form element and search in its descendants for the content "submit the form!"

```html
<div id="main">
  <form>
    <div>
      <label>name</label>
      <input name="name" />
    </div>
    <div>
      <label>age</label>
      <input name="age" />
    </div>
    <input type="submit" value="submit the form!" />
  </form>
</div>
```

```javascript
// yields input[type='submit'] element then clicks it
cy.get('form').contains('submit the form!').click()
```

### Number

#### Find the first element containing a number

Even though the `<span>` is the deepest element that contains a "4", Cypress automatically yields `<button>` elements over spans because of its [preferred element order](#Preferences).

```html
<button class="btn btn-primary" type="button">
  Messages <span class="badge">4</span>
</button>
```

```javascript
// yields <button>
cy.contains(4)
```

### Regular Expression

#### Find the first element with text matching the regular expression

```html
<ul>
  <li>apples</li>
  <li>oranges</li>
  <li>bananas</li>
</ul>
```

```javascript
// yields <li>bananas</li>
cy.contains(/^b\w+/)
```

### Selector

#### Specify a selector to return a specific element

Technically the `<html>`, `<body>`, `<ul>`, and first `<li>` in the example below all contain "apples".

Normally Cypress would return the first `<li>` since that is the _deepest_ element that contains "apples".

To override the element that is yielded we can pass 'ul' as the selector.

```html
<html>
  <body>
    <ul>
      <li>apples</li>
      <li>oranges</li>
      <li>bananas</li>
    </ul>
  </body>
</html>
```

```javascript
// yields <ul>...</ul>
cy.contains('ul', 'apples')
```

#### Keep the form as the subject

Here's an example that uses the selector to ensure that the `<form>` remains the [subject](/guides/core-concepts/introduction-to-cypress#Subject-Management) for future chaining.

```html
<form>
  <div>
    <label>name</label>
    <input name="name" />
  </div>
  <button type="submit">Proceed</button>
</form>
```

```javascript
cy.get('form') // yields <form>...</form>
  .contains('form', 'Proceed') // yields <form>...</form>
  .submit() // yields <form>...</form>
```

Without the explicit selector the subject would change to be the `<button>`. Using the explicit selector ensures that chained commands will have the `<form>` as the subject.

### Case Sensitivity

Here's an example using the `matchCase` option to ignore case sensitivity.

```html
<div>Capital Sentence</div>
```

```js
cy.get('div').contains('capital sentence') // fail
cy.get('div').contains('capital sentence', { matchCase: false }) // pass
```

## Notes

### Scopes

`.contains()` acts differently whether it's starting a series of commands or being chained off an existing series.

#### When starting a series of commands:

This queries the entire `document` for the content.

```javascript
cy.contains('Log In')
```

#### When chained to an existing series of commands

This will query inside of the `<#checkout-container>` element.

```javascript
cy.get('#checkout-container').contains('Buy Now')
```

#### Be wary of chaining multiple contains

Let's imagine a scenario where you click a button to delete a user and a dialog appears asking you to confirm this deletion.

```javascript
// This doesn't work as intended
cy.contains('Delete User').click().contains('Yes, Delete!').click()
```

Because the second `.contains()` is chained off of a command that yielded the `<button>`, Cypress will look inside of the `<button>` for the new content.

In other words, Cypress will look inside of the `<button>` containing "Delete User" for the content: "Yes, Delete!", which is not what we intended.

What you want to do is call `cy` again, which automatically creates a new chain scoped to the `document`.

```javascript
cy.contains('Delete User').click()
cy.contains('Yes, Delete!').click()
```

### Leading, trailing, duplicate whitespaces aren't ignored in `<pre>` tag

Unlike other tags, `<pre>` doesn't ignore leading, trailing, or duplicate whitespaces as shown below:

```html
<!--Code for test-->
<h2>Other tags</h2>
<p>Hello, World !</p>

<h2>Pre tag</h2>
<pre>                 Hello,           World      !</pre>
```

Rendered result:

<DocsImage src="/img/api/contains/contains-pre-exception.png" alt="The result of pre tag" ></DocsImage>

To reflect this behavior, Cypress also doesn't ignore them.

```js
// test result for above code

cy.get('p').contains('Hello, World !') // pass
cy.get('p').contains('           Hello,          World   !') // fail

cy.get('pre').contains('Hello, World !') // fail
cy.get('pre').contains('                 Hello,           World      !') // pass
```

### Non-breaking space

You can use a space character in `cy.contains()` to match text in the HTML that uses a non-breaking space entity `&nbsp;`.

```html
<span>Hello&nbsp;world</span>
```

```javascript
// finds the span element
cy.contains('Hello world')
```

### Single Element

#### Only the _first_ matched element will be returned

```html
<ul id="header">
  <li>Welcome, Jane Lane</li>
</ul>
<div id="main">
  <span>These users have 10 connections with Jane Lane</span>
  <ul>
    <li>Jamal</li>
    <li>Patricia</li>
  </ul>
</div>
```

The below example will return the `<li>` in the `#header` since that is the _first_ element that contains the text "Jane Lane".

```javascript
// yields #header li
cy.contains('Jane Lane')
```

If you wanted to select the `<span>` instead, you could narrow the elements yielded before the `.contains()`.

```javascript
// yields <span>
cy.get('#main').contains('Jane Lane')
```

### Preferences

#### Element preference order

`.contains()` defaults to preferring elements higher in the tree when they are:

- `input[type='submit']`
- `button`
- `a`
- `label`

Cypress will ignore this element preference order if you pass a selector argument to `.contains()`.

#### Favor of `<button>` over other deeper elements

Even though the `<span>` is the deepest element that contains "Search", Cypress yields `<button>` elements over spans.

```html
<form>
  <button>
    <i class="fa fa-search"></i>
    <span>Search</span>
  </button>
</form>
```

```javascript
// yields <button>
cy.contains('Search').children('i').should('have.class', 'fa-search')
```

#### Favor of `<a>` over other deeper elements

Even though the `<span>` is the deepest element that contains "Sign Out", Cypress yields anchor elements over spans.

```html
<nav>
  <a href="/users">
    <span>Users</span>
  </a>
  <a href="/signout">
    <span>Sign Out</span>
  </a>
</nav>
```

```javascript
// yields <a>
cy.get('nav').contains('Sign Out').should('have.attr', 'href', '/signout')
```

#### Favor of `<label>` over other deeper elements

Even though the `<span>` is the deepest element that contains "Age", Cypress yields `<label>` elements over `<span>`.

```html
<form>
  <label>
    <span>Name:</span>
    <input name="name" />
  </label>
  <label>
    <span>Age:</span>
    <input name="age" />
  </label>
</form>
```

```javascript
// yields label
cy.contains('Age').find('input').type('29')
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.contains()` can be chained off of `cy` or off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.contains()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.contains()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.contains()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.contains()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Element contains text "New User"_**

```javascript
cy.get('h1').contains('New User')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/contains/find-el-that-contains-text.png" alt="Command Log contains" ></DocsImage>

When clicking on the `contains` command within the command log, the console outputs the following:

<DocsImage src="/img/api/contains/see-elements-found-from-contains-in-console.png" alt="console.log contains" ></DocsImage>

## History

| Version                                     | Changes                               |
| ------------------------------------------- | ------------------------------------- |
| [5.2.0](/guides/references/changelog#5-2-0) | Added `includeShadowDom` option.      |
| [4.0.0](/guides/references/changelog#4-0-0) | Added support for option `matchCase`. |

## See also

- [`cy.get()`](/api/commands/get)
- [`.invoke()`](/api/commands/invoke)
- [`.within()`](/api/commands/within)
- [Retry-ability](/guides/core-concepts/retry-ability)

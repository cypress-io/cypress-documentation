---
title: should
---

Create an assertion. Assertions are automatically retried until they pass or time out.

{% note info %}
An alias of {% url `.and()` and %}
{% endnote %}

{% note info %}
**Note:** `.should()` assumes you are already familiar with core concepts such as {% url 'assertions' introduction-to-cypress#Assertions %}
{% endnote %}

# Syntax

```javascript
.should(chainers)
.should(chainers, value)
.should(chainers, method, value)
.should(callbackFn)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.error').should('be.empty')                    // Assert that '.error' is empty
cy.contains('Login').should('be.visible')              // Assert that el is visible
cy.wrap({ foo: 'bar' }).its('foo').should('eq', 'bar') // Assert the 'foo' property equals 'bar'

```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.should('eq', '42')   // Errors, cannot be chained off 'cy'
```

## Arguments

**{% fa fa-angle-right %} chainers** ***(String)***

Any valid chainer that comes from {% url 'Chai' assertions#Chai %} or {% url 'Chai-jQuery' assertions#Chai-jQuery %} or {% url 'Sinon-Chai' assertions#Sinon-Chai %}.

**{% fa fa-angle-right %} value** ***(String)***

Value to assert against chainer.

**{% fa fa-angle-right %} method** ***(String)***

A method to be called on the chainer.

**{% fa fa-angle-right %} callbackFn** ***(Function)***

Pass a function that can have any number of explicit assertions within it. Whatever was passed to the function is what is yielded.

## Yields {% helper_icon yields %}

{% yields assertion_indeterminate .should %}

```javascript
cy
  .get('nav')                       // yields <nav>
  .should('be.visible')             // yields <nav>
```

However, some chainers change the subject. In the example below, the second `.should()` yields the string `sans-serif` because the chainer `have.css, 'font-family'` changes the subject.

```javascript
cy
  .get('nav')                          // yields <nav>
  .should('be.visible')                // yields <nav>
  .should('have.css', 'font-family')   // yields 'sans-serif'
  .and('match', /serif/)               // yields 'sans-serif'
```

# Examples

## Chainers

### Assert the checkbox is disabled

```javascript
cy.get(':checkbox').should('be.disabled')
```

### The current DOM element is yielded

```javascript
cy.get('option:first').should('be.selected').then(($option) => {
  // $option is yielded
})
```

## Value

### Assert the class is 'form-horizontal'

```javascript
cy.get('form').should('have.class', 'form-horizontal')
```

### Assert the value is not 'Jane'

```javascript
cy.get('input').should('not.have.value', 'Jane')
```

### The current subject is yielded

```javascript
cy.get('button').should('have.id', 'new-user').then(($button) => {
  // $button is yielded
})
```

## Method and Value

### Assert the href is equal to '/users'

```javascript
// have.attr comes from chai-jquery
cy.get('#header a').should('have.attr', 'href', '/users')
```

## Focus

### Assert an input is focused after button click

```javascript
cy.get('#btn-focuses-input').click()
cy.get('#input-receives-focus').should('have.focus') // equivalent to should('be.focused')
```

## Function

Passing a function to `.should()` enables you to make multiple assertions on the yielded subject. This also gives you the opportunity to *massage* what you'd like to assert on.

Be sure *not* to include any code that has side effects in your callback function. The callback function will be retried over and over again until no assertions within it throw.

### Verify length, content, and classes from multiple `<p>`

```html
<div>
  <p class="text-primary">Hello World</p>
  <p class="text-danger">You have an error</p>
  <p class="text-default">Try again later</p>
</div>
```

```javascript
cy
  .get('p')
  .should(($p) => {
    // should have found 3 elements
    expect($p).to.have.length(3)

    // make sure the first contains some text content
    expect($p.first()).to.contain('Hello World')

    // use jquery's map to grab all of their classes
    // jquery's map returns a new jquery object
    const classes = $p.map((i, el) => {
      return Cypress.$(el).attr('class')
    })

    // call classes.get() to make this a plain array
    expect(classes.get()).to.deep.eq([
      'text-primary',
      'text-danger',
      'text-default'
    ])
  })
```

{% note warning %}
Any value returned from a `.should()` callback function will be ignored. The original subject will be yielded to the next command.

```
cy
  .get('p')
  .should(($p) => {
    expect($p).to.have.length(3)

    return 'foo'
  })
  .then(($p) => {
    // the argument $p will be the 3 elements, not "foo"
  })
```
{% endnote %}

### Assert class name contains `heading-`

```html
<div class="docs-header">
  <div class="main-abc123 heading-xyz987">Introduction</div>
</div>
```

```js
cy.get('.docs-header')
  .find('div')
  // .should(cb) callback function will be retried
  .should(($div) => {
    expect($div).to.have.length(1)

    const className = $div[0].className

    expect(className).to.match(/heading-/)
  })
  // .then(cb) callback is not retried,
  // it either passes or fails
  .then(($div) => {
    expect($div).to.have.text('Introduction')
  })
```

You can even throw your own errors from the callback function.

```js
cy.get('.docs-header')
  .find('div')
  .should(($div) => {
    if ($div.length !== 1) {
      // you can throw your own errors
      throw new Error('Did not find 1 element')
    }

    const className = $div[0].className

    if (!className.match(/heading-/)) {
      throw new Error(`No class "heading-" in ${className}`)
    }
  })
```

### Assert text contents of 3 elements

Example below first asserts that there are 3 elements, and then checks the text contents of each one.

```html
<ul class="connectors-list">
  <li>Walk the dog</li>
  <li>Feed the cat</li>
  <li>Write JavaScript</li>
</ul>
```

```javascript
cy.get('.connectors-list > li').should(($lis) => {
  expect($lis).to.have.length(3)
  expect($lis.eq(0)).to.contain('Walk the dog')
  expect($lis.eq(1)).to.contain('Feed the cat')
  expect($lis.eq(2)).to.contain('Write JavaScript')
})
```

{% note info %}
Read {% url 'Cypress should callback' https://glebbahmutov.com/blog/cypress-should-callback/ %} blog post to see more variations of the above example.
{% endnote %}

For clarity you can pass a string message as a second argument to any `expect` assertion, see {% url Chai#expect https://www.chaijs.com/guide/styles/#expect %}.

```javascript
cy.get('.connectors-list > li').should(($lis) => {
  expect($lis, '3 items').to.have.length(3)
  expect($lis.eq(0), 'first item').to.contain('Walk the dog')
  expect($lis.eq(1), 'second item').to.contain('Feed the cat')
  expect($lis.eq(2), 'third item').to.contain('Write JavaScript')
})
```

These string messages will be shown in the Command Log giving each assertion more context.

{% imgTag /img/api/should/expect-with-message.png "Expect assertions with messages" %}

### Compare text values of two elements

The example below gets the text contained within one element and saves it in a closure variable. Then the test gets the text in another element and asserts that the two text values are the same after normalizing.

```html
<div class="company-details">
  <div class="title">Acme Developers</div>
  <div class="identifier">ACMEDEVELOPERS</div>
</div>
```

```javascript
const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()

// will keep text from title element
let titleText

cy.get('.company-details')
  .find('.title')
  .then(($title) => {
    // save text from the first element
    titleText = normalizeText($title.text())
  })

cy.get('.company-details')
  .find('.identifier')
  .should(($identifier) => {
    // we can massage text before comparing
    const idText = normalizeText($identifier.text())

    // text from the title element should already be set
    expect(idText, 'ID').to.equal(titleText)
  })
```

## Multiple Assertions

### Chaining multiple assertions

Cypress makes it easier to chain assertions together.

In this example we use {% url `.and()` and %} which is identical to `.should()`.

```javascript
// our subject is not changed by our first assertion,
// so we can continue to use DOM based assertions
cy.get('option:first').should('be.selected').and('have.value', 'Metallica')
```

## Wait until the assertions pass

Cypress won't resolve your commands until all of its assertions pass.

```javascript
// Application Code
$('button').click(() => {
  $button = $(this)

  setTimeout(() => {
    $button.removeClass('inactive').addClass('active')
  }, 1000)
})
```

```javascript
cy.get('button').click()
  .should('have.class', 'active')
  .and('not.have.class', 'inactive')
```

# Notes

## Effect on default DOM assertions

When you chain `.should()` on a DOM-based command, the default `.should('exist')` assertion is skipped. This may result in an unexpected behavior such as negative assertions passing even when the element doesn't exist in the DOM. See {% url 'Default Assertions' introduction-to-cypress#Default-Assertions %} for more.

## Subjects

### How do I know which assertions change the subject and which keep it the same?

The chainers that come from {% url 'Chai' bundled-tools#Chai %} or {% url 'Chai-jQuery' bundled-tools#Chai-jQuery %} will always document what they return.

### Using a callback function will not change what is yielded

Whatever is returned in the function is ignored. Cypress always forces the command to yield the value from the previous cy command's yield (which in the example below is `<button>`)

```javascript
cy
  .get('button').should(($button) => {
    expect({ foo: 'bar' }).to.deep.eq({ foo: 'bar' })

    return { foo: 'bar' } // return is ignored, .should() yields <button>
  })
  .then(($button) => {
    // do anything we want with <button>
  })
```

## Differences

{% partial then_should_difference %}

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .should %}

## Timeouts {% helper_icon timeout %}

{% timeouts timeouts .should %}

```javascript
cy.get('input', { timeout: 10000 }).should('have.value', '10')
// timeout here will be passed down to the '.should()'
// and it will retry for up to 10 secs
```

```javascript
cy.get('input', { timeout: 10000 }).should(($input) => {
  // timeout here will be passed down to the '.should()'
  // unless an assertion throws earlier,
  // ALL of the assertions will retry for up to 10 secs
  expect($input).to.not.be('disabled')
  expect($input).to.not.have.class('error')
  expect($input).to.have.value('US')
})
```

# Command Log

***Assert that there should be 8 children in a nav***

```javascript
cy.get('.left-nav>.nav').children().should('have.length', 8)
```

The commands above will display in the Command Log as:

{% imgTag /img/api/should/should-command-shows-up-as-assert-for-each-assertion.png "Command Log should" %}

When clicking on `assert` within the command log, the console outputs the following:

{% imgTag /img/api/should/assertion-in-console-log-shows-actual-versus-expected-data.png "Console Log should" %}

{% history %}
{% url "0.11.4" changelog#0-11-4 %} | Allows callback function argument
{% url "< 0.3.3" changelog#0-3-3 %} | `.should()` command added
{% endhistory %}

# See also

- {% url `.and()` and %}
- {% url 'Guide: Introduction to Cypress' introduction-to-cypress#Assertions %}
- {% url 'Reference: List of Assertions' assertions %}
- {% url 'cypress-example-kitchensink Assertions' https://example.cypress.io/commands/assertions %}

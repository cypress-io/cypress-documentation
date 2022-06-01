---
title: and
---

Create an assertion. Assertions are automatically retried until they pass or
time out.

<Alert type="info">

An alias of [`.should()`](/api/commands/should)

</Alert>

<Alert type="info">

**Note:** `.and()` assumes you are already familiar with core concepts such as
[assertions](/guides/core-concepts/introduction-to-cypress#Assertions)

</Alert>

## Syntax

```javascript
.and(chainers)
.and(chainers, value)
.and(chainers, method, value)
.and(callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.err').should('be.empty').and('be.hidden') // Assert '.err' is empty & hidden
cy.contains('Login').and('be.visible') // Assert el is visible
cy.wrap({ foo: 'bar' })
  .should('have.property', 'foo') // Assert 'foo' property exists
  .and('eq', 'bar') // Assert 'foo' property is 'bar'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.and('eq', '42') // Should not be chained off 'cy'
```

### Arguments

**<Icon name="angle-right"></Icon> chainers** **_(String)_**

Any valid chainer that comes from [Chai](/guides/references/assertions#Chai) or
[Chai-jQuery](/guides/references/assertions#Chai-jQuery) or
[Sinon-Chai](/guides/references/assertions#Sinon-Chai).

**<Icon name="angle-right"></Icon> value** **_(String)_**

Value to assert against chainer.

**<Icon name="angle-right"></Icon> method** **_(String)_**

A method to be called on the chainer.

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

Pass a function that can have any number of explicit assertions within it.
Whatever was passed to the function is what is yielded.

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>In most cases, `.and()` yields the same subject it was given from the
previous command.</li></List>

```javascript
cy.get('nav') // yields <nav>
  .should('be.visible') // yields <nav>
  .and('have.class', 'open') // yields <nav>
```

However, some chainers change the subject. In the example below, `.and()` yields
the string `sans-serif` because the chainer `have.css, 'font-family'` changes
the subject.

```javascript
cy.get('nav') // yields <nav>
  .should('be.visible') // yields <nav>
  .and('have.css', 'font-family') // yields 'sans-serif'
  .and('match', /serif/) // yields 'sans-serif'
```

## Examples

### Chainers

#### Chain assertions on the same subject

```javascript
cy.get('button').should('have.class', 'active').and('not.be.disabled')
```

### Value

#### Chain assertions when yield changes

```html
<!-- App Code -->
<ul>
  <li>
    <a href="users/123/edit">Edit User</a>
  </li>
</ul>
```

```javascript
cy.get('a')
  .should('contain', 'Edit User') // yields <a>
  .and('have.attr', 'href') // yields string value of href
  .and('match', /users/) // yields string value of href
  .and('not.include', '#') // yields string value of href
```

### Method and Value

#### Assert the href is equal to '/users'

```javascript
cy.get('#header a')
  .should('have.class', 'active')
  .and('have.attr', 'href', '/users')
```

### Function

#### Verify length, content, and classes from multiple `<p>`

Passing a function to `.and()` enables you to assert on the yielded subject.
This gives you the opportunity to _massage_ what you'd like to assert.

Be sure _not_ to include any code that has side effects in your callback
function.

The callback function will be retried over and over again until no assertions
within it throw.

```html
<div>
  <p class="text-primary">Hello World</p>
  <p class="text-danger">You have an error</p>
  <p class="text-default">Try again later</p>
</div>
```

```javascript
cy.get('p')
  .should('not.be.empty')
  .and(($p) => {
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
      'text-default',
    ])
  })
```

<Alert type="info">

Using a callback function [will not change the subject](#Subjects)

</Alert>

## Notes

### Chai

#### Similarities to Chai

If you've worked in [Chai](http://chaijs.com/) before, you will recognize that
`.and()` matches the same fluent assertion syntax.

Take this _explicit_ assertion for example:

```javascript
expect({ foo: 'bar' }).to.have.property('foo').and.eq('bar')
```

`.and()` reproduces this same assertion behavior.

### Subjects

#### How do I know which assertions change the subject and which keep it the same?

The chainers that come from [Chai](/guides/references/bundled-libraries#Chai) or
[Chai-jQuery](/guides/references/bundled-libraries#Chai-jQuery) will always
document what they return.

#### Using a callback function will not change what is yielded

Whenever you use a callback function, its return value is always ignored.
Cypress always forces the command to yield the value from the previous cy
command's yield (which in the example below is `<button>`)

```javascript
cy.get('button')
  .should('be.active')
  .and(($button) => {
    expect({ foo: 'bar' }).to.deep.eq({ foo: 'bar' })

    return { foo: 'bar' } // return is ignored, .and() yields <button>
  })
  .then(($button) => {
    // do anything we want with <button>
  })
```

### Differences

::include{file=partials/then-should-and-difference.md}

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.and()` requires being chained off a previous command.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.and()` will continue to [retry](/guides/core-concepts/retry-ability)
its specified assertions until it times out.</li></List>

```javascript
cy.get('input', {timeout: 10000}).should('have.value', '10').and('have.class', 'error')
                         ↲
  // timeout here will be passed down to the '.and()'
  // and it will retry for up to 10 secs
```

```javascript
cy.get('input', {timeout: 10000}).should('have.value', 'US').and(($input) => {
                         ↲
  // timeout here will be passed down to the '.and()'
  // unless an assertion throws earlier,
  // ALL of the assertions will retry for up to 10 secs
  expect($input).to.not.be('disabled')
  expect($input).to.not.have.class('error')
})
```

## Command Log

**Chain assertions on the same subject**

```javascript
cy.get('.list')
  .find('input[type="checkbox"]')
  .should('be.checked')
  .and('not.be.disabled')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/and/cypress-and-command-log.png" alt="Command log for assertions" ></DocsImage>

When clicking on `assert` within the command log, the console outputs the
following:

<DocsImage src="/img/api/and/cypress-assertions-console-log.png" alt="console.log for assertions" ></DocsImage>

## See also

- [`.should()`](/api/commands/should)
- [Guide: Introduction to Cypress](/guides/core-concepts/introduction-to-cypress#Assertions)
- [Reference: List of Assertions](/guides/references/assertions)

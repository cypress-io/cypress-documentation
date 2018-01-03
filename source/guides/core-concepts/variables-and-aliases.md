---
title: Variables and Aliases
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- How to deal with async commands
- What Aliases are, how they simplify your code
- Why you rarely need to use variables with Cypress
- How to use Aliases for objects, elements and routes
{% endnote %}

# Return Values

New users to Cypress may initially find it challenging to work with the asynchronous nature of our API's.

{% note success 'Do not worry!' %}
There are many simple and easy ways to reference, compare and utilize the objects that Cypress commands yield you.

Once you get the hang of async code - you'll realize you can do everything you could do synchronously, without your code doing any backflips.

This guide explores many common patterns for writing good Cypress code that can handle even the most complex situations.
{% endnote %}

Asynchronous API's are here to stay in JavaScript. They are found everywhere in modern code. In fact, most new browser API's are asynchronous and many core `Node.js` are asynchronous as well.

The patterns we'll explore below are useful in and outside of Cypress.

The first and most important concept you should recognize is...

{% note danger 'Return Values' %}
**You cannot assign or work with the return values** of any Cypress command. Commands are are enqueued and run asynchronously.
{% endnote %}

```js
// ...this won't work...

// nope
const button = cy.get('button')

// nope
const form = cy.get('form')

// nope
button.click()
```

## Closures

To access what each Cypress command yields you - you simply use {% url `.then()` then %}.

```js
cy.get('button').then(($btn) => {
  // $btn is the object that the previous
  // command yielded us  
})
```

If you're familiar with native Promises - the Cypress `.then()` works the same way. You can continue to nest more Cypress commands inside of the `.then()`.

Each nested command has access to the work done in previous commands. This ends up reading very nicely.

```js
cy.get('button').then(($btn) => {

  // store the button's text
  const txt = $btn.text()

  // submit a form
  cy.get('form').submit()

  // compare the two buttons' text
  // and make sure they are different
  cy.get('button').should(($btn2) => {
    expect($btn2.text()).not.to.eq(txt)
  })
})

// these commands run after all of the
// other previous commands have finished
cy.get(...).find(...).should(...)
```

The commands outside of the `.then()` will not run until all of the nested commands finish.

{% note info %}
By using callback functions, we've created a closure. Closures enable us to keep references around to refer to work done in previous commands.
{% endnote %}

## Debugging

Using `.then()` functions is an excellent opportunity to use `debugger`. This can help you understand the order in which commands are run. This also enables you to inspect the objects that Cypress yields you in each command.

```js
cy.get('button').then(($btn) => {
  // inspect $btn <object>
  debugger

  cy.get('#countries').select('USA').then(($select) => {
    // inspect $select <object>
    debugger

    cy.url().should((url) => {
      // inspect the url <string>
      debugger

      $btn    // is still available
      $select // is still available too

    })
  })
})

```

## Variables

Typically in Cypress - you hardly need to ever use `const`, `let`, or `var`. When using closures - you'll always have access to the objects that were yielded to you without assigning them.

The one exception to this rule is when you are dealing with mutable objects (that change state). When things change state, you often want to compare an object's previous value to the next value.

Here's a great use case for a `const`.

```html
<button>increment</button>

you clicked button <span id='num'>0</span> times
```

```js
// app code
let count = 0

$('button').on('click', function () {
  $('#num').text(count += 1)
})
```

```js
// cypress test code
cy.get('#num').then(($span) => {
  // capture what num is right now
  const num1 = parseFloat($span.text())

  cy.get('button').click().then(() => {
    // now capture it again
    const num2 = parseFloat($span.text())

    // make sure its what we expected
    expect(num2).to.eq(num1 + 1)
  })
})
```

The reason for using `const` is because the `$span` object is mutable. Whenever you have mutable objects and you're trying to compare them, you'll need to store their values. Using `const` is a perfect way to do that.

# Aliases

Using `.then()` callback functions to access the previous command values is great - but what happens when you're running code in hooks like `before` or `beforeEach`?

```js
beforeEach(function () {
  cy.button().then(($btn) => {
    const text = $btn.text()
  })
})

it('does not have access to text', function () {
  // how do we get access to text ?!?!
})
```

How will we get access to `text`?

We could make our code do some ugly backflips using `let` to get access to it.

{% note warning 'Do not do this' %}
This code below is just for demonstration.
{% endnote %}

```js
describe('a suite', function () {
  // this creates a closure around
  // 'text' so we can access it
  let text

  beforeEach(function () {
    cy.button().then(($btn) => {
      // redefine text reference
      text = $btn.text()
    })
  })

  it('does have access to text', function () {
    text // now this is available to us
  })
})
```

Fortunately, you don't have to make your code do backflips. Cypress makes it easy to handle these situations.

{% note success 'Introducing Aliases' %}
Aliases are a powerful construct in Cypress that have many uses. We'll explore each of their capabilities below.

At first, we'll use them to make it easy to share objects between your hooks and your tests.
{% endnote %}

## Sharing Context

Sharing context is simplest way to use aliases.

To alias something you'd like to share - you use the command called: {% url `.as()` as %}.

Let's look at our previous example with aliases.

```js
beforeEach(function () {
  // alias the $btn.text() as 'text'
  cy.get('button').invoke('text').as('text')
})

it('has access to text', function () {
  this.text // is now available
})
```

Under the hood, aliasing basic objects and primitives utilizes mocha's shared `context` object. That is - aliases are available as `this.*`.

Mocha automatically shares contexts for us across all applicable hooks for each test. Additionally these aliases and properties are automatically cleaned up after each test.

```js
describe('parent', function () {
  beforeEach(function () {
    cy.wrap('one').as('a')
  })

  context('child', function () {
    beforeEach(function () {
      cy.wrap('two').as('b')
    })

    describe('grandchild', function () {
      beforeEach(function () {
        cy.wrap('three').as('c')
      })

      it('can access all aliases as properties', function () {
        expect(this.a).to.eq('one') // true
        expect(this.b).to.eq('two') // true
        expect(this.c).to.eq('three') // true
      })
    })
  })
})
```

***Accessing Fixtures:***

The most common use case for sharing context is when dealing with {% url `cy.fixture()` fixture %}.

Often times you may load in a fixture in a `beforeEach` hook but want to utilize the values in your tests.

```js
beforeEach(function () {
  // alias the users fixtures
  cy.fixture('users.json').as('users')
})

it('utilize users in some way', function () {
  // access the users property
  const user = this.users[0]

  // make sure the header contains the first
  // users name
  cy.get('header').should('contain', user.name)
})
```

{% note danger 'Watch out for async commands' %}
Do not forget that **Cypress commands are async**!

You cannot use a `this.*` reference until the `.as()` command runs.
{% endnote %}

```js
it('is not using aliases correctly', function () {
  cy.fixture('users.json').as('users')

  // nope this won't work
  //
  // this.users is not defined
  // because the 'as' command has only
  // been enqueued - it has not run yet
  const user = this.users[0]
})
```

The same principles we introduced many times before apply to this situation. If you want to access what a command yields, you'll have to do it in a closure using a {% url `.then()` then %}.

```js
// yup all good
cy.fixture('users.json').then((users) => {
  // now we can avoid the alias altogether
  // and just use a callback function
  const user = users[0]

  // passes
  cy.get('header').should('contain', user.name)
})
```

***Avoiding the use of `this`***

{% note warning 'Arrow Functions' %}
Accessing aliases as properties with `this.*` will not work if you use "arrow functions" for your tests or hooks.

This is why you'll notice all of our examples use the regular `function () {}` syntax as opposed to the lambda fat arrow syntax `() => {}`.
{% endnote %}

Instead of using the `this.*` syntax, there is another way to access aliases.

The {% url `cy.get()` get %} command is capable of accessing aliases with a special syntax using the '@' character:

```js
beforeEach(function () {
  // alias the users fixtures
  cy.fixture('users.json').as('users')
})

it('utilize users in some way', function () {
  // use the special '@' syntax to access aliases
  // which avoids the use of 'this'
  cy.get('@users').then((users) => {
    // access the users argument
    const user = users[0]

    // make sure the header contains the first
    // users name
    cy.get('header').should('contain', user.name)
  })
})
```

By using `cy.get()` we avoid the use of `this`.

But just keep in mind - there are use cases for both approaches because they have different ergonomics.

When using `this.users` we have access to it synchronously, whereas when using `cy.get('@users')` it becomes an asynchronous command.

You can think of the `cy.get('@users')` as doing the same thing as `cy.wrap(this.users)`.

## Elements

Aliases have other special characteristics when being used with DOM elements.

After you alias DOM elements, you can then later access them for reuse.

```javascript
// alias all of the tr's found in the table as 'rows'
cy.get('table').find('tr').as('rows')
```

Internally, Cypress has made a reference to the `<tr>` collection returned as the alias "rows". To reference these same "rows" later, you can use the {% url `cy.get()` get %} command.

```javascript
// Cypress returns the reference to the <tr>'s
// which allows us to continue to chain commands
// finding the 1st row.
cy.get('@rows').first().click()
```

Because we've used the `@` character in {% url `cy.get()` get %}, instead of querying the DOM for elements, {% url `cy.get()` get %} looks for an existing alias called `rows` and returns the reference (if it finds it).

***Stale Elements:***

In many single-page JavaScript applications, the DOM re-renders parts of the application constantly. If you alias DOM elements that have been removed from the DOM by the time you call {% url `cy.get()` get %} with the alias, Cypress automatically re-queries the DOM to find these elements again.

```html
<ul id="todos">
  <li>
    Walk the dog
    <button class="edit">edit</button>
  </li>
  <li>
    Feed the cat
    <button class="edit">edit</button>
  </li>
</ul>
```

Let's imagine when we click the `.edit` button that our `<li>` is re-rendered in the DOM. Instead of displaying the edit button, it instead displays an `<input />` text field allowing you to edit the todo. The previous `<li>` has been *completely* removed from the DOM, and a new `<li>` is rendered in its place.

```javascript
cy.get('#todos li').first().as('firstTodo')
cy.get('@firstTodo').find('.edit').click()
cy.get('@firstTodo').should('have.class', 'editing')
  .find('input').type('Clean the kitchen')
```

When we reference `@firstTodo`, Cypress checks to see if all of the elements it is referencing are still in the DOM. If they are, it returns those existing elements. If they aren't, Cypress replays the commands leading up to the alias definition.

In our case it would re-issue the commands: `cy.get('#todos li').first()`. Everything just works because the new `<li>` is found.

{% note warning  %}
*Usually*, replaying previous commands will return what you expect, but not always. It is recommended that you **alias elements as soon as possible** instead of further down a chain of commands.

- `cy.get('#nav header .user').as('user')` {% fa fa-check-circle green %} (good)
- `cy.get('#nav').find('header').find('.user').as('user')` {% fa fa-warning red %} (bad)

When in doubt, you can *always* issue a regular {% url `cy.get()` get %} to query for the elements again.
{% endnote %}

## Routes

Aliases can also be used with routes. Aliasing your routes enables you to:

- ensure your application makes the intended requests
- wait for your server to send the response
- access the actual XHR object for assertions

![alias-commands](/img/guides/aliasing-routes.jpg)

Here's an example of aliasing a route and waiting on it to complete.

```js
cy.server()
cy.route("POST", /users/, { id: 123 }).as("postUser")

cy.get('form').submit()

cy.wait('@postUser').its('requestBody').should('have.property', 'name', 'Brian')

cy.contains('Successfully created user: Brian')
```

{% note info 'New to Cypress?' %}
{% url 'We have a much more detailed and comprehensive guide on routing Network Requests.' network-requests %}
{% endnote %}

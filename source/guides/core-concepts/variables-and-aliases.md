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

{% note danger 'Not Useful' %}
**You cannot assign or work with the return values** of any Cypress command because they are enqueued and run asynchronously.
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

{% note success 'Do not worry!' %}
There are many simple and easy ways to reference, compare and utilize the objects that Cypress commands yield you.

Once you get the hang of async code - you'll realize you can do everything you could do synchronously, without your code doing any backflips.

This guide explores many common patterns for writing good Cypress code that can handle even the most complex situations.
{% endnote %}

## Closures

Whenever you want access to what a Cypress command yields you - you simply use {% url `.then()` then %}.

```js
cy.get('button').then(($btn) => {
  // $btn is the object that the previously
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

$('button').on('click', function(){
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

The reason for using `const` is because the the `$span` object is mutable. Whenever you have mutable objects and you're trying to compare them, you'll need to store their values. Using `const` is a perfect way to do that.

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

Under the hood, aliasing basic objects and primitives like this utilizes mocha's shared `context` here.

Contexts are shared across all applicable hooks for each test and are automatically cleaned up after each test.

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
  // been enqueued - it has not ran yet
  const user = this.users[0]
})
```

The same principles we introduced many times before apply to this situation. If you want to what a command yields, you'll have to do it in a closure using a {% url `.then()` then %}.

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

## Elements

## Routes

TODO
- WHY DO WE USE 'FUNCTION' IN ALL OF OUR EXAMPLES?
- WHAT DO WE SAY IN THE 'GET' DOCS ABOUT USING IT FOR PRIMITIVES?




<!-- ...OLD CRAPPY CONTENT BELOW...

In Cypress - you rarely have to **ever** use `const`, `let`, or `var`. If you are finding yourself reaching for these common idioms - there is likely a better and easier way.



Because all commands in Cypress are asynchronous, it can be difficult to refer back to work done in previous commands. Cypress provides a special DSL for doing just that, and it's called Aliasing. Let's look at some examples to illustrate what we mean.

***Imagine the following synchronous example in jQuery:***

```javascript
var body = $('body')

// do more work here

// later use this body reference
body.find('button')
```

> In Cypress, every command is asynchronous.

In jQuery, we can assign regular values because work is performed synchronously. But in Cypress, every command is asynchronous, so there is no immediate return value. You'd have to do something like this to get access to previously resolved values:

```javascript
// An example of referencing in Cypress, the long way

var _this = this

cy.get('body').then(function($body){
  _this.body = $body
})

// more work here

cy.then(function(){
  cy.wrap(_this.body).find('button')
})
```

Of course, this is *not good*. It's clunky and difficult to figure out what is going on. Plus, with complex JavaScript applications, the element references may no longer be in the DOM by the time you're ready to use them.

# Introducing Aliasing

**Aliasing** was designed to solve async referencing issues and DOM Element re-querying, routing requests and responses, server integration, and automated error handling. Aliasing also gives you a human readable word for a potentially complex series of events. Aliasing is prominently displayed in the Cypress Command Log, making it even easier to understand relationships.

***Aliasing is incredibly powerful but very simple to use:***

* Create an alias with the {% url `.as()` as %} command.
* Reference an alias with the {% url `cy.get()` get %} or {% url `cy.wait()` wait %} command.

Every time you reference an alias, it should be prefixed with `@`. You can think of this character as "a" for alias or you can think of an alias as a pointer (like how variables point to memory).

# Aliasing DOM Elements

One use case for aliasing is referencing a DOM Element:

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

## When alias references no longer exist in the DOM

Cypress automatically decides when it should reference existing elements or re-query for new elements.

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

***Cypress calculates stale alias references.***

```javascript
cy.get('#todos li').first().as('firstTodo')
cy.get('@firstTodo').find('.edit').click()
cy.get('@firstTodo').should('have.class', 'editing')
  .find('input').type('Clean the kitchen')
```

When we reference `@firstTodo`, Cypress checks to see if all of the elements it is referencing are still in the DOM. If they are, it returns those existing elements. If they aren't, Cypress replays the commands leading up to the alias definition.

In our case it would re-issue the commands: `cy.get('#todos li').first()`. Everything just works because the new `<li>` is found.

{% note warning  %}
*Usually*, replaying previous commands will return what you expect, but not always. Cypress' calculations are complicated and we may improve this algorithm at a later time. It is recommended to not alias DOM elements very far down a chain of commands - **alias elements as soon as possible with as few commands as possible**. When in doubt, you can *always* issue a regular {% url `cy.get()` get %} to query for the elements again.
{% endnote %}

# Aliasing Routes

Another use case for aliasing is with routes. Using aliases with {% url `cy.route()` route %} makes dealing with AJAX requests much easier.

![alias-commands](/img/guides/aliasing-routes.jpg)

```javascript
cy.server()
// alias this route as 'postUser'
cy.route('POST', /users/, {id: 123}).as('postUser')
```

Once you've given a route an alias, you can use it later to indicate what you expect to have happen in your application. Imagine your application's code is as follows:

```javascript
$('form').submit(function(){
  var data = $(this).serializeData()

  // simple example of an async
  // request that only goes out
  // after an indeterminate period of time
  setTimeout(function(){
    $.post('/users', {data: data})
  }, 1000)
})
```

You can tell Cypress to wait until it sees a request that matches your aliased route using the {% url `cy.wait()` wait %} command.

```javascript
cy.get('form').submit()
cy.wait('@postUser')
cy.get('.success').contains('User successfully created!')
```

***Telling Cypress to wait for an AJAX request that matches an aliased route has enormous advantages.***

1. Waiting for an explicit route reference is less flaky. Instead of waiting for an arbitrary period of time, waiting for a specific aliased route is much more predictable.
2. Cypress will resolve if there's already been a request that matches the alias.
3. The actual XHR request object will be yielded to you as the next subject.
4. Errors are more obvious. -->

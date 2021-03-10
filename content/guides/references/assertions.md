---
title: Assertions
---

Cypress bundles the popular [Chai](/guides/references/assertions#Chai) assertion library, as well as helpful extensions for [Sinon](/guides/references/assertions#Sinon-Chai) and [jQuery](/guides/references/assertions#Chai-jQuery), bringing you dozens of powerful assertions for free.

<Alert type="info">

<strong class="alert-header">New to Cypress?</strong>

This document is only a reference to every assertion Cypress supports.

If you're looking to understand **how** to use these assertions please read about assertions in our [Introduction to Cypress](/guides/core-concepts/introduction-to-cypress#Assertions guide).

</Alert>

## Chai

<Icon name="github"></Icon> [https://github.com/chaijs/chai](https://github.com/chaijs/chai)

### BDD Assertions

These chainers are available for BDD assertions (`expect`/`should`). Aliases listed can be used interchangeably with their original chainer. You can see the entire list of available BDD Chai assertions [here](http://chaijs.com/api/bdd/).

| Chainer                                                                                                              | Example                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| not                                                                                                                  | `expect(name).to.not.equal('Jane')`                                                                                                   |
| deep                                                                                                                 | `expect(obj).to.deep.equal({ name: 'Jane' })`                                                                                         |
| nested                                                                                                               | `expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]')`<br>`expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'})` |
| ordered                                                                                                              | `expect([1, 2]).to.have.ordered.members([1, 2]).but.not.have.ordered.members([2, 1])`                                                 |
| any                                                                                                                  | `expect(arr).to.have.any.keys('age')`                                                                                                 |
| all                                                                                                                  | `expect(arr).to.have.all.keys('name', 'age')`                                                                                         |
| a(_type_) <br><small class="aliases"><strong>Aliases: </strong>an</small>                                            | `expect('test').to.be.a('string')`                                                                                                    |
| include(_value_) <br><small class="aliases"><strong>Aliases: </strong>contain, includes, contains</small>            | `expect([1,2,3]).to.include(2)`                                                                                                       |
| ok                                                                                                                   | `expect(undefined).to.not.be.ok`                                                                                                      |
| true                                                                                                                 | `expect(true).to.be.true`                                                                                                             |
| false                                                                                                                | `expect(false).to.be.false`                                                                                                           |
| null                                                                                                                 | `expect(null).to.be.null`                                                                                                             |
| undefined                                                                                                            | `expect(undefined).to.be.undefined`                                                                                                   |
| exist                                                                                                                | `expect(myVar).to.exist`                                                                                                              |
| empty                                                                                                                | `expect([]).to.be.empty`                                                                                                              |
| arguments <br><small class="aliases"><strong>Aliases: </strong>Arguments</small>                                     | `expect(arguments).to.be.arguments`                                                                                                   |
| equal(_value_) <br><small class="aliases"><strong>Aliases: </strong>equals, eq</small>                               | `expect(42).to.equal(42)`                                                                                                             |
| deep.equal(_value_)                                                                                                  | `expect({ name: 'Jane' }).to.deep.equal({ name: 'Jane' })`                                                                            |
| eql(_value_) <br><small class="aliases"><strong>Aliases: </strong>eqls</small>                                       | `expect({ name: 'Jane' }).to.eql({ name: 'Jane' })`                                                                                   |
| greaterThan(_value_) <br><small class="aliases"><strong>Aliases: </strong>gt, above</small>                          | `expect(10).to.be.greaterThan(5)`                                                                                                     |
| least(_value_)<br><small class="aliases"><strong>Aliases: </strong>gte</small>                                       | `expect(10).to.be.at.least(10)`                                                                                                       |
| lessThan(_value_) <br><small class="aliases"><strong>Aliases: </strong>lt, below</small>                             | `expect(5).to.be.lessThan(10)`                                                                                                        |
| most(_value_) <br><small class="aliases"><strong>Aliases: </strong>lte</small>                                       | `expect('test').to.have.length.of.at.most(4)`                                                                                         |
| within(_start_, _finish_)                                                                                            | `expect(7).to.be.within(5,10)`                                                                                                        |
| instanceOf(_constructor_) <br><small class="aliases"><strong>Aliases: </strong>instanceof</small>                    | `expect([1, 2, 3]).to.be.instanceOf(Array)`                                                                                           |
| property(_name_, _[value]_)                                                                                          | `expect(obj).to.have.property('name')`                                                                                                |
| deep.property(_name_, _[value]_)                                                                                     | `expect(deepObj).to.have.deep.property('tests[1]', 'e2e')`                                                                            |
| ownProperty(_name_) <br><small class="aliases"><strong>Aliases: </strong>haveOwnProperty, own.property</small>       | `expect('test').to.have.ownProperty('length')`                                                                                        |
| ownPropertyDescriptor(_name_) <br><small class="aliases"><strong>Aliases: </strong>haveOwnPropertyDescriptor</small> | `expect({a: 1}).to.have.ownPropertyDescriptor('a')`                                                                                   |
| lengthOf(_value_)                                                                                                    | `expect('test').to.have.lengthOf(3)`                                                                                                  |
| match(_RegExp_) <br><small class="aliases"><strong>Aliases: </strong>matches</small>                                 | `expect('testing').to.match(/^test/)`                                                                                                 |
| string(_string_)                                                                                                     | `expect('testing').to.have.string('test')`                                                                                            |
| keys(_key1_, _[key2]_, _[...]_) <br><small class="aliases"><strong>Aliases: </strong>key</small>                     | `expect({ pass: 1, fail: 2 }).to.have.keys('pass', 'fail')`                                                                           |
| throw(_constructor_) <br><small class="aliases"><strong>Aliases: </strong>throws, Throw</small>                      | `expect(fn).to.throw(Error)`                                                                                                          |
| respondTo(_method_) <br><small class="aliases"><strong>Aliases: </strong>respondsTo</small>                          | `expect(obj).to.respondTo('getName')`                                                                                                 |
| itself                                                                                                               | `expect(Foo).itself.to.respondTo('bar')`                                                                                              |
| satisfy(_method_) <br><small class="aliases"><strong>Aliases: </strong>satisfies</small>                             | `expect(1).to.satisfy((num) => { return num > 0 })`                                                                                   |
| closeTo(_expected_, _delta_) <br><small class="aliases"><strong>Aliases: </strong>approximately</small>              | `expect(1.5).to.be.closeTo(1, 0.5)`                                                                                                   |
| members(_set_)                                                                                                       | `expect([1, 2, 3]).to.include.members([3, 2])`                                                                                        |
| oneOf(_values_)                                                                                                      | `expect(2).to.be.oneOf([1,2,3])`                                                                                                      |
| change(_function_) <br><small class="aliases"><strong>Aliases: </strong>changes</small>                              | `expect(fn).to.change(obj, 'val')`                                                                                                    |
| increase(_function_) <br><small class="aliases"><strong>Aliases: </strong>increases</small>                          | `expect(fn).to.increase(obj, 'val')`                                                                                                  |
| decrease(_function_) <br><small class="aliases"><strong>Aliases: </strong>decreases</small>                          | `expect(fn).to.decrease(obj, 'val')`                                                                                                  |

These getters are also available for BDD assertions. They don't actually do anything, but they enable you to write clear, english sentences.

| Chainable getters                                                                           |
| ------------------------------------------------------------------------------------------- |
| `to`, `be`, `been`, `is`, `that`, `which`, `and`, `has`, `have`, `with`, `at`, `of`, `same` |

### TDD Assertions

These assertions are available for TDD assertions (`assert`). You can see the entire list of available Chai assertions [here](http://chaijs.com/api/assert/).

| Assertion                                                   | Example                                                |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| .isOk(_object_, _[message]_)                                | `assert.isOk('everything', 'everything is ok')`        |
| .isNotOk(_object_, _[message]_)                             | `assert.isNotOk(false, 'this will pass')`              |
| .equal(_actual_, _expected_, _[message]_)                   | `assert.equal(3, 3, 'vals equal')`                     |
| .notEqual(_actual_, _expected_, _[message]_)                | `assert.notEqual(3, 4, 'vals not equal')`              |
| .strictEqual(_actual_, _expected_, _[message]_)             | `assert.strictEqual(true, true, 'bools strict eq')`    |
| .notStrictEqual(_actual_, _expected_, _[message]_)          | `assert.notStrictEqual(5, '5', 'not strict eq')`       |
| .deepEqual(_actual_, _expected_, _[message]_)               | `assert.deepEqual({ id: '1' }, { id: '1' })`           |
| .notDeepEqual(_actual_, _expected_, _[message]_)            | `assert.notDeepEqual({ id: '1' }, { id: '2' })`        |
| .isAbove(_valueToCheck_, _valueToBeAbove_, _[message]_)     | `assert.isAbove(6, 1, '6 greater than 1')`             |
| .isAtLeast(_valueToCheck_, _valueToBeAtLeast_, _[message]_) | `assert.isAtLeast(5, 2, '5 gt or eq to 2')`            |
| .isBelow(_valueToCheck_, _valueToBeBelow_, _[message]_)     | `assert.isBelow(3, 6, '3 strict lt 6')`                |
| .isAtMost(_valueToCheck_, _valueToBeAtMost_, _[message]_)   | `assert.isAtMost(4, 4, '4 lt or eq to 4')`             |
| .isTrue(_value_, _[message]_)                               | `assert.isTrue(true, 'this val is true')`              |
| .isNotTrue(_value_, _[message]_)                            | `assert.isNotTrue('tests are no fun', 'val not true')` |
| .isFalse(_value_, _[message]_)                              | `assert.isFalse(false, 'val is false')`                |
| .isNotFalse(_value_, _[message]_)                           | `assert.isNotFalse('tests are fun', 'val not false')`  |
| .isNull(_value_, _[message]_)                               | `assert.isNull(err, 'there was no error')`             |
| .isNotNull(_value_, _[message]_)                            | `assert.isNotNull('hello', 'is not null')`             |
| .isNaN(_value_, _[message]_)                                | `assert.isNaN(NaN, 'NaN is NaN')`                      |
| .isNotNaN(_value_, _[message]_)                             | `assert.isNotNaN(5, '5 is not NaN')`                   |
| .exists(_value_, _[message]_)                               | `assert.exists(5, '5 is not null or undefined')`       |
| .notExists(_value_, _[message]_)                            | `assert.notExists(null, 'val is null or undefined')`   |
| .isUndefined(_value_, _[message]_)                          | `assert.isUndefined(undefined, 'val is undefined')`    |
| .isDefined(_value_, _[message]_)                            | `assert.isDefined('hello', 'val has been defined')`    |
| .isFunction(_value_, _[message]_)                           | `assert.isFunction(x => x * x, 'val is func')`         |
| .isNotFunction(_value_, _[message]_)                        | `assert.isNotFunction(5, 'val not funct')`             |
| .isObject(_value_, _[message]_)                             | `assert.isObject({num: 5}, 'val is object')`           |
| .isNotObject(_value_, _[message]_)                          | `assert.isNotObject(3, 'val not object')`              |
| .isArray(_value_, _[message]_)                              | `assert.isArray(['unit', 'e2e'], 'val is array')`      |
| .isNotArray(_value_, _[message]_)                           | `assert.isNotArray('e2e', 'val not array')`            |
| .isString(_value_, _[message]_)                             | `assert.isString('e2e', 'val is string')`              |
| .isNotString(_value_, _[message]_)                          | `assert.isNotString(2, 'val not string')`              |
| .isNumber(_value_, _[message]_)                             | `assert.isNumber(2, 'val is number')`                  |
| .isNotNumber(_value_, _[message]_)                          | `assert.isNotNumber('e2e', 'val not number')`          |
| .isFinite(_value_, _[message]_)                             | `assert.isFinite('e2e', 'val is finite')`              |
| .isBoolean(_value_, _[message]_)                            | `assert.isBoolean(true, 'val is bool')`                |
| .isNotBoolean(_value_, _[message]_)                         | `assert.isNotBoolean('true', 'val not bool')`          |
| .typeOf(_value_, _name_, _[message]_)                       | `assert.typeOf('e2e', 'string', 'val is string')`      |
| .notTypeOf(_value_, _name_, _[message]_)                    | `assert.notTypeOf('e2e', 'number', 'val not number')`  |

## Chai-jQuery

<Icon name="github"></Icon> [https://github.com/chaijs/chai-jquery](https://github.com/chaijs/chai-jquery)

These chainers are available when asserting about a DOM object.

You will commonly use these chainers after using DOM commands like: [`cy.get()`](/api/commands/get), [`cy.contains()`](/api/commands/contains), etc.

<!-- textlint-disable -->

| Chainers                | Assertion                                                            |
| ----------------------- | -------------------------------------------------------------------- |
| attr(_name_, _[value]_) | `expect($el).to.have.attr('foo', 'bar')`                             |
| prop(_name_, _[value]_) | `expect($el).to.have.prop('disabled', false)`                        |
| css(_name_, _[value]_)  | `expect($el).to.have.css('background-color', 'rgb(0, 0, 0)')`        |
| data(_name_, _[value]_) | `expect($el).to.have.data('foo', 'bar')`                             |
| class(_className_)      | `expect($el).to.have.class('foo')`                                   |
| id(_id_)                | `expect($el).to.have.id('foo')`                                      |
| html(_html_)            | `expect($el).to.have.html('I love testing')`                         |
| text(_text_)            | `expect($el).to.have.text('I love testing')`                         |
| value(_value_)          | `expect($el).to.have.value('test@dev.com')`                          |
| visible                 | `expect($el).to.be.visible`                                          |
| hidden                  | `expect($el).to.be.hidden`                                           |
| selected                | `expect($option).not.to.be.selected`                                 |
| checked                 | `expect($input).not.to.be.checked`                                   |
| focus[ed]               | `expect($input).not.to.be.focused`<br>`expect($input).to.have.focus` |
| enabled                 | `expect($input).to.be.enabled`                                       |
| disabled                | `expect($input).to.be.disabled`                                      |
| empty                   | `expect($el).not.to.be.empty`                                        |
| exist                   | `expect($nonexistent).not.to.exist`                                  |
| match(_selector_)       | `expect($emptyEl).to.match(':empty')`                                |
| contain(_text_)         | `expect($el).to.contain('text')`                                     |
| descendants(_selector_) | `expect($el).to.have.descendants('div')`                             |

<!-- textlint-enable -->

## Sinon-Chai

<Icon name="github"></Icon> [https://github.com/domenic/sinon-chai](https://github.com/domenic/sinon-chai)

These chainers are used on assertions with [`cy.stub()`](/api/commands/stub) and [`cy.spy()`](/api/commands/spy).

| Sinon.JS property/method | Assertion                                                               |
| ------------------------ | ----------------------------------------------------------------------- |
| called                   | `expect(spy).to.be.called`                                              |
| callCount                | `expect(spy).to.have.callCount(n)`                                      |
| calledOnce               | `expect(spy).to.be.calledOnce`                                          |
| calledTwice              | `expect(spy).to.be.calledTwice`                                         |
| calledThrice             | `expect(spy).to.be.calledThrice`                                        |
| calledBefore             | `expect(spy1).to.be.calledBefore(spy2)`                                 |
| calledAfter              | `expect(spy1).to.be.calledAfter(spy2)`                                  |
| calledWithNew            | `expect(spy).to.be.calledWithNew`                                       |
| alwaysCalledWithNew      | `expect(spy).to.always.be.calledWithNew`                                |
| calledOn                 | `expect(spy).to.be.calledOn(context)`                                   |
| alwaysCalledOn           | `expect(spy).to.always.be.calledOn(context)`                            |
| calledWith               | `expect(spy).to.be.calledWith(...args)`                                 |
| alwaysCalledWith         | `expect(spy).to.always.be.calledWith(...args)`                          |
| calledWithExactly        | `expect(spy).to.be.calledWithExactly(...args)`                          |
| alwaysCalledWithExactly  | `expect(spy).to.always.be.calledWithExactly(...args)`                   |
| calledWithMatch          | `expect(spy).to.be.calledWithMatch(...args)`                            |
| alwaysCalledWithMatch    | `expect(spy).to.always.be.calledWithMatch(...args)`                     |
| returned                 | `expect(spy).to.have.returned(returnVal)`                               |
| alwaysReturned           | `expect(spy).to.have.always.returned(returnVal)`                        |
| threw                    | `expect(spy).to.have.thrown(errorObjOrErrorTypeStringOrNothing)`        |
| alwaysThrew              | `expect(spy).to.have.always.thrown(errorObjOrErrorTypeStringOrNothing)` |

## Adding New Assertions

Because we are using `chai`, that means you can extend it however you'd like. Cypress will "just work" with new assertions added to `chai`. You can:

- Write your own `chai` assertions as [documented here](http://chaijs.com/api/plugins/).
- npm install any existing `chai` library and import into your test file or support file.

<Alert type="info">

[Check out our example recipe extending chai with new assertions.](/examples/examples/recipes#Fundamentals)

</Alert>

## Common Assertions

Here is a list of common element assertions. Notice how we use these assertions (listed above) with [`.should()`](/api/commands/should). You may also want to read about how Cypress [retries](/guides/core-concepts/retry-ability) assertions.

### Length

```javascript
// retry until we find 3 matching <li.selected>
cy.get('li.selected').should('have.length', 3)
```

### Class

```javascript
// retry until this input does not have class disabled
cy.get('form').find('input').should('not.have.class', 'disabled')
```

### Value

```javascript
// retry until this textarea has the correct value
cy.get('textarea').should('have.value', 'foo bar baz')
```

### Text Content

```javascript
// retry until this span does not contain 'click me'
cy.get('a').parent('span.help').should('not.contain', 'click me')
```

### Visibility

```javascript
// retry until this button is visible
cy.get('button').should('be.visible')
```

### Existence

```javascript
// retry until loading spinner no longer exists
cy.get('#loading').should('not.exist')
```

### State

```javascript
// retry until our radio is checked
cy.get(':radio').should('be.checked')
```

### CSS

```javascript
// retry until .completed has matching css
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')
```

```javascript
// retry while .accordion css has the "display: none" property
cy.get('#accordion').should('not.have.css', 'display', 'none')
```

## Negative assertions

There are positive and negative assertions. Examples of positive assertions are:

```javascript
cy.get('.todo-item').should('have.length', 2).and('have.class', 'completed')
```

The negative assertions have the "not" chainer prefixed to the assertion. Examples of negative assertions are:

```javascript
cy.contains('first todo').should('not.have.class', 'completed')
cy.get('#loading').should('not.be.visible')
```

#### ⚠️ False passing tests

Negative assertions may pass for reasons you weren't expecting. Let's say we want to test that a Todo list app adds a new Todo item after typing the Todo and pressing enter.

**Positive assertions**

When adding an element to the list and using a **positive assertion**, the test asserts a specific number of Todo items in our application.

The test below may still falsely pass if the application behaves unexpectedly, like adding a blank Todo, instead of adding the new Todo with the text "Write tests".

```javascript
cy.get('li.todo').should('have.length', 2)
cy.get('input#new-todo').type('Write tests{enter}')

// using a positive assertion to check the exact number of items
cy.get('li.todo').should('have.length', 3)
```

**Negative assertions**

But when using a **negative assertion** in the test below, the test can falsely pass when the application behaves in multiple unexpected ways:

- The app deletes the entire list of Todo items instead of inserting the 3rd Todo
- The app deletes a Todo instead of adding a new Todo
- The app adds a blank Todo
- An infinite variety of possible application mistakes

```javascript
cy.get('li.todo').should('have.length', 2)
cy.get('input#new-todo').type('Write tests{enter}')

// using negative assertion to check it's not a number of items
cy.get('li.todo').should('not.have.length', 2)
```

**Recommendation**

We recommend using negative assertions to verify that a specific condition is no longer present after the application performs an action. For example, when a previously completed item is unchecked, we might verify that a CSS class is removed.

```javascript
// at first the item is marked completed
cy.contains('li.todo', 'Write tests')
  .should('have.class', 'completed')
  .find('.toggle')
  .click()

// the CSS class has been removed
cy.contains('li.todo', 'Write tests').should('not.have.class', 'completed')
```

For more examples, please read the blog post [Be Careful With Negative Assertions](https://glebbahmutov.com/blog/negative-assertions/).

## Should callback

If built-in assertions are not enough, you can write your own assertion function and pass it as a callback to the `.should()` command. Cypress will automatically [retry](/guides/core-concepts/retry-ability) the callback function until it passes or the command times out. See the [`.should()`](/api/commands/should#Function) documentation.

```html
<div class="main-abc123 heading-xyz987">Introduction</div>
```

```javascript
cy.get('div').should(($div) => {
  expect($div).to.have.length(1)

  const className = $div[0].className

  // className will be a string like "main-abc123 heading-xyz987"
  expect(className).to.match(/heading-/)
})
```

## Multiple assertions

You can attach multiple assertions to the same command.

```html
<a class="assertions-link active" href="https://on.cypress.io" target="_blank"
  >Cypress Docs</a
>
```

```js
cy.get('.assertions-link')
  .should('have.class', 'active')
  .and('have.attr', 'href')
  .and('include', 'cypress.io')
```

Note that all chained assertions will use the same reference to the original subject. For example, if you wanted to test a loading element that first appears and then disappears, the following WILL NOT WORK because the same element cannot be visible and invisible at the same time:

```js
// ⛔️ DOES NOT WORK
cy.get('#loading').should('be.visible').and('not.be.visible')
```

Instead you should split the assertions and re-query the element:

```js
// ✅ THE CORRECT WAY
cy.get('#loading').should('be.visible')
cy.get('#loading').should('not.be.visible')
```

## See also

- [Guide: Introduction to Cypress](/guides/core-concepts/introduction-to-cypress#Assertions)
- [cypress-example-kitchensink Assertions](https://example.cypress.io/commands/assertions)
- [Cypress should callback](https://glebbahmutov.com/blog/cypress-should-callback/) blog post

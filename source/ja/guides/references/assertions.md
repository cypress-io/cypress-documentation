---
title: アサーション
---

Cypress bundles the popular {% url 'Chai' assertions#Chai %} assertion library, as well as helpful extensions for {% url 'Sinon' assertions#Sinon-Chai %} and {% url 'jQuery' assertions#Chai-jQuery %}, bringing you dozens of powerful assertions for free.

{% note info "New to Cypress?" %}
This document is only a reference to every assertion Cypress supports.

If you're looking to understand **how** to use these assertions please read about assertions in our {% url "Introduction to Cypress" introduction-to-cypress#Assertions guide %}.
{% endnote %}

# Chai

{% fa fa-github %} {% url https://github.com/chaijs/chai %}

## BDD Assertions

These chainers are available for BDD assertions (`expect`/`should`). Aliases listed can be used interchangeably with their original chainer. You can see the entire list of available BDD Chai assertions {% url "here" http://chaijs.com/api/bdd/ %}.

| Chainer | Example |
| --- | --- |
| not | `expect(name).to.not.equal('Jane')` |
| deep | `expect(obj).to.deep.equal({ name: 'Jane' })` |
| nested | `expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]')`<br>`expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'})` |
| ordered | `expect([1, 2]).to.have.ordered.members([1, 2]).but.not.have.ordered.members([2, 1])`
| any | `expect(arr).to.have.any.keys('name', 'age')` |
| all | `expect(arr).to.have.all.keys('name', 'age')` |
| a(*type*) {% aliases an %}| `expect('test').to.be.a('string')` |
| include(*value*) {% aliases contain includes contains %} | `expect([1,2,3]).to.include(2)` |
| ok | `expect(undefined).to.not.be.ok` |
| true | `expect(true).to.be.true` |
| false | `expect(false).to.be.false` |
| null | `expect(null).to.be.null` |
| undefined | `expect(undefined).to.be.undefined` |
| exist | `expect(myVar).to.exist` |
| empty | `expect([]).to.be.empty` |
| arguments {% aliases Arguments %}| `expect(arguments).to.be.arguments` |
| equal(*value*) {% aliases equals eq %} | `expect(42).to.equal(42)` |
| deep.equal(*value*) | `expect({ name: 'Jane' }).to.deep.equal({ name: 'Jane' })` |
| eql(*value*) {% aliases eqls %}  | `expect({ name: 'Jane' }).to.eql({ name: 'Jane' })` |
| greaterThan(*value*) {% aliases gt above %} | `expect(10).to.be.greaterThan(5)` |
| least(*value*){% aliases gte %} | `expect(10).to.be.at.least(10)` |
| lessThan(*value*) {% aliases lt below %} | `expect(5).to.be.lessThan(10)` |
| most(*value*) {% aliases lte %}| `expect('test').to.have.length.of.at.most(4)` |
| within(*start*, *finish*) | `expect(7).to.be.within(5,10)` |
| instanceOf(*constructor*) {% aliases instanceof %} | `expect([1, 2, 3]).to.be.instanceOf(Array)` |
| property(*name*, *[value]*) | `expect(obj).to.have.property('name')` |
| deep.property(*name*, *[value]*) | `expect(deepObj).to.have.deep.property('tests[1]', 'e2e')` |
| ownProperty(*name*) {% aliases haveOwnProperty own.property %} | `expect('test').to.have.ownProperty('length')` |
| ownPropertyDescriptor(*name*) {% aliases haveOwnPropertyDescriptor %} | `expect({a: 1}).to.have.ownPropertyDescriptor('a')` |
| lengthOf(*value*) | `expect('test').to.have.lengthOf(3)` |
| match(*RegExp*) {% aliases matches %} | `expect('testing').to.match(/^test/)` |
| string(*string*) | `expect('testing').to.have.string('test')` |
| key(*key1*, *[key2]*, *[...]*) {% aliases keys %} | `expect({ pass: 1, fail: 2 }).to.have.key('pass')` |
| throw(*constructor*) {% aliases throws Throw %} | `expect(fn).to.throw(Error)` |
| respondTo(*method*) {% aliases respondsTo %} | `expect(obj).to.respondTo('getName')` |
| itself | `expect(Foo).itself.to.respondTo('bar')` |
| satisfy(*method*) {% aliases satisfies %} | `expect(1).to.satisfy((num) => { return num > 0 })` |
| closeTo(*expected*, *delta*) {% aliases approximately %} | `expect(1.5).to.be.closeTo(1, 0.5)` |
| members(*set*) | `expect([1, 2, 3]).to.include.members([3, 2])` |
| oneOf(*values*)  | `expect(2).to.be.oneOf([1,2,3])` |
| change(*function*) {% aliases changes %} | `expect(fn).to.change(obj, 'val')` |
| increase(*function*) {% aliases increases %} | `expect(fn).to.increase(obj, 'val')` |
| decrease(*function*) {% aliases decreases %} | `expect(fn).to.decrease(obj, 'val')` |

These getters are also available for BDD assertions. They don't actually do anything, but they enable you to write simple, english sentences.

| Chainable getters |
| --- |
| `to`, `be`, `been`, `is`, `that`, `which`, `and`, `has`, `have`, `with`, `at`, `of`, `same` |

## TDD Assertions

These assertions are available for TDD assertions (`assert`). You can see the entire list of available Chai assertions {% url "here" http://chaijs.com/api/assert/ %}.

| Assertion | Example |
| --- | --- |
| .isOk(*object*, *[message]*) | `assert.isOk('everything', 'everything is ok')` |
| .isNotOk(*object*, *[message]*) | `assert.isNotOk(false, 'this will pass')` |
| .equal(*actual*, *expected*, *[message]*) | `assert.equal(3, 3, 'vals equal')` |
| .notEqual(*actual*, *expected*, *[message]*) | `assert.notEqual(3, 4, 'vals not equal')` |
| .strictEqual(*actual*, *expected*, *[message]*) | `assert.strictEqual(true, true, 'bools strict eq')` |
| .notStrictEqual(*actual*, *expected*, *[message]*) | `assert.notStrictEqual(5, '5', 'not strict eq')` |
| .deepEqual(*actual*, *expected*, *[message]*) | `assert.deepEqual({ id: '1' }, { id: '1' })` |
| .notDeepEqual(*actual*, *expected*, *[message]*) | `assert.notDeepEqual({ id: '1' }, { id: '2' })` |
| .isAbove(*valueToCheck*, *valueToBeAbove*, *[message]*) | `assert.isAbove(6, 1, '6 greater than 1')` |
| .isAtLeast(*valueToCheck*, *valueToBeAtLeast*, *[message]*) | `assert.isAtLeast(5, 2, '5 gt or eq to 2')` |
| .isBelow(*valueToCheck*, *valueToBeBelow*, *[message]*) | `assert.isBelow(3, 6, '3 strict lt 6')` |
| .isAtMost(*valueToCheck*, *valueToBeAtMost*, *[message]*) | `assert.isAtMost(4, 4, '4 lt or eq to 4')` |
| .isTrue(*value*, *[message]*) | `assert.isTrue(true, 'this val is true')` |
| .isNotTrue(*value*, *[message]*) | `assert.isNotTrue('tests are no fun', 'val not true')` |
| .isFalse(*value*, *[message]*) | `assert.isFalse(false, 'val is false')` |
| .isNotFalse(*value*, *[message]*) | `assert.isNotFalse('tests are fun', 'val not false')` |
| .isNull(*value*, *[message]*) | `assert.isNull(err, 'there was no error')` |
| .isNotNull(*value*, *[message]*) | `assert.isNotNull('hello', 'is not null')` |
| .isNaN(*value*, *[message]*) | `assert.isNaN(NaN, 'NaN is NaN')` |
| .isNotNaN(*value*, *[message]*) | `assert.isNotNaN(5, '5 is not NaN')` |
| .exists(*value*, *[message]*) | `assert.exists(5, '5 is not null or undefined')` |
| .notExists(*value*, *[message]*) | `assert.notExists(null, 'val is null or undefined')` |
| .isUndefined(*value*, *[message]*) | `assert.isUndefined(undefined, 'val is undefined')` |
| .isDefined(*value*, *[message]*) | `assert.isDefined('hello', 'val has been defined')` |
| .isFunction(*value*, *[message]*) | `assert.isFunction(x => x * x, 'val is func')` |
| .isNotFunction(*value*, *[message]*) | `assert.isNotFunction(5, 'val not funct')` |
| .isObject(*value*, *[message]*) | `assert.isObject({num: 5}, 'val is object')` |
| .isNotObject(*value*, *[message]*) | `assert.isNotObject(3, 'val not object')` |
| .isArray(*value*, *[message]*) | `assert.isArray(['unit', 'e2e'], 'val is array')` |
| .isNotArray(*value*, *[message]*) | `assert.isNotArray('e2e', 'val not array')` |
| .isString(*value*, *[message]*) | `assert.isString('e2e', 'val is string')` |
| .isNotString(*value*, *[message]*) | `assert.isNotString(2, 'val not string')` |
| .isNumber(*value*, *[message]*) | `assert.isNumber(2, 'val is number')` |
| .isNotNumber(*value*, *[message]*) | `assert.isNotNumber('e2e', 'val not number')` |
| .isFinite(*value*, *[message]*) | `assert.isFinite('e2e', 'val is finite')` |
| .isBoolean(*value*, *[message]*) | `assert.isBoolean(true, 'val is bool')` |
| .isNotBoolean(*value*, *[message]*) | `assert.isNotBoolean('true', 'val not bool')` |
| .typeOf(*value*, *name*, *[message]*) | `assert.typeOf('e2e', 'string', 'val is string')` |
| .notTypeOf(*value*, *name*, *[message]*) | `assert.notTypeOf('e2e', 'number', 'val not number')` |

# Chai-jQuery

{% fa fa-github %} {% url https://github.com/chaijs/chai-jquery %}

These chainers are available when asserting about a DOM object.

You will commonly use these chainers after using DOM commands like: {% url `cy.get()` get %}, {% url `cy.contains()` contains %}, etc.

<!-- textlint-disable -->
| Chainers | Assertion |
| --- | --- |
| attr(*name*, *[value]*) | `expect($el).to.have.attr('foo', 'bar')` |
| prop(*name*, *[value]*) | `expect($el).to.have.prop('disabled', false)` |
| css(*name*, *[value]*) | `expect($el).to.have.css('background-color', 'rgb(0, 0, 0)')` |
| data(*name*, *[value]*) | `expect($el).to.have.data('foo', 'bar')` |
| class(*className*) | `expect($el).to.have.class('foo')` |
| id(*id*) | `expect($el).to.have.id('foo')` |
| html(*html*)  | `expect($el).to.have.html('I love testing')` |
| text(*text*) | `expect($el).to.have.text('I love testing')` |
| value(*value*) | `expect($el).to.have.value('test@dev.com')` |
| visible | `expect($el).to.be.visible` |
| hidden | `expect($el).to.be.hidden` |
| selected | `expect($option).not.to.be.selected` |
| checked | `expect($input).not.to.be.checked` |
| enabled | `expect($input).to.be.enabled` |
| disabled | `expect($input).to.be.disabled` |
| empty | `expect($el).not.to.be.empty` |
| exist | `expect($nonexistent).not.to.exist` |
| match(*selector*) | `expect($emptyEl).to.match(':empty')` |
| contain(*text*) | `expect($el).to.contain('text')` |
| descendants(*selector*) | `expect($el).to.have.descendants('div')` |
<!-- textlint-enable -->

# Sinon-Chai

{% fa fa-github %} {% url https://github.com/domenic/sinon-chai %}

These chainers are used on assertions with {% url `cy.stub()` stub %} and {% url `cy.spy()` spy %}.

| Sinon.JS property/method | Assertion |
| -- | -- |
| called |  `expect(spy).to.be.called` |
| callCount | `expect(spy).to.have.callCount(n)` |
| calledOnce |  `expect(spy).to.be.calledOnce` |
| calledTwice | `expect(spy).to.be.calledTwice` |
| calledThrice |  `expect(spy).to.be.calledThrice` |
| calledBefore |  `expect(spy1).to.be.calledBefore(spy2)` |
| calledAfter | `expect(spy1).to.be.calledAfter(spy2)` |
| calledWithNew | `expect(spy).to.be.calledWithNew` |
| alwaysCalledWithNew | `expect(spy).to.always.be.calledWithNew` |
| calledOn |  `expect(spy).to.be.calledOn(context)` |
| alwaysCalledOn |  `expect(spy).to.always.be.calledOn(context)` |
| calledWith |  `expect(spy).to.be.calledWith(...args)` |
| alwaysCalledWith |  `expect(spy).to.always.be.calledWith(...args)` |
| calledWithExactly | `expect(spy).to.be.calledWithExactly(...args)` |
| alwaysCalledWithExactly | `expect(spy).to.always.be.calledWithExactly(...args)` |
| calledWithMatch | `expect(spy).to.be.calledWithMatch(...args)` |
| alwaysCalledWithMatch | `expect(spy).to.always.be.calledWithMatch(...args)` |
| returned |  `expect(spy).to.have.returned(returnVal)` |
| alwaysReturned |  `expect(spy).to.have.always.returned(returnVal)` |
| threw | `expect(spy).to.have.thrown(errorObjOrErrorTypeStringOrNothing)` |
| alwaysThrew | `expect(spy).to.have.always.thrown(errorObjOrErrorTypeStringOrNothing)` |

# Adding New Assertions

Because we are using `chai`, that means you can extend it however you'd like. Cypress will "just work" with new assertions added to `chai`. You can:

- Write your own `chai` assertions as {% url 'documented here' http://chaijs.com/api/plugins/ %}.
- npm install any existing `chai` library and import into your test file or support file.

{% note info %}
{% url 'Check out our example recipe extending chai with new assertions.' recipes#Fundamentals %}
{% endnote %}

# Common Assertions

Here is a list of common element assertions. Notice how we use these assertions (listed above) with {% url `.should()` should %}. You may also want to read about how Cypress {% url "retries" retry-ability %} assertions.

## Length

```javascript
// retry until we find 3 matching <li.selected>
cy.get('li.selected').should('have.length', 3)
```

## Class

```javascript
// retry until this input does not have class disabled
cy.get('form').find('input').should('not.have.class', 'disabled')
```

## Value

```javascript
// retry until this textarea has the correct value
cy.get('textarea').should('have.value', 'foo bar baz')
```

## Text Content

```javascript
// retry until this span does not contain 'click me'
cy.get('a').parent('span.help').should('not.contain', 'click me')
```

## Visibility

```javascript
// retry until this button is visible
cy.get('button').should('be.visible')
```

## Existence

```javascript
// retry until loading spinner no longer exists
cy.get('#loading').should('not.exist')
```

## State

```javascript
// retry until our radio is checked
cy.get(':radio').should('be.checked')
```

## CSS

```javascript
// retry until .completed has matching css
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')
```

```javascript
// retry until .accordion css have display: none
cy.get('#accordion').should('not.have.css', 'display', 'none')
```

# Should callback

If built-in assertions are not enough, you can easily write your own assertion function and pass it as a callback to the `.should()` command. Cypress will automatically {% url "retry" retry-ability %} the callback function until it passes or the command times out. See the {% url `.should()` should#Function %} documentation.

```html
<div class="main-abc123 heading-xyz987">Introduction</div>
```

```javascript
cy.get('div')
  .should(($div) => {
    expect($div).to.have.length(1)

    const className = $div[0].className

    // className will be a string like "main-abc123 heading-xyz987"
    expect(className).to.match(/heading-/)
  })
```

# See also

- {% url 'Guide: Introduction to Cypress' introduction-to-cypress#Assertions %}
- {% url 'cypress-example-kitchensink Assertions' https://example.cypress.io/commands/assertions %}
- {% url 'Cypress should callback' https://glebbahmutov.com/blog/cypress-should-callback/ %} blog post

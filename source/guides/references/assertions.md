---
title: Assertions
comments: false
---

Cypress bundles the popular {% url 'Chai' assertions#Chai %} assertion library, as well as helpful extensions for {% url 'Sinon' assertions#Sinon-Chai %} and {% url 'jQuery' assertions#Chai-jQuery %}, bringing you dozens of powerful assertions for free.

# Chai

{% fa fa-github %} {% url http://chaijs.com/ %}

## BDD Assertions

These chainers are available for BDD assertions (`expect`/`should`).

| Chainer | Example |
| --- | --- |
| not | `expect(name).to.not.equal('Jane')` |
| deep | `expect(obj).to.deep.equal({ name: 'Jane' })` |
| any | `expect(arr).to.have.any.keys('name', 'age')` |
| all | `expect(arr).to.have.all.keys('name', 'age')` |
| a( *type* ) | `expect('test').to.be.a('string')` |
| an( *type* ) | `expect(undefined).to.be.an('undefined')` |
| include( *value* )  | `expect([1,2,3]).to.include(2)` |
| contain( *value* )  | `expect('testing').to.contain('test')` |
| includes( *value* )  | `expect([1,2,3]).includes(2)` |
| contains( *value* ) | `expect('testing').contains('test')` |
| ok | `expect(undefined).to.not.be.ok` |
| true | `expect(true).to.be.true` |
| false | `expect(false).to.be.false` |
| null | `expect(null).to.be.null` |
| undefined | `expect(undefined).to.be.undefined` |
| exist | `expect(myVar).to.exist` |
| empty | `expect([]).to.be.empty` |
| arguments | `expect(arguments).to.be.arguments` |
| equal( *value* )  | `expect(42).to.equal(42)` |
| equals( *value* )  | `expect(42).equals(42)` |
| eq( *value* )  | `expect(42).to.eq(42)` |
| deep.equal( *value* ) | `expect({ name: 'Jane' }).to.deep.equal({ name: 'Jane' })` |
| eql( *value* )  | `expect({ name: 'Jane' }).to.eql({ name: 'Jane' })` |
| eqls( *value* )  | `expect([ 1, 2, 3 ]).eqls([ 1, 2, 3 ])` |
| above( *value* )  | `expect(10).to.be.above(5)` |
| gt( *value* )  | `expect(10).to.be.gt(5)` |
| greaterThan( *value* ) | `expect(10).to.be.greaterThan(5)` |
| least( *value* ) | `expect(10).to.be.at.least(10)` |
| gte( *value* ) | `expect(10).to.be.gte(10)` |
| below( *value* ) | `expect('foo').to.have.length.below(4)` |
| lt( *value* )  | `expect(3).to.be.ls(4)` |
| lessThan( *value* ) | `expect(5).to.be.lessThan(10)` |
| most( *value* ) | `expect('test').to.have.length.of.at.most(4)` |
| lte( *value* ) | `expect(5).to.be.lte(5)` |
| within( *start*, *finish* ) | `expect(7).to.be.within(5,10)` |
| instanceof( *constructor* )| `expect([1, 2, 3]).to.be.instanceof(Array)` |
| instanceOf( *constructor* ) | `expect([1, 2, 3]).to.be.instanceOf(Array)` |
| property( *name*, *[value]* ) | `expect(obj).to.have.property('name')` |
| deep.property( *name*, *[value]* ) | `expect(deepObj).to.have.deep.property('tests[1]', 'e2e')` |
| ownProperty( *name* )  | `expect('test').to.have.ownProperty('length')` |
| haveOwnProperty( *name* ) | `expect('test').to.haveOwnProperty('length')` |
| length( *value* )  | `expect('test').to.have.length.above(2)` |
| lengthOf( *value* ) | `expect('test').to.have.lengthOf(3)` |
| match( *regexp* ) | `expect('testing').to.match(/^test/)` |
| string( *string* ) | `expect('testing').to.have.string('test')` |
| keys( *key1*, *[key2]*, *[...]* ) | `expect({ pass: 1, fail: 2 }).to.have.key('pass')` |
| key( *key1*, *[key2]*, *[...]* ) | `expect({ pass: 1, fail: 2 }).to.have.any.keys('pass')` |
| throw( *constructor* ) | `expect(fn).to.throw(Error)` |
| throws( *constructor* ) | `expect(fn).throws(ReferenceError, /bad function/)` |
| respondTo( *method* ) | `expect(obj).to.respondTo('getName')` |
| itself | `expect(Foo).itself.to.respondTo('bar')` |
| satisfy( *method* ) | `expect(1).to.satisfy(function(num) { return num > 0; })` |
| closeTo( *expected*, *delta*) | `expect(1.5).to.be.closeTo(1, 0.5)` |
| members( *set* ) | `expect([1, 2, 3]).to.include.members([3, 2])` |
| change( *function* )  | `expect(fn).to.change(obj, 'val')` |
| changes( *function* ) | `expect(fn).changes(obj, 'val')` |
| increase( *function* )  | `expect(fn).to.increase(obj, 'val')` |
| increases( *function* ) | `expect(fn).increases(obj, 'val')` |
| decrease( *function* )  | `expect(fn).to.decrease(obj, 'val')` |
| decreases( *function* ) | `expect(fn).decreases(obj, 'val')` |

These getters are also available for BDD assertions. They don't actually do anything, but they enable you to write simple, english sentences.

| Chainable getters |
| --- |
| `to`, `be`, `been`, `is`, `that`, `which`, `and`, `has`, `have`, `with`, `at`, `of`, `same` |

## TDD Assertions

These assertions are available for TDD assertions (`assert`). You can see the entire list of available assertions {% url "here" http://chaijs.com/api/assert/ %}

| Assertion | Example |
| --- | --- |
| .isOk(*object*, *[message]*) | `assert.isOk('everything', 'everything is ok')` |
| .isNotOk(*object*, *[message]*) | `assert.isNotOk(false, 'this will pass')` |
| .equal(*actual*, *expected*, *[message]*) | `assert.equal(3, 3, 'values equal')` |
| .notEqual(*actual*, *expected*, *[message]*) | `assert.notEqual(3, 4, 'values not equal')` |
| .strictEqual(*actual*, *expected*, *[message]*) | `assert.strictEqual(true, true, 'bools strictly equal')` |
| .notStrictEqual(*actual*, *expected*, *[message]*) | `assert.notStrictEqual(5, '5', 'not strictly equal')` |
| .deepEqual(*actual*, *expected*, *[message]*) | `assert.deepEqual({ name: 'Jane' }, { name: 'Jane' })` |
| .notDeepEqual(*actual*, *expected*, *[message]*) | `assert.notDeepEqual({ name: 'Jane' }, { name: 'June' })` |
| .isAbove(*valueToCheck*, *valueToBeAbove*, *[message]*) | `assert.isAbove(6, 1, '6 is greater than 1')` |
| .isAtLeast(*valueToCheck*, *valueToBeAtLeast*, *[message]*) | `assert.isAtLeast(5, 2, '5 is gt or eq to 2')` |
| .isAtLeast(*valueToCheck*, *valueToBeAtLeast*, *[message]*) | `assert.isAtLeast(5, 2, '5 is gt or eq to 2')` |
| .isBelow(*valueToCheck*, *valueToBeBelow*, *[message]*) | `assert.isBelow(3, 6, '3 is strictly less than 6')` |
| .isAtMost(*valueToCheck*, *valueToBeAtMost*, *[message]*) | `assert.isAtMost(4, 4, '4 is lt or eq to 4')` |
| .isTrue(*value*, *[message]*) | `assert.isTrue(true, 'this val is true')` |
| .isNotTrue(*value*, *[message]*) | `assert.isNotTrue('tests are no fun', 'this val is not true')` |
| .isFalse(*value*, *[message]*) | `assert.isFalse(false, 'this val is false')` |
| .isNotFalse(*value*, *[message]*) | `assert.isNotFalse('tests are fun', 'this val is not false')` |
| .isNull(*value*, *[message]*) | `assert.isNull(err, 'there was no error')` |
| .isNotNull(*value*, *[message]*) | `assert.isNotNull('hello', 'is not null')` |
| .isNaN(*value*, *[message]*) | `assert.isNaN(NaN, 'NaN is NaN')` |
| .isNotNaN(*value*, *[message]*) | `assert.isNotNaN(5, '5 is not NaN')` |
| .exists(*value*, *[message]*) | `assert.exists(5, '5 is not null or undefined')` |
| .notExists(*value*, *[message]*) | `assert.notExists(null, 'value is null or undefined')` |
| .isUndefined(*value*, *[message]*) | `assert.isUndefined(undefined, 'value is undefined')` |
| .isDefined(*value*, *[message]*) | `assert.isDefined('hello', 'value has been defined')` |
| .isFunction(*value*, *[message]*) | `assert.isFunction(function test() { return 'pass'; }, 'value is function')` |
| .isNotFunction(*value*, *[message]*) | `assert.isNotFunction(5, 'value is not a function')` |
| .isObject(*value*, *[message]*) | `assert.isObject({num: 5}, 'value is object')` |
| .isNotObject(*value*, *[message]*) | `assert.isNotObject(3, 'value is not object')` |
| .isArray(*value*, *[message]*) | `assert.isArray(['unit', 'e2e'], 'value is array')` |
| .isNotArray(*value*, *[message]*) | `assert.isNotArray('e2e', 'value is not array')` |
| .isString(*value*, *[message]*) | `assert.isString('e2e', 'value is string')` |
| .isNotString(*value*, *[message]*) | `assert.isNotString(2, 'value is not string')` |
| .isNumber(*value*, *[message]*) | `assert.isNumber(2, 'value is number')` |
| .isNotNumber(*value*, *[message]*) | `assert.isNotNumber('e2e', 'value is not number')` |
| .isFinite(*value*, *[message]*) | `assert.isFinite('e2e', 'value is finite')` |
| .isBoolean(*value*, *[message]*) | `assert.isBoolean(true, 'value is boolean')` |
| .isNotBoolean(*value*, *[message]*) | `assert.isNotBoolean('true', 'value is not boolean')` |
| .typeOf(*value*, *name*, *[message]*) | `assert.typeOf('e2e', 'string', 'value is string')` |
| .notTypeOf(*value*, *name*, *[message]*) | `assert.notTypeOf('e2e', 'number', 'value is not number')` |

# Chai-jQuery

{% fa fa-github %} {% url https://github.com/chaijs/chai-jquery %}

These chainers are available when asserting about a DOM object.

You will commonly use these chainers after using DOM commands like: {% url `cy.get()` get %}, {% url `cy.contains()` contains %}, etc.

| Chainers | Assertion |
| --- | --- |
| attr( *name*, *[value]*) | `expect($el).to.have.attr('foo', 'bar')` |
| prop( *name*, *[value]*) | `expect($el).to.have.prop('disabled', false)` |
| css( *name*, *[value]*) | `expect($el).to.have.css('background-color', 'rgb(0, 0, 0)')` |
| data( *name*, *[value]*) | `expect($el).to.have.data('foo', 'bar')` |
| class( *className* ) | `expect($el).to.have.class('foo')` |
| id( *id* ) | `expect($el).to.have.id('foo')` |
| html( *html*)  | `expect($el).to.have.html('I love testing')` |
| text( *text* ) | `expect($el).to.have.text('I love testing')` |
| value( *value* ) | `expect($el).to.have.value('test@dev.com')` |
| visible | `expect($el).to.be.visible` |
| hidden | `expect($el).to.be.hidden` |
| selected | `expect($option).not.to.be.selected` |
| checked | `expect($input).not.to.be.checked` |
| enabled | `expect($input).to.be.enabled` |
| disabled | `expect($input).not.to.be.disabled` |
| empty | `expect($el).not.to.be.empty` |
| exist | `expect($nonexistent).not.to.exist` |
| match( *selector* ) | `expect($emptyEl).to.match(':empty')` |
| contain( *text* ) | `expect($el).to.contain('text')` |
| descendents( *selector* ) | `expect($el).to.have.descendants('div')` |

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

Because we are using `chai`, that means you can extend it however you'd like. Cypress will automatically "just work" with new assertions added to `chai`. You can simply:

- Write your own `chai` assertions as {% url 'documented here' http://chaijs.com/api/plugins/ %}.
- ...or NPM install any existing `chai` library and import into your test file or support file.

{% note info %}
{% url 'Check out our example recipe extending chai with new assertions.' extending-cypress-recipe %}
{% endnote %}

# Common Assertions

Here is a list of common element assertions.

Notice how we use these assertions (listed above) with {% url `.should()` should %}.

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

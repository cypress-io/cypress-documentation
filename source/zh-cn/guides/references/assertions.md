---
title: 断言
---

Cypress绑定着流行的{% url 'Chai' assertions#Chai %}断言库，以及一些有帮助的{% url 'Sinon' assertions#Sinon-Chai %} 和 {% url 'jQuery' assertions#Chai-jQuery %}，为你带来免费的强大断言。

{% note info "新Cypress？" %}
本文档仅引用Cypress支持的所有断言。

如果您想了解如何使用这些断言，请阅读我们的{% url "Cypress简介" introduction-to-cypress#Assertions guide %}断言部分。
{% endnote %}

# Chai

{% fa fa-github %} {% url https://github.com/chaijs/chai %}

## BDD断言

These chainers are available for BDD assertions (`expect`/`should`). Aliases listed can be used interchangeably with their original chainer。您可以在{% url "这里" http://chaijs.com/api/bdd/ %}看到可用的BDD，Chai断言的完整列表。 

| Chainer | 例子 |
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
| match(*regexp*) {% aliases matches %} | `expect('testing').to.match(/^test/)` |
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

这些getter也可用于BDD断言。实际上他们什么都不做，但他们能让你写出简单的判断。

| Chainable getters |
| --- |
| `to`, `be`, `been`, `is`, `that`, `which`, `and`, `has`, `have`, `with`, `at`, `of`, `same` |

## TDD断言

这些断言可用于TDD断言（assert）。您可以在{% url "这里" http://chaijs.com/api/assert/ %}看到完整的可用chai断言列表。

| 断言 | 例子 |
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

这些断言在声明DOM对象时可用。

你在使用像{% url `cy.get()` get %}, {% url `cy.contains()` contains %}，etc等这些DOM命令后通常会使用这些chainers

| Chainers | 断言 |
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

# Sinon-Chai

{% fa fa-github %} {% url https://github.com/domenic/sinon-chai %}

这些chainers用于断言{% url `cy.stub()` stub %}和{% url `cy.spy()` spy %}.

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

# 添加新断言

因为我们使用的是`chai`，这意味着你可以扩展它。Cypress将“工作”与新的断言添加到`chai`。你可以：

- 在{% url '这里记录' http://chaijs.com/api/plugins/ %}你自己的`chai`断言。
- npm install任何现有的`chai`库并导入到测试文件或支持文件中。

{% note info %}
{% url '点击查看我们的示例，使用新断言扩展chai。' recipes#Adding-Chai-Assertions %}
{% endnote %}

# 常用断言

下面是常见元素断言的列表。注意我们如何将这些断言（上面列出）与{% url `.should()` should %}一起使用。您可能还想了解Cypress如何{% url "重试" retry-ability %}断言。

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

# Should callback

如果内置断言不够，你可以轻松地编写自己的断言函数，并将其作为回调传递给`.should()`命令。Cypress将自动{% url "retry" retry-ability %}回调函数，直到它通过或命令超时。请查看{% url `.should()` should#Function %}文档。

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

# 请参阅

- {% url 'Guide: Introduction to Cypress' introduction-to-cypress#Assertions %}
- {% url 'cypress-example-kitchensink Assertions' https://example.cypress.io/commands/assertions %}
- {% url 'Cypress should callback' https://glebbahmutov.com/blog/cypress-should-callback/ %} blog post

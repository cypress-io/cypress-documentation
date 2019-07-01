---
title: 捆绑的工具
---

{% note info %}
Cypress依赖于许多同类最佳的开源测试库，从一开始就为平台提供稳定性和熟悉感。如果你一直在使用JavaScript进行测试，那么你将在此列表中识别出许多老朋友。了解我们如何利用它们并使其与Cypress通力配合的！
{% endnote %}

# Mocha

{% fa fa-github %} {% url http://mochajs.org/ %}

Cypress采用了Mocha的`bdd`语法，因为它完美地适应了集成和单元测试。你将要编写的所有测试都依赖于Mocha提供的基本功能，即：

* {% url '`describe()`' http://mochajs.org/#bdd %}
* {% url '`context()`' http://mochajs.org/#bdd %}
* {% url '`it()`' http://mochajs.org/#bdd %}
* {% url '`before()`' http://mochajs.org/#hooks %}
* {% url '`beforeEach()`' http://mochajs.org/#hooks %}
* {% url '`afterEach()`' http://mochajs.org/#hooks %}
* {% url '`after()`' http://mochajs.org/#hooks %}
* {% url '`.only()`' http://mochajs.org/#exclusive-tests %}
* {% url '`.skip()`' http://mochajs.org/#exclusive-tests %}

另外，Mocha提供了优秀的{% url '`async` 支持' http://mochajs.org/#asynchronous-code %}。Cypress扩展了Mocha，打磨了其粗糙的边缘，奇怪的边缘情况，bugs和错误消息。这些修复都是完全透明和简单易懂的。

{% note info %}
{% url "请参阅编写和组织测试指南" writing-and-organizing-tests %}
{% endnote %}

# Chai

{% fa fa-github %} {% url http://chaijs.com/ %}

Mocha提供了我们组织用例的框架，Chai则提供了可以轻易书写断言的能力。Chai给了我们带有优秀错误信息的可读性强的断言。Cypress扩展了它，修复了一些常见陷阱，使用{% url 'subjects' introduction-to-cypress#Assertions %}和{% url `.should()` should %}指令封装了它的DSL。

> {% fa fa-chevron-right  %} {% url "可用的Chai断言列表" assertions#Chai %}

# Chai-jQuery

{% fa fa-github %} {% url https://github.com/chaijs/chai-jquery %}

编写集成测试时，你可能会在DOM进行大量的工作。Cypress引入了Chai-jQuery，它使用特定的jQuery chainer方法自动扩展Chai。

> {% fa fa-chevron-right  %} {% url "可用的Chai-jQuery断言列表" assertions#Chai-jQuery %}

# Sinon.JS

{% fa fa-github %} {% url http://sinonjs.org/ %}


在编写单元测试时，甚至在类似集成的测试中，你经常需要能够stub和spy的方法。Cypress包括两个方法，{% url `cy.stub()` stub %} and {% url `cy.spy()` spy %}分别返回Sinon stubs和spies。

{% note info %}
{% url "参阅我们关于spies，stubs和clocks的使用指南" stubs-spies-and-clocks %}
{% endnote %}

# Sinon-Chai

{% fa fa-github %} {% url https://github.com/cypress-io/sinon-chai %}

当使用`stubs`或`spies`时，你可能经常要用它们来写Chai断言。Cypress捆绑了Sinon-Chai，它扩展了Chai，允许你编写关于`stubs` and `spies`的{% url '断言' https://github.com/cypress-io/sinon-chai %}。

> {% fa fa-chevron-right  %} {% url "可用的Sinon-Chai断言列表" assertions#Sinon-Chai %}

# 其他基本库

Cypress也在`Cypress`对象上绑定了下列工具，可以用在测试的任何地方：

- {% url `Cypress._` _ %} (lodash)
- {% url `Cypress.$` $ %} (jQuery)
- {% url `Cypress.minimatch` minimatch %} (minimatch.js)
- {% url `Cypress.moment` moment %} (moment.js)
- {% url `Cypress.Blob` blob %} (Blob utils)
- {% url `Cypress.Promise` promise %} (Bluebird)

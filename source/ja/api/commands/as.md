---
title: as

---

Assign an alias for later use. Reference the alias later within a {% url `cy.get()` get %} or {% url `cy.wait()` wait %} command with a `@` prefix.

{% note info %}
**Note:** `.as()` assumes you are already familiar with core concepts such as {% url 'aliases' variables-and-aliases %}
{% endnote %}

# シンタックス

```javascript
.as(aliasName)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.main-nav').find('li').first().as('firstNav') // Alias first 'li' as @firstNav
cy.route('PUT', 'users', 'fx:user').as('putUser')     // Alias 'route' as @putUser   
cy.stub(api, 'onUnauth').as('unauth')                 // Alias 'stub' as @unauth   
cy.spy(win, 'fetch').as('winFetch')                   // Alias 'spy' as @winFetch  
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.as('foo')   // Errors, cannot be chained off 'cy'
```

## 引数

**{% fa fa-angle-right %} aliasName** ***(String)***

The name of the alias to be referenced later within a {% url `cy.get()` get %} or {% url `cy.wait()` wait %} command using a `@` prefix.

## 実行結果 {% helper_icon yields %}

{% yields same_subject .as %}

# 例

## DOM Element

```javascript
cy.route('PUT', /^\/users\/\d+/, 'fixture:user').as('userPut')
cy.get('form').submit()
cy.wait('@userPut')
  .its('url').should('contain', 'users')
```

## Route

```javascript
cy.route('PUT', 'users', 'fx:user').as('userPut')
cy.get('form').submit()
cy.wait('@userPut')
  .its('url').should('contain', 'users')
```

# ノート

## Reserved Words

***Alias names cannot match some reserved words.***

Some strings are not allowed as alias names since they are reserved words in Cypress. These words include: `test`, `runnable`, `timeout`, `slow`, `skip`, and `inspect`.

# ルール

## 条件 {% helper_icon requirements %}

{% requirements child .as %}

## アサーション {% helper_icon assertions %}

{% assertions utility .as %}

## タイムアウト {% helper_icon timeout %}

{% timeouts none .as %}

# コマンドログ

***Alias several routes***

```javascript
cy.route(/company/, 'fixture:company').as('companyGet')
cy.route(/roles/, 'fixture:roles').as('rolesGet')
cy.route(/teams/, 'fixture:teams').as('teamsGet')
cy.route(/users\/\d+/, 'fixture:user').as('userGet')
cy.route('PUT', /^\/users\/\d+/, 'fixture:user').as('userPut')
```

Aliases of routes display in the routes instrument panel:

![Command log for route](/img/api/as/routes-table-in-command-log.png)

# こちらも参考にしてください

- {% url `cy.get()` get %}
- {% url `cy.wait()` wait %}
- {% url 'Guides: Aliases' variables-and-aliases %}

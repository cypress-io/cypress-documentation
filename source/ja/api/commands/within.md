---
title: within

---
Scopes all subsequent cy commands to within this element. Useful when working within a particular group of elements such as a `<form>`.

# シンタックス

```javascript
.within(callbackFn)
.within(options, callbackFn)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.list').within(($list) => {}) // Yield the `.list` and scope all commands within it
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.within(() => {})              // Errors, cannot be chained off 'cy'
cy.getCookies().within(() => {}) // Errors, 'getCookies' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} callbackFn** ***(Function)***

Pass a function that takes the current yielded subject as its first argument.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.within()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}

## 実行結果 {% helper_icon yields %}

{% yields same_subject .within %}

# 例

## Forms

***Get inputs within a form and submit the form***

```html
<form>
  <input name="email" type="email">
  <input name="password" type="password">
  <button type="submit">Login</button>
</form>
```

```javascript
cy.get('form').within(($form) => {
  // cy.get() will only search for elements within form,
  // not within the entire document
  cy.get('input[name="email"]').type('john.doe@email.com')
  cy.get('input[name="password"]').type('password')
  cy.root().submit()
})
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements child .within %}

## アサーション {% helper_icon assertions %}

{% assertions once .within %}

## タイムアウト {% helper_icon timeout %}

{% timeouts none .within %}

# コマンドログ

***Get the input within the form***

```javascript
cy.get('.query-form').within((el) => {
  cy.get('input:first')
})
```

The commands above will display in the command log as:

![Command Log](/img/api/within/go-within-other-dom-elements.png)

When clicking on the `within` command within the command log, the console outputs the following:

![Console Log](/img/api/within/within-shows-its-yield-in-console-log.png)

# こちらも参考にしてください

- {% url `.root()` root %}

---
title: clear

---

Clear the value of an `input` or `textarea`.

{% note info %}
An alias for {% url `.type('{selectall}{backspace}')` type %}
{% endnote %}

# シンタックス

```javascript
.clear()
.clear(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('[type="text"]').clear()        // Clear text input
cy.get('textarea').type('Hi!').clear() // Clear textarea
cy.focused().clear()                   // Clear focused input/textarea
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.clear()                // Errors, cannot be chained off 'cy'
cy.get('nav').clear()     // Errors, 'get' doesn't yield input or textarea
cy.url().clear()          // Errors, 'url' doesn't yield DOM element
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.clear()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`force` | `false` | {% usage_options force clear %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .clear %}

## 実行結果 {% helper_icon yields %}

{% yields same_subject .clear %}

# 例

## 引数なしの場合

**Clear the input and type a new value.**

```javascript
cy.get('textarea').clear().type('Hello, World')
```

# ノート

## 操作ができる状態

***The element must first reach actionability***

`.clear()` is an "action command" that follows all the rules {% url 'defined here' interacting-with-elements %}.

## Documentation

`.clear()` is just an alias for {% url `.type({selectall}{backspace})` type %}.

Please read the {% url `.type()` type %} documentation for more details.

# ルール

## 条件 {% helper_icon requirements %}

{% requirements clearability .clear %}

## アサーション {% helper_icon assertions %}

{% assertions actions .clear %}

## タイムアウト {% helper_icon timeout %}

{% timeouts actions .clear %}

# コマンドログ

**Clear the input and type a new value**

```javascript
cy.get('input[name="name"]').clear().type('Jane Lane')
```

The commands above will display in the command log as:

![Command log for clear](/img/api/clear/clear-input-in-cypress.png)

When clicking on `clear` within the command log, the console outputs the following:

![console.log for clear](/img/api/clear/one-input-cleared-in-tests.png)

# こちらも参考にしてください

- {% url `.blur()` blur %}
- {% url `.focus()` focus %}
- {% url `.type()` type %}

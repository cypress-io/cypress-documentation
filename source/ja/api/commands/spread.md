---
title: spread

---

Expand an array into multiple arguments.

{% note info %}
Identical to {% url `.then()` then %}, but always expects an array-like structure as its subject.
{% endnote %}

# シンタックス

```javascript
.spread(callbackFn)
.spread(options, callbackFn)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.getCookies().spread(() => {}) // Yield all cookies
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.spread(() => {}) // Errors, cannot be chained off 'cy'
cy.location().spread()   // Errors, 'location' does not yield an array
```

## 引数

**{% fa fa-angle-right %} fn** ***(Function)***

Pass a function that expands the array into its arguments.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.spread()`.

Option | Default | Description
--- | --- | ---
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .spread %}

## 実行結果 {% helper_icon yields %}

{% yields maybe_changes_subject .spread 'yields the return value of your callback function' %}

# 例

## Aliased Routes

***Expand the array of aliased routes***

```javascript
cy.server()
cy.route('/users/').as('getUsers')
cy.route('/activities/').as('getActivities')
cy.route('/comments/').as('getComments')
cy.wait(['@getUsers', '@getActivities', '@getComments'])
  .spread((getUsers, getActivities, getComments) => {
    // each XHR is now an individual argument
  })
```

## Cookies

***Expand the array of cookies***

```javascript
cy.getCookies().spread((cookie1, cookie2, cookie3) => {
  // each cookie is now an individual argument
})
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements spread .spread %}

## アサーション {% helper_icon assertions %}

{% assertions once .spread %}

## タイムアウト {% helper_icon timeout %}

{% timeouts promises .spread %}

# コマンドログ

`.spread()` does *not* log in the command log

# こちらも参考にしてください

- {% url `.each()` each %}
- {% url `.then()` then %}

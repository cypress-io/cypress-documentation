---
title: submit

---

Submit a form.

{% note warning %}
This element must be an `<form>`.
{% endnote %}

# シンタックス

```javascript
.submit()
.submit(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('form').submit()   // Submit a form
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.submit()               // Errors, cannot be chained off 'cy'
cy.get('input').submit()  // Errors, 'input' does not yield a form
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.submit()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .submit %}

## 実行結果 {% helper_icon yields %}

{% yields same_subject .submit %}

# 例

## 引数なしの場合

***Submit can only be called on a single form.***

```html
<form id="contact">
  <input type="text" name="message">
  <button type="submit">Send</button>
</form>
```

```javascript
cy.get('#contact').submit()
```

# ノート

## 操作ができる状態

***Submit is not an action command***

`.submit()` is not implemented like other action commands, and does not follow the same rules of {% url 'waiting for actionability' interacting-with-elements %}.

`.submit()` is just a helpful command which is a simple shortcut. Normally a user has to perform a different "action" to submit a form. It could be clicking a submit `<button>`, or pressing `enter` on a keyboard.

Oftentimes it's much simpler and conveys what you're trying to test by just using `.submit()` directly.

If you want the other guarantees of waiting for an element to become actionable, you should use a different command like {% url `.click()` click %} or {% url `.type()` type %}.

# ルール

## 条件 {% helper_icon requirements %}

{% requirements submitability .submit %}

## アサーション {% helper_icon assertions %}

{% assertions wait .submit %}

## タイムアウト {% helper_icon timeout %}

{% timeouts assertions .submit %}

# コマンドログ

***Submit a form***

```javascript
cy.route('POST', '/users', 'fixture:user').as('userSuccess')
cy.get('form').submit()
```

The commands above will display in the command log as:

![Command Log](/img/api/submit/form-submit-shows-in-command-log-of-cypress.png)

When clicking on `submit` within the command log, the console outputs the following:

![cy.submit console log](/img/api/submit/console-shows-what-form-was-submitted.png)

# こちらも参考にしてください

- {% url `.click()` click %}
- {% url `.type()` type %}

---
title: focus

---

Focus on a DOM element.

# シンタックス

```javascript
.focus()
.focus(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('input').first().focus() // Focus on the first input
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.focus('#search')  // Errors, cannot be chained off 'cy'
cy.window().focus()  // Errors, 'window' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.focus()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .focus %}

## 実行結果 {% helper_icon yields %}

{% yields same_subject .focus %}

# 例

## 引数なしの場合

***Focus on an input***

```javascript
cy.get('[type="input"]').focus()
```

***Focus, type, and blur a textarea***

```javascript
// yields the <textarea> for further chaining
cy.get('textarea').focus().type('Nice Product!').blur()
```

# ノート

## 操作ができる状態

***Focus is not an action command***

`.focus()` is not implemented like other action commands, and does not follow the same rules of {% url 'waiting for actionability' interacting-with-elements %}.

`.focus()` is just a helpful command which is a simple shortcut. Normally there's no way for a user to simply "focus" an element without causing another action or side effect. Typically the user would have to click or tab to this element.

Oftentimes its much simpler and conveys what you're trying to test by just using `.focus()` directly.

If you want the other guarantees of waiting for an element to become actionable, you should use a different command like {% url `.click()` click %}.

## Blur Events

***Cypress blurs other focused elements first***

If there is currently a different DOM element with focus, Cypress issues a `blur` event to that element before running the `.focus()` command.

## Focusable

***Can only be called on a valid focusable element.***

Ensure the element you are trying to call `.focus()` on is a {% url 'focusable element' https://www.w3.org/TR/html5/editing.html#focusable %}.

## タイムアウト

***Can time out because your browser did not receive any focus events.***

If you see this error, you may want to ensure that the main browser window is currently focused. This means not being focused in debugger or any other window when the command is run.

Internally Cypress does account for this, and will polyfill the blur events when necessary to replicate what the browser does. Unfortunately the browser will still behave differently when not in focus - for instance it may throttle async events. Your best bet here is to keep Cypress focused when working on a test.

# ルール

## 条件 {% helper_icon requirements %}

{% requirements focusability .focus %}

## アサーション {% helper_icon assertions %}

{% assertions wait .focus %}

## タイムアウト {% helper_icon timeout %}

{% timeouts assertions .focus %}

# コマンドログ

***Focus the textarea***

```javascript
cy.get('[name="comment"]').focus()
```

The commands above will display in the command log as:

![Command Log focus](/img/api/focus/get-input-then-focus.png)

When clicking on the `focus` command within the command log, the console outputs the following:

![console.log focus](/img/api/focus/console-log-textarea-that-was-focused-on.png)

# こちらも参考にしてください

- {% url `.blur()` blur %}
- {% url `.click()` click %}
- {% url `cy.focused()` focused %}
- {% url `.type()` type %}

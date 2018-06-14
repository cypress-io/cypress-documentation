---
title: focused

---

Get the DOM element that is currently focused.

# シンタックス

```javascript
cy.focused()
cy.focused(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.focused()    // Yields the element currently in focus
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `cy.focused()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.focused %}

## 実行結果 {% helper_icon yields %}

{% yields sets_dom_subject cy.focused %}

# 例

## 引数なしの場合

***Get the element that is focused***

```javascript
cy.focused().then(($el) => {
  // do something with $el
})
```

***Blur the element with focus***

```javascript
cy.focused().blur()
```

***Make an assertion on the focused element***

```javascript
cy.focused().should('have.attr', 'name', 'username')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom cy.focused %}

## アサーション {% helper_icon assertions %}

{% assertions existence cy.focused %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence cy.focused %}

# コマンドログ

***Make an assertion on the focused element***

```javascript
cy.focused().should('have.attr', 'name').and('eq', 'num')
```

The commands above will display in the command log as:

![Command Log focused](/img/api/focused/make-assertion-about-focused-element.png)

When clicking on the `focused` command within the command log, the console outputs the following:

![console focused](/img/api/focused/currently-focused-element-in-an-input.png)

# こちらも参考にしてください

- {% url `.blur()` blur %}
- {% url `.focus()` focus %}

---
title: dblclick

---

Double-click a DOM element.

# シンタックス

```javascript
.dblclick()
.dblclick(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('button').dblclick()          // Double click on button
cy.focused().dblclick()              // Double click on el with focus
cy.contains('Welcome').dblclick()    // Double click on first el containing 'Welcome'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.dblclick('button')          // Errors, cannot be chained off 'cy'
cy.window().dblclick()         // Errors, 'window' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.dblclick()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .dblclick %}

## 実行結果 {% helper_icon yields %}

{% yields same_subject .dblclick %}

# 例

## 引数なしの場合

***Double click an anchor link***

```javascript
cy.get('a#nav1').dblclick() // yields the <a>
```

# ノート

## 操作ができる状態

***The element must first reach actionability***

`.dblclick()` is an "action command" that follows all the rules {% url 'defined here' interacting-with-elements %}.

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .dblclick %}

## アサーション {% helper_icon assertions %}

{% assertions actions .dblclick %}

## タイムアウト {% helper_icon timeout %}

{% timeouts actions .dblclick %}

# コマンドログ

***Double click on a calendar schedule***

```javascript
cy.get('[data-schedule-id="4529114"]:first').dblclick()
```

The commands above will display in the command log as:

![Command Log dblclick](/img/api/dblclick/double-click-in-testing.png)

When clicking on `dblclick` within the command log, the console outputs the following:

![console.log dblclick](/img/api/dblclick/element-double-clicked-on.png)

# こちらも参考にしてください

- {% url `.click()` click %}

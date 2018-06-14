---
title: parent

---

Get the parent DOM element of a set of DOM elements.

{% note info %}
The querying behavior of this command matches exactly how {% url `.parent()` http://api.jquery.com/parent %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.parent()
.parent(selector)
.parent(options)
.parent(selector, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('header').parent() // Yield parent el of `header`
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.parent()            // Errors, cannot be chained off 'cy'
cy.reload().parent()   // Errors, 'reload' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.parent()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .parent %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .parent %}

# 例

## 引数なしの場合

***Get the parent of the active li***

```javascript
cy.get('li.active').parent()
```

## セレクターを使う場合

***Get the parent with class `nav` of the active li***

```javascript
cy.get('li.active').parent('.nav')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .parent %}

## アサーション {% helper_icon assertions %}

{% assertions existence .parent %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .parent %}

# コマンドログ

***Assert on the parent of the active li***

```javascript
cy.get('li.active').parent().should('have.class', 'nav')
```

The commands above will display in the command log as:

![Command Log parent](/img/api/parent/get-parent-element-just-like-jquery.png)

When clicking on the `parent` command within the command log, the console outputs the following:

![Console Log parent](/img/api/parent/parent-command-found-elements-for-console-log.png)

# こちらも参考にしてください

- {% url `.children()` children %}
- {% url `.parents()` parents %}
- {% url `.parentsUntil()` parentsuntil %}

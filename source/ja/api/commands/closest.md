---
title: closest

---

Get the first DOM element that matches the selector (whether it be itself or one of its ancestors).

{% note info %}
The querying behavior of this command matches exactly how {% url `.closest()` http://api.jquery.com/closest %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.closest(selector)
.closest(selector, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('td').closest('.filled') // Yield closest el with class '.filled'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.closest('.active')  // Errors, cannot be chained off 'cy'
cy.url().closest()     // Errors, 'url' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.closest()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .closest %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .closest %}

# 例

## 引数なしの場合

***Find the closest element of the 'error' with the class 'banner'***

```javascript
cy.get('p.error').closest('.banner')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .closest %}

## アサーション {% helper_icon assertions %}

{% assertions existence .closest %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .closest %}

# コマンドログ

***Find the closest element of 'active li' with the class 'nav'***

```javascript
cy.get('li.active').closest('.nav')
```

The commands above will display in the command log as:

![Command Log closest](/img/api/closest/find-closest-nav-element-in-test.png)

When clicking on the `closest` command within the command log, the console outputs the following:

![console.log closest](/img/api/closest/closest-console-logs-elements-found.png)

# こちらも参考にしてください

- {% url `.first()` first %}
- {% url `.parent()` parent %}
- {% url `.parents()` parents %}
- {% url `.parentsUntil()` parentsuntil %}
- {% url `.prev()` prev %}
- {% url `.prevAll()` prevall %}
- {% url `.prevUntil()` prevuntil %}

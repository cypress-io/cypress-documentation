---
title: last

---

Get the last DOM element within a set of DOM elements.

{% note info %}
The querying behavior of this command matches exactly how {% url `.last()` http://api.jquery.com/last %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.last()
.last(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('nav a').last()     // Yield last link in nav
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.last()                  // Errors, cannot be chained off 'cy'
cy.getCookies().last()     // Errors, 'getCookies' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.last()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .last %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .last %}

# 例

## 引数なしの場合

***Get the last list item in a list.***

```html
<ul>
  <li class="one">Knick knack on my thumb</li>
  <li class="two">Knick knack on my shoe</li>
  <li class="three">Knick knack on my knee</li>
  <li class="four">Knick knack on my door</li>
</ul>
```

```javascript
// yields <li class="four">Knick knack on my door</li>
cy.get('li').last()
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .last %}

## アサーション {% helper_icon assertions %}

{% assertions existence .last %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .last %}

# コマンドログ

***Find the last button in the form***

```javascript
cy.get('form').find('button').last()
```

The commands above will display in the command log as:

![Command Log last](/img/api/last/find-the-last-button-in-a-form.png)

When clicking on `last` within the command log, the console outputs the following:

![Console log last](/img/api/last/inspect-last-element-in-console.png)

# こちらも参考にしてください

- {% url `.eq()` eq %}
- {% url `.first()` first %}

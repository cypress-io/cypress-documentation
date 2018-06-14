---
title: parentsUntil

---

Get all ancestors of each DOM element in a set of matched DOM elements up to, but not including, the element provided.

{% note info %}
The querying behavior of this command matches exactly how {% url `.parentsUntil()` http://api.jquery.com/parentsUntil %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.parentsUntil(selector)
.parentsUntil(selector, filter)
.parentsUntil(selector, filter, options)
.parentsUntil(element)
.parentsUntil(element, filter)
.parentsUntil(element, filter, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('p').parentsUntil('.article') // Yield parents of 'p' until '.article'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.parentsUntil()                  // Errors, cannot be chained off 'cy'
cy.location().parentsUntil('href') // Errors, 'location' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} selector**  ***(String selector)***

The selector where you want finding parent ancestors to stop.

**{% fa fa-angle-right %} element**  ***(DOM node, jQuery Object)***

The element where you want finding parent ancestors to stop.

**{% fa fa-angle-right %} filter**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.parentsUntil()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .parentsUntil %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .parentsUntil %}

# 例

## セレクターを使う場合

***Find all of the `.active` element's ancestors until `.nav`***

```html
<ul class="nav">
  <li>
    <a href="#">Clothes</a>
    <ul class="menu">
      <li>
        <a href="/shirts">Shirts</a>
      </li>
      <li class="active">
        <a href="/pants">Pants</a>
      </li>
    </ul>
  </li>
</ul>
```

```javascript
// yields [ul.menu, li]
cy.get('.active').parentsUntil('.nav')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .parentsUntil %}

## アサーション {% helper_icon assertions %}

{% assertions existence .parentsUntil %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .parentsUntil %}

# コマンドログ

***Find all of the `active` element's ancestors until `.nav`***

```javascript
cy.get('.active').parentsUntil('.nav')
```

The commands above will display in the command log as:

![Command Log parentsUntil](/img/api/parentsuntil/get-all-parents-until-nav-selector.png)

When clicking on `parentsUntil` within the command log, the console outputs the following:

![Console Log parentsUntil](/img/api/parentsuntil/show-parents-until-nav-in-console.png)

# こちらも参考にしてください

- {% url `.parent()` parent %}
- {% url `.parents()` parents %}
- {% url `.prevUntil()` prevuntil %}
- {% url `.nextUntil()` nextuntil %}

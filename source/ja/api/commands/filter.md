---
title: filter

---

Get the DOM elements that match a specific selector.

{% note info %}
Opposite of {% url `.not()` not %}
{% endnote %}

{% note info %}
The querying behavior of this command matches exactly how {% url `.filter()` http://api.jquery.com/filter %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.filter(selector)
.filter(selector, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('td').filter('.users') // Yield all el's with class '.users'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.filter('.animated')  // Errors, cannot be chained off 'cy'
cy.location().filter()  // Errors, 'location' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.filter()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .filter %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .filter %}

# 例

## セレクターを使う場合

***Filter the current subject to the elements with the class 'active'.***

```html
<ul>
  <li>Home</li>
  <li class="active">About</li>
  <li>Services</li>
  <li>Pricing</li>
  <li>Contact</li>
</ul>
```

```javascript
// yields <li>About</li>
cy.get('ul').find('>li').filter('.active')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .filter %}

## アサーション {% helper_icon assertions %}

{% assertions existence .filter %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .filter %}

# コマンドログ

***Filter the li's to the li with the class 'active'.***

```javascript
cy.get('.left-nav>.nav').find('>li').filter('.active')
```

The commands above will display in the command log as:

![Command Log filter](/img/api/filter/filter-el-by-selector.png)

When clicking on the `filter` command within the command log, the console outputs the following:

![console.log filter](/img/api/filter/console-shows-list-and-filtered-element.png)

# こちらも参考にしてください

- {% url `.not()` not %}

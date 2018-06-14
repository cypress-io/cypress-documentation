---
title: find

---

Get the descendent DOM elements of a specific selector.

{% note info %}
The querying behavior of this command matches exactly how {% url `.find()` http://api.jquery.com/find %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.find(selector)
.find(selector, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.article').find('footer') // Yield 'footer' within '.article'
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.find('.progress')          // Errors, cannot be chained off 'cy'
cy.exec('node start').find()  // Errors, 'exec' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching descendent DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.find()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .find %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .find %}

# 例

## セレクターを使う場合

***Get li's within parent***

```html
<ul id="parent">
  <li class="first"></li>
  <li class="second"></li>
</ul>
```

```javascript
// yields [<li class="first"></li>, <li class="second"></li>]
cy.get('#parent').find('li')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .find %}

## アサーション {% helper_icon assertions %}

{% assertions existence .find %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .find %}

# コマンドログ

***Find the li's within the nav***

```javascript
cy.get('.left-nav>.nav').find('>li')
```

The commands above will display in the command log as:

![Command Log find](/img/api/find/find-li-of-uls-in-test.png)

When clicking on the `find` command within the command log, the console outputs the following:

![console.log find](/img/api/find/find-in-console-shows-list-and-yields.png)

# こちらも参考にしてください

- {% url `cy.get()` get %}

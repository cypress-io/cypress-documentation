---
title: children

---

Get the children of each DOM element within a set of DOM elements.

{% note info %}
The querying behavior of this command matches exactly how {% url `.children()` http://api.jquery.com/children %} works in jQuery.
{% endnote %}

# シンタックス

```javascript
.children()
.children(selector)
.children(options)
.children(selector, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('nav').children()     // Yield children of nav
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.children()                // Errors, cannot be chained off 'cy'
cy.location().children()     // Errors, 'location' does not yield DOM element
```

## 引数

**{% fa fa-angle-right %} selector**  ***(String selector)***

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.children()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .children %}

## 実行結果 {% helper_icon yields %}

{% yields changes_dom_subject_or_subjects .children %}

# 例

## 引数なしの場合

***Get the children of the "secondary-nav"***

```html
<ul>
  <li>About</li>
  <li>Services
    <ul class="secondary-nav">
      <li class="services-1">Web Design</li>
      <li class="services-2">Logo Design</li>
      <li class="services-3">
        Print Design
        <ul class="tertiary-nav">
          <li>Signage</li>
          <li>T-Shirt</li>
          <li>Business Cards</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Contact</li>
</ul>
```

```javascript
// yields [
//  <li class="services-1">Web Design</li>,
//  <li class="services-2">Logo Design</li>,
//  <li class="services-3">Print Design</li>
// ]
cy.get('ul.secondary-nav').children()
```

## セレクターを使う場合

***Get the children with class 'active'***

```html
<div>
  <ul>
    <li class="active">Unit Testing</li>
    <li>Integration Testing</li>
  </ul>
</div>
```

```javascript
// yields [
//  <li class="active">Unit Testing</li>
// ]
cy.get('ul').children('.active')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dom .children %}

## アサーション {% helper_icon assertions %}

{% assertions existence .children %}

## タイムアウト {% helper_icon timeout %}

{% timeouts existence .children %}

# コマンドログ

**Assert that there should be 8 children elements in a nav**

```javascript
cy.get('.left-nav>.nav').children().should('have.length', 8)
```

The commands above will display in the command log as:

![Command log for children](/img/api/children/children-elements-shown-in-command-log.png)

When clicking on the `children` command within the command log, the console outputs the following:

![console.log for children](/img/api/children/children-yielded-in-console.png)

# こちらも参考にしてください

- {% url `.next()` next %}
- {% url `.parent()` parent %}
- {% url `.parents()` parents %}
- {% url `.siblings()` siblings %}

---
title: title

---

Get the `document.title` property of the page that is currently active.

# シンタックス

```javascript
cy.title()
cy.title(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.title()    // Yields the documents title as a string
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `cy.title()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.title %}

## 実行結果 {% helper_icon yields %}

{% yields sets_subject cy.title 'yields the `document.title` property of the current page' %}

# 例

## 引数なしの場合

***Assert that the document's title is "My Awesome Application"***

```javascript
cy.title().should('eq', 'My Awesome Application')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements parent cy.title %}

## アサーション {% helper_icon assertions %}

{% assertions retry cy.title %}

## タイムアウト {% helper_icon timeout %}

{% timeouts assertions cy.title %}

# コマンドログ

***Assert that the document's title includes 'New User'***

```javascript
cy.title().should('include', 'New User')
```

The commands above will display in the command log as:

![Command Log](/img/api/title/test-title-of-website-or-webapp.png)

When clicking on `title` within the command log, the console outputs the following:

![Console Log](/img/api/title/see-the-string-yielded-in-the-console.png)

# こちらも参考にしてください

- {% url `cy.document()` document %}

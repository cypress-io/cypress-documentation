---
title: document

---

Get the `window.document` of the page that is currently active.

# シンタックス

```javascript
cy.document()
cy.document(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.document()     // yield the window.document object
```

## 引数

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.document()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.document %}

## 実行結果 {% helper_icon yields %}

{% yields sets_subject cy.document 'yields the `window.document` object' %}

# 例

## 引数なしの場合

***Get document and do some work***

```javascript
cy.document().then((doc) => {
  // work with document element
})
```

***Make an assertion about the document***

```javascript
cy.document().its('contentType').should('eq', 'text/html')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements parent cy.document %}

## アサーション {% helper_icon assertions %}

{% assertions retry cy.document %}

## タイムアウト {% helper_icon timeout %}

{% timeouts assertions cy.document %}

# コマンドログ

***Get the document***

```javascript
cy.document()
```

The command above will display in the command log as:

![Command log document](/img/api/document/get-document-of-application-in-command-log.png)

When clicking on `document` within the command log, the console outputs the following:

![console.log document](/img/api/document/console-yields-the-document-of-aut.png)

# こちらも参考にしてください

- {% url `cy.window()` window %}

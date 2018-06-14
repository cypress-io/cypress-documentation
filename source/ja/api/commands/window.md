---
title: window

---

Get the `window` object of the page that is currently active.

# シンタックス

```javascript
cy.window()
cy.window(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.window()    
```

## 引数

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.window()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.window %}

## 実行結果 {% helper_icon yields %}

{% yields sets_subject cy.window 'yields the `window` object' %}

# 例

## 引数なしの場合

***Yields the remote window object***

```javascript
cy.visit('http://localhost:8080/app')
cy.window().then((win) => {
  // win is the remote window
  // of the page at: http://localhost:8080/app
})
```

## オプション

***Passes timeout through to {% url `.should()` should %} assertion***

```javascript
cy.window({ timeout: 10000 }).should('have.property', 'foo')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements parent cy.window %}

## アサーション {% helper_icon assertions %}

{% assertions retry cy.window %}

## タイムアウト {% helper_icon timeout %}

{% timeouts assertions cy.window %}

# コマンドログ

***Get the window***

```javascript
cy.window()
```

The commands above will display in the command log as:

![Command Log](/img/api/window/window-command-log-for-cypress-tests.png)

When clicking on `window` within the command log, the console outputs the following:

![Console Log](/img/api/window/console-shows-the-applications-window-object-being-tested.png)

# こちらも参考にしてください

- {% url `cy.visit()` visit %}
- {% url `cy.document()` document %}
